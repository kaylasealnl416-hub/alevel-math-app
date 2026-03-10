/**
 * 生产环境就绪检查
 * 验证系统是否准备好部署到生产环境
 */

import { db } from './src/db/index.js'
import { sql } from 'drizzle-orm'

async function checkProduction() {
  console.log('🔍 生产环境就绪检查\n')
  console.log('='.repeat(60))
  
  const checks = []
  
  // 1. 数据库连接
  console.log('\n📊 数据库连接...')
  try {
    await db.execute(sql`SELECT 1`)
    console.log('  ✅ 数据库连接正常')
    checks.push({ name: '数据库连接', status: 'pass' })
  } catch (error) {
    console.log('  ❌ 数据库连接失败:', error.message)
    checks.push({ name: '数据库连接', status: 'fail', error: error.message })
  }
  
  // 2. 必需的表
  console.log('\n📋 数据库表检查...')
  const requiredTables = [
    'users', 'subjects', 'chapters', 'questions', 'question_sets',
    'exams', 'exam_question_results', 'learning_recommendations'
  ]
  
  try {
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)
    
    const tableNames = tables.map(t => t.table_name)
    let allTablesExist = true
    
    for (const tableName of requiredTables) {
      if (tableNames.includes(tableName)) {
        console.log(`  ✅ ${tableName}`)
      } else {
        console.log(`  ❌ ${tableName} - 缺失`)
        allTablesExist = false
      }
    }
    
    checks.push({ 
      name: '数据库表', 
      status: allTablesExist ? 'pass' : 'fail' 
    })
  } catch (error) {
    console.log('  ❌ 表检查失败:', error.message)
    checks.push({ name: '数据库表', status: 'fail', error: error.message })
  }
  
  // 3. 环境变量
  console.log('\n🔐 环境变量检查...')
  const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET']
  const optionalEnvVars = ['ZHIPU_API_KEY', 'PORT', 'NODE_ENV']
  let allEnvVarsSet = true

  for (const varName of requiredEnvVars) {
    if (process.env[varName]) {
      console.log(`  ✅ ${varName}`)
    } else {
      console.log(`  ❌ ${varName} - 未设置`)
      allEnvVarsSet = false
    }
  }

  for (const varName of optionalEnvVars) {
    if (process.env[varName]) {
      console.log(`  ✅ ${varName} (可选)`)
    } else {
      console.log(`  ⚠️  ${varName} - 未设置 (可选)`)
    }
  }

  checks.push({
    name: '环境变量',
    status: allEnvVarsSet ? 'pass' : 'fail'
  })
  
  // 4. 测试数据
  console.log('\n📝 测试数据检查...')
  try {
    const userCount = await db.execute(sql`SELECT COUNT(*) FROM users`)
    const questionCount = await db.execute(sql`SELECT COUNT(*) FROM questions`)
    const questionSetCount = await db.execute(sql`SELECT COUNT(*) FROM question_sets`)
    
    console.log(`  ℹ️  用户数: ${userCount[0].count}`)
    console.log(`  ℹ️  题目数: ${questionCount[0].count}`)
    console.log(`  ℹ️  试卷数: ${questionSetCount[0].count}`)
    
    const hasData = parseInt(userCount[0].count) > 0 && 
                    parseInt(questionCount[0].count) > 0 && 
                    parseInt(questionSetCount[0].count) > 0
    
    checks.push({ 
      name: '测试数据', 
      status: hasData ? 'pass' : 'warn',
      message: hasData ? '有测试数据' : '缺少测试数据'
    })
  } catch (error) {
    console.log('  ❌ 数据检查失败:', error.message)
    checks.push({ name: '测试数据', status: 'fail', error: error.message })
  }
  
  // 总结
  console.log('\n' + '='.repeat(60))
  console.log('\n📊 检查结果总结:\n')
  
  const passed = checks.filter(c => c.status === 'pass').length
  const failed = checks.filter(c => c.status === 'fail').length
  const warnings = checks.filter(c => c.status === 'warn').length
  
  console.log(`  ✅ 通过: ${passed}`)
  console.log(`  ❌ 失败: ${failed}`)
  console.log(`  ⚠️  警告: ${warnings}`)
  
  if (failed > 0) {
    console.log('\n❌ 系统未准备好部署到生产环境')
    console.log('请修复上述失败的检查项')
    process.exit(1)
  } else if (warnings > 0) {
    console.log('\n⚠️  系统基本就绪，但有警告项需要注意')
    process.exit(0)
  } else {
    console.log('\n✅ 系统已准备好部署到生产环境')
    process.exit(0)
  }
}

checkProduction()
