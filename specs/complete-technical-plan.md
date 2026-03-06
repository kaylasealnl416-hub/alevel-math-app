# A-Level AI教师 - 完整技术方案（超详细版）

**文档版本**：v1.0
**创建日期**：2026-03-06
**最后更新**：2026-03-06
**状态**：规划中

---

## 📋 目录

1. [现状分析与目标](#一现状分析与目标)
2. [技术架构设计](#二技术架构设计)
3. [技术选型与理由](#三技术选型与理由)
4. [数据库设计](#四数据库设计)
5. [API设计](#五api设计)
6. [前端改造方案](#六前端改造方案)
7. [部署方案](#七部署方案)
8. [安全方案](#八安全方案)
9. [性能优化](#九性能优化)
10. [成本分析](#十成本分析)
11. [风险评估与应对](#十一风险评估与应对)
12. [实施时间表](#十二实施时间表)
13. [验收标准](#十三验收标准)

---

## 一、现状分析与目标

### 1.1 当前应用现状

**技术栈**：
- 前端：React 18.2.0 + Vite 5.1.0
- 包管理：bun（已配置）
- 数学渲染：KaTeX 0.16.33
- 部署：Vercel（已配置，自动部署）
- 数据存储：硬编码在 `src/data/subjects.js`

**功能现状**：
- ✅ 多科目支持（数学、经济学、历史等）
- ✅ 结构化课程体系（科目→单元→章节→知识点）
- ✅ YouTube视频集成
- ✅ 数学公式渲染（KaTeX）
- ✅ 响应式设计
- ✅ 错误边界处理
- ✅ 自定义Hooks（useLocalStorage, useLanguage, useErrorBook）

**存在的问题**：
- ❌ 无后端，数据无法动态更新
- ❌ 无用户系统，无法追踪学习进度
- ❌ 无数据库，无法存储用户数据
- ❌ 无AI功能
- ❌ 无练习/考试系统
- ❌ 无社交功能

### 1.2 迁移目标

**短期目标（Phase 0，2周内）**：
1. 搭建前后端分离架构
2. 数据从硬编码迁移到数据库
3. 创建RESTful API
4. 前端无缝切换到API数据源
5. **确保现有功能100%正常运行**

**中期目标（Phase 1-3，2个月内）**：
1. 用户系统（微信登录）
2. 学习进度追踪
3. AI教师对话功能
4. 练习系统

**长期目标（Phase 4-8，6个月内）**：
1. 考试系统
2. 自适应学习路径
3. 数据分析报告
4. 社交激励系统

---

## 二、技术架构设计

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         用户层                                    │
│  浏览器（Chrome/Safari/Edge）+ 微信内置浏览器                     │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS
┌────────────────────────┴────────────────────────────────────────┐
│                      CDN层（Cloudflare）                          │
│  - 静态资源加速                                                   │
│  - DDoS防护                                                      │
│  - SSL证书                                                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────┴──────┐  ┌──────┴──────┐  ┌─────┴──────┐
│   前端层      │  │  API网关层   │  │  静态资源   │
│  (Vercel)    │  │  (Railway)  │  │  (Vercel)  │
│              │  │             │  │            │
│ React 18     │  │ Hono        │  │ 图片/视频   │
│ Vite         │  │ Node.js 20  │  │ 缩略图      │
│ Zustand      │  │ JWT认证     │  │            │
│ React Router │  │ 限流        │  │            │
└──────────────┘  └──────┬──────┘  └────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────┴──────┐  ┌──────┴──────┐  ┌─────┴──────────┐
│  业务服务层   │  │  AI服务层    │  │  数据服务层     │
│  (Railway)   │  │  (Anthropic)│  │  (Supabase)    │
│              │  │             │  │                │
│ 用户服务     │  │ Claude API  │  │ PostgreSQL 16  │
│ 课程服务     │  │ Prompt库    │  │ Redis缓存      │
│ 练习服务     │  │ 向量搜索    │  │ 全文搜索       │
│ 考试服务     │  │             │  │ 定时备份       │
└──────────────┘  └─────────────┘  └────────────────┘
```

### 2.2 数据流向

**读取数据流**：
```
用户浏览器
  → CDN（缓存检查）
  → Vercel前端（React渲染）
  → Railway API（业务逻辑）
  → Supabase数据库（数据查询）
  → Redis缓存（热数据）
  → 返回JSON
  → 前端渲染
```

**写入数据流**：
```
用户操作
  → 前端验证
  → API请求（带JWT Token）
  → API网关（认证+限流）
  → 业务服务（数据处理）
  → 数据库写入
  → 缓存更新
  → 返回结果
```

### 2.3 模块划分

**前端模块**：
```
src/
├── pages/              # 页面组件
│   ├── Home.jsx
│   ├── Subject.jsx
│   ├── Chapter.jsx
│   ├── Practice.jsx
│   └── Profile.jsx
├── components/         # 通用组件
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   ├── VideoPlayer.jsx
│   └── MathRenderer.jsx
├── features/           # 功能模块
│   ├── auth/          # 认证
│   ├── learning/      # 学习
│   ├── practice/      # 练习
│   └── ai/            # AI对话
├── hooks/             # 自定义Hooks
├── store/             # 状态管理（Zustand）
├── services/          # API服务
└── utils/             # 工具函数
```

**后端模块**：
```
backend/
├── src/
│   ├── routes/        # 路由
│   │   ├── auth.js
│   │   ├── subjects.js
│   │   ├── users.js
│   │   ├── practice.js
│   │   └── ai.js
│   ├── services/      # 业务逻辑
│   │   ├── authService.js
│   │   ├── subjectService.js
│   │   └── aiService.js
│   ├── db/            # 数据库
│   │   ├── schema.js
│   │   ├── migrations/
│   │   └── seed.js
│   ├── middleware/    # 中间件
│   │   ├── auth.js
│   │   ├── rateLimit.js
│   │   └── errorHandler.js
│   └── utils/         # 工具函数
└── tests/             # 测试
```

---

## 三、技术选型与理由

### 3.1 后端框架：Hono

**为什么选择Hono而不是Express/Koa/Fastify？**

| 特性 | Hono | Express | Fastify | Koa |
|------|------|---------|---------|-----|
| 性能 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 体积 | 12KB | 200KB+ | 50KB | 30KB |
| TypeScript | 原生支持 | 需要@types | 原生支持 | 需要@types |
| 学习曲线 | 平缓 | 平缓 | 陡峭 | 中等 |
| 生态 | 新兴 | 成熟 | 成熟 | 成熟 |
| 边缘计算 | ✅ | ❌ | ❌ | ❌ |

**选择理由**：
1. **性能优异**：比Express快3-4倍
2. **轻量级**：只有12KB，启动快
3. **现代化**：原生TypeScript，async/await
4. **边缘计算**：支持Cloudflare Workers（未来可迁移）
5. **简洁API**：类似Express，学习成本低

**代码示例**：
```javascript
import { Hono } from 'hono'

const app = new Hono()

app.get('/api/subjects', async (c) => {
  const subjects = await db.select().from(schema.subjects)
  return c.json({ data: subjects })
})
```

### 3.2 ORM：Drizzle ORM

**为什么选择Drizzle而不是Prisma/TypeORM？**

| 特性 | Drizzle | Prisma | TypeORM |
|------|---------|--------|---------|
| 性能 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 类型安全 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| SQL控制 | 完全控制 | 抽象层 | 中等 |
| 迁移 | 简单 | 复杂 | 中等 |
| 体积 | 小 | 大 | 中 |

**选择理由**：
1. **类型安全**：完全的TypeScript类型推导
2. **性能**：接近原生SQL性能
3. **SQL控制**：可以写复杂查询
4. **轻量级**：不像Prisma那样臃肿
5. **迁移简单**：自动生成迁移脚本

**代码示例**：
```javascript
import { pgTable, serial, text, jsonb } from 'drizzle-orm/pg-core'

export const subjects = pgTable('subjects', {
  id: text('id').primaryKey(),
  name: jsonb('name').notNull(),
  icon: text('icon'),
})

// 查询
const allSubjects = await db.select().from(subjects)

// 插入
await db.insert(subjects).values({
  id: 'mathematics',
  name: { zh: '数学', en: 'Mathematics' }
})
```

### 3.3 数据库：PostgreSQL

**为什么选择PostgreSQL而不是MySQL/MongoDB？**

| 特性 | PostgreSQL | MySQL | MongoDB |
|------|------------|-------|---------|
| JSON支持 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 全文搜索 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 向量搜索 | ⭐⭐⭐⭐⭐ (pgvector) | ❌ | ⭐⭐⭐ |
| 事务 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 扩展性 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**选择理由**：
1. **JSON支持**：存储多语言内容（中英文）
2. **全文搜索**：搜索课程内容
3. **向量搜索**：未来AI功能（题库语义搜索）
4. **成熟稳定**：20+年历史
5. **免费托管**：Supabase提供免费套餐

### 3.4 状态管理：Zustand

**为什么选择Zustand而不是Redux/MobX？**

| 特性 | Zustand | Redux Toolkit | MobX |
|------|---------|---------------|------|
| 体积 | 1KB | 10KB+ | 16KB |
| 学习曲线 | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 样板代码 | 极少 | 中等 | 少 |
| TypeScript | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| DevTools | ✅ | ✅ | ✅ |

**选择理由**：
1. **极简**：只有1KB，API简洁
2. **无样板代码**：不需要actions/reducers
3. **TypeScript友好**：类型推导完美
4. **性能好**：基于React Hooks
5. **学习成本低**：10分钟上手

**代码示例**：
```javascript
import { create } from 'zustand'

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  subjects: [],
  fetchSubjects: async () => {
    const data = await api.getSubjects()
    set({ subjects: data })
  }
}))
```

### 3.5 部署平台

**前端：Vercel**（已配置）
- ✅ 自动部署（Git push触发）
- ✅ 全球CDN
- ✅ 免费SSL
- ✅ 预览环境（PR自动部署）
- ✅ 免费额度：100GB带宽/月

**后端：Railway**
- ✅ 自动检测Node.js项目
- ✅ 内置PostgreSQL
- ✅ GitHub自动部署
- ✅ 免费额度：$5/月（约500小时运行时间）
- ✅ 简单易用

**数据库：Supabase**
- ✅ PostgreSQL托管
- ✅ 自动备份
- ✅ 实时订阅（未来可用）
- ✅ 免费额度：500MB存储 + 2GB带宽/月
- ✅ 内置认证（可选）

**替代方案**：
- 后端：Render（免费套餐，但冷启动慢）
- 数据库：Neon（无服务器PostgreSQL）

---

## 四、数据库设计

### 4.1 ER图

```
┌─────────────┐
│   users     │
│ (用户表)     │
├─────────────┤
│ id          │ PK
│ wechat_id   │ UNIQUE
│ nickname    │
│ avatar      │
│ created_at  │
└──────┬──────┘
       │ 1
       │
       │ N
┌──────┴──────────┐
│ learning_progress│
│ (学习进度)        │
├─────────────────┤
│ user_id         │ FK
│ chapter_id      │ FK
│ status          │
│ mastery_level   │
│ last_reviewed   │
└─────────────────┘

┌─────────────┐
│  subjects   │
│  (科目)      │
├─────────────┤
│ id          │ PK
│ name        │ JSONB
│ icon        │
│ color       │
└──────┬──────┘
       │ 1
       │ N
┌──────┴──────┐
│   units     │
│  (单元)      │
├─────────────┤
│ id          │ PK
│ subject_id  │ FK
│ title       │ JSONB
│ order       │
└──────┬──────┘
       │ 1
       │ N
┌──────┴──────┐
│  chapters   │
│  (章节)      │
├─────────────┤
│ id          │ PK
│ unit_id     │ FK
│ title       │ JSONB
│ content     │ JSONB
│ videos      │ JSONB
│ order       │
└──────┬──────┘
       │ 1
       │ N
┌──────┴──────┐
│  questions  │
│  (题库)      │
├─────────────┤
│ id          │ PK
│ chapter_id  │ FK
│ type        │
│ difficulty  │
│ content     │ JSONB
│ answer      │ JSONB
└─────────────┘
```

### 4.2 核心表结构

#### 4.2.1 用户表（users）
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  wechat_openid VARCHAR(100) UNIQUE NOT NULL,
  wechat_unionid VARCHAR(100),
  nickname VARCHAR(100),
  avatar TEXT,
  email VARCHAR(255),
  phone VARCHAR(20),
  grade VARCHAR(20),  -- 'AS' | 'A2'
  target_university VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

CREATE INDEX idx_users_wechat ON users(wechat_openid);
```

#### 4.2.2 科目表（subjects）
```sql
CREATE TABLE subjects (
  id VARCHAR(50) PRIMARY KEY,  -- 'mathematics', 'economics'
  name JSONB NOT NULL,  -- {"zh": "数学", "en": "Mathematics"}
  name_full JSONB,
  icon VARCHAR(10),
  color VARCHAR(20),
  bg_color VARCHAR(20),
  level TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 4.2.3 单元表（units）
```sql
CREATE TABLE units (
  id VARCHAR(50) PRIMARY KEY,  -- 'Unit1', 'Unit2'
  subject_id VARCHAR(50) NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title JSONB NOT NULL,
  subtitle JSONB,
  color VARCHAR(20),
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_units_subject ON units(subject_id);
```

#### 4.2.4 章节表（chapters）
```sql
CREATE TABLE chapters (
  id VARCHAR(50) PRIMARY KEY,  -- 'e1c1', 'm1c1'
  unit_id VARCHAR(50) NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  num INTEGER NOT NULL,
  title JSONB NOT NULL,
  overview JSONB,
  key_points JSONB,  -- 数组
  formulas JSONB,    -- 数组
  examples JSONB,    -- 数组
  videos JSONB,      -- 数组
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chapters_unit ON chapters(unit_id);
```

#### 4.2.5 学习进度表（learning_progress）
```sql
CREATE TABLE learning_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_id VARCHAR(50) NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'not_started',
  mastery_level INTEGER DEFAULT 0,  -- 0-100
  time_spent INTEGER DEFAULT 0,  -- 秒
  last_reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, chapter_id)
);

CREATE INDEX idx_progress_user ON learning_progress(user_id);
CREATE INDEX idx_progress_chapter ON learning_progress(chapter_id);
```

#### 4.2.6 题库表（questions）
```sql
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  chapter_id VARCHAR(50) NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  content JSONB NOT NULL,
  answer JSONB NOT NULL,
  explanation JSONB,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(20) DEFAULT 'manual'
);

CREATE INDEX idx_questions_chapter ON questions(chapter_id);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
```

#### 4.2.7 答题记录表（user_answers）
```sql
CREATE TABLE user_answers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_answer JSONB NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_answers_user ON user_answers(user_id);
CREATE INDEX idx_answers_question ON user_answers(question_id);
```

#### 4.2.8 AI对话历史表（ai_conversations）
```sql
CREATE TABLE ai_conversations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  messages JSONB NOT NULL,
  context JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversations_user ON ai_conversations(user_id);
CREATE INDEX idx_conversations_session ON ai_conversations(session_id);
```

### 4.3 数据迁移策略

**从 `src/data/subjects.js` 到数据库**：

1. **复制数据文件**：
```bash
cp src/data/subjects.js backend/data-import/subjects.js
```

2. **创建导入脚本**（backend/src/db/seed.js）：
```javascript
import { SUBJECTS } from '../../data-import/subjects.js'

async function seed() {
  for (const [subjectId, subjectData] of Object.entries(SUBJECTS)) {
    // 插入科目
    await db.insert(schema.subjects).values({
      id: subjectId,
      name: subjectData.name,
      nameFull: subjectData.nameFull,
      icon: subjectData.icon,
      color: subjectData.color,
      bgColor: subjectData.bgColor,
      level: subjectData.level,
    })

    // 插入单元
    for (const [unitId, unitData] of Object.entries(subjectData.books)) {
      await db.insert(schema.units).values({
        id: unitId,
        subjectId: subjectId,
        title: unitData.title,
        subtitle: unitData.subtitle,
        color: unitData.color,
        order: parseInt(unitId.replace(/\D/g, '')),
      })

      // 插入章节
      for (const [index, chapterData] of unitData.chapters.entries()) {
        await db.insert(schema.chapters).values({
          id: chapterData.id,
          unitId: unitId,
          num: chapterData.num,
          title: chapterData.title,
          overview: chapterData.overview,
          keyPoints: chapterData.keyPoints,
          formulas: chapterData.formulas,
          examples: chapterData.examples,
          videos: chapterData.videos,
          order: index,
        })
      }
    }
  }
}
```

---

## 五、API设计

### 5.1 RESTful API规范

**基础URL**：
- 开发环境：`http://localhost:4000/api`
- 生产环境：`https://your-backend.railway.app/api`

**统一响应格式**：
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "timestamp": "2026-03-06T10:00:00.000Z"
}
```

**错误响应**：
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": { ... }
  },
  "timestamp": "2026-03-06T10:00:00.000Z"
}
```

### 5.2 API端点列表

#### 科目相关

**GET /api/subjects**
- 描述：获取所有科目列表
- 认证：不需要
- 响应示例：
```json
{
  "success": true,
  "data": [
    {
      "id": "mathematics",
      "name": {"zh": "数学", "en": "Mathematics"},
      "icon": "📐",
      "color": "#4CAF50"
    }
  ]
}
```

**GET /api/subjects/:id**
- 描述：获取单个科目详情（含单元和章节）
- 认证：不需要

**GET /api/chapters/:id**
- 描述：获取单个章节详情
- 认证：不需要

#### 用户相关

**POST /api/auth/wechat**
- 描述：微信扫码登录
- 请求体：`{ "code": "wx_auth_code" }`

**GET /api/users/me**
- 描述：获取当前用户信息
- 认证：需要JWT Token

**PUT /api/users/me**
- 描述：更新用户信息
- 认证：需要

#### 学习进度

**GET /api/progress**
- 描述：获取用户学习进度
- 认证：需要
- 查询参数：`?subjectId=mathematics`

**POST /api/progress**
- 描述：更新学习进度
- 认证：需要

#### 练习相关

**GET /api/questions**
- 描述：获取题目列表
- 查询参数：`?chapterId=m1c1&difficulty=3&limit=10`

**POST /api/answers**
- 描述：提交答案
- 认证：需要

#### AI相关

**POST /api/ai/chat**
- 描述：AI对话
- 认证：需要
- 请求体：
```json
{
  "message": "如何理解二次函数？",
  "context": {
    "chapterId": "m1c1",
    "sessionId": "uuid"
  }
}
```

---

## 六、前端改造方案

### 6.1 渐进式迁移策略

**核心思想**：双轨运行，通过环境变量控制数据源

**实现方案**：

1. **创建数据源适配层**（`src/data/dataSource.js`）：
```javascript
import { SUBJECTS as LOCAL_SUBJECTS } from './subjects.js'
import { subjectsAPI, USE_API } from '../utils/api.js'

class DataSource {
  async getSubjects() {
    if (!USE_API) {
      return LOCAL_SUBJECTS  // 本地数据
    }

    try {
      const response = await subjectsAPI.getAll()
      return response.data
    } catch (error) {
      console.warn('API失败，降级到本地数据')
      return LOCAL_SUBJECTS  // 降级策略
    }
  }
}

export const dataSource = new DataSource()
```

2. **环境变量配置**：
```bash
# .env.local（开发环境）
VITE_USE_API=false  # 默认使用本地数据
VITE_API_URL=http://localhost:4000

# .env.production（生产环境）
VITE_USE_API=true  # 使用API
VITE_API_URL=https://your-backend.railway.app
```

3. **组件改造示例**：
```javascript
// 修改前
import { SUBJECTS } from './data/subjects.js'

// 修改后
import { dataSource } from './data/dataSource.js'

function App() {
  const [subjects, setSubjects] = useState({})

  useEffect(() => {
    async function load() {
      const data = await dataSource.getSubjects()
      setSubjects(data)
    }
    load()
  }, [])
}
```

### 6.2 状态管理重构

**引入Zustand**：
```bash
bun add zustand
```

**创建Store**（`src/store/index.js`）：
```javascript
import { create } from 'zustand'
import { dataSource } from '../data/dataSource'

export const useStore = create((set, get) => ({
  // 用户状态
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  // 科目数据
  subjects: {},
  currentSubject: null,
  fetchSubjects: async () => {
    const data = await dataSource.getSubjects()
    set({ subjects: data })
  },

  // 学习进度
  progress: {},
  fetchProgress: async () => {
    if (!get().isAuthenticated) return
    const data = await api.getProgress()
    set({ progress: data })
  },
}))
```

### 6.3 路由改造

**引入React Router**：
```bash
bun add react-router-dom
```

**路由配置**（`src/App.jsx`）：
```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subjects/:id" element={<Subject />} />
        <Route path="/chapters/:id" element={<Chapter />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}
```

---

## 七、部署方案

### 7.1 后端部署（Railway）

**步骤**：
1. 访问 [railway.app](https://railway.app)
2. 连接GitHub仓库
3. 选择 `backend` 文件夹
4. 添加PostgreSQL服务
5. 配置环境变量
6. 部署

**环境变量**：
```
DATABASE_URL=${POSTGRES_URL}
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
JWT_SECRET=your-secret-key
CLAUDE_API_KEY=your-claude-key
```

### 7.2 前端部署（Vercel）

**已配置**，只需更新环境变量：
```
VITE_USE_API=true
VITE_API_URL=https://your-backend.railway.app
```

### 7.3 数据库部署（Supabase）

**步骤**：
1. 访问 [supabase.com](https://supabase.com)
2. 创建新项目
3. 获取数据库连接字符串
4. 在Railway中配置 `DATABASE_URL`

---

## 八、安全方案

### 8.1 认证与授权

**JWT Token**：
```javascript
// 生成Token
const token = jwt.sign(
  { userId: user.id, role: 'student' },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
)

// 验证Token（中间件）
async function authMiddleware(c, next) {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  if (!token) return c.json({ error: 'Unauthorized' }, 401)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    c.set('user', decoded)
    await next()
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401)
  }
}
```

### 8.2 限流防护

**使用Hono限流中间件**：
```javascript
import { rateLimiter } from 'hono-rate-limiter'

app.use('/api/*', rateLimiter({
  windowMs: 15 * 60 * 1000,  // 15分钟
  max: 100,  // 最多100次请求
  message: 'Too many requests'
}))
```

### 8.3 数据验证

**使用Zod**：
```bash
bun add zod
```

```javascript
import { z } from 'zod'

const userSchema = z.object({
  nickname: z.string().min(2).max(50),
  grade: z.enum(['AS', 'A2']),
})

app.put('/api/users/me', async (c) => {
  const body = await c.req.json()
  const validated = userSchema.parse(body)  // 自动验证
  // ...
})
```

### 8.4 CORS配置

```javascript
app.use('*', cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app'
  ],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))
```

---

## 九、性能优化

### 9.1 数据库优化

**索引策略**：
```sql
-- 用户查询优化
CREATE INDEX idx_users_wechat ON users(wechat_openid);

-- 学习进度查询优化
CREATE INDEX idx_progress_user_chapter ON learning_progress(user_id, chapter_id);

-- 题库查询优化
CREATE INDEX idx_questions_chapter_difficulty ON questions(chapter_id, difficulty);
```

**查询优化**：
```javascript
// 使用JOIN减少查询次数
const subjectWithUnits = await db
  .select()
  .from(schema.subjects)
  .leftJoin(schema.units, eq(schema.subjects.id, schema.units.subjectId))
  .where(eq(schema.subjects.id, 'mathematics'))
```

### 9.2 缓存策略

**Redis缓存热数据**：
```javascript
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

// 缓存科目数据（1小时）
async function getSubjects() {
  const cached = await redis.get('subjects:all')
  if (cached) return JSON.parse(cached)

  const data = await db.select().from(schema.subjects)
  await redis.setex('subjects:all', 3600, JSON.stringify(data))
  return data
}
```

### 9.3 前端优化

**代码分割**：
```javascript
// 路由懒加载
const Practice = lazy(() => import('./pages/Practice'))
const Profile = lazy(() => import('./pages/Profile'))

<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/practice" element={<Practice />} />
  </Routes>
</Suspense>
```

**图片优化**：
```javascript
// 使用WebP格式
<img src="image.webp" alt="..." loading="lazy" />
```

---

## 十、成本分析

### 10.1 免费额度

| 服务 | 免费额度 | 超出后费用 |
|------|---------|-----------|
| **Vercel** | 100GB带宽/月 | $20/100GB |
| **Railway** | $5信用/月 | $0.000463/GB-秒 |
| **Supabase** | 500MB存储 + 2GB带宽 | $25/月起 |
| **Claude API** | 无免费额度 | $15/1M tokens (输入) |

### 10.2 预估成本（月）

**初期（100用户）**：
- Vercel：$0（免费额度内）
- Railway：$0（免费额度内）
- Supabase：$0（免费额度内）
- Claude API：~$50（假设每用户10次对话）
- **总计：~$50/月**

**成长期（1000用户）**：
- Vercel：$20
- Railway：$20
- Supabase：$25
- Claude API：~$500
- **总计：~$565/月**

### 10.3 成本优化建议

1. **缓存AI响应**：相同问题不重复调用API
2. **限制免费用户**：每天5次AI对话
3. **使用Prompt压缩**：减少Token消耗
4. **CDN加速**：减少带宽成本

---

## 十一、风险评估与应对

### 11.1 技术风险

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|---------|
| API性能问题 | 高 | 中 | 缓存 + 降级策略 |
| 数据库故障 | 高 | 低 | 自动备份 + 主从复制 |
| AI成本超支 | 中 | 高 | 限流 + 缓存 + 付费墙 |
| 前端兼容性 | 低 | 中 | Polyfill + 浏览器检测 |

### 11.2 业务风险

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|---------|
| 用户增长慢 | 高 | 中 | 营销推广 + 口碑传播 |
| 内容质量差 | 高 | 中 | 人工审核 + 用户反馈 |
| 竞品压力 | 中 | 高 | 差异化定位 + 快速迭代 |

### 11.3 回滚策略

**如果API出现问题**：
```bash
# 立即回滚到本地数据模式
vercel env add VITE_USE_API false

# 或者回滚到上一个版本
vercel rollback
```

---

## 十二、实施时间表

### Phase 0：基础设施（2周）

| 天数 | 任务 | 负责人 | 状态 |
|------|------|--------|------|
| Day 1-2 | 搭建后端骨架 | 后端 | ⏳ 待开始 |
| Day 3 | 配置数据库 | 后端 | ⏳ 待开始 |
| Day 4 | 数据导入 | 后端 | ⏳ 待开始 |
| Day 5 | 创建API接口 | 后端 | ⏳ 待开始 |
| Day 6 | 前端适配 | 前端 | ⏳ 待开始 |
| Day 7 | 测试双轨运行 | 全栈 | ⏳ 待开始 |
| Day 8-9 | 部署后端 | DevOps | ⏳ 待开始 |
| Day 10 | 部署前端 | DevOps | ⏳ 待开始 |

### Phase 1：用户系统（3周）

| 周数 | 任务 | 状态 |
|------|------|------|
| Week 1 | 微信OAuth集成 | ⏳ 待开始 |
| Week 2 | 用户画像与档案 | ⏳ 待开始 |
| Week 3 | 学习进度追踪 | ⏳ 待开始 |

### Phase 2：AI教师（4周）

| 周数 | 任务 | 状态 |
|------|------|------|
| Week 1 | Claude API集成 | ⏳ 待开始 |
| Week 2 | AI对话界面 | ⏳ 待开始 |
| Week 3 | Prompt优化 | ⏳ 待开始 |
| Week 4 | 上下文管理 | ⏳ 待开始 |

### Phase 3：练习系统（4周）

| 周数 | 任务 | 状态 |
|------|------|------|
| Week 1 | 题库设计 | ⏳ 待开始 |
| Week 2 | AI出题引擎 | ⏳ 待开始 |
| Week 3 | 练习界面 | ⏳ 待开始 |
| Week 4 | AI批改 | ⏳ 待开始 |

---

## 十三、验收标准

### 13.1 Phase 0验收标准

**功能验收**：
- [ ] 后端健康检查接口正常
- [ ] 获取所有科目API正常
- [ ] 获取单个科目API正常
- [ ] 前端本地数据模式正常
- [ ] 前端API数据模式正常
- [ ] 两种模式功能一致
- [ ] 错误降级正常
- [ ] 生产环境部署成功

**性能验收**：
- [ ] API响应时间 < 200ms
- [ ] 前端首屏加载 < 2s
- [ ] 数据库查询 < 100ms

**安全验收**：
- [ ] CORS配置正确
- [ ] 环境变量不泄露
- [ ] SQL注入防护
- [ ] XSS防护

### 13.2 后续Phase验收标准

**Phase 1（用户系统）**：
- [ ] 微信扫码登录成功率 > 95%
- [ ] 用户信息正确存储
- [ ] 学习进度准确追踪

**Phase 2（AI教师）**：
- [ ] AI响应时间 < 3s
- [ ] AI回答准确率 > 85%
- [ ] 多轮对话上下文正确

**Phase 3（练习系统）**：
- [ ] 题目加载 < 1s
- [ ] AI批改准确率 > 90%
- [ ] 错题本功能正常

---

## 附录

### A. 开发环境配置

**必需软件**：
- Node.js 20+
- Bun 1.0+
- PostgreSQL 16（可选，用Supabase）
- Git

**推荐工具**：
- VS Code + 插件（ESLint, Prettier, Drizzle Kit）
- Postman（API测试）
- TablePlus（数据库管理）

### B. 常用命令

```bash
# 前端
bun run dev          # 启动开发服务器
bun run build        # 构建生产版本
bun run preview      # 预览构建结果

# 后端
cd backend
bun run dev          # 启动后端（热重载）
bun run db:generate  # 生成数据库迁移
bun run db:migrate   # 执行迁移
bun run db:seed      # 导入初始数据

# 部署
git push origin main # 自动触发Vercel部署
```

### C. 参考资料

- [Hono文档](https://hono.dev)
- [Drizzle ORM文档](https://orm.drizzle.team)
- [Zustand文档](https://zustand-demo.pmnd.rs)
- [Claude API文档](https://docs.anthropic.com)
- [Railway文档](https://docs.railway.app)
- [Supabase文档](https://supabase.com/docs)

---

**文档结束**

**下一步行动**：
1. 阅读并理解本文档
2. 确认技术选型
3. 开始Phase 0实施
4. 定期更新进度
