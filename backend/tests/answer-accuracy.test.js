/**
 * 答案准确性验证
 * 自动测试题目答案的准确性
 *
 * 运行方式：bun run backend/tests/answer-accuracy.test.js
 */

// 加载环境变量
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), 'backend/.env.local') })

import { db } from '../src/db/index.js'
import { questions } from '../src/db/schema.js'
import { gradeAnswerWithQuestion } from '../src/services/answerGrader.js'

async function validateAnswers() {
  console.log('✅ 开始验证答案准确性...\n')

  const allQuestions = await db.select().from(questions).limit(50)

  if (allQuestions.length === 0) {
    console.log('⚠️  数据库中没有题目，请先添加题目。')
    process.exit(0)
  }

  let totalTests = 0
  let passedTests = 0
  let failedTests = 0
  const failures = []

  for (const question of allQuestions) {
    const contentText = typeof question.content === 'string' ? question.content : (question.content?.en || question.content?.zh || JSON.stringify(question.content))
    console.log(`\n📝 题目 ${question.id}: ${contentText.substring(0, 50)}...`)
    console.log(`   类型: ${question.type}`)

    // 测试 1: 正确答案应该被判定为正确
    totalTests++
    try {
      const correctResult = await gradeAnswerWithQuestion(question, question.answer.value)

      if (correctResult.isCorrect) {
        passedTests++
        console.log(`   ✅ 正确答案测试通过 (得分: ${correctResult.score}/10)`)
      } else {
        failedTests++
        failures.push({
          questionId: question.id,
          test: '正确答案测试',
          expected: '正确',
          actual: '错误',
          answer: question.answer.value
        })
        console.log(`   ❌ 正确答案测试失败！`)
        console.log(`      期望: 正确`)
        console.log(`      实际: 错误`)
        console.log(`      答案: ${question.answer.value}`)
      }
    } catch (error) {
      failedTests++
      failures.push({
        questionId: question.id,
        test: '正确答案测试',
        error: error.message
      })
      console.log(`   ❌ 正确答案测试出错: ${error.message}`)
    }

    // 测试 2: 错误答案应该被判定为错误（仅选择题）
    if (question.type === 'multiple_choice' && question.options) {
      totalTests++
      const wrongAnswer = question.options.find(opt => opt !== question.answer.value)

      if (wrongAnswer) {
        try {
          const wrongResult = await gradeAnswerWithQuestion(question, wrongAnswer)

          if (!wrongResult.isCorrect) {
            passedTests++
            console.log(`   ✅ 错误答案测试通过 (得分: ${wrongResult.score}/10)`)
          } else {
            failedTests++
            failures.push({
              questionId: question.id,
              test: '错误答案测试',
              expected: '错误',
              actual: '正确',
              answer: wrongAnswer
            })
            console.log(`   ❌ 错误答案测试失败！`)
            console.log(`      期望: 错误`)
            console.log(`      实际: 正确`)
            console.log(`      答案: ${wrongAnswer}`)
          }
        } catch (error) {
          failedTests++
          failures.push({
            questionId: question.id,
            test: '错误答案测试',
            error: error.message
          })
          console.log(`   ❌ 错误答案测试出错: ${error.message}`)
        }
      }
    }
  }

  // 总结
  console.log('\n' + '='.repeat(60))
  console.log('\n📊 验证结果总结:\n')
  console.log(`  总测试数: ${totalTests}`)
  console.log(`  通过: ${passedTests} (${totalTests > 0 ? Math.round(passedTests/totalTests*100) : 0}%)`)
  console.log(`  失败: ${failedTests} (${totalTests > 0 ? Math.round(failedTests/totalTests*100) : 0}%)`)

  if (failures.length > 0) {
    console.log('\n❌ 失败的测试:\n')
    for (const failure of failures) {
      console.log(`  - 题目 ${failure.questionId} - ${failure.test}`)
      if (failure.error) {
        console.log(`    错误: ${failure.error}`)
      } else {
        console.log(`    期望: ${failure.expected}`)
        console.log(`    实际: ${failure.actual}`)
        console.log(`    答案: ${failure.answer}`)
      }
      console.log()
    }
  }

  if (failedTests === 0) {
    console.log('\n✅ 所有答案验证通过！')
    process.exit(0)
  } else {
    console.log(`\n⚠️  发现 ${failedTests} 个问题，请检查。`)
    process.exit(1)
  }
}

validateAnswers().catch(error => {
  console.error('❌ 测试执行失败:', error)
  process.exit(1)
})
