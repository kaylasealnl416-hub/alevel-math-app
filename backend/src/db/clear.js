import { db } from './index.js'
import { sql } from 'drizzle-orm'

console.log('🗑️  清空数据库...\n')

try {
  // 按照依赖顺序删除（先删除子表，再删除父表）
  await db.execute(sql`TRUNCATE TABLE ai_conversations CASCADE`)
  await db.execute(sql`TRUNCATE TABLE user_answers CASCADE`)
  await db.execute(sql`TRUNCATE TABLE questions CASCADE`)
  await db.execute(sql`TRUNCATE TABLE learning_progress CASCADE`)
  await db.execute(sql`TRUNCATE TABLE chapters CASCADE`)
  await db.execute(sql`TRUNCATE TABLE units CASCADE`)
  await db.execute(sql`TRUNCATE TABLE subjects CASCADE`)
  await db.execute(sql`TRUNCATE TABLE users CASCADE`)

  console.log('✅ 数据库已清空')
  process.exit(0)
} catch (error) {
  console.error('❌ 清空失败:', error.message)
  process.exit(1)
}
