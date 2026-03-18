// ============================================================
// 统一 AI 客户端
// 支持多提供商：用户 key 优先，无则 fallback 到服务端默认 GLM
// ============================================================

import { callGLMAPI, callGLMAPIStream } from './glmClient.js'
import { callProvider, getProviderList } from './providers/index.js'

/**
 * 统一的 AI API 调用接口
 * @param {Array} messages - 消息数组 [{ role: 'user', content: '...' }]
 * @param {Object} options - 可选配置
 *   - provider: 提供商 ID（claude/gemini/openai/glm/minimax/kimi/qwen）
 *   - apiKey: 用户自己的 API Key
 *   - model: 模型 ID
 *   - maxTokens: 最大输出 token
 *   - system: 系统提示词
 * @returns {Promise<Object>} 统一格式的 API 响应 { content, usage }
 */
export async function callAI(messages, options = {}) {
  const { provider, apiKey } = options

  // 有用户 key + 指定提供商 → 用用户的
  if (provider && apiKey) {
    try {
      return await callProvider(provider, messages, options)
    } catch (error) {
      console.error(`[${provider}] 用户 key 调用失败:`, error.message)
      throw error
    }
  }

  // 无用户 key → fallback 到服务端默认 GLM
  try {
    return await callGLMAPI(messages, options)
  } catch (error) {
    console.error('AI API 调用失败:', error)
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
  try {
    return await callGLMAPIStream(messages, onChunk, options)
  } catch (error) {
    console.error('AI 流式调用失败:', error)
    throw error
  }
}

/**
 * 获取当前 AI 提供商信息
 */
export function getAIProviderInfo() {
  return {
    defaultProvider: {
      provider: 'glm',
      name: '智谱 AI (GLM)',
      model: process.env.GLM_MODEL || 'glm-4-plus',
      available: !!(process.env.GLM_API_KEY || process.env.ZHIPU_API_KEY)
    },
    providers: getProviderList()
  }
}

export default {
  callAI,
  callAIStream,
  getAIProviderInfo
}
