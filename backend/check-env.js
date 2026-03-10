/**
 * 环境变量检查脚本
 * 确保所有必需的环境变量都已配置
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'ZHIPU_API_KEY'
]

const optionalEnvVars = [
  'PORT',
  'NODE_ENV',
  'CORS_ORIGIN'
]

console.log('🔍 检查环境变量配置...\n')

let hasErrors = false

// 检查必需的环境变量
console.log('📋 必需的环境变量:')
for (const varName of requiredEnvVars) {
  const value = process.env[varName]
  if (!value) {
    console.log(`  ❌ ${varName}: 未设置`)
    hasErrors = true
  } else {
    // 隐藏敏感信息
    const displayValue = varName.includes('SECRET') || varName.includes('KEY') || varName.includes('URL')
      ? '***' + value.slice(-4)
      : value
    console.log(`  ✅ ${varName}: ${displayValue}`)
  }
}

// 检查可选的环境变量
console.log('\n📋 可选的环境变量:')
for (const varName of optionalEnvVars) {
  const value = process.env[varName]
  if (value) {
    console.log(`  ✅ ${varName}: ${value}`)
  } else {
    console.log(`  ⚠️  ${varName}: 未设置（使用默认值）`)
  }
}

console.log('\n' + '='.repeat(60))

if (hasErrors) {
  console.log('❌ 环境变量配置不完整，请检查 .env.local 文件')
  process.exit(1)
} else {
  console.log('✅ 环境变量配置完整')
  process.exit(0)
}
