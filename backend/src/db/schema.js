import { pgTable, serial, text, jsonb, timestamp, integer, boolean, varchar } from 'drizzle-orm/pg-core'

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
  nickname: varchar('nickname', { length: 100 }),
  avatar: text('avatar'),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  grade: varchar('grade', { length: 20 }), // 'AS' | 'A2'
  targetUniversity: varchar('target_university', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  lastLoginAt: timestamp('last_login_at'),
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
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ============================================================
// 题库相关表（Phase 3需要）
// ============================================================

// 题库表
export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  chapterId: varchar('chapter_id', { length: 50 }).notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 20 }).notNull(), // 'multiple_choice' | 'fill_blank' | 'calculation' | 'proof'
  difficulty: integer('difficulty').notNull(), // 1-5
  content: jsonb('content').notNull(),
  answer: jsonb('answer').notNull(),
  explanation: jsonb('explanation'),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow(),
  createdBy: varchar('created_by', { length: 20 }).default('manual'), // 'manual' | 'ai'
})

// 答题记录表
export const userAnswers = pgTable('user_answers', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  questionId: integer('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
  userAnswer: jsonb('user_answer').notNull(),
  isCorrect: boolean('is_correct').notNull(),
  timeSpent: integer('time_spent'), // 秒
  createdAt: timestamp('created_at').defaultNow(),
})

// ============================================================
// AI对话相关表（Phase 2需要）
// ============================================================

// AI对话历史表
export const aiConversations = pgTable('ai_conversations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sessionId: varchar('session_id', { length: 100 }).notNull(),
  messages: jsonb('messages').notNull(), // [{"role": "user", "content": "..."}, ...]
  context: jsonb('context'), // 上下文信息
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
