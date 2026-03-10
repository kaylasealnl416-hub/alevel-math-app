import { Hono } from 'hono'
import * as recommendationService from '../services/recommendationService.js'
import { authMiddleware } from '../middleware/auth.js'
import { rateLimit, rateLimitPresets } from '../middleware/rateLimit.js'

const app = new Hono()

// 应用认证中间件
app.use('/*', authMiddleware)

/**
 * Phase 4 Day 10: Learning Plans API
 *
 * Endpoints:
 * - POST /api/learning-plans/generate - Generate personalized learning plan
 */

// ============================================================
// Generate Learning Plan
// ============================================================
app.post('/generate', rateLimit(rateLimitPresets.moderate), async (c) => {
  try {
    const userId = c.get('userId')
    const body = await c.req.json()
    const { duration = 7 } = body

    // Validate duration
    if (duration < 1 || duration > 30) {
      return c.json({
        success: false,
        error: { message: 'Duration must be between 1 and 30 days' }
      }, 400)
    }

    const result = await recommendationService.generateLearningPlan(userId, duration)

    if (!result.success) {
      return c.json(result, 400)
    }

    return c.json(result)

  } catch (error) {
    console.error('Failed to generate learning plan:', error)
    return c.json({
      success: false,
      error: { message: 'Failed to generate learning plan', details: error.message }
    }, 500)
  }
})

export default app
