---
name: question-seeder
description: 为 alevel-math-app 项目按 Pearson Edexcel International A Level (IAL) 官方标准批量出题并入库。当用户要求出题、生成题目、给某章节出 N 道题、造模拟卷、补题、扩充题库时务必触发；当用户提到 chapter_id（如 math_p1c3、e1c2、e3c1）、学科（Mathematics、Economics、Further Math、History、Psychology、Politics）、单元（P1、P2、Unit1、Unit2）、考试代码（WMA11、WEC11 等）时也务必触发。覆盖出题→独立审阅→预览确权→入库→发布全流程。题目必须符合 IAL 真题题型、mark scheme 规范、倒推法（answer-first design）。也可通过 /seed-questions 命令显式调用。这个 skill 替代了已废弃的 AI 出题 API（backend/src/routes/questions.js 的 /generate 端点已停用），是 alevel-math-app 唯一合规的出题路径。
---

# Question Seeder — A-Level 出题 Skill

为 `D:\CodeProjects\alevel-math-app` 批量出题并入库。所有题目必须符合 **Pearson Edexcel International A Level** 官方标准（题型、mark scheme、难度分布、倒推法）。

---

## 一、触发与覆盖范围

**应触发场景：** 用户说"出题"/"造一份模拟卷"/"给 P1 第 3 章补 5 道难度 4 的题"/"e1c2 出 3 道 MCQ"/"WMA11 来个完整模拟卷"等。

**当前批次覆盖学科：**
- ✅ **Mathematics**（P1/P2/P3/P4/S1/M1）— 已有完整规范
- ✅ **Economics**（Unit 1-4）— 已有完整规范
- ⏳ **Further Math** — 占位，规则不全（见 `references/further-math-rules.md`）
- ⏳ **History** — 占位（见 `references/history-rules.md`）
- ⏸ **Psychology / Politics** — 第三批，明年再做（见 `references/third-batch-stub.md`）

如果用户要 Further Math / History 出题，**先警告规则不全**再询问是否仍要继续；如果是 Psychology / Politics，**直接劝退**并说明原因。

---

## 二、严格工作流（必须按顺序执行）

### Step 1：解析用户输入

提取四要素：
- **学科**：mathematics / economics / further-math / history / psychology / politics
- **chapter_id 范围**：可能是单章（`math_p1c3`）、多章（`math_p1c3,math_p1c4`）、整单元（`P1`→自动展开到该单元所有章节）、整学科（`mathematics`→劝阻，太多）
- **题数**：每章节多少题
- **难度**：1-5 数字范围（用户可能说"高阶"=4-5，"基础"=1-2，"中等"=3）

如果信息不全，**一次只问一个问题**补齐（参考用户全局 CLAUDE.md 沟通规则）。

### Step 2：查真实 chapter_id（必跑！防前缀坑）

```bash
cd D:/CodeProjects/alevel-math-app/backend && bun scripts/question-seeder/list-chapters.mjs <subjectId>
```

⚠️ **chapter_id 实际格式与 4 月设计文档不同**——见 `references/chapter-id-map.md`。Mathematics 用 `math_p1c3`（带 `math_` 前缀），其他学科可能直接 `e1c1`。**绝不能凭直觉拼 ID**，必须从 list-chapters 输出里复制。

### Step 3：读对应学科出题规则

| 学科 | 读这份 |
|---|---|
| Mathematics | `references/mathematics-rules.md`（指向 `docs/exam-specs/WMA1{1-4}.md`） |
| Economics | `references/economics-rules.md`（指向 `docs/exam-specs/WEC1{1-4}.md`） |
| Further Math | `references/further-math-rules.md` |
| History | `references/history-rules.md` |

并阅读对应章节的 `docs/exam-specs/raw/` 真题 PDF 作为题型范本（如有）。

### Step 4：spawn 出题子代理

**用 Agent 工具（subagent_type: general-purpose）**，把出题任务下放，避免主上下文被草稿污染。

子代理 prompt 必须包含：
1. 学科出题规范完整复述（IAL 标准、题型、mark scheme、倒推法）
2. 目标 chapter_id 列表 + 章节标题
3. 题数与难度
4. 输出格式：严格 JSON 数组，字段见 `references/db-schema.md`
5. **倒推法铁律**：先选整数/简分答案，再反推参数

子代理输出 JSON 草稿。

