# Phase 0：基础设施搭建方案（无损迁移）

**文档版本**：v1.0
**创建日期**：2026-03-06
**目标**：在不影响现有应用运行的前提下，搭建前后端分离架构

---

## 一、现状分析

### 1.1 当前应用架构
```
alevel-math-app/
├── src/
│   ├── App.jsx                    # 主应用入口
│   ├── alevel-math-app.jsx        # 核心应用组件
│   ├── components/                # UI组件
│   ├── data/subjects.js           # 科目数据（硬编码）
│   ├── hooks/                     # 自定义Hooks
│   └── utils/                     # 工具函数
├── package.json                   # 依赖管理
├── vite.config.js                 # Vite配置
└── vercel.json                    # Vercel部署配置
```

**特点**：
- ✅ 纯前端应用，数据硬编码在 `src/data/subjects.js`
- ✅ 使用 React 18 + Vite
- ✅ 已部署到 Vercel
- ✅ 支持多科目（数学、经济学等）
- ❌ 无后端，无数据库
- ❌ 无用户系统
- ❌ 无AI功能

### 1.2 迁移目标
```
新架构：
┌─────────────────────────────────────────────────────┐
│  前端（React）- 保持现有功能不变                      │
│  localhost:3000 (开发) / vercel.app (生产)           │
└────────────────┬────────────────────────────────────┘
                 │ HTTP API
┌────────────────┴────────────────────────────────────┐
│  后端（Node.js + Hono）- 新增                        │
│  localhost:4000 (开发) / railway.app (生产)          │
├─────────────────────────────────────────────────────┤
│  数据库（PostgreSQL）- 新增                          │
│  localhost:5432 (开发) / supabase.com (生产)         │
└─────────────────────────────────────────────────────┘
```

---

## 二、迁移策略：渐进式演进

### 2.1 核心原则
1. **双轨运行**：前端同时支持"本地数据"和"API数据"
2. **功能开关**：通过环境变量控制是否启用后端
3. **向后兼容**：新功能不破坏旧功能
4. **灰度发布**：先在开发环境验证，再上生产

### 2.2 迁移路径（4步走）

#### Step 1：搭建后端骨架（不影响前端）
- 创建独立的后端项目 `backend/`
- 搭建 API 服务器（Hono）
- 配置数据库（PostgreSQL）
- **前端不做任何改动**

#### Step 2：数据迁移（双轨运行）
- 将 `src/data/subjects.js` 数据导入数据库
- 创建 API 接口（GET /api/subjects）
- 前端添加"数据源切换"逻辑：
  ```javascript
  const USE_API = import.meta.env.VITE_USE_API === 'true'
  const subjects = USE_API ? await fetchFromAPI() : LOCAL_DATA
  ```
- **默认仍使用本地数据，确保现有功能正常**

#### Step 3：逐步切换到API（灰度）
- 开发环境启用 API（`VITE_USE_API=true`）
- 验证功能一致性
- 生产环境仍使用本地数据
- **用户无感知**

#### Step 4：完全切换（上线）
- 生产环境启用 API
- 移除本地数据文件
- 监控错误日志
- **完成迁移**

---

## 三、详细实施步骤

### Step 1：搭建后端骨架（第1-3天）

#### 1.1 创建后端项目结构
```bash
# 在项目根目录创建 backend 文件夹
mkdir backend
cd backend
bun init -y
```

**目录结构**：
```
backend/
├── src/
│   ├── index.js              # 入口文件
│   ├── routes/               # 路由
│   │   ├── subjects.js       # 科目相关API
│   │   ├── users.js          # 用户相关API（预留）
│   │   └── index.js          # 路由汇总
│   ├── db/                   # 数据库
│   │   ├── schema.js         # 数据库Schema（Drizzle ORM）
│   │   ├── migrations/       # 迁移脚本
│   │   └── seed.js           # 初始数据
│   ├── middleware/           # 中间件
│   │   ├── auth.js           # 认证（预留）
│   │   ├── cors.js           # CORS配置
│   │   └── logger.js         # 日志
│   └── utils/                # 工具函数
│       ├── config.js         # 配置管理
│       └── response.js       # 统一响应格式
├── .env.example              # 环境变量示例
├── .env.local                # 本地环境变量（不提交）
├── package.json
└── README.md
```

#### 1.2 安装依赖
```bash
cd backend
bun add hono @hono/node-server
bun add drizzle-orm postgres
bun add dotenv
bun add -d drizzle-kit
```

