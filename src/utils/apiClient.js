/**
 * 统一的 API 客户端工具
 * 自动添加认证 Token、CSRF Token、错误处理、重试逻辑、Toast 通知
 */

import Toast from '../components/common/Toast'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// CSRF Token 缓存
let csrfToken = null

/**
 * 获取 CSRF Token
 */
async function fetchCsrfToken() {
  try {
    const response = await fetch(`${API_BASE}/api/csrf-token`, {
      credentials: 'include' // 发送 Cookie
    })

    if (response.ok) {
      const data = await response.json()
      csrfToken = data.data.csrfToken
      return csrfToken
    }
  } catch (error) {
    console.warn('Failed to fetch CSRF token:', error)
  }
  return null
}

/**
 * API 错误类
 */
class ApiError extends Error {
  constructor(message, code, statusCode, details = null) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
  }
}

/**
 * 网络错误类
 */
class NetworkError extends Error {
  constructor(message = '网络连接失败') {
    super(message)
    this.name = 'NetworkError'
  }
}

/**
 * 延迟函数
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 默认配置
 */
const defaultConfig = {
  retry: 2, // 重试次数
  retryDelay: 1000, // 重试延迟（毫秒）
  timeout: 30000, // 超时时间（毫秒）
  showErrorToast: true, // 是否显示错误 Toast
  showSuccessToast: false // 是否显示成功 Toast
}

/**
 * 处理 API 响应
 */
async function handleResponse(response) {
  const contentType = response.headers.get('content-type')
  const isJson = contentType && contentType.includes('application/json')

  if (!isJson) {
    throw new ApiError(
      '服务器返回了非 JSON 格式的响应',
      'INVALID_RESPONSE',
      response.status
    )
  }

  const data = await response.json()

  // 处理 401 未授权错误
  if (response.status === 401) {
    // 清除用户信息（Token 在 httpOnly Cookie 中，会自动失效）
    sessionStorage.removeItem('auth_user')
    const currentPath = window.location.pathname
    if (currentPath !== '/login' && currentPath !== '/register') {
      localStorage.setItem('redirect_after_login', currentPath)
      window.location.href = '/login'
    }
    throw new ApiError('认证已过期，请重新登录', 'UNAUTHORIZED', 401)
  }

  if (!response.ok) {
    throw new ApiError(
      data.error?.message || '请求失败',
      data.error?.code || 'UNKNOWN_ERROR',
      response.status,
      data.error?.details
    )
  }

  if (data.success === false) {
    throw new ApiError(
      data.error?.message || '操作失败',
      data.error?.code || 'OPERATION_FAILED',
      response.status,
      data.error?.details
    )
  }

  return data.data !== undefined ? data.data : data
}

/**
 * 执行请求（带重试和超时）
 */
async function executeRequest(url, options, config) {
  const { retry, retryDelay, timeout } = { ...defaultConfig, ...config }
  let lastError = null

  for (let attempt = 0; attempt <= retry; attempt++) {
    try {
      // 创建超时控制器
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      // 发送请求（包含 Cookie）
      const response = await fetch(url, {
        ...options,
        credentials: 'include', // 发送和接收 Cookie
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      // 处理响应
      return await handleResponse(response)

    } catch (error) {
      lastError = error

      // 如果是中止错误，转换为超时错误
      if (error.name === 'AbortError') {
        lastError = new NetworkError('请求超时，请检查网络连接')
      }

      // 如果是网络错误且还有重试次数，则重试
      if (
        (error instanceof NetworkError || error.name === 'TypeError' || error.message.includes('fetch')) &&
        attempt < retry
      ) {
        console.warn(`请求失败，${retryDelay * (attempt + 1)}ms 后重试 (${attempt + 1}/${retry})...`)
        await delay(retryDelay * (attempt + 1)) // 指数退避
        continue
      }

      // 如果是 API 错误或重试次数用尽，则抛出错误
      break
    }
  }

  throw lastError
}

/**
 * 构建请求头
 */
async function buildHeaders(customHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders
  }

  // Token 现在存储在 httpOnly Cookie 中，浏览器会自动发送
  // 不再需要从 localStorage 读取

  // 添加 CSRF Token（如果有）
  if (!csrfToken) {
    await fetchCsrfToken()
  }
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken
  }

  return headers
}

/**
 * GET 请求
 */
