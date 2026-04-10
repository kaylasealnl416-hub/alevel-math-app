# 安全修复 PRD（Security Fix PRD）

- 项目：alevel-math-app
- 日期：2026-04-10
- 依据：`alevel-math-app-security-fixes.md`（独立复核报告）
- 目标：以最小改动（minimal change）完成高风险后端安全修复，并确保回归稳定性（regression stability）

## 1. 修复范围（Scope）

### 1.1 TODO(0) CRITICAL
1. 后端路由鉴权遗漏（authorization gap）
- 文件：`backend/src/index.js`
- 现状：`/api/question-sets`、`/api/user-answers`、`/api/learning-plans`、`/api/wrong-questions` 基路径未被 `app.use('/xxx/*')` 命中。
- 风险：未登录可访问用户数据。
- 目标：为上述 4 组路由补齐精确路径中间件注册，确保 base path 和 wildcard path 都受保护。

2. Access Token 可用于 Refresh（token type confusion）
- 文件：`backend/src/utils/jwt.js`、`backend/src/routes/auth.js`
- 现状：access/refresh token 缺乏类型标识（token type），`/api/auth/refresh` 仅做签名验证。
- 风险：access token 可绕过刷新边界。
- 目标：
  - 签发时加入 `type` 字段：`access` 与 `refresh`
  - `/refresh` 强制校验 `payload.type === 'refresh'`

3. CSRF 比较存在时序风险（timing attack）
- 文件：`backend/src/middleware/csrf.js`
- 现状：`===` 比较 token。
- 风险：潜在字节级推断。
- 目标：改为 `timingSafeEqual` 常量时间比较（constant-time compare），并处理长度不一致异常。

### 1.2 TODO(1) HIGH
4. `/api/auth/me` 未复用统一鉴权链路（auth middleware bypass）
- 文件：`backend/src/index.js`、`backend/src/routes/auth.js`
- 现状：`/me` 手动解析 token，和 `authMiddleware` 逻辑分叉。
- 风险：后续鉴权增强无法自动生效。
- 目标：
  - 在 `index.js` 对 `/api/auth/me` 注册 `authMiddleware`
  - 在 `auth.js` 的 `/me` 只读取 `c.get('userId')`

5. `/api/auth/refresh` 缺少速率限制（rate limiting）
- 文件：`backend/src/index.js`
- 现状：登录/注册有限流，刷新无。
- 风险：可被高频枚举。
- 目标：为 `/api/auth/refresh` 增加单独限流策略。

## 2. 非目标（Out of Scope）

- Google OAuth `client_id` 绑定校验
- 前端 `QuestionUploadPage` fetch 封装治理

## 3. 验收标准（Acceptance Criteria）

1. 未登录请求 `GET /api/question-sets` 返回 401。
2. access token 调用 `POST /api/auth/refresh` 返回 401。
3. 无 Cookie 请求 `GET /api/auth/me` 返回 401。
4. CSRF token 缺失或错误时返回 403。
5. 后端构建通过，现有测试通过。

## 4. 测试策略（Test Strategy）

1. 单元测试（unit test）
- JWT：`generateToken` 与 `generateRefreshToken` 均带 `type`。
- CSRF：正确 token 通过；错误/长度异常 token 失败。

2. 集成测试（integration test）
- 路由鉴权：覆盖 4 个 base path 的未登录访问。
- refresh 语义：access token 不能刷新。
- me 语义：必须通过统一鉴权中间件。

3. 回归测试（regression test）
- 登录/注册/刷新正常流程。
- 受保护路由在合法 Cookie + CSRF 下正常工作。

## 5. 实施顺序（Execution Order）

1. 修复路由鉴权遗漏（Fix 1）
2. 修复 token 类型混用（Fix 2）
3. 修复 CSRF timing compare（Fix 3）
4. 收敛 `/me` 到统一鉴权（Fix 4）
5. 为 refresh 增加限流（Fix 5）
6. 补测试并执行验证

## 6. 风险与回滚（Risk & Rollback）

- 风险：旧 refresh token 无 `type`，上线后会失效。
- 策略：发布说明中明确“需要重新登录”；必要时提供短期兼容窗口。
- 回滚：仅回滚相关文件变更，不触及数据库结构。

## 7. 交付物（Deliverables）

- 代码修复提交（backend 安全补丁）
- 对应测试补充与测试结果记录
- 修复报告（含验证截图或接口结果摘要）
