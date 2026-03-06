import postgres from 'postgres'

const connectionString = 'postgresql://postgres.mozzqjeusrjuxycwpyld:SNll19501030%23@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres'

console.log('尝试连接到数据库...')
console.log('连接字符串:', connectionString.replace(/:[^:@]+@/, ':***@'))

try {
  const sql = postgres(connectionString, {
    max: 1,
    connect_timeout: 10,
    debug: true,
  })

  const result = await sql`SELECT version()`
  console.log('\n✅ 连接成功！')
  console.log('PostgreSQL版本:', result[0].version)

  await sql.end()
} catch (error) {
  console.error('\n❌ 连接失败')
  console.error('错误类型:', error.constructor.name)
  console.error('错误信息:', error.message)
  console.error('错误代码:', error.code)
  console.error('\n完整错误:', error)
}
