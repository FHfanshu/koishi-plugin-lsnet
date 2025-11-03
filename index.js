'use strict'

const fs = require('fs/promises')
const path = require('path')

function loadKoishi() {
  try {
    return require('koishi')
  } catch (err) {
    const candidates = [__dirname, process.cwd()]
    for (const base of candidates) {
      try {
        const resolved = require.resolve('koishi', { paths: [base] })
        return require(resolved)
      } catch {}
    }
    throw err
  }
}

function setupChatlunaIntegration(ctx, config) {
  const chatlunaConfig = config.chatluna
  if (!chatlunaConfig?.enabled) return

  const service = ctx.chatluna
  if (!service) {
    logger.warn('[lsnet] 启用了 ChatLuna Actions 联动，但未检测到 chatluna 服务。')
    return
  }

  let modelSchema
  try {
    ;({ modelSchema } = require('koishi-plugin-chatluna/utils/schema'))
  } catch (error) {
    logger.debug('[lsnet] 无法加载 ChatLuna schema 工具，忽略动态模型提示。', error)
  }

  if (typeof modelSchema === 'function') {
    try {
      modelSchema(ctx)
    } catch (error) {
      logger.warn(`[lsnet] ChatLuna 模型列表初始化失败：${error.message}`)
    }
  }

  const actionName = chatlunaConfig.actionName?.trim() || 'lsnet.identify'
  const actionDescription = chatlunaConfig.actionDescription?.trim() || '识别用户提供的图片并返回最可能的画师。'
  const toolHint = chatlunaConfig.inputPrompt?.trim() || '当需要识别图片画师时调用此工具。'
  const allowedModel = chatlunaConfig.model && chatlunaConfig.model !== '无' ? chatlunaConfig.model : null

  let StructuredTool
  try {
    ;({ StructuredTool } = require('@langchain/core/tools'))
  } catch (error) {
    logger.warn('[lsnet] 缺少 @langchain/core 依赖，无法注册 ChatLuna 工具。请确保已安装 koishi-plugin-chatluna v1.3 以上版本。')
    return
  }

  class LsnetChatlunaTool extends StructuredTool {
    constructor() {
      super()
      this.name = actionName
      this.description = `${actionDescription}\n${toolHint}`.trim()
      this.schema = z.object({
        image: z.string().trim().optional().describe('可选，供识别的图片 URL、Data URI 或 Bot 文件 ID。'),
        note: z.string().trim().optional().describe('可选，对图片的补充说明。'),
      }).describe(toolHint)
    }

    async _call(input = {}, _runManager, runtimeConfig = {}) {
      const session = runtimeConfig?.configurable?.session
      if (!session) {
        return '无法获取会话上下文，已取消识别。'
      }

      if (allowedModel) {
        const currentModel = session?.chatluna?.model || session?.chatluna?.request?.model
        if (currentModel && currentModel !== allowedModel) {
          return `当前会话模型 ${currentModel} 无法调用该工具，请切换到 ${allowedModel}。`
        }
      }

      const virtualImage = createVirtualImageSegment(input.image)

      try {
        const result = await getLsnetInferenceResult(ctx, session, config, virtualImage)
        if (result.status === 'missing-image') {
          return '未能找到可识别的图片，请确保用户上传了图片或在调用工具时提供 image 字段。'
        }
        return result.message
      } catch (error) {
        logger.error(error)
        return `LSNet 识别失败：${error?.message || error}`
      }
    }
  }

  ctx.effect(() => {
    const dispose = service.platform.registerTool(`action_${actionName}`, {
      createTool() {
        return new LsnetChatlunaTool()
      },
      selector() {
        return true
      },
    })

    logger.info(`[lsnet] 已向 ChatLuna 注册工具 action_${actionName}`)

    return () => {
      dispose?.()
      logger.info(`[lsnet] 已从 ChatLuna 注销工具 action_${actionName}`)
    }
  })

  ctx.on('ready', () => {
    if (allowedModel) {
      const modelInfo = service.platform.findModel(allowedModel)?.value
      if (!modelInfo) {
        logger.warn(`[lsnet] ChatLuna 未找到模型 ${allowedModel}，工具将对所有模型开放。`)
      }
    }
  })
}

function createVirtualImageSegment(source) {
  if (!source || typeof source !== 'string') return null
  const value = source.trim()
  if (!value) return null

  const attrs = {}
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:')) {
    attrs.url = value
    attrs.src = value
  } else if (value.startsWith('file://')) {
    attrs.path = value.replace(/^file:\/\//, '')
  } else if (value.startsWith('/') || value.includes('\\')) {
    attrs.path = value
  } else {
    attrs.file = value
  }

  return {
    type: 'image',
    attrs,
  }
}

