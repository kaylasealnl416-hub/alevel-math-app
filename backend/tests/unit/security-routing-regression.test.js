import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const indexSource = readFileSync(join(import.meta.dir, '../../src/index.js'), 'utf8')
const authSource = readFileSync(join(import.meta.dir, '../../src/routes/auth.js'), 'utf8')

describe('security routing regression checks', () => {
  test('protected base paths are registered alongside wildcard paths', () => {
    expect(indexSource).toContain("app.use('/api/question-sets', authMiddleware, csrfProtection())")
    expect(indexSource).toContain("app.use('/api/user-answers', authMiddleware, csrfProtection())")
    expect(indexSource).toContain("app.use('/api/learning-plans', authMiddleware, csrfProtection())")
    expect(indexSource).toContain("app.use('/api/wrong-questions', authMiddleware, csrfProtection())")
  })

  test('/api/auth/me uses authMiddleware and /refresh has dedicated rate limit', () => {
    expect(indexSource).toContain("app.use('/api/auth/me', authMiddleware)")
    expect(indexSource).toContain("app.use('/api/auth/refresh', rateLimiter(")
  })

  test('/refresh only accepts refresh token type', () => {
    expect(authSource).toContain("if (!payload || payload.type !== 'refresh')")
  })
})
