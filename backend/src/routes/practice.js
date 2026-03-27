// ============================================================
// Practice API Routes
// Handles topic practice: start round, submit answer, get summary
// ============================================================

import { Hono } from 'hono'
import { db } from '../db/index.js'
import { questions } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import { getQuestions, saveAnswer, getRecommendations } from '../services/practiceService.js'

const app = new Hono()

/**
 * POST /api/practice/start
 * Start a practice round — returns 5 questions
 */
app.post('/start', async (c) => {
  try {
    const { chapterId, difficulty = 'medium',
            chapterTitle, chapterKeyPoints, chapterFormulas,
            chapterHardPoints, chapterExamTips, subject } = await c.req.json()

    if (!chapterId) {
      return c.json({ success: false, error: { message: 'chapterId is required' } }, 400)
    }

    const aiOptions = {}

    // 前端传来的章节信息，作为 AI 生成题目的 fallback
    const chapterFallback = chapterTitle ? {
      id: chapterId,
      title: chapterTitle,
      keyPoints: chapterKeyPoints || [],
      formulas: chapterFormulas || [],
      hardPoints: chapterHardPoints || '',
      examTips: chapterExamTips || '',
      subject: subject || 'mathematics',
    } : null

    const questionList = await getQuestions(chapterId, difficulty, aiOptions, chapterFallback)

    // Format for frontend — don't send answers yet
    const formatted = questionList.map(q => ({
      id: q.id,
      type: q.type,
      difficulty: q.difficulty,
      content: q.content,
      options: q.options,
      tags: q.tags || [],
      source: q.source,
    }))

    return c.json({
      success: true,
      data: { questions: formatted, roundSize: formatted.length }
    })
  } catch (error) {
    console.error('Practice start error:', error)
    return c.json({
      success: false,
      error: { message: error.message || 'Failed to start practice' }
    }, 500)
  }
})

/**
 * POST /api/practice/answer
 * Submit answer for one question — returns feedback
 */
app.post('/answer', async (c) => {
  try {
    const userId = c.get('userId')
    const { questionId, answer, timeSpent = 0 } = await c.req.json()

    if (!questionId || answer === undefined) {
      return c.json({ success: false, error: { message: 'questionId and answer are required' } }, 400)
    }

    // Get the question to check answer
    const [question] = await db.select().from(questions).where(eq(questions.id, questionId)).limit(1)
    if (!question) {
      return c.json({ success: false, error: { message: 'Question not found' } }, 404)
    }

    // Check correctness (大小写不敏感)
    const correctValue = question.answer?.value
    const isCorrect = String(answer).trim().toUpperCase() === String(correctValue).trim().toUpperCase()

    // Save answer
    await saveAnswer(userId, questionId, answer, isCorrect, timeSpent)

    // Return full feedback
    return c.json({
      success: true,
      data: {
        isCorrect,
        correctAnswer: correctValue,
        solution: question.answer?.explanation || '',
        deepExplanation: question.explanation?.en || '',
        keyFormula: question.explanation?.keyFormula || '',
        commonMistake: question.explanation?.commonMistake || '',
        whyOthersWrong: question.explanation?.whyOthersWrong || {},
      }
    })
  } catch (error) {
    console.error('Practice answer error:', error)
    return c.json({
      success: false,
      error: { message: error.message || 'Failed to submit answer' }
    }, 500)
  }
})

/**
 * POST /api/practice/summary
 * Get round summary with recommendations
 */
app.post('/summary', async (c) => {
  try {
    const { chapterId, results } = await c.req.json()

    if (!chapterId || !results) {
      return c.json({ success: false, error: { message: 'chapterId and results are required' } }, 400)
    }

    const correct = results.filter(r => r.isCorrect).length
    const total = results.length
    const wrongIds = results.filter(r => !r.isCorrect).map(r => r.questionId)

    const recommendations = await getRecommendations(chapterId, wrongIds)

    return c.json({
      success: true,
      data: {
        score: { correct, total, percentage: Math.round((correct / total) * 100) },
        recommendations
      }
    })
  } catch (error) {
    console.error('Practice summary error:', error)
    return c.json({
      success: false,
      error: { message: error.message || 'Failed to get summary' }
    }, 500)
  }
})

export default app
