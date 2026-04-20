# Phase 3 实施计划：持久化题库系统

**创建时间**：2026-03-08
**状态**：✅ 设计完成，准备实施
**预计周期**：15 天

---

## 📋 项目背景

建立一个**持久化的智能题库系统**，支持多源题库（手动上传、AI 生成、历年真题），实现题目的持久化存储和智能组卷，大幅降低 AI 调用成本。

### 核心价值
- 💰 **成本优化**：节省约 75% 的 AI 调用成本
- 📚 **题库积累**：题目可复用，越用越丰富
- 🤖 **智能组卷**：AI 从题库中智能提取和组合题目
- 📄 **文档解析**：支持 PDF/Word 自动解析成结构化题目

---

## 🎯 实施计划

### Week 1：题库基础设施（3天）

#### Day 1：数据库设计与迁移
**任务**：
- [ ] 扩展 `questions` 表（添加 source、tags、status 等字段）
- [ ] 创建 `uploaded_documents` 表
- [ ] 创建 `question_sets` 表（组卷）
- [ ] 扩展 `user_answers` 表（添加 questionSetId）
- [ ] 添加数据库索引

**文件**：
- `backend/src/db/schema.js`
- `backend/drizzle/migrations/0004_add_question_bank.sql`

**验收标准**：
- 数据库迁移成功
- 所有表创建完成
- 索引配置正确

#### Day 2-3：题库管理 API
**任务**：
- [ ] 实现题目 CRUD API
- [ ] 实现题目筛选和查询
- [ ] 实现随机选题功能
- [ ] 实现批量导入功能
- [ ] 添加题目审核状态管理

**文件**：
- `backend/src/routes/questions.js`

**API 端点**：
- `GET /api/questions` - 获取题目列表
- `GET /api/questions/:id` - 获取题目详情
- `POST /api/questions` - 创建题目
- `PUT /api/questions/:id` - 更新题目
- `DELETE /api/questions/:id` - 删除题目
- `GET /api/questions/random` - 随机获取题目
- `POST /api/questions/batch` - 批量导入
- `PUT /api/questions/:id/review` - 审核题目

**验收标准**：
- 所有 API 端点正常工作
- 筛选功能完善
- 审核流程可用

---

### Week 2：文件上传与 AI 解析（4天）

#### Day 4-5：文件上传功能
**任务**：
- [ ] 安装依赖（@hono/multipart、pdf-parse、mammoth）
- [ ] 实现文件上传 API
- [ ] 实现文档解析服务
- [ ] 实现异步处理机制
- [ ] 添加文件验证和错误处理

**文件**：
- `backend/src/routes/documents.js`
- `backend/src/services/documentParser.js`

**API 端点**：
- `POST /api/documents/upload` - 上传文档
- `GET /api/documents/:id/status` - 查询处理状态
- `GET /api/documents/:id/questions` - 获取解析结果
- `POST /api/documents/:id/approve` - 审核并导入题库

**验收标准**：
- 支持 PDF 和 Word 上传
- 文件大小限制（20MB）
- 异步处理不阻塞响应

#### Day 6-7：AI 题目提取
**任务**：
- [ ] 设计题目提取 Prompt
- [ ] 实现 AI 提取服务
- [ ] 实现 JSON 解析和验证
- [ ] 测试提取准确率
- [ ] 优化 Prompt 效果

**文件**：
- `backend/src/services/questionExtractor.js`

**验收标准**：
- AI 能准确识别题目类型
- 数学公式正确提取（LaTeX）
- 知识点标签准确
- 提取成功率 > 80%

---

### Week 3：AI 出题引擎（3天）

#### Day 8-9：AI 出题服务
**任务**：
- [ ] 设计出题 Prompt
- [ ] 实现题目生成服务
- [ ] 实现题目保存到题库
- [ ] 添加题目质量验证
- [ ] 测试生成题目质量

**文件**：
- `backend/src/services/questionGenerator.js`

**功能**：
- 根据章节和知识点生成题目
- 支持配置难度、类型、数量
- 自动添加标签和元数据
- 生成的题目进入审核状态

**验收标准**：
- 生成的题目符合 A-Level 标准
- 难度分布合理
- 题目有区分度
- 解析详细准确

