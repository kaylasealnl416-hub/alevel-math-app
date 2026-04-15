# subjects.js Further Math keyPoints 审查报告

**审查日期：** 2026-04-16
**审查范围：** `src/data/subjects.js` — `further_math` 节点下全部 12 章
**涵盖章节：** fm1c1~fm1c5（FP1）、fm2c1~fm2c3（FP2）、fmech1c1~fmech1c2（FM1）、fs1c1~fs1c2（FS1）
**审查人：** Claude Code (Sonnet 4.6)

---

## 一、条数概览

| 章节 ID | 标题 | keyPoints 数量 | 是否达标（目标 8-13） |
|---------|------|---------------|----------------------|
| fm1c1 | Complex Numbers | 13 | 达标 |
| fm1c2 | Matrices and Determinants | 10 | 达标 |
| fm1c3 | Proof by Induction | 8 | 达标（下限） |
| fm1c4 | Series and Summation | 8 | 达标（下限） |
| fm1c5 | Polar Coordinates | 10 | 达标 |
| fm2c1 | Hyperbolic Functions | 12 | 达标 |
| fm2c2 | Differential Equations | 11 | 达标 |
| fm2c3 | Vector Spaces | 10 | 达标 |
| fmech1c1 | Momentum and Impulse | 9 | 达标 |
| fmech1c2 | Circular Motion | 10 | 达标 |
| fs1c1 | Discrete Random Variables | 11 | 达标 |
| fs1c2 | Hypothesis Testing | 10 | 达标 |

全部 12 章均在 8~13 条区间内，无越界情况。

---

## 二、语法错误检查

**结论：无语法错误。**

- 所有 `keyPoints` 数组均正确闭合（`]` 与 `formulas` 字段之间无多余字符）
- 无未闭合引号、无多余逗号
- 无 LaTeX 语法（`$...$` 或 `\command` 形式）出现在 keyPoints 中

---

## 三、格式一致性

**与 Economics 章节格式对比**

Economics 格式样例：`"Scarcity: Resources are finite but human wants are infinite, forcing economic agents to make choices"`

Further Math 格式样例：`"Complex Number Definition: z = a + bi where i² = -1, a is real part Re(z), b is imaginary part Im(z)"`

两者均为：
- 纯英文字符串
- `概念名称: 解释内容` 的冒号分隔格式
- 无 LaTeX，数学符号全部使用 Unicode 上下标（²、³、₁、₂、θ、Σ、√、∫ 等）

**格式完全一致，符合规范。**

---

## 四、内容技术准确性审查

### MEDIUM 级别问题

---

**[MEDIUM-1] fm1c2 — 缺失 3×3 矩阵逆及矩阵变换几何类型**

文件位置：第 5093~5104 行

fm1c2（Matrices and Determinants）只覆盖了 2×2 矩阵的行列式和逆矩阵，缺少 3×3 矩阵的相关 keyPoint，而 Edexcel FP1 考纲明确要求能计算 3×3 行列式。另外"Area Scale Factor"是变换几何的内容，但"矩阵可表示的几何变换类型（旋转、反射、放大、错切）"未单独列出，exam tips 中提到了但 keyPoints 不够完整。

建议补充：
```
"3×3 Determinant: Expand along any row or column using cofactors, det(A) = a₁₁C₁₁ + a₁₂C₁₂ + a₁₃C₁₃"
"Geometric Transformations: Matrices can represent rotation, reflection, enlargement and shear; identify the type from the matrix structure"
```

这样可从 10 条升至 12 条，仍在目标范围内。

---

**[MEDIUM-2] fm1c3 — Proof by Induction 缺少"不等式归纳"类型**

文件位置：第 5128~5135 行

当前 8 条覆盖了 Series、Divisibility、Matrix Power、Recurrence Relations，但 Edexcel IAL FP1 真题中**不等式证明（Inequality Proofs）**是独立考点（例如证明 2ⁿ > n² 对 n ≥ 5 成立）。该类型证法与整除证法有本质区别（需要精确分析 k+1 情形的不等号方向），应单独列出。

建议补充：
```
"Inequality Proofs: Assume the inequality holds for n = k, then show the same inequality holds for n = k + 1 by bounding the extra term"
```

---

**[MEDIUM-3] fm2c3 — Vector Spaces 超出 Edexcel IAL FP2 实际考纲范围**

文件位置：第 5300~5311 行

Rank-Nullity Theorem（秩-零化度定理）、Kernel（零空间）、Image（像空间）属于**线性代数抽象理论**，在 Edexcel IAL FP2 的实际考题中几乎不直接考查（该内容更接近于 A-Level Further Maths Year 2 的大学衔接内容，或 Edexcel A-Level FM Core Pure 2 的选修内容）。

具体而言，Edexcel IAL FP2 更侧重的向量内容是**三维空间向量**（直线与平面方程、点线距离、点面距离、二面角）而非抽象的向量空间公理。

建议：将本章标题和内容改为 "Vectors in 3D" 或注明此为扩展内容，并补充以下更高频的考点：
```
"Equation of a Line in 3D: r = a + λb, where a is a position vector on the line and b is the direction vector"
"Equation of a Plane: r·n = a·n or ax + by + cz = d, where n is the normal vector to the plane"
"Distance from Point to Plane: d = |ax₀ + by₀ + cz₀ - d| / √(a² + b² + c²)"
```

---

**[MEDIUM-4] fs1c2 — Hypothesis Testing formulas 包含卡方检验（不在 FS1 范围内）**

文件位置：第 5464~5469 行（formulas 字段）

