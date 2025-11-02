# koishi-plugin-lsnet

[![npm](https://img.shields.io/npm/v/koishi-plugin-lsnet?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-lsnet)
[![License](https://img.shields.io/github/license/yourusername/koishi-plugin-lsnet?style=flat-square)](https://github.com/yourusername/koishi-plugin-lsnet/blob/main/LICENSE)

基于 Koishi 框架的画师风格识别插件，通过 ComfyUI LSNet API 识别图片中的画师风格。

[English](README.md) | 简体中文

## ✨ 特性

- 🎨 **精准识别**：使用 [Kaloscope 2.0](https://huggingface.co/heathcliff01/Kaloscope2.0) 模型进行画师风格识别
- 📱 **OneBot 支持**：完美支持 QQ、Discord 等聊天平台
- ⚡ **快速响应**：本地 ComfyUI 部署，秒级返回结果
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

### 1. 安装 ComfyUI LSNet

```bash
git clone https://github.com/spawner1145/comfyui-lsnet.git
cd comfyui-lsnet
pip install -r requirements.txt
```

### 2. 下载模型

从 [Hugging Face](https://huggingface.co/heathcliff01/Kaloscope2.0/tree/main) 下载模型文件到：
```
comfyui-lsnet/models/lsnet/Kaloscope/
```

### 3. 启动 ComfyUI LSNet

```bash
python -m scripts.app
```

API 将在 `http://127.0.0.1:7860` 启动。

### 4. 配置 Koishi

在 `koishi.yml` 中添加：

```yaml
plugins:
  lsnet:
    endpoint: http://127.0.0.1:7860/lsnet/v1/infer
    modelName: Kaloscope
    device: cuda
    topK: 5
    threshold: 0
    trigger: lsnet
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

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `endpoint` | string | 必填 | ComfyUI LSNet API 地址 |
| `modelName` | string | `Kaloscope` | 模型目录名称 |
| `device` | `cuda`\|`cpu` | `cuda` | 推理设备 |
| `topK` | number | `5` | 返回结果数量（1-20） |
| `threshold` | number | `0` | 置信度阈值（0-1） |
| `trigger` | string | `lsnet` | 触发指令 |

## 📖 详细文档

- [快速开始指南](QUICK_START.md) - 从零开始部署完整流程
- [发布指南](PUBLISH.md) - 如何发布到 npm 和 GitHub
- [项目总结](PROJECT_SUMMARY.md) - 技术架构和实现细节
- [发布检查清单](CHECKLIST.md) - 发布前必查项目

## 🔧 故障排除

### API 连接失败

```bash
# 检查 ComfyUI LSNet 是否运行
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
- [comfyui-lsnet](https://github.com/spawner1145/comfyui-lsnet) - ComfyUI LSNet 插件
- [Kaloscope 2.0](https://huggingface.co/heathcliff01/Kaloscope2.0) - 画师识别模型
- [@heathcliff01](https://huggingface.co/heathcliff01) - 模型训练

## 🔗 相关链接

- [GitHub 仓库](https://github.com/yourusername/koishi-plugin-lsnet)
- [npm 包](https://www.npmjs.com/package/koishi-plugin-lsnet)
- [Koishi 官网](https://koishi.chat/)
- [问题反馈](https://github.com/yourusername/koishi-plugin-lsnet/issues)
