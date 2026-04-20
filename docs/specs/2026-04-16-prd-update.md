# A-Level Hub — PRD 更新文档

**版本**：v2.1
**创建**：2026-04-16
**最后更新**：2026-04-17
**状态**：🔄 部分完成，持续迭代

---

## 一、当前产品状态（Baseline）

### 已上线功能

| 模块 | 路由 | 状态 |
|------|------|------|
| 首页 / 知识点浏览 | `/` | ✅ 稳定 |
| 注册 / 登录 | `/login` `/register` | ✅ 稳定 |
| 快速练习 | `/practice` | ✅ 稳定 |
| 章节考试 | `/exams/create` `/exams/:id/take` | ✅ 稳定 |
| 考试列表 / 结果 | `/exams` `/exams/:id/result` | ✅ 稳定 |
| AI 学习计划 | `/learning-plan` | ✅ 稳定 |
| 错题本 | `/wrong-questions` | ✅ 稳定（已含 Retry + 持久化掌握） |
| Mock Exam 正式模式 | `/past-papers` | ✅ 已上线（v2.1 新增） |
| 用户资料 | `/profile` | ✅ 稳定 |
| 题库上传（Admin） | `/questions/upload` | ✅ 稳定 |

---

## 二、本轮开发目标（v2.1 回顾）

> 目标：打通"做真题"闭环，修复进度和错题两条核心数据链路。

### 完成状态总览

| 优先级 | 功能 | 类型 | 状态 |
|--------|------|------|------|
| P0 | Past Papers / Mock Exam 页面 | 新功能 | ✅ 已上线 |
| P0 | 进度条写入修复 | Bug 修复 | ✅ 已修复（部分场景） |
| P1 | 错题本：重做（Retry） | 功能完善 | ✅ 已完成 |
| P1 | 错题标记掌握持久化（DB） | Bug 修复 | ✅ 已完成 |
| P2 | Practice 错题写入错题本 | 数据修复 | ❌ 待开发 |

---

## 三、功能需求详述

---

### F1：Past Papers / Mock Exam（`/past-papers`）✅ 已上线

#### 实际实现（与原计划的偏差说明）

原计划：使用官方历年真题 JSON 文件 + 扫描图，构建独立数据管道。

**实际落地**：采用更轻量的路径 —— 复用现有 `question_sets` 数据库表（`type='mock_exam'`），人工录入模拟卷题目。

> **决策理由**：官方真题录入成本高（需扫描识别+人工校对），MVP 阶段用人工出题的 Mock Paper 可立即验证完整考试流程。后续积累后可迁移至官方真题。

#### 当前能力

- `/past-papers` 列出数据库中所有 `type='mock_exam'` 题集卡片
- 卡片显示：标题、描述、时长、题目数、总分
- 点击 "Start Exam →" 进入全屏考试模式（MockExamView）
- 考试模式：计时器倒计时、题目导航、AnswerInput 答题区（含数学符号键盘）
- 提交后进入结果页（AI 批改，逐题展示）
- 历史记录可在 `/exams` 查看（`type='mock_exam'`）

#### 已有数据

| 试卷 | question_sets ID | 题目数 | 总分 | 时长 | 状态 |
|------|-----------------|--------|------|------|------|
| WMA12/01 Mock Paper — May 2026 | 28 | 10 | 75 | 90min | ✅ 已入库 |

#### 验收状态

- [x] `/past-papers` 可访问，展示 WMA12 试卷卡片
- [x] 进入试卷可做题，倒计时正常
- [x] 提交后展示 AI 批改得分和解析
- [x] Navbar 有 "Past Papers" 入口
- [x] 首页 Quick Actions 卡片跳转 `/past-papers`

#### 后续迭代方向

- 扩充题集：出 WMA11/P1、WEC11/U1 等更多 Mock Paper（用 `/mock-paper` skill）
- 按学科/难度筛选卡片
- 官方历年真题录入（长期，需人工+AI 辅助）

---

### F2：学习进度修复（Progress Tracking）✅ 基本完成

#### 修复内容

| 场景 | 触发文件 | 写入内容 | 状态 |
|------|---------|---------|------|
| Practice 一轮结束 | `PracticeView.jsx` | `status: masteryLevel ≥ 70% ? 'completed' : 'in_progress'`，含 masteryLevel + timeSpent | ✅ |
| Exam 结果页加载 | `ExamResultPage.jsx` | `status: 'in_progress'`，为每个涉及章节写入 | ⚠️ 见注 |

> **⚠️ 已知偏差**：ExamResultPage 目前统一写入 `in_progress`，未按成绩判定 `completed`。原 PRD 要求"正确率 ≥ 60% 写 completed"。实际原因：结果页加载时成绩数据还在渲染中，判定逻辑需异步等待批改完成。
>
> **后续修复方向**：在 ExamResultPage 拿到 `examData.score / examData.totalScore` 后，按 ≥ 60% 判定写入 `completed`。

#### 验收状态

- [x] 完成 Practice 后，对应章节进度更新（masteryLevel 写入 DB）
- [x] 完成 Exam 后，涉及章节标记 in_progress
- [ ] Exam 成绩 ≥ 60% 时自动标记 `completed`（待修复）
- [x] 重复完成同一章节不重复计数（后端 upsert 逻辑已实现）

---

### F3：错题本完善

#### F3-a 重做错题 ✅ 已完成

每道错题旁有 **"Retry Chapter"** 按钮，点击跳转到对应章节的 Practice 模式。

