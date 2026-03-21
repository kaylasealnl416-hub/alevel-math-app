/**
 * 简单的内存缓存中间件
 * 用于缓存 GET 请求的响应
 */

const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 分钟

export function cacheMiddleware(options = {}) {
  const ttl = options.ttl || CACHE_TTL
  const keyPrefix = options.keyPrefix || ''

  return async (c, next) => {
    // 只缓存 GET 请求
    if (c.req.method !== 'GET') {
      return next()
    }

    // 注意：cache key 不含用户身份，仅适用于公开数据（subjects/chapters）。
    // 若将来对含用户数据的端点启用缓存，需将 c.get('userId') 加入 key。
    const cacheKey = keyPrefix + c.req.url
    const cached = cache.get(cacheKey)

    // 检查缓存是否存在且未过期
    if (cached && Date.now() - cached.timestamp < ttl) {
      c.header('X-Cache', 'HIT')
      return c.json(cached.data)
    }

    // 执行请求
    await next()

    // 缓存成功的响应
    const response = c.res
    if (response.status === 200) {
      try {
        const data = await response.clone().json()
        cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        })
        c.header('X-Cache', 'MISS')
      } catch (e) {
        // 无法解析 JSON，不缓存
      }
    }
  }
}

/**
 * 清除缓存
 */
export function clearCache(pattern) {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key)
      }
    }
  } else {
    cache.clear()
  }
}

/**
 * 定期清理过期缓存
 */
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      cache.delete(key)
    }
  }
}, 60 * 1000) // 每分钟清理一次
