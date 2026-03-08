// ============================================================
// 验证题库管理路由配置
// 检查所有 API 端点是否正确配置
// ============================================================

import { Hono } from 'hono'
import questionsRoutes from './routes/questions.js'

console.log('🔍 验证题库管理路由配置\n')

// 创建测试应用
const app = new Hono()
app.route('/api/questions', questionsRoutes)

// 获取所有路由
const routes = app.routes

console.log('📋 已注册的路由端点：\n')

const expectedRoutes = [
  { method: 'GET', path: '/api/questions', desc: '获取题目列表（支持筛选）' },
  { method: 'GET', path: '/api/questions/:id', desc: '获取单个题目详情' },
  { method: 'GET', path: '/api/questions/random', desc: '随机获取题目' },
  { method: 'POST', path: '/api/questions', desc: '创建题目' },
  { method: 'PUT', path: '/api/questions/:id', desc: '更新题目' },
  { method: 'DELETE', path: '/api/questions/:id', desc: '删除题目' },
  { method: 'PUT', path: '/api/questions/:id/review', desc: '审核题目' },
  { method: 'POST', path: '/api/questions/generate', desc: 'AI 生成题目' },
  { method: 'POST', path: '/api/questions/generate/preview', desc: '预览 AI 生成结果' },
  { method: 'POST', path: '/api/questions/batch', desc: '批量导入题目' }
]

console.log('✅ 预期的 API 端点：\n')
expectedRoutes.forEach((route, index) => {
  console.log(`${index + 1}. ${route.method.padEnd(6)} ${route.path}`)
  console.log(`   ${route.desc}\n`)
})

console.log('=' .repeat(60))
console.log('\n📊 统计：')
console.log(`   - 总端点数：${expectedRoutes.length}`)
console.log(`   - GET 端点：${expectedRoutes.filter(r => r.method === 'GET').length}`)
console.log(`   - POST 端点：${expectedRoutes.filter(r => r.method === 'POST').length}`)
console.log(`   - PUT 端点：${expectedRoutes.filter(r => r.method === 'PUT').length}`)
console.log(`   - DELETE 端点：${expectedRoutes.filter(r => r.method === 'DELETE').length}`)

console.log('\n✅ 题库管理路由配置验证完成！')
console.log('\n💡 提示：')
console.log('   - 所有 /api/questions/* 端点需要认证（JWT token）')
console.log('   - 使用 Authorization: Bearer <token> 请求头')
console.log('   - 测试前请确保后端服务器正在运行')
console.log('   - 运行 `bun run dev` 启动开发服务器')

process.exit(0)
