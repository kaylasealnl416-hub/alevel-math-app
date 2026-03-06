import { Hono } from 'hono'
import { db } from '../db/index.js'
import { learningProgress, userStats, chapters } from '../db/schema.js'
import { eq, and, sql } from 'drizzle-orm'

const app = new Hono()

// ============================================================
// 学习进度追踪 API
// ============================================================

/**
 * GET /api/progress/:userId
 * 获取用户的所有学习进度
 */
app.get('/:userId', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'))

    if (isNaN(userId)) {
      return c.json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: '无效的用户ID' }
      }, 400)
    }

    const progress = await db
      .select()
      .from(learningProgress)
      .where(eq(learningProgress.userId, userId))

    return c.json({
      success: true,
      data: progress
    })
  } catch (error) {
    console.error('获取学习进度失败:', error)
    return c.json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: '数据库查询失败' }
    }, 500)
  }
})

/**
 * GET /api/progress/:userId/chapter/:chapterId
 * 获取用户某个章节的学习进度
 */
app.get('/:userId/chapter/:chapterId', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'))
    const chapterId = c.req.param('chapterId')

    if (isNaN(userId)) {
      return c.json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: '无效的用户ID' }
      }, 400)
    }

    const progress = await db
      .select()
      .from(learningProgress)
      .where(
        and(
          eq(learningProgress.userId, userId),
          eq(learningProgress.chapterId, chapterId)
        )
      )
      .limit(1)

    if (progress.length === 0) {
      return c.json({
        success: true,
        data: null // 还没有学习记录
      })
    }

    return c.json({
      success: true,
      data: progress[0]
    })
  } catch (error) {
    console.error('获取章节进度失败:', error)
    return c.json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: '数据库查询失败' }
    }, 500)
  }
})

/**
 * POST /api/progress
 * 记录或更新学习进度
 */
app.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const { userId, chapterId, status, masteryLevel, timeSpent } = body

    // 验证必填字段
    if (!userId || !chapterId) {
      return c.json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: '缺少必填字段：userId 和 chapterId' }
      }, 400)
    }

    // 检查章节是否存在
    const chapterExists = await db
      .select()
      .from(chapters)
      .where(eq(chapters.id, chapterId))
      .limit(1)

    if (chapterExists.length === 0) {
      return c.json({
        success: false,
        error: { code: 'CHAPTER_NOT_FOUND', message: '章节不存在' }
      }, 404)
    }

    // 检查是否已有进度记录
    const existing = await db
      .select()
      .from(learningProgress)
      .where(
        and(
          eq(learningProgress.userId, userId),
          eq(learningProgress.chapterId, chapterId)
        )
      )
      .limit(1)

    let result

    if (existing.length > 0) {
      // 更新现有记录
      const updateData = {
        updatedAt: new Date(),
        lastReviewedAt: new Date()
      }

      if (status !== undefined) updateData.status = status
      if (masteryLevel !== undefined) updateData.masteryLevel = masteryLevel
      if (timeSpent !== undefined) {
        updateData.timeSpent = existing[0].timeSpent + timeSpent
      }
      if (status === 'completed' && !existing[0].completedAt) {
        updateData.completedAt = new Date()
      }

      result = await db
        .update(learningProgress)
        .set(updateData)
        .where(eq(learningProgress.id, existing[0].id))
        .returning()

      // 如果章节完成，更新用户统计
      if (status === 'completed' && existing[0].status !== 'completed') {
        await updateUserStats(userId, timeSpent || 0, true)
      } else if (timeSpent) {
        await updateUserStats(userId, timeSpent, false)
      }
    } else {
      // 创建新记录
      result = await db
        .insert(learningProgress)
        .values({
          userId,
          chapterId,
          status: status || 'in_progress',
          masteryLevel: masteryLevel || 0,
          timeSpent: timeSpent || 0,
          lastReviewedAt: new Date(),
          completedAt: status === 'completed' ? new Date() : null
        })
        .returning()

      // 更新用户统计
      await updateUserStats(userId, timeSpent || 0, status === 'completed')
    }

    return c.json({
      success: true,
      data: result[0]
    })
  } catch (error) {
    console.error('记录学习进度失败:', error)
    return c.json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: '数据库操作失败' }
    }, 500)
  }
})

/**
 * GET /api/progress/:userId/stats
 * 获取用户学习统计
 */
app.get('/:userId/stats', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'))

    if (isNaN(userId)) {
      return c.json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: '无效的用户ID' }
      }, 400)
    }

    // 获取基础统计
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

    // 获取详细进度统计
    let progressStats = []
    try {
      progressStats = await db
        .select({
          status: learningProgress.status,
          count: sql<number>`cast(count(*) as integer)`
        })
        .from(learningProgress)
        .where(eq(learningProgress.userId, userId))
        .groupBy(learningProgress.status)
    } catch (err) {
      console.error('获取进度统计失败:', err)
      progressStats = []
    }

    const statusCounts = {
      not_started: 0,
      in_progress: 0,
      completed: 0
    }

    progressStats.forEach(stat => {
      if (stat.status && statusCounts.hasOwnProperty(stat.status)) {
        statusCounts[stat.status] = Number(stat.count) || 0
      }
    })

    return c.json({
      success: true,
      data: {
        ...stats[0],
        progressByStatus: statusCounts
      }
    })
  } catch (error) {
    console.error('获取学习统计失败:', error)
    return c.json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: '数据库查询失败' }
    }, 500)
  }
})

/**
 * DELETE /api/progress/:userId/chapter/:chapterId
 * 删除学习进度记录（用于测试）
 */
app.delete('/:userId/chapter/:chapterId', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'))
    const chapterId = c.req.param('chapterId')

    if (isNaN(userId)) {
      return c.json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: '无效的用户ID' }
      }, 400)
    }

    await db
      .delete(learningProgress)
      .where(
        and(
          eq(learningProgress.userId, userId),
          eq(learningProgress.chapterId, chapterId)
        )
      )

    return c.json({
      success: true,
      message: '学习进度已删除'
    })
  } catch (error) {
    console.error('删除学习进度失败:', error)
    return c.json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: '数据库操作失败' }
    }, 500)
  }
})

// ============================================================
// 辅助函数
// ============================================================

/**
 * 更新用户统计数据
 */
async function updateUserStats(userId, timeSpent, chapterCompleted) {
  try {
    const stats = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1)

    if (stats.length === 0) {
      return
    }

    const currentStats = stats[0]
    const today = new Date().toDateString()
    const lastStudyDate = currentStats.lastStudyDate
      ? new Date(currentStats.lastStudyDate).toDateString()
      : null

    // 计算连续学习天数
    let currentStreak = currentStats.currentStreak
    let longestStreak = currentStats.longestStreak

    if (lastStudyDate !== today) {
      if (lastStudyDate === new Date(Date.now() - 86400000).toDateString()) {
        // 昨天学习过，连续天数+1
        currentStreak += 1
      } else {
        // 中断了，重新开始
        currentStreak = 1
      }
      longestStreak = Math.max(longestStreak, currentStreak)
    }

    const updateData = {
      totalStudyTime: currentStats.totalStudyTime + timeSpent,
      lastStudyDate: new Date(),
      currentStreak,
      longestStreak,
      updatedAt: new Date()
    }

    if (chapterCompleted) {
      updateData.totalChaptersCompleted = currentStats.totalChaptersCompleted + 1
    }

    await db
      .update(userStats)
      .set(updateData)
      .where(eq(userStats.userId, userId))
  } catch (error) {
    console.error('更新用户统计失败:', error)
  }
}

export default app
