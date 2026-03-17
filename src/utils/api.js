// ============================================================
// API Utility Module
// Handles AI API calls and key management
// ============================================================

import { get, post, put, del } from './apiClient'

// Storage keys
const STORAGE_KEYS = {
  ANTHROPIC: 'alevel_math_anthropic_key',
  MINIMAX: 'alevel_math_minimax_key',
  ZHIPU: 'alevel_math_zhipu_key'
};

// API Endpoints
const API_ENDPOINTS = {
  ANTHROPIC: 'https://api.anthropic.com/v1/messages',
  MINIMAX: 'https://api.minimax.chat/v1/text/chatcompletion_pro',
  ZHIPU: 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
};

// ============================================================
// Storage Helpers
// ============================================================
export function getApiKey(provider = 'anthropic') {
  const keyMap = {
    anthropic: STORAGE_KEYS.ANTHROPIC,
    minimax: STORAGE_KEYS.MINIMAX,
    zhipu: STORAGE_KEYS.ZHIPU
  };
  return localStorage.getItem(keyMap[provider] || keyMap.anthropic);
}

export function setApiKey(provider, key) {
  const keyMap = {
    anthropic: STORAGE_KEYS.ANTHROPIC,
    minimax: STORAGE_KEYS.MINIMAX,
    zhipu: STORAGE_KEYS.ZHIPU
  };
  if (key) {
    localStorage.setItem(keyMap[provider] || keyMap.anthropic, key);
  } else {
    localStorage.removeItem(keyMap[provider] || keyMap.anthropic);
  }
}

export function clearApiKeys() {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

// ============================================================
// AI Response Parser
// ============================================================
export function parseAIResponse(rawText) {
  try {
    const startIndex = rawText.indexOf('[');
    const endIndex = rawText.lastIndexOf(']');

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      const jsonString = rawText.substring(startIndex, endIndex + 1);
      return JSON.parse(jsonString);
    }
    return JSON.parse(rawText.replace(/```json|```/gi, "").trim());
  } catch (error) {
    console.error("AI raw response:", rawText);
    throw new Error("Failed to parse AI response. Please try again.");
  }
}

// ============================================================
// API Call Functions
// ============================================================

