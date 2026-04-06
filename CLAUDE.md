# Claude Code 指南

## 项目定位

**A-Level Hub**：帮助学生备考 A-Level 的 Web 应用（Pearson Edexcel IAL 体系）

- **目标用户**：A-Level 学生（AS/A2），备考数学、经济、历史、政治、心理、Further Math
- **核心价值**：结构化课程内容 + YouTube 视频 + AI 出题/评分/辅导
- **产品形态**：Web App（移动端适配），无原生 App

## 核心文档

**一切决策必须参考**：`.42cog/meta.md`（项目元数据）

**重大决策必须参考**：
- `.42cog/meta.md` - 项目元数据、产品定位、商业模式
- `.42cog/real.md` - 现实约束、安全规则
- `.42cog/cog.md` - 认知模型、实体关系

---

## 开发环境

| 项目 | 配置 |
|------|------|
| 语言 | JavaScript/JSX |
| 框架 | React 18 + Vite |
| 包管理 | **bun**（禁止用 npm/yarn） |
| Git 托管 | GitHub 私有仓库 |
| 测试 | Vitest |
| 前端部署 | Vercel |
| 后端部署 | Render（Hono.js + Bun） |
| 数据库 | Supabase PostgreSQL（Drizzle ORM） |

---

## 部署配置

| 层 | 平台 | URL |
|----|------|-----|
| 前端 | Vercel | alevel-math-app.vercel.app |
| 后端 | Render | （见 .env.local 的 VITE_API_BASE） |
| 数据库 | Supabase | 项目 ID: mozzqjeusrjuxycwpyld |

- **自动部署**：推送到 main 分支自动触发 Vercel 构建
- **构建命令**：`bun run build`
- **输出目录**：`dist`
- **vite.config.js** 的 `base` 必须为 `/`
- GitHub Pages 已禁用（私有仓库限制）

---

## 支持学科（6 门）

| 学科 | subjectId | Chapter ID 前缀 | 说明 |
|------|-----------|----------------|------|
| Mathematics | mathematics | `p`（Pure）`s`（Statistics）`m`（Mechanics） | P1-P4+S1+M1，约50章 |
| Economics | economics | `e` | Unit1-4，24章 |
| History | history | `h` | Unit1-4，22章 |
| Politics | politics | `pol`（**注意：不是 `p`**） | Unit1-4，11章 |
| Psychology | psychology | `psy` | Unit1-4，14章 |
| Further Math | further-math | `fm`/`fmech`/`fs` | 多模块，约8章 |

**警告**：Math 用 `p` 前缀（Pure），Politics 历史上也用 `p` 导致 ID 碰撞，已于 2026-03-28 修复为 `pol`。新增章节时必须遵守上表前缀。

Chapter ID 格式：`{前缀}{单元号}c{章节号}`，例：`e2c3`、`pol1c2`、`p1c1`。

---

## 快速命令

```bash
# 安装依赖
bun install

# 本地开发（端口 3000）
bun run dev

# 构建生产版本
bun run build

# 预览构建结果
bun run preview

# 运行测试
bun run test

# 代码检查
bun run lint
```

---

## 项目结构

```
/
├── src/                        # 前端源码
│   ├── AppRouter.jsx           # 路由配置（React.lazy 代码分割）
│   ├── alevel-math-app.jsx     # 主页组件（SubjectsView/CurriculumView 等）
│   ├── components/             # React 组件
│   │   ├── （根目录）          # 主要页面组件直接放这里（ExamListPage/ExamTakingPage/AuthPage 等）
│   │   ├── home/               # 主页子视图（SubjectsView/CurriculumView/ChapterView 等）
│   │   ├── practice/           # 练习子组件（PracticeSetup/PracticeView/PracticeQuestion 等）
│   │   ├── exam/               # 考试子组件（ScoreCard/AIFeedback）
│   │   ├── common/             # 通用组件（Toast/Loading）
│   │   ├── charts/             # 图表组件
│   │   ├── views/              # 视图组件
│   │   └── ui/                 # UI 基础组件（Button/Card/Input）
│   ├── contexts/               # React Context（AuthContext）
│   ├── data/                   # 静态数据
│   │   ├── curriculum.js       # 课程数据（~1580行，各科章节/知识点）
│   │   └── subjects.js         # 学科列表
│   ├── hooks/                  # 自定义 hooks（useAuth 等）
│   ├── styles/                 # 仅保留这几个 CSS 文件（见样式规范）
│   └── utils/
│       ├── apiClient.js        # 统一 API 客户端（重要，见下）
│       └── constants.js        # API_BASE 等常量
├── backend/
│   └── src/
│       ├── index.js            # Hono.js 入口，中间件链注册
│       ├── routes/             # 16 个路由模块
│       ├── services/           # 业务逻辑（AI、练习、考试等）
│       ├── middleware/         # 中间件（auth/csrf/cache/security 等）
│       └── db/
│           ├── schema.js       # Drizzle ORM 表定义（16张表）
│           └── index.js        # 数据库连接
├── specs/                      # 规约文档（PRD/设计/实现计划）
├── docs/                       # 普通文档和研究资料
└── .42cog/                     # 认知敏捷法文档（meta/real/cog）
```

