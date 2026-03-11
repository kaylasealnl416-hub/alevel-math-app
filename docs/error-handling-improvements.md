# 错误处理优化报告

**完成日期**: 2026-03-11
**任务**: 错误处理优化（方案 B - 任务 #3）

---

## 📋 完成内容

### 1. 后端全局错误处理中间件 ✅

**文件**: `backend/src/middleware/errorHandler.js`（新建）

**功能**:
- ✅ 统一错误响应格式
- ✅ 错误日志记录（开发/生产环境分离）
- ✅ 上下文信息收集（method, path, userId, IP）
- ✅ 自定义错误类
  - `AppError` - 基础错误类
  - `ValidationError` - 验证错误（400）
  - `NotFoundError` - 资源不存在（404）
  - `UnauthorizedError` - 未授权（401）
  - `ForbiddenError` - 禁止访问（403）
  - `ConflictError` - 资源冲突（409）
  - `DatabaseError` - 数据库错误（500）
  - `ExternalServiceError` - 外部服务错误（503）
- ✅ Zod 验证错误特殊处理
- ✅ 404 处理中间件

**错误日志格式**:
```javascript
// 开发环境
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ ERROR: 用户不存在
📍 Path: GET /api/users/999
🔢 Status: 404
🏷️  Code: NOT_FOUND
👤 User: 123
🌐 IP: 192.168.1.1
📚 Stack: [完整堆栈]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 生产环境
{"timestamp":"2026-03-11T12:00:00.000Z","level":"ERROR","message":"用户不存在","code":"NOT_FOUND","statusCode":404,"method":"GET","path":"/api/users/999","userId":123,"ip":"192.168.1.1"}
```

**错误响应格式**:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "用户不存在",
    "details": null  // 仅开发环境
  }
}
```

---

### 2. 前端 API 客户端优化 ✅

**文件**: `src/utils/apiClient.js`（增强）

**新增功能**:
- ✅ 自动重试机制（默认 2 次）
- ✅ 指数退避策略（1s, 2s, 4s...）
- ✅ 请求超时控制（默认 30 秒）
- ✅ 网络错误检测与重试
- ✅ 统一错误处理
- ✅ 全局 Toast 通知
- ✅ 401 自动跳转登录
- ✅ 自定义错误类
  - `ApiError` - API 错误
  - `NetworkError` - 网络错误

**配置选项**:
```javascript
{
  retry: 2,              // 重试次数
  retryDelay: 1000,      // 重试延迟（毫秒）
  timeout: 30000,        // 超时时间（毫秒）
  showErrorToast: true,  // 显示错误 Toast
  showSuccessToast: false, // 显示成功 Toast
  successMessage: '操作成功', // 自定义成功消息
  headers: {}            // 自定义请求头
}
```

**使用示例**:
```javascript
import { get, post, put, del } from '@/utils/apiClient'

// GET 请求（自动重试 + Toast）
const data = await get('/api/users/123')

// POST 请求（显示成功 Toast）
const result = await post('/api/users', {
  name: 'John'
}, {
  showSuccessToast: true,
  successMessage: '用户创建成功'
})

// PUT 请求（禁用错误 Toast）
const updated = await put('/api/users/123', {
  name: 'Jane'
}, {
  showErrorToast: false
})

// 自定义重试次数
const data = await get('/api/slow-endpoint', {
  retry: 5,
  retryDelay: 2000,
  timeout: 60000
})
```

---

### 3. 后端集成 ✅

**文件**: `backend/src/index.js`

**改进**:
- ✅ 注册全局错误处理中间件（最先执行）
- ✅ 使用新的 404 处理器
- ✅ 保留 Hono 内置错误处理（兼容性）

**中间件顺序**:
```javascript
1. errorHandler()        // 全局错误捕获
2. performanceMonitor()  // 性能监控
3. securityHeaders()     // 安全头
4. requestSizeLimit()    // 请求大小限制
5. logger()              // 日志
6. cors()                // CORS
7. rateLimiter()         // 速率限制
8. 路由处理
9. notFoundHandler()     // 404 处理
```

---

## 🎯 错误处理流程

### 后端错误处理流程
```
请求 → errorHandler 中间件
       ↓
    路由处理
       ↓
    发生错误
       ↓
    errorHandler 捕获
       ↓
    记录日志（开发/生产）
       ↓
    构建错误响应
       ↓
    返回统一格式
