import { pgTable, serial, text, timestamp, varchar, integer } from 'drizzle-orm/pg-core'

// 用户会话表（用于管理JWT Token）
export const userSessions = pgTable('user_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  token: text('token').notNull().unique(),
  refreshToken: text('refresh_token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  lastActiveAt: timestamp('last_active_at').defaultNow(),
  userAgent: text('user_agent'),
  ipAddress: varchar('ip_address', { length: 45 }),
})

// 用户设置表
export const userSettings = pgTable('user_settings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().unique(),
  language: varchar('language', { length: 10 }).default('zh'),
  theme: varchar('theme', { length: 20 }).default('light'),
  notificationsEnabled: boolean('notifications_enabled').default(true),
  emailNotifications: boolean('email_notifications').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