---

## 路由清单

| 路径 | 组件 | 权限 |
|------|------|------|
| `/` | `ALevelMathApp` | 公开 |
| `/login` `/register` | `AuthPage`（tab 切换） | 公开 |
| `/profile` | `UserProfilePage` | 需登录 |
| `/practice` | `PracticePage` | 需登录 |
| `/exams` | `ExamListPage` | 需登录 |
| `/exams/create` | `ExamCreatePage` | 需登录 |
| `/exams/:examId/take` | `ExamTakingPage` | 需登录 |
| `/exams/:examId/result` | `ExamResultPage` | 需登录 |
| `/learning-plan` | `LearningPlanPage` | 需登录 |
| `/wrong-questions` | `WrongQuestionsPage` | 需登录 |
| `/chat` | `ChatPage` | 需登录（入口当前隐藏） |
| `/questions/upload` | `QuestionUploadPage` | 管理员 |

---

## 架构说明

### 前端认证
- JWT 存于 **httpOnly Cookie**（浏览器自动携带，JS 无法读取）
- 用户信息缓存在 `sessionStorage['auth_user']`
- CSRF token 缓存在 `sessionStorage['csrf_token']`，由 apiClient 自动处理
- 通过 `useAuth()` hook（`src/contexts/AuthContext.jsx`）访问当前用户

### apiClient（`src/utils/apiClient.js`）

**极重要规则**：`get()` / `post()` / `put()` / `del()` 返回的是**解包后的 `data.data`**，不是原始响应。

```js
// ✅ 正确
const questions = await apiClient.get('/api/questions')

// ❌ 错误——永远不要这样写
const result = await apiClient.get('/api/questions')
if (result.success) { ... }  // result.success 不存在
```

其他特性：
- 自动附加 CSRF token 请求头
- 网络错误自动重试（默认2次，间隔1s递增）
- 默认30秒超时
- 401 自动跳转 `/login` 并记录 redirect
- CSRF 失效自动刷新 token 并重试一次

### 后端中间件链

```
errorHandler → performanceMonitor → securityHeaders → requestSizeLimit(5MB)
→ logger → cors → rateLimiter（全局100/15min，登录20/15min，注册5/15min）
→ authMiddleware → csrfProtection
```

`/api/auth`、`/api/subjects`、`/api/chapters` 无需认证。其余所有 `/api/*` 需要 `authMiddleware` + `csrfProtection`。

`subjects` 和 `chapters` 路由有 **10 分钟内存缓存**。

### 后端 API 路由（17 个模块）

```
/api/auth              用户认证（登录/注册/登出/刷新token）
/api/users             用户信息管理
/api/subjects          学科列表（含缓存）
/api/chapters          章节数据（含缓存）
/api/questions         题目 CRUD
/api/practice          章节练习（混合题源：题库优先+AI补题）
/api/exams             考试管理
/api/question-sets     题集管理
/api/user-answers      用户答题记录
/api/wrong-questions   错题本
/api/progress          学习进度
/api/learning-plans    AI 学习计划
/api/recommendations   AI 学习推荐
/api/chat/sessions     对话会话
/api/chat/messages     对话消息
/api/questions/upload  题库上传（管理员）
/api/ai                AI 直接调用端点
```

### 数据库表（19 张）

```
subjects → units → chapters
users → userProfiles → userStats
questions → questionSets → userAnswers
exams → examQuestionResults → learningRecommendations
chatSessions → chatMessages → chatContexts → aiConversations
learningProgress / userKnowledgeGraph / uploadedDocuments
```

---

## AI 能力

| 模块 | 文件 | 说明 |
|------|------|------|
| AI 客户端 | `backend/src/services/aiClient.js` | 统一入口，路由到各 provider |
| 出题引擎 | `backend/src/services/practiceService.js` | 三层 Prompt |
| 答案评分 | `backend/src/services/answerGrader.js` | 支持主观题 AI 判分 |
| 考试分析 | `backend/src/services/examAnalyzer.js` | 考后综合分析 |
| 学习推荐 | `backend/src/services/recommendationService.js` | 基于错题推荐 |
| 对话辅导 | `backend/src/services/contextManager.js` | 会话上下文管理 |

**AI Provider 支持**（`backend/src/services/providers/`）：
- 默认：GLM-4-Plus（智谱，国内访问稳定）
- 可切换：Claude / Gemini / OpenAI / MiniMax / Kimi / Qwen

