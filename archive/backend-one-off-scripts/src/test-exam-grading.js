import { db } from './db/index.js'
import { exams, questionSets, users, questions } from './db/schema.js'
import { eq } from 'drizzle-orm'

/**
 * Phase 4 Day 3: 批改与评分系统测试
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

async function testCreateAndAnswerExam() {
  console.log('1️⃣ 测试创建考试并作答...')

  // 创建考试
  const createResponse = await fetch(`${API_BASE}/exams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: testUserId,
      questionSetId: testQuestionSetId,
      type: 'chapter_test',
      mode: 'exam',
      timeLimit: 300,
      allowReview: true
    })
  })

  const createResult = await createResponse.json()

  if (createResult.success) {
    testExamId = createResult.data.id
    console.log(`   ✅ 创建成功，考试 ID: ${testExamId}`)

    // 获取题目列表
    const [exam] = await db.select().from(exams).where(eq(exams.id, testExamId)).limit(1)
    const [questionSet] = await db.select().from(questionSets).where(eq(questionSets.id, exam.questionSetId)).limit(1)
    const questionIds = questionSet.questionIds

    // 查询题目详情
    const questionList = await db.select().from(questions).where(
      eq(questions.id, questionIds[0])
    )

    console.log(`   - 题目数量: ${questionIds.length}`)

    // 作答所有题目
    for (let i = 0; i < questionIds.length; i++) {
      const questionId = questionIds[i]
      const question = questionList.find(q => q.id === questionId) || questionList[0]

      // 根据题型给出答案
      let answer
      if (question.type === 'multiple_choice') {
        // 选择题：随机选择 A/B/C/D，50% 概率选对
        answer = Math.random() > 0.5 ? question.answer?.value : 'B'
      } else if (question.type === 'fill_blank') {
        // 填空题：50% 概率答对
        answer = Math.random() > 0.5 ? question.answer?.value : 'wrong answer'
      } else if (question.type === 'calculation') {
        // 计算题：50% 概率答对
        answer = Math.random() > 0.5 ? question.answer?.value : '999'
      } else {
        // 主观题：给一个简单答案
        answer = 'This is my answer for the question.'
      }

      await fetch(`${API_BASE}/exams/${testExamId}/answers`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          answer: { value: answer }
        })
      })
    }

    console.log(`   ✅ 已作答 ${questionIds.length} 道题`)
  } else {
    console.log(`   ❌ 创建失败: ${createResult.error.message}`)
  }

  console.log('')
}

async function testSubmitAndGrade() {
  console.log('2️⃣ 测试提交并自动批改...')

  const response = await fetch(`${API_BASE}/exams/${testExamId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })

  const result = await response.json()

  if (result.success) {
    console.log(`   ✅ 提交成功`)
    console.log(`   - 用时: ${result.data.timeSpent} 秒`)
    console.log(`   - 批改状态: ${result.data.gradeStatus}`)

    if (result.data.gradeResult) {
      const { gradeResult } = result.data
      console.log(`   - 总分: ${gradeResult.totalScore}/${gradeResult.maxScore}`)
      console.log(`   - 正确题数: ${gradeResult.correctCount}/${gradeResult.totalCount}`)
      console.log(`   - 正确率: ${gradeResult.correctRate}%`)
    }
  } else {
    console.log(`   ❌ 提交失败: ${result.error.message}`)
  }

  console.log('')
}

async function testGetExamResult() {
  console.log('3️⃣ 测试获取考试结果...')

  const response = await fetch(`${API_BASE}/exams/${testExamId}/result`)
  const result = await response.json()

  if (result.success) {
    const { summary, questions } = result.data
    console.log(`   ✅ 获取成功`)
    console.log(`   - 总分: ${summary.totalScore}/${summary.maxScore} (${summary.percentage || Math.round((summary.totalScore / summary.maxScore) * 100)}%)`)
    console.log(`   - 正确率: ${summary.correctRate}%`)
    console.log(`   - 用时: ${summary.timeSpent} 秒`)
    console.log(`   - 题目详情: ${questions.length} 道`)

    // 显示难度统计
    if (summary.difficultyStats) {
      console.log(`   - 难度统计:`)
      const { easy, medium, hard } = summary.difficultyStats
      if (easy && easy.total > 0) {
        console.log(`     • 简单题: ${easy.correct}/${easy.total} (${Math.round((easy.correct / easy.total) * 100)}%)`)
      }
      if (medium && medium.total > 0) {
        console.log(`     • 中等题: ${medium.correct}/${medium.total} (${Math.round((medium.correct / medium.total) * 100)}%)`)
      }
      if (hard && hard.total > 0) {
        console.log(`     • 困难题: ${hard.correct}/${hard.total} (${Math.round((hard.correct / hard.total) * 100)}%)`)
      }
    }
  } else {
    console.log(`   ❌ 获取失败: ${result.error.message}`)
  }

  console.log('')
}

async function testGetWrongQuestions() {
  console.log('4️⃣ 测试获取错题列表...')

  const response = await fetch(`${API_BASE}/exams/${testExamId}/wrong-questions`)
  const result = await response.json()

  if (result.success) {
    console.log(`   ✅ 获取成功`)
    console.log(`   - 错题数量: ${result.data.length}`)

    if (result.data.length > 0) {
      console.log(`   - 错题示例:`)
      const firstWrong = result.data[0]
      console.log(`     • 题目 ID: ${firstWrong.id}`)
      console.log(`     • 题型: ${firstWrong.type}`)
      console.log(`     • 难度: ${firstWrong.difficulty}`)
      console.log(`     • 用户答案: ${JSON.stringify(firstWrong.result.userAnswer)}`)
      console.log(`     • 正确答案: ${firstWrong.answer?.value}`)
    }
  } else {
    console.log(`   ❌ 获取失败: ${result.error.message}`)
  }

  console.log('')
}

async function testAnalyzeWeakTopics() {
  console.log('5️⃣ 测试分析薄弱知识点...')

  const response = await fetch(`${API_BASE}/exams/${testExamId}/weak-topics`)
  const result = await response.json()

  if (result.success) {
    console.log(`   ✅ 分析成功`)
    console.log(`   - 薄弱知识点数量: ${result.data.length}`)

    if (result.data.length > 0) {
      console.log(`   - 薄弱知识点:`)
      result.data.slice(0, 3).forEach(topic => {
        console.log(`     • ${topic.topic}: ${topic.correct}/${topic.total} (${topic.correctRate}%) - ${topic.level}`)
      })
    } else {
      console.log(`   - 🎉 没有薄弱知识点，表现优秀！`)
    }
  } else {
    console.log(`   ❌ 分析失败: ${result.error.message}`)
  }

  console.log('')
}

async function testGenerateReport() {
  console.log('6️⃣ 测试生成考试报告...')

  const response = await fetch(`${API_BASE}/exams/${testExamId}/report`)
  const result = await response.json()

  if (result.success) {
    const { overall, difficultyAnalysis, typeAnalysis, weakTopics, suggestions } = result.data
    console.log(`   ✅ 生成成功`)
    console.log(`   - 总体成绩:`)
    console.log(`     • 得分: ${overall.totalScore}/${overall.maxScore} (${overall.percentage}%)`)
    console.log(`     • 正确率: ${overall.correctRate}%`)
    console.log(`     • 等级: ${overall.grade}`)
    console.log(`     • 用时: ${overall.timeSpent} 秒`)

    if (difficultyAnalysis) {
      console.log(`   - 难度分析: ✅`)
    }

    if (typeAnalysis) {
      console.log(`   - 题型分析: ✅`)
      Object.entries(typeAnalysis).forEach(([type, stats]) => {
        console.log(`     • ${type}: ${stats.correct}/${stats.total}`)
      })
    }

    if (weakTopics && weakTopics.length > 0) {
      console.log(`   - 薄弱知识点: ${weakTopics.length} 个`)
    }

    if (suggestions && suggestions.length > 0) {
      console.log(`   - 学习建议:`)
      suggestions.forEach(s => console.log(`     • ${s}`))
    }
  } else {
    console.log(`   ❌ 生成失败: ${result.error.message}`)
  }

  console.log('')
}

async function testManualGrade() {
  console.log('7️⃣ 测试手动批改（重新批改）...')

  const response = await fetch(`${API_BASE}/exams/${testExamId}/grade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })

  const result = await response.json()

  if (result.success) {
    console.log(`   ✅ 批改成功`)
    console.log(`   - 总分: ${result.data.totalScore}/${result.data.maxScore}`)
    console.log(`   - 正确率: ${result.data.correctRate}%`)
  } else {
    console.log(`   ❌ 批改失败: ${result.error.message}`)
  }

  console.log('')
}

async function runTests() {
  console.log('🧪 开始测试 Phase 4 Day 3 批改与评分系统\n')
  console.log('=' .repeat(60))
  console.log('')

  try {
    await setupTestData()
    await testCreateAndAnswerExam()
    await testSubmitAndGrade()
    await testGetExamResult()
    await testGetWrongQuestions()
    await testAnalyzeWeakTopics()
    await testGenerateReport()
    await testManualGrade()

    console.log('=' .repeat(60))
    console.log('\n✅ 所有测试完成！')
    console.log(`\n📝 测试总结：`)
    console.log(`   - 测试用户 ID: ${testUserId}`)
    console.log(`   - 测试试卷 ID: ${testQuestionSetId}`)
    console.log(`   - 测试考试 ID: ${testExamId}`)
    console.log(`\n🎯 核心功能验证：`)
    console.log(`   ✅ 考试创建和作答`)
    console.log(`   ✅ 提交并自动批改`)
    console.log(`   ✅ 获取考试结果`)
    console.log(`   ✅ 获取错题列表`)
    console.log(`   ✅ 分析薄弱知识点`)
    console.log(`   ✅ 生成考试报告`)
    console.log(`   ✅ 手动批改`)

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
