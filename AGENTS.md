# A-Level Hub — Codex 开发指南

帮助学生备考 A-Level 的 Web App（Pearson Edexcel IAL）。

> **本文定位**：Codex CLI 的单项目指南。主规则与 Claude Code 共享，见 [CLAUDE.md](CLAUDE.md) 全文。
> Codex 与 Claude Code 的职责边界（Codex 只做审查/测试/报告，不写主线）见 `../AGENTS.md`。

---

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | React 18 + Vite + Tailwind v4 + KaTeX，包管理 **bun** |
| 后端 | Hono.js + Bun（入口 `backend/src/index.js`） |
| 数据库 | Supabase PostgreSQL，Drizzle ORM |
| 前端部署 | Vercel（alevel-math-app.vercel.app） |
| 后端部署 | **Render**（alevel-math-app.onrender.com） |

---

## 开发铁律

- `apiClient` 返回解包后的 `data.data`，不是 `{success, data}`
- Tailwind + 内联样式对象**共存**，新组件二选一，不要同组件混用
- 配色用 Google Clean（主色 `#1a73e8`，背景 `#f8f9fa`）
- Chapter ID 前缀有学科约定，Politics 用 `pol` 不是 `p`
- 替换即删除：新组件替代旧组件时，同一提交里删旧文件

---

## 审查重点

1. **API 调用**：grep `if (result.success)` 这类误读 apiClient 的反模式
2. **样式**：新组件不应同时用 Tailwind className + 内联 styles 对象
3. **Chapter ID**：新增章节的 ID 前缀必须与 CLAUDE.md § 支持学科对齐
4. **安全**：API key / 数据库密码 / JWT secret 不得硬编码
5. **替换未删**：grep 删除 PR 是否漏删相应 CSS 或弃用组件

---

## 测试命令

```bash
# 前端（vitest）
npm test

# 后端单测（bun）
cd backend && bun test tests/unit

# 后端集成
cd backend && bun run test:integration
```

---

## 🎨 设计规范参考

进行任何 UI/UX 审查时，**必须**参考 `D:/CodeProjects/awesome-design-md/design-md/`。
本项目推荐优先参考：`apple` / `linear.app` / `notion` / `vercel`。
配色以 CLAUDE.md § ③ 为准，用上述文档补充间距、字体、交互细节。

---

## 规则

- 注释/文档/提交信息全部中文
- 不自动提交，除非用户明确要求
- 敏感信息存 `.env.local`，不进 Git
- 审查报告存 `specs/` 或 `docs/specs/`，按 `YYYY-MM-DD-codex-{review|test}-{主题}.md` 命名
