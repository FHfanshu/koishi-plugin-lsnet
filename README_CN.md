# koishi-plugin-lsnet

[![npm](https://img.shields.io/npm/v/koishi-plugin-lsnet?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-lsnet)
[![License](https://img.shields.io/github/license/yourusername/koishi-plugin-lsnet?style=flat-square)](https://github.com/yourusername/koishi-plugin-lsnet/blob/main/LICENSE)

基于 Koishi 框架的画师风格识别插件，通过 LSNet API 识别图片中的画师风格。

[English](README.md) | 简体中文

## ✨ 特性

- 🎨 **精准识别**：使用 [Kaloscope 2.0](https://huggingface.co/heathcliff01/Kaloscope2.0) 模型进行画师风格识别
- 📱 **OneBot 支持**：完美支持 QQ、Discord 等聊天平台
- ⚡ **快速响应**：本地部署，秒级返回结果
- ⚙️ **灵活配置**：支持自定义触发指令、模型参数等
- 🔒 **隐私安全**：所有数据本地处理，不上传云端

## 📦 安装

```bash
npm install koishi-plugin-lsnet
```

或

```bash
yarn add koishi-plugin-lsnet
```

## 🚀 快速开始

### 1. 安装 LSNet 后端服务

LSNet 后端可以使用多种方式部署，以下以 comfyui-lsnet 为例：

```bash
git clone https://github.com/spawner1145/comfyui-lsnet.git
cd comfyui-lsnet
pip install -r requirements.txt
```

注意：comfyui-lsnet 是一个独立的 LSNet 服务实现，不强制依赖 ComfyUI。

### 2. 下载模型

从 [Hugging Face](https://huggingface.co/heathcliff01/Kaloscope2.0/tree/main) 下载模型文件到后端服务的模型目录：
```
<后端服务目录>/models/lsnet/Kaloscope/
```

### 3. 启动 LSNet 后端服务

```bash
python -m scripts.app
```

API 将在 `http://127.0.0.1:7860` 启动。

### 4. 配置 Koishi

在 `koishi.yml` 中添加：

```yaml
plugins:
  lsnet:
    # API 配置
    endpoint: http://127.0.0.1:7860/lsnet/v1/infer  # LSNet API 地址（必填）
    
    # 模型配置
    modelName: Kaloscope
    device: cuda
    topK: 5
    threshold: 0
    
    # 指令配置
    trigger: lsnet
    
    # 调试选项（可选）
    lslog: false
    middlewareLog: false
```

### 5. 使用

在聊天中发送：
```
lsnet [图片]
```

机器人将返回：
```
识别结果：Mika Pikazo（置信度 87.65%）
```

## ⚙️ 配置说明

### API 配置
| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `endpoint` | string | **必填** | LSNet API 地址 |

### 模型配置
| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `modelName` | string | `Kaloscope` | 模型目录名称（对应后端服务中的模型文件夹） |
| `device` | `cuda`\|`cpu` | `cuda` | 推理设备：使用 GPU (cuda) 或 CPU 进行推理 |
| `topK` | number | `5` | 返回结果数量（1-20） |
| `threshold` | number | `0` | 置信度阈值（0-1），低于此值的结果将被过滤 |

### 指令配置
| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `trigger` | string | `lsnet` | 触发指令关键字（例如：lsnet、识别画师等） |

### 调试选项
| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `lslog` | boolean | `false` | 启用详细日志输出，用于排查问题和调试 |
| `middlewareLog` | boolean | `false` | 输出中间件详细日志（需同时启用详细日志） |

## 📖 ChatLuna 集成教程

### 什么是 ChatLuna 集成？

ChatLuna 是一个强大的 AI 对话插件，支持多种大语言模型。通过集成 LSNet，AI 助手可以：
- 🤖 主动识别用户发送的图片中的画师风格
- 💬 在对话中自动调用画师识别功能
- 🧠 根据识别结果提供更智能的回复

### 前置要求

1. 已安装 `koishi-plugin-chatluna` (v1.3 或更高版本)
2. 已配置至少一个可用的 AI 模型
3. 已安装并配置好本插件的基础功能

### 配置步骤

#### 1. 启用 ChatLuna 集成

在 `koishi.yml` 中添加 ChatLuna 配置：

```yaml
plugins:
  lsnet:
    # ... 基础配置 ...
    
    # ChatLuna 联动配置
    chatluna:
      enabled: true                                    # 启用集成
      actionName: lsnet.identify                       # 工具名称
      actionDescription: 识别用户提供的图片并返回最可能的画师。
      inputPrompt: |
        当需要识别图片画师时调用此工具，并提供描述或图片地址。
        用户上传图片后，如果询问画师相关问题，应该调用此工具。
      model: 无                                         # 限制可用模型（选择"无"表示不限制）
```

#### 2. 配置项详解

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | boolean | `false` | 启用 ChatLuna Actions 联动，允许 AI 助手调用识别功能 |
| `actionName` | string | `lsnet.identify` | 注册到 ChatLuna 的 Action 名称，建议保持默认 |
| `actionDescription` | string | - | 提供给 ChatLuna 的 Action 描述，AI 会根据此描述判断何时调用 |
| `inputPrompt` | string | - | 提示 AI 如何调用此工具，可以包含使用场景说明 |
| `model` | string | `无` | 允许调用此 Action 的 ChatLuna 模型，选择"无"为不限制 |

#### 3. 重启 Koishi

配置完成后，重启 Koishi 以使配置生效。查看日志确认注册成功：

```
[lsnet] ChatLuna 工具注册子插件已启动
[lsnet] 已向 ChatLuna 注册工具 lsnet.identify
```

### 使用示例

#### 场景 1：主动识别

```
用户: [发送图片]
用户: 这是谁的画风？
AI: 让我帮你识别一下... [调用 lsnet.identify]
AI: 这幅画的风格是 Mika Pikazo（置信度 87.65%），是一位以明亮色彩和可爱角色设计著称的日本插画师。
```

#### 场景 2：图片 URL 识别

```
用户: 帮我看看这个图片的画师 https://example.com/image.jpg
AI: [调用 lsnet.identify 并传入 URL]
AI: 识别结果显示可能是 Lpip（置信度 92.3%）的作品。
```

#### 场景 3：引用消息识别

```
用户: [发送图片]
其他用户: 好看！
用户: @AI 帮我看看这是谁画的
AI: [调用 lsnet.identify 识别引用的图片]
AI: 根据识别结果，这可能是 Ask (askzy) 的作品（置信度 76.5%）。
```

### 高级配置

#### 限制特定模型使用

如果你希望只有特定的 AI 模型能够调用画师识别功能：

```yaml
chatluna:
  enabled: true
  model: openai/gpt-4  # 只有 GPT-4 可以调用
```

当其他模型尝试调用时，会收到提示：

```
当前会话模型 openai/gpt-3.5-turbo 无法调用该工具，请切换到 openai/gpt-4。
```

#### 自定义工具提示词

通过优化 `inputPrompt`，可以让 AI 更好地理解何时调用工具：

```yaml
chatluna:
  enabled: true
  inputPrompt: |
    这是一个画师风格识别工具，使用 Kaloscope 2.0 模型。
    
    何时调用：
    - 用户上传图片并询问画师、作者、风格等信息
    - 用户提供图片 URL 并要求识别
    - 用户引用包含图片的消息并询问画师信息
    
    如何调用：
    - 如果图片已在会话中，直接调用无需参数
    - 如果用户提供了 URL，将 URL 传入 image 参数
    
    注意：工具返回的是识别结果，你需要根据结果给出友好的回复。
```

### 工作原理

1. **工具注册**：插件启动时向 ChatLuna 注册 `lsnet.identify` 工具
2. **智能判断**：AI 根据对话上下文判断是否需要调用识别工具
3. **图片获取**：
   - 优先使用 AI 传入的 `image` 参数（URL 或文件 ID）
   - 若无参数，从当前会话或引用消息中提取图片
4. **结果返回**：识别结果返回给 AI，由 AI 生成友好的回复

### 故障排除

#### ChatLuna 服务不可用

**症状**：日志显示 `[lsnet] ChatLuna 服务不可用`

**解决方案**：
1. 确认已安装 `koishi-plugin-chatluna`
2. 确认 ChatLuna 插件已启用
3. 检查 ChatLuna 插件是否加载成功

#### 工具未注册成功

**症状**：AI 无法调用识别功能

**解决方案**：
1. 检查配置中 `chatluna.enabled` 是否为 `true`
2. 查看日志确认是否有错误信息
3. 尝试重启 Koishi

#### AI 不调用工具

**症状**：AI 不主动使用识别功能

**解决方案**：
1. 优化 `actionDescription` 和 `inputPrompt` 配置
2. 明确告诉 AI 需要识别画师（例如："帮我识别这个画师"）
3. 检查模型限制配置是否正确

#### 识别失败

**症状**：AI 调用工具但返回错误

**解决方案**：
1. 确认基础的画师识别功能正常（使用 `lsnet` 指令测试）
2. 检查 LSNet API 后端服务是否正常运行
3. 查看详细日志（启用 `lslog: true`）

### 性能优化

#### 减少不必要的调用

通过精确的提示词避免 AI 频繁调用：

```yaml
inputPrompt: |
  仅在以下情况调用此工具：
  1. 用户明确要求识别画师
  2. 用户询问图片作者、风格等相关信息
  不要在用户仅发送图片而未提问时主动调用。
```

#### 设置合理的阈值

```yaml
threshold: 0.1  # 过滤掉置信度低于 10% 的结果
topK: 3         # 只返回前 3 个结果，减少 token 消耗
```

## 📖 更多文档

- [快速开始指南](QUICK_START.md) - 从零开始部署完整流程
- [发布指南](PUBLISH.md) - 如何发布到 npm 和 GitHub
- [项目总结](PROJECT_SUMMARY.md) - 技术架构和实现细节
- [发布检查清单](CHECKLIST.md) - 发布前必查项目

## 🔧 故障排除

### API 连接失败

```bash
# 检查 LSNet 后端服务是否运行
curl http://127.0.0.1:7860/health

# 检查端口占用
netstat -ano | findstr 7860
```

### OneBot 连接失败

1. 确认 OneBot 客户端正在运行
2. 检查 `koishi.yml` 中的 `endpoint` 配置
3. 查看 Koishi 控制台的连接状态

### 识别结果为空

尝试降低阈值：
```yaml
lsnet:
  threshold: 0
  topK: 10
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📜 许可证

[MIT](LICENSE) © 2024

## 🙏 致谢

- [Koishi](https://koishi.chat/) - 聊天机器人框架
- [comfyui-lsnet](https://github.com/spawner1145/comfyui-lsnet) - LSNet 后端服务参考实现
- [Kaloscope 2.0](https://huggingface.co/heathcliff01/Kaloscope2.0) - 画师识别模型
- [@heathcliff01](https://huggingface.co/heathcliff01) - 模型训练

## 🔗 相关链接

- [GitHub 仓库](https://github.com/yourusername/koishi-plugin-lsnet)
- [npm 包](https://www.npmjs.com/package/koishi-plugin-lsnet)
- [Koishi 官网](https://koishi.chat/)
- [问题反馈](https://github.com/yourusername/koishi-plugin-lsnet/issues)
