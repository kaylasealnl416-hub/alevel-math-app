// 智谱 GLM provider (OpenAI 兼容格式)
export const GLM_MODELS = [
  { id: 'glm-4-plus', name: 'GLM-4 Plus (最强)' },
  { id: 'glm-4-flash', name: 'GLM-4 Flash (推荐)' },
  { id: 'glm-4-long', name: 'GLM-4 Long (长文本)' },
]

export async function callGLM(messages, options = {}) {
  const {
    apiKey,
    model = 'glm-4-flash',
    maxTokens = 4096,
    system = null
  } = options

  if (!apiKey) throw new Error('智谱 API Key 未配置')

  const msgs = system
    ? [{ role: 'system', content: system }, ...messages]
    : messages

  const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
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
    if (response.status === 401) throw new Error('智谱 API Key 无效，请检查')
    if (response.status === 429) throw new Error('智谱配额已用完，请稍后再试')
    throw new Error(`智谱 API 错误: ${response.status} - ${err}`)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content
  if (!text) throw new Error('智谱 GLM 返回了空内容')

  return {
    content: text,
    usage: {
      inputTokens: data.usage?.prompt_tokens || 0,
      outputTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0
    }
  }
}
