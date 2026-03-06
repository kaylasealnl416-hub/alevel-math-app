# 数据库配置指南

## 选项1：使用Supabase（推荐，免费）

### 步骤1：注册Supabase

1. 访问 [supabase.com](https://supabase.com)
2. 点击 "Start your project"
3. 使用GitHub账号登录

### 步骤2：创建项目

1. 点击 "New Project"
2. 填写项目信息：
   - Name: `alevel-ai-teacher`
   - Database Password: 设置一个强密码（保存好）
   - Region: 选择离你最近的区域（建议：Singapore）
3. 点击 "Create new project"
4. 等待约2分钟，项目创建完成

### 步骤3：获取数据库连接字符串

1. 在项目页面，点击左侧 "Settings" → "Database"
2. 找到 "Connection string" 部分
3. 选择 "URI" 标签
4. 复制连接字符串，格式类似：
   ```
   postgresql://postgres.xxxxx:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
5. 将 `[YOUR-PASSWORD]` 替换为你设置的密码

### 步骤4：配置环境变量

编辑 `backend/.env.local`：

```bash
DATABASE_URL=postgresql://postgres.xxxxx:你的密码@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### 步骤5：测试连接

```bash
cd backend
bun run db:generate
```

如果成功，会生成迁移文件。

---

## 选项2：使用本地PostgreSQL

### 步骤1：安装PostgreSQL

**Windows**：
1. 下载 [PostgreSQL](https://www.postgresql.org/download/windows/)
2. 安装时设置密码（记住这个密码）
3. 默认端口：5432

**Mac**：
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Linux**：
```bash
sudo apt install postgresql-16
sudo systemctl start postgresql
```

### 步骤2：创建数据库

```bash
# 连接到PostgreSQL
psql -U postgres

# 创建数据库
CREATE DATABASE alevel_db;

# 退出
\q
```

### 步骤3：配置环境变量

编辑 `backend/.env.local`：

```bash
DATABASE_URL=postgresql://postgres:你的密码@localhost:5432/alevel_db
```

### 步骤4：测试连接

```bash
cd backend
bun run db:generate
```

---

## 选项3：使用Neon（无服务器PostgreSQL）

### 步骤1：注册Neon

1. 访问 [neon.tech](https://neon.tech)
2. 使用GitHub账号登录

### 步骤2：创建项目

1. 点击 "Create a project"
2. 选择区域（建议：AWS Singapore）
3. 项目自动创建

### 步骤3：获取连接字符串

1. 在项目页面，点击 "Connection Details"
2. 复制 "Connection string"
3. 格式类似：
   ```
   postgresql://user:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb
   ```

### 步骤4：配置环境变量

编辑 `backend/.env.local`：

```bash
DATABASE_URL=postgresql://user:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb
```

---

## 执行数据库迁移

配置好数据库连接后：

```bash
cd backend

# 1. 生成迁移脚本
bun run db:generate

# 2. 执行迁移（创建表）
bun run db:migrate

# 3. 查看数据库（可选）
bun run db:studio
```

---

## 验证数据库

### 方法1：使用Drizzle Studio

```bash
cd backend
bun run db:studio
```

浏览器会自动打开 `https://local.drizzle.studio`，可以可视化查看数据库。

### 方法2：使用psql

```bash
psql $DATABASE_URL

# 查看所有表
\dt

# 查看表结构
\d subjects

# 退出
\q
```

### 方法3：使用TablePlus（推荐）

1. 下载 [TablePlus](https://tableplus.com)
2. 创建新连接
3. 粘贴 `DATABASE_URL`
4. 连接成功后可以可视化管理数据库

---

## 常见问题

### Q1：连接超时

**原因**：防火墙或网络问题

**解决**：
- 检查防火墙设置
- 尝试使用VPN
- 确认数据库服务正在运行

### Q2：密码错误

**原因**：密码包含特殊字符需要URL编码

**解决**：
```bash
# 如果密码是 p@ssw0rd!
# 需要编码为 p%40ssw0rd%21
```

在线工具：[URL Encoder](https://www.urlencoder.org/)

### Q3：数据库不存在

**原因**：数据库名称错误

**解决**：
- 检查 `DATABASE_URL` 中的数据库名称
- 确认数据库已创建

---

## 下一步

配置好数据库后，继续 Day 4：数据导入

查看 [development-progress.md](../../specs/development-progress.md) 了解详细步骤。
