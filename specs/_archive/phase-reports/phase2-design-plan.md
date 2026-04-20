# Phase 2 设计方案：AI 教师对话功能

**设计者**：Claude Opus 4.6
**设计时间**：2026-03-07
**预计实施时间**：2-3 周

---

## 📋 目录

1. [核心理念](#核心理念)
2. [功能设计](#功能设计)
3. [技术架构](#技术架构)
4. [数据库设计](#数据库设计)
5. [API 设计](#api-设计)
6. [前端设计](#前端设计)
7. [实施计划](#实施计划)
8. [成本估算](#成本估算)

---

## 核心理念

### 设计原则

**苏格拉底式教学法**：
- ❌ 不直接给答案
- ✅ 通过提问引导学生思考
- ✅ 逐步揭示解题思路
- ✅ 培养独立思考能力

**个性化教学**：
- 根据学生水平调整解释难度
- 记住学生的薄弱点
- 推荐针对性练习
- 适应学生的学习节奏

**上下文感知**：
- 记住对话历史
- 理解当前学习章节
- 关联知识点
- 追踪学习进度

---

## 功能设计

### 1. 对话场景

#### 场景 1：知识点讲解
```
学生：什么是导数？
AI：很好的问题！在回答之前，我想先问你：你学过函数的极限吗？

学生：学过
AI：太好了！那你能告诉我，当 Δx 趋近于 0 时，(f(x+Δx)-f(x))/Δx 表示什么吗？

学生：表示函数的变化率？
AI：完全正确！导数就是函数在某一点的瞬时变化率。让我们用一个具体例子...
```

#### 场景 2：解题辅导
```
学生：这道题我不会做：求 f(x)=x² 在 x=2 处的导数
AI：好的，让我们一步步来。首先，你还记得导数的定义吗？

学生：f'(x) = lim(Δx→0) [f(x+Δx)-f(x)]/Δx
AI：非常好！那么，如果 f(x)=x²，f(x+Δx) 应该等于什么？

学生：(x+Δx)²
AI：对了！现在试着展开 (x+Δx)²，你会得到什么？
```

#### 场景 3：错题分析
```
学生：我这道题做错了，答案是 4，我算出来是 2
AI：让我看看你的解题过程。你能告诉我你是怎么算的吗？

学生：我用了求导公式 (x²)' = 2x
AI：公式用对了！那你代入 x=2 后，得到了什么？

学生：2×2 = 4... 哦！我明白了，我算错了
AI：很好！你自己发现了错误。这种粗心错误很常见，建议你...
```

#### 场景 4：概念辨析
```
学生：导数和微分有什么区别？
AI：这是个很深刻的问题！让我先问你：你觉得它们有什么相似之处？

学生：都和变化率有关？
AI：说得对！它们确实都描述函数的变化。那么，你注意到它们的符号不同吗？
```

---

## 技术架构

### 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                      前端层                              │
│  - ChatInterface.jsx (对话界面)                         │
│  - MessageList.jsx (消息列表)                           │
│  - InputBox.jsx (输入框，支持 LaTeX)                    │
│  - ContextPanel.jsx (上下文面板)                        │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/WebSocket
┌────────────────────┴────────────────────────────────────┐
│                    后端 API 层                           │
│  - /api/chat/send (发送消息)                            │
│  - /api/chat/history (获取历史)                         │
│  - /api/chat/sessions (会话管理)                        │
│  - /api/chat/context (上下文管理)                       │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│                  AI 服务层                               │
│  - PromptBuilder (提示词构建)                           │
│  - ContextManager (上下文管理)                          │
│  - ResponseParser (响应解析)                            │
│  - Claude API Client                                    │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│                  数据层                                  │
│  - chat_sessions (会话表)                               │
│  - chat_messages (消息表)                               │
│  - chat_contexts (上下文表)                             │
│  - user_knowledge_graph (知识图谱)                      │
└─────────────────────────────────────────────────────────┘
```

### 技术选型

| 组件 | 技术选择 | 理由 |
|------|---------|------|
| AI 模型 | Claude Opus 4.6 | 最强推理能力，适合教学 |
| 备选模型 | Claude Sonnet 4.6 | 性价比高，响应快 |
| 数学渲染 | KaTeX | 已集成，轻量快速 |
| 实时通信 | HTTP Long Polling | 简单可靠，无需 WebSocket |
| 上下文存储 | PostgreSQL JSONB | 灵活存储，易于查询 |
| 缓存 | 内存缓存 | 减少 API 调用成本 |

---

## 数据库设计

### 表结构

#### 1. chat_sessions（会话表）

```sql
CREATBLE chat_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_id VARCHAR(50) REFERENCES chapters(id),
  title VARCHAR(200),
  session_type VARCHAR(20) NOT NULL, -- 'learning' | 'practice' | 'review'
  status VARCHAR(20) DEFAULT 'active', -- 'active' | 'archived'
  message_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_message_at TIMESTAMP
);

CREATE INDEX idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_chapter ON chat_sessions(chapter_id);
```

#### 2. chat_messages（消息表）

```sql
CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL, -- 'user' | 'assistant' | 'system'
  content TEXT NOT NULL,
  content_type VARCHAR(20) DEFAULT 'text', -- 'text' | 'latex' | 'code'
  metadata JSONB, -- { thinking_process, references, difficulty }
  tokens_used INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at DESC);
```

#### 3. chat_contexts（上下文表）

```sql
CREATE TABLE chat_contexts (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  context_type VARCHAR(50) NOT NULL, -- 'chapter' | 'knowledge_point' | 'problem'
  context_data JSONB NOT NULL,
  relevance_score FLOAT DEFAULT 1.0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_contexts_session ON chat_contexts(session_id);
```

#### 4. user_knowledge_graph（用户知识图谱）

```sql
CREATE TABLE user_knowledge_graph (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  knowledge_point_id VARCHAR(100) NOT NULL,
  mastery_level INTEGER DEFAULT 0, -- 0-100
  last_practiced_at TIMESTAMP,
  practice_count INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, knowledge_point_id)
);

CREATE INDEX idx_knowledge_graph_user ON user_knowledge_graph(user_id);
```

---

## API 设计

### 1. 创建会话

```http
POST /api/chat/sessions
Content-Type: application/json

{
  "chapterId": "e1c1",
  "sessionType": "learning",
  "title": "学习供需理论"
}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "chapterId": "e1c1",
    "title": "学习供需理论",
    "sessionType": "learning",
    "status": "active",
    "createdAt": "2026-03-07T10:00:00Z"
  }
}
```

### 2. 发送消息

```http
POST /api/chat/send
Content-Type: application/json

{
  "sessionId": 1,
  "message": "什么是供需平衡？",
  "context": {
    "currentChapter": "e1c1",
    "userLevel": "beginner"
  }
}

Response:
{
  "success": true,
  "data": {
    "messageId": 123,
    "role": "assistant",
    "content": "很好的问题！在回答之前，我想先问你...",
    "metadata": {
      "thinkingProcess": "识别到学生在学习基础概念",
      "difficulty": "beginner",
      "relatedTopics": ["supply", "demand", "equilibrium"]
    },
    "tokensUsed": 150
  }
}
```

### 3. 获取会话历史

```http
GET /api/chat/sessions/:sessionId/messages?limit=50&offset=0

Response:
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": 120,
        "role": "user",
        "content": "什么是供需平衡？",
        "createdAt": "2026-03-07T10:00:00Z"
      },
      {
        "id": 121,
        "role": "assistant",
        "content": "很好的问题！...",
        "createdAt": "2026-03-07T10:00:05Z"
      }
    ],
    "total": 10,
    "hasMore": false
  }
}
```

### 4. 获取用户会话列表

```http
GET /api/chat/sessions?userId=1&status=active&limit=20

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "学习供需理论",
      "chapterId": "e1c1",
      "messageCount": 10,
      "lastMessageAt": "2026-03-07T10:30:00Z",
      "createdAt": "2026-03-07T10:00:00Z"
    }
  ]
}
```

### 5. 归档会话

```http
PUT /api/chat/sessions/:sessionId
Content-Type: application/json

