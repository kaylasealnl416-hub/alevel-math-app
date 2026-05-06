# Economics 出题规则（浓缩版）

完整规范在 `docs/exam-specs/WEC1{1-4}.md`。

---

## 通用铁律（所有 Econ 单元适用）

1. **MCQ 真实情境**：每个 MCQ 必须有 1-2 句真实场景（国家+数据+年份），不能纯概念问答
2. **错误选项需附 K/A 级解释**：4 个选项每个错误项要有简短理由说明为何错
3. **倒推法**：弹性、乘数、GDP 增长率等计算用清洁数字
4. **章节对应严格**：U1 微观 / U2 宏观 / U3 商业 / U4 全球，不能跨单元混题
5. **Mark scheme 用 K(Knowledge) / A(Application) / AN(Analysis) / EV(Evaluation) 体系**

---

## 评分体系详解（必须严格遵守）

### MCQ（1 分）
- 必须有真实情境引子
- 4 个选项 A/B/C/D，每个错误项给 1 句话理由

### 4 分题（K1 + A1 + AN2）— Section B 用
- K1：定义/公式（1 句）
- A1：引用题目情境（1 句）
- AN2：两步因果链（2-3 句）
- 总长约 60-80 词

### 14 分题 (Section C e 小问)：KAA 8 分 + EV 6 分
- Level 3 KAA：两个完整分析链，双向考虑
- Level 3 EV：平衡评价 + 有条件支撑的明确结论

### 20 分题 (Section D)：KAA 12 分 + EV 8 分
- Level 4 KAA：全面深入，数据支撑，多层次
- Level 3 EV：平衡评价 + 明确结论
- 约 300-350 词

---

## Unit 1 (WEC11/01) — Markets in Action

**80 分 / 1h45min**

**试卷结构**：
| Section | 题号 | 类型 | 分值 |
|---|---|---|---|
| A | Q1-Q6 | MCQ（4 选 1，无需材料） | 6 |
| B | Q7-Q11 | 独立短答（4 分） | 20 |
| C | Q12 | 数据分析大题（5 小问，基于 Extract） | 34 |
| D | Q13/Q14 | 二选一论述评价 | 20 |

**Section C 固定拆分**：(a)2 + (b)4-6 + (c)6-8 + (d)6-8 + (e)14

**章节**：
| chapter_id | 章节 |
|---|---|
| e1c1 | The Nature of Economics & Basic Concepts |
| e1c2 | Demand & Consumer Behaviour（PED/YED/XED） |
| e1c3 | Supply & Producer Behaviour |
| e1c4 | Market Equilibrium |
| e1c5 | Market Failure（外部性、公共品） |
| e1c6 | Government Intervention（税、补贴、价格管制） |

**详细规范** → `docs/exam-specs/WEC11-U1.md`

---

## Unit 2 (WEC12/01) — Macroeconomic Performance and Policy

**80 分 / 1h45min**，与 U1 完全相同的四段式结构。

**章节**：
| chapter_id | 章节 |
|---|---|
| e2c1 | Economic Performance Measures（GDP/CPI/失业率） |
| e2c2 | Aggregate Demand（C+I+G+X-M） |
| e2c3 | Aggregate Supply（SRAS/LRAS） |
| e2c4 | National Income（循环流量、乘数效应） |
| e2c5 | Economic Growth |
| e2c6 | Macroeconomic Policy（财政/货币/供给侧） |

**详细规范** → `docs/exam-specs/WEC12-U2.md`

---

## Unit 3 (WEC13/01) — Business Behaviour

**⚠️ 80 分 / 2h，结构与 U1/U2 不同！**

| Section | 题号 | 类型 | 分值 |
|---|---|---|---|
| A | Q1-Q6 | MCQ | 6 |
| B | Q7 | 数据分析大题（5 小问） | 34 |
| C | Q8/Q9/Q10 | **三选二**论述评价（各 20） | 40 |

**注意**：无 Section B 短答；Section C 三选二，总 40 分（不是 20）。

**章节**：
| chapter_id | 章节 |
|---|---|
| e3c1 | Business Types & Size（规模经济） |
| e3c2 | Revenue, Costs & Profit（TR/MR/AR、TC/MC/AC） |
| e3c3 | Market Structure（完全竞争/垄断/寡头） |
| e3c4 | Labour Market（MRP、最低工资） |
| e3c5 | Government Intervention & Competition Policy |

**详细规范** → `docs/exam-specs/WEC13-U3.md`

---

## Unit 4 (WEC14/01) — Developments in the Global Economy

**80 分 / 2h**，与 U3 相同的三段式结构。

**章节**：
| chapter_id | 章节 |
|---|---|
| e4c1 | Globalisation（MNC/FDI/全球价值链） |
| e4c2 | International Trade（比较优势/关税/WTO） |
| e4c3 | Balance of Payments |
| e4c4 | Exchange Rates（Marshall-Lerner、J 曲线） |
| e4c5 | Inequality & Poverty（基尼系数） |
| e4c6 | Economic Development（HDI、Harrod-Domar） |

**详细规范** → `docs/exam-specs/WEC14-U4.md`

---

## 出题代理 prompt 拼装时

每个 Econ 单元的 `docs/exam-specs/WEC1X-UX.md` 里都有完整的 **Gemini Prompt 模板**（已在生产中验证）。直接引用，并加上：

1. JSON 数组输出格式（参考 `references/db-schema.md` 的 MCQ 样例）
2. 中英 + LaTeX（Econ 多文字少公式，latex 字段常为空字符串）
3. tags 用中文知识点（如 `["需求弹性", "PED", "弹性分类"]`）
4. estimatedTime：MCQ ≈ 90s，4 分题 ≈ 240s，14 分题 ≈ 1200s，20 分题 ≈ 1800s

---

## Econ 题型映射到 DB 的 type 字段

| 题型 | DB type |
|---|---|
| MCQ（Section A） | `multiple_choice` |
| 4 分短答（Section B） | `calculation` 或 `fill_blank`（视题目而定） |
| 数据分析小问（Section C 各 sub-part） | `calculation`（计算/分析）或 `proof`（论述） |
| 论述题（Section D） | `proof`（IAL Econ 没有"essay"枚举值，借用 proof） |
