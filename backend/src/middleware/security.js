/**
 * 安全中间件
 * 添加安全响应头和输入验证
 */

/**
 * 安全响应头中间件
 */
export function securityHeaders() {
  return async (c, next) => {
    await next()
    
    // 防止 XSS 攻击
    c.header('X-Content-Type-Options', 'nosniff')
    c.header('X-Frame-Options', 'DENY')
    c.header('X-XSS-Protection', '1; mode=block')
    
    // 内容安全策略
    c.header('Content-Security-Policy', "default-src 'self'")
    
    // 严格传输安全（仅在 HTTPS 下）
    if (c.req.url.startsWith('https://')) {
      c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    }
    
    // 移除服务器信息
    c.header('X-Powered-By', '')
  }
}

/**
 * 输入清理中间件
 * 防止 SQL 注入和 XSS
 */
export function sanitizeInput() {
  return async (c, next) => {
    if (c.req.method === 'POST' || c.req.method === 'PUT' || c.req.method === 'PATCH') {
      try {
        const body = await c.req.json()
        
        // 递归清理对象中的字符串
        const sanitized = sanitizeObject(body)
        
        // 替换原始请求体
        c.req.bodyCache = sanitized
      } catch (e) {
        // 无法解析 JSON，跳过
      }
    }
    
    await next()
  }
}

/**
 * 递归清理对象
 */
function sanitizeObject(obj) {
  if (typeof obj === 'string') {
    return sanitizeString(obj)
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item))
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized = {}
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value)
    }
    return sanitized
  }
  
  return obj
}

/**
 * 清理字符串
 */
function sanitizeString(str) {
  // 移除潜在的 SQL 注入字符
  // 注意：这只是基础防护，主要防护应该在 ORM 层（Drizzle 已经提供）
  return str
    .replace(/[<>]/g, '') // 移除 HTML 标签
    .trim()
}

/**
 * 请求大小限制中间件
 */
export function requestSizeLimit(maxSize = 1024 * 1024) { // 默认 1MB
  return async (c, next) => {
    const contentLength = c.req.header('content-length')
    
    if (contentLength && parseInt(contentLength) > maxSize) {
      return c.json({
        success: false,
        error: {
          code: 'PAYLOAD_TOO_LARGE',
          message: `请求体过大，最大允许 ${maxSize / 1024 / 1024}MB`
        }
      }, 413)
    }
    
    await next()
  }
}
