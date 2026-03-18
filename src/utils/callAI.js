// ============================================================
// 前端 AI 调用工具
// 通过后端 /api/ai/generate 代理调用 GLM，不暴露 API Key
// ============================================================

import { API_BASE } from './constants'

/**
 * 调用 AI 生成文本
 * @param {string} system - 系统提示词
 * @param {string} prompt - 用户提示词
 * @param {number} maxTokens - 最大输出 token 数
 * @returns {Promise<string>} 生成的文本
 */
export async function callAI(system, prompt, maxTokens = 1500) {
  const response = await fetch(`${API_BASE}/api/ai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, prompt, maxTokens })
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error?.message || `AI request failed (${response.status})`)
  }

  const data = await response.json()
  if (!data.success) {
    throw new Error(data.error?.message || 'AI generation failed')
  }

  return data.data.text
}
