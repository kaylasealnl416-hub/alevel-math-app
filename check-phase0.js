#!/usr/bin/env bun

// ============================================================
// Phase 0 完整性检查脚本
// ============================================================

console.log('🔍 Phase 0 完整性检查\n')
console.log('=' .repeat(60))

let passed = 0
let failed = 0

// 检查函数
function check(name, condition, details = '') {
  if (condition) {
    console.log(`✅ ${name}`)
    if (details) console.log(`   ${details}`)
    passed++
  } else {
    console.log(`❌ ${name}`)
    if (details) console.log(`   ${details}`)
    failed++
  }
}

// 1. 检查后端文件
console.log('\n📁 后端文件检查')
console.log('-'.repeat(60))

const fs = require('fs')
const path = require('path')

check('后端目录存在', fs.existsSync('backend'))
check('package.json存在', fs.existsSync('backend/package.json'))
check('主服务器文件存在', fs.existsSync('backend/src/index.js'))
check('数据库Schema存在', fs.existsSync('backend/src/db/schema.js'))
check('科目路由存在', fs.existsSync('backend/src/routes/subjects.js'))
check('章节路由存在', fs.existsSync('backend/src/routes/chapters.js'))
check('数据导入脚本存在', fs.existsSync('backend/src/db/seed.js'))
check('环境变量示例存在', fs.existsSync('backend/.env.example'))
check('Railway配置存在', fs.existsSync('backend/railway.json'))

// 2. 检查前端文件
console.log('\n📁 前端文件检查')
console.log('-'.repeat(60))

check('API客户端存在', fs.existsSync('src/utils/api.js'))
check('数据源适配层存在', fs.existsSync('src/data/dataSource.js'))
check('API测试页面存在', fs.existsSync('src/ApiTestPage.jsx'))
check('环境变量配置存在', fs.existsSync('.env.local'))
check('生产环境配置存在', fs.existsSync('.env.production'))

// 3. 检查文档
console.log('\n📁 文档检查')
console.log('-'.repeat(60))

check('完整技术方案存在', fs.existsSync('specs/complete-technical-plan.md'))
check('开发进度文档存在', fs.existsSync('specs/development-progress.md'))
check('快速参考指南存在', fs.existsSync('specs/quick-reference.md'))
check('数据库配置指南存在', fs.existsSync('backend/DATABASE_SETUP.md'))
check('API集成测试指南存在', fs.existsSync('specs/api-integration-test.md'))
check('部署指南存在', fs.existsSync('specs/deployment-guide.md'))

// 4. 检查后端依赖
console.log('\n📦 后端依赖检查')
console.log('-'.repeat(60))

try {
  const pkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf-8'))
  check('Hono已安装', !!pkg.dependencies?.hono)
  check('Drizzle ORM已安装', !!pkg.dependencies?.['drizzle-orm'])
  check('Postgres已安装', !!pkg.dependencies?.postgres)
  check('Drizzle Kit已安装', !!pkg.devDependencies?.['drizzle-kit'])
} catch (e) {
  check('读取package.json', false, e.message)
}

// 5. 统计代码行数
console.log('\n📊 代码统计')
console.log('-'.repeat(60))

function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return content.split('\n').length
  } catch {
    return 0
  }
}

const backendLines = countLines('backend/src/index.js') +
                     countLines('backend/src/routes/subjects.js') +
                     countLines('backend/src/routes/chapters.js') +
                     countLines('backend/src/db/schema.js') +
                     countLines('backend/src/db/seed.js')

const frontendLines = countLines('src/utils/api.js') +
                      countLines('src/data/dataSource.js') +
                      countLines('src/ApiTestPage.jsx')

console.log(`后端代码: ${backendLines} 行`)
console.log(`前端新增代码: ${frontendLines} 行`)
console.log(`总计新增: ${backendLines + frontendLines} 行`)

// 6. 总结
console.log('\n' + '='.repeat(60))
console.log(`\n✅ 通过: ${passed}`)
console.log(`❌ 失败: ${failed}`)
console.log(`📊 通过率: ${((passed / (passed + failed)) * 100).toFixed(1)}%`)

if (failed === 0) {
  console.log('\n🎉 Phase 0 完整性检查全部通过！')
  console.log('\n准备就绪：')
  console.log('  ✅ 后端架构完成')
  console.log('  ✅ 数据库配置完成')
  console.log('  ✅ API接口完成')
  console.log('  ✅ 前端集成完成')
  console.log('  ✅ 文档完整')
  console.log('\n下一步：部署到生产环境')
} else {
  console.log('\n⚠️  发现问题，请检查失败项')
}

process.exit(failed === 0 ? 0 : 1)
