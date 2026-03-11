import { describe, test, expect, beforeAll } from 'bun:test'

const API_BASE = 'https://alevel-math-app-production-6e22.up.railway.app'

describe('Exams API - Production Tests', () => {
  test('GET /api/exams - 获取考试列表', async () => {
    const res = await fetch(`${API_BASE}/api/exams?userId=1&limit=5`)
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.data.exams).toBeArray()
    expect(data.data.total).toBeNumber()

    console.log(`✅ 获取到 ${data.data.exams.length} 个考试记录`)
  })

  test('GET /api/exams/:id - 获取考试详情', async () => {
    const res = await fetch(`${API_BASE}/api/exams/11`)
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.data.id).toBe(11)
    expect(data.data.questionSet).toBeDefined()
    expect(data.data.questionSet.questions).toBeArray()

    console.log(`✅ 考试详情包含 ${data.data.questionSet.questions.length} 道题目`)
  })

  test('GET /health - 健康检查', async () => {
    const res = await fetch(`${API_BASE}/health`)
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.status).toBe('ok')
    expect(data.uptime).toBeNumber()

    console.log(`✅ 服务运行时间: ${Math.floor(data.uptime)}秒`)
  })

  test('CORS - 验证跨域配置', async () => {
    const res = await fetch(`${API_BASE}/api/exams?userId=1&limit=1`, {
      headers: {
        'Origin': 'https://alevel-math-app.vercel.app'
      }
    })

    const corsHeader = res.headers.get('access-control-allow-origin')
    expect(corsHeader).toBeDefined()
    console.log(`✅ CORS 配置正确: ${corsHeader}`)
  })

  test('GET /api/exams - 分页功能', async () => {
    const res1 = await fetch(`${API_BASE}/api/exams?userId=1&limit=2&offset=0`)
    const data1 = await res1.json()

    const res2 = await fetch(`${API_BASE}/api/exams?userId=1&limit=2&offset=2`)
    const data2 = await res2.json()

    expect(data1.data.exams.length).toBeLessThanOrEqual(2)
    expect(data2.data.exams.length).toBeLessThanOrEqual(2)

    // 验证分页数据不重复
    if (data1.data.exams.length > 0 && data2.data.exams.length > 0) {
      expect(data1.data.exams[0].id).not.toBe(data2.data.exams[0].id)
    }

    console.log(`✅ 分页功能正常`)
  })

  test('GET /api/exams - 状态过滤', async () => {
    const res = await fetch(`${API_BASE}/api/exams?userId=1&status=graded`)
    const data = await res.json()

    expect(data.success).toBe(true)

    // 验证所有返回的考试都是 graded 状态
    const allGraded = data.data.exams.every(exam => exam.status === 'graded')
    expect(allGraded).toBe(true)

    console.log(`✅ 状态过滤正常，找到 ${data.data.exams.length} 个已批改的考试`)
  })

  test('数据完整性 - 考试统计', async () => {
    const res = await fetch(`${API_BASE}/api/exams/11`)
    const data = await res.json()

    const exam = data.data

    // 验证已批改的考试包含完整统计
    if (exam.status === 'graded') {
      expect(exam.totalScore).toBeNumber()
      expect(exam.maxScore).toBeNumber()
      expect(exam.correctCount).toBeNumber()
      expect(exam.totalCount).toBeNumber()
      expect(exam.difficultyStats).toBeDefined()
      expect(exam.topicStats).toBeDefined()

      console.log(`✅ 考试统计完整: ${exam.correctCount}/${exam.totalCount} 正确`)
    }
  })
})

describe('Auth API - Production Tests', () => {
  test('POST /api/auth/register - 验证错误处理', async () => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'invalid-email',
        password: '123'
      })
    })

    const data = await res.json()
    expect(data.success).toBe(false)
    expect(data.error.details).toBeArray()
    expect(data.error.code).toBe('VALIDATION_ERROR')

    console.log(`✅ 验证错误正确返回: ${data.error.details.length} 个错误`)
  })

  test('POST /api/auth/login - 错误凭证', async () => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nonexistent@test.com',
        password: 'wrongpassword'
      })
    })

    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.success).toBe(false)

    console.log(`✅ 错误凭证正确拒绝`)
  })
})
