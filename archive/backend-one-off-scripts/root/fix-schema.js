// 手动修复数据库 schema
import postgres from 'postgres'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const sql = postgres(process.env.DATABASE_URL)

async function fixSchema() {
  try {
    console.log('🔧 开始修复数据库 schema...')

    // 1. 添加 password 列（如果不存在）
    console.log('1. 添加 password 列...')
    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS password varchar(255)
    `
    console.log('✅ password 列已添加')

    // 2. 添加 email 唯一约束（如果不存在）
    console.log('2. 检查 email 唯一约束...')
    try {
      await sql`
        ALTER TABLE users
        ADD CONSTRAINT users_email_unique UNIQUE(email)
      `
      console.log('✅ email 唯一约束已添加')
    } catch (err) {
      if (err.code === '23505') {
        console.log('⚠️  email 列有重复数据，清理中...')
        // 删除重复的邮箱（保留最早的）
        await sql`
          DELETE FROM users a USING users b
          WHERE a.id > b.id AND a.email = b.email AND a.email IS NOT NULL
        `
        console.log('✅ 重复数据已清理')
        // 再次尝试添加约束
        await sql`
          ALTER TABLE users
          ADD CONSTRAINT users_email_unique UNIQUE(email)
        `
        console.log('✅ email 唯一约束已添加')
      } else if (err.code === '42P07') {
        console.log('✅ email 唯一约束已存在')
      } else {
        throw err
      }
    }

    console.log('🎉 数据库 schema 修复完成！')
  } catch (error) {
    console.error('❌ 修复失败:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

fixSchema()
