import { Hono } from 'hono'
import { db } from '../db/index.js'
import { exams, examQuestionResults, questionSets, questions, users } from '../db/schema.js'
import { eq, and, desc, sql } from 'drizzle-orm'
import * as examService from '../services/examService.js'
import * as examGrader from '../services/examGrader.js'

const app = new Hono()

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
app.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const { userId, questionSetId, type, mode, timeLimit, allowReview } = body

    // 验证必填字段
    if (!userId || !questionSetId || !type || !mode) {
      return c.json({
        success: false,
        error: { message: '缺少必填字段：userId, questionSetId, type, mode' }
      }, 400)
    }

    // 使用 examService 创建考试
    const result = await examService.createExam({
      userId,
      questionSetId,
      type,
      mode,
      timeLimit,
      allowReview
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
    const userId = c.req.query('userId')
    const status = c.req.query('status')
    const type = c.req.query('type')
    const limit = parseInt(c.req.query('limit') || '20')
    const offset = parseInt(c.req.query('offset') || '0')

    // 构建查询条件
    const conditions = []
    if (userId) conditions.push(eq(exams.userId, parseInt(userId)))
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
app.put('/:id/answers', async (c) => {
  try {
    const examId = parseInt(c.req.param('id'))
    const body = await c.req.json()
    const { questionId, answer } = body

    if (!questionId || answer === undefined) {
      return c.json({
        success: false,
        error: { message: '缺少必填字段：questionId, answer' }
      }, 400)
    }

    // 使用 examService 保存答案
    const result = await examService.saveAnswer(examId, questionId, answer)

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
app.post('/:id/submit', async (c) => {
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
app.put('/:id/mark', async (c) => {
  try {
    const examId = parseInt(c.req.param('id'))
    const body = await c.req.json()
    const { questionId, marked } = body

    if (!questionId || marked === undefined) {
      return c.json({
        success: false,
        error: { message: '缺少必填字段：questionId, marked' }
      }, 400)
    }

    // 使用 examService 标记题目
    const result = await examService.markQuestion(examId, questionId, marked)

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
app.post('/:id/focus-lost', async (c) => {
  try {
    const examId = parseInt(c.req.param('id'))
    const body = await c.req.json()
    const { type } = body // 'tab_switch' | 'focus_lost'

    // 使用 examService 记录作弊事件
    const result = await examService.recordCheatingEvent(examId, type)

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

export default app
