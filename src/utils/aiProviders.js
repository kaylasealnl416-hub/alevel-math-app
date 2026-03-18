// ============================================================
// AI 提供商前端配置
// localStorage 存储用户的 provider + apiKey + model 选择
// ============================================================

const STORAGE_KEY = 'ai_settings'

// 提供商配置（与后端 providers 对应）
export const AI_PROVIDERS = [
  {
    id: 'claude',
    name: 'Claude',
    description: 'Anthropic 出品，推理能力极强',
    models: [
      { id: 'claude-opus-4-5', name: 'Claude Opus 4.5 (最强)' },
      { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5 (推荐)' },
      { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5 (快速)' },
    ],
    defaultModel: 'claude-sonnet-4-5',
    keyPlaceholder: 'sk-ant-...',
    keyUrl: 'https://console.anthropic.com/settings/keys'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    description: 'Google 出品，多模态能力强',
    models: [
      { id: 'gemini-2.5-pro-preview-06-05', name: 'Gemini 2.5 Pro (最强)' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (推荐)' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (快速)' },
    ],
    defaultModel: 'gemini-2.0-flash',
    keyPlaceholder: 'AIza...',
    keyUrl: 'https://aistudio.google.com/apikey'
  },
  {
    id: 'openai',
    name: 'ChatGPT',
    description: 'OpenAI 出品，业界标杆',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o (最强)' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini (推荐)' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
    ],
    defaultModel: 'gpt-4o-mini',
    keyPlaceholder: 'sk-...',
    keyUrl: 'https://platform.openai.com/api-keys'
  },
  {
    id: 'glm',
    name: '智谱 GLM',
    description: '国产大模型，中文能力强',
    models: [
      { id: 'glm-4-plus', name: 'GLM-4 Plus (最强)' },
      { id: 'glm-4-flash', name: 'GLM-4 Flash (推荐)' },
      { id: 'glm-4-long', name: 'GLM-4 Long (长文本)' },
    ],
    defaultModel: 'glm-4-flash',
    keyPlaceholder: '在智谱开放平台获取',
    keyUrl: 'https://open.bigmodel.cn/usercenter/apikeys'
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    description: '国产大模型，性价比高',
    models: [
      { id: 'abab6.5s-chat', name: 'ABAB 6.5s (推荐)' },
      { id: 'abab6.5-chat', name: 'ABAB 6.5' },
      { id: 'abab5.5-chat', name: 'ABAB 5.5 (快速)' },
    ],
    defaultModel: 'abab6.5s-chat',
    keyPlaceholder: '在 MiniMax 开放平台获取',
    keyUrl: 'https://platform.minimaxi.com/user-center/basic-information/interface-key'
  },
  {
    id: 'kimi',
    name: 'Kimi',
    description: 'Moonshot 出品，超长上下文',
    models: [
      { id: 'moonshot-v1-128k', name: 'Moonshot 128K (最强)' },
      { id: 'moonshot-v1-32k', name: 'Moonshot 32K' },
      { id: 'moonshot-v1-8k', name: 'Moonshot 8K (快速)' },
    ],
    defaultModel: 'moonshot-v1-128k',
    keyPlaceholder: 'sk-...',
    keyUrl: 'https://platform.moonshot.cn/console/api-keys'
  },
  {
    id: 'qwen',
    name: '通义千问',
    description: '阿里出品，综合能力强',
    models: [
      { id: 'qwen-max', name: 'Qwen Max (最强)' },
      { id: 'qwen-plus', name: 'Qwen Plus (推荐)' },
      { id: 'qwen-turbo', name: 'Qwen Turbo (快速)' },
    ],
    defaultModel: 'qwen-plus',
    keyPlaceholder: 'sk-...',
    keyUrl: 'https://dashscope.console.aliyun.com/apiKey'
  },
]

/**
 * 获取用户保存的 AI 设置
 */
export function getAISettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/**
 * 保存 AI 设置
 * @param {object} settings - { provider, apiKey, model }
 */
export function saveAISettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

/**
 * 清除 AI 设置（恢复默认）
 */
export function clearAISettings() {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * 获取当前激活的提供商名称（用于 UI 展示）
 */
export function getActiveProviderName() {
  const settings = getAISettings()
  if (!settings?.provider || !settings?.apiKey) return '默认 (智谱 GLM)'
  const p = AI_PROVIDERS.find(p => p.id === settings.provider)
  return p ? p.name : settings.provider
}
