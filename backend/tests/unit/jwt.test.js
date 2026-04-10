import { beforeEach, describe, expect, test } from 'bun:test'

async function loadJwtModule() {
  return import(`../../src/utils/jwt.js?cacheBust=${Date.now()}-${Math.random()}`)
}

describe('jwt utils', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'unit-test-secret'
    process.env.NODE_ENV = 'test'
  })

  test('generateToken and verifyToken round-trip payload', async () => {
    const { generateToken, verifyToken } = await loadJwtModule()
    const token = generateToken({ userId: 42, email: 'unit@example.com' })
    const payload = verifyToken(token)

    expect(payload.userId).toBe(42)
    expect(payload.email).toBe('unit@example.com')
    expect(payload.type).toBe('access')
  })

  test('generateRefreshToken creates refresh-type payload', async () => {
    const { generateRefreshToken, verifyToken } = await loadJwtModule()
    const refreshToken = generateRefreshToken({ userId: 7 })
    const payload = verifyToken(refreshToken)

    expect(payload.userId).toBe(7)
    expect(payload.type).toBe('refresh')
  })

  test('verifyToken returns null for invalid token', async () => {
    const { verifyToken } = await loadJwtModule()
    expect(verifyToken('invalid.token.value')).toBeNull()
  })
})
