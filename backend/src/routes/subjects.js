import { Hono } from 'hono'
import { db } from '../db/index.js'
import * as schema from '../db/schema.js'
import { eq } from 'drizzle-orm'

const app = new Hono()

// GET /api/subjects - 获取所有科目列表
app.get('/', async (c) => {
  try {
    const subjects = await db.select().from(schema.subjects)

    return c.json({
      success: true,
      data: subjects,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('获取科目列表失败:', error)
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '获取科目列表失败'
      }
    }, 500)
  }
})

// GET /api/subjects/:id - 获取单个科目详情（含单元和章节）
app.get('/:id', async (c) => {
  try {
    const subjectId = c.req.param('id')

    // 查询科目
    const subjectResult = await db
      .select()
      .from(schema.subjects)
      .where(eq(schema.subjects.id, subjectId))
      .limit(1)

    if (subjectResult.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `科目 ${subjectId} 不存在`
        }
      }, 404)
    }

    const subject = subjectResult[0]

    // 查询该科目的所有单元
    const units = await db
      .select()
      .from(schema.units)
      .where(eq(schema.units.subjectId, subjectId))
      .orderBy(schema.units.order)

    // 查询所有章节
    const allChapters = []
    for (const unit of units) {
      const unitChapters = await db
        .select()
        .from(schema.chapters)
        .where(eq(schema.chapters.unitId, unit.id))
        .orderBy(schema.chapters.order)
      allChapters.push(...unitChapters)
    }

    // 组装数据结构（与前端期望的格式一致）
    const books = {}
    for (const unit of units) {
      // 移除科目前缀，恢复原始单元ID（economics_Unit1 -> Unit1）
      const originalUnitId = unit.id.replace(`${subjectId}_`, '')

      books[originalUnitId] = {
        id: originalUnitId,
        title: unit.title,
        subtitle: unit.subtitle,
        color: unit.color,
        chapters: allChapters
          .filter(ch => ch.unitId === unit.id)
          .map(ch => ({
            id: ch.id,
            num: ch.num,
            title: ch.title,
            overview: ch.overview,
            keyPoints: ch.keyPoints,
            formulas: ch.formulas,
            examples: ch.examples,
            videos: ch.videos,
          }))
      }
    }

    // 返回与前端期望格式一致的数据
    const result = {
      id: subject.id,
      name: subject.name,
      nameFull: subject.nameFull,
      icon: subject.icon,
      color: subject.color,
      bgColor: subject.bgColor,
      level: subject.level,
      books: books
    }

    return c.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('获取科目详情失败:', error)
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '获取科目详情失败'
      }
    }, 500)
  }
})

export default app
