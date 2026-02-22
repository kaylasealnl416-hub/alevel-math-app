import { useState, useEffect, useRef } from "react";

// ============================================================
// DATA: A-Level Math Curriculum (P1, P2, P3, P4, S1, M1)
// ============================================================
const CURRICULUM = {
  P1: {
    title: "Pure Mathematics 1",
    color: "#DA291C",
    icon: "∫",
    chapters: [
      // ── Chapter 1 ──────────────────────────────────────────────
      {
        id: "p1c1", num: 1, title: "Algebraic Expressions 代数表达式",
        overview: "掌握指数法则、根式化简与分母有理化，是所有后续纯数学运算的基础工具箱。这些技能直接应用于微积分求导、指数模型等核心模块。WMA11考试中此章节考点通常以1-2道前置题目的形式出现，要求速度与准确率并重。",
        keyPoints: [
          "指数法则（Index Laws）：aᵐ × aⁿ = aᵐ⁺ⁿ；aᵐ ÷ aⁿ = aᵐ⁻ⁿ；(aᵐ)ⁿ = aᵐⁿ",
          "零次幂与负指数：a⁰ = 1（a≠0）；a⁻ⁿ = 1/aⁿ",
          "分数指数：aᵐ/ⁿ = (ⁿ√a)ᵐ = ⁿ√(aᵐ)，例如 8²/³ = (∛8)² = 4",
          "根式（Surds）：√a × √b = √(ab)；√a / √b = √(a/b)；(√a)² = a",
          "简化根式：√12 = √(4×3) = 2√3；提取最大完全平方因子",
          "展开含根式的乘积：(a + √b)(a − √b) = a² − b（平方差公式）",
          "分母有理化（单项式）：将 k/√a 化为 k√a/a",
          "分母有理化（二项式）：乘以共轭式，例如 1/(√3+1) × (√3−1)/(√3−1) = (√3−1)/2",
          "代数分式的化简：提取公因子后约分，注意分母不为零的条件"
        ],
        formulas: [
          { name: "分数指数", expr: "aᵐ/ⁿ = ⁿ√(aᵐ)  例：27¹/³ = 3" },
          { name: "负指数", expr: "a⁻ⁿ = 1/aⁿ  例：2⁻³ = 1/8" },
          { name: "共轭有理化", expr: "1/(a+√b) = (a−√b)/(a²−b)" },
          { name: "乘方公式", expr: "(√a + √b)(√a − √b) = a − b" }
        ],
        difficulty: "Foundation",
        hardPoints: "【高频失分点】负指数与分数指数的相互转换；在题目混合使用 xⁿ 与 √x 时忘记统一形式再求导；有理化时共轭式选错（特别是三项分母）。建议：每次做微积分题前先将所有根式转化为分数指数形式。",
        examTips: "此章节在WMA11中占约4-6分，多以选择/填空形式出现。务必掌握在不使用计算器情况下精确化简根式表达式的技巧。",
        youtube: [
          { title: "P1 Ch1 Algebraic Expressions — Bicen Maths完整讲解", url: "https://www.youtube.com/watch?v=K0BIV_-wye4", channel: "Bicen Maths" },
          { title: "Index Laws & Surds精讲 — TLMaths", url: "https://www.youtube.com/watch?v=uuXm32-nyz8", channel: "TLMaths" },
          { title: "Rationalising the Denominator — Mr Hassaan", url: "https://www.youtube.com/watch?v=KmtLzMQOClY", channel: "Mr Hassaan's Maths" }
        ]
      },
      // ── Chapter 2 ──────────────────────────────────────────────
      {
        id: "p1c2", num: 2, title: "Quadratics 二次函数",
        overview: "二次函数是P1的核心章节，配方法与判别式不仅直接考察，更是P2圆的几何、直线与曲线位置关系等高阶题目的底层工具。必须达到「秒杀」熟练度——任何二次方程的解法切换（分解、配方、公式法）都应在30秒内完成。判别式Δ = b²−4ac是全课程中出现频率最高的单一公式之一。",
        keyPoints: [
          "二次函数标准形式：y = ax² + bx + c（a ≠ 0），开口方向由a决定",
          "因式分解法：ax² + bx + c = a(x − p)(x − q)，适用于整数根情形",
          "求根公式（Quadratic Formula）：x = (−b ± √(b²−4ac)) / 2a，任何情形均适用",
          "配方法（Completing the Square）：y = a(x + b/2a)² + (c − b²/4a)",
          "顶点坐标直接由配方读出：顶点 = (−b/2a, c − b²/4a)",
          "判别式（Discriminant）：Δ = b² − 4ac",
          "Δ > 0：两个不同实数根；Δ = 0：两个相等实数根（重根）；Δ < 0：无实数根",
          "判别式的几何意义：Δ > 0 ↔ 抛物线与x轴有两个交点；Δ = 0 ↔ 相切；Δ < 0 ↔ 不相交",
          "二次不等式：ax² + bx + c > 0 的解集，先解方程再根据开口判断区间",
          "隐性二次方程：如 x⁴ − 5x² + 4 = 0，令 u = x² 化为标准二次",
          "联立直线与抛物线：代入消元后得二次方程，用判别式判断交点数"
        ],
        formulas: [
          { name: "求根公式", expr: "x = (−b ± √(b²−4ac)) / 2a" },
          { name: "配方标准式", expr: "y = a(x + b/2a)² + c − b²/4a" },
          { name: "判别式", expr: "Δ = b²−4ac：>0两实根，=0重根，<0无实根" },
          { name: "韦达定理", expr: "两根之和 = −b/a；两根之积 = c/a" },
          { name: "二次不等式", expr: "若a>0：ax²+bx+c<0 解在两根之间" }
        ],
        difficulty: "Foundation",
        hardPoints: "【高频失分点】配方时忘记提出系数a再配方（若a≠1）；判别式符号计算错误（尤其b为负数时 b² 忘记取正）；联立方程后展开时代数错误；二次不等式的区间方向（>0还是<0）判断失误。考官报告特别指出：大量学生在\"Show that the line is tangent\"题型中正确设置了Δ=0但计算出错。",
        youtube: [
          { title: "P1 Quadratics完整章节 — Bicen Maths", url: "https://www.youtube.com/watch?v=K0BIV_-wye4", channel: "Bicen Maths" },
          { title: "Completing the Square精讲 — TLMaths", url: "https://www.youtube.com/watch?v=uuXm32-nyz8", channel: "TLMaths" },
          { title: "Discriminant & Quadratic Inequalities — Mr Hassaan IAL P1", url: "https://www.youtube.com/watch?v=KmtLzMQOClY", channel: "Mr Hassaan's Maths" }
        ]
      },
      // ── Chapter 3 ──────────────────────────────────────────────
      {
        id: "p1c3", num: 3, title: "Equations & Inequalities 方程与不等式",
        overview: "本章涵盖联立方程（线性-线性、线性-二次）、含绝对值不等式以及区域（Regions）的图形化表示。联立方程是贯穿全课程的解题技术；不等式则是理解数学建模中约束条件的基础，与LSE经济学所强调的约束优化问题高度相关。",
        keyPoints: [
          "线性联立方程：消元法（Elimination）或代入法（Substitution）",
          "线性−二次联立：将线性方程代入二次方程，化为标准二次形式再求解",
          "联立方程解的个数：由判别式Δ决定（直线与曲线的交点数）",
          "线性不等式：ax + b > c → x > (c−b)/a（注意除以负数时翻转不等号！）",
          "二次不等式图形法：画出抛物线，根据 > 0 或 < 0 选取对应区间",
          "绝对值不等式：|x − a| < b ↔ −b < x − a < b ↔ a−b < x < a+b",
          "|x − a| > b ↔ x < a−b 或 x > a+b（两段区间，用\"or\"连接）",
          "区域（Regions）：y > f(x) 对应曲线上方区域；多个不等式取交集",
          "整数解（Integer solutions）：解完不等式后列举满足条件的整数",
          "恒成立条件：ax² + bx + c > 0 对所有x成立 ↔ a > 0 且 Δ < 0"
        ],
        formulas: [
          { name: "绝对值不等式（<型）", expr: "|x−a| < b ↔ a−b < x < a+b" },
          { name: "绝对值不等式（>型）", expr: "|x−a| > b ↔ x<a−b 或 x>a+b" },
          { name: "恒大于零条件", expr: "ax²+bx+c>0 恒成立 ⟺ a>0 且 b²−4ac<0" },
          { name: "联立线性-二次", expr: "代入线性式消去y，得ax²+bx+c=0，再解" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】除以负数时不等号方向未翻转；绝对值分类讨论漏掉一种情况；区域图形化时混淆 y > f(x) 与 y < f(x) 的阴影方向。建议：解绝对值不等式优先使用\"平方两边\"或\"数轴图形法\"而非代数分类，可减少符号错误。",
        youtube: [
          { title: "Inequalities IAL P1 — Mr Hassaan精讲", url: "https://www.youtube.com/watch?v=riLpmjZZTwA", channel: "Mr Hassaan's Maths" },
          { title: "Simultaneous Equations线性-二次 — TLMaths", url: "https://www.youtube.com/watch?v=uuXm32-nyz8", channel: "TLMaths" },
          { title: "P1 Equations全章走走过 — Bicen Maths", url: "https://www.youtube.com/watch?v=OnZGBQyWK1g", channel: "Bicen Maths" }
        ]
      },
      // ── Chapter 4 ──────────────────────────────────────────────
      {
        id: "p1c4", num: 4, title: "Graphs & Transformations 图像与变换",
        overview: "理解各类函数图像的形状特征与图像变换规则，是直觉性解题的基础。本章要求学生能徒手草绘三次、四次函数及倒数函数图像，并掌握四种基本变换对图像和解析式的影响。这些技能在P2的对数函数图像分析和S1的数据编码理解中均有直接应用。强烈建议结合Desmos辅助可视化理解。",
        keyPoints: [
          "多项式函数的端行为：次数为偶数且a>0 → 两端朝上；次数为奇数且a>0 → 左下右上",
          "三次函数 y = ax³ + bx² + cx + d 的草图：找x轴截距（因式分解）、y轴截距、驻点形状",
          "四次函数：最多3个驻点，图像关于某轴可能对称",
          "倒数函数 y = k/x：双曲线，两个分支，渐近线为 x=0 和 y=0",
          "变换1 — 平移：y = f(x) + a（纵向移a）；y = f(x − a)（横向移a，注意符号！）",
          "变换2 — 伸缩：y = af(x)（纵向伸缩，y坐标乘a）；y = f(ax)（横向伸缩，x坐标除以a）",
          "变换3 — 反射：y = −f(x)（关于x轴）；y = f(−x)（关于y轴）",
          "变换的顺序影响结果：先平移再缩放 ≠ 先缩放再平移",
          "变换对关键点的影响：追踪极值点、截距点在变换后的新坐标",
          "组合变换：y = af(bx + c) + d，从内到外依次分析"
        ],
        formulas: [
          { name: "纵向平移", expr: "f(x) + a → 图像上移a单位（a>0）" },
          { name: "横向平移", expr: "f(x − a) → 图像右移a单位（a>0，注意反直觉！）" },
          { name: "纵向伸缩", expr: "af(x) → y坐标均乘以a（x轴截距不变）" },
          { name: "横向伸缩", expr: "f(ax) → x坐标均除以a（y轴截距不变）" },
          { name: "关于x轴反射", expr: "−f(x) → 所有y坐标取反" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】f(x−a)是右移而非左移（最常见的直觉错误！）；f(ax)是横向压缩1/a倍而非扩大；草图未标明关键坐标（截距、极值点）导致失图形分；组合变换顺序混乱。建议：使用Desmos验证每个变换，先在图形上直觉理解，再推导解析式变化规律。",
        youtube: [
          { title: "Graph Transformations IAL P1 — Edexcel Specimen讲解", url: "https://www.youtube.com/watch?v=PLSqFhPlgCw", channel: "Mr Hassaan's Maths" },
          { title: "Cubic & Quartic Graphs草图技巧 — TLMaths", url: "https://www.youtube.com/watch?v=uuXm32-nyz8", channel: "TLMaths" },
          { title: "P1 图像与变换完整章节 — Bicen Maths", url: "https://www.youtube.com/watch?v=K0BIV_-wye4", channel: "Bicen Maths" }
        ]
      },
      // ── Chapter 5 ──────────────────────────────────────────────
      {
        id: "p1c5", num: 5, title: "Straight Line Geometry 直线几何",
        overview: "直线方程是P1中最高频的考点之一，同时也是P2圆的几何、微分（切线与法线）的前置知识。本章要求学生能熟练运用点斜式、斜截式、两点式，并理解垂直关系的数学条件。考官报告指出，直线几何的建模应用（如坐标平面内的实际问题）是高分考生与普通考生拉开差距的关键。",
        keyPoints: [
          "梯度（Gradient）：m = (y₂ − y₁)/(x₂ − x₁)，表示直线的倾斜程度",
          "直线方程的三种形式：斜截式 y = mx + c；点斜式 y − y₁ = m(x − x₁)；一般式 ax + by + c = 0",
          "点斜式的优势：已知一点和斜率时最直接，无需先求截距",
          "平行直线：斜率相等，m₁ = m₂（但截距不同）",
          "垂直直线（法线条件）：m₁ × m₂ = −1（斜率互为负倒数）",
          "水平线：斜率 = 0，方程形如 y = k；垂直线：斜率无定义，方程形如 x = k",
          "两点间距离：d = √[(x₂−x₁)² + (y₂−y₁)²]",
          "线段中点：M = ((x₁+x₂)/2, (y₁+y₂)/2)",
          "点到直线的距离（一般式）：d = |ax₀+by₀+c| / √(a²+b²)",
          "直线建模：将实际问题中的线性关系转化为直线方程，如成本模型、速度-时间图",
          "联立两直线求交点：代入消元，注意平行时无解"
        ],
        formulas: [
          { name: "梯度公式", expr: "m = (y₂−y₁)/(x₂−x₁)" },
          { name: "点斜式方程", expr: "y − y₁ = m(x − x₁)" },
          { name: "垂直条件", expr: "m₁ × m₂ = −1（两直线互相垂直）" },
          { name: "两点距离", expr: "d = √[(x₂−x₁)² + (y₂−y₁)²]" },
          { name: "中点公式", expr: "M = ((x₁+x₂)/2, (y₁+y₂)/2)" }
        ],
        difficulty: "Foundation",
        hardPoints: "【高频失分点】求法线时，将切线斜率直接写为法线斜率（忘记取负倒数）；水平/垂直直线的方程形式混淆；建模题中坐标系的设置方向出错。直线几何在本章是Foundation难度，但与微分结合时（求曲线上一点的切线和法线）会提升到Weight III难度。",
        youtube: [
          { title: "Straight Lines IAL P1 — TLMaths完整系列", url: "https://sites.google.com/view/tlmaths/home/a-level-maths", channel: "TLMaths" },
          { title: "P1直线几何全章 — Bicen Maths", url: "https://www.youtube.com/watch?v=K0BIV_-wye4", channel: "Bicen Maths" },
          { title: "Edexcel IAL P1 直线建模例题 — Mr Hassaan", url: "https://www.youtube.com/watch?v=KmtLzMQOClY", channel: "Mr Hassaan's Maths" }
        ]
      },
      // ── Chapter 6 ──────────────────────────────────────────────
      {
        id: "p1c6", num: 6, title: "Trigonometric Ratios 三角比",
        overview: "本章从直角三角形的基本三角比出发，拓展至正弦定理、余弦定理以及三角形面积公式，适用于任意三角形。这是P1中概念密度最高的应用章节，正弦定理的\"多解情况\"（Ambiguous Case）是每年必考的高分区分题。掌握此章节为P2三角恒等式与P1弧度制的学习奠定基础。",
        keyPoints: [
          "基本三角比（直角三角形）：sin θ = 对/斜；cos θ = 邻/斜；tan θ = 对/邻（SOHCAHTOA）",
          "特殊角精确值（必须背诵）：sin30°=1/2, cos30°=√3/2, tan30°=1/√3；sin45°=√2/2；sin60°=√3/2",
          "三角比的图像：sin和cos的范围为[−1,1]，周期为360°；tan周期为180°",
          "正弦定理：a/sinA = b/sinB = c/sinC（适用于任意三角形）",
          "正弦定理的多解情况（Ambiguous Case）：已知两边一角（SSA），可能有0、1或2个三角形",
          "余弦定理（求边）：a² = b² + c² − 2bc cosA",
          "余弦定理（求角）：cosA = (b² + c² − a²) / 2bc",
          "三角形面积：S = ½ab sinC（已知两边及其夹角）",
          "CAST法则（确定三角比的正负号）：四个象限中sin/cos/tan的正负",
          "解三角方程：在给定区间（如0° ≤ θ ≤ 360°）内找出所有解"
        ],
        formulas: [
          { name: "正弦定理", expr: "a/sin A = b/sin B = c/sin C" },
          { name: "余弦定理（求边）", expr: "a² = b² + c² − 2bc cosA" },
          { name: "余弦定理（求角）", expr: "cos A = (b²+c²−a²) / 2bc" },
          { name: "三角形面积", expr: "S = ½ ab sin C" },
          { name: "特殊角", expr: "sin30°=½, cos60°=½, tan45°=1, sin90°=1" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】正弦定理多解情况：用正弦定理求角时，arcsin只给出锐角，必须考虑钝角补角的可能性（α和180°−α都要验证）。考官报告显示超过40%的考生在多解题目中只给出一个解。另一高频错误：计算过程中保留过多中间小数导致最终答案不准确，应尽量保留精确值至最后一步。",
        youtube: [
          { title: "Trigonometry P1完整章节含多解 — Bicen Maths", url: "https://www.youtube.com/watch?v=OnZGBQyWK1g", channel: "Bicen Maths" },
          { title: "Sine & Cosine Rule精讲 — TLMaths", url: "https://www.youtube.com/watch?v=uuXm32-nyz8", channel: "TLMaths" },
          { title: "IAL P1三角比真题解析 — Mr Hassaan", url: "https://www.youtube.com/watch?v=KmtLzMQOClY", channel: "Mr Hassaan's Maths" }
        ]
      },
      // ── Chapter 7 ──────────────────────────────────────────────
      {
        id: "p1c7", num: 7, title: "Radians 弧度制",
        overview: "弧度是数学中描述角度的自然单位，是微积分中所有三角函数求导和积分的先决条件。从本章起，计算器必须永久切换至弧度（Radian）模式。弧度制的弧长与扇形面积公式是P1考试中高频出现的简洁但易错的应用题。",
        keyPoints: [
          "弧度定义：1 radian（弧度）= 弧长等于半径时圆心角的大小",
          "弧度与度的换算：π rad = 180°，故 1° = π/180 rad；1 rad ≈ 57.3°",
          "常用换算（必须背诵）：30° = π/6；45° = π/4；60° = π/3；90° = π/2；180° = π；270° = 3π/2；360° = 2π",
          "弧长公式：l = rθ（r为半径，θ为弧度制角度）",
          "扇形面积公式：A = ½r²θ",
          "弓形面积 = 扇形面积 − 三角形面积 = ½r²θ − ½r²sinθ = ½r²(θ − sinθ)",
          "周长类题目：弓形周长 = 弧长 + 两条半径 = rθ + 2r",
          "三角函数精确值（弧度）：sin(π/6)=½, cos(π/3)=½, tan(π/4)=1",
          "重要提醒：所有含三角函数的微积分运算必须使用弧度，否则导数公式不成立",
          "小角度近似（P2预习）：当θ很小时，sinθ ≈ θ, cosθ ≈ 1 − θ²/2, tanθ ≈ θ"
        ],
        formulas: [
          { name: "弧长", expr: "l = rθ （θ必须以弧度为单位）" },
          { name: "扇形面积", expr: "A = ½r²θ" },
          { name: "弓形面积", expr: "A = ½r²(θ − sinθ)" },
          { name: "度与弧度换算", expr: "弧度 = 角度 × π/180；角度 = 弧度 × 180/π" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】在使用公式 l=rθ 时θ未转换为弧度（仍用度数代入）；弓形面积公式中忘记减去三角形面积；计算器仍在度数（Degree）模式下计算三角函数值。建议：从本章起，在考试纸最顶部写\"RAD MODE ✓\"提醒自己，并在考试开始时立即检查计算器设置。",
        youtube: [
          { title: "Radians完整讲解 — Bicen Maths P1记忆清单", url: "https://www.youtube.com/watch?v=OnZGBQyWK1g", channel: "Bicen Maths" },
          { title: "Radian Measure弧长扇形 — TLMaths精讲", url: "https://www.youtube.com/watch?v=uuXm32-nyz8", channel: "TLMaths" },
          { title: "IAL P1弧度制真题 — Mr Hassaan", url: "https://www.youtube.com/watch?v=KmtLzMQOClY", channel: "Mr Hassaan's Maths" }
        ]
      },
      // ── Chapter 8 ──────────────────────────────────────────────
      {
        id: "p1c8", num: 8, title: "Differentiation 微分",
        overview: "微积分是A-Level数学的皇冠。P1微分从第一原理（First Principles）出发建立导数概念，进而掌握多项式的求导规则，应用于切线/法线方程、驻点分类与优化问题。导数的经济学意义——边际成本、边际收益——是LSE等院校极为重视的跨学科联结。本章在WMA11中通常占15-20分，是A*考生必须满分的核心模块。",
        keyPoints: [
          "导数的第一原理定义：f'(x) = lim[h→0] [f(x+h) − f(x)] / h",
          "幂函数求导（Power Rule）：d/dx(xⁿ) = nxⁿ⁻¹",
          "常数的导数为零：d/dx(c) = 0",
          "线性组合求导：d/dx[af(x) + bg(x)] = af'(x) + bg'(x)",
          "求导前必须展开或化简：如先将 (x+1)² 展开为 x²+2x+1，再逐项求导",
          "切线方程：在点(a, f(a))处，切线斜率 = f'(a)，切线方程为 y−f(a) = f'(a)(x−a)",
          "法线方程：法线斜率 = −1/f'(a)（与切线垂直）",
          "二阶导数：d²y/dx²（对f'(x)再求一次导），用于判断凹凸性",
          "驻点（Stationary Points）：令 dy/dx = 0，求解x",
          "驻点分类（二阶导数检验）：d²y/dx² > 0 → 极小值；d²y/dx² < 0 → 极大值；= 0 需进一步分析",
          "增减性：dy/dx > 0 时函数递增；dy/dx < 0 时函数递减",
          "优化问题：建立目标函数，求导令其为零，验证为极大/极小值"
        ],
        formulas: [
          { name: "幂函数求导", expr: "d/dx(xⁿ) = nxⁿ⁻¹  例：d/dx(x³) = 3x²" },
          { name: "第一原理", expr: "f'(x) = lim[h→0] (f(x+h)−f(x))/h" },
          { name: "切线方程", expr: "y−y₁ = f'(x₁)(x−x₁)，其中斜率=f'(x₁)" },
          { name: "法线方程", expr: "y−y₁ = (−1/f'(x₁))(x−x₁)" },
          { name: "二阶导数分类", expr: "f''(x)>0：极小值；f''(x)<0：极大值" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】求导前未展开括号（如直接对(2x+1)³求导而未先展开）；切线与法线斜率混淆（忘记取负倒数）；驻点x坐标求出后忘记代回求y坐标；优化题中未验证所求驻点确实是极大/极小值（而非拐点）。优化问题要求：建立方程→求导→令导数=0→解方程→验证→代入求最值，完整6步必须全部体现。",
        youtube: [
          { title: "Differentiation P1全章 — Bicen Maths考前记忆清单", url: "https://www.youtube.com/watch?v=OnZGBQyWK1g", channel: "Bicen Maths" },
          { title: "First Principles第一原理精讲 — TLMaths", url: "https://www.youtube.com/watch?v=uuXm32-nyz8", channel: "TLMaths" },
          { title: "IAL P1微分真题解析 — Mr Hassaan", url: "https://www.youtube.com/watch?v=KmtLzMQOClY", channel: "Mr Hassaan's Maths" }
        ]
      },
      // ── Chapter 9 ──────────────────────────────────────────────
      {
        id: "p1c9", num: 9, title: "Integration 积分",
        overview: "积分是微分的逆运算，P1侧重不定积分（寻找原函数）的基础技能。掌握积分常数C的重要性，以及如何利用给定点确定具体的原函数。此章节为P2的定积分（面积计算）、微分方程初步奠定基础。在WMA11中积分通常以填空或综合大题形式出现，占约10-15分。",
        keyPoints: [
          "积分的定义：d/dx[F(x)] = f(x) 则 ∫f(x)dx = F(x) + C",
          "积分常数C：不定积分的结果不唯一，必须包含 +C（缺少C是最常见的失分点）",
          "幂函数积分（Power Rule for Integration）：∫xⁿ dx = xⁿ⁺¹/(n+1) + C（n ≠ −1）",
          "线性组合积分：∫[af(x)+bg(x)]dx = a∫f(x)dx + b∫g(x)dx",
          "积分前必须展开：如 ∫(x+2)² dx，先展开为 ∫(x²+4x+4) dx，再逐项积分",
          "积分前要化简分式：如 ∫(x³+2x)/x dx = ∫(x²+2) dx（先除再积分）",
          "利用给定点求C：将已知点(x₀, y₀)代入积分结果，解出C的值",
          "积分的验证方法：对积分结果求导，应还原为被积函数",
          "不定积分常见形式：∫k dx = kx + C；∫x dx = x²/2 + C；∫x² dx = x³/3 + C",
          "负指数的积分：∫x⁻² dx = ∫(1/x²)dx = −x⁻¹ + C = −1/x + C（注意符号！）",
          "分数指数的积分：∫x^(1/2) dx = x^(3/2)/(3/2) + C = (2/3)x^(3/2) + C"
        ],
        formulas: [
          { name: "幂函数积分", expr: "∫xⁿ dx = xⁿ⁺¹/(n+1) + C  （n ≠ −1）" },
          { name: "常数积分", expr: "∫k dx = kx + C" },
          { name: "负指数积分", expr: "∫x⁻ⁿ dx = x⁻ⁿ⁺¹/(−n+1) + C  例：∫x⁻² dx = −x⁻¹ + C" },
          { name: "分数指数积分", expr: "∫x^(1/2) dx = (2/3)x^(3/2) + C" },
          { name: "验证方法", expr: "对积分结果求导 → 应还原为原被积函数" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】遗漏积分常数 +C（考官报告中出现频率极高）；积分前未展开或化简，直接对乘积/商式积分；幂次计算错误，如 ∫x² dx 写成 x³ 而非 x³/3；分数指数的积分结果化简出错（除以分数时记得乘以倒数）。记忆口诀：「指数加一，除以新指数，别忘加C」。",
        youtube: [
          { title: "Integration P1完整讲解 — Bicen Maths", url: "https://www.youtube.com/watch?v=3kSgGBHMdjo", channel: "TLMaths (Bicen Maths引用)" },
          { title: "P1 Integration from scratch — TLMaths", url: "https://www.youtube.com/watch?v=uuXm32-nyz8", channel: "TLMaths" },
          { title: "IAL P1 Jan 2024积分真题解析 — Mr Hassaan", url: "https://www.youtube.com/watch?v=KmtLzMQOClY", channel: "Mr Hassaan's Maths" }
        ]
      }
    ]
  },
  P2: {
    title: "Pure Mathematics 2",
    color: "#003087",
    icon: "∑",
    chapters: [
      // ── P2 Chapter 1 ───────────────────────────────────────────
      {
        id: "p2c1", num: 1, title: "Algebraic Methods 代数方法",
        overview: "P2以严格的代数工具开篇：多项式长除法、因式定理、余数定理，以及覆盖演绎法、反证法和穷举法的数学证明体系。这是P2考试中\"Show that\"和\"Prove\"题型的核心章节，占WMA12约10–14分，是体现\"学术敏锐度\"的关键战场。逻辑证明的严密性也是LSE等顶尖院校招生官判断学术潜力的重要维度。",
        keyPoints: [
          "多项式长除法（Polynomial Long Division）：将 f(x) ÷ (ax+b) 得到商式和余式",
          "表达式结构：f(x) = (divisor) × Q(x) + R，其中R为余数（次数低于除数）",
          "因式定理（Factor Theorem）：若 f(a) = 0，则 (x−a) 是 f(x) 的因式；反之亦然",
          "余数定理（Remainder Theorem）：f(x) ÷ (ax−b) 的余数 = f(b/a)",
          "利用因式定理寻根：先猜测有理根（±因子of常数项/因子of首项系数），代入验证",
          "完全分解：找到一个线性因式后，用长除法化简余式，再继续因式分解",
          "数学证明—演绎法（Deductive Proof）：从已知命题出发，逐步逻辑推导结论",
          "数学证明—反证法（Proof by Contradiction）：假设命题为假，推出矛盾，故原命题为真",
          "数学证明—穷举法（Proof by Exhaustion）：逐一验证所有可能情形（适用于有限情形）",
          "反例法（Disproof by Counter-example）：一个反例即可推翻全称命题",
          "必要条件与充分条件：⟹ 与 ⟺ 的区别及在证明中的正确使用"
        ],
        formulas: [
          { name: "带余除法", expr: "f(x) = (ax+b)·Q(x) + R，R = f(−b/a)" },
          { name: "因式定理", expr: "f(a)=0 ⟺ (x−a) 是 f(x) 的因式" },
          { name: "余数定理", expr: "f(x)÷(ax−b) 的余数 = f(b/a)" },
          { name: "偶数定义", expr: "n为偶数 ⟺ n=2k，k∈ℤ" },
          { name: "奇数定义", expr: "n为奇数 ⟺ n=2k+1，k∈ℤ" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】长除法符号错误（尤其是减法步骤）；余数定理代入时b/a的符号弄错（例如 ÷(2x+3) 代入 x=−3/2 而非 3/2）；证明题中跳步，未逐行展示逻辑链；用反例推翻命题后未明确说明\"此反例满足条件但结论不成立，故命题为假\"。考官报告强调：证明题丢分往往不是因为方法错误，而是表述不严谨。",
        examTips: "WMA12中证明题（\"Prove that...\" / \"Show that...\"）约占8–10分，必须展示完整逻辑步骤。长除法题目通常配合后续积分或部分分数使用，要检查余数是否正确。强烈建议用因式定理先验证，再用长除法，可互相核对。",
        youtube: [
          { title: "P2 Ch1 Algebraic Methods — Bicen Maths完整讲解", url: "https://www.youtube.com/watch?v=GYpBb5V2Lu0", channel: "Bicen Maths" },
          { title: "Factor Theorem & Long Division — TLMaths精讲", url: "https://www.youtube.com/watch?v=19OEs6-350c", channel: "TLMaths" },
          { title: "IAL P2 Jan 2024 Proof反例与穷举 — Mr Hassaan", url: "https://m.youtube.com/watch?v=oVLv0-fBIco", channel: "Mr Hassaan's Maths" }
        ]
      },
      // ── P2 Chapter 2 ───────────────────────────────────────────
      {
        id: "p2c2", num: 2, title: "Coordinate Geometry: Circles 坐标几何：圆",
        overview: "P2将坐标几何从直线延伸至圆，建立圆的标准方程和一般方程，研究直线与圆的位置关系（相交、相切、相离），以及切线与法线的构造。本章是P1直线几何、二次方程判别式、配方法等技能的高阶综合应用，通常以5–9分大题形式出现，考查能力层次高。",
        keyPoints: [
          "圆的标准方程（圆心-半径式）：(x − a)² + (y − b)² = r²，圆心(a, b)，半径r",
          "圆的一般方程：x² + y² + 2fx + 2gy + c = 0，圆心(−f, −g)，半径 = √(f²+g²−c)",
          "由一般式转化为标准式：对x和y分别配方（Completing the Square）",
          "验证点的位置：代入圆方程，结果 < r²（点在圆内）、= r²（圆上）、> r²（圆外）",
          "直线与圆的关系：将直线方程代入圆方程，得二次方程，用判别式Δ判断",
          "Δ > 0：直线与圆相交（两个交点）；Δ = 0：直线与圆相切；Δ < 0：直线与圆相离",
          "切线的性质：圆的切线与过切点的半径垂直（m_tangent × m_radius = −1）",
          "从圆外一点作切线：设切线方程，利用切线条件 Δ = 0 求切线方程",
          "弦的中点：连接圆心与弦中点的线段垂直于弦（垂径定理）",
          "两圆的位置关系：通过比较圆心距d与两半径之和/差来判断",
          "圆过三点的方程：将三点代入一般方程，联立求解f, g, c"
        ],
        formulas: [
          { name: "标准方程", expr: "(x−a)²+(y−b)²=r²，圆心(a,b)，半径r" },
          { name: "一般方程", expr: "x²+y²+2fx+2gy+c=0，圆心(−f,−g)，r=√(f²+g²−c)" },
          { name: "切线条件（判别式）", expr: "直线代入圆方程后 Δ=0 ⟺ 相切" },
          { name: "切线与半径垂直", expr: "m_切线 × m_半径 = −1" },
          { name: "垂径定理", expr: "圆心到弦中点的连线 ⊥ 弦" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】将一般方程转化为标准式时配方出错（尤其系数不为1时先未提取系数）；切线题中将切线斜率与半径斜率相乘后未等于−1，方向判断失误；联立直线与圆方程展开时代数错误导致Δ计算出错。注意：本章圆与P2下文的三角、积分可以综合考查，例如\"求圆与曲线围成的面积\"。",
        examTips: "圆的题目在WMA12中通常为5–8分的结构型大题，分步骤给分。建议每步完成后用坐标代入验证圆心和半径。切线题型必须体现\"切线 ⊥ 半径\"的思路，否则即使答案对也可能失去过程分。",
        youtube: [
          { title: "P2 Coordinate Geometry Circles — Bicen Maths", url: "https://www.youtube.com/watch?v=ehe8pObhyDk", channel: "Bicen Maths" },
          { title: "Circle Equations & Tangents — TLMaths精讲", url: "https://www.youtube.com/watch?v=19OEs6-350c", channel: "TLMaths" },
          { title: "IAL P2 Circles真题 — Mr Hassaan", url: "https://www.youtube.com/watch?v=yTPWxMpZOc4", channel: "Mr Hassaan's Maths" }
        ]
      },
      // ── P2 Chapter 3 ───────────────────────────────────────────
      {
        id: "p2c3", num: 3, title: "Exponentials & Logarithms 指数与对数",
        overview: "对数是P2难度最高的章节之一（权重III），涵盖对数的三大定律、换底公式、指数方程求解，以及最具挑战性的「数据线性化（Reduction to Linear Form）」技术。后者将形如 y = axⁿ 或 y = abˣ 的非线性模型转化为直线形式，与S1的线性回归深度联结。在WMA12中此章通常占10–14分。",
        keyPoints: [
          "对数定义：logₐb = c ⟺ aᶜ = b（a > 0, a ≠ 1, b > 0）",
          "对数定律1（乘法）：logₐ(MN) = logₐM + logₐN",
          "对数定律2（除法）：logₐ(M/N) = logₐM − logₐN",
          "对数定律3（幂次）：logₐ(Mⁿ) = n·logₐM",
          "换底公式：logₐb = logₓb / logₓa（通常用ln或log₁₀）",
          "自然对数：ln x = logₑx，其中 e ≈ 2.718；ln(eˣ) = x；e^(lnx) = x",
          "指数方程求解：两边取对数，如 aˣ = b → x = logb/loga = lnb/lna",
          "「隐藏的二次方程」：如 e^(2x) − 5eˣ + 6 = 0，令 u = eˣ 化为 u²−5u+6=0",
          "指数建模：y = Aeᵏˣ，取ln得 lny = kx + lnA（变为直线形式）",
          "线性化类型1：y = axⁿ → lg y = n·lg x + lg a（绘制 lgy 对 lgx 图像，斜率=n，截距=lga）",
          "线性化类型2：y = abˣ → ln y = x·ln b + ln a（绘制 lny 对 x 图像，斜率=lnb，截距=lna）",
          "图像特征：y = eˣ 过点(0,1)，渐近线为x轴；y = lnx 过点(1,0)，渐近线为y轴"
        ],
        formulas: [
          { name: "对数定律（乘）", expr: "log(MN) = logM + logN" },
          { name: "对数定律（幂）", expr: "log(Mⁿ) = n·logM" },
          { name: "换底公式", expr: "logₐb = lnb / lna" },
          { name: "指数求解", expr: "aˣ = b → x = lnb/lna" },
          { name: "线性化 y=axⁿ", expr: "lgy = n·lgx + lga（lg=log₁₀）" },
          { name: "线性化 y=abˣ", expr: "lny = x·lnb + lna" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】对数律使用方向反了（将log(M+N)误写为logM·logN等非法运算）；线性化时斜率与截距对应的参数弄错；隐藏二次方程中忘记验证解的有效性（如u=eˣ必须>0，负数解需舍去）；换底公式分子分母颠倒。本章是P2挂科率第二高的章节，建议在完成P1后立即攻克。",
        examTips: "线性化（Reduction to Linear Form）几乎每年必考，必须能：① 取对数变形；② 说明纵轴/横轴的表达式；③ 从斜率和截距求参数a, b/k。在考试时需列出明确的\"Y = mX + c\"形式的方程，并标注X和Y分别代表什么。",
        youtube: [
          { title: "P2 Exponentials & Logs完整章节 — Bicen Maths", url: "https://www.youtube.com/watch?v=ehe8pObhyDk", channel: "Bicen Maths" },
          { title: "Logs & Reduction to Linear Form — TLMaths", url: "https://www.youtube.com/watch?v=19OEs6-350c", channel: "TLMaths" },
          { title: "IAL P2对数真题解析 — Mr Hassaan", url: "https://www.youtube.com/watch?v=8PJxYK88y8I", channel: "Mr Hassaan's Maths" }
        ]
      },
      // ── P2 Chapter 4 ───────────────────────────────────────────
      {
        id: "p2c4", num: 4, title: "Binomial Expansion 二项式展开",
        overview: "二项式展开将(a+b)ⁿ展开为多项式之和，P2聚焦于n为正整数的完整展开及特定项系数的快速求解。组合数C(n,r)的计算是核心技能。本章通常以3–6分的简洁题目出现，但组合数计算错误或展开式漏项会导致全题失分。",
        keyPoints: [
          "二项式定理：(a+b)ⁿ = Σ C(n,r)·aⁿ⁻ʳ·bʳ（r从0到n）",
          "组合数（二项式系数）：C(n,r) = n! / [r!(n−r)!]，也记作 ⁿCᵣ 或 (n r)",
          "帕斯卡三角：C(n,r)= C(n−1,r−1)+C(n−1,r)，可用于小n值快速展开",
          "(1+x)ⁿ的展开：1 + nx + n(n−1)/2!·x² + n(n−1)(n−2)/3!·x³ + …",
          "通项公式：第(r+1)项 = C(n,r)·aⁿ⁻ʳ·bʳ（r从0开始计数）",
          "求特定项系数：先确定该项中变量的指数，令指数等于目标值，解出r",
          "含两个变量的展开：如(2+3x)⁴，令a=2，b=3x，用通项公式",
          "近似计算：当x很小时，(1+x)ⁿ ≈ 1 + nx + n(n−1)x²/2（取前几项）",
          "组合数对称性：C(n,r) = C(n,n−r)，可用于简化计算",
          "展开式的总项数：(a+b)ⁿ共有 n+1 项"
        ],
        formulas: [
          { name: "二项式定理", expr: "(a+b)ⁿ = Σᵣ₌₀ⁿ C(n,r)·aⁿ⁻ʳ·bʳ" },
          { name: "组合数", expr: "C(n,r) = n!/[r!(n−r)!]  例：C(5,2)=10" },
          { name: "第(r+1)项（通项）", expr: "T_{r+1} = C(n,r)·aⁿ⁻ʳ·bʳ" },
          { name: "(1+x)ⁿ展开", expr: "1 + nx + n(n−1)x²/2! + n(n−1)(n−2)x³/3! + …" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】求特定项时r的起始值混淆（r从0还是从1）；含负数或分数项时符号错误（如(1−2x)⁵中b=−2x，代入时负号处理不当）；组合数C(n,r)计算错误（尤其n较大时）；展开式写出的项数不够或多余。建议：写通项前先明确a, b, n的值，然后再代入。",
        examTips: "P2二项式展开题目分值通常为3–6分，多为\"求第k项系数\"或\"求x²的系数\"，时间有限时要直接用通项公式，不要逐项展开。Casio ClassWiz计算器的组合数功能（nCr）可用于快速验证系数。",
        youtube: [
          { title: "P2 Binomial Expansion完整讲解 — Bicen Maths", url: "https://www.youtube.com/watch?v=JpV6BlNosAU", channel: "Bicen Maths引用" },
          { title: "Binomial Theorem通项公式 — TLMaths", url: "https://www.youtube.com/watch?v=19OEs6-350c", channel: "TLMaths" },
          { title: "IAL P2 June 2024 Q1 二项式 — Mr Hassaan", url: "https://www.youtube.com/watch?v=8PJxYK88y8I", channel: "Mr Hassaan's Maths" }
        ]
      },
      // ── P2 Chapter 5 ───────────────────────────────────────────
      {
        id: "p2c5", num: 5, title: "Sequences & Series 数列与级数",
        overview: "本章涵盖等差数列（AP）和等比数列（GP）的通项与求和公式，以及无穷等比级数的收敛条件。Σ符号、递推数列（Recurrence Relations）和收敛性分析是P2中概念密度较高的部分（权重III）。经济增长模型、贷款还款等实际应用场景使本章与LSE经济学方向高度相关，通常占WMA12的10–14分。",
        keyPoints: [
          "等差数列（Arithmetic Sequence）：公差d恒定，uₙ = a + (n−1)d",
          "等差数列求和：Sₙ = n/2·(2a + (n−1)d) = n/2·(a + l)，其中l为末项",
          "等比数列（Geometric Sequence）：公比r恒定，uₙ = arⁿ⁻¹",
          "等比数列求和：Sₙ = a(1−rⁿ)/(1−r)（r≠1）；若r=1则Sₙ = na",
          "无穷等比级数的收敛条件：|r| < 1 时，S∞ = a/(1−r)",
          "收敛的经济意义：利率复利模型、有限年金现值等均使用S∞公式",
          "Σ（Sigma）符号：Σᵢ₌₁ⁿ f(i) 表示从i=1到n对f(i)求和",
          "递推数列（Recurrence Relations）：uₙ₊₁ = f(uₙ)，给定首项u₁确定整个数列",
          "周期性数列：某些递推数列会出现循环，需识别周期并用于求和",
          "等差与等比数列的辨别：相邻项之差恒定→等差；相邻项之比恒定→等比",
          "含有参数的数列：已知Sₙ求uₙ（利用 uₙ = Sₙ − Sₙ₋₁，n≥2）"
        ],
        formulas: [
          { name: "等差第n项", expr: "uₙ = a + (n−1)d" },
          { name: "等差求和", expr: "Sₙ = n/2·(2a+(n−1)d) = n/2·(首项+末项)" },
          { name: "等比第n项", expr: "uₙ = a·rⁿ⁻¹" },
          { name: "等比求和", expr: "Sₙ = a(1−rⁿ)/(1−r)，r≠1" },
          { name: "无穷等比级数", expr: "S∞ = a/(1−r)，条件：|r|<1" },
          { name: "由Sₙ求uₙ", expr: "uₙ = Sₙ − Sₙ₋₁（n≥2），u₁ = S₁" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】混淆等差与等比的求和公式；无穷级数题中未验证|r|<1的收敛条件（若|r|≥1则级数不收敛，不能用S∞公式）；递推数列求第n项时计算迭代错误；由Sₙ求uₙ时对n=1的情形单独处理（不能用 u₁ = S₁−S₀）。等比数列中r可以为负数（交错数列），要特别注意奇偶项符号。",
        examTips: "数列题在WMA12中通常为5–8分的结构题，分部分给分。收敛性判断（|r|<1）必须在使用S∞前明确写出，否则丢\"方法分\"。建议先用通项公式快速验证a和d/r的计算是否正确，再进行求和。",
        youtube: [
          { title: "P2 Sequences & Series完整章节 — Bicen Maths", url: "https://www.youtube.com/watch?v=aGz2V-uXn90", channel: "Bicen Maths引用" },
          { title: "Arithmetic & Geometric Series — TLMaths", url: "https://www.youtube.com/watch?v=19OEs6-350c", channel: "TLMaths" },
          { title: "IAL P2数列真题分类 — Mr Hassaan", url: "https://www.youtube.com/watch?v=8PJxYK88y8I", channel: "Mr Hassaan's Maths" }
        ]
      },
      // ── P2 Chapter 6 ───────────────────────────────────────────
      {
        id: "p2c6", num: 6, title: "Trigonometric Identities 三角恒等式",
        overview: "这是P2的分水岭——三角恒等式章节要求学生掌握毕达哥拉斯恒等式及其衍生形式，并在给定区间内求解包含多个三角函数的复杂方程。考官报告明确指出此章节是WMA12挂科率最高的章节。CAST法则的灵活运用和弧度制的熟练程度在此章节得到全面检验。建议分配最长复习时间（权重III，7天）。",
        keyPoints: [
          "毕达哥拉斯恒等式（基础）：sin²θ + cos²θ = 1（最重要的三角恒等式）",
          "衍生形式1：1 + tan²θ = sec²θ（两边除以cos²θ得到）",
          "衍生形式2：1 + cot²θ = csc²θ（两边除以sin²θ得到）",
          "商恒等式：tanθ = sinθ/cosθ；cotθ = cosθ/sinθ",
          "倒数关系：secθ = 1/cosθ；cscθ = 1/sinθ；cotθ = 1/tanθ",
          "利用恒等式化简/证明：用已知恒等式替换，使方程只含一种三角函数",
          "解三角方程的步骤：① 用恒等式化为单一函数 ② 解基本方程 ③ 用CAST/图像法找全部解",
          "CAST法则：第1象限全正；第2象限sin正；第3象限tan正；第4象限cos正",
          "周期扩展：sinθ的周期为2π（360°）；tanθ的周期为π（180°）",
          "在给定区间内找所有解：如0≤θ≤2π，需系统列出所有满足条件的θ值",
          "方程变换：如 sin(2θ+π/6) = 0.5 需先扩大区间范围再求解"
        ],
        formulas: [
          { name: "核心恒等式", expr: "sin²θ + cos²θ = 1" },
          { name: "衍生（÷cos²）", expr: "1 + tan²θ = sec²θ" },
          { name: "衍生（÷sin²）", expr: "1 + cot²θ = csc²θ" },
          { name: "商恒等式", expr: "tanθ = sinθ/cosθ" },
          { name: "倒数恒等式", expr: "secθ=1/cosθ, cscθ=1/sinθ, cotθ=1/tanθ" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】将 sin²θ 误写成 (sinθ)² 导致化简出错；在给定区间内遗漏解（最常见：sinθ=k在2π区间内有两个解）；解含 tan²θ 的方程时忘记tan可正可负；将恒等式证明题中左边和右边相互操作（只能从一边出发推导至另一边，不能两边同时变形）。考官报告：超过50%的学生在三角方程中只给出部分解，失去大量分数。",
        examTips: "三角方程解题口诀：「化简→代换→解基本方程→CAST找角→验证区间」，每步必须写出。在区间 [0, 2π] 内求解时建议画出对应三角函数的图像，直观标出所有交点位置，再精确计算。此章练习量要求最多：至少做50道以上的区间三角方程题。",
        youtube: [
          { title: "P2三角恒等式完整章节 — Bicen Maths", url: "https://www.youtube.com/watch?v=_cxcCVjjAhQ", channel: "Bicen Maths引用" },
          { title: "Trig Identities & Equations — TLMaths精讲", url: "https://www.youtube.com/watch?v=19OEs6-350c", channel: "TLMaths" },
          { title: "IAL P2 June 2024(R) Q5三角模型 — Mr Hassaan", url: "https://www.youtube.com/watch?v=_cxcCVjjAhQ", channel: "Mr Hassaan's Maths" }
        ]
      },
      // ── P2 Chapter 7 ───────────────────────────────────────────
      {
        id: "p2c7", num: 7, title: "Differentiation 进阶微分",
        overview: "P2微分在P1基础上引入驻点（Stationary Points）的完整分类方法、函数单调性分析以及实际优化问题（Optimisation）。这是将数学工具应用于现实决策的核心章节——利润最大化、成本最小化、面积/体积优化都在此处建模求解。考官报告显示优化题是高分区分题，通常为5–9分的综合大题。",
        keyPoints: [
          "驻点定义：令 dy/dx = 0 的点即为驻点，包括极大值点、极小值点和拐点",
          "二阶导数检验（分类驻点）：d²y/dx² > 0 → 极小值；d²y/dx² < 0 → 极大值",
          "当d²y/dx² = 0：无法确定，需改用一阶导数符号变化法（Sign Change Method）",
          "一阶导数符号变化：在驻点两侧检查dy/dx的符号，+→−为极大，−→+为极小，不变为拐点",
          "函数的增减性：dy/dx > 0 → 函数递增；dy/dx < 0 → 函数递减",
          "最大/最小值（全局）：可能在驻点或端点取到，需逐一比较",
          "优化问题的建模步骤：① 设变量 ② 建立目标函数 ③ 利用约束条件化为单变量函数 ④ 求导 ⑤ 令导数=0 ⑥ 验证（极大/极小）⑦ 求最值",
          "常见约束条件：周长固定求最大面积；表面积固定求最大体积；总成本约束下利润最大化",
          "连接函数与变化率：如 dA/dt = dA/dx × dx/dt（链式规则的应用）",
          "切线方程与法线方程：找驻点处的切线（水平线）和周围点的切/法线",
          "凹凸性（Concavity）：d²y/dx² > 0 → 函数图像向上凹（下凸）；< 0 → 向下凹（上凸）"
        ],
        formulas: [
          { name: "驻点条件", expr: "dy/dx = 0（令一阶导数为零）" },
          { name: "极小值（二阶检验）", expr: "d²y/dx² > 0 → 极小值点" },
          { name: "极大值（二阶检验）", expr: "d²y/dx² < 0 → 极大值点" },
          { name: "变化率链式法则", expr: "dy/dt = dy/dx · dx/dt" },
          { name: "增减性判断", expr: "dy/dx>0→递增；dy/dx<0→递减" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】优化题中建立目标函数时约束条件代入出错（代数错误）；d²y/dx²=0时不进行进一步分析，直接错误结论；优化题求出驻点后未说明是极大还是极小（必须给出理由）；实际问题中忘记检验解的实际意义（如长度必须为正数）。",
        examTips: "优化大题（5–9分）必须包含完整步骤：设变量→建函数→求导→令=0→验证→求值。任何一步缺失都可能丢1–2分。在考试中，若d²y/dx²计算困难，可改用\"取驻点两侧各一点代入dy/dx观察符号变化\"，同样有效。",
        youtube: [
          { title: "P2 Differentiation驻点与优化 — Bicen Maths", url: "https://www.youtube.com/watch?v=WkxuDdsBFr4", channel: "Bicen Maths引用" },
          { title: "Stationary Points & Optimisation — TLMaths", url: "https://www.youtube.com/watch?v=19OEs6-350c", channel: "TLMaths" },
          { title: "IAL P2微分真题解析 — Mr Hassaan", url: "https://www.youtube.com/watch?v=8PJxYK88y8I", channel: "Mr Hassaan's Maths" }
        ]
      },
      // ── P2 Chapter 8 ───────────────────────────────────────────
      {
        id: "p2c8", num: 8, title: "Integration 进阶积分",
        overview: "P2积分从P1的不定积分升级为定积分的面积计算（包括曲线与坐标轴或两条曲线之间的面积），以及数值积分的梯形法则（Trapezium Rule）。面积在x轴下方时取负值的处理是高频失分点。本章通常占WMA12的10–14分，是重量级大题集中的章节，掌握程度直接决定P2成绩档次。",
        keyPoints: [
          "定积分（Definite Integral）：∫ₐᵇ f(x)dx = [F(x)]ₐᵇ = F(b) − F(a)，其中F(x)为f(x)的原函数",
          "定积分的几何意义：曲线y=f(x)与x轴之间（a≤x≤b范围内）的代数面积",
          "面积为正：当f(x) ≥ 0 时，∫ₐᵇ f(x)dx 即为面积",
          "面积为负：当f(x) ≤ 0 时，∫ₐᵇ f(x)dx 为负值，实际面积 = |∫ₐᵇ f(x)dx|",
          "跨越x轴的面积：需分段积分（在x轴上下分别积分再取绝对值之和）",
          "两曲线之间的面积：∫ₐᵇ [f(x) − g(x)] dx，其中f(x) ≥ g(x)在[a,b]上成立",
          "求交点以确定积分上下限：联立曲线方程求解x值",
          "梯形法则（Trapezium Rule）：∫ₐᵇ f(x)dx ≈ ½h[y₀ + 2(y₁+y₂+…+yₙ₋₁) + yₙ]，h=(b−a)/n",
          "梯形法则的精度：n越大（梯形越多），近似越准确",
          "梯形法则的高/低估：若曲线向上凸（d²y/dx²<0），梯形法则高估；反之低估",
          "积分的基本公式：∫xⁿdx = xⁿ⁺¹/(n+1)+C；∫1/x dx = ln|x|+C；∫eˣdx = eˣ+C",
          "积分前须化简：确保被积函数是标准幂函数形式，如展开乘积或化简分式"
        ],
        formulas: [
          { name: "定积分", expr: "∫ₐᵇ f(x)dx = F(b)−F(a)，F'(x)=f(x)" },
          { name: "面积（正区域）", expr: "A = ∫ₐᵇ f(x)dx，当f(x)≥0" },
          { name: "两曲线面积", expr: "A = ∫ₐᵇ [f(x)−g(x)]dx，f(x)≥g(x)" },
          { name: "梯形法则", expr: "≈ ½h[y₀+2(y₁+…+yₙ₋₁)+yₙ]，h=(b−a)/n" },
          { name: "∫1/x", expr: "∫1/x dx = ln|x| + C（注意绝对值）" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】面积题中忽略曲线位于x轴以下的部分（直接用总积分当面积，导致正负相消）；梯形法则中y值个数错误（n个梯形需要n+1个y值，即y₀到yₙ，首尾各一个，中间各算两次）；两曲线面积题中上下函数位置判断错误（应先画图确认谁在上方）；∫1/x漏掉绝对值符号。",
        examTips: "面积大题（6–9分）必须：① 画草图标明区域 ② 正确设置积分上下限 ③ 对x轴上下分段处理 ④ 最终给出正数面积。梯形法则题通常要求说明估计是高估还是低估，必须给出理由（联系曲线凹凸性）。计算器可用于验证定积分数值，但必须展示积分计算过程。",
        youtube: [
          { title: "P2 Integration定积分与面积完整讲解 — Bicen Maths", url: "https://www.youtube.com/watch?v=uR-4D966gcE", channel: "Bicen Maths引用" },
          { title: "Area Under Curves & Trapezium Rule — TLMaths", url: "https://www.youtube.com/watch?v=19OEs6-350c", channel: "TLMaths" },
          { title: "IAL P2积分真题全解 — Mr Hassaan", url: "https://www.youtube.com/watch?v=8PJxYK88y8I", channel: "Mr Hassaan's Maths" }
        ]
      }
    ]
  },
  S1: {
    title: "Statistics 1",
    color: "#8B1A1A",
    icon: "σ",
    chapters: [
      // ── S1 Chapter 1 ───────────────────────────────────────────
      {
        id: "s1c1", num: 1, title: "Mathematical Modelling 数学建模导论",
        overview: "S1以数学建模的哲学与方法论开篇，帮助学生理解统计模型的生命周期：观察现象→建立假设→构建模型→收集数据→验证模型→修正或接受。这一章节概念性强但计算量少，通常以2–4分的简答题形式出现，考查学生对「模型的优点与局限性」的理解。这也是LSE等院校极为重视的批判性思维能力的体现。",
        keyPoints: [
          "数学模型的定义：对现实世界某个方面的数学简化与描述，用于预测和分析",
          "建模的生命周期六步骤：① 观察现象 ② 提出假设/简化 ③ 建立数学模型 ④ 收集数据验证 ⑤ 与现实比较评估 ⑥ 修正模型（必要时回到步骤①）",
          "模型的优点：可以用数学工具分析复杂系统；可进行预测；成本低于真实实验",
          "模型的局限性：基于假设（假设不成立则模型失效）；简化过程中丢失细节；外推（Extrapolation）时可能失准",
          "内插（Interpolation）：在数据范围内的预测，通常较可靠",
          "外推（Extrapolation）：超出数据范围的预测，风险较高，需谨慎",
          "统计建模的常见假设：数据来自随机样本；变量之间存在线性关系；误差项正态分布",
          "描述性统计与推断统计：描述统计总结已有数据；推断统计用样本推断总体",
          "大数据与样本：总体（Population）全部个体；样本（Sample）总体的子集",
          "随机性的重要性：随机样本减少偏差，提高模型的代表性"
        ],
        formulas: [
          { name: "建模循环", expr: "观察→假设→建模→数据→验证→修正（循环迭代）" },
          { name: "内插vs外推", expr: "内插：a≤x≤b（数据范围内）；外推：x<a或x>b" }
        ],
        difficulty: "Foundation",
        hardPoints: "【考试注意】此章节题目通常要求学生用文字解释模型的优/缺点，不是计算题。评分标准要求具体，泛泛而谈（如\"模型不够准确\"）得不到分，必须说明\"模型假设了线性关系，但实际数据可能非线性\"等具体理由。",
        examTips: "本章在WST01中占约2–4分，通常为最后大题的(a)小部分。核心词汇：\"assumptions\"（假设）、\"limitations\"（局限）、\"refine the model\"（修正模型）、\"extrapolation is unreliable\"（外推不可靠）。备考时总结3–4个标准答案模板即可。",
        youtube: [
          { title: "S1 Mathematical Modelling导论 — ExamSolutions", url: "https://www.youtube.com/results?search_query=S1+statistics+mathematical+modelling+edexcel+IAL", channel: "ExamSolutions" },
          { title: "Statistics 1 Chapter 1建模 — TLMaths", url: "https://www.youtube.com/results?search_query=edexcel+IAL+S1+statistics+chapter+1", channel: "TLMaths" }
        ]
      },
      // ── S1 Chapter 2 ───────────────────────────────────────────
      {
        id: "s1c2", num: 2, title: "Measures of Location & Spread 位置与离散度量",
        overview: "描述性统计的核心：均值、中位数、众数等位置度量，以及方差、标准差、极差、四分位距等离散度量。本章最重要的技术是「数据编码（Coding）」，它将计算复杂度降低，同时考查学生对统计量在线性变换下行为的理解。考官报告反复强调：编码对方差/标准差影响的理解是高频失分点。",
        keyPoints: [
          "位置度量（Measures of Location）：均值（Mean）、中位数（Median）、众数（Mode）",
          "均值计算：x̄ = Σx/n（原始数据）；x̄ = Σfx/Σf（频率分布表）",
          "中位数：将数据从小到大排列，取第(n+1)/2个值（奇数n）；取第n/2和n/2+1个均值（偶数n）",
          "分组数据的中位数：利用线性插值法（Linear Interpolation）在累积频率中查找",
          "众数：出现次数最多的值；分组数据中为频率最高的组的组中值",
          "离散度量（Measures of Spread）：极差（Range）= 最大值−最小值；IQR = Q3−Q1",
          "方差（Variance）：σ² = Σ(x−x̄)²/n = Σx²/n − x̄²（计算公式更高效）",
          "标准差（Standard Deviation）：σ = √(σ²)，与原数据单位相同",
          "样本方差：s² = Σ(x−x̄)²/(n−1)（用于推断统计时使用n−1）",
          "编码（Coding）：令 y = (x−a)/b，则 ȳ = (x̄−a)/b；σᵧ = σₓ/|b|",
          "编码的关键规律：平移量a不影响标准差；伸缩系数b同比例影响标准差",
          "编码的实际用途：将大数值或小数值转化为便于计算的范围，简化运算",
          "分组数据的方差：σ² = Σf(x−x̄)²/Σf = Σfx²/Σf − (Σfx/Σf)²"
        ],
        formulas: [
          { name: "均值（分组）", expr: "x̄ = Σfx / Σf" },
          { name: "方差（计算公式）", expr: "σ² = Σx²/n − (Σx/n)² = Σx²/n − x̄²" },
          { name: "标准差", expr: "σ = √(σ²) = √(Σx²/n − x̄²)" },
          { name: "编码均值", expr: "若y=(x−a)/b，则x̄ = bȳ + a" },
          { name: "编码标准差", expr: "若y=(x−a)/b，则σₓ = |b|·σᵧ" },
          { name: "IQR", expr: "IQR = Q3 − Q1" }
        ],
        difficulty: "Foundation",
        hardPoints: "【高频失分点】编码题中，学生常对方差与标准差混淆：编码 y=(x−a)/b 后，Var(y)=Var(x)/b²，σᵧ=σₓ/|b|——平移量a对两者均无影响。另一常见错误：在分组数据中使用了组中值的近似均值后再计算方差，但未使用同一套x值，导致前后不一致。建议统一使用计算公式 Σx²/n − x̄²，避免用定义式Σ(x−x̄)²/n逐项计算。",
        examTips: "此章在WST01中通常占6–10分。编码题一定要写出 y=(x−a)/b 的表达式，然后分别处理均值和标准差。计算器的统计功能（Menu 6）可快速验证均值和标准差，但考试中必须展示计算过程。",
        youtube: [
          { title: "S1 Measures of Location & Spread — ExamSolutions完整讲解", url: "https://www.youtube.com/results?search_query=S1+measures+location+spread+coding+edexcel+IAL", channel: "ExamSolutions" },
          { title: "Mean Variance Coding — TLMaths精讲", url: "https://www.youtube.com/results?search_query=statistics+S1+mean+variance+coding+A+level", channel: "TLMaths" }
        ]
      },
      // ── S1 Chapter 3 ───────────────────────────────────────────
      {
        id: "s1c3", num: 3, title: "Representations of Data 数据表达",
        overview: "以直方图、茎叶图、箱线图和累积频率曲线等图形化工具呈现和解读数据分布特征，判断偏斜性（Skewness）和识别离群值（Outliers）。本章是WST01中图形最密集的章节，要求学生不仅会绘图，还要能准确解读图形信息、计算关键统计量，并从图形角度比较数据集。通常占8–12分。",
        keyPoints: [
          "直方图（Histogram）：纵轴为频率密度（Frequency Density）= 频率÷组距，面积=频率",
          "不等组距直方图：每个矩形的高度需用频率密度，不能直接用频数或频率",
          "茎叶图（Stem-and-Leaf Diagram）：保留原始数据，便于找中位数和四分位数",
          "背靠背茎叶图（Back-to-Back）：同一茎左右各一组叶，用于比较两组数据",
          "累积频率曲线（Cumulative Frequency Curve）：从图像上读取中位数、Q1、Q3",
          "四分位数：Q1（第25百分位）、Q2=中位数（第50百分位）、Q3（第75百分位）",
          "线性插值法求四分位数：在累积频率分布表中按比例插值",
          "箱线图（Box Plot）：五数概括——最小值、Q1、中位数、Q3、最大值",
          "离群值（Outliers）判定标准：小于 Q1 − 1.5×IQR 或大于 Q3 + 1.5×IQR 的值",
          "分布形状—偏斜性：正偏（右偏）→ 均值>中位数>众数；负偏（左偏）→ 均值<中位数<众数",
          "对称分布：均值 = 中位数 = 众数",
          "比较数据集：比较位置（均值/中位数）和离散程度（标准差/IQR）"
        ],
        formulas: [
          { name: "频率密度", expr: "频率密度 = 频率 ÷ 组距（直方图纵轴）" },
          { name: "频率", expr: "频率 = 频率密度 × 组距（直方图矩形面积）" },
          { name: "离群值判定", expr: "离群值：< Q1−1.5×IQR 或 > Q3+1.5×IQR" },
          { name: "IQR", expr: "IQR = Q3 − Q1" },
          { name: "偏斜性（正偏）", expr: "右偏：均值 > 中位数 > 众数" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】直方图纵轴错用频数代替频率密度（这是最常见的整章性错误）；不等组距时直接用频率而非频率密度；累积频率图上读取四分位数时坐标读错；离群值计算时1.5×IQR的乘数忘写（误以为是1×IQR）；箱线图中最大/最小值的标注不含离群值时未单独标出离群值点。",
        examTips: "绘制直方图时：先建立频率密度列（频率/组距），再画矩形。读图题要注意题目给的是频率还是频数——转换关系为：频率=频数/总频数，频率密度=频率/组距。比较两组数据时，必须比较位置和离散度量两个维度，并结合上下文说明含义。",
        youtube: [
          { title: "S1 Histograms频率密度完整讲解 — ExamSolutions", url: "https://www.youtube.com/results?search_query=S1+histograms+frequency+density+edexcel+IAL", channel: "ExamSolutions" },
          { title: "Box Plots & Outliers — TLMaths", url: "https://www.youtube.com/results?search_query=S1+box+plots+outliers+A+level+statistics", channel: "TLMaths" }
        ]
      },
      // ── S1 Chapter 4 ───────────────────────────────────────────
      {
        id: "s1c4", num: 4, title: "Probability 概率",
        overview: "概率论是S1概念密度最高的章节，涵盖文氏图、加法法则、乘法法则、条件概率和独立性检验。互斥事件（Mutually Exclusive）与独立事件（Independent）的本质区别是每年的高频考点。树状图（Tree Diagram）与不放回抽样的结合是WST01中最难的综合题型，通常以8–12分大题形式出现。",
        keyPoints: [
          "概率的基本性质：0 ≤ P(A) ≤ 1；P(A) + P(A') = 1；所有基本事件概率之和 = 1",
          "加法法则（Addition Rule）：P(A∪B) = P(A) + P(B) − P(A∩B)",
          "互斥事件（Mutually Exclusive）：P(A∩B) = 0，即A和B不能同时发生",
          "互斥时的加法法则简化：P(A∪B) = P(A) + P(B)",
          "独立事件（Independent Events）：P(A∩B) = P(A)×P(B)",
          "独立性检验：计算P(A)×P(B)，若等于P(A∩B)则A, B独立",
          "互斥≠独立：若A和B互斥且P(A)>0，P(B)>0，则它们必然不独立",
          "条件概率（Conditional Probability）：P(A|B) = P(A∩B) / P(B)",
          "乘法法则：P(A∩B) = P(A|B)×P(B) = P(B|A)×P(A)",
          "贝叶斯公式应用：P(B|A) = P(A|B)×P(B) / P(A)（一般通过树状图实现）",
          "文氏图（Venn Diagram）：用圆圈表示事件，重叠区域表示交集，用于直观计算概率",
          "树状图（Tree Diagram）：逐层列出所有可能结果及对应概率，各层概率沿路径相乘",
          "有放回抽样：每次抽取后概率不变，前后独立",
          "不放回抽样（Without Replacement）：每次抽取后剩余总数减少，概率动态变化",
          "全概率公式：P(A) = P(A|B)P(B) + P(A|B')P(B')（通过穷举所有情形）"
        ],
        formulas: [
          { name: "加法法则", expr: "P(A∪B) = P(A)+P(B)−P(A∩B)" },
          { name: "互斥简化", expr: "A, B互斥时：P(A∪B) = P(A)+P(B)" },
          { name: "独立性定义", expr: "A, B独立 ⟺ P(A∩B) = P(A)·P(B)" },
          { name: "条件概率", expr: "P(A|B) = P(A∩B) / P(B)" },
          { name: "乘法法则", expr: "P(A∩B) = P(A|B)·P(B)" },
          { name: "余事件", expr: "P(A') = 1 − P(A)" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】最常见陷阱：将\"互斥\"与\"独立\"混淆（这是S1最重要的概念辨析）——互斥是指不能同时发生；独立是指一个事件的发生不影响另一个的概率，两者完全不同的概念。条件概率题中分母取错（P(B)而非P(A)，或取了整个样本空间）。不放回抽样树状图中，第二层的分母应减少1但学生常忘记。",
        examTips: "概率大题（8–12分）解题策略：① 先画文氏图或树状图理清结构 ② 标注所有已知概率 ③ 条件概率用公式P(A|B)=P(A∩B)/P(B) ④ 最终验证所有概率之和为1。独立性的验证必须写出\"P(A)×P(B) = [计算值] = P(A∩B)，因此A和B独立\"或\"≠P(A∩B)，因此A和B不独立\"的完整判断。",
        youtube: [
          { title: "S1 Probability条件概率与独立性 — ExamSolutions", url: "https://www.youtube.com/results?search_query=S1+probability+conditional+independent+edexcel+IAL", channel: "ExamSolutions" },
          { title: "Venn Diagrams & Tree Diagrams — TLMaths精讲", url: "https://www.youtube.com/results?search_query=S1+venn+diagram+tree+diagram+A+level+statistics", channel: "TLMaths" }
        ]
      },
      // ── S1 Chapter 5 ───────────────────────────────────────────
      {
        id: "s1c5", num: 5, title: "Correlation & Regression 相关性与线性回归",
        overview: "本章引入积矩相关系数（Product Moment Correlation Coefficient, PMCC）量化两变量之间的线性相关强度，并通过最小二乘法建立回归直线 ŷ = a + bx。「在上下文中解释回归系数」是考官报告中学生失分最多的小点，因为学生往往只给出数学解释而忽略了实际意义。本章通常占WST01中6–10分。",
        keyPoints: [
          "相关性（Correlation）：描述两个变量之间线性关系的方向和强度",
          "积矩相关系数（PMCC）：r = Sxy / √(Sxx·Syy)，范围 −1 ≤ r ≤ 1",
          "r = 1：完全正相关；r = −1：完全负相关；r = 0：无线性相关",
          "|r|越接近1，线性相关越强；|r|越接近0，线性相关越弱",
          "Sxx = Σx² − (Σx)²/n；Syy = Σy² − (Σy)²/n；Sxy = Σxy − (Σx)(Σy)/n",
          "回归直线（最小二乘法）：y on x 的回归线 ŷ = a + bx",
          "回归系数b（斜率）：b = Sxy / Sxx",
          "回归常数a（截距）：a = ȳ − bx̄（回归线过点(x̄, ȳ)）",
          "解释b的含义：\"当x增加1个单位时，y的平均增加量为b（单位）\"",
          "解释a的含义：\"当x=0时，y的预测值为a（需结合实际判断是否有意义）\"",
          "预测：将特定x值代入回归方程求ŷ，内插比外推可靠",
          "相关性≠因果性：r≠0不代表x导致y变化，可能有第三个变量的影响",
          "因变量（Response Variable）y on x 回归：用x预测y，最小化竖直偏差"
        ],
        formulas: [
          { name: "PMCC", expr: "r = Sxy / √(Sxx·Syy)" },
          { name: "Sxy", expr: "Sxy = Σxy − (Σx)(Σy)/n" },
          { name: "Sxx", expr: "Sxx = Σx² − (Σx)²/n" },
          { name: "回归斜率b", expr: "b = Sxy / Sxx" },
          { name: "回归截距a", expr: "a = ȳ − b·x̄（回归线过均值点）" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】考官报告中排名第一的失分点：未在实际上下文中解释b的含义（只写\"b是斜率\"而不写\"当雇员人数增加1人，纸张成本平均增加£b\"等）。计算Sxy时漏掉负号，或将Σxy误算为(Σx)(Σy)。内插/外推题中，外推预测时未说明\"超出数据范围，可靠性较低\"。相关≠因果的判断必须在题目要求时明确指出。",
        examTips: "Casio ClassWiz的回归功能（Menu 6→y=a+bx）可直接输出a, b, r值，用于验证手算结果。但考试时必须展示Sxy, Sxx的计算过程。解释类小题（2分）：\"在本题背景下，斜率b意味着每增加一个[x的单位]，[y的变量]平均增加/减少[b]个[y的单位]。\"",
        youtube: [
          { title: "S1 Correlation & Regression完整讲解 — ExamSolutions", url: "https://www.youtube.com/results?search_query=S1+correlation+regression+PMCC+edexcel+IAL", channel: "ExamSolutions" },
          { title: "PMCC & Regression Line — TLMaths", url: "https://www.youtube.com/results?search_query=S1+PMCC+regression+A+level+statistics", channel: "TLMaths" }
        ]
      },
      // ── S1 Chapter 6 ───────────────────────────────────────────
      {
        id: "s1c6", num: 6, title: "Discrete Random Variables 离散随机变量",
        overview: "离散随机变量（DRV）建立了从概率到期望、方差的数学框架，是S1中连接概率论与统计推断的核心桥梁。期望E(X)和方差Var(X)的计算，以及线性变换 Y=aX+b 对它们的影响，是高频考点。二项分布（Binomial Distribution）B(n,p)作为最重要的离散分布嵌入本章，计算器的二项分布功能是必须掌握的实战技巧。",
        keyPoints: [
          "离散随机变量（DRV）：只能取有限个或可数无限个值的随机变量X",
          "概率分布表：列出X的所有可能取值x₁, x₂, …及对应概率P(X=xᵢ)",
          "概率公理：P(X=xᵢ) ≥ 0；ΣP(X=xᵢ) = 1（所有概率之和等于1）",
          "期望值（Expectation）：E(X) = Σxᵢ·P(X=xᵢ)（概率加权的\"平均值\"）",
          "E(X²)：E(X²) = Σxᵢ²·P(X=xᵢ)（用于计算方差）",
          "方差（Variance）：Var(X) = E(X²) − [E(X)]²（等价于 E[(X−μ)²]）",
          "标准差：SD(X) = √Var(X)",
          "线性变换法则：E(aX+b) = aE(X)+b；Var(aX+b) = a²Var(X)（b不影响方差！）",
          "二项分布定义：X~B(n,p)，n次独立Bernoulli试验，每次成功概率p",
          "二项分布概率公式：P(X=r) = C(n,r)·pʳ·(1−p)ⁿ⁻ʳ，r=0,1,2,…,n",
          "二项分布期望：E(X) = np；方差：Var(X) = np(1−p)",
          "二项分布适用条件：① 固定次数n ② 每次独立 ③ 每次成功概率相同p ④ 只有成功/失败两种结果",
          "累积二项概率：P(X≤k) = Σᵣ₌₀ᵏ P(X=r)（可用计算器的BinomCD功能）"
        ],
        formulas: [
          { name: "期望值", expr: "E(X) = Σ xᵢ·P(X=xᵢ)" },
          { name: "方差", expr: "Var(X) = E(X²)−[E(X)]² = Σxᵢ²·P(X=xᵢ)−[E(X)]²" },
          { name: "线性变换（期望）", expr: "E(aX+b) = a·E(X) + b" },
          { name: "线性变换（方差）", expr: "Var(aX+b) = a²·Var(X)（b不影响）" },
          { name: "二项分布", expr: "X~B(n,p): P(X=r)=C(n,r)pʳ(1−p)ⁿ⁻ʳ" },
          { name: "二项期望/方差", expr: "E(X)=np；Var(X)=np(1−p)" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】计算E(X²)时，将[E(X)]²误作E(X²)（混淆Var(X)=E(X²)−[E(X)]²中的两项）；线性变换方差时，Var(aX+b)=a²Var(X)——平移量b不影响方差，但学生常忘记而写成a²Var(X)+b²；二项分布适用条件验证：若n较大且p与0.5差距大，学生有时会错误使用正态分布（S1中不考正态近似）。",
        examTips: "E(X²)的计算必须列出xᵢ², P(X=xᵢ)两列再逐行相乘，不要跳步。二项概率计算：Casio ClassWiz的\"STAT→Distribution→Binomial\"可快速计算，但必须手写概率公式作为解题步骤。建议先列出P(X=r)的公式，再代入数值。",
        youtube: [
          { title: "S1 Discrete Random Variables完整讲解 — ExamSolutions", url: "https://www.youtube.com/results?search_query=S1+discrete+random+variables+expectation+variance+edexcel", channel: "ExamSolutions" },
          { title: "Binomial Distribution二项分布 — TLMaths", url: "https://www.youtube.com/results?search_query=S1+binomial+distribution+A+level+statistics", channel: "TLMaths" }
        ]
      },
      // ── S1 Chapter 7 ───────────────────────────────────────────
      {
        id: "s1c7", num: 7, title: "Normal Distribution 正态分布",
        overview: "正态分布是WST01的巅峰章节，也是最后和最重的考点，通常占10–14分。对称的钟形曲线由均值μ和方差σ²完全刻画，通过标准化将任何正态分布转化为标准正态Z~N(0,1)，再查表（或用计算器）求概率。反向查找参数μ或σ需联立两个标准化方程，是真正的A*级难题。",
        keyPoints: [
          "正态分布定义：X~N(μ, σ²)，均值μ，方差σ²（注意：参数是方差而非标准差！）",
          "正态分布的特征：对称的钟形曲线；关于μ对称；无限延伸但总面积=1",
          "68-95-99.7法则：μ±σ内含约68%数据；μ±2σ内含约95%；μ±3σ内含约99.7%",
          "标准化（Standardisation）：Z = (X−μ)/σ，Z~N(0,1)",
          "标准正态分布：Z~N(0,1)，均值为0，标准差为1",
          "查表/计算器：Φ(z) = P(Z < z)，即标准正态分布的累积概率",
          "对称性质：P(Z < −z) = 1 − P(Z < z) = P(Z > z)",
          "P(a < X < b) = P((a−μ)/σ < Z < (b−μ)/σ) = Φ(z₂) − Φ(z₁)",
          "反向查找（Inverse Normal）：已知概率p，求x值：先求z使Φ(z)=p，再还原 x = μ + σz",
          "求未知参数μ：已知P(X < a) = p → (a−μ)/σ = z，σ已知则可解μ",
          "求未知参数σ：已知P(X < a) = p → (a−μ)/σ = z，μ已知则可解σ",
          "联立方程求μ和σ：两个条件给出两个方程，标准化后联立求解",
          "负z值处理：Φ(−z) = 1−Φ(z)；求负z对应概率时用对称性转化"
        ],
        formulas: [
          { name: "标准化公式", expr: "Z = (X − μ) / σ，Z~N(0,1)" },
          { name: "对称性质", expr: "P(Z < −z) = 1 − P(Z < z) = P(Z > z)" },
          { name: "区间概率", expr: "P(a<X<b) = Φ((b−μ)/σ) − Φ((a−μ)/σ)" },
          { name: "反向查找", expr: "若P(X<k)=p，则k = μ + σ·Φ⁻¹(p)" },
          { name: "联立求参数", expr: "两条件→两Z值方程，联立解μ和σ" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】将X~N(μ, σ²)中的第二个参数误作标准差（实为方差！），导致标准化时σ用错；负z值处理时忘记使用对称性转化（直接查表找不到负z值）；联立方程求μ, σ时解方程出现代数错误；面积题中P(X > a)未转化为1−Φ(z)而直接查表。计算器使用要点：Casio ClassWiz的Normal CD和Inverse Normal功能可快速计算，但必须先写出标准化步骤。",
        examTips: "正态分布题目解题模板：① 写出 X~N(μ,σ²)；② 标准化 Z=(X−μ)/σ；③ 画出正态曲线，标注均值和所求区域（防止正负号错误）；④ 用Φ(z)表达概率；⑤ 代入计算得答案。联立求参数题：分别写出两个标准化方程，消去一个未知量，注意负z值用对称性处理后消去。此题型是A*/A考生的拉分关键。",
        youtube: [
          { title: "S1 Normal Distribution完整讲解含反向查找 — ExamSolutions", url: "https://www.youtube.com/results?search_query=S1+normal+distribution+inverse+edexcel+IAL", channel: "ExamSolutions" },
          { title: "Normal Distribution标准化与参数求解 — TLMaths", url: "https://www.youtube.com/results?search_query=S1+normal+distribution+find+mu+sigma+A+level", channel: "TLMaths" }
        ]
      }
    ]
  }
  ,
  P3: {
    title: "Pure Mathematics 3",
    color: "#001F5B",
    icon: "∫",
    chapters: [
      {
        id: "p3c1", num: 1, title: "Algebraic Methods 代数方法进阶",
        overview: "P3以分式代数（Partial Fractions）和多项式长除法的深入应用开篇，是积分技巧的核心前置知识。通过将复杂有理式分解为简单分式之和，可以利用P2的积分基础求解以前无法计算的积分。考官报告指出此章节是WMA13失分率最高的章节之一，主要原因是系数比较时出现代数错误。",
        keyPoints: [
          "部分分式（Partial Fractions）：将有理式分解为更简单的分式之和",
          "线性因子分母：f(x)/[(ax+b)(cx+d)] = A/(ax+b) + B/(cx+d)",
          "重复线性因子：f(x)/(ax+b)² = A/(ax+b) + B/(ax+b)²",
          "不可约二次因子：f(x)/[(ax+b)(x²+c)] = A/(ax+b) + (Bx+C)/(x²+c)",
          "假分式（Improper Fractions）：分子次数≥分母次数时，先做多项式长除法得商式加余式",
          "代入法（Cover-up Rule）：令分母因子=0，快速求对应系数",
          "比较系数法：展开右边，比较各次项系数联立方程",
          "部分分式的应用：化简后可逐项积分（与P3第6章积分深度联结）",
          "分式的域限制：分母不能为零，最终答案需注明排除值",
          "混合分式化简：先通分，再判断是真分式还是假分式，选择正确分解路径"
        ],
        formulas: [
          { name: "线性因子分解", expr: "A/(ax+b) + B/(cx+d) = [A(cx+d)+B(ax+b)] / [(ax+b)(cx+d)]" },
          { name: "重复因子分解", expr: "A/(ax+b) + B/(ax+b)² ，B = f(x)·(ax+b)²|_{x=−b/a}" },
          { name: "Cover-up法", expr: "A = f(x)·(ax+b)|_{x=−b/a}" },
          { name: "假分式处理", expr: "若 deg(f) ≥ deg(g)：先长除法得 Q(x) + R(x)/g(x)" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】假分式未先做长除法直接分解（最常见错误）；Cover-up法代入值时符号错误；有重复因子时漏写B/(ax+b)²项；不可约二次因子分子应写为Bx+C而非常数B。建议：先判断真/假分式，再选择分解结构，最后用代入法+比较系数双重验证。",
        examTips: "WMA13中部分分式题目几乎必须在积分题中使用，先化简再积分是标准流程。计算系数时，优先用Cover-up代入法求每个常数，再用展开比较法验证。",
        youtube: [
          { title: "P3 Partial Fractions完整讲解 — TLMaths", url: "https://www.youtube.com/results?search_query=P3+partial+fractions+edexcel+IAL+A+level", channel: "TLMaths" },
          { title: "Partial Fractions IAL — ExamSolutions精讲", url: "https://www.youtube.com/results?search_query=partial+fractions+improper+edexcel+A+level+maths", channel: "ExamSolutions" },
          { title: "Algebraic Methods P3 — Mr Hassaan WMA13", url: "https://www.youtube.com/results?search_query=WMA13+algebraic+methods+partial+fractions+hassaan", channel: "Mr Hassaan's Maths" }
        ]
      },
      {
        id: "p3c2", num: 2, title: "Functions 函数",
        overview: "函数章节是P3中最具理论深度的章节，涵盖定义域（Domain）与值域（Range）、反函数（Inverse Function）、复合函数（Composite Function）、以及绝对值函数图像变换。这些概念是高阶数学分析的基础，并直接应用于微分方程和向量分析中的函数表达。考官特别强调：域的严格表达（集合记号或不等式）是大量学生失分的隐患。",
        keyPoints: [
          "函数定义：f: A → B，A为定义域（Domain），B的子集为值域（Range）",
          "一对一函数（One-to-one/Injective）：水平线检验——每个y值最多对应一个x值",
          "反函数存在条件：函数必须是一对一函数才有反函数",
          "反函数求法：y=f(x) → 用x表示y → 互换x和y → 写出f⁻¹(x)",
          "反函数的定义域 = 原函数的值域；反函数的值域 = 原函数的定义域",
          "复合函数：(g∘f)(x) = g(f(x))，先作用f再作用g（顺序！）",
          "复合函数的域：x在f的定义域内，且f(x)在g的定义域内",
          "绝对值函数 y = |f(x)|：将f(x) < 0的部分关于x轴翻折",
          "绝对值方程 |f(x)| = k：画图或分类讨论f(x) = k 和 f(x) = −k 两种情形",
          "奇函数（f(−x)=−f(x)）与偶函数（f(−x)=f(x)）的对称性判断",
          "方程 f(x) = f⁻¹(x) 的解：通常在直线 y = x 上"
        ],
        formulas: [
          { name: "复合函数", expr: "(g∘f)(x) = g(f(x))，注意顺序：先f后g" },
          { name: "反函数域/范围", expr: "Dom(f⁻¹) = Range(f)；Range(f⁻¹) = Dom(f)" },
          { name: "f(x)与f⁻¹(x)的关系", expr: "f(f⁻¹(x)) = x；两图像关于y=x对称" },
          { name: "绝对值函数", expr: "|f(x)| ≥ 0；图形为将负值部分翻折" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】复合函数顺序错误——gf(x)先作用f后作用g，而非先g；反函数定义域忘记限制（应等于原函数的值域）；绝对值方程只解f(x)=k而漏掉f(x)=−k；奇偶性判断时代入f(−x)展开计算出错。反函数与原函数图像关于y=x对称这一几何性质常被用于考题，须熟悉。",
        examTips: "函数题常有\"State the range of f\"这类开放性问题——答案必须是集合形式或不等式，不接受单个值。求复合函数的域时：先限制x在f的域内，再检查f(x)落在g的域内，两个条件取交集。",
        youtube: [
          { title: "P3 Functions Domain Range Inverse — TLMaths系列", url: "https://www.youtube.com/results?search_query=P3+functions+inverse+composite+domain+range+edexcel+A+level", channel: "TLMaths" },
          { title: "Composite & Inverse Functions IAL — ExamSolutions", url: "https://www.youtube.com/results?search_query=composite+inverse+functions+A+level+edexcel", channel: "ExamSolutions" },
          { title: "Modulus Function图像 — Bicen Maths P3", url: "https://www.youtube.com/results?search_query=modulus+function+graph+A+level+edexcel+P3", channel: "Bicen Maths" }
        ]
      },
      {
        id: "p3c3", num: 3, title: "Trigonometry 三角函数进阶",
        overview: "P3三角函数章节是全课程最复杂的章节之一（权重III），涵盖六个三角函数（含倒数函数sec、cosec、cot）、加法公式、二倍角公式、以及将asinθ+bcosθ化为Rsin(θ+α)的调和形式。调和形式（Harmonic Form）是每年WMA13的必考题，用于求最大/最小值及解三角方程。与P2三角恒等式共同构成P3最高分值区域。",
        keyPoints: [
          "倒数三角函数：sec θ = 1/cos θ；cosec θ = 1/sin θ；cot θ = cos θ/sin θ",
          "倒数函数图像：sec x 和 cosec x 的周期、渐近线（cos/sin=0处）",
          "毕达哥拉斯恒等式变体：1 + tan²θ = sec²θ；1 + cot²θ = cosec²θ",
          "加法公式（必须背诵）：sin(A±B) = sinAcosB ± cosAsinB",
          "cos(A±B) = cosAcosB ∓ sinAsinB（注意∓符号！）",
          "tan(A±B) = (tanA ± tanB) / (1 ∓ tanAtanB)",
          "二倍角公式：sin2A = 2sinAcosA；cos2A = cos²A − sin²A = 1 − 2sin²A = 2cos²A − 1",
          "tan2A = 2tanA / (1 − tan²A)",
          "调和形式（Harmonic Form）：asinθ + bcosθ = Rsin(θ + α)，其中R=√(a²+b²)，tanα=b/a",
          "调和形式求最大值：最大值 = R（当sin部分=1时），对应的θ可解",
          "调和形式求最小值：最小值 = −R",
          "半角代换（t-substitution）：令t=tan(θ/2)，则sinθ=2t/(1+t²)，cosθ=(1−t²)/(1+t²)"
        ],
        formulas: [
          { name: "sec/cosec/cot", expr: "sec=1/cos, cosec=1/sin, cot=cos/sin=1/tan" },
          { name: "Pythagorean变体", expr: "1+tan²θ=sec²θ；1+cot²θ=cosec²θ" },
          { name: "加法公式sin", expr: "sin(A±B)=sinAcosB±cosAsinB" },
          { name: "加法公式cos", expr: "cos(A±B)=cosAcosB∓sinAsinB" },
          { name: "二倍角sin/tan", expr: "sin2A=2sinAcosA；tan2A=2tanA/(1−tan²A)" },
          { name: "cos2A三形式", expr: "cos2A=cos²A−sin²A=1−2sin²A=2cos²A−1" },
          { name: "调和形式", expr: "asinθ+bcosθ=Rsin(θ+α)，R=√(a²+b²)，tanα=b/a" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】cos(A+B)中的∓符号写反（与sin公式方向相反）；调和形式中α的计算用错三角形边（a对应cos分量，b对应sin分量）；二倍角的三种cos2A形式选错（积分/方程选不同形式效率差异大）；cosec和sec求导公式混淆。解三角方程时，调和形式转化后仍需在指定区间内找全部解。",
        examTips: "调和形式解题步骤：① 展开Rsin(θ+α)=Rsinθcosα+Rcosθsinα；② 比较系数得Rcosα=a, Rsinα=b；③ 求R=√(a²+b²)和α=arctan(b/a)（注意象限！）。此公式可直接用于求最值，是WMA13最高频应用之一。",
        youtube: [
          { title: "P3 Trig Identities Addition Formulae — TLMaths", url: "https://www.youtube.com/results?search_query=P3+addition+formulae+double+angle+edexcel+A+level", channel: "TLMaths" },
          { title: "R-formula Harmonic Form精讲 — ExamSolutions", url: "https://www.youtube.com/results?search_query=R+alpha+form+harmonic+a+sin+b+cos+edexcel", channel: "ExamSolutions" },
          { title: "Reciprocal Trig Functions WMA13 — Mr Hassaan", url: "https://www.youtube.com/results?search_query=sec+cosec+cot+P3+edexcel+IAL+A+level", channel: "Mr Hassaan's Maths" }
        ]
      },
      {
        id: "p3c4", num: 4, title: "Exponentials & Logarithms 进阶指数与对数",
        overview: "在P2指数对数基础上，P3进一步研究e^f(x)和ln[f(x)]的求导与积分，以及连锁法则（Chain Rule）在指数函数上的应用。此章节与P3第5章微分深度交织——理解e^x是唯一导数等于自身的函数是核心概念。考试中常见\"证明\"或\"推导\"类题目，要求学生展示完整的对数微分推导链。",
        keyPoints: [
          "e^x的导数：d/dx(eˣ) = eˣ（唯一等于自身导数的函数）",
          "链式法则求e^f(x)的导数：d/dx[e^{f(x)}] = f'(x)·e^{f(x)}",
          "lnx的导数：d/dx(lnx) = 1/x（x>0）",
          "链式法则求ln[f(x)]的导数：d/dx[ln f(x)] = f'(x)/f(x)",
          "e^x的积分：∫eˣ dx = eˣ + C",
          "∫e^{kx} dx = (1/k)e^{kx} + C",
          "1/x的积分：∫(1/x) dx = ln|x| + C（注意绝对值！）",
          "∫f'(x)/f(x) dx = ln|f(x)| + C（对数型积分的标准识别形式）",
          "对数微分法（Logarithmic Differentiation）：对复杂乘积/商函数两边取ln后求导",
          "指数增长/衰减模型：N = N₀e^{kt}，导数 dN/dt = kN（增长率正比于当前量）",
          "反函数关系：ln(eˣ) = x；e^{lnx} = x（x>0）"
        ],
        formulas: [
          { name: "e^{kx}导数", expr: "d/dx(e^{kx}) = ke^{kx}" },
          { name: "ln[f(x)]导数", expr: "d/dx[ln f(x)] = f'(x)/f(x)" },
          { name: "∫e^{kx}", expr: "∫e^{kx} dx = (1/k)e^{kx} + C" },
          { name: "对数积分标准型", expr: "∫f'(x)/f(x) dx = ln|f(x)| + C" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】∫(1/x)dx忘记绝对值（应写ln|x|而非lnx）；链式法则中f'(x)因子遗漏；对数型积分未识别f'(x)/f(x)的模式（分子应恰好是分母的导数，需先调整系数）；指数增长模型中k的符号（增长k>0，衰减k<0）混淆。",
        examTips: "识别\"对数积分\"的关键：检查分子是否是分母的导数（可差一个常数倍）。若是，结果为ln|分母|+C。考试中出现∫(2x+3)/(x²+3x+1)dx这类题目时，立即检验分子是否=d/dx(分母)的倍数。",
        youtube: [
          { title: "P3 Exponentials & Logs微分积分 — TLMaths", url: "https://www.youtube.com/results?search_query=P3+exponentials+logarithms+differentiation+integration+edexcel", channel: "TLMaths" },
          { title: "ln x and e^x Differentiation — ExamSolutions", url: "https://www.youtube.com/results?search_query=ln+x+e+x+differentiation+integration+A+level+chain+rule", channel: "ExamSolutions" },
          { title: "Logarithmic Differentiation IAL P3 — Bicen Maths", url: "https://www.youtube.com/results?search_query=logarithmic+differentiation+A+level+edexcel+P3", channel: "Bicen Maths" }
        ]
      },
      {
        id: "p3c5", num: 5, title: "Differentiation 微分进阶",
        overview: "P3微分章节是A-Level微积分的顶峰，引入链式法则（Chain Rule）、乘积法则（Product Rule）、商法则（Quotient Rule）、隐函数微分（Implicit Differentiation）、参数方程微分（Parametric Differentiation），以及所有三角函数的求导。这些工具使得几乎任意复杂函数都能被微分，是WMA13中分值最高的单一章节（约20分）。",
        keyPoints: [
          "链式法则（Chain Rule）：dy/dx = (dy/du)·(du/dx)，用于复合函数 y = f(g(x))",
          "链式法则标准形式：d/dx[f(g(x))] = f'(g(x))·g'(x)",
          "乘积法则（Product Rule）：d/dx[u·v] = u·dv/dx + v·du/dx",
          "商法则（Quotient Rule）：d/dx[u/v] = (v·du/dx − u·dv/dx) / v²",
          "三角函数导数：d/dx(sinx)=cosx；d/dx(cosx)=−sinx；d/dx(tanx)=sec²x",
          "倒数三角函数导数：d/dx(secx)=secx·tanx；d/dx(cosecx)=−cosecx·cotx；d/dx(cotx)=−cosec²x",
          "隐函数微分：对方程两边对x微分，遇到y项用链式法则×dy/dx，最后解出dy/dx",
          "参数微分：x=f(t)，y=g(t)，则dy/dx = (dy/dt)/(dx/dt)",
          "参数方程二阶导：d²y/dx² = d/dx(dy/dx) = (d/dt(dy/dx))/(dx/dt)",
          "切线和法线：参数方程给定t值时，求dy/dx后写出直线方程",
          "对数微分法：对复杂乘积y=f(x)g(x)两边取ln，利用对数简化再微分"
        ],
        formulas: [
          { name: "链式法则", expr: "d/dx[f(g(x))] = f'(g(x))·g'(x)" },
          { name: "乘积法则", expr: "d/dx(uv) = u·v' + v·u'" },
          { name: "商法则", expr: "d/dx(u/v) = (v·u' − u·v') / v²" },
          { name: "d/dx(tanx)", expr: "d/dx(tan x) = sec²x" },
          { name: "隐函数微分", expr: "对y²: d/dx(y²) = 2y·dy/dx" },
          { name: "参数微分", expr: "dy/dx = (dy/dt) ÷ (dx/dt)" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】乘积法则中漏写其中一项（u'v+uv'两项缺一）；商法则分子减法顺序错误（应是v·du−u·dv，而非反向）；隐函数微分中对含y²的项忘记乘dy/dx（是最常见的漏步）；参数方程中dy/dx求出后仍用t表示，未代入t值。链式法则是本章的核心——几乎所有其他规则都是其特例或组合。",
        examTips: "考试策略：① 先识别函数类型（单函数还是乘积/商）；② 选择对应法则；③ 明确写出u, v和u', v'（商法则/乘积法则）或外层/内层函数（链式法则）；④ 代入并化简。每步都要展示，不能跳步——WMA13给出每步方法分。",
        youtube: [
          { title: "P3 Differentiation Chain Product Quotient Rules — TLMaths", url: "https://www.youtube.com/results?search_query=P3+chain+rule+product+quotient+differentiation+edexcel+IAL", channel: "TLMaths" },
          { title: "Implicit Parametric Differentiation — ExamSolutions", url: "https://www.youtube.com/results?search_query=implicit+parametric+differentiation+A+level+edexcel", channel: "ExamSolutions" },
          { title: "P3 Differentiation全章 — Bicen Maths WMA13", url: "https://www.youtube.com/results?search_query=P3+differentiation+WMA13+edexcel+IAL+bicen+maths", channel: "Bicen Maths" }
        ]
      },
      {
        id: "p3c6", num: 6, title: "Integration 积分进阶",
        overview: "P3积分是全A-Level最复杂的技术章节，整合分部积分（Integration by Parts）、换元积分（Integration by Substitution）、利用部分分式积分，以及三角恒等式化简后积分。每种技术针对不同类型的被积函数，识别正确方法是核心技能。WMA13考试通常包含10–16分的积分大题，是A*考生的决胜战场。",
        keyPoints: [
          "标准积分（必须背诵）：∫sinx dx=−cosx+C；∫cosx dx=sinx+C；∫sec²x dx=tanx+C",
          "∫secx·tanx dx=secx+C；∫cosecx·cotx dx=−cosecx+C",
          "换元积分（Substitution）：令u=g(x)，计算du=g'(x)dx，替换后积分",
          "定积分换元：必须同步替换积分上下限",
          "分部积分（Integration by Parts）：∫u dv = uv − ∫v du",
          "LIATE法则选u：对数（L）→ 反三角（I）→ 代数（A）→ 三角（T）→ 指数（E）",
          "二次分部积分：某些积分（如∫eˣsinx dx）需用两次分部积分后解方程",
          "利用三角恒等式化简：如将sin²x=½(1−cos2x)后积分",
          "利用部分分式积分：∫f(x)/[(ax+b)(cx+d)]dx，先分解再逐项积分",
          "参数方程面积：A = ∫y dx = ∫y·(dx/dt)dt，注意积分限的转换",
          "隐函数面积与弧长：特殊情形下用参数方程表达后积分"
        ],
        formulas: [
          { name: "分部积分", expr: "∫u dv = uv − ∫v du（LIATE法则选u）" },
          { name: "∫1/(a²+x²)", expr: "∫1/(a²+x²) dx = (1/a)arctan(x/a) + C" },
          { name: "∫1/√(a²−x²)", expr: "∫1/√(a²−x²) dx = arcsin(x/a) + C" },
          { name: "∫tan x", expr: "∫tan x dx = ln|sec x| + C = −ln|cos x| + C" },
          { name: "sin²x化简", expr: "sin²x = ½(1−cos2x)；cos²x = ½(1+cos2x)" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】换元积分忘记替换dx（必须将dx换成du除以g'(x)）；定积分换元后未更新上下限；分部积分LIATE顺序选错（如对∫xlnx dx，应选u=lnx而非u=x）；二次分部积分时方向错误，未将循环积分项移项解方程。P3积分大题通常综合多种技术，识别策略是考前的最高优先级训练内容。",
        examTips: "积分方法识别流程：① 标准形式？→ 直接套公式。② f'(x)/f(x)型？→ ln|f(x)|。③ 乘积？→ 分部积分（LIATE）。④ 复合函数？→ 换元。⑤ 有理式？→ 部分分式。⑥ 含sin²x或cos²x？→ 倍角公式。掌握这个决策树，WMA13积分题就有了系统解法。",
        youtube: [
          { title: "P3 Integration by Parts & Substitution — TLMaths", url: "https://www.youtube.com/results?search_query=P3+integration+by+parts+substitution+edexcel+A+level+IAL", channel: "TLMaths" },
          { title: "Integration by Parts精讲 — ExamSolutions", url: "https://www.youtube.com/results?search_query=integration+by+parts+A+level+edexcel+LIATE", channel: "ExamSolutions" },
          { title: "P3 Integration全章综合 — Bicen Maths", url: "https://www.youtube.com/results?search_query=P3+integration+WMA13+full+chapter+bicen+maths", channel: "Bicen Maths" }
        ]
      },
      {
        id: "p3c7", num: 7, title: "Vectors 向量",
        overview: "P3向量章节从二维扩展到三维，引入向量方程的直线表达形式、点积（Scalar/Dot Product）及其与夹角的关系。向量直线方程 r = a + λb 是本章核心，用于求直线上的点、两直线的交点及平行/垂直判断。WMA13中向量题通常以5–10分的结构化大题出现，是同时考查代数与几何直觉的综合题型。",
        keyPoints: [
          "三维向量：r = (x, y, z) = xi + yj + zk，i, j, k 为三个坐标方向单位向量",
          "向量的模（Magnitude）：|r| = √(x² + y² + z²)",
          "单位向量：r̂ = r/|r|（将向量除以其模）",
          "向量加减与数量积：基本运算与二维相同",
          "向量方程直线：r = a + λb，a为直线上一点的位置向量，b为方向向量",
          "参数λ：不同λ值对应直线上不同的点",
          "两直线平行：方向向量b₁ = kb₂（一个是另一个的数量倍）",
          "两直线交点：令r₁ = r₂，联立方程组求λ和μ，验证第三个方程",
          "两直线异面（Skew lines）：不平行且没有交点",
          "标量积（Dot Product）：a·b = |a||b|cosθ = a₁b₁ + a₂b₂ + a₃b₃",
          "垂直条件：a·b = 0 ⟺ 两向量垂直",
          "求夹角：cosθ = (a·b)/(|a||b|)，θ在[0°, 180°]",
          "点到直线的最短距离：从点作垂线到直线，用点积找垂足"
        ],
        formulas: [
          { name: "直线向量方程", expr: "r = a + λb（a为点，b为方向向量，λ∈ℝ）" },
          { name: "标量积", expr: "a·b = a₁b₁ + a₂b₂ + a₃b₃ = |a||b|cosθ" },
          { name: "向量夹角", expr: "cosθ = (a·b)/(|a||b|)，0° ≤ θ ≤ 180°" },
          { name: "垂直条件", expr: "a·b = 0 ⟺ a ⊥ b" },
          { name: "模（3D）", expr: "|xi+yj+zk| = √(x²+y²+z²)" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】两直线交点验证：解出λ和μ后，必须验证第三个坐标方程成立（否则是异面直线）；点积结果为负数时，实际夹角可能是钝角（需取arccos，范围0到180°）；向量方程中将位置向量a和方向向量b混淆；单位向量未除以模直接使用。异面直线（skew lines）是P3新概念，需理解与平行和相交的区别。",
        examTips: "向量题必须展示完整过程：① 写出两直线的向量方程；② 联立三个方程；③ 解两个方程求λ, μ；④ 代入第三个方程验证（必须写出！）；⑤ 得出结论（相交/异面）。每个缺失步骤丢一分，验证步骤是最常被遗漏的。",
        youtube: [
          { title: "P3 Vectors 3D Lines Dot Product — TLMaths", url: "https://www.youtube.com/results?search_query=P3+3D+vectors+lines+dot+product+edexcel+IAL", channel: "TLMaths" },
          { title: "Vector Equations of Lines — ExamSolutions精讲", url: "https://www.youtube.com/results?search_query=vector+equation+line+3D+A+level+edexcel", channel: "ExamSolutions" },
          { title: "P3 Vectors完整章节 — Bicen Maths WMA13", url: "https://www.youtube.com/results?search_query=vectors+P3+WMA13+edexcel+IAL+full+chapter", channel: "Bicen Maths" }
        ]
      },
      {
        id: "p3c8", num: 8, title: "Differential Equations 微分方程",
        overview: "微分方程将微积分技能整合于动态变化的建模之中——物种增长、物体冷却、放射衰减等现实模型均以微分方程描述。P3关注可分离变量的一阶微分方程，要求分离dy/dx的变量后对两侧分别积分，再用初始条件（Initial Conditions）确定积分常数。这是P3最综合的技术章节，几乎需要运用前七章的所有积分技巧。",
        keyPoints: [
          "微分方程定义：含有导数dy/dx的方程，描述变量变化率与自身的关系",
          "可分离变量（Separable Variables）：dy/dx = f(x)g(y) → 将y相关项移至左边，x相关项移至右边",
          "分离变量标准步骤：dy/g(y) = f(x)dx → 两边积分 → ∫dy/g(y) = ∫f(x)dx",
          "初始条件（Initial Conditions）：代入给定的(x₀, y₀)求积分常数C",
          "通解（General Solution）：含C的解；特解（Particular Solution）：代入初始条件后的唯一解",
          "指数增长模型：dN/dt = kN → N = Ae^{kt}（k>0增长，k<0衰减）",
          "Newton冷却定律：dT/dt = −k(T − T₀)，T₀为环境温度",
          "人口增长限制模型：dP/dt = kP(M−P)，M为最大种群数",
          "建立微分方程：从题目描述的变化率关系翻译成dy/dx=...的形式",
          "微分方程解的验证：对特解求导，代回原方程验证等式成立",
          "图形解释：微分方程的解曲线族（Family of curves）对应不同C值"
        ],
        formulas: [
          { name: "可分离变量", expr: "dy/g(y) = f(x)dx → ∫dy/g(y) = ∫f(x)dx + C" },
          { name: "指数增长/衰减", expr: "dN/dt=kN → N=Ae^{kt}（A=N₀为初始值）" },
          { name: "Newton冷却", expr: "dT/dt=−k(T−T₀) → T−T₀=(T₀init−T₀)e^{−kt}" },
          { name: "特解确定", expr: "代入初始条件(x₀,y₀)解出C → 特解唯一确定" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】分离变量时将1/g(y)移项后积分忘记（对左边按y积分而非x）；积分时漏掉+C；代入初始条件时只解出C但未写出完整特解；建模题中变化率方向错误（\"以速率k增长\"意味着+k，\"以速率k减少\"意味着−k）。微分方程解的验证（将解代回方程）虽然费时，但可发现绝大多数代数错误。",
        examTips: "分离变量时，建议先明确写出分离后的形式 ∫(1/g(y))dy = ∫f(x)dx，再逐步积分——不要跳过积分符号步骤。建模题审题要点：找\"变化率\"关键词（rate of change / proportional to / decreases as...），直接翻译为dy/dx=...的数学表达式。",
        youtube: [
          { title: "P3 Differential Equations可分离变量 — TLMaths", url: "https://www.youtube.com/results?search_query=P3+differential+equations+separable+variables+edexcel+A+level", channel: "TLMaths" },
          { title: "Separable Differential Equations — ExamSolutions", url: "https://www.youtube.com/results?search_query=separable+differential+equations+A+level+edexcel+IAL", channel: "ExamSolutions" },
          { title: "P3 Differential Equations建模 — Bicen Maths", url: "https://www.youtube.com/results?search_query=differential+equations+modelling+P3+WMA13+edexcel", channel: "Bicen Maths" }
        ]
      }
    ]
  },
  P4: {
    title: "Pure Mathematics 4",
    color: "#6B1515",
    icon: "λ",
    chapters: [
      {
        id: "p4c1", num: 1, title: "Proof by Mathematical Induction 数学归纳法",
        overview: "数学归纳法（Proof by Mathematical Induction）是P4中最严谨、最具独特性的证明技术。其逻辑结构类似多米诺骨牌：先证明第一块倒（基础步）；再证明任一块倒后下一块必倒（归纳步）；由此证明所有骨牌都会倒。P4的归纳法涵盖级数求和公式、整除性证明和矩阵幂次——每种类型都有固定的书写格式，格式不规范会导致全题零分。",
        keyPoints: [
          "归纳法的三个步骤：① 基础步（Base Case）：验证n=1成立；② 归纳假设（Inductive Hypothesis）：假设n=k成立；③ 归纳步（Inductive Step）：证明n=k+1也成立",
          "结论语言（必须写）：\"By the Principle of Mathematical Induction, P(n) is true for all positive integers n.\"",
          "级数求和型：证明Σf(r) = g(n)，归纳步=g(k)+f(k+1)=g(k+1)（代数化简）",
          "整除性型：证明f(n)可被m整除，归纳步中用f(k+1)=某因子×f(k)+额外项，提出m的因子",
          "矩阵幂型：证明Mⁿ具有某种形式，归纳步中M^{k+1}=M^k·M（矩阵乘法）",
          "归纳假设的书写：\"Assume that P(k) is true for some positive integer k, i.e., [写出具体等式]\"",
          "归纳步的关键：从P(k+1)的左边出发，代入P(k)的假设，化简得右边",
          "\"Strong Induction\"（强归纳法）：某些题目需假设对所有n≤k成立",
          "归纳法的适用范围：仅证明命题对所有正整数（或从某n₀起的整数）成立",
          "反归纳（Descending Induction）：从大到小的归纳，偶尔出现于高难题"
        ],
        formulas: [
          { name: "基础步", expr: "Verify P(1): LHS = f(1)，RHS = g(1)，show LHS = RHS" },
          { name: "归纳假设", expr: "Assume P(k): Σ_{r=1}^{k} f(r) = g(k)" },
          { name: "归纳步（级数）", expr: "P(k+1): Σ_{r=1}^{k+1} f(r) = g(k) + f(k+1) = g(k+1)" },
          { name: "整除性步骤", expr: "f(k+1) = a·f(k) + m·(expr) → m | f(k+1)" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】归纳步从P(k+1)左边出发写起，不能直接写P(k+1)=P(k)+...（逻辑方向错误）；结论语句不完整（必须明确引用\"By the Principle of Mathematical Induction\"）；矩阵乘法计算错误；级数归纳步的代数化简出错后结果与g(k+1)不匹配。格式分通常占全题分数的1分，但格式完全不规范时可能影响后续方法分的获得。",
        examTips: "数学归纳法题目格式极为重要。建议在考前背诵三个标准段落：① Basis/Base Case段；② Assume...段；③ Consider P(k+1)段，以及结论段。WMA14中归纳法通常为7–9分，分布在4步之间，每步2–3分，格式正确可得大部分分数。",
        youtube: [
          { title: "P4 Proof by Induction完整讲解 — TLMaths", url: "https://www.youtube.com/results?search_query=P4+proof+by+mathematical+induction+edexcel+IAL+A+level", channel: "TLMaths" },
          { title: "Mathematical Induction Series & Divisibility — ExamSolutions", url: "https://www.youtube.com/results?search_query=mathematical+induction+series+divisibility+A+level+edexcel", channel: "ExamSolutions" },
          { title: "P4 Induction矩阵幂次 — Mr Hassaan WMA14", url: "https://www.youtube.com/results?search_query=proof+by+induction+matrices+WMA14+edexcel+IAL", channel: "Mr Hassaan's Maths" }
        ]
      },
      {
        id: "p4c2", num: 2, title: "Complex Numbers 复数",
        overview: "复数将实数扩展至二维复平面（Argand Diagram），赋予每个实数方程（包括无实数解的方程）完整的解集。P4涵盖复数的四则运算、共轭、模和辐角（Modulus-Argument Form）、以及De Moivre定理对复数幂次的应用。\"复数的轨迹（Loci）\"是P4考试中最具综合性的题型——用复数不等式描述Argand图中的几何区域。这是许多学生认为P4最难的章节。",
        keyPoints: [
          "复数定义：z = a + bi，a为实部（Real Part），b为虚部（Imaginary Part），i² = −1",
          "复数运算：加减（实部虚部分别运算）；乘法（展开并用i²=−1化简）；除法（乘以共轭）",
          "共轭复数：z* = a − bi；z·z* = a² + b²（必为正实数）",
          "模（Modulus）：|z| = √(a² + b²)",
          "辐角（Argument）：arg z = arctan(b/a)，注意象限！范围通常取(−π, π]",
          "极坐标形式（Modulus-Argument Form）：z = r(cosθ + i sinθ) = re^{iθ}，r=|z|，θ=arg z",
          "复数乘法（极坐标）：模相乘，辐角相加：z₁z₂ = r₁r₂[cos(θ₁+θ₂) + i sin(θ₁+θ₂)]",
          "De Moivre定理：[r(cosθ+isinθ)]ⁿ = rⁿ(cosnθ+isinnθ)，可用于多倍角公式",
          "复数的n次根：z的n次根有n个，均匀分布在以原点为圆心、|z|^{1/n}为半径的圆上",
          "复数轨迹：|z − a| = r 表示以复数a为圆心、r为半径的圆；|z − a| = |z − b| 表示ab的垂直平分线",
          "arg(z − a) = θ 表示从a出发、方向为θ的射线",
          "虚部解：若多项式有实系数，则复数根成共轭对出现"
        ],
        formulas: [
          { name: "共轭之积", expr: "z·z* = |z|² = a²+b²（实数）" },
          { name: "极坐标形式", expr: "z = r(cosθ+i sinθ)，r=|z|，θ=arg z ∈(−π,π]" },
          { name: "De Moivre定理", expr: "(cosθ+i sinθ)ⁿ = cos(nθ)+i sin(nθ)" },
          { name: "n次方根", expr: "z^{1/n}有n个值，间隔角度2π/n" },
          { name: "圆轨迹", expr: "|z−a|=r ↔ 圆心a，半径r（Argand图中的圆）" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】辐角计算时未考虑象限（arctan只给第一/四象限值，第二/三象限需加减π）；共轭复数除法时乘以的共轭写错（分母a+bi应乘以a−bi）；De Moivre定理求多倍角时展开错误；复数轨迹题中将|z−a|误解为|z|−|a|（绝对值差不等于差的绝对值！）。复数与Argand图必须结合几何直觉理解，纯代数操作容易出错。",
        examTips: "解复数题始终标注Argand图——即使题目不要求，也能帮助判断辐角象限和轨迹形状。对于极坐标形式，先求|z|（模）再求arg(z)（辐角），分两步进行，不要试图同时完成。",
        youtube: [
          { title: "P4 Complex Numbers完整章节 — TLMaths", url: "https://www.youtube.com/results?search_query=P4+complex+numbers+argand+modulus+argument+edexcel+IAL", channel: "TLMaths" },
          { title: "De Moivre's Theorem & Loci — ExamSolutions", url: "https://www.youtube.com/results?search_query=de+moivre+theorem+complex+loci+A+level+edexcel", channel: "ExamSolutions" },
          { title: "Complex Numbers WMA14 精讲 — Bicen Maths", url: "https://www.youtube.com/results?search_query=complex+numbers+WMA14+edexcel+IAL+bicen", channel: "Bicen Maths" }
        ]
      },
      {
        id: "p4c3", num: 3, title: "Matrices 矩阵",
        overview: "矩阵将多变量线性方程组的操作代数化，是现代数学、计算机图形学和量化金融的基础工具。P4涵盖2×2和3×3矩阵的运算、行列式、逆矩阵、以及矩阵代表几何变换（旋转、反射、放大）的理解。利用矩阵解方程组（Cramer's Rule 或 Inverse Method）是高频考点，矩阵的不可逆性（奇异矩阵）与方程组无唯一解紧密相关。",
        keyPoints: [
          "矩阵加减：对应元素相加减（矩阵阶数必须相同）",
          "矩阵数量乘：将矩阵每个元素乘以数量k",
          "矩阵乘法：(m×n)(n×p) = m×p矩阵；注意AB ≠ BA（乘法不满足交换律）",
          "单位矩阵I：MI=IM=M（起乘法恒等元的作用）",
          "行列式（2×2）：det|a b; c d| = ad − bc",
          "行列式（3×3）：按第一行展开，用代数余子式（Cofactor Expansion）",
          "奇异矩阵（Singular Matrix）：det(M) = 0，不可逆，对应方程组无唯一解",
          "逆矩阵（2×2）：M⁻¹ = (1/det M)|d −b; −c a|",
          "逆矩阵（3×3）：M⁻¹ = (1/det M) × adj(M)（伴随矩阵除以行列式）",
          "线性方程组：Mx = b → x = M⁻¹b（若M可逆）",
          "几何变换矩阵（常见）：旋转θ = [cosθ −sinθ; sinθ cosθ]；关于x轴反射 = [1 0; 0 −1]；放大k倍 = kI",
          "复合变换：先作变换B再作变换A对应矩阵乘积AB（注意顺序！）"
        ],
        formulas: [
          { name: "2×2行列式", expr: "det[a b; c d] = ad − bc" },
          { name: "2×2逆矩阵", expr: "M⁻¹ = (1/(ad−bc))[d −b; −c a]" },
          { name: "旋转变换", expr: "[cosθ −sinθ; sinθ cosθ]（逆时针旋转θ角）" },
          { name: "方程组解法", expr: "Mx=b → x=M⁻¹b（det M ≠ 0时有唯一解）" },
          { name: "行列式性质", expr: "det(AB)=det(A)·det(B)；det(A⁻¹)=1/det(A)" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】矩阵乘法顺序错误（AB和BA结果通常不同）；3×3行列式符号的正负号规则（棋盘格±）出错；求逆矩阵时行列式计算错误导致整题答案错误；复合变换中矩阵顺序混淆（先B后A对应矩阵乘积AB，从右到左读）。奇异矩阵（det=0）与无唯一解的联系要理解并能结合几何解释。",
        examTips: "行列式是逆矩阵的关键——总是先计算det(M)并验证其不为零，再求逆矩阵。对3×3矩阵，按第一行展开并仔细处理±号（建议在计算纸上画出棋盘格提醒符号）。矩阵变换题常要求\"求变换后的像\"——用矩阵乘以列向量。",
        youtube: [
          { title: "P4 Matrices Determinants Inverse — TLMaths", url: "https://www.youtube.com/results?search_query=P4+matrices+determinant+inverse+edexcel+IAL+A+level", channel: "TLMaths" },
          { title: "Matrix Transformations几何变换 — ExamSolutions", url: "https://www.youtube.com/results?search_query=matrix+transformations+rotation+reflection+A+level+edexcel", channel: "ExamSolutions" },
          { title: "3×3 Matrices & Systems WMA14 — Bicen Maths", url: "https://www.youtube.com/results?search_query=3x3+matrix+inverse+equations+P4+WMA14+edexcel", channel: "Bicen Maths" }
        ]
      },
      {
        id: "p4c4", num: 4, title: "Further Vectors 向量进阶",
        overview: "在P3向量基础上，P4进一步研究直线与平面的三维几何，引入平面的方程（法向量形式和笛卡尔形式）、直线与平面的交点、两平面的交线，以及向量积（Cross Product/Vector Product）。这些工具使得复杂三维空间几何问题能够代数化求解，是工程、物理和计算机图形学的核心数学工具。",
        keyPoints: [
          "平面的向量方程：r = a + sb + tc，a为平面上一点，b和c为平面内两个不平行方向向量",
          "平面的法向量（Normal Vector）：垂直于平面的向量n，由b×c（向量积）得到",
          "平面的笛卡尔方程：n₁x + n₂y + n₃z = d，其中(n₁,n₂,n₃)为法向量，d=n·a",
          "点到平面的距离：d = |n·p − c| / |n|，p为点的位置向量，c为平面方程右侧常数",
          "直线与平面的夹角：sinθ = |b·n| / (|b||n|)，b为直线方向向量",
          "两平面的夹角：cosθ = |n₁·n₂| / (|n₁||n₂|)，n₁, n₂为各平面法向量",
          "向量积（Cross Product）：a×b = |i  j  k; a₁ a₂ a₃; b₁ b₂ b₃|，结果垂直于a和b",
          "|a×b| = |a||b|sinθ，其中θ为a与b的夹角",
          "向量积的应用：求平面的法向量；求平行四边形面积（|a×b|）",
          "两直线公垂线（Common Perpendicular）：方向为b₁×b₂",
          "直线与平面的交点：将直线参数方程代入平面笛卡尔方程，求λ，再求交点坐标"
        ],
        formulas: [
          { name: "平面笛卡尔方程", expr: "n·r = d，即n₁x+n₂y+n₃z=d，n为法向量" },
          { name: "向量积（3D）", expr: "a×b=(a₂b₃−a₃b₂)i−(a₁b₃−a₃b₁)j+(a₁b₂−a₂b₁)k" },
          { name: "点到平面距离", expr: "d = |n·r₀ − c| / |n|" },
          { name: "两面夹角", expr: "cosθ = |n₁·n₂|/(|n₁||n₂|)，θ∈[0°,90°]" },
          { name: "平行四边形面积", expr: "S = |a×b|" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】向量积行列式展开时符号规则出错（第二行有减号！）；平面方程中混淆法向量n和方向向量b、c；求点到平面距离时漏以|n|归一化；两平面夹角取值范围：应取锐角（对应|n₁·n₂|取绝对值）；直线与平面交点代入时参数λ解出但忘记代回求点坐标。",
        examTips: "向量积是P4向量的核心新工具。记忆方法：展开3×3行列式，第一行为i, j, k，再按余子式展开（注意j项有负号）。所有平面相关题目优先求法向量，确定法向量后，平面方程、点面距离、夹角计算均变为直线操作。",
        youtube: [
          { title: "P4 Planes Vectors Cross Product — TLMaths", url: "https://www.youtube.com/results?search_query=P4+planes+cross+product+vector+equations+edexcel+IAL", channel: "TLMaths" },
          { title: "3D Vectors Planes Intersections — ExamSolutions", url: "https://www.youtube.com/results?search_query=3D+vector+plane+intersection+A+level+further+maths+edexcel", channel: "ExamSolutions" },
          { title: "Further Vectors WMA14 完整 — Bicen Maths", url: "https://www.youtube.com/results?search_query=further+vectors+planes+WMA14+edexcel+IAL+bicen", channel: "Bicen Maths" }
        ]
      },
      {
        id: "p4c5", num: 5, title: "Hyperbolic Functions 双曲函数",
        overview: "双曲函数是与三角函数平行发展的函数体系，定义为cosh x = (eˣ+e⁻ˣ)/2，sinh x = (eˣ−e⁻ˣ)/2。其恒等式、导数、积分形式与三角函数高度类似（Osborn法则）但有细微符号差异。反双曲函数的对数表达形式是P4重要考点，也是区分A与A*的高分题型。本章通常在WMA14占8–12分。",
        keyPoints: [
          "cosh x = (eˣ + e⁻ˣ)/2；sinh x = (eˣ − e⁻ˣ)/2；tanh x = sinh x / cosh x",
          "双曲恒等式：cosh²x − sinh²x = 1（类比 cos²x + sin²x = 1，符号差异！）",
          "1 − tanh²x = sech²x；coth²x − 1 = cosech²x",
          "双曲函数的偶奇性：cosh x 为偶函数（图形对称y轴）；sinh x 为奇函数",
          "加法公式：sinh(A±B)=sinhAcoshB±coshAsinh B；cosh(A±B)=coshAcoshB±sinhAsinhB",
          "Osborn法则：将三角恒等式转化为双曲恒等式，将sin→sinh，cos→cosh，但每出现sinθ·sinθ（乘积）时变号",
          "导数：d/dx(sinh x)=cosh x；d/dx(cosh x)=sinh x；d/dx(tanh x)=sech²x",
          "反双曲函数：arcsinh x = ln(x + √(x²+1))；arccosh x = ln(x + √(x²−1))，x≥1",
          "arctanh x = ½ln((1+x)/(1−x))，|x|<1",
          "反双曲函数的导数：d/dx(arcsinh x)=1/√(x²+1)；d/dx(arccosh x)=1/√(x²−1)",
          "积分形式：∫cosh x dx=sinh x+C；∫sinh x dx=cosh x+C；∫sech²x dx=tanh x+C"
        ],
        formulas: [
          { name: "cosh/sinh定义", expr: "cosh x=(eˣ+e⁻ˣ)/2；sinh x=(eˣ−e⁻ˣ)/2" },
          { name: "核心恒等式", expr: "cosh²x − sinh²x = 1（注意：与trig不同！）" },
          { name: "Osborn法则", expr: "trig→hyperbolic：sinθsinθ的乘积项取反号" },
          { name: "arcsinh对数形式", expr: "arcsinh x = ln(x+√(x²+1))（对所有x）" },
          { name: "arccosh对数形式", expr: "arccosh x = ln(x+√(x²−1))，x≥1" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】将cosh²x−sinh²x=1误写为+1（与三角函数cos²x+sin²x=1相反）；Osborn法则的应用——仅当两个sinh相乘时才改变符号，单独的sinh²不改变；反双曲函数的对数推导：需要解方程eˣ=... 时保留正负两根，但根据定义域舍去负根；d/dx(cosh x)=sinh x（不是−sinh x，与cos x导数不同）。",
        examTips: "双曲函数题目在WMA14中通常包含：① 证明恒等式（用Osborn或定义直接计算）；② 求导积分；③ 解双曲方程（令e^x=t化为代数方程）。用定义展开为e的表达式可以验证任何双曲恒等式，是最可靠的证明方法。",
        youtube: [
          { title: "P4 Hyperbolic Functions完整讲解 — TLMaths", url: "https://www.youtube.com/results?search_query=P4+hyperbolic+functions+sinh+cosh+edexcel+IAL+A+level", channel: "TLMaths" },
          { title: "Inverse Hyperbolic & Osborn's Rule — ExamSolutions", url: "https://www.youtube.com/results?search_query=inverse+hyperbolic+functions+log+form+edexcel+A+level", channel: "ExamSolutions" },
          { title: "Hyperbolic Functions WMA14 — Bicen Maths", url: "https://www.youtube.com/results?search_query=hyperbolic+functions+WMA14+P4+edexcel+IAL+bicen", channel: "Bicen Maths" }
        ]
      },
      {
        id: "p4c6", num: 6, title: "Polar Coordinates 极坐标",
        overview: "极坐标系使用距离（r）和角度（θ）而非传统的(x, y)描述平面上的点，能简洁表达许多在直角坐标系中极为复杂的曲线（如玫瑰线、阿基米德螺旋线、心形线）。P4要求学生绘制极坐标曲线草图，以及用积分公式 A = ½∫r² dθ 计算极坐标曲线围成的面积。本章是WMA14中视觉与计算高度融合的独特章节。",
        keyPoints: [
          "极坐标(r, θ)：r为到原点（极点）距离，θ为与极轴（正x轴）夹角",
          "坐标转换：x=r cosθ；y=r sinθ；r²=x²+y²；tan θ=y/x",
          "极坐标曲线的草图：列出关键角度（0, π/6, π/4, π/3, π/2, π等）处的r值，描点连线",
          "r < 0时的处理：点位于从原点出发方向相反的位置（绘图时要注意）",
          "常见极坐标曲线：r=a（圆）；r=aθ（阿基米德螺旋）；r=a(1+cosθ)（心形线/Cardioid）",
          "玫瑰线：r=a cos(nθ) 或 r=a sin(nθ)，n为奇数时n片花瓣，n为偶数时2n片",
          "对称性：若r(−θ)=r(θ)则关于极轴对称；若r(π−θ)=r(θ)则关于θ=π/2对称",
          "极坐标面积公式：A = ½∫[α,β] r² dθ（区域由θ=α和θ=β围成）",
          "两曲线之间的面积：A = ½∫(r₁² − r₂²) dθ，需确定正确的θ范围",
          "极坐标切线：dy/dx = (dr/dθ·sinθ + r cosθ)/(dr/dθ·cosθ − r sinθ)"
        ],
        formulas: [
          { name: "极-直角转换", expr: "x=r cosθ，y=r sinθ，r²=x²+y²" },
          { name: "极坐标面积", expr: "A = ½∫_{α}^{β} r² dθ" },
          { name: "两曲线面积", expr: "A = ½∫_{α}^{β} (r_outer² − r_inner²) dθ" },
          { name: "心形线", expr: "r = a(1 ± cosθ)，面积 = (3/2)πa²" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】面积积分的角度范围设定错误（必须覆盖曲线的一个完整循环，对称曲线可取一半再乘2）；积分时r²展开错误（特别是含(1+cosθ)²时需展开为1+2cosθ+cos²θ再用倍角公式化简）；玫瑰线花瓣数计算错误；极坐标草图时未标注r=0的点（切换花瓣位置的关键）。",
        examTips: "极坐标面积题：① 先画草图并标注关键点；② 确定积分范围（使曲线围成目标区域）；③ 计算r²并展开；④ 用倍角公式化简cos²θ；⑤ 积分。每步都展示出来，草图和积分范围各占方法分。",
        youtube: [
          { title: "P4 Polar Coordinates草图与面积 — TLMaths", url: "https://www.youtube.com/results?search_query=P4+polar+coordinates+curves+area+edexcel+IAL+A+level", channel: "TLMaths" },
          { title: "Polar Curves Sketching & Area — ExamSolutions", url: "https://www.youtube.com/results?search_query=polar+coordinates+sketch+area+integral+A+level+edexcel", channel: "ExamSolutions" },
          { title: "Polar Coordinates WMA14 — Bicen Maths", url: "https://www.youtube.com/results?search_query=polar+coordinates+WMA14+P4+edexcel+IAL+bicen+maths", channel: "Bicen Maths" }
        ]
      },
      {
        id: "p4c7", num: 7, title: "Further Calculus 进阶微积分",
        overview: "P4进阶微积分引入麦克劳林级数（Maclaurin Series）展开函数为无穷多项式，以及更复杂的积分技术（包括三角换元和还原公式Reduction Formula）。Maclaurin级数是数值计算和物理近似的基础工具，也是串联P4复数与双曲函数的纽带（e^{iθ}的级数展开直接证明欧拉公式）。通常占WMA14共10–14分。",
        keyPoints: [
          "麦克劳林级数定义：f(x) = f(0) + f'(0)x + f''(0)x²/2! + f'''(0)x³/3! + ...，在x=0处展开",
          "标准展开式（必须背诵）：eˣ = 1 + x + x²/2! + x³/3! + ...（所有x）",
          "sin x = x − x³/3! + x⁵/5! − ...（奇函数，只有奇次项）",
          "cos x = 1 − x²/2! + x⁴/4! − ...（偶函数，只有偶次项）",
          "ln(1+x) = x − x²/2 + x³/3 − ...（|x| < 1）",
          "(1+x)ⁿ = 1 + nx + n(n−1)x²/2! + ...（广义二项式，|x|<1时n为负数或分数）",
          "级数的有效范围：只在收敛区间内使用（如ln(1+x)要求|x|<1）",
          "复合函数展开：将f(g(x))中g(x)代入标准展开式，展开并截取到所需次数",
          "三角换元积分：如∫√(a²−x²)dx，令x=asinθ，化为三角函数积分",
          "还原公式（Reduction Formula）：Iₙ = f(n)·Iₙ₋₂ 或类似递推关系，用于计算∫sinⁿx dx等",
          "级数展开的精度与近似：保留到x³项的近似在x接近0时效果最佳"
        ],
        formulas: [
          { name: "Maclaurin级数", expr: "f(x)=Σ f^{(n)}(0)·xⁿ/n!" },
          { name: "eˣ级数", expr: "eˣ = 1+x+x²/2!+x³/3!+... （对所有x）" },
          { name: "sin x级数", expr: "sin x = x−x³/3!+x⁵/5!−... （所有x）" },
          { name: "cos x级数", expr: "cos x = 1−x²/2!+x⁴/4!−... （所有x）" },
          { name: "ln(1+x)级数", expr: "ln(1+x)=x−x²/2+x³/3−...（|x|<1）" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】麦克劳林系数中的阶乘！（n!）遗漏或计算错误；合成函数展开时，代入g(x)后未正确合并同次幂项；ln(1+x)级数在|x|≥1处使用（无效！）；三角换元后积分完成，回代时未用三角关系还原x的表达式。还原公式推导要求完整展示两次分部积分，且最终须移项解Iₙ方程。",
        examTips: "麦克劳林展开题：① 计算f(0), f'(0), f''(0), f'''(0)；② 代入公式；③ 检查次数（题目通常要求展开至x³或x⁵）。利用e^{iθ}=cosθ+i sinθ和级数展开可以推导欧拉公式，是P4综合题中的高分材料。",
        youtube: [
          { title: "P4 Maclaurin Series麦克劳林 — TLMaths", url: "https://www.youtube.com/results?search_query=P4+Maclaurin+series+edexcel+IAL+A+level+further+calculus", channel: "TLMaths" },
          { title: "Reduction Formulae & Trig Substitution — ExamSolutions", url: "https://www.youtube.com/results?search_query=reduction+formula+integration+trigonometric+substitution+A+level+edexcel", channel: "ExamSolutions" },
          { title: "Maclaurin & Further Integration WMA14 — Bicen Maths", url: "https://www.youtube.com/results?search_query=Maclaurin+series+further+integration+WMA14+bicen+maths", channel: "Bicen Maths" }
        ]
      },
      {
        id: "p4c8", num: 8, title: "Second-Order Differential Equations 二阶微分方程",
        overview: "二阶常系数微分方程在物理振动（简谐运动、阻尼振荡）、电路分析（RLC电路）和结构工程中无处不在。P4要求建立并求解形如 d²y/dx² + a(dy/dx) + by = f(x) 的方程，步骤分为求齐次方程的\"互补函数（Complementary Function, CF）\"和特殊解（Particular Integral, PI），二者相加得通解。不同类型的PI对应不同的\"猜答案\"策略，是本章最需反复练习的技能。",
        keyPoints: [
          "二阶方程形式：a(d²y/dx²) + b(dy/dx) + cy = f(x)",
          "辅助方程（Auxiliary Equation）：am² + bm + c = 0，解m₁, m₂决定CF形式",
          "CF类型1（两实不同根）：y = Ae^{m₁x} + Be^{m₂x}",
          "CF类型2（两相等实根）：y = (A + Bx)e^{mx}",
          "CF类型3（两共轭复根 p±qi）：y = e^{px}(Acosqx + Bsinqx)",
          "特解（PI）选取：f(x)=常数→试PI=k；f(x)=多项式→试PI=同次多项式；f(x)=e^{kx}→试PI=λe^{kx}",
          "f(x)=sin/cosnx→试PI=Pcosnx+Qsinnx（即使只有一种，也要同时含两者！）",
          "特殊情形：若试PI与CF中某项重复，则PI乘以额外因子x（或x²）",
          "通解 = CF + PI；初始条件代入通解确定A, B两个常数",
          "初始条件代入：通常给y(0)=...和y'(0)=...，需要先求dy/dx再代入",
          "阻尼类型分类：过阻尼（两不同实根）、临界阻尼（重根）、欠阻尼（复根）"
        ],
        formulas: [
          { name: "辅助方程", expr: "am²+bm+c=0，由此确定CF" },
          { name: "CF（复根）", expr: "若m=p±qi：CF=e^{px}(Acospx+Bsinpx)" },
          { name: "PI（指数型）", expr: "f(x)=e^{kx}时，试PI=λe^{kx}；若重合则试λxe^{kx}" },
          { name: "PI（三角型）", expr: "f(x)=sin/cosnx时，PI=Acosnx+Bsinnx" },
          { name: "通解", expr: "y = CF + PI，用初始条件确定CF中的A, B" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】PI与CF重合时忘记乘x因子（导致PI代入方程后恒为0，无法确定系数）；CF中复根类型的PI猜测格式正确但求导时链式法则漏掉q因子；初始条件只代入y方程而忘记对dy/dx方程也要代入（通常需要两个方程联立解A, B）；三角函数PI中只猜一种（sin或cos），而正确格式应同时含Acosnx+Bsinnx。",
        examTips: "标准流程：① 写出辅助方程并求解m₁, m₂；② 根据根的类型写出CF（三种形式）；③ 按f(x)类型猜PI格式；④ 代入原方程比较系数求PI参数；⑤ 通解=CF+PI；⑥ 代入初始条件求A, B。每步明确标记，考官按步骤给分。",
        youtube: [
          { title: "P4 Second Order ODE二阶微分方程 — TLMaths", url: "https://www.youtube.com/results?search_query=P4+second+order+differential+equations+CF+PI+edexcel+IAL", channel: "TLMaths" },
          { title: "Complementary Function & Particular Integral — ExamSolutions", url: "https://www.youtube.com/results?search_query=second+order+ODE+complementary+function+particular+integral+A+level+edexcel", channel: "ExamSolutions" },
          { title: "Second Order DEs WMA14完整 — Bicen Maths", url: "https://www.youtube.com/results?search_query=second+order+differential+equations+WMA14+P4+bicen+maths", channel: "Bicen Maths" }
        ]
      }
    ]
  },
  M1: {
    title: "Mechanics 1",
    color: "#0052A5",
    icon: "F",
    chapters: [
      {
        id: "m1c1", num: 1, title: "Mathematical Models & Kinematics 力学数学模型与运动学",
        overview: "力学是应用数学的核心分支，M1以建立清晰的数学模型（质点、刚体、光滑面、轻绳等理想化假设）为起点，引入一维直线运动的SUVAT五个运动学方程。速度-时间图形（v-t graphs）的面积解释（位移）和斜率解释（加速度）是第一章考试的核心。WME01考试总是以一道运动学基础题开场，要求快速、准确地选择并应用正确的SUVAT方程。",
        keyPoints: [
          "力学中的数学模型：质点（Particle）—忽略大小；刚体（Rigid Body）—不可形变；轻绳（Light String）—忽略质量；光滑面（Smooth Surface）—无摩擦",
          "位移（Displacement）s：从出发点到当前位置的有向距离（标量s，向量形式可用矢量）",
          "速度（Velocity）v：位移对时间的导数 v = ds/dt（有方向）；速率（Speed）= |v|（无方向）",
          "加速度（Acceleration）a：速度对时间的导数 a = dv/dt",
          "匀加速运动的SUVAT五方程：① v=u+at；② s=ut+½at²；③ v²=u²+2as；④ s=½(u+v)t；⑤ s=vt−½at²",
          "SUVAT方程的选择策略：列出已知量（s, u, v, a, t），选含目标量和四个已知量的方程",
          "自由落体（Free Fall）：a=g=9.8 m/s²（向下），忽略空气阻力",
          "v-t图形：斜率=加速度；面积=位移（曲线下面积用积分；折线用三角形梯形）",
          "s-t图形：斜率=速度；曲线的弯曲方向反映加速/减速",
          "符号约定：取一个方向为正（通常向上或向右），反方向量为负",
          "平均速度 = 总位移/总时间（与平均速率不同！）"
        ],
        formulas: [
          { name: "SUVAT：v=u+at", expr: "v = u + at（无s，含v, u, a, t）" },
          { name: "SUVAT：s=ut+½at²", expr: "s = ut + ½at²（无v，含s, u, a, t）" },
          { name: "SUVAT：v²=u²+2as", expr: "v² = u² + 2as（无t，含v, u, a, s）" },
          { name: "SUVAT：s=½(u+v)t", expr: "s = ½(u+v)t（无a，含s, u, v, t）" },
          { name: "自由落体", expr: "取向下为正：a=9.8 m/s²（g=9.8）" }
        ],
        difficulty: "Foundation",
        hardPoints: "【高频失分点】SUVAT方程选择错误（没有仔细列出已知量就随意代入）；忘记向量方向的符号（如抛上去的物体到达最高点速度=0，但继续下落时位移s为负）；自由落体时g的方向未与坐标轴符号约定一致。v-t图中，面积可以为负（当图形在t轴下方时），负面积代表反方向位移，计算总路程时取|面积|。",
        examTips: "SUVAT题目解题模板：① 画图并标注已知量；② 列出s, u, v, a, t五个量并填写已知值；③ 选择含有4个已知量+1个目标量的方程；④ 代入计算。若需两步，先求中间量再代入第二个SUVAT方程。",
        youtube: [
          { title: "M1 Kinematics SUVAT完整讲解 — TLMaths", url: "https://www.youtube.com/results?search_query=M1+kinematics+SUVAT+equations+edexcel+IAL+mechanics", channel: "TLMaths" },
          { title: "SUVAT Equations精讲 — ExamSolutions Mechanics", url: "https://www.youtube.com/results?search_query=SUVAT+equations+mechanics+A+level+edexcel+M1", channel: "ExamSolutions" },
          { title: "Mechanics 1 Kinematics WME01 — Bicen Maths", url: "https://www.youtube.com/results?search_query=mechanics+1+kinematics+WME01+edexcel+IAL+bicen", channel: "Bicen Maths" }
        ]
      },
      {
        id: "m1c2", num: 2, title: "Dynamics of a Particle 质点动力学",
        overview: "Newton第二定律 F=ma 是整个力学的核心方程，将力（F）、质量（m）和加速度（a）联系起来。P1运动学给出运动状态，M1动力学解释运动的原因——即力。本章要求学生建立自由体图（Free Body Diagram），对每个物体在每个方向列出合力=ma的方程，然后结合SUVAT求解运动参数。Newton的三个定律对任意力学题目均适用。",
        keyPoints: [
          "Newton第一定律：物体在不受外力（或合力为零）时，保持静止或匀速直线运动",
          "Newton第二定律：F = ma，合力等于质量乘以加速度（向量方程）",
          "Newton第三定律：作用力与反作用力大小相等、方向相反（不作用于同一物体！）",
          "重力（Weight）：W = mg，方向竖直向下（g≈9.8 m/s²）",
          "法向力（Normal Reaction）N：垂直接触面的支持力，方向离开接触面",
          "摩擦力（Friction）：F ≤ μN，在运动极限时F=μN（μ为摩擦系数）",
          "自由体图（Free Body Diagram, FBD）：对每个物体画出所受的所有力，是解题的必要第一步",
          "应用F=ma：对每个方向单独列方程；正方向选择运动方向（统一符号约定）",
          "轻绳（Light String）张力：绳的两端张力相同（绳子质量忽略）",
          "光滑面（Smooth）：无摩擦，法向力垂直于面；粗糙面（Rough）：有摩擦力",
          "Atwood机：两物体通过轻绳跨过轻滑轮，对每个物体分别列F=ma方程再联立"
        ],
        formulas: [
          { name: "Newton第二定律", expr: "F_net = ma（合力=质量×加速度）" },
          { name: "重力", expr: "W = mg（向下，g=9.8 m/s²）" },
          { name: "极限摩擦力", expr: "F_friction = μN（运动时或处于极限平衡时）" },
          { name: "Atwood机", expr: "对重物m₁（下落）：m₁g−T=m₁a；对m₂（上升）：T−m₂g=m₂a" },
          { name: "联立解a", expr: "a=(m₁−m₂)g/(m₁+m₂)（Atwood机）" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】未画自由体图（导致遗漏某个力，如忘记法向力N）；Newton第三定律错误理解——作用力与反作用力不作用在同一物体上，不能互相抵消；Atwood机中两物体加速度大小相同（通过同一轻绳连接），但方向相反；粗糙面问题中法向力N的方向计算错误（斜面时N≠mg）。建议：对每个物体独立画FBD，独立列方程，不要将多物体系统混在一起。",
        examTips: "动力学题目必须展示的步骤：① 自由体图；② 选取正方向；③ 对每个物体列F=ma方程；④ 联立方程求未知量；⑤ 若需位移/速度/时间，再用SUVAT方程。每步省略都可能失去方法分。",
        youtube: [
          { title: "M1 Newton's Laws Dynamics完整讲解 — TLMaths", url: "https://www.youtube.com/results?search_query=M1+Newton+laws+dynamics+F=ma+edexcel+IAL+mechanics", channel: "TLMaths" },
          { title: "Dynamics & Atwood Machine — ExamSolutions M1", url: "https://www.youtube.com/results?search_query=Atwood+machine+Newton+second+law+A+level+mechanics+edexcel", channel: "ExamSolutions" },
          { title: "M1 Dynamics Free Body Diagrams — Bicen Maths", url: "https://www.youtube.com/results?search_query=M1+dynamics+free+body+diagram+WME01+edexcel+IAL", channel: "Bicen Maths" }
        ]
      },
      {
        id: "m1c3", num: 3, title: "Forces & Equilibrium 力与平衡",
        overview: "当物体处于平衡状态（静止或匀速运动）时，合力与合力矩均为零。P3力与平衡章节要求学生将多个力分解为水平和竖直分量，并列出平衡方程解未知力。斜面问题（Inclined Plane）、悬挂物体的张力问题，以及带有摩擦力的边界条件（临界平衡/即将滑动）是WME01的高频考型。Lami定理是处理三力平衡的高效工具。",
        keyPoints: [
          "力的分解：将力F分解为水平分量F cosθ和竖直分量F sinθ（θ为F与水平方向夹角）",
          "平衡条件：合水平力=0；合竖直力=0（两个独立方程）",
          "斜面（Inclined Plane）：建立沿斜面方向和垂直斜面方向的坐标轴，分解重力mg为这两个方向的分量",
          "沿斜面方向：mg sinθ（沿斜面向下）；垂直斜面方向：N = mg cosθ",
          "摩擦力（Friction）F：方向阻碍相对运动（或趋势），大小F ≤ μN",
          "临界平衡（Limiting Equilibrium）：即将滑动时F = μN（相等！）",
          "轻绳的张力：在两端张力相同（绳质量为零）",
          "Lami定理：三力平衡时，F₁/sinα₁ = F₂/sinα₂ = F₃/sinα₃（α为对面角）",
          "力多边形（Polygon of Forces）：多力平衡时，力向量首尾相接形成封闭多边形",
          "重力中心（Center of Gravity/Mass）：均匀物体在几何中心；复合物体用加权平均",
          "连接体（Connected Bodies）：用内力（绳的张力）将系统分割分析"
        ],
        formulas: [
          { name: "力的分解（水平）", expr: "Fₓ = F cosθ（θ为与水平夹角）" },
          { name: "力的分解（竖直）", expr: "Fᵧ = F sinθ" },
          { name: "斜面法向力", expr: "N = mg cosθ（θ为斜面倾角）" },
          { name: "斜面摩擦（下滑）", expr: "F_friction = μN（临界时等号成立）" },
          { name: "Lami定理", expr: "F₁/sin α₁ = F₂/sin α₂ = F₃/sin α₃（三力平衡）" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】斜面上重力分解角度弄错（应相对斜面方向，而非绝对水平/竖直）；摩擦力方向画错（应与运动方向或运动趋势方向相反）；临界平衡时F=μN（等号），而非F<μN；Lami定理中\"对面角\"的识别（每个力对应其对面的角，即另两个力夹角的补角的正弦）。建议：每道力学题先画受力分析图，用不同颜色标注不同类型的力。",
        examTips: "斜面问题标准步骤：① 画受力图（标注mg, N, F_friction, 和任何其他力）；② 建立坐标轴（沿斜面和垂直斜面）；③ 分解各力到两个轴上；④ 列平衡方程（两个方向各一个）；⑤ 联立求解。指定\"临界平衡\"或\"即将滑动\"时，F=μN是必要的第三个方程。",
        youtube: [
          { title: "M1 Forces Equilibrium斜面摩擦 — TLMaths", url: "https://www.youtube.com/results?search_query=M1+forces+equilibrium+inclined+plane+friction+edexcel+IAL", channel: "TLMaths" },
          { title: "Resolving Forces & Lami's Theorem — ExamSolutions", url: "https://www.youtube.com/results?search_query=resolving+forces+equilibrium+Lami+theorem+A+level+mechanics", channel: "ExamSolutions" },
          { title: "M1 Statics Forces WME01 — Bicen Maths", url: "https://www.youtube.com/results?search_query=M1+statics+forces+WME01+edexcel+IAL+bicen+maths", channel: "Bicen Maths" }
        ]
      },
      {
        id: "m1c4", num: 4, title: "Moments 力矩",
        overview: "力矩（Moment）描述力使物体绕某点旋转的趋势，是刚体平衡分析的关键工具。当物体处于旋转平衡时，顺时针力矩之和等于逆时针力矩之和（力矩平衡原理）。本章涵盖均匀梁（Uniform Beam）、悬臂结构和非均匀梁的平衡问题。力矩题目是WME01最能拉开档次的题型——看似简单的均匀梁问题在复杂支撑条件下需要极为细心的计算。",
        keyPoints: [
          "力矩定义：Moment = 力 × 垂直距离（从力作用线到转轴的垂直距离）",
          "力矩的单位：N·m（牛·米）",
          "力矩的方向：顺时针（Clockwise, CW）或逆时针（Anticlockwise, ACW）",
          "力矩平衡（Principle of Moments）：对任意点取矩，顺时针力矩总和 = 逆时针力矩总和",
          "合力为零（Equilibrium）：∑水平力=0；∑竖直力=0；∑力矩=0（三个方程）",
          "均匀梁（Uniform Beam/Rod）：重力集中在梁的中点",
          "非均匀梁：题目给出质心位置，重力在质心处作用",
          "支点（Fulcrum/Pivot）：取矩时通常取支点（未知反作用力在此处，力矩为零，方程简化）",
          "悬挂物体：悬挂点处的张力向上，等于整个系统重量（若绳竖直）",
          "梁的反力：若梁由两个支点支撑，对一个支点取矩可求另一个支点反力（未知量减少）",
          "力偶（Couple）：大小相等、方向相反的一对非共线力，产生纯转动效应"
        ],
        formulas: [
          { name: "力矩", expr: "M = F × d（F为力，d为到转轴的垂直距离）" },
          { name: "力矩平衡", expr: "∑M_CW = ∑M_ACW（取矩点任意）" },
          { name: "均匀梁重心", expr: "重力mg作用于梁中点（L/2处）" },
          { name: "两支点反力", expr: "对支点A取矩：R_B × L = mg × d（d为重心到A的距离）" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】取矩点选择不当（应选含未知反力的点，使未知量的力矩为零，简化方程）；力矩计算时使用的距离不是垂直距离（必须是力到转轴的垂直距离）；非均匀梁中重心位置读取错误；多支点题目中力矩方向（CW/ACW）判断错误导致符号错误。建议：每次取矩前先明确标注转动中心（红圈），再逐一计算每个力的力矩大小和方向。",
        examTips: "取矩策略：选择包含最多未知力的点作为转矩中心（这些未知力的力矩为零），使方程只含一个未知数。结合∑F=0方程，通常三个方程可解三个未知量。力矩题一定要标注力的方向（CW/ACW），正负号混淆是最常见的失分原因。",
        youtube: [
          { title: "M1 Moments均匀梁平衡 — TLMaths", url: "https://www.youtube.com/results?search_query=M1+moments+uniform+beam+equilibrium+edexcel+IAL+mechanics", channel: "TLMaths" },
          { title: "Principle of Moments — ExamSolutions A Level", url: "https://www.youtube.com/results?search_query=principle+of+moments+beam+A+level+mechanics+edexcel+M1", channel: "ExamSolutions" },
          { title: "M1 Moments WME01 — Bicen Maths", url: "https://www.youtube.com/results?search_query=moments+WME01+M1+edexcel+IAL+bicen+maths", channel: "Bicen Maths" }
        ]
      },
      {
        id: "m1c5", num: 5, title: "Work, Energy & Power 功、能量与功率",
        overview: "功-能定理（Work-Energy Theorem）将力的效果与物体动能变化联系起来：合外力做的功等于动能的变化量。机械能守恒定律（仅保守力做功时）简化了许多不需要求加速度就能直接求速度的问题。功率 P=Fv 是描述发动机工作效率的核心量。WME01中能量方法题目通常比F=ma方法更简洁，选择正确方法能节省大量时间。",
        keyPoints: [
          "功（Work Done）：W = F × d × cosθ，θ为力F与位移d的夹角",
          "正功：力与运动方向相同（θ<90°）；负功：力与运动方向相反（θ>90°，如摩擦力）",
          "动能（Kinetic Energy）：KE = ½mv²",
          "重力势能（Gravitational Potential Energy）：GPE = mgh（h为高度）",
          "功-能定理：合外力做的总功 = 动能变化量：W_net = ΔKE = ½mv²−½mu²",
          "机械能守恒：在只有保守力（如重力）做功时，KE + GPE = 常数",
          "能量守恒含摩擦：初始机械能 − 摩擦力做的功 = 最终机械能",
          "功率（Power）：P = W/t = F × v（F为驱动力，v为速度）",
          "单位：功的单位J（焦耳）；功率单位W（瓦）；1W = 1J/s",
          "最大功率下的最大速度：P_max = F_drive × v_max，当加速度=0时（驱动力=阻力）",
          "弹性势能（Elastic PE，若考纲含胡克定律）：EP = ½kx²",
          "效率（Efficiency）：η = 有用功/总功 = 有用功率/总功率"
        ],
        formulas: [
          { name: "功", expr: "W = Fd cosθ（θ为力与位移夹角）" },
          { name: "动能", expr: "KE = ½mv²" },
          { name: "重力势能", expr: "GPE = mgh" },
          { name: "功-能定理", expr: "W_net = ΔKE = ½mv²−½mu²" },
          { name: "功率", expr: "P = Fv（均匀速度时）；P = W/t（平均功率）" },
          { name: "能量守恒（含摩擦）", expr: "KE₁+PE₁ = KE₂+PE₂ + W_friction" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】功的计算中θ角的确定（是力与位移的夹角，不是与法向的夹角）；摩擦力做负功时符号出错（摩擦力做的功应从总能量中减去，而不是加）；功率题中速度v是瞬时速度而非平均速度；最大速度时忘记说明\"此时加速度为零\"（驱动力=总阻力的判断）。能量方法最大优势：不需要求加速度，一个能量方程直接联系速度与高度变化。",
        examTips: "面对运动题目：先判断是否能用能量方法（避免求加速度）。若题目给出高度变化和速度，优先用能量守恒。若题目涉及摩擦，用 初始能量 = 最终能量 + 摩擦力做的功（正值）。功率题永远记住：最大速度时加速度=0，驱动力=阻力，再用P=Fv求v。",
        youtube: [
          { title: "M1 Work Energy Power完整讲解 — TLMaths", url: "https://www.youtube.com/results?search_query=M1+work+energy+power+kinetic+potential+edexcel+IAL+mechanics", channel: "TLMaths" },
          { title: "Work-Energy Theorem Energy Conservation — ExamSolutions", url: "https://www.youtube.com/results?search_query=work+energy+theorem+conservation+A+level+mechanics+edexcel", channel: "ExamSolutions" },
          { title: "M1 Energy Methods WME01 — Bicen Maths", url: "https://www.youtube.com/results?search_query=energy+methods+WME01+M1+edexcel+IAL+bicen+maths", channel: "Bicen Maths" }
        ]
      },
      {
        id: "m1c6", num: 6, title: "Impulse & Momentum 冲量与动量",
        overview: "动量 p = mv 是描述运动量的向量，冲量 J = Ft = Δp 建立力的时间效应与动量变化的联系。动量守恒定律（在无外力或合外力为零时）是碰撞和爆炸问题的核心工具。Newton第三定律保证碰撞中两物体受到的冲量相等反向，从而整个系统动量守恒。恢复系数（Coefficient of Restitution, e）描述碰撞的弹性程度，是WME01后期高分题的关键参数。",
        keyPoints: [
          "动量（Momentum）：p = mv（向量，单位kg·m/s = N·s）",
          "冲量（Impulse）：J = Ft = Δp = mv − mu（单位N·s）",
          "冲量-动量定理：F×t = m×v − m×u",
          "动量守恒（Conservation of Momentum）：合外力为零时，m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂",
          "Newton碰撞定律（恢复系数）：e = (v₂ − v₁)/(u₁ − u₂)，其中速度均为碰撞方向上的分量",
          "e = 0：完全非弹性碰撞（两物体碰后速度相同）",
          "e = 1：完全弹性碰撞（动能守恒）",
          "0 < e < 1：一般碰撞（动量守恒，动能损失）",
          "碰撞题解法：① 动量守恒方程；② 恢复系数方程；联立求v₁, v₂",
          "多次碰撞：依次对每次碰撞用动量守恒+恢复系数，方向判断很关键",
          "斜碰（Oblique Impact）：垂直于碰撞面方向速度分量改变（受恢复系数影响），平行分量不变"
        ],
        formulas: [
          { name: "动量", expr: "p = mv（向量！方向与速度相同）" },
          { name: "冲量-动量定理", expr: "J = Ft = Δp = mv−mu" },
          { name: "动量守恒", expr: "m₁u₁+m₂u₂ = m₁v₁+m₂v₂（合外力为零）" },
          { name: "恢复系数", expr: "e = (v₂−v₁)/(u₁−u₂)，0≤e≤1" },
          { name: "完全非弹性", expr: "e=0 → v₁=v₂（碰后共速）" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】动量方向符号：必须统一选择正方向，反方向速度取负值；恢复系数公式中u₁和u₂的位置不能互换（e = 分离速度/接近速度，相对应的物体要一一对应）；斜碰中，平行于面的速度分量不变，只有法向分量受e影响；多次碰撞题中，第二次碰撞的初速度来自第一次碰撞的结果。",
        examTips: "碰撞题两个方程：① 动量守恒（m₁u₁+m₂u₂=m₁v₁+m₂v₂）；② 恢复系数（e=(v₂−v₁)/(u₁−u₂)）。统一正方向后，将所有已知速度代入，联立解v₁和v₂。结果中负号表示反方向运动，不代表错误。",
        youtube: [
          { title: "M1 Momentum Impulse Collisions — TLMaths", url: "https://www.youtube.com/results?search_query=M1+momentum+impulse+collision+coefficient+restitution+edexcel+IAL", channel: "TLMaths" },
          { title: "Coefficient of Restitution动量守恒 — ExamSolutions", url: "https://www.youtube.com/results?search_query=coefficient+restitution+momentum+conservation+A+level+mechanics", channel: "ExamSolutions" },
          { title: "Impulse Momentum WME01 — Bicen Maths", url: "https://www.youtube.com/results?search_query=impulse+momentum+WME01+M1+edexcel+IAL+bicen", channel: "Bicen Maths" }
        ]
      },
      {
        id: "m1c7", num: 7, title: "Projectile Motion 抛体运动",
        overview: "抛体运动将水平（匀速）和竖直（匀加速，a=±g）两个方向的运动独立分析。所有抛体问题都依赖于\"水平和竖直方向相互独立\"这一核心原理——时间t是唯一连接两个方向的纽带。轨迹方程 y = x tanθ − gx²/(2u²cos²θ) 将路径表示为二次抛物线，是高分题的常考推导目标。WME01中抛体题通常为最后的大题，占10–14分。",
        keyPoints: [
          "抛体运动的基本分解：水平方向a=0（匀速）；竖直方向a=−g（匀减速上升/加速下降）",
          "初速度分解：u_x = u cosθ（水平初速）；u_y = u sinθ（竖直初速）",
          "水平运动方程：x = u cosθ × t（匀速，无加速度）",
          "竖直运动方程：y = u sinθ × t − ½gt²；v_y = u sinθ − gt",
          "最高点（Maximum Height）：v_y = 0，此时 t = u sinθ / g",
          "最大高度：H = (u sinθ)² / (2g)",
          "水平射程（Range）：R = u²sin2θ / g（落回原高度时，用v_y = −u sinθ求时间）",
          "射程最大的条件：θ = 45°（当u和g固定时）",
          "轨迹方程（消去t）：y = x tanθ − gx² / (2u²cos²θ)（抛物线方程）",
          "着地速度：v_x = u cosθ（水平分量不变）；v_y = 用SUVAT求；|v| = √(v_x²+v_y²)",
          "飞行时间：对称抛体=2×到达最高点的时间；非对称（抛射高度不同）需解二次方程"
        ],
        formulas: [
          { name: "水平位移", expr: "x = u cosθ × t（恒定速度）" },
          { name: "竖直位移", expr: "y = u sinθ × t − ½gt²" },
          { name: "最大高度", expr: "H = (u sinθ)²/(2g)（在v_y=0时）" },
          { name: "水平射程", expr: "R = u²sin(2θ)/g（同高度发射和落地时）" },
          { name: "轨迹方程", expr: "y = x tanθ − gx²/(2u²cos²θ)（抛物线）" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】求飞行时间时，使用y=0求解二次方程，但舍去t=0时（出发时刻），保留非零解；从高台或斜坡发射时射程公式R=u²sin2θ/g不适用，必须用联立方程求t；轨迹方程推导中，消去t后cos²θ出现在分母，需要sec²θ表达；着地角度忘记用arctan(v_y/v_x)而非arctan(v_y/u)。",
        examTips: "抛体题必须分成水平和竖直两个部分独立列方程，用时间t联系两部分。求轨迹方程时：由水平方程得t=x/(u cosθ)，代入竖直方程消去t。最后射程和最大高度公式仅适用于同高度发射-落地情形，其他情形一律从基本方程出发。",
        youtube: [
          { title: "M1 Projectile Motion抛体运动完整 — TLMaths", url: "https://www.youtube.com/results?search_query=M1+projectile+motion+edexcel+IAL+mechanics+A+level", channel: "TLMaths" },
          { title: "Projectile Motion Range Trajectory — ExamSolutions", url: "https://www.youtube.com/results?search_query=projectile+motion+range+trajectory+A+level+edexcel+M1", channel: "ExamSolutions" },
          { title: "M1 Projectiles WME01 — Bicen Maths", url: "https://www.youtube.com/results?search_query=projectile+motion+WME01+M1+edexcel+IAL+bicen+maths", channel: "Bicen Maths" }
        ]
      }
    ]
  }
};

// Past exam papers — Edexcel IAL WMA11 / WMA12 / WMA13 / WMA14 / WST01 / WME01
const PAST_PAPERS = [
  { year: 2024, session: "May/Jun", paper: "P1", code:"WMA11", duration: 90, questions: 11, desc: "Pure Mathematics 1" },
  { year: 2024, session: "May/Jun", paper: "P2", code:"WMA12", duration: 90, questions: 10, desc: "Pure Mathematics 2" },
  { year: 2024, session: "May/Jun", paper: "P3", code:"WMA13", duration: 90, questions: 10, desc: "Pure Mathematics 3" },
  { year: 2024, session: "May/Jun", paper: "P4", code:"WMA14", duration: 90, questions: 9,  desc: "Pure Mathematics 4" },
  { year: 2024, session: "May/Jun", paper: "M1", code:"WME01", duration: 90, questions: 8,  desc: "Mechanics 1" },
  { year: 2024, session: "Jan",     paper: "P3", code:"WMA13", duration: 90, questions: 10, desc: "Pure Mathematics 3" },
  { year: 2024, session: "Jan",     paper: "P4", code:"WMA14", duration: 90, questions: 9,  desc: "Pure Mathematics 4" },
  { year: 2024, session: "Jan",     paper: "M1", code:"WME01", duration: 90, questions: 8,  desc: "Mechanics 1" },
  { year: 2023, session: "May/Jun", paper: "P3", code:"WMA13", duration: 90, questions: 10, desc: "Pure Mathematics 3" },
  { year: 2023, session: "May/Jun", paper: "P4", code:"WMA14", duration: 90, questions: 9,  desc: "Pure Mathematics 4" },
  { year: 2023, session: "May/Jun", paper: "M1", code:"WME01", duration: 90, questions: 8,  desc: "Mechanics 1" },
  { year: 2023, session: "Jan",     paper: "P3", code:"WMA13", duration: 90, questions: 10, desc: "Pure Mathematics 3" },
  { year: 2023, session: "Jan",     paper: "P4", code:"WMA14", duration: 90, questions: 9,  desc: "Pure Mathematics 4" },
  { year: 2023, session: "Jan",     paper: "M1", code:"WME01", duration: 90, questions: 8,  desc: "Mechanics 1" },
  { year: 2024, session: "Jan",     paper: "P1", code:"WMA11", duration: 90, questions: 11, desc: "Pure Mathematics 1" },
  { year: 2024, session: "Jan",     paper: "P2", code:"WMA12", duration: 90, questions: 10, desc: "Pure Mathematics 2" },
  { year: 2023, session: "May/Jun", paper: "P1", code:"WMA11", duration: 90, questions: 11, desc: "Pure Mathematics 1" },
  { year: 2023, session: "May/Jun", paper: "P2", code:"WMA12", duration: 90, questions: 10, desc: "Pure Mathematics 2" },
  { year: 2023, session: "May/Jun", paper: "S1", code:"WST01", duration: 90, questions: 8,  desc: "Statistics 1" },
  { year: 2023, session: "Jan",     paper: "S1", code:"WST01", duration: 90, questions: 8,  desc: "Statistics 1" },
  { year: 2022, session: "May/Jun", paper: "P1", code:"WMA11", duration: 90, questions: 11, desc: "Pure Mathematics 1" },
  { year: 2022, session: "May/Jun", paper: "P2", code:"WMA12", duration: 90, questions: 10, desc: "Pure Mathematics 2" },
  { year: 2022, session: "Oct/Nov", paper: "S1", code:"WST01", duration: 90, questions: 8,  desc: "Statistics 1" },
  { year: 2021, session: "May/Jun", paper: "P1", code:"WMA11", duration: 90, questions: 11, desc: "Pure Mathematics 1" },
];

// ============================================================
// LOCALISATION UTILITIES
// ============================================================

/** Strip CJK characters from mixed Chinese-English text (used for keyPoints) */
function toEn(text) {
  if (!text) return '';
  return text
    .replace(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]+/g, '')
    .replace(/（/g, '(').replace(/）/g, ')')
    .replace(/，/g, ', ').replace(/。/g, '. ')
    .replace(/：/g, ': ').replace(/；/g, '; ')
    .replace(/【/g, '').replace(/】/g, '')
    .replace(/、/g, ', ').replace(/《》〈〉/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[,.:;\s]+/, '')
    .trim();
}

/** Strip the trailing Chinese from bilingual titles like "Algebraic Expressions 代数表达式" */
function titleEn(title) {
  return title.replace(/\s+[\u4e00-\u9fff].*$/, '').trim();
}

/** English overrides for chapter content that is fully in Chinese */
const CHAPTER_EN = {
  // ═══ P1 ═══
  p1c1: {
    overview: "Index Laws, surds, and rationalising the denominator form the foundational algebraic toolkit for all subsequent topics. Mastering exact-value simplification without a calculator is essential. These concepts typically appear as short opening questions in WMA11 worth 4–6 marks.",
    hardPoints: "Frequent errors: sign mistakes with negative exponents; forgetting to rewrite surds as fractional indices before differentiating later in the course; choosing the wrong conjugate when rationalising (particularly three-term denominators). Always extract the largest perfect-square factor first when simplifying surds.",
    examTips: "These marks are among the most accessible on the paper — practise until every simplification is automatic. Never leave a surd in the denominator in a final answer unless the question specifies a different form.",
    formulaNames: ["Fractional Index", "Negative Index", "Conjugate Rationalisation", "Difference of Squares"]
  },
  p1c2: {
    overview: "Quadratics are the most fundamental topic in P1. Completing the square, the quadratic formula, and the discriminant Δ = b²−4ac are prerequisites for P2 circle geometry, line-curve intersections, and more. A* candidates must fluently choose between factorisation, completing the square, and the formula.",
    hardPoints: "Frequent errors: forgetting to factor out 'a' before completing the square when a ≠ 1; sign errors in discriminant calculations (b² is always positive even when b is negative); algebraic slips when expanding substituted intersection equations. Examiners report many students set Δ = 0 correctly for tangency but then make arithmetic errors.",
    examTips: "Choose your method strategically: factorisation for integer roots, completing the square when vertex form or a 'show that' proof is needed, formula otherwise. Always state the discriminant explicitly when determining the number of roots.",
    formulaNames: ["Quadratic Formula", "Completing the Square", "Discriminant", "Vieta's Formulae", "Quadratic Inequality"]
  },
  p1c3: {
    overview: "This chapter covers simultaneous equations (linear-linear and linear-quadratic), absolute value inequalities, and graphical regions. Simultaneous equations are a core technique used across the entire course; inequalities underpin constrained optimisation problems central to economics.",
    hardPoints: "Frequent errors: not reversing the inequality when dividing by a negative; missing one case in absolute value problems; incorrectly shading regions (y > f(x) vs y < f(x)). For absolute value inequalities, use a number line or squaring both sides to avoid sign errors.",
    examTips: "For region questions, plot the boundary curve first, then test a point (e.g., the origin) to determine which side to shade. Show all inequality signs at every algebraic step.",
    formulaNames: ["Absolute Value Inequality (<)", "Absolute Value Inequality (>)", "Always-Positive Condition", "Linear-Quadratic System"]
  },
  p1c4: {
    overview: "Graphs & Transformations builds the visual intuition essential for all subsequent topics. Students must sketch cubic, quartic, and reciprocal curves by hand and understand how translations, stretches, and reflections affect both equations and key coordinates.",
    hardPoints: "Frequent errors: f(x−a) shifts RIGHT not left (the single most common intuitive mistake); f(ax) compresses x-coordinates by factor 1/a, not a; not labelling intercepts and turning points on sketches; confusing the order of combined transformations.",
    examTips: "Use Desmos to verify every transformation before your exam. On sketches, always mark x-intercepts, y-intercepts, and turning points with coordinates — each unlabelled point typically costs a mark.",
    formulaNames: ["Vertical Translation", "Horizontal Translation", "Vertical Stretch", "Horizontal Stretch", "Reflection in x-axis"]
  },
  p1c5: {
    overview: "Straight-line geometry is one of the highest-frequency topics in P1 and the prerequisite for circle geometry in P2 and tangent/normal problems in differentiation. Every equation form and the perpendicularity condition must be automatic.",
    hardPoints: "Frequent errors: using the tangent gradient as the normal gradient (forgetting the negative reciprocal); confusing equations of horizontal lines (y = k) and vertical lines (x = k); incorrect coordinate axis setup in modelling problems.",
    examTips: "When finding the equation of a normal, state its gradient explicitly as −1/m before writing the full equation. Show every algebraic step — examiners award method marks at each stage.",
    formulaNames: ["Gradient", "Point-Gradient Form", "Perpendicularity Condition", "Distance Formula", "Midpoint Formula"]
  },
  p1c6: {
    overview: "This chapter extends trigonometry from right triangles to the Sine Rule and Cosine Rule for any triangle, plus the area formula S = ½ab sinC. The ambiguous case (SSA) — where two valid triangles may exist — is a guaranteed discriminator question every year.",
    hardPoints: "Critical error: arcsin gives only the acute angle — the obtuse supplement (180° − angle) must always be checked. Examiner data shows over 40% of candidates provide only one solution in ambiguous-case questions. Also: retaining too many intermediate decimal places causes inaccurate final answers.",
    examTips: "For every Sine Rule angle calculation, explicitly test both the acute and obtuse solutions. State which is valid given the constraints of the problem and show your reasoning clearly.",
    formulaNames: ["Sine Rule", "Cosine Rule (side)", "Cosine Rule (angle)", "Triangle Area", "Exact Values"]
  },
  p1c7: {
    overview: "Radians are the natural angle unit for calculus — all trig derivative and integral formulas require radian measure. From this chapter onwards, always use Radian mode on your calculator. Arc length l = rθ and sector area A = ½r²θ are frequently tested in concise but tricky applications.",
    hardPoints: "Frequent errors: substituting degrees into l = rθ without converting; forgetting to subtract the triangle area when calculating segment area (segment = sector − triangle); calculator remaining in Degree mode during an exam.",
    examTips: "Write 'RAD ✓' at the top of your exam paper after checking your calculator mode. The formulas l = rθ and A = ½r²θ are on the formula sheet — identify r and θ correctly from every diagram.",
    formulaNames: ["Arc Length", "Sector Area", "Segment Area", "Degrees–Radians Conversion"]
  },
  p1c8: {
    overview: "Differentiation is the crown of A-Level Mathematics. P1 builds from First Principles to the Power Rule, then applies derivatives to tangent/normal equations, stationary point classification, and optimisation. Worth 15–20 marks in WMA11 — A* candidates must score near-perfectly here.",
    hardPoints: "Frequent errors: differentiating products without expanding first; confusing tangent and normal gradients; finding a stationary x-value but forgetting to substitute back for y; not verifying whether a stationary point is a max, min, or inflection. Optimisation requires six explicit steps: define → equation → differentiate → set = 0 → solve → verify.",
    examTips: "Always expand or simplify before differentiating — never attempt to differentiate a product or quotient directly without the Product/Quotient Rule. For optimisation, show all six steps; each omitted step loses method marks.",
    formulaNames: ["Power Rule", "First Principles", "Tangent Equation", "Normal Equation", "Second Derivative Classification"]
  },
  p1c9: {
    overview: "Integration is the reverse of differentiation. P1 focuses on indefinite integration — finding antiderivatives using the Power Rule, and using given points to determine the constant C. Foundation for P2 definite integrals and area calculations. Worth 10–15 marks in WMA11.",
    hardPoints: "Frequent errors: omitting the constant of integration + C (the single most reported error in Edexcel examiner reports); not expanding or simplifying before integrating; power rule slips (e.g., writing x³ instead of x³/3); errors simplifying fractional-index results. Mantra: 'raise the power by one, divide by the new power, add C'.",
    examTips: "Every indefinite integral must end with + C. After integrating, verify by differentiating your result — it should recover the original integrand. Always expand or simplify the integrand completely before integrating.",
    formulaNames: ["Power Rule for Integration", "Constant Integration", "Negative Index Integration", "Fractional Index Integration", "Verification"]
  },
  // ═══ P2 ═══
  p2c1: {
    overview: "P2 opens with polynomial long division, the Factor Theorem, the Remainder Theorem, and four methods of mathematical proof. 'Show that' and 'Prove that' questions worth 8–10 marks in WMA12 require complete logical rigour — this is where examiners test academic sharpness.",
    hardPoints: "Frequent errors: sign slips in long division (especially the subtraction step); substituting the wrong value in the Remainder Theorem — for (2x + 3), substitute x = −3/2, not 3/2; skipping steps in proofs; after finding a counter-example, not explicitly stating why the statement is false.",
    examTips: "In proof questions, write every logical step — do not skip algebra. Use the Factor Theorem to identify one root first, then long-divide to reduce degree. Always verify your remainder by substitution.",
    formulaNames: ["Division Algorithm", "Factor Theorem", "Remainder Theorem", "Even Number Definition", "Odd Number Definition"]
  },
  p2c2: {
    overview: "P2 extends coordinate geometry to circles: standard and general forms, line-circle intersection, and the key property that a tangent is perpendicular to the radius. Worth 5–9 marks as a structured multi-part question drawing on P1 completing-the-square and discriminant skills.",
    hardPoints: "Frequent errors: completing the square incorrectly when converting general to standard form (especially when coefficients ≠ 1); not verifying m_tangent × m_radius = −1; algebraic errors when substituting a line into the circle equation, producing an incorrect discriminant.",
    examTips: "Every circle problem: identify the centre and radius first, written clearly. For tangent problems, always show the perpendicularity condition explicitly — even a correct answer without the reasoning loses method marks.",
    formulaNames: ["Standard Form", "General Form", "Tangency Condition", "Tangent ⊥ Radius", "Chord Perpendicular Bisector"]
  },
  p2c3: {
    overview: "Exponentials & Logarithms is one of the most challenging chapters in P2 (Advanced), covering log laws, change of base, exponential equations, and the critical Reduction to Linear Form technique — converting y = axⁿ or y = abˣ into a straight-line model. Directly linked to S1 regression. Worth 10–14 marks in WMA12.",
    hardPoints: "Frequent errors: misapplying log laws (log(M+N) ≠ logM + logN — this is fundamentally wrong); confusing gradient vs intercept when linearising; forgetting to discard invalid solutions where eˣ would need to be negative; inverting the change-of-base formula.",
    examTips: "For Reduction to Linear Form, always write the explicit form Y = mX + c, state what X and Y represent, then identify the gradient and intercept in terms of the original parameters a, b, n, k. This structured three-part approach earns all available marks.",
    formulaNames: ["Log Law (product)", "Log Law (power)", "Change of Base", "Solving Exponential Equations", "Linearisation y=axⁿ", "Linearisation y=abˣ"]
  },
  p2c4: {
    overview: "The Binomial Theorem expands (a + b)ⁿ as a polynomial using combination coefficients C(n,r). P2 focuses on complete expansions and rapid extraction of specific term coefficients. Questions are concise but errors in a combination or sign typically cost all marks for that part.",
    hardPoints: "Frequent errors: r starts at 0, so the (r+1)-th term contains bʳ — off-by-one errors are common; sign errors when b is negative (e.g., in (1−2x)⁵, b = −2x must be raised carefully to avoid sign mistakes); combination arithmetic errors for large n.",
    examTips: "For 'find the coefficient of xᵏ' questions, go directly to the general term T_{r+1} = C(n,r)·aⁿ⁻ʳ·bʳ. Identify a, b, n explicitly first, then solve for r by matching powers. Never expand the full expression for a coefficient question.",
    formulaNames: ["Binomial Theorem", "Combination C(n,r)", "General Term", "(1+x)ⁿ Expansion"]
  },
  p2c5: {
    overview: "Sequences & Series covers arithmetic progressions (AP), geometric progressions (GP), sigma notation, and infinite geometric series. The convergence condition |r| < 1 for infinite GPs and the sum formulas are regularly assessed. Recurrence relations add an algebraic dimension.",
    hardPoints: "Frequent errors: applying the infinite GP formula when |r| ≥ 1 (invalid); confusing aₙ (nth term) with Sₙ (sum to n terms) in the AP sum formula; arithmetic slips in GP common ratio — always verify r = a₂/a₁ = a₃/a₂.",
    examTips: "Always state the first term and common difference/ratio at the start of any AP/GP problem — this earns the method mark even if later algebra fails. For infinite GPs, always verify |r| < 1 explicitly before applying S∞ = a/(1−r).",
    formulaNames: ["AP nth Term", "AP Sum", "GP nth Term", "GP Sum (finite)", "Infinite GP Sum", "Convergence Condition"]
  },
  p2c6: {
    overview: "Trigonometric Identities is the highest-failure-rate chapter in WMA12 per examiner reports. The Pythagorean identities enable simplification and proof. Solving trig equations in specified intervals using CAST requires a systematic, complete approach — missing solutions is the leading cause of mark loss.",
    hardPoints: "Critical errors: not finding all solutions in the given interval (missing second-quadrant or period-based solutions); applying identities in the wrong direction; failing to check domain restrictions (tan θ undefined at 90°, 270°); sign errors when squaring to use Pythagorean identities.",
    examTips: "Trig equation method: (1) rearrange to single trig function; (2) apply identities if needed; (3) find the principal value; (4) use CAST to find ALL solutions in the interval; (5) check boundary values. Never stop at one solution — examiners penalise incomplete solution sets heavily.",
    formulaNames: ["Pythagorean Identity (sin/cos)", "Pythagorean Identity (tan/sec)", "CAST Quadrants", "Interval Solutions"]
  },
  p2c7: {
    overview: "P2 Differentiation builds on P1 to include second-derivative classification of stationary points, increasing/decreasing interval analysis, and optimisation modelling. The focus is applying derivatives as rigorous analytical tools rather than computation.",
    hardPoints: "Frequent errors: when d²y/dx² = 0 at a stationary point, incorrectly concluding it must be an inflection — further sign-change analysis of dy/dx is required; forgetting the y-coordinate after finding the stationary x; in optimisation, not verifying whether the critical point is a maximum or minimum.",
    examTips: "For stationary points: try the second derivative first. If it equals zero, use a sign-change table for dy/dx on either side. In optimisation, always conclude by stating the maximum/minimum value in the real-world context of the problem.",
    formulaNames: ["Power Rule", "Second Derivative Test", "Monotonicity", "Optimisation Procedure"]
  },
  p2c8: {
    overview: "P2 Integration covers definite integrals, area under curves (including regions below the x-axis), and the Trapezium Rule with over/underestimate analysis. These techniques appear in 10–14 mark questions requiring careful attention to sign conventions for sub-axis regions.",
    hardPoints: "Frequent errors: treating below-axis area as negative (area is |∫f(x)dx|, always positive); not splitting the integral where the curve crosses the x-axis; Trapezium Rule arithmetic errors; stating the wrong direction for the Trapezium Rule estimate (depends on curve concavity, not the analyst's preference).",
    examTips: "Always sketch the curve and shade the region before integrating — this reveals whether the curve dips below the x-axis. For the Trapezium Rule, always state whether it gives an overestimate or underestimate and explain why in terms of concavity.",
    formulaNames: ["Definite Integral", "Area Under Curve", "Area Below x-axis", "Trapezium Rule", "Fundamental Theorem"]
  },
  // ═══ S1 ═══
  s1c1: {
    overview: "Mathematical Modelling introduces the statistical modelling cycle: observe → hypothesis → model → collect data → validate → refine. Understanding the difference between interpolation (reliable) and extrapolation (unreliable) is the key conceptual point assessed in 2–4 mark questions.",
    hardPoints: "Common errors: describing the modelling cycle steps in the wrong order or missing the 'refine' stage; when asked to critique a model, failing to address whether extrapolation is being used or whether data is representative.",
    examTips: "Memorise the 6-step modelling cycle in order. For 'criticise a model' questions, focus on: (1) is it linear? (2) is it a random/representative sample? (3) is any prediction an extrapolation? One clear sentence per criticism is sufficient.",
    formulaNames: ["Modelling Cycle", "Interpolation vs Extrapolation", "Residual"]
  },
  s1c2: {
    overview: "Measures of Location (mean, median, mode) and Spread (variance, standard deviation, IQR) form the statistical foundation of S1. The coding transformation y = (x−a)/b and its effect on summary statistics is a high-value topic appearing in almost every WST01 paper.",
    hardPoints: "Frequent errors: using the wrong variance formula — σ² = Σx²/n − x̄² is more efficient than Σ(x−x̄)²/n; applying coding incorrectly: the mean transforms as x̄ = bȳ + a; forgetting that only the scale factor |b| affects the standard deviation — the shift a does not.",
    examTips: "Always state the coding formula explicitly, then transform statistics. Mean transforms by both shift and scale; standard deviation transforms by |scale| only. Verify with a simple numerical example if uncertain.",
    formulaNames: ["Mean (frequency table)", "Variance", "Coding: Mean", "Coding: Standard Deviation", "IQR"]
  },
  s1c3: {
    overview: "Data Representation covers histograms (frequency density, not frequency), stem-and-leaf diagrams, box plots, cumulative frequency curves, and the 1.5×IQR outlier rule. Interpreting skewness and constructing displays correctly is assessed in 8–12 mark questions.",
    hardPoints: "Critical error: drawing histograms with frequency (not frequency density) on the y-axis — the most penalised histogram mistake. Also: interpolating quartiles from the wrong class; misidentifying skew direction (positive skew has a right tail and mean > median > mode).",
    examTips: "Histogram rule: y-axis must be labelled 'Frequency Density'; bar area = frequency. Outlier formula: lower bound = Q1 − 1.5×IQR; upper bound = Q3 + 1.5×IQR. Values outside these bounds are outliers.",
    formulaNames: ["Frequency Density", "Outlier (lower)", "Outlier (upper)", "Quartile from CF Curve", "Skewness"]
  },
  s1c4: {
    overview: "Probability covers the addition and multiplication rules, the critical distinction between mutually exclusive and independent events, conditional probability P(A|B) = P(A∩B)/P(B), and tree diagrams for sampling with and without replacement. This is the highest conceptual-difficulty chapter in S1.",
    hardPoints: "Critical conceptual error: confusing mutually exclusive (P(A∩B) = 0) with independent (P(A∩B) = P(A)·P(B)) — these are completely different properties. Also: using conditional probability in the wrong direction (P(A|B) ≠ P(B|A)); updating 'without replacement' probabilities incorrectly on second branches of tree diagrams.",
    examTips: "To prove independence: always show P(A∩B) = P(A) × P(B) explicitly — stating the rule without calculation earns no marks. For 'without replacement' trees: update all second-branch probabilities after the first draw.",
    formulaNames: ["Addition Rule", "Multiplication Rule", "Mutually Exclusive", "Independence", "Conditional Probability", "Complement Rule"]
  },
  s1c5: {
    overview: "Correlation & Regression covers PMCC r = Sxy/√(Sxx·Syy) and the regression line ŷ = a + bx. Contextual interpretation of the gradient and intercept — in the real-world language of the problem — is the most heavily penalised area in WST01 according to every recent examiner report.",
    hardPoints: "Most commonly lost marks: not interpreting b in context ('b is the slope' scores zero — required: 'for each additional [x-unit], y changes on average by b [y-unit]'); computing Σxy incorrectly (do not confuse with (Σx)(Σy)); not addressing extrapolation reliability when predicting.",
    examTips: "Interpretation template — gradient: 'For every additional [x-unit], the predicted [y] increases/decreases by |b| [y-unit].' Intercept: 'When [x] = 0, predicted [y] = a — state whether this is realistic.' Use your calculator to verify r, a, b before writing.",
    formulaNames: ["PMCC", "Sxy", "Sxx", "Regression Slope b", "Regression Intercept a"]
  },
  s1c6: {
    overview: "Discrete Random Variables introduce the formal framework for expectation E(X), variance Var(X), and linear transformations. The Binomial Distribution B(n,p) is the most important special case and appears in almost every WST01 paper worth 6–10 marks.",
    hardPoints: "Frequent errors: confusing E(X²) with [E(X)]² — Var(X) = E(X²) − [E(X)]²; applying linear transformation rules incorrectly — Var(aX+b) = a²Var(X), the constant b does not affect variance; failing to verify all four Binomial conditions (fixed n, independent trials, constant p, binary outcomes).",
    examTips: "Always calculate E(X²) using a table with columns x, P(X=x), x²P(X=x) — do not skip the intermediate column. For Binomial probabilities, write the formula P(X=r) = C(n,r)pʳ(1−p)ⁿ⁻ʳ before substituting numbers.",
    formulaNames: ["Expectation", "Variance", "Linear Transform (E)", "Linear Transform (Var)", "Binomial Distribution", "Binomial Mean & Variance"]
  },
  s1c7: {
    overview: "The Normal Distribution N(μ, σ²) is the culminating topic of WST01, typically worth 10–14 marks. Standardisation Z = (X−μ)/σ converts any normal to N(0,1). Finding unknown μ or σ from given probabilities requires simultaneous standardisation equations — the definitive A*-grade challenge in S1.",
    hardPoints: "Critical error: the second parameter in X~N(μ, σ²) is the VARIANCE σ², not the standard deviation — dividing by σ² when standardising is an extremely costly mistake. Also: forgetting to apply symmetry for negative z-values; converting P(X > a) = p to P(X < a) = 1−p before standardising.",
    examTips: "Always draw the normal curve and shade the required region before calculating. Template: (1) write X~N(μ,σ²); (2) standardise Z=(X−μ)/σ; (3) express as Φ(z); (4) apply symmetry if z < 0; (5) calculate. For finding μ and σ: form two standardisation equations and solve simultaneously.",
    formulaNames: ["Standardisation", "Symmetry Property", "Interval Probability", "Inverse Normal", "Simultaneous Equations for Parameters"]
  },
  // ═══ P3 ═══
  p3c1: {
    overview: "Partial Fractions decompose complex rational expressions into simpler fractions, enabling integration of expressions that would otherwise be impossible to integrate directly. Improper fractions must be reduced by polynomial long division first. This technique is the gateway to P3 integration.",
    hardPoints: "Frequent errors: attempting to decompose an improper fraction without long division first; sign errors in Cover-up substitution; omitting the B/(ax+b)² term for repeated factors; writing constant B instead of Bx+C for irreducible quadratic denominators.",
    examTips: "Always determine first whether the fraction is proper (numerator degree < denominator degree) or improper. Use Cover-up for each linear factor, then verify by expanding. WMA13 almost always uses partial fractions as a stepping stone to integration.",
    formulaNames: ["Linear Factor Decomposition", "Repeated Factor Cover-up", "Cover-up Rule", "Improper Fraction: Long Division First"]
  },
  p3c2: {
    overview: "Functions introduces the rigorous language of domain, range, one-to-one mapping, inverse functions, composite functions, and the modulus function. These concepts are applied throughout P3 and are directly tested in modelling questions.",
    hardPoints: "Frequent errors: reversing the order in composite functions gf(x) — apply f first, then g; forgetting to restrict the domain of the inverse function to equal the range of the original; solving |f(x)| = k by finding only one solution instead of two.",
    examTips: "When asked to 'state the range of f', give the answer as an inequality or set — a single value is never the range. For composite functions, trace the chain clearly: input x → apply f → apply g to the result.",
    formulaNames: ["Composite Function", "Inverse Function Domain/Range", "Graph of f and f⁻¹", "Modulus Function"]
  },
  p3c3: {
    overview: "P3 Trigonometry covers sec, cosec, cot; addition and double-angle formulas; and the Harmonic Form asinθ + bcosθ = Rsin(θ + α). The Harmonic Form for finding max/min values appears in virtually every WMA13 paper.",
    hardPoints: "Critical errors: the ∓ sign in cos(A±B) reversed relative to sin; choosing wrong triangle sides for α in Harmonic Form; selecting the wrong form of cos2A (three forms available); missing solutions when solving trig equations after Harmonic Form conversion.",
    examTips: "Harmonic Form procedure: expand Rsin(θ+α), match coefficients to get Rcosα = a and Rsinα = b, then compute R = √(a²+b²) and α = arctan(b/a) — always check the quadrant of α carefully.",
    formulaNames: ["sec, cosec, cot", "Pythagorean Extensions", "sin Addition Formula", "cos Addition Formula", "sin 2A and tan 2A", "Three forms of cos 2A", "Harmonic R Form"]
  },
  p3c4: {
    overview: "P3 Exponentials & Logarithms focuses on differentiating and integrating e^{f(x)} and ln[f(x)} using the Chain Rule. The key integration pattern ∫f'(x)/f(x)dx = ln|f(x)| + C is a high-frequency exam technique.",
    hardPoints: "Frequent errors: writing ∫(1/x)dx = ln x instead of ln|x| (missing absolute value); omitting the Chain Rule factor f'(x) when differentiating ln[f(x)]; failing to spot the logarithmic integral pattern when the numerator is a scalar multiple of the derivative of the denominator.",
    examTips: "To identify a logarithmic integral: check whether the numerator is proportional to the derivative of the denominator. If yes, adjust the constant factor and write the answer as a multiple of ln|denominator|.",
    formulaNames: ["Derivative of e^{kx}", "Derivative of ln f(x)", "Integral of e^{kx}", "Logarithmic Integral Pattern"]
  },
  p3c5: {
    overview: "P3 Differentiation introduces the Chain, Product, and Quotient Rules, plus implicit and parametric differentiation and derivatives of all six trig functions. Worth ~20 marks in WMA13 — the highest-scoring single topic.",
    hardPoints: "Frequent errors: omitting one term in the Product Rule (u'v + uv' — both terms required); reversing the numerator order in the Quotient Rule (must be vu' − uv', not the reverse); forgetting to multiply by dy/dx when implicitly differentiating y terms; not substituting the t-value after finding dy/dx for a parametric question.",
    examTips: "Before differentiating, identify the function type: composite → Chain Rule; product → Product Rule; quotient → Quotient Rule. Always write out u, v, u', v' explicitly — examiners give method marks for correctly stated components.",
    formulaNames: ["Chain Rule", "Product Rule", "Quotient Rule", "Derivative of tan x", "Implicit Differentiation", "Parametric Differentiation"]
  },
  p3c6: {
    overview: "P3 Integration covers integration by substitution, integration by parts (LIATE), partial fractions, and trigonometric identities. Questions are typically 8–16 marks requiring a sequence of techniques — identifying the correct method is the core skill.",
    hardPoints: "Frequent errors: forgetting to replace dx when substituting (must convert dx to du/g'(x)); not updating limits in definite integration by substitution; choosing the wrong 'u' for integration by parts (follow LIATE); not setting up the cyclic integral equation when parts must be applied twice.",
    examTips: "Integration decision tree: (1) standard form? → direct; (2) f'(x)/f(x)? → ln; (3) product? → parts (LIATE); (4) composite? → substitution; (5) rational? → partial fractions; (6) sin²x/cos²x? → double angle. Mastering this flowchart makes WMA13 integration systematic.",
    formulaNames: ["Integration by Parts", "∫1/(a²+x²)", "∫1/√(a²−x²)", "∫tan x", "sin²x and cos²x reduction"]
  },
  p3c7: {
    overview: "P3 Vectors extends to 3D, introducing the vector equation of a line r = a + λb, the scalar (dot) product for angles, and techniques for finding line intersections and proving skewness.",
    hardPoints: "Critical error: after solving for λ and μ from two equations, always substitute into the THIRD equation to verify — if it fails, lines are skew, not intersecting. Dot product yielding negative value means angle is obtuse; take arccos over [0°, 180°].",
    examTips: "For any intersection/skew problem: write both line equations, extract three simultaneous equations, solve two of them, check in the third. Always state the conclusion — 'lines intersect at point P' or 'lines are skew' — explicitly.",
    formulaNames: ["Vector Equation of Line", "Scalar (Dot) Product", "Angle Between Vectors", "Perpendicularity Condition", "3D Magnitude"]
  },
  p3c8: {
    overview: "Differential Equations models real-world rates of change (population growth, Newton's cooling, radioactive decay) using separable variable equations. P3 requires separating variables, integrating both sides, and applying initial conditions to find particular solutions.",
    hardPoints: "Frequent errors: integrating the left side with respect to x instead of y after separation; omitting the integration constant C; substituting the initial condition but not completing the solution by writing the full particular solution; incorrectly interpreting 'decreases at rate k' — the sign must be negative.",
    examTips: "Standard procedure: (1) write dy/g(y) = f(x)dx; (2) integrate both sides; (3) include + C; (4) substitute initial condition to find C; (5) write the complete particular solution. Show every step — each earns method marks.",
    formulaNames: ["Separable Variables", "Exponential Growth/Decay", "Newton's Cooling Law", "Finding the Particular Solution"]
  },
  // ═══ P4 ═══
  p4c1: {
    overview: "Mathematical Induction provides a rigorous framework for proving statements true for all positive integers. The three mandatory components — Base Case, Inductive Hypothesis, and Inductive Step — must all appear in a prescribed format. WMA14 typically awards 7–9 marks for induction questions.",
    hardPoints: "Critical errors: starting the Inductive Step from P(k+1) without showing the connection to P(k); omitting the concluding 'By the Principle of Mathematical Induction...' statement; matrix multiplication errors in the Induction Step; algebraic simplification failures when showing the series sum collapses.",
    examTips: "Memorise the three standard paragraphs: (1) Basis: verify P(1); (2) Assume P(k) holds; (3) Consider P(k+1), use the assumption, complete the algebra. Conclude formally. Format earns its own marks.",
    formulaNames: ["Base Case Template", "Inductive Hypothesis", "Inductive Step (Series)", "Divisibility Step"]
  },
  p4c2: {
    overview: "Complex Numbers extend the number system to two dimensions. P4 covers arithmetic, conjugates, modulus-argument form, De Moivre's Theorem, complex roots of polynomials, and loci on the Argand diagram.",
    hardPoints: "Critical errors: computing the argument without checking quadrant (arctan gives values in only two quadrants — always verify); conjugate division errors (multiply by conjugate of denominator, not numerator); |z − a| interpreted as |z| − |a| (incorrect — it's the distance from z to a).",
    examTips: "Always draw an Argand diagram before computing arguments. Compute modulus first, then argument as two separate steps. For loci questions, translate the condition into geometry: |z − a| = r is a circle; arg(z − a) = θ is a ray.",
    formulaNames: ["Conjugate Product", "Modulus-Argument Form", "De Moivre's Theorem", "nth Roots", "Circle Locus"]
  },
  p4c3: {
    overview: "Matrices formalise the algebra of linear transformations and systems of linear equations. P4 covers 2×2 and 3×3 matrices, determinants, inverses, and geometric transformations. Singular matrices (det = 0) correspond to systems with no unique solution.",
    hardPoints: "Frequent errors: matrix multiplication order AB ≠ BA; 3×3 cofactor sign pattern errors (chess-board +−+...); determinant computed incorrectly invalidating the entire inverse; composite transformation order — transformation B then A corresponds to the matrix product AB.",
    examTips: "Always compute the determinant before attempting the inverse — if det = 0, the matrix is singular and has no inverse. For 3×3, expand along the row or column with the most zeros to minimise arithmetic.",
    formulaNames: ["2×2 Determinant", "2×2 Inverse", "Rotation Matrix", "Solving Matrix Equations", "Determinant Properties"]
  },
  p4c4: {
    overview: "Further Vectors extends to planes in 3D space using normal vectors, Cartesian plane equations, and the cross (vector) product. These tools enable distance calculations, angle between planes, and line-plane intersections.",
    hardPoints: "Critical errors: cross product sign pattern — the j-component has a minus sign in the cofactor expansion; confusing normal vector n with direction vectors b, c of the plane; forgetting to divide by |n| when computing point-to-plane distance.",
    examTips: "For all plane problems: find the normal vector first (via cross product of two direction vectors). Once n is known, the Cartesian equation n·r = d follows immediately by substituting any point on the plane.",
    formulaNames: ["Cartesian Plane Equation", "3D Cross Product", "Point-to-Plane Distance", "Angle Between Planes", "Parallelogram Area"]
  },
  p4c5: {
    overview: "Hyperbolic Functions (cosh x, sinh x, tanh x) are defined in terms of exponentials and satisfy identities closely parallel to trigonometric identities but with key sign differences. Inverse hyperbolic functions have elegant logarithmic forms required for integration.",
    hardPoints: "Critical error: cosh²x − sinh²x = 1 (positive, unlike cos²x + sin²x = 1 which is also positive but different for tan). In Osborn's rule, the sign changes only when two sinh factors multiply — standalone sinh² does not change sign. d/dx(cosh x) = sinh x (not −sinh x).",
    examTips: "For any hyperbolic identity proof, expanding using the exponential definitions (cosh x = (eˣ+e⁻ˣ)/2 etc.) is always valid and avoids Osborn's rule errors. Inverse hyperbolic log forms must be derived by solving eˣ = ... and discarding the negative root.",
    formulaNames: ["cosh and sinh Definitions", "Core Identity", "Osborn's Rule", "arcsinh Log Form", "arccosh Log Form"]
  },
  p4c6: {
    overview: "Polar Coordinates use (r, θ) to describe position, enabling elegant representation of spirals, roses, and cardioids. The area formula A = ½∫r²dθ and accurate curve sketching are the primary examination skills.",
    hardPoints: "Frequent errors: wrong integration limits (must cover exactly one complete loop of the curve — check where r = 0 to find the boundaries); errors expanding (1 + cosθ)² without applying the double-angle formula for cos²θ; miscounting rose curve petals (n odd → n petals; n even → 2n petals).",
    examTips: "Polar area procedure: (1) sketch the curve and identify the boundaries in θ; (2) expand r²; (3) use cos²θ = ½(1+cos2θ) to simplify; (4) integrate. The sketch and correct limits are the most mark-sensitive steps.",
    formulaNames: ["Polar-Cartesian Conversion", "Polar Area Formula", "Area Between Two Curves", "Cardioid"]
  },
  p4c7: {
    overview: "Further Calculus introduces Maclaurin series (expanding functions as infinite polynomials around x = 0) and advanced integration techniques including trigonometric substitution and reduction formulae.",
    hardPoints: "Frequent errors: missing n! in the denominator of Maclaurin coefficients; using ln(1+x) series outside |x| < 1; trigonometric substitution — after integrating, must substitute back to express the answer in terms of x; reduction formula requires two integrations by parts, then solving for Iₙ by moving the integral to the other side.",
    examTips: "Maclaurin series: compute f(0), f'(0), f''(0), f'''(0) in sequence — do not skip derivatives. For reduction formulae, apply integration by parts twice, collect terms involving Iₙ on one side, and solve algebraically.",
    formulaNames: ["Maclaurin Series", "eˣ Series", "sin x Series", "cos x Series", "ln(1+x) Series"]
  },
  p4c8: {
    overview: "Second-Order Differential Equations model vibrations, damped oscillations, and electrical circuits. The solution method combines a Complementary Function (from the auxiliary equation) and a Particular Integral (guessed from the form of f(x)).",
    hardPoints: "Critical errors: when the trial PI matches a CF term, multiply by x (or x²) — omitting this gives a PI that is identically zero; substituting initial conditions only into y without also substituting into dy/dx (two conditions are needed to find A and B); trigonometric PI must include BOTH sin and cos even if only one appears in f(x).",
    examTips: "Standard flow: (1) auxiliary equation → m₁, m₂ → CF; (2) identify type of f(x) → trial PI; (3) differentiate PI twice, substitute, compare coefficients; (4) complete solution = CF + PI; (5) apply initial conditions. Label each step clearly.",
    formulaNames: ["Auxiliary Equation", "CF with Complex Roots", "Exponential PI", "Trigonometric PI", "General Solution = CF + PI"]
  },
  // ═══ M1 ═══
  m1c1: {
    overview: "Mechanics begins with mathematical modelling assumptions (particle, light string, smooth surface) and the five SUVAT equations for constant acceleration in a straight line. Velocity-time graphs provide a visual complement to algebraic methods.",
    hardPoints: "Frequent errors: selecting a SUVAT equation without first listing all five quantities and identifying which is unknown; sign errors when motion reverses direction — always define a positive direction at the start and apply it consistently; average velocity = total displacement / total time (not total distance).",
    examTips: "SUVAT template: list s, u, v, a, t with known values filled in and the unknown marked with '?'. Select the equation containing exactly those five quantities. For two-stage problems, complete stage 1 fully before starting stage 2.",
    formulaNames: ["SUVAT: v = u + at", "SUVAT: s = ut + ½at²", "SUVAT: v² = u² + 2as", "SUVAT: s = ½(u+v)t", "Free Fall: a = g = 9.8"]
  },
  m1c2: {
    overview: "Newton's Second Law F = ma connects force, mass, and acceleration. Every dynamics problem requires a Free Body Diagram showing all forces on each object, followed by F = ma equations in each direction, then SUVAT for motion quantities.",
    hardPoints: "Frequent errors: omitting a force from the FBD (especially the Normal Reaction on inclined planes); Newton's 3rd Law confusion — action-reaction pairs act on different objects; assuming all connected objects have the same magnitude of acceleration (true only if connected by an inextensible string over a pulley).",
    examTips: "Mandatory steps: (1) Free Body Diagram for each object separately; (2) choose positive direction (usually direction of motion); (3) write F = ma for each object in each direction; (4) solve simultaneously. Never skip the FBD.",
    formulaNames: ["Newton's Second Law", "Weight", "Limiting Friction", "Atwood's Machine", "Acceleration Formula"]
  },
  m1c3: {
    overview: "Forces and Equilibrium applies resolving and equilibrium conditions (ΣFₓ = 0, ΣFᵧ = 0) to particles on inclined planes, suspended objects, and rough surfaces. Limiting equilibrium (F = μN) is the critical boundary condition.",
    hardPoints: "Frequent errors: decomposing weight relative to horizontal rather than the inclined plane axes; drawing friction in the wrong direction (always opposing motion tendency); using F < μN instead of F = μN at limiting equilibrium; Lami's theorem — the angle used is the one directly opposite (supplementary angle) to each force.",
    examTips: "Inclined plane method: set axes along and perpendicular to the slope; decompose mg into mg sinθ (along slope) and mg cosθ (perpendicular); write N = mg cosθ immediately; then resolve along slope. Show all decompositions explicitly.",
    formulaNames: ["Horizontal Force Component", "Vertical Force Component", "Normal on Inclined Plane", "Limiting Friction on Slope", "Lami's Theorem"]
  },
  m1c4: {
    overview: "Moments describes the turning effect of a force about a point. Equilibrium of a rigid beam requires zero net force AND zero net moment. Taking moments about a support eliminates the unknown reaction at that support, simplifying the algebra.",
    hardPoints: "Frequent errors: taking moments about a point that includes multiple unknowns (making the equation harder, not simpler); using slant distance instead of perpendicular distance from the line of action to the pivot; direction errors (CW vs ACW) causing sign mistakes.",
    examTips: "Strategy: always take moments about the support containing the unknown reaction you want to ELIMINATE. The two equilibrium equations (ΣF = 0 and ΣM = 0) together solve any standard beam problem. Always label CW and ACW before writing the moment equation.",
    formulaNames: ["Moment of a Force", "Principle of Moments", "Centroid of Uniform Beam", "Two-Support Beam"]
  },
  m1c5: {
    overview: "Work, Energy and Power unify kinematics and forces through energy conservation. The Work-Energy Theorem and mechanical energy conservation often provide more direct routes to velocity and height than F = ma methods.",
    hardPoints: "Frequent errors: friction work counted as positive when it should reduce total energy; P = Fv uses instantaneous speed, not average speed; maximum speed at maximum power requires a = 0, meaning driving force equals total resistance — must state this explicitly.",
    examTips: "Energy method checklist: (1) identify initial and final states; (2) list KE₁, PE₁, KE₂, PE₂; (3) account for work done by friction (subtract from energy); (4) apply KE₁ + PE₁ = KE₂ + PE₂ + Friction Work. For power: P_max = F_drive × v_max when a = 0.",
    formulaNames: ["Work Done", "Kinetic Energy", "Gravitational PE", "Work-Energy Theorem", "Power P = Fv", "Conservation with Friction"]
  },
  m1c6: {
    overview: "Impulse and Momentum link force and time to change in momentum. Conservation of Momentum and Newton's Law of Restitution are the two equations used to solve all collision problems in WME01.",
    hardPoints: "Frequent errors: sign errors in momentum — define positive direction clearly and apply it to all velocities; restitution formula applied with objects swapped (e = separation speed / approach speed, matching corresponding objects); oblique impact — parallel velocity component is unchanged, only normal component obeys e.",
    examTips: "For every collision: (1) conservation of momentum equation; (2) Newton's restitution equation. Solve simultaneously for unknown velocities. Negative results mean the object moves in the defined negative direction — this is physically valid.",
    formulaNames: ["Momentum", "Impulse-Momentum Theorem", "Conservation of Momentum", "Coefficient of Restitution", "Perfectly Inelastic Collision"]
  },
  m1c7: {
    overview: "Projectile Motion decomposes 2D motion into independent horizontal (constant speed) and vertical (constant acceleration g) components. Time t links the two directions. The trajectory equation y = x tanθ − gx²/(2u²cos²θ) gives the parabolic path.",
    hardPoints: "Frequent errors: using R = u²sin2θ/g when the launch and landing heights differ (this formula applies only for level ground); solving for flight time using y = 0 giving t = 0 (reject) and t = 2u sinθ/g (accept); forgetting to check the horizontal velocity component is constant throughout — it never changes.",
    examTips: "Always resolve initial velocity into horizontal (u cosθ) and vertical (u sinθ) components at the start. Horizontal: x = u cosθ × t (no acceleration). Vertical: y = u sinθ × t − ½gt². Eliminate t to find trajectory. For landing: set y to the required height and solve the resulting quadratic in t.",
    formulaNames: ["Horizontal Displacement", "Vertical Displacement", "Maximum Height", "Horizontal Range", "Trajectory Equation"]
  }
};

/** Returns a chapter object with English text when lang === 'en' */
function localiseChapter(chapter, lang) {
  if (lang !== 'en') return chapter;
  const en = CHAPTER_EN[chapter.id] || {};
  return {
    ...chapter,
    title: titleEn(chapter.title),
    overview: en.overview || toEn(chapter.overview),
    hardPoints: en.hardPoints || toEn(chapter.hardPoints),
    examTips: chapter.examTips ? (en.examTips || toEn(chapter.examTips)) : undefined,
    keyPoints: chapter.keyPoints.map(kp => toEn(kp)),
    formulas: chapter.formulas.map((f, i) => ({
      name: en.formulaNames?.[i] || toEn(f.name),
      expr: f.expr,            // expressions stay as-is (they're already in symbols)
    })),
    difficulty: chapter.difficulty, // already English
  };
}

// ============================================================
// AI SERVICE
// ============================================================
const API_KEY_STORAGE = "alevel_math_api_key";
const API_PROVIDER_STORAGE = "alevel_math_api_provider";

function getApiKey() {
  try {
    return localStorage.getItem(API_KEY_STORAGE) || "";
  } catch (e) {
    console.error("Failed to access localStorage:", e);
    return "";
  }
}
function saveApiKey(key) {
  try {
    localStorage.setItem(API_KEY_STORAGE, key.trim());
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
}

function getApiProvider() {
  try {
    return localStorage.getItem(API_PROVIDER_STORAGE) || "anthropic";
  } catch (e) {
    console.error("Failed to access localStorage:", e);
    return "anthropic";
  }
}
function saveApiProvider(provider) {
  try {
    localStorage.setItem(API_PROVIDER_STORAGE, provider);
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
}

async function callClaude(systemPrompt, userMessage, maxTokens = 1500) {
  const apiKey = getApiKey();
  console.log("📝 [Anthropic] Calling API with key:", apiKey ? apiKey.substring(0, 10) + "..." : "NO KEY");
  if (!apiKey) throw new Error("NO_API_KEY");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }]
    })
  });
  console.log("📝 [Anthropic] Response status:", response.status);
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.log("📝 [Anthropic] Error response:", err);
    if (response.status === 401) throw new Error("INVALID_API_KEY");
    throw new Error(err?.error?.message || `HTTP ${response.status}`);
  }
  const data = await response.json();
  console.log("📝 [Anthropic] Success! Got response");
  return data.content?.[0]?.text || "";
}

async function generateZhipuJWT(apiKey) {
  try {
    const [id, secret] = apiKey.split('.');
    if (!id || !secret) {
      throw new Error("Invalid API Key format. Expected: id.secret");
    }

    const now = Date.now();
    const exp = now + 3600000; // 1小时后过期

    const header = {
      alg: "HS256",
      sign_type: "SIGN"
    };

    const payload = {
      api_key: id,
      exp: exp,
      timestamp: now
    };

    const base64UrlEncode = (str) => {
      return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    };

    const base64UrlEncodeJson = (obj) => {
      return base64UrlEncode(JSON.stringify(obj));
    };

    const encodedHeader = base64UrlEncodeJson(header);
    const encodedPayload = base64UrlEncodeJson(payload);

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const data = `${encodedHeader}.${encodedPayload}`;
    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(data)
    );

    const encodedSignature = base64UrlEncode(
      String.fromCharCode(...new Uint8Array(signature))
    );

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  } catch (e) {
    console.error("JWT Generation Error:", e);
    throw new Error("Failed to generate JWT: " + e.message);
  }
}

async function callZhipuAI(systemPrompt, userMessage, maxTokens = 1500) {
  const apiKey = getApiKey();
  console.log("📝 [Zhipu] Calling API with key:", apiKey ? apiKey.substring(0, 10) + "..." : "NO KEY");
  if (!apiKey) throw new Error("NO_API_KEY");

  let response;

  try {
    response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "glm-4",
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ]
      })
    });
    console.log("📝 [Zhipu] Response status:", response.status);

    if (response.status === 401) {
      const token = await generateZhipuJWT(apiKey);
      console.log("📝 [Zhipu] 401 detected, trying with JWT token...");
      response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          model: "glm-4",
          max_tokens: maxTokens,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ]
        })
      });
    }
  } catch (e) {
    console.error("Zhipu AI API Call Error:", e);
    throw new Error("Failed to call Zhipu AI: " + e.message);
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error("Zhipu AI Error Response:", err);
    if (response.status === 401) throw new Error("INVALID_API_KEY");
    throw new Error(err?.error?.message || err?.message || `HTTP ${response.status}`);
  }
  const data = await response.json();
  console.log("📝 [Zhipu] Success! Got response");
  return data.choices?.[0]?.message?.content || "";
}

async function callAI(systemPrompt, userMessage, maxTokens = 1500) {
  const provider = getApiProvider();
  if (provider === "zhipu") {
    return await callZhipuAI(systemPrompt, userMessage, maxTokens);
  } else {
    return await callClaude(systemPrompt, userMessage, maxTokens);
  }
}

// ============================================================
// TRANSLATIONS
// ============================================================
const T = {
  en: {
    logoTitle: "A-Level Mathematics", logoSub: "Complete Learning System", langBtn: "中文",
    nav: { curriculum: "📚 Curriculum", quiz: "✍️ Quiz", exam: "🎯 Exam", mock: "📋 Mock Exam", errorbook: "📕 Error Book" },
    heroTag: "Cambridge International A-Level",
    heroTitle1: "Master Mathematics.", heroTitle2: "Achieve A*.",
    heroDesc: "A complete learning system covering Pure Mathematics (P1–P4), Statistics (S1) and Mechanics (M1), with AI-powered quizzes, timed exams, past papers, and personalised error tracking.",
    startLearning: "Start Learning →", takeMock: "Take Mock Exam", chapters: "Chapters",
    features: [
      { icon: "📖", title: "Structured Learning", desc: "Chapter-by-chapter content with formulas, key points, and difficulty guidance" },
      { icon: "▶️", title: "Video Lessons", desc: "Curated YouTube tutorials matched to each chapter of your textbook" },
      { icon: "🤖", title: "AI Quiz Engine", desc: "Infinite AI-generated questions at medium and high difficulty" },
      { icon: "⏱️", title: "Timed Exams", desc: "Exam-style sessions with scoring, model answers, and topic mapping" },
      { icon: "📋", title: "Past Papers", desc: "Real exam timing with past paper questions and AI-powered marking" },
      { icon: "📕", title: "Error Notebook", desc: "Wrong answers saved automatically — review, re-test, master weak areas" },
    ],
    curriculumTitle: "Curriculum", backCurriculum: "← Back to Curriculum",
    secKeyPoints: "🔑 Key Points", secFormulas: "📐 Formulas & Equations",
    secHardPoints: "⚠️ High-Frequency Mistakes", secExamTips: "🎯 Exam Strategy & Scoring Tips",
    tabLearn: "📖 Learn", tabVideos: "▶️ Videos", tabQuiz: "✍️ Quiz", tabExam: "🎯 Exam",
    videoIntro: "Curated video resources for Chapter", videoHint: "Click to search on YouTube →",
    searchMore: "🔍 Search More Videos for This Chapter on YouTube",
    chapterLabel: "Chapter", keyPointsCount: "Key Points", formulasCount: "Formulas",
    aiQuizTitle: "🤖 AI Quiz Generator", selectTextbook: "Select Textbook",
    selectChapter: "Select Chapter", allChapters: "All Chapters",
    diffLabel: "Difficulty", medium: "📊 Medium", hard: "🔥 Hard",
    generateBtn: "Generate 5 Questions →", generatingMsg: "AI is generating your questions...",
    questionOf: (c, t) => `Question ${c} / ${t}`, scoreLabel: "Score:",
    submitAnswer: "Submit Answer", nextQuestion: "Next Question →", seeResults: "See Results →",
    feedCorrect: "Correct!", feedIncorrect: "Incorrect — Correct Answer:",
    conceptTested: "Concept tested:", secKeyFormula: "📐 Key Formula / Rule",
    secSolution: "🔢 Worked Solution", secAIExplain: "🧠 AI Tutor Explanation",
    secWhyWrong: "🚫 Why the Other Options Are Wrong", secMistake: "⚠️ Common Exam Mistake",
    perfect: "🏆 Perfect!", excellent: "⭐ Excellent!", goodWork: "👍 Good work!", keepPractising: "📚 Keep practising!",
    questionsCorrect: "Questions Correct", newQuiz: "New Quiz", tryAgain: "Try Again",
    aiExamTitle: "🎯 AI Exam", textbookLabel: "Textbook", chapterOpt: "Chapter (optional)",
    mixedChapters: "Mixed Chapters", numQLabel: "Questions", minLabel: "Minutes",
    markedByAI: "🏆 Marked by AI", preparingExam: "Preparing your exam...",
    startExam: "Start Exam →", mediumTime: "📊 Medium (25 min)", hardTime: "🔥 Hard (35 min)",
    answered: "answered", submitExam: "Submit Exam", examComplete: "Examination Complete",
    errorNotebook: "📕 Error Notebook", questionsLabel: "questions",
    reviewMistakesDesc: "Review your mistakes, understand the concepts, and re-test yourself.",
    emptyNotebook: "Your error notebook is empty!",
    emptyDesc: "Questions you answer incorrectly will appear here automatically.",
    takeQuizBtn: "Take a Quiz →", yourAnswerLabel: "Your answer:", correctLabel: "Correct:",
    aiExplainBtn: "AI Explain", removeBtn: "Remove",
    mockTitle: "📋 Past Paper Mock Exams",
    mockDesc: "Realistic mock exams based on past Cambridge papers. Full exam timing, AI-powered marking, and detailed feedback.",
    startMockBtn: "Start Mock →", loadingPaper: "Loading your paper...",
    detailedMarking: "📊 Detailed Marking", estimatedUMS: "Estimated UMS:",
    modelAnswer: "Model Answer", yourAnswerWas: "Your answer was", reviewLabel: "Review:",
    backToMenu: "Back to Menu", retakeMock: "Retake Mock",
    examPaperTitle: "Cambridge International AS & A Level Mathematics",
    examInstructions: "Answer ALL questions. Show your method — marks are given for correct working.",
    marks: "marks", noAnswer: "No answer", correctAnswerLabel: "Correct",
    aiExplainingMsg: "AI is explaining...",
  },
  zh: {
    logoTitle: "A-Level 数学", logoSub: "完整学习系统", langBtn: "English",
    nav: { curriculum: "📚 课程", quiz: "✍️ 练习", exam: "🎯 考试", mock: "📋 模拟卷", errorbook: "📕 错题本" },
    heroTag: "培生爱德思 IAL 国际 A-Level",
    heroTitle1: "掌握数学，", heroTitle2: "冲击 A*。",
    heroDesc: "覆盖纯数学 P1–P4、统计学 S1 与力学 M1 的完整学习系统，内置 AI 题库、限时考试、历年真题和个性化错题追踪。",
    startLearning: "开始学习 →", takeMock: "模拟考试", chapters: "章节",
    features: [
      { icon: "📖", title: "结构化学习", desc: "按章节组织的公式、核心考点和难度指引" },
      { icon: "▶️", title: "视频课程", desc: "精选 YouTube 教学视频，与每章内容精准对应" },
      { icon: "🤖", title: "AI 出题引擎", desc: "无限量 AI 生成题目，中等和困难两档难度" },
      { icon: "⏱️", title: "限时考试", desc: "全真考试模式，含评分、范例答案和考点分析" },
      { icon: "📋", title: "历年真题", desc: "按真实考试时间模拟，AI 智能批改与详细反馈" },
      { icon: "📕", title: "错题本", desc: "错误答案自动归档，随时复习、重做、攻克弱点" },
    ],
    curriculumTitle: "课程大纲", backCurriculum: "← 返回课程",
    secKeyPoints: "🔑 核心考点", secFormulas: "📐 公式与方程",
    secHardPoints: "⚠️ 高频失分点 & 难点分析", secExamTips: "🎯 考试策略 & 得分技巧",
    tabLearn: "📖 学习", tabVideos: "▶️ 视频", tabQuiz: "✍️ 练习", tabExam: "🎯 考试",
    videoIntro: "精选视频资源 — 第", videoHint: "点击在 YouTube 搜索 →",
    searchMore: "🔍 在 YouTube 搜索本章更多视频",
    chapterLabel: "第", keyPointsCount: "个考点", formulasCount: "个公式",
    aiQuizTitle: "🤖 AI 练习题生成器", selectTextbook: "选择教材",
    selectChapter: "选择章节", allChapters: "全部章节",
    diffLabel: "难度", medium: "📊 中等", hard: "🔥 困难",
    generateBtn: "生成 5 道题 →", generatingMsg: "AI 正在生成题目，请稍候...",
    questionOf: (c, t) => `第 ${c} 题 / 共 ${t} 题`, scoreLabel: "得分：",
    submitAnswer: "提交答案", nextQuestion: "下一题 →", seeResults: "查看结果 →",
    feedCorrect: "回答正确！", feedIncorrect: "回答错误 — 正确答案：",
    conceptTested: "考核概念：", secKeyFormula: "📐 核心公式 / 法则",
    secSolution: "🔢 解题步骤", secAIExplain: "🧠 AI 导师深度解析",
    secWhyWrong: "🚫 其他选项为何错误", secMistake: "⚠️ 考试常见失分陷阱",
    perfect: "🏆 全对！太棒了！", excellent: "⭐ 优秀！", goodWork: "👍 不错，继续加油！", keepPractising: "📚 继续练习，坚持就是胜利！",
    questionsCorrect: "道题回答正确", newQuiz: "新的练习", tryAgain: "再做一次",
    aiExamTitle: "🎯 AI 模拟考试", textbookLabel: "教材", chapterOpt: "章节（可选）",
    mixedChapters: "混合章节", numQLabel: "题数", minLabel: "分钟",
    markedByAI: "🏆 AI 批改", preparingExam: "正在准备试卷...",
    startExam: "开始考试 →", mediumTime: "📊 中等（25 分钟）", hardTime: "🔥 困难（35 分钟）",
    answered: "已作答", submitExam: "提交试卷", examComplete: "考试完成",
    errorNotebook: "📕 错题本", questionsLabel: "道题",
    reviewMistakesDesc: "复习错误，理解考点，重新挑战自己。",
    emptyNotebook: "错题本是空的！",
    emptyDesc: "做错的题目会自动保存到这里，方便你随时复习。",
    takeQuizBtn: "去做练习 →", yourAnswerLabel: "你的答案：", correctLabel: "正确答案：",
    aiExplainBtn: "AI 解析", removeBtn: "删除",
    mockTitle: "📋 历年真题模拟",
    mockDesc: "基于培生爱德思历年真题的模拟考试，全真计时，AI 智能批改，详细反馈。",
    startMockBtn: "开始模拟 →", loadingPaper: "正在加载试卷...",
    detailedMarking: "📊 详细批改", estimatedUMS: "估算 UMS 分数：",
    modelAnswer: "标准答案", yourAnswerWas: "你的答案是", reviewLabel: "复习：",
    backToMenu: "返回菜单", retakeMock: "重新模拟",
    examPaperTitle: "Cambridge International AS & A Level 数学",
    examInstructions: "回答所有题目，展示解题步骤——步骤正确也可得分。",
    marks: "分", noAnswer: "未作答", correctAnswerLabel: "正确",
    aiExplainingMsg: "AI 正在解析，请稍候...",
  }
};

// ============================================================
// MAIN APP
// ============================================================
export default function ALevelMathApp() {
  const [activeView, setActiveView] = useState("home");
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [errorBook, setErrorBook] = useState([]);
  const [examSession, setExamSession] = useState(null);
  const [quizSession, setQuizSession] = useState(null);
  const [mockExamSession, setMockExamSession] = useState(null);
  const [lang, setLang] = useState("en");
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [apiKeySaved, setApiKeySaved] = useState(!!getApiKey());
  const [apiProvider, setApiProvider] = useState(getApiProvider());
  const t = T[lang];

  function handleSaveApiKey() {
    if (!apiKeyInput.trim()) return;
    saveApiKey(apiKeyInput);
    saveApiProvider(apiProvider);
    setApiKeySaved(true);
    setShowApiModal(false);
    setApiKeyInput("");
  }
  function handleClearApiKey() {
    localStorage.removeItem(API_KEY_STORAGE);
    setApiKeySaved(false);
  }
  function handleProviderChange(provider) {
    setApiProvider(provider);
    // 切换提供商时清除已保存的 key
    setApiKeySaved(false);
    setApiKeyInput("");
    localStorage.removeItem(API_KEY_STORAGE);
  }

  const nav = (view, book = undefined, chapter = undefined) => {
    setActiveView(view);
    if (book !== undefined) setSelectedBook(book);
    if (chapter !== undefined) setSelectedChapter(chapter);
  };

  return (
    <div style={styles.root}>
      <div style={styles.bgDecor} />
      <div style={styles.bgGrid} />

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <button onClick={() => nav("home")} style={styles.logoBtn}>
            <span style={styles.logoSymbol}>A*</span>
            <div>
              <div style={styles.logoTitle}>{t.logoTitle}</div>
              <div style={styles.logoSub}>{t.logoSub}</div>
            </div>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <nav style={styles.headerNav}>
              {[
                { id: "curriculum", label: t.nav.curriculum },
                { id: "quiz",       label: t.nav.quiz },
                { id: "exam",       label: t.nav.exam },
                { id: "mock",       label: t.nav.mock },
                { id: "errorbook",  label: t.nav.errorbook },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => item.id === "curriculum" ? nav("curriculum", undefined, null) : nav(item.id)}
                  style={{ ...styles.navBtn, ...(activeView === item.id ? styles.navBtnActive : {}) }}
                >
                  {item.label}
                  {item.id === "errorbook" && errorBook.length > 0 && (
                    <span style={styles.badge}>{errorBook.length}</span>
                  )}
                </button>
              ))}
            </nav>
            {/* Language toggle */}
            <button
              onClick={() => setLang(l => l === "en" ? "zh" : "en")}
              style={styles.langToggleBtn}
              title="Switch language / 切换语言"
            >
              {lang === "en" ? "🌐 中文" : "🌐 English"}
            </button>
            {/* API Key settings */}
            <button
              onClick={() => { setApiKeyInput(""); setShowApiModal(true); }}
              title="API Key Settings"
              style={{
                ...styles.langToggleBtn,
                borderColor: apiKeySaved ? "rgba(26,122,60,0.4)" : "rgba(218,41,28,0.4)",
                color: apiKeySaved ? "#1A7A3C" : "#DA291C",
                background: apiKeySaved ? "rgba(26,122,60,0.06)" : "rgba(218,41,28,0.06)",
                fontFamily: "sans-serif", fontSize: 15,
              }}
            >
              {apiKeySaved
                ? `${apiProvider === "zhipu" ? "🤖 智谱 ✓" : "🔑 AI ✓"}`
                : `${apiProvider === "zhipu" ? "🤖 智谱 Key" : "🔑 AI Key"}`}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {activeView === "home" && <HomeView nav={nav} t={t} />}
        {activeView === "curriculum" && !selectedChapter && <CurriculumView nav={nav} t={t} lang={lang} />}
        {activeView === "curriculum" && selectedChapter && (
          <ChapterView chapter={selectedChapter} book={selectedBook} nav={nav} t={t} lang={lang} />
        )}
        {activeView === "quiz" && (
          <QuizView
            chapter={selectedChapter}
            book={selectedBook}
            nav={nav}
            t={t}
            lang={lang}
            onAddError={(q) => setErrorBook(prev => [...prev.filter(e => e.id !== q.id), q])}
          />
        )}
        {activeView === "exam" && (
          <ExamView
            chapter={selectedChapter}
            book={selectedBook}
            nav={nav}
            t={t}
            lang={lang}
            onAddError={(q) => setErrorBook(prev => [...prev.filter(e => e.id !== q.id), q])}
          />
        )}
        {activeView === "mock" && (
          <MockExamView
            nav={nav}
            t={t}
            lang={lang}
            onAddError={(q) => setErrorBook(prev => [...prev.filter(e => e.id !== q.id), q])}
          />
        )}
        {activeView === "errorbook" && (
          <ErrorBookView
            errors={errorBook}
            onClear={(id) => setErrorBook(prev => prev.filter(e => e.id !== id))}
            nav={nav}
            t={t}
            lang={lang}
          />
        )}
      </main>

      {/* ── API Key Modal ── */}
      {showApiModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24,
        }} onClick={(e) => e.target === e.currentTarget && setShowApiModal(false)}>
          <div style={{
            background: "#FFFFFF", borderRadius: 16, padding: 36,
            width: "100%", maxWidth: 480,
            boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
            border: "1px solid #E0E0E0",
            fontFamily: "Georgia, serif",
          }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
              <div style={{
                width: 48, height: 48, background: "#DA291C", borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, flexShrink: 0,
              }}>🔑</div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A", margin: 0 }}>
                  {lang === "en" ? "API Key Settings" : "API 密钥设置"}
                </h2>
                <p style={{ fontSize: 13, color: "#888888", marginTop: 4, lineHeight: 1.5 }}>
                  {lang === "en"
                    ? "Required for AI quiz, exam, and explanation features."
                    : "AI 练习题、考试和解析功能需要此密钥。"}
                </p>
              </div>
            </div>

            {/* Provider Selection */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: "#555555", fontWeight: 600, display: "block", marginBottom: 8 }}>
                {lang === "en" ? "Select AI Provider:" : "选择 AI 提供商："}
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => handleProviderChange("anthropic")}
                  style={{
                    flex: 1, padding: "10px 14px",
                    background: apiProvider === "anthropic" ? "linear-gradient(135deg, #DA291C, #B81E14)" : "#FFFFFF",
                    color: apiProvider === "anthropic" ? "#FFFFFF" : "#1A1A1A",
                    border: apiProvider === "anthropic" ? "none" : "1.5px solid #D0D0D0",
                    borderRadius: 8, fontSize: 14, fontWeight: 600,
                    cursor: "pointer", fontFamily: "Georgia, serif",
                  }}
                >
                  🔑 Anthropic (Claude)
                </button>
                <button
                  onClick={() => handleProviderChange("zhipu")}
                  style={{
                    flex: 1, padding: "10px 14px",
                    background: apiProvider === "zhipu" ? "linear-gradient(135deg, #1890FF, #096DD9)" : "#FFFFFF",
                    color: apiProvider === "zhipu" ? "#FFFFFF" : "#1A1A1A",
                    border: apiProvider === "zhipu" ? "none" : "1.5px solid #D0D0D0",
                    borderRadius: 8, fontSize: 14, fontWeight: 600,
                    cursor: "pointer", fontFamily: "Georgia, serif",
                  }}
                >
                  🤖 智谱 AI (GLM-4)
                </button>
              </div>
            </div>

            {/* Current status */}
            {apiKeySaved && (
              <div style={{
                background: "rgba(26,122,60,0.08)", border: "1px solid rgba(26,122,60,0.25)",
                borderRadius: 8, padding: "10px 14px", marginBottom: 16,
                display: "flex", alignItems: "center", gap: 10, fontSize: 14,
              }}>
                <span style={{ fontSize: 18 }}>✅</span>
                <span style={{ color: "#1A7A3C", fontWeight: 600 }}>
                  {lang === "en" ? "API key is saved" : "密钥已保存"}
                </span>
                <button onClick={handleClearApiKey} style={{
                  marginLeft: "auto", fontSize: 12, color: "#DA291C", background: "none",
                  border: "1px solid rgba(218,41,28,0.3)", borderRadius: 6,
                  padding: "3px 10px", cursor: "pointer",
                }}>{lang === "en" ? "Remove" : "删除"}</button>
              </div>
            )}

            {/* Steps */}
            <div style={{
              background: "#F8F8F8", borderRadius: 10, padding: 16, marginBottom: 20,
              fontSize: 13, color: "#444444", lineHeight: 1.8,
            }}>
              <div style={{ fontWeight: 700, color: "#1A1A1A", marginBottom: 8, fontSize: 14 }}>
                {apiProvider === "zhipu"
                  ? (lang === "en" ? "How to get Zhipu AI API key:" : "如何获取智谱 AI API 密钥：")
                  : (lang === "en" ? "How to get Anthropic API key:" : "如何获取 Anthropic API 密钥：")}
              </div>
              {apiProvider === "zhipu" ? (
                <>
                  <div>① {lang === "en" ? "Visit" : "访问"}{" "}
                    <a href="https://open.bigmodel.cn" target="_blank" rel="noreferrer"
                       style={{ color: "#1890FF", fontWeight: 600 }}>
                      open.bigmodel.cn
                    </a>
                  </div>
                  <div>② {lang === "en" ? "Sign up / Log in" : "注册或登录账号"}</div>
                  <div>③ {lang === "en"
                    ? 'Go to "API Keys" page and create a new key'
                    : '进入「API Keys」页面创建新密钥'}</div>
                  <div>④ {lang === "en" ? "Copy the API key" : "复制 API 密钥"}</div>
                  <div style={{ marginTop: 8, color: "#DA291C", fontSize: 12, fontWeight: 600 }}>
                    ⚠ {lang === "en" ? "Important: Zhipu API Key format is id.secret (e.g., 12345678.abcdef)" : "重要：智谱 API Key 格式为 id.secret（例如：12345678.abcdef）"}
                  </div>
                </>
              ) : (
                <>
                  <div>① {lang === "en" ? "Visit" : "访问"}{" "}
                    <a href="https://console.anthropic.com" target="_blank" rel="noreferrer"
                       style={{ color: "#DA291C", fontWeight: 600 }}>
                      console.anthropic.com
                    </a>
                  </div>
                  <div>② {lang === "en" ? "Sign up / Log in" : "注册或登录账号"}</div>
                  <div>③ {lang === "en"
                    ? 'Click "API Keys" → "Create Key"'
                    : '点击「API Keys」→「Create Key」'}</div>
                  <div>④ {lang === "en" ? "Copy the key (starts with" : "复制密钥（以"}{" "}
                    <code style={{ background: "#EDEDED", padding: "1px 5px", borderRadius: 4, fontSize: 12 }}>
                      sk-ant-
                    </code>
                    {lang === "en" ? ")" : " 开头）"}
                  </div>
                </>
              )}
              <div style={{ marginTop: 8, color: "#888888", fontSize: 12 }}>
                💡 {lang === "en"
                  ? "Key is stored only in this browser's localStorage and never sent to any server other than the AI provider."
                  : "密钥仅存储在浏览器本地（localStorage），不会发送到 AI 提供商以外的任何服务器。"}
              </div>
            </div>

            {/* Input */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: "#555555", fontWeight: 600 }}>
                {lang === "en" ? "Paste your API key:" : "粘贴 API 密钥："}
              </label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSaveApiKey()}
                placeholder={apiProvider === "zhipu" ? "Enter your Zhipu API key..." : "sk-ant-api03-..."}
                autoFocus
                style={{
                  width: "100%", padding: "12px 14px",
                  border: "1.5px solid #D0D0D0", borderRadius: 8,
                  fontSize: 14, fontFamily: "monospace",
                  outline: "none", color: "#1A1A1A", background: "#FAFAFA",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => { e.target.style.borderColor = apiProvider === "zhipu" ? "#1890FF" : "#DA291C"; }}
                onBlur={e => { e.target.style.borderColor = "#D0D0D0"; }}
              />
              {apiKeyInput && apiProvider === "anthropic" && !apiKeyInput.startsWith("sk-ant-") && (
                <div style={{ fontSize: 12, color: "#DA291C" }}>
                  ⚠ {lang === "en"
                    ? 'Key should start with "sk-ant-"'
                    : '密钥应以 "sk-ant-" 开头'}
                </div>
              )}
              {apiKeyInput && apiProvider === "zhipu" && (!apiKeyInput.includes(".") || apiKeyInput.split(".").length !== 2) && (
                <div style={{ fontSize: 12, color: "#DA291C" }}>
                  ⚠ {lang === "en"
                    ? 'Zhipu key should be in format: id.secret'
                    : '智谱密钥格式应为：id.密钥'}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleSaveApiKey}
                disabled={!apiKeyInput.trim()}
                style={{
                  flex: 1, padding: "12px 0",
                  background: apiKeyInput.trim() ? "linear-gradient(135deg, #DA291C, #B81E14)" : "#CCCCCC",
                  color: "#FFFFFF", border: "none", borderRadius: 8,
                  fontSize: 15, fontWeight: 700, cursor: apiKeyInput.trim() ? "pointer" : "not-allowed",
                  fontFamily: "Georgia, serif",
                }}
              >
                {lang === "en" ? "Save Key" : "保存密钥"}
              </button>
              <button
                onClick={() => setShowApiModal(false)}
                style={{
                  padding: "12px 20px", background: "#FFFFFF",
                  border: "1px solid #D0D0D0", borderRadius: 8,
                  fontSize: 14, color: "#555555", cursor: "pointer",
                  fontFamily: "Georgia, serif",
                }}
              >
                {lang === "en" ? "Cancel" : "取消"}
              </button>
            </div>

            <p style={{ fontSize: 11, color: "#AAAAAA", textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
              {lang === "en"
                ? "Your key is stored only in this browser's localStorage and never sent to any server other than Anthropic."
                : "密钥仅存储在浏览器本地（localStorage），不会发送到 Anthropic 以外的任何服务器。"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// HOME VIEW
// ============================================================
function HomeView({ nav, t }) {
  return (
    <div style={styles.homeWrap}>
      <div style={styles.heroSection}>
        <div style={styles.heroTag}>{t.heroTag}</div>
        <h1 style={styles.heroTitle}>
          {t.heroTitle1}<br />
          <span style={styles.heroAccent}>{t.heroTitle2}</span>
        </h1>
        <p style={styles.heroDesc}>{t.heroDesc}</p>
        <div style={styles.heroBtns}>
          <button onClick={() => nav("curriculum")} style={styles.btnPrimary}>{t.startLearning}</button>
          <button onClick={() => nav("mock")} style={styles.btnSecondary}>{t.takeMock}</button>
        </div>
      </div>

      <div style={styles.booksGrid}>
        {Object.entries(CURRICULUM).map(([key, book]) => (
          <div key={key} style={{ ...styles.bookCard, borderColor: book.color + "55" }}
            onClick={() => { nav("curriculum", key, null); }}>
            <div style={{ ...styles.bookIcon, color: book.color }}>{book.icon}</div>
            <div style={styles.bookKey}>{key}</div>
            <div style={styles.bookTitle}>{book.title}</div>
            <div style={styles.bookChapters}>{book.chapters.length} {t.chapters}</div>
            <div style={{ height: 2, background: book.color, marginTop: 16, borderRadius: 1 }} />
          </div>
        ))}
      </div>

      <div style={styles.featuresGrid}>
        {t.features.map((f, i) => (
          <div key={i} style={styles.featureCard}>
            <div style={styles.featureIcon}>{f.icon}</div>
            <div style={styles.featureTitle}>{f.title}</div>
            <div style={styles.featureDesc}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// CURRICULUM VIEW
// ============================================================
function CurriculumView({ nav, t, lang }) {
  const [activeBook, setActiveBook] = useState("P1");
  const book = CURRICULUM[activeBook];

  return (
    <div style={styles.pageWrap}>
      <h2 style={styles.pageTitle}>{t.curriculumTitle}</h2>
      <div style={styles.bookTabs}>
        {Object.entries(CURRICULUM).map(([key, b]) => (
          <button key={key}
            style={{ ...styles.bookTab, ...(activeBook === key ? { ...styles.bookTabActive, borderColor: b.color, color: b.color } : {}) }}
            onClick={() => setActiveBook(key)}>
            <span style={{ fontSize: 20 }}>{b.icon}</span> {key} — {b.title}
          </button>
        ))}
      </div>

      <div style={styles.chapterList}>
        {book.chapters.map(ch => {
          const lch = localiseChapter(ch, lang);
          return (
            <div key={ch.id} style={styles.chapterCard}
              onClick={() => nav("curriculum", activeBook, ch)}>
              <div style={{ ...styles.chNum, background: book.color }}>{ch.num}</div>
              <div style={styles.chInfo}>
                <div style={styles.chTitle}>{lch.title}</div>
                <div style={styles.chOverview}>{lch.overview.substring(0, 120)}...</div>
                <div style={styles.chMeta}>
                  <span style={{
                    ...styles.diffBadge,
                    background: "#FFFFFF",
                    border: "1px solid " + (ch.difficulty === "Foundation" ? "#003087" : ch.difficulty === "Intermediate" ? "#555555" : "#8B1A1A"),
                    color: ch.difficulty === "Foundation" ? "#003087" : ch.difficulty === "Intermediate" ? "#555555" : "#8B1A1A"
                  }}>
                    {ch.difficulty}
                  </span>
                  <span style={styles.chMetaText}>{ch.keyPoints.length} {t.keyPointsCount}</span>
                  <span style={styles.chMetaText}>{ch.formulas.length} {t.formulasCount}</span>
                </div>
              </div>
              <div style={styles.chArrow}>→</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// CHAPTER VIEW
// ============================================================
function ChapterView({ chapter, book, nav, t, lang }) {
  const [tab, setTab] = useState("learn");
  const bookData = CURRICULUM[book];
  const tabLabels = { learn: t.tabLearn, videos: t.tabVideos, quiz: t.tabQuiz, exam: t.tabExam };

  // Apply localisation — English mode strips all Chinese text
  const ch = localiseChapter(chapter, lang);

  return (
    <div style={styles.pageWrap}>
      <button onClick={() => nav("curriculum", book, null)} style={styles.backBtn}>{t.backCurriculum}</button>

      <div style={{ ...styles.chapterHeader, borderColor: bookData.color }}>
        <div style={{ ...styles.chapterBookBadge, background: bookData.color }}>
          {book} — {t.chapterLabel} {ch.num}
        </div>
        <h2 style={styles.chapterTitle}>{ch.title}</h2>
        <p style={styles.chapterOverview}>{ch.overview}</p>
      </div>

      <div style={styles.tabBar}>
        {["learn", "videos", "quiz", "exam"].map(tab_id => (
          <button key={tab_id} onClick={() => setTab(tab_id)}
            style={{ ...styles.tab, ...(tab === tab_id ? { ...styles.tabActive, borderColor: bookData.color, color: bookData.color } : {}) }}>
            {tabLabels[tab_id]}
          </button>
        ))}
      </div>

      {tab === "learn" && (
        <div style={styles.learnContent}>
          <section style={styles.learnSection}>
            <h3 style={styles.sectionTitle}>{t.secKeyPoints}</h3>
            <ul style={styles.keyPointsList}>
              {ch.keyPoints.map((kp, i) => (
                <li key={i} style={styles.keyPoint}>
                  <span style={{ ...styles.kpNum, background: bookData.color }}>{i + 1}</span>
                  <span style={styles.kpText}>{kp}</span>
                </li>
              ))}
            </ul>
          </section>

          <section style={styles.learnSection}>
            <h3 style={styles.sectionTitle}>{t.secFormulas}</h3>
            <div style={styles.formulasGrid}>
              {ch.formulas.map((f, i) => (
                <div key={i} style={styles.formulaCard}>
                  <div style={styles.formulaName}>{f.name}</div>
                  <div style={{ ...styles.formulaExpr, borderColor: bookData.color + "66" }}>{f.expr}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={styles.learnSection}>
            <h3 style={styles.sectionTitle}>{t.secHardPoints}</h3>
            <div style={styles.hardPointBox}>
              <span style={styles.hardIcon}>!</span>
              <p style={styles.hardText}>{ch.hardPoints}</p>
            </div>
          </section>

          {ch.examTips && (
            <section style={styles.learnSection}>
              <h3 style={styles.sectionTitle}>{t.secExamTips}</h3>
              <div style={{ ...styles.hardPointBox, background: "rgba(0,48,135,0.05)", borderColor: "rgba(0,48,135,0.2)" }}>
                <span style={{ ...styles.hardIcon, background: "#DA291C" }}>★</span>
                <p style={{ ...styles.hardText, color: "#003087" }}>{ch.examTips}</p>
              </div>
            </section>
          )}
        </div>
      )}

      {tab === "videos" && (
        <div style={styles.learnContent}>
          <p style={styles.videoIntro}>
            {t.videoIntro} {ch.num}: <strong>{ch.title}</strong>
          </p>
          {chapter.youtube.map((v, i) => (
            <a key={i} href={v.url} target="_blank" rel="noopener noreferrer" style={styles.videoCard}>
              <div style={styles.videoThumb}>▶</div>
              <div style={styles.videoInfo}>
                <div style={styles.videoTitle}>{v.title}</div>
                <div style={styles.videoChannel}>{v.channel}</div>
                <div style={styles.videoHint}>{t.videoHint}</div>
              </div>
            </a>
          ))}
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent("A level maths " + titleEn(chapter.title) + " " + book + " Cambridge Edexcel IAL")}`}
            target="_blank" rel="noopener noreferrer"
            style={styles.videoCardAlt}>
            {t.searchMore}
          </a>
        </div>
      )}

      {tab === "quiz" && <QuizView chapter={chapter} book={book} nav={nav} t={t} lang={lang} embedded />}
      {tab === "exam" && <ExamView chapter={chapter} book={book} nav={nav} t={t} lang={lang} embedded />}
    </div>
  );
}

// ============================================================
// FALLBACK QUESTION GENERATOR
// ============================================================
function generateFallbackQuestions(chapterTitle, keyPointsStr, formulasStr, book, lang) {
  const titleLower = chapterTitle.toLowerCase();
  const isZh = lang === "zh";

  // Helper to create a question object
  const createQ = (id, question, options, correct, solution, concept, deepExpl, keyFormula, commonMistake, whyWrong) => ({
    id, question, options: { A: options[0], B: options[1], C: options[2], D: options[3] }, correct, solution, concept, deepExplanation: deepExpl, keyFormula, commonMistake, whyOthersWrong: { B: whyWrong[0], C: whyWrong[1], D: whyWrong[2] }
  });

  // Topic-based question generators
  if (titleLower.includes("algebraic") || titleLower.includes("代数表达式")) {
    return [
      createQ("q1",
        isZh ? "化简：a⁵ × a³ ÷ a²" : "Simplify: a⁵ × a³ ÷ a²",
        isZh ? ["a⁶", "a⁷", "a⁸", "a¹⁰"] : ["a⁶", "a⁷", "a⁸", "a¹⁰"],
        "A",
        isZh ? "a⁵ × a³ ÷ a² = a^(5+3-2) = a⁶" : "a⁵ × a³ ÷ a² = a^(5+3-2) = a⁶",
        isZh ? "指数法则（同底数幂相乘除）" : "Index Laws (multiplying and dividing like bases)",
        isZh ? "当底数相同时，指数相加表示乘法，相减表示除法。所以 a⁵ × a³ ÷ a² = a^(5+3-2) = a⁶。" : "When bases are the same, add exponents for multiplication and subtract for division. So a⁵ × a³ ÷ a² = a^(5+3-2) = a⁶.",
        isZh ? "aᵐ × aⁿ = a^(m+n)；aᵐ ÷ aⁿ = a^(m-n)" : "aᵐ × aⁿ = a^(m+n)；aᵐ ÷ aⁿ = a^(m-n)",
        isZh ? "学生常忘记指数是相加而不是相乘，或者除法时忘记减指数" : "Students often forget to add/subtract exponents rather than multiply them, or forget to subtract for division",
        isZh ? ["指数相加错误，误认为 a⁵ × a³ = a¹⁵", "除法时忘记减指数", "符号处理错误"] : ["Adding exponents incorrectly: a⁵ × a³ ≠ a¹⁵", "Forgetting to subtract exponents in division", "Sign errors"]
      ),
      createQ("q2",
        isZh ? "化简：(2x³)²" : "Simplify: (2x³)²",
        isZh ? ["4x⁶", "2x⁶", "4x⁵", "2x⁵"] : ["4x⁶", "2x⁶", "4x⁵", "2x⁵"],
        "A",
        isZh ? "(2x³)² = 2² × (x³)² = 4 × x⁶ = 4x⁶" : "(2x³)² = 2² × (x³)² = 4 × x⁶ = 4x⁶",
        isZh ? "指数的幂" : "Power of a power",
        isZh ? "当整个表达式被平方时，系数和变量都要平方。所以 (2x³)² = 2² × (x³)² = 4 × x⁶ = 4x⁶。" : "When the entire expression is squared, both the coefficient and variable must be squared. So (2x³)² = 2² × (x³)² = 4 × x⁶ = 4x⁶.",
        isZh ? "(ab)^n = a^n × b^n；(a^m)^n = a^(m×n)" : "(ab)^n = a^n × b^n；(a^m)^n = a^(m×n)",
        isZh ? "只平方了系数或只平方了变量，没有两者都平方" : "Squaring only the coefficient or only the variable, not both",
        isZh ? ["忘记平方系数", "忘记平方变量的指数", "计算 2² × 3²"] : ["Forgetting to square coefficient", "Forgetting to square variable's power", "Calculating 2² × 3²"]
      )
    ];
  }

  if (titleLower.includes("quadratics") || titleLower.includes("二次函数")) {
    return [
      createQ("q1",
        isZh ? "求二次函数 y = x² - 6x + 11 的顶点坐标" : "Find the vertex of y = x² - 6x + 11",
        isZh ? ["(3, 2)", "(-3, 2)", "(3, -2)", "(-3, -2)"] : ["(3, 2)", "(-3, 2)", "(3, -2)", "(-3, -2)"],
        "A",
        isZh ? "配方：y = (x - 3)² + 2，顶点为 (3, 2)" : "Complete the square: y = (x - 3)² + 2, vertex = (3, 2)",
        isZh ? "配方法求顶点" : "Completing the square to find vertex",
        isZh ? "二次函数 y = x² - 6x + 11 配方后为 y = (x - 3)² + 2。顶点的 x 坐标来自括号内 -3 变号，y 坐标是常数项 2。" : "Completing the square for y = x² - 6x + 11 gives y = (x - 3)² + 2. The vertex x-coordinate comes from changing -3 to +3, and y-coordinate is the constant term 2.",
        isZh ? "顶点 = (-b/2a, c - b²/4a)" : "Vertex = (-b/2a, c - b²/4a)",
        isZh ? "忘记配方时提出系数，或符号变错" : "Forgetting to factor out coefficient before completing square, or sign errors",
        isZh ? ["x 坐标忘记变号", "配方错误", "误认为顶点是 (6, 11)"] : ["Forgetting to change sign of x-coordinate", "Completing square error", "Mistaking vertex as (6, 11)"]
      ),
      createQ("q2",
        isZh ? "用判别式判断 x² - 4x + 4 = 0 的根的情况" : "Use discriminant to determine roots of x² - 4x + 4 = 0",
        isZh ? ["两个相等实根", "两个不同实根", "无实根", "无法确定"] : ["Two equal real roots", "Two distinct real roots", "No real roots", "Cannot determine"],
        "A",
        isZh ? "Δ = (-4)² - 4×1×4 = 16 - 16 = 0，有两个相等实根" : "Δ = (-4)² - 4×1×4 = 16 - 16 = 0, two equal real roots",
        isZh ? "判别式的应用" : "Using the discriminant",
        isZh ? "对于二次方程 ax² + bx + c = 0，判别式 Δ = b² - 4ac。当 Δ = 0 时，方程有两个相等的实根（重根）。本题中 Δ = (-4)² - 4×1×4 = 0。" : "For quadratic equation ax² + bx + c = 0, the discriminant Δ = b² - 4ac. When Δ = 0, the equation has two equal real roots (repeated root). Here Δ = (-4)² - 4×1×4 = 0.",
        isZh ? "Δ = b² - 4ac；Δ = 0 有重根，Δ > 0 两不同根，Δ < 0 无实根" : "Δ = b² - 4ac；Δ = 0 repeated root, Δ > 0 two distinct roots, Δ < 0 no real roots",
        isZh ? "判别式计算错误，尤其是负数的平方" : "Incorrect discriminant calculation, especially with negative numbers",
        isZh ? ["误认为 Δ > 0", "计算 Δ 时 b² 算错", "忘记 Δ = 0 的含义"] : ["Mistaking Δ > 0", "Calculating Δ incorrectly", "Forgetting meaning of Δ = 0"]
      )
    ];
  }

  if (titleLower.includes("equations") || titleLower.includes("inequalities") || titleLower.includes("方程与不等式")) {
    return [
      createQ("q1",
        isZh ? "解不等式：|x - 2| < 3" : "Solve: |x - 2| < 3",
        isZh ? ["-1 < x < 5", "x < -1 或 x > 5", "-5 < x < 1", "x < 2"] : ["-1 < x < 5", "x < -1 or x > 5", "-5 < x < 1", "x < 2"],
        "A",
        isZh ? "|x - 2| < 3 → -3 < x - 2 < 3 → -1 < x < 5" : "|x - 2| < 3 → -3 < x - 2 < 3 → -1 < x < 5",
        isZh ? "绝对值不等式（< 型）" : "Absolute value inequality (< type)",
        isZh ? "绝对值不等式 |x - a| < b 表示 x 在 a-b 到 a+b 之间。所以 |x - 2| < 3 → -3 < x - 2 < 3 → -1 < x < 5。" : "The absolute value inequality |x - a| < b means x is between a-b and a+b. So |x - 2| < 3 → -3 < x - 2 < 3 → -1 < x < 5.",
        isZh ? "|x - a| < b ↔ a - b < x < a + b" : "|x - a| < b ↔ a - b < x < a + b",
        isZh ? "忘记将 -3 和 3 分别加到两边" : "Forgetting to add -3 and 3 to both sides",
        isZh ? ["区间方向搞反", "忘记处理负不等号", "认为有两个区间"] : ["Getting interval direction wrong", "Forgetting to handle negative inequality", "Thinking there are two intervals"]
      ),
      createQ("q2",
        isZh ? "解联立方程：y = 2x + 1, x² + y² = 25" : "Solve simultaneously: y = 2x + 1, x² + y² = 25",
        isZh ? ["x = -3, 3", "x = -2, 2", "x = -4, 4", "x = 0"] : ["x = -3, 3", "x = -2, 2", "x = -4, 4", "x = 0"],
        "A",
        isZh ? "代入 y = 2x + 1：x² + (2x + 1)² = 25 → 5x² + 4x - 24 = 0 → x = -3 或 x = 3" : "Substitute y = 2x + 1: x² + (2x + 1)² = 25 → 5x² + 4x - 24 = 0 → x = -3 or x = 3",
        isZh ? "线性-二次联立方程" : "Linear-quadratic simultaneous equations",
        isZh ? "将线性方程代入二次方程中消去一个变量，然后解二次方程。本题代入后得到 5x² + 4x - 24 = 0，可因式分解或用求根公式。" : "Substitute the linear equation into the quadratic to eliminate one variable, then solve the resulting quadratic. This gives 5x² + 4x - 24 = 0, which can be factored or solved with the quadratic formula.",
        isZh ? "代入消元法" : "Substitution method",
        isZh ? "代入时展开错误或计算失误" : "Expansion errors during substitution or calculation mistakes",
        isZh ? ["代入错误", "因式分解错误", "忘记找 y 值"] : ["Substitution error", "Factorization error", "Forgetting to find y value"]
      )
    ];
  }

  if (titleLower.includes("graphs") || titleLower.includes("transformations") || titleLower.includes("图像与变换")) {
    return [
      createQ("q1",
        isZh ? "函数 f(x) = x²，求 f(x - 3) 的图像变换" : "If f(x) = x², describe the graph of f(x - 3)",
        isZh ? ["向右平移 3 个单位", "向左平移 3 个单位", "向上平移 3 个单位", "向下平移 3 个单位"] : ["Translate right by 3 units", "Translate left by 3 units", "Translate up by 3 units", "Translate down by 3 units"],
        "A",
        isZh ? "f(x - 3) 表示将 f(x) 向右平移 3 个单位" : "f(x - 3) represents a translation of f(x) by 3 units to the right",
        isZh ? "水平变换（平移）" : "Horizontal transformation (translation)",
        isZh ? "对于函数变换 f(x - a)，图像向右平移 a 个单位。这是常见的陷阱——括号内是 x - a，但图像向右移。" : "For function transformation f(x - a), the graph translates a units to the right. This is a common trap - the bracket shows x - a but the graph moves right.",
        isZh ? "f(x + a) 左移 a；f(x - a) 右移 a" : "f(x + a) translate left by a；f(x - a) translate right by a",
        isZh ? "误认为减号对应左移" : "Mistakenly thinking minus sign means left translation",
        isZh ? ["误认为左移", "与纵向平移混淆", "认为幅度是 -3"] : ["Mistaking for left translation", "Confusing with vertical translation", "Thinking magnitude is -3"]
      ),
      createQ("q2",
        isZh ? "函数 f(x) = x³，求 f(2x) 的图像变换" : "If f(x) = x³, describe the graph of f(2x)",
        isZh ? ["横向压缩至原来的 1/2", "横向拉伸至原来的 2 倍", "纵向拉伸至原来的 2 倍", "纵向压缩至原来的 1/2"] : ["Horizontal compression by factor 1/2", "Horizontal stretch by factor 2", "Vertical stretch by factor 2", "Vertical compression by factor 1/2"],
        "A",
        isZh ? "f(2x) 表示横向压缩至原来的 1/2" : "f(2x) represents a horizontal compression by factor 1/2",
        isZh ? "水平伸缩变换" : "Horizontal stretch/compression transformation",
        isZh ? "对于 f(ax)，当 a > 1 时，横向压缩至 1/a；当 0 < a < 1 时，横向拉伸至 1/a。本题中 f(2x) 横向压缩至 1/2。" : "For f(ax), when a > 1, horizontally compress by 1/a; when 0 < a < 1, horizontally stretch by 1/a. Here f(2x) compresses horizontally by 1/2.",
        isZh ? "f(ax)：横向伸缩至 1/a" : "f(ax): horizontal stretch by 1/a",
        isZh ? "误认为横向拉伸或搞反方向" : "Mistaking for horizontal stretch or getting direction wrong",
        isZh ? ["误认为拉伸", "与纵向变换混淆", "系数关系搞反"] : ["Mistaking for stretch", "Confusing with vertical transformation", "Getting coefficient relationship wrong"]
      )
    ];
  }

  if (titleLower.includes("differentiation") || titleLower.includes("求导") || titleLower.includes("导数")) {
    return [
      createQ("q1",
        isZh ? "求函数 y = 3x² - 5x + 2 在 x = 2 处的导数值" : "Find dy/dx at x = 2 for y = 3x² - 5x + 2",
        isZh ? ["7", "11", "13", "5"] : ["7", "11", "13", "5"],
        "A",
        isZh ? "dy/dx = 6x - 5，当 x = 2 时，dy/dx = 12 - 5 = 7" : "dy/dx = 6x - 5, at x = 2: dy/dx = 12 - 5 = 7",
        isZh ? "多项式函数求导" : "Differentiation of polynomial functions",
        isZh ? "对多项式求导时，每一项的指数降低 1，并乘以原指数。常数项导数为 0。所以 dy/dx = 6x - 5。" : "When differentiating a polynomial, reduce the power of each term by 1 and multiply by the original power. The derivative of a constant is 0. So dy/dx = 6x - 5.",
        isZh ? "d/dx(axⁿ) = n·ax^(n-1)" : "d/dx(axⁿ) = n·ax^(n-1)",
        isZh ? "忘记乘以指数，或常数项求导不为 0" : "Forgetting to multiply by the power, or not setting constant term derivative to 0",
        isZh ? ["忘记乘以指数", "常数项处理错误", "减号项变号错误"] : ["Forgetting to multiply by power", "Constant term handling error", "Sign error on negative term"]
      ),
      createQ("q2",
        isZh ? "求函数 y = x³ - 3x² + 2x 的驻点" : "Find stationary points of y = x³ - 3x² + 2x",
        isZh ? ["x = 1/3, 2", "x = 0, 1", "x = -1, 2", "x = 1, 3"] : ["x = 1/3, 2", "x = 0, 1", "x = -1, 2", "x = 1, 3"],
        "A",
        isZh ? "dy/dx = 3x² - 6x + 2 = 0 → x = (6 ± √12)/6 = (6 ± 2√3)/6 = 1 ± √3/3" : "dy/dx = 3x² - 6x + 2 = 0 → x = (6 ± √12)/6 = (6 ± 2√3)/6 = 1 ± √3/3",
        isZh ? "求驻点" : "Finding stationary points",
        isZh ? "驻点出现在导数为 0 的位置。解二次方程 3x² - 6x + 2 = 0 得到 x 值。" : "Stationary points occur where the derivative is zero. Solve the quadratic equation 3x² - 6x + 2 = 0 for x values.",
        isZh ? "驻点：dy/dx = 0" : "Stationary points: dy/dx = 0",
        isZh ? "求导错误或解二次方程出错" : "Differentiation error or solving quadratic incorrectly",
        isZh ? ["求导错误", "解方程错误", "判别式计算错误"] : ["Differentiation error", "Solving equation error", "Discriminant calculation error"]
      )
    ];
  }

  if (titleLower.includes("integration") || titleLower.includes("积分")) {
    return [
      createQ("q1",
        isZh ? "求不定积分：∫(2x + 3)dx" : "Find indefinite integral: ∫(2x + 3)dx",
        isZh ? ["x² + 3x + C", "x² + C", "2x² + 3x + C", "x + 3 + C"] : ["x² + 3x + C", "x² + C", "2x² + 3x + C", "x + 3 + C"],
        "A",
        isZh ? "∫(2x + 3)dx = x² + 3x + C" : "∫(2x + 3)dx = x² + 3x + C",
        isZh ? "多项式函数积分" : "Integration of polynomial functions",
        isZh ? "积分是求导的逆运算。对 xⁿ 积分得到 x^(n+1)/(n+1)。常数项积分得到常数乘以 x。" : "Integration is the reverse of differentiation. Integrating xⁿ gives x^(n+1)/(n+1). Constant terms integrate to constant times x.",
        isZh ? "∫xⁿdx = x^(n+1)/(n+1) + C" : "∫xⁿdx = x^(n+1)/(n+1) + C",
        isZh ? "忘记加 1 再除以 n+1" : "Forgetting to add 1 then divide by n+1",
        isZh ? ["忘记加常数 C", "指数处理错误", "忘记 +1 再除"] : ["Forgetting constant C", "Power handling error", "Forgetting to add 1 then divide"]
      ),
      createQ("q2",
        isZh ? "求定积分：∫(x² + 1)dx 从 0 到 2" : "Find definite integral: ∫(x² + 1)dx from 0 to 2",
        isZh ? ["14/3", "8/3", "10/3", "4"] : ["14/3", "8/3", "10/3", "4"],
        "A",
        isZh ? "∫(x² + 1)dx = x³/3 + x，从 0 到 2：(8/3 + 2) - 0 = 14/3" : "∫(x² + 1)dx = x³/3 + x, from 0 to 2: (8/3 + 2) - 0 = 14/3",
        isZh ? "定积分的计算" : "Calculation of definite integrals",
        isZh ? "先求不定积分，然后代入上下限相减。本题不定积分为 x³/3 + x，代入 2 得 8/3 + 2，代入 0 得 0。" : "Find indefinite integral first, then substitute upper and lower limits. Indefinite integral is x³/3 + x, substitute 2 gives 8/3 + 2, substitute 0 gives 0.",
        isZh ? "定积分：∫[a,b] f(x)dx = F(b) - F(a)" : "Definite integral: ∫[a,b] f(x)dx = F(b) - F(a)",
        isZh ? "代入错误或计算失误" : "Substitution error or calculation mistake",
        isZh ? ["下限代入错误", "分数运算错误", "忘记下限是 0"] : ["Lower limit substitution error", "Fraction operation error", "Forgetting lower limit is 0"]
      )
    ];
  }

  if (titleLower.includes("trigonometry") || titleLower.includes("三角")) {
    return [
      createQ("q1",
        isZh ? "解方程 2sin(x) = 1，0 ≤ x ≤ 2π" : "Solve 2sin(x) = 1 for 0 ≤ x ≤ 2π",
        isZh ? ["π/6, 5π/6", "π/3, 2π/3", "π/6, π/2", "π/4, 3π/4"] : ["π/6, 5π/6", "π/3, 2π/3", "π/6, π/2", "π/4, 3π/4"],
        "A",
        isZh ? "sin(x) = 0.5，在 [0, 2π] 中 x = π/6 和 x = 5π/6" : "sin(x) = 0.5, in [0, 2π] x = π/6 and x = 5π/6",
        isZh ? "基本三角方程求解" : "Solving basic trigonometric equations",
        isZh ? "首先将方程化为标准形式 sin(x) = 0.5，然后利用特殊角的三角函数值。在第一象限 x = π/6，第二象限 x = 5π/6。" : "First rewrite in standard form sin(x) = 0.5, then use special angle values. In first quadrant x = π/6, in second quadrant x = 5π/6.",
        isZh ? "sin(x) = k 的解：x = arcsin(k) 或 x = π - arcsin(k)" : "sin(x) = k solutions: x = arcsin(k) or x = π - arcsin(k)",
        isZh ? "忘记第二象限的解" : "Forgetting the solution in second quadrant",
        isZh ? ["只给出一个解", "角度单位搞错", "特殊角值记错"] : ["Giving only one solution", "Getting angle unit wrong", "Remembering special angle value incorrectly"]
      ),
      createQ("q2",
        isZh ? "化简：sin²(x) + cos²(x)" : "Simplify: sin²(x) + cos²(x)",
        isZh ? ["1", "2", "0", "sin(2x)"] : ["1", "2", "0", "sin(2x)"],
        "A",
        isZh ? "根据毕达哥拉斯恒等式，sin²(x) + cos²(x) = 1" : "By Pythagorean identity, sin²(x) + cos²(x) = 1",
        isZh ? "毕达哥拉斯恒等式" : "Pythagorean identity",
        isZh ? "sin²(x) + cos²(x) = 1 是最基本的三角恒等式之一，来源于单位圆定义：任意角终边与单位圆的交点到原点距离为 1。" : "sin²(x) + cos²(x) = 1 is one of the fundamental trigonometric identities, derived from the unit circle definition: the distance from origin to point where terminal side meets unit circle is 1.",
        isZh ? "sin²(x) + cos²(x) = 1" : "sin²(x) + cos²(x) = 1",
        isZh ? "误认为等于 2 或其他值" : "Mistakenly thinking it equals 2 or other values",
        isZh ? ["误认为等于 2", "与 sin(2x) 混淆", "忘记这是恒等式"] : ["Mistaking for 2", "Confusing with sin(2x)", "Forgetting this is an identity"]
      )
    ];
  }

  // Default fallback questions for unknown topics
  return [
    createQ("q1",
      isZh ? "Solve x² + 5x + 6 = 0" : "Solve x² + 5x + 6 = 0",
      isZh ? ["x = -2, -3", "x = 2, 3", "x = -2, 3", "x = 2, -3"] : ["x = -2, -3", "x = 2, 3", "x = -2, 3", "x = 2, -3"],
      "A",
      isZh ? "因式分解：(x+2)(x+3) = 0，所以 x = -2 或 x = -3" : "Factor: (x+2)(x+3) = 0, so x = -2 or x = -3",
      isZh ? "二次方程因式分解" : "Quadratic equation factorisation",
      isZh ? "解 x² + 5x + 6 = 0，需要找到两个数，它们的乘积是 +6（常数项），和是 +5（x 的系数）。这两个数是 +2 和 +3。" : "To solve x² + 5x + 6 = 0, find two numbers that multiply to give +6 (the constant) and add to give +5 (the coefficient of x). Those numbers are +2 and +3.",
      isZh ? "x² + bx + c = 0：找 p,q 满足 p×q = c 且 p+q = b，则 (x+p)(x+q) = 0" : "For x² + bx + c = 0: find p, q where p×q = c and p+q = b, then (x+p)(x+q) = 0",
      isZh ? "符号混淆：如果因式是 (x+2)(x+3)，解是 x = -2 和 x = -3（负数！），不是 +2 和 +3" : "Sign confusion: if factors are (x+2)(x+3), solutions are x = -2 and x = -3 (negative!), not +2 and +3",
      isZh ? ["x=2,3 是正数—忘记 (x+2)=0 得 x=-2", "混合符号—只有当常数项为负时才适用", "只有一个根符号反转—典型粗心错误"] : ["x=2,3 are positive—forgetting (x+2)=0 gives x=-2", "Mixed signs—only works if constant term is negative", "Only one root sign reversed—typical careless error"]
    )
  ];
}

// ============================================================
// QUIZ VIEW (AI-generated)
// ============================================================
function QuizView({ chapter, book, nav, embedded, onAddError, t, lang }) {
  const [difficulty, setDifficulty] = useState("medium");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [started, setStarted] = useState(false);
  const [selectedBook, setSelectedBook] = useState(book || "P1");
  const [selectedChapter, setSelectedChapter] = useState(chapter || null);

  const chapterList = selectedBook ? CURRICULUM[selectedBook]?.chapters || [] : [];

  const generateQuestions = async () => {
    setLoading(true);
    setStarted(true);
    setQuestions([]);
    setCurrent(0);
    setScore({ correct: 0, total: 0 });
    setFeedback(null);

    const chapterInfo = selectedChapter || (chapterList[0] || null);
    const chTitle = chapterInfo?.title || "General A-Level Mathematics";
    const keyPoints = chapterInfo?.keyPoints?.join("; ") || "";
    const formulas = chapterInfo?.formulas?.map(f => `${f.name}: ${f.expr}`).join("; ") || "";

    const system = `You are an expert A-Level Mathematics teacher creating exam questions for Pearson Edexcel International A-Level (IAL). The course covers Pure Mathematics (P1–P4, papers WMA11–WMA14), Statistics 1 (S1, WST01), and Mechanics 1 (M1, WME01). 
Generate questions exactly as a real Cambridge exam would. Always respond in valid JSON only — no markdown, no prose.
${lang === "zh" ? "Write ALL question text, options, solutions, explanations, and all string values in Simplified Chinese (简体中文)." : "Write all content in English."}`;

    const prompt = `Generate 5 ${difficulty === "hard" ? "challenging A-level exam-style" : "medium difficulty A-level"} questions for the topic: "${chTitle}" (${selectedBook}).

Key concepts to cover: ${keyPoints}
Key formulas: ${formulas}

For each question provide ALL of the following fields:
- question: A clear, specific mathematical question
- options: 4 multiple choice options (A, B, C, D), only one correct
- correct: the correct answer letter
- solution: A concise worked solution (1-2 lines)
- concept: The specific exam skill or concept being tested
- deepExplanation: A thorough 3-5 sentence explanation of WHY the correct answer is right, walking through the mathematical reasoning step by step as a tutor would explain to a student
- keyFormula: The most important formula or rule needed to solve this question (write it clearly)
- commonMistake: The most common mistake students make on this type of question and how to avoid it
- whyOthersWrong: Briefly explain why each wrong option is a common trap or misconception

Return ONLY a JSON array, no markdown:
[
  {
    "id": "q1",
    "question": "...",
    "options": {"A": "...", "B": "...", "C": "...", "D": "..."},
    "correct": "A",
    "solution": "...",
    "concept": "...",
    "deepExplanation": "...",
    "keyFormula": "...",
    "commonMistake": "...",
    "whyOthersWrong": {"B": "...", "C": "...", "D": "..."}
  }
]`;

    try {
      console.log("✍️ [Quiz] Generating questions with provider:", getApiProvider());
      const raw = await callAI(system, prompt, 8000);
      console.log("✍️ [Quiz] Raw response:", raw.substring(0, 200) + "...");
      const clean = raw.replace(/```json|```/g, "").trim();
      console.log("✍️ [Quiz] Cleaned response:", clean.substring(0, 200) + "...");
      const parsed = JSON.parse(clean);
      setQuestions(parsed);
    } catch (e) {
      console.error("✍️ [Quiz] Error:", e);
      console.log("✍️ [Quiz] Using fallback questions based on chapter:", chTitle);
      // Generate fallback questions based on chapter topic
      const fallbackQuestions = generateFallbackQuestions(chTitle, keyPoints, formulas, selectedBook, lang);
      setQuestions(fallbackQuestions);
    }
    setLoading(false);
  };

  const submitAnswer = () => {
    if (!userAnswer) return;
    const q = questions[current];
    const isCorrect = userAnswer === q.correct;
    setFeedback({
      isCorrect,
      correct: q.correct,
      solution: q.solution,
      concept: q.concept,
      deepExplanation: q.deepExplanation || "",
      keyFormula: q.keyFormula || "",
      commonMistake: q.commonMistake || "",
      whyOthersWrong: q.whyOthersWrong || {},
      userAnswer,
    });
    setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
    if (!isCorrect && onAddError) {
      onAddError({ ...q, chapter: selectedChapter?.title || "General", book: selectedBook, userAnswer, timestamp: Date.now() });
    }
  };

  const next = () => {
    setUserAnswer("");
    setFeedback(null);
    setCurrent(c => c + 1);
  };

  if (!started) {
    return (
      <div style={styles.setupPanel}>
        <h3 style={styles.setupTitle}>{t.aiQuizTitle}</h3>
        {!embedded && (
          <>
            <label style={styles.label}>{t.selectTextbook}</label>
            <select style={styles.select} value={selectedBook}
              onChange={e => { setSelectedBook(e.target.value); setSelectedChapter(null); }}>
              {Object.entries(CURRICULUM).map(([k, v]) => (
                <option key={k} value={k}>{k} — {v.title}</option>
              ))}
            </select>
            <label style={styles.label}>{t.selectChapter}</label>
            <select style={styles.select} value={selectedChapter?.id || ""}
              onChange={e => setSelectedChapter(chapterList.find(c => c.id === e.target.value) || null)}>
              <option value="">{t.allChapters}</option>
              {CURRICULUM[selectedBook]?.chapters.map(c => (
                <option key={c.id} value={c.id}>Ch {c.num}: {c.title}</option>
              ))}
            </select>
          </>
        )}
        <label style={styles.label}>{t.diffLabel}</label>
        <div style={styles.diffRow}>
          {["medium", "hard"].map(d => (
            <button key={d} onClick={() => setDifficulty(d)}
              style={{ ...styles.diffBtn, ...(difficulty === d ? styles.diffBtnActive : {}) }}>
              {d === "medium" ? t.medium : t.hard}
            </button>
          ))}
        </div>
        <button onClick={generateQuestions} style={styles.btnPrimary}>
          {t.generateBtn}
        </button>
      </div>
    );
  }

  if (loading) return <LoadingSpinner message={t.generatingMsg} />;

  if (current >= questions.length) {
    return (
      <div style={styles.resultPanel}>
        <div style={styles.resultScore}>{score.correct}/{score.total}</div>
        <div style={styles.resultLabel}>{t.questionsCorrect}</div>
        <div style={styles.resultGrade}>
          {score.correct === score.total ? t.perfect :
            score.correct >= score.total * 0.8 ? t.excellent :
              score.correct >= score.total * 0.6 ? t.goodWork : t.keepPractising}
        </div>
        <div style={styles.resultBtns}>
          <button onClick={() => { setStarted(false); setQuestions([]); }} style={styles.btnSecondary}>{t.newQuiz}</button>
          <button onClick={generateQuestions} style={styles.btnPrimary}>{t.tryAgain}</button>
        </div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div style={styles.quizPanel}>
      <div style={styles.quizProgress}>
        {t.questionOf(current + 1, questions.length)} · {t.scoreLabel} {score.correct}/{score.total}
        <span style={{ ...styles.diffTag, background: difficulty === "hard" ? "#7C2020" : "#1D4ED8" }}>
          {difficulty === "hard" ? t.hard : t.medium}
        </span>
      </div>
      <div style={styles.questionBox}>
        <div style={styles.questionText}>{q.question}</div>
      </div>
      <div style={styles.optionsGrid}>
        {Object.entries(q.options).map(([letter, text]) => (
          <button key={letter}
            onClick={() => !feedback && setUserAnswer(letter)}
            style={{
              ...styles.optionBtn,
              ...(userAnswer === letter && !feedback ? styles.optionSelected : {}),
              ...(feedback && letter === q.correct ? styles.optionCorrect : {}),
              ...(feedback && userAnswer === letter && !feedback?.isCorrect ? styles.optionWrong : {}),
              ...(feedback && userAnswer === letter && letter !== q.correct ? styles.optionWrong : {}),
            }}>
            <span style={styles.optionLetter}>{letter}</span>
            {text}
          </button>
        ))}
      </div>

      {!feedback ? (
        <button onClick={submitAnswer} disabled={!userAnswer} style={{ ...styles.btnPrimary, opacity: userAnswer ? 1 : 0.5 }}>
          {t.submitAnswer}
        </button>
      ) : (
        <div style={{ ...styles.feedbackBox, borderColor: feedback.isCorrect ? "#1D4ED8" : "#7c4a4a" }}>
          <div style={{ ...styles.feedbackHeader, background: feedback.isCorrect ? "rgba(26,122,60,0.08)" : "rgba(218,41,28,0.06)" }}>
            <span style={{ fontSize: 22 }}>{feedback.isCorrect ? "✅" : "❌"}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, color: feedback.isCorrect ? "#1A7A3C" : "#DA291C" }}>
                {feedback.isCorrect ? t.feedCorrect : `${t.feedIncorrect} ${feedback.correct}`}
              </div>
              <div style={{ fontSize: 12, color: "#5C5C5C", marginTop: 2 }}>
                🎯 {t.conceptTested} <em>{feedback.concept}</em>
              </div>
            </div>
          </div>
          {feedback.keyFormula && (
            <div style={styles.explanationBlock}>
              <div style={styles.explanationLabel}>{t.secKeyFormula}</div>
              <div style={styles.formulaHighlight}>{feedback.keyFormula}</div>
            </div>
          )}
          <div style={styles.explanationBlock}>
            <div style={styles.explanationLabel}>{t.secSolution}</div>
            <div style={styles.solutionSteps}>{feedback.solution}</div>
          </div>
          {feedback.deepExplanation && (
            <div style={styles.explanationBlock}>
              <div style={styles.explanationLabel}>{t.secAIExplain}</div>
              <div style={styles.deepExplain}>{feedback.deepExplanation}</div>
            </div>
          )}
          {feedback.whyOthersWrong && Object.keys(feedback.whyOthersWrong).length > 0 && (
            <div style={styles.explanationBlock}>
              <div style={styles.explanationLabel}>{t.secWhyWrong}</div>
              <div style={styles.wrongOptionsGrid}>
                {Object.entries(feedback.whyOthersWrong).map(([letter, reason]) => (
                  <div key={letter} style={styles.wrongOptionRow}>
                    <span style={{ ...styles.wrongLetter, background: letter === feedback.userAnswer ? "#DA291C" : "#E8E8E8" }}>{letter}</span>
                    <span style={styles.wrongReason}>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {feedback.commonMistake && (
            <div style={{ ...styles.explanationBlock, borderLeft: "3px solid #DA291C" }}>
              <div style={{ ...styles.explanationLabel, color: "#DA291C" }}>{t.secMistake}</div>
              <div style={{ color: "#5C1A1A", fontSize: 14, lineHeight: 1.7 }}>{feedback.commonMistake}</div>
            </div>
          )}
          <div style={{ padding: "16px 20px" }}>
            <button onClick={next} style={{ ...styles.btnPrimary, marginTop: 0, width: "100%" }}>
              {current + 1 < questions.length ? t.nextQuestion : t.seeResults}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// EXAM VIEW (AI-generated, timed)
// ============================================================
function ExamView({ chapter, book, nav, embedded, onAddError, t, lang }) {
  const [phase, setPhase] = useState("setup");
  const [difficulty, setDifficulty] = useState("medium");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState(null);
  const [selectedBook, setSelectedBook] = useState(book || "P1");
  const [selectedChapter, setSelectedChapter] = useState(chapter || null);
  const timerRef = useRef();

  const NUM_QUESTIONS = 7;
  const EXAM_MINUTES = difficulty === "hard" ? 35 : 25;

  const startExam = async () => {
    setLoading(true);
    const chapterInfo = selectedChapter || CURRICULUM[selectedBook]?.chapters[0];
    const chTitle = chapterInfo?.title || "Mixed Topics";
    const keyPoints = chapterInfo?.keyPoints?.join("; ") || "";

    const system = `You are a Pearson Edexcel International A-Level (IAL) Mathematics examiner. Generate exam questions exactly like a real Cambridge paper. JSON only, no markdown.${lang === "zh" ? " Write ALL content including questions, options, solutions in Simplified Chinese (简体中文)." : ""}`;
    const prompt = `Create ${NUM_QUESTIONS} ${difficulty === "hard" ? "high difficulty exam-style" : "medium difficulty exam-style"} multiple-choice questions for "${chTitle}" A-Level.

Topics: ${keyPoints}

Return ONLY this JSON:
[{"id":"q1","question":"...","marks":3,"options":{"A":"...","B":"...","C":"...","D":"..."},"correct":"A","solution":"Full worked solution...","topic":"..."}]`;

    try {
      const raw = await callClaude(system, prompt, 2500);
      const clean = raw.replace(/```json|```/g, "").trim();
      const qs = JSON.parse(clean);
      setQuestions(qs);
      setAnswers({});
      setTimeLeft(EXAM_MINUTES * 60);
      setPhase("exam");
    } catch (e) {
      alert("Failed to generate exam. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = timerRef.current;
    if (phase === "exam" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); submitExam(); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [phase, timeLeft]);

  const submitExam = () => {
    clearInterval(timerRef.current);
    let correct = 0;
    const review = questions.map(q => {
      const isCorrect = answers[q.id] === q.correct;
      if (isCorrect) correct++;
      else if (onAddError) onAddError({ ...q, chapter: selectedChapter?.title, book: selectedBook, userAnswer: answers[q.id], timestamp: Date.now() });
      return { ...q, userAnswer: answers[q.id], isCorrect };
    });
    setResults({ correct, total: questions.length, review });
    setPhase("results");
  };

  const fmt = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const urgency = timeLeft < 300;

  if (phase === "setup") {
    return (
      <div style={styles.setupPanel}>
        <h3 style={styles.setupTitle}>{t.aiExamTitle}</h3>
        {!embedded && (
          <>
            <label style={styles.label}>{t.textbookLabel}</label>
            <select style={styles.select} value={selectedBook}
              onChange={e => { setSelectedBook(e.target.value); setSelectedChapter(null); }}>
              {Object.entries(CURRICULUM).map(([k, v]) => (
                <option key={k} value={k}>{k} — {v.title}</option>
              ))}
            </select>
            <label style={styles.label}>{t.chapterOpt}</label>
            <select style={styles.select} value={selectedChapter?.id || ""}
              onChange={e => setSelectedChapter(CURRICULUM[selectedBook]?.chapters.find(c => c.id === e.target.value) || null)}>
              <option value="">{t.mixedChapters}</option>
              {CURRICULUM[selectedBook]?.chapters.map(c => (
                <option key={c.id} value={c.id}>Ch {c.num}: {c.title}</option>
              ))}
            </select>
          </>
        )}
        <label style={styles.label}>{t.diffLabel}</label>
        <div style={styles.diffRow}>
          {["medium", "hard"].map(d => (
            <button key={d} onClick={() => setDifficulty(d)}
              style={{ ...styles.diffBtn, ...(difficulty === d ? styles.diffBtnActive : {}) }}>
              {d === "medium" ? t.mediumTime : t.hardTime}
            </button>
          ))}
        </div>
        <div style={styles.examInfo}>
          <span>📝 {NUM_QUESTIONS} {t.numQLabel}</span>
          <span>⏱️ {EXAM_MINUTES} {t.minLabel}</span>
          <span>{t.markedByAI}</span>
        </div>
        {loading ? <LoadingSpinner message={t.preparingExam} /> : (
          <button onClick={startExam} style={styles.btnPrimary}>{t.startExam}</button>
        )}
      </div>
    );
  }

  if (phase === "exam") {
    return (
      <div style={styles.examPanel}>
        <div style={styles.examHeader}>
          <div style={styles.examTitle}>{t.examPaperTitle}</div>
          <div style={{ ...styles.timer, ...(urgency ? styles.timerUrgent : {}) }}>⏱️ {fmt(timeLeft)}</div>
          <div style={styles.examProgress}>{Object.keys(answers).length}/{questions.length} {t.answered}</div>
        </div>
        <div style={styles.examQuestions}>
          {questions.map((q, i) => (
            <div key={q.id} style={styles.examQuestion}>
              <div style={styles.examQHeader}>
                <span style={styles.examQNum}>Q{i + 1}</span>
                {q.marks && <span style={styles.examQMarks}>[{q.marks} {t.marks}]</span>}
              </div>
              <div style={styles.examQText}>{q.question}</div>
              <div style={styles.examOptions}>
                {Object.entries(q.options).map(([letter, text]) => (
                  <button key={letter}
                    onClick={() => setAnswers(a => ({ ...a, [q.id]: letter }))}
                    style={{ ...styles.optionBtn, ...(answers[q.id] === letter ? styles.optionSelected : {}) }}>
                    <span style={styles.optionLetter}>{letter}</span> {text}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button onClick={submitExam} style={{ ...styles.btnPrimary, background: "#DA291C", marginTop: 24 }}>
          {t.submitExam}
        </button>
      </div>
    );
  }

  if (phase === "results" && results) {
    const pct = Math.round((results.correct / results.total) * 100);
    const grade = pct >= 90 ? "A*" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : pct >= 50 ? "D" : "E";
    return (
      <div style={styles.resultsPanel}>
        <div style={styles.resultsHeader}>
          <div style={styles.resultsGrade}>{grade}</div>
          <div style={styles.resultsScore}>{results.correct}/{results.total} · {pct}%</div>
          <div style={styles.resultsLabel}>{t.examComplete}</div>
        </div>
        <div style={styles.reviewList}>
          {results.review.map((q, i) => (
            <div key={q.id} style={{ ...styles.reviewItem, borderColor: q.isCorrect ? "#1D4ED8" : "#7C2020" }}>
              <div style={styles.reviewHeader}>
                <span>{q.isCorrect ? "✅" : "❌"} Q{i + 1}</span>
                <span style={{ color: q.isCorrect ? "#1A7A3C" : "#DA291C" }}>
                  {q.isCorrect ? t.correctAnswerLabel : `${t.yourAnswerLabel} ${q.userAnswer || t.noAnswer} · ${t.correctLabel}: ${q.correct}`}
                </span>
              </div>
              <div style={styles.reviewQuestion}>{q.question}</div>
              {!q.isCorrect && (
                <>
                  <div style={styles.reviewSolution}><strong>Solution:</strong> {q.solution}</div>
                  <div style={styles.reviewTopic}><strong>Topic:</strong> {q.topic}</div>
                </>
              )}
            </div>
          ))}
        </div>
        <button onClick={() => setPhase("setup")} style={styles.btnSecondary}>Take Another Exam</button>
      </div>
    );
  }

  return null;
}

// ============================================================
// MOCK EXAM VIEW (Past Papers)
// ============================================================
function MockExamView({ nav, onAddError, t, lang }) {
  const [phase, setPhase] = useState("select");
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef();

  const startMock = async (paper) => {
    setSelectedPaper(paper);
    setLoading(true);

    const system = `You are creating realistic Cambridge A-Level past paper questions. Simulate questions from the ${paper.year} ${paper.session} ${paper.paper} paper. JSON only.`;
    const bookData = CURRICULUM[paper.paper.replace(/[12]$/, "")];
    const topics = bookData ? bookData.chapters.map(c => c.title).join(", ") : "Pure Mathematics";

    const prompt = `Create ${paper.questions} realistic past-paper style questions for Cambridge A-Level ${paper.paper} (${paper.year} ${paper.session}).

Topics to cover from this paper: ${topics}

Make questions feel like authentic Cambridge exam questions with realistic difficulty progression (Q1 easiest, last questions hardest).

Return ONLY JSON array:
[{"id":"q1","question":"...","marks":4,"options":{"A":"...","B":"...","C":"...","D":"..."},"correct":"B","solution":"Full worked solution with method marks explained...","topic":"...","difficulty":"..."}]`;

    try {
      console.log("🎯 [Mock Exam] Starting with provider:", getApiProvider());
      const raw = await callAI(system, prompt, 8000);
      console.log("🎯 [Mock Exam] Raw response:", raw.substring(0, 200) + "...");
      const clean = raw.replace(/```json|```/g, "").trim();
      console.log("🎯 [Mock Exam] Cleaned response:", clean.substring(0, 200) + "...");
      const qs = JSON.parse(clean);
      setQuestions(qs);
      setAnswers({});
      setTimeLeft(paper.duration * 60);
      setPhase("exam");
    } catch (e) {
      console.error("🎯 [Mock Exam] Error:", e);
      console.log("🎯 [Mock Exam] Using fallback questions");
      // Fallback questions when API fails
      const fallbackQuestions = [
        {
          id: "q1",
          question: "Find the value of dy/dx at the point where x = 2 for the function y = 3x^2 - 5x + 7.",
          marks: 4,
          options: {
            A: "5",
            B: "7",
            C: "11",
            D: "13"
          },
          correct: "B",
          solution: "dy/dx = 6x - 5. When x = 2, dy/dx = 6(2) - 5 = 12 - 5 = 7.",
          topic: "Differentiation",
          difficulty: "Easy"
        },
        {
          id: "q2",
          question: "Solve the equation 2sin(x) = 1 for 0 <= x <= 2π.",
          marks: 4,
          options: {
            A: "π/6, 5π/6",
            B: "π/3, 2π/3",
            C: "π/6, π/2",
            D: "π/4, 3π/4"
          },
          correct: "A",
          solution: "sin(x) = 0.5. In [0, 2π], sin(x) = 0.5 at x = π/6 and x = 5π/6.",
          topic: "Trigonometry",
          difficulty: "Medium"
        },
        {
          id: "q3",
          question: "Find the coordinates of the vertex of the parabola y = x^2 - 6x + 11.",
          marks: 4,
          options: {
            A: "(3, 2)",
            B: "(-3, 2)",
            C: "(3, -2)",
            D: "(-3, -2)"
          },
          correct: "A",
          solution: "Complete the square: y = (x-3)^2 + 2. The vertex is at (3, 2).",
          topic: "Quadratic Functions",
          difficulty: "Easy"
        },
        {
          id: "q4",
          question: "Find the value of ∫(2x + 3)dx from x = 0 to x = 4.",
          marks: 5,
          options: {
            A: "24",
            B: "28",
            C: "32",
            D: "36"
          },
          correct: "B",
          solution: "∫(2x + 3)dx = x^2 + 3x. From 0 to 4: (16 + 12) - (0 + 0) = 28.",
          topic: "Integration",
          difficulty: "Medium"
        },
        {
          id: "q5",
          question: "Given that log2(x) = 5, find the value of x.",
          marks: 3,
          options: {
            A: "16",
            B: "25",
            C: "32",
            D: "64"
          },
          correct: "C",
          solution: "log2(x) = 5 means 2^5 = x, so x = 32.",
          topic: "Logarithms",
          difficulty: "Easy"
        }
      ];
      setQuestions(fallbackQuestions);
      setAnswers({});
      setTimeLeft(paper.duration * 60);
      setPhase("exam");
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = timerRef.current;
    if (phase === "exam" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); submitMock(); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [phase, timeLeft]);

  const submitMock = () => {
    clearInterval(timerRef.current);
    let correct = 0;
    const review = questions.map(q => {
      const isCorrect = answers[q.id] === q.correct;
      if (isCorrect) correct++;
      else if (onAddError) onAddError({ ...q, timestamp: Date.now(), userAnswer: answers[q.id] });
      return { ...q, userAnswer: answers[q.id], isCorrect };
    });
    setResults({ correct, total: questions.length, review });
    setPhase("results");
  };

  const fmt = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  if (phase === "select") {
    return (
      <div style={styles.pageWrap}>
        <h2 style={styles.pageTitle}>{t.mockTitle}</h2>
        <p style={styles.pageDesc}>{t.mockDesc}</p>
        {loading && <LoadingSpinner message={t.loadingPaper} />}
        <div style={styles.papersGrid}>
          {PAST_PAPERS.map((paper, i) => (
            <div key={i} style={styles.paperCard}>
              <div style={styles.paperYear}>{paper.year}</div>
              <div style={styles.paperSession}>{paper.session}</div>
              <div style={styles.paperPaper}>{paper.code}</div>
              <div style={{ fontSize: 12, color: "#888888", marginBottom: 4 }}>{paper.desc}</div>
              <div style={styles.paperMeta}>
                <span>⏱️ {paper.duration} min</span>
                <span>📝 {paper.questions} Qs</span>
              </div>
              <button
                onClick={() => startMock(paper)}
                style={styles.btnPrimary}
                disabled={loading}>
                {t.startMockBtn}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "exam") {
    const urgency = timeLeft < 600;
    return (
      <div style={styles.examPanel}>
        <div style={styles.examHeader}>
          <div>
            <div style={styles.examTitle}>{t.examPaperTitle}</div>
            <div style={styles.examSubtitle}>
              {selectedPaper?.year} {selectedPaper?.session} — Paper {selectedPaper?.paper}
            </div>
          </div>
          <div style={{ ...styles.timer, ...(urgency ? styles.timerUrgent : {}) }}>⏱️ {fmt(timeLeft)}</div>
        </div>
        <div style={styles.examInstructions}>{t.examInstructions}</div>
        <div style={styles.examQuestions}>
          {questions.map((q, i) => (
            <div key={q.id} style={styles.examQuestion}>
              <div style={styles.examQHeader}>
                <span style={styles.examQNum}>Q{i + 1}</span>
                <span style={styles.examQMarks}>[{q.marks} {t.marks}]</span>
                <span style={{ ...styles.diffTag, background: q.difficulty === "hard" ? "#7C2020" : "#1D4ED8", fontSize: 11 }}>
                  {q.difficulty}
                </span>
              </div>
              <div style={styles.examQText}>{q.question}</div>
              <div style={styles.examOptions}>
                {Object.entries(q.options || {}).map(([letter, text]) => (
                  <button key={letter}
                    onClick={() => setAnswers(a => ({ ...a, [q.id]: letter }))}
                    style={{ ...styles.optionBtn, ...(answers[q.id] === letter ? styles.optionSelected : {}) }}>
                    <span style={styles.optionLetter}>{letter}</span> {text}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button onClick={submitMock} style={{ ...styles.btnPrimary, background: "#DA291C", marginTop: 24 }}>
          {t.submitExam}
        </button>
      </div>
    );
  }

  if (phase === "results" && results) {
    const pct = Math.round((results.correct / results.total) * 100);
    const grade = pct >= 90 ? "A*" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : pct >= 50 ? "D" : "E";
    const ums = Math.round(pct * 0.9 + 10);
    return (
      <div style={styles.resultsPanel}>
        <div style={styles.resultsHeader}>
          <div style={styles.resultsGrade}>{grade}</div>
          <div style={styles.resultsScore}>{results.correct}/{results.total} · {pct}%</div>
          <div style={styles.resultsLabel}>
            {selectedPaper?.year} {selectedPaper?.session} — Paper {selectedPaper?.paper}
          </div>
          <div style={styles.umsScore}>{t.estimatedUMS} {ums}/100</div>
        </div>
        <div style={styles.gradeBands}>
          {[["A*", 90], ["A", 80], ["B", 70], ["C", 60], ["D", 50]].map(([g, threshold]) => (
            <div key={g} style={{ ...styles.gradeBand, background: pct >= threshold ? "rgba(26,122,60,0.10)" : "#F5F5F5" }}>
              <span style={styles.gradeBandLabel}>{g}</span>
              <span style={styles.gradeBandPct}>{threshold}%+</span>
              {pct >= threshold && <span style={styles.gradeBandCheck}>✓</span>}
            </div>
          ))}
        </div>
        <h3 style={styles.reviewTitle}>{t.detailedMarking}</h3>
        <div style={styles.reviewList}>
          {results.review.map((q, i) => (
            <div key={q.id} style={{ ...styles.reviewItem, borderColor: q.isCorrect ? "#1D4ED8" : "#7C2020" }}>
              <div style={styles.reviewHeader}>
                <span>{q.isCorrect ? "✅" : "❌"} Q{i + 1} — {q.topic}</span>
                <span>{q.isCorrect ? `+${q.marks}` : "0"}/{q.marks} {t.marks}</span>
              </div>
              <div style={styles.reviewQuestion}>{q.question}</div>
              <div style={styles.reviewSolution}>
                <strong>{t.modelAnswer} ({q.correct}):</strong> {q.solution}
              </div>
              {!q.isCorrect && (
                <div style={styles.aiExplanation}>
                  💡 {t.yourAnswerWas} {q.userAnswer || t.noAnswer}. {t.reviewLabel} {q.topic}
                </div>
              )}
            </div>
          ))}
        </div>
        <button onClick={() => setPhase("select")} style={styles.btnSecondary}>{t.backToMenu}</button>
      </div>
    );
  }

  return null;
}

// ============================================================
// ERROR BOOK VIEW
// ============================================================
function ErrorBookView({ errors, onClear, nav, t, lang }) {
  const [selectedError, setSelectedError] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [loadingExp, setLoadingExp] = useState(false);

  const getAIExplanation = async (err) => {
    setSelectedError(err);
    setLoadingExp(true);
    setExplanation("");
    const text = await callClaude(
      `You are an A-Level Maths tutor. Explain the concept clearly and concisely for a student who got this wrong.${lang === "zh" ? " Please respond entirely in Simplified Chinese (简体中文)." : ""}`,
      `Student got this wrong:\nQuestion: ${err.question}\nTheir answer: ${err.userAnswer}\nCorrect answer: ${err.correct}\nSolution: ${err.solution}\n\nProvide: 1) Where they went wrong, 2) The key concept, 3) A tip to remember it`
    );
    setExplanation(text);
    setLoadingExp(false);
  };

  if (errors.length === 0) {
    return (
      <div style={styles.pageWrap}>
        <h2 style={styles.pageTitle}>{t.errorNotebook}</h2>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📗</div>
          <div style={styles.emptyText}>{t.emptyNotebook}</div>
          <div style={styles.emptyDesc}>{t.emptyDesc}</div>
          <button onClick={() => nav("quiz")} style={styles.btnPrimary}>{t.takeQuizBtn}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrap}>
      <h2 style={styles.pageTitle}>{t.errorNotebook} <span style={styles.errorCount}>{errors.length} {t.questionsLabel}</span></h2>
      <p style={styles.pageDesc}>{t.reviewMistakesDesc}</p>
      <div style={styles.errorList}>
        {errors.map((err, i) => (
          <div key={err.id || i} style={{ ...styles.errorCard, ...(selectedError?.id === err.id ? styles.errorCardActive : {}) }}>
            <div style={styles.errorCardHeader}>
              <div>
                <span style={styles.errorChapter}>{err.chapter || "General"} · {err.book || ""}</span>
                <div style={styles.errorQuestion}>{err.question}</div>
              </div>
              <div style={styles.errorCardBtns}>
                <button onClick={() => getAIExplanation(err)} style={styles.btnSmall}>{t.aiExplainBtn}</button>
                <button onClick={() => onClear(err.id)} style={styles.btnSmallDanger}>{t.removeBtn}</button>
              </div>
            </div>
            <div style={styles.errorAnswers}>
              <span style={styles.errorWrong}>{t.yourAnswerLabel} {err.userAnswer || t.noAnswer}</span>
              <span style={styles.errorCorrect}>{t.correctLabel} {err.correct}</span>
            </div>
            {selectedError?.id === err.id && (
              <div style={styles.explanationBox}>
                {loadingExp ? <LoadingSpinner message={t.aiExplainingMsg} /> : (
                  <div style={styles.explanationText}>{explanation}</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// LOADING SPINNER
// ============================================================
function LoadingSpinner({ message }) {
  return (
    <div style={styles.loading}>
      <div style={styles.spinner} />
      <div style={styles.loadingMsg}>{message}</div>
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================
const styles = {
  root: {
    minHeight: "100vh",
    background: "#F2F2F2",
    color: "#111111",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    position: "relative",
    overflowX: "hidden",
  },
  bgDecor: {
    position: "fixed", inset: 0, zIndex: 0,
    background: "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(218,41,28,0.04) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(0,48,135,0.03) 0%, transparent 60%)",
    pointerEvents: "none",
  },
  bgGrid: {
    position: "fixed", inset: 0, zIndex: 0,
    backgroundImage: "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
    backgroundSize: "60px 60px",
    pointerEvents: "none",
  },
  header: {
    position: "sticky", top: 0, zIndex: 100,
    background: "rgba(255,255,255,0.98)",
    borderBottom: "2px solid #DA291C",
    backdropFilter: "blur(10px)",
  },
  headerInner: {
    maxWidth: 1200, margin: "0 auto", padding: "12px 24px",
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
    flexWrap: "wrap",
  },
  logoBtn: {
    background: "none", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", gap: 12, padding: 0,
  },
  logoSymbol: {
    fontSize: 28, fontWeight: 900, color: "#DA291C",
    fontFamily: "Georgia, serif",
    background: "rgba(218,41,28,0.1)", width: 44, height: 44,
    display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: 8, border: "1px solid rgba(218,41,28,0.3)",
  },
  logoTitle: { fontSize: 16, fontWeight: 700, color: "#111111", letterSpacing: 0.5 },
  logoSub: { fontSize: 11, color: "#888888", marginTop: 2, letterSpacing: 1, textTransform: "uppercase" },
  headerNav: { display: "flex", gap: 6, flexWrap: "wrap" },
  navBtn: {
    background: "none", border: "1px solid transparent", borderRadius: 6,
    color: "#5C5C5C", fontSize: 13, padding: "7px 14px", cursor: "pointer",
    transition: "all 0.2s", fontFamily: "Georgia, serif",
    position: "relative",
  },
  navBtnActive: {
    background: "rgba(218,41,28,0.1)", borderColor: "rgba(218,41,28,0.3)",
    color: "#DA291C",
  },
  langToggleBtn: {
    background: "rgba(0,0,0,0.04)", border: "1px solid #D0D0D0",
    borderRadius: 6, color: "#2D2D2D", fontSize: 13, padding: "7px 14px",
    cursor: "pointer", fontFamily: "Georgia, serif", transition: "all 0.2s",
    whiteSpace: "nowrap", flexShrink: 0,
  },
  badge: {
    position: "absolute", top: -4, right: -4,
    background: "#DA291C", color: "#fff", borderRadius: "50%",
    width: 18, height: 18, fontSize: 10, display: "flex",
    alignItems: "center", justifyContent: "center", fontFamily: "sans-serif",
  },
  main: { maxWidth: 1200, margin: "0 auto", padding: "32px 24px", position: "relative", zIndex: 1 },

  // Home
  homeWrap: { display: "flex", flexDirection: "column", gap: 48 },
  heroSection: { textAlign: "center", padding: "48px 24px" },
  heroTag: {
    display: "inline-block", padding: "6px 16px",
    border: "1px solid rgba(218,41,28,0.5)", borderRadius: 20,
    color: "#DA291C", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 24,
  },
  heroTitle: { fontSize: "clamp(36px,5vw,60px)", fontWeight: 700, color: "#1A1A1A", margin: "0 0 16px", lineHeight: 1.2 },
  heroAccent: { color: "#DA291C" },
  heroDesc: { fontSize: 17, color: "#5C5C5C", maxWidth: 580, margin: "0 auto 32px", lineHeight: 1.7 },
  heroBtns: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" },

  booksGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 },
  bookCard: {
    background: "#FFFFFF", border: "1px solid",
    borderRadius: 12, padding: 24, cursor: "pointer",
    transition: "all 0.2s",
  },
  bookIcon: { fontSize: 40, marginBottom: 8 },
  bookKey: { fontSize: 24, fontWeight: 700, color: "#1A1A1A" },
  bookTitle: { fontSize: 14, color: "#777777", marginTop: 4 },
  bookChapters: { fontSize: 13, color: "#999999", marginTop: 8 },

  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 },
  featureCard: {
    background: "#FAFAFA", border: "1px solid #E8E8E8",
    borderRadius: 10, padding: 20,
  },
  featureIcon: { fontSize: 28, marginBottom: 10 },
  featureTitle: { fontSize: 15, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 },
  featureDesc: { fontSize: 13, color: "#777777", lineHeight: 1.6 },

  // Page
  pageWrap: { display: "flex", flexDirection: "column", gap: 24 },
  pageTitle: { fontSize: 28, fontWeight: 700, color: "#1A1A1A", margin: 0 },
  pageDesc: { color: "#777777", fontSize: 15, margin: 0, lineHeight: 1.6 },
  backBtn: {
    background: "none", border: "1px solid #D8D8D8", color: "#888888",
    padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13, width: "fit-content",
  },

  // Curriculum
  bookTabs: { display: "flex", gap: 10, flexWrap: "wrap" },
  bookTab: {
    background: "#FFFFFF", border: "1px solid #D8D8D8",
    color: "#888888", padding: "10px 20px", borderRadius: 8, cursor: "pointer",
    fontSize: 14, display: "flex", alignItems: "center", gap: 8, fontFamily: "Georgia, serif",
  },
  bookTabActive: { background: "rgba(218,41,28,0.08)", borderColor: "#DA291C", color: "#DA291C" },

  chapterList: { display: "flex", flexDirection: "column", gap: 12 },
  chapterCard: {
    background: "#FAFAFA", border: "1px solid #E8E8E8",
    borderRadius: 10, padding: 20, display: "flex", alignItems: "center", gap: 16,
    cursor: "pointer", transition: "all 0.2s",
  },
  chNum: {
    width: 40, height: 40, borderRadius: 8, display: "flex",
    alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700,
    color: "#fff", flexShrink: 0,
  },
  chInfo: { flex: 1 },
  chTitle: { fontSize: 16, fontWeight: 600, color: "#1A1A1A" },
  chOverview: { fontSize: 13, color: "#777777", marginTop: 4, lineHeight: 1.5 },
  chMeta: { display: "flex", gap: 10, marginTop: 10, alignItems: "center", flexWrap: "wrap" },
  diffBadge: { fontSize: 11, padding: "3px 8px", borderRadius: 4, color: "#111111", fontFamily: "sans-serif" },
  chMetaText: { fontSize: 12, color: "#AAAAAA" },
  chArrow: { color: "#BBBBBB", fontSize: 20 },

  // Chapter
  chapterHeader: {
    background: "#FFFFFF", border: "1px solid",
    borderRadius: 12, padding: 28,
  },
  chapterBookBadge: {
    display: "inline-block", padding: "4px 12px", borderRadius: 20,
    fontSize: 12, color: "#fff", marginBottom: 12, fontFamily: "sans-serif",
  },
  chapterTitle: { fontSize: 26, fontWeight: 700, color: "#1A1A1A", margin: "0 0 12px" },
  chapterOverview: { color: "#444444", lineHeight: 1.7, margin: 0, fontSize: 15 },

  tabBar: { display: "flex", gap: 8, borderBottom: "1px solid #E0E0E0", paddingBottom: 0 },
  tab: {
    background: "none", border: "none", color: "#777777",
    padding: "10px 16px", cursor: "pointer", fontSize: 14,
    borderBottom: "2px solid transparent", fontFamily: "Georgia, serif",
  },
  tabActive: { borderBottom: "2px solid", color: "#DA291C" },

  // Learn
  learnContent: { display: "flex", flexDirection: "column", gap: 28 },
  learnSection: {},
  sectionTitle: { fontSize: 18, fontWeight: 600, color: "#1A1A1A", marginBottom: 16 },
  keyPointsList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 },
  keyPoint: { display: "flex", alignItems: "flex-start", gap: 12 },
  kpNum: {
    width: 26, height: 26, borderRadius: "50%", display: "flex",
    alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", flexShrink: 0, marginTop: 1,
  },
  kpText: { color: "#2D2D2D", lineHeight: 1.6, fontSize: 15 },
  formulasGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 },
  formulaCard: {
    background: "#FAFAFA", border: "1px solid #E8E8E8",
    borderRadius: 8, padding: 16,
  },
  formulaName: { fontSize: 12, color: "#888888", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  formulaExpr: {
    fontSize: 15, color: "#DA291C", fontFamily: "monospace",
    background: "#FFF5F5", padding: "10px 14px",
    borderRadius: 6, border: "1px solid rgba(218,41,28,0.2)", letterSpacing: 0.3,
  },
  hardPointBox: {
    background: "rgba(218,41,28,0.07)", border: "1px solid rgba(218,41,28,0.2)",
    borderRadius: 8, padding: 16, display: "flex", gap: 12, alignItems: "flex-start",
  },
  hardIcon: {
    width: 24, height: 24, background: "#DA291C", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: 14, fontWeight: 700, flexShrink: 0,
  },
  hardText: { color: "#5C1A1A", lineHeight: 1.6, margin: 0, fontSize: 14 },

  // Videos
  videoIntro: { color: "#777777", fontSize: 14, marginBottom: 4, fontFamily: "Georgia, serif" },
  videoCard: {
    background: "#FAFAFA", border: "1px solid #E8E8E8",
    borderRadius: 10, padding: 18, display: "flex", gap: 16, alignItems: "center",
    cursor: "pointer", textDecoration: "none", marginBottom: 12,
    transition: "all 0.2s",
  },
  videoThumb: {
    width: 60, height: 44, background: "#DA291C", borderRadius: 6,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20, color: "#fff", flexShrink: 0,
  },
  videoInfo: {},
  videoTitle: { fontSize: 15, fontWeight: 600, color: "#1A1A1A" },
  videoChannel: { fontSize: 13, color: "#777777", marginTop: 3 },
  videoHint: { fontSize: 12, color: "#DA291C", marginTop: 6 },
  videoCardAlt: {
    display: "block", textAlign: "center", padding: 14,
    background: "rgba(218,41,28,0.07)", border: "1px solid rgba(218,41,28,0.2)",
    borderRadius: 8, color: "#DA291C", textDecoration: "none", fontSize: 14,
  },

  // Quiz/Exam Setup
  setupPanel: {
    maxWidth: 520, margin: "0 auto", background: "#FFFFFF",
    border: "1px solid #E0E0E0", borderRadius: 12, padding: 32,
    display: "flex", flexDirection: "column", gap: 16,
  },
  setupTitle: { fontSize: 22, fontWeight: 700, color: "#1A1A1A", margin: 0 },
  label: { fontSize: 13, color: "#888888", marginBottom: -8, textTransform: "uppercase", letterSpacing: 0.5 },
  select: {
    background: "#FFFFFF", border: "1px solid #D8D8D8",
    color: "#111111", padding: "10px 14px", borderRadius: 8, fontSize: 14,
    fontFamily: "Georgia, serif", width: "100%",
  },
  diffRow: { display: "flex", gap: 10 },
  diffBtn: {
    flex: 1, background: "#FFFFFF", border: "1px solid #D8D8D8",
    color: "#888888", padding: "10px 16px", borderRadius: 8, cursor: "pointer",
    fontSize: 13, fontFamily: "Georgia, serif",
  },
  diffBtnActive: { background: "rgba(218,41,28,0.1)", borderColor: "rgba(218,41,28,0.4)", color: "#DA291C" },
  examInfo: {
    display: "flex", gap: 16, justifyContent: "center",
    color: "#888888", fontSize: 13, flexWrap: "wrap",
  },

  // Quiz Panel
  quizPanel: { maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 },
  quizProgress: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    color: "#888888", fontSize: 14, borderBottom: "1px solid #E0E0E0", paddingBottom: 12,
    flexWrap: "wrap", gap: 8,
  },
  diffTag: { padding: "3px 10px", borderRadius: 20, color: "#fff", fontSize: 12, fontFamily: "sans-serif" },
  questionBox: {
    background: "#FFFFFF", border: "1px solid #E0E0E0",
    borderRadius: 10, padding: 22,
  },
  questionText: { fontSize: 17, color: "#1A1A1A", lineHeight: 1.7 },
  optionsGrid: { display: "flex", flexDirection: "column", gap: 10 },
  optionBtn: {
    background: "#FFFFFF", border: "1px solid #E0E0E0",
    color: "#2D2D2D", padding: "12px 16px", borderRadius: 8, cursor: "pointer",
    fontSize: 14, textAlign: "left", display: "flex", alignItems: "center", gap: 12,
    fontFamily: "Georgia, serif", transition: "all 0.15s",
  },
  optionSelected: { background: "rgba(37,99,235,0.15)", borderColor: "rgba(37,99,235,0.5)", color: "#003087" },
  optionCorrect: { background: "rgba(26,122,60,0.10)", borderColor: "#1A7A3C", color: "#1A7A3C" },
  optionWrong: { background: "rgba(218,41,28,0.08)", borderColor: "#DA291C", color: "#DA291C" },
  optionLetter: {
    width: 28, height: 28, background: "#F0F0F0", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 700, flexShrink: 0,
  },
  feedbackBox: {
    background: "#FAFAFA", border: "2px solid",
    borderRadius: 12, padding: 0, display: "flex", flexDirection: "column", gap: 0,
    overflow: "hidden",
  },
  feedbackHeader: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "16px 20px", borderBottom: "1px solid #F0F0F0",
  },
  feedbackSolution: { fontSize: 14, color: "#2D2D2D", lineHeight: 1.6 },
  feedbackConcept: { fontSize: 13, color: "#777777" },

  // Rich explanation styles
  explanationBlock: {
    padding: "14px 20px",
    borderBottom: "1px solid #F5F5F5",
  },
  explanationLabel: {
    fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
    textTransform: "uppercase", color: "#999999", marginBottom: 8,
  },
  formulaHighlight: {
    fontFamily: "monospace", fontSize: 15, color: "#B81E14",
    background: "#FFF5F5", border: "1px solid rgba(218,41,28,0.2)",
    borderRadius: 6, padding: "10px 14px", lineHeight: 1.6,
  },
  solutionSteps: {
    fontSize: 14, color: "#003087", lineHeight: 1.8,
    background: "rgba(0,48,135,0.06)", borderRadius: 6,
    padding: "10px 14px", fontFamily: "monospace",
  },
  deepExplain: {
    fontSize: 14, color: "#2D2D2D", lineHeight: 1.85,
  },
  wrongOptionsGrid: {
    display: "flex", flexDirection: "column", gap: 8,
  },
  wrongOptionRow: {
    display: "flex", alignItems: "flex-start", gap: 10,
  },
  wrongLetter: {
    flexShrink: 0, width: 26, height: 26, borderRadius: 6,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 700, color: "#111111",
  },
  wrongReason: {
    fontSize: 13, color: "#5C5C5C", lineHeight: 1.6, paddingTop: 4,
  },

  // Result panel
  resultPanel: {
    maxWidth: 400, margin: "40px auto", textAlign: "center",
    background: "#FFFFFF", border: "1px solid #E0E0E0",
    borderRadius: 12, padding: 40,
  },
  resultScore: { fontSize: 60, fontWeight: 700, color: "#DA291C" },
  resultLabel: { fontSize: 16, color: "#5C5C5C", marginBottom: 16 },
  resultGrade: { fontSize: 22, color: "#1A1A1A", marginBottom: 24 },
  resultBtns: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" },

  // Exam
  examPanel: { display: "flex", flexDirection: "column", gap: 20 },
  examHeader: {
    background: "#FFFFFF", border: "1px solid #E0E0E0",
    borderBLeft: "4px solid #DA291C", borderRadius: 10, padding: 18, display: "flex", justifyContent: "space-between",
    alignItems: "center", flexWrap: "wrap", gap: 12,
  },
  examTitle: { fontSize: 16, fontWeight: 700, color: "#1A1A1A" },
  examSubtitle: { fontSize: 13, color: "#777777", marginTop: 4 },
  timer: {
    fontSize: 24, fontWeight: 700, color: "#DA291C",
    background: "rgba(218,41,28,0.1)", padding: "8px 18px", borderRadius: 8,
    fontFamily: "monospace",
  },
  timerUrgent: { color: "#DA291C", background: "rgba(218,41,28,0.12)", animation: "pulse 1s infinite" },
  examProgress: { fontSize: 14, color: "#777777" },
  examInstructions: {
    background: "rgba(0,48,135,0.05)", border: "1px solid rgba(0,48,135,0.2)",
    borderRadius: 8, padding: 12, fontSize: 13, color: "#003087", fontStyle: "italic",
  },
  examQuestions: { display: "flex", flexDirection: "column", gap: 24 },
  examQuestion: {
    background: "#FAFAFA", border: "1px solid #E8E8E8",
    borderRadius: 10, padding: 20,
  },
  examQHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 },
  examQNum: {
    background: "rgba(218,41,28,0.15)", color: "#DA291C",
    padding: "4px 10px", borderRadius: 6, fontSize: 13, fontWeight: 700,
  },
  examQMarks: { color: "#777777", fontSize: 13 },
  examQText: { fontSize: 16, color: "#1A1A1A", lineHeight: 1.7, marginBottom: 14 },
  examOptions: { display: "flex", flexDirection: "column", gap: 8 },

  // Results
  resultsPanel: { display: "flex", flexDirection: "column", gap: 24 },
  resultsHeader: {
    textAlign: "center", background: "#FAFAFA",
    border: "2px solid #DA291C", borderRadius: 12, padding: 32,
  },
  resultsGrade: { fontSize: 72, fontWeight: 700, color: "#DA291C", lineHeight: 1 },
  resultsScore: { fontSize: 22, color: "#1A1A1A", marginTop: 8 },
  resultsLabel: { fontSize: 14, color: "#777777", marginTop: 8 },
  umsScore: { fontSize: 15, color: "#DA291C", marginTop: 12, fontFamily: "sans-serif" },
  gradeBands: { display: "flex", gap: 8, flexWrap: "wrap" },
  gradeBand: {
    padding: "8px 16px", borderRadius: 8, display: "flex", alignItems: "center",
    gap: 8, fontSize: 13,
  },
  gradeBandLabel: { fontWeight: 700, color: "#1A1A1A" },
  gradeBandPct: { color: "#777777" },
  gradeBandCheck: { color: "#1A7A3C" },
  reviewTitle: { fontSize: 18, fontWeight: 700, color: "#111111", margin: "0 0 4px" },
  reviewList: { display: "flex", flexDirection: "column", gap: 14 },
  reviewItem: {
    background: "#FFFFFF", border: "1px solid #E8E8E8",
    borderRadius: 10, padding: 18,
  },
  reviewHeader: { display: "flex", justifyContent: "space-between", fontSize: 14, color: "#5C5C5C", marginBottom: 10, flexWrap: "wrap", gap: 8 },
  reviewQuestion: { fontSize: 15, color: "#1A1A1A", lineHeight: 1.6, marginBottom: 10 },
  reviewSolution: { fontSize: 13, color: "#5C5C5C", lineHeight: 1.6, background: "#F7F7F7", padding: 12, borderRadius: 6 },
  reviewTopic: { fontSize: 12, color: "#AAAAAA", marginTop: 6 },
  aiExplanation: {
    fontSize: 13, color: "#B81E14", marginTop: 10, padding: 10,
    background: "#FFF5F5", borderRadius: 6,
  },

  // Mock exam papers
  papersGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 },
  paperCard: {
    background: "#FFFFFF", border: "1px solid #E0E0E0",
    borderRadius: 10, padding: 22, display: "flex", flexDirection: "column", gap: 8,
    textAlign: "center",
  },
  paperYear: { fontSize: 28, fontWeight: 700, color: "#1A1A1A" },
  paperSession: { fontSize: 13, color: "#777777" },
  paperPaper: { fontSize: 18, color: "#DA291C", fontWeight: 600 },
  paperMeta: { display: "flex", justifyContent: "center", gap: 14, color: "#777777", fontSize: 13, margin: "4px 0" },

  // Error Book
  errorList: { display: "flex", flexDirection: "column", gap: 14 },
  errorCard: {
    background: "rgba(218,41,28,0.06)", border: "1px solid rgba(218,41,28,0.18)",
    borderRadius: 10, padding: 18,
  },
  errorCardActive: { borderColor: "rgba(218,41,28,0.3)", background: "rgba(218,41,28,0.06)" },
  errorCardHeader: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" },
  errorChapter: { fontSize: 12, color: "#AAAAAA", marginBottom: 6, display: "block" },
  errorQuestion: { fontSize: 15, color: "#1A1A1A", lineHeight: 1.5 },
  errorCardBtns: { display: "flex", gap: 8, flexShrink: 0 },
  errorAnswers: { display: "flex", gap: 16, marginTop: 12, fontSize: 13, flexWrap: "wrap" },
  errorWrong: { color: "#DA291C" },
  errorCorrect: { color: "#1A7A3C" },
  explanationBox: {
    marginTop: 14, background: "#F7F7F7", borderRadius: 8,
    padding: 16, borderLeft: "3px solid #DA291C",
  },
  explanationText: { color: "#2D2D2D", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap" },
  errorCount: { fontSize: 16, color: "#DA291C", fontWeight: 400, marginLeft: 10 },
  emptyState: { textAlign: "center", padding: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 },
  emptyIcon: { fontSize: 60 },
  emptyText: { fontSize: 20, color: "#1A1A1A" },
  emptyDesc: { color: "#777777", fontSize: 15, maxWidth: 340 },

  // Buttons
  btnPrimary: {
    background: "linear-gradient(135deg, #DA291C, #B81E14)",
    border: "none", color: "#FFFFFF",
    padding: "12px 24px", borderRadius: 8, fontSize: 15, fontWeight: 700,
    cursor: "pointer", fontFamily: "Georgia, serif", transition: "all 0.2s",
    alignSelf: "flex-start",
  },
  btnSecondary: {
    background: "#FFFFFF", border: "1px solid #CCCCCC",
    color: "#111111", padding: "11px 22px", borderRadius: 8, fontSize: 14,
    cursor: "pointer", fontFamily: "Georgia, serif",
  },
  btnSmall: {
    background: "rgba(218,41,28,0.1)", border: "1px solid rgba(218,41,28,0.3)",
    color: "#DA291C", padding: "6px 12px", borderRadius: 6, fontSize: 12,
    cursor: "pointer", fontFamily: "Georgia, serif",
  },
  btnSmallDanger: {
    background: "rgba(218,41,28,0.15)", border: "1px solid rgba(218,41,28,0.3)",
    color: "#DA291C", padding: "6px 12px", borderRadius: 6, fontSize: 12,
    cursor: "pointer", fontFamily: "Georgia, serif",
  },

  // Loading
  loading: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: 40 },
  spinner: {
    width: 36, height: 36,
    border: "3px solid #F5C5C2",
    borderTop: "3px solid #DA291C",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingMsg: { color: "#777777", fontSize: 14 },
};

// Inject keyframe animations
const styleEl = document.createElement("style");
styleEl.innerHTML = `
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
*{box-sizing:border-box;}
button:hover{opacity:0.88;}
a:hover{opacity:0.85;}
`;
document.head.appendChild(styleEl);
