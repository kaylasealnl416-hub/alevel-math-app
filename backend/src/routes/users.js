import { Hono } from 'hono'
import { db } from '../db/index.js'
import { users, userProfiles, userStats } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import { authMiddleware } from '../middleware/auth.js'

const app = new Hono()

// 所有路由均需认证
app.use('/*', authMiddleware)

// ============================================================
// 用户管理 API
// ============================================================

/**
 * PUT /api/users/profile
 * 更新当前登录用户的信息（需要认证）
 */
app.put('/profile', async (c) => {
  try {
    const userId = c.get('userId') // 从 authMiddleware 获取
    const body = await c.req.json()

    // users 表字段
    const userFields = ['nickname', 'avatar', 'phone', 'grade', 'targetUniversity']
    // userProfiles 表字段
    const profileFields = ['selectedSubjects']

    const userUpdateData = {}
    const profileUpdateData = {}

    for (const field of userFields) {
      if (body[field] !== undefined) {
        userUpdateData[field] = body[field]
      }
    }
    for (const field of profileFields) {
      if (body[field] !== undefined) {
        profileUpdateData[field] = body[field]
      }
    }

    if (Object.keys(userUpdateData).length === 0 && Object.keys(profileUpdateData).length === 0) {
      return c.json({
        success: false,
        error: { code: 'NO_UPDATE_DATA', message: '没有需要更新的数据' }
      }, 400)
    }

    let userResult = null

    // 更新 users 表
    if (Object.keys(userUpdateData).length > 0) {
      userUpdateData.updatedAt = new Date()
      const result = await db
        .update(users)
        .set(userUpdateData)
        .where(eq(users.id, userId))
        .returning()
      if (result.length === 0) {
        return c.json({
          success: false,
          error: { code: 'USER_NOT_FOUND', message: '用户不存在' }
        }, 404)
      }
      userResult = result[0]
    } else {
      const result = await db.select().from(users).where(eq(users.id, userId)).limit(1)
      userResult = result[0]
    }

    // 更新 userProfiles 表（selectedSubjects 等）
    if (Object.keys(profileUpdateData).length > 0) {
      profileUpdateData.updatedAt = new Date()
      await db
        .update(userProfiles)
        .set(profileUpdateData)
        .where(eq(userProfiles.userId, userId))
    }

    // 合并返回结果
    const { password, ...userWithoutPassword } = userResult
    // 读取最新的 profile 数据合并返回
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1)
    const merged = { ...userWithoutPassword, selectedSubjects: profile?.selectedSubjects || [] }

    return c.json({
      success: true,
      data: merged
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
 * GET /api/users/:id
 * 获取用户信息（只允许访问自己的数据）
 */
app.get('/:id', async (c) => {
  try {
    const userId = parseInt(c.req.param('id'))
    const authenticatedUserId = c.get('userId')

    if (isNaN(userId)) {
      return c.json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: '无效的用户ID' }
      }, 400)
    }

    if (userId !== authenticatedUserId) {
      return c.json({
        success: false,
        error: { code: 'FORBIDDEN', message: '无权访问其他用户信息' }
      }, 403)
    }

    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)

    if (user.length === 0) {
      return c.json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: '用户不存在' }
      }, 404)
    }

    // 移除密码字段
    const { password, ...userWithoutPassword } = user[0]

    return c.json({
      success: true,
      data: userWithoutPassword
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
    const currentUserId = c.get('userId')
    const body = await c.req.json()

    if (isNaN(userId)) {
      return c.json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: '无效的用户ID' }
      }, 400)
    }

    if (currentUserId !== userId) {
      return c.json({
        success: false,
        error: { code: 'FORBIDDEN', message: '无权修改其他用户信息' }
      }, 403)
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
 * 获取用户画像（只允许访问自己的数据）
 */
app.get('/:id/profile', async (c) => {
  try {
    const userId = parseInt(c.req.param('id'))
    const authenticatedUserId = c.get('userId')

    if (isNaN(userId)) {
      return c.json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: '无效的用户ID' }
      }, 400)
    }

    if (userId !== authenticatedUserId) {
      return c.json({
        success: false,
        error: { code: 'FORBIDDEN', message: '无权访问其他用户画像' }
      }, 403)
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
 * 更新用户画像（只允许修改自己的数据）
 */
app.put('/:id/profile', async (c) => {
  try {
    const userId = parseInt(c.req.param('id'))
    const authenticatedUserId = c.get('userId')
    const body = await c.req.json()

    if (isNaN(userId)) {
      return c.json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: '无效的用户ID' }
      }, 400)
    }

    if (userId !== authenticatedUserId) {
      return c.json({
        success: false,
        error: { code: 'FORBIDDEN', message: '无权修改其他用户画像' }
      }, 403)
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
 * 获取用户学习统计（只允许访问自己的数据）
 */
app.get('/:id/stats', async (c) => {
  try {
    const userId = parseInt(c.req.param('id'))
    const authenticatedUserId = c.get('userId')

    if (isNaN(userId)) {
      return c.json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: '无效的用户ID' }
      }, 400)
    }

    if (userId !== authenticatedUserId) {
      return c.json({
        success: false,
        error: { code: 'FORBIDDEN', message: '无权访问其他用户的学习统计' }
      }, 403)
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
