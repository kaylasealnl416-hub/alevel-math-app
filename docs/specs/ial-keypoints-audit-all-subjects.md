# IAL 三科 keyPoints 合规审查总报告

**审查日期：** 2026-04-16  
**覆盖学科：** Mathematics (P1/P2/P3/P4/S1/M1) · Further Mathematics (FM1/FM2/FMech/FS1) · Economics (e1-e4)  
**数据来源：** `curriculum.js`（Math）/ `subjects.js`（Further Math & Economics）  
**审查方法：** 逐章对比 keyPoints ← 与 → formulas / overview / hardPoints，找出"章节框架已承认但 keyPoints 未出现"的内容，及课纲要求但三处均未提及的内容  
**经济学专项：** 已独立对照 Pearson 官方 PDF（pages 12–49）完成，详见 `ial-economics-keypoints-audit.md`

> **速读方式：** 搜索 `🔴` 找 CRITICAL（影响核心考点）；`🟠` 找 HIGH；`🟡` 找 MEDIUM

---

## 一、Mathematics — P1 Pure Mathematics 1

### p1c4 — Graphs & Transformations

| 严重等级 | 缺失内容 | 证据 |
|---|---|---|
| 🟠 HIGH | **Reflection in x-axis: y = −f(x)** — 所有 y 坐标取反 | formulas 有 "Reflection in x-axis: −f(x) → all y-coordinates negated"，keyPoints 无 |
| 🟠 HIGH | **Reflection in y-axis: y = f(−x)** — 所有 x 坐标取反 | IAL P1 考纲标准内容，formulas 未提但 keyPoints 也无 |

> **影响：** P1 图形变换是高频考点（每年必出），缺少反射变换会导致学生在变换题上直接失分。

---

### p1c6 — Trigonometric Ratios

| 严重等级 | 缺失内容 | 证据 |
|---|---|---|
| 🟡 MEDIUM | **精确三角值**（30°/45°/60° 的 sin/cos/tan 精确值）| IAL P1 考纲要求背诵精确值；keyPoints 仅 p1c7 提到"sin(π/6) = 1/2 等" |
| 🟡 MEDIUM | 在给定区间内求解三角方程（结合 CAST 法则） | keyPoints 有 CAST 原理描述（在 p2c6），但 p1c6 作为引入章节未给出 |

---

## 二、Mathematics — P2 Pure Mathematics 2

### p2c3 — Exponentials & Logarithms

| 严重等级 | 缺失内容 | 证据 |
|---|---|---|
| 🟠 HIGH | **自然数 e 的引入**：y = eˣ 的图像特征（过 (0,1)，渐近线 y=0）| keyPoints 只有 "y = aˣ always passes through (0,1)"，未单独提 e |
| 🟠 HIGH | y = ln x 图像（y = eˣ 的反函数，过 (1,0)，x > 0 定义域）| keyPoints 未提 ln x 图像 |
| 🟡 MEDIUM | 方程 eˣ = k → x = ln k 的直接应用 | keyPoints 有"solve aˣ = b: take logs both sides"但未特别说明 e/ln 的互逆关系 |

### p2c4 — Binomial Expansion

| 严重等级 | 缺失内容 | 证据 |
|---|---|---|
| 🟡 MEDIUM | **适用范围声明**：P2 的二项展开仅适用于正整数 n（有限项）；对任意 n（含分数/负数）的无穷级数是 P4 内容 | 当前 keyPoint "Expansion of (1+x)ⁿ: 1 + nx + n(n-1)x²/2!..." 写的是通用公式，会让学生误以为 P2 可用 |

---

## 三、Mathematics — P3 Pure Mathematics 3

### p3c4 — Further Exponentials & Logarithms

| 严重等级 | 缺失内容 | 证据 |
|---|---|---|
| 🔴 CRITICAL | **反三角函数的导数**：d/dx(arcsin x) = 1/√(1-x²)；d/dx(arctan x) = 1/(1+x²)；d/dx(arccos x) = -1/√(1-x²) | P3 考纲明确包含反三角函数求导；p3c4 keyPoints 只有 eˣ 和 ln x 的导数；p3c5 也无反三角导数 |

### p3c5 — Advanced Differentiation

