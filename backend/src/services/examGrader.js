import { db } from '../db/index.js'
import { exams, examQuestionResults, questionSets, questions } from '../db/schema.js'
import { eq, sql, inArray } from 'drizzle-orm'
import { gradeAnswer, gradeAnswerWithQuestion } from './answerGrader.js'

/**
 * Phase 4 Day 3: 考试批改服务
 *
 * 功能：
 * - 批量批改考试答案
 * - 计算总分和正确率
 * - 生成逐题结果
 * - 统计分析（难度、题型、知识点）
 */

/**
 * 批改整个考试（使用事务和并行处理优化）
 */
export async function gradeExam(examId) {
  try {
    console.log(`开始批改考试 ${examId}...`)

    // 使用事务确保数据一致性
    const result = await db.transaction(async (tx) => {
      // 1. 查询考试
      const [exam] = await tx.select()
        .from(exams)
        .where(eq(exams.id, examId))
        .limit(1)

      if (!exam) {
        throw new Error('考试不存在')
      }

      if (exam.status !== 'submitted') {
        throw new Error('考试尚未提交，无法批改')
      }

      // 2. 查询试卷和题目（一次性加载所有数据，避免 N+1 查询）
      const [questionSet] = await tx.select()
        .from(questionSets)
        .where(eq(questionSets.id, exam.questionSetId))
        .limit(1)

      const questionIds = questionSet.questionIds
      const questionList = await tx.select()
        .from(questions)
        .where(inArray(questions.id, questionIds))

      // 创建题目 ID 到题目对象的映射，方便快速查找
      const questionMap = new Map()
      for (const question of questionList) {
        questionMap.set(question.id, question)
      }

      // 3. 并行批改所有题目（性能优化 + 避免 N+1 查询）
      const gradePromises = questionList.map(async (question) => {
        const userAnswer = exam.answers[question.id]

        // 如果用户没有作答，记录为错误
        if (userAnswer === undefined || userAnswer === null) {
          return {
            examId,
            questionId: question.id,
            userAnswer: {},  // 空对象而不是 null，避免数据库 NOT NULL 约束
            isCorrect: false,
            score: 0,
            maxScore: 10,
            timeSpent: null,
            aiFeedback: {
              message: '未作答',
              correctAnswer: question.answer?.value
            }
          }
        }

        // 批改答案（使用内存中的题目数据，不再查询数据库）
        try {
          const gradeResult = await gradeAnswerWithQuestion(question, userAnswer.value || userAnswer)

          return {
            examId,
            questionId: question.id,
            userAnswer: userAnswer,
            isCorrect: gradeResult.isCorrect,
            score: gradeResult.score,
            maxScore: 10,
            timeSpent: userAnswer.timeSpent || null,
            aiFeedback: gradeResult.feedback
          }
        } catch (error) {
          console.error(`批改题目 ${question.id} 失败:`, error)
          // 批改失败，给予0分
          return {
            examId,
            questionId: question.id,
            userAnswer: userAnswer,
            isCorrect: false,
            score: 0,
            maxScore: 10,
            timeSpent: null,
            aiFeedback: {
              message: '批改失败',
              error: error.message
            }
          }
        }
      })

      // 等待所有批改完成
      const results = await Promise.all(gradePromises)

      // 4. 计算总分和统计
      let totalScore = 0
      let maxScore = 0
      let correctCount = 0

      for (const result of results) {
        totalScore += result.score
        maxScore += result.maxScore
        if (result.isCorrect) correctCount++
      }

      // 5. 保存逐题结果
      if (results.length > 0) {
        await tx.insert(examQuestionResults).values(results)
      }

      // 6. 计算统计数据
      const stats = await calculateExamStats(examId, questionList, results)

      // 7. 更新考试记录
      await tx.update(exams)
        .set({
          status: 'graded',
          totalScore,
          maxScore,
          correctCount,
          totalCount: questionList.length,
          difficultyStats: stats.difficultyStats,
          topicStats: stats.topicStats,
          typeStats: stats.typeStats,
          updatedAt: new Date()
        })
        .where(eq(exams.id, examId))

      console.log(`考试 ${examId} 批改完成: ${totalScore}/${maxScore} (${correctCount}/${questionList.length})`)

      return {
        success: true,
        userId: exam.userId,
        data: {
          examId,
          totalScore,
          maxScore,
          correctCount,
          totalCount: questionList.length,
          correctRate: Math.round((correctCount / questionList.length) * 100),
          stats
        }
      }
    })

    // 批改完成后自动生成学习推荐（事务外，非关键操作）
    if (result.success && result.userId) {
      try {
        const { generateRecommendations } = await import('./recommendationService.js')
        await generateRecommendations(result.userId, examId)
      } catch (recError) {
        console.error(`考试 ${examId} 推荐生成失败（不影响批改结果）:`, recError)
      }
    }

    return result

  } catch (error) {
    console.error('批改考试失败：', error)
    return {
      success: false,
      error: { message: error.message }
    }
  }
}

