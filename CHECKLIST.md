# 发布前检查清单

在发布插件之前，请确保完成以下所有检查项：

## 一、代码检查

- [x] 插件核心功能已实现（`index.js`）
- [x] TypeScript 声明文件配置完成（`src/index.ts`）
- [x] 配置模式（Schema）定义完整
- [x] 错误处理机制完善
- [x] 日志输出清晰

## 二、文档检查

- [x] `README.md` - 完整的项目说明文档
- [x] `QUICK_START.md` - 快速开始指南
- [x] `CHANGELOG.md` - 版本变更记录
- [x] `PUBLISH.md` - 发布指南
- [x] `LICENSE` - MIT 许可证
- [x] `example/README.md` - 测试示例说明

## 三、配置文件检查

- [x] `package.json` - 包信息完整
  - [ ] **需要更新**: `author` 字段
  - [ ] **需要更新**: `repository.url` 字段（替换 yourusername）
  - [ ] **需要更新**: `bugs.url` 字段
  - [ ] **需要更新**: `homepage` 字段
- [x] `tsconfig.json` - TypeScript 配置
- [x] `.gitignore` - Git 忽略规则
- [x] `.npmignore` - npm 发布忽略规则
- [x] `koishi.yml` - Koishi 配置示例（在 example 目录）

## 四、GitHub 准备

- [ ] 在 GitHub 创建仓库 `koishi-plugin-lsnet`
- [ ] 更新所有文档中的 GitHub 链接
- [ ] 设置仓库描述和标签
- [ ] 添加 Topics: `koishi`, `koishi-plugin`, `lsnet`, `comfyui`

## 五、npm 准备

- [ ] 注册 npm 账号（如果还没有）
- [ ] 运行 `npm login` 登录
- [ ] 确认包名 `koishi-plugin-lsnet` 可用
- [ ] 设置 npm 2FA（推荐）

## 六、测试检查

- [x] example 目录依赖安装成功
- [ ] 在本地启动 example 测试实例
- [ ] 确认 ComfyUI LSNet API 可访问
- [ ] 测试图片识别功能
- [ ] 检查错误处理是否正常
- [ ] 验证日志输出

## 七、发布步骤

### 7.1 更新个人信息

在 `package.json` 中：

```json
{
  "author": "你的名字或GitHub用户名",
  "repository": {
    "url": "git+https://github.com/你的用户名/koishi-plugin-lsnet.git"
  }
}
```

在所有文档中搜索并替换 `yourusername` 为你的 GitHub 用户名。

### 7.2 初始化 Git 仓库

```bash
cd e:\Coding\vibecoding\lsnet
git init
git add .
git commit -m "Initial commit: koishi-plugin-lsnet v1.0.0"
```

### 7.3 推送到 GitHub

```bash
git remote add origin https://github.com/你的用户名/koishi-plugin-lsnet.git
git branch -M main
git push -u origin main
```

### 7.4 创建 GitHub Release

1. 进入仓库的 Releases 页面
2. 点击 "Create a new release"
3. Tag: `v1.0.0`
4. Title: `v1.0.0 - Initial Release`
5. 描述：复制 CHANGELOG.md 中的内容
6. 点击 "Publish release"

### 7.5 发布到 npm

```bash
# 检查将要发布的文件
npm pack --dry-run

# 发布
npm publish
```

### 7.6 验证发布

- 访问 npm 包页面：https://www.npmjs.com/package/koishi-plugin-lsnet
- 测试安装：`npm install koishi-plugin-lsnet`

## 八、发布后

- [ ] 更新 README 徽章链接
- [ ] 在 Koishi 论坛发布插件介绍
- [ ] 在相关社区宣传（可选）
- [ ] 准备后续版本的开发计划

## 九、持续维护

- [ ] 监控 GitHub Issues
- [ ] 响应用户反馈
- [ ] 定期更新依赖
- [ ] 跟进 Koishi 和 ComfyUI LSNet 的更新

---

## 快速命令参考

```bash
# 测试本地安装
cd example
npm install
npm start

# 构建 TypeScript（如果需要）
npm run build

# 检查包内容
npm pack --dry-run

# 发布到 npm
npm publish

# 更新版本号
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

## 注意事项

1. **首次发布前**务必在本地充分测试
2. **发布后无法撤回**，请谨慎操作
3. 确保所有敏感信息（如密钥、token）已从代码中移除
4. 版本号遵循语义化版本规范
5. 每次发布前更新 CHANGELOG.md

祝发布顺利！🎉
