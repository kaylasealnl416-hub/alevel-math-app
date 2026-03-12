// ============================================================
// 认证路由
// 处理用户注册、登录、Token 刷新
// ============================================================

import { Hono } from 'hono'
import { db } from '../db/index.js'
import { users, userProfiles, userStats } from '../db/schema.js'
import { eq } from 'drizzle-orm'
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
    const newUser = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        nickname,
        grade: grade || 'AS'
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
    const authHeader = c.req.header('Authorization')

    if (!authHeader) {
      return c.json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '未登录'
        }
      }, 401)
    }

    const token = authHeader.replace('Bearer ', '')
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
