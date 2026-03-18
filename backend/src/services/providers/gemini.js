// Gemini (Google) provider
export const GEMINI_MODELS = [
  { id: 'gemini-2.5-pro-preview-06-05', name: 'Gemini 2.5 Pro (最强)' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (推荐)' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (快速)' },
]

export async function callGemini(messages, options = {}) {
  const {
    apiKey,
    model = 'gemini-2.0-flash',
    maxTokens = 4096,
    system = null
  } = options

  if (!apiKey) throw new Error('Gemini API Key 未配置')

  // Gemini 格式转换
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }))

  const body = {
    contents,
    generationConfig: { maxOutputTokens: maxTokens }
  }
  if (system) {
    body.systemInstruction = { parts: [{ text: system }] }
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const err = await response.text()
    if (response.status === 400 || response.status === 403) throw new Error('Gemini API Key 无效，请检查')
    if (response.status === 429) throw new Error('Gemini 配额已用完，请稍后再试')
    throw new Error(`Gemini API 错误: ${response.status} - ${err}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  const usage = data.usageMetadata || {}

  return {
    content: text,
    usage: {
      inputTokens: usage.promptTokenCount || 0,
      outputTokens: usage.candidatesTokenCount || 0,
      totalTokens: usage.totalTokenCount || 0
    }
  }
}
