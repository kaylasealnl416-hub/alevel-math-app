# 部署验证与修复指南

**日期**: 2026-03-10
**状态**: 代码已推送，等待部署验证

---

## 📋 当前状态

### 代码状态
- ✅ 所有代码已提交到 GitHub
- ✅ 最新 commit: `d26e18d` - 修复 LearningPlanPage 语法错误
- ✅ 构建测试通过（本地 `bun run build` 成功）
- ✅ 所有测试通过（14/14 tests - 100%）

### 部署配置
- **前端**: Vercel - https://alevel-math-app.vercel.app
- **后端**: Railway - https://alevel-math-app-production-6e22.up.railway.app
- **自动部署**: GitHub main 分支推送触发

---

## 🔍 部署验证步骤

### 1. 验证后端部署（Railway）

#### 步骤 A：检查 Railway 控制台
1. 访问 https://railway.app/
2. 登录你的账号
3. 进入项目：`alevel-math-app`
4. 点击后端服务

#### 步骤 B：查看部署状态
在 Railway 控制台中：
- **Deployments** 标签：查看最新部署状态
  - ✅ 绿色 = 部署成功
  - 🔴 红色 = 部署失败
  - 🟡 黄色 = 正在部署

#### 步骤 C：查看日志
如果部署失败，点击失败的部署查看日志，常见错误：

**错误 1：环境变量缺失**
```
Error: DATABASE_URL is not defined
```
**解决**：在 Variables 标签中添加 `DATABASE_URL`

**错误 2：数据库连接失败**
```
Error: connect ECONNREFUSED
```
**解决**：检查 DATABASE_URL 是否正确，确认 Supabase 数据库正常运行

**错误 3：依赖安装失败**
```
error: package not found
```
**解决**：检查 package.json，确认所有依赖都已列出

**错误 4：启动命令错误**
```
Error: Cannot find module
```
**解决**：确认 Start Command 为 `bun src/index.js`

#### 步骤 D：验证环境变量
在 Railway 的 **Variables** 标签中，确认以下变量：

```env
# 必需变量
DATABASE_URL=postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
JWT_SECRET=your-jwt-secret-key-here

# 可选变量
NODE_ENV=production
ZHIPU_API_KEY=your-zhipu-api-key（如果使用 AI 功能）

# 不要设置（Railway 自动配置）
# PORT=8080  ❌ 删除这个变量
```

#### 步骤 E：测试健康检查
部署成功后，在浏览器或命令行测试：

```bash
# 健康检查
curl https://alevel-math-app-production-6e22.up.railway.app/health

# 预期响应
{
  "status": "ok",
  "timestamp": "2026-03-10T...",
  "uptime": 123.45
}
```

如果返回 502 错误：
```json
{"status":"error","code":502,"message":"Application failed to respond"}
```
说明服务没有正常启动，返回步骤 C 查看日志。

---

### 2. 验证前端部署（Vercel）

#### 步骤 A：检查 Vercel 控制台
1. 访问 https://vercel.com/
2. 登录你的账号
3. 进入项目：`alevel-math-app`

#### 步骤 B：查看部署状态
在 Vercel 控制台中：
- **Deployments** 标签：查看最新部署
  - ✅ Ready = 部署成功
  - 🔴 Error = 部署失败
  - 🟡 Building = 正在构建

#### 步骤 C：查看构建日志
如果部署失败，点击失败的部署查看日志，常见错误：

**错误 1：构建失败**
```
Error: Transform failed with 2 errors
```
**解决**：检查语法错误（已修复：LearningPlanPage.jsx）

**错误 2：依赖安装失败**
```
error: package not found
```
**解决**：检查 package.json

#### 步骤 D：验证环境变量
在 Vercel 的 **Settings → Environment Variables** 中，确认：

```env
# 后端 API 地址
VITE_API_URL=https://alevel-math-app-production-6e22.up.railway.app

# 启用 API
VITE_USE_API=true

# AI Provider（可选）
VITE_AI_PROVIDER=anthropic
```

**重要**：修改环境变量后需要重新部署：
- 点击 "Redeploy" 按钮
- 或推送新 commit 触发自动部署

#### 步骤 E：测试前端访问
在浏览器访问：https://alevel-math-app.vercel.app

**预期结果**：
- ✅ 页面正常加载
- ✅ 可以看到主页内容
- ✅ 导航栏正常显示

---

## 🔧 常见问题修复

### 问题 1：Railway 返回 502 错误

