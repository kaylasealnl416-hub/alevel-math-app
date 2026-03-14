// ============================================================
// 题库管理 API
// 提供题目的 CRUD 操作、筛选、随机选题等功能
// ============================================================

import { Hono } from 'hono'
import { db } from '../db/index.js'
import { questions, chapters } from '../db/schema.js'
import { eq, and, inArray, sql } from 'drizzle-orm'
import { generateQuestions, previewGenerateQuestions } from '../services/questionGenerator.js'

const app = new Hono()

// ============================================================
// 题目查询 API
// ============================================================

/**
 * GET /api/questions
 * 获取题目列表（支持筛选）
 */
app.get('/', async (c) => {
  try {
    const {
      chapterId,
      tags,
      difficulty,
      type,
      status = 'published',
      limit = 20,
      offset = 0
    } = c.req.query()

    // 构建查询条件
    const conditions = []

    if (chapterId) {
      conditions.push(eq(questions.chapterId, chapterId))
    }

    if (difficulty) {
      const difficultyNum = parseInt(difficulty)
      if (!isNaN(difficultyNum)) {
        conditions.push(eq(questions.difficulty, difficultyNum))
      }
    }

    if (type) {
      conditions.push(eq(questions.type, type))
    }

    if (status) {
      conditions.push(eq(questions.status, status))
    }

    // 查询题目
    let query = db.select().from(questions)

    if (conditions.length > 0) {
      query = query.where(and(...conditions))
    }

    const result = await query
      .limit(parseInt(limit))
      .offset(parseInt(offset))
      .orderBy(questions.createdAt)

    // 如果有 tags 筛选，需要在内存中过滤（因为 JSONB 数组查询比较复杂）
    let filteredResult = result
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags]
      filteredResult = result.filter(q => {
        const questionTags = q.tags || []
        return tagArray.some(tag => questionTags.includes(tag))
      })
    }

    return c.json({
      success: true,
      data: {
        questions: filteredResult,
        total: filteredResult.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    })

  } catch (error) {
    console.error('获取题目列表失败:', error)
    return c.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    }, 500)
  }
})

/**
 * GET /api/questions/:id
 * 获取单个题目详情
 */
app.get('/:id', async (c) => {
  try {
    const questionId = parseInt(c.params.id)

    const [question] = await db
      .select()
      .from(questions)
      .where(eq(questions.id, questionId))
      .limit(1)

    if (!question) {
      return c.json({
        success: false,
        error: { code: 'NOT_FOUND', message: '题目不存在' }
      }, 404)
    }

    return c.json({
      success: true,
      data: question
    })

  } catch (error) {
    console.error('获取题目详情失败:', error)
    return c.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    }, 500)
  }
})

/**
 * GET /api/questions/random
 * 随机获取题目（智能筛选）
 */
app.get('/random', async (c) => {
  try {
    const {
      chapterId,
      difficulty,
      type,
      count = 1,
      excludeIds = []
    } = c.req.query()

    // 构建查询条件
    const conditions = [eq(questions.status, 'published')]

    if (chapterId) {
      conditions.push(eq(questions.chapterId, chapterId))
    }

    if (difficulty) {
      conditions.push(eq(questions.difficulty, parseInt(difficulty)))
    }

    if (type) {
      conditions.push(eq(questions.type, type))
    }

    // 排除已选题目
    const excludeIdArray = Array.isArray(excludeIds) ? excludeIds : (excludeIds ? [excludeIds] : [])
    if (excludeIdArray.length > 0) {
      conditions.push(sql`${questions.id} NOT IN (${excludeIdArray.map(id => parseInt(id)).join(',')})`)
    }

    // 随机查询
    const result = await db
      .select()
      .from(questions)
      .where(and(...conditions))
      .orderBy(sql`RANDOM()`)
      .limit(parseInt(count))

    return c.json({
      success: true,
      data: {
        questions: result,
        count: result.length
      }
    })

  } catch (error) {
    console.error('随机获取题目失败:', error)
    return c.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    }, 500)
  }
})

// ============================================================
// 题目管理 API
// ============================================================

/**
 * POST /api/questions
 * 创建题目（手动录入）
 */
app.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const userId = c.get('userId') // 从认证中间件获取

    const {
      chapterId,
      type,
      difficulty,
      content,
      options,
      answer,
      explanation,
      tags = [],
      estimatedTime = 300
    } = body

    // 验证必填字段
    if (!chapterId || !type || !difficulty || !content || !answer) {
      return c.json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: '缺少必填字段' }
      }, 400)
    }

    // 创建题目
    const [question] = await db
      .insert(questions)
      .values({
        chapterId,
        type,
        difficulty,
        content,
        options: options || null,
        answer,
        explanation: explanation || null,
        tags,
        source: 'manual',
        estimatedTime,
        status: 'draft', // 默认草稿状态
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning()

    return c.json({
      success: true,
      data: question
    })

  } catch (error) {
    console.error('创建题目失败:', error)
    return c.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    }, 500)
  }
})

/**
 * PUT /api/questions/:id
 * 更新题目
 */
