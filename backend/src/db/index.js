import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import dotenv from 'dotenv'
import * as schema from './schema.js'

// 加载环境变量
dotenv.config({ path: '.env.local' })

// 检查数据库URL
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL 未配置')
  console.error('请查看 DATABASE_SETUP.md 了解如何配置数据库')
  process.exit(1)
}

// 创建PostgreSQL连接
const client = postgres(process.env.DATABASE_URL, {
  max: 10, // 最大连接数
  idle_timeout: 20, // 空闲超时（秒）
  connect_timeout: 10, // 连接超时（秒）
})

// 创建Drizzle实例
export const db = drizzle(client, { schema })

// 测试数据库连接
export async function testConnection() {
  try {
    await client`SELECT 1`
    console.log('✅ 数据库连接成功')
    return true
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message)
    return false
  }
}

// 优雅关闭
export async function closeConnection() {
  await client.end()
  console.log('🔌 数据库连接已关闭')
}
