# 数据库 Schema 文档 — A-Level Hub

> 最后更新：2026-04-17  
> 数据库：Supabase PostgreSQL（项目 ID: mozzqjeusrjuxycwpyld）  
> ORM：Drizzle ORM（定义文件：`backend/src/db/schema.js`）

---

## 目录

1. [整体 ER 关系图](#1-整体-er-关系图)
2. [学科相关表](#2-学科相关表)
   - subjects（学科）
   - units（单元）
   - chapters（章节）
3. [用户相关表](#3-用户相关表)
   - users（用户）
   - userProfiles（用户画像）
   - learningProgress（学习进度）
   - userStats（学习统计）
4. [题库相关表](#4-题库相关表)
   - questions（题目）
   - questionSets（试卷/题集）
   - uploadedDocuments（上传文档）
   - userAnswers（答题记录）
5. [考试系统表](#5-考试系统表)
   - exams（考试记录）
   - examQuestionResults（逐题结果/错题本）
   - learningRecommendations（学习推荐）
6. [AI 对话相关表](#6-ai-对话相关表)
   - chatSessions（会话）
   - chatMessages（消息）
   - chatContexts（上下文）
   - userKnowledgeGraph（知识图谱）
   - aiConversations（旧对话，兼容保留）
7. [索引与性能](#7-索引与性能)
8. [数据约束说明](#8-数据约束说明)

---

## 1. 整体 ER 关系图

```
subjects
  │ id (PK, varchar)
  └──< units (subject_id FK)
           └──< chapters (unit_id FK)
                    └──< questions (chapter_id FK)
                    └──< learningProgress (chapter_id FK)
                    └──< questionSets (chapter_id FK)
                    └──< uploadedDocuments (chapter_id FK)

users
  │ id (PK, serial)
  ├──< exams (user_id FK)
  │         └──< examQuestionResults (exam_id FK, nullable)
  ├──< examQuestionResults.userId (直接关联，Practice 错题)
  ├──< learningProgress (user_id FK)
  ├──< userProfiles (user_id FK, unique)
  ├──< userStats (user_id FK, unique)
  ├──< questionSets (user_id FK, nullable = 公开试卷)
  ├──< uploadedDocuments (user_id FK)
  ├──< userAnswers (user_id FK)
  ├──< learningRecommendations (user_id FK)
  ├──< chatSessions (user_id FK)
  └──< userKnowledgeGraph (user_id FK)

exams
  ├── user_id → users
  └── question_set_id → questionSets

examQuestionResults
  ├── exam_id → exams (nullable)
  ├── user_id → users (nullable)
  └── question_id → questions
```

---

## 2. 学科相关表

### `subjects`（学科）

| 列名 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | `varchar(50)` | PK | 学科标识符，如 `mathematics`, `economics` |
| `name` | `jsonb` | NOT NULL | `{"zh": "数学", "en": "Mathematics"}` |
| `name_full` | `jsonb` | — | 完整名称 |
| `icon` | `varchar(10)` | — | Emoji 图标 |
| `color` | `varchar(20)` | — | 主色调 |
| `bg_color` | `varchar(20)` | — | 背景色 |
| `level` | `text` | — | 考试层级 |
| `created_at` | `timestamp` | DEFAULT NOW() | — |
| `updated_at` | `timestamp` | DEFAULT NOW() | — |

**已有学科 ID：**
`mathematics` / `economics` / `history` / `politics` / `psychology` / `further-math`

---

### `units`（单元）

| 列名 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | `varchar(50)` | PK | 如 `math-p1`, `econ-u1` |
| `subject_id` | `varchar(50)` | FK → subjects.id（CASCADE） | — |
| `title` | `jsonb` | NOT NULL | `{"zh": "...", "en": "..."}` |
| `subtitle` | `jsonb` | — | 副标题 |
| `color` | `varchar(20)` | — | — |
| `order` | `integer` | NOT NULL | 排序权重 |
| `created_at` | `timestamp` | DEFAULT NOW() | — |

---

### `chapters`（章节）

| 列名 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | `varchar(50)` | PK | 如 `p1c1`, `e2c3`，格式 `{前缀}{单元}{c}{章}` |
| `unit_id` | `varchar(50)` | FK → units.id（CASCADE） | — |
| `num` | `integer` | NOT NULL | 章节序号 |
| `title` | `jsonb` | NOT NULL | `{"zh": "...", "en": "..."}` |
| `overview` | `jsonb` | — | 章节概述 |
| `key_points` | `jsonb` | — | 知识要点数组 `["KP1", "KP2", ...]` |
| `formulas` | `jsonb` | — | 公式数组 |
| `examples` | `jsonb` | — | 例题数组 |
| `videos` | `jsonb` | — | 视频数组 `[{"title": "...", "url": "..."}]` |
| `order` | `integer` | NOT NULL | 排序权重 |
| `created_at` | `timestamp` | DEFAULT NOW() | — |

**Chapter ID 前缀规则：**

| 前缀 | 学科 |
|------|------|
| `p`, `s`, `m` | Mathematics |
| `e` | Economics |
| `h` | History |
| `pol` | Politics（注意：不是 `p`，避免与数学冲突） |
| `psy` | Psychology |
| `fm`, `fmech`, `fs`, `fp` | Further Math |

---

## 3. 用户相关表

### `users`（用户）

| 列名 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | `serial` | PK | 自增整数 |
| `wechat_openid` | `varchar(100)` | UNIQUE | 微信登录（备用） |
| `wechat_unionid` | `varchar(100)` | — | — |
| `google_id` | `varchar(255)` | UNIQUE | Google OAuth |
| `nickname` | `varchar(100)` | — | 显示名称 |
| `avatar` | `text` | — | 头像 URL |
| `email` | `varchar(255)` | UNIQUE | 邮箱登录 |
| `password` | `varchar(255)` | — | bcrypt 加密，Google 登录用户为 null |
| `phone` | `varchar(20)` | — | — |
| `role` | `varchar(20)` | NOT NULL, DEFAULT `'user'` | `'user'` 或 `'admin'` |
| `grade` | `varchar(20)` | — | `'AS'` 或 `'A2'` |
| `target_university` | `varchar(100)` | — | — |
| `created_at` | `timestamp` | DEFAULT NOW() | — |
| `updated_at` | `timestamp` | DEFAULT NOW() | — |
| `last_login_at` | `timestamp` | — | — |

---

### `user_profiles`（用户画像）

| 列名 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | `serial` | PK | — |
| `user_id` | `integer` | FK → users.id（CASCADE），UNIQUE | 一对一 |
| `selected_subjects` | `jsonb` | DEFAULT `[]` | 已选学科，如 `["mathematics", "economics"]` |
| `study_goals` | `text` | — | 学习目标文字描述 |
| `weekly_study_hours` | `integer` | — | 每周学习小时目标 |
| `preferred_study_time` | `varchar(20)` | — | `morning`/`afternoon`/`evening`/`night` |
| `notification_enabled` | `boolean` | DEFAULT true | — |
| `created_at` | `timestamp` | DEFAULT NOW() | — |
| `updated_at` | `timestamp` | DEFAULT NOW() | — |

---

### `learning_progress`（学习进度）

| 列名 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | `serial` | PK | — |
| `user_id` | `integer` | FK → users.id（CASCADE） | — |
| `chapter_id` | `varchar(50)` | FK → chapters.id（CASCADE） | — |
| `status` | `varchar(20)` | NOT NULL, DEFAULT `'not_started'` | `'not_started'`/`'in_progress'`/`'completed'` |
| `mastery_level` | `integer` | DEFAULT 0 | 0–100，由考试/练习得分决定 |
| `time_spent` | `integer` | DEFAULT 0 | 累计用时（秒），每次写入累加 |
| `last_reviewed_at` | `timestamp` | — | 最后一次复习时间 |
| `completed_at` | `timestamp` | — | 首次完成时间 |
| `created_at` | `timestamp` | DEFAULT NOW() | — |
| `updated_at` | `timestamp` | DEFAULT NOW() | — |

**进度写入规则：**
- Practice 结束：≥ 70% → `completed`，否则 `in_progress`
- Exam 批改后：≥ 60% → `completed`，否则 `in_progress`

---

### `user_stats`（学习统计）

| 列名 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | `serial` | PK | — |
| `user_id` | `integer` | FK → users.id（CASCADE），UNIQUE | 一对一 |
| `total_study_time` | `integer` | DEFAULT 0 | 总学习秒数 |
| `total_chapters_completed` | `integer` | DEFAULT 0 | — |
| `total_questions_answered` | `integer` | DEFAULT 0 | — |
| `correct_answers_count` | `integer` | DEFAULT 0 | — |
| `current_streak` | `integer` | DEFAULT 0 | 连续学习天数 |
| `longest_streak` | `integer` | DEFAULT 0 | 历史最长连续天数 |
| `last_study_date` | `timestamp` | — | — |
| `created_at` | `timestamp` | DEFAULT NOW() | — |
| `updated_at` | `timestamp` | DEFAULT NOW() | — |

---

## 4. 题库相关表

### `questions`（题目）

| 列名 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | `serial` | PK | 自增整数 |
| `chapter_id` | `varchar(50)` | FK → chapters.id（CASCADE）NOT NULL | — |
| `type` | `varchar(20)` | NOT NULL | `'multiple_choice'`/`'fill_blank'`/`'calculation'`/`'proof'`/`'short_answer'` |
| `difficulty` | `integer` | NOT NULL | 1–5（1最简单，5最难） |
| `content` | `jsonb` | NOT NULL | `{"zh": "...", "en": "...", "latex": "..."}` |
| `options` | `jsonb` | — | 选择题选项 `["A. ...", "B. ..."]`，非选择题为 null |
| `answer` | `jsonb` | NOT NULL | `{"value": "A", "latex": "...", "explanation": "..."}` |
| `explanation` | `jsonb` | — | `{"zh": "...", "en": "...", "keyFormula": "...", "commonMistake": "..."}` |
| `tags` | `jsonb` | DEFAULT `[]` | 知识点标签 `["algebra", "functions"]` |
| `source` | `varchar(50)` | DEFAULT `'manual'` | `'manual'`/`'ai_generated'`/`'uploaded'`/`'exam'` |
| `source_document_id` | `integer` | — | 来源文档 ID |
| `estimated_time` | `integer` | DEFAULT 300 | 预计用时（秒） |
| `usage_count` | `integer` | DEFAULT 0 | 被使用次数 |
| `correct_rate` | `real` | — | 历史正确率（0–1） |
| `status` | `varchar(20)` | DEFAULT `'draft'` | `'draft'`/`'reviewed'`/`'published'` |
| `reviewed_by` | `integer` | — | 审核人 user_id |
| `reviewed_at` | `timestamp` | — | — |
| `created_by` | `integer` | — | 创建人 user_id |
| `created_at` | `timestamp` | DEFAULT NOW() | — |
| `updated_at` | `timestamp` | DEFAULT NOW() | — |

**查询约定：** 练习/考试只查 `status = 'published'` 的题目。

---

### `question_sets`（试卷/题集）

| 列名 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | `serial` | PK | — |
| `user_id` | `integer` | FK → users.id（nullable） | null = 公开题集（如模拟卷） |
| `title` | `varchar(255)` | NOT NULL | — |
| `description` | `text` | — | — |
| `type` | `varchar(50)` | NOT NULL | `'practice'`/`'exam'`/`'mock_exam'` |
| `chapter_id` | `varchar(50)` | FK → chapters.id（nullable） | — |
| `question_ids` | `jsonb` | NOT NULL | 题目 ID 数组 `[1, 2, 3, ...]` |
| `total_questions` | `integer` | NOT NULL | — |
| `total_points` | `integer` | DEFAULT 100 | 满分 |
| `time_limit` | `integer` | — | 时限（秒），null = 无限制 |
| `difficulty_distribution` | `jsonb` | — | `{"1": 2, "2": 3, "3": 4}` |
| `generated_by` | `varchar(50)` | DEFAULT `'manual'` | `'manual'`/`'ai'`/`'random'` |
| `created_at` | `timestamp` | DEFAULT NOW() | — |
| `updated_at` | `timestamp` | DEFAULT NOW() | — |

---

### `uploaded_documents`（上传文档）

| 列名 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | `serial` | PK | — |
| `user_id` | `integer` | FK → users.id（CASCADE）NOT NULL | — |
| `chapter_id` | `varchar(50)` | FK → chapters.id（nullable） | — |
| `file_name` | `varchar(255)` | NOT NULL | — |
| `file_type` | `varchar(50)` | NOT NULL | `'pdf'`/`'docx'` |
| `file_size` | `integer` | NOT NULL | 字节数 |
| `file_url` | `text` | — | 云存储 URL |
| `status` | `varchar(20)` | DEFAULT `'pending'` | `'pending'`/`'processing'`/`'completed'`/`'failed'` |
| `parse_result` | `jsonb` | — | AI 解析结果 |
| `extracted_questions_count` | `integer` | DEFAULT 0 | 提取题目数量 |
| `error_message` | `text` | — | 失败原因 |
| `created_at` | `timestamp` | DEFAULT NOW() | — |
| `processed_at` | `timestamp` | — | — |

---

### `user_answers`（答题记录）

| 列名 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | `serial` | PK | — |
| `user_id` | `integer` | FK → users.id（CASCADE）NOT NULL | — |
| `question_id` | `integer` | FK → questions.id（CASCADE）NOT NULL | — |
| `question_set_id` | `integer` | — | 关联试卷（可空） |
| `user_answer` | `jsonb` | NOT NULL | — |
| `is_correct` | `boolean` | — | null = 主观题未批改 |
| `score` | `real` | — | — |
| `time_spent` | `integer` | — | 秒 |
| `ai_feedback` | `jsonb` | — | AI 批改结果 |
| `ai_score` | `real` | — | — |
| `created_at` | `timestamp` | DEFAULT NOW() | — |

---

## 5. 考试系统表

### `exams`（考试记录）

| 列名 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | `serial` | PK | — |
| `user_id` | `integer` | FK → users.id（CASCADE）NOT NULL | — |
| `question_set_id` | `integer` | FK → question_sets.id（CASCADE）NOT NULL | — |
| `type` | `varchar(50)` | NOT NULL | `'chapter_test'`/`'unit_test'`/`'mock_exam'`/`'diagnostic'`/`'real_exam'` |
| `mode` | `varchar(20)` | NOT NULL | `'practice'`/`'exam'`/`'challenge'` |
| `status` | `varchar(20)` | NOT NULL, DEFAULT `'in_progress'` | `'in_progress'`/`'submitted'`/`'graded'`/`'abandoned'` |
| `time_limit` | `integer` | — | 秒，null = 无限 |
| `allow_review` | `boolean` | DEFAULT true | 是否允许返回修改 |
| `answers` | `jsonb` | NOT NULL, DEFAULT `'{}'` | `{questionId: answer}` 实时保存 |
| `marked_questions` | `jsonb` | DEFAULT `'[]'` | 标记的题目 ID 数组 |
| `started_at` | `timestamp` | NOT NULL, DEFAULT NOW() | — |
| `submitted_at` | `timestamp` | — | — |
| `time_spent` | `integer` | — | 实际用时（秒） |
| `total_score` | `real` | — | 得分 |
| `max_score` | `real` | — | 满分 |
| `correct_count` | `integer` | — | 正确题数 |
| `total_count` | `integer` | — | 总题数 |
| `difficulty_stats` | `jsonb` | — | 按难度统计 |
| `topic_stats` | `jsonb` | — | 按知识点统计 |
| `type_stats` | `jsonb` | — | 按题型统计 |
| `ai_feedback` | `jsonb` | — | `{overall, strengths, weaknesses, suggestions}` |
| `tab_switch_count` | `integer` | DEFAULT 0 | 切换标签页次数（防作弊） |
| `focus_lost_count` | `integer` | DEFAULT 0 | 失焦次数 |
| `created_at` | `timestamp` | DEFAULT NOW() | — |
| `updated_at` | `timestamp` | DEFAULT NOW() | — |

**自动过期：** 超过 48 小时未完成的 `in_progress` 考试在 GET /api/exams 时自动标记为 `abandoned`。

---

### `exam_question_results`（逐题结果 / 错题本核心表）

> 此表承担双重职责：考试逐题批改结果 + 错题本（Practice 错题）

| 列名 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | `serial` | PK | — |
| `exam_id` | `integer` | FK → exams.id（CASCADE），**nullable** | null = 来自 Practice 的错题记录 |
| `user_id` | `integer` | FK → users.id（CASCADE），nullable | Practice 错题通过此字段标记归属 |
| `question_id` | `integer` | FK → questions.id（CASCADE）NOT NULL | — |
| `user_answer` | `jsonb` | NOT NULL | — |
| `is_correct` | `boolean` | NOT NULL | — |
| `score` | `real` | NOT NULL, DEFAULT 0 | — |
| `max_score` | `real` | NOT NULL, DEFAULT 0 | — |
| `time_spent` | `integer` | — | 答题时长（秒） |
| `ai_feedback` | `jsonb` | — | `{explanation, mistakes, suggestions, relatedTopics}` |
| `is_mastered` | `boolean` | NOT NULL, DEFAULT false | 是否已掌握（错题本功能） |
| `created_at` | `timestamp` | DEFAULT NOW() | — |

**权限验证逻辑（两条路径）：**
```sql
-- 考试错题：通过 exam 关联验证归属
WHERE exam_id IN (SELECT id FROM exams WHERE user_id = ?)

-- Practice 错题：直接通过 user_id 验证
WHERE exam_id IS NULL AND user_id = ?
```

---

### `learning_recommendations`（学习推荐）

| 列名 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | `serial` | PK | — |
| `user_id` | `integer` | FK → users.id（CASCADE）NOT NULL | — |
| `exam_id` | `integer` | FK → exams.id（SET NULL），nullable | — |
| `type` | `varchar(50)` | NOT NULL | `'chapter'`/`'video'`/`'practice'`/`'review'` |
| `priority` | `integer` | NOT NULL | 1–5 |
| `chapter_id` | `varchar(50)` | FK → chapters.id，nullable | — |
| `video_url` | `text` | — | — |
| `question_ids` | `jsonb` | — | 推荐练习题 ID 数组 |
| `reason` | `text` | — | 推荐理由 |
| `weak_topics` | `jsonb` | — | 薄弱知识点 |
| `status` | `varchar(20)` | DEFAULT `'pending'` | `'pending'`/`'completed'`/`'skipped'` |
| `completed_at` | `timestamp` | — | — |
| `created_at` | `timestamp` | DEFAULT NOW() | — |
| `expires_at` | `timestamp` | — | 推荐过期时间 |

---

## 6. AI 对话相关表

> ⚠️ 注意：`/chat` 路由已停用（`AppRouter.jsx` 重定向到首页），以下表暂未被前端调用，保留供未来激活使用。

### `chat_sessions`（会话）

| 列名 | 类型 | 说明 |
|------|------|------|
| `id` | `serial` | PK |
| `user_id` | FK → users | — |
| `chapter_id` | FK → chapters | — |
| `title` | `varchar(200)` | — |
| `session_type` | `varchar(20)` | `'learning'`/`'practice'`/`'review'` |
| `status` | `varchar(20)` | `'active'`/`'archived'` |
| `message_count` | `integer` | — |

---

### `chat_messages`（消息）

| 列名 | 类型 | 说明 |
|------|------|------|
| `id` | `serial` | PK |
| `session_id` | FK → chat_sessions | — |
| `role` | `varchar(20)` | `'user'`/`'assistant'`/`'system'` |
| `content` | `text` | — |
| `content_type` | `varchar(20)` | `'text'`/`'latex'`/`'code'` |
| `metadata` | `jsonb` | `{thinking_process, references, difficulty}` |
| `tokens_used` | `integer` | — |

---

### `chat_contexts`（上下文）

| 列名 | 类型 | 说明 |
|------|------|------|
| `session_id` | FK → chat_sessions | — |
| `context_type` | `varchar(50)` | `'chapter'`/`'knowledge_point'`/`'problem'` |
| `context_data` | `jsonb` | — |
| `relevance_score` | `real` | 0.0–1.0 |

---

### `user_knowledge_graph`（知识图谱）

| 列名 | 类型 | 说明 |
|------|------|------|
| `user_id` | FK → users | — |
| `knowledge_point_id` | `varchar(100)` | — |
| `mastery_level` | `integer` | 0–100 |
| `practice_count` | `integer` | — |
| `correct_count` | `integer` | — |

---

### `ai_conversations`（旧对话，兼容保留）

| 列名 | 类型 | 说明 |
|------|------|------|
| `user_id` | FK → users | — |
| `session_id` | `varchar(100)` | — |
| `messages` | `jsonb` | `[{role, content}]` |
| `context` | `jsonb` | — |

---

## 7. 索引与性能

主要查询索引建议（`add-indexes.js` 脚本管理）：

```sql
-- 最高频查询：按用户+章节查进度
CREATE INDEX ON learning_progress (user_id, chapter_id);

-- 错题本查询
CREATE INDEX ON exam_question_results (exam_id, is_correct);
CREATE INDEX ON exam_question_results (user_id, is_correct);

-- 考试列表
CREATE INDEX ON exams (user_id, created_at DESC);
CREATE INDEX ON exams (status);

-- 题库查询
CREATE INDEX ON questions (chapter_id, status, difficulty);
CREATE INDEX ON questions (status);
```

---

## 8. 数据约束说明

### JSONB 字段格式

**`content`（题目内容）：**
```json
{ "zh": "中文题目", "en": "English question", "latex": "$$...$$" }
```

**`answer`（答案）：**
```json
{ "value": "A", "latex": "x = \\frac{1}{2}", "explanation": "..." }
```

**`title`（双语标题，chapters / units / subjects）：**
```json
{ "zh": "函数与方程", "en": "Functions and Equations" }
```

**`ai_feedback`（考试/题目 AI 反馈）：**
```json
{
  "overall": "整体表现...",
  "strengths": ["代数运算熟练"],
  "weaknesses": ["对数函数掌握不足"],
  "suggestions": ["多练 Chapter 5 对数题目"]
}
```

### 枚举值

| 表 | 列 | 允许值 |
|----|----|----|
| `users` | `role` | `user`, `admin` |
| `users` | `grade` | `AS`, `A2` |
| `learning_progress` | `status` | `not_started`, `in_progress`, `completed` |
| `questions` | `type` | `multiple_choice`, `fill_blank`, `calculation`, `proof`, `short_answer` |
| `questions` | `status` | `draft`, `reviewed`, `published` |
| `exams` | `type` | `chapter_test`, `unit_test`, `mock_exam`, `diagnostic`, `real_exam` |
| `exams` | `mode` | `practice`, `exam`, `challenge` |
| `exams` | `status` | `in_progress`, `submitted`, `graded`, `abandoned` |
| `question_sets` | `type` | `practice`, `exam`, `mock_exam` |