{
  "status": "archived"
}
```

---

## 前端设计

### 组件结构

```
ChatPage.jsx
├── ChatHeader.jsx (标题、章节信息)
├── ContextPanel.jsx (当前上下文、知识点)
├── MessageList.jsx
│   ├── UserMessage.jsx
│   ├── AssistantMessage.jsx (支持 LaTeX 渲染)
│   └── SystemMessage.jsx
├── InputBox.jsx
│   ├── TextInput (支持多行)
│   ├── LaTeXButton (插入数学公式)
│   └── SendButton
└── SessionSidebar.jsx (历史会话列表)
```

### UI 设计要点

#### 1. 对话界面

```
┌─────────────────────────────────────────────────────────┐
│  📚 经济学 > Unit 1 > 供需理论              [归档] [设置] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  👤 学生：什么是供需平衡？                               │
│                                                         │
│  🤖 AI教师：很好的问题！在回答之前，我想先问你：        │
│     你学过供给曲线和需求曲线吗？                         │
│                                                         │
│  👤 学生：学过                                          │
│                                                         │
│  🤖 AI教师：太好了！那你能告诉我，当供给曲线和需求      │
│     曲线相交时，意味着什么吗？                           │
│                                                         │
│     [提示：想想价格和数量的关系]                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  💬 输入你的问题...                    [LaTeX] [发送]    │
└─────────────────────────────────────────────────────────┘
```

#### 2. LaTeX 支持

```jsx
// 用户可以输入：
我想问关于 $f(x) = x^2$ 的导数

