# 部署配置文档

## 后端部署（Railway）

### 部署信息
- **平台**: Railway
- **URL**: https://alevel-math-app-production-6e22.up.railway.app
- **端口**: 8080（自动配置）
- **状态**: ✅ 运行中

### 健康检查
```bash
curl https://alevel-math-app-production-6e22.up.railway.app/health
```

### 环境变量配置
在 Railway 项目的 Variables 标签中配置：

```env
# 数据库
DATABASE_URL=postgresql://...

# JWT 密钥
JWT_SECRET=your-secret-key

# AI API（可选）
ANTHROPIC_API_KEY=sk-ant-...

# Node 环境
NODE_ENV=production
```

**注意**: 不要手动设置 `PORT` 变量，Railway 会自动配置。

---

## 前端部署（Vercel）

### 部署信息
- **平台**: Vercel
- **仓库**: GitHub 私有仓库
- **自动部署**: 推送到 main 分支触发

### 环境变量配置
在 Vercel 项目的 Settings → Environment Variables 中配置：

```env
# 后端 API 地址
VITE_API_URL=https://alevel-math-app-production-6e22.up.railway.app

# 启用后端 API
VITE_USE_API=true

# AI Provider（可选）
VITE_AI_PROVIDER=anthropic
```

### 本地开发环境变量
复制 `.env.example` 到 `.env.local`：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：
```env
VITE_API_URL=http://localhost:4000
VITE_USE_API=true
VITE_AI_PROVIDER=anthropic
```

---

## CORS 配置

后端已配置允许以下来源：
- `http://localhost:3000` - 本地开发
- `https://*.vercel.app` - 所有 Vercel 部署

如果需要添加自定义域名，修改 `backend/src/index.js`:
```javascript
app.use('*', cors({
  origin: [
    'http://localhost:3000',
    'https://*.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true,
}))
```

---

## 部署流程

### 后端部署
1. 推送代码到 GitHub
2. Railway 自动检测并部署
3. 等待部署完成（约 2-3 分钟）
4. 测试健康检查端点

### 前端部署
1. 确保 `.env.production` 配置正确
2. 推送代码到 GitHub main 分支
3. Vercel 自动构建并部署
4. 等待部署完成（约 1-2 分钟）
5. 访问 Vercel 提供的 URL 测试

---

## 测试清单

###- [ ] 健康检查: `/health`
- [ ] 科目列表: `/api/subjects`
- [ ] 用户注册: `/api/auth/register`
- [ ] 用户登录: `/api/auth/login`

### 前端测试
- [ ] 页面加载正常
- [ ] API 调用成功
- [ ] 用户注册/登录流程
- [ ] 学习进度保存
- [ ] AI 聊天功能

---

## 故障排查

### 502 Bad Gateway
- 检查 Railway 日志确认服务器启动
- 确认端口配置正确（应为 8080）
- 检查 Networking 配置

### CORS 错误
- 确认前端域名在 CORS 白名单中
- 检查请求是否包含正确的 Origin 头

### API 调用失败
- 检查 `VITE_API_URL` 环境变量
- 确认后端服务正常运行
- 查看浏览器控制台错误信息
