# A-Level Math App 代码审查报告

**审查日期**: 2026-03-07
**审查范围**: 全局代码质量、架构设计、安全性、性能优化
**审查人**: Claude Opus 4.6

---

## 📊 项目概览

### 基本信息
- **项目名称**: A-Level Math App
- **技术栈**: React 18 + Vite + Bun + PostgreSQL + Hono
- **代码规模**:
  - 前端: ~3,628 行 (src/)
  - 后端: ~1,357 行 (backend/src/)
- **测试覆盖**: 1 个测试文件，9 个测试用例全部通过
- **部署平台**: Vercel

### 架构模式
- **前端**: 单页应用 (SPA)，组件化设计
- **后端**: RESTful API，Hono 框架
- **数据库**: PostgreSQL + Drizzle ORM
- **数据源**: 双轨运行（本地数据 + API 数据，支持降级）

---

## ✅ 优点与亮点

### 1. 架构设计
- **数据源适配层设计优秀**: `dataSource.js` 实现了本地数据和 API 数据的无缝切换，具备自动降级能力
- **错误边界完善**: `ErrorBoundary.jsx` 提供了良好的错误捕获和用户体验
- **模块化清晰**: 前端组件、Hooks、工具函数分离良好
- **后端 API 设计规范**: RESTful 风格，统一的响应格式

### 2. 代码质量
- **自定义 Hooks 设计合理**:
  - `useLanguage`: 语言切换 + localStorage 持久化
  - `useLocalStorage`: 通用状态持久化
  - `useErrorBook`: 错误本功能，支持去重
- **验证工具完善**: `validation.js` 提供了全面的输入验证函数
- **数据库 Schema 设计合理**: 表结构清晰，外键约束完整

### 3. 用户体验
- **加载状态处理**: `LoadingSpinner` 组件提供视觉反馈
- **多语言支持**: 中英文切换功能
- **错误本功能**: 帮助学生记录错题

### 4. 开发体验
- **环境配置清晰**: `.env.local` 管理敏感信息
- **部署配置完善**: Vercel 配置正确，支持 SPA 路由
- **Git 配置合理**: `.gitignore` 覆盖全面

---

## ⚠️ 问题与风险

### 🔴 高优先级问题

#### 1. **安全漏洞：API Key 暴露风险**
**位置**: `src/utils/api.js`
**问题**: API Key 存储在 localStorage 中，容易被 XSS 攻击窃取

```javascript
// 当前实现
export function getApiKey(provider = 'anthropic') {
  return localStorage.getItem(keyMap[provider]);
}
```

**风险等级**: 🔴 严重
**影响**: 用户的 Anthropic/MiniMax/Zhipu API Key 可能被恶意脚本窃取
**建议**:
- 将 API 调用移到后端，前端不存储 API Key
- 或使用 HttpOnly Cookie + CSRF Token
- 添加 Content Security Policy (CSP)

#### 2. **数据库连接信息硬编码**
**位置**: `backend/src/db/index.js`
**问题**: 数据库连接配置缺少生产环境的安全措施

```javascript
const client = postgres(process.env.DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
})
```

**风险等级**: 🔴 严重
**建议**:
- 添加 SSL 连接配置（生产环境必须）
- 实现连接池监控和日志
- 添加数据库连接重试机制

#### 3. **CORS 配置过于宽松**
**位置**: `backend/src/index.js:14-17`

```javascript
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://*.vercel.app'],
  credentials: true,
}))
```

**风险等级**: 🟡 中等
**问题**: 通配符 `*.vercel.app` 允许所有 Vercel 子域名访问
**建议**: 使用精确的域名白名单

#### 4. **缺少输入验证和 SQL 注入防护**
**位置**: `backend/src/routes/progress.js:98-99`

```javascript
const { userId, chapterId, status, masteryLevel, timeSpent } = body
// 直接使用 body 数据，缺少验证
```

**风险等级**: 🟡 中等
**建议**:
- 使用 Zod 或 Joi 进行请求体验证
- 虽然 Drizzle ORM 提供了基本防护，但应添加业务层验证

### 🟡 中优先级问题

#### 5. **Console.log 过多**
**位置**: `src/data/dataSource.js` (13 处 console 警告)
**问题**: ESLint 检测到 13 个 console 语句

**影响**:
- 生产环境泄露调试信息
- 性能轻微影响

**建议**:
```javascript
// 使用环境变量控制日志
const DEBUG = import.meta.env.DEV
if (DEBUG) console.log('...')

// 或使用专业日志库
import { logger } from './utils/logger'
logger.debug('...')
```

