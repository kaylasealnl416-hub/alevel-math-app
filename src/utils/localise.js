/** Strip CJK characters from mixed Chinese-English text */
export function toEn(text) {
  if (!text) return '';
  return text
    .replace(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]+/g, '')
    .replace(/（/g, '(').replace(/）/g, ')')
    .replace(/，/g, ', ').replace(/。/g, '. ')
    .replace(/：/g, ': ').replace(/；/g, '; ')
    .replace(/【/g, '').replace(/】/g, '')
    .replace(/、/g, ', ').replace(/《》〈〉/g, '')
    .replace(/\(\s*\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[,.:;\s]+/, '')
    .trim();
}

/** Strip the trailing Chinese from bilingual titles */
export function titleEn(title) {
  return title.replace(/\s+[\u4e00-\u9fff].*$/, '').trim();
}

/** English overrides for chapter content */
export const CHAPTER_EN = {
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
export function localiseChapter(chapter, lang) {
  // Handle object format title like {zh: "...", en: "..."}
  const getTitle = () => {
    if (typeof chapter.title === 'object' && chapter.title !== null) {
      return lang === 'en' ? chapter.title.en : chapter.title.zh;
    }
    if (lang === 'en') {
      return titleEn(chapter.title);
    }
    return chapter.title;
  };

  // Helper to handle object format fields
  const getField = (field, fallback = '') => {
    if (typeof field === 'object' && field !== null) {
      return lang === 'en' ? field.en : field.zh;
    }
    if (lang === 'en' && typeof field === 'string') {
      return toEn(field);
    }
    return field || fallback;
  };

  if (lang !== 'en') return { ...chapter, title: getTitle() };

  const en = CHAPTER_EN[chapter.id] || {};

  // Handle overview (can be string or object)
  const getOverview = () => {
    if (typeof chapter.overview === 'object' && chapter.overview !== null) {
      return lang === 'en' ? chapter.overview.en : chapter.overview.zh;
    }
    return en.overview || toEn(chapter.overview);
  };

  return {
    ...chapter,
    title: getTitle(),
    overview: getOverview(),
    hardPoints: en.hardPoints || getField(chapter.hardPoints),
    examTips: en.examTips || getField(chapter.examTips),
    keyPoints: chapter.keyPoints?.map ? chapter.keyPoints.map(kp => getField(kp)) : chapter.keyPoints,
    formulas: chapter.formulas || [],
    difficulty: chapter.difficulty,
  };
}
