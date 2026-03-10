import { Hono } from 'hono'
import * as recommendationService from '../services/recommendationService.js'
import { authMiddleware } from '../middleware/auth.js'
import { rateLimit, rateLimitPresets } from '../middleware/rateLimit.js'

const app = new Hono()

// 应用认证中间件
app.use('/*', authMiddleware)

/**
 * Phase 4 Day 10: Learning Recommendations API
 *
 * Endpoints:
 * - GET /api/recommendations - Get user's recommendations
 * - POST /api/recommendations/generate - Generate recommendations from exam
 * - PUT /api/recommendations/:id/complete - Mark recommendation as completed
 * - PUT /api/recommendations/:id/skip - Skip recommendation
 * - POST /api/learning-plans/generate - Generate learning plan
 */

// ============================================================
// 1. Get User Recommendations
// ============================================================
app.get('/', async (c) => {
  try {
    const userId = c.get('userId')
    const status = c.req.query('status') || 'pending'

    const result = await recommendationService.getUserRecommendations(userId, status)

    if (!result.success) {
      return c.json(result, 400)
    }

    return c.json(result)

  } catch (error) {
    console.error('Failed to get recommendations:', error)
    return c.json({
      success: false,
      error: { message: 'Failed to get recommendations', details: error.message }
    }, 500)
  }
})

// ============================================================
// 2. Generate Recommendations from Exam
// ============================================================
app.post('/generate', rateLimit(rateLimitPresets.moderate), async (c) => {
  try {
    const userId = c.get('userId')
    const body = await c.req.json()
    const { examId } = body

    if (!examId) {
      return c.json({
        success: false,
        error: { message: 'examId is required' }
      }, 400)
    }

    const result = await recommendationService.generateRecommendations(userId, examId)

    if (!result.success) {
      return c.json(result, 400)
    }

    return c.json(result)

  } catch (error) {
    console.error('Failed to generate recommendations:', error)
    return c.json({
      success: false,
      error: { message: 'Failed to generate recommendations', details: error.message }
    }, 500)
  }
})

// ============================================================
// 3. Complete Recommendation
// ============================================================
app.put('/:id/complete', async (c) => {
  try {
    const userId = c.get('userId')
    const recommendationId = parseInt(c.req.param('id'))

    const result = await recommendationService.completeRecommendation(recommendationId, userId)

    if (!result.success) {
      return c.json(result, 400)
    }

    return c.json(result)

  } catch (error) {
    console.error('Failed to complete recommendation:', error)
    return c.json({
      success: false,
      error: { message: 'Failed to complete recommendation', details: error.message }
    }, 500)
  }
})

// ============================================================
// 4. Skip Recommendation
// ============================================================
app.put('/:id/skip', async (c) => {
  try {
    const userId = c.get('userId')
    const recommendationId = parseInt(c.req.param('id'))

    const result = await recommendationService.skipRecommendation(recommendationId, userId)

    if (!result.success) {
      return c.json(result, 400)
    }

    return c.json(result)

  } catch (error) {
    console.error('Failed to skip recommendation:', error)
    return c.json({
      success: false,
      error: { message: 'Failed to skip recommendation', details: error.message }
    }, 500)
  }
})

export default app
