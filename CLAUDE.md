# A-Level Hub — Claude 开发指南

帮助学生备考 A-Level 的 Web App（Pearson Edexcel IAL）。
主力用户 Kayla 自用备考。

---

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | React 18 + Vite + **Tailwind v4** + KaTeX，包管理 **bun**（禁止 npm/yarn） |
| 后端 | Hono.js + Bun，入口 `backend/src/index.js` |
| 数据库 | Supabase PostgreSQL（项目 ID `mozzqjeusrjuxycwpyld`），Drizzle ORM |
| 前端部署 | Vercel（alevel-math-app.vercel.app），推 main 自动触发 |
| 后端部署 | **Render**（alevel-math-app.onrender.com），推 main 自动触发 |

详细部署配置见 [DEPLOYMENT_CONFIG.md](DEPLOYMENT_CONFIG.md)。

---

## 支持学科（Chapter ID 前缀，新增必须遵守）

| 学科 | subjectId | 前缀 |
|------|-----------|------|
| Mathematics | mathematics | `p`/`s`/`m` |
| Economics | economics | `e` |
| History | history | `h` |
| **Politics** | politics | **`pol`**（不是 `p`，已修复冲突） |
| Psychology | psychology | `psy` |
| Further Math | further-math | `fm`/`fmech`/`fs` |

Chapter ID 格式：`{前缀}{单元号}c{章节号}`，例：`e2c3`、`pol1c2`

---

## 开发铁律（违反会导致 bug）

### ① apiClient 返回值

`src/utils/apiClient.js` 的 get/post/put/del 返回**解包后的 `data.data`**，不是 `{success, data}`。

```js
const questions = await apiClient.get('/api/questions')  // ✅ 直接用
if (result.success) { ... }  // ❌ result.success 不存在
```

### ② 样式规范（Tailwind + 内联共存）

**现状实录（2026-04-20）**：项目同时使用 **Tailwind v4** 和 **内联样式对象**，二者共存：

- **Tailwind**：`src/index.css` 有 `@import "tailwindcss"`，12 个组件用 `className="..."`（如 AuthPage / AnswerInput / Loading / Toast / ExamListPage 等）
- **内联样式对象**：8 个组件用 `const S = {...}` 或 `const styles = {...}`（主要是 `src/components/home/*` 和旧组件）

**不强制统一**，新组件按您的习惯选一种即可。但：
- 不要在同一组件里**混用** Tailwind + 内联（难读）
- 保留的 CSS 文件：`src/styles/animations.css` / `src/components/QuestionCard.css` / `src/components/AnswerInput.css` / `src/components/common/Loading.css` / `src/components/common/Toast.css`

### ③ 配色（Google Clean）

| 用途 | 色值 |
|------|------|
| 主色 | `#1a73e8` |
| 主文本 | `#202124` |
| 次文本 | `#5f6368` |
| 页面背景 | `#f8f9fa` |
| 卡片 | `#fff` / 边框 `#dadce0` |
| 成功/错误/警告 | `#188038` / `#d93025` / `#f9ab00` |

色值在 `src/index.css` 定义为 CSS 变量 + `tailwind.config.js` 的 primary palette。

### ④ 不要重复造轮子

| 功能 | 用这个 |
|------|--------|
| 登录/注册 | `AuthPage.jsx`（tab 切换） |
| 考试进行/结果 | `ExamTakingPage` / `ExamResultPage` |
| 错题本 | `WrongQuestionsPage`（`ErrorBookView` 已归档弃用） |
| 按钮 | `ui/Button.jsx` |
| 提示 | `Toast.success/error()` |
| 练习 | `PracticePage + practice/` 子组件 |

### ⑤ 替换即删除

新组件替代旧组件时，同一提交里必须删除旧文件和其 CSS。

---

## 项目结构

