// 统一提供商路由
import { callClaude, CLAUDE_MODELS } from './claude.js'
import { callGemini, GEMINI_MODELS } from './gemini.js'
import { callOpenAI, OPENAI_MODELS } from './openai.js'
import { callGLM, GLM_MODELS } from './glm.js'
import { callMiniMax, MINIMAX_MODELS } from './minimax.js'
import { callKimi, KIMI_MODELS } from './kimi.js'
import { callQwen, QWEN_MODELS } from './qwen.js'

// 提供商注册表
export const PROVIDERS = {
  claude: {
    name: 'Claude',
    models: CLAUDE_MODELS,
    call: callClaude
  },
  gemini: {
    name: 'Gemini',
    models: GEMINI_MODELS,
    call: callGemini
  },
  openai: {
    name: 'ChatGPT',
    models: OPENAI_MODELS,
    call: callOpenAI
  },
  glm: {
    name: '智谱 GLM',
    models: GLM_MODELS,
    call: callGLM
  },
  minimax: {
    name: 'MiniMax',
    models: MINIMAX_MODELS,
    call: callMiniMax
  },
  kimi: {
    name: 'Kimi',
    models: KIMI_MODELS,
    call: callKimi
  },
  qwen: {
    name: '通义千问',
    models: QWEN_MODELS,
    call: callQwen
  }
}

/**
 * 统一调用入口
 * @param {string} provider - 提供商 ID
 * @param {Array} messages - 消息列表 [{role, content}]
 * @param {object} options - { apiKey, model, maxTokens, system }
 */
export async function callProvider(provider, messages, options = {}) {
  const p = PROVIDERS[provider]
  if (!p) {
    throw new Error(`不支持的 AI 提供商: ${provider}`)
  }
  return p.call(messages, options)
}

/**
 * 获取所有提供商信息（供前端展示）
 */
export function getProviderList() {
  return Object.entries(PROVIDERS).map(([id, p]) => ({
    id,
    name: p.name,
    models: p.models
  }))
}