async function getLsnetInferenceResult(ctx, session, config, providedSegment) {
  const imageSegment = providedSegment || resolveImageSegment(session)
  if (!imageSegment) {
    return { status: 'missing-image' }
  }

  const attrs = imageSegment.attrs || {}
  const base64Image = await fetchImageBase64(ctx, session, attrs)
  const classification = await inferArtist(ctx, config, base64Image)
  const message = composeResultMessage(classification)

  return {
    status: 'ok',
    imageSegment,
    classification,
    message,
  }
}

function resolveImageSegment(session) {
  const isImageType = (type) => type === 'image' || type === 'img'
  const preferImage = (elements = []) => elements.find((el) => el && isImageType(el.type))

  const direct = preferImage(session.elements)
  if (direct) return direct

  if (session.quote) {
    const quoted = preferImage(session.quote.elements)
    if (quoted) return quoted
  }

  if (session.platform === 'onebot') {
    const message = Array.isArray(session.event?.message) ? session.event.message : []
    const segment = message.find((seg) => seg && isImageType(seg.type))
    if (segment?.attrs || segment?.data) {
      return {
        type: 'image',
        attrs: segment.attrs || segment.data,
      }
    }
  }

  return null
}

async function inferArtist(ctx, config, base64Image) {
  const topK = Math.max(config.topK || 0, 3)
  const response = await ctx.http.post(config.endpoint, {
    input_image: base64Image,
    model_name: config.modelName,
    device: config.device,
    top_k: topK,
    threshold: config.threshold,
  }, { timeout: 60_000 })

  const classification = response?.results?.classification || []
  return classification
}

function composeResultMessage(classification = []) {
  if (!classification.length) {
    return '未能识别到画师信息。'
  }

  const topResults = classification
    .filter((item) => item && typeof item.class_name === 'string')
    .slice(0, 3)

  if (!topResults.length) {
    return '未能识别到画师信息。'
  }

  const lines = topResults.map((item, index) => {
    const artist = item.class_name || '未知画师'
    const probability = typeof item.probability === 'number'
      ? `${(item.probability * 100).toFixed(2)}%`
      : '未知'
    return `${index + 1}. ${artist}（置信度 ${probability}）`
  })

  return ['识别结果：', ...lines].join('\n')
}

const { Schema, Logger } = loadKoishi()
const { z } = require('zod')

const name = 'lsnet'

const logger = new Logger(name)

const inject = {
  required: ['http'],
  optional: ['chatluna'],
}

const PENDING_PROMPT_TIMEOUT = 5 * 60 * 1000
const pendingSessions = new Map()

const Config = Schema.object({
  endpoint: Schema.string().description('ComfyUI LSNet API 地址，例如 http://127.0.0.1:7860/lsnet/v1/infer'),
  modelName: Schema.string().default('Kaloscope').description('LSNet 模型目录名称'),
  device: Schema.union(['cuda', 'cpu']).default('cuda'),
  topK: Schema.number().default(5).min(1).max(20),
  threshold: Schema.number().default(0).min(0).max(1),
  trigger: Schema.string().default('lsnet').description('触发指令关键字'),
  lslog: Schema.boolean().default(false).description('启用详细日志输出以便排查问题'),
  middlewareLog: Schema.boolean().default(false).description('输出中间件详细日志（需同时启用详细日志）'),
  chatluna: Schema.object({
    enabled: Schema.boolean().default(false).description('启用 ChatLuna Actions 联动'),
    actionName: Schema.string().default('lsnet.identify').description('注册到 ChatLuna 的 Action 名称'),
    actionDescription: Schema.string().default('识别用户提供的图片并返回最可能的画师。').role('textarea').description('提供给 ChatLuna 的 Action 描述'),
    model: Schema.dynamic('model').default('无').description('允许调用此 Action 的 ChatLuna 模型，选择“无”为不限制'),
    inputPrompt: Schema.string().default('当需要识别图片画师时调用此工具，并提供描述或图片地址。').description('提示 AI 如何调用此工具'),
  }).description('ChatLuna 联动设置'),
})