```
src/
├── main.jsx              # Vite 入口
├── App.jsx               # 顶层组件
├── AppRouter.jsx         # 路由（12 个懒加载页面）
├── alevel-math-app.jsx   # 主页外壳（懒加载组件，命名历史遗留）
├── components/
│   ├── home/             # 主页内嵌视图 Subjects/Curriculum/Chapter/Exam/MockExam
│   ├── practice/         # 练习页子组件
│   ├── exam/             # 考试页子组件
│   ├── charts/           # 图表组件
│   ├── common/           # Loading / Toast / 通用
│   └── ui/               # Button 等原子组件
├── contexts/AuthContext.jsx
├── data/                 # subjects/curriculum 等静态数据
├── hooks/useLocalStorage.js
├── utils/                # apiClient / translations / aiProviders
├── styles/animations.css
└── index.css             # Tailwind 入口 + CSS 变量

backend/
├── src/
│   ├── index.js          # Hono 入口（被 bun src/index.js 启动）
│   ├── routes/           # 14 个已注册路由模块
│   ├── services/         # AI / examGrader / promptBuilder / providers
│   ├── middleware/
│   ├── db/               # Drizzle schema + seed
│   ├── config/
│   └── utils/
├── tests/                # unit/ + integration（api/ + auth-flow/...）
├── data-import/          # 被 db/seed.js 使用，保留
├── uploads/              # 运行时用户上传，.gitkeep 占位
├── scripts/              # 少量运维脚本
└── docs: AI_PROVIDER_SETUP / API / DATABASE_SETUP / DEPLOYMENT / MIGRATION_GUIDE

specs/                    # 规约文档（保留 17 份核心，phase0-4 完成报告已归档 _archive/）
docs/                     # 普通文档（3 月开发日志已归档 _archive/sessions-2026-03/）
archive/                  # 历史归档（backup zip / 一次性脚本 / Railway 配置等）
pastpapers/               # 真题（gitignored，24MB）
```

---

## 测试

| 层 | 命令 | 位置 |
|----|------|------|
| 前端单测（vitest） | `npm test` / `npm run test:watch` | `src/**/*.test.js` |
| 后端单测（bun） | `cd backend && bun test tests/unit` | `backend/tests/unit/` |
| 后端集成测试 | `cd backend && bun test:integration` | `backend/tests/api/` `backend/tests/auth-flow.test.js` 等 |
| E2E（Playwright） | 本地手跑，**文件含凭证，全部 gitignored** | 根目录 `*.spec.js` + `playwright-*.config.js` |

---

## AI Provider（2026-04 实况）

后端 `backend/src/services/providers/` 统一注册，支持：
**claude / gemini / openai / glm / minimax / kimi / qwen**

- 默认 provider = `glm`（`glm-4-plus` 或 `glm-4-flash`）
- 用户可在前端 Settings 传入自己的 apiKey 覆盖默认
- `localStorage ai_settings` **已弃用**，AI 设置由服务端控制

---

## 提交前检查

1. `bun run build` 通过（无 ESLint 错误）
2. 新组件已在路由或其他组件中引用
3. 删除的组件无其他 import
4. Chapter ID 前缀符合学科约定
5. 无硬编码 API Key / 数据库密码

---

## 已知陷阱

| 问题 | 说明 |
|------|------|
| Politics ID | 前缀 `pol`，不是 `p` |
| apiClient | 直接返回 data，不是 `{success, data}` 包装 |
| subjects/chapters 缓存 | 后端 10 分钟缓存，改 DB 不会立即反映 |
| KaTeX | 公式用 `$...$` / `$$...$$`，AI prompt 要求输出 LaTeX |
| ChatPage | `/chat` 路由已移除（对话辅导功能停用） |
| AI 设置 | 服务端控制，`localStorage ai_settings` 已弃用 |
| 泄密历史 | 2026-03-07 commit `07e6b5a` 含早期 Supabase 密码，密码已知晓并独立管理 |

---

## 🎨 设计规范参考

进行任何 UI/UX 设计时，**必须**参考以下路径的行业设计规范：

**路径**：`D:\CodeProjects\awesome-design-md\design-md\`

该目录包含 60+ 家顶级产品的设计规范。本项目推荐优先参考：
- `apple` — 清晰、简洁的教育类界面规范
- `linear.app` — 信息层级与排版系统
- `notion` — 内容型页面的布局与卡片设计
- `vercel` — 现代 Dashboard 风格参考

**注意**：本项目已有既定配色（Google Clean），配色以 `③ 配色` 章节为准，用上述文档补充间距、字体、交互等细节。

---

## 规则

- 注释/文档/提交信息全部中文
- 不自动提交，除非用户明确要求
- 敏感信息存 `.env.local`（`.env*` 已 gitignored）
- 测试凭证文件（`e2e-test.spec.js` / `practice-*.spec.js` / `ux-full-test.spec.js`）已 gitignored
