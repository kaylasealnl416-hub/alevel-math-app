/**
 * Unified API client
 * Handles auth tokens, CSRF tokens, error handling, retry logic, and toast notifications
 */

import Toast from '../components/common/Toast'
import { API_BASE } from './constants'

// In-memory CSRF token cache
let csrfToken = null

// Restore from sessionStorage so the token survives page refreshes
function getCsrfToken() {
  if (csrfToken) return csrfToken

  const stored = sessionStorage.getItem('csrf_token')
  if (stored) {
    csrfToken = stored
    return csrfToken
  }
  return null
}

function setCsrfToken(token) {
  csrfToken = token
  if (token) {
    sessionStorage.setItem('csrf_token', token)
  } else {
    sessionStorage.removeItem('csrf_token')
  }
}

/**
 * Fetch a fresh CSRF token from the server
 */
async function fetchCsrfToken() {
  try {
    const response = await fetch(`${API_BASE}/api/csrf-token`, {
      credentials: 'include'
    })

    if (response.ok) {
      const data = await response.json()
      const token = data.data.csrfToken
      setCsrfToken(token)
      return token
    }
  } catch (error) {
    console.warn('Failed to fetch CSRF token:', error)
  }
  return null
}

/**
 * API error (non-2xx response from the server)
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
 * Network-level error (no response received)
 */
class NetworkError extends Error {
  constructor(message = 'Network connection failed') {
    super(message)
    this.name = 'NetworkError'
  }
}

/**
 * Promise-based delay
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Clear the cached CSRF token, fetch a fresh one, then retry the request once.
 * @param {Function} retryFn - function to call on retry
 * @param {Object} config - request config
 * @param {Object} options - fetch options
 * @returns {Promise<any>}
 */
async function handleCsrfErrorAndRetry(retryFn, config, options) {
  setCsrfToken(null)
  await fetchCsrfToken()
  options.headers = await buildHeaders(config.headers)

  // Retry once
  try {
    return await retryFn()
  } catch (retryError) {
    if (config.showErrorToast !== false) {
      Toast.error(retryError.message)
    }
    throw retryError
  }
}

/**
 * Default request configuration
 */
const defaultConfig = {
  retry: 2,
  retryDelay: 1000,
  timeout: 30000,
  showErrorToast: true,
  showSuccessToast: false
}

/**
 * Parse and validate an API response
 */
async function handleResponse(response) {
  const contentType = response.headers.get('content-type')
  const isJson = contentType && contentType.includes('application/json')

  if (!isJson) {
    throw new ApiError(
      'Server returned a non-JSON response',
      'INVALID_RESPONSE',
      response.status
    )
  }

  const data = await response.json()

  // Handle 401 — token in httpOnly cookie expires server-side
  if (response.status === 401) {
    sessionStorage.removeItem('auth_user')
    const currentPath = window.location.pathname
    if (currentPath !== '/login' && currentPath !== '/register') {
      localStorage.setItem('redirect_after_login', currentPath)
      window.location.href = '/login'
    }
    throw new ApiError('Session expired, please log in again', 'UNAUTHORIZED', 401)
  }

  if (!response.ok) {
    throw new ApiError(
      data.error?.message || 'Request failed',
      data.error?.code || 'UNKNOWN_ERROR',
      response.status,
      data.error?.details
    )
  }

  if (data.success === false) {
    throw new ApiError(
      data.error?.message || 'Operation failed',
      data.error?.code || 'OPERATION_FAILED',
      response.status,
      data.error?.details
    )
  }

  return data.data !== undefined ? data.data : data
}

/**
 * Execute a fetch request with retry and timeout support
 */
async function executeRequest(url, options, config) {
  const { retry, retryDelay, timeout } = { ...defaultConfig, ...config }
  let lastError = null

  for (let attempt = 0; attempt <= retry; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      return await handleResponse(response)

    } catch (error) {
      lastError = error

      if (error.name === 'AbortError') {
        lastError = new NetworkError('Request timed out. Please check your connection.')
      }

      if (
        (error instanceof NetworkError || error.name === 'TypeError' || error.message.includes('fetch')) &&
        attempt < retry
      ) {
        console.warn(`Request failed, retrying in ${retryDelay * (attempt + 1)}ms (${attempt + 1}/${retry})...`)
        await delay(retryDelay * (attempt + 1))
        continue
      }

      break
    }
  }

  throw lastError
}

/**
 * Build request headers, including the CSRF token
 */
async function buildHeaders(customHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders
  }

  // Auth token is in an httpOnly cookie — the browser sends it automatically.

  // Attach CSRF token (use cache if available)
  let token = getCsrfToken()
  if (!token) {
    token = await fetchCsrfToken()
  }
  if (token) {
    headers['X-CSRF-Token'] = token
  }

  return headers
}

/**
 * GET request
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
      Toast.success(config.successMessage || 'Loaded successfully')
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
 * POST request
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
      Toast.success(config.successMessage || 'Done')
    }
    return data
  } catch (error) {
    // On CSRF token error, clear cache and retry once
    if (error.code === 'CSRF_TOKEN_INVALID' || error.code === 'CSRF_TOKEN_MISSING') {
      return handleCsrfErrorAndRetry(
        () => executeRequest(url, options, { ...config, retry: 0 }),
        config,
        options
      )
    }

    if (config.showErrorToast !== false) {
      Toast.error(error.message)
    }
    throw error
  }
}

/**
 * PUT request
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
      Toast.success(config.successMessage || 'Updated successfully')
    }
    return data
  } catch (error) {
    // On CSRF token error, clear cache and retry once
    if (error.code === 'CSRF_TOKEN_INVALID' || error.code === 'CSRF_TOKEN_MISSING') {
      return handleCsrfErrorAndRetry(
        () => executeRequest(url, options, { ...config, retry: 0 }),
        config,
        options
      )
    }

    if (config.showErrorToast !== false) {
      Toast.error(error.message)
    }
    throw error
  }
}

/**
 * DELETE request
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
      Toast.success(config.successMessage || 'Deleted successfully')
    }
    return data
  } catch (error) {
    // On CSRF token error, clear cache and retry once
    if (error.code === 'CSRF_TOKEN_INVALID' || error.code === 'CSRF_TOKEN_MISSING') {
      return handleCsrfErrorAndRetry(
        () => executeRequest(url, options, { ...config, retry: 0 }),
        config,
        options
      )
    }

    if (config.showErrorToast !== false) {
      Toast.error(error.message)
    }
    throw error
  }
}

/**
 * Authenticated fetch wrapper (backwards-compatible)
 */
export async function fetchWithAuth(url, options = {}) {
  const headers = await buildHeaders(options.headers)
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers
  })
  return response
}

/**
 * Check whether a user session exists in sessionStorage
 */
export function isAuthenticated() {
  // Token is in an httpOnly cookie — check sessionStorage user record instead
  return !!sessionStorage.getItem('auth_user')
}

/**
 * Return the current user object from sessionStorage
 */
export function getCurrentUser() {
  const userStr = sessionStorage.getItem('auth_user')
  return userStr ? JSON.parse(userStr) : null
}

/**
 * Log out: clear the server-side cookie, then redirect to /login
 */
export async function logout() {
  try {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    })
  } catch (error) {
    console.error('Logout request failed:', error)
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
