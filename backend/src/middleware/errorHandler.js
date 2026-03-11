/**
 * 全局错误处理中间件
 * 统一错误响应格式，记录错误日志
 */

const isDev = process.env.NODE_ENV === 'development'

/**
 * 错误日志记录
 */
function logError(error, context = {}) {
  const timestamp = new Date().toISOString()
  const { method, path, userId, ip } = context

  // 构建日志信息
  const logInfo = {
    timestamp,
    level: 'ERROR',
    message: error.message,
    code: error.code || 'UNKNOWN_ERROR',
    statusCode: error.statusCode || 500,
    method,
    path,
    userId,
    ip
  }

  // 开发环境显示完整堆栈
  if (isDev) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.error('❌ ERROR:', error.message)
    console.error('📍 Path:', `${method} ${path}`)
    console.error('🔢 Status:', error.statusCode || 500)
    console.error('🏷️  Code:', error.code || 'UNKNOWN_ERROR')
    if (userId) console.error('👤 User:', userId)
    if (ip) console.error('🌐 IP:', ip)
    console.error('📚 Stack:', error.stack)
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  } else {
    // 生产环境只记录关键信息
    console.error(JSON.stringify(logInfo))
  }
}

/**
 * 全局错误处理中间件
 */
export function errorHandler() {
  return async (c, next) => {
    try {
      await next()
    } catch (error) {
      // 收集上下文信息
      const context = {
        method: c.req.method,
        path: c.req.path,
        userId: c.get('userId'),
        ip: c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown'
      }

      // 记录错误日志
      logError(error, context)

      // 确定状态码
      const statusCode = error.statusCode || 500

      // 构建错误响应
      const response = {
        success: false,
        error: {
          code: error.code || 'INTERNAL_ERROR',
          message: error.message || '服务器内部错误'
        }
      }

      // 添加详细信息（仅开发环境）
      if (isDev) {
        response.error.details = error.details || error.stack
        response.error.path = c.req.path
        response.error.timestamp = new Date().toISOString()
      }

      // 特殊错误类型处理
      if (error.name === 'ZodError') {
        response.error.code = 'VALIDATION_ERROR'
        response.error.message = '输入验证失败'
        response.error.details = error.issues || error.errors
      }

      return c.json(response, statusCode)
    }
  }
}

/**
 * 404 处理中间件
 */
export function notFoundHandler() {
  return (c) => {
    return c.json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `路由不存在: ${c.req.method} ${c.req.path}`
      }
    }, 404)
  }
}

/**
 * 自定义错误类
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'APP_ERROR', details = null) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * 常见错误类型
 */
export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, 'VALIDATION_ERROR', details)
  }
}

export class NotFoundError extends AppError {
  constructor(resource = '资源') {
    super(`${resource}不存在`, 404, 'NOT_FOUND')
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = '未授权访问') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends AppError {
  constructor(message = '无权访问此资源') {
    super(message, 403, 'FORBIDDEN')
  }
}

export class ConflictError extends AppError {
  constructor(message = '资源冲突') {
    super(message, 409, 'CONFLICT')
  }
}

export class DatabaseError extends AppError {
  constructor(message = '数据库操作失败') {
    super(message, 500, 'DATABASE_ERROR')
  }
}

export class ExternalServiceError extends AppError {
  constructor(service = '外部服务', message = '调用失败') {
    super(`${service}${message}`, 503, 'EXTERNAL_SERVICE_ERROR')
  }
}

export default {
  errorHandler,
  notFoundHandler,
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  DatabaseError,
  ExternalServiceError
}
