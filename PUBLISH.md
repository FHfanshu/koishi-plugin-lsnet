# 发布指南

本文说明如何将 `koishi-plugin-lsnet` 发布到 npm 和 GitHub。

## 前置准备

### 1. npm 账号

确保你有 npm 账号，如果没有请在 [npmjs.com](https://www.npmjs.com/) 注册。
登录 npm：
```bash
npm login
```

### 2. GitHub 仓库

在 GitHub 上创建仓库 `koishi-plugin-lsnet`。

### 3. 更新配置

在 `package.json` 中更新以下字段：

```json
{
  "author": "你的名字",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/你的用户名/koishi-plugin-lsnet.git"
  },
  "bugs": {
    "url": "https://github.com/你的用户名/koishi-plugin-lsnet/issues"
  },
  "homepage": "https://github.com/你的用户名/koishi-plugin-lsnet#readme"
}
```

同时更新 `README.md` 中的所有链接。
## 发布到 GitHub

### 1. 初始化 Git 仓库

```bash
git init
git add .
git commit -m "Initial commit: koishi-plugin-lsnet v1.0.0"
```

### 2. 添加远程仓库

```bash
git remote add origin https://github.com/你的用户名/koishi-plugin-lsnet.git
git branch -M main
git push -u origin main
```

### 3. 创建 Release

在 GitHub 上创建一个新的 Release：
1. 进入仓库的 Releases 页面
2. 点击 "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: `v1.0.0 - Initial Release`
5. 描述发布内容（可以从 CHANGELOG.md 复制）
6. 点击 "Publish release"

## 发布到 npm

### 1. 确认包内容
检查将要发布的文件：
```bash
npm pack --dry-run
```

确保包包含以下文件：
- `index.js`
- `src/index.ts`
- `README.md`
- `LICENSE`
- `package.json`

### 2. 发布到 npm

```bash
npm publish
```

如果是第一次发布，可能需要验证邮件。

### 3. 确认发布

访问 npm 包页面：

```
https://www.npmjs.com/package/koishi-plugin-lsnet
```

## 后续版本更新

### 1. 更新版本号
根据变更类型更新版本号（语义化版本）：
```bash
# 补丁版本 (bug 修复)
npm version patch

# 次版本号 (新功能，向后兼容)
npm version minor

# 主版本号 (破坏性变更)
npm version major
```

### 2. 更新 CHANGELOG.md

在 `CHANGELOG.md` 中记录新版本的变化。

### 3. 提交并推送
```bash
git add .
git commit -m "Release vX.Y.Z"
git push
git push --tags
```

### 4. 发布到 npm

```bash
npm publish
```

### 5. 在 GitHub 创建新 Release

参考上面的步骤在 GitHub 创建新的 Release。
## 最佳实践
1. **测试后再发布**：确保在本地和 example 目录中充分测试
2. **版本号规范**：严格遵循语义化版本规范
3. **CHANGELOG**：每次发布都更新 CHANGELOG
4. **文档同步**：确保 README 和代码保持同步
5. **标签管理**：为每个版本创建 Git 标签
6. **持续集成**：考虑添加 GitHub Actions 自动化测试和发布

## 测试安装

发布后，在新目录中测试安装：

```bash
mkdir test-install
cd test-install
npm init -y
npm install koishi-plugin-lsnet
```

检查插件是否正确安装和可用。
## 故障排除

### npm 发布失败

- 检查是否已登录：`npm whoami`
- 检查包名是否已被占用
- 确保 package.json 配置正确

### GitHub 推送失败
- 检查远程仓库 URL 是否正确
- 确保有推送权限
- 尝试使用 SSH 而不是 HTTPS

## 相关链接

- [npm 文档](https://docs.npmjs.com/)
- [语义化版本](https://semver.org/lang/zh-CN/)
- [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)
