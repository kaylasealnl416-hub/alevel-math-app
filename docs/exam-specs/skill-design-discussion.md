# Question-Seeder Skill 设计讨论记录

> 本文档记录 2026-04-05 关于出题 skill 的完整讨论过程，skill 创建完成后可删除。

---

## 一、背景与痛点

### 为什么要做这个 skill

当前出题流程存在以下问题：

1. **node -e 内联 JSON 转义地狱** — LaTeX 的 `\\` 在 shell 里多层转义，频繁导致 PostgresError: invalid input syntax for type json
2. **每次都要重新理解数据库结构** — 表字段、chapter_id 格式、JSON 结构每次都要重新查
3. **出题和存入分离** — 先展示、确认、再写脚本、再运行，流程冗长
4. **没有固定的验算/审阅环节** — 有些题答案推导过程中发现算错了，混在脚本里很乱
5. **每次对话都要重新读 curriculum.js** — 浪费大量上下文

### 用户核心诉求

- 用户非技术背景，无法审阅数学题质量，需要 agent 自动审阅
- 希望说"出题"就能一条龙执行，不再出现各种技术问题
- 出题标准必须符合 Pearson Edexcel International A Levels 的最新教材和正式考试

---

## 二、Skill 核心设计

### 三角色分工

| 角色 | 职责 |
|------|------|
| 主 agent | 解析用户指令、协调流程、最终存入 DB |
| 出题 agent | 读取 curriculum 数据，按 Edexcel IAL 标准出题 |
| 审阅 agent | 验算答案、检查 mark scheme、确认难度和考纲范围，有问题直接修正 |

### 支持的调用方式

- 单章：`/seed p1c3 高阶5题`
- 多章：`/seed p1c1-p1c5 每章3题 难度4-5`
- 整单元：`/seed P2 全部章节`
- 模拟考试：`/seed 模拟考试 P1 90分钟卷`

### 6学科覆盖

Mathematics, Further Math, Economics, History, Psychology, Politics

### 题型标准

必须符合 Pearson Edexcel IAL 的：
- 最新教材和考纲（specification）
- 历年真题的题型结构
- 官方 mark scheme 的评分规范
- 不得自行捏造题型

### DB 存入方式

用固定 JS 模板文件写入（避免 node -e 转义），每批写一个临时 `_insert_xxx.js`，运行后删除。

---

## 三、讨论要点与决策

### 3.1 研究来源的可靠性

**问题：** 光靠 Claude 训练知识不够，需要实际查阅 Edexcel 官方资料。

**决策：**
- Claude 负责搜索 Pearson 官网和官方公布的 specification、past papers
- 用户会提供手头的考卷和题目，存放到 `docs/exam-specs/raw/` 目录
- 该目录已创建，等待用户放入资料

### 3.2 研究顺序的优先级

**决策：**
- **第一批（优先）：** Mathematics + Economics — 已有基础，快速补全
- **第二批：** Further Math + History
- **第三批（不急，明年才考）：** Psychology + Politics

第一批完成后先建 skill 框架，后续学科研究完逐步加入。

### 3.3 Skill 技术验证

**问题：** 需要先确认 Claude Code 的 skill 创建机制，避免研究完学科后发现技术限制。

**决策：** Claude 官方有 skill-creator skill，可以用来创建自定义 skill。需要先研究现有 skill 的文件结构和规范。

### 3.4 学科数据完整性验证（关键！）

**问题：** 项目中 `curriculum.js` 和 `subjects.js` 的学科-单元-章节-知识点数据是否与 Edexcel IAL 官方最新版一致？

**决策：** 这是前置必做项。必须通过官方 specification 核对：
- 每个学科的单元划分是否正确
- 每个单元下的章节是否完整
- 每个章节的知识点（考点）是否准确
- 如果有偏差，必须先修正 curriculum 数据，再出题

**这意味着准备步骤要增加一步：先校验现有数据，再研究出题规范。**

---

## 四、修订后的完整准备步骤

```
步骤0: 技术验证 — 研究 skill 创建机制，确认可行性
步骤1: 校验现有数据 — 对照官方 spec 核对 curriculum.js / subjects.js 的准确性
步骤2: 研究出题规范 — 为每个学科建立 docs/exam-specs/{subject}.md
        包含：Paper结构、题型模板、Mark scheme规范、难度分级、真题样例
步骤3: 用户提供资料 — 考卷/题目放入 docs/exam-specs/raw/
步骤4: 创建 skill — 基于规范文档和校验后的数据创建 question-seeder skill
步骤5: 测试验证 — 用 skill 出一批题，检查质量
```

### 分批执行计划

**第一批（Mathematics + Economics）：**
1. 校验 Math 的 P1-P4/S1/M1 章节数据 → 校验 Economics 的 Unit 1-4 章节数据
2. 补全 Math 出题规范 → 补全 Economics 出题规范
3. 创建 skill 框架 + 第一批学科支持
4. 测试出题

**第二批（Further Math + History）：**
1. 校验章节数据
2. 建立出题规范
3. 加入 skill

**第三批（Psychology + Politics）：** 明年再做

---

## 五、各学科当前掌握程度

| 学科 | 掌握程度 | 待补充 |
|------|---------|--------|
| Mathematics | 较好 | 确认最新 spec 有无变动；P3/P4/M1 题型细节 |
| Further Math | 一般 | WFM01-04 的具体题型和 mark scheme |
| Economics | 较好（Unit 1-2 已出过题） | Unit 3-4 题型结构 |
| History | 薄弱 | WHI01-04 题型、source-based 评分标准 |
| Psychology | 薄弱 | WPS01-04 从头研究（第三批，不急） |
| Politics | 薄弱 | WGP01-04 从头研究（第三批，不急） |

---

## 六、待办

- [ ] 步骤0: 研究 skill-creator 的文件结构和创建规范
- [ ] 步骤1: 校验 Mathematics curriculum.js 与官方 spec 的一致性
- [ ] 步骤1: 校验 Economics subjects.js 与官方 spec 的一致性
- [ ] 步骤2: 建立 docs/exam-specs/mathematics.md
- [ ] 步骤2: 建立 docs/exam-specs/economics.md
- [ ] 用户提供考卷资料到 docs/exam-specs/raw/
- [ ] 步骤4: 创建 question-seeder skill
- [ ] 步骤5: 测试出题
