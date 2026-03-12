// ============================================================
// 统一 AI 客户端
// 使用 Anthropic Claude API
// ============================================================

import { callClaudeAPI, callClaudeAPIStream } from './claudeClient.js'

/**
 * 统一的 AI API 调用接口
 * @param {Array} messages - 消息数组 [{ role: 'user', content: '...' }]
 * @param {Object} options - 可选配置
 * @returns {Promise<Object>} 统一格式的 API 响应
 */
export async function callAI(messages, options = {}) {
  try {
    return await callClaudeAPI(messages, options)
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
    return await callClaudeAPIStream(messages, onChunk, options)
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
    provider: 'claude',
    name: 'Anthropic Claude',
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
    available: !!process.env.ANTHROPIC_API_KEY
  }
}

export default {
  callAI,
  callAIStream,
  getAIProviderInfo
}
