'use strict'

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

const { Schema, Logger } = loadKoishi()

const name = 'lsnet'
const inject = {
  required: ['adapter'],
}

const logger = new Logger(name)

const Config = Schema.object({
  endpoint: Schema.string().description('ComfyUI LSNet API 地址，例如 http://127.0.0.1:7860/lsnet/v1/infer'),
  modelName: Schema.string().default('Kaloscope').description('LSNet 模型目录名称'),
  device: Schema.union(['cuda', 'cpu']).default('cuda'),
  topK: Schema.number().default(5).min(1).max(20),
  threshold: Schema.number().default(0).min(0).max(1),
  trigger: Schema.string().default('lsnet').description('触发指令关键字'),
})

function apply(ctx, config) {
  ctx.middleware(async (session, next) => {
    if (session.platform !== 'onebot') return next()

    const elements = session.elements || []
    const normalizedContent = session.content?.trim()
    const hasTrigger = Boolean(
      normalizedContent === config.trigger ||
        elements.some((el) => el.type === 'text' && (el.attrs?.content ?? el.children?.join('') ?? '').trim() === config.trigger),
    )

    if (!hasTrigger) return next()

    const imageSegment = elements.find((el) => el.type === 'image')
    if (!imageSegment) {
      await session.send('请同时发送要分析的图片。')
      return
    }

    const { url, file, path } = imageSegment.attrs || {}

    try {
      const base64Image = await fetchImageBase64(ctx, session, { url, file, path })

      const response = await ctx.http.post(config.endpoint, {
        input_image: base64Image,
        model_name: config.modelName,
        device: config.device,
        top_k: config.topK,
        threshold: config.threshold,
      }, { timeout: 60_000 })

      const { results } = response || {}
      const classification = results?.classification || []
      if (!classification.length) {
        await session.send('未能识别到画师信息。')
        return
      }

      const [topResult] = classification
      const artistName = topResult?.class_name || '未知画师'
      const probability = typeof topResult?.probability === 'number'
        ? `（置信度 ${(topResult.probability * 100).toFixed(2)}%）`
        : ''

      await session.send(`识别结果：${artistName}${probability}`)
    } catch (error) {
      logger.error(error)
      await session.send('推理请求失败，请稍后再试。')
    }
  })
}

async function fetchImageBase64(ctx, session, attrs) {
  const candidates = [attrs.url, attrs.path, attrs.file].filter(Boolean)

  for (const target of candidates) {
    if (!target) continue

    try {
      const buffer = await ctx.http.get(target, { responseType: 'arraybuffer' })
      return bufferToBase64(buffer)
    } catch (err) {
      logger.debug(`[lsnet] fetch ${target} failed, try fallback`, err)
      if (target.startsWith('http')) continue

      const base64FromBot = await fetchFromBot(session, target)
      if (base64FromBot) return base64FromBot
    }
  }

  const fallbackId = attrs.file || attrs.path
  if (fallbackId) {
    const base64FromBot = await fetchFromBot(session, fallbackId)
    if (base64FromBot) return base64FromBot
  }

  throw new Error('无法获取图片数据')
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

module.exports = {
  name,
  apply,
  inject,
  Config,
}
