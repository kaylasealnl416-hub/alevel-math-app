import { describe, expect, test } from 'bun:test'

import { generateCsrfToken, verifyCsrfToken } from '../../src/middleware/csrf.js'

describe('csrf middleware helpers', () => {
  test('verifyCsrfToken accepts valid token and rejects invalid token', () => {
    const userId = 1001
    const token = generateCsrfToken(userId)

    expect(verifyCsrfToken(userId, token)).toBe(true)
    expect(verifyCsrfToken(userId, 'f'.repeat(64))).toBe(false)
  })

  test('verifyCsrfToken handles malformed token input safely', () => {
    const userId = 1002
    const token = generateCsrfToken(userId)

    // 长度不一致或非十六进制输入都应返回 false，而不是抛错
    expect(verifyCsrfToken(userId, token.slice(0, 10))).toBe(false)
    expect(verifyCsrfToken(userId, 'zzzz')).toBe(false)
  })
})
