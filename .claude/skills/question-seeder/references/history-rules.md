# History 出题规则（占位）

> ⚠️ **本学科规范完全未沉淀。给 History 出题前必须警告用户。**

按 4 月 4 日设计文档，History 是**第二批**研究项，但目前：

- 单元划分：WHI01-04（未校核）
- 章节细分：DB 实际格式待 list-chapters.mjs 验证
- **题型规范完全未研究**（History 是 source-based 评分，与数理学科完全不同）
- Source-based 评分标准未沉淀
- 真题样本：未提供

---

## 给主代理的指引

如果用户要求 History 出题，**先严肃劝阻**：

> "History 不像数理学科可以靠通用铁律兜底——它的核心评分维度是 source analysis、historical context、interpretation comparison 等，需要真实材料引用。我目前没有任何 IAL History 的 mark scheme 规范和 source 库。
> 
> 我建议先做这些事：
> 1. 你提供 IAL History past papers + mark scheme 到 `docs/exam-specs/raw/`
> 2. 我先研究 1-2 套真题，沉淀 `docs/exam-specs/WHI01.md` 等规范文档
> 3. 然后再回来建 History 出题流程
> 
> 现在硬出会产生不合格的题目污染题库。要继续吗？"

如果用户**仍坚持**要出，按"知识点选择题"方式降级处理：

1. 跑 `list-chapters.mjs history` 拿真实 chapter_id
2. 出题代理 prompt：要求出 `multiple_choice` 类型的史实/年代/人物记忆题（不出论述题）
3. 入库 status 强制 `'reviewed'`
4. 汇报里加重警告："本批为简化版 History 选择题，不符合 IAL Source-based 评分标准。建议先用作日常记忆训练，不能用于模考。"

---

## 后续完善路径

同 further-math-rules.md，需要：

1. 用户先提供 IAL History 真题
2. 主代理研究 source-based 评分模型
3. 产出 WHI01-04 完整规范
4. 升级本文件
