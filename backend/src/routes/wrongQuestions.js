/**
 * 错题本 API
 * 查询和管理用户的错题
 */

import { Hono } from 'hono'
import { db } from '../db/index.js'
import { examQuestionResults, exams, questions, chapters } from '../db/schema.js'
import { eq, and, desc, sql } from 'drizzle-orm'

const app = new Hono()

/**
 * GET /api/wrong-questions?userId=1&subject=mathematics&limit=50
 * 获取用户的错题列表
 */
app.get('/', async (c) => {
  try {
    const userId = c.req.query('userId')
    const subject = c.req.query('subject')
    const limit = parseInt(c.req.query('limit') || '50')

    if (!userId) {
      return c.json({
        success: false,
        error: {
          code: 'MISSING_PARAMETER',
          message: '缺少 userId 参数'
        }
      }, 400)
    }

    // 查询用户的所有错题
    let query = db
      .select({
        id: examQuestionResults.id,
        examId: examQuestionResults.examId,
        questionId: examQuestionResults.questionId,
        userAnswer: examQuestionResults.userAnswer,
        isCorrect: examQuestionResults.isCorrect,
        score: examQuestionResults.score,
        maxScore: examQuestionResults.maxScore,
        aiFeedback: examQuestionResults.aiFeedback,
        createdAt: examQuestionResults.createdAt,
        // 关联题目信息
        question: {
          id: questions.id,
          type: questions.type,
          difficulty: questions.difficulty,
          content: questions.content,
          options: questions.options,
          answer: questions.answer,
          explanation: questions.explanation,
          tags: questions.tags,
          chapterId: questions.chapterId
        },
        // 关联考试信息
        exam: {
          id: exams.id,
          type: exams.type,
          createdAt: exams.createdAt
        },
        // 关联章节信息
        chapter: {
          id: chapters.id,
          title: chapters.title
        }
      })
      .from(examQuestionResults)
      .innerJoin(exams, eq(examQuestionResults.examId, exams.id))
      .innerJoin(questions, eq(examQuestionResults.questionId, questions.id))
      .leftJoin(chapters, eq(questions.chapterId, chapters.id))
      .where(
        and(
          eq(exams.userId, parseInt(userId)),
          eq(examQuestionResults.isCorrect, false)
        )
      )
      .orderBy(desc(examQuestionResults.createdAt))
      .limit(limit)

    const wrongQuestions = await query

    // 按科目筛选（如果提供）
    let filteredQuestions = wrongQuestions
    if (subject) {
      filteredQuestions = wrongQuestions.filter(wq => {
        const tags = wq.question.tags || []
        return tags.includes(subject)
      })
    }

    // 统计信息
    const stats = {
      total: filteredQuestions.length,
      byDifficulty: {},
      byChapter: {}
    }

    filteredQuestions.forEach(wq => {
      // 按难度统计
      const difficulty = wq.question.difficulty || 'unknown'
      stats.byDifficulty[difficulty] = (stats.byDifficulty[difficulty] || 0) + 1

      // 按章节统计
      const chapterTitle = wq.chapter?.title?.en || wq.chapter?.title?.zh || 'Unknown'
      stats.byChapter[chapterTitle] = (stats.byChapter[chapterTitle] || 0) + 1
    })

    return c.json({
      success: true,
      data: {
        wrongQuestions: filteredQuestions,
        stats
      }
    })

  } catch (error) {
    console.error('获取错题失败:', error)
    return c.json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '获取错题失败'
      }
    }, 500)
  }
})

/**
 * POST /api/wrong-questions/:id/master
 * 标记错题为已掌握
 */
app.post('/:id/master', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))

    // 这里可以添加一个 mastered 字段到 exam_question_results 表
    // 或者创建一个单独的 mastered_questions 表
    // 目前简单返回成功

    return c.json({
      success: true,
      data: {
        message: '已标记为掌握'
      }
    })

  } catch (error) {
    console.error('标记掌握失败:', error)
    return c.json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '标记失败'
      }
    }, 500)
  }
})

/**
 * GET /api/wrong-questions/stats?userId=1
 * 获取错题统计信息
 */
app.get('/stats', async (c) => {
  try {
    const userId = c.req.query('userId')

    if (!userId) {
      return c.json({
        success: false,
        error: {
          code: 'MISSING_PARAMETER',
          message: '缺少 userId 参数'
        }
      }, 400)
    }

    // 查询错题总数
    const totalWrong = await db
      .select({ count: sql`count(*)` })
      .from(examQuestionResults)
      .innerJoin(exams, eq(examQuestionResults.examId, exams.id))
      .where(
        and(
          eq(exams.userId, parseInt(userId)),
          eq(examQuestionResults.isCorrect, false)
        )
      )

    // 查询最近7天的错题趋势
    const recentWrong = await db
      .select({
        date: sql`DATE(${examQuestionResults.createdAt})`,
        count: sql`count(*)`
      })
      .from(examQuestionResults)
      .innerJoin(exams, eq(examQuestionResults.examId, exams.id))
      .where(
        and(
          eq(exams.userId, parseInt(userId)),
          eq(examQuestionResults.isCorrect, false),
          sql`${examQuestionResults.createdAt} >= NOW() - INTERVAL '7 days'`
        )
      )
      .groupBy(sql`DATE(${examQuestionResults.createdAt})`)
      .orderBy(sql`DATE(${examQuestionResults.createdAt})`)

    return c.json({
      success: true,
      data: {
        totalWrong: parseInt(totalWrong[0]?.count || 0),
        recentTrend: recentWrong
      }
    })

  } catch (error) {
    console.error('获取错题统计失败:', error)
    return c.json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '获取统计失败'
      }
    }, 500)
  }
})

export default app
