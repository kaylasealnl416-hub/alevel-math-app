/**
 * 错题本 API
 * 查询和管理用户的错题
 */

import { Hono } from 'hono'
import { db } from '../db/index.js'
import { examQuestionResults, exams, questions, chapters } from '../db/schema.js'
import { eq, and, or, desc, sql, isNull } from 'drizzle-orm'

const app = new Hono()

/**
 * GET /api/wrong-questions?userId=1&subject=mathematics&limit=50
 * 获取用户的错题列表
 */
app.get('/', async (c) => {
  try {
    const userId = c.get('userId')
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

    // 查询用户的所有错题（含 Practice 错题，examId 可为 null）
    let query = db
      .select({
        id: examQuestionResults.id,
        examId: examQuestionResults.examId,
        questionId: examQuestionResults.questionId,
        userAnswer: examQuestionResults.userAnswer,
        isCorrect: examQuestionResults.isCorrect,
        isMastered: examQuestionResults.isMastered,
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
        // 关联考试信息（Practice 错题为 null）
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
      .leftJoin(exams, eq(examQuestionResults.examId, exams.id))
      .innerJoin(questions, eq(examQuestionResults.questionId, questions.id))
      .leftJoin(chapters, eq(questions.chapterId, chapters.id))
      .where(
        and(
          // 归属验证：exam 的 userId 或直接记录的 userId
          or(
            eq(exams.userId, parseInt(userId)),
            eq(examQuestionResults.userId, parseInt(userId))
          ),
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
 * POST /api/wrong-questions
 * 记录错题（Practice 场景：examId = null，直接用 userId 标记归属）
 */
app.post('/', async (c) => {
  try {
    const userId = c.get('userId')
    const { questionId, userAnswer, examId } = await c.req.json()

    if (!questionId) {
      return c.json({
        success: false,
        error: { code: 'MISSING_PARAMETER', message: '缺少 questionId 参数' }
      }, 400)
    }

    // 检查题目是否存在于数据库
    const [existingQuestion] = await db
      .select({ id: questions.id })
      .from(questions)
      .where(eq(questions.id, parseInt(questionId)))
      .limit(1)

    if (!existingQuestion) {
      return c.json({
        success: true,
        data: { message: '题目不在题库中，跳过记录', skipped: true }
      })
    }

    // 查重：同一用户同一题目只保留最近一条错题记录（via userId 或 examId）
    const [existing] = await db
      .select({ id: examQuestionResults.id })
      .from(examQuestionResults)
      .leftJoin(exams, eq(examQuestionResults.examId, exams.id))
      .where(
        and(
          or(
            eq(exams.userId, parseInt(userId)),
            eq(examQuestionResults.userId, parseInt(userId))
          ),
          eq(examQuestionResults.questionId, parseInt(questionId)),
          eq(examQuestionResults.isCorrect, false)
        )
      )
      .limit(1)

    if (existing) {
      return c.json({
        success: true,
        data: { message: '该错题已存在', duplicate: true }
      })
    }

    // 插入错题记录（examId 可空，userId 直接存）
    const [inserted] = await db
      .insert(examQuestionResults)
      .values({
        examId: examId ? parseInt(examId) : null,
        userId: parseInt(userId),
        questionId: parseInt(questionId),
        userAnswer: userAnswer ?? null,
        isCorrect: false,
        score: 0,
        maxScore: 0,
      })
      .returning({ id: examQuestionResults.id })

    return c.json({
      success: true,
      data: { id: inserted.id, recorded: true }
    })

  } catch (error) {
    console.error('记录错题失败:', error)
    return c.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '记录错题失败' }
    }, 500)
  }
})

/**
 * POST /api/wrong-questions/:id/master
 * 标记/取消标记错题为已掌握（写入 DB）
 */
app.post('/:id/master', async (c) => {
  try {
    const userId = c.get('userId')
    const id = parseInt(c.req.param('id'))
    const body = await c.req.json().catch(() => ({}))
    const mastered = body.mastered !== false // 默认 true，传 false 则取消

    if (!userId) {
      return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: '未登录' } }, 401)
    }

    // 验证该记录属于当前用户（支持 examId 关联 或 直接 userId）
    const [result] = await db
      .update(examQuestionResults)
      .set({ isMastered: mastered })
      .where(
        and(
          eq(examQuestionResults.id, id),
          or(
            sql`${examQuestionResults.examId} IN (SELECT id FROM exams WHERE user_id = ${parseInt(userId)})`,
            and(
              isNull(examQuestionResults.examId),
              eq(examQuestionResults.userId, parseInt(userId))
            )
          )
        )
      )
      .returning({ id: examQuestionResults.id, isMastered: examQuestionResults.isMastered })

    if (!result) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: '记录不存在或无权限' } }, 404)
    }

    return c.json({ success: true, data: { id: result.id, isMastered: result.isMastered } })

  } catch (error) {
    console.error('标记掌握失败:', error)
    return c.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '标记失败' }
    }, 500)
  }
})

/**
 * GET /api/wrong-questions/stats?userId=1
 * 获取错题统计信息
 */
app.get('/stats', async (c) => {
  try {
    const userId = c.get('userId')

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