**症状**：
```bash
curl https://alevel-math-app-production-6e22.up.railway.app/health
# 返回：{"status":"error","code":502}
```

**原因**：
1. 服务没有正常启动
2. 环境变量配置错误
3. 数据库连接失败
4. 端口配置冲突

**解决步骤**：
1. 检查 Railway 部署日志
2. 验证所有环境变量已配置
3. 确认没有手动设置 `PORT` 变量
4. 点击 "Redeploy" 重新部署
5. 如果仍然失败，检查数据库连接

### 问题 2：Vercel 构建失败

**症状**：
Vercel 显示 "Build Error"

**原因**：
1. 语法错误（已修复）
2. 依赖缺失
3. 环境变量错误

**解决步骤**：
1. 查看构建日志找到具体错误
2. 本地运行 `bun run build` 验证
3. 修复错误后推送代码
4. Vercel 会自动重新构建

### 问题 3：前端无法连接后端

**症状**：
- 前端页面加载正常
- API 调用失败（Network Error）

**原因**：
1. `VITE_API_URL` 配置错误
2. 后端服务未运行
3. CORS 配置问题

**解决步骤**：
1. 确认后端健康检查通过
2. 检查 Vercel 环境变量中的 `VITE_API_URL`
3. 确认 URL 末尾没有多余的斜杠
4. 检查浏览器控制台的 CORS 错误
5. 如果有 CORS 错误，检查后端 CORS 配置

### 问题 4：数据库连接失败

**症状**：
Railway 日志显示：
```
Error: connect ECONNREFUSED
Error: password authentication failed
```

**原因**：
1. DATABASE_URL 配置错误
2. Supabase 数据库暂停或删除
3. 网络连接问题

**解决步骤**：
1. 登录 Supabase 控制台
2. 确认数据库正常运行
3. 复制正确的连接字符串（使用 Pooler 连接）
4. 更新 Railway 的 `DATABASE_URL`
5. 重新部署

---

## ✅ 完整验证清单

### 后端验证（Railway）
- [ ] Railway 部署状态为 "Active"
- [ ] 环境变量已配置（DATABASE_URL, JWT_SECRET）
- [ ] 健康检查返回 200 OK
- [ ] 测试 API 端点：
  ```bash
  curl https://alevel-math-app-production-6e22.up.railway.app/api/subjects
  ```

### 前端验证（Vercel）
- [ ] Vercel 部署状态为 "Ready"
- [ ] 环境变量已配置（VITE_API_URL）
- [ ] 页面可以正常访问
- [ ] 浏览器控制台无错误

### 功能验证
- [ ] 用户注册功能正常
- [ ] 用户登录功能正常
- [ ] 考试创建和答题正常
- [ ] 考试提交和批改正常
- [ ] AI 反馈生成正常
- [ ] 错题本查询正常
- [ ] 学习计划生成正常

---

## 🚀 触发重新部署
法 1：通过控制台
**Railway**：
1. 进入 Railway 项目
2. 点击服务
3. 点击右上角 "⋯" 菜单
4. 选择 "Redeploy"

**Vercel**：
1. 进入 Vercel 项目
2. 点击 "Deployments"
3. 找到最新部署
4. 点击 "⋯" 菜单
5. 选择 "Redeploy"

### 方法 2：推送代码
```bash
# 创建一个空 commit 触发部署
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

---

## 📞 需要帮助？

如果遇到无法解决的问题：

1. **查看日志**：
   - Railway: Deployments → 点击部署 → View Logs
   - Vercel: Deployments → 点击部署 → Build Logs

2. **检查状态页**：
   - Railway Status: https://status.railway.app/
   - Vercel Status: https://www.vercel-status.com/

3. **常见资源**：
   - Railway 文档: httprailway.app/
   - Vercel 文档: https://vercel.com/docs

---

## 📝 下一步

部署验证完成后：

1. **记录部署 URL**：
   - 前端：https://alevel-math-app.vercel.app
   - 后端：https://alevel-math-app-production-6e22.up.railway.app

2. **更新文档**：
   - 在 README.md 中添加部署链接
   - 更新 DEPLOYMENT_CONFIG.md 的状态

3. **通知用户**：
   - 分享前端 URL
   - 提供测试账号（如果需要）

4. **监控运行**：
   - 定期检查 Railway 日志
   - 监控 Vercel Analytics
   - 关注错误报告

---

**最后更新**: 2026-03-10
**状态**: 等待部署验证
