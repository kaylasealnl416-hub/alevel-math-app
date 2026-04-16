import { pgTable, serial, text, jsonb, timestamp, integer, boolean, varchar, real } from 'drizzle-orm/pg-core'

// ============================================================
// 科目相关表
// ============================================================

// 科目表
export const subjects = pgTable('subjects', {
  id: varchar('id', { length: 50 }).primaryKey(), // 'mathematics', 'economics'
  name: jsonb('name').notNull(), // {"zh": "数学", "en": "Mathematics"}
  nameFull: jsonb('name_full'),
  icon: varchar('icon', { length: 10 }),
  color: varchar('color', { length: 20 }),
  bgColor: varchar('bg_color', { length: 20 }),
  level: text('level'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// 单元表
export const units = pgTable('units', {
  id: varchar('id', { length: 50 }).primaryKey(), // 'Unit1', 'Unit2'
  subjectId: varchar('subject_id', { length: 50 }).notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  title: jsonb('title').notNull(),
  subtitle: jsonb('subtitle'),
  color: varchar('color', { length: 20 }),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// 章节表
export const chapters = pgTable('chapters', {
  id: varchar('id', { length: 50 }).primaryKey(), // 'e1c1', 'm1c1'
  unitId: varchar('unit_id', { length: 50 }).notNull().references(() => units.id, { onDelete: 'cascade' }),
  num: integer('num').notNull(),
  title: jsonb('title').notNull(),
  overview: jsonb('overview'),
  keyPoints: jsonb('key_points'), // 数组
  formulas: jsonb('formulas'), // 数组
  examples: jsonb('examples'), // 数组
  videos: jsonb('videos'), // 数组
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// ============================================================
// 用户相关表（Phase 1需要）
// ============================================================

// 用户表
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  wechatOpenid: varchar('wechat_openid', { length: 100 }).unique(),
  wechatUnionid: varchar('wechat_unionid', { length: 100 }),
  googleId: varchar('google_id', { length: 255 }).unique(),
  nickname: varchar('nickname', { length: 100 }),
  avatar: text('avatar'),
  email: varchar('email', { length: 255 }).unique(),
  password: varchar('password', { length: 255 }), // bcrypt 加密后的密码
  phone: varchar('phone', { length: 20 }),
  role: varchar('role', { length: 20 }).notNull().default('user'), // 'user' | 'admin'
  grade: varchar('grade', { length: 20 }), // 'AS' | 'A2'
  targetUniversity: varchar('target_university', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  lastLoginAt: timestamp('last_login_at'),
})

// 用户画像表
export const userProfiles = pgTable('user_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  selectedSubjects: jsonb('selected_subjects').default([]), // ['mathematics', 'economics']
  studyGoals: text('study_goals'),
  weeklyStudyHours: integer('weekly_study_hours'),
  preferredStudyTime: varchar('preferred_study_time', { length: 20 }), // 'morning' | 'afternoon' | 'evening' | 'night'
  notificationEnabled: boolean('notification_enabled').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// 学习进度表
export const learningProgress = pgTable('learning_progress', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  chapterId: varchar('chapter_id', { length: 50 }).notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 20 }).notNull().default('not_started'), // 'not_started' | 'in_progress' | 'completed'
  masteryLevel: integer('mastery_level').default(0), // 0-100
  timeSpent: integer('time_spent').default(0), // 秒
  lastReviewedAt: timestamp('last_reviewed_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// 学习统计表
export const userStats = pgTable('user_stats', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  totalStudyTime: integer('total_study_time').default(0), // 总学习时长（秒）
  totalChaptersCompleted: integer('total_chapters_completed').default(0),
  totalQuestionsAnswered: integer('total_questions_answered').default(0),
  correctAnswersCount: integer('correct_answers_count').default(0),
  currentStreak: integer('current_streak').default(0), // 连续学习天数
  longestStreak: integer('longest_streak').default(0),
  lastStudyDate: timestamp('last_study_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ============================================================
// 题库相关表（Phase 3需要）
// ============================================================

// 题库表（Phase 3 扩展）
export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  chapterId: varchar('chapter_id', { length: 50 }).notNull().references(() => chapters.id, { onDelete: 'cascade' }),

  // 题目基本信息
  type: varchar('type', { length: 20 }).notNull(), // 'multiple_choice' | 'fill_blank' | 'calculation' | 'proof'
  difficulty: integer('difficulty').notNull(), // 1-5
  content: jsonb('content').notNull(), // { zh: '', en: '', latex: '' }
  options: jsonb('options'), // 选择题选项 ['A. ...', 'B. ...', 'C. ...', 'D. ...']
  answer: jsonb('answer').notNull(), // { value: '', latex: '', explanation: '' }
  explanation: jsonb('explanation'), // { zh: '', en: '' }

  // Phase 3 新增字段
  tags: jsonb('tags').default([]), // 知识点标签数组 ['供需理论', '市场均衡']
  source: varchar('source', { length: 50 }).default('manual'), // 'manual' | 'ai_generated' | 'uploaded' | 'exam'
  sourceDocumentId: integer('source_document_id'), // 来源文档 ID（关联 uploadedDocuments）
  estimatedTime: integer('estimated_time').default(300), // 预计完成时间（秒）
  usageCount: integer('usage_count').default(0), // 使用次数
  correctRate: real('correct_rate'), // 正确率（0-1）

  // 审核状态
  status: varchar('status', { length: 20 }).default('draft'), // 'draft' | 'reviewed' | 'published'
  reviewedBy: integer('reviewed_by'), // 审核人 ID（关联 users）
  reviewedAt: timestamp('reviewed_at'),

  createdBy: integer('created_by'), // 创建人 ID（关联 users）
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// 答题记录表（Phase 3 扩展）
export const userAnswers = pgTable('user_answers', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  questionId: integer('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
  questionSetId: integer('question_set_id'), // 关联试卷（关联 questionSets）

  // 答题信息
  userAnswer: jsonb('user_answer').notNull(),
  isCorrect: boolean('is_correct'),
  score: real('score'), // 得分（主观题可能是小数）
  timeSpent: integer('time_spent'), // 答题时长（秒）

  // AI 批改结果
  aiFeedback: jsonb('ai_feedback'), // AI 批改反馈
  aiScore: real('ai_score'), // AI 评分

  createdAt: timestamp('created_at').defaultNow(),
})

// 文档上传表（Phase 3 新增）
export const uploadedDocuments = pgTable('uploaded_documents', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  chapterId: varchar('chapter_id', { length: 50 }).references(() => chapters.id),

  // 文件信息
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileType: varchar('file_type', { length: 50 }).notNull(), // 'pdf' | 'docx'
  fileSize: integer('file_size').notNull(), // bytes
  fileUrl: text('file_url'), // 云存储 URL（可选）

  // 处理状态
  status: varchar('status', { length: 20 }).default('pending'), // 'pending' | 'processing' | 'completed' | 'failed'
  parseResult: jsonb('parse_result'), // AI 解析结果
  extractedQuestionsCount: integer('extracted_questions_count').default(0),
  errorMessage: text('error_message'),

  createdAt: timestamp('created_at').defaultNow(),
  processedAt: timestamp('processed_at'),
})

// 试卷/题集表（Phase 3 新增）
export const questionSets = pgTable('question_sets', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),

  // 试卷信息
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 50 }).notNull(), // 'practice' | 'exam' | 'mock_exam'
  chapterId: varchar('chapter_id', { length: 50 }).references(() => chapters.id),

  // 题目配置
  questionIds: jsonb('question_ids').notNull(), // [1, 2, 3, ...]
  totalQuestions: integer('total_questions').notNull(),
  totalPoints: integer('total_points').default(100),
  timeLimit: integer('time_limit'), // 时间限制（秒）

  // 难度分布
  difficultyDistribution: jsonb('difficulty_distribution'), // { "1": 2, "2": 3, "3": 4, "4": 1, "5": 0 }

  // 生成方式
  generatedBy: varchar('generated_by', { length: 50 }).default('manual'), // 'manual' | 'ai' | 'random'

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ============================================================
// AI对话相关表（Phase 2需要）
// ============================================================

// 会话表
export const chatSessions = pgTable('chat_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  chapterId: varchar('chapter_id', { length: 50 }).references(() => chapters.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 200 }),
  sessionType: varchar('session_type', { length: 20 }).notNull().default('learning'), // 'learning' | 'practice' | 'review'
  status: varchar('status', { length: 20 }).notNull().default('active'), // 'active' | 'archived'
  messageCount: integer('message_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  lastMessageAt: timestamp('last_message_at'),
})

// 消息表
export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  sessionId: integer('session_id').notNull().references(() => chatSessions.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 20 }).notNull(), // 'user' | 'assistant' | 'system'
  content: text('content').notNull(),
  contentType: varchar('content_type', { length: 20 }).default('text'), // 'text' | 'latex' | 'code'
  metadata: jsonb('metadata'), // { thinking_process, references, difficulty }
  tokensUsed: integer('tokens_used'),
  createdAt: timestamp('created_at').defaultNow(),
})

// 上下文表
export const chatContexts = pgTable('chat_contexts', {
  id: serial('id').primaryKey(),
  sessionId: integer('session_id').notNull().references(() => chatSessions.id, { onDelete: 'cascade' }),
  contextType: varchar('context_type', { length: 50 }).notNull(), // 'chapter' | 'knowledge_point' | 'problem'
  contextData: jsonb('context_data').notNull(),
  relevanceScore: real('relevance_score').default(1.0), // 0.0-1.0
  createdAt: timestamp('created_at').defaultNow(),
})

// 用户知识图谱表
export const userKnowledgeGraph = pgTable('user_knowledge_graph', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  knowledgePointId: varchar('knowledge_point_id', { length: 100 }).notNull(),
  masteryLevel: integer('mastery_level').default(0), // 0-100
  lastPracticedAt: timestamp('last_practiced_at'),
  practiceCount: integer('practice_count').default(0),
  correctCount: integer('correct_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// 旧的 AI 对话表（保留用于兼容）
export const aiConversations = pgTable('ai_conversations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sessionId: varchar('session_id', { length: 100 }).notNull(),
  messages: jsonb('messages').notNull(), // [{"role": "user", "content": "..."}, ...]
  context: jsonb('context'), // 上下文信息
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ============================================================
// 考试系统相关表（Phase 4 新增）
// ============================================================

// 考试记录表
export const exams = pgTable('exams', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  questionSetId: integer('question_set_id').notNull().references(() => questionSets.id, { onDelete: 'cascade' }),

  // 考试类型和模式
  type: varchar('type', { length: 50 }).notNull(), // 'chapter_test' | 'unit_test' | 'mock_exam' | 'diagnostic' | 'real_exam'
  mode: varchar('mode', { length: 20 }).notNull(), // 'practice' | 'exam' | 'challenge'
  status: varchar('status', { length: 20 }).notNull().default('in_progress'), // 'in_progress' | 'submitted' | 'graded'

  // 考试配置
  timeLimit: integer('time_limit'), // 时间限制（秒）
  allowReview: boolean('allow_review').default(true), // 是否允许返回修改答案

  // 答题数据
  answers: jsonb('answers').notNull().default('{}'), // { questionId: userAnswer }
  markedQuestions: jsonb('marked_questions').default('[]'), // [questionId] 标记的题目

  // 时间记录
  startedAt: timestamp('started_at').notNull().defaultNow(),
  submittedAt: timestamp('submitted_at'),
  timeSpent: integer('time_spent'), // 实际用时（秒）

  // 成绩数据
  totalScore: real('total_score'),
  maxScore: real('max_score'),
  correctCount: integer('correct_count'),
  totalCount: integer('total_count'),

  // 统计分析
  difficultyStats: jsonb('difficulty_stats'), // { easy: {correct: 5, total: 10}, medium: {...}, hard: {...} }
  topicStats: jsonb('topic_stats'), // { topicId: {correct: 3, total: 5} }
  typeStats: jsonb('type_stats'), // { multiple_choice: {correct: 8, total: 10}, ... }

  // AI 评价
  aiFeedback: jsonb('ai_feedback'), // { overall: "...", strengths: [...], weaknesses: [...], suggestions: [...] }

  // 防作弊记录
  tabSwitchCount: integer('tab_switch_count').default(0), // 切换标签页次数
  focusLostCount: integer('focus_lost_count').default(0), // 失焦次数

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// 考试逐题结果表
export const examQuestionResults = pgTable('exam_question_results', {
  id: serial('id').primaryKey(),
  examId: integer('exam_id').notNull().references(() => exams.id, { onDelete: 'cascade' }),
  questionId: integer('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),

  // 答题数据
  userAnswer: jsonb('user_answer').notNull(),
  isCorrect: boolean('is_correct').notNull(),
  score: real('score').notNull(),
  maxScore: real('max_score').notNull(),
  timeSpent: integer('time_spent'), // 答题时长（秒）

  // AI 点评
  aiFeedback: jsonb('ai_feedback'), // { explanation: "...", mistakes: [...], suggestions: [...], relatedTopics: [...] }

  // 掌握状态
  isMastered: boolean('is_mastered').notNull().default(false),

  createdAt: timestamp('created_at').defaultNow(),
})

// 学习建议表
export const learningRecommendations = pgTable('learning_recommendations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  examId: integer('exam_id').references(() => exams.id, { onDelete: 'set null' }),

  // 推荐类型和优先级
  type: varchar('type', { length: 50 }).notNull(), // 'chapter' | 'video' | 'practice' | 'review'
  priority: integer('priority').notNull(), // 1-5，优先级

  // 推荐内容
  chapterId: varchar('chapter_id', { length: 50 }).references(() => chapters.id),
  videoUrl: text('video_url'),
  questionIds: jsonb('question_ids'), // [questionId]

  // 推荐理由
  reason: text('reason'),
  weakTopics: jsonb('weak_topics'), // [topicName]

  // 状态
  status: varchar('status', { length: 20 }).default('pending'), // 'pending' | 'completed' | 'skipped'
  completedAt: timestamp('completed_at'),

  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at'), // 推荐过期时间
})