```

### 前端错误处理流程
```
API 请求 → executeRequest
           ↓
        发送请求
           ↓
        超时控制
           ↓
        响应处理
           ↓
        错误？
        ├─ 网络错误 → 重试（指数退避）
        ├─ 401 错误 → 跳转登录
        ├─ API 错误 → Toast 提示
        └─ 成功 → 返回数据
```

---

## 🔧 错误类型处理

### 1. 网络错误
- **检测**: `TypeError`, `fetch failed`, `AbortError`
- **处理**: 自动重试（最多 2 次）
- **提示**: "网络连接失败" / "请求超时"

### 2. 认证错误（401）
- **检测**: `statusCode === 401`
- **处理**:
  - 清除 Token
  - 保存当前路径
  - 跳转登录页
- **提示**: "认证已过期，请重新登录"

### 3. 验证错误（400）
- **检测**: `code === 'VALIDATION_ERROR'`
- **处理**: 显示详细验证错误
- **提示**: 字段级别的错误信息

### 4. 资源不存在（404）
- **检测**: `statusCode === 404`
- **处理**: 返回友好提示
- **提示**: "资源不存在"

### 5. 服务器错误（500）
- **检测**: `statusCode >= 500`
- **处理**: 记录详细日志
- **提示**: "服务器内部错误"（生产环境）

---

## 📊 代码统计

**新增文件**: 1
- `backend/src/middleware/errorHandler.js` (160 行)

**修改文件**: 2
- `backend/src/index.js` (+10 行)
- `src/utils/apiClient.js` (+150 行)

**总计**: ~320 行代码

---

## ✅ 改进效果

### 1. 统一的错误格式
**之前**:
```json
// 不同接口返回格式不一致
{ "error": "User not found" }
{ "message": "Invalid input" }
{ "err": { "msg": "Failed" } }
```

**之后**:
```json
// 统一格式
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "用户不存在"
  }
}
```

### 2. 更好的错误日志
**之前**:
```
Error: User not found
```

**之后**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ ERROR: 用户不存在
📍 Path: GET /api/users/999
🔢 Status: 404
🏷️  Code: NOT_FOUND
👤 User: 123
🌐 IP: 192.168.1.1
📚 Stack: [完整堆栈]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3. 自动重试
**之前**:
- 网络抖动导致请求失败
- 用户需要手动刷新

**之后**:
- 自动重试 2 次（指数退避）
- 大部分临时网络问题自动恢复

### 4. 用户友好的提示
**之前**:
- 控制台错误，用户不知道发生了什么

**之后**:
- Toast 通知，清晰的错误提示
- 自动跳转登录（401）

---

## 🧪 测试场景

### 1. 网络错误测试
```javascript
// 模拟网络断开
await get('/api/users')
// 预期: 自动重试 2 次，然后显示 "网络连接失败"
```

### 2. 超时测试
```javascript
// 模拟慢速接口
await get('/api/slow', { timeout: 5000 })
// 预期: 5 秒后显示 "请求超时"
```

### 3. 认证过期测试
```javascript
// Token 过期
await get('/api/protected')
// 预期: 清除 Token，跳转登录页
```

### 4. 验证错误测试
```javascript
// 无效输入
await post('/api/users', { email: 'invalid' })
// 预期: 显示 "无效的邮箱地址"
```

---

## 🚀 下一步优化建议

### 1. 错误追踪服务
- 集成 Sentry 或类似服务
- 自动上报生产环境错误
- 错误聚合和分析

### 2. 错误恢复策略
- 离线缓存
- 乐观更新
- 后台同步

### 3. 用户反馈
- 错误报告按钮
- 用户可以提交错误详情
- 自动收集上下文信息

### 4. 监控和告警
- 错误率监控
- 异常告警
- 性能指标

---

## 📝 使用指南

### 后端使用自定义错误类
```javascript
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js'

// 抛出 404 错误
throw new NotFoundError('用户')

// 抛出验证错误
throw new ValidationError('邮箱格式不正确', [
  { field: 'email', message: '无效的邮箱地址' }
])
```

### 前端使用 API 客户端
```javascript
import { get, post, ApiError, NetworkError } from '@/utils/apiClient'

try {
  const data = await get('/api/users/123')
} catch (error) {
  if (error instanceof NetworkError) {
    // 处理网络错误
  } else if (error instanceof ApiError) {
    // 处理 API 错误
    console.log(error.code, error.statusCode)
  }
}
```

---

**报告生成**: Claude Opus 4.6
**最后更新**: 2026-03-11
