# 网站功能测试与代码有效性审查（2026-03-31）

目标站点：`https://alevel-math-app.vercel.app/`

## 1) 执行结果概览

- **外网连通性（本环境）**：受限。对站点的 `curl` 请求经代理隧道返回 `403`，无法在此容器内完成真实浏览器端交互测试。
- **静态代码审查**：已完成前后端关键路径检查（认证、API 网关、路由挂载、部署配置）。
- **语法级检查**：关键 JS 文件可通过 `node --check`。

## 2) 已执行检查

### 2.1 站点可达性

命令：

```bash
curl -I -L https://alevel-math-app.vercel.app/
```

结果：

- `curl: (56) CONNECT tunnel failed, response 403`
- 说明当前执行环境无法直接连通公网目标站点进行端到端操作。

### 2.2 关键代码路径审查

已审查：

- 前端 API 客户端与鉴权：
  - `src/utils/apiClient.js`
  - `src/utils/api.js`
  - `src/contexts/AuthContext.jsx`
- 前端路由保护：
  - `src/AppRouter.jsx`
  - `src/components/ProtectedRoute.jsx`
- 后端入口与中间件：
  - `backend/src/index.js`
- 后端认证路由：
  - `backend/src/routes/auth.js`
- 部署路由配置：
  - `vercel.json`
  - `backend/vercel.json`

### 2.3 语法检查

命令：

```bash
node --check backend/src/index.js
node --check backend/src/routes/auth.js
node --check src/utils/apiClient.js
```

结果：

- 均通过（exit code 0）。

## 3) 主要发现

### 发现 A（高优先级）：前端 Vercel 重写规则会吞掉 `/api/*`

`vercel.json` 当前规则为：

- 所有路径 `/(.*)` 重写到 `/index.html`

这意味着如果前端运行时 `VITE_API_URL` 未正确设置到后端域名，前端调用 `/api/*` 时会命中前端静态站点而非后端 API（返回 HTML 或错误 JSON），从而出现登录、拉取数据、提交练习等核心功能异常。

> 影响范围：登录、题目练习、错题本、学习计划、对话等几乎所有动态功能。

### 发现 B（中优先级）：CI/本地自动化测试在当前环境不可执行

- `npm test` 与 `npm run build` 依赖 `vitest` / `vite`，但依赖未安装。
- `bun install` / `npm ci` 在该环境访问 npm registry 出现大量 `403`，导致无法补齐依赖。

> 这不是业务代码本身报错，但会阻断“自动化回归验证”。

### 发现 C（中优先级）：认证链路设计总体一致，但依赖跨域 Cookie 正确配置

- 前端采用 `credentials: 'include'`。
- 后端 CORS 允许凭证并设置白名单 + `*.vercel.app`。
- 登录 Cookie 在 production 下使用 `SameSite=None` + `Secure`。

整体方向正确，但如果部署时 `CORS_ORIGIN`、后端实际域名、前端 `VITE_API_URL` 任一项不一致，会表现为“登录后状态丢失/接口 401”。

## 4) 结论

- **代码结构层面**：核心鉴权与 API 调用机制基本有效。
- **上线可用性层面**：当前最需要确认的是**前端环境变量 `VITE_API_URL` 与 Vercel rewrite 配置**是否按“前后端分离”正确设置。若未设置，将直接导致大部分功能不可用。
- **测试层面**：本次无法在当前容器中完成真实在线站点交互与完整自动化测试（外网与 registry 受限）。

## 5) 建议的立即行动（按优先级）

1. 在 Vercel 前端项目中确认 `VITE_API_URL` 指向真实后端域名（如 Railway/Render/Vercel API 项目域名）。
2. 调整前端 `vercel.json`，避免无差别将 `/api/*` 重写到 `index.html`（若前端不托管 API，应排除 `/api`）。
3. 在可联网 CI 环境补跑：
   - 前端：`npm ci && npm test && npm run build`
   - 后端：最少跑认证/考试/练习路由的 smoke tests
4. 部署后做冒烟清单：注册、登录、开始练习、提交答案、查看错题、创建考试、提交考试、生成学习计划。

