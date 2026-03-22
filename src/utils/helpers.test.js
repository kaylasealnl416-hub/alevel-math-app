import { describe, it, expect } from 'vitest'
import {
  formatDuration,
  getDifficultyInfo,
  getDifficultyLabel
} from './helpers'

// ============================================================
// formatDuration
// ============================================================
describe('formatDuration', () => {
  // ── 正常路径 ──
  it('纯秒数 → m:ss', () => {
    expect(formatDuration(5)).toBe('0:05')
    expect(formatDuration(59)).toBe('0:59')
  })

  it('分+秒 → m:ss', () => {
    expect(formatDuration(65)).toBe('1:05')
    expect(formatDuration(600)).toBe('10:00')
    expect(formatDuration(3599)).toBe('59:59')
  })

  it('含小时 → h:mm:ss', () => {
    expect(formatDuration(3600)).toBe('1:00:00')
    expect(formatDuration(3661)).toBe('1:01:01')
    expect(formatDuration(7200)).toBe('2:00:00')
  })

  // ── 边界值 ──
  it('0 秒 → 0:00', () => {
    expect(formatDuration(0)).toBe('0:00')
  })

  it('null → 空字符串', () => {
    expect(formatDuration(null)).toBe('')
  })

  it('undefined → 空字符串', () => {
    expect(formatDuration(undefined)).toBe('')
  })

  it('NaN → -', () => {
    expect(formatDuration(NaN)).toBe('-')
  })
})

// ============================================================
// getDifficultyInfo
// ============================================================
describe('getDifficultyInfo', () => {
  it('1-5 每个级别都返回正确的 text 和 color', () => {
    expect(getDifficultyInfo(1).text).toBe('Very Easy')
    expect(getDifficultyInfo(2).text).toBe('Easy')
    expect(getDifficultyInfo(3).text).toBe('Medium')
    expect(getDifficultyInfo(4).text).toBe('Hard')
    expect(getDifficultyInfo(5).text).toBe('Very Hard')
  })

  it('颜色符合设计规范', () => {
    expect(getDifficultyInfo(1).color).toBe('#188038')  // 成功色
    expect(getDifficultyInfo(4).color).toBe('#d93025')  // 错误色
  })

  it('无效值回退到 Medium', () => {
    expect(getDifficultyInfo(0).text).toBe('Medium')
    expect(getDifficultyInfo(99).text).toBe('Medium')
    expect(getDifficultyInfo(undefined).text).toBe('Medium')
  })
})

// ============================================================
// getDifficultyLabel
// ============================================================
describe('getDifficultyLabel', () => {
  it('返回文本而不是对象', () => {
    expect(getDifficultyLabel(1)).toBe('Very Easy')
    expect(typeof getDifficultyLabel(3)).toBe('string')
  })
})
