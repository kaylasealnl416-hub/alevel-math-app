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
| Git托管 | GitHub |
| 测试 | Vitest |
| 部署 | Vercel |

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

## 代码质量

- SOLID / DRY 原则
- 禁止 TODO 或临时方案，遇到时停下重新设计
- 死代码直接删除
- 开工前充分分析

## 自动化

- 使用 Makefile targets，不创建 shell 脚本

## 文档

- 规约文档：`./specs/{feature}-{type}.md`
- 普通文档：`./docs/`
- 深度研究：`./docs/research/`
- 同步更新 `index.md`