/**
 * 计算考试统计数据
 */
async function calculateExamStats(examId, questionList, results) {
  // 按难度统计
  const difficultyStats = {
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 }
  }

  // 按题型统计
  const typeStats = {}

  // 按知识点统计
  const topicStats = {}

  for (let i = 0; i < questionList.length; i++) {
    const question = questionList[i]
    const result = results[i]

    // 难度统计
    let difficultyKey = 'medium'
    if (question.difficulty <= 2) difficultyKey = 'easy'
    else if (question.difficulty >= 4) difficultyKey = 'hard'

    difficultyStats[difficultyKey].total++
    if (result.isCorrect) {
      difficultyStats[difficultyKey].correct++
    }

    // 题型统计
    const type = question.type
    if (!typeStats[type]) {
      typeStats[type] = { correct: 0, total: 0 }
    }
    typeStats[type].total++
    if (result.isCorrect) {
      typeStats[type].correct++
    }

    // 知识点统计
    const tags = question.tags || []
    for (const tag of tags) {
      if (!topicStats[tag]) {
        topicStats[tag] = { correct: 0, total: 0 }
      }
      topicStats[tag].total++
      if (result.isCorrect) {
        topicStats[tag].correct++
      }
    }
  }

  return {
    difficultyStats,
    typeStats,
    topicStats
  }
}

/**
 * 获取考试详细结果
 */
export async function getExamResult(examId) {
  try {
    // 查询考试
    const [exam] = await db.select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1)

    if (!exam) {
      throw new Error('考试不存在')
    }

    if (exam.status === 'in_progress') {
      throw new Error('考试尚未提交')
    }

    // 查询逐题结果
    const questionResults = await db.select()
      .from(examQuestionResults)
      .where(eq(examQuestionResults.examId, examId))

    // 查询试卷信息
    const [questionSet] = await db.select()
      .from(questionSets)
      .where(eq(questionSets.id, exam.questionSetId))
      .limit(1)

    // 查询题目详情
    const questionIds = questionSet.questionIds
    const questionList = await db.select()
      .from(questions)
      .where(inArray(questions.id, questionIds))

    // 合并题目和结果
    const questionsWithResults = questionList.map(question => {
      const result = questionResults.find(r => r.questionId === question.id)
      return {
        ...question,
        result: result || null
      }
    })

    return {
      success: true,
      data: {
        exam,
        questionSet,
        questions: questionsWithResults,
        summary: {
          totalScore: exam.totalScore,
          maxScore: exam.maxScore,
          correctCount: exam.correctCount,
          totalCount: exam.totalCount,
          correctRate: exam.totalCount > 0
            ? Math.round((exam.correctCount / exam.totalCount) * 100)
            : 0,
          timeSpent: exam.timeSpent,
          difficultyStats: exam.difficultyStats,
          typeStats: exam.typeStats,
          topicStats: exam.topicStats
        }
      }
    }

  } catch (error) {
    console.error('获取考试结果失败：', error)
    return {
      success: false,
      error: { message: error.message }
    }
  }
}

/**
 * 获取错题列表
 */
export async function getWrongQuestions(examId) {
  try {
    // 查询所有错题
    const wrongResults = await db.select()
      .from(examQuestionResults)
      .where(
        sql`${examQuestionResults.examId} = ${examId} AND ${examQuestionResults.isCorrect} = false`
      )

    if (wrongResults.length === 0) {
      return {
        success: true,
        data: []
      }
    }

    // 查询题目详情
    const questionIds = wrongResults.map(r => r.questionId)
    const questionList = await db.select()
      .from(questions)
      .where(inArray(questions.id, questionIds))

    // 合并题目和结果
    const wrongQuestions = wrongResults.map(result => {
      const question = questionList.find(q => q.id === result.questionId)
      return {
        ...question,
        result
      }
    })

    return {
      success: true,
      data: wrongQuestions
    }

  } catch (error) {
    console.error('获取错题列表失败：', error)
    return {
      success: false,
      error: { message: error.message }
    }
  }
}

/**
 * 分析薄弱知识点
 */