#### Day 10：出题 API 集成
**任务**：
- [ ] 扩展 questions 路由
- [ ] 实现生成 API
- [ ] 实现预览功能
- [ ] 添加生成历史记录

**API 端点**：
- `POST /api/questions/generate` - AI 生成题目
- `POST /api/questions/generate/preview` - 预览生成结果

**验收标准**：
- API 调用成功
- 生成的题目可保存到题库
- 预览功能正常

---

### Week 4：智能组卷与练习界面（5天）

#### Day 11-12：智能组卷
**任务**：
- [ ] 实现选题策略算法
- [ ] 实现难度分布算法
- [ ] 实现知识点覆盖算法
- [ ] 实现 AI 推荐算法
- [ ] 实现组卷 API

**文件**：
- `backend/src/services/examComposer.js`
- `backend/src/routes/questionSets.js`

**选题策略**：
1. 随机选题
2. 难度分布（3:5:2）
3. 知识点覆盖
4. AI 推荐（根据用户薄弱点）
5. 历年真题优先

**验收标准**：
- 组卷算法合理
- 难度分布符合预期
- 知识点覆盖完整

#### Day 13-14：练习界面
**任务**：
- [ ] 实现练习主页
- [ ] 实现题目卡片组件
- [ ] 实现答题输入组件
- [ ] 实现计时器
- [ ] 实现进度条
- [ ] 集成 LaTeX 渲染

**文件**：
- `src/components/PracticePage.jsx`
- `src/components/QuestionCard.jsx`
- `src/components/AnswerInput.jsx`
- `src/components/Timer.jsx`
- `src/components/ProgressBar.jsx`

**验收标准**：
- 界面美观易用
- LaTeX 公式正确渲染
- 答题交互流畅
- 计时器准确

#### Day 15：AI 批改系统
**任务**：
- [ ] 实现客观题自动批改
- [ ] 实现 AI 批改主观题
- [ ] 实现反馈生成
- [ ] 实现成绩展示
- [ ] 测试批改准确率

**文件**：
- `backend/src/services/answerGrader.js`
- `src/components/ResultPage.jsx`

**验收标准**：
- 客观题批改准确率 100%
- 主观题批改合理
- 反馈详细有帮助
- 成绩展示清晰

---

## 📊 数据库设计

### 扩展 questions 表
```sql
ALTER TABLE questions ADD COLUMN tags JSONB DEFAULT '[]';
ALTER TABLE questions ADD COLUMN source VARCHAR(50) DEFAULT 'manual';
ALTER TABLE questions ADD COLUMN source_document_id INTEGER REFERENCES uploaded_documents(id);
ALTER TABLE questions ADD COLUMN estimated_time INTEGER DEFAULT 300;
ALTER TABLE questions ADD COLUMN usage_count INTEGER DEFAULT 0;
ALTER TABLE questions ADD COLUMN correct_rate REAL;
ALTER TABLE questions ADD COLUMN status VARCHAR(20) DEFAULT 'draft';
ALTER TABLE questions ADD COLUMN reviewed_by INTEGER REFERENCES users(id);
ALTER TABLE questions ADD COLUMN reviewed_at TIMESTAMP;
```

### 新增 uploaded_documents 表
```sql
CREATE TABLE uploaded_documents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_id VARCHAR(50) REFERENCES chapters(id),
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INTEGER NOT NULL,
  file_url TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  parse_result JSONB,
  extracted_questions_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP
);
```

### 新增 question_sets 表
```sql
CREATE TABLE question_sets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  chapter_id VARCHAR(50) REFERENCES chapters(id),
  question_ids JSONB NOT NULL,
  total_questions INTEGER NOT NULL,
  total_points INTEGER DEFAULT 100,
  time_limit INTEGER,
  difficulty_distribution JSONB,
  generated_by VARCHAR(50) DEFAULT 'manual',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔧 技术实现细节

### AI Prompt 设计

#### 题目提取 Prompt
```
你是 A-Level 题目提取专家。从文档中提取所有题目，输出 JSON 格式。

要求：
1. 识别题目类型（选择题、填空题、计算题、证明题）
2. 提取题目内容、选项、答案、解析
3. 保留数学公式（LaTeX 格式）
4. 评估难度（1-5）
5. 提取知识点标签

