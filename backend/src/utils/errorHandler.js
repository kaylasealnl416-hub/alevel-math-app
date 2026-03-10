/**
 * 统一错误处理工具
 * 防止敏感信息泄露
 */

const isDev = process.env.NODE_ENV === 'development'

/**
 * 处理错误并返回安全的错误响应
 * @param {Error} error - 错误对象
 * @param {string} context - 错误上下文描述
 * @returns {Object} 标准化的错误响应对象
 */
export function handleError(error, context = '操作失败') {
  // 记录完整错误到控制台（仅开发环境显示堆栈）
  if (isDev) {
    console.error(`❌ ${context}:`, error)
  } else {
    console.error(`❌ ${context}:`, error.message)
  }

  // 构建安全的错误响应
  const response = {
    success: false,
    error: {
      message: error.message || context,
      code: error.code || 'INTERNAL_ERROR'
    }
  }

  // 仅在开发环境返回详细信息
  if (isDev && error.stack) {
    response.error.details = error.stack
  }

  return response
}

/**
 * 包装异步路由处理器，自动捕获错误
 * @param {Function} handler - 路由处理函数
 * @param {string} context - 错误上下文
 */
export function asyncHandler(handler, context) {
  return async (c) => {
    try {
      return await handler(c)
    } catch (error) {
      const errorResponse = handleError(error, context)
      const statusCode = error.statusCode || 500
      return c.json(errorResponse, statusCode)
    }
  }
}

/**
 * 创建自定义错误类
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'APP_ERROR') {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * 常见错误类型
 */
export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, 'VALIDATION_ERROR')
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

export default {
  handleError,
  asyncHandler,
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError
}
