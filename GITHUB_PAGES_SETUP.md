# GitHub Pages 配置指南

## ⚠️ 重要：必须手动启用 GitHub Pages

虽然我们已经配置了 GitHub Actions，但 GitHub Pages 需要在仓库设置中手动启用。

## 📋 配置步骤

### 1. 进入仓库设置

访问：https://github.com/fuck-algorithm/leetcode-56-merge-intervals/settings/pages

或者：
1. 打开仓库主页
2. 点击 **Settings** (设置)
3. 左侧菜单找到 **Pages**

### 2. 配置 Source

在 **Build and deployment** 部分：

1. **Source** 下拉菜单选择：**GitHub Actions** 
   - ⚠️ 不要选择 "Deploy from a branch"
   - ✅ 必须选择 "GitHub Actions"

2. 点击 **Save** (如果有保存按钮)

### 3. 验证配置

配置完成后应该看到：

```
✓ Your site is live at https://fuck-algorithm.github.io/leetcode-56-merge-intervals/
```

### 4. 触发部署

配置完成后，有两种方式触发部署：

**方法1：手动触发（推荐）**
1. 进入 **Actions** 标签页
2. 选择 "Deploy to GitHub Pages" workflow
3. 点击 **Run workflow** 按钮
4. 点击绿色的 **Run workflow** 确认

**方法2：推送代码**
```bash
git commit --allow-empty -m "trigger: 触发部署"
git push origin main
```

### 5. 等待部署完成

1. 在 **Actions** 页面查看运行状态
2. 等待两个作业完成：
   - ✅ build (构建项目)
   - ✅ deploy (部署到Pages)
3. 通常需要 1-2 分钟

### 6. 访问网站

部署成功后访问：
```
https://fuck-algorithm.github.io/leetcode-56-merge-intervals/
```

## ✅ 检查清单

确认以下配置都正确：

- [x] `.github/workflows/deploy.yml` 文件存在
- [x] `package.json` 中 `homepage` 配置正确
- [x] `public/index.html` 文件已提交
- [ ] GitHub Pages 设置为 "GitHub Actions" ⚠️ **需要手动配置**
- [ ] GitHub Actions workflow 已成功运行
- [ ] 网站可以访问

## 🐛 故障排查

### 问题1: 404 Not Found

**可能原因：**
- GitHub Pages 没有正确配置为使用 GitHub Actions
- 部署还在进行中

**解决方案：**
1. 检查 Settings → Pages → Source 是否为 "GitHub Actions"
2. 查看 Actions 页面确认部署是否成功
3. 等待 2-5 分钟让 DNS 更新

### 问题2: Actions 运行失败

**解决方案：**
1. 查看 Actions 页面的错误日志
2. 确认 `public/index.html` 文件存在
3. 本地运行 `npm run build` 测试

### 问题3: 页面空白

**可能原因：**
- JavaScript 路径错误
- `homepage` 配置不正确

**解决方案：**
1. 检查浏览器控制台错误
2. 确认 `package.json` 中 `homepage` 为：
   ```json
   "homepage": "https://fuck-algorithm.github.io/leetcode-56-merge-intervals"
   ```

## 📊 当前配置状态

### ✅ 已完成
- GitHub Actions workflow 配置
- package.json homepage 配置
- 本地构建测试通过
- 所有必需文件已提交

### ⏳ 待完成
- GitHub Pages 手动配置（Settings → Pages → Source → GitHub Actions）
- 首次部署运行
- 网站访问验证

## 🔗 相关链接

- 仓库地址：https://github.com/fuck-algorithm/leetcode-56-merge-intervals
- Actions 页面：https://github.com/fuck-algorithm/leetcode-56-merge-intervals/actions
- Pages 设置：https://github.com/fuck-algorithm/leetcode-56-merge-intervals/settings/pages
- 目标网址：https://fuck-algorithm.github.io/leetcode-56-merge-intervals/

## 📝 下一步

1. **立即执行**：访问 Settings → Pages，选择 "GitHub Actions"
2. **触发部署**：手动运行 workflow 或推送代码
3. **验证结果**：等待部署完成后访问网站
