// 通义千问 (Qwen) provider (OpenAI 兼容格式)
export const QWEN_MODELS = [
  { id: 'qwen-max', name: 'Qwen Max (最强)' },
  { id: 'qwen-plus', name: 'Qwen Plus (推荐)' },
  { id: 'qwen-turbo', name: 'Qwen Turbo (快速)' },
]

export async function callQwen(messages, options = {}) {
  const {
    apiKey,
    model = 'qwen-plus',
    maxTokens = 4096,
    system = null
  } = options

  if (!apiKey) throw new Error('通义千问 API Key 未配置')

  const msgs = system
    ? [{ role: 'system', content: system }, ...messages]
    : messages

  const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
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
    if (response.status === 401) throw new Error('通义千问 API Key 无效，请检查')
    if (response.status === 429) throw new Error('通义千问配额已用完，请稍后再试')
    throw new Error(`通义千问 API 错误: ${response.status} - ${err}`)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content
  if (!text) throw new Error('通义千问返回了空内容')

  return {
    content: text,
    usage: {
      inputTokens: data.usage?.prompt_tokens || 0,
      outputTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0
    }
  }
}
