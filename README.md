# A-Level Math App

帮助学生学习 A-Level 数学及其他科目的 Web 应用。

## 项目定位

- **目标用户**：A-Level 学生，需要系统化学习数学、经济、历史等科目
- **核心价值**：提供结构化的课程内容和 YouTube 视频资源整合
- **技术架构**：React 18 + Vite + KaTeX

## 功能特性

- 📚 完整的课程大纲（数学、经济、历史、政治、心理学等）
- 🎥 YouTube 视频资源整合
- ✍️ AI 生成练习题（支持 Anthropic Claude 和 Zhipu AI）
- 🎯 限时考试模式
- 📋 模拟试卷（Past Paper Mock Exams）
- 📕 错题本
- 🌐 中英文双语支持

## 快速开始

```bash
# 安装依赖
bun install

# 启动开发服务器
bun run dev

# 构建生产版本
bun run build
```

## 项目结构

```
├── src/              # 源代码
│   ├── components/   # React 组件
│   ├── data/         # 数据文件
│   └── hooks/        # 自定义 Hooks
├── specs/            # 规约文档
├── docs/             # 普通文档
├── demo/             # 示例代码
└── CLAUDE.md         # Claude Code 配置
```

## 部署

本项目部署在 Vercel，每次推送到 main 分支会自动触发部署。

## 文档

- [规约文档索引](./specs/index.md)
- [普通文档索引](./docs/index.md)
- [Claude Code 指南](./CLAUDE.md)
