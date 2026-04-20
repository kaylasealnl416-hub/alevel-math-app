import { db } from './db/index.js'
import { exams, questionSets, users, questions } from './db/schema.js'
import { eq } from 'drizzle-orm'

/**
 * Phase 4 考试管理 API 测试脚本
 */

const API_BASE = 'http://localhost:4000/api'

// 测试用户和试卷 ID（需要先创建）
let testUserId = null
let testQuestionSetId = null
let testExamId = null

async function setupTestData() {
  console.log('📦 准备测试数据...\n')

  // 1. 查找或创建测试用户
  const existingUsers = await db.select().from(users).limit(1)
  if (existingUsers.length > 0) {
    testUserId = existingUsers[0].id
    console.log(`✅ 使用现有用户 ID: ${testUserId}`)
  } else {
    const [user] = await db.insert(users).values({
      email: 'test-exam@example.com',
      nickname: 'Test Exam User',
      grade: 'AS'
    }).returning()
    testUserId = user.id
    console.log(`✅ 创建测试用户 ID: ${testUserId}`)
  }

  // 2. 查找或创建测试试卷
  const existingSets = await db.select().from(questionSets).limit(1)
  if (existingSets.length > 0) {
    testQuestionSetId = existingSets[0].id
    console.log(`✅ 使用现有试卷 ID: ${testQuestionSetId}`)
  } else {
    // 查找一些题目
    const testQuestions = await db.select().from(questions).limit(5)
    if (testQuestions.length === 0) {
      console.log('❌ 没有找到题目，请先运行题库数据导入')
      process.exit(1)
    }

    const [questionSet] = await db.insert(questionSets).values({
      title: '测试试卷',
      description: '用于测试考试系统',
      type: 'practice',
      questionIds: testQuestions.map(q => q.id),
      totalQuestions: testQuestions.length,
      totalPoints: 100,
      timeLimit: 30,
      generatedBy: 'manual'
    }).returning()
    testQuestionSetId = questionSet.id
    console.log(`✅ 创建测试试卷 ID: ${testQuestionSetId}`)
  }

  console.log('')
}

async function testCreateExam() {
  console.log('1️⃣ 测试创建考试...')

  const response = await fetch(`${API_BASE}/exams`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: testUserId,
      questionSetId: testQuestionSetId,
      type: 'chapter_test',
      mode: 'exam',
      timeLimit: 1800,
      allowReview: true
    })
  })

  const result = await response.json()

  if (result.success) {
    testExamId = result.data.id
    console.log(`   ✅ 创建成功，考试 ID: ${testExamId}`)
    console.log(`   - 状态: ${result.data.status}`)
    console.log(`   - 开始时间: ${result.data.startedAt}`)
  } else {
    console.log(`   ❌ 创建失败: ${result.error.message}`)
  }

  console.log('')
}

async function testGetExamDetail() {
  console.log('2️⃣ 测试获取考试详情...')

  const response = await fetch(`${API_BASE}/exams/${testExamId}`)
  const result = await response.json()

  if (result.success) {
    console.log(`   ✅ 获取成功`)
    console.log(`   - 考试 ID: ${result.data.id}`)
    console.log(`   - 试卷标题: ${result.data.questionSet.title}`)
    console.log(`   - 题目数量: ${result.data.questionSet.questions.length}`)
  } else {
    console.log(`   ❌ 获取失败: ${result.error.message}`)
  }

  console.log('')
}

async function testSaveAnswer() {
  console.log('3️⃣ 测试保存答案...')

  // 获取第一道题的 ID
  const [exam] = await db.select().from(exams).where(eq(exams.id, testExamId)).limit(1)
  const [questionSet] = await db.select().from(questionSets).where(eq(questionSets.id, exam.questionSetId)).limit(1)
  const firstQuestionId = questionSet.questionIds[0]

  const response = await fetch(`${API_BASE}/exams/${testExamId}/answers`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      questionId: firstQuestionId,
      answer: { value: 'A' }
    })
  })

  const result = await response.json()

  if (result.success) {
    console.log(`   ✅ 保存成功`)
    console.log(`   - 题目 ID: ${firstQuestionId}`)
    console.log(`   - 答案: A`)
  } else {
    console.log(`   ❌ 保存失败: ${result.error.message}`)
  }

  console.log('')
}

