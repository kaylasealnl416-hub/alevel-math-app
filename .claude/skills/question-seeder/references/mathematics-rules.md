# Mathematics 出题规则（浓缩版）

完整规范在 `docs/exam-specs/WMA1{1-4}.md` 与 `docs/exam-specs/raw/`（含 P1/P2/S1 教材 PDF + 真题）。本文是给出题代理的浓缩 prompt 素材。

---

## 通用铁律（所有 Math 单元适用）

1. **倒推法（answer-first design）必须遵守**：先选整数 / 简单分数 / 标准角度作为答案，再反推参数。
2. **Mathematics 不出 MCQ**：IAL Math 卷面没有选择题，只有 calculation / proof。
3. **Mark scheme 用 M/A/B 体系**：
   - M1 = 方法分（用对方法即给，即使算错）
   - A1 = 精度分（依赖前面 M 分）
   - B1 = 独立分（独立事实/答案）
4. **每题含 2-4 个小问 (a)(b)(c)(d)**，难度递进，前问结果用于后问。
5. **数字陷阱设计**：
   - 联立方程 / 圆 / 距离题 → 用勾股数 (3,4,5)(5,12,13)(8,15,17)
   - 三角题 → 用特殊角 30°/45°/60°（精确值整洁）
   - 对数题 → 选好真数使 log 结果是整数（如 log₂8=3，log₃81=4）
   - 二项展开 → 先选好需要的系数，反推 (a+bx)^n 参数
6. **题面、答案、解析三段都填中英 + LaTeX**。

---

## P1 (WMA11/01) — Pure Mathematics 1

- 75 分 / 1h30min / 10-11 题 / 无 Section / 无 MCQ
- 难度梯度：Q1-Q4 易（共约 20 分）/ Q5-Q8 中（共约 30 分）/ Q9-Q11 难（共约 25 分）
- 最后 2-3 题通常是 **微积分综合 + 曲线面积**

**章节与典型题型**：
| chapter_id | 章节 | 典型考点 |
|---|---|---|
| math_p1c1 | Algebraic Expressions | 指数化简、代数分式、有理化 |
| math_p1c2 | Quadratics | 判别式、顶点形式、二次不等式 |
| math_p1c3 | Equations & Inequalities | 联立方程、模不等式、图形法 |
| math_p1c4 | Graphs & Transformations | 函数变换（平移/拉伸/反射） |
| math_p1c5 | Straight Line Geometry | 直线方程、斜率、垂直/平行 |
| math_p1c6 | Trigonometric Ratios | sin/cos/tan、CAST、精确值 |
| math_p1c7 | Radians | 弧度/扇形面积/弧长 |
| math_p1c8 | Differentiation | 多项式导数、切线、法线、极值 |
| math_p1c9 | Integration | 不定积分、定积分、曲线面积 |

**详细规范** → `docs/exam-specs/WMA11-P1.md`（含官方 prompt 模板）

---

## P2 (WMA12/01) — Pure Mathematics 2

- 75 分 / 1h30min / 10 题 / 无 Section / 无 MCQ

**典型题目结构**（来自真实试卷）：
| 题号 | 考点 | 分值 |
|---|---|---|
| Q1 | 二项式展开 | 5-7 |
| Q2 | 积分 | 4-6 |
| Q3 | 代数证明 | 4 |
| Q4 | 数列 | 4-7 |
| Q5 | 微分最优化 | 7-9 |
| Q6 | 因式定理+三角方程 | 7-9 |
| Q7 | AP/GP | 8-10 |
| Q8 | 指数与对数 | 8-10 |
| Q9 | 三角恒等式 | 7-9 |
| Q10 | 积分与面积综合 | 10-12 |

**章节**：
| chapter_id | 章节 |
|---|---|
| math_p2c1 | Algebraic Methods（因式定理、多项式长除、代数证明） |
| math_p2c2 | Coordinate Geometry: Circles |
| math_p2c3 | Exponentials & Logarithms |
| math_p2c4 | Binomial Expansion |
| math_p2c5 | Sequences & Series |
| math_p2c6 | Trigonometric Identities |
| math_p2c7 | Further Differentiation |
| math_p2c8 | Further Integration |

