// ChatGPT (OpenAI) provider
export const OPENAI_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o (最强)' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini (推荐)' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
]

export async function callOpenAI(messages, options = {}) {
  const {
    apiKey,
    model = 'gpt-4o-mini',
    maxTokens = 4096,
    system = null
  } = options

  if (!apiKey) throw new Error('OpenAI API Key 未配置')

  const msgs = system
    ? [{ role: 'system', content: system }, ...messages]
    : messages

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
    if (response.status === 401) throw new Error('OpenAI API Key 无效，请检查')
    if (response.status === 429) throw new Error('OpenAI 配额已用完，请稍后再试')
    throw new Error(`OpenAI API 错误: ${response.status} - ${err}`)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content
  if (!text) throw new Error('OpenAI 返回了空内容')

  return {
    content: text,
    usage: {
      inputTokens: data.usage?.prompt_tokens || 0,
      outputTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0
    }
  }
}
