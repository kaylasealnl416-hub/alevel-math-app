/**
 * 统一的 API 客户端工具
 * 自动添加认证 Token 和处理常见错误
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

/**
 * 带认证的 fetch 请求
 * @param {string} url - API 端点 URL
 * @param {object} options - fetch 选项
 * @returns {Promise<Response>}
 */
export async function fetchWithAuth(url, options = {}) {
  // 获取存储的 Token
  const token = localStorage.getItem('auth_token')

  // 构建请求头
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  // 如果有 Token，添加 Authorization 头
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // 发送请求
  const response = await fetch(url, {
    ...options,
    headers
  })

  // 处理 401 未授权错误
  if (response.status === 401) {
    // Token 过期或无效，清除并跳转登录
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')

    // 保存当前路径，登录后返回
    const currentPath = window.location.pathname
    localStorage.setItem('redirect_after_login', currentPath)

    // 跳转到登录页
    window.location.href = '/login'

    throw new Error('认证已过期，请重新登录')
  }

  return response
}

/**
 * GET 请求
 */
export async function get(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`
  const response = await fetchWithAuth(url, {
    ...options,
    method: 'GET'
  })
  return response.json()
}

/**
 * POST 请求
 */
export async function post(endpoint, data, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`
  const response = await fetchWithAuth(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data)
  })
  return response.json()
}

/**
 * PUT 请求
 */
export async function put(endpoint, data, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`
  const response = await fetchWithAuth(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data)
  })
  return response.json()
}

/**
 * DELETE 请求
 */
export async function del(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`
  const response = await fetchWithAuth(url, {
    ...options,
    method: 'DELETE'
  })
  return response.json()
}

/**
 * 检查用户是否已登录
 */
export function isAuthenticated() {
  return !!localStorage.getItem('auth_token')
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

/**
 * 登出
 */
export function logout() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

export default {
  fetchWithAuth,
  get,
  post,
  put,
  del,
  isAuthenticated,
  getCurrentUser,
  logout
}
