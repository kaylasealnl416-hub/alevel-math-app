# 详细工作流（含 Agent prompt 模板）

主 SKILL.md 已经有总流程九步，本文是**每一步的执行模板与 Agent 子代理的具体 prompt**。

---

## Step 1：解析用户输入

用户可能说：
- "给 math_p1c3 出 5 道难度 4 的题" — 信息全，直接进 Step 2
- "P1 第 3 章出 5 道高阶题" — 需 list-chapters 确认 ID
- "出一份 P1 完整模拟卷" — 整单元，按 docs/exam-specs/WMA11-P1.md 的 75 分卷结构出
- "Econ Unit 1 来一套" — 整单元，按 WEC11-U1.md 的 80 分卷结构

**信息缺失时一次只问一个问题**（参考用户全局 CLAUDE.md "一次只问一个问题"原则）。

优先级：学科 → chapter_id → 题数 → 难度。

---

## Step 2：查真实 chapter_id

```bash
cd D:/CodeProjects/alevel-math-app/backend
bun scripts/question-seeder/list-chapters.mjs mathematics
```

输出示例：
```
📚 数学  (id: mathematics)

📖 Pure Mathematics 1  (unit_id: mathematics_P1)
   math_p1c1              | Ch1 Algebraic Expressions
   math_p1c2              | Ch2 Quadratics
   math_p1c3              | Ch3 Equations & Inequalities
   ...
```

**复制实际 ID 进 Step 4 prompt**，绝不靠记忆拼。

如果用户给的是逻辑名（"P1 第 3 章"），主代理需自行映射到 `math_p1c3`。

---

## Step 3：读学科规则

按学科读 `references/{subject}-rules.md`，规则文档里会指向 `docs/exam-specs/WMA11-P1.md` 这种详细规范。**两份都要读**——references 是浓缩版，docs/exam-specs/ 是完整版含官方 prompt 模板。

---

## Step 4：出题子代理 Prompt 模板

```
用 Agent 工具，subagent_type: general-purpose

prompt:
你是一名 Pearson Edexcel International A Level 资深出题人。请为 alevel-math-app 项目出 {N} 道符合 IAL 标准的题目。

【目标章节】
- chapter_id: {math_p1c3}
- 章节标题: Equations & Inequalities
- 单元: WMA11/01 Pure Mathematics P1

【难度】
{4-5}（5 分制；1=最易，5=最难）

【题型分布】
按 IAL 真题规律，本章节常见题型：
- calculation（计算题）— 主流
- proof（证明题）— P 系列偶有
- multiple_choice — Mathematics 通常无 MCQ（仅 Economics 有），不要出
- fill_blank — 罕见，不要出

【出题规则铁律】
1. 倒推法（answer-first design）：先选整数或简单分数答案，再反推题目参数
2. 联立方程/勾股数：用 (3,4,5)(5,12,13)(8,15,17)
3. 三角：用特殊角 30°/45°/60°
4. 每题含 (a)(b)(c) 多个小问，递进难度
5. (a) 求基础量 → (b) 利用(a)结果 → (c) 应用/综合
6. Mark scheme 用 M1（方法）/A1（精度，依赖 M）/B1（独立）
7. 题面、答案、解析均提供中英 + LaTeX

【输出格式】
严格的 JSON 数组（不要 markdown 包裹），每个元素结构如下：

{
  "chapterId": "math_p1c3",
  "type": "calculation",
  "difficulty": 4,
  "content": {
    "zh": "中文题面（含 LaTeX 用 $...$）",
    "en": "English version",
    "latex": "纯 LaTeX 表达式（公式部分）"
  },
  "options": null,
  "answer": {
    "value": "答案数值或简短表达",
    "latex": "LaTeX 形式的答案",
    "explanation": "一句话解题思路（中文）"
  },
  "explanation": {
    "zh": "完整解题步骤（中文，含 LaTeX）",
    "en": "Full step-by-step solution"
  },
  "tags": ["联立方程", "二次方程"],
  "estimatedTime": 480
}

【其它要求】
- 每题 estimatedTime 按难度估算：难度1≈180秒，2≈240秒，3≈360秒，4≈480秒，5≈720秒
- tags 用中文知识点关键词数组
- 不要 source 字段（脚本会自动补 'ai_generated'）
- 不要 status 字段（脚本默认 'reviewed'）

请直接输出 JSON 数组，不要任何前后缀文字。
```

---

