# 数据库迁移说明

## 迁移文件：0003_fluffy_wildside.sql

### 需要执行的 SQL

```sql
-- 1. 修改 chat_contexts 表的 relevance_score 字段类型
ALTER TABLE "chat_contexts" ALTER COLUMN "relevance_score" SET DATA TYPE real;
ALTER TABLE "chat_contexts" ALTER COLUMN "relevance_score" SET DEFAULT 1;

-- 2. 为 users 表添加 password 字段
ALTER TABLE "users" ADD COLUMN "password" varchar(255);

-- 3. 为 users 表的 email 字段添加唯一约束
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");
```

## 执行方式

### 方式 1：使用 Drizzle Studio（推荐）

```bash
cd backend
bun run db:studio
```

然后在浏览器中访问 https://local.drizzle.studio，在 SQL 编辑器中执行上述 SQL。

### 方式 2：直接连接 Supabase

1. 访问 Supabase Dashboard
2. 进入 SQL Editor
3. 执行上述 SQL

### 方式 3：使用 psql 命令行

```bash
psql "postgresql://postgres.iqxqxqxqxqxqxqxq:Alevel2024!@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres" << 'EOF'
ALTER TABLE "chat_contexts" ALTER COLUMN "relevance_score" SET DATA TYPE real;
ALTER TABLE "chat_contexts" ALTER COLUMN "relevance_score" SET DEFAULT 1;
ALTER TABLE "users" ADD COLUMN "password" varchar(255);
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");
EOF
```

## 验证迁移

执行后，验证表结构：

```sql
-- 检查 users 表结构
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('password', 'email');

-- 检查约束
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'users'
AND constraint_name = 'users_email_unique';

-- 检查 chat_contexts 表
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'chat_contexts'
AND column_name = 'relevance_score';
```

## 预期结果

### users 表
- `password` 字段：varchar(255)，可为空
- `email` 字段：有唯一约束

### chat_contexts 表
- `relevance_score` 字段：real 类型，默认值 1

## 注意事项

1. 如果 `users` 表中已有重复的 email，添加唯一约束会失败
2. 需要先清理重复数据：
   ```sql
   -- 查找重复的 email
   SELECT email, COUNT(*)
   FROM users
   WHERE email IS NOT NULL
   GROUP BY email
   HAVING COUNT(*) > 1;

   -- 如果有重复，需要手动处理
   ```

3. `password` 字段添加后，现有用户的密码为 NULL，需要用户重新设置密码或使用注册流程

## 迁移完成后

执行以下测试确认迁移成功：

```bash
# 测试注册 API
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "nickname": "测试用户",
    "grade": "AS"
  }'

# 测试登录 API
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```
