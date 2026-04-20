# Phase 4 实施计划：考试系统与智能评估

**创建时间**：2026-03-09
**状态**：📋 规划中
**预计周期**：12 天
**前置条件**：Phase 0-3 已完成

---

## 📋 项目背景

### 已完成的基础
- ✅ **Phase 0**：前后端分离架构、数据库、RESTful API
- ✅ **Phase 1**：用户系统、学习进度追踪
- ✅ **Phase 2**：AI 集成（智谱 GLM-4-Plus）
- ✅ **Phase 3**：持久化题库、AI 出题、智能组卷、练习系统、AI 批改

### Phase 4 目标
建立完整的**考试系统**，提供模拟考试、成绩分析、薄弱点诊断、学习建议等功能，形成完整的"学-练-考-评"闭环。

### 核心价值
- 🎯 **真实考试体验**：计时、禁止切换、完整流程
- 📊 **深度数据分析**：成绩报告、薄弱点诊断、进步追踪
- 🤖 **AI 智能点评**：逐题讲解、知识点关联、改进建议
- 📈 **学习路径优化**：基于考试结果推荐学习内容

---

## 🎯 功能模块设计

### 模块 1：考试管理系统

#### 1.1 考试类型
- **章节测试**：针对单个章节的小测验（10-15题，20分钟）
- **单元测试**：覆盖整个单元的测试（20-30题，45分钟）
- **模拟考试**：完整的 A-Level 模拟考试（40-50题，90分钟）
- **诊断测试**：入学测试，识别学生水平和薄弱点（30题，60分钟）
- **真题模拟**：历年 A-Level 真题（完整试卷）

#### 1.2 考试模式
- **练习模式**：可查看答案和解析，不计时
- **考试模式**：严格计时，禁止查看答案，提交后才能看结果
- **挑战模式**：限时答题，答对加分，答错扣分（游戏化）

#### 1.3 考试流程
```
创建考试 → 选择试卷 → 开始考试 → 答题 → 提交 → AI批改 → 查看结果 → 错题分析 → 学习建议
```

---

### 模块 2：试卷生成系统

#### 2.1 试卷来源
1. **手动组卷**：管理员从题库中手动选题
2. **智能组卷**：基于章节/单元自动组卷（复用 Phase 3 的组卷引擎）
3. **AI 生成试卷**：AI 根据考试大纲生成完整试卷
4. **真题导入**：导入历年 A-Level 真题

#### 2.2 试卷配置
- 考试类型（章节/单元/模拟/诊断）
- 题目数量和分值分配
- 难度分布（简单:中等:困难 = 3:5:2）
- 知识点覆盖范围
- 时间限制
- 是否允许返回修改答案

#### 2.3 试卷模板
预设常用试卷模板：
- A-Level 数学 Paper 1 模板（纯数学）
- A-Level 数学 Paper 2 模板（统计与力学）
- A-Level 经济学 Paper 1 模板（微观经济）
- A-Level 经济学 Paper 2 模板（宏观经济）

---

### 模块 3：考试执行系统

#### 3.1 考试界面
- **顶部导航栏**：
  - 考试标题
  - 剩余时间（倒计时）
  - 题目导航（显示已答/未答状态）
  - 提交按钮

- **主答题区**：
  - 题目内容（支持 LaTeX 渲染）
  - 答题输入区（根据题型自动切换）
  - 标记/收藏按钮
  - 上一题/下一题按钮

- **侧边栏**（可折叠）：
  - 题目列表（缩略图）
  - 答题进度
  - 标记的题目

#### 3.2 考试控制
- **自动保存**：每 30 秒自动保存答案
- **时间警告**：剩余 5 分钟时提醒
- **强制提交**：时间到自动提交
- **防作弊**：
  - 禁止切换标签页（考试模式）
  - 检测页面失焦（记录次数）
  - 禁止复制粘贴（可选）

#### 3.3 答题状态管理
- **未答**：灰色
- **已答**：绿色
- **已标记**：黄色星标
- **当前题**：蓝色高亮

---

### 模块 4：成绩分析系统

#### 4.1 即时成绩报告
提交后立即显示：
- **总体成绩**：
  - 总分/满分
  - 正确率
  - 用时
  - 排名（与其他用户对比）

- **难度分析**：
  - 简单题正确率
  - 中等题正确率
  - 困难题正确率

- **题型分析**：
  - 选择题正确率
  - 填空题正确率
  - 计算题正确率
  - 证明题得分率