function apply(ctx, config) {
  logger.info(`[lsnet] 插件开始加载，配置: ${JSON.stringify(config)}`)
  const debugEnabled = Boolean(config.lslog)
  const middlewareDebugEnabled = debugEnabled && Boolean(config.middlewareLog)
  const debugLog = (...args) => {
    if (!debugEnabled) return
    logger.info('[debug]', ...args)
  }
  const middlewareDebugLog = (...args) => {
    if (!middlewareDebugEnabled) return
    logger.info('[debug]', ...args)
  }

  setupChatlunaIntegration(ctx, config)

  const mainCommand = ctx.command('lsnet', 'LSNet 画师反推')
  if (config.trigger !== 'lsnet') {
    mainCommand.alias(config.trigger)
  }

  mainCommand.action(async ({ session }) => {
    logger.info('[lsnet] 主指令触发')

    const key = getSessionKey(session)
    const imageSegment = resolveImageSegment(session)
    debugLog('mainCommand session', {
      key,
      platform: session.platform,
      elements: (session.elements || []).map((el) => el.type),
      hasQuote: Boolean(session.quote),
      eventTypes: Array.isArray(session.event?.message)
        ? session.event.message.map((seg) => seg?.type)
        : undefined,
      hasImage: Boolean(imageSegment),
    })

    if (imageSegment) {
      pendingSessions.delete(key)
      debugLog('mainCommand immediate image, start inference', { key })
      return handleLsnetCommand(ctx, session, config, imageSegment)
    }

    pendingSessions.set(key, Date.now())
    debugLog('mainCommand waiting for image', { key })
    await session.send('已收到指令，请发送要分析的图片。')
  })

  // 添加测试命令，方便在 WebUI 控制台测试
  ctx.command('lsnet.test', '测试 LSNet 插件')
    .action(async ({ session }) => {
      logger.info('[lsnet] 收到 test 命令')
      await session.send('LSNet 插件已加载，配置信息：')
      await session.send(`- API 端点: ${config.endpoint}`)
      await session.send(`- 模型名称: ${config.modelName}`)
      await session.send(`- 触发指令: ${config.trigger}`)
      await session.send('请发送图片并使用指令 "' + config.trigger + '" 进行测试。')
    })

  // 添加文件路径测试命令
  ctx.command('lsnet.testfile <path>', '使用指定图片文件路径测试 LSNet')
    .action(async ({ session }, path) => {
      logger.info(`[lsnet] 收到 testfile 命令，路径: ${path}`)
      if (!path) {
        await session.send('请提供图片文件路径，例如：lsnet.testfile C:/path/to/image.jpg')
        return
      }
      
      try {
        await session.send(`正在分析图片: ${path}`)
        
        // 直接读取文件
        const fs = require('fs')
        const buffer = fs.readFileSync(path)
        const base64Image = bufferToBase64(buffer)

        const classification = await inferArtist(ctx, config, base64Image)
        await session.send(composeResultMessage(classification))
      } catch (error) {
        logger.error(error)
        await session.send(`分析失败: ${error.message}`)
      }
    })

  ctx.middleware(async (session, next) => {
    // 在开发模式下支持 console 测试
    if (process.env.NODE_ENV === 'development' && session.platform === 'console') {
      logger.info(`[dev] Console 模式测试触发: ${session.content}`)
      
      // 检查是否是触发指令
      if (session.content?.trim() === config.trigger) {
        return handleLsnetCommand(ctx, session, config)
      }
      return next()
    }
    
    const key = getSessionKey(session)
    const now = Date.now()
    const pendingAt = pendingSessions.get(key)
    if (pendingAt && now - pendingAt > PENDING_PROMPT_TIMEOUT) {
      pendingSessions.delete(key)
      middlewareDebugLog('pending timeout cleared', { key })
    }

    middlewareDebugLog('middleware received message', {
      key,
      platform: session.platform,
      type: session.type,
      hasPending: pendingSessions.has(key),
      content: session.content,
      elementTypes: (session.elements || []).map((el) => el.type),
      eventTypes: Array.isArray(session.event?.message)
        ? session.event.message.map((seg) => seg?.type)
        : undefined,
    })

    const elements = session.elements || []
    const normalizedContent = session.content?.trim()
    const hasTrigger = Boolean(
      normalizedContent === config.trigger ||
        elements.some((el) => el.type === 'text' && (el.attrs?.content ?? el.children?.join('') ?? '').trim() === config.trigger),
    )

    if (hasTrigger) {
      const imageSegment = resolveImageSegment(session)
      middlewareDebugLog('middleware trigger detected', {
        key,
        hasImage: Boolean(imageSegment),
        elements: elements.map((el) => el.type),
      })
      if (imageSegment) {
        pendingSessions.delete(key)
        middlewareDebugLog('middleware trigger with image, start inference', { key })
        return handleLsnetCommand(ctx, session, config, imageSegment)
      }

      pendingSessions.set(key, now)
      middlewareDebugLog('middleware trigger without image, wait for follow-up', { key })
      await session.send('已收到指令，请发送要分析的图片。')
      return
    }

    if (pendingSessions.has(key)) {
      const imageSegment = resolveImageSegment(session)
      middlewareDebugLog('middleware pending follow-up', {
        key,
        hasImage: Boolean(imageSegment),
      })
      if (!imageSegment) return next()

      pendingSessions.delete(key)
      middlewareDebugLog('middleware pending satisfied, start inference', { key })
      return handleLsnetCommand(ctx, session, config, imageSegment)
    }

    return next()
  })

  async function handleLsnetCommand(ctx, session, config, providedSegment) {
    try {
      const result = await getLsnetInferenceResult(ctx, session, config, providedSegment)
      if (result.status === 'missing-image') {
        debugLog('handleLsnetCommand missing image', { key: getSessionKey(session) })
        await session.send('请同时发送要分析的图片。')
        return
      }

      const { imageSegment, classification, message } = result
      const { url, src, file, path } = imageSegment.attrs || {}
      debugLog('handleLsnetCommand start', {
        key: getSessionKey(session),
        url,
        src,
        file,
        path,
      })
      debugLog('handleLsnetCommand success', {
        key: getSessionKey(session),
        resultCount: classification.length,
      })
      await session.send(message)
    } catch (error) {
      logger.error(error)
      await session.send('推理请求失败，请稍后再试。')
    }
  }
}

