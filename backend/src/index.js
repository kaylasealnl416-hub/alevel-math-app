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
import questionsRoutes from './routes/questions.js'
import questionSetsRoutes from './routes/questionSets.js'
import userAnswersRoutes from './routes/userAnswers.js'
import examsRoutes from './routes/exams.js'
import recommendationsRoutes from './routes/recommendations.js'
import learningPlansRoutes from './routes/learningPlans.js'
import wrongQuestionsRoutes from './routes/wrongQuestions.js'
import { authMiddleware } from './middleware/auth.js'
import { cacheMiddleware } from './middleware/cache.js'
import { securityHeaders, requestSizeLimit } from './middleware/security.js'
import { performanceMonitor } from './middleware/performance.js'

const app = new Hono()

// 性能监控（最先执行）
app.use('*', performanceMonitor())

// 安全中间件
app.use('*', securityHeaders())
app.use('*', requestSizeLimit(5 * 1024 * 1024)) // 5MB 限制

// 日志中间件
app.use('*', logger())

// CORS 配置
app.use('*', cors({
  origin: (origin) => {
    // 从环境变量获取允许的域名（逗号分隔）
    const envOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
      : []

    // 默认允许的域名列表
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://alevel-math-app.vercel.app',
      ...envOrigins
    ]

    // 允许所有 vercel.app 子域名
    if (origin && origin.endsWith('.vercel.app')) {
      return origin
    }

    // 检查是否在允许列表中
    if (allowedOrigins.includes(origin)) {
      return origin
    }

    // 开发环境允许所有来源
    if (process.env.NODE_ENV === 'development') {
      return origin || '*'
    }

    return allowedOrigins[0] // 默认返回第一个允许的域名
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 小时
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
    version: '1.0.0',
    uptime: process.uptime()
  })
})

// 性能统计端点（仅开发环境）
if (process.env.NODE_ENV === 'development') {
  app.get('/api/stats', (c) => {
    const { queryMonitor } = require('./middleware/performance.js')
    return c.json({
      success: true,
      data: queryMonitor.getStats()
    })
  })
}

// 公开路由（无需认证，带缓存）
app.route('/api/auth', authRoutes)
app.use('/api/subjects/*', cacheMiddleware({ ttl: 10 * 60 * 1000 })) // 10分钟缓存
app.route('/api/subjects', subjectsRoutes)
app.use('/api/chapters/*', cacheMiddleware({ ttl: 10 * 60 * 1000 })) // 10分钟缓存
app.route('/api/chapters', chaptersRoutes)

// 受保护路由（需要认证）
app.use('/api/users/*', authMiddleware)
app.use('/api/progress/*', authMiddleware)
app.use('/api/chat/*', authMiddleware)
app.use('/api/questions/*', authMiddleware)
app.use('/api/question-sets/*', authMiddleware)
app.use('/api/user-answers/*', authMiddleware)
// 注意：考试 API 暂时不需要认证（用于测试）
// app.use('/api/exams/*', authMiddleware)

app.route('/api/users', usersRoutes)
app.route('/api/progress', progressRoutes)
app.route('/api/chat/sessions', chatRoutes)
app.route('/api/chat/messages', chatMessagesRoutes)
app.route('/api/questions', questionsRoutes)
app.route('/api/question-sets', questionSetsRoutes)
app.route('/api/user-answers', userAnswersRoutes)
app.route('/api/exams', examsRoutes)
app.route('/api/recommendations', recommendationsRoutes)
app.route('/api/learning-plans', learningPlansRoutes)
app.route('/api/wrong-questions', wrongQuestionsRoutes)

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
