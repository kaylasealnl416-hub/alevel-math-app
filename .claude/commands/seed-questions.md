---
description: 触发 question-seeder skill 出题。用法：/seed-questions <chapter_id> <题数> [难度] —— 例：/seed-questions p1c3 5 4
---

# /seed-questions

显式触发 question-seeder skill 为 alevel-math-app 出题入库。

参数解析（位置参数）：
1. **chapter_id 或学科/单元名**（必填）：如 `p1c3` / `e1c2` / `P1` / `Unit1` / `WMA11` / `mathematics`
2. **题数**（必填）：每章节题数
3. **难度**（可选）：1-5 数字或范围（如 `4` / `4-5` / `高阶`）

如果用户参数不全或表达模糊，按 SKILL.md Step 1 的规则一次问一个补齐。

调用：直接进入 question-seeder skill 的 Step 1 工作流（位于 `.claude/skills/question-seeder/SKILL.md`）。

示例：

- `/seed-questions p1c3 5 4` → 给联立方程章出 5 道难度 4 的题
- `/seed-questions e1c2 3 高阶` → 给需求弹性章出 3 道高难度题
- `/seed-questions P1 完整模拟卷` → 按 WMA11/01 卷结构出整份模拟卷
- `/seed-questions Econ Unit1 一套` → 按 WEC11/01 出整套（80 分）
