# backend 文档索引

> backend/ 根下的技术文档集中索引。
> 实际代码入口：[`src/index.js`](../src/index.js)。启动命令：`bun run start`（见 `package.json`）。

---

## 部署与运维

- [DEPLOYMENT.md](../DEPLOYMENT.md) — 通用部署清单（环境变量、数据库准备、生产检查）
- [MIGRATION_GUIDE.md](../MIGRATION_GUIDE.md) — 数据库迁移指南（Drizzle + `db:migrate`）

**历史 Railway 部署资料**：已归档至 `../../archive/old-deploy-docs/`（2026-04 起迁至 Render）。
**当前部署配置**：见项目根 [DEPLOYMENT_CONFIG.md](../../DEPLOYMENT_CONFIG.md)。

## API / 数据库

- [API.md](../API.md) — REST API 端点清单
- [DATABASE_SETUP.md](../DATABASE_SETUP.md) — Supabase 数据库配置

## AI 服务

- [AI_PROVIDER_SETUP.md](../AI_PROVIDER_SETUP.md) — AI Provider 配置（GLM / Claude / Gemini 等）

## 项目说明

- [README.md](../README.md) — backend 项目说明

---

## 关键 scripts（`package.json`）

| 命令 | 作用 |
|------|------|
| `bun run dev` | 开发模式（`--watch src/index.js`） |
| `bun run start` | 生产启动 |
| `bun run db:generate` | Drizzle 生成迁移 |
| `bun run db:migrate` | 应用迁移 |
| `bun run db:seed` | 初始数据种子 |
| `bun test tests/unit` | 单元测试 |
| `bun run test:integration` | 集成测试 |
| `bun run check:env` | 环境变量检查 |
| `bun run check:production` | 生产环境就绪检查 |

---

## 归档

`../archive/backend-one-off-scripts/` — 2026-03 phase 0-1 期间的一次性诊断/迁移/seed 脚本（`analyze-chapters.js` / `check-data.js` / `check-tables.js` / `diagnose-db.js` / `fix-schema.js` / `run-migration.js` / `seed-enhanced-data.js` / `seed-questions.js` + `src/` 下的 `test-*.js` / `verify-*.js`）。