app.put('/:id', async (c) => {
  try {
    const questionId = parseInt(c.params.id)
    const body = await c.req.json()

    const {
      type,
      difficulty,
      content,
      options,
      answer,
      explanation,
      tags,
      estimatedTime,
      status
    } = body

    // 构建更新数据
    const updateData = {
      updatedAt: new Date()
    }

    if (type) updateData.type = type
    if (difficulty) updateData.difficulty = difficulty
    if (content) updateData.content = content
    if (options !== undefined) updateData.options = options
    if (answer) updateData.answer = answer
    if (explanation !== undefined) updateData.explanation = explanation
    if (tags) updateData.tags = tags
    if (estimatedTime) updateData.estimatedTime = estimatedTime
    if (status) updateData.status = status

    const [updated] = await db
      .update(questions)
      .set(updateData)
      .where(eq(questions.id, questionId))
      .returning()

    if (!updated) {
      return c.json({
        success: false,
        error: { code: 'NOT_FOUND', message: '题目不存在' }
      }, 404)
    }

    return c.json({
      success: true,
      data: updated
    })

  } catch (error) {
    console.error('更新题目失败:', error)
    return c.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    }, 500)
  }
})

/**
 * DELETE /api/questions/:id
 * 删除题目
 */
app.delete('/:id', async (c) => {
  try {
    const questionId = parseInt(c.params.id)

    const [deleted] = await db
      .delete(questions)
      .where(eq(questions.id, questionId))
      .returning()

    if (!deleted) {
      return c.json({
        success: false,
        error: { code: 'NOT_FOUND', message: '题目不存在' }
      }, 404)
    }

    return c.json({
      success: true,
      data: { id: questionId }
    })

  } catch (error) {
    console.error('删除题目失败:', error)
    return c.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    }, 500)
  }
})

/**
 * PUT /api/questions/:id/review
 * 审核题目
 */
app.put('/:id/review', async (c) => {
  try {
    const questionId = parseInt(c.params.id)
    const userId = c.get('userId')
    const { status, feedback } = await c.req.json()

    if (!['published', 'draft'].includes(status)) {
      return c.json({
        success: false,
        error: { code: 'INVALID_STATUS', message: '无效的审核状态' }
      }, 400)
    }

    const [updated] = await db
      .update(questions)
      .set({
        status,
        reviewedBy: userId,
        reviewedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(questions.id, questionId))
      .returning()

    if (!updated) {
      return c.json({
        success: false,
        error: { code: 'NOT_FOUND', message: '题目不存在' }
      }, 404)
    }

    return c.json({
      success: true,
      data: updated
    })

  } catch (error) {
    console.error('审核题目失败:', error)
    return c.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    }, 500)
  }
})

// ============================================================
// AI 出题 API
// ============================================================

/**
 * POST /api/questions/generate
 * AI 生成题目
 */
app.post('/generate', async (c) => {
  try {
    const body = await c.req.json()
    const userId = c.get('userId')

    const {
      chapterId,
      count = 5,
      difficulty = [2, 3, 4],
      types = ['multiple_choice', 'calculation'],
      tags = [],
      language = 'en'
    } = body

    if (!chapterId) {
      return c.json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: '缺少章节 ID' }
      }, 400)
    }

    // 调用 AI 生成题目
    const generatedQuestions = await generateQuestions(chapterId, {
      count,
      difficulty,
      types,
      tags,
      language,
      userId
    })

    return c.json({
      success: true,
      data: {
        questions: generatedQuestions,
        count: generatedQuestions.length,
        message: '题目已生成，状态为草稿，需要审核后发布'
      }
    })

  } catch (error) {
    console.error('AI 生成题目失败:', error)
    return c.json({
      success: false,
      error: { code: 'AI_GENERATION_ERROR', message: error.message }
    }, 500)
  }
})

/**
 * POST /api/questions/generate/preview
 * 预览 AI 生成结果（不保存）
 */
app.post('/generate/preview', async (c) => {
  try {
    const body = await c.req.json()

    const {
      chapterId,
      count = 5,
      difficulty = [2, 3, 4],
      types = ['multiple_choice', 'calculation'],
      tags = [],
      language = 'en'
    } = body

    if (!chapterId) {
      return c.json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: '缺少章节 ID' }
      }, 400)
    }

    // 预览生成
    const result = await previewGenerateQuestions(chapterId, {
      count,
      difficulty,
      types,
      tags,
      language
    })

    return c.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('预览生成失败:', error)
    return c.json({
      success: false,
      error: { code: 'AI_GENERATION_ERROR', message: error.message }
    }, 500)
  }
})

/**
 * POST /api/questions/batch
 * 批量导入题目
 */
app.post('/batch', async (c) => {
  try {
    const body = await c.req.json()
    const userId = c.get('userId')
    const { questions: questionsData } = body

    if (!Array.isArray(questionsData) || questionsData.length === 0) {
      return c.json({
        success: false,
        error: { code: 'INVALID_DATA', message: '无效的题目数据' }
      }, 400)
    }

    // 批量插入（修复性能问题）
    try {
      const savedQuestions = await db
        .insert(questions)
        .values(questionsData.map(q => ({
          ...q,
          createdBy: userId,
          createdAt: new Date(),
          updatedAt: new Date()
        })))
        .returning()

      return c.json({
        success: true,
        data: {
          questions: savedQuestions,
          total: savedQuestions.length,
          failed: 0
        }
      })
    } catch (error) {
      console.error('批量导入失败:', error)
      return c.json({
        success: false,
        error: { code: 'SERVER_ERROR', message: error.message }
      }, 500)
    }

  } catch (error) {
    console.error('批量导入失败:', error)
    return c.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    }, 500)
  }
})

export default app
