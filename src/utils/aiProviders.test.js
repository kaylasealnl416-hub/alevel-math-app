import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  AI_PROVIDERS,
  getAISettings,
  saveAISettings,
  clearAISettings,
  getActiveProviderName
} from './aiProviders'

describe('aiProviders', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  // ── 数据完整性 ──
  describe('AI_PROVIDERS 配置', () => {
    it('应有 7 个提供商', () => {
      expect(AI_PROVIDERS).toHaveLength(7)
    })

    it('每个提供商有完整的必要字段', () => {
      for (const p of AI_PROVIDERS) {
        expect(p.id).toBeTruthy()
        expect(p.name).toBeTruthy()
        expect(p.description).toBeTruthy()
        expect(p.models.length).toBeGreaterThan(0)
        expect(p.defaultModel).toBeTruthy()
        expect(p.keyPlaceholder).toBeTruthy()
        expect(p.keyUrl).toBeTruthy()
      }
    })

    it('每个提供商的 defaultModel 在 models 列表中', () => {
      for (const p of AI_PROVIDERS) {
        const ids = p.models.map(m => m.id)
        expect(ids).toContain(p.defaultModel)
      }
    })

    it('provider ID 不重复', () => {
      const ids = AI_PROVIDERS.map(p => p.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('Kimi 默认模型是 moonshot-v1-128k（最高级）', () => {
      const kimi = AI_PROVIDERS.find(p => p.id === 'kimi')
      expect(kimi.defaultModel).toBe('moonshot-v1-128k')
    })
  })

  // ── localStorage 存取 ──
  describe('getAISettings', () => {
    it('无数据时返回 null', () => {
      expect(getAISettings()).toBeNull()
    })

    it('数据损坏时返回 null 而非抛错', () => {
      localStorage.setItem('ai_settings', '{bad json')
      expect(getAISettings()).toBeNull()
    })

    it('正确读取已保存的设置', () => {
      const data = { provider: 'claude', apiKey: 'sk-test', model: 'claude-sonnet-4-5' }
      localStorage.setItem('ai_settings', JSON.stringify(data))
      expect(getAISettings()).toEqual(data)
    })
  })

  describe('saveAISettings', () => {
    it('保存后可以读取', () => {
      const data = { provider: 'openai', apiKey: 'sk-abc', model: 'gpt-4o' }
      saveAISettings(data)
      expect(getAISettings()).toEqual(data)
    })

    it('覆盖已有设置', () => {
      saveAISettings({ provider: 'a', apiKey: '1', model: 'x' })
      saveAISettings({ provider: 'b', apiKey: '2', model: 'y' })
      expect(getAISettings().provider).toBe('b')
    })
  })

  describe('clearAISettings', () => {
    it('清除后返回 null', () => {
      saveAISettings({ provider: 'test', apiKey: 'key', model: 'm' })
      clearAISettings()
      expect(getAISettings()).toBeNull()
    })

    it('无数据时调用不报错', () => {
      expect(() => clearAISettings()).not.toThrow()
    })
  })

  // ── UI 展示 ──
  describe('getActiveProviderName', () => {
    it('无设置时返回默认名', () => {
      expect(getActiveProviderName()).toBe('默认 (智谱 GLM)')
    })

    it('有 provider 无 key 时返回默认名', () => {
      saveAISettings({ provider: 'claude', apiKey: '', model: '' })
      expect(getActiveProviderName()).toBe('默认 (智谱 GLM)')
    })

    it('有完整设置时返回提供商名', () => {
      saveAISettings({ provider: 'claude', apiKey: 'sk-ant-test', model: 'claude-sonnet-4-5' })
      expect(getActiveProviderName()).toBe('Claude')
    })

    it('provider ID 不在列表中时返回 ID 本身', () => {
      saveAISettings({ provider: 'unknown', apiKey: 'key', model: '' })
      expect(getActiveProviderName()).toBe('unknown')
    })
  })
})