// Call Anthropic Claude API
export async function callAnthropicAPI(prompt, apiKey) {
  const response = await fetch(API_ENDPOINTS.ANTHROPIC, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

// Call MiniMax API
export async function callMinimaxAPI(prompt, apiKey) {
  const response = await fetch(API_ENDPOINTS.MINIMAX, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'abab6.5s-chat',
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`MiniMax API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Call Zhipu AI API
export async function callZhipuAPI(prompt, apiKey) {
  const response = await fetch(API_ENDPOINTS.ZHIPU, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'glm-4',
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Zhipu API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Universal API caller
export async function callAIAPI(prompt, provider = 'anthropic', apiKey = null) {
  const key = apiKey || getApiKey(provider);
  if (!key) {
    throw new Error('API key not configured');
  }

  switch (provider) {
    case 'anthropic':
      return callAnthropicAPI(prompt, key);
    case 'minimax':
      return callMinimaxAPI(prompt, key);
    case 'zhipu':
      return callZhipuAPI(prompt, key);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export { STORAGE_KEYS, API_ENDPOINTS };

// ============================================================
// Backend API Client
// ============================================================

// API base URL from constants.js
import { API_BASE } from './constants'

const BACKEND_API_URL = API_BASE
const USE_BACKEND_API = import.meta.env.VITE_USE_API === 'true'

// Get stored token (legacy compatibility)
function getAuthToken() {
  return localStorage.getItem('auth_token')
}

// Set/clear stored token (legacy compatibility)
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('auth_token', token)
  } else {
    localStorage.removeItem('auth_token')
  }
}

// Unified request wrapper — delegates to apiClient.js methods
async function backendRequest(endpoint, options = {}) {
  const { method = 'GET', body, ...config } = options

  try {
    let data
    switch (method.toUpperCase()) {
      case 'GET':
        data = await get(endpoint, { ...config, showErrorToast: false })
        break
      case 'POST':
        data = await post(endpoint, body, { ...config, showErrorToast: false })
        break
      case 'PUT':
        data = await put(endpoint, body, { ...config, showErrorToast: false })
        break
      case 'DELETE':
        data = await del(endpoint, { ...config, showErrorToast: false })
        break
      default:
        throw new Error(`Unsupported method: ${method}`)
    }
    return { data }
  } catch (error) {
    console.error('Backend API request failed:', error)
    throw error
  }
}

// Subjects API
export const subjectsAPI = {
  getAll: async () => {
    const response = await backendRequest('/api/subjects')
    return response.data
  },

  getById: async (id) => {
    const response = await backendRequest(`/api/subjects/${id}`)
    return response.data
  },
}

// Chapters API
export const chaptersAPI = {
  getById: async (id) => {
    const response = await backendRequest(`/api/chapters/${id}`)
    return response.data
  },
}

// Users API
export const usersAPI = {
  create: async (userData) => {
    const response = await backendRequest('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
    return response.data
  },

  getById: async (userId) => {
    const response = await backendRequest(`/api/users/${userId}`)
    return response.data
  },

  update: async (userId, userData) => {
    const response = await backendRequest(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    })
    return response.data
  },

  getProfile: async (userId) => {
    const response = await backendRequest(`/api/users/${userId}/profile`)
    return response.data
  },

  updateProfile: async (userId, profileData) => {
    const response = await backendRequest(`/api/users/${userId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
    return response.data
  },

  getStats: async (userId) => {
    const response = await backendRequest(`/api/users/${userId}/stats`)
    return response.data
  }
}

// Progress API
export const progressAPI = {
  getAll: async (userId) => {
    const response = await backendRequest(`/api/progress/${userId}`)
    return response.data
  },

  getByChapter: async (userId, chapterId) => {
    const response = await backendRequest(`/api/progress/${userId}/chapter/${chapterId}`)
    return response.data
  },

  update: async (progressData) => {
    const response = await backendRequest('/api/progress', {
      method: 'POST',
      body: JSON.stringify(progressData)
    })
    return response.data
  },

  getStats: async (userId) => {
    const response = await backendRequest(`/api/progress/${userId}/stats`)
    return response.data
  },

  delete: async (userId, chapterId) => {
    const response = await backendRequest(`/api/progress/${userId}/chapter/${chapterId}`, {
      method: 'DELETE'
    })
    return response
  }
}

export { BACKEND_API_URL, USE_BACKEND_API }

// ============================================================
// Auth API
// ============================================================

export const authAPI = {
  register: async (userData) => {
    const response = await backendRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
    if (response.data?.token) {
      setAuthToken(response.data.token)
    }
    return response.data
  },

  login: async (credentials) => {
    const response = await backendRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
    if (response.data?.token) {
      setAuthToken(response.data.token)
    }
    return response.data
  },

  logout: () => {
    setAuthToken(null)
  }
}

// ============================================================
// Chat API
// ============================================================

export const chatAPI = {
  createSession: async (sessionData) => {
    const response = await backendRequest('/api/chat/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData)
    })
    return response.data
  },

  getSessions: async (userId, options = {}) => {
    const params = new URLSearchParams({ userId })
    if (options.status) params.append('status', options.status)
    if (options.limit) params.append('limit', options.limit.toString())
    if (options.offset) params.append('offset', options.offset.toString())

    const response = await backendRequest(`/api/chat/sessions?${params}`)
    return response.data
  },

  getSession: async (sessionId) => {
    const response = await backendRequest(`/api/chat/sessions/${sessionId}`)
    return response.data
  },

  updateSession: async (sessionId, updateData) => {
    const response = await backendRequest(`/api/chat/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    })
    return response.data
  },

  deleteSession: async (sessionId) => {
    const response = await backendRequest(`/api/chat/sessions/${sessionId}`, {
      method: 'DELETE'
    })
    return response
  },

  getMessages: async (sessionId, options = {}) => {
    const params = new URLSearchParams()
    if (options.limit) params.append('limit', options.limit.toString())
    if (options.offset) params.append('offset', options.offset.toString())

    const response = await backendRequest(`/api/chat/sessions/${sessionId}/messages?${params}`)
    return response.data
  },

  sendMessage: async (messageData) => {
    const response = await backendRequest('/api/chat/messages/send', {
      method: 'POST',
      body: JSON.stringify(messageData)
    })
    return response
  }
}