// 渲染为：
我想问关于 f(x) = x² 的导数
```

#### 3. 上下文面板

```
┌─────────────────────┐
│  📍 当前上下文        │
├─────────────────────┤
│  章节：供需理论      │
│  知识点：           │
│  • 供给曲线         │
│  • 需求曲线         │
│  • 市场均衡         │
│                     │
│  你的掌握度：       │
│  供给曲线 ████░ 80% │
│  需求曲线 ███░░ 60% │
│  市场均衡 ██░░░ 40% │
└─────────────────────┘
```

---

## Prompt Engineering

### System Prompt 模板

```
你是一位经验丰富的 A-Level 教师，专门教授 {subject}。

教学原则：
1. 使用苏格拉底式提问法，通过问题引导学生思考
2. 不要直接给出答案，而是逐步引导
3. 根据学生的回答调整解释的难度
4. 鼓励学生独立思考，培养解题能力
5. 使用具体例子帮助理解抽象概念

当前上下文：
- 学生正在学习：{chapterTitle}
- 学生水平：{userLevel}
- 学生薄弱点：{weakPoints}

对话历史：
{conversationHistory}

请回答学生的问题，记住要引导而不是直接告诉答案。
```

### User Prompt 模板

```
学生问题：{userMessage}

当前学习内容：
- 章节：{chapterTitle}
- 知识点：{keyPoints}

学生背景：
- 已掌握知识点：{masteredTopics}
- 薄弱知识点：{weakTopics}
- 最近错题：{recentMistakes}

