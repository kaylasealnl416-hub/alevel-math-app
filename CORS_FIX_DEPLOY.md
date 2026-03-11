# 🔧 CORS 修复部署指南

## 📋 问题描述

前端（Vercel）访问后端（Railway）时出现 CORS 错误：
```
Access to fetch at 'https://alevel-math-app-production-6e22.up.railway.app/api/exams'
from origin 'https://alevel-math-app.vercel.app' has been blocked by CORS policy
```

## ✅ 已完成的修复

### 1. 更新 CORS 配置代码
- 文件：`backend/src/index.js`
- 修改：使用动态 origin 验证函数
- 支持：所有 `*.vercel.app` 子域名
- 环境变量：支持 `CORS_ORIGIN` 配置

### 2. 更新环境变量示例
- 文件：`backend/.env.example`
- 添加：完整的 CORS_ORIGIN 配置示例

## 🚀 部署步骤

### 方法 1：通过 GitHub 自动部署（推荐）

1. **启动代理服务器**（如果需要）
   ```bash
   # 确保代理服务器运行在 127.0.0.1:10809
   ```

2. **推送代码到 GitHub**
   ```bash
   git push origin main --force-with-lease
   ```

3. **Railway 自动部署**
   - Railway 会自动检测到新提交
   - 自动构建并部署新版本
   - 等待 2-3 分钟完成部署

### 方法 2：手动在 Railway 添加环境变量

如果无法推送代码，可以临时在 Railway Dashboard 添加环境变量：

1. 访问 Railway Dashboard
2. 选择 `alevel-math-app-production-6e22` 项目
3. 进入 **Variables** 标签
4. 添加新变量：
   ```
   CORS_ORIGIN=https://alevel-math-app.vercel.app
   ```
5. 点击 **Deploy** 重新部署

## 🧪 验证修复

部署完成后，访问前端测试：

1. **打开前端页面**
   ```
   https://alevel-math-app.vercel.app/exams
   ```

2. **检查浏览器控制台**
   - ✅ 应该看到：`📊 数据源模式: API`
   - ✅ 应该看到：考试列表数据加载成功
   - ❌ 不应该看到：CORS 错误

3. **测试 API 请求**
   ```bash
   curl -H "Origin: https://alevel-math-app.vercel.app" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        https://alevel-math-app-production-6e22.up.railway.app/api/exams
   ```

   应该返回：
   ```
   Access-Control-Allow-Origin: https://alevel-math-app.vercel.app
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
   ```

## 📝 技术细节

### CORS 配置逻辑

```javascript
origin: (origin) => {
  // 1. 从环境变量读取额外的允许域名
  const envOrigins = process.env.CORS_ORIGIN?.split(',').map(o => o.trim()) || []

  // 2. 默认允许的域名
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://alevel-math-app.vercel.app',
    ...envOrigins
  ]

  // 3. 允许所有 *.vercel.app 子域名
  if (origin?.endsWith('.vercel.app')) return origin

  // 4. 检查允许列表
  if (allowedOrigins.includes(origin)) return origin

  // 5. 开发环境允许所有
  if (process.env.NODE_ENV === 'development') return origin || '*'

  return allowedOrigins[0]
}
```

### 为什么之前的配置不工作？

❌ **旧配置**：
```javascript
origin: ['http://localhost:3000', 'https://*.vercel.app']
```

问题：Hono 的 CORS 中间件不支持通配符模式 `*.vercel.app`

✅ **新配置**：
```javascript
origin: (origin) => {
  if (origin?.endsWith('.vercel.app')) return origin
  // ...
}
```

解决：使用函数动态验证域名

## 🔍 故障排查

### 如果 CORS 错误仍然存在

1. **检查 Railway 部署状态**
   ```bash
   curl https://alevel-math-app-production-6e22.up.railway.app/health
   ```

2. **检查环境变量**
   - Railway Dashboard → Variables
   - 确认 `CORS_ORIGIN` 已设置

3. **清除浏览器缓存**
   - Chrome: Ctrl+Shift+Delete
   - 选择 "Cached images and files"

4. **检查 Railway 日志**
   - Railway Dashboard → Deployments → Logs
   - 查找 CORS 相关错误

## 📊 提交信息

```
Commit: 96fc402
Message: Fix CORS configuration to support Vercel deployment

Changes:
- backend/src/index.js: 动态 CORS origin 验证
- backend/.env.example: 更新 CORS_ORIGIN 示例
```

## 🎯 下一步

修复完成后：
1. ✅ 验证前端可以访问后端 API
2. ✅ 测试考试列表页面加载
3. ⏭️ 创建登录页面（如果需要）
4. ⏭️ 完整的端到端测试

---

**修复时间**: 2026-03-11
**状态**: ⏳ 等待推送到 GitHub
