// ============================================================
// Claude API 客户端
// 用于与 Anthropic Claude API 交互
// ============================================================

/**
 * Claude API 配置
 */
const CLAUDE_API_CONFIG = {
  apiKey: process.env.ANTHROPIC_API_KEY || '',
  apiUrl: 'https://api.anthropic.com/v1/messages',
  model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514', // 默认使用 Sonnet 4.6
  maxTokens: parseInt(process.env.CLAUDE_MAX_TOKENS || '4096'),
  temperature: parseFloat(process.env.CLAUDE_TEMPERATURE || '0.7')
}

/**
 * 调用 Claude API
 * @param {Array} messages - 消息数组 [{ role: 'user', content: '...' }]
 * @param {Object} options - 可选配置
 * @returns {Promise<Object>} API 响应
 */
export async function callClaudeAPI(messages, options = {}) {
  const {
    model = CLAUDE_API_CONFIG.model,
    maxTokens = CLAUDE_API_CONFIG.maxTokens,
    temperature = CLAUDE_API_CONFIG.temperature,
    system = null
  } = options

  // 验证 API Key
  if (!CLAUDE_API_CONFIG.apiKey) {
    throw new Error('ANTHROPIC_API_KEY 未配置')
  }

  try {
    const requestBody = {
      model,
      max_tokens: maxTokens,
      temperature,
      messages
    }

    // 添加 system prompt（如果提供）
    if (system) {
      requestBody.system = system
    }

    const response = await fetch(CLAUDE_API_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_CONFIG.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Claude API 错误: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    return {
      content: data.content[0].text,
      usage: {
        inputTokens: data.usage.input_tokens,
        outputTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens
      },
      model: data.model,
      stopReason: data.stop_reason
    }
  } catch (error) {
    console.error('Claude API 调用失败:', error)
    throw error
  }
}

/**
 * 流式调用 Claude API（未来实现）
 * @param {Array} messages - 消息数组
 * @param {Function} onChunk - 接收数据块的回调函数
 * @param {Object} options - 可选配置
 */
export async function callClaudeAPIStream(messages, onChunk, options = {}) {
  // TODO: 实现流式响应
  throw new Error('流式响应暂未实现')
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
  callClaudeAPI,
  callClaudeAPIStream,
  estimateTokens,
  config: CLAUDE_API_CONFIG
}
