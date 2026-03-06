// ============================================================
// JWT Token 工具函数
// ============================================================

import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key'
const JWT_EXPIRES_IN = '7d' // Access Token 有效期
const REFRESH_TOKEN_EXPIRES_IN = '30d' // Refresh Token 有效期

/**
 * 生成 Access Token
 * @param {Object} payload - Token载荷（用户信息）
 * @returns {string} JWT Token
 */
export function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

/**
 * 生成 Refresh Token
 * @returns {string} 随机字符串
 */
export function generateRefreshToken() {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * 验证 Access Token
 * @param {string} token - JWT Token
 * @returns {Object|null} 解码后的载荷，验证失败返回null
 */
export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    console.error('Token验证失败:', error.message)
    return null
  }
}

/**
 * 解码 Token（不验证）
 * @param {string} token - JWT Token
 * @returns {Object|null} 解码后的载荷
 */
export function decodeToken(token) {
  try {
    return jwt.decode(token)
  } catch (error) {
    return null
  }
}

/**
 * 从请求头中提取 Token
 * @param {Object} c - Hono Context
 * @returns {string|null} Token字符串
 */
export function extractToken(c) {
  const authHeader = c.req.header('Authorization')
  if (!authHeader) return null

  // 支持 "Bearer <token>" 格式
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  return authHeader
}

/**
 * 计算Token过期时间
 * @param {string} expiresIn - 过期时间字符串（如 "7d"）
 * @returns {Date} 过期时间
 */
export function calculateExpiresAt(expiresIn) {
  const match = expiresIn.match(/^(\d+)([dhms])$/)
  if (!match) {
    throw new Error('Invalid expiresIn format')
  }

  const value = parseInt(match[1])
  const unit = match[2]

  const now = new Date()
  switch (unit) {
    case 'd':
      return new Date(now.getTime() + value * 24 * 60 * 60 * 1000)
    case 'h':
      return new Date(now.getTime() + value * 60 * 60 * 1000)
    case 'm':
      return new Date(now.getTime() + value * 60 * 1000)
    case 's':
      return new Date(now.getTime() + value * 1000)
    default:
      throw new Error('Invalid time unit')
  }
}

export { JWT_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN }
