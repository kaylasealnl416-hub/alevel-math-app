# chapter_id 实际格式（截至 2026-05-05 数据卫生整改后）

## 现状

经过 2026-05-05 的数据卫生整改，DB 内 chapter_id 已经全部规范化。**当前 DB 真实格式与项目根 CLAUDE.md 第 7 行学科前缀表一致**：

| 学科 | DB 实际前缀 | 示例 |
|---|---|---|
| Mathematics | `p` / `s` / `m` | `p1c3` / `s1c4` / `m1c1` |
| Economics | `e` | `e1c1` / `e3c2` |
| **Politics** | **`pol`** | `pol1c1` / `pol2c3` |
| History | `h`（待 list-chapters 验证） | `h1c1` 等 |
| Psychology | `psy` | `psy1c1` 等 |
| Further Math | `fm` / `fmech` / `fs` | 待验证 |

## 强制做法

### ✅ 每次出题前查 DB 拿真实 ID

```bash
cd D:/CodeProjects/alevel-math-app/backend
bun scripts/question-seeder/list-chapters.mjs mathematics
```

### ✅ 入库前再校验一次

```bash
bun scripts/question-seeder/verify-chapter-id.mjs p1c3 p1c4
```

### ❌ 错误：使用废弃的 math_ 前缀

```
chapterId: "math_p1c3"   ← 2026-05-05 整改后已删除，DB 不存在
```

---

## 用户输入歧义映射

| 用户说 | 主代理映射 |
|---|---|
| "P1 第 3 章" | `p1c3` |
| "Pure 1 Ch3" | `p1c3` |
| "数学 P1 联立方程" | 通过章节标题匹配 → `p1c3` |
| "Econ Unit 1 弹性" | 通过标题匹配 → `e1c2` |
| "Politics 第一章" | `pol1c1` |
| "Statistics 1 第 4 章概率" | `s1c4` |
| "Mechanics 第 2 章" | `m1c2` |

**任何映射都要先用 list-chapters 输出做最终验证**。

---

## 已验证 ID 清单（截至 2026-05-05）

### Mathematics（subject_id: `mathematics`，47 章）

P1 (`mathematics_P1`): `p1c1` … `p1c9`（Algebraic Expressions / Quadratics / Equations & Inequalities / Graphs & Transformations / Straight Line Geometry / Trigonometric Ratios / Radians / Differentiation / Integration）

P2 (`mathematics_P2`): `p2c1` … `p2c8`（Algebraic Methods / Circles / Exp & Log / Binomial / Sequences / Trig Identities / Further Diff / Further Integ）

S1 (`mathematics_S1`): `s1c1` … `s1c7`（Modelling / Location & Spread / Data Representation / Probability / Correlation & Regression / Discrete RV / Normal Distribution）

P3 (`mathematics_P3`): `p3c1` … `p3c8`（Further Algebra / Functions / Further Trig / Further Exp & Log / Advanced Diff / Advanced Integ / Vectors / Differential Equations）

P4 (`mathematics_P4`): `p4c1` … `p4c8`（Induction / Complex Numbers / Matrices / Further Vectors / Hyperbolic / Polar / Further Calculus / 2nd-Order ODE）

M1 (`mathematics_M1`): `m1c1` … `m1c7`（Models & Kinematics / Dynamics / Forces & Equilibrium / Moments / Work, Energy & Power / Impulse & Momentum / Projectile Motion）

### Economics（subject_id: `economics`，23 章）

Unit 1: `e1c1` … `e1c6`（Markets in Action）
Unit 2: `e2c1` … `e2c6`（Macroeconomic Performance and Policy）
Unit 3: `e3c1` … `e3c5`（Business Behaviour）
Unit 4: `e4c1` … `e4c6`（Developments in the Global Economy）

### Politics（subject_id: `politics`，11 章，2026-05-05 从 p_ 迁移到 pol_）

Unit 1: `pol1c1` UK Democracy / `pol1c2` Core Political Ideas
Unit 2: `pol2c1` US Federalism / `pol2c2` US Congress / `pol2c3` US Presidency
Unit 3: `pol3c1` Globalisation / `pol3c2` International Organisations / `pol3c3` IR Theories
Unit 4: `pol4c1` Comparative Politics Methods / `pol4c2` US Political System / `pol4c3` Global Governance

### History / Psychology / Further Math

**首次为这些学科出题前，必须先跑 list-chapters.mjs 拿真实 ID**，并把结果回填到本文件。

---

## 数据完整性约束（2026-05-05 新增）

DB 加了 `chapters_unit_num_unique UNIQUE (unit_id, num)` 唯一约束——同一单元下同一章节序号只能有一条记录，防止类似 3 月那次 math_ 前缀半截迁移留下的孤儿空壳复发。

将来谁手抖再跑 INSERT 重复章节，会立即被 DB 拒绝并报错，不会沉默污染数据。