| 严重等级 | 缺失内容 | 证据 |
|---|---|---|
| 🔴 CRITICAL | **参数方程微分（Parametric Differentiation）**：dy/dx = (dy/dt) ÷ (dx/dt) | chapter overview 明确写 "参数方程微分（Parametric Differentiation）"，**keyPoints 完全没有该内容** |
| 🔴 CRITICAL | **参数方程定义**：如何由参数方程 x=f(t), y=g(t) 描述曲线，转化为 Cartesian 方程 | 全部 P3 keyPoints 无任何参数方程内容 |

> **影响：** 参数微分是 WMA13 每年必出大题（通常 8–12 分），是 P3 最重要的单一技术之一。

### p3c6 — Advanced Integration

| 严重等级 | 缺失内容 | 证据 |
|---|---|---|
| 🔴 CRITICAL | **反三角积分**：∫1/(a²+x²) dx = (1/a)arctan(x/a) + C | formulas 有此公式，**keyPoints 无** |
| 🔴 CRITICAL | **反三角积分**：∫1/√(a²−x²) dx = arcsin(x/a) + C | formulas 有此公式，**keyPoints 无** |
| 🔴 CRITICAL | **∫tan x dx = ln\|sec x\| + C** | formulas 有此公式，**keyPoints 无** |
| 🟠 HIGH | **利用三角恒等式化简积分**：sin²x = ½(1−cos2x)，cos²x = ½(1+cos2x) 用于积分 | formulas 有，keyPoints 无 |
| 🟠 HIGH | **利用部分分式积分**（将被积函数分解再积分）| 章节 overview 明确提到，keyPoints 无 |

---

## 四、Mathematics — P4 Pure Mathematics 4

### p4c2 — Complex Numbers

| 严重等级 | 缺失内容 | 证据 |
|---|---|---|
| 🔴 CRITICAL | **De Moivre 定理**：[r(cosθ + isinθ)]ⁿ = rⁿ(cosnθ + isinnθ) | chapter overview 第一句即提"De Moivre 定理"；formulas 有此公式；**keyPoints 完全没有** |
| 🔴 CRITICAL | **n 次根**：z^(1/n) 有 n 个值，均匀分布在半径 r^(1/n) 的圆上，角间距 2π/n | formulas 有，**keyPoints 无** |
| 🟠 HIGH | **半直线轨迹（Half-line locus）**：arg(z − z₁) = θ 表示从 z₁ 出发以角度 θ 的半直线 | p4c2 keyPoints 有圆 \|z-z₁\|=r 和垂直平分线，**但没有半直线轨迹**（fm1c1 有，p4c2 没有） |

> **影响：** De Moivre 定理是 WMA14 P4 Paper 的高频大题内容（通常 10–15 分）。

### p4c3 — Matrices

| 严重等级 | 缺失内容 | 证据 |
|---|---|---|
| 🔴 CRITICAL | **3×3 矩阵：行列式**（按行/列展开法，余子式与代数余子式）| chapter overview 明确写"2×2 和 3×3 矩阵"；**keyPoints 只有 2×2** |
| 🔴 CRITICAL | **3×3 矩阵：逆矩阵**（伴随矩阵法，det≠0 时可逆）| keyPoints 无 |
| 🔴 CRITICAL | **用矩阵求解三元方程组**：Mx = b → x = M⁻¹b | keyPoints 无（formulas 有 "Solving Systems" 公式但未转化为 keyPoint）|
| 🟠 HIGH | **反射变换矩阵**：在 x 轴、y 轴、y=x、y=−x 上的反射对应矩阵形式 | keyPoints 只有旋转矩阵；反射矩阵未覆盖 |
| 🟡 MEDIUM | **奇异矩阵与方程组解的关系**：det=0 时方程组无唯一解（无解或无穷多解）的几何解释 | keyPoints 只说"singular matrix has no inverse"，未给出几何含义 |

---

## 五、Mathematics — S1 Statistics 1

### s1c6 — Discrete Random Variables

| 严重等级 | 缺失内容 | 证据 |
|---|---|---|
| 🔴 CRITICAL | **二项分布 B(n,p)**：P(X=r) = C(n,r) × pʳ × (1−p)ⁿ⁻ʳ；均值 E(X) = np；方差 Var(X) = np(1−p) | chapter overview 明确写"二项分布（Binomial Distribution）B(n,p) 作为最重要的离散分布嵌入本章"；formulas 有该公式；**keyPoints 完全没有** |
| 🟠 HIGH | **二项分布的适用条件**：固定 n 次独立试验，每次成功概率恒为 p | keyPoints 无 |