#### 1.3 创建基础服务器
**backend/src/index.js**：
```javascript
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import subjectsRoutes from './routes/subjects.js'

const app = new Hono()

// 中间件
app.use('*', logger())
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://your-app.vercel.app'],
  credentials: true,
}))

// 健康检查
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// 路由
app.route('/api/subjects', subjectsRoutes)

// 404处理
app.notFound((c) => c.json({ error: 'Not Found' }, 404))

// 错误处理
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: err.message }, 500)
})

const port = process.env.PORT || 4000
console.log(`🚀 Server running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})
```

#### 1.4 配置环境变量
**backend/.env.example**：
```bash
# 服务器配置
PORT=4000
NODE_ENV=development

# 数据库配置（Supabase）
DATABASE_URL=postgresql://user:password@localhost:5432/alevel_db

# CORS配置
FRONTEND_URL=http://localhost:3000

# JWT密钥（预留）
JWT_SECRET=your-secret-key-here
```

**backend/.env.local**（复制 .env.example 并填写真实值）

#### 1.5 配置数据库
**backend/src/db/schema.js**（使用 Drizzle ORM）：
```javascript
import { pgTable, serial, text, jsonb, timestamp, integer, boolean } from 'drizzle-orm/pg-core'

// 科目表
export const subjects = pgTable('subjects', {
  id: text('id').primaryKey(), // 'mathematics', 'economics'
  name: jsonb('name').notNull(), // { zh: '数学', en: 'Mathematics' }
  nameFull: jsonb('name_full'),
  icon: text('icon'),
  color: text('color'),
  bgColor: text('bg_color'),
  level: text('level'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// 单元表
export const units = pgTable('units', {
  id: text('id').primaryKey(), // 'Unit1', 'Unit2'
  subjectId: text('subject_id').notNull().references(() => subjects.id),
  title: jsonb('title').notNull(),
  subtitle: jsonb('subtitle'),
  color: text('color'),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// 章节表
export const chapters = pgTable('chapters', {
  id: text('id').primaryKey(), // 'e1c1', 'm1c1'
  unitId: text('unit_id').notNull().references(() => units.id),
  num: integer('num').notNull(),
  title: jsonb('title').notNull(),
  overview: jsonb('overview'),
  keyPoints: jsonb('key_points'), // 数组
  formulas: jsonb('formulas'), // 数组
  examples: jsonb('examples'), // 数组
  videos: jsonb('videos'), // 数组
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// 用户表（预留）
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  wechatOpenid: text('wechat_openid').unique(),
  nickname: text('nickname'),
  avatar: text('avatar'),
  email: text('email'),
  createdAt: timestamp('created_at').defaultNow(),
})
```

**backend/drizzle.config.js**：
```javascript
import { defineConfig } from 'drizzle-kit'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

export default defineConfig({
  schema: './src/db/schema.js',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})
```

#### 1.6 创建数据库迁移
```bash
cd backend
bun run drizzle-kit generate
bun run drizzle-kit migrate
```

#### 1.7 测试后端
```bash
cd backend
bun run src/index.js
```

访问 `http://localhost:4000/health`，应该返回：
```json
{
  "status": "ok",
  "timestamp": "2026-03-06T10:00:00.000Z"
}
```

---

### Step 2：数据迁移（第4-5天）

#### 2.1 创建数据导入脚本
**backend/src/db/seed.js**：
```javascript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema.js'
import { SUBJECTS } from '../../data-import/subjects.js' // 从前端复制过来

const client = postgres(process.env.DATABASE_URL)
const db = drizzle(client, { schema })

async function seed() {
  console.log('🌱 开始导入数据...')

  // 导入科目数据
  for (const [subjectId, subjectData] of Object.entries(SUBJECTS)) {
    console.log(`导入科目: ${subjectId}`)

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
      console.log(`  导入单元: ${unitId}`)

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
        console.log(`    导入章节: ${chapterData.id}`)

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

  console.log('✅ 数据导入完成！')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ 数据导入失败:', err)
  process.exit(1)
})
```

**执行导入**：
```bash
cd backend
bun run src/db/seed.js
```

#### 2.2 创建API接口
**backend/src/routes/subjects.js**：
```javascript
import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../db/schema.js'
import { eq } from 'drizzle-orm'

const app = new Hono()
const client = postgres(process.env.DATABASE_URL)
const db = drizzle(client, { schema })

// GET /api/subjects - 获取所有科���
app.get('/', async (c) => {
  const allSubjects = await db.select().from(schema.subjects)
  return c.json({ data: allSubjects })
})

// GET /api/subjects/:id - 获取单个科目详情（含单元和章节）
app.get('/:id', async (c) => {
  const subjectId = c.req.param('id')

  // 查询科目
  const subject = await db.select().from(schema.subjects).where(eq(schema.subjects.id, subjectId)).limit(1)
  if (!subject.length) {
    return c.json({ error: 'Subject not found' }, 404)
  }

  // 查询单元
  const subjectUnits = await db.select().from(schema.units).where(eq(schema.units.subjectId, subjectId))

  // 查询章节
  const unitIds = subjectUnits.map(u => u.id)
  const allChapters = await db.select().from(schema.chapters).where(eq(schema.chapters.unitId, unitIds))

  // 组装数据
  const result = {
    ...subject[0],
    books: {}
  }

  for (const unit of subjectUnits) {
    result.books[unit.id] = {
      ...unit,
      chapters: allChapters.filter(ch => ch.unitId === unit.id).sort((a, b) => a.order - b.order)
    }
  }

  return c.json({ data: result })
})

export default app
```

#### 2.3 测试API
```bash
# 启动后端
cd backend
bun run src/index.js

# 测试（新终端）
curl http://localhost:4000/api/subjects
curl http://localhost:4000/api/subjects/economics
```

---

### Step 3：前端���配（第6-7天）

#### 3.1 创建API客户端
**src/utils/api.js**（已存在，需要扩展）：
```javascript
// API配置
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const USE_API = import.meta.env.VITE_USE_API === 'true'

// 统一请求函数
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('API请求失败:', error)
    throw error
  }
}

// 科目相关API
export const subjectsAPI = {
  // 获取所有科目
  getAll: async () => {
    return request('/api/subjects')
  },

  // 获取单个科目详情
  getById: async (id) => {
    return request(`/api/subjects/${id}`)
  },
}

// 导出配置
export { API_BASE_URL, USE_API }
```

#### 3.2 创建数据适配层
**src/data/dataSource.js**（新建）：
```javascript
import { SUBJECTS as LOCAL_SUBJECTS } from './subjects.js'
import { subjectsAPI, USE_API } from '../utils/api.js'

/**
 * 数据源适配器 - 支持本地数据和API数据
 */
class DataSource {
  constructor() {
    this.useAPI = USE_API
    this.cache = new Map()
  }

  /**
   * 获取所有科目
   */
  async getSubjects() {
    if (!this.useAPI) {
      // 使用本地数据
      return LOCAL_SUBJECTS
    }

    // 使用API数据
    try {
      const response = await subjectsAPI.getAll()
      const subjects = {}

      // 转换为前端期望的格式
      for (const subject of response.data) {
        subjects[subject.id] = subject
      }

      return subjects
    } catch (error) {
      console.warn('API请求失败，降级到本地数据:', error)
      return LOCAL_SUBJECTS // 降级策略
    }
  }

  /**
   * 获取单个科目详情
   */
  async getSubject(id) {
    if (!this.useAPI) {
      return LOCAL_SUBJECTS[id]
    }

    // 检查缓存
    if (this.cache.has(id)) {
      return this.cache.get(id)
    }

    try {
      const response = await subjectsAPI.getById(id)
      this.cache.set(id, response.data)
      return response.data
    } catch (error) {
      console.warn('API请求失败，降级到本地数据:', error)
      return LOCAL_SUBJECTS[id]
    }
  }
}

// 导出单例
export const dataSource = new DataSource()
```

#### 3.3 修改前端组件（示例）
**src/alevel-math-app.jsx**（部分修改）：
```javascript
import { useState, useEffect } from 'react'
import { dataSource } from './data/dataSource.js'

export default function ALevelMathApp() {
  const [subjects, setSubjects] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadSubjects() {
      try {
        setLoading(true)
        const data = await dataSource.getSubjects()
        setSubjects(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadSubjects()
  }, [])

  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error}</div>

  // 其余代码保持不变...
}
```

#### 3.4 配置环境变量
**前端 .env.local**（新建）：
```bash
# 开发环境 - 使用本地数据（默认）
VITE_USE_API=false
VITE_API_URL=http://localhost:4000

# 如果要测试API，改为：
# VITE_USE_API=true
```

**前端 .env.production**（新建）：
```bash
# 生产环境 - 使用API
VITE_USE_API=true
VITE_API_URL=https://your-backend.railway.app
```

#### 3.5 测试双轨运��
```bash
# 终端1：启动后端
cd backend
bun run src/index.js

# 终端2：启动前端（使用本地数据）
cd ..
VITE_USE_API=false bun run dev

# 终端3：启动前端（使用API数据）
VITE_USE_API=true bun run dev --port 3001
```

对比两个前端页面，确保功能一致。

---

### Step 4：部署后端（第8-10天）

#### 4.1 选择部署平台
推荐：**Railway** 或 **Render**（都支持免费套餐）

**Railway优势**：
- 自动检测 Node.js 项目
- 内置 PostgreSQL
- GitHub自动部署
- 免费额度：$5/月

#### 4.2 部署到Railway

**步骤**：
1. 访问 [railway.app](https://railway.app)
2. 连接GitHub仓库
3. 选择 `backend` 文件夹
4. 添加 PostgreSQL 服务
5. 配置环境变量：
   ```
   DATABASE_URL=${POSTGRES_URL}  # Railway自动注入
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```
6. 部署

**backend/package.json** 添加启动脚本：
```json
{
  "scripts": {
    "start": "bun run src/index.js",
    "dev": "bun --watch src/index.js",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:seed": "bun run src/db/seed.js"
  }
}
```

#### 4.3 配置Vercel环境变量
在Vercel项目设置中添加：
```
VITE_USE_API=true
VITE_API_URL=https://your-backend.railway.app
```

#### 4.4 重新部署前端
```bash
git add .
git commit -m "集成后端API"
git push origin main
```

Vercel会自动部署，新版本将使用后端API。

---

## 四、验证清单

### 4.1 后端验证
- [ ] 健康检查接口正常：`GET /health`
- [ ] 获取所有科目：`GET /api/subjects`
- [ ] 获取单个科目：`GET /api/subjects/economics`
- [ ] 数据库连接正常
- [ ] CORS配置正确（前端可以跨域请求）

### 4.2 前端验证
- [ ] 本地数据模式正常（`VITE_USE_API=false`）
- [ ] API数据模式正常（`VITE_USE_API=true`）
- [ ] 两种模式功能一致
- [ ] 错误降级正常（API失败时使用本地数据）
- [ ] 生产环境部署正常

### 4.3 性能验证
- [ ] API响应时间 < 200ms
- [ ] 前端首屏加载 < 2s
- [ ] 数据库查询优化（添加索引）

---

## 五、风险控制

### 5.1 回滚策略
如果API出现问题，立即回滚：
```bash
# Vercel环境变量改为
VITE_USE_API=false

# 或者直接回滚到上一个版本
vercel rollback
```

### 5.2 监控告警
- 使用 Railway 内置监控
- 配置错误日志（Sentry）
- 设置API响应时间告警

### 5.3 数据备份
```bash
# 定期备份数据库
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

---

## 六、时间表

| 天数 | 任务 | 交付物 |
|------|------|--------|
| Day 1-2 | 搭建后端骨架 | 可运行的API服务器 |
| Day 3 | 配置数据库 | 数据库Schema + 迁移脚本 |
| Day 4 | 数据导入 | 数据库中有完整数据 |
| Day 5 | 创建API接口 | 可用的REST API |
| Day 6 | 前端适配 | 数据源适配层 |
| Day 7 | 测试双轨运行 | 本地验证通过 |
| Day 8-9 | 部署后端 | 生产环境后端 |
| Day 10 | 部署前端 | 完整上线 |

**总计：10天**

---

## 七、下一步（Phase 1）

完成基础设施后，可以开始：
1. 用户系统（微信登录）
2. 学习进度追踪
3. AI教师功能

---

## 八、常见问题

### Q1：为什么不直接切换到API？
**A**：渐进式迁移风险更低，可以随时回滚。

### Q2：本地数据和API数据如何保持同步？
**A**：初期手动同步，后期移除本地数据，只用API。

### Q3：如果API挂了怎么办？
**A**：前端有降级策略，会自动使用本地数据。

### Q4：数据库选型为什么是PostgreSQL？
**A**：
- 支持JSON字段（存储多语言内容）
- 成熟稳定
- Supabase/Railway都支持
- 未来可扩展（全文搜索、向量搜索）

### Q5：为什么用Hono而不是Express？
**A**：
- 更轻量（~12KB）
- 更快（性能优于Express）
- TypeScript原生支持
- 现代化API设计

---

## 九、总结

这个方案的核心是**渐进式演进**：
1. 后端和前端独立开发，互不影响
2. 前端通过"数据源适配层"支持双轨运行
3. 通过环境变量控制数据来源
4. 生产环境可以随时回滚

**优势**：
- ✅ 零风险：现有功能不受影响
- ✅ 可回滚：随时切换回本地数据
- ✅ 可测试：开发环境充分验证
- ✅ 可扩展：为后续功能打好基础

**开始行动**：
```bash
# 1. 创建后端项目
mkdir backend && cd backend && bun init -y

# 2. 安装依赖
bun add hono @hono/node-server drizzle-orm postgres dotenv

# 3. 创建基础文件
mkdir -p src/{routes,db,middleware,utils}
touch src/index.js src/routes/subjects.js

# 4. 开始编码！
```