**详细规范** → `docs/exam-specs/WMA12-P2.md`

---

## P3 (WMA13/01) — Pure Mathematics 3

- 75 分 / 1h30min / 9 题 / Q1-Q3 易 / Q4-Q6 中 / Q7-Q9 难

**章节**：
| chapter_id | 章节 | 核心考点 |
|---|---|---|
| math_p3c1 | Further Algebraic Methods | 部分分数 |
| math_p3c2 | Functions | 定义域值域、复合、反函数 |
| math_p3c3 | Further Trigonometry | sec/cosec/cot、inverse trig |
| math_p3c4 | Further Exp & Log | 含 e^x、ln x 的微积分 |
| math_p3c5 | Advanced Differentiation | 隐函数、参数方程 |
| math_p3c6 | Advanced Integration | 分部积分、三角换元、部分分数积分 |
| math_p3c7 | Vectors | 3D 向量、向量方程、点积、夹角 |
| math_p3c8 | Differential Equations | 分离变量、初值问题 |

**详细规范** → `docs/exam-specs/WMA13-P3.md`

---

## P4 (WMA14/01) — Pure Mathematics 4

- 75 分 / 1h30min / 9 题

**章节**：
| chapter_id | 章节 | 核心考点 |
|---|---|---|
| math_p4c1 | Proof by Mathematical Induction | 数学归纳法 |
| math_p4c2 | Complex Numbers | Argand 图、模与辐角 |
| math_p4c3 | Matrices | 行列式、逆矩阵、线性变换 |
| math_p4c4 | Further Vectors | 平面方程、点到平面距离 |
| math_p4c5 | Hyperbolic Functions | sinh/cosh/tanh |
| math_p4c6 | Polar Coordinates | 极坐标图形、面积 |
| math_p4c7 | Further Calculus | 麦克劳林、弧长、旋转体 |
| math_p4c8 | 2nd-Order ODE | 特征方程 |

**P4 倒推特别注意**：复数题先选整数 modulus，矩阵题先选整数 determinant。

**详细规范** → `docs/exam-specs/WMA14-P4.md`

---

## S1 (WST01/01) — Statistics 1

⚠️ **本仓库尚未沉淀 S1 规范文档**。给 S1 出题前先告知用户："S1 的题型规范还没整理完，要不先用基础模板出几道你审一下？"

S1 章节（来自 seed-mathematics.js）：
- math_s1c1 Mathematical Modelling
- math_s1c2 Measures of Location & Spread
- math_s1c3 Representations of Data
- math_s1c4 Probability
- math_s1c5 Correlation & Regression
- math_s1c6 Discrete Random Variables
- math_s1c7 Normal Distribution

**通用 S1 规则**（暂行）：
- 用真实数据集情境（运动员成绩、考试分数、降雨量等）
- 概率题用整数概率 m/n
- 正态分布题用标准 z-table 可查的整数 z 值

---

## M1 (WME01/01) — Mechanics 1

⚠️ **本仓库尚未沉淀 M1 规范文档**。同 S1，先告知用户。

M1 章节：
- math_m1c1 Mathematical Models & Kinematics
- math_m1c2 Dynamics of a Particle
- math_m1c3 Forces & Equilibrium
- math_m1c4 Moments
- math_m1c5 Work, Energy & Power
- math_m1c6 Impulse & Momentum
- math_m1c7 Projectile Motion

**通用 M1 规则**（暂行）：
- g 取 9.8 m/s²（IAL 标准）
- 倒推：先选整数答案（速度、时间、力），反推质量/角度
- 角度用 30°/45°/60° 或 sin/cos = 3/5、4/5、5/13、12/13

---

## 出题代理 prompt 拼装时

引用对应单元的 `docs/exam-specs/WMA1X-PX.md` 里的 **Gemini Prompt 模板** 作为子代理 prompt 主干（那是项目已经验证可用的 prompt）。在主干基础上：

1. 替换学科目标章节为用户指定的 chapter_id
2. 加入"输出 JSON 数组（结构见 references/db-schema.md）"指令
3. 加入"中英 + LaTeX 三字段全填"要求
4. 加入"estimatedTime 按难度估算（1=180s, 2=240s, 3=360s, 4=480s, 5=720s）"
