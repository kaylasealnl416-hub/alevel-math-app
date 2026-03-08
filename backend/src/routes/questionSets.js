// ============================================================
// 试卷管理 API
// 提供智能组卷、试卷查询、试卷管理等功能
// ============================================================

import { Hono } from 'hono'
import {
  composeExam,
  getQuestionSetWithQuestions,
  deleteQuestionSet,
  getUserQuestionSets,
  COMPOSE_STRATEGIES
} from '../services/examComposer.js'

const app = new Hono()

// ============================================================
// 智能组卷 API
// ============================================================

/**
 * POST /api/question-sets/compose
 * 智能组卷
 */
app.post('/compose', async (c) => {
  try {
    const body = await c.req.json()
    const userId = c.get('userId')

    const {
      chapterId,
      strategy = 'difficulty',
      count = 10,
      types = ['multiple_choice', 'calculation'],
      difficultyDistribution,
      tags = [],
      timeLimit,
      title,
      description
    } = body

    // 验证必填字段
    if (!chapterId) {
      return c.json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: '缺少章节 ID' }
      }, 400)
    }

    // 验证组卷策略
    if (!Object.values(COMPOSE_STRATEGIES).includes(strategy)) {
      return c.json({
        success: false,
        error: { code: 'INVALID_STRATEGY', message: '无效的组卷策略' }
      }, 400)
    }

    // 调用智能组卷服务
    const result = await composeExam({
      chapterId,
      strategy,
      count,
      types,
      difficultyDistribution,
      tags,
      userId,
      timeLimit,
      title: title || `${strategy === 'random' ? '随机' : strategy === 'difficulty' ? '难度分布' : strategy === 'knowledge' ? '知识点覆盖' : strategy === 'ai_recommend' ? 'AI推荐' : '真题风格'}练习`,
      description: description || `使用 ${strategy} 策略生成的练习题集`
    })

    return c.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('智能组卷失败:', error)
    return c.json({
      success: false,
      error: { code: 'COMPOSE_ERROR', message: error.message }
    }, 500)
  }
})

// ============================================================
// 试卷查询 API
// ============================================================

/**
 * GET /api/question-sets
 * 获取用户的试卷列表
 */
app.get('/', async (c) => {
  try {
    const userId = c.get('userId')
    const { chapterId, type, limit = 20, offset = 0 } = c.req.query()

    const questionSets = await getUserQuestionSets(userId, {
      chapterId,
      type,
      limit: parseInt(limit),
      offset: parseInt(offset)
    })

    return c.json({
      success: true,
      data: {
        questionSets,
        total: questionSets.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    })

  } catch (error) {
    console.error('获取试卷列表失败:', error)
    return c.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    }, 500)
  }
})

/**
 * GET /api/question-sets/:id
 * 获取试卷详情（包含题目）
 */
app.get('/:id', async (c) => {
  try {
    const questionSetId = parseInt(c.req.param('id'))

    const result = await getQuestionSetWithQuestions(questionSetId)

    return c.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('获取试卷详情失败:', error)

    if (error.message === '试卷不存在') {
      return c.json({
        success: false,
        error: { code: 'NOT_FOUND', message: error.message }
      }, 404)
    }

    return c.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    }, 500)
  }
})

// ============================================================
// 试卷管理 API
// ============================================================

/**
 * DELETE /api/question-sets/:id
 * 删除试卷
 */
app.delete('/:id', async (c) => {
  try {
    const questionSetId = parseInt(c.req.param('id'))
    const userId = c.get('userId')

    // 验证试卷所有权（可选，根据需求决定）
    const result = await getQuestionSetWithQuestions(questionSetId)

    if (result.questionSet.userId && result.questionSet.userId !== userId) {
      return c.json({
        success: false,
        error: { code: 'FORBIDDEN', message: '无权删除此试卷' }
      }, 403)
    }

    const deleted = await deleteQuestionSet(questionSetId)

    if (!deleted) {
      return c.json({
        success: false,
        error: { code: 'NOT_FOUND', message: '试卷不存在' }
      }, 404)
    }

    return c.json({
      success: true,
      data: { id: questionSetId }
    })

  } catch (error) {
    console.error('删除试卷失败:', error)
    return c.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    }, 500)
  }
})

// ============================================================
// 组卷策略信息 API
// ============================================================

/**
 * GET /api/question-sets/strategies
 * 获取所有可用的组卷策略
 */
app.get('/strategies', async (c) => {
  const strategies = [
    {
      key: COMPOSE_STRATEGIES.RANDOM,
      name: '随机选题',
      description: '从题库中随机选择题目',
      icon: '🎲'
    },
    {
      key: COMPOSE_STRATEGIES.DIFFICULTY,
      name: '难度分布',
      description: '按照指定的难度比例选题（默认 3:5:2）',
      icon: '📊'
    },
    {
      key: COMPOSE_STRATEGIES.KNOWLEDGE,
      name: '知识点覆盖',
      description: '尽量覆盖更多不同的知识点',
      icon: '🎓'
    },
    {
      key: COMPOSE_STRATEGIES.AI_RECOMMEND,
      name: 'AI 推荐',
      description: '根据你的薄弱知识点智能推荐',
      icon: '🤖'
    },
    {
      key: COMPOSE_STRATEGIES.EXAM_STYLE,
      name: '真题风格',
      description: '优先选择历年真题',
      icon: '📝'
    }
  ]

  return c.json({
    success: true,
    data: { strategies }
  })
})

export default app
