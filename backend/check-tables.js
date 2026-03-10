import { db } from './src/db/index.js'
import { sql } from 'drizzle-orm'

async function checkTables() {
  try {
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'learning_recommendations'
      );
    `)

    console.log('learning_recommendations 表存在:', result[0]?.exists || false)

    const tables = await db.execute(sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `)

    console.log('\n所有表:')
    tables.forEach(row => console.log('  -', row.table_name))

    const migrations = await db.execute(sql`
      SELECT * FROM drizzle.__drizzle_migrations
      ORDER BY created_at DESC
      LIMIT 5;
    `)

    console.log('\n最近的迁移记录:')
    migrations.forEach(m => console.log('  -', m.hash, m.created_at))

    process.exit(0)
  } catch (error) {
    console.error('错误:', error.message)
    process.exit(1)
  }
}

checkTables()
