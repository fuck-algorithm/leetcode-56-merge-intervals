# GitHub Pages 自动部署配置

本项目已配置 GitHub Actions 自动部署到 GitHub Pages。

## 部署流程

### 1. 启用 GitHub Pages

在 GitHub 仓库设置中启用 GitHub Pages：

1. 进入仓库的 **Settings** → **Pages**
2. 在 **Source** 下拉菜单中选择 **GitHub Actions**
3. 保存设置

### 2. 自动部署

配置完成后，每次推送代码到 `main` 分支时，GitHub Actions 会自动：

1. ✅ 检出代码
2. ✅ 安装 Node.js 和依赖
3. ✅ 构建 React 应用
4. ✅ 部署到 GitHub Pages

### 3. 手动触发部署

也可以在 GitHub 仓库的 **Actions** 页面手动触发部署：

1. 进入 **Actions** 标签页
2. 选择 **Deploy to GitHub Pages** workflow
3. 点击 **Run workflow** 按钮

## 访问地址

部署成功后，可以通过以下地址访问：

```
https://fuck-algorithm.github.io/leetcode-56-merge-intervals/
```

或者在仓库的 GitHub Pages 设置页面查看实际的部署地址。

## 部署状态

可以在以下位置查看部署状态：

- **Actions 页面**：查看构建和部署日志
- **Deployments**：在仓库主页右侧边栏查看部署历史
- **徽章**：可以添加部署状态徽章到 README

## 配置文件说明

### `.github/workflows/deploy.yml`

GitHub Actions 工作流配置文件，包含：

- **触发条件**：推送到 main 分支或手动触发
- **构建步骤**：安装依赖、构建项目
- **部署步骤**：上传到 GitHub Pages

### `package.json`

确保包含以下配置：

```json
{
  "homepage": ".",
  "scripts": {
    "build": "react-scripts build"
  }
}
```

## 注意事项

1. **分支名称**：确保主分支名称是 `main`，如果是 `master` 需要修改 workflow 文件
2. **构建时间**：首次部署可能需要几分钟
3. **缓存**：浏览器可能会缓存旧版本，可以使用硬刷新（Ctrl+F5 或 Cmd+Shift+R）
4. **端口配置**：GitHub Pages 使用默认端口，`.env` 中的 `PORT=49406` 仅用于本地开发

## 本地测试构建

在推送前可以本地测试构建：

```bash
# 构建项目
npm run build

# 本地预览构建结果（需要安装 serve）
npx serve -s build
```

## 故障排查

### 构建失败

1. 检查 Actions 页面的错误日志
2. 确保所有依赖都在 `package.json` 中
3. 本地运行 `npm run build` 测试

### 页面空白

1. 检查 `homepage` 配置是否正确
2. 查看浏览器控制台是否有错误
3. 确认静态资源路径正确

### 更新未生效

1. 等待 1-2 分钟让部署完成
2. 清除浏览器缓存
3. 检查 Actions 是否成功运行

## 开发工作流

推荐的开发和部署流程：

```bash
# 1. 本地开发
npm start

# 2. 测试功能
# 访问 http://localhost:49406

# 3. 提交代码
git add .
git commit -m "功能更新"

# 4. 推送到 GitHub（自动触发部署）
git push origin main

# 5. 等待部署完成
# 在 Actions 页面查看进度

# 6. 访问线上地址验证
# https://fuck-algorithm.github.io/leetcode-56-merge-intervals/
```

## 环境变量

本地开发和生产环境使用不同的配置：

- **本地开发**：使用 `.env` 文件，端口 49406
- **生产环境**：GitHub Pages 自动配置，使用标准 HTTPS

## 更新日志

部署配置会在 Actions 页面自动记录每次部署的时间和提交信息。
