# 快速参考指南

**用途**：快速查找常用命令、配置和解决方案

---

## 🚀 快速开始

### 启动开发环境

```bash
# 1. 启动后端（终端1）
cd backend
bun run dev

# 2. 启动前端（终端2）
cd ..
bun run dev

# 3. 访问应用
# 前端：http://localhost:3000
# 后端：http://localhost:4000
# 健康检查：http://localhost:4000/health
```

### 切换数据源

```bash
# 使用本地数据
VITE_USE_API=false bun run dev

# 使用API数据
VITE_USE_API=true bun run dev
```

---

## 📁 项目结构

```
alevel-math-app/
├── backend/                 # 后端项目
│   ├── src/
│   │   ├── index.js        # 入口文件
│   │   ├── routes/         # 路由
│   │   ├── db/             # 数据库
│   │   ├── middleware/     # 中间件
│   │   └── utils/          # 工具函数
│   ├── .env.local          # 环境变量（不提交）
│   └── package.json
├── src/                     # 前端源码
│   ├── App.jsx             # 主应用
│   ├── components/         # 组件
│   ├── data/               # 数据
│   ├── hooks/              # Hooks
│   ├── store/              # 状态管理
│   └── utils/              # 工具函数
├── specs/                   # 文档
│   ├── complete-technical-plan.md      # 完整技术方案
│   ├── development-progress.md         # 开发进度
│   ├── phase0-infrastructure-plan.md   # Phase 0计划
│   └── product-roadmap-2026.md         # 产品规划
└── package.json
```

---

## 🔧 常用命令

### 前端命令

```bash
# 开发
bun run dev              # 启动开发服务器（端口3000）
bun run build            # 构建生产版本
bun run preview          # 预览构建结果

# 测试
bun run test             # 运行测试
bun run test:watch       # 监听模式测试

# 代码质量
bun run lint             # ESLint检查
bun run typecheck        # TypeScript类型检查
```

### 后端命令

```bash
cd backend

# 开发
bun run dev              # 启动开发服务器（热重载）
bun run start            # 启动生产服务器

# 数据库
bun run db:generate      # 生成迁移脚本
bun run db:migrate       # 执行迁移
bun run db:seed          # 导入初始数据
bun run db:studio        # 打开Drizzle Studio

# 测试
bun run test             # 运行测试
```

### Git命令

```bash
# 提交代码
git add .
git commit -m "描述"
git push origin main

# 查看状态
git status
git log --oneline -10

# 分支管理
git checkout -b feature/new-feature
git merge feature/new-feature
```

---

## 🌐 环境变量

### 前端环境变量

**`.env.local`（开发环境）**：
```bash
VITE_USE_API=false
VITE_API_URL=http://localhost:4000
```

**`.env.production`（生产环境）**：
```bash
VITE_USE_API=true
VITE_API_URL=https://your-backend.railway.app
```

### 后端环境变量

**`backend/.env.local`**：
```bash
# 服务器
PORT=4000
NODE_ENV=development

# 数据库
DATABASE_URL=postgresql://user:password@localhost:5432/alevel_db

# CORS
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your-secret-key-here

# Claude API（可选）
CLAUDE_API_KEY=sk-ant-xxx
```

---

## 🗄️ 数据库操作

### 连接数据库

```bash
# 使用psql
psql $DATABASE_URL

# 使用TablePlus
# 直接粘贴DATABASE_URL连接
```

### 常用SQL

```sql
-- 查看所有表
\dt

-- 查看表结构
\d subjects

-- 查询数据
SELECT * FROM subjects;
SELECT * FROM units WHERE subject_id = 'mathematics';

-- 统计记录数
SELECT COUNT(*) FROM chapters;

-- 清空表（慎用）
TRUNCATE TABLE subjects CASCADE;
```

### 数据库迁移

```bash
cd backend

# 1. 修改 src/db/schema.js
# 2. 生成迁移
bun run db:generate

# 3. 查看生成的迁移文件
ls src/db/migrations/

# 4. 执行迁移
bun run db:migrate

# 5. 验证
bun run db:studio  # 打开可视化界面
```

---

## 🔌 API测试

### 使用curl

