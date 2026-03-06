import { testConnection, closeConnection } from './index.js'

console.log('🔍 测试数据库连接...\n')

const success = await testConnection()

if (success) {
  console.log('\n✅ 数据库配置正确！')
  console.log('\n下一步：')
  console.log('1. 生成迁移脚本：bun run db:generate')
  console.log('2. 执行迁移：bun run db:migrate')
  console.log('3. 查看数据库：bun run db:studio')
} else {
  console.log('\n❌ 数据库配置有问题')
  console.log('\n请检查：')
  console.log('1. DATABASE_URL 是否正确配置在 .env.local')
  console.log('2. 数据库服务是否正在运行')
  console.log('3. 网络连接是否正常')
  console.log('\n查看详细配置指南：DATABASE_SETUP.md')
}

await closeConnection()
process.exit(success ? 0 : 1)