#### 6. **错误处理不一致**
**位置**: 多个文件
**问题**:
- 前端有些地方使用 `try-catch`，有些直接 `.catch()`
- 后端错误响应格式统一，但缺少错误码标准化

**建议**:
- 定义统一的错误码枚举
- 创建错误处理中间件
- 前端统一使用 Error Boundary + 局部错误处理

#### 7. **缺少 API 请求超时处理**
**位置**: `src/utils/api.js`
**问题**: `fetch` 调用没有设置超时

```javascript
// 当前实现
const response = await fetch(API_ENDPOINTS.ANTHROPIC, {
  method: 'POST',
  // 缺少 signal: AbortSignal.timeout(10000)
})
```

**建议**:
```javascript
const controller = new AbortController()
const timeoutId = setTimeout(() => controller.abort(), 10000)
const response = await fetch(url, { signal: controller.signal })
clearTimeout(timeoutId)
```

#### 8. **大文件问题**
**位置**: `src/alevel-math-app.jsx` (337.3KB)
**问题**: 主应用文件过大，超过 256KB 限制

**影响**:
- 代码审查困难
- 维护成本高
- 可能影响构建性能

**建议**:
- 将 `CURRICULUM` 数据移到独立的 JSON 文件
- 拆分为多个模块（章节数据、UI 组件、业务逻辑）

#### 9. **缺少 Rate Limiting**
**位置**: 后端 API
**问题**: 没有请求频率限制

**风险**:
- 容易被 DDoS 攻击
- API 滥用

**建议**:
```javascript
import { rateLimiter } from 'hono-rate-limiter'

app.use('*', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 最多100个请求
}))
```

### 🟢 低优先级问题

#### 10. **测试覆盖率不足**
**当前状态**: 仅有 1 个测试文件 (`subjects.test.js`)
**建议**:
- 为关键 Hooks 添加测试
- 为 API 路由添加集成测试
- 为数据源适配器添加测试

#### 11. **缺少 TypeScript**
**问题**: 项目使用 JavaScript，缺少类型安全
**建议**:
- 逐步迁移到 TypeScript
- 或至少添加 JSDoc 类型注释

#### 12. **性能优化空间**
**位置**: `src/alevel-math-app.jsx`
**问题**:
- KaTeX 渲染可能导致性能问题
- 缺少虚拟滚动（如果章节列表很长）

**建议**:
- 使用 `React.memo` 优化组件渲染
- 考虑懒加载章节内容
- 使用 `useMemo` 缓存 KaTeX 渲染结果

#### 13. **缺少监控和日志**
**问题**:
- 没有错误追踪（如 Sentry）
- 没有性能监控（如 Web Vitals）
- 后端缺少结构化日志

**建议**:
- 集成 Sentry 或类似服务
- 添加 Google Analytics 或 Plausible
- 使用 Winston 或 Pino 进行后端日志

---

## 🏗️ 架构建议

### 1. 前后端分离优化
**当前问题**: 前端直接调用第三方 AI API
**建议架构**:
```
前端 → 后端 API Gateway → AI 服务
     ↓
   数据库
```

**优点**:
- API Key 不暴露给前端
- 统一的请求日志和监控
- 可以实现请求缓存和限流

### 2. 数据库迁移策略
**当前问题**: Schema 修改后需要手动迁移
**建议**:
- 使用 Drizzle Kit 的迁移功能
- 版本化 Schema 变更
- 添加回滚脚本

### 3. 缓存策略
**建议**:
- 前端: 使用 React Query 或 SWR 管理服务端状态
- 后端: 添加 Redis 缓存热点数据（科目列表、章节内容）
- CDN: 静态资源使用 Vercel Edge Network

---

## 📋 代码规范建议

### 1. 命名规范
**当前状态**: 基本符合规范
**改进建议**:
- 组件文件使用 PascalCase: `ErrorBoundary.jsx` ✅
- 工具函数使用 camelCase: `dataSource.js` ✅
- 常量使用 UPPER_SNAKE_CASE: `STORAGE_KEYS` ✅

### 2. 注释规范
**当前状态**: 部分文件有良好的注释
**改进建议**:
- 为所有公共 API 添加 JSDoc
- 复杂逻辑添加行内注释
- 删除无用的注释代码

### 3. 文件组织
**当前状态**: 基本合理
**改进建议**:
```
src/
├── components/     # UI组件
├── hooks/          # 自定义Hooks
├── utils/          # 工具函数
├── services/       # API服务层（建议新增）
├── types/          # 类型定义（建议新增）
└── constants/      # 常量定义（建议新增）
```

---

## 🔒 安全检查清单

