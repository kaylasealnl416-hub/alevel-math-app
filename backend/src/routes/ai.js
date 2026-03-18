// ============================================================
// 通用 AI 文本生成接口
// POST /api/ai/generate — 公开端点，仅受全局速率限制保护
// GET  /api/ai/providers — 获取所有可用提供商列表
// ============================================================

import { Hono } from 'hono'
import { callAI, getAIProviderInfo } from '../services/aiClient.js'
import { PROVIDERS } from '../services/providers/index.js'

const ai = new Hono()

// 获取提供商列表（前端展示用）
ai.get('/providers', (c) => {
  const info = getAIProviderInfo()
  return c.json({ success: true, data: info })
})

// AI 文本生成
ai.post('/generate', async (c) => {
  try {
    const body = await c.req.json()
    const { system, prompt, maxTokens = 1500, provider, apiKey, model } = body

    if (!prompt) {
      return c.json({
        success: false,
        error: { message: 'prompt is required' }
      }, 400)
    }

    const messages = [{ role: 'user', content: prompt }]
    const options = { maxTokens }
    if (system) options.system = system

    // 用户指定了提供商和 key → 校验后使用
    if (provider && apiKey) {
      // 校验 provider 白名单
      const providerConfig = PROVIDERS[provider]
      if (!providerConfig) {
        return c.json({
          success: false,
          error: { message: `不支持的 AI 提供商: ${provider}` }
        }, 400)
      }
      // 校验 model 白名单（如果指定了 model）
      if (model && !providerConfig.models.some(m => m.id === model)) {
        return c.json({
          success: false,
          error: { message: `不支持的模型: ${model}` }
        }, 400)
      }
      options.provider = provider
      options.apiKey = apiKey
      if (model) options.model = model
    }

    const response = await callAI(messages, options)

    return c.json({
      success: true,
      data: { text: response.content }
    })
  } catch (error) {
    console.error('AI generate error:', error)

    // 用户 key 相关的错误直接返回
    if (error.message.includes('无效') || error.message.includes('配额')) {
      return c.json({
        success: false,
        error: { message: error.message }
      }, 400)
    }

    if (error.message.includes('GLM_API_KEY') || error.message.includes('未配置')) {
      return c.json({
        success: false,
        error: { message: 'AI service not configured. Please contact administrator.' }
      }, 500)
    }

    return c.json({
      success: false,
      error: { message: error.message || 'AI generation failed' }
    }, 500)
  }
})

export default ai
