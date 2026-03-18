// MiniMax provider (自有格式)
export const MINIMAX_MODELS = [
  { id: 'abab6.5s-chat', name: 'ABAB 6.5s (推荐)' },
  { id: 'abab6.5-chat', name: 'ABAB 6.5' },
  { id: 'abab5.5-chat', name: 'ABAB 5.5 (快速)' },
]

export async function callMiniMax(messages, options = {}) {
  const {
    apiKey,
    model = 'abab6.5s-chat',
    maxTokens = 4096,
    system = null
  } = options

  if (!apiKey) throw new Error('MiniMax API Key 未配置')

  // MiniMax 使用 OpenAI 兼容格式 (v1)
  const msgs = system
    ? [{ role: 'system', content: system }, ...messages]
    : messages

  const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
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
    if (response.status === 401) throw new Error('MiniMax API Key 无效，请检查')
    if (response.status === 429) throw new Error('MiniMax 配额已用完，请稍后再试')
    throw new Error(`MiniMax API 错误: ${response.status} - ${err}`)
  }

  const data = await response.json()

  // MiniMax 返回格式检查
  if (data.base_resp && data.base_resp.status_code !== 0) {
    throw new Error(`MiniMax 错误: ${data.base_resp.status_msg || '未知错误'}`)
  }

  const text = data.choices?.[0]?.message?.content
  if (!text) throw new Error('MiniMax 返回了空内容')

  return {
    content: text,
    usage: {
      inputTokens: data.usage?.prompt_tokens || 0,
      outputTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0
    }
  }
}
