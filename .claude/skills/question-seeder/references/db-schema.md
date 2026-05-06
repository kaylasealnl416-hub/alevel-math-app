# questions 表速查（来自 backend/src/db/schema.js）

## 字段清单

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | serial PK | 自动 | 入库后自动生成 |
| `chapterId` | varchar(50) | ✅ | 必须存在于 chapters 表（FK） |
| `type` | varchar(20) | ✅ | `multiple_choice` / `fill_blank` / `calculation` / `proof` |
| `difficulty` | integer | ✅ | 1-5 整数 |
| `content` | jsonb | ✅ | `{ zh, en, latex }` |
| `options` | jsonb | 选 | MCQ 才需要：`["A. ...", "B. ...", "C. ...", "D. ..."]` |
| `answer` | jsonb | ✅ | `{ value, latex, explanation }` |
| `explanation` | jsonb | 选 | `{ zh, en }` 完整步骤 |
| `tags` | jsonb 数组 | 选 | 中文知识点标签 `["供需理论", "市场均衡"]` |
| `source` | varchar(50) | 选 | 默认 `'manual'`；本 skill 入库时填 `'ai_generated'` |
| `estimatedTime` | integer | 选 | 秒。默认 300 |
| `status` | varchar(20) | 选 | `'draft'` / `'reviewed'` / `'published'`，本 skill 默认 `'reviewed'` |
| `createdAt` / `updatedAt` | timestamp | 自动 | 脚本会自动填 |

## 完整 JSON 样例（一道题）

```json
{
  "chapterId": "p1c3",
  "type": "calculation",
  "difficulty": 4,
  "content": {
    "zh": "解联立方程 $2x + y = 7$ 与 $x^2 - y = 1$。",
    "en": "Solve the simultaneous equations $2x + y = 7$ and $x^2 - y = 1$.",
    "latex": "\\begin{cases} 2x + y = 7 \\\\ x^2 - y = 1 \\end{cases}"
  },
  "options": null,
  "answer": {
    "value": "(2, 3) 或 (-3, 13)",
    "latex": "(x, y) = (2, 3) \\text{ 或 } (-3, 13)",
    "explanation": "由式①得 y=7-2x，代入式②化简得 x²+2x-8=0，因式分解 (x-2)(x+3)=0。"
  },
  "explanation": {
    "zh": "**Step 1**：由 $2x+y=7$ 得 $y = 7 - 2x$\n**Step 2**：代入 $x^2 - y = 1$ 得 $x^2 - (7-2x) = 1$\n**Step 3**：化简 $x^2 + 2x - 8 = 0$\n**Step 4**：因式分解 $(x-2)(x+3) = 0$，所以 $x = 2$ 或 $x = -3$\n**Step 5**：代回得 $(2, 3)$ 和 $(-3, 13)$",
    "en": "**Step 1**: From $2x+y=7$, $y = 7 - 2x$\n**Step 2**: Substitute into $x^2 - y = 1$: $x^2 - (7-2x) = 1$\n**Step 3**: Simplify: $x^2 + 2x - 8 = 0$\n**Step 4**: Factor: $(x-2)(x+3) = 0$, so $x = 2$ or $x = -3$\n**Step 5**: Back-substitute to get $(2, 3)$ and $(-3, 13)$"
  },
  "tags": ["联立方程", "二次方程", "代入消元法"],
  "estimatedTime": 480
}
```

## MCQ 样例（Economics 才用，Math 不用）

```json
{
  "chapterId": "e1c2",
  "type": "multiple_choice",
  "difficulty": 2,
  "content": {
    "zh": "若苹果的价格上涨 10%，需求量下降 5%，则需求价格弹性 (PED) 是：",
    "en": "If the price of apples rises by 10% and quantity demanded falls by 5%, the PED is:",
    "latex": ""
  },
  "options": [
    "A. -0.5（缺乏弹性）",
    "B. -2.0（富有弹性）",
    "C. 0.5（缺乏弹性）",
    "D. -0.05（单位弹性）"
  ],
  "answer": {
    "value": "A",
    "latex": "PED = \\frac{-5\\%}{+10\\%} = -0.5",
    "explanation": "PED = % ΔQd / % ΔP = -5/10 = -0.5，绝对值小于1，缺乏弹性。"
  },
  "explanation": {
    "zh": "需求价格弹性公式：PED = 需求量变化百分比 ÷ 价格变化百分比 = -5% / 10% = -0.5。负号表示价格与需求量反向变动，绝对值 0.5 < 1，属于缺乏弹性 (inelastic)。",
    "en": "PED formula: % change in Qd / % change in P = -5% / 10% = -0.5. Negative sign means inverse relationship; absolute value 0.5 < 1 indicates inelastic demand."
  },
  "tags": ["需求价格弹性", "PED", "弹性分类"],
  "estimatedTime": 180
}
```

## 字段陷阱

1. **`content.latex`**：纯 LaTeX 表达式，前端会单独渲染。如果题面文字穿插公式，把整段中英文放 `zh`/`en`（用 `$...$` 包裹公式），latex 字段放最核心公式或留空字符串。
2. **`answer.value`**：用人类可读的字符串（不是纯 LaTeX）。`answer.latex` 才是公式形式。
3. **`tags` 必须是数组**：即使只有一个标签也要 `["xxx"]`。
4. **`options` 仅 MCQ 必填**，其他题型必须 `null`。
5. **难度 1-5**：超界 insert-questions.mjs 会拒绝。
6. **`difficulty: "4"` 字符串会被拒**——必须整数 `4`。

## DB 引用约束

- `chapterId` → `chapters.id`（外键，不存在直接报错）
- `reviewedBy` / `createdBy` → `users.id`（本 skill 不填，留空）

## 状态流转

```
入库时 status: 'reviewed'
    ↓ 用户产品级把关后
publish-batch.mjs ID...
    ↓
status: 'published' → 前端可见
```

`'draft'` 状态本 skill 不用（那是手动录题用的）。
