# 开发指南 — A-Level Hub

> 最后更新：2026-04-17  
> 版本：v1.5.0  
> 适用对象：接手项目的新开发者 / 需要快速上手的合作者

---

## 目录

1. [环境准备](#1-环境准备)
2. [本地启动](#2-本地启动)
3. [项目结构速览](#3-项目结构速览)
4. [开发铁律（违反会产生 Bug）](#4-开发铁律违反会产生-bug)
5. [常用 bun 命令](#5-常用-bun-命令)
6. [数据库操作](#6-数据库操作)
7. [添加新功能流程](#7-添加新功能流程)
8. [添加新学科/章节](#8-添加新学科章节)
9. [Mock Paper Skill](#9-mock-paper-skill)
10. [提交规范](#10-提交规范)
11. [部署流程](#11-部署流程)
12. [常见陷阱与已知问题](#12-常见陷阱与已知问题)
13. [AI Provider 配置](#13-ai-provider-配置)

---

## 1. 环境准备

### 必要工具

- **Bun** >= 1.0（前后端均使用，禁止 npm/yarn）
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```
- **Node.js** >= 18（构建工具依赖）
- **Git**

### 克隆项目

```bash
git clone <repo-url>
cd alevel-math-app
```

### 环境变量配置

**前端**（`D:/CodeProjects/alevel-math-app/.env.local`）：
```env
VITE_API_BASE=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**后端**（`D:/CodeProjects/alevel-math-app/backend/.env`）：
```env
# 数据库
DATABASE_URL=postgresql://postgres:password@db.mozzqjeusrjuxycwpyld.supabase.co:5432/postgres

# JWT 密钥（随机字符串，生产环境必须更换）
JWT_SECRET=your-jwt-secret-at-least-32-chars
REFRESH_TOKEN_SECRET=your-refresh-token-secret
CSRF_SECRET=your-csrf-secret

# AI Provider（至少配一个）
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=...

# 管理员邮箱（逗号分隔）
ADMIN_EMAILS=your@email.com

# 应用配置
NODE_ENV=development
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

---

## 2. 本地启动

### 前端

```bash
cd D:/CodeProjects/alevel-math-app
bun install
bun run dev          # 启动 Vite 开发服务器，默认 http://localhost:5173
```

### 后端

```bash
cd D:/CodeProjects/alevel-math-app/backend
bun install
bun run dev          # 启动 Hono，默认 http://localhost:4000，支持热重载
```

### 健康检查

```bash
curl http://localhost:4000/health
# 预期：{"status":"ok","timestamp":"...","version":"1.0.0"}
```

---

## 3. 项目结构速览

```
alevel-math-app/
├── src/                      # 前端源码（React 18 + Vite）
│   ├── AppRouter.jsx         # 路由配置
│   ├── components/           # 页面和 UI 组件
│   ├── contexts/AuthContext  # 全局认证状态
│   ├── data/subjects.js      # 课程数据（本地）
│   └── utils/apiClient.js    # HTTP 客户端
├── backend/
│   ├── src/
│   │   ├── index.js          # Hono 入口
│   │   ├── routes/           # 路由层（HTTP）
│   │   ├── services/         # 业务逻辑层（AI + 算法）
│   │   ├── middleware/       # 认证、CSRF、缓存等
│   │   └── db/schema.js      # Drizzle ORM 表定义
│   └── package.json
├── docs/
│   ├── wiki/                 # 技术文档（本文所在）
│   └── specs/                # PRD 和功能规格
└── memory/                   # Claude 项目记忆文件（.md）
```

---

## 4. 开发铁律（违反会产生 Bug）

### ① apiClient 返回值

```javascript
// ✅ 正确：apiClient 已解包，直接用
import { get, post } from '../utils/apiClient'
const data = await get('/api/practice/start')
// data = { questions: [...], roundSize: 5 }

// ❌ 错误：多余的 .data 或 .success 判断
const result = await get('/api/practice/start')
if (result.success) { ... }     // result.success 不存在
const questions = result.data   // result.data 不存在
```

**原因**：`apiClient.js` 的 `handleResponse` 在成功时返回 `data.data`，已解包。

---

### ② 样式规范

```jsx
// ✅ 正确：内联样式对象
const S = {
  card: { background: '#fff', border: '1px solid #dadce0', borderRadius: 8, padding: 24 }
}
<div style={S.card}>...</div>

// ❌ 禁止：CSS 文件（除保留的5个）或 Tailwind 类名
import './MyComponent.css'              // 禁止
<div className="bg-white p-4">...</div> // 禁止
```

**保留 CSS 文件**（不可删除，其他新文件禁止创建）：
- `animations.css`
- `QuestionCard.css`
- `AnswerInput.css`
- `Loading.css`
- `Toast.css`

---

### ③ 配色只用规定色值（Google Clean 风格）

| 用途 | 色值 |
|------|------|
| 主色（按钮、链接） | `#1a73e8` |
| 主文本 | `#202124` |
| 次级文本 | `#5f6368` |
| 页面背景 | `#f8f9fa` |
| 卡片背景 | `#fff` |
| 卡片边框 | `#dadce0` |
| 成功色 | `#188038` |
| 错误色 | `#d93025` |
| 警告色 | `#f9ab00` |

---

### ④ 不要重复造轮子

| 需求 | 使用 |
|------|------|
| 登录/注册页面 | `AuthPage.jsx`（Tab 切换，已完整） |
| 按钮 | `ui/Button.jsx` |
| 提示消息 | `Toast.success(msg)` / `Toast.error(msg)` |
| 全屏加载 | `<Loading message="..." size="large" fullScreen />` |
| 考试进行 | `ExamTakingPage.jsx` |
| 考试结果 | `ExamResultPage.jsx` |
| 题目渲染 | `QuestionCard.jsx` |
| 练习流程 | `PracticeView.jsx`（编排器） |

---

### ⑤ Chapter ID 前缀规则

| 前缀 | 学科 |
|------|------|
| `p`, `s`, `m` | Mathematics |
| `e` | Economics |
| `h` | History |
| **`pol`** | **Politics（不是 `p`，会与数学冲突！）** |
| `psy` | Psychology |
| `fm`, `fmech`, `fs`, `fp` | Further Math |

格式：`{前缀}{单元号}c{章节号}`，例：`e2c3`、`pol1c2`、`p1c1`

---

### ⑥ Hono 路由顺序

```javascript
// ✅ 静态路由必须在动态路由之前
app.get('/mock-exams', ...)   // 先注册
app.get('/:id', ...)          // 后注册

// ❌ 如果顺序反了，/mock-exams 会被 /:id 匹配
app.get('/:id', ...)          // 如果先注册这个...
app.get('/mock-exams', ...)   // 这条永远不会执行
```

---

### ⑦ 替换即删除

新组件替代旧组件时，**同一提交**必须：
1. 删除旧文件
2. 删除旧文件对应的 CSS（如有）
3. 移除所有对旧文件的 `import`

---

## 5. 常用 bun 命令

### 前端（`alevel-math-app/` 根目录）

```bash
bun run dev         # 启动开发服务器（http://localhost:5173）
bun run build       # 生产构建（dist/ 目录）
bun run preview     # 预览构建产物
bun run test        # 运行单元测试（vitest）
bun run test:watch  # 监视模式测试
bun run lint        # ESLint 检查
```

### 后端（`backend/` 目录）

```bash
bun run dev         # 启动开发服务器（热重载，http://localhost:4000）
bun run start       # 生产启动

# 数据库相关
bun run db:generate  # 生成 Drizzle 迁移文件
bun run db:migrate   # 执行迁移
bun run db:studio    # 打开 Drizzle Studio（可视化 DB 查看器）
bun run db:test      # 测试数据库连接
bun run db:seed      # 初始化种子数据

# 测试
bun run test         # 单元测试
bun run test:all     # 全部测试（unit + integration + data）
```

---

## 6. 数据库操作

### 查看表结构

```bash
cd backend
bun run db:studio    # 在浏览器打开可视化界面
```

### 执行 SQL（通过 Supabase MCP 或 SQL Editor）

```sql
-- 查看所有表
\dt

-- 查看特定表的记录数
SELECT table_name, count FROM information_schema.tables
JOIN (SELECT relname, reltuples::int count FROM pg_class) t
ON t.relname = table_name WHERE table_schema = 'public';
```

### 手动迁移

需要修改表结构时：

1. 修改 `backend/src/db/schema.js`
2. 运行 `bun run db:generate` 生成迁移文件
3. 运行 `bun run db:migrate` 执行迁移
4. 或者直接通过 Supabase MCP 工具执行 SQL

**常见迁移示例：**
```sql
-- 添加新列
ALTER TABLE exam_question_results ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);

-- 修改约束
ALTER TABLE exam_question_results ALTER COLUMN exam_id DROP NOT NULL;
```

### Drizzle ORM 注意事项

- DB 列名是 `snake_case`（如 `user_id`），Drizzle 映射为 JS 的 `camelCase`（如 `userId`）
- 查询结果直接使用 camelCase 字段名

```javascript
// DB: user_id, question_set_id
// Drizzle 查询结果：
const exam = { userId: 1, questionSetId: 5 }
```

---

## 7. 添加新功能流程

1. **需求确认**：在 `docs/specs/` 下创建 PRD 文件（Markdown）
2. **前端路由**：在 `AppRouter.jsx` 添加新路由（是否需要 ProtectedRoute / AdminRoute）
3. **后端路由**：在 `backend/src/routes/` 创建路由文件，在 `index.js` 注册
4. **数据库**：若需新表，修改 `schema.js` + 执行迁移
5. **前端组件**：在 `src/components/` 创建页面组件
6. **构建验证**：`bun run build`（必须零 ESLint 错误）
7. **代码审查**：使用 `code-reviewer` agent
8. **提交**：遵循 Conventional Commits 格式

---

## 8. 添加新学科/章节

### Step 1：确定 Chapter ID 前缀

参考铁律 ⑤，确保前缀不冲突。

### Step 2：修改 `src/data/subjects.js`

在对应学科的 units 数组中追加章节对象：

```javascript
{
  id: 'pol1c3',          // 章节 ID
  num: 3,                // 章节序号
  title: {
    en: 'Chapter Title',
    zh: '章节标题'
  },
  overview: { en: '...', zh: '...' },
  keyPoints: [
    'Key Point 1',
    'Key Point 2',
  ],
  formulas: ['formula 1'],
  order: 3,
}
```

### Step 3：同步到数据库

数据库中的 subjects/chapters/units 数据通过 `db/seed.js` 初始化或手动通过 API 写入。也可以直接在 Supabase 界面中插入。

### Step 4：添加题目

使用 `question-seeder` skill（在 Claude 对话中调用 `/seed e3c1` 等）。

---

## 9. Mock Paper Skill

用于生成完整模拟卷并入库。在 Claude 对话中触发：

```
/mock WMA12    # 数学 P2 模拟卷
/mock WEC11    # 经济学 U1 模拟卷
```

**完整流程（7步）：**
1. 确认试卷规格（题数/满分/时限/章节覆盖）
2. 使用 Gemini 生成所有题目 JSON
3. 自审题目质量（答案正确性/LaTeX 语法/难度分布）
4. 通过 Supabase MCP 插入题目到 `questions` 表
5. 创建 `question_sets` 记录（type=`mock_exam`，userId=null）
6. 导出 PDF 到桌面（可选）
7. 更新 `project-progress.md` 记录

**PDF 命名规范：** `YYYY-MM-DD_WMA12_P2_Mock.pdf`

---

## 10. 提交规范

使用 **Conventional Commits** 格式：

```
<type>(<scope>): <描述>

[可选正文]
```

**常用 type：**

| type | 用途 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `refactor` | 重构（不改变功能） |
| `docs` | 文档更新 |
| `test` | 添加/修改测试 |
| `chore` | 构建工具、依赖更新 |
| `perf` | 性能优化 |

**示例：**
```
feat(F3c): Practice 错题写入错题本（方案B）

- Supabase DB migration：exam_id DROP NOT NULL，新增 user_id 列
- schema.js 同步；wrongQuestions 三端点重写
- PracticeView：一轮结束写错题
```

**提交前检查清单：**
- [ ] `bun run build` 通过（零 ESLint 错误）
- [ ] 新组件已在路由或其他组件中引用
- [ ] 删除的组件无其他 import
- [ ] Chapter ID 前缀符合学科约定
- [ ] 无硬编码 API Key 或敏感信息

---

## 11. 部署流程

### 自动部署

推送到 `main` 分支后：
1. **Vercel** 自动触发前端构建部署（约 2 分钟）
2. **Render** 自动触发后端容器重建（约 3–5 分钟）

### 验证部署

```bash
# 检查后端健康状态
curl https://alevel-math-app.onrender.com/health

# 前端验证
# 访问 https://alevel-math-app.vercel.app
```

### 数据库迁移（生产）

1. 通过 Supabase MCP 工具直接执行 SQL
2. 或登录 Supabase 控制台的 SQL Editor 执行

**注意**：Render 冷启动约需 30 秒（免费版）。

---

## 12. 常见陷阱与已知问题

### 陷阱 1：subjects/chapters 缓存

后端对 `/api/subjects` 和 `/api/chapters` 设有 10 分钟内存缓存。修改数据库后最多需等待 10 分钟才会在前端生效。

**解决**：重启后端服务（Render 上触发重新部署）。

### 陷阱 2：Politics 学科 Chapter ID 前缀

Politics 的前缀是 `pol`，不是 `p`（`p` 已被数学占用）。错误示例：`p1c1` 是数学，`pol1c1` 才是政治。

### 陷阱 3：Render 冷启动

免费版 Render 服务在无流量 15 分钟后会进入休眠，首次请求需等待约 30 秒唤醒。

### 陷阱 4：CSRF Token 报错

若前端报 CSRF 相关 401，可能是：
1. sessionStorage 中的 `csrf_token` 过期
2. apiClient 会自动重试一次（清空缓存后重新获取）

若重试仍失败，手动清除浏览器 sessionStorage 然后重新登录。

### 陷阱 5：KaTeX 公式不渲染

检查 LaTeX 语法：
- 行内：`$...$`（单美元符）
- 块级：`$$...$$`（双美元符）
- 反斜杠需要双写：`\\frac{1}{2}` 而不是 `\frac{1}{2}`

### 陷阱 6：Drizzle camelCase 映射

```javascript
// DB 列：question_set_id → Drizzle JS：questionSetId
// DB 列：time_limit → Drizzle JS：timeLimit

// 错误（直接用 DB 列名查不到）：
const { time_limit } = exam    // undefined
// 正确：
const { timeLimit } = exam     // ✅
```

### 已知待修复（MEDIUM 优先级）

1. **masteredIds key 冲突**：`WrongQuestionsPage` 用 `question.id` 作 Set key，同一道题在 Exam 和 Practice 各有一条记录时，掌握状态可能串（标记了一条，另一条也显示掌握）
2. **subject 硬编码**：`PastPapersPage.jsx` 第 156 行，`subject` 被硬编码为 `"mathematics"`

---

## 13. AI Provider 配置

### 切换 AI Provider

修改 `backend/.env` 中的 API Key 配置。系统通过 `services/providers/index.js` 根据环境变量动态选择 Provider。

### Provider 优先级（当前逻辑）

`aiClient.js` 中配置优先级顺序（代码层面），默认使用 Anthropic Claude。

### Prompt 管理

所有 AI Prompt 通过 `promptBuilder.js` 统一管理，支持按学科和题型定制：
- 出题 Prompt：包含章节知识点、公式、难度要求
- 批改 Prompt：包含标准答案、评分标准
- 分析 Prompt：包含考试整体数据

### 添加新 Provider

1. 在 `services/providers/` 新建文件（参考 `claude.js` 接口）
2. 导出标准接口：`generateText(prompt, options)`
3. 在 `providers/index.js` 注册

---

## 附录：项目文档索引

| 文档 | 路径 | 说明 |
|------|------|------|
| 产品使用指南 | `docs/wiki/01-product-guide.md` | 用户视角的功能说明 |
| 系统架构 | `docs/wiki/02-architecture.md` | 技术架构全景 |
| API 接口文档 | `docs/wiki/03-api-reference.md` | 所有接口定义 |
| 数据库 Schema | `docs/wiki/04-database-schema.md` | 表结构详细说明 |
| 开发指南 | `docs/wiki/05-developer-guide.md` | 本文件 |
| PRD v2.1 | `docs/specs/2026-04-16-prd-update.md` | 功能需求文档 |
| 经济学出题规范 | `memory/economics-question-format.md` | 出题参考 |
| 数学出题规范 | `memory/math-question-format.md` | 出题参考 |
| Mock Paper Skill | `memory/mock-paper-skill.md` | 模拟卷生成说明 |
| 项目开发进度 | `memory/project-progress.md` | 里程碑记录 |