输出格式：
{
  "questions": [
    {
      "type": "multiple_choice",
      "difficulty": 3,
      "content": { "zh": "...", "en": "..." },
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "answer": { "value": "C", "explanation": "..." },
      "tags": ["供需理论", "市场均衡"],
      "estimatedTime": 180
    }
  ]
}
```

#### AI 出题 Prompt
```
你是 A-Level 出题专家。根据章节内容生成高质量练习题。

章节信息：
- 标题：{chapter.title}
- 知识点：{chapter.keyPoints}
- 难度要求：{difficulty}
- 题目类型：{types}
- 数量：{count}

要求：
1. 题目符合 A-Level 考试标准
2. 难度适中，有区分度
3. 包含实际应用场景
4. 提供详细解析
5. 数学公式使用 LaTeX

输出 JSON 格式（同上）
```

#### AI 批改 Prompt
```
你是 A-Level 批改专家。请批改学生的答案并给出详细反馈。

题目：{question.content}
标准答案：{question.answer}
学生答案：{userAnswer}

要求：
1. 判断答案是否正确（给出 0-100 分）
2. 指出错误之处
3. 提供改进建议
4. 给出鼓励性评语

输出 JSON：
{
  "score": 85,
  "isCorrect": true,
  "feedback": {
    "strengths": ["步骤清晰", "公式运用正确"],
    "weaknesses": ["计算有小错误"],
    "suggestions": ["注意检查计算"],
    "encouragement": "整体思路很好！"
  }
}
```

---

## 🧪 测试计划

### 单元测试
- [ ] 题目 CRUD 操作
- [ ] 文档解析功能
- [ ] AI 提取准确率
- [ ] AI 生成质量
- [ ] 组卷算法正确性
- [ ] 批改准确率

### 集成测试
- [ ] 完整的上传→解析→审核→导入流程
- [ ] 完整的生成→审核→发布流程
- [ ] 完整的组卷→练习→批改流程

### 性能测试
- [ ] 文件上传速度
- [ ] AI 调用响应时间
- [ ] 题目查询性能
- [ ] 组卷算法效率

---

## 💰 成本估算

### AI 调用成本（智谱 GLM-4-Plus）

| 功能 | 单次 Tokens | 频率/用户/月 | 100用户月成本 |
|------|------------|-------------|--------------|
| 文档解析 | 2000 | 10次 | ¥10 |
| AI 出题 | 1500 | 50次 | ¥37.5 |
| AI 批改 | 800 | 200次 | ¥80 |
| **总计** | - | - | **¥127.5** |

**对比**：不用题库每次 AI 出题，月成本约 ¥500+

**节省**：约 **75%** 成本

---

## 📈 里程碑

| 里程碑 | 日期 | 验收标准 |
|--------|------|---------|
| Week 1 完成 | Day 3 | 题库 API 可用 |
| Week 2 完成 | Day 7 | 文件上传和解析可用 |
| Week 3 完成 | Day 10 | AI 出题引擎可用 |
| Week 4 完成 | Day 15 | 完整练习流程可用 |
| **Phase 3 完成** | **Day 15** | **所有功能验收通过** |

---

## 🚀 实施顺序

根据用户确认，实施顺序为：

1. **Week 1**：题库基础设施（优先）
2. **Week 3**：AI 出题引擎（优先）
3. **Week 4**：智能组卷与练习界面
4. **Week 2**：文件上传与 AI 解析（后续）

**理由**：先让 AI 能生成题目并存入题库，快速验证核心功能，文件上传功能后续再加。

---

## 📝 注意事项

### 审核机制
- 所有 AI 生成或上传解析的题目默认为 `draft` 状态
- 需要人工审核后才能发布（status: `published`）
- 提供批量审核功能提高效率

### 文件存储
- MVP 阶段使用本地临时存储
- 生产环境迁移到 Cloudflare R2
- 文件上传后立即解析，不持久化存储

### 数据质量
- AI 生成的题目需要人工抽查
- 建立题目质量评分机制
- 用户反馈收集和改进

---

**文档版本**：v1.0
**最后更新**：2026-03-08
**负责人**：Claude Opus 4.6
