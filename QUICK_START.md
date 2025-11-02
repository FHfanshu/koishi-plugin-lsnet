# 快速开始指南

本指南帮助你快速部署和使用 koishi-plugin-lsnet。

## 一、环境准备

### 1.1 安装 ComfyUI LSNet

```bash
# 克隆 comfyui-lsnet 仓库
git clone https://github.com/spawner1145/comfyui-lsnet.git
cd comfyui-lsnet

# 安装依赖
pip install -r requirements.txt
```

### 1.2 下载模型

访问 [Kaloscope 2.0 模型页面](https://huggingface.co/heathcliff01/Kaloscope2.0/tree/main)，下载以下文件：

- `classes.txt`
- `model.pth`
- `config.json`

将这些文件放置到：
```
comfyui-lsnet/models/lsnet/Kaloscope/
```

### 1.3 启动 ComfyUI LSNet API

```bash
# 在 comfyui-lsnet 目录中
python -m scripts.app
```

API 将在 `http://127.0.0.1:7860` 启动。

测试 API 是否正常：
```bash
curl http://127.0.0.1:7860/health
```

## 二、配置 OneBot 客户端

### 方案一：使用 LLOneBot（推荐）

1. 下载安装 [LLOneBot](https://github.com/LLOneBot/LLOneBot)
2. 配置 WebSocket 服务器：`ws://127.0.0.1:6700`
3. 启动 QQ 和 LLOneBot

### 方案二：使用 go-cqhttp

1. 下载 [go-cqhttp](https://github.com/Mrs4s/go-cqhttp)
2. 配置 `config.yml`：
   ```yaml
   servers:
     - ws:
         host: 127.0.0.1
         port: 6700
   ```
3. 启动 go-cqhttp

## 三、安装 Koishi 和插件

### 3.1 创建 Koishi 项目

```bash
# 创建新目录
mkdir my-koishi-bot
cd my-koishi-bot

# 初始化 npm 项目
npm init -y

# 安装 Koishi
npm install koishi
```

### 3.2 安装插件

```bash
# 安装必需插件
npm install @koishijs/plugin-console
npm install @koishijs/plugin-http
npm install koishi-plugin-adapter-onebot
npm install koishi-plugin-lsnet
```

### 3.3 创建配置文件

创建 `koishi.yml`：

```yaml
plugins:
  http: {}
  
  adapter-onebot:
    selfId: '你的机器人QQ号'
    protocol: ws
    endpoint: ws://127.0.0.1:6700
  
  console:
    open: true
  
  lsnet:
    endpoint: http://127.0.0.1:7860/lsnet/v1/infer
    modelName: Kaloscope
    device: cuda
    topK: 5
    threshold: 0
    trigger: lsnet
```

### 3.4 创建启动脚本

创建 `package.json` 的 scripts 部分：

```json
{
  "scripts": {
    "start": "koishi start"
  }
}
```

## 四、启动和测试

### 4.1 启动 Koishi

```bash
npm start
```

Koishi 控制台将在 `http://localhost:5140` 打开。

### 4.2 测试插件

1. 在 QQ 中找到你的机器人
2. 发送消息：`lsnet` + 一张图片
3. 等待机器人返回识别结果

示例对话：
```
用户: lsnet [图片]
机器人: 识别结果：Mika Pikazo（置信度 87.65%）
```

## 五、常见问题

### Q1: API 连接失败

**检查项：**
- ComfyUI LSNet 是否在运行？
- 端口 7860 是否被占用？
- 防火墙是否阻止连接？

**解决方案：**
```bash
# 检查端口
netstat -ano | findstr 7860  # Windows
lsof -i :7860                 # Linux/Mac

# 重启 ComfyUI LSNet
python -m scripts.app
```

### Q2: OneBot 客户端连接失败

**检查项：**
- OneBot 客户端是否运行？
- WebSocket 地址是否正确？
- selfId 是否匹配？

**解决方案：**
- 查看 Koishi 控制台的 "状态" 页面
- 检查 OneBot 客户端日志
- 确认 `koishi.yml` 中的配置

### Q3: 图片识别失败

**可能原因：**
- 模型文件未正确放置
- 图片格式不支持
- 显存不足（CUDA）

**解决方案：**
```yaml
# 尝试使用 CPU
lsnet:
  device: cpu
```

### Q4: 识别速度慢

**优化建议：**
- 使用 GPU (CUDA)
- 减小 topK 值
- 升级硬件配置

### Q5: 返回结果为空

**检查项：**
- threshold 设置是否过高？
- 图片是否为艺术作品？

**解决方案：**
```yaml
lsnet:
  threshold: 0  # 降低阈值
  topK: 10      # 增加返回数量
```

## 六、进阶配置

### 多账号支持

```yaml
plugins:
  adapter-onebot:bot1:
    selfId: '111111'
    endpoint: ws://127.0.0.1:6700
  
  adapter-onebot:bot2:
    selfId: '222222'
    endpoint: ws://127.0.0.1:6701
  
  lsnet:
    endpoint: http://127.0.0.1:7860/lsnet/v1/infer
    trigger: lsnet
```

### 自定义触发指令

```yaml
lsnet:
  trigger: 识别画师  # 使用中文指令
```

### 性能调优

```yaml
lsnet:
  device: cuda
  topK: 3          # 只返回前3个结果，提升速度
  threshold: 0.1   # 设置最低置信度，过滤低质量结果
```

## 七、开发和调试

### 启用调试日志

在 Koishi 控制台查看日志，或修改日志级别：

```yaml
logLevel: 3  # 0=silent, 1=error, 2=warning, 3=info, 4=debug
```

### 本地开发插件

```bash
# 克隆插件仓库
git clone https://github.com/yourusername/koishi-plugin-lsnet.git
cd koishi-plugin-lsnet

# 安装依赖
npm install

# 链接到本地
npm link

# 在你的 Koishi 项目中
cd /path/to/your/koishi-bot
npm link koishi-plugin-lsnet
```

## 八、获取帮助

- [GitHub Issues](https://github.com/yourusername/koishi-plugin-lsnet/issues)
- [Koishi 论坛](https://forum.koishi.chat/)
- [ComfyUI LSNet 仓库](https://github.com/spawner1145/comfyui-lsnet)

## 九、下一步

- 探索其他 Koishi 插件
- 配置多个功能插件
- 学习自定义插件开发

祝使用愉快！