**三层 Prompt 架构**（出题引擎）：
1. `SUBJECT_PROFILES` — 学科角色（Edexcel IAL 考官身份 + 命题规范）
2. 章节知识库 — `keyPoints` / `hardPoints` / `examTips`（来自 `curriculum.js`）
3. 题型配比 — MCQ / 计算题（calculation）/ 简答题（short_answer）

**AI 设置**：完全服务端控制，前端 localStorage `ai_settings` 字段已弃用。

---

## 规则

- **语言**：代码注释、文档、提交信息、沟通**全部使用中文**
- **文件名**：默认英文命名
- **Git**：不自动提交，除非用户明确要求
- **敏感信息**：存 `.env.local`，绝不保存在 Git 仓库中
- **部署**：推送到 main 分支会自动触发 Vercel 部署

---

## 代码质量

- SOLID / DRY 原则
- 禁止 TODO 或临时方案，遇到时停下重新设计
- 死代码直接删除
- 开工前充分分析

---

## 开发铁律（跨对话必读）

### 替换即删除
新组件替代旧组件时，**必须在同一次提交里删除旧文件和对应的 CSS**。不留"万一以后用"的死代码。

### apiClient 返回值
`src/utils/apiClient.js` 的 `get()`/`post()`/`put()`/`del()` 返回的是**解包后的 `data.data`**，不是 `{success, data, error}` 原始响应。直接用返回值，不要写 `if (result.success)`。

### 样式规范
- 全站统一用**内联样式对象**（`const S = { page: {...}, card: {...} }`）
- **不新建 CSS 文件**，不用 Tailwind 类名（Tailwind JIT 有 purge 问题）
- 仅保留的 CSS：
  - `src/styles/animations.css`
  - `src/styles/QuestionCard.css`
  - `src/styles/AnswerInput.css`
  - `src/components/common/Loading.css`
  - `src/components/common/Toast.css`

### 配色体系（Google Clean）

| 用途 | 色值 |
|------|------|
| 主色 | `#1a73e8` |
| 主文本 | `#202124` |
| 次文本 | `#5f6368` |
| 页面背景 | `#f8f9fa` |
| 卡片表面 | `#fff` |
| 边框 | `#dadce0` |
| 成功 | `#188038` |
| 错误 | `#d93025` |
| 警告 | `#f9ab00` |
| 悬停背景 | `#f1f3f4` |
| 选中背景 | `#e8f0fe` |

不引入这个色板之外的颜色。

### Toast 使用
```js
import Toast from './common/Toast'
Toast.success('操作成功')
Toast.error('操作失败')
```
不要自己定义假 Toast 对象。

### 组件现状（避免重复造轮子）

| 功能 | 现有组件 | 不要再建 |
|------|---------|---------|
| 登录+注册 | `AuthPage.jsx`（tab 切换） | LoginPage、RegisterPage |
| 考试进行 | `ExamTakingPage.jsx` | ExamPage |
| 考试结果 | `ExamResultPage.jsx` | ResultPage |
| 按钮 | `ui/Button.jsx`（内联样式） | 新的 Button 组件 |
| 练习 | `PracticePage.jsx` + `practice/` 子组件 | 独立的 Quiz 页面 |
| 主页子视图 | `home/` 目录下各 View | 在主组件里内联 |

### 提交前检查清单
1. `bun run build` 必须通过（无 TypeScript/ESLint 错误）
2. 新建的组件必须在路由或其他组件中实际引用
3. 删除的组件必须确认无其他文件 import 它
4. Chapter ID 前缀必须符合学科约定（见学科表）
5. 不得在代码中硬编码 API Key 或数据库连接串

---

## 已知陷阱

| 问题 | 说明 |
|------|------|
| Politics chapter ID | 前缀是 `pol`，不是 `p`（与 Math Pure 冲突已修复） |
| apiClient 返回值 | 直接是 data，不是 `{success, data}` 包装 |
| subjects/chapters 缓存 | 后端有10分钟缓存，修改数据库后不会立即反映 |
| 题库几乎为空 | 大多数章节无预存题目，练习为纯题库模式（无AI补题），需加速题库预生成 |
| ChatPage 入口隐藏 | `/chat` 路由存在但 Navbar 未显示入口 |
| KaTeX 渲染 | 数学公式用 `$...$` 内联或 `$$...$$` 块级，后端 AI prompt 要求输出 LaTeX |

---

## 自动化

- 使用 Makefile targets，不创建 shell 脚本

## 文档

- 规约文档：`./specs/{feature}-{type}.md`
- 普通文档：`./docs/`
- 深度研究：`./docs/research/`
- 同步更新 `index.md`
