# 系统架构文档 — A-Level Hub

> 最后更新：2026-04-17  
> 适用版本：v1.5.0（commit 18de15c）

---

## 目录

1. [整体架构图](#1-整体架构图)
2. [技术栈一览](#2-技术栈一览)
3. [前端架构](#3-前端架构)
4. [后端架构](#4-后端架构)
5. [数据库架构](#5-数据库架构)
6. [AI 服务层](#6-ai-服务层)
7. [安全体系](#7-安全体系)
8. [部署架构](#8-部署架构)
9. [数据流示例](#9-数据流示例)

---

## 1. 整体架构图

```
┌─────────────────────────────────────────────────────────┐
│                      用户浏览器                           │
│  React 18 + Vite SPA（Vercel CDN）                       │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTPS + httpOnly Cookie
                        │ X-CSRF-Token Header
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Hono.js API Server（Render）                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │ 认证中间件    │  │  CSRF 保护   │  │ 速率限制      │ │
│  │ (JWT Cookie) │  │  (Token双验) │  │ (hono-rate-   │ │
│  └──────────────┘  └──────────────┘  │  limiter)     │ │
│                                       └───────────────┘ │
│  ┌──────────────────────────────────────────────────┐   │
│  │              14 个 Route Handler                  │   │
│  │  /api/auth  /api/practice  /api/exams  ...       │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Service Layer                        │   │
│  │  examService  examGrader  practiceService        │   │
│  │  examComposer  answerGrader  promptBuilder       │   │
│  └──────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────┘
                        │ Drizzle ORM（postgres driver）
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Supabase PostgreSQL                         │
│  项目 ID: mozzqjeusrjuxycwpyld                          │
│  15 张主表（subjects / chapters / exams / ...）          │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼ SDK 调用
┌─────────────────────────────────────────────────────────┐
│              AI Provider 层（多模型）                     │
│  Anthropic Claude | Google Gemini | OpenAI GPT          │
│  ZhipuAI GLM | Qwen | Kimi | MiniMax                    │
└─────────────────────────────────────────────────────────┘
```

---

## 2. 技术栈一览

### 前端

| 类别 | 技术 | 版本 |
|------|------|------|
| UI 框架 | React | 18.2 |
| 路由 | React Router DOM | 7.x |
| 构建工具 | Vite | 5.x |
| 包管理 | **bun**（禁止 npm/yarn） | latest |
| 状态管理 | zustand（局部）+ React Context（全局认证） | 5.x |
| 公式渲染 | KaTeX | 0.16 |
| 图标 | Lucide React + Heroicons | latest |
| 测试 | Vitest + Playwright（E2E） | latest |
| 部署 | Vercel（GitHub main 分支自动触发） | — |

### 后端

| 类别 | 技术 | 版本 |
|------|------|------|
| 运行时 | Bun | latest |
| Web 框架 | Hono.js | 4.x |
| ORM | Drizzle ORM | 0.45 |
| 数据库 | Supabase PostgreSQL | — |
| 认证 | JWT（jsonwebtoken）+ httpOnly Cookie | 9.x |
| 密码加密 | bcryptjs | 3.x |
| 输入验证 | Zod | 4.x |
| 速率限制 | hono-rate-limiter | 0.5 |
| 文档解析 | mammoth（DOCX）+ pdf.js-extract | — |
| 部署 | Render（Docker-like 容器） | — |

### 数据库

| 类别 | 说明 |
|------|------|
| 服务 | Supabase PostgreSQL（免费版） |
| ORM | Drizzle ORM（类型安全 SQL DSL） |
| 连接 | `postgres` 驱动（Connection String） |
| 缓存 | 内存缓存（subjects/chapters TTL 10分钟） |
| 迁移 | `drizzle-kit generate` + `drizzle-kit migrate` |

---

## 3. 前端架构

### 3.1 目录结构

```
src/
├── main.jsx              # 应用入口，挂载 React 根组件
├── AppRouter.jsx         # 路由配置（懒加载 + ProtectedRoute）
├── alevel-math-app.jsx   # 首页主组件（课程导航）
├── components/
│   ├── common/           # 通用组件：Loading, Toast
│   ├── ui/               # 原子组件：Button, Card, Input
│   ├── exam/             # 考试相关：AIFeedback, ScoreCard
│   ├── home/             # 首页视图：SubjectsView, ChapterView...
│   ├── practice/         # 练习流程：PracticeView（编排器）
│   │   ├── PracticeSetup.jsx   # 配置界面
│   │   ├── PracticeQuestion.jsx # 题目渲染
│   │   ├── PracticeFeedback.jsx # 答题反馈
│   │   └── PracticeSummary.jsx  # 轮次总结
│   ├── AuthPage.jsx       # 登录/注册（Tab 切换）
│   ├── ExamTakingPage.jsx # 考试进行
│   ├── ExamResultPage.jsx # 考试结果
│   ├── WrongQuestionsPage.jsx
│   ├── PastPapersPage.jsx
│   └── LearningPlanPage.jsx
├── contexts/
│   └── AuthContext.jsx   # 全局用户认证状态
├── data/
│   ├── subjects.js       # 课程数据（本地，包含 keyPoints/formulas）
│   ├── curriculum.js     # 旧格式课程数据（兼容保留）
│   └── allSubjects.js    # 多学科汇总入口
├── utils/
│   ├── apiClient.js      # 统一 HTTP 客户端（见关键规则）
│   ├── constants.js      # API_BASE 等全局常量
│   ├── helpers.js        # formatDate, getDifficultyLabel 等工具
│   └── translations.js   # 国际化翻译（EN 主导）
└── styles/
    └── homeStyles.js     # 首页样式对象
```

### 3.2 路由结构

| 路径 | 组件 | 需要登录 | 需要管理员 |
|------|------|----------|-----------|
| `/` | ALevelMathApp | ❌ | ❌ |
| `/login` | AuthPage | ❌ | ❌ |
| `/register` | AuthPage | ❌ | ❌ |
| `/profile` | UserProfilePage | ✅ | ❌ |
| `/exams` | ExamListPage | ✅ | ❌ |
| `/exams/create` | ExamCreatePage | ✅ | ❌ |
| `/exams/:id/take` | ExamTakingPage | ✅ | ❌ |
| `/exams/:id/result` | ExamResultPage | ✅ | ❌ |
| `/practice` | PracticePage | ✅ | ❌ |
| `/past-papers` | PastPapersPage | ✅ | ❌ |
| `/wrong-questions` | WrongQuestionsPage | ✅ | ❌ |
| `/learning-plan` | LearningPlanPage | ✅ | ❌ |
| `/questions/upload` | QuestionUploadPage | ✅ | ✅ |

所有路由懒加载（`React.lazy`），首次访问触发 chunk 下载，后续缓存在浏览器。

### 3.3 状态管理策略

| 状态类型 | 方案 |
|---------|------|
| 用户认证（登录状态、user 对象） | `AuthContext`（React Context + sessionStorage） |
| 页面本地 UI 状态 | `useState` |
| 持久化 token 缓存 | `sessionStorage`（`auth_user` key） |
| CSRF token | `sessionStorage`（`csrf_token` key）+ 内存 |
| 错题掌握状态 | Supabase DB（主）+ localStorage 离线缓存 |

### 3.4 样式规范

- **全部内联样式对象**，无独立 CSS 文件（除保留的 5 个特定文件）
- 保留 CSS 文件：`animations.css` / `QuestionCard.css` / `AnswerInput.css` / `Loading.css` / `Toast.css`
- 配色系统（Google Clean 风格，见 CLAUDE.md §③）

### 3.5 关键规则：apiClient 返回值

```javascript
// ✅ 正确：apiClient 已自动解包，直接使用
const questions = await get('/api/practice/start')

// ❌ 错误：多余的 .data 访问或 success 判断
const result = await get('/api/practice/start')
if (result.success) { ... }     // result.success 不存在！
const questions = result.data   // result.data 也不存在！
```

底层逻辑：`handleResponse` 函数在 `data.success === true` 时直接返回 `data.data`。

---

## 4. 后端架构

### 4.1 目录结构

```
backend/src/
├── index.js              # 应用入口：中间件注册 + 路由挂载
├── routes/               # 路由层（HTTP 处理）
│   ├── auth.js           # 注册/登录/Token 刷新/Google OAuth
│   ├── exams.js          # 考试 CRUD + 提交 + 批改
│   ├── practice.js       # 练习开始/答题/汇总
│   ├── questions.js      # 题库查询/管理
│   ├── questionSets.js   # 试卷 CRUD + 智能组卷
│   ├── progress.js       # 学习进度写入/查询
│   ├── wrongQuestions.js # 错题本 CRUD + 掌握标记
│   ├── subjects.js       # 学科/章节数据（缓存）
│   ├── chapters.js       # 章节详情
│   ├── users.js          # 用户信息管理
│   ├── learningPlans.js  # 学习计划生成
│   ├── recommendations.js # AI 推荐
│   ├── questionUpload.js # 文档上传解析
│   └── userAnswers.js    # 历史答题记录
├── services/             # 业务逻辑层（AI + 核心算法）
│   ├── examService.js    # 考试生命周期管理
│   ├── examGrader.js     # 客观题批改逻辑
│   ├── examComposer.js   # 智能组卷算法
│   ├── examAnalyzer.js   # AI 考试分析
│   ├── practiceService.js # 练习题目查询 + 推荐
│   ├── answerGrader.js   # 主观题 AI 批改
│   ├── answerGraderCore.js # 核心判分规则
│   ├── promptBuilder.js  # AI Prompt 构建
│   ├── aiClient.js       # AI 调用统一入口
│   ├── documentParser.js # PDF/DOCX 解析
│   └── providers/        # 多模型 Provider 适配
│       ├── claude.js     # Anthropic Claude
│       ├── gemini.js     # Google Gemini
│       ├── openai.js     # OpenAI GPT
│       ├── glm.js        # ZhipuAI GLM
│       ├── qwen.js       # Alibaba Qwen
│       ├── kimi.js       # Moonshot Kimi
│       └── minimax.js    # MiniMax
├── middleware/
│   ├── auth.js           # JWT 验证（Cookie 优先）
│   ├── csrf.js           # CSRF Token 双重验证
│   ├── rateLimit.js      # 细粒度速率限制预设
│   ├── cache.js          # 内存 LRU 缓存
│   ├── security.js       # 安全响应头 + 请求大小限制
│   ├── performance.js    # 性能监控 + 慢查询日志
│   └── errorHandler.js   # 全局错误处理
├── db/
│   ├── index.js          # 数据库连接（postgres + drizzle）
│   └── schema.js         # 所有表定义（Drizzle schema）
└── utils/
    ├── jwt.js            # Token 生成/验证
    └── validation.js     # Zod schema 定义
```

### 4.2 中间件链（请求生命周期）

```
请求进入
  │
  ├─ errorHandler（全局捕获，最先注册）
  ├─ performanceMonitor（计时 + 慢查询告警）
  ├─ securityHeaders（X-Frame-Options、CSP 等）
  ├─ requestSizeLimit（5MB 限制，上传路由跳过）
  ├─ logger（请求日志）
  ├─ cors（跨域头，支持 *.vercel.app）
  ├─ rateLimiter（全局 100次/15min）
  │    └─ 特殊限制：login 5次/15min，register 3次/1h
  │
  ├─ [公开路由] /api/auth/register、/api/auth/login
  ├─ [公开路由] /api/subjects、/api/chapters（+缓存中间件）
  │
  ├─ authMiddleware（验证 Cookie 中的 JWT）
  ├─ csrfProtection（验证 X-CSRF-Token 头）
  │
  └─ [受保护路由] 所有 /api/exams、/api/practice 等
```

### 4.3 路由命名约定

- 静态路由必须在动态路由 (`/:id`) **之前**注册（Hono 规则）
- 例：`/api/question-sets/mock-exams` 必须先于 `/api/question-sets/:id`

---

## 5. 数据库架构

详见 [04-database-schema.md](./04-database-schema.md)。

核心表关系：

```
subjects ──< units ──< chapters ──< questions
                                         │
users ─────────────────────────────────< exams
  │                                       │
  ├──< learningProgress (per chapter)     ├──< questionSets
  ├──< userStats                          └──< examQuestionResults (错题本)
  └──< userProfiles
```

---

## 6. AI 服务层

### 6.1 多 Provider 架构

系统通过 `providers/index.js` 抽象层支持 7 个 AI Provider，运行时通过环境变量配置：

| Provider | 环境变量 | 用途 |
|----------|----------|------|
| Anthropic Claude | `ANTHROPIC_API_KEY` | 主力（判题、分析） |
| Google Gemini | `GEMINI_API_KEY` | 出题辅助 |
| OpenAI GPT | `OPENAI_API_KEY` | 备用 |
| ZhipuAI GLM | `GLM_API_KEY` | 备用 |
| Qwen | `QWEN_API_KEY` | 备用 |
| Kimi | `KIMI_API_KEY` | 备用 |
| MiniMax | `MINIMAX_API_KEY` | 备用 |

### 6.2 核心 AI 功能

| 功能 | Service | 说明 |
|------|---------|------|
| 练习答题判分 | `answerGraderCore.js` | MCQ 字符串匹配 + 数值误差范围 |
| 主观题 AI 批改 | `answerGrader.js` | Claude 逐题点评 |
| 考试综合分析 | `examAnalyzer.js` | 生成 strengths/weaknesses/suggestions |
| 智能组卷 | `examComposer.js` | 5种策略（随机/难度/知识点/AI/真题风格） |
| 练习推荐 | `practiceService.js` `getRecommendations` | 基于错题推荐下一步 |
| 文档题目提取 | `documentParser.js` + `questionExtractor.js` | PDF/DOCX → JSON 结构化 |

---

## 7. 安全体系

### 7.1 认证

- Token 存于 `httpOnly` Cookie（`auth_token`），JS 无法读取，防 XSS
- 跨域（Vercel ↔ Render）：`SameSite=None; Secure`
- 开发环境：`SameSite=Lax`（允许 localhost）

### 7.2 CSRF 防护

双重机制：
1. `GET /api/csrf-token` 返回 Token（需登录）
2. 所有写操作请求头携带 `X-CSRF-Token`
3. 后端中间件 `csrfProtection` 验证匹配

### 7.3 速率限制

| 端点 | 限制 |
|------|------|
| 全局 | 100次 / 15分钟（生产） |
| POST /api/auth/login | 5次 / 15分钟 |
| POST /api/auth/register | 3次 / 1小时 |
| POST /api/auth/refresh | 10次 / 15分钟 |

### 7.4 输入验证

所有路由使用 Zod Schema 验证请求体，验证失败返回 400 + 详细错误信息。

---

## 8. 部署架构

### 8.1 前端（Vercel）

| 项目 | URL | 触发条件 |
|------|-----|----------|
| alevel-math-app | https://alevel-math-app.vercel.app | push to `main` |

- 构建命令：`bun run build`
- 输出目录：`dist/`
- 环境变量：`VITE_API_BASE`（指向 Render 后端）

### 8.2 后端（Render）

| 项目 | 触发条件 |
|------|----------|
| alevel-backend | push to `main`（Render Webhook） |

- 启动命令：`bun src/index.js`
- 端口：`$PORT`（Render 分配）
- 环境变量：见 §8.4

### 8.3 数据库（Supabase）

- 项目 ID：`mozzqjeusrjuxycwpyld`
- Region：AWS us-east-1
- 连接：Connection String（`DATABASE_URL` 环境变量）

### 8.4 环境变量清单

**前端（.env.local）：**
```
VITE_API_URL=https://alevel-math-app.onrender.com
VITE_GOOGLE_CLIENT_ID=xxx
```

**后端（Render Environment Variables）：**
```
DATABASE_URL=postgres://...
JWT_SECRET=...
REFRESH_TOKEN_SECRET=...
CSRF_SECRET=...
ANTHROPIC_API_KEY=sk-ant-...
ADMIN_EMAILS=admin@example.com
CORS_ORIGIN=https://alevel-math-app.vercel.app
NODE_ENV=production
PORT=4000
```

---

## 9. 数据流示例

### 9.1 用户完成练习一轮

```
1. 用户点击 Practice → Start
2. PracticeView.handleStart() 调用 POST /api/practice/start
3. 后端 practiceService.getQuestions() 查询数据库
4. 前端展示题目，用户逐题作答
5. 每题提交：POST /api/practice/answer → 即时判分反馈
6. 最后一题提交 → handleNext() 检测轮次结束
7. POST /api/practice/summary → 生成推荐
8. 错题写入：POST /api/wrong-questions（非阻塞）
9. 进度更新：POST /api/progress（非阻塞）
10. 展示 PracticeSummary
```

### 9.2 考试提交与批改

```
1. 用户点击 Submit
2. POST /api/exams/:id/submit
3. examService.submitExam() → 状态改为 submitted
4. examGrader.gradeExam() → 批改 MCQ（即时）+ 主观题（AI 异步）
5. 状态改为 graded
6. 前端跳转 /exams/:id/result
7. GET /api/exams/:id/result 返回完整批改结果
8. ExamResultPage 检测 status=graded → 写进度
9. POST /api/progress（每个涉及章节一次）
```
