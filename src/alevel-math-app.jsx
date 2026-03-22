import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext.jsx";
import { SUBJECTS } from "./data/subjects.js";
import katex from "katex";
import "katex/dist/katex.min.css";
import ChatPage from "./components/ChatPage.jsx";
import { callAI } from "./utils/callAI.js";
import { getAISettings } from "./utils/aiProviders.js";
import PracticeView from "./components/practice/PracticeView";
import { post } from "./utils/apiClient";
import Toast from "./components/common/Toast";
import { CURRICULUM } from "./data/curriculum.js";

// ============================================================
// Math formula renderer (KaTeX)
// Fixed: use dangerouslySetInnerHTML instead of innerHTML
// ============================================================
function MathText({ text, displayMode = false }) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    // Process block formulas $$...$$ and inline formulas $...$
    const processed = text
      .replace(/\$\$([^$]+)\$\$/g, (_, formula) => {
        try {
          return katex.renderToString(formula.trim(), {
            throwOnError: false,
            displayMode: true,
          });
        } catch (e) {
          return formula;
        }
      })
      .replace(/\$([^$\n]+)\$/g, (_, formula) => {
        try {
          return katex.renderToString(formula.trim(), {
            throwOnError: false,
            displayMode: false,
          });
        } catch (e) {
          return formula;
        }
      });
    setHtml(processed);
  }, [text, displayMode]);

  return (
    <span
      style={{ lineHeight: "1.6" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// All subjects including Mathematics (from CURRICULUM) and others (from SUBJECTS)
const ALL_SUBJECTS = {
  mathematics: {
    id: "mathematics",
    name: { zh: "数学", en: "Mathematics" },
    nameFull: { zh: "爱德思IAL数学", en: "Pearson Edexcel IAL Mathematics" },
    icon: "📐",
    color: "#1a73e8",
    level: "IAL (International A-Level)"
  },
  ...SUBJECTS
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
    hardPoints: getField(chapter.hardPoints),
    examTips: getField(chapter.examTips),
    keyPoints: chapter.keyPoints?.map ? chapter.keyPoints.map(kp => getField(kp)) : chapter.keyPoints,
    formulas: chapter.formulas || [],
    difficulty: chapter.difficulty,
  };
}

// ============================================================
// TRANSLATIONS
// ============================================================
const T = {
  en: {
    logoTitle: "Pearson Edexcel A Levels", logoSub: "A Level Learning Platform", langBtn: "中文",
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
    secKeyPoints: "Key Points", secFormulas: "Formulas & Equations",
    secHardPoints: "High-Frequency Mistakes", secExamTips: "Exam Strategy & Scoring Tips",
    secExamples: "Examples",
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
    logoTitle: "Pearson Edexcel A Levels", logoSub: "A Level Learning Platform", langBtn: "中文",
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
    secKeyPoints: "Key Points", secFormulas: "Formulas & Equations",
    secHardPoints: "High-Frequency Mistakes", secExamTips: "Exam Strategy & Scoring Tips",
    secExamples: "Examples",
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
  }
};

// ============================================================
// MAIN APP
// ============================================================
export default function ALevelMathApp() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState("subjects"); // Start with subject selection
  const [selectedSubject, setSelectedSubject] = useState("mathematics");
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [errorBook, setErrorBook] = useState(() => {
    try {
      const saved = localStorage.getItem("alevel_math_errorbook");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("读取错题本失败", e);
      return [];
    }
  });
  const [examSession, setExamSession] = useState(null);
  const [quizSession, setQuizSession] = useState(null);
  const [mockExamSession, setMockExamSession] = useState(null);
  const [lang] = useState("en"); // Fixed to English only

  // Auto-save error book to localStorage
  useEffect(() => {
    localStorage.setItem("alevel_math_errorbook", JSON.stringify(errorBook));
  }, [errorBook]);

  // After login: resume pending nav
  useEffect(() => {
    if (isAuthenticated) {
      const pendingView = sessionStorage.getItem('pendingView');
      if (pendingView) {
        sessionStorage.removeItem('pendingView');
        nav(pendingView, undefined, pendingView === "curriculum" ? null : undefined, selectedSubject);
      }
    }
  }, [isAuthenticated]);

  const t = T[lang];

  const nav = (view, book = undefined, chapter = undefined, subject = undefined) => {
    setActiveView(view);
    if (subject !== undefined) setSelectedSubject(subject);
    if (book !== undefined) setSelectedBook(book);
    if (chapter !== undefined) setSelectedChapter(chapter);
  };

  return (
    <div style={styles.root}>
      <div style={styles.bgDecor} />
      <div style={styles.bgGrid} />

      {/* Main Content */}
      <main style={(activeView === "subjects" || (activeView === "curriculum" && !selectedChapter) || activeView === "chat") ? { position: "relative", zIndex: 1 } : styles.main}>
        {activeView === "subjects" && <SubjectsView nav={nav} lang={lang} selectedSubject={selectedSubject} />}
        {activeView === "home" && <HomeView nav={nav} t={t} lang={lang} />}
        {activeView === "curriculum" && !selectedChapter && <CurriculumView key={selectedSubject} nav={nav} t={t} lang={lang} subject={selectedSubject} book={selectedBook} />}
        {activeView === "curriculum" && selectedChapter && (
          <ChapterView key={`${selectedSubject}-${selectedBook}`} chapter={selectedChapter} book={selectedBook} nav={nav} t={t} lang={lang} subject={selectedSubject} />
        )}
        {activeView === "quiz" && (
          <PracticeView
            chapter={selectedChapter}
            book={selectedBook}
            subject={selectedSubject}
            onBack={() => nav.goTo("curriculum")}
          />
        )}
        {activeView === "exam" && (
          <ExamView
            chapter={selectedChapter}
            book={selectedBook}
            nav={nav}
            t={t}
            lang={lang}
            subject={selectedSubject}
          />
        )}
        {activeView === "mock" && (
          <MockExamView
            nav={nav}
            t={t}
            lang={lang}
            subject={selectedSubject}
            onAddError={(q) => setErrorBook(prev => [...prev.filter(e => e.id !== q.id), q])}
          />
        )}
        {activeView === "errorbook" && (
          <ErrorBookView
            errors={errorBook}
            subject={selectedSubject}
            onClear={(id) => setErrorBook(prev => prev.filter(e => e.id !== id))}
            nav={nav}
            t={t}
            lang={lang}
          />
        )}
        {activeView === "chat" && <ChatPage nav={nav} chapter={selectedChapter} book={selectedBook} subject={selectedSubject} />}
      </main>
    </div>
  );
}

// ============================================================
// SUBJECTS VIEW - Subject Selection
// ============================================================
function SubjectsView({ nav, lang }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const BRAND = "#1a73e8";

  const mathSubject = {
    id: "mathematics",
    name: { zh: "数学", en: "Mathematics" },
    nameFull: { zh: "爱德思IAL数学", en: "Pearson Edexcel IAL Mathematics" },
    icon: "📐",
    color: "#1a73e8",
    bgColor: "#FEF2F2",
    level: "IAL (International A-Level)",
    books: CURRICULUM,
  };

  const allSubjects = [mathSubject, ...Object.values(SUBJECTS)];

  const totalChapters = allSubjects.reduce(
    (sum, s) => sum + Object.values(s.books).reduce((s2, b) => s2 + (b.chapters?.length || 0), 0),
    0
  );

  const authNav = (view, subject) => {
    if (!isAuthenticated) {
      sessionStorage.setItem("pendingView", view);
      navigate("/login");
    } else {
      nav(view, undefined, view === "curriculum" ? null : undefined, subject || "mathematics");
    }
  };

  const INNER = { maxWidth: 1200, margin: "0 auto", padding: "0 24px" };

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{
        background: "#202124",
        padding: "0 0 60px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* background glows */}
        <div style={{
          position: "absolute", top: "-15%", right: "-5%",
          width: 400, height: 400, borderRadius: "50%",
          background: BRAND, filter: "blur(120px)", opacity: 0.12, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-20%", left: "-5%",
          width: 500, height: 500, borderRadius: "50%",
          background: "#1a73e8", filter: "blur(140px)", opacity: 0.07, pointerEvents: "none",
        }} />

        {/* ── Hero Content ── */}
        <div style={{
          ...INNER,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "center",
          padding: "56px 24px 0",
          position: "relative", zIndex: 1,
        }}>
          {/* Left: copy */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "5px 14px", borderRadius: 20,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.14)",
              fontSize: 12, fontWeight: 600, color: "#86EFAC",
              marginBottom: 24, letterSpacing: 0.3,
            }}>
              ✦ Edexcel IAL 2026 Syllabus Updated
            </div>

            <h1 style={{
              fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 700,
              lineHeight: 1.15, color: "#F8FAFC",
              margin: "0 0 18px", fontFamily: "inherit",
            }}>
              Master A-Level<br />
              <span style={{ color: BRAND }}>with Precision.</span>
            </h1>

            <p style={{
              fontSize: 15, color: "#94A3B8",
              maxWidth: 460, lineHeight: 1.7, margin: "0 0 28px",
            }}>
              Your structured study platform for Pearson Edexcel IAL. Explore syllabi, practice quizzes, and tackle past papers — all in one place.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={() => authNav("curriculum", "mathematics")}
                style={{
                  padding: "11px 24px", background: BRAND,
                  color: "#fff", border: "none", borderRadius: 8,
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                  boxShadow: `0 0 24px ${BRAND}40`,
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#B71C1C"}
                onMouseLeave={e => e.currentTarget.style.background = BRAND}
              >
                Start Learning →
              </button>
              <button
                onClick={() => document.getElementById("subjects-section")?.scrollIntoView({ behavior: "smooth" })}
                style={{
                  padding: "11px 24px",
                  background: "rgba(255,255,255,0.07)",
                  color: "#E2E8F0",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 8, fontSize: 14, fontWeight: 600,
                  cursor: "pointer", transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.13)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
              >
                Browse Subjects
              </button>
            </div>
          </div>

          {/* Right: feature tiles */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { icon: "📖", title: "Structured Curriculum", desc: "Chapter-by-chapter learning with key points and formulas" },
              { icon: "🧪", title: "Practice Quizzes",     desc: "AI-generated questions to test your understanding" },
              { icon: "📝", title: "Past Papers",          desc: "Edexcel IAL past exam papers with real timing" },
              { icon: "💬", title: "AI Tutor",             desc: "Instant explanations and step-by-step guidance" },
            ].map((f, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 12, padding: 18,
              }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0", marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ ...INNER, display: "grid", gridTemplateColumns: "repeat(4,1fr)", textAlign: "center" }}>
          {[
            { value: allSubjects.length,    label: "Active Subjects" },
            { value: `${totalChapters}+`,   label: "Chapters" },
            { value: `${PAST_PAPERS.length}+`, label: "Past Papers" },
            { value: "IAL",                 label: "Qualification" },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "22px 16px",
              borderRight: i < 3 ? "1px solid #E2E8F0" : "none",
            }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#202124", fontFamily: "inherit" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Subject Cards ── */}
      <section id="subjects-section" style={{ ...INNER, padding: "48px 24px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#202124", fontFamily: "inherit" }}>
              My Learning Dashboard
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: 14, color: "#64748B" }}>
              Select a subject to begin your study session.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {allSubjects.map(subject => {
            const bookKeys = Object.keys(subject.books);
            const chapterCount = Object.values(subject.books).reduce((s, b) => s + (b.chapters?.length || 0), 0);
            const isHovered = hoveredCard === subject.id;
            return (
              <div
                key={subject.id}
                onMouseEnter={() => setHoveredCard(subject.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => nav("curriculum", bookKeys[0], null, subject.id)}
                style={{
                  background: "#FFFFFF", borderRadius: 16, padding: 24,
                  border: `1px solid ${isHovered ? subject.color + "40" : "#E2E8F0"}`,
                  boxShadow: isHovered ? `0 8px 28px ${subject.color}18` : "0 1px 4px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                  transform: isHovered ? "translateY(-3px)" : "none",
                  transition: "all 0.25s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: subject.bgColor || subject.color + "15",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                  }}>
                    {subject.icon}
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 6,
                    background: "#F1F5F9", color: "#64748B",
                  }}>
                    IAL
                  </span>
                </div>

                <h3 style={{ margin: "0 0 5px", fontSize: 17, fontWeight: 700, color: "#202124" }}>
                  {subject.name[lang]}
                </h3>
                <p style={{ margin: "0 0 14px", fontSize: 13, color: "#64748B" }}>
                  {subject.nameFull[lang]}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                  {bookKeys.map(key => (
                    <span key={key} style={{
                      padding: "3px 9px", borderRadius: 6,
                      background: subject.color + "12", color: subject.color,
                      fontSize: 11, fontWeight: 600,
                    }}>{key}</span>
                  ))}
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 500, marginBottom: 6 }}>
                    <span style={{ color: "#94A3B8" }}>Chapters</span>
                    <span style={{ color: "#202124", fontWeight: 700 }}>{chapterCount}</span>
                  </div>
                  <div style={{ width: "100%", height: 5, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 3, width: "100%",
                      background: isHovered ? subject.color : "#CBD5E1",
                      transition: "background 0.3s",
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Quick Actions ── */}
      <section style={{ ...INNER, padding: "0 24px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {[
            {
              icon: "📚", title: "Curriculum",
              desc: "Chapter-by-chapter syllabus with key concepts, formulas and examples.",
              bg: "linear-gradient(135deg,#EFF6FF,#DBEAFE)", border: "#BFDBFE",
              iconBg: "#DBEAFE",
              action: () => authNav("curriculum", "mathematics"),
            },
            {
              icon: "💬", title: "AI Tutor",
              desc: "Stuck on a concept? Chat with an AI tutor for instant explanations.",
              bg: "linear-gradient(135deg,#F0FDF4,#DCFCE7)", border: "#BBF7D0",
              iconBg: "#DCFCE7",
              action: () => authNav("chat", "mathematics"),
            },
            {
              icon: "📝", title: "Mock Exams",
              desc: "Timed past paper simulations to prepare for the real Edexcel IAL exam.",
              bg: "linear-gradient(135deg,#FFFBEB,#FEF3C7)", border: "#FDE68A",
              iconBg: "#FEF3C7",
              action: () => authNav("exam", "mathematics"),
            },
          ].map((item, i) => (
            <div
              key={i}
              onClick={item.action}
              style={{
                background: item.bg, border: `1px solid ${item.border}`,
                borderRadius: 16, padding: 22,
                display: "flex", gap: 16, alignItems: "flex-start",
                cursor: "pointer", transition: "box-shadow 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.09)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: item.iconBg,
                flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              }}>
                {item.icon}
              </div>
              <div>
                <h3 style={{ margin: "0 0 5px", fontSize: 15, fontWeight: 700, color: "#202124" }}>{item.title}</h3>
                <p style={{ margin: 0, fontSize: 13, color: "#475569", lineHeight: 1.55 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

// ============================================================
// CURRICULUM VIEW
// ============================================================
function CurriculumView({ nav, t, lang, subject = "mathematics", book: initialBook }) {
  const isMath = subject === "mathematics";
  let dataSource = isMath ? CURRICULUM : null;
  if (!isMath && SUBJECTS[subject]?.books) {
    dataSource = SUBJECTS[subject].books;
  } else if (!isMath) {
    const fallbackKey = Object.keys(SUBJECTS)[0];
    if (fallbackKey) dataSource = SUBJECTS[fallbackKey].books;
  }

  const availableBooks = dataSource ? Object.keys(dataSource) : [];
  const targetBook = (initialBook && availableBooks.includes(initialBook))
    ? initialBook : (availableBooks[0] || "Unit1");

  const [activeBook, setActiveBook] = useState(targetBook);
  const [expandedCh, setExpandedCh] = useState(null);
  const book = dataSource?.[activeBook];

  useEffect(() => {
    if (dataSource && availableBooks.length > 0) {
      setActiveBook(initialBook && availableBooks.includes(initialBook) ? initialBook : availableBooks[0]);
    }
  }, [subject, initialBook]);

  if (!book || availableBooks.length === 0) {
    return (
      <div style={styles.pageWrap}>
        <p style={{ padding: 40, textAlign: "center" }}>Loading curriculum...</p>
      </div>
    );
  }

  const getBookTitle = (b) => typeof b.title === "object" ? b.title[lang] : b.title;
  const getBookSubtitle = (b) => b.subtitle ? (typeof b.subtitle === "object" ? b.subtitle[lang] : b.subtitle) : "";
  const getBookColor = (b) => b.color || "#1a73e8";
  const bookColor = getBookColor(book);

  const subjectMeta = ALL_SUBJECTS[subject];
  const subjectColor = subjectMeta?.color || "#1a73e8";

  // Course codes per book key
  const BOOK_CODES = {
    P1: "WMA11", P2: "WMA12", P3: "WMA13", P4: "WMA14",
    S1: "WST01", M1: "WME01",
    Unit1: "WEC11", Unit2: "WEC12", Unit3: "WEC13", Unit4: "WEC14",
  };

  // AI tutor intro per subject
  const AI_INTROS = {
    mathematics: "Ready to help with Maths. Describe a problem or paste a formula and I'll walk you through it.",
    economics: "Hi! Need help with demand-supply diagrams or evaluating a market failure policy?",
  };
  const aiIntro = AI_INTROS[subject] || "Hi! I'm your AI tutor. Ask me anything about this subject.";

  const INNER = { maxWidth: 1200, margin: "0 auto", padding: "0 24px" };

  return (
    <div>
      {/* ── Subject Header ── */}
      <div style={{ background: "#202124", padding: "36px 24px 44px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "-30%", right: "-5%",
          width: 360, height: 360, borderRadius: "50%",
          background: subjectColor, filter: "blur(110px)", opacity: 0.14, pointerEvents: "none",
        }} />
        <div style={{ ...INNER, position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 13, color: "#64748B" }}>
            <button
              onClick={() => nav("subjects")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#94A3B8", fontSize: 13, padding: 0,
                transition: "color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#E2E8F0"}
              onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}
            >
              ← Dashboard
            </button>
            <span style={{ color: "#475569" }}>›</span>
            <span style={{ color: "#94A3B8" }}>{subjectMeta?.name?.[lang] || subject}</span>
            <span style={{ color: "#475569" }}>›</span>
            <span style={{ color: subjectColor }}>{getBookTitle(book)}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{
                width: 60, height: 60, borderRadius: 14,
                background: subjectColor + "22",
                border: `1px solid ${subjectColor}40`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
              }}>
                {subjectMeta?.icon || "📚"}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#F8FAFC", fontFamily: "inherit" }}>
                    {getBookTitle(book)}
                  </h1>
                  {BOOK_CODES[activeBook] && (
                    <span style={{
                      padding: "2px 9px", borderRadius: 5,
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      fontSize: 12, fontWeight: 600, color: "#94A3B8",
                    }}>
                      {BOOK_CODES[activeBook]}
                    </span>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>
                  {getBookSubtitle(book) || subjectMeta?.nameFull?.[lang] || ""}
                </p>
              </div>
            </div>

            {/* Chapter count widget */}
            <div style={{
              background: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, padding: "14px 20px",
              display: "flex", alignItems: "center", gap: 16,
              backdropFilter: "blur(8px)",
            }}>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600 }}>
                  This Book
                </p>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#F8FAFC", lineHeight: 1 }}>
                  {book.chapters.length}
                  <span style={{ fontSize: 13, color: "#64748B", fontWeight: 400, marginLeft: 4 }}>chapters</span>
                </div>
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: `conic-gradient(${subjectColor} ${(availableBooks.indexOf(activeBook) + 1) / availableBooks.length * 100}%, rgba(255,255,255,0.08) 0)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#0F172A" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-column body ── */}
      <div style={{ ...INNER, padding: "32px 24px 60px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 32, alignItems: "start" }}>

        {/* Left: Book tabs + Chapter list */}
        <div>
          {/* Book tabs */}
          <div style={{ display: "flex", gap: 2, borderBottom: "1px solid #E2E8F0", marginBottom: 24 }}>
            {Object.entries(dataSource).map(([key, b]) => {
              const isActive = activeBook === key;
              return (
                <button
                  key={key}
                  onClick={() => { setActiveBook(key); setExpandedCh(null); }}
                  style={{
                    padding: "10px 16px", fontSize: 13, fontWeight: 600,
                    background: "none", border: "none", cursor: "pointer",
                    borderBottom: `2px solid ${isActive ? bookColor : "transparent"}`,
                    color: isActive ? bookColor : "#64748B",
                    marginBottom: -1,
                    transition: "color 0.15s, border-color 0.15s",
                  }}
                >
                  {key}
                </button>
              );
            })}
          </div>

          {/* Chapter accordion */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {book.chapters.map(ch => {
              const lch = localiseChapter(ch, lang);
              const isOpen = expandedCh === ch.id;
              return (
                <div
                  key={ch.id}
                  style={{
                    background: "#FFFFFF", borderRadius: 12,
                    border: `1px solid ${isOpen ? bookColor + "35" : "#E2E8F0"}`,
                    boxShadow: isOpen ? `0 2px 12px ${bookColor}12` : "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    overflow: "hidden",
                  }}
                >
                  {/* Chapter header row */}
                  <div
                    onClick={() => setExpandedCh(isOpen ? null : ch.id)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "16px 18px", cursor: "pointer", userSelect: "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                        background: isOpen ? bookColor + "18" : "#F8FAFC",
                        border: `1px solid ${isOpen ? bookColor + "30" : "#E2E8F0"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 700,
                        color: isOpen ? bookColor : "#94A3B8",
                        transition: "all 0.2s",
                      }}>
                        {String(ch.num).padStart(2, "0")}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: isOpen ? "#202124" : "#374151" }}>
                          {lch.title}
                        </div>
                        <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
                          <span style={{
                            fontSize: 11, padding: "1px 8px", borderRadius: 4,
                            background: "#F1F5F9", color: "#64748B",
                          }}>
                            {ch.difficulty || "Core"}
                          </span>
                          <span style={{ fontSize: 11, color: "#94A3B8" }}>
                            {ch.keyPoints?.length || 0} key points
                          </span>
                          <span style={{ fontSize: 11, color: "#94A3B8" }}>
                            {ch.formulas?.length || 0} formulas
                          </span>
                        </div>
                      </div>
                    </div>
                    <svg
                      style={{
                        width: 16, height: 16, flexShrink: 0,
                        color: isOpen ? bookColor : "#94A3B8",
                        transform: isOpen ? "rotate(180deg)" : "none",
                        transition: "transform 0.25s, color 0.2s",
                      }}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>

                  {/* Expanded content */}
                  <div style={{
                    display: "grid",
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.3s ease",
                    background: "#F8FAFC",
                    borderTop: isOpen ? `1px solid ${bookColor}18` : "1px solid transparent",
                  }}>
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ padding: "14px 18px 16px 18px" }}>
                        <p style={{ margin: "0 0 14px", fontSize: 13, color: "#64748B", lineHeight: 1.65 }}>
                          {(lch.overview?.substring?.(0, 200) || "") + (lch.overview?.length > 200 ? "…" : "")}
                        </p>
                        <button
                          onClick={(e) => { e.stopPropagation(); nav("curriculum", activeBook, ch); }}
                          style={{
                            padding: "8px 18px",
                            background: bookColor, color: "#fff",
                            border: "none", borderRadius: 7,
                            fontSize: 13, fontWeight: 600,
                            cursor: "pointer",
                            transition: "opacity 0.15s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                        >
                          Open Chapter →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Sticky sidebar */}
        <div style={{ position: "sticky", top: 80 }}>

          {/* AI Tutor card */}
          <div style={{
            background: "#FFFFFF", borderRadius: 16,
            border: `1px solid ${subjectColor}25`,
            overflow: "hidden", marginBottom: 16,
            boxShadow: `0 2px 12px ${subjectColor}10`,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${subjectColor}, ${subjectColor}BB)`,
              padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ fontSize: 18 }}>🤖</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
                  {subjectMeta?.name?.[lang] || "Subject"} AI Tutor
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Powered by Claude</div>
              </div>
            </div>
            <div style={{ padding: "14px 16px", background: "#F8FAFC", minHeight: 80 }}>
              <div style={{
                background: "#FFFFFF", border: "1px solid #E2E8F0",
                borderRadius: 12, borderTopLeftRadius: 4,
                padding: "10px 12px", fontSize: 12, color: "#475569", lineHeight: 1.6,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                maxWidth: "90%",
              }}>
                {aiIntro}
              </div>
            </div>
            <div style={{ padding: "12px 16px", borderTop: "1px solid #F1F5F9" }}>
              <button
                onClick={() => nav("chat", undefined, undefined, subject)}
                style={{
                  width: "100%", padding: "9px 0",
                  background: subjectColor + "12",
                  color: subjectColor, border: `1px solid ${subjectColor}25`,
                  borderRadius: 8, fontSize: 13, fontWeight: 600,
                  cursor: "pointer", transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = subjectColor + "22"}
                onMouseLeave={e => e.currentTarget.style.background = subjectColor + "12"}
              >
                Open AI Chat →
              </button>
            </div>
          </div>

          {/* Quick Resources */}
          <div style={{
            background: "#FFFFFF", borderRadius: 16,
            border: "1px solid #E2E8F0", padding: "18px 16px",
          }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1 }}>
              Quick Resources
            </h3>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {(SUBJECT_RESOURCES[subject] || SUBJECT_RESOURCES.mathematics).slice(0, 4).map((r, i) => (
                <li key={i}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      textDecoration: "none",
                      padding: "8px 10px", borderRadius: 8,
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <span style={{ fontSize: 14, marginTop: 1 }}>📄</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>{r.desc}</div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// EXTERNAL RESOURCES BY SUBJECT
// ============================================================
const SUBJECT_RESOURCES = {
  mathematics: [
    { name: "ExamSolutions", desc: "Video tutorials & worked solutions", url: "https://www.examsolutions.net/a-level-maths/" },
    { name: "Physics & Maths Tutor", desc: "Past papers by topic", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/" },
    { name: "Revision Maths", desc: "Past papers & mark schemes", url: "https://revisionmaths.com/level-maths/level-maths-papers/edexcel-level-maths-papers" },
    { name: "S-Cool", desc: "Revision notes & topics", url: "https://www.s-cool.co.uk/a-level/maths" },
  ],
  further_math: [
    { name: "ExamSolutions", desc: "Video tutorials & worked solutions", url: "https://www.examsolutions.net/a-level-maths/" },
    { name: "Physics & Maths Tutor", desc: "Past papers by topic", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/" },
    { name: "Revision Maths", desc: "Past papers & mark schemes", url: "https://revisionmaths.com/level-maths/level-maths-papers/edexcel-level-maths-papers" },
  ],
  economics: [
    { name: "Physics & Maths Tutor", desc: "Past papers by topic", url: "https://www.physicsandmathstutor.com/a-level-economics-papers/" },
    { name: "Tutor2u", desc: "Revision notes & resources", url: "https://www.tutor2u.net/economics" },
    { name: "Economics Online", desc: "Diagrams & explanations", url: "https://www.economicsonline.co.uk/" },
  ],
  history: [
    { name: "Tutor2u", desc: "Revision notes & resources", url: "https://www.tutor2u.net/history" },
    { name: "History Learning Site", desc: "Notes & essays", url: "https://www.historylearningsite.co.uk/" },
  ],
  politics: [
    { name: "Tutor2u", desc: "Revision notes & resources", url: "https://www.tutor2u.net/politics" },
  ],
  psychology: [
    { name: "Tutor2u", desc: "Revision notes & resources", url: "https://www.tutor2u.net/psychology" },
    { name: "Psychology Online", desc: "Notes & explanations", url: "https://www.psychology.org.uk/" },
  ],
};

// ============================================================
// CHAPTER VIEW
// ============================================================
function ChapterView({ chapter, book, nav, t, lang, subject = "mathematics" }) {
  const [tab, setTab] = useState("learn");
  const [expandedKP, setExpandedKP] = useState(0); // 单开手风琴，默认展开第一条
  const [hoveredKP, setHoveredKP] = useState(null);
  const [activeVideo, setActiveVideo] = useState(0);

  const isMath = subject === "mathematics";
  const bookData = isMath ? CURRICULUM[book] : SUBJECTS[subject]?.books?.[book];
  const ch = localiseChapter(chapter, lang);

  if (!bookData) return <div style={styles.pageWrap}>Loading...</div>;

  const color = bookData.color || "#1a73e8";
  const videos = chapter.youtube || [];

  const TABS = [
    { id: "learn",  label: "Learn",  icon: "📖" },
    { id: "videos", label: "Videos", icon: "▶" },
    { id: "quiz",   label: "Quiz",   icon: "✏" },
    { id: "exam",   label: "Exam",   icon: "🎓" },
  ];

  const getYTId = (url) => {
    if (!url) return null;
    const m = url.match(/(?:v=|youtu\.be\/)([^&\s]+)/);
    return m ? m[1] : null;
  };

  return (
    <div style={styles.pageWrap}>
      {/* Back */}
      <button
        onClick={() => nav("curriculum", book, null, subject)}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#64748B", padding: "0 0 20px", transition: "color 0.15s" }}
        onMouseEnter={e => e.currentTarget.style.color = color}
        onMouseLeave={e => e.currentTarget.style.color = "#64748B"}
      >
        ← Back to Curriculum
      </button>

      {/* ── Header Card ── */}
      <div style={{ background: "#FFFFFF", borderRadius: 16, border: `1px solid ${color}25`, boxShadow: `0 2px 16px ${color}0D`, padding: "28px 32px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-40%", right: "-5%", width: 220, height: 220, borderRadius: "50%", background: color, filter: "blur(70px)", opacity: 0.07, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", padding: "3px 12px", borderRadius: 20, background: color, color: "#fff", fontSize: 12, fontWeight: 700, marginBottom: 14 }}>
            {book} — Chapter {ch.num}
          </div>
          <h1 style={{ margin: "0 0 12px", fontSize: 26, fontWeight: 700, color: "#202124", fontFamily: "inherit", lineHeight: 1.25 }}>
            {ch.title}
          </h1>
          <p style={{ margin: "0 0 20px", fontSize: 14, color: "#64748B", lineHeight: 1.7, maxWidth: 700 }}>
            {(ch.overview || "").substring(0, 280)}{(ch.overview || "").length > 280 ? "…" : ""}
          </p>
          <button
            onClick={() => nav("chat", undefined, undefined, subject)}
            style={{ padding: "9px 20px", background: "#185abc", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(30,64,175,0.25)", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#1D4ED8"}
            onMouseLeave={e => e.currentTarget.style.background = "#185abc"}
          >
            🤖 Ask AI Tutor
          </button>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{ display: "flex", borderBottom: "1px solid #E2E8F0", marginBottom: 20 }}>
        {TABS.map(tabItem => {
          const isActive = tab === tabItem.id;
          return (
            <button
              key={tabItem.id}
              onClick={() => setTab(tabItem.id)}
              style={{ padding: "10px 22px", border: "none", cursor: "pointer", background: isActive ? color + "08" : "transparent", borderBottom: `2px solid ${isActive ? color : "transparent"}`, color: isActive ? color : "#64748B", fontSize: 13, fontWeight: 600, marginBottom: -1, transition: "all 0.15s" }}
            >
              {tabItem.icon} {tabItem.label}
            </button>
          );
        })}
      </div>

      {/* ── Learn ── */}
      {tab === "learn" && (
        <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "28px 32px" }}>
          <div style={styles.learnContent}>
            <section style={styles.learnSection}>
              <div style={styles.sectionHeader}>
                <div style={{ ...styles.sectionIconBox, background: "#FEF9C3" }}>⚡</div>
                <h3 style={styles.sectionTitle}>{t.secKeyPoints}</h3>
              </div>
              <ul style={styles.keyPointsList}>
                {(ch.keyPoints || []).map((kp, i) => {
                  const dashIdx = kp.indexOf(' - ');
                  const rawTerm = dashIdx !== -1 ? kp.slice(0, dashIdx) : kp;
                  const term = rawTerm.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
                  const desc = dashIdx !== -1 ? kp.slice(dashIdx + 3) : null;
                  const isOpen = expandedKP === i;
                  const toggle = () => setExpandedKP(isOpen ? null : i);
                  return (
                    <li key={i} onClick={toggle} onMouseEnter={() => setHoveredKP(i)} onMouseLeave={() => setHoveredKP(null)} style={{ position: "relative", background: "#FFF", borderRadius: 10, overflow: "hidden", cursor: "pointer", border: `1px solid ${isOpen ? color + "40" : "#E5E7EB"}`, boxShadow: isOpen ? `0 2px 12px ${color}15` : "0 1px 3px rgba(0,0,0,0.04)", transition: "border-color 0.2s, box-shadow 0.2s" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: color, borderRadius: "3px 0 0 3px", opacity: isOpen ? 1 : 0, transition: "opacity 0.25s" }} />
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 14px 13px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", boxShadow: `0 2px 6px ${color}40` }}>
                            {i + 1}
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.45, color: isOpen ? "#111827" : "#374151", transition: "color 0.2s" }}>{term}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                          {hoveredKP === i && (
                            <button
                              onClick={e => { e.stopPropagation(); window.open(`https://www.google.com/search?q=${encodeURIComponent(kp)}`, '_blank', 'noopener,noreferrer'); }}
                              title="Search on Google"
                              style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 9px", borderRadius: 14, border: "1px solid #BFDBFE", background: "#EFF6FF", cursor: "pointer", fontSize: 11, color: "#1D4ED8", fontWeight: 600, lineHeight: 1, whiteSpace: "nowrap" }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                              Google
                            </button>
                          )}
                          <svg style={{ width: 16, height: 16, color: isOpen ? color : "#CBD5E1", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease, color 0.2s" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </div>
                      {desc && (
                        <div onClick={e => e.stopPropagation()} style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.3s ease", background: "#F8FAFC", borderTop: isOpen ? `1px solid ${color}18` : "1px solid transparent" }}>
                          <div style={{ overflow: "hidden" }}>
                            <p style={{ margin: 0, padding: "13px 18px 15px 58px", fontSize: 13, color: "#6B7280", lineHeight: 1.7, userSelect: "text" }}>{desc}</p>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>

            <section style={styles.learnSection}>
              <div style={styles.sectionHeader}>
                <div style={{ ...styles.sectionIconBox, background: "#EFF6FF" }}>📐</div>
                <h3 style={styles.sectionTitle}>{t.secFormulas}</h3>
              </div>
              <div style={styles.formulasGrid}>
                {(ch.formulas || []).map((f, i) => {
                  const hasChinese = (s) => /[\u4e00-\u9fff]/.test(s);
                  // name: 英文模式取括号内英文，无括号时仅在含汉字时去除汉字
                  const parenMatch = f.name.match(/\(([^)]+)\)/);
                  const displayName = lang === 'en'
                    ? (parenMatch ? parenMatch[1].trim() : (hasChinese(f.name) ? toEn(f.name) || f.name : f.name))
                    : f.name.replace(/\s*\([^)]*[a-zA-Z][^)]*\)\s*$/, '').trim() || f.name;
                  // expr: 仅在含汉字时才调用 toEn，避免破坏已是英文的内容
                  const displayExpr = lang === 'en' && hasChinese(f.expr) ? (toEn(f.expr) || f.expr) : f.expr;
                  return (
                    <div key={i} style={{ ...styles.formulaCard, borderTop: `3px solid ${color}` }}>
                      <div style={styles.formulaName}>{displayName}</div>
                      <div style={{ ...styles.formulaExpr, color, borderColor: color + "50" }}><MathText text={displayExpr} /></div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section style={styles.learnSection}>
              <div style={styles.sectionHeader}>
                <div style={{ ...styles.sectionIconBox, background: "#FEE2E2" }}>⚠️</div>
                <h3 style={styles.sectionTitle}>{t.secHardPoints}</h3>
              </div>
              <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 10, padding: "16px 18px 16px 20px", display: "flex", gap: 14, alignItems: "flex-start", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", borderLeft: `3px solid ${color}` }}>
                <span style={{ width: 26, height: 26, background: color, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>!</span>
                <p style={{ color: "#374151", lineHeight: 1.7, margin: 0, fontSize: 13 }}>{ch.hardPoints}</p>
              </div>
            </section>

            {ch.examTips && (
              <section style={styles.learnSection}>
                <div style={styles.sectionHeader}>
                  <div style={{ ...styles.sectionIconBox, background: "#EFF6FF" }}>★</div>
                  <h3 style={styles.sectionTitle}>{t.secExamTips}</h3>
                </div>
                <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 10, padding: "16px 18px 16px 20px", display: "flex", gap: 14, alignItems: "flex-start", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", borderLeft: "3px solid #1D4ED8" }}>
                  <span style={{ width: 26, height: 26, background: "#1D4ED8", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>★</span>
                  <p style={{ color: "#374151", lineHeight: 1.7, margin: 0, fontSize: 13 }}>{ch.examTips}</p>
                </div>
              </section>
            )}

            {ch.examples && ch.examples.length > 0 && (
              <section style={styles.learnSection}>
                <div style={styles.sectionHeader}>
                  <div style={{ ...styles.sectionIconBox, background: "#FFFBEB" }}>📝</div>
                  <h3 style={styles.sectionTitle}>{t.secExamples}</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {(ch.examples || []).map((ex, i) => (
                    <div key={i} style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                      <div style={{ padding: "14px 18px", borderBottom: "1px solid #F1F5F9" }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#202124", lineHeight: 1.6 }}>
                          <MathText text={lang === 'en' ? ex.question.en : ex.question.zh || ex.question.en} />
                        </div>
                      </div>
                      <div style={{ padding: "12px 18px", background: "#F8FAFC" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: color, textTransform: "uppercase", letterSpacing: 0.5 }}>{lang === 'en' ? 'Answer' : '答案'} </span>
                        <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.65 }}>{lang === 'en' ? ex.answer.en : ex.answer.zh || ex.answer.en}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {ch.definitions && ch.definitions.length > 0 && (
              <section style={styles.learnSection}>
                <div style={styles.sectionHeader}>
                  <div style={{ ...styles.sectionIconBox, background: "#F0FDF4" }}>📚</div>
                  <h3 style={styles.sectionTitle}>Key Terms</h3>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
                  {ch.definitions.map((d, i) => (
                    <div key={i} style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", borderTop: `3px solid ${color}` }}>
                      <div style={{ padding: "10px 14px 6px", borderBottom: "1px solid #F1F5F9" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#202124" }}>{d.term}</span>
                      </div>
                      <div style={{ padding: "8px 14px 12px" }}>
                        <span style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>{d.definition}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}

      {/* ── Videos ── */}
      {tab === "videos" && (
        <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "28px 32px" }}>
          {videos.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 24, alignItems: "start" }}>
              {/* Main player */}
              <div>
                <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden", background: "#0F172A", marginBottom: 14 }}>
                  {getYTId(videos[activeVideo]?.url) ? (
                    <iframe
                      width="100%" height="100%"
                      src={`https://www.youtube.com/embed/${getYTId(videos[activeVideo].url)}`}
                      title={videos[activeVideo].title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ display: "block", width: "100%", height: "100%" }}
                    />
                  ) : (
                    <a href={videos[activeVideo]?.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", color: "#fff", textDecoration: "none", fontSize: 48 }}>▶</a>
                  )}
                </div>
                <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "#202124" }}>{videos[activeVideo]?.title}</h3>
                <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>{videos[activeVideo]?.channel}</p>
              </div>

              {/* Playlist */}
              <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "10px 14px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Playlist · {videos.length} videos
                </div>
                <div style={{ padding: 6, maxHeight: 340, overflowY: "auto" }}>
                  {videos.map((v, i) => (
                    <div key={i} onClick={() => setActiveVideo(i)} style={{ padding: "10px 10px", borderRadius: 8, cursor: "pointer", background: activeVideo === i ? color + "10" : "transparent", border: `1px solid ${activeVideo === i ? color + "25" : "transparent"}`, display: "flex", gap: 10, alignItems: "flex-start", transition: "all 0.15s", marginBottom: 2 }}>
                      <div style={{ width: 28, height: 22, borderRadius: 4, flexShrink: 0, background: activeVideo === i ? color : "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: activeVideo === i ? "#fff" : "#94A3B8" }}>▶</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: activeVideo === i ? color : "#374151", lineHeight: 1.4 }}>{v.title}</div>
                        <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{v.channel}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "48px 24px" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎬</div>
              <p style={{ fontSize: 14, color: "#64748B", marginBottom: 20 }}>No videos added for this chapter yet.</p>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent("A level " + (typeof ch.title === 'object' ? ch.title.en : ch.title) + " " + book + " Edexcel IAL")}`}
                target="_blank" rel="noopener noreferrer"
                style={{ padding: "9px 20px", background: color, color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600 }}
              >
                Search on YouTube →
              </a>
            </div>
          )}

          {/* External Resources */}
          <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid #E2E8F0" }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.8 }}>
              External Resources
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
              {(SUBJECT_RESOURCES[subject] || SUBJECT_RESOURCES.mathematics).map((res, i) => (
                <a key={i} href={res.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: "block", padding: "12px 14px", background: "#F8FAFC", borderRadius: 10, textDecoration: "none", border: "1px solid #E2E8F0", transition: "border-color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = color + "40"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#E2E8F0"}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: color, marginBottom: 3 }}>{res.name}</div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>{res.desc}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Quiz ── */}
      {tab === "quiz" && <PracticeView chapter={chapter} book={book} subject={subject} embedded onBack={() => setTab("learn")} />}

      {/* ── Exam ── */}
      {tab === "exam" && <ExamView chapter={chapter} book={book} nav={nav} t={t} lang={lang} embedded />}
    </div>
  );
}

// ============================================================
// EXAM VIEW (AI-generated, timed)
// ============================================================
function ExamView({ chapter, book, nav, embedded, t, lang, subject = "mathematics" }) {
  const examNavigate = useNavigate();
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(book || (subject === "mathematics" ? "P1" : "Unit1"));
  const [selectedChapter, setSelectedChapter] = useState(chapter || null);

  // Get the correct data source based on subject
  const isMath = subject === "mathematics";
  const dataSource = isMath ? CURRICULUM : (SUBJECTS[subject]?.books || {});

  const NUM_QUESTIONS = 7;
  const EXAM_MINUTES = difficulty === "hard" ? 35 : 25;

  const startExam = async () => {
    setLoading(true);
    const chapterInfo = selectedChapter || dataSource[selectedBook]?.chapters[0];
    if (!chapterInfo) { Toast.error("Please select a chapter first."); setLoading(false); return; }

    const getTitle = () => {
      if (typeof chapterInfo?.title === 'object' && chapterInfo.title !== null) {
        return lang === 'en' ? chapterInfo.title.en : chapterInfo.title.zh;
      }
      return chapterInfo?.title || "Mixed Topics";
    };

    const chTitle = getTitle();

    // 读取 AI 设置
    let aiSettings = {};
    try { aiSettings = JSON.parse(localStorage.getItem('ai_settings')) || {}; } catch {}

    const body = {
      chapterId: chapterInfo.id,
      questionCount: NUM_QUESTIONS,
      difficulty,
      timeLimit: EXAM_MINUTES * 60,
      chapterTitle: chTitle,
      chapterKeyPoints: chapterInfo.keyPoints || [],
      chapterFormulas: chapterInfo.formulas || [],
    };
    if (aiSettings.provider && aiSettings.apiKey) {
      body.provider = aiSettings.provider;
      body.apiKey = aiSettings.apiKey;
      if (aiSettings.model) body.model = aiSettings.model;
    }

    try {
      const exam = await post('/api/exams/quick-start', body, { timeout: 120000, retry: 0 });
      examNavigate(`/exams/${exam.id}/take`);
    } catch (e) {
      // Toast.error already shown by apiClient
    }
    setLoading(false);
  };


  return (
    <div style={styles.setupPanel}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #d93025 0%, #e37400 100%)', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(239,68,68,0.25)', flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#202124', letterSpacing: '-0.01em' }}>AI Exam</div>
            <div style={{ fontSize: 12, color: '#5f6368', marginTop: 2 }}>Timed · AI marked · Full feedback</div>
          </div>
        </div>
        {!embedded && (
          <>
            <label style={styles.label}>{t.textbookLabel}</label>
            <select style={styles.select} value={selectedBook}
              onChange={e => { setSelectedBook(e.target.value); setSelectedChapter(null); }}>
              {Object.entries(dataSource).map(([k, v]) => (
                <option key={k} value={k}>{k} — {typeof v.title === 'object' ? v.title[lang] || v.title.en || k : v.title}</option>
              ))}
            </select>
            <label style={styles.label}>{t.chapterOpt}</label>
            <select style={styles.select} value={selectedChapter?.id || ""}
              onChange={e => setSelectedChapter(dataSource[selectedBook]?.chapters.find(c => c.id === e.target.value) || null)}>
              <option value="">{t.mixedChapters}</option>
              {dataSource[selectedBook]?.chapters.map(c => (
                <option key={c.id} value={c.id}>Ch {c.num}: {typeof c.title === 'object' ? (c.title[lang] || c.title.en) : c.title}</option>
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            {
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
              value: NUM_QUESTIONS, label: t.numQLabel
            },
            {
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
              value: EXAM_MINUTES + " min", label: t.minLabel
            },
            {
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.24Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.24Z"/></svg>,
              value: "AI", label: t.markedByAI
            },
          ].map((item, i) => (
            <div key={i} style={{ background: "#e8f0fe", border: "1px solid #dadce0", borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#202124", lineHeight: 1 }}>{item.value}</div>
              <div style={{ fontSize: 11, color: "#5f6368", marginTop: 4 }}>{item.label}</div>
            </div>
          ))}
        </div>
        {loading ? <LoadingSpinner message={t.preparingExam} /> : (
          <button onClick={startExam} style={{ ...styles.btnPrimary, padding: "13px 24px", fontSize: 15 }}>{t.startExam}</button>
        )}
      </div>
    );
}

// ============================================================
// MOCK EXAM VIEW (Past Papers)
// ============================================================
function MockExamView({ nav, onAddError, t, lang, subject = "mathematics" }) {
  const [phase, setPhase] = useState("select");
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef();

  // Get the correct data source based on subject
  const isMath = subject === "mathematics";
  const dataSource = isMath ? CURRICULUM : (SUBJECTS[subject]?.books || {});

  const startMock = async (paper) => {
    setSelectedPaper(paper);
    setLoading(true);

    const getSubjectName = () => {
      const names = {
        mathematics: "Mathematics",
        economics: "Economics",
        history: "History",
        politics: "Politics",
        psychology: "Psychology",
        further_math: "Further Mathematics"
      };
      return names[subject] || "the subject";
    };

    const subjectName = getSubjectName();
    const examBoard = isMath ? "Cambridge" : "Pearson Edexcel";
    const system = `You are creating realistic ${examBoard} IAL ${subjectName} past paper questions. Sim ${paper.year} ${paper.session} ${paper.paper} paper. JSONulate questions from the only.`;
    const bookData = dataSource[paper.paper.replace(/[12]$/, "")] || dataSource[Object.keys(dataSource)[0]];
    const topics = bookData ? bookData.chapters.map(c => c.title).join(", ") : "Pure Mathematics";

    const prompt = `Create ${paper.questions} realistic past-paper style questions for Cambridge A-Level ${paper.paper} (${paper.year} ${paper.session}).
    
Topics to cover from this paper: ${topics}

Make questions feel like authentic Cambridge exam questions with realistic difficulty progression (Q1 easiest, last questions hardest).

Return ONLY JSON array:
[{"id":"q1","question":"...","marks":4,"options":{"A":"...","B":"...","C":"...","D":"..."},"correct":"B","solution":"Full worked solution with method marks explained...","topic":"...","difficulty":"..."}]`;

    try {
      const raw = await callAI(system, prompt, 3000);
      const clean = raw.replace(/```json|```/g, "").trim();
      const qs = JSON.parse(clean);
      setQuestions(qs);
      setAnswers({});
      setTimeLeft(paper.duration * 60);
      setPhase("exam");
    } catch (e) {
      alert("Failed to load paper. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (phase === "exam" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); submitMock(); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const submitMock = () => {
    clearInterval(timerRef.current);
    let correct = 0;
    const review = questions.map(q => {
      const isCorrect = answers[q.id] === q.correct;
      if (isCorrect) correct++;
      else if (onAddError) onAddError({ ...q, subject, timestamp: Date.now(), userAnswer: answers[q.id] });
      return { ...q, userAnswer: answers[q.id], isCorrect };
    });
    setResults({ correct, total: questions.length, review });
    setPhase("results");
  };

  const fmt = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  // Generate papers dynamically based on subject
  const papers = isMath ? PAST_PAPERS : Object.keys(dataSource).map((unit, idx) => ({
    year: 2024,
    session: "May/Jun",
    paper: unit,
    code: `WEC0${idx + 1}`,
    duration: 90,
    questions: 8,
    desc: dataSource[unit]?.title?.en || dataSource[unit]?.title || unit
  }));

  if (phase === "select") {
    return (
      <div style={styles.pageWrap}>
        <h2 style={styles.pageTitle}>{t.mockTitle}</h2>
        <p style={styles.pageDesc}>{isMath ? t.mockDesc : "Realistic mock exams based on past papers"}</p>
        {loading && <LoadingSpinner message={t.loadingPaper} />}
        <div style={styles.papersGrid}>
          {papers.map((paper, i) => (
            <div key={i} style={styles.paperCard}>
              <div style={styles.paperYear}>{paper.year}</div>
              <div style={styles.paperSession}>{paper.session}</div>
              <div style={styles.paperPaper}>{paper.paper}</div>
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
              <div style={styles.examQText}><MathText text={q.question} /></div>
              <div style={styles.examOptions}>
                {Object.entries(q.options || {}).map(([letter, text]) => {
                  const isSelected = answers[q.id] === letter;
                  return (
                    <button key={letter}
                      onClick={() => setAnswers(a => ({ ...a, [q.id]: letter }))}
                      style={{ ...styles.optionBtn, ...(isSelected ? styles.optionSelected : {}) }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${isSelected ? "#1a73e8" : "#CBD5E1"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "border-color 0.15s" }}>
                        {isSelected && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1a73e8" }} />}
                      </div>
                      <span style={styles.optionLetter}>{letter}</span>
                      <span>{text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <button onClick={submitMock} style={{ ...styles.btnPrimary, background: "#1a73e8", marginTop: 24 }}>
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
                <strong>{t.modelAnswer} ({q.correct}):</strong> <MathText text={q.solution} />
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
function ErrorBookView({ errors, onClear, nav, t, lang, subject = "mathematics" }) {
  const [selectedError, setSelectedError] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [loadingExp, setLoadingExp] = useState(false);

  const subjectName = {
    mathematics: "Mathematics",
    economics: "Economics",
    history: "History",
    politics: "Politics",
    psychology: "Psychology",
    further_math: "Further Mathematics"
  }[subject] || "A-Level";

  const getAIExplanation = async (err) => {
    setSelectedError(err);
    setLoadingExp(true);
    setExplanation("");
    const text = await callAI(
      `You are an A-Level ${subjectName} tutor. Explain the concept clearly and concisely for a student who got this wrong.$""`,
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
                <div style={styles.errorQuestion}><MathText text={err.question} /></div>
              </div>
              <div style={styles.errorCardBtns}>
                <button onClick={() => getAIExplanation(err)} style={styles.btnSmall}>{t.aiExplainBtn}</button>
                <button onClick={() => onClear(err.id)} style={styles.btnSmallDanger}>{t.removeBtn}</button>
              </div>
            </div>
            <div style={styles.errorAnswers}>
              <span style={styles.errorWrong}>{t.yourAnswerLabel} {err.userAnswer || t.noAnswer}</span>
              <span style={styles.errorCorrect}><MathText text={t.correctLabel + " " + err.correct} /></span>
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
    background: "#f8f9fa",
    color: "#202124",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    position: "relative",
    overflowX: "hidden",
  },
  bgDecor: {
    display: "none",
  },
  bgGrid: {
    display: "none",
  },
  header: {
    position: "sticky", top: 0, zIndex: 100,
    background: "#fff",
    borderBottom: "1px solid #dadce0",
  },
  headerInner: {
    maxWidth: 1080, margin: "0 auto", padding: "12px 24px",
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
    flexWrap: "wrap",
  },
  logoBtn: {
    background: "none", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", gap: 12, padding: 0,
  },
  logoSymbol: {
    fontSize: 28, fontWeight: 900, color: "#1a73e8",
    background: "#e8f0fe", width: 44, height: 44,
    display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: 8, border: "1px solid #aecbfa",
  },
  logoTitle: { fontSize: 16, fontWeight: 700, color: "#202124", letterSpacing: 0.5 },
  logoSub: { fontSize: 11, color: "#5f6368", marginTop: 2, letterSpacing: 1, textTransform: "uppercase" },
  subjectBadge: {
    padding: "6px 14px",
    borderRadius: 20,
    color: "#fff",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    border: "none",
    marginLeft: 8,
  },
  subjectCard: {
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    border: "2px solid #e0e0e0",
    transition: "all 0.3s ease",
  },
  headerNav: { display: "flex", gap: 6, flexWrap: "wrap" },
  navBtn: {
    background: "none", border: "1px solid transparent", borderRadius: 8,
    color: "#5f6368", fontSize: 13, padding: "7px 14px", cursor: "pointer",
    transition: "all 0.15s",
    position: "relative",
  },
  navBtnActive: {
    background: "#e8f0fe", borderColor: "transparent",
    color: "#1a73e8",
  },
  navLinkBtn: {
    background: "#e8f0fe", border: "1px solid transparent",
    borderRadius: 8, color: "#1a73e8", fontSize: 13, padding: "7px 14px",
    cursor: "pointer", transition: "all 0.15s",
    textDecoration: "none", display: "inline-block", whiteSpace: "nowrap",
  },
  langToggleBtn: {
    background: "#f1f3f4", border: "1px solid #dadce0",
    borderRadius: 8, color: "#202124", fontSize: 13, padding: "7px 14px",
    cursor: "pointer", transition: "all 0.15s",
    whiteSpace: "nowrap", flexShrink: 0,
  },
  badge: {
    position: "absolute", top: -4, right: -4,
    background: "#1a73e8", color: "#fff", borderRadius: "50%",
    width: 18, height: 18, fontSize: 10, display: "flex",
    alignItems: "center", justifyContent: "center",
  },
  main: { maxWidth: 1080, margin: "0 auto", padding: "32px 24px", position: "relative", zIndex: 1 },

  // Home
  homeWrap: { display: "flex", flexDirection: "column", gap: 48 },
  heroSection: { textAlign: "center", padding: "48px 24px" },
  heroTag: {
    display: "inline-block", padding: "6px 16px",
    border: "1px solid #aecbfa", borderRadius: 20,
    color: "#1a73e8", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 24,
  },
  heroTitle: { fontSize: "clamp(36px,5vw,60px)", fontWeight: 700, color: "#202124", margin: "0 0 16px", lineHeight: 1.2 },
  heroAccent: { color: "#1a73e8" },
  heroDesc: { fontSize: 17, color: "#5f6368", maxWidth: 580, margin: "0 auto 32px", lineHeight: 1.7 },
  heroBtns: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" },

  booksGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 },
  bookCard: {
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: 24, cursor: "pointer",
    transition: "all 0.2s",
  },
  bookIcon: { fontSize: 40, marginBottom: 8 },
  bookKey: { fontSize: 24, fontWeight: 700, color: "#202124" },
  bookTitle: { fontSize: 14, color: "#5f6368", marginTop: 4 },
  bookChapters: { fontSize: 13, color: "#80868b", marginTop: 8 },

  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 },
  featureCard: {
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: 20,
  },
  featureIcon: { fontSize: 28, marginBottom: 10 },
  featureTitle: { fontSize: 15, fontWeight: 600, color: "#202124", marginBottom: 8 },
  featureDesc: { fontSize: 13, color: "#5f6368", lineHeight: 1.6 },

  // Page
  pageWrap: { display: "flex", flexDirection: "column", gap: 24 },
  pageTitle: { fontSize: 28, fontWeight: 700, color: "#202124", margin: 0 },
  pageDesc: { color: "#5f6368", fontSize: 15, margin: 0, lineHeight: 1.6 },
  backBtn: {
    background: "none", border: "1px solid #dadce0", color: "#5f6368",
    padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, width: "fit-content",
  },

  // Curriculum
  bookTabs: { display: "flex", gap: 10, flexWrap: "wrap" },
  bookTab: {
    background: "#fff", border: "1px solid #dadce0",
    color: "#5f6368", padding: "10px 20px", borderRadius: 8, cursor: "pointer",
    fontSize: 14, display: "flex", alignItems: "center", gap: 8,
  },
  bookTabActive: { background: "#e8f0fe", borderColor: "#1a73e8", color: "#1a73e8" },

  chapterList: { display: "flex", flexDirection: "column", gap: 12 },
  chapterCard: {
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: 20, display: "flex", alignItems: "center", gap: 16,
    cursor: "pointer", transition: "all 0.2s",
  },
  chNum: {
    width: 40, height: 40, borderRadius: 8, display: "flex",
    alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700,
    color: "#fff", flexShrink: 0,
  },
  chInfo: { flex: 1 },
  chTitle: { fontSize: 16, fontWeight: 600, color: "#202124" },
  chOverview: { fontSize: 13, color: "#5f6368", marginTop: 4, lineHeight: 1.5 },
  chMeta: { display: "flex", gap: 10, marginTop: 10, alignItems: "center", flexWrap: "wrap" },
  diffBadge: { fontSize: 11, padding: "3px 8px", borderRadius: 4, color: "#202124", background: "transparent" },
  chMetaText: { fontSize: 12, color: "#80868b" },
  chArrow: { color: "#dadce0", fontSize: 20 },

  // Chapter
  chapterHeader: {
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: 28,
  },
  chapterBookBadge: {
    display: "inline-block", padding: "4px 12px", borderRadius: 20,
    fontSize: 12, color: "#fff", marginBottom: 12, fontFamily: "sans-serif",
  },
  chapterTitle: { fontSize: 26, fontWeight: 700, color: "#202124", margin: "0 0 12px" },
  chapterOverview: { color: "#5f6368", lineHeight: 1.7, margin: 0, fontSize: 15 },

  tabBar: { display: "flex", gap: 8, borderBottom: "1px solid #dadce0", paddingBottom: 0 },
  tab: {
    background: "none", border: "none", color: "#5f6368",
    padding: "10px 16px", cursor: "pointer", fontSize: 14,
    borderBottom: "2px solid transparent",
  },
  tabActive: { borderBottom: "2px solid #1a73e8", color: "#1a73e8" },

  // Learn
  learnContent: { display: "flex", flexDirection: "column", gap: 32 },
  learnSection: {},
  sectionHeader: {
    display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
  },
  sectionIconBox: {
    width: 32, height: 32, borderRadius: 8, display: "flex",
    alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0,
  },
  sectionTitle: { fontSize: 17, fontWeight: 700, color: "#202124", margin: 0 },
  keyPointsList: {
    listStyle: "none", padding: 0, margin: 0,
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 10,
  },
  formulasGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 },
  formulaCard: {
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: "14px 16px", position: "relative", overflow: "hidden",
  },
  formulaName: { fontSize: 11, color: "#80868b", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 600 },
  formulaExpr: {
    fontSize: 14,
    background: "#f8f9fa", padding: "10px 14px",
    borderRadius: 6, border: "1px solid #dadce0", lineHeight: 1.8,
    overflowX: "auto",
  },
  hardPointBox: {
    background: "#fef7e0", border: "1px solid #fdd663",
    borderRadius: 8, padding: 16, display: "flex", gap: 14, alignItems: "flex-start",
  },
  hardIcon: {
    width: 28, height: 28, background: "#f9ab00", borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: 14, fontWeight: 700, flexShrink: 0,
  },
  hardText: { color: "#5f6368", lineHeight: 1.7, margin: 0, fontSize: 13 },

  // Videos
  videoIntro: { color: "#5f6368", fontSize: 14, marginBottom: 4 },
  videoCard: {
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: 18, display: "flex", gap: 16, alignItems: "center",
    cursor: "pointer", textDecoration: "none", marginBottom: 12,
    transition: "all 0.2s",
  },
  videoThumb: {
    width: 60, height: 44, background: "#1a73e8", borderRadius: 6,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20, color: "#fff", flexShrink: 0,
  },
  videoInfo: {},
  videoTitle: { fontSize: 15, fontWeight: 600, color: "#202124" },
  videoChannel: { fontSize: 13, color: "#5f6368", marginTop: 3 },
  videoHint: { fontSize: 12, color: "#1a73e8", marginTop: 6 },
  videoCardAlt: {
    display: "block", textAlign: "center", padding: 14,
    background: "#e8f0fe", border: "1px solid #aecbfa",
    borderRadius: 8, color: "#1a73e8", textDecoration: "none", fontSize: 14,
  },

  // Quiz/Exam Setup
  setupPanel: {
    width: "100%", maxWidth: 480, margin: "0 auto", background: "#fff",
    border: "1px solid #dadce0", borderRadius: 8, padding: "28px 28px 28px",
    display: "flex", flexDirection: "column", gap: 18,
    boxShadow: "0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)",
  },
  setupTitle: { fontSize: 20, fontWeight: 700, color: "#202124", margin: 0 },
  label: { fontSize: 11, color: "#80868b", marginBottom: -10, textTransform: "uppercase", letterSpacing: 0.7, fontWeight: 600 },
  select: {
    background: "#f8f9fa", border: "1px solid #dadce0",
    color: "#202124", padding: "10px 14px", borderRadius: 8, fontSize: 14,
    fontFamily: "inherit", width: "100%", outline: "none",
  },
  diffRow: { display: "flex", gap: 8 },
  diffBtn: {
    flex: 1, background: "#f8f9fa", border: "1px solid #dadce0",
    color: "#5f6368", padding: "11px 16px", borderRadius: 8, cursor: "pointer",
    fontSize: 13, fontWeight: 500, transition: "all 0.15s",
  },
  diffBtnActive: { background: "#e8f0fe", borderColor: "#aecbfa", color: "#1a73e8", fontWeight: 600 },
  examInfo: {
    display: "flex", gap: 20, justifyContent: "center",
    color: "#5f6368", fontSize: 12, flexWrap: "wrap",
    padding: "10px 0", borderTop: "1px solid #dadce0",
  },

  // Quiz Panel
  quizPanel: { maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 },
  quizProgress: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    paddingBottom: 14, borderBottom: "1px solid #dadce0",
    flexWrap: "wrap", gap: 8,
  },
  diffTag: {
    padding: "4px 12px", borderRadius: 20, color: "#fff",
    fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
  },
  questionBox: {
    background: "#f8f9fa", border: "1px solid #dadce0",
    borderRadius: 8, padding: "22px 26px",
  },
  questionText: { fontSize: 16, color: "#202124", lineHeight: 1.85 },
  optionsGrid: { display: "flex", flexDirection: "column", gap: 8 },
  optionBtn: {
    background: "#fff", border: "1px solid #dadce0",
    color: "#202124", padding: "13px 16px", borderRadius: 8, cursor: "pointer",
    fontSize: 14, textAlign: "left", display: "flex", alignItems: "center", gap: 12,
    transition: "all 0.15s",
  },
  optionSelected: { background: "#e8f0fe", borderColor: "#1a73e8", color: "#1a73e8", boxShadow: "0 0 0 1px rgba(26,115,232,0.2)" },
  optionCorrect: { background: "rgba(22,163,74,0.07)", borderColor: "#16A34A", color: "#15803D" },
  optionWrong: { background: "rgba(217,48,37,0.06)", borderColor: "#d93025", color: "#c5221f" },
  optionLetter: {
    width: 26, height: 26, background: "#f1f3f4", borderRadius: 6,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontWeight: 700, flexShrink: 0, color: "#5f6368",
    letterSpacing: 0.3,
  },
  feedbackBox: {
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: 0, display: "flex", flexDirection: "column", gap: 0,
    overflow: "hidden",
  },
  feedbackHeader: {
    display: "flex", alignItems: "center", gap: 14,
    padding: "16px 20px", borderBottom: "1px solid #dadce0",
  },
  feedbackSolution: { fontSize: 14, color: "#202124", lineHeight: 1.6 },
  feedbackConcept: { fontSize: 13, color: "#5f6368" },

  // Rich explanation styles
  explanationBlock: {
    padding: "14px 20px",
    borderBottom: "1px solid #f1f3f4",
  },
  explanationLabel: {
    fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
    textTransform: "uppercase", color: "#80868b", marginBottom: 8,
  },
  formulaHighlight: {
    fontFamily: "monospace", fontSize: 15, color: "#1967d2",
    background: "#e8f0fe", border: "1px solid #aecbfa",
    borderRadius: 6, padding: "10px 14px", lineHeight: 1.6,
  },
  solutionSteps: {
    fontSize: 14, color: "#1a73e8", lineHeight: 1.8,
    background: "#e8f0fe", borderRadius: 6,
    padding: "10px 14px", fontFamily: "monospace",
  },
  deepExplain: {
    fontSize: 14, color: "#202124", lineHeight: 1.85,
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
    fontSize: 12, fontWeight: 700, color: "#202124",
  },
  wrongReason: {
    fontSize: 13, color: "#5f6368", lineHeight: 1.6, paddingTop: 4,
  },

  // Result panel (Quiz)
  resultPanel: {
    maxWidth: 420, margin: "20px auto", textAlign: "center",
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: "44px 40px", boxShadow: "0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)",
  },
  resultScore: { fontSize: 72, fontWeight: 700, color: "#1a73e8", lineHeight: 1, letterSpacing: -2 },
  resultLabel: { fontSize: 14, color: "#80868b", marginBottom: 14, marginTop: 6 },
  resultGrade: { fontSize: 18, color: "#202124", fontWeight: 600, marginBottom: 28, padding: "10px 20px", background: "#f8f9fa", borderRadius: 8, display: "inline-block" },
  resultBtns: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" },

  // Exam
  examPanel: { display: "flex", flexDirection: "column", gap: 20 },
  examHeader: {
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: "14px 20px", display: "flex", justifyContent: "space-between",
    alignItems: "center", flexWrap: "wrap", gap: 12,
  },
  examTitle: { fontSize: 15, fontWeight: 700, color: "#202124" },
  examSubtitle: { fontSize: 12, color: "#80868b", marginTop: 2 },
  timer: {
    fontSize: 22, fontWeight: 700, color: "#1a73e8",
    background: "#e8f0fe", padding: "6px 16px", borderRadius: 8,
    fontFamily: "monospace", letterSpacing: 1,
  },
  timerUrgent: { color: "#d93025", background: "#fce8e6", animation: "pulse 1s infinite" },
  examProgress: { fontSize: 13, color: "#5f6368" },
  examInstructions: {
    background: "#e8f0fe", border: "1px solid #aecbfa",
    borderRadius: 8, padding: 12, fontSize: 13, color: "#1a73e8",
  },
  examQuestions: { display: "flex", flexDirection: "column", gap: 20 },
  examQuestion: {
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: "20px 24px",
  },
  examQHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 },
  examQNum: {
    background: "#202124", color: "#fff",
    padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
  },
  examQMarks: {
    color: "#5f6368", fontSize: 11, fontWeight: 600,
    background: "#f1f3f4", padding: "3px 10px", borderRadius: 20,
  },
  examQText: { fontSize: 15, color: "#202124", lineHeight: 1.75, marginBottom: 14 },
  examOptions: { display: "flex", flexDirection: "column", gap: 8 },

  // Results (Exam)
  resultsPanel: { display: "flex", flexDirection: "column", gap: 24 },
  resultsHeader: {
    textAlign: "center", background: "#1a73e8",
    borderRadius: 8, padding: "40px 36px", color: "#fff",
  },
  resultsGrade: { fontSize: 80, fontWeight: 700, color: "#fff", lineHeight: 1 },
  resultsScore: { fontSize: 22, color: "rgba(255,255,255,0.7)", marginTop: 10 },
  resultsLabel: { fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 8 },
  umsScore: { fontSize: 15, color: "#fff", marginTop: 12 },
  gradeBands: { display: "flex", gap: 8, flexWrap: "wrap" },
  gradeBand: {
    padding: "8px 16px", borderRadius: 8, display: "flex", alignItems: "center",
    gap: 8, fontSize: 13,
  },
  gradeBandLabel: { fontWeight: 700, color: "#202124" },
  gradeBandPct: { color: "#5f6368" },
  gradeBandCheck: { color: "#188038" },
  reviewTitle: { fontSize: 18, fontWeight: 700, color: "#202124", margin: "0 0 4px" },
  reviewList: { display: "flex", flexDirection: "column", gap: 14 },
  reviewItem: {
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: 18,
  },
  reviewHeader: { display: "flex", justifyContent: "space-between", fontSize: 14, color: "#5f6368", marginBottom: 10, flexWrap: "wrap", gap: 8 },
  reviewQuestion: { fontSize: 15, color: "#202124", lineHeight: 1.6, marginBottom: 10 },
  reviewSolution: { fontSize: 13, color: "#5f6368", lineHeight: 1.6, background: "#f8f9fa", padding: 12, borderRadius: 6 },
  reviewTopic: { fontSize: 12, color: "#80868b", marginTop: 6 },
  aiExplanation: {
    fontSize: 13, color: "#1967d2", marginTop: 10, padding: 10,
    background: "#e8f0fe", borderRadius: 6,
  },

  // Mock exam papers
  papersGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 },
  paperCard: {
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: 22, display: "flex", flexDirection: "column", gap: 8,
    textAlign: "center",
  },
  paperYear: { fontSize: 28, fontWeight: 700, color: "#202124" },
  paperSession: { fontSize: 13, color: "#5f6368" },
  paperPaper: { fontSize: 18, color: "#1a73e8", fontWeight: 600 },
  paperMeta: { display: "flex", justifyContent: "center", gap: 14, color: "#5f6368", fontSize: 13, margin: "4px 0" },

  // Error Book
  errorList: { display: "flex", flexDirection: "column", gap: 14 },
  errorCard: {
    background: "#fce8e6", border: "1px solid #fad2cf",
    borderRadius: 8, padding: 18,
  },
  errorCardActive: { borderColor: "#f5bcba", background: "#fce8e6" },
  errorCardHeader: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" },
  errorChapter: { fontSize: 12, color: "#80868b", marginBottom: 6, display: "block" },
  errorQuestion: { fontSize: 15, color: "#202124", lineHeight: 1.5 },
  errorCardBtns: { display: "flex", gap: 8, flexShrink: 0 },
  errorAnswers: { display: "flex", gap: 16, marginTop: 12, fontSize: 13, flexWrap: "wrap" },
  errorWrong: { color: "#d93025" },
  errorCorrect: { color: "#188038" },
  explanationBox: {
    marginTop: 14, background: "#f8f9fa", borderRadius: 8,
    padding: 16, borderLeft: "3px solid #1a73e8",
  },
  explanationText: { color: "#202124", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap" },
  errorCount: { fontSize: 16, color: "#d93025", fontWeight: 400, marginLeft: 10 },
  emptyState: { textAlign: "center", padding: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 },
  emptyIcon: { fontSize: 60 },
  emptyText: { fontSize: 20, color: "#202124" },
  emptyDesc: { color: "#5f6368", fontSize: 15, maxWidth: 340 },

  // Buttons
  btnPrimary: {
    background: "#1a73e8",
    border: "none", color: "#FFFFFF",
    padding: "12px 24px", borderRadius: 8, fontSize: 15, fontWeight: 600,
    cursor: "pointer", transition: "all 0.15s",
    alignSelf: "flex-start",
  },
  btnSecondary: {
    background: "#fff", border: "1px solid #dadce0",
    color: "#202124", padding: "11px 22px", borderRadius: 8, fontSize: 14,
    cursor: "pointer",
  },
  btnSmall: {
    background: "#e8f0fe", border: "1px solid #aecbfa",
    color: "#1a73e8", padding: "6px 12px", borderRadius: 6, fontSize: 12,
    cursor: "pointer",
  },
  btnSmallDanger: {
    background: "#fce8e6", border: "1px solid #fad2cf",
    color: "#d93025", padding: "6px 12px", borderRadius: 6, fontSize: 12,
    cursor: "pointer",
  },

  // Loading
  loading: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: 40 },
  spinner: {
    width: 36, height: 36,
    border: "3px solid #d2e3fc",
    borderTop: "3px solid #1a73e8",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingMsg: { color: "#5f6368", fontSize: 14 },
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