## Step 5：审阅子代理 Prompt 模板

```
用 Agent 工具，subagent_type: general-purpose

prompt:
你是一名 Pearson Edexcel IAL 资深题目审校员。下面是另一位出题人产出的 {N} 道题（JSON 数组）。请独立审阅，不要相信原作的解法。

【任务】
对每一道题：
1. **重新做一遍**（不看原 explanation），算出答案
2. 与原 answer.value 比对——不一致则修正
3. 检查 explanation 推导步骤——错误则重写
4. 检查 mark scheme 分值是否合理（M/A/B 分配）
5. 检查 difficulty 标签——感觉过简过难则调整（说明原因）
6. 检查 chapter_id 是否对应题目实际涉及的知识点（如 p1c3 应该是方程/不等式题，不能混进三角题）
7. 检查 LaTeX 渲染是否能在 KaTeX 中正确展示（避免使用 KaTeX 不支持的语法）

【输出格式】
JSON 数组（结构同输入，但已修正），加一个顶层字段说明你的修改：

{
  "questions": [...修正后的题目数组...],
  "reviewSummary": {
    "totalReviewed": N,
    "modifiedCount": M,
    "changes": [
      { "questionIndex": 1, "field": "answer.value", "before": "x=2", "after": "x=3", "reason": "联立方程化简错误，原解将 x²-y=1 误算成 x²+y=1" },
      ...
    ]
  }
}

如果某题完全没问题，无需修改，但仍要保留在 questions 数组里。

【输入题目】
{这里粘贴 Step 4 的 JSON 输出}
```

---

## Step 6：用户预览模板

不要把 JSON 直接展示给用户。用这个格式：

```
我用出题代理 + 审阅代理生成了 5 道题（审阅代理修正了 1 道）：

【1】math_p1c3 · 难度4 · calculation · ~8min
   题面：解联立方程 2x+y=7 与 x²-y=1
   答案：(x,y)=(2,3) 或 (-3,13)
   覆盖：联立方程 + 二次方程

【2】math_p1c3 · 难度4 · calculation · ~8min
   题面：求 |2x-3| < 5 的解集
   答案：x ∈ (-1, 4)
   覆盖：模不等式

... [其它题略]

汇总：5 题 / 难度全部 4 / 全部 calculation / 100% 覆盖 p1c3 / 预计总耗时 40min。

审阅代理修改的 1 处：第 4 题答案从 x=2 改成 x=3（原因：联立方程化简错误）。

OK 发布 / 让审阅 agent 重做第 X 题 / 全部重做
```

---

## Step 7：保存 + 入库

用户回 "OK 发布"，主代理：

1. **创建临时目录**（如不存在）：
   ```bash
   mkdir -p D:/CodeProjects/alevel-math-app/backend/scripts/question-seeder/_pending
   ```

2. **写 JSON 到临时文件**：用 Write 工具写到
   `D:/CodeProjects/alevel-math-app/backend/scripts/question-seeder/_pending/<YYYYMMDD-HHMMSS>.json`

3. **跑入库**：
   ```bash
   cd D:/CodeProjects/alevel-math-app/backend && bun scripts/question-seeder/insert-questions.mjs scripts/question-seeder/_pending/<YYYYMMDD-HHMMSS>.json
   ```

4. 捕获脚本输出的 ID 列表 → 进 Step 8

---

## Step 8：发布

```bash
cd D:/CodeProjects/alevel-math-app/backend && bun scripts/question-seeder/publish-batch.mjs 124 125 126 127 128
```

---

## Step 9：清理 + 汇报

```bash
rm D:/CodeProjects/alevel-math-app/backend/scripts/question-seeder/_pending/<YYYYMMDD-HHMMSS>.json
```

给用户一句话：

```
✅ 5 道题已发布到 DB（章节 math_p1c3）。ID: [124, 125, 126, 127, 128]。前端立即可见。
```

---

## 错误处理

- **list-chapters 显示学科不存在** → 学科尚未导入 DB，告诉用户先跑 seed 脚本
- **list-chapters 输出空章节** → 该学科只有 subject 没导单元，告诉用户
- **insert-questions 报 chapter_id 不存在** → 主代理 prompt 里 chapter_id 拼错，回 Step 2 重查
- **insert-questions 报 difficulty 越界** → 出题代理输出有问题，回 Step 4 重出
- **审阅代理改了一大堆** → 把审阅 summary 摘要给用户，让 ta 决定是否信任修正