`formulas` 数组中含有：
```js
{ name: "Chi-squared Statistic", expr: "χ² = Σ(O-E)²/E" },
{ name: "Expected Frequency", expr: "E = (row total × column total) / grand total" },
{ name: "Degrees of Freedom", expr: "ν = (rows-1)(columns-1)" },
```

卡方检验（Chi-squared test）属于 **FS2（Further Statistics 2）**的内容，不在 FS1 范围内。虽然 `formulas` 字段不是 keyPoints，但与本章声明的 FS1 范围不符，容易误导学生。

建议：删除上述三条 formulas，替换为 FS1 实际使用的：
```js
{ name: "Binomial Under H₀", expr: "X ~ B(n, p₀), compute P(X ≤ x) or P(X ≥ x)" },
{ name: "Poisson Under H₀", expr: "X ~ Po(λ₀), compute P(X ≤ x) or P(X ≥ x)" },
```

---

### LOW 级别问题

---

**[LOW-1] fm2c1 — 第 12 条 keyPoint 标题用词不精确**

文件位置：第 5241 行

```
"Differentiation of Inverse Sine: d/dx(arsinh x) = 1 / √(x² + 1)"
```

标题写的是"Inverse Sine"，但实际内容是"Inverse Hyperbolic Sine (arsinh)"，两者是完全不同的函数（arcsin vs arsinh）。这是命名错误，会引起概念混淆。

建议改为：
```
"Differentiation of arsinh: d/dx(arsinh x) = 1 / √(x² + 1)"
```

---

**[LOW-2] fm1c4 — 缺少递推关系（Recurrence Relations）内容**

文件位置：第 5156~5165 行

章节 overview 中明确提到"递推关系（recurrence relations）"，但 8 条 keyPoints 全部针对求和公式（Σ formulas）和方法，没有任何关于递推关系求通项的内容。这与 overview 描述不符。

建议补充（当前 8 条，补至 9-10 条）：
```
"Recurrence Relations: A sequence defined recursively as uₙ₊₁ = f(uₙ); find closed-form expression by solving the corresponding homogeneous equation"
```

---

**[LOW-3] fmech1c2 — 第 10 条 Vertical Circle (Rod) 条件写法不严谨**

文件位置：第 5382 行

```
"Completing a Vertical Circle (Rod): Velocity v > 0 at the highest point, requiring minimum bottom velocity u > √(4gr)"
```

对于轻杆（rigid rod）做竖直圆周运动，临界条件是顶端速度 v = 0（而非 v > 0），因此最小底端速度应为 `u = √(4gr)`（等号），而不是严格大于。写成 `u > √(4gr)` 是不精确的，尽管在实际考题中影响不大，但技术上不严格。

建议改为：
```
"Completing a Vertical Circle (Rod): For a rigid rod, T can be negative (push); minimum speed at top is v = 0, giving minimum bottom velocity u = √(4gr)"
```

---

**[LOW-4] fm1c5 — 第 3 条 keyPoint 信息量偏低**

文件位置：第 5190 行

```
"Polar Equation of Curve: Defined as a function of the angle, given in the form r = f(θ)"
```

这条仅重复了极坐标的定义，对学生在考试中几乎没有附加价值，属于陈述显而易见的事实。建议替换为更有考点价值的内容，例如 limaçon 曲线识别：

```
"Limaçon Curve: r = a + b cos(θ) forms a limaçon; when a = b it degenerates to a cardioid; when a < b it has an inner loop"
```

---

## 五、Unicode 使用情况

所有章节均正确使用 Unicode 上下标代替 LaTeX，包括：
- 上标：²（U+00B2）、³（U+00B3）、ⁿ（U+207F）、ˣ（U+02E3）、⁻（U+207B）、⁺（U+207A）、ᵏ（U+1D4F）
- 下标：₁（U+2081）、₂（U+2082）、₀（U+2080）、ₖ（U+2096）、ᵢ（U+1D62）
- 希腊字母：θ、α、β、λ、μ、σ、ω、Σ
- 数学符号：√（U+221A）、∫（U+222B）、±（U+00B1）、≤（U+2264）、≥（U+2265）、≠（U+2260）、×（U+00D7）

**无一处使用 LaTeX 语法，格式规范。**

---

## 六、与相邻学科格式一致性

| 维度 | Economics | Further Math | 是否一致 |
|------|-----------|-------------|----------|
| 语言 | 纯英文 | 纯英文 | 一致 |
| 分隔格式 | `概念: 解释` | `概念: 解释` | 一致 |
| LaTeX 使用 | 无 | 无 | 一致 |
| Unicode 数学符号 | 有（较少） | 有（较多，符合数学学科特性） | 一致 |
| 条数范围 | 8-12 | 8-13 | 一致 |

---

## 七、总体评价

**结论：⚠️ 建议修改后合并**

整体质量较高，语法无误，格式规范，Unicode 使用正确，条数全部达标。发现以下问题需要处理：

**必须修改（影响内容准确性）：**
1. [MEDIUM-3] fm2c3 内容超出 Edexcel IAL FP2 考纲，建议核实后调整章节定位或补充三维向量考点
2. [MEDIUM-4] fs1c2 的 `formulas` 字段混入了属于 FS2 的卡方检验公式，应删除
3. [LOW-1] fm2c1 第 12 条"Differentiation of Inverse Sine"命名错误（应为 arsinh），存在概念混淆风险

**建议修改（内容完整性）：**
4. [MEDIUM-1] fm1c2 缺少 3×3 行列式 keyPoint
5. [MEDIUM-2] fm1c3 缺少不等式归纳类型
6. [LOW-2] fm1c4 overview 提到递推关系但 keyPoints 未覆盖
7. [LOW-3] fmech1c2 轻杆临界条件应用等号而非严格不等号
8. [LOW-4] fm1c5 第 3 条信息量不足，建议替换

