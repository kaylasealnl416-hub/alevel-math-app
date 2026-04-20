# A-Level Hub

帮助学生系统化备考 A-Level 的 Web 应用（Pearson Edexcel IAL）。

- **生产**：https://alevel-math-app.vercel.app
- **后端**：https://alevel-math-app.onrender.com

---

## 项目定位

- **目标用户**：A-Level 学生，需要系统化学习数学、经济、历史、政治、心理学、进阶数学
- **核心价值**：结构化课程内容 + YouTube 视频整合 + AI 练习 + 错题本 + 模拟考试
- **技术架构**：React 18 + Vite + Tailwind + KaTeX（前端）· Hono.js + Bun + Drizzle + Supabase（后端）

---

## 功能

- 📚 6 学科完整大纲（Math / Further Math / Economics / History / Politics / Psychology）
- 🎥 YouTube 视频资源整合
- ✍️ AI 生成练习题（多家 LLM：GLM / Claude / Gemini / Qwen / MiniMax 等）
- 🎯 限时考试模式 + 自动批改
- 📋 Past Papers 模拟试卷
- 📕 错题本
- 🌐 中英双语

---

## 快速开始

```bash
# 前端（根目录）
bun install
bun run dev         # http://localhost:3000

# 后端（新开终端）
cd backend
bun install
bun run dev         # http://localhost:4000

# 生产构建
bun run build
```

### 环境变量

复制 `.env.example` → `.env.local`，按提示填写。详细见 [DEPLOYMENT_CONFIG.md](DEPLOYMENT_CONFIG.md)。

---

## 项目结构

```
├── src/              # React 前端
│   ├── components/   # UI 组件（home/exam/practice/common/ui）
│   ├── contexts/     # AuthContext
│   ├── data/         # 学科大纲等静态数据
│   ├── hooks/
│   └── utils/        # apiClient / translations / aiProviders
├── backend/          # Hono.js API
│   ├── src/          # 真正入口 src/index.js
│   ├── tests/        # unit + integration 测试
│   └── data-import/  # db seed 数据源
├── specs/            # 规约文档（phase 报告已归档 _archive/）
├── docs/             # 普通文档（3 月历史已归档 _archive/）
├── archive/          # 历史归档
└── pastpapers/       # 真题（gitignored）
```

---

## 部署

- **前端**：Vercel，main 分支自动部署
- **后端**：Render，main 分支自动部署
- **数据库**：Supabase PostgreSQL

详细配置、环境变量、故障排查见 [DEPLOYMENT_CONFIG.md](DEPLOYMENT_CONFIG.md)。

---

## 测试

```bash
# 前端
npm test

# 后端
cd backend && bun test tests/unit
cd backend && bun run test:integration
```

---

## 文档

- [开发指南（Claude）](./CLAUDE.md)
- [开发指南（Codex）](./AGENTS.md)
- [部署配置](./DEPLOYMENT_CONFIG.md)
- [规约索引](./specs/index.md)
- [普通文档索引](./docs/index.md)
