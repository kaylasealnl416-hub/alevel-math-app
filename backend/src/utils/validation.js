/**
 * 输入验证 Schema
 * 使用 Zod 进行类型安全的输入验证
 */

import { z } from 'zod'

/**
 * 创建考试的验证 Schema
 */
export const createExamSchema = z.object({
  questionSetId: z.number().int().positive('试卷 ID 必须是正整数'),
  type: z.enum(['chapter_test', 'unit_test', 'mock_exam', 'diagnostic'], {
    errorMap: () => ({ message: '考试类型无效' })
  }),
  mode: z.enum(['practice', 'exam', 'challenge'], {
    errorMap: () => ({ message: '考试模式无效' })
  }),
  timeLimit: z.number().int().positive('时间限制必须是正整数').optional(),
  allowReview: z.boolean().optional()
})

/**
 * 保存答案的验证 Schema
 */
export const saveAnswerSchema = z.object({
  questionId: z.number().int().positive('题目 ID 必须是正整数'),
  answer: z.union([
    z.string(),
    z.number(),
    z.object({
      value: z.union([z.string(), z.number()]),
      timeSpent: z.number().int().nonnegative().optional()
    })
  ])
})

/**
 * 标记题目的验证 Schema
 */
export const markQuestionSchema = z.object({
  questionId: z.number().int().positive('题目 ID 必须是正整数'),
  marked: z.boolean()
})

/**
 * 失焦事件的验证 Schema
 */
export const focusLostSchema = z.object({
  type: z.enum(['tab_switch', 'focus_lost'], {
    errorMap: () => ({ message: '事件类型无效' })
  })
})

/**
 * 查询参数验证 Schema
 */
export const queryParamsSchema = z.object({
  status: z.enum(['in_progress', 'submitted', 'graded']).optional(),
  type: z.enum(['chapter_test', 'unit_test', 'mock_exam', 'diagnostic']).optional(),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional()
})

/**
 * 验证中间件工厂函数
 * @param {z.ZodSchema} schema - Zod 验证 Schema
 * @param {string} source - 数据来源 ('body' | 'query' | 'params')
 */
export function validate(schema, source = 'body') {
  return async (c, next) => {
    try {
      let data

      // 根据来源获取数据
      if (source === 'body') {
        data = await c.req.json()
      } else if (source === 'query') {
        const query = c.req.query()
        // 转换查询参数类型
        data = {
          ...query,
          limit: query.limit ? parseInt(query.limit) : undefined,
          offset: query.offset ? parseInt(query.offset) : undefined
        }
      } else if (source === 'params') {
        data = c.req.param()
      }

      // 验证数据
      const validated = schema.parse(data)

      // 将验证后的数据存储到上下文
      c.set('validated', validated)

      await next()

    } catch (error) {
      if (error instanceof z.ZodError) {
        // Zod 验证错误
        return c.json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '输入参数验证失败',
            details: error.issues.map(e => ({
              field: e.path.join('.'),
              message: e.message
            }))
          }
        }, 400)
      }

      // 其他错误（如 JSON 解析失败）
      console.error('验证中间件错误：', error)
      return c.json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || '验证过程出错'
        }
      }, 500)
    }
  }
}

/**
 * 快速创建考试的验证 Schema
 */
export const quickStartExamSchema = z.object({
  chapterId: z.string().min(1, 'Chapter ID is required'),
  questionCount: z.number().int().min(5).max(20).default(10),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  timeLimit: z.number().int().positive().optional(),
  chapterTitle: z.string().optional(),
  chapterKeyPoints: z.array(z.any()).optional(),
  chapterFormulas: z.array(z.any()).optional(),
  chapterHardPoints: z.string().optional(),
  chapterExamTips: z.string().optional(),
  provider: z.string().optional(),
  apiKey: z.string().optional(),
  model: z.string().optional(),
})

export default {
  createExamSchema,
  saveAnswerSchema,
  markQuestionSchema,
  focusLostSchema,
  queryParamsSchema,
  quickStartExamSchema,
  validate
}
