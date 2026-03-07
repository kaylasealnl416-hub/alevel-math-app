import postgres from 'postgres'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const sql = postgres(process.env.DATABASE_URL)

async function checkTables() {
  try {
    console.log('🔍 检查数据库表...\n')
    
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    
    if (tables.length === 0) {
      console.log('❌ 数据库中没有表，需要执行迁移')
    } else {
      console.log(`✅ 找到 ${tables.length} 个表：\n`)
      tables.forEach(t => console.log(`   - ${t.table_name}`))
    }
    
    await sql.end()
  } catch (error) {
    console.error('❌ 错误:', error.message)
    process.exit(1)
  }
}

checkTables()
