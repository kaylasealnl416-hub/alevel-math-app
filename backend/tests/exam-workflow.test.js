/**
 * 考试流程核心测试
 * 测试刚修复的考试批改 Bug 和完整的考试流程
 */

import { db } from '../src/db/index.js'
import { users, questionSets, questions, exams } from '../src/db/schema.js'
import { eq } from 'drizzle-orm'
import { 
  createExam, 
  submitExam, 
  saveAnswer, 
  getExamDetail 
} from '../src/services/examService.js'

async function runTests() {
  console.log('🧪 考试流程核心测试\n')
  console.log('='.repeat(60))
  
  let testsPassed = 0
  let testsFailed = 0
  
  try {
    // 准备测试数据
    console.log('\n📋 准备测试数据...')
    
    // 获取测试用户
    const testUser = await db.select().from(users).limit(1)
    if (testUser.length === 0) {
      throw new Error('没有测试用户，请先运行 seed-test-data.js')
    }
    const userId = testUser[0].id
    console.log(`  ✅ 使用测试用户 ID: ${userId}`)
    
    // 获取测试试卷
    const testQuestionSet = await db.select().from(questionSets).limit(1)
    if (testQuestionSet.length === 0) {
      throw new Error('没有测试试卷')
    }
    const questionSetId = testQuestionSet[0].id
    console.log(`  ✅ 使用测试试卷 ID: ${questionSetId}`)
    
    // 获取题目
    const testQuestions = await db.select()
      .from(questions)
      .limit(3)
    
    if (testQuestions.length === 0) {
      throw new Error('没有测试题目')
    }
    console.log(`  ✅ 找到 ${testQuestions.length} 道测试题目`)
    
    // 测试 1: 创建考试
    console.log('\n📝 测试 1: 创建考试')
    const createResult = await createExam({
      userId,
      questionSetId,
      type: 'chapter_test',
      mode: 'exam',
      timeLimit: 3600
    })
    
    if (!createResult.success) {
      console.log('  ❌ 创建考试失败:', createResult.error.message)
      testsFailed++
    } else {
      console.log('  ✅ 创建考试成功')
      console.log(`     考试 ID: ${createResult.data.id}`)
      console.log(`     状态: ${createResult.data.status}`)
      testsPassed++
    }
    
    const examId = createResult.data.id
    
    // 测试 2: 保存答案
    console.log('\n📝 测试 2: 保存答案')
    let answersSaved = 0
    
    for (const question of testQuestions) {
      const saveResult = await saveAnswer(
        examId,
        question.id,
        { answer: 'A' }
      )
      
      if (saveResult.success) {
        answersSaved++
      }
    }
    
    if (answersSaved === testQuestions.length) {
      console.log(`  ✅ 成功保存 ${answersSaved} 个答案`)
      testsPassed++
    } else {
      console.log(`  ❌ 只保存了 ${answersSaved}/${testQuestions.length} 个答案`)
      testsFailed++
    }
    
    // 测试 3: 提交考试（关键测试 - 验证 Bug 修复）
    console.log('\n📝 测试 3: 提交考试并批改（Bug 修复验证）')
    const submitResult = await submitExam(examId)
    
    if (!submitResult.success) {
      console.log('  ❌ 提交考试失败:', submitResult.error.message)
      testsFailed++
    } else {
      console.log('  ✅ 提交考试成功')
      testsPassed++
      
      // 验证批改结果
      const { data } = submitResult
      console.log(`     考试 ID: ${data.examId}`)
      console.log(`     用时: ${data.timeSpent} 秒`)
      
      if (data.totalScore !== undefined && data.maxScore !== undefined) {
        console.log(`     得分: ${data.totalScore}/${data.maxScore}`)
        console.log(`     正确数: ${data.correctCount}/${data.totalCount}`)
        console.log('  ✅ 批改数据完整')
        testsPassed++
      } else {
        console.log('  ❌ 批改数据缺失（totalScore 或 maxScore 为空）')
        testsFailed++
      }
    }
    
    // 测试 4: 验证考试状态
    console.log('\n📝 测试 4: 验证考试最终状态')
    const [finalExam] = await db.select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1)
    
    console.log(`     状态: ${finalExam.status}`)
    console.log(`     总分: ${finalExam.totalScore}`)
    console.log(`     满分: ${finalExam.maxScore}`)
    
    if (finalExam.status === 'graded') {
      console.log('  ✅ 考试状态正确（graded）')
      testsPassed++
    } else {
      console.log(`  ❌ 考试状态错误（期望: graded, 实际: ${finalExam.status}）`)
      testsFailed++
    }
    
    if (finalExam.totalScore !== null && finalExam.maxScore !== null) {
      console.log('  ✅ 分数已正确计算')
      testsPassed++
    } else {
      console.log('  ❌ 分数未计算（totalScore 或 maxScore 为 null）')
      testsFailed++
    }
    
    // 测试 5: 获取考试详情
    console.log('\n📝 测试 5: 获取考试详情')
    const detailResult = await getExamDetail(examId)
    
    if (!detailResult.success) {
      console.log('  ❌ 获取考试详情失败:', detailResult.error.message)
      testsFailed++
    } else {
      console.log('  ✅ 获取考试详情成功')
      console.log(`     题目数量: ${detailResult.data.questionSet.questions.length}`)
      testsPassed++
    }
    
  } catch (error) {
    console.error('\n❌ 测试执行失败:', error.message)
    console.error(error.stack)
    testsFailed++
  }
  
  // 总结
  console.log('\n' + '='.repeat(60))
  console.log('\n📊 测试结果总结:\n')
  console.log(`  ✅ 通过: ${testsPassed}`)
  console.log(`  ❌ 失败: ${testsFailed}`)
  console.log(`  📈 通过率: ${Math.round(testsPassed / (testsPassed + testsFailed) * 100)}%`)
  
  if (testsFailed === 0) {
    console.log('\n✅ 所有测试通过！考试流程工作正常。')
    process.exit(0)
  } else {
    console.log('\n❌ 部分测试失败，请检查上述错误。')
    process.exit(1)
  }
}

runTests()
