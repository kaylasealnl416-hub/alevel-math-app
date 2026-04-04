import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { saveAISettings, clearAISettings } from './aiProviders'

// mock fetch
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// 动态 import callAI 以确保 mock 生效
let callAI
beforeEach(async () => {
  const mod = await import('./callAI')
  callAI = mod.callAI
  localStorage.clear()
  mockFetch.mockReset()
})

afterEach(() => {
  localStorage.clear()
})

describe('callAI', () => {
  // ── 基本调用 ──
  it('无用户设置时不携带 provider/apiKey', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, data: { text: 'hello' } })
    })

    const result = await callAI('system prompt', 'user prompt', 1000)

    expect(result).toBe('hello')
    const body = JSON.parse(mockFetch.mock.calls[0][1].body)
    expect(body.system).toBe('system prompt')
    expect(body.prompt).toBe('user prompt')
    expect(body.maxTokens).toBe(1000)
    expect(body.provider).toBeUndefined()
    expect(body.apiKey).toBeUndefined()
  })

  it('设置有 provider 但无 apiKey 时不注入', async () => {
    saveAISettings({ provider: 'claude', apiKey: '', model: 'claude-sonnet-4-5' })

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, data: { text: 'default' } })
    })

    await callAI('sys', 'hi')

    const body = JSON.parse(mockFetch.mock.calls[0][1].body)
    expect(body.provider).toBeUndefined()
  })

  // ── 默认 maxTokens ──
  it('maxTokens 默认 1500', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, data: { text: 'ok' } })
    })

    await callAI('sys', 'prompt')

    const body = JSON.parse(mockFetch.mock.calls[0][1].body)
    expect(body.maxTokens).toBe(1500)
  })

  // ── 错误处理 ──
  it('HTTP 错误抛出带 message 的 Error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: { message: 'API Key 无效' } })
    })

    await expect(callAI('sys', 'prompt')).rejects.toThrow('API Key 无效')
  })

  it('success: false 抛出错误', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: false, error: { message: '生成失败' } })
    })

    await expect(callAI('sys', 'prompt')).rejects.toThrow('生成失败')
  })

  it('HTTP 错误且 body 解析失败时使用 status fallback', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('not json'))
    })

    await expect(callAI('sys', 'prompt')).rejects.toThrow('AI request failed (500)')
  })
})
