# 部署检查清单

**日期**：2026-03-07
**状态**：进行中

---

## ✅ 已完成

### 1. 数据库准备
- ✅ Supabase PostgreSQL 已连接
- ✅ 14 个表已创建
- ✅ 数据已导入（5 科目，20 单元，82 章节）
- ✅ 3 个测试用户已存在

### 2. 后端代码
- ✅ Node.js + Hono 框架
- ✅ JWT 认证系统
- ✅ 速率限制
- ✅ 输入验证（Zod）
- ✅ 所有依赖已安装

---

## 🚀 待部署

### 3. Railway 部署

**步骤**：

#### Step 1：准备 Railway 账号
1. 访问 https://railway.app
2. 使用 GitHub 账号登录
3. 验证邮箱

#### Step 2：创建新项目
1. 点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择仓库：`alevel-math-app`
4. 选择目录：`backend`

#### Step 3：配置环境变量
在 Railway 项目设置中添加：

```bash
# 数据库连接（从 Supabase 复制）
DATABASE_URL=postgresql://postgres.mozzqjeusrjuxycwpyld:MySecure%40Pass2026@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres

# 服务器配置
NODE_ENV=production
PORT=4000

# 前端地址（Vercel）
FRONTEND_URL=https://your-app.vercel.app

# JWT 密钥（生成强随机字符串）
JWT_SECRET=<生成一个强随机字符串>

# Claude API Key（如果需要）
ANTHROPIC_API_KEY=<你的 API Key>
```

**生成 JWT_SECRET**：
```bash
# 在本地运行
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Step 4：配置构建命令
Railway 会自动检测 `package.json`，使用：
- 构建命令：`bun install`
- 启动命令：`bun start`

#### Step 5：部署
1. 点击 "Deploy"
2. 等待部署完成（约 2-3 分钟）
3. 获取部署 URL（例如：`https://your-backend.railway.app`）

#### Step 6：测试后端
```bash
# 测试健康检查
curl https://your-backend.railway.app/health

# 应该返回：
# {"status":"ok","timestamp":"2026-03-07T..."}
```

---

### 4. Vercel 前端配置

#### Step 1：添加环境变量
在 Vercel 项目设置中添加：

```bash
# 启用 API 模式
VITE_USE_API=true

# 后端 API 地址（从 Railway 获取）
VITE_API_URL=https://your-backend.railway.app
```

#### Step 2：重新部署
```bash
# 方式 1：通过 Git 推送触发
git commit --allow-empty -m "触发 Vercel 重新部署"
git push origin main

# 方式 2：在 Vercel Dashboard 手动触发
# Deployments → 点击 "Redeploy"
```

---

### 5. 端到端测试

#### 测试清单：

**基础功能**：
- [ ] 访问前端首页
- [ ] 查看科目列表
- [ ] 查看章节内容

**用户系统**：
- [ ] 用户注册
- [ ] 用户登录
- [ ] 获取用户信息

**AI 对话**（如果已实现）：
- [ ] 创建聊天会话
- [ ] 发送消息
- [ ] 接收 AI 回复

**学习进度**：
- [ ] 保存学习进度
- [ ] 查询学习进度
- [ ] 多设备同步

---

## 📝 部署信息记录

### Railway 后端
- **项目名称**：_____________
- **部署 URL**：_____________
- **部署时间**：_____________
- **状态**：⏳ 待部署

### Vercel 前端
- **项目名称**：alevel-math-app
- **部署 URL**：https://your-app.vercel.app
- **环境变量**：⏳ 待配置
- **状态**：⏳ 待重新部署

---

## ⚠️ 注意事项

1. **JWT_SECRET**：
   - 必须使用强随机字符串
   - 不要使用 `dev-secret-key-change-in-production`
   - 至少 32 字符

2. **DATABASE_URL**：
   - 确保密码正确（URL 编码）
   - 使用 Supabase 的 Pooler 连接（端口 6543）

3. **CORS 配置**：
   - 确保 `FRONTEND_URL` 正确
   - 后端会自动配置 CORS

4. **API Key 安全**：
   - `ANTHROPIC_API_KEY` 只存储在 Railway
   - 不要提交到 Git
   - 不要暴露在前端

---

## 🔧 故障排查

### 问题 1：Railway 部署失败
**检查**：
- 查看 Railway 部署日志
- 确认 `package.json` 中的 `start` 脚本正确
- 确认所有依赖已安装

### 问题 2：数据库连接失败
**检查**：
- 确认 `DATABASE_URL` 正确
- 确认 Supabase 项目未暂停
- 测试连接：`bun run db:test`

### 问题 3：前端无法连接后端
**检查**：
- 确认 `VITE_API_URL` 正确
- 确认后端 CORS 配置包含前端域名
- 打开浏览器开发者工具查看网络请求

### 问题 4：401 Unauthorized
**检查**：
- 确认用户已登录
- 确认 JWT Token 正确
- 确认 `JWT_SECRET` 在前后端一致

---

## 📞 支持资源

- Railway 文档：https://docs.railway.app
- Vercel 文档：https://vercel.com/docs
- Supabase 文档：https://supabase.com/docs
- 项目 GitHub：https://github.com/your-username/alevel-math-app

---

**更新时间**：2026-03-07
**下次检查**：部署完成后
