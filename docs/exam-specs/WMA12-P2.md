# WMA12/01 — Pure Mathematics P2

## 基本信息
| 项目 | 内容 |
|------|------|
| 考试代码 | WMA12/01 |
| 考试时长 | 1小时30分钟 |
| 总分 | 75分 |
| 题数 | 10道大题 |
| 数据来源 | May 2024 & June 2019 官方真实试卷 |

## 典型题目结构（来自真实试卷）

| 题号 | 考点 | 典型分值 |
|------|------|---------|
| Q1 | 二项式展开（Binomial Expansion） | 5–7分 |
| Q2 | 积分（Integration） | 4–6分 |
| Q3 | 代数证明（Proof） | 4分 |
| Q4 | 数列（Sequences & Series） | 4–7分 |
| Q5 | 微分最优化（Differentiation & Optimisation） | 7–9分 |
| Q6 | 因式定理+三角方程（Factor Theorem + Trig） | 7–9分 |
| Q7 | 等差等比数列（AP/GP） | 8–10分 |
| Q8 | 指数与对数（Exponentials & Logarithms） | 8–10分 |
| Q9 | 三角恒等式（Trig Identities） | 7–9分 |
| Q10 | 积分与面积综合（Integration & Area） | 10–12分 |

## 涵盖考点

| 章节ID | 章节名称 | 核心考点 |
|--------|---------|---------|
| p2c1 | Algebraic Methods | 因式定理、多项式长除、代数证明 |
| p2c2 | Coordinate Geometry: Circles | 圆方程、圆心半径、切线、两圆关系 |
| p2c3 | Exponentials & Logarithms | log定律、换底、指数方程精确解 |
| p2c4 | Binomial Expansion | (1+x)^n展开、近似、系数计算 |
| p2c5 | Sequences & Series | AP/GP公式、求和、递推数列 |
| p2c6 | Trigonometric Identities | sin²+cos²=1、tan=sin/cos、double angle |
| p2c7 | Further Differentiation | 链式法则、乘积法则、隐函数 |
| p2c8 | Further Integration | 分部积分、换元、参数方程 |

## 出题规则（倒推法）

同 P1 规则，额外注意：
- 对数题：选好真数值使得 log 结果为整数（如 log₂8=3）
- 二项展开：先选好需要的系数，反推展开式参数
- 三角恒等式：先确认恒等式化简路径，再设计证明题
- AP/GP 复合题：设计薪资/储蓄等实际情境

## Gemini Prompt 模板

You are a Pearson Edexcel IAL Mathematics examiner. Generate a COMPLETE mock exam paper for WMA12/01 Pure Mathematics P2.

PAPER STRUCTURE:
- Time: 1 hour 30 minutes | Total: 75 marks
- 10 structured questions, NO sections, NO MCQ
- Progressive difficulty: Q1–Q3 easier (4–7 marks), Q4–Q7 medium (7–9 marks), Q8–Q10 harder (9–12 marks)

REQUIRED TOPICS (must include ALL):
1. Algebraic Methods — factor theorem, polynomial division, proof
2. Coordinate Geometry: Circles — circle equation (x-a)²+(y-b)²=r², tangent
3. Exponentials & Logarithms — log laws, exponential equations (exact answer in log form)
4. Binomial Expansion — (a+bx)^n, first 4 terms, approximation
5. Sequences & Series — arithmetic (AP) and geometric (GP) series, sum formulas
6. Trigonometric Identities — sin²θ+cos²θ=1, tanθ=sinθ/cosθ, double angle, proof + equation
7. Further Differentiation — chain rule, product rule, optimisation
8. Further Integration — definite integral, area between curves, integration by substitution

ANSWER-FIRST DESIGN (倒推法 — MANDATORY):
- For each calculation question: choose the final answer first (integer or simple fraction), then reverse-engineer the question parameters
- Logarithm questions: choose values so log results are integers (e.g., log₃81=4)
- Trigonometric equations: use angles that are multiples of 30° or 45°
- Connected sub-parts: result of (a) must be used in (b)

MARK SCHEME: Use M1/A1/B1 format. Show every step. State where follow-through marks apply.

Output: Complete Question Paper + Complete Mark Scheme