> **影响：** 二项分布是 WST01 S1 最核心的分布，每年必考（概率题、期望/方差计算、假设检验基础）。缺失此 keyPoint 是 S1 最严重漏洞。

---

## 六、Mathematics — M1 Mechanics 1

### m1c1 — Mathematical Models & Kinematics

| 严重等级 | 缺失内容 | 证据 |
|---|---|---|
| 🟡 MEDIUM | **变加速运动（Variable Acceleration）**：v = ds/dt；a = dv/dt；a = v(dv/ds)；由 a(t) 积分求 v(t) 和 s(t) | keyPoints 全部是 SUVAT（匀加速）；IAL M1 考纲是否包含变加速需核实 PDF |

> **注：** IAL M1 是否包含变加速内容待核实实际 Pearson PDF。若包含则为 HIGH 级别。

---

## 七、Further Mathematics — FM1 (Further Pure 1)

### fm1c1 — Complex Numbers

| 严重等级 | 缺失内容 | 证据 |
|---|---|---|
| 🔴 CRITICAL | **De Moivre 定理**：[r(cosθ+isinθ)]ⁿ = rⁿ(cosnθ + isinnθ) | formulas 有此公式（fm1c1 formulas）；**keyPoints 无** |
| 🔴 CRITICAL | **n 次根计算**：z^(1/n) 的 n 个值，公式 z_k = r^(1/n)[cos((θ+2πk)/n)+isin((θ+2πk)/n)] | formulas 有，**keyPoints 无** |
| 🟠 HIGH | **Euler 公式**：e^(iθ) = cosθ + isinθ（指数形式 z = re^(iθ)）| formulas 有，keyPoints 无 |

### fm1c2 — Matrices and Determinants

| 严重等级 | 缺失内容 | 证据 |
|---|---|---|
| 🟠 HIGH | **3×3 矩阵逆矩阵**：(1/det)×adj(A) 方法；验证 A·A⁻¹ = I | keyPoints 有"3×3 行列式"，但无"3×3 逆矩阵" |
| 🟠 HIGH | **用矩阵解 3×3 方程组**：Ax = b → x = A⁻¹b；判断有唯一解/无解/无穷多解 | keyPoints 无此内容 |
| 🟡 MEDIUM | **特征值与特征向量**（Eigenvalues & Eigenvectors）：det(M − λI) = 0；Mv = λv | IAL Further Pure 1 是否包含特征值需核实 Pearson FM PDF；若包含则为 CRITICAL |

---

## 八、Further Mathematics — FM1 (Further Pure 1)

### fm1c5 — Polar Coordinates ✅

keyPoints 覆盖良好（坐标转换、曲线方程、面积、切线），**无明显缺失**。

---

## 九、Further Mathematics — FM2 (Further Pure 2)

### fm2c1 — Hyperbolic Functions

| 严重等级 | 缺失内容 | 证据 |
|---|---|---|
| 🟡 MEDIUM | **cosh 加法公式**：cosh(A±B) = coshA·coshB ± sinhA·sinhB | keyPoints 只有 sinh 加法公式；Osborn 法则隐含 cosh 公式但未显式列出 |
| 🟡 MEDIUM | **tanh 微分**：d/dx(tanh x) = sech²x | keyPoints 有 sinh 和 cosh 的微分，但无 tanh |
| 🟡 MEDIUM | **arcosh 和 artanh 的积分标准形式** | keyPoints 只有 arsinh 的积分标准形式 |

### fm2c2 — Differential Equations ✅

keyPoints 覆盖齐全（integrating factor、辅助方程三情况、特解三类型），**无明显缺失**。

### fm2c3 — Linear Algebra / Vector Spaces ✅

keyPoints 覆盖 vector space、subspace、basis、dimension、linear transformations、kernel、image、rank-nullity，**覆盖良好**。

---

## 十、Further Mathematics — FMech1

### fmech1c1 — Impulse & Momentum ✅ / fmech1c2 — Circular Motion ✅

keyPoints 覆盖正常，**无明显缺失**。

---

## 十一、Further Mathematics — FS1 (Further Statistics 1)

### fs1c1 — Discrete Random Variables

| 严重等级 | 缺失内容 | 证据 |
|---|---|---|
| 🟡 MEDIUM | **二项分布 B(n,p)** 在 keyPoints 中的显式表述 | formulas 有 B(n,p) 公式；keyPoints 无；因 FS1 以 Poisson/Geometric 为主，B(n,p) 视为 S1 前置知识，但 hardPoints 提到"Poisson 近似二项"，所以至少应有一条 keyPoint 说明适用条件 |

