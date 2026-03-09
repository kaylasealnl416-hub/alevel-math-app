import { db } from './index.js'
import { sql } from 'drizzle-orm'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 应用 Phase 4 数据库迁移
 */

async function applyMigration() {
  console.log('🚀 开始应用 Phase 4 数据库迁移...\n')

  try {
    // 读取迁移 SQL 文件
    const migrationPath = path.join(__dirname, 'migrations', '0005_typical_quasar.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')

    // 分割 SQL 语句（按 statement-breakpoint 分割）
    const statements = migrationSQL
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(s => s.length > 0)

    console.log(`📝 找到 ${statements.length} 条 SQL 语句\n`)

    // 逐条执行
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      console.log(`${i + 1}/${statements.length} 执行: ${statement.substring(0, 50)}...`)

      try {
        await db.execute(sql.raw(statement))
        console.log(`   ✅ 成功\n`)
      } catch (error) {
        // 如果表已存在，跳过
        if (error.message.includes('already exists')) {
          console.log(`   ⏭️  跳过（已存在）\n`)
        } else {
          throw error
        }
      }
    }

    console.log('✅ Phase 4 数据库迁移完成！\n')

    // 验证表是否创建成功
    console.log('🔍 验证表创建...')
    const tables = ['exams', 'exam_question_results', 'learning_recommendations']

    for (const table of tables) {
      const result = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_name = ${table}
        )
      `)
      const exists = result.rows[0]?.exists || result[0]?.exists
      console.log(`   ${exists ? '✅' : '❌'} ${table}`)
    }

  } catch (error) {
    console.error('❌ 迁移失败：', error.message)
    console.error(error)
    process.exit(1)
  }
}

// 运行迁移
applyMigration()
  .then(() => {
    console.log('\n🎉 迁移成功完成！')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 迁移过程出错：', error)
    process.exit(1)
  })