async function fetchImageBase64(ctx, session, attrs) {
  const seen = new Set()
  const candidates = [attrs.url, attrs.src, attrs.path, attrs.file].filter(Boolean)

  for (const target of candidates) {
    if (!target || seen.has(target)) continue
    seen.add(target)

    const dataUri = extractDataUriBase64(target)
    if (dataUri) return dataUri

    const localBase64 = await tryReadLocalFileBase64(target)
    if (localBase64) return localBase64

    if (isHttpLikeUrl(target)) {
      try {
        const buffer = await ctx.http.get(target, { responseType: 'arraybuffer' })
        return bufferToBase64(buffer)
      } catch (err) {
        logger.debug(`[lsnet] fetch ${target} failed, try fallback`, err)
      }
      continue
    }

    const base64FromBot = await fetchFromBot(session, target)
    if (base64FromBot) return base64FromBot
  }

  const fallbackId = attrs.file || attrs.path
  if (fallbackId) {
    const base64FromBot = await fetchFromBot(session, fallbackId)
    if (base64FromBot) return base64FromBot
  }

  throw new Error('无法获取图片数据')
}

function isHttpLikeUrl(target) {
  return typeof target === 'string' && /^https?:\/\//i.test(target)
}

function extractDataUriBase64(target) {
  if (typeof target !== 'string' || !target.startsWith('data:')) return null

  const commaIndex = target.indexOf(',')
  if (commaIndex === -1) return null

  const meta = target.slice(0, commaIndex)
  const data = target.slice(commaIndex + 1)
  if (meta.includes(';base64')) {
    return data.trim()
  }

  try {
    return Buffer.from(decodeURIComponent(data), 'utf8').toString('base64')
  } catch (error) {
    logger.debug('[lsnet] decode data URI failed', error)
    return null
  }
}

async function tryReadLocalFileBase64(target) {
  if (typeof target !== 'string') return null

  const normalized = normalizeLocalPath(target)
  if (!normalized) return null

  try {
    const filePath = path.isAbsolute(normalized)
      ? normalized
      : path.join(process.cwd(), normalized)
    const buffer = await fs.readFile(filePath)
    return bufferToBase64(buffer)
  } catch (error) {
    logger.debug('[lsnet] read local file failed', { target: normalized, error })
    return null
  }
}

function normalizeLocalPath(target) {
  if (typeof target !== 'string') return null
  const stripped = target.replace(/^file:\/\//i, '')
  if (path.isAbsolute(stripped)) return path.normalize(stripped)
  if (stripped.startsWith('./') || stripped.startsWith('../')) {
    return path.normalize(stripped)
  }
  return null
}

async function fetchFromBot(session, identifier) {
  if (!session.bot || typeof session.bot.getFile !== 'function') return null
  try {
    const result = await session.bot.getFile(identifier)
    if (!result) return null
    if (result.base64) return result.base64
    if (result.url) {
      const buffer = await session.ctx.http.get(result.url, { responseType: 'arraybuffer' })
      return bufferToBase64(buffer)
    }
  } catch (error) {
    logger.debug('[lsnet] bot.getFile failed', error)
  }
  return null
}

function bufferToBase64(buffer) {
  if (buffer instanceof ArrayBuffer) {
    return Buffer.from(new Uint8Array(buffer)).toString('base64')
  }
  if (ArrayBuffer.isView(buffer)) {
    return Buffer.from(buffer.buffer).toString('base64')
  }
  return Buffer.from(buffer).toString('base64')
}

function getSessionKey(session) {
  if (session.cid) {
    return `${session.platform}:${session.cid}`
  }
  const parts = [
    session.platform,
    session.selfId || '',
    session.guildId || session.channelId || session.targetId || '',
    session.userId || session.author?.id || '',
  ]
  return parts.join(':')
}

module.exports = {
  name,
  apply,
  Config,
  inject,
}
