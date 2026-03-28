import { Hono } from 'hono'
import { db } from '../db/index.js'
import { chatSessions, chatMessages, chatContexts } from '../db/schema.js'
import { eq, and, desc } from 'drizzle-orm'

const app = new Hono()

// ============================================================
// 会话管理 API
// ============================================================

/**
 * POST /api/chat/sessions
 * 创建新会话
 */
app.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const { userId, chapterId, title, sessionType } = body

    // 验证必填字段
    if (!userId) {
      return c.json({
        success: false,
        error: { code: 'MISSING_USER_ID', message: '缺少用户ID' }
      }, 400)
    }

    // 创建会话
    const newSession = await db
      .insert(chatSessions)
      .values({
        userId,
        chapterId: chapterId || null,
        title: title || '新对话',
        sessionType: sessionType || 'learning',
        status: 'active',
        messageCount: 0,
        lastMessageAt: new Date()
      })
      .returning()

    return c.json({
      success: true,
      data: newSession[0]
    }, 201)
  } catch (error) {
    console.error('创建会话失败:', error)
    return c.json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: '创建会话失败' }
    }, 500)
  }
})

/**
 * GET /api/chat/sessions
 * 获取用户的会话列表
 */
app.get('/', async (c) => {
  try {
    const userId = c.get('userId')
    const status = c.req.query('status') || 'active'
    const limit = parseInt(c.req.query('limit') || '20')
    const offset = parseInt(c.req.query('offset') || '0')

    if (!userId) {
      return c.json({
        success: false,
        error: { code: 'MISSING_USER_ID', message: '缺少用户ID' }
      }, 400)
    }

    // 构建查询条件
    const conditions = [eq(chatSessions.userId, userId)]
    if (status) {
      conditions.push(eq(chatSessions.status, status))
    }

    // 查询会话列表
    const sessions = await db
      .select()
      .from(chatSessions)
      .where(and(...conditions))
      .orderBy(desc(chatSessions.lastMessageAt))
      .limit(limit)
      .offset(offset)

    return c.json({
      success: true,
      data: sessions
    })
  } catch (error) {
    console.error('获取会话列表失败:', error)
    return c.json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: '获取会话列表失败' }
    }, 500)
  }
})

/**
 * GET /api/chat/sessions/:id
 * 获取会话详情
 */
app.get('/:id', async (c) => {
  try {
    const sessionId = parseInt(c.req.param('id'))

    if (isNaN(sessionId)) {
      return c.json({
        success: false,
        error: { code: 'INVALID_SESSION_ID', message: '无效的会话ID' }
      }, 400)
    }

    const session = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.id, sessionId))
      .limit(1)

    if (session.length === 0) {
      return c.json({
        success: false,
        error: { code: 'SESSION_NOT_FOUND', message: '会话不存在' }
      }, 404)
    }

    return c.json({
      success: true,
      data: session[0]
    })
  } catch (error) {
    console.error('获取会话详情失败:', error)
    return c.json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: '获取会话详情失败' }
    }, 500)
  }
})

/**
 * PUT /api/chat/sessions/:id
 * 更新会话
 */
app.put('/:id', async (c) => {
  try {
    const sessionId = parseInt(c.req.param('id'))
    const body = await c.req.json()

    if (isNaN(sessionId)) {
      return c.json({
        success: false,
        error: { code: 'INVALID_SESSION_ID', message: '无效的会话ID' }
      }, 400)
    }

    // 允许更新的字段
    const allowedFields = ['title', 'status', 'chapterId']
    const updateData = { updatedAt: new Date() }

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    if (Object.keys(updateData).length === 1) {
      return c.json({
        success: false,
        error: { code: 'NO_UPDATE_DATA', message: '没有需要更新的数据' }
      }, 400)
    }

    const result = await db
      .update(chatSessions)
      .set(updateData)
      .where(eq(chatSessions.id, sessionId))
      .returning()

    if (result.length === 0) {
      return c.json({
        success: false,
        error: { code: 'SESSION_NOT_FOUND', message: '会话不存在' }
      }, 404)
    }

    return c.json({
      success: true,
      data: result[0]
    })
  } catch (error) {
    console.error('更新会话失败:', error)
    return c.json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: '更新会话失败' }
    }, 500)
  }
})

/**
 * DELETE /api/chat/sessions/:id
 * 删除会话
 */
app.delete('/:id', async (c) => {
  try {
    const sessionId = parseInt(c.req.param('id'))

    if (isNaN(sessionId)) {
      return c.json({
        success: false,
        error: { code: 'INVALID_SESSION_ID', message: '无效的会话ID' }
      }, 400)
    }

    await db
      .delete(chatSessions)
      .where(eq(chatSessions.id, sessionId))

    return c.json({
      success: true,
      message: '会话已删除'
    })
  } catch (error) {
    console.error('删除会话失败:', error)
    return c.json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: '删除会话失败' }
    }, 500)
  }
})

/**
 * GET /api/chat/sessions/:id/messages
 * 获取会话的消息历史
 */
app.get('/:id/messages', async (c) => {
  try {
    const sessionId = parseInt(c.req.param('id'))
    const limit = parseInt(c.req.query('limit') || '50')
    const offset = parseInt(c.req.query('offset') || '0')

    if (isNaN(sessionId)) {
      return c.json({
        success: false,
        error: { code: 'INVALID_SESSION_ID', message: '无效的会话ID' }
      }, 400)
    }

    // 获取消息列表
    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(chatMessages.createdAt)
      .limit(limit)
      .offset(offset)

    // 获取总数
    const totalResult = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))

    return c.json({
      success: true,
      data: {
        messages,
        total: totalResult.length,
        hasMore: offset + messages.length < totalResult.length
      }
    })
  } catch (error) {
    console.error('获取消息历史失败:', error)
    return c.json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: '获取消息历史失败' }
    }, 500)
  }
})

export default app
