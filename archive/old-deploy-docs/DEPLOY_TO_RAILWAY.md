# Railway 部署指南

**更新时间**：2026-03-07

---

## 📋 前置条件

✅ **已完成**：
- 后端代码已准备好
- 数据库已配置（Supabase）
- 数据已导入（5 科目，82 章节）
- 本地测试通过

---

## 🚀 部署步骤

### Step 1：注册 Railway 账号

1. 访问 https://railway.app
2. 点击右上角 "Login"
3. 选择 "Login with GitHub"
4. 授权 Railway 访问你的 GitHub 账号
5. 验证邮箱（如果需要）

---

### Step 2：创建新项目

1. 登录后，点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 如果是第一次使用，需要：
   - 点击 "Configure GitHub App"
   - 选择要授权的仓库（`alevel-math-app`）
   - 点击 "Install & Authorize"
4. 返回 Railway，选择 `alevel-math-app` 仓库
5. Railway 会自动检测到项目

---

### Step 3：配置根目录

**重要**：因为后端代码在 `backend/` 子目录中，需要配置：

1. 在 Railway 项目页面，点击你的服务
2. 点击 "Settings" 标签
3. 找到 "Root Directory" 设置
4. 输入：`backend`
5. 点击 "Save"

---

### Step 4：配置环境变量

在 Railway 项目页面：

1. 点击 "Variables" 标签
2. 点击 "New Variable"
3. 添加以下环境变量：

#### 必需的环境变量

```bash
# 数据库连接（从你的 backend/.env.local 复制）
DATABASE_URL=postgresql://postgres.mozzqjeusrjuxycwpyld:MySecure%40Pass2026@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres

# 生产环境标识
NODE_ENV=production

# JWT 密钥（使用下面生成的强随机字符串）
JWT_SECRET=db4e6e64e16dcd80bee82ec4bdc4f6c63ab246df79436f9015d1ac0cfdfe3711

# 前端地址（暂时先用占位符，部署后再更新）
FRONTEND_URL=https://alevel-math-app.vercel.app
```

#### 可选的环境变量（如果需要 AI 功能）

```bash
# Claude API Key（如果你有的话）
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

**注意**：
- 每个变量单独添加
- 点击 "Add" 保存每个变量
- `JWT_SECRET` 已经为你生成好了（见上面）

---

### Step 5：部署

1. 环境变量配置完成后，Railway 会自动开始部署
2. 点击 "Deployments" 标签查看部署进度
3. 等待 2-3 分钟，直到看到 "Success" ✅

**部署日志示例**：
```
Installing dependencies...
✓ Dependencies installed
Building application...
✓ Build complete
Starting server...
✓ Server running on port 4000
```

---

### Step 6：获取部署 URL

1. 部署成功后，点击 "Settings" 标签
2. 找到 "Domains" 部分
3. 点击 "Generate Domain"
4. Railway 会生成一个 URL，例如：
   ```
   https://alevel-backend-production-xxxx.up.railway.app
   ```
5. **复制这个 URL**，后面需要用到

---

### Step 7：测试后端

打开浏览器或使用 curl 测试：

```bash
# 测试健康检查
curl https://your-backend-url.railway.app/health

# 应该返回：
{
  "status": "ok",
  "timestamp": "2026-03-07T..."
}
```

如果返回上面的 JSON，说明后端部署成功！✅

---

### Step 8：更新前端环境变量

现在需要让前端知道后端的地址：

#### 在 Vercel 配置：

1. 访问 https://vercel.com
2. 进入你的项目（`alevel-math-app`）
3. 点击 "Settings" → "Environment Variables"
4. 添加或更新以下变量：

```bash
# 启用 API 模式
VITE_USE_API=true