#### 4.2 知识点分析
- **掌握度热力图**：
  - 绿色：掌握良好（正确率 > 80%）
  - 黄色：需要加强（正确率 60-80%）
  - 红色：薄弱点（正确率 < 60%）

- **知识点排名**：
  - 最强知识点 Top 3
  - 最弱知识点 Top 3

#### 4.3 错题分析
- **错题列表**：
  - 题目内容
  - 你的答案 vs 正确答案
  - AI 详细讲解
  - 相关知识点链接
  - 类似题推荐

- **错题本**：
  - 自动收集所有错题
  - 支持筛选
  - 支持重做错题

#### 4.4 进步追踪
- **历史成绩曲线**：
  - 折线图显示历次考试成绩
  - 对比平均分

- **能力雷达图**：
  - 多维度能力评估（计算能力、逻辑推理、应用能力等）

- **学习时长统计**：
  - 每日学习时长
  - 累计学习时长
  - 学习效率分析

---

### 模块 5：AI 智能点评系统

#### 5.1 逐题点评
AI 对每道题提供：
- **答案判断**：正确/部分正确/错误
- **得分说明**：为什么得这个分数
- **错因分析**：哪里出错了，为什么错
- **知识点关联**：涉及哪些知识点
- **解题思路**：正确的解题步骤
- **易错点提醒**：这类题常见的错误
- **类似题推荐**：巩固练习

#### 5.2 整体评价
AI 对整张试卷提供：
- **优势分析**：你擅长的题型和知识点
- **薄弱点诊断**：需要重点提升的地方
- **学习建议**：
  - 推荐复习的章节
  - 推荐练习的题型
  - 推荐观看的视频
- **鼓励性评语**：保持学习动力

#### 5.3 个性化学习路径
基于考试结果，AI 生成：
- **短期计划**（1周）：
  - 每天学习任务
  - 推荐章节和视频
  - 推荐练习题

- **中期计划**（1个月）：
  - 知识点攻克顺序
  - 阶段性测试安排

- **长期计划**（3个月）：
  - 完整学习路线图
  - 里程碑设置

---

## 📊 数据库设计

### 新增表：exams（考试记录）
```sql
CREATE TABLE exams (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_set_id INTEGER NOT NULL REFERENCES question_sets(id),
  type VARCHAR(50) NOT NULL, -- 'chapter_test', 'unit_test', 'mock_exam', 'diagnostic'
  mode VARCHAR(20) NOT NULL, -- 'practice', 'exam', 'challenge'
  status VARCHAR(20) NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'submitted', 'graded'

  -- 考试配置
  time_limit INTEGER, -- 秒
  allow_review BOOLEAN DEFAULT true,

  -- 答题数据
  answers JSONB NOT NULL DEFAULT '{}', -- { questionId: userAnswer }
  marked_questions JSONB DEFAULT '[]', -- [questionId]

  -- 时间记录
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMP,
  time_spent INTEGER, -- 实际用时（秒）

  -- 成绩数据
  total_score REAL,
  max_score REAL,
  correct_count INTEGER,
  total_count INTEGER,

  -- 分析数据
  difficulty_stats JSONB, -- { easy: {correct: 5, total: 10}, medium: {...}, hard: {...} }
  topic_stats JSONB, -- { topicId: {correct: 3, total: 5} }

  -- AI 评价
  ai_feedback JSONB, -- { overall: "...", strengths: [...], weaknesses: [...], suggestions: [...] }

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_exams_user ON exams(user_id);
CREATE INDEX idx_exams_status ON exams(status);
CREATE INDEX idx_exams_type ON exams(type);
```

### 新增表：exam_question_results（逐题结果）
```sql
CREATE TABLE exam_question_results (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES questions(id),

  -- 答题数据
  user_answer JSONB NOT NULL,
  is_correct BOOLEAN NOT NULL,
  score REAL NOT NULL,
  max_score REAL NOT NULL,
  time_spent INTEGER, -- 秒

  -- AI 点评
  ai_feedback JSONB, -- { explanation: "...", mistakes: [...], suggestions: [...] }

  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(exam_id, question_id)
);

CREATE INDEX idx_exam_results_exam ON exam_question_results(exam_id);
CREATE INDEX idx_exam_results_question ON exam_question_results(question_id);
```

