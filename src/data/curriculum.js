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
          { en: "Index Laws: aᵐ × aⁿ = aᵐ⁺ⁿ; aᵐ ÷ aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐⁿ" },
          { en: "Fractional Indices: a to the power of 1/m is the m-th root of a" },
          { en: "Negative Indices: a⁻ᵐ = 1 ÷ aᵐ" },
          { en: "Difference of Two Squares: x² - y² = (x + y)(x - y)" },
          { en: "Surd Multiplication: √(ab) = √a × √b" },
          { en: "Surd Division: √(a ÷ b) = √a ÷ √b" },
          { en: "Rationalising Denominators: Multiply numerator and denominator by a - √b for fractions containing a + √b" },
          { en: "Factorising Quadratics: Find factors of ac that sum to b to factorise ax² + bx + c" }
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
          { en: "Quadratic Equation Form: ax² + bx + c = 0 where a ≠ 0" },
          { en: "Quadratic Formula: x = (-b ± √(b² - 4ac)) ÷ 2a" },
          { en: "Completing the Square: x² + bx = (x + b/2)² - (b/2)²" },
          { en: "General Completed Square: ax² + bx + c = a(x + b/2a)² + (c - b²/4a)" },
          { en: "Turning Point: The minimum or maximum point of a quadratic graph y = a(x + p)² + q is at (-p, q)" },
          { en: "Discriminant: b² - 4ac determines the number of real roots of a quadratic equation" },
          { en: "Two Distinct Real Roots: b² - 4ac > 0" },
          { en: "One Repeated Root: b² - 4ac = 0" },
          { en: "No Real Roots: b² - 4ac < 0" }
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
          { en: "Linear Simultaneous Equations: Can be solved using the methods of elimination or substitution" },
          { en: "Quadratic Simultaneous Equations: Require substitution from the linear equation to the quadratic equation" },
          { en: "Graphical Intersections: Solutions to simultaneous equations represent the coordinates where their graphs intersect" },
          { en: "Linear Inequalities: Solved similarly to equations but the inequality sign reverses when multiplying or dividing by a negative number" },
          { en: "Quadratic Inequalities: Rearrange to f(x) > 0 or f(x) < 0, find critical values, and sketch the graph to deduce the solution set" },
          { en: "Curve Positions: The inequality f(x) < g(x) represents the x-values where the curve y = f(x) is below the curve y = g(x)" },
          { en: "Regions: The inequality y < f(x) represents the coordinate area strictly below the curve y = f(x)" },
          { en: "Solid vs Dotted Lines: Use a solid line for ≤ or ≥ and a dotted line for < or > when defining regions on a graph" }
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
          { en: "Cubic Graphs: f(x) = ax³ + bx² + cx + d has up to 3 roots and crosses the y-axis at the constant d" },
          { en: "Cubic Roots: If p is a root of f(x), then the graph of y = f(x) touches or crosses the x-axis at (p, 0)" },
          { en: "Reciprocal Graphs: y = a ÷ x has asymptotes at x = 0 and y = 0" },
          { en: "Inverse Square Graphs: y = a ÷ x² has asymptotes at x = 0 and y = 0 and the y-values are always positive if a > 0" },
          { en: "Vertical Translation: The transformation y = f(x) + a shifts the graph vertically by a units" },
          { en: "Horizontal Translation: The transformation y = f(x + a) shifts the graph horizontally by -a units" },
          { en: "Vertical Stretch: The transformation y = af(x) stretches the graph vertically by a scale factor of a" },
          { en: "Horizontal Stretch: The transformation y = f(ax) stretches the graph horizontally by a scale factor of 1/a" }
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
          { en: "Equation of a Line: y = mx + c where m is the gradient and c is the y-intercept" },
          { en: "Gradient Formula: m = (y₂ - y₁) ÷ (x₂ - x₁)" },
          { en: "Point-Gradient Equation: y - y₁ = m(x - x₁)" },
          { en: "General Form of a Line: ax + by + c = 0 where a, b, and c are integers" },
          { en: "Parallel Lines: Have identical gradients where m₁ = m₂" },
          { en: "Perpendicular Lines: Gradients multiply to -1 where m₁ × m₂ = -1" },
          { en: "Distance Between Points: d = √((x₂ - x₁)² + (y₂ - y₁)²)" },
          { en: "Midpoint Formula: M = ((x₁ + x₂) ÷ 2, (y₁ + y₂) ÷ 2)" }
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
          { en: "Cosine Rule (Side Length): a² = b² + c² - 2bc cos(A)" },
          { en: "Cosine Rule (Angle): cos(A) = (b² + c² - a²) ÷ 2bc" },
          { en: "Sine Rule: a ÷ sin(A) = b ÷ sin(B) = c ÷ sin(C)" },
          { en: "Area of a Triangle: Area = ½ab sin(C)" },
          { en: "Sine Graph: Period is 360°, ranges from -1 to 1, and passes through the origin" },
          { en: "Cosine Graph: Period is 360°, ranges from -1 to 1, and the y-intercept is 1" },
          { en: "Tangent Graph: Period is 180° with asymptotes at x = 90° ± 180°n" },
          { en: "Transforming Trigonometric Graphs: y = sin(x + θ) shifts the sine graph horizontally by -θ" }
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
          { en: "Radian Measure: 180° = π radians" },
          { en: "Radian Conversion: To convert degrees to radians, multiply by π ÷ 180" },
          { en: "Arc Length Formula: s = rθ where θ is measured in radians" },
          { en: "Sector Area Formula: A = ½r²θ where θ is measured in radians" },
          { en: "Segment Area: Area of a segment = ½r²(θ - sin(θ)) where θ is in radians" },
          { en: "Perimeter of a Sector: Perimeter = 2r + rθ where θ is in radians" },
          { en: "Area of a Triangle in Radians: Area = ½ab sin(C) applies directly when C is in radians" },
          { en: "Exact Trigonometric Values: Familiarity with exact radian values such as sin(π ÷ 6) = 1 ÷ 2 is required" }
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
          { en: "Gradient of a Curve: The gradient of a curve at a point is the gradient of the tangent to the curve at that point" },
          { en: "Power Rule: If y = xⁿ, then dy ÷ dx = nxⁿ⁻¹" },
          { en: "Constant Rule: The derivative of any constant value is 0" },
          { en: "Multiple Terms: Differentiate each term independently for expressions involving addition or subtraction" },
          { en: "Finding Gradients: Substitute the given x-value into the derivative f'(x) to evaluate the gradient at a specific point" },
          { en: "Equation of Tangent: y - y₁ = m(x - x₁) where the gradient m = f'(x₁)" },
          { en: "Equation of Normal: y - y₁ = (-1 ÷ m)(x - x₁) where the normal gradient is the negative reciprocal of f'(x₁)" },
          { en: "Second Order Derivatives: f''(x) or d²y ÷ dx² is obtained by differentiating the first derivative" }
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
          { en: "Indefinite Integration: Integration is the reverse of differentiation; ∫ f'(x) dx = f(x) + c" },
          { en: "Power Rule for Integration: ∫xⁿ dx = (xⁿ⁺¹ ÷ (n + 1)) + c, valid for all n ≠ -1" },
          { en: "Constant of Integration: Always include the constant + c for all indefinite integrals" },
          { en: "Multiple Terms: Integrate each term in a polynomial independently" },
          { en: "Constant Multiples: ∫kf(x) dx = k∫f(x) dx where k is a constant multiplier" },
          { en: "Finding the Function: If the derivative f'(x) is known, the original function is f(x) = ∫f'(x) dx" },
          { en: "Evaluating c: Substitute a given coordinate (x, y) on the curve into the integrated equation to solve for the constant of integration" },
          { en: "Fractional Powers: Convert all roots and reciprocal terms to fractional or negative indices before integrating" }
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
          { en: "Polynomial Division: Divide f(x) by (x - a) using algebraic long division" },
          { en: "The Remainder Theorem: The remainder when f(x) is divided by (ax - b) is f(b/a)" },
          { en: "The Factor Theorem: (x - a) is a factor of f(x) if and only if f(a) = 0" },
          { en: "Factorising Cubics: Find one root using the factor theorem, then divide to find the quadratic factor" },
          { en: "Algebraic Fractions: Simplify by fully factorising the numerator and denominator then cancelling common factors" },
          { en: "Mathematical Proof: A logical and structured argument to show that a mathematical statement is always true" },
          { en: "Proof by Deduction: Starting from known facts and using logical steps to reach the desired conclusion" },
          { en: "Proof by Exhaustion: Proving a statement by testing every possible case within a restricted set" },
          { en: "Disproof by Counter-example: Finding a single case where a statement is false to prove it is not always true" }
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
          { en: "Equation of a Circle (Origin Centre): x² + y² = r² where r is the radius" },
          { en: "Equation of a Circle (General Centre): (x - a)² + (y - b)² = r² where centre is (a, b)" },
          { en: "Expanded Circle Equation: x² + y² + 2fx + 2gy + c = 0 with centre (-f, -g) and radius √(f² + g² - c)" },
          { en: "Finding Centre and Radius: Complete the square for x and y terms to convert to (x - a)² + (y - b)² = r² form" },
          { en: "Circle Intersection with a Line: Substitute the line equation into the circle equation and solve the resulting quadratic" },
          { en: "Tangent to a Circle: A line that intersects the circle at exactly one point, finding where discriminant Δ = 0" },
          { en: "Tangent and Radius Property: The tangent to a circle is perpendicular to the radius at the point of intersection" },
          { en: "Perpendicular Bisector of a Chord: The perpendicular bisector of any chord always passes through the centre of the circle" },
          { en: "Angle in a Semicircle: The angle subtended by a diameter at the circumference is always 90°" }
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
          { en: "Exponential Function: Graphs of y = aˣ always pass through (0, 1) and have an asymptote at y = 0" },
          { en: "Logarithm Definition: logₐn = x is equivalent to aˣ = n" },
          { en: "Multiplication Law: logₐx + logₐy = logₐ(xy)" },
          { en: "Division Law: logₐx - logₐy = logₐ(x/y)" },
          { en: "Power Law: logₐ(xᵏ) = k logₐx" },
          { en: "Special Logarithm Values: logₐa = 1 and logₐ1 = 0" },
          { en: "Logarithm of a Reciprocal: logₐ(1/x) = -logₐx" },
          { en: "Change of Base Formula: logₐx = (logₙx) / (logₙa)" },
          { en: "Solving Exponential Equations: Take logs of both sides to solve equations like aˣ = b" }
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
          { en: "Pascal's Triangle: Generates the coefficients for the expansion of (a + b)ⁿ" },
          { en: "Factorial Notation: n! = n × (n - 1) × (n - 2) × ... × 1, where 0! = 1" },
          { en: "Combinations Formula: ⁿCᵣ = n! / (r!(n - r)!) representing the number of ways to choose r items from n" },
          { en: "Binomial Theorem: (a + b)ⁿ = aⁿ + ⁿC₁aⁿ⁻¹b + ⁿC₂aⁿ⁻²b² + ... + bⁿ" },
          { en: "General Term of Expansion: The (r+1)th term is given by ⁿCᵣ aⁿ⁻ʳ bʳ" },
          { en: "Expansion of (1 + x)ⁿ: 1 + nx + n(n-1)x²/2! + n(n-1)(n-2)x³/3! + ..." },
          { en: "Using Approximations: Substitute a small value of x into the first few terms of the expansion" },
          { en: "Coefficient Extraction: Find the specific constant multiplying a given power of x in an expansion" }
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
          { en: "Arithmetic Sequence: The nth term is given by uₙ = a + (n - 1)d, where a is first term and d is common difference" },
          { en: "Sum of an Arithmetic Series (Formula 1): Sₙ = n/2 (2a + (n - 1)d)" },
          { en: "Sum of an Arithmetic Series (Formula 2): Sₙ = n/2 (a + L), where L is the last term" },
          { en: "Geometric Sequence: The nth term is given by uₙ = arⁿ⁻¹, where a is first term and r is common ratio" },
          { en: "Sum of a Geometric Series: Sₙ = a(1 - rⁿ) / (1 - r) or Sₙ = a(rⁿ - 1) / (r - 1)" },
          { en: "Sum to Infinity of a Geometric Series: S∞ = a / (1 - r), valid only when -1 < r < 1" },
          { en: "Sigma Notation: Σ represents the sum of a sequence of terms from a lower limit to an upper limit" },
          { en: "Recurrence Relations: A sequence defined by expressing the next term as a function of the previous term uₙ₊₁ = f(uₙ)" },
          { en: "Increasing and Decreasing Sequences: uₙ₊₁ > uₙ for an increasing sequence, and uₙ₊₁ < uₙ for a decreasing sequence" },
          { en: "Periodic Sequences: A sequence that repeats its terms after a certain interval k, so uₙ₊ₖ = uₙ" }
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
          { en: "Tangent Identity: tanθ ≡ sinθ / cosθ" },
          { en: "Pythagorean Identity: sin²θ + cos²θ ≡ 1" },
          { en: "Equivalent Pythagorean Forms: sin²θ ≡ 1 - cos²θ and cos²θ ≡ 1 - sin²θ" },
          { en: "CAST Diagram: Identifies which trigonometric ratios are positive in each of the four quadrants" },
          { en: "Principal Value: The primary solution given by a calculator in the standard range" },
          { en: "Solving Trigonometric Equations: Find the principal value, then use symmetry and periodicity to find other solutions in the interval" },
          { en: "Period of Sine and Cosine: Solutions repeat every 360°, so sinθ = sin(θ ± 360°)" },
          { en: "Period of Tangent: Solutions repeat every 180°, so tanθ = tan(θ ± 180°)" },
          { en: "Quadratic Trigonometric Equations: Substitute an identity to form a quadratic equation entirely in sine or entirely in cosine" }
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
          { en: "Increasing Functions: A function is increasing on an interval if f'(x) ≥ 0 for all x in that interval" },
          { en: "Decreasing Functions: A function is decreasing on an interval if f'(x) ≤ 0 for all x in that interval" },
          { en: "Stationary Points: Points on a curve where the gradient is zero, found by solving f'(x) = 0" },
          { en: "Second Derivative Test: Determines the nature of a stationary point using f''(x)" },
          { en: "Local Maximum: At a stationary point, if f''(x) < 0, the point is a local maximum" },
          { en: "Local Minimum: At a stationary point, if f''(x) > 0, the point is a local minimum" },
          { en: "Point of Inflection: A stationary point where the gradient does not change sign" },
          { en: "Curve Sketching: Use intercepts, stationary points, and asymptotic behaviour to sketch a function" },
          { en: "Optimisation Problems: Form an equation for the quantity to be maximised or minimised, and find where its derivative is zero" }
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
          { en: "Definite Integral: Evaluates the net area under a curve between limits a and b, written as ∫[a,b] f(x) dx = F(b) - F(a)" },
          { en: "Area Above the x-axis: The definite integral evaluation gives a positive value" },
          { en: "Area Below the x-axis: The definite integral gives a negative value, so take the absolute value for the physical area" },
          { en: "Total Area: For curves crossing the x-axis, calculate integrals for sections separately and add their absolute values" },
          { en: "Area Between a Curve and a Line: Find intersections, then calculate ∫ (Upper - Lower) dx" },
          { en: "Area Between Two Curves: Evaluate the integral of the upper curve minus the lower curve between their intersection points" },
          { en: "The Trapezium Rule: Estimates area under a curve as ≈ ½h [ (y₀ + yₙ) + 2(y₁ + y₂ + ... + yₙ₋₁) ]" },
          { en: "Trapezium Rule Strip Width: h = (b - a) / n, where n is the number of strips" },
          { en: "Accuracy of Trapezium Rule: Overestimates for convex curves and underestimates for concave curves" }
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
          { en: "Mathematical Model: A simplified mathematical representation of a real-world situation" },
          { en: "Modelling Process Step 1: Recognise a real-world problem and state objectives" },
          { en: "Modelling Process Step 2: Make assumptions to simplify the problem" },
          { en: "Modelling Process Step 3: Formulate a mathematical model based on the variables" },
          { en: "Modelling Process Step 4: Use the model to make predictions" },
          { en: "Modelling Process Step 5: Collect experimental data and compare with predictions" },
          { en: "Modelling Process Step 6: Refine the model if predictions do not match observed data" },
          { en: "Advantages of Models: Quick, cheap, easily adaptable, and avoid ethical or practical issues of real experiments" }
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
          { en: "Mean: x̄ = Σx / n for raw data, or x̄ = Σfx / Σf for frequency distributions" },
          { en: "Median: The middle value when data is ordered, giving the 50th percentile (Q2)" },
          { en: "Mode: The most frequently occurring value or class in the data set" },
          { en: "Range: The difference between the highest and lowest values" },
          { en: "Lower Quartile (Q1): The value at the 25th percentile of ordered data" },
          { en: "Upper Quartile (Q3): The value at the 75th percentile of ordered data" },
          { en: "Interquartile Range (IQR): IQR = Q3 - Q1, measuring the spread of the middle 50% of data" },
          { en: "Variance (σ²): The mean of the squares minus the square of the mean: σ² = (Σx² / n) - x̄²" },
          { en: "Standard Deviation (σ): The square root of variance, measuring average deviation from the mean" },
          { en: "Linear Coding: If y = (x - a) / b, then mean ȳ = (x̄ - a) / b and standard deviation σ_y = σ_x / b" }
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
          { en: "Outliers: Extreme values typically defined as > Q3 + 1.5×IQR or < Q1 - 1.5×IQR" },
          { en: "Box Plot: A visual diagram showing the minimum, Q1, median, Q3, maximum, and outliers" },
          { en: "Histogram: A chart for continuous data where the area of the bar represents frequency" },
          { en: "Frequency Density: Used for histogram y-axis, calculated as Frequency / Class Width" },
          { en: "Cumulative Frequency: A running total of frequencies, always plotted at the upper class boundary" },
          { en: "Symmetrical Distribution: Mean = Median = Mode, and Q3 - Q2 = Q2 - Q1" },
          { en: "Positive Skew: Mean > Median > Mode, and Q3 - Q2 > Q2 - Q1 (tail points right)" },
          { en: "Negative Skew: Mean < Median < Mode, and Q2 - Q1 > Q3 - Q2 (tail points left)" },
          { en: "Stem and Leaf Diagram: Displays the shape of a distribution while retaining original raw data values" },
          { en: "Comparing Distributions: Always compare one measure of location (e.g., median) and one measure of spread (e.g., IQR)" }
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
          { en: "Probability Range: For any event A, 0 ≤ P(A) ≤ 1" },
          { en: "Complementary Event: The probability of an event not happening is P(A') = 1 - P(A)" },
          { en: "Addition Rule: P(A ∪ B) = P(A) + P(B) - P(A ∩ B)" },
          { en: "Mutually Exclusive Events: Events that cannot happen together, where P(A ∩ B) = 0" },
          { en: "Independent Events: The occurrence of one event does not affect the other, where P(A ∩ B) = P(A) × P(B)" },
          { en: "Conditional Probability: The probability of A given B has occurred is P(A | B) = P(A ∩ B) / P(B)" },
          { en: "Tree Diagrams: Used for sequential events; multiply probabilities along branches to find intersections" },
          { en: "Venn Diagrams: Visual representations of sets used to calculate unions, intersections, and conditional probabilities" },
          { en: "Sum of Exhaustive Events: The sum of probabilities of all mutually exclusive and exhaustive outcomes is 1" }
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
          { en: "Scatter Diagram: A graph to visualize the relationship between two variables (x and y)" },
          { en: "Explanatory Variable (x): The independent variable plotted on the horizontal axis" },
          { en: "Response Variable (y): The dependent variable plotted on the vertical axis" },
          { en: "PMCC (r): Product Moment Correlation Coefficient measures linear strength, where -1 ≤ r ≤ 1" },
          { en: "Causation: A strong correlation (r close to 1 or -1) does not automatically imply that one variable causes the other" },
          { en: "Regression Line of y on x: Equation y = a + bx used to estimate y for a given x" },
          { en: "Gradient (b): Represents the predicted change in the response variable y for a 1-unit increase in x" },
          { en: "Intercept (a): Represents the predicted value of y when x = 0" },
          { en: "Interpolation: Making a prediction within the range of the given data (generally reliable)" },
          { en: "Extrapolation: Making a prediction outside the range of the given data (unreliable)" }
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
        overview: "离散随机变量（DRV）建立了从概率到期望、方差的数学框架，是S1中连接概率论与统计推断的核心桥梁。期望E(X)和方差Var(X)的计算，以及线性变换 Y=aX+b 对它们的影响，是高频考点。注意：二项分布 B(n,p) 属于 S2 (WST02)，S1 不考。（Binomial Distribution B(n,p) belongs to S2, not S1.）",
        keyPoints: [
          { en: "Discrete Random Variable: A variable X that can only take specific, distinct values with associated probabilities" },
          { en: "Probability Distribution: A table or formula showing all possible outcomes of X and their probabilities, where Σ P(X=x) = 1" },
          { en: "Discrete Uniform Distribution: All possible values of X have an equal probability of occurring" },
          { en: "Expected Value (Mean): E(X) = μ = Σ x P(X=x)" },
          { en: "Expected Value of a Function: E(g(X)) = Σ g(x) P(X=x)" },
          { en: "Variance: Var(X) = σ² = E(X²) - (E(X))²" },
          { en: "Linear Transformation of Mean: E(aX + b) = aE(X) + b" },
          { en: "Linear Transformation of Variance: Var(aX + b) = a²Var(X)" },
          { en: "Cumulative Distribution Function: F(x) = P(X ≤ x), representing the running total of probabilities" }
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
          { en: "Normal Distribution: A continuous, bell-shaped, symmetrical distribution denoted by X ~ N(μ, σ²)" },
          { en: "Properties: Symmetrical about the mean, so Mean = Median = Mode, and the total area under the curve is 1" },
          { en: "Standard Normal Distribution: Denoted by Z ~ N(0, 1) with mean 0 and variance 1" },
          { en: "Standardisation Formula: Converts any normal variable to a standard normal variable using Z = (X - μ) / σ" },
          { en: "Using Tables: The statistical tables provide Φ(z) = P(Z < z) for positive values of z" },
          { en: "Symmetry Rule: For negative values, use the symmetry property P(Z < -z) = 1 - P(Z < z)" },
          { en: "Inverse Normal: Using the probability area to read backwards from the tables to find the corresponding z-value" },
          { en: "Percentage Points: Approximately 68% of data lies within μ ± σ, 95% within μ ± 2σ, and 99.7% within μ ± 3σ" },
          { en: "Finding Unknown Parameters: Form simultaneous linear equations using Z = (X - μ) / σ to find unknown μ or σ" }
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
          { en: "Simplifying Algebraic Fractions: Factorise numerator and denominator fully, then cancel common factors" },
          { en: "Improper Algebraic Fractions: Use algebraic long division so the degree of numerator < degree of denominator" },
          { en: "Partial Fractions (Distinct Linear Factors): Split into the form A/(x-a) + B/(x-b)" },
          { en: "Partial Fractions (Repeated Linear Factors): Split into the form A/(x-a) + B/(x-a)² + C/(x-b)" },
          { en: "Finding Constants in Partial Fractions: Substitute suitable values of x to eliminate terms and solve" },
          { en: "Equating Coefficients: Expand the identity and equate coefficients of corresponding powers of x" },
          { en: "Remainder Theorem: When polynomial f(x) is divided by (ax-b), the remainder is f(b/a)" },
          { en: "Factor Theorem: If f(a) = 0, then (x-a) is a factor of the polynomial f(x)" }
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
          { en: "Mappings and Functions: A mapping is a function only if every valid input has exactly one output" },
          { en: "Domain and Range: Domain is the set of all inputs x, Range is the set of all outputs f(x)" },
          { en: "Composite Functions: fg(x) means apply function g first, then apply function f to the result" },
          { en: "Inverse Functions: f⁻¹(x) exists if and only if f(x) is a one-to-one function" },
          { en: "Finding Inverses: Swap x and y in the equation, then rearrange to make y the subject" },
          { en: "Graph of Inverse: The graph of y = f⁻¹(x) is a reflection of y = f(x) in the line y = x" },
          { en: "Modulus Function: |x| = x for x ≥ 0, and |x| = -x for x < 0" },
          { en: "Graph of y = |f(x)|: Reflect any parts of the curve below the x-axis upwards in the x-axis" },
          { en: "Graph of y = f(|x|): Erase the left side of the y-axis, then reflect the right side in the y-axis" },
          { en: "Solving Modulus Equations: Isolate the modulus expression, then split into positive and negative cases" }
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
          { en: "Secant Function: sec θ = 1 / cos θ" },
          { en: "Cosecant Function: cosec θ = 1 / sin θ" },
          { en: "Cotangent Function: cot θ = 1 / tan θ = cos θ / sin θ" },
          { en: "Pythagorean Identities: 1 + tan²θ ≡ sec²θ and 1 + cot²θ ≡ cosec²θ" },
          { en: "Addition Formula (Sine): sin(A ± B) = sin A cos B ± cos A sin B" },
          { en: "Addition Formula (Cosine): cos(A ± B) = cos A cos B ∓ sin A sin B" },
          { en: "Addition Formula (Tangent): tan(A ± B) = (tan A ± tan B) / (1 ∓ tan A tan B)" },
          { en: "Double Angle (Sine): sin 2A = 2 sin A cos A" },
          { en: "Double Angle (Cosine): cos 2A = cos²A - sin²A = 2cos²A - 1 = 1 - 2sin²A" },
          { en: "R-alpha Form: a cos θ ± b sin θ = R cos(θ ∓ α) where R = √(a² + b²) and tan α = b/a" }
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
          { en: "Derivative of Natural Exponential: d/dx(eˣ) = eˣ" },
          { en: "Derivative of Scaled Exponential: d/dx(eᵏˣ) = k eᵏˣ" },
          { en: "Derivative of Natural Logarithm: d/dx(ln x) = 1/x" },
          { en: "Derivative of General Base: d/dx(aˣ) = aˣ ln a" },
          { en: "Exponential Growth Model: N = A eᵏᵗ where k > 0 models an increasing population" },
          { en: "Exponential Decay Model: N = A e⁻ᵏᵗ where k > 0 models a decreasing quantity" },
          { en: "Log-linear Graphs: Plotting ln y against t for y = A eᵏᵗ produces a straight line with gradient k" },
          { en: "Log-log Graphs: Plotting log y against log x for y = A xⁿ produces a straight line with gradient n" }
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
        overview: "P3微分章节是A-Level微积分的顶峰，引入链式法则（Chain Rule）、乘积法则（Product Rule）、商法则（Quotient Rule）、隐函数微分（Implicit Differentiation），以及所有三角函数的求导。这些工具使得几乎任意复杂函数都能被微分，是WMA13中分值最高的单一章节（约20分）。注意：参数方程微分（Parametric Differentiation）属于 P4 (WMA14)，不在 P3 范围内。",
        keyPoints: [
          { en: "Chain Rule: dy/dx = (dy/du) × (du/dx) used for composite functions" },
          { en: "Product Rule: d/dx(uv) = u(dv/dx) + v(du/dx) used for multiplied functions" },
          { en: "Quotient Rule: d/dx(u/v) = (v(du/dx) - u(dv/dx)) / v² used for divided functions" },
          { en: "Differentiating Sine: d/dx(sin kx) = k cos kx" },
          { en: "Differentiating Cosine: d/dx(cos kx) = -k sin kx" },
          { en: "Differentiating Tangent: d/dx(tan kx) = k sec²(kx)" },
          { en: "Differentiating Secant: d/dx(sec x) = sec x tan x" },
          { en: "Differentiating Cosecant: d/dx(cosec x) = -cosec x cot x" },
          { en: "Differentiating Cotangent: d/dx(cot x) = -cosec²x" },
          { en: "Implicit Differentiation: Differentiate y terms with respect to y, then multiply by dy/dx" }
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
          { en: "Integrating Exponentials: ∫ eᵏˣ dx = (1/k)eᵏˣ + C" },
          { en: "Integrating Reciprocals: ∫ (1/x) dx = ln|x| + C" },
          { en: "Integrating Fractions f'/f: ∫ (f'(x)/f(x)) dx = ln|f(x)| + C" },
          { en: "Integrating Sine: ∫ sin kx dx = -(1/k)cos kx + C" },
          { en: "Integrating Cosine: ∫ cos kx dx = (1/k)sin kx + C" },
          { en: "Integrating Secant Squared: ∫ sec²kx dx = (1/k)tan kx + C" },
          { en: "Integration by Substitution: Replace x with u to simplify the integral, remembering to convert dx to du" },
          { en: "Integration by Parts: ∫ u (dv/dx) dx = uv - ∫ v (du/dx) dx" },
          { en: "Volume of Revolution (x-axis): V = π ∫ y² dx evaluated between limits a and b" },
          { en: "Volume of Revolution (y-axis): V = π ∫ x² dy evaluated between limits c and d" },
          { en: "Integrating Tangent: ∫ tan x dx = ln|sec x| + C, derived using the f'(x)/f(x) pattern with f(x) = cos x" },
          { en: "Integrating with Trigonometric Identities: Use sin²x = ½(1 - cos 2x) and cos²x = ½(1 + cos 2x) to reduce powers before integrating" },
          { en: "Integration using Partial Fractions: Decompose the integrand into partial fractions first, then integrate each term separately" }
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
          { en: "Position Vector: A vector from the origin O to a point A, denoted as a or OA" },
          { en: "Vector Magnitude: Length of vector a = xi + yj + zk is |a| = √(x² + y² + z²)" },
          { en: "Unit Vector: A vector of length 1 in the direction of a, calculated as a / |a|" },
          { en: "Vector Equation of a Line: r = a + λb where a is a position vector and b is a direction vector" },
          { en: "Parallel Lines: Two lines are parallel if their direction vectors are scalar multiples of each other" },
          { en: "Intersecting Lines: Found by equating the r vectors of two lines and solving for scalars λ and μ" },
          { en: "Skew Lines: Lines in 3D space that are neither parallel nor intersect" },
          { en: "Dot Product (Scalar Product): a · b = a₁b₁ + a₂b₂ + a₃b₃" },
          { en: "Angle Between Vectors: Calculated using cos θ = (a · b) / (|a| |b|)" },
          { en: "Perpendicular Vectors: Two non-zero vectors are perpendicular if their dot product a · b = 0" }
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
          { en: "Formulating Differential Equations: Express a contextual rate of change mathematically using dy/dt or dx/dt" },
          { en: "Direct Integration: If dy/dx = f(x), then the solution is y = ∫ f(x) dx" },
          { en: "Separation of Variables: Rearrange dy/dx = f(x)g(y) to the form ∫ (1/g(y)) dy = ∫ f(x) dx" },
          { en: "General Solution: The integrated equation containing an arbitrary constant of integration + C" },
          { en: "Particular Solution: Found by substituting boundary or initial conditions into the general solution to evaluate C" },
          { en: "Proportional Rates: 'Rate of growth is proportional to y' translates to dy/dt = ky" },
          { en: "Newton's Law of Cooling: Rate of temperature change is proportional to difference with surroundings: dT/dt = -k(T - T₀)" },
          { en: "Connected Rates of Change: Use the chain rule to link related variables, e.g., dy/dt = (dy/dx) × (dx/dt)" }
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
          { en: "Basis Case: Show the statement is true for the first value, usually n = 1" },
          { en: "Inductive Hypothesis: Assume the statement is true for n = k" },
          { en: "Inductive Step: Show that if it is true for n = k, it must also be true for n = k + 1" },
          { en: "Conclusion Statement: Conclude the statement is true for all n ∈ ℤ⁺ by mathematical induction" },
          { en: "Series Induction: Prove Σ f(r) = S(n) by showing S(k) + f(k+1) = S(k+1)" },
          { en: "Divisibility Induction: Prove f(n) is divisible by d by showing f(k+1) - f(k) = md" },
          { en: "Matrix Induction: Prove Mⁿ = A by showing Mᵏ × M = Mᵏ⁺¹" },
          { en: "Inequality Induction: Prove f(n) > g(n) by manipulating f(k+1) using the assumption f(k) > g(k)" }
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
        overview: "复数将实数扩展至二维复平面（Argand Diagram），赋予每个实数方程（包括无实数解的方程）完整的解集。P4涵盖复数的四则运算、共轭、模和辐角（Modulus-Argument Form）、以及复数轨迹（Loci）。\"复数的轨迹（Loci）\"是P4考试中最具综合性的题型——用复数不等式描述Argand图中的几何区域。注意：De Moivre 定理属于 FP2 (WFM02)，不在 P4 范围内。（De Moivre's theorem belongs to FP2 (WFM02), not P4.）",
        keyPoints: [
          { en: "Imaginary Unit: i = √(-1) and i² = -1" },
          { en: "Complex Number Form: z = x + iy, where x is the real part and y is the imaginary part" },
          { en: "Complex Conjugate: The conjugate of z = x + iy is z* = x - iy" },
          { en: "Modulus: |z| = √(x² + y²), representing the distance from the origin on an Argand diagram" },
          { en: "Argument: arg(z) = θ, the angle made with the positive real axis, where -π < θ ≤ π" },
          { en: "Modulus-Argument Form: z = r(cos θ + i sin θ), where r = |z|" },
          { en: "Multiplication in Polar: r₁(cos θ₁ + i sin θ₁) × r₂(cos θ₂ + i sin θ₂) = r₁r₂(cos(θ₁ + θ₂) + i sin(θ₁ + θ₂))" },
          { en: "Division in Polar: (r₁/r₂)(cos(θ₁ - θ₂) + i sin(θ₁ - θ₂))" },
          { en: "Locus of a Circle: |z - z₁| = r represents a circle with centre z₁ and radius r" },
          { en: "Perpendicular Bisector Locus: |z - z₁| = |z - z₂| is the perpendicular bisector of the line joining z₁ and z₂" }
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
        overview: "矩阵将多变量线性方程组的操作代数化，是现代数学、计算机图形学和量化金融的基础工具。P4涵盖2×2矩阵的运算、行列式、逆矩阵、以及矩阵代表几何变换（旋转、反射、放大）的理解。利用矩阵解方程组（Inverse Method）是高频考点，矩阵的不可逆性（奇异矩阵）与方程组无唯一解紧密相关。注意：3×3矩阵属于 FP3 (WFM03)，不在 P4 范围内。（P4 covers 2×2 matrices only. 3×3 matrices belong to FP3 (WFM03).）",
        keyPoints: [
          { en: "Matrix Addition and Subtraction: Matrices must have the same dimensions to add or subtract corresponding elements" },
          { en: "Matrix Multiplication: Multiply rows of the first matrix by columns of the second; AB is not necessarily equal to BA" },
          { en: "Identity Matrix: A square matrix I with 1s on the main diagonal and 0s elsewhere, where MI = IM = M" },
          { en: "Determinant of 2×2: For M = (a b; c d), det(M) = ad - bc" },
          { en: "Inverse of 2×2: M⁻¹ = (1/det(M)) × (d -b; -c a)" },
          { en: "Singular Matrix: A matrix with det(M) = 0, meaning it has no inverse" },
          { en: "Linear Transformations: A matrix maps a position vector (x, y) to a new position (x', y')" },
          { en: "Rotation Matrix: Represents anticlockwise rotation by θ about the origin: (cos θ, -sin θ; sin θ, cos θ)" },
          { en: "Successive Transformations: Applying transformation M₁ then M₂ is given by the matrix product M₂M₁" },
          { en: "Area Scale Factor: The absolute value of the determinant |det(M)| gives the area scale factor of the transformation" }
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
          { en: "Vector Equation of a Line: r = a + t d, where a is a position vector and d is the direction vector" },
          { en: "Scalar Dot Product: a · b = a₁b₁ + a₂b₂ + a₃b₃ = |a||b|cos θ" },
          { en: "Perpendicular Vectors: Two non-zero vectors a and b are perpendicular if a · b = 0" },
          { en: "Vector Cross Product: a × b = (|a||b|sin θ)n̂, producing a vector perpendicular to both a and b" },
          { en: "Area of a Triangle: Area = ½ |a × b| where a and b are vectors forming adjacent sides" },
          { en: "Scalar Triple Product: a · (b × c) calculates the volume of a parallelepiped" },
          { en: "Vector Equation of a Plane: r · n = a · n = d, where n is a normal vector to the plane" },
          { en: "Cartesian Equation of a Plane: n₁x + n₂y + n₃z = d, where (n₁, n₂, n₃) is the normal vector" },
          { en: "Angle Between Two Planes: Found using the dot product of their normal vectors: cos θ = |n₁ · n₂| / (|n₁||n₂|)" },
          { en: "Shortest Distance from Origin to Plane: Distance = |d| / |n| for the plane r · n = d" }
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
          { en: "Definition of sinh x: sinh x = (eˣ - e⁻ˣ) / 2" },
          { en: "Definition of cosh x: cosh x = (eˣ + e⁻ˣ) / 2" },
          { en: "Definition of tanh x: tanh x = sinh x / cosh x = (eˣ - e⁻ˣ) / (eˣ + e⁻ˣ)" },
          { en: "Fundamental Identity: cosh²x - sinh²x = 1" },
          { en: "Secondary Identity: 1 - tanh²x = sech²x" },
          { en: "Osborn's Rule: Replace trigonometric functions with hyperbolic ones, but change the sign of any product of two sines" },
          { en: "Derivative of sinh x: d/dx(sinh x) = cosh x" },
          { en: "Derivative of cosh x: d/dx(cosh x) = sinh x" },
          { en: "Inverse Hyperbolic Functions: arsinh x = ln(x + √(x² + 1))" },
          { en: "Solving Hyperbolic Equations: Convert sinh x and cosh x to exponential forms to form a quadratic in eˣ" }
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
          { en: "Polar Coordinate System: Points are defined by (r, θ), where r is the distance from the pole and θ is the angle from the initial line" },
          { en: "Conversion to Cartesian: x = r cos θ and y = r sin θ" },
          { en: "Conversion from Cartesian: r = √(x² + y²) and tan θ = y / x" },
          { en: "Area of a Polar Sector: Area = ½ ∫ r² dθ between limits α and β" },
          { en: "Symmetry about Initial Line: If r(θ) = r(-θ), the curve is symmetrical about the initial line (x-axis)" },
          { en: "Symmetry about Pole: If r(θ) = r(π + θ), the curve has half-turn symmetry about the origin" },
          { en: "Tangents Parallel to Initial Line: Occur where dy/dθ = 0, using y = r sin θ" },
          { en: "Tangents Perpendicular to Initial Line: Occur where dx/dθ = 0, using x = r cos θ" },
          { en: "Intersections of Polar Curves: Set r₁ = r₂ and solve for θ within the given interval" }
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
          { en: "Maclaurin Series Expansion: f(x) = f(0) + x f'(0) + (x²/2!)f''(0) + (x³/3!)f'''(0) + ..." },
          { en: "Series Expansion Validity: The range of values of x for which the infinite series converges to the function" },
          { en: "Standard Expansions: Use known Maclaurin series for eˣ, sin x, cos x, and ln(1+x) to form composite series" },
          { en: "Improper Integrals (Infinite Limits): Evaluate ∫ f(x) dx to ∞ by taking the limit as upper bound approaches ∞" },
          { en: "Improper Integrals (Asymptotes): Evaluate by taking the limit as the bound approaches the undefined value" },
          { en: "Integration by Substitution: Let u = g(x), replace dx with (dx/du)du, and adjust the limits" },
          { en: "Volume of Revolution (Parametric): V = π ∫ y² (dx/dt) dt" },
          { en: "Mean Value of a Function: Mean = (1 / (b - a)) ∫ f(x) dx from a to b" }
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
          { en: "General Form: a(d²y/dx²) + b(dy/dx) + cy = f(x)" },
          { en: "Auxiliary Equation: Form the quadratic am² + bm + c = 0 to find the Complementary Function (CF)" },
          { en: "CF for Two Real Roots (m₁, m₂): y = A e^(m₁x) + B e^(m₂x)" },
          { en: "CF for One Repeated Root (m): y = (A + Bx) e^(mx)" },
          { en: "CF for Complex Roots (p ± qi): y = e^(px) (A cos qx + B sin qx)" },
          { en: "Particular Integral (PI): A specific trial function representing the non-homogeneous part f(x)" },
          { en: "PI for Polynomial f(x): Use a trial function of the same degree, e.g., y = λx² + μx + ν" },
          { en: "PI for Exponential f(x) = k e^(nx): Try y = λ e^(nx), unless n is a root of the auxiliary equation" },
          { en: "PI for Trigonometric f(x): Try y = λ cos ωx + μ sin ωx" },
          { en: "General Solution: Combine the Complementary Function and Particular Integral: y = CF + PI" }
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
          { en: "Particle Model: Mass is concentrated at a single point, rotational forces and air resistance are ignored" },
          { en: "Displacement: s = average velocity × time = ½(u + v)t" },
          { en: "Constant Acceleration (Velocity): v = u + at" },
          { en: "Constant Acceleration (Displacement 1): s = ut + ½at²" },
          { en: "Constant Acceleration (Displacement 2): s = vt - ½at²" },
          { en: "Constant Acceleration (Velocity Squared): v² = u² + 2as" },
          { en: "Velocity-Time Graphs: Gradient represents acceleration, area under the graph represents displacement" },
          { en: "Displacement-Time Graphs: Gradient represents velocity" }
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
          { en: "Newton's First Law: A particle remains at rest or moves with constant velocity unless acted upon by a resultant force" },
          { en: "Newton's Second Law: Resultant Force = mass × acceleration (F = ma)" },
          { en: "Newton's Third Law: For every action, there is an equal and opposite reaction" },
          { en: "Weight: The gravitational force acting on a mass, W = mg" },
          { en: "Normal Reaction: The force acting perpendicular to a surface when an object is in contact with it" },
          { en: "Connected Particles: Particles connected by a taut string share the same tension and magnitude of acceleration" },
          { en: "Pulleys: A smooth, light pulley ensures tension is constant throughout the string" },
          { en: "Resolving Forces: F_x = F cos θ and F_y = F sin θ for a force F at angle θ to the horizontal" }
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
          { en: "Equilibrium Condition: The vector sum of all forces acting on a particle is zero" },
          { en: "Limiting Equilibrium: The point at which a particle is just about to move, friction is at its maximum" },
          { en: "Frictional Force: Friction acts in the direction opposite to potential or actual motion" },
          { en: "Coefficient of Friction: F_max = μR, where μ is the coefficient of friction and R is the normal reaction" },
          { en: "Static Friction: F ≤ μR when the particle is not moving" },
          { en: "Smooth Surfaces: Frictional force is assumed to be zero (μ = 0)" },
          { en: "Inclined Planes: Weight components are mg sin θ parallel to the slope and mg cos θ perpendicular to the slope" },
          { en: "Triangle of Forces: Three coplanar forces in equilibrium can be represented by a closed vector triangle" }
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
          { en: "Moment of a Force: Moment = Force × perpendicular distance from the pivot" },
          { en: "Direction of Moments: Measured as either clockwise or anticlockwise" },
          { en: "Principle of Moments: For a system in equilibrium, total clockwise moments = total anticlockwise moments" },
          { en: "Centre of Mass (Uniform Rod): The weight acts exactly at the midpoint of the rod" },
          { en: "Non-uniform Rod: The weight acts at the centre of mass, which is not necessarily the geometric centre" },
          { en: "Tilting: When a rigid body is on the verge of tilting about a pivot, the reaction at all other supports is zero" },
          { en: "Equilibrium of a Rigid Body: Resultant force is zero in all directions AND resultant moment is zero about any point" },
          { en: "Couples: Two equal and opposite parallel forces that produce rotation but no translation" }
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
          { en: "Work Done: Work = Force × distance moved in the direction of the force (W = Fs)" },
          { en: "Work Done at an Angle: W = Fs cos θ" },
          { en: "Kinetic Energy (KE): KE = ½mv², the energy of a moving object" },
          { en: "Gravitational Potential Energy (GPE): GPE = mgh, the energy gained by raising a mass through height h" },
          { en: "Work-Energy Principle: Net work done on a particle equals its change in kinetic energy" },
          { en: "Conservation of Mechanical Energy: If no external forces act, total mechanical energy (KE + GPE) is constant" },
          { en: "Work Done Against Friction: Decreases the total mechanical energy of the system" },
          { en: "Power: The rate at which work is done, P = Work / time" },
          { en: "Driving Power: P = Fv, where F is the driving force and v is the velocity" }
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
          { en: "Momentum: A vector quantity defined as mass × velocity (p = mv)" },
          { en: "Impulse of a Force: Impulse = Force × time (I = Ft)" },
          { en: "Impulse-Momentum Principle: Impulse = Change in momentum (I = mv - mu)" },
          { en: "Conservation of Momentum: Total momentum before collision = Total momentum after collision (m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂)" },
          { en: "Coalescing Particles: If two particles stick together after collision, m₁u₁ + m₂u₂ = (m₁ + m₂)v" },
          { en: "Impact with a Wall: Impulse exerted by the wall = m(v - u), considering vector directions carefully" },
          { en: "Newton's Law of Restitution: Speed of separation = e × speed of approach" },
          { en: "Perfectly Elastic Collision: Coefficient of restitution e = 1, no kinetic energy is lost" },
          { en: "Perfectly Inelastic Collision: Coefficient of restitution e = 0, particles coalesce" }
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
          { en: "Horizontal Component of Velocity: Remains constant throughout motion (u_x = u cos θ)" },
          { en: "Vertical Component of Velocity: Subject to constant downward acceleration due to gravity (u_y = u sin θ, a_y = -g)" },
          { en: "Horizontal Displacement: x = (u cos θ)t" },
          { en: "Vertical Displacement: y = (u sin θ)t - ½gt²" },
          { en: "Time of Flight: Found by setting vertical displacement y = 0" },
          { en: "Maximum Height: Occurs when the vertical component of velocity is zero" },
          { en: "Horizontal Range: The horizontal distance travelled when the projectile returns to its initial height" },
          { en: "Equation of Trajectory: y = x tan θ - (gx²)/(2u² cos² θ)" }
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
