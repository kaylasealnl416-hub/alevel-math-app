// ============================================================
// 题库管理 API 测试脚本
// 测试所有题目相关的 API 端点
// ============================================================

import { db } from './db/index.js'
import { questions, chapters, users } from './db/schema.js'
import { eq } from 'drizzle-orm'

const API_BASE = 'http://localhost:4000'

/**
 * 测试辅助函数
 */
async function testAPI(name, method, url, body = null, token = null) {
  console.log(`\n🧪 测试: ${name}`)
  console.log(`   ${method} ${url}`)

  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    }

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`
    }

    if (body) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      console.log(`   ✅ 成功 (${response.status})`)
      console.log(`   响应:`, JSON.stringify(data, null, 2).substring(0, 200))
      return { success: true, data }
    } else {
      console.log(`   ❌ 失败 (${response.status})`)
      console.log(`   错误:`, data)
      return { success: false, error: data }
    }
  } catch (error) {
    console.log(`   ❌ 请求失败:`, error.message)
    return { success: false, error: error.message }
  }
}

/**
 * 创建测试用户和测试数据
 */
async function setupTestData() {
  console.log('\n📦 准备测试数据...')

  try {
    // 1. 检查是否有章节数据
    const chapterList = await db.select().from(chapters).limit(1)

    if (chapterList.length === 0) {
      console.log('   ⚠️  数据库中没有章节数据，请先运行 seed 脚本')
      return null
    }

    const testChapter = chapterList[0]
    console.log(`   ✅ 找到测试章节: ${testChapter.id}`)

    // 2. 检查是否有用户
    const userList = await db.select().from(users).limit(1)

    let testUser
    if (userList.length === 0) {
      console.log('   创建测试用户...')
      const [newUser] = await db
        .insert(users)
        .values({
          email: 'test@example.com',
          nickname: '测试用户',
          createdAt: new Date()
        })
        .returning()

      testUser = newUser
      console.log(`   ✅ 创建测试用户: ${testUser.id}`)
    } else {
      testUser = userList[0]
      console.log(`   ✅ 找到测试用户: ${testUser.id}`)
    }

    return {
      chapterId: testChapter.id,
      userId: testUser.id
    }

  } catch (error) {
    console.error('   ❌ 准备测试数据失败:', error)
    return null
  }
}

/**
 * 主测试流程
 */
async function runTests() {
  console.log('🚀 开始测试题库管理 API\n')
  console.log('=' .repeat(60))

  // 准备测试数据
  const testData = await setupTestData()

  if (!testData) {
    console.log('\n❌ 无法准备测试数据，测试终止')
    process.exit(1)
  }

  const { chapterId, userId } = testData

  // 注意：实际测试需要有效的 JWT token
  // 这里我们先测试不需要认证的端点，或者跳过认证测试
  const mockToken = 'test-token' // 实际应该通过登录获取

  console.log('\n' + '='.repeat(60))
  console.log('📋 测试计划:')
  console.log('1. 获取题目列表')
  console.log('2. 创建题目')
  console.log('3. 获取题目详情')
  console.log('4. 更新题目')
  console.log('5. 审核题目')
  console.log('6. 随机获取题目')
  console.log('7. 批量导入题目')
  console.log('=' .repeat(60))

  // Test 1: 获取题目列表
  await testAPI(
    '获取题目列表',
    'GET',
    `${API_BASE}/api/questions?chapterId=${chapterId}&status=published&limit=5`
  )

  // Test 2: 创建题目（需要认证）
  const createResult = await testAPI(
    '创建题目',
    'POST',
    `${API_BASE}/api/questions`,
    {
      chapterId,
      type: 'multiple_choice',
      difficulty: 3,
      content: {
        zh: '以下哪个是供需平衡的条件？',
        en: 'Which of the following is the condition for supply-demand equilibrium?'
      },
      options: [
        'A. 供给量 > 需求量',
        'B. 供给量 < 需求量',
        'C. 供给量 = 需求量',
        'D. 供给量 ≠ 需求量'
      ],
      answer: {
        value: 'C',
        explanation: '供需平衡时，供给量等于需求量'
      },
      tags: ['供需理论', '市场均衡'],
      estimatedTime: 120
    },
    mockToken
  )

  let questionId = null
  if (createResult.success && createResult.data?.data?.id) {
    questionId = createResult.data.data.id
  }

  // Test 3: 获取题目详情
  if (questionId) {
    await testAPI(
      '获取题目详情',
      'GET',
      `${API_BASE}/api/questions/${questionId}`
    )
  }

  // Test 4: 更新题目
  if (questionId) {
    await testAPI(
      '更新题目',
      'PUT',
      `${API_BASE}/api/questions/${questionId}`,
      {
        difficulty: 4,
        tags: ['供需理论', '市场均衡', '经济学基础']
      },
      mockToken
    )
  }

  // Test 5: 审核题目
  if (questionId) {
    await testAPI(
      '审核题目',
      'PUT',
      `${API_BASE}/api/questions/${questionId}/review`,
      {
        status: 'published'
      },
      mockToken
    )
  }

  // Test 6: 随机获取题目
  await testAPI(
    '随机获取题目',
    'GET',
    `${API_BASE}/api/questions/random?chapterId=${chapterId}&count=3&difficulty=3`
  )

  // Test 7: 批量导入题目
  await testAPI(
    '批量导入题目',
    'POST',
    `${API_BASE}/api/questions/batch`,
    {
      questions: [
        {
          chapterId,
          type: 'calculation',
          difficulty: 2,
          content: {
            zh: '计算：如果需求函数为 $Q_d = 100 - 2P$，当价格 $P = 20$ 时，需求量是多少？',
            en: 'Calculate: If the demand function is $Q_d = 100 - 2P$, what is the quantity demanded when $P = 20$?'
          },
          answer: {
            value: '60',
            latex: '$Q_d = 100 - 2(20) = 60$',
            explanation: '将 P=20 代入需求函数计算'
          },
          tags: ['需求函数', '计算'],
          estimatedTime: 180,
          source: 'manual',
          status: 'draft'
        }
      ]
    },
    mockToken
  )

  console.log('\n' + '='.repeat(60))
  console.log('✅ 测试完成！')
  console.log('=' .repeat(60))

  // 清理测试数据（可选）
  if (questionId) {
    console.log('\n🧹 清理测试数据...')
    try {
      await db.delete(questions).where(eq(questions.id, questionId))
      console.log('   ✅ 已删除测试题目')
    } catch (error) {
      console.log('   ⚠️  清理失败:', error.message)
    }
  }

  process.exit(0)
}

// 运行测试
runTests().catch(error => {
  console.error('❌ 测试失败:', error)
  process.exit(1)
})
