// Claude (Anthropic) provider
export const CLAUDE_MODELS = [
  { id: 'claude-opus-4-5', name: 'Claude Opus 4.5 (最强)' },
  { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5 (推荐)' },
  { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5 (快速)' },
]

export async function callClaude(messages, options = {}) {
  const {
    apiKey,
    model = 'claude-sonnet-4-5',
    maxTokens = 4096,
    system = null
  } = options

  if (!apiKey) throw new Error('Claude API Key 未配置')

  const body = {
    model,
    max_tokens: maxTokens,
    messages
  }
  if (system) body.system = system

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const err = await response.text()
    if (response.status === 401) throw new Error('Claude API Key 无效，请检查')
    if (response.status === 429) throw new Error('Claude 配额已用完，请稍后再试')
    throw new Error(`Claude API 错误: ${response.status} - ${err}`)
  }

  const data = await response.json()
  const text = data.content?.[0]?.text
  if (!text) throw new Error('Claude 返回了空内容，可能被内容安全策略拦截')

  return {
    content: text,
    usage: {
      inputTokens: data.usage?.input_tokens || 0,
      outputTokens: data.usage?.output_tokens || 0,
      totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
    }
  }
}
