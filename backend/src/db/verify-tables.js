import { db } from './index.js'
import { sql } from 'drizzle-orm'

console.log('📊 查询数据库表...\n')

try {
  // 查询所有表
  const tables = await db.execute(sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `)

  console.log('✅ 数据库表列表：')
  tables.forEach((row, i) => {
    console.log(`${i + 1}. ${row.table_name}`)
  })

  console.log(`\n总共 ${tables.length} 个表`)

  process.exit(0)
} catch (error) {
  console.error('❌ 查询失败:', error.message)
  process.exit(1)
}
