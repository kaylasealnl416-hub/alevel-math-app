/**
 * CSRF 保护中间件
 * 防止跨站请求伪造攻击
 */

import { randomBytes } from 'crypto'

// 存储 CSRF Token（生产环境应使用 Redis）
// 警告：服务重启后所有 token 失效，用户会遇到 403 直到重新请求 token
if (process.env.NODE_ENV === 'production') {
  console.warn('[CSRF] 使用内存存储 token，服务重启后所有用户需重新获取 CSRF token')
}
const csrfTokens = new Map()

// Token 过期时间（1小时）
const TOKEN_EXPIRY = 60 * 60 * 1000

/**
 * 生成 CSRF Token
 */
export function generateCsrfToken(userId) {
  const token = randomBytes(32).toString('hex')
  const expiry = Date.now() + TOKEN_EXPIRY

  csrfTokens.set(userId, { token, expiry })

  // 清理过期 Token
  cleanupExpiredTokens()

  return token
}

/**
 * 验证 CSRF Token
 */
export function verifyCsrfToken(userId, token) {
  const stored = csrfTokens.get(userId)

  if (!stored) {
    return false
  }

  // 检查是否过期
  if (Date.now() > stored.expiry) {
    csrfTokens.delete(userId)
    return false
  }

  // 验证 Token
  return stored.token === token
}

/**
 * 清理过期的 Token
 */
function cleanupExpiredTokens() {
  const now = Date.now()
  for (const [userId, data] of csrfTokens.entries()) {
    if (now > data.expiry) {
      csrfTokens.delete(userId)
    }
  }
}

/**
 * CSRF 保护中间件
 * 对所有修改操作（POST, PUT, DELETE, PATCH）进行 CSRF 验证
 */
export function csrfProtection() {
  return async (c, next) => {
    const method = c.req.method

    // 只对修改操作进行 CSRF 验证
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      const userId = c.get('userId')

      // 如果没有用户 ID（未认证），跳过 CSRF 验证
      // 因为未认证的请求会被 authMiddleware 拦截
      if (!userId) {
        await next()
        return
      }

      // 获取 CSRF Token（从请求头或请求体）
      const csrfToken = c.req.header('X-CSRF-Token') ||
                        c.req.header('x-csrf-token')

      if (!csrfToken) {
        return c.json({
          success: false,
          error: {
            code: 'CSRF_TOKEN_MISSING',
            message: '缺少 CSRF Token'
          }
        }, 403)
      }

      // 验证 Token
      if (!verifyCsrfToken(userId, csrfToken)) {
        return c.json({
          success: false,
          error: {
            code: 'CSRF_TOKEN_INVALID',
            message: 'CSRF Token 无效或已过期'
          }
        }, 403)
      }
    }

    await next()
  }
}

/**
 * 获取 CSRF Token 的端点中间件
 * 用于前端获取 CSRF Token
 */
export function getCsrfToken() {
  return async (c) => {
    const userId = c.get('userId')

    if (!userId) {
      return c.json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '未登录'
        }
      }, 401)
    }

    const token = generateCsrfToken(userId)

    return c.json({
      success: true,
      data: {
        csrfToken: token
      }
    })
  }
}

/**
 * 定期清理过期 Token（每小时执行一次）
 */
setInterval(cleanupExpiredTokens, 60 * 60 * 1000)

export default {
  generateCsrfToken,
  verifyCsrfToken,
  csrfProtection,
  getCsrfToken
}
