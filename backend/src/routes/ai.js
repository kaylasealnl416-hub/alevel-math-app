// ============================================================
// 通用 AI 文本生成接口
// POST /api/ai/generate — 公开端点，仅受全局速率限制保护
// ============================================================

import { Hono } from 'hono'
import { callAI } from '../services/aiClient.js'

const ai = new Hono()

ai.post('/generate', async (c) => {
  try {
    const body = await c.req.json()
    const { system, prompt, maxTokens = 1500 } = body

    if (!prompt) {
      return c.json({
        success: false,
        error: { message: 'prompt is required' }
      }, 400)
    }

    const messages = [{ role: 'user', content: prompt }]
    const options = { maxTokens }
    if (system) options.system = system

    const response = await callAI(messages, options)

    return c.json({
      success: true,
      data: { text: response.content }
    })
  } catch (error) {
    console.error('AI generate error:', error)

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
