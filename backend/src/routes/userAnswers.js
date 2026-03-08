// ============================================================
// 用户答案管理 API
// 提供答案提交、批改、查询等功能
// ============================================================

import { Hono } from 'hono'
import { db } from '../db/index.js'
import { userAnswers, questions } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'
import { gradeAnswersBatch, saveGradingResults } from '../services/answerGrader.js'

const app = new Hono()

// ============================================================
// 答案提交和批改 API
// ============================================================

/**
 * POST /api/user-answers/batch
 * 批量提交答案并自动批改
 */
app.post('/batch', async (c) => {
  try {
    const body = await c.req.json()
    const userId = c.get('userId')

    const { questionSetId, answers } = body

    // 验证必填字段
    if (!questionSetId || !Array.isArray(answers) || answers.length === 0) {
      return c.json({
        success: false,
        error: { code: 'INVALID_DATA', message: '无效的提交数据' }
      }, 400)
    }

    console.log(`📝 用户 ${userId} 提交 ${answers.length} 个答案`)

    // 1. 批改答案
    const gradingResults = await gradeAnswersBatch(answers)

    // 2. 保存到数据库
    const savedAnswers = await saveGradingResults(userId, questionSetId, answers, gradingResults)

    // 3. 计算统计信息
    const stats = {
      total: answers.length,
      correct: gradingResults.filter(r => r.isCorrect).length,
      totalScore: gradingResults.reduce((sum, r) => sum + (r.score || 0), 0),
      accuracy: answers.length > 0
        ? (gradingResults.filter(r => r.isCorrect).length / answers.length * 100).toFixed(1)
        : 0
    }

    console.log(`✅ 批改完成: 正确率 ${stats.accuracy}%`)

    return c.json({
      success: true,
      data: {
        answers: savedAnswers,
        gradingResults,
        stats
      }
    })

  } catch (error) {
    console.error('批量提交答案失败:', error)
    return c.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    }, 500)
  }
})

/**
 * POST /api/user-answers/:id/grade
 * 重新批改单个答案
 */
app.post('/:id/grade', async (c) => {
  try {
    const answerId = parseInt(c.req.param('id'))
    const userId = c.get('userId')

    // 获取答案记录
    const [answer] = await db
      .select()
      .from(userAnswers)
      .where(
        and(
          eq(userAnswers.id, answerId),
          eq(userAnswers.userId, userId)
        )
      )
      .limit(1)

    if (!answer) {
      return c.json({
        success: false,
        error: { code: 'NOT_FOUND', message: '答案不存在' }
      }, 404)
    }

    // 重新批改
    const { gradeAnswer } = await import('../services/answerGrader.js')
    const result = await gradeAnswer({
      questionId: answer.questionId,
      userAnswer: answer.userAnswer
    })

    // 更新数据库
    const [updated] = await db
      .update(userAnswers)
      .set({
        isCorrect: result.isCorrect,
        score: result.score,
        aiFeedback: result.feedback,
        aiScore: result.score
      })
      .where(eq(userAnswers.id, answerId))
      .returning()

    return c.json({
      success: true,
      data: {
        answer: updated,
        gradingResult: result
      }
    })

  } catch (error) {
    console.error('重新批改失败:', error)
    return c.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    }, 500)
  }
})

// ============================================================
// 答案查询 API
// ============================================================

/**
 * GET /api/user-answers
 * 获取用户答案列表
 */
app.get('/', async (c) => {
  try {
    const userId = c.get('userId')
    const { questionSetId, questionId } = c.req.query()

    const conditions = [eq(userAnswers.userId, userId)]

    if (questionSetId) {
      conditions.push(eq(userAnswers.questionSetId, parseInt(questionSetId)))
    }

    if (questionId) {
      conditions.push(eq(userAnswers.questionId, parseInt(questionId)))
    }

    const result = await db
      .select()
      .from(userAnswers)
      .where(and(...conditions))
      .orderBy(userAnswers.createdAt)

    return c.json({
      success: true,
      data: {
        answers: result,
        total: result.length
      }
    })

  } catch (error) {
    console.error('获取答案列表失败:', error)
    return c.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    }, 500)
  }
})

/**
 * GET /api/user-answers/:id
 * 获取单个答案详情
 */
app.get('/:id', async (c) => {
  try {
    const answerId = parseInt(c.req.param('id'))
    const userId = c.get('userId')

    const [answer] = await db
      .select()
      .from(userAnswers)
      .where(
        and(
          eq(userAnswers.id, answerId),
          eq(userAnswers.userId, userId)
        )
      )
      .limit(1)

    if (!answer) {
      return c.json({
        success: false,
        error: { code: 'NOT_FOUND', message: '答案不存在' }
      }, 404)
    }

    return c.json({
      success: true,
      data: answer
    })

  } catch (error) {
    console.error('获取答案详情失败:', error)
    return c.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    }, 500)
  }
})

/**
 * GET /api/user-answers/:id/feedback
 * 获取答案的详细反馈
 */
app.get('/:id/feedback', async (c) => {
  try {
    const answerId = parseInt(c.req.param('id'))
    const userId = c.get('userId')

    // 获取答案
    const [answer] = await db
      .select()
      .from(userAnswers)
      .where(
        and(
          eq(userAnswers.id, answerId),
          eq(userAnswers.userId, userId)
        )
      )
      .limit(1)

    if (!answer) {
      return c.json({
        success: false,
        error: { code: 'NOT_FOUND', message: '答案不存在' }
      }, 404)
    }

    // 获取题目信息
    const [question] = await db
      .select()
      .from(questions)
      .where(eq(questions.id, answer.questionId))
      .limit(1)

    return c.json({
      success: true,
      data: {
        answer,
        question,
        feedback: answer.aiFeedback,
        score: answer.score,
        isCorrect: answer.isCorrect
      }
    })

  } catch (error) {
    console.error('获取反馈失败:', error)
    return c.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    }, 500)
  }
})

// ============================================================
// 统计分析 API
// ============================================================

/**
 * GET /api/user-answers/stats/summary
 * 获取用户答题统计摘要
 */
app.get('/stats/summary', async (c) => {
  try {
    const userId = c.get('userId')

    const allAnswers = await db
      .select()
      .from(userAnswers)
      .where(eq(userAnswers.userId, userId))

    const total = allAnswers.length
    const correct = allAnswers.filter(a => a.isCorrect).length
    const totalScore = allAnswers.reduce((sum, a) => sum + (a.score || 0), 0)
    const totalTime = allAnswers.reduce((sum, a) => sum + (a.timeSpent || 0), 0)

    return c.json({
      success: true,
      data: {
        total,
        correct,
        accuracy: total > 0 ? (correct / total * 100).toFixed(1) : 0,
        totalScore,
        avgScore: total > 0 ? (totalScore / total).toFixed(1) : 0,
        totalTime,
        avgTime: total > 0 ? Math.round(totalTime / total) : 0
      }
    })

  } catch (error) {
    console.error('获取统计摘要失败:', error)
    return c.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    }, 500)
  }
})

export default app
