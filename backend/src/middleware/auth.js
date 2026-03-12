// ============================================================
// 认证中间件
// 用于保护需要认证的 API 端点
// ============================================================

import { verifyToken } from '../utils/jwt.js'

/**
 * JWT 认证中间件
 * 验证请求头中的 Authorization Token 或 Cookie 中的 Token
 */
export async function authMiddleware(c, next) {
  // 方式 1: 从 Authorization 头获取（向后兼容）
  const authHeader = c.req.header('Authorization')
  let token = null

  if (authHeader) {
    token = authHeader.replace('Bearer ', '')
  }

  // 方式 2: 从 Cookie 获取（推荐方式）
  if (!token) {
    const cookies = c.req.header('Cookie')
    if (cookies) {
      const cookieMatch = cookies.match(/auth_token=([^;]+)/)
      if (cookieMatch) {
        token = cookieMatch[1]
      }
    }
  }

  if (!token) {
    return c.json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: '缺少认证令牌'
      }
    }, 401)
  }

  // 验证 Token
  const payload = verifyToken(token)

  if (!payload) {
    return c.json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: '认证令牌无效或已过期'
      }
    }, 401)
  }

  // 将用户信息存储到上下文中
  c.set('userId', payload.userId)
  c.set('user', payload)

  await next()
}

/**
 * 可选认证中间件
 * 如果有 Token 则验证，没有则继续
 */
export async function optionalAuthMiddleware(c, next) {
  const authHeader = c.req.header('Authorization')

  if (authHeader) {
    const token = authHeader.replace('Bearer ', '')
    const payload = verifyToken(token)

    if (payload) {
      c.set('userId', payload.userId)
      c.set('user', payload)
    }
  }

  await next()
}

/**
 * 权限检查中间件
 * 确保用户只能访问自己的资源
 */
export function checkOwnership(resourceIdParam = 'id') {
  return async (c, next) => {
    const currentUserId = c.get('userId')
    const resourceUserId = parseInt(c.req.param(resourceIdParam))

    if (currentUserId !== resourceUserId) {
      return c.json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: '无权访问此资源'
        }
      }, 403)
    }

    await next()
  }
}
