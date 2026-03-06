import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import subjectsRoutes from './routes/subjects.js'
import chaptersRoutes from './routes/chapters.js'

const app = new Hono()

// 中间件
app.use('*', logger())
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://*.vercel.app'],
  credentials: true,
}))

// 健康检查
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// API路由
app.route('/api/subjects', subjectsRoutes)
app.route('/api/chapters', chaptersRoutes)

// 404处理
app.notFound((c) => {
  return c.json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  }, 404)
})

// 错误处理
app.onError((err, c) => {
  console.error('Error:', err)
  return c.json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: err.message
    }
  }, 500)
})

const port = Number(process.env.PORT) || 4000

console.log(`🚀 Server starting on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})
