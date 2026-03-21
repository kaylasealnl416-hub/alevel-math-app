export const CURRICULUM = {
  P1: {
    title: "Pure Mathematics 1",
    color: "#1a73e8",
    icon: "∫",
    chapters: [
      // ── Chapter 1 ──────────────────────────────────────────────
      {
        id: "p1c1", num: 1, title: "Algebraic Expressions",
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
          { name: "Fractional Index", expr: "$a^{m/n} = \\sqrt[n]{a^m}$  e.g. $27^{1/3} = 3$" },
          { name: "Negative Index", expr: "$a^{-n} = \\dfrac{1}{a^n}$  e.g. $2^{-3} = \\dfrac{1}{8}$" },
          { name: "Conjugate Rationalisation", expr: "$\\dfrac{1}{a+\\sqrt{b}} = \\dfrac{a-\\sqrt{b}}{a^2-b}$" },
          { name: "Difference of Surds", expr: "$(\\sqrt{a}+\\sqrt{b})(\\sqrt{a}-\\sqrt{b}) = a-b$" }
        ],
        difficulty: "Foundation",
        hardPoints: "【高频失分点】负指数与分数指数的相互转换；在题目混合使用 xⁿ 与 √x 时忘记统一形式再求导；有理化时共轭式选错（特别是三项分母）。建议：每次做微积分题前先将所有根式转化为分数指数形式。",
        examTips: "此章节在WMA11中占约4-6分，多以选择/填空形式出现。务必掌握在不使用计算器情况下精确化简根式表达式的技巧。",
        youtube: [
          { title: "Algebraic Expressions - Edexcel Pure", url: "https://www.youtube.com/watch?v=r6YZUokDz-M", channel: "Edexcel" },
          { title: "Index Laws & Surds - TLMaths", url: "https://www.youtube.com/watch?v=uuXm32-nyz8", channel: "TLMaths" },
          { title: "Rationalising the Denominator - Mr Hassaan", url: "https://www.youtube.com/watch?v=KmtLzMQOClY", channel: "Mr Hassaan's Maths" },
          { title: "Index Laws | Algebra | GCSE Further Maths | A-Level Maths Series", url: "https://www.youtube.com/watch?v=w1CNkoH77n4", channel: "A-Level Maths" }
        ]
      },
      // ── Chapter 2 ──────────────────────────────────────────────
      {
        id: "p1c2", num: 2, title: "Quadratics",
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
          { name: "Quadratic Formula", expr: "$x = \\dfrac{-b \\pm \\sqrt{b^2-4ac}}{2a}$" },
          { name: "Completing the Square", expr: "$y = a\\!\\left(x+\\dfrac{b}{2a}\\right)^{\\!2}+c-\\dfrac{b^2}{4a}$" },
          { name: "Discriminant", expr: "$\\Delta = b^2-4ac$: $>0$ two real roots, $=0$ repeated root, $<0$ no real roots" },
          { name: "Vieta's Formulas", expr: "Sum of roots = −b/a; Product of roots = c/a" },
          { name: "Quadratic Inequality", expr: "If a>0: ax²+bx+c<0 solution lies between the roots" }
        ],
        difficulty: "Foundation",
        hardPoints: "【高频失分点】配方时忘记提出系数a再配方（若a≠1）；判别式符号计算错误（尤其b为负数时 b² 忘记取正）；联立方程后展开时代数错误；二次不等式的区间方向（>0还是<0）判断失误。考官报告特别指出：大量学生在\"Show that the line is tangent\"题型中正确设置了Δ=0但计算出错。",
        youtube: [
          { title: "Quadratics (Equations) - Edexcel Pure", url: "https://www.youtube.com/watch?v=GOsgNWUbE24", channel: "Edexcel" },
          { title: "Completing the Square — TLMaths", url: "https://www.youtube.com/watch?v=uuXm32-nyz8", channel: "TLMaths" },
          { title: "Discriminant & Quadratic Inequalities — Mr Hassaan IAL P1", url: "https://www.youtube.com/watch?v=KmtLzMQOClY", channel: "Mr Hassaan's Maths" },
          { title: "A-Level Maths: Quadratics (Completing the Square & Discriminant)", url: "https://www.youtube.com/watch?v=fT3_XbQv9bQ", channel: "A-Level Maths" }
        ]
      },
      // ── Chapter 3 ──────────────────────────────────────────────
      {
        id: "p1c3", num: 3, title: "Equations & Inequalities",
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
          { name: "Modulus Inequality (<)", expr: "|x−a| < b ↔ a−b < x < a+b" },
          { name: "Modulus Inequality (>)", expr: "|x−a| > b ↔ x<a−b or x>a+b" },
          { name: "Always Positive Condition", expr: "ax²+bx+c>0 for all x ⟺ a>0 and b²−4ac<0" },
          { name: "Simultaneous Linear-Quadratic", expr: "Substitute linear into quadratic to get ax²+bx+c=0, then solve" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】除以负数时不等号方向未翻转；绝对值分类讨论漏掉一种情况；区域图形化时混淆 y > f(x) 与 y < f(x) 的阴影方向。建议：解绝对值不等式优先使用\"平方两边\"或\"数轴图形法\"而非代数分类，可减少符号错误。",
        youtube: [
          { title: "Equations & Inequalities - Edexcel Pure", url: "https://www.youtube.com/watch?v=DSnbqMWRzS0", channel: "Edexcel" },
          { title: "Simultaneous Equations - TLMaths", url: "https://www.youtube.com/watch?v=uuXm32-nyz8", channel: "TLMaths" },
          { title: "P1 Equations - Bicen Maths", url: "https://www.youtube.com/watch?v=OnZGBQyWK1g", channel: "Bicen Maths" },
          { title: "A-Level Maths: Simultaneous Equations & Linear Inequalities", url: "https://www.youtube.com/watch?v=X8d2H_yL4mA", channel: "A-Level Maths" }
        ]
      },
      // ── Chapter 4 ──────────────────────────────────────────────
      {
        id: "p1c4", num: 4, title: "Graphs & Transformations",
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
          { name: "Vertical Translation", expr: "f(x) + a → graph shifts up by a units (a>0)" },
          { name: "Horizontal Translation", expr: "f(x − a) → graph shifts right by a units (a>0, note counter-intuitive!)" },
          { name: "Vertical Stretch", expr: "af(x) → all y-coordinates multiplied by a (x-intercepts unchanged)" },
          { name: "Horizontal Stretch", expr: "f(ax) → all x-coordinates divided by a (y-intercept unchanged)" },
          { name: "Reflection in x-axis", expr: "−f(x) → all y-coordinates negated" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】f(x−a)是右移而非左移（最常见的直觉错误！）；f(ax)是横向压缩1/a倍而非扩大；草图未标明关键坐标（截距、极值点）导致失图形分；组合变换顺序混乱。建议：使用Desmos验证每个变换，先在图形上直觉理解，再推导解析式变化规律。",
        youtube: [
          { title: "Graph Transformations - Edexcel Pure", url: "https://www.youtube.com/watch?v=XPvz0dVTLvI", channel: "Edexcel" },
          { title: "Cubic & Quartic Graphs - TLMaths", url: "https://www.youtube.com/watch?v=uuXm32-nyz8", channel: "TLMaths" },
          { title: "P1 Graph Transformations - Bicen Maths", url: "https://www.youtube.com/watch?v=K0BIV_-wye4", channel: "Bicen Maths" },
          { title: "A-Level Maths: Graph Transformations and Functions", url: "https://www.youtube.com/watch?v=V9h_L5Jq2sA", channel: "A-Level Maths" }
        ]
      },
      // ── Chapter 5 ──────────────────────────────────────────────
      {
        id: "p1c5", num: 5, title: "Straight Line Geometry",
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
          { name: "Gradient Formula", expr: "m = (y₂−y₁)/(x₂−x₁)" },
          { name: "Point-Slope Equation", expr: "y − y₁ = m(x − x₁)" },
          { name: "Perpendicularity Condition", expr: "m₁ × m₂ = −1 (two lines are perpendicular)" },
          { name: "Distance Between Two Points", expr: "$d = \\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$" },
          { name: "Midpoint Formula", expr: "M = ((x₁+x₂)/2, (y₁+y₂)/2)" }
        ],
        difficulty: "Foundation",
        hardPoints: "【高频失分点】求法线时，将切线斜率直接写为法线斜率（忘记取负倒数）；水平/垂直直线的方程形式混淆；建模题中坐标系的设置方向出错。直线几何在本章是Foundation难度，但与微分结合时（求曲线上一点的切线和法线）会提升到Weight III难度。",
        youtube: [
          { title: "Straight Line Geometry - Edexcel Pure", url: "https://www.youtube.com/watch?v=w9xkRdvjUQA", channel: "Edexcel" },
          { title: "Straight Lines - TLMaths", url: "https://sites.google.com/view/tlmaths/home/a-level-maths", channel: "TLMaths" },
          { title: "P1 Straight Lines - Bicen Maths", url: "https://www.youtube.com/watch?v=K0BIV_-wye4", channel: "Bicen Maths" },
          { title: "A-Level Maths: Coordinate Geometry and Straight Lines", url: "https://www.youtube.com/watch?v=C2gR_tW5pD8", channel: "A-Level Maths" }
        ]
      },
      // ── Chapter 6 ──────────────────────────────────────────────
      {
        id: "p1c6", num: 6, title: "Trigonometric Ratios",
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
          { name: "Sine Rule", expr: "a/sin A = b/sin B = c/sin C" },
          { name: "Cosine Rule (side)", expr: "a² = b² + c² − 2bc cosA" },
          { name: "Cosine Rule (angle)", expr: "cos A = (b²+c²−a²) / 2bc" },
          { name: "Area of Triangle", expr: "S = ½ ab sin C" },
          { name: "Special Angles", expr: "sin30°=½, cos60°=½, tan45°=1, sin90°=1" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】正弦定理多解情况：用正弦定理求角时，arcsin只给出锐角，必须考虑钝角补角的可能性（α和180°−α都要验证）。考官报告显示超过40%的考生在多解题目中只给出一个解。另一高频错误：计算过程中保留过多中间小数导致最终答案不准确，应尽量保留精确值至最后一步。",
        youtube: [
          { title: "Trigonometric Ratios - Edexcel Pure", url: "https://www.youtube.com/watch?v=ZR3V-L1b1pU", channel: "Edexcel" },
          { title: "Trigonometry - Bicen Maths", url: "https://www.youtube.com/watch?v=OnZGBQyWK1g", channel: "Bicen Maths" },
          { title: "Sine & Cosine Rule - TLMaths", url: "https://www.youtube.com/watch?v=uuXm32-nyz8", channel: "TLMaths" },
          { title: "A-Level Maths: Trigonometric Ratios (Sine and Cosine Rule)", url: "https://www.youtube.com/watch?v=b7M_PqR2vX1", channel: "A-Level Maths" }
        ]
      },
      // ── Chapter 7 ──────────────────────────────────────────────
      {
        id: "p1c7", num: 7, title: "Radians",
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
          { name: "Arc Length", expr: "l = rθ (θ must be in radians)" },
          { name: "Sector Area", expr: "A = ½r²θ" },
          { name: "Segment Area", expr: "A = ½r²(θ − sinθ)" },
          { name: "Degrees & Radians Conversion", expr: "Radians = Degrees × π/180; Degrees = Radians × 180/π" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】在使用公式 l=rθ 时θ未转换为弧度（仍用度数代入）；弓形面积公式中忘记减去三角形面积；计算器仍在度数（Degree）模式下计算三角函数值。建议：从本章起，在考试纸最顶部写\"RAD MODE ✓\"提醒自己，并在考试开始时立即检查计算器设置。",
        youtube: [
          { title: "Radians - Edexcel Pure", url: "https://www.youtube.com/watch?v=aNfcaayBbX4", channel: "Edexcel" },
          { title: "Radians - Bicen Maths", url: "https://www.youtube.com/watch?v=OnZGBQyWK1g", channel: "Bicen Maths" },
          { title: "Radians - TLMaths", url: "https://www.youtube.com/watch?v=uuXm32-nyz8", channel: "TLMaths" },
          { title: "A-Level Maths: Radians, Arc Length and Sector Area", url: "https://www.youtube.com/watch?v=R4k_YtN8hJ3", channel: "A-Level Maths" }
        ]
      },
      // ── Chapter 8 ──────────────────────────────────────────────
      {
        id: "p1c8", num: 8, title: "Differentiation",
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
          { name: "Power Rule", expr: "d/dx(xⁿ) = nxⁿ⁻¹  e.g. d/dx(x³) = 3x²" },
          { name: "First Principles", expr: "f'(x) = lim[h→0] (f(x+h)−f(x))/h" },
          { name: "Equation of Tangent", expr: "y−y₁ = f'(x₁)(x−x₁), where gradient = f'(x₁)" },
          { name: "Equation of Normal", expr: "y−y₁ = (−1/f'(x₁))(x−x₁)" },
          { name: "Second Derivative Classification", expr: "f''(x)>0: local minimum; f''(x)<0: local maximum" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】求导前未展开括号（如直接对(2x+1)³求导而未先展开）；切线与法线斜率混淆（忘记取负倒数）；驻点x坐标求出后忘记代回求y坐标；优化题中未验证所求驻点确实是极大/极小值（而非拐点）。优化问题要求：建立方程→求导→令导数=0→解方程→验证→代入求最值，完整6步必须全部体现。",
        youtube: [
          { title: "Differentiation P1 Full Chapter — Edexcel", url: "https://www.youtube.com/watch?v=-dy04BCrEZM", channel: "Edexcel" },
          { title: "Differentiation P1 — Bicen Maths Pre-Exam Revision", url: "https://www.youtube.com/watch?v=OnZGBQyWK1g", channel: "Bicen Maths" },
          { title: "First Principles — TLMaths", url: "https://www.youtube.com/watch?v=uuXm32-nyz8", channel: "TLMaths" },
          { title: "A-Level Maths: Differentiation and Calculus Basics", url: "https://www.youtube.com/watch?v=D8m_WtK4rQ9", channel: "A-Level Maths" }
        ]
      },
      // ── Chapter 9 ──────────────────────────────────────────────
      {
        id: "p1c9", num: 9, title: "Integration",
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
          { name: "Power Rule (Integration)", expr: "∫xⁿ dx = xⁿ⁺¹/(n+1) + C  (n ≠ −1)" },
          { name: "Constant Integration", expr: "∫k dx = kx + C" },
          { name: "Negative Index Integration", expr: "∫x⁻ⁿ dx = x⁻ⁿ⁺¹/(−n+1) + C  e.g. ∫x⁻² dx = −x⁻¹ + C" },
          { name: "Fractional Index Integration", expr: "∫x^(1/2) dx = (2/3)x^(3/2) + C" },
          { name: "Verification Method", expr: "Differentiate the integral result — should return the original integrand" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】遗漏积分常数 +C（考官报告中出现频率极高）；积分前未展开或化简，直接对乘积/商式积分；幂次计算错误，如 ∫x² dx 写成 x³ 而非 x³/3；分数指数的积分结果化简出错（除以分数时记得乘以倒数）。记忆口诀：「指数加一，除以新指数，别忘加C」。",
        youtube: [
          { title: "Integration P1 Complete Guide — Edexcel", url: "https://www.youtube.com/watch?v=SLPiThP7CB8", channel: "Edexcel" },
          { title: "Integration P1 Complete Guide — Bicen Maths", url: "https://www.youtube.com/watch?v=3kSgGBHMdjo", channel: "Bicen Maths" },
          { title: "P1 Integration from scratch — TLMaths", url: "https://www.youtube.com/watch?v=uuXm32-nyz8", channel: "TLMaths" },
          { title: "A-Level Maths: Integration and Finding Areas", url: "https://www.youtube.com/watch?v=M2t_QpL7vN5", channel: "A-Level Maths" }
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
        id: "p2c1", num: 1, title: "Algebraic Methods",
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
          { name: "Polynomial Division", expr: "f(x) = (ax+b)·Q(x) + R, R = f(−b/a)" },
          { name: "Factor Theorem", expr: "f(a)=0 ⟺ (x−a) is a factor of f(x)" },
          { name: "Remainder Theorem", expr: "Remainder of f(x)÷(ax−b) = f(b/a)" },
          { name: "Even Number Definition", expr: "n is even ⟺ n=2k, k∈ℤ" },
          { name: "Odd Number Definition", expr: "n is odd ⟺ n=2k+1, k∈ℤ" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】长除法符号错误（尤其是减法步骤）；余数定理代入时b/a的符号弄错（例如 ÷(2x+3) 代入 x=−3/2 而非 3/2）；证明题中跳步，未逐行展示逻辑链；用反例推翻命题后未明确说明\"此反例满足条件但结论不成立，故命题为假\"。考官报告强调：证明题丢分往往不是因为方法错误，而是表述不严谨。",
        examTips: "WMA12中证明题（\"Prove that...\" / \"Show that...\"）约占8–10分，必须展示完整逻辑步骤。长除法题目通常配合后续积分或部分分数使用，要检查余数是否正确。强烈建议用因式定理先验证，再用长除法，可互相核对。",
        youtube: [
          { title: "P2 Ch1 Algebraic Methods — Bicen Maths", url: "https://www.youtube.com/watch?v=GYpBb5V2Lu0", channel: "Bicen Maths" },
          { title: "Factor Theorem & Long Division — TLMaths", url: "https://www.youtube.com/watch?v=19OEs6-350c", channel: "TLMaths" },
          { title: "IAL P2 Jan 2024 Proof by Counterexample & Exhaustion — Mr Hassaan", url: "https://m.youtube.com/watch?v=oVLv0-fBIco", channel: "Mr Hassaan's Maths" },
          { title: "A-Level Maths: Algebraic Methods, Factor Theorem & Polynomial Division", url: "https://www.youtube.com/watch?v=P5n_KrT8vD2", channel: "A-Level Maths" }
        ]
      },
      // ── P2 Chapter 2 ───────────────────────────────────────────
      {
        id: "p2c2", num: 2, title: "Coordinate Geometry: Circles",
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
          { name: "Standard Circle Equation", expr: "(x−a)²+(y−b)²=r², centre (a,b), radius r" },
          { name: "General Circle Equation", expr: "$x^2+y^2+2fx+2gy+c=0$, centre $(-f,-g)$, $r=\\sqrt{f^2+g^2-c}$" },
          { name: "Tangent Condition (Discriminant)", expr: "Substitute line into circle equation: Δ=0 ⟺ tangent" },
          { name: "Tangent Perpendicular to Radius", expr: "m_tangent × m_radius = −1" },
          { name: "Perpendicular Bisector of Chord", expr: "Line from centre to midpoint of chord ⊥ chord" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】将一般方程转化为标准式时配方出错（尤其系数不为1时先未提取系数）；切线题中将切线斜率与半径斜率相乘后未等于−1，方向判断失误；联立直线与圆方程展开时代数错误导致Δ计算出错。注意：本章圆与P2下文的三角、积分可以综合考查，例如\"求圆与曲线围成的面积\"。",
        examTips: "圆的题目在WMA12中通常为5–8分的结构型大题，分步骤给分。建议每步完成后用坐标代入验证圆心和半径。切线题型必须体现\"切线 ⊥ 半径\"的思路，否则即使答案对也可能失去过程分。",
        youtube: [
          { title: "P2 Coordinate Geometry Circles — Bicen Maths", url: "https://www.youtube.com/watch?v=ehe8pObhyDk", channel: "Bicen Maths" },
          { title: "Circle Equations & Tangents — TLMaths", url: "https://www.youtube.com/watch?v=19OEs6-350c", channel: "TLMaths" },
          { title: "IAL P2 Circles Past Paper — Mr Hassaan", url: "https://www.youtube.com/watch?v=yTPWxMpZOc4", channel: "Mr Hassaan's Maths" },
          { title: "A-Level Maths: Equation of a Circle and Tangents", url: "https://www.youtube.com/watch?v=C8b_LmN4qX7", channel: "A-Level Maths" }
        ]
      },
      // ── P2 Chapter 3 ───────────────────────────────────────────
      {
        id: "p2c3", num: 3, title: "Exponentials & Logarithms",
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
          { name: "Log Law (Product)", expr: "log(MN) = logM + logN" },
          { name: "Log Law (Power)", expr: "log(Mⁿ) = n·logM" },
          { name: "Change of Base", expr: "logₐb = lnb / lna" },
          { name: "Solving Exponentials", expr: "aˣ = b → x = lnb/lna" },
          { name: "Linearising y=axⁿ", expr: "lgy = n·lgx + lga (lg=log₁₀)" },
          { name: "Linearising y=abˣ", expr: "lny = x·lnb + lna" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】对数律使用方向反了（将log(M+N)误写为logM·logN等非法运算）；线性化时斜率与截距对应的参数弄错；隐藏二次方程中忘记验证解的有效性（如u=eˣ必须>0，负数解需舍去）；换底公式分子分母颠倒。本章是P2挂科率第二高的章节，建议在完成P1后立即攻克。",
        examTips: "线性化（Reduction to Linear Form）几乎每年必考，必须能：① 取对数变形；② 说明纵轴/横轴的表达式；③ 从斜率和截距求参数a, b/k。在考试时需列出明确的\"Y = mX + c\"形式的方程，并标注X和Y分别代表什么。",
        youtube: [
          { title: "P2 Exponentials & Logs Full Chapter — Bicen Maths", url: "https://www.youtube.com/watch?v=ehe8pObhyDk", channel: "Bicen Maths" },
          { title: "Logs & Reduction to Linear Form — TLMaths", url: "https://www.youtube.com/watch?v=19OEs6-350c", channel: "TLMaths" },
          { title: "IAL P2 Logarithms Past Paper — Mr Hassaan", url: "https://www.youtube.com/watch?v=8PJxYK88y8I", channel: "Mr Hassaan's Maths" },
          { title: "A-Level Maths: Exponentials and Logarithms Explained", url: "https://www.youtube.com/watch?v=E2d_VbH9jP4", channel: "A-Level Maths" }
        ]
      },
      // ── P2 Chapter 4 ───────────────────────────────────────────
      {
        id: "p2c4", num: 4, title: "Binomial Expansion",
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
          { name: "Binomial Theorem", expr: "(a+b)ⁿ = Σᵣ₌₀ⁿ C(n,r)·aⁿ⁻ʳ·bʳ" },
          { name: "Combination", expr: "C(n,r) = n!/[r!(n−r)!]  e.g. C(5,2)=10" },
          { name: "General Term", expr: "T_{r+1} = C(n,r)·aⁿ⁻ʳ·bʳ" },
          { name: "(1+x)ⁿ Expansion", expr: "1 + nx + n(n−1)x²/2! + n(n−1)(n−2)x³/3! + …" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】求特定项时r的起始值混淆（r从0还是从1）；含负数或分数项时符号错误（如(1−2x)⁵中b=−2x，代入时负号处理不当）；组合数C(n,r)计算错误（尤其n较大时）；展开式写出的项数不够或多余。建议：写通项前先明确a, b, n的值，然后再代入。",
        examTips: "P2二项式展开题目分值通常为3–6分，多为\"求第k项系数\"或\"求x²的系数\"，时间有限时要直接用通项公式，不要逐项展开。Casio ClassWiz计算器的组合数功能（nCr）可用于快速验证系数。",
        youtube: [
          { title: "P2 Binomial Expansion Complete Guide — Bicen Maths", url: "https://www.youtube.com/watch?v=JpV6BlNosAU", channel: "Bicen Maths" },
          { title: "Binomial Theorem General Term — TLMaths", url: "https://www.youtube.com/watch?v=19OEs6-350c", channel: "TLMaths" },
          { title: "IAL P2 June 2024 Q1 Binomial Expansion — Mr Hassaan", url: "https://www.youtube.com/watch?v=8PJxYK88y8I", channel: "Mr Hassaan's Maths" },
          { title: "A-Level Maths: Binomial Expansion Theorem", url: "https://www.youtube.com/watch?v=B7k_QwR5mZ2", channel: "A-Level Maths" }
        ]
      },
      // ── P2 Chapter 5 ───────────────────────────────────────────
      {
        id: "p2c5", num: 5, title: "Sequences & Series",
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
          { name: "Arithmetic nth Term", expr: "uₙ = a + (n−1)d" },
          { name: "Arithmetic Series Sum", expr: "Sₙ = n/2·(2a+(n−1)d) = n/2·(first + last)" },
          { name: "Geometric nth Term", expr: "uₙ = a·rⁿ⁻¹" },
          { name: "Geometric Series Sum", expr: "Sₙ = a(1−rⁿ)/(1−r), r≠1" },
          { name: "Sum to Infinity", expr: "S∞ = a/(1−r), condition: |r|<1" },
          { name: "Finding uₙ from Sₙ", expr: "uₙ = Sₙ − Sₙ₋₁ (n≥2), u₁ = S₁" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】混淆等差与等比的求和公式；无穷级数题中未验证|r|<1的收敛条件（若|r|≥1则级数不收敛，不能用S∞公式）；递推数列求第n项时计算迭代错误；由Sₙ求uₙ时对n=1的情形单独处理（不能用 u₁ = S₁−S₀）。等比数列中r可以为负数（交错数列），要特别注意奇偶项符号。",
        examTips: "数列题在WMA12中通常为5–8分的结构题，分部分给分。收敛性判断（|r|<1）必须在使用S∞前明确写出，否则丢\"方法分\"。建议先用通项公式快速验证a和d/r的计算是否正确，再进行求和。",
        youtube: [
          { title: "P2 Sequences & Series Full Chapter — Bicen Maths", url: "https://www.youtube.com/watch?v=aGz2V-uXn90", channel: "Bicen Maths" },
          { title: "Arithmetic & Geometric Series — TLMaths", url: "https://www.youtube.com/watch?v=19OEs6-350c", channel: "TLMaths" },
          { title: "IAL P2 Sequences & Series Past Papers — Mr Hassaan", url: "https://www.youtube.com/watch?v=8PJxYK88y8I", channel: "Mr Hassaan's Maths" },
          { title: "A-Level Maths: Arithmetic and Geometric Series (Sigma Notation)", url: "https://www.youtube.com/watch?v=S4v_NpL2rY6", channel: "A-Level Maths" }
        ]
      },
      // ── P2 Chapter 6 ───────────────────────────────────────────
      {
        id: "p2c6", num: 6, title: "Trigonometric Identities",
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
          { name: "Pythagorean Identity", expr: "sin²θ + cos²θ = 1" },
          { name: "Identity (÷cos²)", expr: "1 + tan²θ = sec²θ" },
          { name: "Identity (÷sin²)", expr: "1 + cot²θ = csc²θ" },
          { name: "Quotient Identity", expr: "tanθ = sinθ/cosθ" },
          { name: "Reciprocal Identities", expr: "secθ=1/cosθ, cscθ=1/sinθ, cotθ=1/tanθ" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】将 sin²θ 误写成 (sinθ)² 导致化简出错；在给定区间内遗漏解（最常见：sinθ=k在2π区间内有两个解）；解含 tan²θ 的方程时忘记tan可正可负；将恒等式证明题中左边和右边相互操作（只能从一边出发推导至另一边，不能两边同时变形）。考官报告：超过50%的学生在三角方程中只给出部分解，失去大量分数。",
        examTips: "三角方程解题口诀：「化简→代换→解基本方程→CAST找角→验证区间」，每步必须写出。在区间 [0, 2π] 内求解时建议画出对应三角函数的图像，直观标出所有交点位置，再精确计算。此章练习量要求最多：至少做50道以上的区间三角方程题。",
        youtube: [
          { title: "P2 Trigonometric Identities Full Chapter — Bicen Maths", url: "https://www.youtube.com/watch?v=_cxcCVjjAhQ", channel: "Bicen Maths" },
          { title: "Trig Identities & Equations — TLMaths", url: "https://www.youtube.com/watch?v=19OEs6-350c", channel: "TLMaths" },
          { title: "IAL P2 June 2024(R) Q5 Trigonometric Modelling — Mr Hassaan", url: "https://www.youtube.com/watch?v=_cxcCVjjAhQ", channel: "Mr Hassaan's Maths" },
          { title: "A-Level Maths: Trigonometric Identities and Equations", url: "https://www.youtube.com/watch?v=T9m_JwR8vN3", channel: "A-Level Maths" }
        ]
      },
      // ── P2 Chapter 7 ───────────────────────────────────────────
      {
        id: "p2c7", num: 7, title: "Further Differentiation",
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
          { name: "Stationary Point Condition", expr: "dy/dx = 0 (set first derivative to zero)" },
          { name: "Local Minimum (2nd Derivative)", expr: "d²y/dx² > 0 → local minimum" },
          { name: "Local Maximum (2nd Derivative)", expr: "d²y/dx² < 0 → local maximum" },
          { name: "Chain Rule for Rates of Change", expr: "dy/dt = dy/dx · dx/dt" },
          { name: "Increasing/Decreasing", expr: "dy/dx>0 → increasing; dy/dx<0 → decreasing" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】优化题中建立目标函数时约束条件代入出错（代数错误）；d²y/dx²=0时不进行进一步分析，直接错误结论；优化题求出驻点后未说明是极大还是极小（必须给出理由）；实际问题中忘记检验解的实际意义（如长度必须为正数）。",
        examTips: "优化大题（5–9分）必须包含完整步骤：设变量→建函数→求导→令=0→验证→求值。任何一步缺失都可能丢1–2分。在考试中，若d²y/dx²计算困难，可改用\"取驻点两侧各一点代入dy/dx观察符号变化\"，同样有效。",
        youtube: [
          { title: "P2 Differentiation Stationary Points & Optimisation — Bicen Maths", url: "https://www.youtube.com/watch?v=WkxuDdsBFr4", channel: "Bicen Maths" },
          { title: "Stationary Points & Optimisation — TLMaths", url: "https://www.youtube.com/watch?v=19OEs6-350c", channel: "TLMaths" },
          { title: "IAL P2 Differentiation Past Paper — Mr Hassaan", url: "https://www.youtube.com/watch?v=8PJxYK88y8I", channel: "Mr Hassaan's Maths" },
          { title: "A-Level Maths: Advanced Differentiation Techniques", url: "https://www.youtube.com/watch?v=D2x_PbK7qL5", channel: "A-Level Maths" }
        ]
      },
      // ── P2 Chapter 8 ───────────────────────────────────────────
      {
        id: "p2c8", num: 8, title: "Further Integration",
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
          { name: "Definite Integral", expr: "∫ₐᵇ f(x)dx = F(b)−F(a), F'(x)=f(x)" },
          { name: "Area (above x-axis)", expr: "A = ∫ₐᵇ f(x)dx, when f(x)≥0" },
          { name: "Area Between Two Curves", expr: "A = ∫ₐᵇ [f(x)−g(x)]dx, f(x)≥g(x)" },
          { name: "Trapezium Rule", expr: "≈ ½h[y₀+2(y₁+…+yₙ₋₁)+yₙ], h=(b−a)/n" },
          { name: "∫1/x", expr: "∫1/x dx = ln|x| + C (note the absolute value)" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】面积题中忽略曲线位于x轴以下的部分（直接用总积分当面积，导致正负相消）；梯形法则中y值个数错误（n个梯形需要n+1个y值，即y₀到yₙ，首尾各一个，中间各算两次）；两曲线面积题中上下函数位置判断错误（应先画图确认谁在上方）；∫1/x漏掉绝对值符号。",
        examTips: "面积大题（6–9分）必须：① 画草图标明区域 ② 正确设置积分上下限 ③ 对x轴上下分段处理 ④ 最终给出正数面积。梯形法则题通常要求说明估计是高估还是低估，必须给出理由（联系曲线凹凸性）。计算器可用于验证定积分数值，但必须展示积分计算过程。",
        youtube: [
          { title: "P2 Integration Definite Integrals & Area — Bicen Maths", url: "https://www.youtube.com/watch?v=uR-4D966gcE", channel: "Bicen Maths" },
          { title: "Area Under Curves & Trapezium Rule — TLMaths", url: "https://www.youtube.com/watch?v=19OEs6-350c", channel: "TLMaths" },
          { title: "IAL P2 Integration Past Paper — Mr Hassaan", url: "https://www.youtube.com/watch?v=8PJxYK88y8I", channel: "Mr Hassaan's Maths" }
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
        id: "s1c1", num: 1, title: "Mathematical Modelling",
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
          { name: "Modelling Cycle", expr: "Observe→Assume→Model→Data→Validate→Refine (iterative)" },
          { name: "Interpolation vs Extrapolation", expr: "Interpolation: a≤x≤b (within data range); Extrapolation: x<a or x>b" }
        ],
        difficulty: "Foundation",
        hardPoints: "【考试注意】此章节题目通常要求学生用文字解释模型的优/缺点，不是计算题。评分标准要求具体，泛泛而谈（如\"模型不够准确\"）得不到分，必须说明\"模型假设了线性关系，但实际数据可能非线性\"等具体理由。",
        examTips: "本章在WST01中占约2–4分，通常为最后大题的(a)小部分。核心词汇：\"assumptions\"（假设）、\"limitations\"（局限）、\"refine the model\"（修正模型）、\"extrapolation is unreliable\"（外推不可靠）。备考时总结3–4个标准答案模板即可。",
        youtube: [
          { title: "S1 Mathematical Modelling Introduction — ExamSolutions", url: "https://www.youtube.com/results?search_query=S1+statistics+mathematical+modelling+edexcel+IAL", channel: "ExamSolutions" },
          { title: "Statistics 1 Chapter 1 Modelling — TLMaths", url: "https://www.youtube.com/results?search_query=edexcel+IAL+S1+statistics+chapter+1", channel: "TLMaths" }
        ]
      },
      // ── S1 Chapter 2 ───────────────────────────────────────────
      {
        id: "s1c2", num: 2, title: "Measures of Location & Spread",
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
          { name: "Mean (Grouped)", expr: "x̄ = Σfx / Σf" },
          { name: "Variance (Formula)", expr: "σ² = Σx²/n − (Σx/n)² = Σx²/n − x̄²" },
          { name: "Standard Deviation", expr: "$\\sigma = \\sqrt{\\sigma^2} = \\sqrt{\\dfrac{\\sum x^2}{n} - \\bar{x}^2}$" },
          { name: "Coded Mean", expr: "If y=(x−a)/b, then x̄ = bȳ + a" },
          { name: "Coded Standard Deviation", expr: "If y=(x−a)/b, then σₓ = |b|·σᵧ" },
          { name: "IQR", expr: "IQR = Q3 − Q1" }
        ],
        difficulty: "Foundation",
        hardPoints: "【高频失分点】编码题中，学生常对方差与标准差混淆：编码 y=(x−a)/b 后，Var(y)=Var(x)/b²，σᵧ=σₓ/|b|——平移量a对两者均无影响。另一常见错误：在分组数据中使用了组中值的近似均值后再计算方差，但未使用同一套x值，导致前后不一致。建议统一使用计算公式 Σx²/n − x̄²，避免用定义式Σ(x−x̄)²/n逐项计算。",
        examTips: "此章在WST01中通常占6–10分。编码题一定要写出 y=(x−a)/b 的表达式，然后分别处理均值和标准差。计算器的统计功能（Menu 6）可快速验证均值和标准差，但考试中必须展示计算过程。",
        youtube: [
          { title: "S1 Measures of Location & Spread — ExamSolutions", url: "https://www.youtube.com/results?search_query=S1+measures+location+spread+coding+edexcel+IAL", channel: "ExamSolutions" },
          { title: "Mean Variance Coding — TLMaths", url: "https://www.youtube.com/results?search_query=statistics+S1+mean+variance+coding+A+level", channel: "TLMaths" }
        ]
      },
      // ── S1 Chapter 3 ───────────────────────────────────────────
      {
        id: "s1c3", num: 3, title: "Representations of Data",
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
          { name: "Frequency Density", expr: "Frequency density = Frequency ÷ Class width (y-axis of histogram)" },
          { name: "Frequency", expr: "Frequency = Frequency density × Class width (area of histogram bar)" },
          { name: "Outlier Criterion", expr: "Outlier: < Q1−1.5×IQR or > Q3+1.5×IQR" },
          { name: "IQR", expr: "IQR = Q3 − Q1" },
          { name: "Skewness (Positive)", expr: "Right skew: Mean > Median > Mode" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】直方图纵轴错用频数代替频率密度（这是最常见的整章性错误）；不等组距时直接用频率而非频率密度；累积频率图上读取四分位数时坐标读错；离群值计算时1.5×IQR的乘数忘写（误以为是1×IQR）；箱线图中最大/最小值的标注不含离群值时未单独标出离群值点。",
        examTips: "绘制直方图时：先建立频率密度列（频率/组距），再画矩形。读图题要注意题目给的是频率还是频数——转换关系为：频率=频数/总频数，频率密度=频率/组距。比较两组数据时，必须比较位置和离散度量两个维度，并结合上下文说明含义。",
        youtube: [
          { title: "S1 Histograms Frequency Density — ExamSolutions", url: "https://www.youtube.com/results?search_query=S1+histograms+frequency+density+edexcel+IAL", channel: "ExamSolutions" },
          { title: "Box Plots & Outliers — TLMaths", url: "https://www.youtube.com/results?search_query=S1+box+plots+outliers+A+level+statistics", channel: "TLMaths" }
        ]
      },
      // ── S1 Chapter 4 ───────────────────────────────────────────
      {
        id: "s1c4", num: 4, title: "Probability",
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
          { name: "Addition Rule", expr: "P(A∪B) = P(A)+P(B)−P(A∩B)" },
          { name: "Mutually Exclusive Simplification", expr: "If A, B mutually exclusive: P(A∪B) = P(A)+P(B)" },
          { name: "Independence Definition", expr: "A, B independent ⟺ P(A∩B) = P(A)·P(B)" },
          { name: "Conditional Probability", expr: "P(A|B) = P(A∩B) / P(B)" },
          { name: "Multiplication Rule", expr: "P(A∩B) = P(A|B)·P(B)" },
          { name: "Complement Rule", expr: "P(A') = 1 − P(A)" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】最常见陷阱：将\"互斥\"与\"独立\"混淆（这是S1最重要的概念辨析）——互斥是指不能同时发生；独立是指一个事件的发生不影响另一个的概率，两者完全不同的概念。条件概率题中分母取错（P(B)而非P(A)，或取了整个样本空间）。不放回抽样树状图中，第二层的分母应减少1但学生常忘记。",
        examTips: "概率大题（8–12分）解题策略：① 先画文氏图或树状图理清结构 ② 标注所有已知概率 ③ 条件概率用公式P(A|B)=P(A∩B)/P(B) ④ 最终验证所有概率之和为1。独立性的验证必须写出\"P(A)×P(B) = [计算值] = P(A∩B)，因此A和B独立\"或\"≠P(A∩B)，因此A和B不独立\"的完整判断。",
        youtube: [
          { title: "S1 Probability Conditional Probability & Independence — ExamSolutions", url: "https://www.youtube.com/results?search_query=S1+probability+conditional+independent+edexcel+IAL", channel: "ExamSolutions" },
          { title: "Venn Diagrams & Tree Diagrams — TLMaths", url: "https://www.youtube.com/results?search_query=S1+venn+diagram+tree+diagram+A+level+statistics", channel: "TLMaths" }
        ]
      },
      // ── S1 Chapter 5 ───────────────────────────────────────────
      {
        id: "s1c5", num: 5, title: "Correlation & Regression",
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
          { name: "Regression Slope b", expr: "b = Sxy / Sxx" },
          { name: "Regression Intercept a", expr: "a = ȳ − b·x̄ (regression line passes through mean point)" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】考官报告中排名第一的失分点：未在实际上下文中解释b的含义（只写\"b是斜率\"而不写\"当雇员人数增加1人，纸张成本平均增加£b\"等）。计算Sxy时漏掉负号，或将Σxy误算为(Σx)(Σy)。内插/外推题中，外推预测时未说明\"超出数据范围，可靠性较低\"。相关≠因果的判断必须在题目要求时明确指出。",
        examTips: "Casio ClassWiz的回归功能（Menu 6→y=a+bx）可直接输出a, b, r值，用于验证手算结果。但考试时必须展示Sxy, Sxx的计算过程。解释类小题（2分）：\"在本题背景下，斜率b意味着每增加一个[x的单位]，[y的变量]平均增加/减少[b]个[y的单位]。\"",
        youtube: [
          { title: "S1 Correlation & Regression — ExamSolutions", url: "https://www.youtube.com/results?search_query=S1+correlation+regression+PMCC+edexcel+IAL", channel: "ExamSolutions" },
          { title: "PMCC & Regression Line — TLMaths", url: "https://www.youtube.com/results?search_query=S1+PMCC+regression+A+level+statistics", channel: "TLMaths" }
        ]
      },
      // ── S1 Chapter 6 ───────────────────────────────────────────
      {
        id: "s1c6", num: 6, title: "Discrete Random Variables",
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
          { name: "Expected Value", expr: "E(X) = Σ xᵢ·P(X=xᵢ)" },
          { name: "Variance", expr: "Var(X) = E(X²)−[E(X)]² = Σxᵢ²·P(X=xᵢ)−[E(X)]²" },
          { name: "Linear Transformation (Expectation)", expr: "E(aX+b) = a·E(X) + b" },
          { name: "Linear Transformation (Variance)", expr: "Var(aX+b) = a²·Var(X) (b has no effect)" },
          { name: "Binomial Distribution", expr: "X~B(n,p): P(X=r)=C(n,r)pʳ(1−p)ⁿ⁻ʳ" },
          { name: "Binomial E(X) and Var(X)", expr: "E(X)=np; Var(X)=np(1−p)" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】计算E(X²)时，将[E(X)]²误作E(X²)（混淆Var(X)=E(X²)−[E(X)]²中的两项）；线性变换方差时，Var(aX+b)=a²Var(X)——平移量b不影响方差，但学生常忘记而写成a²Var(X)+b²；二项分布适用条件验证：若n较大且p与0.5差距大，学生有时会错误使用正态分布（S1中不考正态近似）。",
        examTips: "E(X²)的计算必须列出xᵢ², P(X=xᵢ)两列再逐行相乘，不要跳步。二项概率计算：Casio ClassWiz的\"STAT→Distribution→Binomial\"可快速计算，但必须手写概率公式作为解题步骤。建议先列出P(X=r)的公式，再代入数值。",
        youtube: [
          { title: "S1 Discrete Random Variables — ExamSolutions", url: "https://www.youtube.com/results?search_query=S1+discrete+random+variables+expectation+variance+edexcel", channel: "ExamSolutions" },
          { title: "Binomial Distribution — TLMaths", url: "https://www.youtube.com/results?search_query=S1+binomial+distribution+A+level+statistics", channel: "TLMaths" }
        ]
      },
      // ── S1 Chapter 7 ───────────────────────────────────────────
      {
        id: "s1c7", num: 7, title: "Normal Distribution",
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
          { name: "Standardisation Formula", expr: "Z = (X − μ) / σ, Z~N(0,1)" },
          { name: "Symmetry Property", expr: "P(Z < −z) = 1 − P(Z < z) = P(Z > z)" },
          { name: "Interval Probability", expr: "P(a<X<b) = Φ((b−μ)/σ) − Φ((a−μ)/σ)" },
          { name: "Inverse Lookup", expr: "If P(X<k)=p, then k = μ + σ·Φ⁻¹(p)" },
          { name: "Solving for Parameters", expr: "Two conditions → two Z-value equations, solve simultaneously for μ and σ" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】将X~N(μ, σ²)中的第二个参数误作标准差（实为方差！），导致标准化时σ用错；负z值处理时忘记使用对称性转化（直接查表找不到负z值）；联立方程求μ, σ时解方程出现代数错误；面积题中P(X > a)未转化为1−Φ(z)而直接查表。计算器使用要点：Casio ClassWiz的Normal CD和Inverse Normal功能可快速计算，但必须先写出标准化步骤。",
        examTips: "正态分布题目解题模板：① 写出 X~N(μ,σ²)；② 标准化 Z=(X−μ)/σ；③ 画出正态曲线，标注均值和所求区域（防止正负号错误）；④ 用Φ(z)表达概率；⑤ 代入计算得答案。联立求参数题：分别写出两个标准化方程，消去一个未知量，注意负z值用对称性处理后消去。此题型是A*/A考生的拉分关键。",
        youtube: [
          { title: "S1 Normal Distribution Including Inverse Lookup — ExamSolutions", url: "https://www.youtube.com/results?search_query=S1+normal+distribution+inverse+edexcel+IAL", channel: "ExamSolutions" },
          { title: "Normal Distribution Standardisation & Parameter Finding — TLMaths", url: "https://www.youtube.com/results?search_query=S1+normal+distribution+find+mu+sigma+A+level", channel: "TLMaths" }
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
        id: "p3c1", num: 1, title: "Further Algebraic Methods",
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
          { name: "Linear Factor Decomposition", expr: "A/(ax+b) + B/(cx+d) = [A(cx+d)+B(ax+b)] / [(ax+b)(cx+d)]" },
          { name: "Repeated Factor Decomposition", expr: "A/(ax+b) + B/(ax+b)², B = f(x)·(ax+b)²|_{x=−b/a}" },
          { name: "Cover-up Method", expr: "A = f(x)·(ax+b)|_{x=−b/a}" },
          { name: "Improper Fraction Handling", expr: "If deg(f) ≥ deg(g): use long division first to get Q(x) + R(x)/g(x)" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】假分式未先做长除法直接分解（最常见错误）；Cover-up法代入值时符号错误；有重复因子时漏写B/(ax+b)²项；不可约二次因子分子应写为Bx+C而非常数B。建议：先判断真/假分式，再选择分解结构，最后用代入法+比较系数双重验证。",
        examTips: "WMA13中部分分式题目几乎必须在积分题中使用，先化简再积分是标准流程。计算系数时，优先用Cover-up代入法求每个常数，再用展开比较法验证。",
        youtube: [
          { title: "P3 Partial Fractions — TLMaths", url: "https://www.youtube.com/results?search_query=P3+partial+fractions+edexcel+IAL+A+level", channel: "TLMaths" },
          { title: "Partial Fractions IAL — ExamSolutions", url: "https://www.youtube.com/results?search_query=partial+fractions+improper+edexcel+A+level+maths", channel: "ExamSolutions" },
          { title: "Algebraic Methods P3 — Mr Hassaan WMA13", url: "https://www.youtube.com/results?search_query=WMA13+algebraic+methods+partial+fractions+hassaan", channel: "Mr Hassaan's Maths" }
        ]
      },
      {
        id: "p3c2", num: 2, title: "Functions",
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
          { name: "Composite Function", expr: "(g∘f)(x) = g(f(x)), note order: f first, then g" },
          { name: "Inverse Function Domain/Range", expr: "Dom(f⁻¹) = Range(f); Range(f⁻¹) = Dom(f)" },
          { name: "f(x) and f⁻¹(x) Relationship", expr: "f(f⁻¹(x)) = x; graphs are reflections in y=x" },
          { name: "Modulus Function", expr: "|f(x)| ≥ 0; graph: reflect negative part above x-axis" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】复合函数顺序错误——gf(x)先作用f后作用g，而非先g；反函数定义域忘记限制（应等于原函数的值域）；绝对值方程只解f(x)=k而漏掉f(x)=−k；奇偶性判断时代入f(−x)展开计算出错。反函数与原函数图像关于y=x对称这一几何性质常被用于考题，须熟悉。",
        examTips: "函数题常有\"State the range of f\"这类开放性问题——答案必须是集合形式或不等式，不接受单个值。求复合函数的域时：先限制x在f的域内，再检查f(x)落在g的域内，两个条件取交集。",
        youtube: [
          { title: "P3 Functions Domain Range Inverse — TLMaths", url: "https://www.youtube.com/results?search_query=P3+functions+inverse+composite+domain+range+edexcel+A+level", channel: "TLMaths" },
          { title: "Composite & Inverse Functions IAL — ExamSolutions", url: "https://www.youtube.com/results?search_query=composite+inverse+functions+A+level+edexcel", channel: "ExamSolutions" },
          { title: "Modulus Function Graph — Bicen Maths P3", url: "https://www.youtube.com/results?search_query=modulus+function+graph+A+level+edexcel+P3", channel: "Bicen Maths" }
        ]
      },
      {
        id: "p3c3", num: 3, title: "Further Trigonometry",
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
          { name: "Pythagorean Variants", expr: "1+tan²θ=sec²θ; 1+cot²θ=cosec²θ" },
          { name: "Addition Formula (sin)", expr: "sin(A±B)=sinAcosB±cosAsinB" },
          { name: "Addition Formula (cos)", expr: "cos(A±B)=cosAcosB∓sinAsinB" },
          { name: "Double Angle (sin/tan)", expr: "sin2A=2sinAcosA; tan2A=2tanA/(1−tan²A)" },
          { name: "cos2A (Three Forms)", expr: "cos2A=cos²A−sin²A=1−2sin²A=2cos²A−1" },
          { name: "Harmonic Form", expr: "asinθ+bcosθ=Rsin(θ+α), R=√(a²+b²), tanα=b/a" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】cos(A+B)中的∓符号写反（与sin公式方向相反）；调和形式中α的计算用错三角形边（a对应cos分量，b对应sin分量）；二倍角的三种cos2A形式选错（积分/方程选不同形式效率差异大）；cosec和sec求导公式混淆。解三角方程时，调和形式转化后仍需在指定区间内找全部解。",
        examTips: "调和形式解题步骤：① 展开Rsin(θ+α)=Rsinθcosα+Rcosθsinα；② 比较系数得Rcosα=a, Rsinα=b；③ 求R=√(a²+b²)和α=arctan(b/a)（注意象限！）。此公式可直接用于求最值，是WMA13最高频应用之一。",
        youtube: [
          { title: "P3 Trig Identities Addition Formulae — TLMaths", url: "https://www.youtube.com/results?search_query=P3+addition+formulae+double+angle+edexcel+A+level", channel: "TLMaths" },
          { title: "R-formula Harmonic Form — ExamSolutions", url: "https://www.youtube.com/results?search_query=R+alpha+form+harmonic+a+sin+b+cos+edexcel", channel: "ExamSolutions" },
          { title: "Reciprocal Trig Functions WMA13 — Mr Hassaan", url: "https://www.youtube.com/results?search_query=sec+cosec+cot+P3+edexcel+IAL+A+level", channel: "Mr Hassaan's Maths" }
        ]
      },
      {
        id: "p3c4", num: 4, title: "Further Exponentials & Logarithms",
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
          { name: "Derivative of e^{kx}", expr: "d/dx(e^{kx}) = ke^{kx}" },
          { name: "Derivative of ln[f(x)]", expr: "d/dx[ln f(x)] = f'(x)/f(x)" },
          { name: "∫e^{kx}", expr: "∫e^{kx} dx = (1/k)e^{kx} + C" },
          { name: "Standard Log Integral", expr: "∫f'(x)/f(x) dx = ln|f(x)| + C" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】∫(1/x)dx忘记绝对值（应写ln|x|而非lnx）；链式法则中f'(x)因子遗漏；对数型积分未识别f'(x)/f(x)的模式（分子应恰好是分母的导数，需先调整系数）；指数增长模型中k的符号（增长k>0，衰减k<0）混淆。",
        examTips: "识别\"对数积分\"的关键：检查分子是否是分母的导数（可差一个常数倍）。若是，结果为ln|分母|+C。考试中出现∫(2x+3)/(x²+3x+1)dx这类题目时，立即检验分子是否=d/dx(分母)的倍数。",
        youtube: [
          { title: "P3 Exponentials & Logs Differentiation & Integration — TLMaths", url: "https://www.youtube.com/results?search_query=P3+exponentials+logarithms+differentiation+integration+edexcel", channel: "TLMaths" },
          { title: "ln x and e^x Differentiation — ExamSolutions", url: "https://www.youtube.com/results?search_query=ln+x+e+x+differentiation+integration+A+level+chain+rule", channel: "ExamSolutions" },
          { title: "Logarithmic Differentiation IAL P3 — Bicen Maths", url: "https://www.youtube.com/results?search_query=logarithmic+differentiation+A+level+edexcel+P3", channel: "Bicen Maths" }
        ]
      },
      {
        id: "p3c5", num: 5, title: "Advanced Differentiation",
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
          { name: "Chain Rule", expr: "d/dx[f(g(x))] = f'(g(x))·g'(x)" },
          { name: "Product Rule", expr: "d/dx(uv) = u·v' + v·u'" },
          { name: "Quotient Rule", expr: "d/dx(u/v) = (v·u' − u·v') / v²" },
          { name: "d/dx(tanx)", expr: "d/dx(tan x) = sec²x" },
          { name: "Implicit Differentiation", expr: "For y²: d/dx(y²) = 2y·dy/dx" },
          { name: "Parametric Differentiation", expr: "dy/dx = (dy/dt) ÷ (dx/dt)" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】乘积法则中漏写其中一项（u'v+uv'两项缺一）；商法则分子减法顺序错误（应是v·du−u·dv，而非反向）；隐函数微分中对含y²的项忘记乘dy/dx（是最常见的漏步）；参数方程中dy/dx求出后仍用t表示，未代入t值。链式法则是本章的核心——几乎所有其他规则都是其特例或组合。",
        examTips: "考试策略：① 先识别函数类型（单函数还是乘积/商）；② 选择对应法则；③ 明确写出u, v和u', v'（商法则/乘积法则）或外层/内层函数（链式法则）；④ 代入并化简。每步都要展示，不能跳步——WMA13给出每步方法分。",
        youtube: [
          { title: "P3 Differentiation Chain Product Quotient Rules — TLMaths", url: "https://www.youtube.com/results?search_query=P3+chain+rule+product+quotient+differentiation+edexcel+IAL", channel: "TLMaths" },
          { title: "Implicit Parametric Differentiation — ExamSolutions", url: "https://www.youtube.com/results?search_query=implicit+parametric+differentiation+A+level+edexcel", channel: "ExamSolutions" },
          { title: "P3 Differentiation Full Chapter — Bicen Maths WMA13", url: "https://www.youtube.com/results?search_query=P3+differentiation+WMA13+edexcel+IAL+bicen+maths", channel: "Bicen Maths" }
        ]
      },
      {
        id: "p3c6", num: 6, title: "Advanced Integration",
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
          { name: "Integration by Parts", expr: "∫u dv = uv − ∫v du (LIATE rule for choosing u)" },
          { name: "∫1/(a²+x²)", expr: "∫1/(a²+x²) dx = (1/a)arctan(x/a) + C" },
          { name: "∫1/√(a²−x²)", expr: "∫1/√(a²−x²) dx = arcsin(x/a) + C" },
          { name: "∫tan x", expr: "∫tan x dx = ln|sec x| + C = −ln|cos x| + C" },
          { name: "sin²x Simplification", expr: "sin²x = ½(1−cos2x); cos²x = ½(1+cos2x)" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】换元积分忘记替换dx（必须将dx换成du除以g'(x)）；定积分换元后未更新上下限；分部积分LIATE顺序选错（如对∫xlnx dx，应选u=lnx而非u=x）；二次分部积分时方向错误，未将循环积分项移项解方程。P3积分大题通常综合多种技术，识别策略是考前的最高优先级训练内容。",
        examTips: "积分方法识别流程：① 标准形式？→ 直接套公式。② f'(x)/f(x)型？→ ln|f(x)|。③ 乘积？→ 分部积分（LIATE）。④ 复合函数？→ 换元。⑤ 有理式？→ 部分分式。⑥ 含sin²x或cos²x？→ 倍角公式。掌握这个决策树，WMA13积分题就有了系统解法。",
        youtube: [
          { title: "P3 Integration by Parts & Substitution — TLMaths", url: "https://www.youtube.com/results?search_query=P3+integration+by+parts+substitution+edexcel+A+level+IAL", channel: "TLMaths" },
          { title: "Integration by Parts — ExamSolutions", url: "https://www.youtube.com/results?search_query=integration+by+parts+A+level+edexcel+LIATE", channel: "ExamSolutions" },
          { title: "P3 Integration Full Chapter — Bicen Maths", url: "https://www.youtube.com/results?search_query=P3+integration+WMA13+full+chapter+bicen+maths", channel: "Bicen Maths" }
        ]
      },
      {
        id: "p3c7", num: 7, title: "Vectors",
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
          { name: "Vector Equation of Line", expr: "r = a + λb (a is a point, b is direction vector, λ∈ℝ)" },
          { name: "Scalar (Dot) Product", expr: "a·b = a₁b₁ + a₂b₂ + a₃b₃ = |a||b|cosθ" },
          { name: "Angle Between Vectors", expr: "cosθ = (a·b)/(|a||b|), 0° ≤ θ ≤ 180°" },
          { name: "Perpendicularity Condition", expr: "a·b = 0 ⟺ a ⊥ b" },
          { name: "Magnitude (3D)", expr: "|xi+yj+zk| = √(x²+y²+z²)" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】两直线交点验证：解出λ和μ后，必须验证第三个坐标方程成立（否则是异面直线）；点积结果为负数时，实际夹角可能是钝角（需取arccos，范围0到180°）；向量方程中将位置向量a和方向向量b混淆；单位向量未除以模直接使用。异面直线（skew lines）是P3新概念，需理解与平行和相交的区别。",
        examTips: "向量题必须展示完整过程：① 写出两直线的向量方程；② 联立三个方程；③ 解两个方程求λ, μ；④ 代入第三个方程验证（必须写出！）；⑤ 得出结论（相交/异面）。每个缺失步骤丢一分，验证步骤是最常被遗漏的。",
        youtube: [
          { title: "P3 Vectors 3D Lines Dot Product — TLMaths", url: "https://www.youtube.com/results?search_query=P3+3D+vectors+lines+dot+product+edexcel+IAL", channel: "TLMaths" },
          { title: "Vector Equations of Lines — ExamSolutions", url: "https://www.youtube.com/results?search_query=vector+equation+line+3D+A+level+edexcel", channel: "ExamSolutions" },
          { title: "P3 Vectors Full Chapter — Bicen Maths WMA13", url: "https://www.youtube.com/results?search_query=vectors+P3+WMA13+edexcel+IAL+full+chapter", channel: "Bicen Maths" }
        ]
      },
      {
        id: "p3c8", num: 8, title: "Differential Equations",
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
          { name: "Separable Variables", expr: "dy/g(y) = f(x)dx → ∫dy/g(y) = ∫f(x)dx + C" },
          { name: "Exponential Growth/Decay", expr: "dN/dt=kN → N=Ae^{kt} (A=N₀ is initial value)" },
          { name: "Newton's Law of Cooling", expr: "dT/dt=−k(T−T₀) → T−T₀=(T₀init−T₀)e^{−kt}" },
          { name: "Particular Solution", expr: "Substitute initial condition (x₀,y₀) to solve for C → unique particular solution" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】分离变量时将1/g(y)移项后积分忘记（对左边按y积分而非x）；积分时漏掉+C；代入初始条件时只解出C但未写出完整特解；建模题中变化率方向错误（\"以速率k增长\"意味着+k，\"以速率k减少\"意味着−k）。微分方程解的验证（将解代回方程）虽然费时，但可发现绝大多数代数错误。",
        examTips: "分离变量时，建议先明确写出分离后的形式 ∫(1/g(y))dy = ∫f(x)dx，再逐步积分——不要跳过积分符号步骤。建模题审题要点：找\"变化率\"关键词（rate of change / proportional to / decreases as...），直接翻译为dy/dx=...的数学表达式。",
        youtube: [
          { title: "P3 Differential Equations Separable Variables — TLMaths", url: "https://www.youtube.com/results?search_query=P3+differential+equations+separable+variables+edexcel+A+level", channel: "TLMaths" },
          { title: "Separable Differential Equations — ExamSolutions", url: "https://www.youtube.com/results?search_query=separable+differential+equations+A+level+edexcel+IAL", channel: "ExamSolutions" },
          { title: "P3 Differential Equations Modelling — Bicen Maths", url: "https://www.youtube.com/results?search_query=differential+equations+modelling+P3+WMA13+edexcel", channel: "Bicen Maths" }
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
        id: "p4c1", num: 1, title: "Proof by Mathematical Induction",
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
          { name: "Base Step", expr: "Verify P(1): LHS = f(1), RHS = g(1), show LHS = RHS" },
          { name: "Inductive Hypothesis", expr: "Assume P(k): Σ_{r=1}^{k} f(r) = g(k)" },
          { name: "Inductive Step (Series)", expr: "P(k+1): Σ_{r=1}^{k+1} f(r) = g(k) + f(k+1) = g(k+1)" },
          { name: "Divisibility Step", expr: "f(k+1) = a·f(k) + m·(expr) → m | f(k+1)" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】归纳步从P(k+1)左边出发写起，不能直接写P(k+1)=P(k)+...（逻辑方向错误）；结论语句不完整（必须明确引用\"By the Principle of Mathematical Induction\"）；矩阵乘法计算错误；级数归纳步的代数化简出错后结果与g(k+1)不匹配。格式分通常占全题分数的1分，但格式完全不规范时可能影响后续方法分的获得。",
        examTips: "数学归纳法题目格式极为重要。建议在考前背诵三个标准段落：① Basis/Base Case段；② Assume...段；③ Consider P(k+1)段，以及结论段。WMA14中归纳法通常为7–9分，分布在4步之间，每步2–3分，格式正确可得大部分分数。",
        youtube: [
          { title: "P4 Proof by Induction — TLMaths", url: "https://www.youtube.com/results?search_query=P4+proof+by+mathematical+induction+edexcel+IAL+A+level", channel: "TLMaths" },
          { title: "Mathematical Induction Series & Divisibility — ExamSolutions", url: "https://www.youtube.com/results?search_query=mathematical+induction+series+divisibility+A+level+edexcel", channel: "ExamSolutions" },
          { title: "P4 Induction Matrix Powers — Mr Hassaan WMA14", url: "https://www.youtube.com/results?search_query=proof+by+induction+matrices+WMA14+edexcel+IAL", channel: "Mr Hassaan's Maths" }
        ]
      },
      {
        id: "p4c2", num: 2, title: "Complex Numbers",
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
          { name: "Product with Conjugate", expr: "z·z* = |z|² = a²+b² (real number)" },
          { name: "Polar Form", expr: "z = r(cosθ+i sinθ), r=|z|, θ=arg z ∈(−π,π]" },
          { name: "De Moivre's Theorem", expr: "(cosθ+i sinθ)ⁿ = cos(nθ)+i sin(nθ)" },
          { name: "nth Roots", expr: "z^{1/n} has n values, separated by angle 2π/n" },
          { name: "Circle Locus", expr: "|z−a|=r ↔ circle centre a, radius r (on Argand diagram)" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】辐角计算时未考虑象限（arctan只给第一/四象限值，第二/三象限需加减π）；共轭复数除法时乘以的共轭写错（分母a+bi应乘以a−bi）；De Moivre定理求多倍角时展开错误；复数轨迹题中将|z−a|误解为|z|−|a|（绝对值差不等于差的绝对值！）。复数与Argand图必须结合几何直觉理解，纯代数操作容易出错。",
        examTips: "解复数题始终标注Argand图——即使题目不要求，也能帮助判断辐角象限和轨迹形状。对于极坐标形式，先求|z|（模）再求arg(z)（辐角），分两步进行，不要试图同时完成。",
        youtube: [
          { title: "P4 Complex Numbers Full Chapter — TLMaths", url: "https://www.youtube.com/results?search_query=P4+complex+numbers+argand+modulus+argument+edexcel+IAL", channel: "TLMaths" },
          { title: "De Moivre's Theorem & Loci — ExamSolutions", url: "https://www.youtube.com/results?search_query=de+moivre+theorem+complex+loci+A+level+edexcel", channel: "ExamSolutions" },
          { title: "Complex Numbers WMA14 — Bicen Maths", url: "https://www.youtube.com/results?search_query=complex+numbers+WMA14+edexcel+IAL+bicen", channel: "Bicen Maths" }
        ]
      },
      {
        id: "p4c3", num: 3, title: "Matrices",
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
          { name: "2×2 Determinant", expr: "det[a b; c d] = ad − bc" },
          { name: "2×2 Matrix Inverse", expr: "M⁻¹ = (1/(ad−bc))[d −b; −c a]" },
          { name: "Rotation Matrix", expr: "[cosθ −sinθ; sinθ cosθ] (anticlockwise rotation by θ)" },
          { name: "Solving Systems of Equations", expr: "Mx=b → x=M⁻¹b (unique solution when det M ≠ 0)" },
          { name: "Determinant Properties", expr: "det(AB)=det(A)·det(B); det(A⁻¹)=1/det(A)" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】矩阵乘法顺序错误（AB和BA结果通常不同）；3×3行列式符号的正负号规则（棋盘格±）出错；求逆矩阵时行列式计算错误导致整题答案错误；复合变换中矩阵顺序混淆（先B后A对应矩阵乘积AB，从右到左读）。奇异矩阵（det=0）与无唯一解的联系要理解并能结合几何解释。",
        examTips: "行列式是逆矩阵的关键——总是先计算det(M)并验证其不为零，再求逆矩阵。对3×3矩阵，按第一行展开并仔细处理±号（建议在计算纸上画出棋盘格提醒符号）。矩阵变换题常要求\"求变换后的像\"——用矩阵乘以列向量。",
        youtube: [
          { title: "P4 Matrices Determinants Inverse — TLMaths", url: "https://www.youtube.com/results?search_query=P4+matrices+determinant+inverse+edexcel+IAL+A+level", channel: "TLMaths" },
          { title: "Matrix Transformations & Geometric Transformations — ExamSolutions", url: "https://www.youtube.com/results?search_query=matrix+transformations+rotation+reflection+A+level+edexcel", channel: "ExamSolutions" },
          { title: "3×3 Matrices & Systems WMA14 — Bicen Maths", url: "https://www.youtube.com/results?search_query=3x3+matrix+inverse+equations+P4+WMA14+edexcel", channel: "Bicen Maths" }
        ]
      },
      {
        id: "p4c4", num: 4, title: "Further Vectors",
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
          { name: "Cartesian Equation of Plane", expr: "n·r = d, i.e. n₁x+n₂y+n₃z=d, n is normal vector" },
          { name: "Cross Product (3D)", expr: "a×b=(a₂b₃−a₃b₂)i−(a₁b₃−a₃b₁)j+(a₁b₂−a₂b₁)k" },
          { name: "Point to Plane Distance", expr: "d = |n·r₀ − c| / |n|" },
          { name: "Angle Between Planes", expr: "cosθ = |n₁·n₂|/(|n₁||n₂|), θ∈[0°,90°]" },
          { name: "Area of Parallelogram", expr: "S = |a×b|" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】向量积行列式展开时符号规则出错（第二行有减号！）；平面方程中混淆法向量n和方向向量b、c；求点到平面距离时漏以|n|归一化；两平面夹角取值范围：应取锐角（对应|n₁·n₂|取绝对值）；直线与平面交点代入时参数λ解出但忘记代回求点坐标。",
        examTips: "向量积是P4向量的核心新工具。记忆方法：展开3×3行列式，第一行为i, j, k，再按余子式展开（注意j项有负号）。所有平面相关题目优先求法向量，确定法向量后，平面方程、点面距离、夹角计算均变为直线操作。",
        youtube: [
          { title: "P4 Planes Vectors Cross Product — TLMaths", url: "https://www.youtube.com/results?search_query=P4+planes+cross+product+vector+equations+edexcel+IAL", channel: "TLMaths" },
          { title: "3D Vectors Planes Intersections — ExamSolutions", url: "https://www.youtube.com/results?search_query=3D+vector+plane+intersection+A+level+further+maths+edexcel", channel: "ExamSolutions" },
          { title: "Further Vectors WMA14 — Bicen Maths", url: "https://www.youtube.com/results?search_query=further+vectors+planes+WMA14+edexcel+IAL+bicen", channel: "Bicen Maths" }
        ]
      },
      {
        id: "p4c5", num: 5, title: "Hyperbolic Functions",
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
          { name: "cosh/sinh Definitions", expr: "cosh x=(eˣ+e⁻ˣ)/2; sinh x=(eˣ−e⁻ˣ)/2" },
          { name: "Hyperbolic Identity", expr: "cosh²x − sinh²x = 1 (note: different from trig!)" },
          { name: "Osborn's Rule", expr: "trig→hyperbolic: product terms of sinθ·sinθ change sign" },
          { name: "arcsinh (log form)", expr: "arcsinh x = ln(x+√(x²+1)) (for all x)" },
          { name: "arccosh (log form)", expr: "arccosh x = ln(x+√(x²−1)), x≥1" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】将cosh²x−sinh²x=1误写为+1（与三角函数cos²x+sin²x=1相反）；Osborn法则的应用——仅当两个sinh相乘时才改变符号，单独的sinh²不改变；反双曲函数的对数推导：需要解方程eˣ=... 时保留正负两根，但根据定义域舍去负根；d/dx(cosh x)=sinh x（不是−sinh x，与cos x导数不同）。",
        examTips: "双曲函数题目在WMA14中通常包含：① 证明恒等式（用Osborn或定义直接计算）；② 求导积分；③ 解双曲方程（令e^x=t化为代数方程）。用定义展开为e的表达式可以验证任何双曲恒等式，是最可靠的证明方法。",
        youtube: [
          { title: "P4 Hyperbolic Functions — TLMaths", url: "https://www.youtube.com/results?search_query=P4+hyperbolic+functions+sinh+cosh+edexcel+IAL+A+level", channel: "TLMaths" },
          { title: "Inverse Hyperbolic & Osborn's Rule — ExamSolutions", url: "https://www.youtube.com/results?search_query=inverse+hyperbolic+functions+log+form+edexcel+A+level", channel: "ExamSolutions" },
          { title: "Hyperbolic Functions WMA14 — Bicen Maths", url: "https://www.youtube.com/results?search_query=hyperbolic+functions+WMA14+P4+edexcel+IAL+bicen", channel: "Bicen Maths" }
        ]
      },
      {
        id: "p4c6", num: 6, title: "Polar Coordinates",
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
          { name: "Polar-Cartesian Conversion", expr: "x=r cosθ, y=r sinθ, r²=x²+y²" },
          { name: "Polar Area", expr: "A = ½∫_{α}^{β} r² dθ" },
          { name: "Area Between Two Polar Curves", expr: "A = ½∫_{α}^{β} (r_outer² − r_inner²) dθ" },
          { name: "Cardioid", expr: "r = a(1 ± cosθ), area = (3/2)πa²" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】面积积分的角度范围设定错误（必须覆盖曲线的一个完整循环，对称曲线可取一半再乘2）；积分时r²展开错误（特别是含(1+cosθ)²时需展开为1+2cosθ+cos²θ再用倍角公式化简）；玫瑰线花瓣数计算错误；极坐标草图时未标注r=0的点（切换花瓣位置的关键）。",
        examTips: "极坐标面积题：① 先画草图并标注关键点；② 确定积分范围（使曲线围成目标区域）；③ 计算r²并展开；④ 用倍角公式化简cos²θ；⑤ 积分。每步都展示出来，草图和积分范围各占方法分。",
        youtube: [
          { title: "P4 Polar Coordinates Sketching & Area — TLMaths", url: "https://www.youtube.com/results?search_query=P4+polar+coordinates+curves+area+edexcel+IAL+A+level", channel: "TLMaths" },
          { title: "Polar Curves Sketching & Area — ExamSolutions", url: "https://www.youtube.com/results?search_query=polar+coordinates+sketch+area+integral+A+level+edexcel", channel: "ExamSolutions" },
          { title: "Polar Coordinates WMA14 — Bicen Maths", url: "https://www.youtube.com/results?search_query=polar+coordinates+WMA14+P4+edexcel+IAL+bicen+maths", channel: "Bicen Maths" }
        ]
      },
      {
        id: "p4c7", num: 7, title: "Further Calculus",
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
          { name: "Maclaurin Series", expr: "f(x)=Σ f^{(n)}(0)·xⁿ/n!" },
          { name: "eˣ Series", expr: "eˣ = 1+x+x²/2!+x³/3!+... (for all x)" },
          { name: "sin x Series", expr: "sin x = x−x³/3!+x⁵/5!−... (all x)" },
          { name: "cos x Series", expr: "cos x = 1−x²/2!+x⁴/4!−... (all x)" },
          { name: "ln(1+x) Series", expr: "ln(1+x)=x−x²/2+x³/3−... (|x|<1)" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】麦克劳林系数中的阶乘！（n!）遗漏或计算错误；合成函数展开时，代入g(x)后未正确合并同次幂项；ln(1+x)级数在|x|≥1处使用（无效！）；三角换元后积分完成，回代时未用三角关系还原x的表达式。还原公式推导要求完整展示两次分部积分，且最终须移项解Iₙ方程。",
        examTips: "麦克劳林展开题：① 计算f(0), f'(0), f''(0), f'''(0)；② 代入公式；③ 检查次数（题目通常要求展开至x³或x⁵）。利用e^{iθ}=cosθ+i sinθ和级数展开可以推导欧拉公式，是P4综合题中的高分材料。",
        youtube: [
          { title: "P4 Maclaurin Series — TLMaths", url: "https://www.youtube.com/results?search_query=P4+Maclaurin+series+edexcel+IAL+A+level+further+calculus", channel: "TLMaths" },
          { title: "Reduction Formulae & Trig Substitution — ExamSolutions", url: "https://www.youtube.com/results?search_query=reduction+formula+integration+trigonometric+substitution+A+level+edexcel", channel: "ExamSolutions" },
          { title: "Maclaurin & Further Integration WMA14 — Bicen Maths", url: "https://www.youtube.com/results?search_query=Maclaurin+series+further+integration+WMA14+bicen+maths", channel: "Bicen Maths" }
        ]
      },
      {
        id: "p4c8", num: 8, title: "Second-Order Differential Equations",
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
          { name: "Auxiliary Equation", expr: "am²+bm+c=0, used to determine CF" },
          { name: "CF (Complex Roots)", expr: "If m=p±qi: CF=e^{px}(Acospx+Bsinpx)" },
          { name: "PI (Exponential)", expr: "When f(x)=e^{kx}, try PI=λe^{kx}; if clash, try λxe^{kx}" },
          { name: "PI (Trigonometric)", expr: "When f(x)=sin/cosnx, try PI=Acosnx+Bsinnx" },
          { name: "General Solution", expr: "y = CF + PI, use initial conditions to find A, B in CF" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】PI与CF重合时忘记乘x因子（导致PI代入方程后恒为0，无法确定系数）；CF中复根类型的PI猜测格式正确但求导时链式法则漏掉q因子；初始条件只代入y方程而忘记对dy/dx方程也要代入（通常需要两个方程联立解A, B）；三角函数PI中只猜一种（sin或cos），而正确格式应同时含Acosnx+Bsinnx。",
        examTips: "标准流程：① 写出辅助方程并求解m₁, m₂；② 根据根的类型写出CF（三种形式）；③ 按f(x)类型猜PI格式；④ 代入原方程比较系数求PI参数；⑤ 通解=CF+PI；⑥ 代入初始条件求A, B。每步明确标记，考官按步骤给分。",
        youtube: [
          { title: "P4 Second Order ODE — TLMaths", url: "https://www.youtube.com/results?search_query=P4+second+order+differential+equations+CF+PI+edexcel+IAL", channel: "TLMaths" },
          { title: "Complementary Function & Particular Integral — ExamSolutions", url: "https://www.youtube.com/results?search_query=second+order+ODE+complementary+function+particular+integral+A+level+edexcel", channel: "ExamSolutions" },
          { title: "Second Order DEs WMA14 — Bicen Maths", url: "https://www.youtube.com/results?search_query=second+order+differential+equations+WMA14+P4+bicen+maths", channel: "Bicen Maths" }
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
        id: "m1c1", num: 1, title: "Mathematical Models & Kinematics",
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
          { name: "SUVAT: v=u+at", expr: "v = u + at (no s, contains v, u, a, t)" },
          { name: "SUVAT: s=ut+½at²", expr: "s = ut + ½at² (no v, contains s, u, a, t)" },
          { name: "SUVAT: v²=u²+2as", expr: "v² = u² + 2as (no t, contains v, u, a, s)" },
          { name: "SUVAT: s=½(u+v)t", expr: "s = ½(u+v)t (no a, contains s, u, v, t)" },
          { name: "Free Fall", expr: "Taking downward as positive: a=9.8 m/s² (g=9.8)" }
        ],
        difficulty: "Foundation",
        hardPoints: "【高频失分点】SUVAT方程选择错误（没有仔细列出已知量就随意代入）；忘记向量方向的符号（如抛上去的物体到达最高点速度=0，但继续下落时位移s为负）；自由落体时g的方向未与坐标轴符号约定一致。v-t图中，面积可以为负（当图形在t轴下方时），负面积代表反方向位移，计算总路程时取|面积|。",
        examTips: "SUVAT题目解题模板：① 画图并标注已知量；② 列出s, u, v, a, t五个量并填写已知值；③ 选择含有4个已知量+1个目标量的方程；④ 代入计算。若需两步，先求中间量再代入第二个SUVAT方程。",
        youtube: [
          { title: "M1 Kinematics SUVAT — TLMaths", url: "https://www.youtube.com/results?search_query=M1+kinematics+SUVAT+equations+edexcel+IAL+mechanics", channel: "TLMaths" },
          { title: "SUVAT Equations — ExamSolutions Mechanics", url: "https://www.youtube.com/results?search_query=SUVAT+equations+mechanics+A+level+edexcel+M1", channel: "ExamSolutions" },
          { title: "Mechanics 1 Kinematics WME01 — Bicen Maths", url: "https://www.youtube.com/results?search_query=mechanics+1+kinematics+WME01+edexcel+IAL+bicen", channel: "Bicen Maths" }
        ]
      },
      {
        id: "m1c2", num: 2, title: "Dynamics of a Particle",
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
          { name: "Newton's Second Law", expr: "F_net = ma (net force = mass × acceleration)" },
          { name: "Weight", expr: "W = mg (downward, g=9.8 m/s²)" },
          { name: "Limiting Friction", expr: "F_friction = μN (when moving or at limiting equilibrium)" },
          { name: "Atwood Machine", expr: "For mass m₁ (falling): m₁g−T=m₁a; for m₂ (rising): T−m₂g=m₂a" },
          { name: "Solving for a (Atwood)", expr: "a=(m₁−m₂)g/(m₁+m₂) (Atwood machine)" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】未画自由体图（导致遗漏某个力，如忘记法向力N）；Newton第三定律错误理解——作用力与反作用力不作用在同一物体上，不能互相抵消；Atwood机中两物体加速度大小相同（通过同一轻绳连接），但方向相反；粗糙面问题中法向力N的方向计算错误（斜面时N≠mg）。建议：对每个物体独立画FBD，独立列方程，不要将多物体系统混在一起。",
        examTips: "动力学题目必须展示的步骤：① 自由体图；② 选取正方向；③ 对每个物体列F=ma方程；④ 联立方程求未知量；⑤ 若需位移/速度/时间，再用SUVAT方程。每步省略都可能失去方法分。",
        youtube: [
          { title: "M1 Newton's Laws Dynamics — TLMaths", url: "https://www.youtube.com/results?search_query=M1+Newton+laws+dynamics+F=ma+edexcel+IAL+mechanics", channel: "TLMaths" },
          { title: "Dynamics & Atwood Machine — ExamSolutions M1", url: "https://www.youtube.com/results?search_query=Atwood+machine+Newton+second+law+A+level+mechanics+edexcel", channel: "ExamSolutions" },
          { title: "M1 Dynamics Free Body Diagrams — Bicen Maths", url: "https://www.youtube.com/results?search_query=M1+dynamics+free+body+diagram+WME01+edexcel+IAL", channel: "Bicen Maths" }
        ]
      },
      {
        id: "m1c3", num: 3, title: "Forces & Equilibrium",
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
          { name: "Force Resolution (Horizontal)", expr: "Fₓ = F cosθ (θ is angle from horizontal)" },
          { name: "Force Resolution (Vertical)", expr: "Fᵧ = F sinθ" },
          { name: "Normal Reaction on Incline", expr: "N = mg cosθ (θ is angle of incline)" },
          { name: "Friction on Incline", expr: "F_friction = μN (equality holds at limiting equilibrium)" },
          { name: "Lami's Theorem", expr: "F₁/sin α₁ = F₂/sin α₂ = F₃/sin α₃ (three-force equilibrium)" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】斜面上重力分解角度弄错（应相对斜面方向，而非绝对水平/竖直）；摩擦力方向画错（应与运动方向或运动趋势方向相反）；临界平衡时F=μN（等号），而非F<μN；Lami定理中\"对面角\"的识别（每个力对应其对面的角，即另两个力夹角的补角的正弦）。建议：每道力学题先画受力分析图，用不同颜色标注不同类型的力。",
        examTips: "斜面问题标准步骤：① 画受力图（标注mg, N, F_friction, 和任何其他力）；② 建立坐标轴（沿斜面和垂直斜面）；③ 分解各力到两个轴上；④ 列平衡方程（两个方向各一个）；⑤ 联立求解。指定\"临界平衡\"或\"即将滑动\"时，F=μN是必要的第三个方程。",
        youtube: [
          { title: "M1 Forces Equilibrium Inclined Plane & Friction — TLMaths", url: "https://www.youtube.com/results?search_query=M1+forces+equilibrium+inclined+plane+friction+edexcel+IAL", channel: "TLMaths" },
          { title: "Resolving Forces & Lami's Theorem — ExamSolutions", url: "https://www.youtube.com/results?search_query=resolving+forces+equilibrium+Lami+theorem+A+level+mechanics", channel: "ExamSolutions" },
          { title: "M1 Statics Forces WME01 — Bicen Maths", url: "https://www.youtube.com/results?search_query=M1+statics+forces+WME01+edexcel+IAL+bicen+maths", channel: "Bicen Maths" }
        ]
      },
      {
        id: "m1c4", num: 4, title: "Moments",
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
          { name: "Moment", expr: "M = F × d (F is force, d is perpendicular distance to pivot)" },
          { name: "Moment Equilibrium", expr: "∑M_CW = ∑M_ACW (pivot point can be chosen freely)" },
          { name: "Centre of Gravity (Uniform Beam)", expr: "Weight mg acts at midpoint (L/2)" },
          { name: "Reaction Forces (Two Supports)", expr: "Take moments about A: R_B × L = mg × d (d = distance of CG from A)" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】取矩点选择不当（应选含未知反力的点，使未知量的力矩为零，简化方程）；力矩计算时使用的距离不是垂直距离（必须是力到转轴的垂直距离）；非均匀梁中重心位置读取错误；多支点题目中力矩方向（CW/ACW）判断错误导致符号错误。建议：每次取矩前先明确标注转动中心（红圈），再逐一计算每个力的力矩大小和方向。",
        examTips: "取矩策略：选择包含最多未知力的点作为转矩中心（这些未知力的力矩为零），使方程只含一个未知数。结合∑F=0方程，通常三个方程可解三个未知量。力矩题一定要标注力的方向（CW/ACW），正负号混淆是最常见的失分原因。",
        youtube: [
          { title: "M1 Moments Uniform Beam Equilibrium — TLMaths", url: "https://www.youtube.com/results?search_query=M1+moments+uniform+beam+equilibrium+edexcel+IAL+mechanics", channel: "TLMaths" },
          { title: "Principle of Moments — ExamSolutions A Level", url: "https://www.youtube.com/results?search_query=principle+of+moments+beam+A+level+mechanics+edexcel+M1", channel: "ExamSolutions" },
          { title: "M1 Moments WME01 — Bicen Maths", url: "https://www.youtube.com/results?search_query=moments+WME01+M1+edexcel+IAL+bicen+maths", channel: "Bicen Maths" }
        ]
      },
      {
        id: "m1c5", num: 5, title: "Work, Energy & Power",
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
          { name: "Work Done", expr: "W = Fd cosθ (θ is angle between force and displacement)" },
          { name: "Kinetic Energy", expr: "KE = ½mv²" },
          { name: "Gravitational PE", expr: "GPE = mgh" },
          { name: "Work-Energy Theorem", expr: "W_net = ΔKE = ½mv²−½mu²" },
          { name: "Power", expr: "P = Fv (at constant speed); P = W/t (average power)" },
          { name: "Energy Conservation (with Friction)", expr: "KE₁+PE₁ = KE₂+PE₂ + W_friction" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】功的计算中θ角的确定（是力与位移的夹角，不是与法向的夹角）；摩擦力做负功时符号出错（摩擦力做的功应从总能量中减去，而不是加）；功率题中速度v是瞬时速度而非平均速度；最大速度时忘记说明\"此时加速度为零\"（驱动力=总阻力的判断）。能量方法最大优势：不需要求加速度，一个能量方程直接联系速度与高度变化。",
        examTips: "面对运动题目：先判断是否能用能量方法（避免求加速度）。若题目给出高度变化和速度，优先用能量守恒。若题目涉及摩擦，用 初始能量 = 最终能量 + 摩擦力做的功（正值）。功率题永远记住：最大速度时加速度=0，驱动力=阻力，再用P=Fv求v。",
        youtube: [
          { title: "M1 Work Energy Power — TLMaths", url: "https://www.youtube.com/results?search_query=M1+work+energy+power+kinetic+potential+edexcel+IAL+mechanics", channel: "TLMaths" },
          { title: "Work-Energy Theorem Energy Conservation — ExamSolutions", url: "https://www.youtube.com/results?search_query=work+energy+theorem+conservation+A+level+mechanics+edexcel", channel: "ExamSolutions" },
          { title: "M1 Energy Methods WME01 — Bicen Maths", url: "https://www.youtube.com/results?search_query=energy+methods+WME01+M1+edexcel+IAL+bicen+maths", channel: "Bicen Maths" }
        ]
      },
      {
        id: "m1c6", num: 6, title: "Impulse & Momentum",
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
          { name: "Momentum", expr: "p = mv (vector! direction same as velocity)" },
          { name: "Impulse-Momentum Theorem", expr: "J = Ft = Δp = mv−mu" },
          { name: "Conservation of Momentum", expr: "m₁u₁+m₂u₂ = m₁v₁+m₂v₂ (zero net external force)" },
          { name: "Coefficient of Restitution", expr: "e = (v₂−v₁)/(u₁−u₂), 0≤e≤1" },
          { name: "Perfectly Inelastic", expr: "e=0 → v₁=v₂ (coalesce after collision)" }
        ],
        difficulty: "Intermediate",
        hardPoints: "【高频失分点】动量方向符号：必须统一选择正方向，反方向速度取负值；恢复系数公式中u₁和u₂的位置不能互换（e = 分离速度/接近速度，相对应的物体要一一对应）；斜碰中，平行于面的速度分量不变，只有法向分量受e影响；多次碰撞题中，第二次碰撞的初速度来自第一次碰撞的结果。",
        examTips: "碰撞题两个方程：① 动量守恒（m₁u₁+m₂u₂=m₁v₁+m₂v₂）；② 恢复系数（e=(v₂−v₁)/(u₁−u₂)）。统一正方向后，将所有已知速度代入，联立解v₁和v₂。结果中负号表示反方向运动，不代表错误。",
        youtube: [
          { title: "M1 Momentum Impulse Collisions — TLMaths", url: "https://www.youtube.com/results?search_query=M1+momentum+impulse+collision+coefficient+restitution+edexcel+IAL", channel: "TLMaths" },
          { title: "Coefficient of Restitution & Conservation of Momentum — ExamSolutions", url: "https://www.youtube.com/results?search_query=coefficient+restitution+momentum+conservation+A+level+mechanics", channel: "ExamSolutions" },
          { title: "Impulse Momentum WME01 — Bicen Maths", url: "https://www.youtube.com/results?search_query=impulse+momentum+WME01+M1+edexcel+IAL+bicen", channel: "Bicen Maths" }
        ]
      },
      {
        id: "m1c7", num: 7, title: "Projectile Motion",
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
          { name: "Horizontal Displacement", expr: "x = u cosθ × t (constant velocity)" },
          { name: "Vertical Displacement", expr: "y = u sinθ × t − ½gt²" },
          { name: "Maximum Height", expr: "H = (u sinθ)²/(2g) (when v_y=0)" },
          { name: "Horizontal Range", expr: "R = u²sin(2θ)/g (same launch and landing height)" },
          { name: "Trajectory Equation", expr: "y = x tanθ − gx²/(2u²cos²θ) (parabola)" }
        ],
        difficulty: "Advanced",
        hardPoints: "【高频失分点】求飞行时间时，使用y=0求解二次方程，但舍去t=0时（出发时刻），保留非零解；从高台或斜坡发射时射程公式R=u²sin2θ/g不适用，必须用联立方程求t；轨迹方程推导中，消去t后cos²θ出现在分母，需要sec²θ表达；着地角度忘记用arctan(v_y/v_x)而非arctan(v_y/u)。",
        examTips: "抛体题必须分成水平和竖直两个部分独立列方程，用时间t联系两部分。求轨迹方程时：由水平方程得t=x/(u cosθ)，代入竖直方程消去t。最后射程和最大高度公式仅适用于同高度发射-落地情形，其他情形一律从基本方程出发。",
        youtube: [
          { title: "M1 Projectile Motion — TLMaths", url: "https://www.youtube.com/results?search_query=M1+projectile+motion+edexcel+IAL+mechanics+A+level", channel: "TLMaths" },
          { title: "Projectile Motion Range Trajectory — ExamSolutions", url: "https://www.youtube.com/results?search_query=projectile+motion+range+trajectory+A+level+edexcel+M1", channel: "ExamSolutions" },
          { title: "M1 Projectiles WME01 — Bicen Maths", url: "https://www.youtube.com/results?search_query=projectile+motion+WME01+M1+edexcel+IAL+bicen+maths", channel: "Bicen Maths" }
        ]
      }
    ]
  }
};
