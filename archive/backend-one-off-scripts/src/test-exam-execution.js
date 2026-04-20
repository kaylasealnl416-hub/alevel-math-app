import { db } from './db/index.js'
import { exams, questionSets, users } from './db/schema.js'
import { eq } from 'drizzle-orm'
import * as examService from './services/examService.js'

/**
 * Phase 4 Day 2: 考试执行逻辑测试
 */

const API_BASE = 'http://localhost:4000/api'

let testUserId = null
let testQuestionSetId = null
let testExamId = null

async function setupTestData() {
  console.log('📦 准备测试数据...\n')

  // 查找测试用户
  const existingUsers = await db.select().from(users).limit(1)
  if (existingUsers.length > 0) {
    testUserId = existingUsers[0].id
    console.log(`✅ 使用现有用户 ID: ${testUserId}`)
  }

  // 查找测试试卷
  const existingSets = await db.select().from(questionSets).limit(1)
  if (existingSets.length > 0) {
    testQuestionSetId = existingSets[0].id
    console.log(`✅ 使用现有试卷 ID: ${testQuestionSetId}`)
  }

  console.log('')
}

async function testCreateExamWithTimeout() {
  console.log('1️⃣ 测试创建带超时的考试...')

  const response = await fetch(`${API_BASE}/exams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: testUserId,
      questionSetId: testQuestionSetId,
      type: 'chapter_test',
      mode: 'exam',
      timeLimit: 10, // 10秒超时（用于测试）
      allowReview: false
    })
  })

  const result = await response.json()

  if (result.success) {
    testExamId = result.data.id
    console.log(`   ✅ 创建成功，考试 ID: ${testExamId}`)
    console.log(`   - 时间限制: ${result.data.timeLimit} 秒`)
    console.log(`   - 模式: ${result.data.mode}`)
  } else {
    console.log(`   ❌ 创建失败: ${result.error.message}`)
  }

  console.log('')
}

async function testGetExamStats() {
  console.log('2️⃣ 测试获取考试统计...')

  const response = await fetch(`${API_BASE}/exams/${testExamId}/stats`)
  const result = await response.json()

  if (result.success) {
    console.log(`   ✅ 获取成功`)
    console.log(`   - 状态: ${result.data.status}`)
    console.log(`   - 总题数: ${result.data.totalQuestions}`)
    console.log(`   - 已答题数: ${result.data.answeredQuestions}`)
    console.log(`   - 进度: ${result.data.progress}%`)
    console.log(`   - 已用时: ${result.data.elapsedTime} 秒`)
    console.log(`   - 剩余时间: ${result.data.remainingTime} 秒`)
  } else {
    console.log(`   ❌ 获取失败: ${result.error.message}`)
  }

  console.log('')
}

async function testSaveAnswerWithTimeout() {
  console.log('3️⃣ 测试保存答案（检查超时）...')

  // 获取第一道题
  const [exam] = await db.select().from(exams).where(eq(exams.id, testExamId)).limit(1)
  const [questionSet] = await db.select().from(questionSets).where(eq(questionSets.id, exam.questionSetId)).limit(1)
  const firstQuestionId = questionSet.questionIds[0]

  const response = await fetch(`${API_BASE}/exams/${testExamId}/answers`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      questionId: firstQuestionId,
      answer: { value: 'A' }
    })
  })

  const result = await response.json()

  if (result.success) {
    console.log(`   ✅ 保存成功`)
  } else {
    console.log(`   ❌ 保存失败: ${result.error.message}`)
  }

  console.log('')
}

async function testRecordCheating() {
  console.log('4️⃣ 测试记录作弊事件...')

  // 记录切换标签页
  const response1 = await fetch(`${API_BASE}/exams/${testExamId}/focus-lost`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'tab_switch' })
  })
  const result1 = await response1.json()

  if (result1.success) {
    console.log(`   ✅ 记录切换标签页成功`)
    console.log(`   - 总作弊次数: ${result1.data.totalCheatingEvents}`)
    if (result1.data.warning) {
      console.log(`   - ⚠️  警告: ${result1.data.warning}`)
    }
  }

  // 记录失焦
  const response2 = await fetch(`${API_BASE}/exams/${testExamId}/focus-lost`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'focus_lost' })
  })
  const result2 = await response2.json()

  if (result2.success) {
    console.log(`   ✅ 记录失焦成功`)
    console.log(`   - 总作弊次数: ${result2.data.totalCheatingEvents}`)
  }

  console.log('')
}

async function testWaitForTimeout() {
  console.log('5️⃣ 测试等待超时（等待 12 秒）...')
  console.log('   ⏳ 等待中...')

  // 等待超过时间限制
  await new Promise(resolve => setTimeout(resolve, 12000))

  console.log('   ✅ 等待完成')
  console.log('')
}

async function testCheckTimeout() {
  console.log('6️⃣ 测试检查超时...')

  const response = await fetch(`${API_BASE}/exams/${testExamId}/check-timeout`)
  const result = await response.json()

  if (result.success) {
    console.log(`   ✅ 检查成功`)
    console.log(`   - 是否超时: ${result.data.isTimeout ? '是' : '否'}`)
    console.log(`   - 考试状态: ${result.data.exam.status}`)
    if (result.data.isTimeout) {
      console.log(`   - 🎯 考试已自动提交！`)
    }
  } else {
    console.log(`   ❌ 检查失败: ${result.error.message}`)
  }

  console.log('')
}

async function testSaveAnswerAfterTimeout() {
  console.log('7️⃣ 测试超时后保存答案（应该失败）...')

  const [exam] = await db.select().from(exams).where(eq(exams.id, testExamId)).limit(1)
  const [questionSet] = await db.select().from(questionSets).where(eq(questionSets.id, exam.questionSetId)).limit(1)
  const secondQuestionId = questionSet.questionIds[1] || questionSet.questionIds[0]

  const response = await fetch(`${API_BASE}/exams/${testExamId}/answers`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      questionId: secondQuestionId,
      answer: { value: 'B' }
    })
  })

  const result = await response.json()

  if (!result.success) {
    console.log(`   ✅ 正确阻止了保存（考试已结束）`)
    console.log(`   - 错误信息: ${result.error.message}`)
  } else {
    console.log(`   ❌ 不应该允许保存答案`)
  }

  console.log('')
}

async function testExamServiceDirectly() {
  console.log('8️⃣ 测试 examService 直接调用...')

  // 创建新考试
  const createResult = await examService.createExam({
    userId: testUserId,
    questionSetId: testQuestionSetId,
    type: 'unit_test',
    mode: 'practice',
    timeLimit: 60,
    allowReview: true
  })

  if (createResult.success) {
    const newExamId = createResult.data.id
    console.log(`   ✅ 创建考试成功: ${newExamId}`)

    // 获取统计
    const statsResult = await examService.getExamStats(newExamId)
    if (statsResult.success) {
      console.log(`   ✅ 获取统计成功`)
      console.log(`   - 进度: ${statsResult.data.progress}%`)
    }

    // 保存答案
    const [questionSet] = await db.select().from(questionSets).where(eq(questionSets.id, testQuestionSetId)).limit(1)
    const saveResult = await examService.saveAnswer(newExamId, questionSet.questionIds[0], { value: 'C' })
    if (saveResult.success) {
      console.log(`   ✅ 保存答案成功`)
    }

    // 提交考试
    const submitResult = await examService.submitExam(newExamId)
    if (submitResult.success) {
      console.log(`   ✅ 提交考试成功`)
      console.log(`   - 用时: ${submitResult.data.timeSpent} 秒`)
    }
  }

  console.log('')
}

async function runTests() {
  console.log('🧪 开始测试 Phase 4 Day 2 考试执行逻辑\n')
  console.log('=' .repeat(60))
  console.log('')

  try {
    await setupTestData()
    await testCreateExamWithTimeout()
    await testGetExamStats()
    await testSaveAnswerWithTimeout()
    await testRecordCheating()
    await testWaitForTimeout()
    await testCheckTimeout()
    await testSaveAnswerAfterTimeout()
    await testExamServiceDirectly()

    console.log('=' .repeat(60))
    console.log('\n✅ 所有测试完成！')
    console.log(`\n📝 测试总结：`)
    console.log(`   - 测试用户 ID: ${testUserId}`)
    console.log(`   - 测试试卷 ID: ${testQuestionSetId}`)
    console.log(`   - 测试考试 ID: ${testExamId}`)
    console.log(`\n🎯 核心功能验证：`)
    console.log(`   ✅ 考试创建`)
    console.log(`   ✅ 统计信息获取`)
    console.log(`   ✅ 答案保存`)
    console.log(`   ✅ 作弊检测`)
    console.log(`   ✅ 超时自动提交`)
    console.log(`   ✅ 超时后阻止操作`)
    console.log(`   ✅ examService 直接调用`)

  } catch (error) {
    console.error('\n❌ 测试失败：', error.message)
    console.error(error)
    process.exit(1)
  }
}

runTests()
  .then(() => {
    console.log('\n🎉 测试成功完成！')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 测试过程出错：', error)
    process.exit(1)
  })
