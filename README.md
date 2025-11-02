# koishi-plugin-lsnet

[![npm](https://img.shields.io/npm/v/koishi-plugin-lsnet?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-lsnet)
[![License](https://img.shields.io/github/license/FHfanshu/koishi-plugin-lsnet?style=flat-square)](https://github.com/FHfanshu/koishi-plugin-lsnet/blob/main/LICENSE)

Koishi 插件，通过调用本地 ComfyUI LSNet API 来识别图片的画家风格。

## 功能特性
- **画家风格识别**：使用 [Kaloscope 2.0](https://huggingface.co/heathcliff01/Kaloscope2.0) 模型进行图片画家风格推理
- **OneBot 协议支持**：完美支持 OneBot 协议的聊天平台
- **灵活配置**：支持自定义 API 端点、模型参数等
- **高性能**：利用本地 ComfyUI 服务，快速响应
## 前置要求

1. **ComfyUI LSNet 插件**：需要在本地安装并运行 [comfyui-lsnet](https://github.com/spawner1145/comfyui-lsnet)
2. **Kaloscope 模型**：下载 [Kaloscope 2.0 模型](https://huggingface.co/heathcliff01/Kaloscope2.0/tree/main) 并放置到 ComfyUI 的模型目录
3. **Koishi 环境**：Koishi v4.14.0 或更高版本
4. **Node.js**：Node.js 18 或更高版本
## 安装

### 使用 npm

```bash
npm install koishi-plugin-lsnet
```

### 使用 yarn

```bash
yarn add koishi-plugin-lsnet
```

## 配置

在 Koishi 配置文件中添加插件：

```yaml
plugins:
  lsnet:
    endpoint: http://127.0.0.1:7860/lsnet/v1/infer  # ComfyUI LSNet API 地址
    modelName: Kaloscope                             # 模型目录名称
    device: cuda                                     # 设备类型: cuda 或 cpu
    topK: 5                                          # 返回前 K 个结果
    threshold: 0                                     # 置信度阈值(0-1)
    trigger: lsnet                                   # 触发指令关键词
```

### 配置项说明
| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `endpoint` | string | 必填 | ComfyUI LSNet API 的完整地址 |
| `modelName` | string | `Kaloscope` | LSNet 模型目录名称 |
| `device` | `cuda` \| `cpu` | `cuda` | 推理使用的设备 |
| `topK` | number | `5` | 返回前 K 个识别结果（1-20） |
| `threshold` | number | `0` | 最低置信度阈值（0-1） |
| `trigger` | string | `lsnet` | 触发识别的指令关键词 |

## 使用方法

1. 确保 ComfyUI 和 LSNet 插件已启动
2. 在聊天平台发送触发指令（默认为 `lsnet`）+ 图片
3. 机器人将返回识别到的画家名称和置信度

### 示例

```
用户: lsnet [图片]
机器人: 识别结果：Mika Pikazo（置信度 87.65%）
```

## ComfyUI LSNet 设置

### 安装 ComfyUI LSNet

参考 [comfyui-lsnet 仓库](https://github.com/spawner1145/comfyui-lsnet) 的安装说明。

### 下载模型

从 [Hugging Face](https://huggingface.co/heathcliff01/Kaloscope2.0/tree/main) 下载 Kaloscope 2.0 模型文件，并放置到：

```
ComfyUI/models/lsnet/Kaloscope/
```

### 启动 API 服务

```bash
# 启动 ComfyUI LSNet API
python -m scripts.app
```

默认监听在 `http://127.0.0.1:7860`

## API 格式

插件会向 ComfyUI LSNet API 发送如下格式的请求：
```json
{
  "input_image": "base64_encoded_image_data",
  "model_name": "Kaloscope",
  "device": "cuda",
  "top_k": 5,
  "threshold": 0.0
}
```

预期返回格式：
```json
{
  "results": {
    "classification": [
      {
        "class_name": "Artist Name",
        "probability": 0.8765
      }
    ]
  }
}
```

## 开发
### 克隆仓库

```bash
git clone https://github.com/FHfanshu/koishi-plugin-lsnet.git
cd koishi-plugin-lsnet
```

### 安装依赖

```bash
npm install
```

### 构建

```bash
npm run build
```

### 测试

在 `example/` 目录下提供了一个测试用的 Koishi 实例：
```bash
cd example
npm install
npm start
```

## 故障排除

### 图片获取失败

如果遇到图片获取失败的问题，插件会尝试多种方式获取图片：
1. 直接从 URL 下载
2. 通过 Bot 的 `getFile` API 获取
3. 使用本地文件路径

### API 调用超时

默认超时时间为 60 秒。如果模型推理时间较长，可能需要：
- 使用更弱的 GPU
- 减小 `topK` 参数
- 优化 ComfyUI 配置

### OneBot 协议兼容性

目前仅支持 OneBot 协议。如需支持其他协议，请提交 Issue 或 PR。
## 致谢

- [comfyui-lsnet](https://github.com/spawner1145/comfyui-lsnet) - ComfyUI LSNet 插件
- [Kaloscope 2.0](https://huggingface.co/heathcliff01/Kaloscope2.0) - 画家风格识别模型
- [@heathcliff01](https://huggingface.co/heathcliff01) - 模型训练

## 许可证

本项目采用 [MIT](LICENSE) 许可证。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 链接

- [GitHub 仓库](https://github.com/FHfanshu/koishi-plugin-lsnet)
- [npm 包](https://www.npmjs.com/package/koishi-plugin-lsnet)
- [Koishi 官网](https://koishi.chat/)