# 后端 API 地址（使用 Railway 生成的 URL）
VITE_API_URL=https://your-backend-url.railway.app
```

5. 点击 "Save"

#### 重新部署前端：

**方式 1：通过 Git 推送**
```bash
git commit --allow-empty -m "更新后端 API 地址"
git push origin main
```

**方式 2：在 Vercel Dashboard**
- 进入 "Deployments" 标签
- 点击最新部署右侧的 "..." 菜单
- 选择 "Redeploy"

---

### Step 9：更新 Railway 的 FRONTEND_URL

现在后端也需要知道前端的地址（用于 CORS）：

1. 回到 Railway 项目
2. 点击 "Variables" 标签
3. 找到 `FRONTEND_URL` 变量
4. 更新为你的 Vercel 地址：
   ```
   https://alevel-math-app.vercel.app
   ```
5. 点击 "Save"
6. Railway 会自动重新部署

---

## ✅ 验证部署

### 测试清单：

1. **后端健康检查**：
   ```bash
   curl https://your-backend.railway.app/health
   ```
   ✅ 应该返回 `{"status":"ok"}`

2. **前端访问**：
   - 访问 https://alevel-math-app.vercel.app
   - ✅ 应该能看到首页

3. **API 集成**：
   - 打开浏览器开发者工具（F12）
   - 切换到 "Network" 标签
   - 刷新页面
   - ✅ 应该看到对 Railway 后端的请求

4. **用户注册**（如果有注册页面）：
   - 尝试注册新用户
   - ✅ 应该成功

5. **用户登录**：
   - 尝试登录
   - ✅ 应该成功并获得 Token

---

## 🔧 故障排查

### 问题 1：部署失败 "Build failed"

**可能原因**：
- Root Directory 未设置为 `backend`
- `package.json` 中的脚本有误

**解决方案**：
1. 检查 Settings → Root Directory = `backend`
2. 检查 `backend/package.json` 中有 `"start": "bun src/index.js"`
3. 查看详细的部署日志

---

### 问题 2：部署成功但访问 /health 返回 404

**可能原因**：
- 服务器未正确启动
- 端口配置错误

**解决方案**：
1. 查看 Railway 的 "Logs" 标签
2. 确认看到 "Server running on port 4000"
3. 检查 `backend/src/index.js` 中的端口配置

---

### 问题 3：前端无法连接后端（CORS 错误）

**错误信息**：
```
Access to fetch at 'https://...' from origin 'https://...'
has been blocked by CORS policy
```

**解决方案**：
1. 检查 Railway 的 `FRONTEND_URL` 环境变量
2. 确保值为：`https://alevel-math-app.vercel.app`（不要有尾部斜杠）
3. 重新部署后端

---

### 问题 4：数据库连接失败

**错误信息**：
```
Error: connect ETIMEDOUT
```

**解决方案**：
1. 检查 `DATABASE_URL` 是否正确
2. 确认 Supabase 项目未暂停
3. 测试连接：在 Railway Logs 中查看错误详情

---

## 📊 监控和维护

### Railway Dashboard

**查看实时日志**：
1. 进入项目
2. 点击 "Logs" 标签
3. 可以看到所有请求和错误

**查看资源使用**：
1. 点击 "Metrics" 标签
2. 可以看到 CPU、内存、网络使用情况

**查看部署历史**：
1. 点击 "Deployments" 标签
2. 可以看到所有部署记录
3. 可以回滚到之前的版本

---

## 💰 成本估算

**Railway 免费额度**：
- $5 信用/月
- 约 500 小时运行时间

**预估使用**：
- 小型应用：$0-5/月（免费额度内）
- 中型应用（100-1000 用户）：$5-20/月
- 大型应用（>1000 用户）：$20-50/月

**优化建议**：
- 使用 Railway 的 "Sleep on Idle" 功能（开发环境）
- 生产环境保持常驻

---

## 🎉 部署完成！

如果所有测试都通过，恭喜你！后端已成功部署到 Railway。

**下一步**：
- [ ] 配置错误监控（Sentry）
- [ ] 配置性能监控
- [ ] 设置自动备份
- [ ] 编写 API 文档

---

## 📞 需要帮助？

- Railway 文档：https://docs.railway.app
- Railway Discord：https://discord.gg/railway
- 项目 Issues：https://github.com/your-username/alevel-math-app/issues

---

**部署时间**：_____________
**部署 URL**：_____________
**状态**：⏳ 待部署
