# A-Level AI教师 - 后端服务

**版本**：1.0.0
**技术栈**：Hono + Drizzle ORM + PostgreSQL

---

## 快速开始

### 安装依赖

```bash
bun install
```

### 配置环境变量

```bash
# 复制环境变量示例文件
cp .env.example .env.local

# 编辑 .env.local，填写真实的数据库连接信息
```

**重要**：配置数据库前，请先阅读 [DATABASE_SETUP.md](./DATABASE_SETUP.md) 了解如何设置数据库。

### 配置数据库

**选项1：使用Supabase（推荐）**

查看详细步骤：[DATABASE_SETUP.md](./DATABASE_SETUP.md)

**选项2：使用本地PostgreSQL**

查看详细步骤：[DATABASE_SETUP.md](./DATABASE_SETUP.md)

### 测试数据库连接

```bash
bun run db:test
```

### 初始化数据库

```bash
# 1. 生成迁移脚本
bun run db:generate

# 2. 执行迁移（创建表）
bun run db:migrate

# 3. 查看数据库（可选）
bun run db:studio
```

### 启动开发服务器

```bash
bun run dev
```

服务器将在 `http://localhost:4000` 启动

### 测试健康检查

```bash
curl http://localhost:4000/health
```

应该返回：
```json
{
  "status": "ok",
  "timestamp": "2026-03-06T10:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 可用命令

```bash
# 开发
bun run dev          # 启动开发服务器（热重载）
bun run start        # 启动生产服务器

# 数据库
bun run db:test      # 测试数据库连接
bun run db:generate  # 生成数据库迁移脚本
bun run db:migrate   # 执行数据库迁移
bun run db:studio    # 打开Drizzle Studio（数据库可视化）
bun run db:seed      # 导入初始数据
```

---

## 项目结构

```
backend/
├── src/
│   ├── index.js           # 服务器入口
│   ├── routes/            # API路由
│   ├── db/                # 数据库
│   ├── middleware/        # 中间件
│   └── utils/             # 工具函数
├── .env.example           # 环境变量示例
├── .env.local             # 本地环境变量（不提交）
├── package.json
└── README.md
```

---

## API文档

### 健康检查

**GET /health**

响应：
```json
{
  "status": "ok",
  "timestamp": "2026-03-06T10:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 开发进度

- [x] Day 1-2: 搭建后端骨架
  - [x] 创建项目结构
  - [x] 安装依赖
  - [x] 创建基础服务器
  - [x] 配置环境变量
  - [x] 测试健康检查接口
- [x] Day 3: 配置数据库
  - [x] 创建数据库Schema
  - [x] 配置Drizzle Kit
  - [x] 创建数据库连接工具
  - [x] 创建数据库配置指南
- [x] Day 4: 数据导入
  - [x] 创建数据导入脚本
  - [x] 导入5个科目
  - [x] 导入20个单元
  - [x] 导入82个章节
- [x] Day 5: 创建API接口
  - [x] 创建科目路由
  - [x] 创建章节路由
  - [x] 集成到主服务器
  - [x] 测试所有API
- [x] Day 6-7: 前端集成与测试
  - [x] 创建API客户端
  - [x] 创建数据源适配层
  - [x] 测试双轨运行
- [x] Day 8-9: 部署准备
  - [x] 创建Railway配置
  - [x] 创建部署文档
  - [x] 准备生产环境

---

## 部署

### 部署到Railway

详细步骤请查看：[部署指南](../specs/deployment-guide.md)

```bash
# 1. 推送代码到GitHub
git add .
git commit -m "准备部署"
git push origin main

# 2. 在Railway中部署
# - 连接GitHub仓库
# - 选择backend目录
# - 添加PostgreSQL
# - 配置环境变量
# - 部署

# 3. 执行数据库迁移
railway run bun run db:migrate
railway run bun run db:seed
```

---

## 相关文档

- [完整技术方案](../specs/complete-technical-plan.md)
- [开发进度追踪](../specs/development-progress.md)
- [快速参考指南](../specs/quick-reference.md)