| 检查项 | 状态 | 说明 |
|--------|------|------|
| API Key 安全存储 | ❌ | 存储在 localStorage，有风险 |
| SQL 注入防护 | ⚠️ | ORM 提供基本防护，但缺少业务层验证 |
| XSS 防护 | ✅ | React 默认转义，但需注意 `dangerouslySetInnerHTML` |
| CSRF 防护 | ❌ | 缺少 CSRF Token |
| HTTPS 强制 | ⚠️ | Vercel 默认支持，但需验证 |
| 敏感信息泄露 | ✅ | `.env.local` 正确配置 |
| 依赖漏洞扫描 | ❌ | 建议添加 `npm audit` 或 Snyk |
| Rate Limiting | ❌ | 缺少 |
| 输入验证 | ⚠️ | 部分实现，不完整 |
| 错误信息泄露 | ⚠️ | 生产环境应隐藏详细错误 |

---

## 🚀 性能优化建议

### 1. 构建优化
**当前配置**: Vite 已配置代码分割

```javascript
// vite.config.js
manualChunks: {
  'react-vendor': ['react', 'react-dom'],
  'katex': ['katex'],
}
```

**建议**:
- 添加 Gzip/Brotli 压缩
- 使用 `vite-plugin-compression`
- 分析 bundle 大小: `bun run build --analyze`

### 2. 运行时优化
**建议**:
- 使用 `React.lazy` 懒加载路由
- 图片使用 WebP 格式 + 懒加载
- 添加 Service Worker 实现离线缓存

### 3. 数据库优化
**建议**:
- 为常用查询字段添加索引
- 使用数据库连接池
- 实现查询结果缓存

---

## 📝 测试建议

### 1. 单元测试
**当前覆盖**: 仅 `subjects.test.js`
**建议新增**:
- `useLanguage.test.js`
- `useLocalStorage.test.js`
- `useErrorBook.test.js`
- `validation.test.js`
- `dataSource.test.js`

### 2. 集成测试
**建议**:
- API 路由测试（使用 Supertest）
- 数据库操作测试（使用测试数据库）

### 3. E2E 测试
**建议**:
- 使用 Playwright 或 Cypress
- 测试关键用户流程：
  - 选择科目 → 查看章节 → 学习内容
  - 语言切换
  - 错误本功能

---

## 🎯 优先级行动计划

### 立即执行（本周）
1. ✅ **修复 API Key 安全问题**: 将 AI API 调用移到后端
2. ✅ **添加 CORS 白名单**: 替换通配符为精确域名
3. ✅ **清理 console.log**: 使用环境变量控制日志输出
4. ✅ **添加请求超时**: 为所有 fetch 调用添加超时

### 短期（本月）
5. ⚠️ **拆分大文件**: 将 `alevel-math-app.jsx` 拆分为多个模块
6. ⚠️ **添加输入验证**: 使用 Zod 验证所有 API 请求
7. ⚠️ **实现 Rate Limiting**: 防止 API 滥用
8. ⚠️ **添加错误追踪**: 集成 Sentry

### 中期（下季度）
9. 🔵 **提升测试覆盖率**: 达到 80% 以上
10. 🔵 **性能优化**: 实现懒加载和缓存策略
11. 🔵 **迁移到 TypeScript**: 提升类型安全
12. 🔵 **添加监控**: 实现全链路监控

---

## 📊 代码质量评分

| 维度 | 评分 | 说明 |
|------|------|------|
| 架构设计 | 8/10 | 模块化清晰，数据源适配层设计优秀 |
| 代码规范 | 7/10 | 基本符合规范，但有 console.log 过多 |
| 安全性 | 5/10 | 存在 API Key 暴露等严重问题 |
| 性能 | 7/10 | 基本优化到位，但有提升空间 |
| 可维护性 | 7/10 | 组件化良好，但大文件需拆分 |
| 测试覆盖 | 3/10 | 测试严重不足 |
| 文档完善度 | 6/10 | 有基本文档，但缺少 API 文档 |

**综合评分**: **6.4/10**

---

## 🎓 总结

### 项目优势
1. 架构设计合理，模块化清晰
2. 数据源适配层设计优秀，支持降级
3. 用户体验良好，错误处n4. 后端 API 设计规范

### 主要风险
1. **安全性问题**: API Key 暴露、CORS 配置宽松
2. **测试不足**: 覆盖率仅约 5%
3. **监控缺失**: 无法追踪生产环境问题

### 核心建议
1. **立即修复安全漏洞**（API Key、CORS）
2. **提升测试覆盖率**（目标 80%）
3. **添加监控和日志**（Sentry + 结构化日志）
4. **优化大文件**（拆分 337KB 的主文件）

---

**审查完成时间**: 2026-03-07 00:20
**下次审查建议**: 2026-04-07（修复高优先级问题后）
