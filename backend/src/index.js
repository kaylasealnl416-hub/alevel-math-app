import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { rateLimiter } from 'hono-rate-limiter'
import subjectsRoutes from './routes/subjects.js'
import chaptersRoutes from './routes/chapters.js'
import usersRoutes from './routes/users.js'
import progressRoutes from './routes/progress.js'
import chatRoutes from './routes/chat.js'
import chatMessagesRoutes from './routes/chatMessages.js'
import authRoutes from './routes/auth.js'
import { authMiddleware } from './middleware/auth.js'

const app = new Hono()

// 中间件
app.use('*', logger())
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://*.vercel.app'],
  credentials: true,
}))

// 速率限制 - 防止 API 滥用
app.use('*', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 分钟
  limit: 100, // 最多 100 次请求
  standardHeaders: 'draft-6',
  keyGenerator: (c) => c.req.header('x-forwarded-for') || 'anonymous'
}))

// 健康检查
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// 公开路由（无需认证）
app.route('/api/auth', authRoutes)
app.route('/api/subjects', subjectsRoutes)
app.route('/api/chapters', chaptersRoutes)

// 受保护路由（需要认证）
app.use('/api/users/*', authMiddleware)
app.use('/api/progress/*', authMiddleware)
app.use('/api/chat/*', authMiddleware)

app.route('/api/users', usersRoutes)
app.route('/api/progress', progressRoutes)
app.route('/api/chat/sessions', chatRoutes)
app.route('/api/chat/messages', chatMessagesRoutes)

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

const server = serve({
  fetch: app.fetch,
  port,
})

console.log(`✅ Server is running on port ${port}`)
console.log(`📍 Health check: http://localhost:${port}/health`)
