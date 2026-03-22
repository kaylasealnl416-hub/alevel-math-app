# Claude Code 指南

## 项目定位

**A-Level Math App**：帮助学生学习 A-Level 数学及其他科目的 Web 应用

- **目标用户**：A-Level 学生，需要系统化学习数学、经济、历史等科目
- **核心价值**：提供结构化的课程内容和 YouTube 视频资源整合
- **架构**：React + Vite 前端应用，使用 KaTeX 渲染数学公式

## 核心文档

**一切决策必须参考**：`.42cog/meta.md`（项目元数据）

**重大决策必须参考**：
- `.42cog/meta.md` - 项目元数据、产品定位、商业模式
- `.42cog/real.md` - 现实约束、安全规则
- `.42cog/cog.md` - 认知模型、实体关系

## 开发环境

| 项目 | 配置 |
|------|------|
| 语言 | JavaScript/JSX |
| 框架 | React 18 + Vite |
| 包管理 | bun（非 npm/yarn） |
| Git托管 | GitHub（私有仓库） |
| 测试 | Vitest |
| 部署 | Vercel |

## 部署配置

- **平台**：Vercel（支持私有仓库）
- **自动部署**：推送到 main 分支自动触发
- **构建命令**：`bun run build`
- **输出目录**：`dist`
- **配置文件**：`vercel.json`
- **Base Path**：`/`（根路径，非子路径）

**重要**：
- GitHub Pages 已禁用（私有仓库限制）
- 使用 Vercel 进行公开访问
- `vite.config.js` 的 `base` 必须设置为 `/`

## 项目结构

- **src/** - 源代码
  - **components/** - React 组件
  - **data/** - 数据文件（科目、章节、视频）
  - **hooks/** - 自定义 React Hooks
- **demo/** - 示例/演示代码
- **specs/** - 规约文档（PRD、设计、实现计划）
- **docs/** - 普通文档和研究资料
- **.42plugin.yml** - 插件安装清单

## 规则

- **语言**：代码注释、文档、提交信息、沟通全部使用中文
- **文件名**：默认英文命名
- **Git**：不自动提交，除非用户明确要求
- **敏感信息**：存 `.env.local`，绝不保存在 Git 仓库中
- **部署**：推送到 main 分支会自动触发 Vercel 部署

## 快速命令

```bash
# 安装依赖
bun install

# 本地开发（端口 3000）
bun run dev

# 构建生产版本
bun run build

# 预览构建结果
bun run preview

# 运行测试
bun run test

# 代码检查
bun run lint
```

## 代码质量

- SOLID / DRY 原则
- 禁止 TODO 或临时方案，遇到时停下重新设计
- 死代码直接删除
- 开工前充分分析

## 开发铁律（跨对话必读）

### 替换即删除
新组件替代旧组件时，**必须在同一次提交里删除旧文件和对应的 CSS**。不留"万一以后用"的死代码。

### apiClient 返回值
`src/utils/apiClient.js` 的 `get()`/`post()`/`put()` 返回的是**解包后的 `data.data`**，不是 `{success, data, error}` 原始响应。直接用返回值，不要写 `if (result.success)`。

### 样式规范
- 全站统一用**内联样式对象**（`const S = { page: {...}, card: {...} }`）
- **不新建 CSS 文件**，不用 Tailwind 类名（Tailwind JIT 有 purge 问题）
- 仅保留的 CSS：`src/styles/animations.css`、`src/styles/QuestionCard.css`、`src/styles/AnswerInput.css`、`src/components/common/Loading.css`、`src/components/common/Toast.css`

### 配色体系（Google Clean）
| 用途 | 色值 |
|------|------|
| 主色 | `#1a73e8` |
| 主文本 | `#202124` |
| 次文本 | `#5f6368` |
| 页面背景 | `#f8f9fa` |
| 卡片表面 | `#fff` |
| 边框 | `#dadce0` |
| 成功 | `#188038` |
| 错误 | `#d93025` |
| 警告 | `#f9ab00` |
| 悬停背景 | `#f1f3f4` |
| 选中背景 | `#e8f0fe` |

不引入这个色板之外的颜色。

### Toast 使用
用 `import Toast from './common/Toast'`，然后 `Toast.success(msg)` / `Toast.error(msg)`。不要自己定义假 Toast 对象。

### 组件现状（避免重复造轮子）
| 功能 | 现有组件 | 不要再建 |
|------|---------|---------|
| 登录+注册 | `AuthPage.jsx`（tab 切换） | LoginPage、RegisterPage |
| 考试进行 | `ExamTakingPage.jsx` | ExamPage |
| 考试结果 | `ExamResultPage.jsx` | ResultPage |
| 按钮 | `ui/Button.jsx`（内联样式） | 新的 Button 组件 |
| 练习 | `PracticePage.jsx` + `practice/` 子组件 | 独立的 Quiz 页面 |

### 提交前检查清单
1. `bun run build` 必须通过
2. 新建的组件必须在路由或其他组件中实际引用
3. 删除的组件必须确认无其他文件 import 它

## 架构说明

### 前端
- **路由**：`AppRouter.jsx` 使用 `React.lazy` 按路由代码分割
- **数据**：课程数据在 `src/data/curriculum.js`（1580行），科目数据在 `src/data/subjects.js`
- **认证**：httpOnly Cookie + sessionStorage 缓存，通过 `useAuth()` hook 访问
- **AI 设置**：localStorage key `ai_settings`，格式 `{provider, apiKey, model}`

### 后端
- **框架**：Hono.js + Bun，部署在 Render
- **数据库**：Supabase PostgreSQL（Drizzle ORM）
- **认证**：JWT（auth_token + refresh_token），httpOnly Cookie
- **管理员**：ADMIN_EMAILS 白名单 + 首个注册用户自动 admin

## 自动化

- 使用 Makefile targets，不创建 shell 脚本

## 文档

- 规约文档：`./specs/{feature}-{type}.md`
- 普通文档：`./docs/`
- 深度研究：`./docs/research/`
- 同步更新 `index.md`
