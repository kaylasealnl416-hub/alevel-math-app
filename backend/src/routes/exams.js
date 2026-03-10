import { Hono } from 'hono'
import { db } from '../db/index.js'
import { exams, examQuestionResults, questionSets, questions, users } from '../db/schema.js'
import { eq, and, desc, inArray } from 'drizzle-orm'
import * as examService from '../services/examService.js'
import * as examGrader from '../services/examGrader.js'
import * as examAnalyzer from '../services/examAnalyzer.js'
import { authMiddleware } from '../middleware/auth.js'
import { rateLimit, rateLimitPresets } from '../middleware/rateLimit.js'
import { validate, createExamSchema, saveAnswerSchema, markQuestionSchema, focusLostSchema } from '../utils/validation.js'

const app = new Hono()

// 应用认证中间件到所有路由
app.use('/*', authMiddleware)

/**
 * Phase 4: 考试管理 API
 *
 * 端点：
 * - POST /api/exams - 创建考试
 * - GET /api/exams/:id - 获取考试详情
 * - GET /api/exams - 获取考试列表
 * - PUT /api/exams/:id/answers - 保存答案（自动保存）
 * - POST /api/exams/:id/submit - 提交考试
 * - GET /api/exams/:id/result - 获取考试结果
 * - PUT /api/exams/:id/mark - 标记题目
 * - POST /api/exams/:id/focus-lost - 记录失焦事件
 */

// ============================================================
// 1. 创建考试
// ============================================================
app.post('/', validate(createExamSchema), async (c) => {
  try {
    // 从认证中间件获取用户 ID
    const authenticatedUserId = c.get('userId')
    // 从验证中间件获取验证后的数据
    const validated = c.get('validated')

    // 使用认证的用户 ID 创建考试
    const result = await examService.createExam({
      userId: authenticatedUserId,
      ...validated
    })

    if (!result.success) {
      return c.json(result, 400)
    }

    return c.json(result)

  } catch (error) {
    console.error('创建考试失败：', error)
    return c.json({
      success: false,
      error: { message: '创建考试失败', details: error.message }
    }, 500)
  }
})

// ============================================================
// 2. 获取考试详情
// ============================================================
app.get('/:id', async (c) => {
  try {
    const examId = parseInt(c.req.param('id'))

    // 使用 examService 获取考试详情
    const result = await examService.getExamDetail(examId)

    if (!result.success) {
      return c.json(result, 404)
    }

    return c.json(result)

  } catch (error) {
    console.error('获取考试详情失败：', error)
    return c.json({
      success: false,
      error: { message: '获取考试详情失败', details: error.message }
    }, 500)
  }
})

// ============================================================
// 3. 获取考试列表
// ============================================================
app.get('/', async (c) => {
  try {
    // 从认证中间件获取用户 ID，只允许查询自己的考试
    const authenticatedUserId = c.get('userId')
    const status = c.req.query('status')
    const type = c.req.query('type')
    const limit = parseInt(c.req.query('limit') || '20')
    const offset = parseInt(c.req.query('offset') || '0')

    // 构建查询条件，强制使用认证用户 ID
    const conditions = [eq(exams.userId, authenticatedUserId)]
    if (status) conditions.push(eq(exams.status, status))
    if (type) conditions.push(eq(exams.type, type))

    // 查询考试列表
    const examList = await db.select()
      .from(exams)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(exams.createdAt))
      .limit(limit)
      .offset(offset)

    // 统计总数
    const [{ count }] = await db.select({ count: sql`count(*)` })
      .from(exams)
      .where(conditions.length > 0 ? and(...conditions) : undefined)

    return c.json({
      success: true,
      data: {
        exams: examList,
        total: parseInt(count),
        limit,
        offset
      }
    })

  } catch (error) {
    console.error('获取考试列表失败：', error)
    return c.json({
      success: false,
      error: { message: '获取考试列表失败', details: error.message }
    }, 500)
  }
})

// ============================================================
// 4. 保存答案（自动保存）
// ============================================================
app.put('/:id/answers', validate(saveAnswerSchema), async (c) => {
  try {
    const examId = parseInt(c.req.param('id'))
    const validated = c.get('validated')

    // 使用 examService 保存答案
    const result = await examService.saveAnswer(examId, validated.questionId, validated.answer)

    if (!result.success) {
      return c.json(result, 400)
    }

    return c.json(result)

  } catch (error) {
    console.error('保存答案失败：', error)
    return c.json({
      success: false,
      error: { message: '保存答案失败', details: error.message }
    }, 500)
  }
})