### 新增表：learning_recommendations（学习建议）
```sql
CREATE TABLE learning_recommendations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exam_id INTEGER REFERENCES exams(id),

  type VARCHAR(50) NOT NULL, -- 'chapter', 'video', 'practice', 'review'
  priority INTEGER NOT NULL, -- 1-5，优先级

  -- 推荐内容
  chapter_id VARCHAR(50) REFERENCES chapters(id),
  video_url TEXT,
  question_ids JSONB, -- [questionId]

  -- 推荐理由
  reason TEXT,
  weak_topics JSONB, -- [topicName]

  -- 状态
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'skipped'
  completed_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP -- 推荐过期时间
);

CREATE INDEX idx_recommendations_user ON learning_recommendations(user_id);
CREATE INDEX idx_recommendations_status ON learning_recommendations(status);
```

---

## 🔧 技术实现

### 后端 API 设计

#### 考试管理 API
```javascript
// 创建考试
POST /api/exams
Body: {
  questionSetId: 123,
  type: 'chapter_test',
  mode: 'exam',
  timeLimit: 1200
}

// 获取考试详情
GET /api/exams/:id

// 获取用户的考试列表
GET /api/exams?userId=1&status=submitted

// 保存答案（自动保存）
PUT /api/exams/:id/answers
Body: {
  questionId: 456,
  answer: { value: "C" }
}

// 提交考试
POST /api/exams/:id/submit

// 获取考试结果
GET /api/exams/:id/result

// 获取逐题结果
GET /api/exams/:id/questions/:questionId/result
```

#### 成绩分析 API
```javascript
// 获取成绩统计
GET /api/exams/:id/stats

// 获取知识点分析
GET /api/exams/:id/topic-analysis

// 获取错题列表
GET /api/exams/:id/wrong-questions

// 获取历史成绩
GET /api/users/:userId/exam-history?type=chapter_test

// 获取进步曲线
GET /api/users/:userId/progress-curve
```

#### 学习建议 API
```javascript
// 获取学习建议
GET /api/recommendations?userId=pending

// 标记建议完成
PUT /api/recommendations/:id/complete

// 生成学习计划
POST /api/learning-plans/generate
Body: {
  userId: 1,
  examId: 123,
  duration: 7 // 天数
}
```

### 前端组件设计

#### 页面组件
```
src/components/
├── ExamListPage.jsx          # 考试列表页
├── ExamDetailPage.jsx        # 考试详情页（开始前）
├── ExamTakingPage.jsx        # 答题页面
├── ExamResultPage.jsx        # 成绩报告页
├── ExamAnalysisPage.jsx      # 深度分析页
├── WrongQuestionsPage.jsx    # 错题本页
└── LearningPlanPage.jsx      # 学习计划页
```

#### 功能组件
```
src/components/exam/
├── ExamTimer.jsx             # 考试计时器
├── QuestionNavigator.jsx     # 题目导航器
├── AnswerSheet.jsx           # 答题卡
├── ScoreCard.jsx             # 成绩卡片
├── TopicHeatmap.jsx          # 知识点热力图
├── ProgressChart.jsx         # 进步曲线图
├── AbilityRadar.jsx          # 能力雷达图
└── AIFeedback.jsx            # AI 反馈组件
```

---

## 🧪 AI Prompt 设计

### 整体评价 Prompt
```
你是 A-Level 考试评估专家。请分析学生的考试表现并给出详细反馈。

考试信息：
- 类型：{exam.type}
- 总分：{exam.totalScore} / {exam.maxScore}
- 正确率：{exam.correctRate}%
- 用时：{exam.timeSpent} 分钟

题目统计：
- 简单题：{easyStats.correct}/{easyStats.total}
- 中等题：{mediumStats.correct}/{mediumStats.total}
- 困难题：{hardStats.correct}/{hardStats.total}

知识点表现：
{topicStats}

错题列表：
{wrestions}

请提供：
1. 整体评价（100字以内）
2. 优势分析（列出3个擅长的方面）
3. 薄弱点诊断（列出3个需要提升的方面）
4. 学习建议（具体的改进措施）
5. 鼓励性评语

输出 JSON 格式：
{
  "overall": "整体评价",
  "strengths": ["优势1", "优势2", "优势3"],
  "weaknesses": [
    { "topic": "知识点", "reason": "原因", "suggestion": "建议" }
  ],
  "suggestions": [
    { "type": "chapter", "chapterId": "m1c1", "reason": "推荐理由" },
    { "type": "practice", "questionIds": [1,2,3], "reason": "推荐理由" }
  ],
  "encouragement": "鼓励性评语"
}
```

