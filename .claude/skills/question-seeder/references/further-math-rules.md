# Further Math 出题规则（占位）

> ⚠️ **本学科规范不全。给 Further Math 出题前必须警告用户。**

按 4 月 4 日设计文档（`docs/exam-specs/skill-design-discussion.md`），Further Math 是**第二批**研究项，目前：

- 单元划分：WFM01-04（待官方 spec 校核）
- 章节细分：CLAUDE.md 提到前缀 `fm` / `fmech` / `fs`，DB 实际格式待 list-chapters.mjs 验证
- 题型规范：未沉淀
- Mark scheme 规范：未沉淀
- 真题样本：尚未提供（用户需放入 `docs/exam-specs/raw/` 对应 PDF）

---

## 给主代理的指引

如果用户要求 Further Math 出题，按以下顺序处理：

1. **告知现状**："Further Math 的出题规范我还没沉淀完整。我可以基于 IAL 通用 Math 标准（P1-P4 的 Mark scheme 体系、倒推法）出题，但题型可能与真题有偏差。要继续吗？"
2. 用户确认继续 → 跑 `list-chapters.mjs further-math` 拿真实 chapter_id
3. 出题代理 prompt **降级使用 mathematics-rules.md 的通用铁律**（M/A/B 评分、倒推法、特殊角/勾股数）
4. 入库后**强制 status: 'reviewed'**，不允许直跳 published（用户必须人工审）
5. 在汇报里附一句："本批为 Further Math 草版题，建议你或学科顾问再过一遍。"

---

## 后续完善路径

按 4 月设计文档"步骤 2 研究出题规范"——需要：

1. 用户提供 Further Math 真题/教材到 `docs/exam-specs/raw/`
2. 主代理研究后产出 `docs/exam-specs/WFM01.md` ... `docs/exam-specs/WFM04.md`
3. 把本文件升级为浓缩版（参考 mathematics-rules.md 的写法）
