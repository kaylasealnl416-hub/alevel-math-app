// ============================================================
// 统一 AI 客户端
// 支持多个 AI 提供商（Claude、智谱 GLM）
// ============================================================

import { callClaudeAPI, callClaudeAPIStream } from './claudeClient.js'
import { callGLMAPI, callGLMAPIStream } from './glmClient.js'

/**
 * AI 提供商枚举
 */
export const AI_PROVIDERS = {
  CLAUDE: 'claude',
  GLM: 'glm'
}

/**
 * 获取当前配置的 AI 提供商
 */
function getAIProvider() {
  const provider = process.env.AI_PROVIDER || 'claude'
  return provider.toLowerCase()
}

/**
 * 统一的 AI API 调用接口
 * @param {Array} messages - 消息数组 [{ role: 'user', content: '...' }]
 * @param {Object} options - 可选配置
 * @returns {Promise<Object>} 统一格式的 API 响应
 */
export async function callAI(messages, options = {}) {
  const provider = getAIProvider()

  try {
    switch (provider) {
      case AI_PROVIDERS.CLAUDE:
        return await callClaudeAPI(messages, options)

      case AI_PROVIDERS.GLM:
        return await callGLMAPI(messages, options)

      default:
        throw new Error(`不支持的 AI 提供商: ${provider}`)
    }
  } catch (error) {
    console.error(`AI API 调用失败 (${provider}):`, error)
    throw error
  }
}

/**
 * 统一的流式 AI API 调用接口
 * @param {Array} messages - 消息数组
 * @param {Function} onChunk - 接收数据块的回调函数
 * @param {Object} options - 可选配置
 */
export async function callAIStream(messages, onChunk, options = {}) {
  const provider = getAIProvider()

  try {
    switch (provider) {
      case AI_PROVIDERS.CLAUDE:
        return await callClaudeAPIStream(messages, onChunk, options)

      case AI_PROVIDERS.GLM:
        return await callGLMAPIStream(messages, onChunk, options)

      default:
        throw new Error(`不支持的 AI 提供商: ${provider}`)
    }
  } catch (error) {
    console.error(`AI 流式调用失败 (${provider}):`, error)
    throw error
  }
}

/**
 * 获取当前 AI 提供商信息
 */
export function getAIProviderInfo() {
  const provider = getAIProvider()

  const info = {
    provider,
    name: '',
    model: '',
    available: false
  }

  switch (provider) {
    case AI_PROVIDERS.CLAUDE:
      info.name = 'Anthropic Claude'
      info.model = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514'
      info.available = !!process.env.ANTHROPIC_API_KEY
      break

    case AI_PROVIDERS.GLM:
      info.name = '智谱 AI (GLM)'
      info.model = process.env.GLM_MODEL || 'glm-4-plus'
      info.available = !!process.env.GLM_API_KEY
      break
  }

  return info
}

export default {
  callAI,
  callAIStream,
  getAIProviderInfo,
  AI_PROVIDERS
}