### 学习计划生成 Prompt
```
你是 A-Level 学习规划专家。根据学生的考试结果，生成个性化学习计划。

学生信息：.grade}
- 目标：{user.targetUniversity}
- 薄弱知识点：{weakTopics}

考试结果：
- 最近3次考试成绩：{recentScores}
- 知识点掌握度：{topicMastery}

时间要求：
- 计划周期：{duration} 天
- 每天可用时间：{dailyTime} 小时

请生成学习计划，包括：
1. 每日学习任务（章节、视频、练习题）
2. 阶段性测试安排
3. 复习计划
4. 里程碑设置

输出 JSON 格式：
{
  "plan": [
    {
      "day": 1,
      "tasks": [
        { "type": "chapter", "chapterId": "m1c1", "estimatedTime": 30 },
        { "type": "video", "videoUrl": "...", "estimatedTime": 20 },
        { "type": "practice", "questionIds": [1,2,3], "estimatedTime": 40 }
      ],
      "goal": "掌握供需理论基础"
    }
  ],
  "milestones": [
    { "day": 7, "goal": "完成微观经济学基础", "test": "chapter_test" }
  ]
}
```

---

## 📅 实施计划

### Week 1：考试基础设施（3天）

#### Day 1：数据库与 API
- [ ] 创建 exams 表
- [ ] 创建 exam_question_results 表
- [ ] 创建 learning_recommendations 表
- [ ] 实现考试 CRUD API
- [ ] 实现答案保存 API
- [ ] 实现考试提交 API

**文件**：
- `backend/src/db/schema.js`（扩展）
- `backend/src/routes/exams.js`
- `backend/drizzle/migrations/0005_add_exam_system.sql`

**验收标准**：
- 数据库表创建成功
- API 端点正常工作
- 答案自动保存功能正常

#### Day 2：考试执行逻辑
- [ ] 实现考试状态管理
- [ ] 实现计时器逻辑
- [ ] 实现自动提交逻辑
- [ ] 实现防作弊检测
- [ ] 测试考试流程

**文件**：
- `backend/src/services/examService.js`

**验收标准**：
- 考试状态正确流转\n- 时间到自动提交

#### Day 3：批改与评分
- [ ] 集成 Phase 3 的批改引擎
- [ ] 实现成绩计算逻辑
- [ ] 实现统计分析逻辑
- [ ] 测试批改准确率

**文件**：
- `backend/src/services/examGrader.js`

**验收标准**：
- 批改准确率 > 95%
- 统计数据正确
- 性能满足要求

---

### Week 2：前端考试界面（4天）

#### Day 4-5：答题界面
- [ ] 实现考试列表页
- [ ] 实现考试详情页
- [ ] 实现答题页面
- [ ] 实现题目导航器
- [ ] 实现答题卡
- [ ] 实现计时器组件
- [ ] 集成 LaTeX 渲染

**文件**：
- `src/components/ExamListPage.jsx`
- `src/components/ExamDetailPage.jsx`
- `src/components/ExamTakingPage.jsx`
- `src/components/exam/ExamTimer.jsx`
- `src/components/exam/QuestionNavigator.jsx`
- `src/components/exam/AnswerSheet.jsx`

**验收标准**：
- 界面美观易用
- 答题流程流畅
- 自动保存正常
- 计时器准确

#### Day 6-7：成绩报成绩报告页
- [ ] 实现成绩卡片组件
- [ ] 实现知识点热力图
- [ ] 实现进步曲线图
- [ ] 实现能力雷达图
- [ ] 实现错题列表

**文件**：
- `src/components/ExamResultPage.jsx`
- `src/components/exam/ScoreCard.jsx`
- `src/components/exam/TopicHeatmap.jsx`
- `src/components/exam/ProgressChart.jsx`
- `src/components/exam/AbilityRadar.jsx`

**验收标准**：
- 数据可视化清晰
- 图表渲染正确
- 交互体验良好

---

### Week 3：AI 智能分析（3天）

#### Day 8-9：AI 点评系统
- [ ] 设计 AI 点评 Prompt
- [ ] 实现整体评价服务
- [ ] 实现逐题点评服务
- [ ] 实现薄弱点诊断
- [ ] 测试 AI 点评质量

