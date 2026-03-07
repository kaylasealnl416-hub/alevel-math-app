// ============================================================
// 认证中间件
// 用于保护需要认证的 API 端点
// ============================================================

import { verifyToken } from '../utils/jwt.js'

/**
 * JWT 认证中间件
 * 验证请求头中的 Authorization Token
 */
export async function authMiddleware(c, next) {
  // 获取 Authorization 头
  const authHeader = c.req.header('Authorization')

  if (!authHeader) {
    return c.json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: '缺少认证令牌'
      }
    }, 401)
  }

  // 提取 Bearer Token
  const token = authHeader.replace('Bearer ', '')

  if (!token) {
    return c.json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: '无效的认证令牌格式'
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