async function testMarkQuestion() {
  console.log('4️⃣ 测试标记题目...')

  const [exam] = await db.select().from(exams).where(eq(exams.id, testExamId)).limit(1)
  const [questionSet] = await db.select().from(questionSets).where(eq(questionSets.id, exam.questionSetId)).limit(1)
  const firstQuestionId = questionSet.questionIds[0]

  const response = await fetch(`${API_BASE}/exams/${testExamId}/mark`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      questionId: firstQuestionId,
      marked: true
    })
  })

  const result = await response.json()

  if (result.success) {
    console.log(`   ✅ 标记成功`)
  } else {
    console.log(`   ❌ 标记失败: ${result.error.message}`)
  }

  console.log('')
}

async function testRecordFocusLost() {
  console.log('5️⃣ 测试记录失焦事件...')

  const response = await fetch(`${API_BASE}/exams/${testExamId}/focus-lost`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'tab_switch'
    })
  })

  const result = await response.json()

  if (result.success) {
    console.log(`   ✅ 记录成功`)
  } else {
    console.log(`   ❌ 记录失败: ${result.error.message}`)
  }

  console.log('')
}

async function testSubmitExam() {
  console.log('6️⃣ 测试提交考试...')

  const response = await fetch(`${API_BASE}/exams/${testExamId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })

  const result = await response.json()

  if (result.success) {
    console.log(`   ✅ 提交成功`)
    console.log(`   - 用时: ${result.data.timeSpent} 秒`)
  } else {
    console.log(`   ❌ 提交失败: ${result.error.message}`)
  }

  console.log('')
}

async function testGetExamResult() {
  console.log('7️⃣ 测试获取考试结果...')

  const response = await fetch(`${API_BASE}/exams/${testExamId}/result`)
  const result = await response.json()

  if (result.success) {
    console.log(`   ✅ 获取成功`)
    console.log(`   - 考试状态: ${result.data.exam.status}`)
    console.log(`   - 提交时间: ${result.data.exam.submittedAt}`)
    console.log(`   - 用时: ${result.data.exam.timeSpent} 秒`)
  } else {
    console.log(`   ❌ 获取失败: ${result.error.message}`)
  }

  console.log('')
}

async function testGetExamList() {
  console.log('8️⃣ 测试获取考试列表...')

  const response = await fetch(`${API_BASE}/exams?userId=${testUserId}&limit=10`)
  const result = await response.json()

  if (result.success) {
    console.log(`   ✅ 获取成功`)
    console.log(`   - 总数: ${result.data.total}`)
    console.log(`   - 返回: ${result.data.exams.length} 条`)
  } else {
    console.log(`   ❌ 获取失败: ${result.error.message}`)
  }

  console.log('')
}

async function runTests() {
  console.log('🧪 开始测试 Phase 4 考试管理 API\n')
  console.log('=' .repeat(50))
  console.log('')

  try {
    // 准备测试数据
    await setupTestData()

    // 运行测试
    await testCreateExam()
    await testGetExamDetail()
    await testSaveAnswer()
    await testMarkQuestion()
    await testRecordFocusLost()
    await testSubmitExam()
    await testGetExamResult()
    await testGetExamList()

    console.log('=' .repeat(50))
    console.log('\n✅ 所有测试完成！')
    console.log(`\n📝 测试总结：`)
    console.log(`   - 测试用户 ID: ${testUserId}`)
    console.log(`   - 测试试卷 ID: ${testQuestionSetId}`)
    console.log(`   - 测试考试 ID: ${testExamId}`)

  } catch (error) {
    console.error('\n❌ 测试失败：', error.message)
    console.error(error)
    process.exit(1)
  }
}

// 运行测试
runTests()
  .then(() => {
    console.log('\n🎉 测试成功完成！')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 测试过程出错：', error)
    process.exit(1)
  })
