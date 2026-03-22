// ============================================================
// 前端 AI 调用工具
// 通过后端 /api/ai/generate 代理调用 AI
// 自动携带用户的提供商/key/模型设置
// ============================================================

import { API_BASE } from './constants'
import { getAISettings } from './aiProviders'
import { trackFreeAIUsage } from './helpers'

/**
 * 调用 AI 生成文本
 * @param {string} system - 系统提示词
 * @param {string} prompt - 用户提示词
 * @param {number} maxTokens - 最大输出 token 数
 * @returns {Promise<string>} 生成的文本
 */
export async function callAI(system, prompt, maxTokens = 1500) {
  const body = { system, prompt, maxTokens }

  // 自动注入用户的 AI 设置
  const settings = getAISettings()
  const hasOwnKey = !!(settings?.provider && settings?.apiKey)
  if (hasOwnKey) {
    body.provider = settings.provider
    body.apiKey = settings.apiKey
    if (settings.model) body.model = settings.model
  }

  const response = await fetch(`${API_BASE}/api/ai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error?.message || `AI request failed (${response.status})`)
  }

  const data = await response.json()
  if (!data.success) {
    throw new Error(data.error?.message || 'AI generation failed')
  }

  // 使用服务端 AI 时计数
  if (!hasOwnKey) trackFreeAIUsage()

  return data.data.text
}
