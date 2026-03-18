// Kimi (Moonshot) provider (OpenAI 兼容格式)
export const KIMI_MODELS = [
  { id: 'moonshot-v1-128k', name: 'Moonshot 128K (最强)' },
  { id: 'moonshot-v1-32k', name: 'Moonshot 32K' },
  { id: 'moonshot-v1-8k', name: 'Moonshot 8K (快速)' },
]

export async function callKimi(messages, options = {}) {
  const {
    apiKey,
    model = 'moonshot-v1-128k',
    maxTokens = 4096,
    system = null
  } = options

  if (!apiKey) throw new Error('Kimi API Key 未配置')

  const msgs = system
    ? [{ role: 'system', content: system }, ...messages]
    : messages

  const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: msgs,
      max_tokens: maxTokens
    })
  })

  if (!response.ok) {
    const err = await response.text()
    if (response.status === 401) throw new Error('Kimi API Key 无效，请检查')
    if (response.status === 429) throw new Error('Kimi 配额已用完，请稍后再试')
    throw new Error(`Kimi API 错误: ${response.status} - ${err}`)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content
  if (!text) throw new Error('Kimi 返回了空内容')

  return {
    content: text,
    usage: {
      inputTokens: data.usage?.prompt_tokens || 0,
      outputTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0
    }
  }
}
