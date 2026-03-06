import { Hono } from 'hono'
import { db } from '../db/index.js'
import { users, userProfiles, userStats } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const app = new Hono()

// ============================================================
// 用户管理 API
// ============================================================

/**
 * GET /api/users/:id
 * 获取用户信息
 */
app.get('/:id', async (c) => {
  try {
    const userId = parseInt(c.req.param('id'))

    if (isNaN(userId)) {
      return c.json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: '无效的用户ID' }
      }, 400)
    }

    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)

    if (user.length === 0) {
      return c.json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: '用户不存在' }
      }, 404)
    }

    return c.json({
      success: true,
      data: user[0]
    })
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return c.json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: '数据库查询失败' }
    }, 500)
  }
})

/**
 * PUT /api/users/:id
 * 更新用户信息
 */
app.put('/:id', async (c) => {
  try {
    const userId = parseInt(c.req.param('id'))
    const body = await c.req.json()

    if (isNaN(userId)) {
      return c.json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: '无效的用户ID' }
      }, 400)
    }

    // 允许更新的字段
    const allowedFields = ['nickname', 'avatar', 'email', 'phone', 'grade', 'targetUniversity']
    const updateData = {}

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return c.json({
        success: false,
        error: { code: 'NO_UPDATE_DATA', message: '没有需要更新的数据' }
      }, 400)
    }

    updateData.updatedAt = new Date()

    const result = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning()

    if (result.length === 0) {
      return c.json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: '用户不存在' }
      }, 404)
    }

    return c.json({
      success: true,
      data: result[0]
    })
  } catch (error) {
    console.error('更新用户信息失败:', error)
    return c.json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: '数据库更新失败' }
    }, 500)
  }
})

/**
 * POST /api/users
 * 创建新用户（用于测试，实际应该通过微信登录创建）
 */
app.post('/', async (c) => {
  try {
    const body = await c.req.json()

    // 基本验证
    if (!body.nickname) {
      return c.json({
        success: false,
        error: { code: 'MISSING_NICKNAME', message: '昵称不能为空' }
      }, 400)
    }

    const newUser = await db
      .insert(users)
      .values({
        nickname: body.nickname,
        avatar: body.avatar || null,
        email: body.email || null,
        phone: body.phone || null,
        grade: body.grade || null,
        targetUniversity: body.targetUniversity || null,
      })
      .returning()

    // 同时创建用户画像和统计记录
    await db.insert(userProfiles).values({ userId: newUser[0].id })
    await db.insert(userStats).values({ userId: newUser[0].id })

    return c.json({
      success: true,
      data: newUser[0]
    }, 201)
  } catch (error) {
    console.error('创建用户失败:', error)
    return c.json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: '数据库插入失败' }
    }, 500)
  }
})

/**
 * GET /api/users/:id/profile
 * 获取用户画像
 */
app.get('/:id/profile', async (c) => {
  try {
    const userId = parseInt(c.req.param('id'))

    if (isNaN(userId)) {
      return c.json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: '无效的用户ID' }
      }, 400)
    }

    const profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1)

    if (profile.length === 0) {
      return c.json({
        success: false,
        error: { code: 'PROFILE_NOT_FOUND', message: '用户画像不存在' }
      }, 404)
    }

    return c.json({
      success: true,
      data: profile[0]
    })
  } catch (error) {
    console.error('获取用户画像失败:', error)
    return c.json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: '数据库查询失败' }
    }, 500)
  }
})

/**
 * PUT /api/users/:id/profile
 * 更新用户画像
 */
app.put('/:id/profile', async (c) => {
  try {
    const userId = parseInt(c.req.param('id'))
    const body = await c.req.json()

    if (isNaN(userId)) {
      return c.json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: '无效的用户ID' }
      }, 400)
    }

    // 允许更新的字段
    const allowedFields = ['selectedSubjects', 'studyGoals', 'weeklyStudyHours', 'preferredStudyTime', 'notificationEnabled']
    const updateData = {}

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return c.json({
        success: false,
        error: { code: 'NO_UPDATE_DATA', message: '没有需要更新的数据' }
      }, 400)
    }

    updateData.updatedAt = new Date()

    const result = await db
      .update(userProfiles)
      .set(updateData)
      .where(eq(userProfiles.userId, userId))
      .returning()

    if (result.length === 0) {
      return c.json({
        success: false,
        error: { code: 'PROFILE_NOT_FOUND', message: '用户画像不存在' }
      }, 404)
    }

    return c.json({
      success: true,
      data: result[0]
    })
  } catch (error) {
    console.error('更新用户画像失败:', error)
    return c.json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: '数据库更新失败' }
    }, 500)
  }
})

/**
 * GET /api/users/:id/stats
 * 获取用户学习统计
 */
app.get('/:id/stats', async (c) => {
  try {
    const userId = parseInt(c.req.param('id'))

    if (isNaN(userId)) {
      return c.json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: '无效的用户ID' }
      }, 400)
    }

    const stats = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1)

    if (stats.length === 0) {
      return c.json({
        success: false,
        error: { code: 'STATS_NOT_FOUND', message: '用户统计不存在' }
      }, 404)
    }

    return c.json({
      success: true,
      data: stats[0]
    })
  } catch (error) {
    console.error('获取用户统计失败:', error)
    return c.json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: '数据库查询失败' }
    }, 500)
  }
})

export default app