### Step 5：spawn 审阅子代理（独立验算）

**关键：用第二个独立的 Agent**（不让出题代理自己审），避免认知偏差。

审阅代理 prompt 必须包含：
1. 不要看原解法，**自己重新做一遍每道题**
2. 检查答案数值是否正确
3. 检查 mark scheme 分值是否合理（M/A/B 分配）
4. 检查难度标签是否匹配实际难度
5. 检查 chapter_id 是否对应题目内容
6. 输出修正后的 JSON（连同修改说明）

如果审阅代理修正了任何题，把它的输出作为最终版。

### Step 6：给用户产品级预览（你的把关，不是数学审查）

**呈现方式**：在对话里用人话呈现，不要 raw JSON。每题展示：
- 题号 + chapter_id + 难度 + 类型
- 题面中文摘要（一句话）
- 标准答案（一行）
- 预计耗时

最后给汇总：题量、难度分布、章节覆盖。然后问：

> "OK 发布 / 让审阅 agent 重做第 X 题 / 全部重做"

⚠️ **不要让用户审数学正确性**——他/她非技术背景。让他审的是产品层面的合理性（题量、覆盖、明显错别字）。

### Step 7：保存 JSON + 入库

用户说 "OK" 后：

1. 把最终 JSON 写到临时文件 `backend/scripts/question-seeder/_pending/<timestamp>.json`（这个目录在 .gitignore 里）
2. 跑入库脚本：
```bash
cd D:/CodeProjects/alevel-math-app/backend && bun scripts/question-seeder/insert-questions.mjs scripts/question-seeder/_pending/<timestamp>.json
```
3. 脚本会输出新题 ID 列表

### Step 8：发布

入库时 status 默认 `reviewed`（不上线）。用户最终确认后：

```bash
cd D:/CodeProjects/alevel-math-app/backend && bun scripts/question-seeder/publish-batch.mjs <id1> <id2> ...
```

如果用户在 Step 6 已经明确说"OK 发布"，可以 Step 7 + Step 8 连跑（两条命令前后脚执行），不必再问。

### Step 9：清理与汇报

- 删掉 `_pending/<timestamp>.json` 临时文件
- 给用户一句话汇报：「✅ N 道题已发布到 DB，前端可见。ID: [...]，章节: [...]」

---

## 三、关键配套文件

主流程具体细节读这些 reference：

- **`references/workflow.md`** — 详细工作流模板（含 Agent prompt 模板）
- **`references/db-schema.md`** — questions 表字段速查 + JSON 结构样例
- **`references/chapter-id-map.md`** — 6 学科 chapter_id 实际格式（含 math_ 前缀坑）
- **`references/mathematics-rules.md`** — Math 出题规则（含 P1-P4/S1/M1）
- **`references/economics-rules.md`** — Econ 出题规则（含 Unit 1-4）
- **`templates/question-batch.example.json`** — 题目 JSON 模板范例

辅助脚本（在 `D:\CodeProjects\alevel-math-app\backend\scripts\question-seeder\`）：

- **`list-chapters.mjs`** — 列出某学科真实 chapter_id
- **`verify-chapter-id.mjs`** — 校验单个/多个 chapter_id 是否在 DB
- **`insert-questions.mjs`** — 入库（吃 JSON 文件）
- **`publish-batch.mjs`** — 改 status 成 published

---

## 四、铁律（违反会导致严重 bug）

1. **chapter_id 必须从 list-chapters 输出复制**，不能凭记忆拼。`p1c3` ≠ `math_p1c3`。
2. **content/answer 必须填中英 + LaTeX 三字段**：`{ zh: "...", en: "...", latex: "..." }`。前端 KaTeX 渲染依赖 latex 字段。
3. **倒推法（answer-first design）是硬性铁律**：先定整数/简分答案，再反推参数。这是 Edexcel 真题的隐形规律。
4. **入库默认 status: 'reviewed'**，绝不直接 `'published'`。错题污染线上题库是 TODO(0) 级别（备考用户 Kayla 会受影响）。
5. **不能用 node -e 内联 JSON**：转义地狱会引发 PostgresError。一律走 `insert-questions.mjs <json-file>`。
6. **审阅子代理必须独立**：不能让出题代理自审，必须是第二个 Agent 实例。
7. **批次失败原子回滚**：insert-questions.mjs 的校验任何一条不通过就停工，**不写一行 DB**。