**文件**：
- `backend/src/services/examAnalyzer.js`
- `backend/src/routes/examAnalysis.js`
标准**：
- AI 点评准确有帮助
- 薄弱点诊断合理
- 响应时间 < 5s

#### Day 10：学习建议系统
- [ ] 实现学习建议生成
- [ ] 实现推荐算法
- [ ] 实现学习计划生成
- [ ] 实现建议管理 API

**文件**：
- `backend/src/services/recommendationService.js`
- `backend/src/routes/recommendations.js`

**验收标准**：
- 推荐内容相关性高
- 学习计划合理
- 优先级排序正确

---

### Week 4：优化与测试（2天）

#### Day 11：功能完善
- [ ] 实现错题本功能
- [ ] 实现学习计划页面
- [ ] 实现历史成绩查询
- [ ] 添加数据导出功能
- [ ] 优化性能

**文件**：
- `src/components/WrongQuestionsPage.jsx`
- `src/components/LearningPlanPage.jsx`

**验收标准**：
- 所有功能正常工作
- 性能满足要求
- 无明显 Bug

#### Day 12：测试与文档
- [ ] 端到端测试
- [ ] 性能测试
- [ ] 用户体验测试
- [ ] 编写用户文档
- [ ] 编写 API 文档

**交付物：
- Phase 4 完成报告
- API 文档
- 用户使用指南

**验收标准**：
- 所有测试通过
- 文档完整
- 准备上线

---

## 💰 成本估算

### AI 调用成本（智谱 GLM-4-Plus）

| 功能 | 单次 Tokens | 频率/用户/月 | 100用户月成本 |
|------|------------|-------------|--------------|
| 逐题点评 | 500 | 100次 | ¥25 |
| 整体评价 | 1000 | 20次 | ¥10 |
| 学习建议 | 800 | 10次 | ¥4 |
| 学习计划 | 1500 | 5次 | ¥3.75 |
| **总计** | - | - | **¥42.75** |

**Phase 3 成本**：¥27.5/月
**Phase 4 新增成本**：¥42.75/月
**总成本**：¥70.25/月（100用户）

---

## 📈 成功指标

### 功能指标
- [ ] 考试创建成功率 > 99%
- [ ] 答案自动保存成功率 > 99.9%
- [ ] 批改准确率 > 95%
- [ ] AI 点评响应时间 < 5s
- [ ] 页面加载时间 < 2s

### 用户体验指标
- [ ] 考试完成率 > 80%
- [ ] 用户满意度 > 4.5/5
- [ ] 错题本使用率 > 60%
- [ ] 学习建议采纳率 > 50%

### 业务指标
- [ ] 月活跃用户增长 > 20%
- [ ] 用户留存率 > 70%
- [ ] 付费转化率 > 10%

---

## 🚀 Phase 4 之后的规划

### Phase 5：自适应学习路径（4周）
- 知识图谱构建
- 诊断测试系统
- 学习路径算法
- 个性化推荐引擎
- 复习提醒系统

### Phase 6：数据分析与报告（2周）
- 学习报告生成
- 家长端功能
- 数据可视化增强
- 导出功能

### Phase 7：社交与激励（3周）
- 成就勋章系统
- 排行榜
- 学习圈
- 学习小组
- 每日签到

### Phase 8：优化与上线（2周）
- 性能优化
- 安全加固
- 压力测试
- 正式上线

---

## 📝 注意事项

### 考试安全
- 答案加密存储
- 防止客户端篡改
- 记录异常行为（频繁切换标签页）
- 考试结果不可修改

### 性能优化
- 答案自动保存使用防抖
- 大量题目分页加载
- 图表数据缓存
- AI 调用结果缓存

### 用户体验
- 考试中断可恢复
- 网络异常自动重试
- 提交前二次确认
- 友好的错误提示

---

## 🎯 Phase 4 核心目标

1. ✅ 完整的考试流程（创建→答题→提交→批改→分析）
2. ✅ 深度的成绩分析（多维度统计、可视化）
3. ✅ 智能的 AI 点评（逐题讲解、整体评价）
4. ✅ 实用的学习建议（推荐内容、生成计划）
5. ✅ 完善的错题本（自动收集、重做功能）

**Phase 4 完成后，系统将具备完整的"学-练-考-评"闭环，为 Phase 5 的自适应学习打下坚实基础。**

---

**文档版本**：v1.0
**创建时间**：2026-03-09
**负责人**：Claude Opus 4.6