### fs1c2 — Hypothesis Testing ✅

keyPoints 覆盖零假设、备择假设、显著水平、p 值、双尾检验等，**覆盖良好**。

---

## 十二、Economics — 已有独立审查

详见 [`ial-economics-keypoints-audit.md`](./ial-economics-keypoints-audit.md)（已对照 Pearson PDF pages 12–49 验证）。

主要问题摘要（便于横向比较）：

| 章节 | 最严重缺失 |
|---|---|
| e1c5 | 市场泡沫/投机（完全缺失）|
| e2c1 | 失业类型分类（完全缺失）|
| e3c1 | 企业增长方式（完全缺失）|
| e3c3 | 可竞争市场（完全缺失）|
| e4c2 | 贸易条件（完全缺失）|
| e4c3 | 国际竞争力（整节缺失）|
| **e4（缺章）** | **4.3.5 国家宏观角色（整节缺失）** |

---

## 十三、汇总优先级表

### 🔴 CRITICAL — 立即修复（核心考点，每年必考）

| 编号 | 章节 | 缺失内容 |
|---|---|---|
| C1 | **s1c6** | 二项分布 B(n,p)：公式、均值、方差、适用条件 |
| C2 | **p4c2** | De Moivre 定理；n 次根 |
| C3 | **p4c3** | 3×3 矩阵：行列式、逆矩阵、解方程组 |
| C4 | **p3c5** | 参数方程微分 dy/dx = (dy/dt)÷(dx/dt)；参数方程定义 |
| C5 | **p3c6** | 反三角积分（arctan 型、arcsin 型）；∫tan x；三角恒等式积分 |
| C6 | **p3c4** | 反三角函数导数（arcsin、arctan、arccos）|
| C7 | **fm1c1** | De Moivre 定理；n 次根；Euler 公式 |

### 🟠 HIGH — 尽快补充（影响论述质量与答题完整性）

| 编号 | 章节 | 缺失内容 |
|---|---|---|
| H1 | **p1c4** | 反射变换 y = −f(x) 和 y = f(−x) |
| H2 | **p2c3** | 自然数 e；y = eˣ 和 y = ln x 图像 |
| H3 | **p4c2** | Half-line locus：arg(z − z₁) = θ |
| H4 | **p4c3** | 反射变换矩阵 |
| H5 | **p3c6** | 利用部分分式积分 |
| H6 | **fm1c2** | 3×3 逆矩阵；3×3 方程组求解 |

### 🟡 MEDIUM — 后续完善（提升覆盖深度）

| 编号 | 章节 | 缺失内容 |
|---|---|---|
| M1 | p1c6 | 精确三角值（sin 30°、cos 45° 等）|
| M2 | p2c4 | 澄清适用范围：P2 仅正整数 n |
| M3 | p4c3 | 奇异矩阵与方程组解的几何关系 |
| M4 | fm1c2 | 特征值/特征向量（需核实 FM1 spec）|
| M5 | fm2c1 | cosh 加法公式；tanh 导数 |
| M6 | fs1c1 | 二项分布作为 FS1 前置知识的显式说明 |
| M7 | m1c1 | 变加速（需核实 IAL M1 是否要求）|

---

## 十四、待核实项（需对照 Pearson Math/FM PDF）

以下问题无法仅凭 curriculum.js/subjects.js 自身确认，建议获取实际 PDF 后验证：

1. **特征值/特征向量** 是否在 Pearson IAL FP1（WFM01）考纲范围内
2. **变加速** (Variable Acceleration with Calculus) 是否在 IAL M1（WME01）还是 M2
3. **S2/M2 模块** 是否有计划实现（目前 app 无这两个模块）
4. **P2 二项展开**：IAL P2 (WMA12) 是否确实限制到正整数 n，还是已包含一般情况

---

*本报告基于 curriculum.js/subjects.js 自身的 overview/formulas/hardPoints 内容交叉验证，以及 Pearson Edexcel IAL 课纲常识。*  
*数学/进阶数学部分建议在时机允许时对照官方 PDF 二次核验 C 级和 H 级缺失项。*  
*经济学部分已独立对照官方 PDF 验证，见 ial-economics-keypoints-audit.md。*