export async function analyzeWeakTopics(examId) {
  try {
    const [exam] = await db.select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1)

    if (!exam || !exam.topicStats) {
      return {
        success: true,
        data: []
      }
    }

    // 找出正确率低于 60% 的知识点
    const weakTopics = []
    for (const [topic, stats] of Object.entries(exam.topicStats)) {
      const correctRate = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
      if (correctRate < 60) {
        weakTopics.push({
          topic,
          correct: stats.correct,
          total: stats.total,
          correctRate: Math.round(correctRate),
          level: correctRate < 30 ? 'critical' : correctRate < 50 ? 'weak' : 'needs_improvement'
        })
      }
    }

    // 按正确率排序（从低到高）
    weakTopics.sort((a, b) => a.correctRate - b.correctRate)

    return {
      success: true,
      data: weakTopics
    }

  } catch (error) {
    console.error('分析薄弱知识点失败：', error)
    return {
      success: false,
      error: { message: error.message }
    }
  }
}

/**
 * 生成考试报告
 */
export async function generateExamReport(examId) {
  try {
    // 获取考试结果
    const resultData = await getExamResult(examId)
    if (!resultData.success) {
      throw new Error(resultData.error.message)
    }

    const { exam, summary } = resultData.data

    // 获取错题
    const wrongQuestionsData = await getWrongQuestions(examId)
    const wrongQuestions = wrongQuestionsData.success ? wrongQuestionsData.data : []

    // 分析薄弱点
    const weakTopicsData = await analyzeWeakTopics(examId)
    const weakTopics = weakTopicsData.success ? weakTopicsData.data : []

    // 生成报告
    const report = {
      examId,
      examType: exam.type,
      examMode: exam.mode,

      // 总体成绩
      overall: {
        totalScore: summary.totalScore,
        maxScore: summary.maxScore,
        percentage: Math.round((summary.totalScore / summary.maxScore) * 100),
        correctCount: summary.correctCount,
        totalCount: summary.totalCount,
        correctRate: summary.correctRate,
        timeSpent: summary.timeSpent,
        grade: getGrade(summary.correctRate)
      },

      // 难度分析
      difficultyAnalysis: summary.difficultyStats,

      // 题型分析
      typeAnalysis: summary.typeStats,

      // 薄弱知识点
      weakTopics: weakTopics.slice(0, 5), // 前5个最薄弱的

      // 错题数量
      wrongQuestionsCount: wrongQuestions.length,

      // 学习建议
      suggestions: generateSuggestions(summary, weakTopics),

      // 生成时间
      generatedAt: new Date()
    }

    return {
      success: true,
      data: report
    }

  } catch (error) {
    console.error('生成考试报告失败：', error)
    return {
      success: false,
      error: { message: error.message }
    }
  }
}

/**
 * 根据正确率获取等级
 */
function getGrade(correctRate) {
  if (correctRate >= 90) return 'A'
  if (correctRate >= 80) return 'B'
  if (correctRate >= 70) return 'C'
  if (correctRate >= 60) return 'D'
  return 'F'
}

/**
 * 生成学习建议
 */
function generateSuggestions(summary, weakTopics) {
  const suggestions = []

  // 根据正确率给建议
  if (summary.correctRate >= 90) {
    suggestions.push('表现优秀！继续保持，可以尝试更高难度的题目。')
  } else if (summary.correctRate >= 70) {
    suggestions.push('表现良好，但还有提升空间。重点复习错题。')
  } else if (summary.correctRate >= 60) {
    suggestions.push('基础掌握尚可，需要加强练习。')
  } else {
    suggestions.push('需要系统复习基础知识，建议重新学习相关章节。')
  }

  // 根据难度分析给建议
  const { difficultyStats } = summary
  if (difficultyStats) {
    const easyRate = difficultyStats.easy.total > 0
      ? (difficultyStats.easy.correct / difficultyStats.easy.total) * 100
      : 100
    const hardRate = difficultyStats.hard.total > 0
      ? (difficultyStats.hard.correct / difficultyStats.hard.total) * 100
      : 100

    if (easyRate < 80) {
      suggestions.push('简单题正确率偏低，需要巩固基础知识。')
    }
    if (hardRate < 40) {
      suggestions.push('困难题正确率较低，可以先掌握中等难度题目。')
    }
  }

  // 根据薄弱知识点给建议
  if (weakTopics.length > 0) {
    const criticalTopics = weakTopics.filter(t => t.level === 'critical')
    if (criticalTopics.length > 0) {
      suggestions.push(`重点关注：${criticalTopics.map(t => t.topic).join('、')}`)
    }
  }

  return suggestions
}
