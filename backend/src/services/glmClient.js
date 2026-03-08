// ============================================================
// 智谱 AI (GLM) API 客户端
// 用于与智谱 AI API 交互
// ============================================================

/**
 * 智谱 AI API 配置
 */
const GLM_API_CONFIG = {
  apiKey: process.env.GLM_API_KEY || '',
  apiUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  model: process.env.GLM_MODEL || 'glm-4-plus', // 默认使用 GLM-4-Plus
  maxTokens: parseInt(process.env.GLM_MAX_TOKENS || '4096'),
  temperature: parseFloat(process.env.GLM_TEMPERATURE || '0.7')
}

/**
 * 调用智谱 AI API
 * @param {Array} messages - 消息数组 [{ role: 'user', content: '...' }]
 * @param {Object} options - 可选配置
 * @returns {Promise<Object>} API 响应
 */
export async function callGLMAPI(messages, options = {}) {
  const {
    model = GLM_API_CONFIG.model,
    maxTokens = GLM_API_CONFIG.maxTokens,
    temperature = GLM_API_CONFIG.temperature,
    system = null
  } = options

  // 验证 API Key
  if (!GLM_API_CONFIG.apiKey) {
    throw new Error('GLM_API_KEY 未配置')
  }

  try {
    // 智谱 AI 的消息格式：如果有 system prompt，需要作为第一条消息
    const formattedMessages = []
    if (system) {
      formattedMessages.push({
        role: 'system',
        content: system
      })
    }
    formattedMessages.push(...messages)

    const requestBody = {
      model,
      messages: formattedMessages,
      max_tokens: maxTokens,
      temperature
    }

    const response = await fetch(GLM_API_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GLM_API_CONFIG.apiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`智谱 AI API 错误: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    // 智谱 AI 的响应格式与 OpenAI 兼容
    return {
      content: data.choices[0].message.content,
      usage: {
        inputTokens: data.usage.prompt_tokens,
        outputTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      },
      model: data.model,
      stopReason: data.choices[0].finish_reason
    }
  } catch (error) {
    console.error('智谱 AI API 调用失败:', error)
    throw error
  }
}

/**
 * 流式调用智谱 AI API
 * @param {Array} messages - 消息数组
 * @param {Function} onChunk - 接收数据块的回调函数
 * @param {Object} options - 可选配置
 */
export async function callGLMAPIStream(messages, onChunk, options = {}) {
  const {
    model = GLM_API_CONFIG.model,
    maxTokens = GLM_API_CONFIG.maxTokens,
    temperature = GLM_API_CONFIG.temperature,
    system = null
  } = options

  if (!GLM_API_CONFIG.apiKey) {
    throw new Error('GLM_API_KEY 未配置')
  }

  try {
    const formattedMessages = []
    if (system) {
      formattedMessages.push({
        role: 'system',
        content: system
      })
    }
    formattedMessages.push(...messages)

    const requestBody = {
      model,
      messages: formattedMessages,
      max_tokens: maxTokens,
      temperature,
      stream: true
    }

    const response = await fetch(GLM_API_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GLM_API_CONFIG.apiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`智谱 AI API 错误: ${response.status} - ${errorText}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(line => line.trim() !== '')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices[0]?.delta?.content
            if (content) {
              onChunk(content)
            }
          } catch (e) {
            console.error('解析流式响应失败:', e)
          }
        }
      }
    }
  } catch (error) {
    console.error('智谱 AI 流式调用失败:', error)
    throw error
  }
}

/**
 * 估算 tokens 数量（粗略估算）
 * @param {string} text - 文本内容
 * @returns {number} 估算的 tokens 数量
 */
export function estimateTokens(text) {
  // 粗略估算：英文约 4 字符 = 1 token，中文约 1.5 字符 = 1 token
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const otherChars = text.length - chineseChars
  return Math.ceil(chineseChars / 1.5 + otherChars / 4)
}

export default {
  callGLMAPI,
  callGLMAPIStream,
  estimateTokens,
  config: GLM_API_CONFIG
}
