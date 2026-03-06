import { Hono } from 'hono'
import { db } from '../db/index.js'
import * as schema from '../db/schema.js'
import { eq } from 'drizzle-orm'

const app = new Hono()

// GET /api/chapters/:id - 获取单个章节详情
app.get('/:id', async (c) => {
  try {
    const chapterId = c.req.param('id')

    // 查询章节
    const chapterResult = await db
      .select()
      .from(schema.chapters)
      .where(eq(schema.chapters.id, chapterId))
      .limit(1)

    if (chapterResult.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `章节 ${chapterId} 不存在`
        }
      }, 404)
    }

    const chapter = chapterResult[0]

    return c.json({
      success: true,
      data: {
        id: chapter.id,
        num: chapter.num,
        title: chapter.title,
        overview: chapter.overview,
        keyPoints: chapter.keyPoints,
        formulas: chapter.formulas,
        examples: chapter.examples,
        videos: chapter.videos,
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('获取章节详情失败:', error)
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '获取章节详情失败'
      }
    }, 500)
  }
})

export default app
