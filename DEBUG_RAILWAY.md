# 🔧 后端部署问题排查

## ❌ 当前状态

测试 `https://alevel-math-app-production.up.railway.app/health` 返回：
```json
{"status":"error","code":502,"message":"Application failed to respond"}
```

这说明后端服务没有正常启动。

---

## 🔍 需要检查的地方

### 1️⃣ 查看部署日志

在 Railway 项目页面：

1. 点击你的服务卡片
2. 点击顶部的 **"Deployments"** 标签
3. 点击最新的部署（最上面的那个）
4. 查看 **"Build Logs"** 和 **"Deploy Logs"**

**请截图或复制最后 20-30 行的日志给我看**

---

### 2️⃣ 检查 Root Directory

在 **Settings → Source**：
- 确认 **Root Directory** = `backend`
- 如果不是，修改并保存

---

### 3️⃣ 检查环境变量

在 **Variables** 标签：
- 确认有这些变量：
  ```
  DATABASE_URL
  NODE_ENV=production
  JWT_SECRET
  FRONTEND_URL
  ```

---

### 4️⃣ 常见问题

#### 问题 A：Root Directory 未设置
**症状**：找不到 `package.json`
**解决**：设置 Root Directory = `backend`

#### 问题 B：依赖安装失败
**症状**：日志显示 `npm install` 或 `bun install` 失败
**解决**：检查 `package.json` 是否正确

#### 问题 C：数据库连接失败
**症状**：日志显示 `ETIMEDOUT` 或 `connection refused`
**解决**：检查 `DATABASE_URL` 是否正确

#### 问题 D：端口配置错误
**症状**：服务启动但无法访问
**解决**：确认代码中使用 `process.env.PORT`

---

## 📸 下一步

**请截图或复制 Deploy Logs 的最后 20-30 行给我看**

在 Railway：
1. Deployments 标签
2. 点击最新部署
3. 查看 Deploy Logs
4. 复制最后的错误信息

---

**把日志发给我，我会帮你解决！** 🔧
