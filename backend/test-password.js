// 测试不同的密码编码方式
const passwords = [
  'SNll19501030#',           // 原始密码
  'SNll19501030%23',         // # 编码为 %23
  encodeURIComponent('SNll19501030#'),  // 完整URL编码
]

console.log('测试不同的密码编码：')
passwords.forEach((pwd, i) => {
  console.log(`${i + 1}. ${pwd}`)
})

// 构建连接字符串
const testUrl = `postgresql://postgres.mozzqjeusrjuxycwpyld:${encodeURIComponent('SNll19501030#')}@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`
console.log('\n推荐的连接字符串：')
console.log(testUrl)
