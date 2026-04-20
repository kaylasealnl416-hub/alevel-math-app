import postgres from 'postgres'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const sql = postgres(process.env.DATABASE_URL)

async function checkData() {
  try {
    console.log('🔍 检查数据库数据...\n')
    
    const subjects = await sql`SELECT COUNT(*) FROM subjects`
    const units = await sql`SELECT COUNT(*) FROM units`
    const chapters = await sql`SELECT COUNT(*) FROM chapters`
    const users = await sql`SELECT COUNT(*) FROM users`
    
    console.log('📊 数据统计：')
    console.log(`   - 科目数：${subjects[0].count}`)
    console.log(`   - 单元数：${units[0].count}`)
    console.log(`   - 章节数：${chapters[0].count}`)
    console.log(`   - 用户数：${users[0].count}`)
    
    if (subjects[0].count === '0') {
      console.log('\n⚠️  数据库为空，需要导入数据')
    } else {
      console.log('\n✅ 数据库已有数据')
    }
    
    await sql.end()
  } catch (error) {
    console.error('❌ 错误:', error.message)
    process.exit(1)
  }
}

checkData()
