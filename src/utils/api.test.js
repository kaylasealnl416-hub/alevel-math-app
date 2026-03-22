import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  parseAIResponse,
  getApiKey,
  setApiKey,
  clearApiKeys,
  STORAGE_KEYS
} from './api'

// ============================================================
// parseAIResponse — AI 返回内容解析（所有 AI 功能的基础）
// ============================================================
describe('parseAIResponse', () => {
  // ── 正常路径：纯 JSON 数组 ──
  it('解析标准 JSON 数组', () => {
    const input = '[{"id":1,"content":"test"}]'
    const result = parseAIResponse(input)
    expect(result).toEqual([{ id: 1, content: 'test' }])
  })

  it('解析多元素数组', () => {
    const input = '[{"q":"What is 2+2?"},{"q":"What is 3+3?"}]'
    const result = parseAIResponse(input)
    expect(result).toHaveLength(2)
  })

  // ── 常见情况：AI 在 JSON 前后加了文字 ──
  it('提取被文字包裹的 JSON 数组', () => {
    const input = 'Here are the questions:\n[{"id":1}]\nHope this helps!'
    const result = parseAIResponse(input)
    expect(result).toEqual([{ id: 1 }])
  })

  // ── 常见情况：AI 加了 markdown 代码块 ──
  it('去除 ```json 代码块标记', () => {
    const input = '```json\n{"key": "value"}\n```'
    const result = parseAIResponse(input)
    expect(result).toEqual({ key: 'value' })
  })

  it('去除 ``` 代码块标记（无 json 标注）', () => {
    const input = '```\n{"key": "value"}\n```'
    const result = parseAIResponse(input)
    expect(result).toEqual({ key: 'value' })
  })

  // ── 边界：嵌套数组 ──
  it('正确处理嵌套方括号', () => {
    const input = '[{"options":["A","B","C"]}]'
    const result = parseAIResponse(input)
    expect(result[0].options).toEqual(['A', 'B', 'C'])
  })

  // ── 异常路径 ──
  it('完全无效的文本抛出错误', () => {
    expect(() => parseAIResponse('This is not JSON at all'))
      .toThrow('Failed to parse AI response')
  })

  it('空字符串抛出错误', () => {
    expect(() => parseAIResponse(''))
      .toThrow('Failed to parse AI response')
  })

  it('仅有方括号但内容无效', () => {
    expect(() => parseAIResponse('[not valid json]'))
      .toThrow('Failed to parse AI response')
  })
})

// ============================================================
// API Key 存取（localStorage）
// ============================================================
describe('API Key 管理', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  describe('getApiKey', () => {
    it('无 key 时返回 null', () => {
      expect(getApiKey('anthropic')).toBeNull()
    })

    it('默认读取 anthropic', () => {
      localStorage.setItem(STORAGE_KEYS.ANTHROPIC, 'sk-ant-123')
      expect(getApiKey()).toBe('sk-ant-123')
    })

    it('读取指定 provider', () => {
      localStorage.setItem(STORAGE_KEYS.ZHIPU, 'zhipu-key')
      expect(getApiKey('zhipu')).toBe('zhipu-key')
    })

    it('未知 provider 回退到 anthropic', () => {
      localStorage.setItem(STORAGE_KEYS.ANTHROPIC, 'sk-fallback')
      expect(getApiKey('unknown')).toBe('sk-fallback')
    })
  })

  describe('setApiKey', () => {
    it('设置后可以读取', () => {
      setApiKey('minimax', 'mm-key-123')
      expect(getApiKey('minimax')).toBe('mm-key-123')
    })

    it('空值清除 key', () => {
      setApiKey('anthropic', 'sk-test')
      setApiKey('anthropic', '')
      expect(getApiKey('anthropic')).toBeNull()
    })

    it('null 值清除 key', () => {
      setApiKey('zhipu', 'key')
      setApiKey('zhipu', null)
      expect(getApiKey('zhipu')).toBeNull()
    })
  })

  describe('clearApiKeys', () => {
    it('清除所有 provider 的 key', () => {
      setApiKey('anthropic', 'a')
      setApiKey('minimax', 'b')
      setApiKey('zhipu', 'c')
      clearApiKeys()
      expect(getApiKey('anthropic')).toBeNull()
      expect(getApiKey('minimax')).toBeNull()
      expect(getApiKey('zhipu')).toBeNull()
    })
  })
})
