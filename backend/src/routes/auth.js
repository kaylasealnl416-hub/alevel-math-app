// ============================================================
// 认证路由
// 处理用户注册、登录、Token 刷新
// ============================================================

import { Hono } from 'hono'
import { db } from '../db/index.js'
import { users, userProfiles, userStats } from '../db/schema.js'
import { eq, sql } from 'drizzle-orm'
import { generateToken, generateRefreshToken, verifyToken } from '../utils/jwt.js'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const app = new Hono()

// ============================================================
// 输入验证 Schema
// ============================================================

const registerSchema = z.object({
  email: z.string().email('无效的邮箱地址'),
  password: z.string().min(6, '密码至少 6 个字符').max(100),
  nickname: z.string().min(1, '昵称不能为空').max(100),
  grade: z.enum(['AS', 'A2'], { errorMap: () => ({ message: '年级必须是 AS 或 A2' }) }).optional()
})

const loginSchema = z.object({
  email: z.string().email('无效的邮箱地址'),
  password: z.string().min(1, '密码不能为空')
})

// ============================================================
// 注册
// ============================================================

/**
 * POST /api/auth/register
 * 用户注册
 */
app.post('/register', async (c) => {
  try {
    const body = await c.req.json()

    // 验证输入
    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      return c.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '输入验证失败',
          details: validation.error.issues
        }
      }, 400)
    }

    const { email, password, nickname, grade } = validation.data

    // 检查邮箱是否已存在
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser.length > 0) {
      return c.json({
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: '该邮箱已被注册'
        }
      }, 409)
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建用户
    // 第一个注册的用户自动成为 admin
    const [{ count }] = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(users)
    const isFirstUser = count === 0

    const newUser = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        nickname,
        grade: grade || 'AS',
        role: isFirstUser ? 'admin' : 'user'
      })
      .returning()

    const userId = newUser[0].id

    // 创建用户画像
    await db.insert(userProfiles).values({
      userId,
      selectedSubjects: [],
      notificationEnabled: true
    })

    // 创建用户统计
    await db.insert(userStats).values({
      userId
    })

    // 生成 Token
    const token = generateToken({ userId, email })
    const refreshToken = generateRefreshToken({ userId })

    // 设置 httpOnly Cookie（安全存储 Token）
    const isProduction = process.env.NODE_ENV === 'production'
    const cookieOptions = {
      httpOnly: true, // 防止 JavaScript 访问
      secure: isProduction, // 生产环境使用 HTTPS
      sameSite: isProduction ? 'strict' : 'lax', // CSRF 保护
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
      path: '/'
    }

    // 设置 Cookie
    c.header('Set-Cookie', `auth_token=${token}; ${Object.entries(cookieOptions).map(([k, v]) => `${k}=${v}`).join('; ')}`)
    c.header('Set-Cookie', `refresh_token=${refreshToken}; ${Object.entries(cookieOptions).map(([k, v]) => `${k}=${v}`).join('; ')}`, { append: true })

    // 返回用户信息（不包含密码和 Token）
    const { password: _, ...userWithoutPassword } = newUser[0]

    return c.json({
      success: true,
      data: {
        user: userWithoutPassword
        // 不再返回 token 和 refreshToken，它们已存储在 httpOnly Cookie 中
      }
    }, 201)
  } catch (error) {
    console.error('注册失败:', error)
    return c.json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '注册失败，请稍后重试'
      }
    }, 500)
  }
})

// ============================================================
// 登录
// ============================================================

/**
 * POST /api/auth/login
 * 用户登录
 */
app.post('/login', async (c) => {
  try {
    const body = await c.req.json()

    // 验证输入
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return c.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '输入验证失败',
          details: validation.error.issues
        }
      }, 400)
    }

    const { email, password } = validation.data

    // 查找用户
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (user.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: '邮箱或密码错误'
        }
      }, 401)
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user[0].password)

    if (!isPasswordValid) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: '邮箱或密码错误'
        }
      }, 401)
    }

    // 更新最后登录时间
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user[0].id))

    // 生成 Token
    const token = generateToken({ userId: user[0].id, email: user[0].email })
    const refreshToken = generateRefreshToken({ userId: user[0].id })

    // 设置 httpOnly Cookie（安全存储 Token）
    const isProduction = process.env.NODE_ENV === 'production'
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
      path: '/'
    }

    // 设置 Cookie
    c.header('Set-Cookie', `auth_token=${token}; ${Object.entries(cookieOptions).map(([k, v]) => `${k}=${v}`).join('; ')}`)
    c.header('Set-Cookie', `refresh_token=${refreshToken}; ${Object.entries(cookieOptions).map(([k, v]) => `${k}=${v}`).join('; ')}`, { append: true })

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user[0]

    return c.json({
      success: true,
      data: {
        user: userWithoutPassword
      }
    })
  } catch (error) {
    console.error('登录失败:', error)
    return c.json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '登录失败，请稍后重试'
      }
    }, 500)
  }
})

// ============================================================
// 刷新 Token
// ============================================================

/**
 * POST /api/auth/refresh
 * 刷新访问令牌
 */
