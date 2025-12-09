# 快速开始指南

## 📦 一键部署到 GitHub Pages

### 步骤 1: Fork 或 Clone 仓库

```bash
git clone https://github.com/fuck-algorithm/leetcode-56-merge-intervals.git
cd leetcode-56-merge-intervals
```

### 步骤 2: 安装依赖

```bash
npm install
```

### 步骤 3: 本地测试

```bash
npm start
```

访问 http://localhost:49406 查看效果

### 步骤 4: 配置 GitHub Pages

1. 将代码推送到你的 GitHub 仓库
2. 进入仓库设置：**Settings** → **Pages**
3. Source 选择：**GitHub Actions**
4. 保存设置

### 步骤 5: 推送代码触发部署

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 步骤 6: 查看部署状态

1. 进入仓库的 **Actions** 标签页
2. 查看 "Deploy to GitHub Pages" workflow 运行状态
3. 等待部署完成（通常 1-2 分钟）

### 步骤 7: 访问网站

部署成功后访问：
```
https://你的用户名.github.io/leetcode-56-merge-intervals/
```

## 🔄 后续更新

每次修改代码后：

```bash
git add .
git commit -m "你的更新说明"
git push origin main
```

GitHub Actions 会自动构建和部署！

## ⚡️ 手动触发部署

不修改代码也可以手动触发部署：

1. 进入 **Actions** 标签页
2. 选择 **Deploy to GitHub Pages**
3. 点击 **Run workflow** → **Run workflow**

## 🛠️ 自定义配置

### 修改仓库名称

如果你修改了仓库名称，需要相应更新：

1. **package.json** 中的 `homepage` 字段（可选）
2. README.md 中的链接地址

### 修改分支名称

如果你的主分支不是 `main`，修改 `.github/workflows/deploy.yml`：

```yaml
on:
  push:
    branches:
      - main  # 改为你的分支名，如 master
```

## 📊 查看部署历史

在仓库主页右侧可以看到 **Deployments** 部分，点击可查看所有部署历史。

## 🐛 常见问题

### Q: 部署后页面是空白的
A: 检查浏览器控制台的错误信息，确保 `homepage` 配置正确

### Q: Actions 运行失败
A: 查看错误日志，通常是依赖安装或构建失败，尝试本地运行 `npm run build` 排查

### Q: 更新没有生效
A: 等待 1-2 分钟，或清除浏览器缓存后刷新

### Q: 如何查看构建日志
A: Actions 页面 → 点击具体的 workflow 运行 → 查看详细步骤和日志

## 📝 开发建议

1. **本地测试**：推送前先本地运行确保没有错误
2. **提交信息**：使用有意义的 commit message
3. **分支管理**：大功能开发可以使用 feature 分支
4. **代码审查**：团队协作时使用 Pull Request

## 🎯 下一步

- 自定义样式和功能
- 添加更多算法可视化
- 优化性能和用户体验
- 分享给更多人使用

## 📚 相关文档

- [完整部署文档](./DEPLOYMENT.md)
- [项目 README](./README.md)
- [GitHub Actions 文档](https://docs.github.com/actions)
- [GitHub Pages 文档](https://docs.github.com/pages)
