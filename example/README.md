# Koishi LSNet 插件测试示例

这是一个用于测试 `koishi-plugin-lsnet` 的示例 Koishi 实例。

## 前置要求

1. **ComfyUI LSNet 已运行**：确保你的 ComfyUI LSNet API 服务正在运行
   - 默认地址：`http://127.0.0.1:7860`
   - 启动命令：在 comfyui-lsnet 目录中运行 `python -m scripts.app`

2. **OneBot 协议客户端**：需要一个 OneBot 协议的客户端（如 go-cqhttp、LLOneBot 等）
   - 默认 WebSocket 地址：`ws://127.0.0.1:6700`

## 配置

### 1. 修改 koishi.yml

在 `koishi.yml` 中配置你的环境：

```yaml
plugins:
  adapter-onebot:jmm0jb:
    selfId: '你的机器人QQ号'
    token: ''
    protocol: ws
    endpoint: ws://127.0.0.1:6700  # OneBot 客户端的 WebSocket 地址
  
  lsnet:em8m67:
    endpoint: http://127.0.0.1:7860/lsnet/v1/infer  # ComfyUI LSNet API 地址
    modelName: Kaloscope                             # 模型名称
    device: cuda                                     # cuda 或 cpu
    topK: 5                                          # 返回前几个结果
    threshold: 0                                     # 置信度阈值
    trigger: lsnet                                   # 触发指令
```

### 2. 安装依赖

```bash
npm install
```

或

```bash
yarn install
```

## 启动测试

### 开发模式（自动重载）

```bash
npm run dev
```

### 生产模式

```bash
npm start
```

## 测试插件功能

1. 启动 Koishi 实例后，会在 `http://localhost:5140` 打开控制台

2. 确保 OneBot 客户端已连接

3. 在聊天平台发送：
   ```
   lsnet [图片]
   ```

4. 机器人应该返回识别结果：
   ```
   识别结果：Artist Name（置信度 XX.XX%）
   ```

## 故障排除

### ComfyUI LSNet API 连接失败

检查：
- ComfyUI LSNet 服务是否正在运行
- 端口 7860 是否正确
- 防火墙设置

测试 API：
```bash
curl http://127.0.0.1:7860/health
```

### OneBot 客户端连接失败

检查：
- OneBot 客户端是否运行
- WebSocket 地址和端口是否正确
- selfId 是否匹配

### 图片识别失败

检查：
- 模型文件是否正确放置在 `ComfyUI/models/lsnet/Kaloscope/`
- 设备类型（cuda/cpu）是否正确
- 日志中的错误信息

## 查看日志

Koishi 会输出详细的日志信息，包括：
- 插件加载状态
- API 请求和响应
- 错误信息

在开发模式下，日志会实时显示在终端中。

## 目录结构

```
example/
├── koishi.yml          # Koishi 配置文件
├── package.json        # 依赖配置
├── node_modules/       # 依赖包（安装后生成）
└── README.md          # 本文件
```

## 更多信息

- [Koishi 文档](https://koishi.chat/)
- [OneBot 文档](https://onebot.dev/)
- [插件主仓库](../)