app.post('/refresh', async (c) => {
  try {
    const body = await c.req.json()
    const { refreshToken } = body

    if (!refreshToken) {
      return c.json({
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: '缺少刷新令牌'
        }
      }, 400)
    }

    // 验证刷新令牌
    const payload = verifyToken(refreshToken)

    if (!payload) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: '刷新令牌无效或已过期'
        }
      }, 401)
    }

    // 生成新的访问令牌
    const newToken = generateToken({ userId: payload.userId, email: payload.email })

    return c.json({
      success: true,
      data: {
        token: newToken
      }
    })
  } catch (error) {
    console.error('刷新令牌失败:', error)
    return c.json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '刷新令牌失败'
      }
    }, 500)
  }
})

// ============================================================
// 获取当前用户信息
// ============================================================

/**
 * GET /api/auth/me
 * 获取当前登录用户信息（需要认证）
 */
app.get('/me', async (c) => {
  try {
    // Try Authorization header first, then fall back to httpOnly cookie
    const authHeader = c.req.header('Authorization')
    let token = null

    if (authHeader) {
      token = authHeader.replace('Bearer ', '')
    } else {
      // Parse auth_token from cookie
      const cookieHeader = c.req.header('Cookie')
      if (cookieHeader) {
        const match = cookieHeader.match(/auth_token=([^;]+)/)
        if (match) token = match[1]
      }
    }

    if (!token) {
      return c.json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '未登录'
        }
      }, 401)
    }

    const payload = verifyToken(token)

    if (!payload) {
      return c.json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '令牌无效'
        }
      }, 401)
    }

    // 获取用户信息
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1)

    if (user.length === 0) {
      return c.json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: '用户不存在'
        }
      }, 404)
    }

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user[0]

    return c.json({
      success: true,
      data: userWithoutPassword
    })
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return c.json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '获取用户信息失败'
      }
    }, 500)
  }
})

// ============================================================
// Google OAuth 登录/注册
// ============================================================

/**
 * POST /api/auth/google
 * 用 Google access_token 登录或注册
 */
app.post('/google', async (c) => {
  try {
    const { accessToken, grade } = await c.req.json()

    if (!accessToken) {
      return c.json({
        success: false,
        error: { code: 'MISSING_TOKEN', message: '缺少 Google access token' }
      }, 400)
    }

    // 用 Google userinfo API 验证 token 并获取用户信息
    const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    if (!googleRes.ok) {
      return c.json({
        success: false,
        error: { code: 'INVALID_GOOGLE_TOKEN', message: 'Google 授权验证失败' }
      }, 401)
    }

    const googleUser = await googleRes.json()
    const { email, name, picture, sub: googleId } = googleUser

    if (!email) {
      return c.json({
        success: false,
        error: { code: 'NO_EMAIL', message: 'Google 账号未返回邮箱' }
      }, 400)
    }

    // 查找是否已有账号（先按 google_id，再按 email）
    let existingUser = await db.select().from(users).where(eq(users.googleId, googleId)).limit(1)

    if (existingUser.length === 0) {
      existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)
    }

    let user

    if (existingUser.length > 0) {
      // 已有账号：更新 google_id 和头像（如果之前没绑定）
      const updates = { lastLoginAt: new Date() }
      if (!existingUser[0].googleId) updates.googleId = googleId
      if (!existingUser[0].avatar && picture) updates.avatar = picture

      await db.update(users).set(updates).where(eq(users.id, existingUser[0].id))
      user = { ...existingUser[0], ...updates }
    } else {
      // 新用户：创建账号
      const newUser = await db.insert(users).values({
        email,
        nickname: name || email.split('@')[0],
        avatar: picture || null,
        googleId,
        password: null,
        grade: grade || 'AS',
      }).returning()

      user = newUser[0]

      // 创建用户画像和统计
      await db.insert(userProfiles).values({ userId: user.id, selectedSubjects: [], notificationEnabled: true })
      await db.insert(userStats).values({ userId: user.id })
    }

    // 生成 JWT
    const token = generateToken({ userId: user.id, email: user.email })
    const refreshToken = generateRefreshToken({ userId: user.id })

    const isProduction = process.env.NODE_ENV === 'production'
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    }

    c.header('Set-Cookie', `auth_token=${token}; ${Object.entries(cookieOptions).map(([k, v]) => `${k}=${v}`).join('; ')}`)
    c.header('Set-Cookie', `refresh_token=${refreshToken}; ${Object.entries(cookieOptions).map(([k, v]) => `${k}=${v}`).join('; ')}`, { append: true })

    const { password: _, ...userWithoutPassword } = user

    return c.json({
      success: true,
      data: { user: userWithoutPassword }
    })
  } catch (error) {
    console.error('Google 登录失败:', error)
    return c.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Google 登录失败，请稍后重试' }
    }, 500)
  }
})

// ============================================================
// 登出
// ============================================================

/**
 * POST /api/auth/logout
 * 用户登出（清除 Cookie）
 */
app.post('/logout', async (c) => {
  try {
    // 清除 Cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 0, // 立即过期
      path: '/'
    }

    c.header('Set-Cookie', `auth_token=; ${Object.entries(cookieOptions).map(([k, v]) => `${k}=${v}`).join('; ')}`)
    c.header('Set-Cookie', `refresh_token=; ${Object.entries(cookieOptions).map(([k, v]) => `${k}=${v}`).join('; ')}`, { append: true })

    return c.json({
      success: true,
      data: {
        message: '登出成功'
      }
    })
  } catch (error) {
    console.error('登出失败:', error)
    return c.json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '登出失败'
      }
    }, 500)
  }
})

export default app