// ============================================================
// 5. 提交考试
// ============================================================
app.post('/:id/submit', rateLimit(rateLimitPresets.moderate), async (c) => {
  try {
    const examId = parseInt(c.req.param('id'))

    // 使用 examService 提交考试
    const result = await examService.submitExam(examId)

    if (!result.success) {
      return c.json(result, 400)
    }

    // 自动批改考试
    const gradeResult = await examGrader.gradeExam(examId)

    if (!gradeResult.success) {
      console.error('批改失败，但考试已提交：', gradeResult.error)
      // 批改失败不影响提交，返回提交成功
      return c.json({
        success: true,
        data: {
          ...result.data,
          gradeStatus: 'pending',
          gradeError: gradeResult.error.message
        }
      })
    }

    return c.json({
      success: true,
      data: {
        ...result.data,
        gradeStatus: 'completed',
        gradeResult: gradeResult.data
      }
    })

  } catch (error) {
    console.error('提交考试失败：', error)
    return c.json({
      success: false,
      error: { message: '提交考试失败', details: error.message }
    }, 500)
  }
})

// ============================================================
// 6. 获取考试结果
// ============================================================
app.get('/:id/result', async (c) => {
  try {
    const examId = parseInt(c.req.param('id'))

    // 使用 examGrader 获取详细结果
    const result = await examGrader.getExamResult(examId)

    if (!result.success) {
      return c.json(result, 400)
    }

    return c.json(result)

  } catch (error) {
    console.error('获取考试结果失败：', error)
    return c.json({
      success: false,
      error: { message: '获取考试结果失败', details: error.message }
    }, 500)
  }
})

// ============================================================
// 7. 标记题目
// ============================================================
app.put('/:id/mark', validate(markQuestionSchema), async (c) => {
  try {
    const examId = parseInt(c.req.param('id'))
    const validated = c.get('validated')

    // 使用 examService 标记题目
    const result = await examService.markQuestion(examId, validated.questionId, validated.marked)

    if (!result.success) {
      return c.json(result, 400)
    }

    return c.json(result)

  } catch (error) {
    console.error('标记题目失败：', error)
    return c.json({
      success: false,
      error: { message: '标记题目失败', details: error.message }
    }, 500)
  }
})

// ============================================================
// 8. 记录失焦事件（防作弊）
// ============================================================
app.post('/:id/focus-lost', validate(focusLostSchema), async (c) => {
  try {
    const examId = parseInt(c.req.param('id'))
    const validated = c.get('validated')

    // 使用 examService 记录作弊事件
    const result = await examService.recordCheatingEvent(examId, validated.type)

    if (!result.success) {
      return c.json(result, 400)
    }

    return c.json(result)

  } catch (error) {
    console.error('记录失焦事件失败：', error)
    return c.json({
      success: false,
      error: { message: '记录失焦事件失败', details: error.message }
    }, 500)
  }
})

// ============================================================
// 9. 检查考试超时
// ============================================================
app.get('/:id/check-timeout', async (c) => {
  try {
    const examId = parseInt(c.req.param('id'))

    const result = await examService.checkExamTimeout(examId)

    if (!result.success) {
      return c.json(result, 400)
    }

    return c.json(result)

  } catch (error) {
    console.error('检查考试超时失败：', error)
    return c.json({
      success: false,
      error: { message: '检查考试超时失败', details: error.message }
    }, 500)
  }
})

// ============================================================
// 10. 获取考试统计信息
// ============================================================
app.get('/:id/stats', async (c) => {
  try {
    const examId = parseInt(c.req.param('id'))

    const result = await examService.getExamStats(examId)

    if (!result.success) {
      return c.json(result, 400)
    }

    return c.json(result)

  } catch (error) {
    console.error('获取考试统计失败：', error)
    return c.json({
      success: false,
      error: { message: '获取考试统计失败', details: error.message }
    }, 500)
  }
})

// ============================================================
// 11. 手动批改考试
// ============================================================
app.post('/:id/grade', async (c) => {
  try {
    const examId = parseInt(c.req.param('id'))

    const result = await examGrader.gradeExam(examId)

    if (!result.success) {
      return c.json(result, 400)
    }

    return c.json(result)

  } catch (error) {
    console.error('批改考试失败：', error)
    return c.json({
      success: false,
      error: { message: '批改考试失败', details: error.message }
    }, 500)
  }
})

