// ============================================================
// API Utility Module
// Handles AI API calls and key management
// ============================================================

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
    console.error("AI 返回的原始文本:", rawText);
    throw new Error("无法解析 AI 返回的数据，请重试。");
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

// API配置
const BACKEND_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const USE_BACKEND_API = import.meta.env.VITE_USE_API === 'true'

// 统一请求函数
async function backendRequest(endpoint, options = {}) {
  const url = `${BACKEND_API_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || `HTTP ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('Backend API请求失败:', error)
    throw error
  }
}

// 科目相关API
export const subjectsAPI = {
  // 获取所有科目
  getAll: async () => {
    const response = await backendRequest('/api/subjects')
    return response.data
  },

  // 获取单个科目详情
  getById: async (id) => {
    const response = await backendRequest(`/api/subjects/${id}`)
    return response.data
  },
}

// 章节相关API
export const chaptersAPI = {
  // 获取单个章节详情
  getById: async (id) => {
    const response = await backendRequest(`/api/chapters/${id}`)
    return response.data
  },
}

// 导出配置
export { BACKEND_API_URL, USE_BACKEND_API }
