import jwt from 'jsonwebtoken'

// 从环境变量获取 JWT 密钥，如果未设置则抛出错误
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET 环境变量未配置！请在 .env 文件中设置。')
}

/**
 * 生成 JWT Token
 * @param {Object} payload - Token 载荷（通常包含 userId）
 * @param {string} expiresIn - 过期时间（默认 7 天）
 * @returns {string} JWT Token
 */
export function generateToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn,
    issuer: 'alevel-math-app'
  })
}

/**
 * 验证 JWT Token
 * @param {string} token - JWT Token
 * @returns {Object|null} 解码后的载荷，验证失败返回 null
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'alevel-math-app'
    })
  } catch (error) {
    // 生产环境不输出详细错误
    if (process.env.NODE_ENV !== 'production') {
      console.error('Token 验证失败:', error.message)
    }
    return null
  }
}

/**
 * 生成刷新 Token
 * @param {Object} payload - Token 载荷
 * @returns {string} 刷新 Token（30 天有效期）
 */
export function generateRefreshToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '30d',
    issuer: 'alevel-math-app'
  })
}
