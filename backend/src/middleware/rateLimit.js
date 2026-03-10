/**
 * 速率限制中间件
 * 防止 API 滥用和 DoS 攻击
 */

// 简单的内存存储（生产环境建议使用 Redis）
const requestCounts = new Map()

/**
 * 清理过期的计数器
 */
function cleanupExpiredCounters() {
  const now = Date.now()
  for (const [key, data] of requestCounts.entries()) {
    if (now > data.resetTime) {
      requestCounts.delete(key)
    }
  }
}

// 每分钟清理一次过期计数器
setInterval(cleanupExpiredCounters, 60000)

/**
 * 速率限制中间件工厂函数
 * @param {Object} options - 配置选项
 * @param {number} options.maxRequests - 时间窗口内最大请求数
 * @param {number} options.windowMs - 时间窗口（毫秒）
 * @param {string} options.message - 超限时的错误消息
 */
export function rateLimit(options = {}) {
  const {
    maxRequests = 100,
    windowMs = 60000, // 默认 1 分钟
    message = '请求过于频繁，请稍后再试'
  } = options

  return async (c, next) => {
    // 获取客户端标识（优先使用用户 ID，其次使用 IP）
    const userId = c.get('userId')
    const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown'
    const identifier = userId ? `user:${userId}` : `ip:${ip}`

    const now = Date.now()
    const key = `${identifier}:${c.req.path}`

    // 获取或创建计数器
    let counter = requestCounts.get(key)

    if (!counter || now > counter.resetTime) {
      // 创建新的计数器
      counter = {
        count: 0,
        resetTime: now + windowMs
      }
      requestCounts.set(key, counter)
    }

    // 增加计数
    counter.count++

    // 检查是否超限
    if (counter.count > maxRequests) {
      const retryAfter = Math.ceil((counter.resetTime - now) / 1000)

      return c.json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message,
          retryAfter
        }
      }, 429)
    }

    // 添加速率限制头
    c.header('X-RateLimit-Limit', maxRequests.toString())
    c.header('X-RateLimit-Remaining', (maxRequests - counter.count).toString())
    c.header('X-RateLimit-Reset', new Date(counter.resetTime).toISOString())

    await next()
  }
}

/**
 * 预设的速率限制配置
 */
export const rateLimitPresets = {
  // 严格限制（AI 相关端点）
  strict: {
    maxRequests: 5,
    windowMs: 60000, // 1 分钟 5 次
    message: 'AI 调用次数已达上限，请稍后再试'
  },

  // 中等限制（考试提交等重要操作）
  moderate: {
    maxRequests: 20,
    windowMs: 60000, // 1 分钟 20 次
    message: '操作过于频繁，请稍后再试'
  },

  // 宽松限制（一般查询）
  relaxed: {
    maxRequests: 100,
    windowMs: 60000, // 1 分钟 100 次
    message: '请求过于频繁，请稍后再试'
  }
}

export default rateLimit
