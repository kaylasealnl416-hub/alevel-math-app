# 项目重组总结

## 重组时间

2026-03-06

## 重组内容

### 1. 创建标准目录结构

按照 dev-init skill 规范创建了以下目录：

- `specs/` - 规约文档（设计、重构计划、课程大纲等）
- `docs/` - 普通文档（数据结构、视频数据库等）
- `docs/research/` - 深度研究文档
- `demo/` - 示例代码
- `.42cog/` - 认知敏捷法文档

### 2. 文档迁移

**移动到 specs/**
- CODE_REVIEW.md
- DESIGN.md
- DESIGN_NEW_SUBJECTS.md
- REFACTOR_PLAN.md
- PEARSON_IAL_SYLLABUS.md

**移动到 docs/**
- DATA_SCHEMA.md
- VIDEO_DATABASE.md
- VIDEO_NEEDS_EXPORT.md
- VIDEO_VALIDATION_REPORT.md
- VIDEO_IDS_01.txt
- startup-guide.md（原：启动说明.md）

### 3. 创建配置文件

- `CLAUDE.md` - Claude Code 核心配置
- `.claudeignore` - Claude 扫描忽略规则
- `.42plugin.yml` - 插件安装清单
- `specs/index.md` - 规约文档索引
- `docs/index.md` - 普通文档索引

### 4. 更新现有文件

- `.gitignore` - 按照标准格式重新组织
- `README.md` - 更新项目说明和结构

### 5. 创建 .42cog 文档

- `.42cog/meta.md` - 项目元数据（待完善）
- `.42cog/real.md` - 现实约束（待完善）
- `.42cog/cog.md` - 认知模型（待完善）

## 备份信息

已创建 Git 备份分支：`backup-before-restructure-20260306-132142`

如需回滚，执行：
```bash
git checkout backup-before-restructure-20260306-132142
```

## 后续建议

1. 使用 `/meta-42cog` 完善 .42cog 三件套文档
2. 安装推荐的插件（参考 .42plugin.yml）
3. 如需 CI/CD 通知，调用 `/cnb-webhook`
4. 将 package-lock.json 迁移到 bun.lockb（运行 `bun install`）

## 项目结构

```
alevel-math-app/
├── .42cog/              # 认知敏捷法文档
│   ├── meta.md          # 项目元数据
│   ├── real.md          # 现实约束
│   └── cog.md           # 认知模型
├── src/                 # 源代码
│   ├── components/      # React 组件
│   ├── data/            # 数据文件
│   ├── hooks/           # 自定义 Hooks
│   ├── styles/          # 样式文件
│   └── utils/           # 工具函数
├── specs/               # 规约文档
│   ├── index.md         # 索引
│   ├── DESIGN.md        # 设计文档
│   ├── CODE_REVIEW.md   # 代码审查
│   └── ...
├── docs/                # 普通文档
│   ├── index.md         # 索引
│   ├── research/        # 深度研究
│   └── ...
├── demo/                # 示例代码
├── scripts/             # 脚本文件
├── CLAUDE.md            # Claude Code 配置
├── README.md            # 项目说明
└── .42plugin.yml        # 插件清单
```
