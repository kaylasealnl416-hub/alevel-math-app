# 部署配置文档

> 本项目采用 **前后端分离部署**：前端 Vercel、后端 Render、数据库 Supabase。
> 历史 Railway 部署配置已归档至 `archive/old-deploy-docs/`（2026-04 前使用）。

---

## 后端部署（Render）

### 部署信息

| 项 | 值 |
|---|---|
| 平台 | Render |
| 生产 URL | https://alevel-math-app.onrender.com |
| 运行时 | Bun |
| 启动命令 | `bun run start`（指向 `bun src/index.js`） |
| 自动部署 | 推送 GitHub main 分支自动触发 |

### 健康检查

```bash
curl https://alevel-math-app.onrender.com/health
# 期望返回 {"status":"ok","timestamp":"...","version":"...","uptime":...}
```

### 必需环境变量（Render Dashboard → Environment）

```env
# 数据库
DATABASE_URL=postgresql://...（Supabase 连接串）

# JWT / 会话
JWT_SECRET=<32 字符以上随机字符串>

# Node 环境
NODE_ENV=production

# CORS（逗号分隔前端域名）
CORS_ORIGIN=https://alevel-math-app.vercel.app
```

### 可选环境变量

```env
# AI 服务（如启用后端统一代理模型）
ANTHROPIC_API_KEY=sk-ant-...
GLM_API_KEY=...
GEMINI_API_KEY=...
```

**注意**：
- 不要手动设置 `PORT`，Render 自动注入
- 环境变量改动后 Render 会触发 redeploy

---

## 前端部署（Vercel）

### 部署信息

| 项 | 值 |
|---|---|
| 平台 | Vercel |
| 生产 URL | https://alevel-math-app.vercel.app |
| 仓库 | kaylasealnl416-hub/alevel-math-app（GitHub） |
| 自动部署 | 推送 main 分支触发 |

### 必需环境变量（Vercel Dashboard → Settings → Environment Variables）

```env
# 后端 API 地址（生产）
VITE_API_URL=https://alevel-math-app.onrender.com

# 启用后端 API
VITE_USE_API=true
```

### 本地开发环境变量

复制 `.env.example` 到 `.env.local`：

```env
VITE_API_URL=http://localhost:4000
VITE_USE_API=true
```

---

## 数据库（Supabase）

| 项 | 值 |
|---|---|
| 项目 ID | `mozzqjeusrjuxycwpyld` |
| 区域 | `aws-1-ap-southeast-1`（新加坡） |
| ORM | Drizzle |

数据库密码管理：

- 生产密码**只存 Render 环境变量**，不写入代码
- 本地开发密码存 `backend/.env.local`，`.env.local` 已 gitignored
- 密码轮换后需同步更新 Render + 本地 `.env.local`

---

## CORS 配置

后端默认允许：
- `http://localhost:3000`（本地前端）
- 由 `CORS_ORIGIN` 环境变量指定的生产前端域名

修改 `backend/src/index.js` 可新增白名单。

---

## 部署流程

### 后端

1. 推送代码到 GitHub main 分支
2. Render 自动检测并构建（约 2-3 分钟）
3. `curl /health` 验证
4. 若失败看 Render Dashboard → Logs

### 前端

1. 推送代码到 GitHub main 分支
2. Vercel 自动构建（约 1-2 分钟）
3. 访问 Vercel URL 测试

---

## 故障排查

| 症状 | 可能原因 | 处理 |
|------|---------|------|
| `/health` 返回 502 | Render 冷启动或崩溃 | 等 30 秒重试；看 Render Logs |
| 前端 CORS 报错 | `CORS_ORIGIN` 未配置 Vercel 域名 | 在 Render 环境变量加域名 |
| 前端 API 请求 404 | `VITE_API_URL` 未更新 | 检查 Vercel 环境变量，重新部署 |
| 数据库连接失败 | `DATABASE_URL` 过期或密码错 | Supabase → Settings → Database → Connection string |

---

## 历史版本

- **2026-03 至 2026-04**：后端部署在 Railway（URL `alevel-math-app-production-6e22.up.railway.app`），配置归档在 `archive/old-deploy-docs/`
- **2026-04 起**：迁移至 Render（git commit `13954ce`）
