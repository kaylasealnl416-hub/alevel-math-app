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
    const { chapterId, difficulty = 'medium', count = 5,
            chapterTitle, chapterKeyPoints, chapterFormulas,
            chapterHardPoints, chapterExamTips, subject } = await c.req.json()

    if (!chapterId) {
      return c.json({ success: false, error: { message: 'chapterId is required' } }, 400)
    }

    const questionCount = Math.min(Math.max(parseInt(count) || 5, 1), 20)

    const questionList = await getQuestions(chapterId, difficulty, {}, null, questionCount, subject || 'mathematics')

    if (!questionList || questionList.length === 0) {
      return c.json({
        success: false,
        error: { message: '该章节暂无题目，题库正在补充中' }
      }, 404)
    }

    // 格式化返回前端（不暴露答案）
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
      data: {
        questions: formatted,
        roundSize: formatted.length,
        // 告知前端实际返回数量是否少于请求数量
        requested: questionCount,
        insufficient: formatted.length < questionCount,
      }
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

    const correctValue = question.answer?.value
    const qType = question.type || 'multiple_choice'
    let isCorrect = false

    if (qType === 'calculation') {
      // 使用与 answerGraderCore 一致的判分规则：绝对误差 0.01 或相对误差 1%
      const userNum = parseFloat(String(answer).trim())
      const correctNum = parseFloat(String(correctValue).trim())
      if (!isNaN(userNum) && !isNaN(correctNum)) {
        if (correctNum !== 0) {
          const absDiff = Math.abs(userNum - correctNum)
          const relDiff = absDiff / Math.abs(correctNum)
          isCorrect = absDiff < 0.01 || relDiff < 0.01
        } else {
          isCorrect = Math.abs(userNum) < 0.01
        }
      } else {
        isCorrect = String(answer).trim().toUpperCase() === String(correctValue).trim().toUpperCase()
      }
    } else if (qType === 'short_answer') {
      // 简答题：暂时标记为 null（需人工/AI 批改），前端显示 model answer
      isCorrect = null
    } else {
      // MCQ：大小写不敏感字符串匹配
      isCorrect = String(answer).trim().toUpperCase() === String(correctValue).trim().toUpperCase()
    }

    // Save answer（主观题 isCorrect 保留 null，不强制设为 false）
    await saveAnswer(userId, questionId, answer, isCorrect, timeSpent)

    // Return full feedback
    return c.json({
      success: true,
      data: {
        isCorrect,
        needsReview: isCorrect === null,
        questionType: qType,
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