// ============================================================
// 12. 获取错题列表
// ============================================================
app.get('/:id/wrong-questions', async (c) => {
  try {
    const examId = parseInt(c.req.param('id'))

    const result = await examGrader.getWrongQuestions(examId)

    if (!result.success) {
      return c.json(result, 400)
    }

    return c.json(result)

  } catch (error) {
    console.error('获取错题列表失败：', error)
    return c.json({
      success: false,
      error: { message: '获取错题列表失败', details: error.message }
    }, 500)
  }
})

// ============================================================
// 13. 分析薄弱知识点
// ============================================================
app.get('/:id/weak-topics', async (c) => {
  try {
    const examId = parseInt(c.req.param('id'))

    const result = await examGrader.analyzeWeakTopics(examId)

    if (!result.success) {
      return c.json(result, 400)
    }

    return c.json(result)

  } catch (error) {
    console.error('分析薄弱知识点失败：', error)
    return c.json({
      success: false,
      error: { message: '分析薄弱知识点失败', details: error.message }
    }, 500)
  }
})

// ============================================================
// 14. 生成考试报告
// ============================================================
app.get('/:id/report', async (c) => {
  try {
    const examId = parseInt(c.req.param('id'))

    const result = await examGrader.generateExamReport(examId)

    if (!result.success) {
      return c.json(result, 400)
    }

    return c.json(result)

  } catch (error) {
    console.error('生成考试报告失败：', error)
    return c.json({
      success: false,
      error: { message: '生成考试报告失败', details: error.message }
    }, 500)
  }
})

// ============================================================
// 15. Generate AI Feedback for Exam
// ============================================================
app.post('/:id/analyze', rateLimit(rateLimitPresets.strict), async (c) => {
  try {
    const examId = parseInt(c.req.param('id'))

    // Get exam with questions
    const [exam] = await db
      .select()
      .from(exams)
      .where(eq(exams.id, examId))

    if (!exam) {
      return c.json({
        success: false,
        error: { message: 'Exam not found' }
      }, 404)
    }

    // Check if exam is graded
    if (exam.status !== 'graded') {
      return c.json({
        success: false,
        error: { message: 'Exam must be graded before analysis' }
      }, 400)
    }

  stions
    const [questionSet] = await db
      .select()
      .from(questionSets)
      .where(eq(questionSets.id, exam.questionSetId))

    const examQuestions = await db
      .select()
      .from(questions)
      .where(inArray(questions.id, questionSet.questionIds))

    // Generate AI feedback
    const feedback = await examAnalyzer.generateExamAnalysis(exam, examQuestions)

    // Save feedback to database
    await db
      .update(exams)
      .set({
        aiFeedback: feedback,
        updatedAt: new Date()
      })
      .where(eq(exams.id, examId))

    return c.json({
      success: true,
      data: feedback
    })

  } catch (error) {
    console.error('Failed to generate AI feedback:', error)
    return c.json({
      success: false,
      error: { message: 'Failed to generate AI feedback', details: error.message }
    }, 500)
  }
})

// ============================================================
// 16. Get AI Feedback for Exam
// ============================================================
app.get('/:id/feedback', async (c) => {
  try {
    const examId = parseInt(c.req.param('id'))

    const [exam] = await db
      .select()
      .from(exams)
      .where(eq(exams.id, examId))

    if (!exam) {
      return c.json({
        success: false,
        error: { message: 'Exam not found' }
      }, 404)
    }

    // If no feedback exists, generate it
    if (!exam.aiFeedback) {
      // Get questions
      const [questionSet] = await db
        .select()
        .from(questionSets)
        .where(eq(questionSets.id, exam.questionSetId))

      const examQuestions = await db
        .select()
        .from(questions)
        .where(inArray(questions.id, questionSet.questionIds))

      // Generate feedback
      const feedback = await examAnalyzer.generateExamAnalysis(exam, examQuestions)

      // Save to database
      await db
        .update(exams)
        .set({
          aiFeedback: feedback,
          updatedAt: new Date()
        })
        .where(eq(exams.id, examId))

      return c.json({
        success: true,
        data: feedback
      })
    }

    return c.json({
      success: true,
      data: exam.aiFeedback
    })

  } catch (error) {
    console.error('Failed to get AI feedback:', error)
    return c.json({
      success: false,
      error: { message: 'Failed to get AI feedback', details: error.message }
    }, 500)
  }
})

export default app
