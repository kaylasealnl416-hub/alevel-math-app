# 部署指南

## 🚀 后端部署到Railway

### 准备工作

**已完成**：
- ✅ 后端代码完成
- ✅ 数据库Schema定义
- ✅ 数据导入脚本
- ✅ API接口测试通过

### 部署步骤

#### 1. 准备Railway配置

**backend/railway.json**：
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "bun run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### 2. 环境变量配置

在Railway中配置以下环境变量：

```bash
# 数据库（Railway自动注入）
DATABASE_URL=${{Postgres.DATABASE_URL}}

# 应用配置
NODE_ENV=production
PORT=4000

# CORS配置
FRONTEND_URL=https://your-app.vercel.app

# JWT密钥（生产环境必须更换）
JWT_SECRET=生成一个强密码

# Claude API（Phase 2需要）
# CLAUDE_API_KEY=sk-ant-xxx
```

#### 3. 部署命令

```bash
# 1. 推送代码到GitHub
git add backend/
git commit -m "准备部署后端"
git push origin main

# 2. 在Railway中
# - New Project
# - Deploy from GitHub repo
# - 选择 backend 目录
# - 添加 PostgreSQL 服务
# - 配置环境变量
# - Deploy

# 3. 执行数据库迁移
railway run bun run db:migrate

# 4. 导入数据
railway run bun run db:seed
```

#### 4. 验证部署

```bash
# 测试健康检查
curl https://your-backend.railway.app/health

# 测试API
curl https://your-backend.railway.app/api/subjects
```

---

## 🌐 前端部署到Vercel

### 准备工作

**已完成**：
- ✅ 前端代码完成
- ✅ API客户端集成
- ✅ 数据源适配层
- ✅ 环境变量配置

### 部署步骤

#### 1. 配置Vercel环境变量

在Vercel项目设置中添加：

```bash
# 启用API模式
VITE_USE_API=true

# 后端API地址（部署后更新）
VITE_API_URL=https://your-backend.railway.app
```

#### 2. 部署命令

```bash
# 推送代码（自动触发Vercel部署）
git add .
git commit -m "集成后端API"
git push origin main
```

#### 3. 验证部署

```bash
# 访问生产环境
https://your-app.vercel.app

# 测试API集成
https://your-app.vercel.app?test=api
```

---

## ✅ 部署检查清单

### 后端部署

- [ ] Railway项目创建
- [ ] PostgreSQL服务添加
- [ ] 环境变量配置
- [ ] 代码部署成功
- [ ] 数据库迁移执行
- [ ] 数据导入完成
- [ ] 健康检查通过
- [ ] API接口测试通过

### 前端部署

- [ ] Vercel环境变量配置
- [ ] 代码部署成功
- [ ] 主应用正常访问
- [ ] API集成正常
- [ ] 数据显示正确

---

## 🔧 故障排查

### 后端问题

**问题1：数据库连接失败**
```bash
# 检查DATABASE_URL
railway variables

# 测试连接
railway run bun src/db/test-connection.js
```

**问题2：API返回500错误**
```bash
# 查看日志
railway logs

# 检查环境变量
railwles
```

### 前端问题

**问题1：API请求失败**
- 检查VITE_API_URL是否正确
- 检查后端CORS配置
- 查看浏览器控制台错误

**问题2：数据不显示**
- 检查VITE_USE_API是否为true
- 测试降级策略是否工作
- 查看网络请求状态

---

## 📝 部署后验证

### 1. 后端验证

```bash
# 健康检查
curl https://your-backend.railway.app/health

# 获取科目列表
curl https://your-backend.railway.app/api/subjects

# 获取科目详情
curl https://your-backend.railway.app/api/subjects/economics

# 获取章节详情
curl https://your-backend.railway.app/api/chapters/e1c1
```

### 2. 前端验证

- [ ] 访问主页正常
- [ ] 科目列表显示
- [ ] 科目详情加载
- [ ] 章节内容显示
- [ ] 视频播放正常
- [ ] 所有功能正常

##n
- [ ] API响应时间 < 500ms
- [ ] 首屏加载 < 3s
- [ ] 无明显卡顿

---

## 🎉 部署完成

恭喜！前后端分离架构部署完成。

**下一步**：
- Phase 1：用户系统（微信登录）
- Phase 2：AI教师功能
- Phase 3：练习系统

---

**部署日期**：2026-03-06
**部署人员**：Claude
**部署状态**：✅ 就绪
