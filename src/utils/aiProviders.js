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
    description: "Anthropic's advanced reasoning model family",
    models: [
      { id: 'claude-opus-4-5', name: 'Claude Opus 4.5 (Most capable)' },
      { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5 (Recommended)' },
      { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5 (Fast)' },
    ],
    defaultModel: 'claude-sonnet-4-5',
    keyPlaceholder: 'sk-ant-...',
    keyUrl: 'https://console.anthropic.com/settings/keys'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    description: "Google's multimodal model family",
    models: [
      { id: 'gemini-2.5-pro-preview-06-05', name: 'Gemini 2.5 Pro (Most capable)' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Recommended)' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Fast)' },
    ],
    defaultModel: 'gemini-2.0-flash',
    keyPlaceholder: 'AIza...',
    keyUrl: 'https://aistudio.google.com/apikey'
  },
  {
    id: 'openai',
    name: 'ChatGPT',
    description: "OpenAI's general-purpose model family",
    models: [
      { id: 'gpt-4o', name: 'GPT-4o (Most capable)' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Recommended)' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
    ],
    defaultModel: 'gpt-4o-mini',
    keyPlaceholder: 'sk-...',
    keyUrl: 'https://platform.openai.com/api-keys'
  },
  {
    id: 'glm',
    name: 'Zhipu GLM',
    description: "Zhipu's GLM model family",
    models: [
      { id: 'glm-4-plus', name: 'GLM-4 Plus (Most capable)' },
      { id: 'glm-4-flash', name: 'GLM-4 Flash (Recommended)' },
      { id: 'glm-4-long', name: 'GLM-4 Long (Long context)' },
    ],
    defaultModel: 'glm-4-flash',
    keyPlaceholder: 'Get a key from Zhipu AI',
    keyUrl: 'https://open.bigmodel.cn/usercenter/apikeys'
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    description: 'MiniMax model family with strong cost-performance',
    models: [
      { id: 'abab6.5s-chat', name: 'ABAB 6.5s (Recommended)' },
      { id: 'abab6.5-chat', name: 'ABAB 6.5' },
      { id: 'abab5.5-chat', name: 'ABAB 5.5 (Fast)' },
    ],
    defaultModel: 'abab6.5s-chat',
    keyPlaceholder: 'Get a key from MiniMax',
    keyUrl: 'https://platform.minimaxi.com/user-center/basic-information/interface-key'
  },
  {
    id: 'kimi',
    name: 'Kimi',
    description: "Moonshot's long-context model family",
    models: [
      { id: 'moonshot-v1-128k', name: 'Moonshot 128K (Most capable)' },
      { id: 'moonshot-v1-32k', name: 'Moonshot 32K' },
      { id: 'moonshot-v1-8k', name: 'Moonshot 8K (Fast)' },
    ],
    defaultModel: 'moonshot-v1-128k',
    keyPlaceholder: 'sk-...',
    keyUrl: 'https://platform.moonshot.cn/console/api-keys'
  },
  {
    id: 'qwen',
    name: 'Qwen',
    description: "Alibaba's Qwen model family",
    models: [
      { id: 'qwen-max', name: 'Qwen Max (Most capable)' },
      { id: 'qwen-plus', name: 'Qwen Plus (Recommended)' },
      { id: 'qwen-turbo', name: 'Qwen Turbo (Fast)' },
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
  if (!settings?.provider || !settings?.apiKey) return 'Default (Zhipu GLM)'
  const p = AI_PROVIDERS.find(p => p.id === settings.provider)
  return p ? p.name : settings.provider
}