实现细节：
- `getSubjectFromChapterId()` 从 chapterId 前缀推断学科（pol→politics，e→economics 等）
- `navigate('/practice?chapter=xxx&subject=xxx')` 精确定位章节，无需手动三级选择

验收状态：
- [x] 错题本每道题有 "Retry Chapter" 按钮
- [x] 点击后进入对应章节练习，不需要手动三级选择

---

#### F3-b 掌握状态持久化 ✅ 已完成

"Mark as Mastered" 状态现在**真实写入数据库**（之前是 localStorage 临时存储）。

实现细节：
- DB：`exam_question_results` 表新增 `is_mastered boolean` 列（已存在于 Supabase）
- 后端：`POST /api/wrong-questions/:id/master` 实际执行 Drizzle `update`，含用户所有权验证
- 前端：页面加载时以服务端 `isMastered` 为准初始化状态，localStorage 仅作离线缓存
- 支持切换：传 `{ mastered: true/false }` 可标记/取消标记

验收状态：
- [x] 标记已掌握后，换设备登录仍能看到掌握状态
- [x] 后端真正写入 DB，不再是空 stub

---

#### F3-c Practice 错题写入 ❌ 待开发

**需求**：练习答错的题目应出现在错题本（`/wrong-questions`）。

**现状**：PracticeView 答错后只更新本地 `roundResults`，从未调用错题记录 API。

**实现方案**：

在 `PracticeView.jsx` 的 `handleNext`（每轮结束时）或即时答题后，将答错的题目写入：

```js
// 在 handleNext 最终汇总 allResults 时
const wrongResults = allResults.filter(r => r.isCorrect === false)
wrongResults.forEach(r => {
  post('/api/wrong-questions', {
    questionId: r.questionId,
    userAnswer: r.userAnswer,
    examId: null,         // practice 无 examId，需确认后端是否允许 null
    chapterId: chapterId,
    type: 'practice',
  }).catch(() => {})
})
```

> **产品决策点**：`/api/wrong-questions` 的 POST 接口目前要求 `examId`（关联考试记录）。Practice 没有 examId，需确认：
> - 方案 A：为 Practice 创建一个虚拟 `examId`（type='practice'，自动建一条考试记录）
> - 方案 B：wrongQuestions 后端允许 `examId = null`，practice 错题单独存
> - 方案 C：新建 `practice_wrong_questions` 表

**验收标准**（待开发）：
- [ ] Practice 做题答错 → 错题本 `/wrong-questions` 可见
- [ ] 错题本 Type 筛选新增 "Practice" 选项
- [ ] 不重复添加（同一题答错多次只记一条）

---

### F4：数学符号键盘 ✅ 已完成（原为 Out of Scope，已提前实现）

`AnswerInput` 组件现在对所有非 MCQ 题型显示符号键盘。

- **15个符号**：`√ ² ³ ∫ θ π ≥ ≤ ≠ × ÷ ± ∞ → ∑`
- **光标插入**：使用 `onMouseDown + e.preventDefault()` 防止 input 失焦，`requestAnimationFrame` 恢复光标位置
- **样式**：Google Clean 配色，hover/active 状态，与现有组件一致

---

## 四、暂不开发（Out of Scope）

| 功能 | 原因 |
|------|------|
| Economics e3/e4 题库 | 暂未学到，搁置 |
| Further Math 题库 | 暂未学到，搁置 |
| Onboarding 引导流程 | 当前主要自用，人少不急 |
| keyPoints 格式迁移（加 zh 字段） | 全站去中文化，不需要双语 |
| History / Politics / Psychology keyPoints 迁移 | 不着急，按需推进 |
| Past Papers 官方历年真题 JSON 录入 | 成本高，用 Mock Paper 代替 |

---

## 五、技术约束（不变）

- 前端禁止新建 CSS 文件，禁止 Tailwind，使用内联 style 对象
- 保留例外：`animations.css` / `QuestionCard.css` / `AnswerInput.css` / `Loading.css` / `Toast.css`
- 颜色使用 Google Clean 配色（主色 `#1a73e8`）
- 包管理器必须使用 **bun**（禁止 npm/yarn）
- 新路由在 `AppRouter.jsx` 中注册，需 `ProtectedRoute` 包裹
- `apiClient.get/post` 返回已解包的 `data.data`，不是 `{success, data}` 包装

---

## 六、验收 Checklist（v2.1 整体）

- [x] F1：`/past-papers` 可访问，WMA12 Mock Paper 可完整作答
- [x] F2：Practice 完成后进度更新（非 0%）
- [x] F2：Exam 完成后涉及章节标记 in_progress
- [ ] F2：Exam 成绩 ≥ 60% 时标记 completed（待修复）
- [x] F3a：错题本有 "Retry Chapter" 按钮，跳转正确
- [x] F3b：掌握状态写入 DB，换设备不丢失
- [ ] F3c：Practice 错题出现在错题本（待开发）
- [x] F4：AnswerInput 数学符号键盘正常工作
- [x] `bun run build` 无报错
- [x] Vercel 前端 + Render 后端均已部署（commit `af12f8b`）

---

## 七、下一步待确认事项

| # | 问题 | 背景 |
|---|------|------|
| Q1 | F3c Practice 错题：选哪个方案（A/B/C）？ | 见 F3-c 产品决策点 |
| Q2 | F2 Exam 进度：ExamResultPage 何时修复为按分数判定 completed？ | 当前统一写 in_progress |
| Q3 | Past Papers 下一套 Mock Paper：出 WMA11/P1 还是 WEC11/U1？ | 用 `/mock-paper` skill 生成 |
