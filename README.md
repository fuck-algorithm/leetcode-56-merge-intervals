# LeetCode 56 - 合并区间 算法可视化

![Deploy Status](https://github.com/fuck-algorithm/leetcode-56-merge-intervals/actions/workflows/deploy.yml/badge.svg)

这是一个基于 React 的交互式算法可视化项目，用于演示 LeetCode 第 56 题「合并区间」的解题过程。

## 在线演示

**🌐 [查看在线演示](https://fuck-algorithm.github.io/leetcode-56-merge-intervals/)**

> 💡 项目使用 GitHub Actions 自动部署，每次推送到 main 分支后会自动更新线上版本。

## 功能特性

- 📊 **可视化展示**：直观展示区间合并的每个步骤
- 🎨 **多彩色编码**：不同合并结果使用不同颜色，清晰追踪合并关系
- 📏 **智能数轴**：动态刻度、端点显示、连接线、多轨道布局
- 🎮 **交互控制**：支持播放/暂停、单步执行、速度调节
- ⌨️ **键盘快捷键**：
  - `空格` - 播放/暂停
  - `←` - 上一步
  - `→` - 下一步
  - `R` - 重置
- 🎯 **多种示例**：内置力扣官方示例和多种测试用例
- 🌐 **双语支持**：支持中文和英文界面切换
- 🔊 **语音讲解**：使用 Web Speech API 播报算法步骤（默认开启）
- 📱 **响应式设计**：单屏展示，无需滚动

## 本地开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

在浏览器中打开 [http://localhost:49406](http://localhost:49406) 查看应用。

> ⚠️ 注意：本项目使用端口 49406（严禁修改），这是在 `.env` 文件中配置的。

### 构建生产版本

```bash
npm run build
```

构建后的文件将输出到 `build` 目录。

## 算法说明

合并区间的算法步骤：

1. **排序**：按照区间的起始位置对所有区间进行排序
2. **初始化**：选择第一个区间作为当前区间
3. **遍历合并**：
   - 如果当前区间与下一个区间重叠，则合并它们（更新结束位置）
   - 如果不重叠，则将当前区间添加到结果中，并将下一个区间设为当前区间
4. **完成**：将最后一个区间添加到结果中

时间复杂度：O(n log n)，主要消耗在排序上  
空间复杂度：O(n)，用于存储结果

## 技术栈

- React 18
- CSS3 (响应式设计)
- JavaScript ES6+

## 部署

本项目配置了 GitHub Actions 自动部署到 GitHub Pages。

- **自动部署**：推送到 `main` 分支时自动触发
- **手动部署**：在 Actions 页面手动触发 workflow
- **部署文档**：查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解详细配置

## 相关链接

- [LeetCode 题目](https://leetcode.cn/problems/merge-intervals/)
- [返回 Hot 100 列表](https://fuck-algorithm.github.io/leetcode-hot-100/)

## 题目难度

**🟠 中等** - 数组 | 排序

## 许可证

MIT License
