# chapter_id 实际格式（关键避坑）

## 核心警告

**4 月 4 日的设计文档（`docs/exam-specs/skill-design-discussion.md`）和项目根 CLAUDE.md 写的 chapter_id 格式（如 `p1c3`、`e1c2`）与数据库实际存储的格式不完全一致**。

不同学科的真实前缀规则不统一——是项目历史演进留下的现状。**绝不能凭直觉拼 chapter_id**，每次出题前必须先跑 list-chapters.mjs 验证。

---

## 已知格式（按 backend/src/db/seed-mathematics.js 与 schema.js 注释）

| 学科 | DB 实际前缀 | CLAUDE.md 写的 | 备注 |
|---|---|---|---|
| Mathematics | `math_p1c3` / `math_s1c4` / `math_m1c1` | `p`/`s`/`m` | **带 `math_` 前缀**，与 CLAUDE.md 不一致 |
| Economics | `e1c1`（推断，待 list-chapters 验证） | `e` | schema.js 注释举例是 `e1c1` |
| History | `h?c?` | `h` | 待验证 |
| Politics | `pol1c2` | `pol` | CLAUDE.md 已注明（避免和 p 前缀冲突） |
| Psychology | `psy?c?` | `psy` | 待验证 |
| Further Math | `fm?c?` / `fmech?c?` / `fs?c?` | `fm`/`fmech`/`fs` | 待验证 |

---

## 强制做法

### ✅ 正确：每次出题前查 DB

```bash
cd D:/CodeProjects/alevel-math-app/backend
bun scripts/question-seeder/list-chapters.mjs mathematics
```

复制输出里的真实 ID 用。

### ✅ 入库前再校验一次

```bash
bun scripts/question-seeder/verify-chapter-id.mjs math_p1c3 math_p1c4
```

### ❌ 错误：照搬 CLAUDE.md / 设计文档里的格式

```
chapterId: "p1c3"   ← Mathematics 里 DB 没这条记录，会被外键约束拒绝
chapterId: "p1_c3"  ← 凭直觉拼下划线，错
```

---

## 用户输入歧义处理

用户可能用以下方式表达章节，主代理需要映射：

| 用户说 | 主代理映射 |
|---|---|
| "P1 第 3 章" | `math_p1c3` |
| "Pure 1 Ch3" | `math_p1c3` |
| "数学 P1 联立方程" | 通过章节标题匹配 → `math_p1c3` |
| "math_p1c3" | 直接用 |
| "Econ Unit 1 弹性" | 通过标题匹配 → `e1c2`（推断） |
| "Politics 第一章" | `pol1c1` |
| "Statistics 1 第 4 章概率" | `math_s1c4` |

**任何映射都要先用 list-chapters 输出做最终验证**，不能仅凭推断入库。

---

## 已验证 ID 清单（截至 skill 创建时）

### Mathematics（subject_id: `mathematics`）

P1 (`mathematics_P1`):
- `math_p1c1` Algebraic Expressions
- `math_p1c2` Quadratics
- `math_p1c3` Equations & Inequalities
- `math_p1c4` Graphs & Transformations
- `math_p1c5` Straight Line Geometry
- `math_p1c6` Trigonometric Ratios
- `math_p1c7` Radians
- `math_p1c8` Differentiation
- `math_p1c9` Integration

P2 (`mathematics_P2`):
- `math_p2c1`–`math_p2c8`（Algebraic Methods / Circles / Exp&Log / Binomial / Sequences / Trig Identities / Further Diff / Further Integ）

S1 (`mathematics_S1`):
- `math_s1c1`–`math_s1c7`

P3 (`mathematics_P3`):
- `math_p3c1`–`math_p3c8`

P4 (`mathematics_P4`):
- `math_p4c1`–`math_p4c8`

M1 (`mathematics_M1`):
- `math_m1c1`–`math_m1c7`

### Economics、History、Politics、Psychology、Further Math

**首次为这些学科出题前，必须先跑 list-chapters.mjs 拿真实 ID**，并把结果回填到本文件，让后续调用更快。