export async function get(endpoint, config = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`
  const options = {
    method: 'GET',
    headers: await buildHeaders(config.headers)
  }

  try {
    const data = await executeRequest(url, options, config)
    if (config.showSuccessToast) {
      Toast.success(config.successMessage || '获取成功')
    }
    return data
  } catch (error) {
    if (config.showErrorToast !== false) {
      Toast.error(error.message)
    }
    throw error
  }
}

/**
 * POST 请求
 */
export async function post(endpoint, body = {}, config = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`
  const options = {
    method: 'POST',
    headers: await buildHeaders(config.headers),
    body: JSON.stringify(body)
  }

  try {
    const data = await executeRequest(url, options, config)
    if (config.showSuccessToast) {
      Toast.success(config.successMessage || '操作成功')
    }
    return data
  } catch (error) {
    // 如果是 CSRF Token 错误，清除缓存并重试一次
    if (error.code === 'CSRF_TOKEN_INVALID' || error.code === 'CSRF_TOKEN_MISSING') {
      csrfToken = null
      await fetchCsrfToken()

      // 重试一次
      try {
        options.headers = await buildHeaders(config.headers)
        const data = await executeRequest(url, options, { ...config, retry: 0 })
        if (config.showSuccessToast) {
          Toast.success(config.successMessage || '操作成功')
        }
        return data
      } catch (retryError) {
        if (config.showErrorToast !== false) {
          Toast.error(retryError.message)
        }
        throw retryError
      }
    }

    if (config.showErrorToast !== false) {
      Toast.error(error.message)
    }
    throw error
  }
}

/**
 * PUT 请求
 */
export async function put(endpoint, body = {}, config = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`
  const options = {
    method: 'PUT',
    headers: await buildHeaders(config.headers),
    body: JSON.stringify(body)
  }

  try {
    const data = await executeRequest(url, options, config)
    if (config.showSuccessToast) {
      Toast.success(config.successMessage || '更新成功')
    }
    return data
  } catch (error) {
    // CSRF Token 错误处理
    if (error.code === 'CSRF_TOKEN_INVALID' || error.code === 'CSRF_TOKEN_MISSING') {
      csrfToken = null
      await fetchCsrfToken()

      try {
        options.headers = await buildHeaders(config.headers)
        const data = await executeRequest(url, options, { ...config, retry: 0 })
        if (config.showSuccessToast) {
          Toast.success(config.successMessage || '更新成功')
        }
        return data
      } catch (retryError) {
        if (config.showErrorToast !== false) {
          Toast.error(retryError.message)
        }
        throw retryError
      }
    }

    if (config.showErrorToast !== false) {
      Toast.error(error.message)
    }
    throw error
  }
}

/**
 * DELETE 请求
 */
export async function del(endpoint, config = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`
  const options = {
    method: 'DELETE',
    headers: await buildHeaders(config.headers)
  }

  try {
    const data = await executeRequest(url, options, config)
    if (config.showSuccessToast) {
      Toast.success(config.successMessage || '删除成功')
    }
    return data
  } catch (error) {
    // CSRF Token 错误处理
    if (error.code === 'CSRF_TOKEN_INVALID' || error.code === 'CSRF_TOKEN_MISSING') {
      csrfToken = null
      await fetchCsrfToken()

      try {
        options.headers = await buildHeaders(config.headers)
        const data = await executeRequest(url, options, { ...config, retry: 0 })
        if (config.showSuccessToast) {
          Toast.success(config.successMessage || '删除成功')
        }
        return data
      } catch (retryError) {
        if (config.showErrorToast !== false) {
          Toast.error(retryError.message)
        }
        throw retryError
      }
    }

    if (config.showErrorToast !== false) {
      Toast.error(error.message)
    }
    throw error
  }
}

/**
 * 带认证的 fetch 请求（向后兼容）
 */
export async function fetchWithAuth(url, options = {}) {
  const headers = await buildHeaders(options.headers)
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // 发送 Cookie
    headers
  })
  return response
}

/**
 * 检查用户是否已登录
 */
export function isAuthenticated() {
  // Token 存储在 httpOnly Cookie 中，前端无法直接检查
  // 通过检查 sessionStorage 中的用户信息来判断
  return !!sessionStorage.getItem('auth_user')
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser() {
  const userStr = sessionStorage.getItem('auth_user')
  return userStr ? JSON.parse(userStr) : null
}

/**
 * 登出
 */
export async function logout() {
  // 调用后端登出 API 清除 Cookie
  try {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    })
  } catch (error) {
    console.error('登出请求失败:', error)
  }

  sessionStorage.removeItem('auth_user')
  window.location.href = '/login'
}

export { ApiError, NetworkError }

export default {
  get,
  post,
  put,
  del,
  fetchWithAuth,
  isAuthenticated,
  getCurrentUser,
  logout,
  ApiError,
  NetworkError
}