```bash
# 健康检查
curl http://localhost:4000/health

# 获取所有科目
curl http://localhost:4000/api/subjects

# 获取单个科目
curl http://localhost:4000/api/subjects/mathematics

# 获取章节
curl http://localhost:4000/api/chapters/m1c1

# 带认证的请求
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4000/api/users/me
```

### 使用Postman

1. 导入环境变量：
   - `BASE_URL`: `http://localhost:4000`
   - `TOKEN`: `your_jwt_token`

2. 创建请求集合：
   - GET `{{BASE_URL}}/health`
   - GET `{{BASE_URL}}/api/subjects`
   - GET `{{BASE_URL}}/api/subjects/:id`

---

## 🐛 常见问题

### 问题1：端口被占用

**错误**：`Error: listen EADDRINUSE: address already in use :::3000`

**解决**：
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### 问题2：数据库连接失败

**错误**：`Error: connect ECONNREFUSED`

**解决**：
1. 检查 `DATABASE_URL` 是否正确
2. 确认数据库服务已启动
3. 检查防火墙设置

### 问题3：API返回CORS错误

**错误**：`Access to fetch at 'http://localhost:4000' has been blocked by CORS policy`

**解决**：
```javascript
// backend/src/index.js
app.use('*', cors({
  origin: ['http://localhost:3000'],  // 添加前端URL
  credentials: true,
}))
```

### 问题4：前端无法获取API数据

**检查清单**：
1. 后端是否启动？`curl http://localhost:4000/health`
2. 环境变量是否正确？`echo $VITE_API_URL`
3. 网络请求是否成功？打开浏览器DevTools → Network
4. 是否有JavaScript错误？打开浏览器Console

### 问题5：Bun命令不存在

**错误**：`bun: command not found`

**解决**：
```bash
# 安装Bun
curl -fsSL https://bun.sh/install | bash

# 或使用npm
npm install -g bun
```

---

## 📦 部署

### 部署后端到Railway

```bash
# 1. 推送代码到GitHub
git add .
git commit -m "准备部署"
git push origin main

# 2. 在Railway中
# - 连接GitHub仓库
# - 选择backend文件夹
# - 添加PostgreSQL服务
# - 配置环境变量
# - 点击Deploy

# 3. 执行数据库迁移
railway run bun run db:migrate
railway run bun run db:seed
```

### 部署前端到Vercel

```bash
# 1. 在Vercel中配置环境变量
VITE_USE_API=true
VITE_API_URL=https://your-backend.railway.app

# 2. 推送代码（自动部署）
git push origin main

# 3. 查看部署日志
vercel logs
```

---

## 🔍 调试技巧

### 后端调试

```javascript
// 添加日志
console.log('Debug:', variable)

// 使用调试器
debugger

// 查看请求详情
app.use('*', async (c, next) => {
  console.log(`${c.req.method} ${c.req.url}`)
  await next()
})
```

### 前端调试

```javascript
// React DevTools
// 安装浏览器扩展：React Developer Tools

// 查看状态
console.log('State:', useStore.getState())

// 性能分析
console.time('fetch')
await fetchData()
console.timeEnd('fetch')
```

### 数据库调试

```sql
-- 查看慢查询
SELECT * FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- 查看表大小
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 📚 学习资源

### 官方文档

- [Hono](https://hono.dev)
- [Drizzle ORM](https://orm.drizzle.team)
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Zustand](https://zustand-demo.pmnd.rs)
- [Claude API](https://docs.anthropic.com)

### 教程

- [Hono入门教程](https://hono.dev/getting-started/basic)
- [Drizzle ORM快速开始](https://orm.drizzle.team/docs/quick-start)
- [React Hooks指南](https://react.dev/reference/react)

---

## 🆘 获取帮助

### 内部资源

- 查看 `specs/complete-technical-plan.md` 了解完整方案
- 查看 `specs/development-progress.md` 了解当前进度
- 查看 `CLAUDE.md` 了解项目规范

### 外部资源

- [GitHub Issues](https://github.com/your-repo/issues)
- [Stack Overflow](https://stackoverflow.com)
- [Discord社区](https://discord.gg/your-server)

---

**最后更新**：2026-03-06
