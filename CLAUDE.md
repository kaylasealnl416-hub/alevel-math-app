# A-Level Hub — Claude 开发指南

帮助学生备考 A-Level 的 Web App（Pearson Edexcel IAL）。
核心文档参考 `.42cog/meta.md`（定位）/ `.42cog/real.md`（约束）/ `.42cog/cog.md`（实体关系）

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | React 18 + Vite，包管理 **bun**（禁止 npm/yarn） |
| 后端 | Hono.js + Bun，部署 Render |
| 数据库 | Supabase PostgreSQL，Drizzle ORM，项目 ID: mozzqjeusrjuxycwpyld |
| 前端部署 | Vercel（alevel-math-app.vercel.app），推送 main 自动触发 |

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

## 开发铁律（违反会导致 bug）

**① apiClient 返回值**
`src/utils/apiClient.js` 的 get/post/put/del 返回**解包后的 `data.data`**，不是 `{success, data}`。
```js
const questions = await apiClient.get('/api/questions')  // ✅ 直接用
if (result.success) { ... }  // ❌ result.success 不存在
```

**② 样式规范**
- 全站用内联样式对象 `const S = { page: {...} }`
- 禁止新建 CSS 文件，禁止 Tailwind 类名
- 仅保留：`animations.css` / `QuestionCard.css` / `AnswerInput.css` / `Loading.css` / `Toast.css`

**③ 配色（Google Clean，不引入色板外颜色）**

| 用途 | 色值 |
|------|------|
| 主色 | `#1a73e8` |
| 主文本 | `#202124` |
| 次文本 | `#5f6368` |
| 页面背景 | `#f8f9fa` |
| 卡片 | `#fff` / 边框 `#dadce0` |
| 成功/错误/警告 | `#188038` / `#d93025` / `#f9ab00` |

**④ 不要重复造轮子**

| 功能 | 用这个 |
|------|--------|
| 登录/注册 | `AuthPage.jsx`（tab 切换） |
| 考试进行/结果 | `ExamTakingPage` / `ExamResultPage` |
| 按钮 | `ui/Button.jsx` |
| 提示 | `Toast.success/error()` |
| 练习 | `PracticePage + practice/` 子组件 |

**⑤ 替换即删除**：新组件替代旧组件时，同一提交里必须删除旧文件和其 CSS。

## 提交前检查

1. `bun run build` 通过（无 ESLint 错误）
2. 新组件已在路由或其他组件中引用
3. 删除的组件无其他 import
4. Chapter ID 前缀符合学科约定
5. 无硬编码 API Key

## 已知陷阱

| 问题 | 说明 |
|------|------|
| Politics ID | 前缀 `pol`，不是 `p` |
| apiClient | 直接返回 data，不是 `{success, data}` 包装 |
| subjects/chapters 缓存 | 后端 10 分钟缓存，改 DB 不会立即反映 |
| KaTeX | 公式用 `$...$` / `$$...$$`，AI prompt 要求输出 LaTeX |
| ChatPage | `/chat` 路由存在但 Navbar 未显示入口 |
| AI 设置 | 服务端控制，`localStorage ai_settings` 已弃用 |

## 规则

- 注释/文档/提交信息全部中文
- 不自动提交，除非用户明确要求
- 敏感信息存 `.env.local`，不进 Git