请根据以上信息，用苏格拉底式提问法回答学生的问题。
```

---

## 实施计划

### Week 1：后端基础（5天）

**Day 1-2：数据库和 API**
- [ ] 创建 4 个数据库表
- [ ] 实现会话管理 API
- [ ] 实现消息发送 API
- [ ] 实现历史查询 API

**Day 3-4：AI 服务层**
- [ ] 创建 Claude API 客户端
- [ ] 实现 Prompt 构建器
- [ ] 实现上下文管理器
- [ ] 实现响应解析器

**Day 5：测试和优化**
- [ ] API 端到端测试
- [ ] 性能优化
- [ ] 错误处理完善

### Week 2：前端开发（5天）

**Day 6-7：核心组件**
- [ ] ChatPage 主页面
- [ ] MessageList 消息列表
- [ ] InputBox 输入框
- [ ] LaTeX 渲染支持

**Day 8-9：高级功能**
- [ ] SessionSidebar 会话列表
- [ ] ContextPanel 上下文面板
- [ ] 消息流式显示
- [ ] 加载状态和错误处理

**Day 10：UI 优化**
- [ ] 响应式设计
- [ ] 动画效果
- [ ] 无障碍支持

### Week 3：集成和测试（5天）

**Day 11-12：功能集成**
- [ ] 与用户系统集成
- [ ] 与学习进度集成
- [ ] 知识图谱更新

**Day 13-14：测试**
- [ ] 单元测试
- [ ] 集成测试
- [ ] 用户测试

**Day 15：文档和部署**
- [ ] API 文档
- [ ] 使用指南
- [ ] 部署到生产环境

---

## 成本估算

### API 调用成本

**Claude Opus 4.6 定价**：
- Input: $15 / 1M tokens
- Output: $75 / 1M tokens

**预估使用量**（每月）：
- 活跃用户：100 人
- 每人每天对话：10 轮
- 每轮平均 tokens：500 (input) + 300 (output)

**月成本计算**：
```
Input:  100 × 10 × 30 × 500 = 15M tokens = $225
Output: 100 × 10 × 30 × 300 = 9M tokens  = $675
总计：$900/月
```

### 成本优化策略

1. **使用 Sonnet 4.6**（便宜 10 倍）
   - 简单问题用 Sonnet
   - 复杂问题用 Opus
   - 预计节省 70% 成本

2. **缓存常见问题**
   - 缓存热门问题的回答
   - 预计节省 30% API 调用

3. **上下文压缩**
   - 只保留最近 10 轮对话
   - 总结历史上下文
   - 预计节省 40% tokens

**优化后成本**：约 $200-300/月

---

## 风险评估

### 技术风险

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|---------|
| API 响应慢 | 高 | 中 | 实现流式响应、加载提示 |
| API 成本超预算 | 高 | 中 | 使用 Sonnet、缓存、限流 |
| LaTeX 渲染问题 | 中 | 低 | 已有 KaTeX，风险低 |
| 上下文管理复杂 | 中 | 中 | 简化设计，渐进增强 |

### 产品风险

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|---------|
| 用户不喜欢苏格拉底式 | 高 | 中 | 提供"直接回答"选项 |
| AI 回答质量不稳定 | 高 | 中 | 人工审核、Prompt 优化 |
| 用户滥用（刷 API） | 中 | 低 | 限流、每日配额 |

---

## 成功指标

### 核心指标

1. **用户参与度**
   - 每日活跃对话数 > 5
   - 平均对话轮数 > 8
   - 会话完成率 > 70%

2. **教学效果**
   - 学生满意度 > 4.5/5
   - 知识点掌握度提升 > 20%
   - 错题重复率下降 > 30%

3. **技术指标**
   - API 响应时间 < 3s
   - 系统可用性 > 99%
   - 错误率 < 1%

---

## 总结

Phase 2 的 AI 教师对话功能将是整个产品的**核心竞争力**。通过苏格拉底式教学法和个性化上下文管理，我们可以提供比传统在线课程更好的学习体验。

**关键成功因素**：
1. ✅ Prompt Engineering 质量
2. ✅ 上下文管理的准确性
3. ✅ 用户体验的流畅度
4. ✅ 成本控制的有效性

**下一步**：
- 获得你的反馈和确认
- 开始实施 Week 1 的任务
- 建立 Prompt 测试框架

---

**文档版本**：v1.0
**创建时间**：2026-03-07
