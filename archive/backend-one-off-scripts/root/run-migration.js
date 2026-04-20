import postgres from 'postgres'
import { readFileSync } from 'fs'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const sql = postgres(process.env.DATABASE_URL)

async function runMigration() {
  try {
    console.log('🔧 开始执行数据库迁移...')

    // 读取迁移文件
    const migrationSQL = readFileSync('./src/db/migrations/0004_fluffy_justice.sql', 'utf-8')

    // 分割 SQL 语句
    const statements = migrationSQL
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(s => s.length > 0)

    console.log(`📝 共 ${statements.length} 条 SQL 语句`)

    // 逐条执行
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      console.log(`\n[${i + 1}/${statements.length}] 执行: ${statement.substring(0, 60)}...`)

      try {
        await sql.unsafe(statement)
        console.log('✅ 成功')
      } catch (error) {
        // 忽略已存在的错误
        if (error.code === '42P07' || error.code === '42701') {
          console.log('⚠️  已存在，跳过')
        } else {
          console.error('❌ 失败:', error.message)
          throw error
        }
      }
    }

    console.log('\n🎉 数据库迁移完成！')

  } catch (error) {
    console.error('\n❌ 迁移失败:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

runMigration()
