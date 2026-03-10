/**
 * 性能监控中间件
 * 记录请求响应时间和慢查询
 */

const SLOW_REQUEST_THRESHOLD = 1000 // 1秒

/**
 * 性能监控中间件
 */
export function performanceMonitor() {
  return async (c, next) => {
    const start = Date.now()
    const method = c.req.method
    const path = c.req.path
    
    await next()
    
    const duration = Date.now() - start
    const status = c.res.status
    
    // 添加响应时间头
    c.header('X-Response-Time', `${duration}ms`)
    
    // 记录慢请求
    if (duration > SLOW_REQUEST_THRESHOLD) {
      console.warn(`⚠️  慢请求: ${method} ${path} - ${duration}ms (${status})`)
    }
    
    // 记录所有请求（可选，用于分析）
    if (process.env.NODE_ENV === 'development') {
      console.log(`${method} ${path} - ${duration}ms (${status})`)
    }
  }
}

/**
 * 数据库查询性能监控
 */
export class QueryPerformanceMonitor {
  constructor() {
    this.queries = []
    this.slowQueries = []
  }
  
  recordQuery(query, duration) {
    const record = {
      query,
      duration,
      timestamp: new Date()
    }
    
    this.queries.push(record)
    
    // 记录慢查询（超过 100ms）
    if (duration > 100) {
      this.slowQueries.push(record)
      console.warn(`⚠️  慢查询: ${query.substring(0, 100)}... - ${duration}ms`)
    }
    
    // 只保留最近 1000 条记录
    if (this.queries.length > 1000) {
      this.queries.shift()
    }
    
    if (this.slowQueries.length > 100) {
      this.slowQueries.shift()
    }
  }
  
  getStats() {
    const totalQueries = this.queries.length
    const avgDuration = totalQueries > 0
      ? this.queries.reduce((sum, q) => sum + q.duration, 0) / totalQueries
      : 0
    
    return {
      totalQueries,
      avgDuration: Math.round(avgDuration),
      slowQueries: this.slowQueries.length,
      recentSlowQueries: this.slowQueries.slice(-10)
    }
  }
}

export const queryMonitor = new QueryPerformanceMonitor()
