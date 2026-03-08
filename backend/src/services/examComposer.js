// ============================================================
// 智能组卷引擎
// 根据不同策略从题库中智能选题并组成试卷
// ============================================================

import { db } from '../db/index.js'
import { questions, questionSets, userAnswers, learningProgress } from '../db/schema.js'
import { eq, and, inArray, sql } from 'drizzle-orm'

/**
 * 组卷策略枚举
 */
export const COMPOSE_STRATEGIES = {
  RANDOM: 'random',              // 随机选题
  DIFFICULTY: 'difficulty',      // 难度分布
  KNOWLEDGE: 'knowledge',        // 知识点覆盖
  AI_RECOMMEND: 'ai_recommend',  // AI 推荐（根据薄弱点）
  EXAM_STYLE: 'exam_style'       // 历年真题风格
}

/**
 * 默认难度分布（3:5:2）
 * 简单:中等:困难 = 30%:50%:20%
 */
const DEFAULT_DIFFICULTY_DISTRIBUTION = {
  1: 0.05,  // 5% 非常简单
  2: 0.25,  // 25% 简单
  3: 0.40,  // 40% 中等
  4: 0.25,  // 25% 困难
  5: 0.05   // 5% 非常困难
}

/**
 * 智能组卷主函数
 * @param {Object} config - 组卷配置
 * @returns {Promise<Object>} 组卷结果
 */
export async function composeExam(config) {
  const {
    chapterId,
    strategy = COMPOSE_STRATEGIES.DIFFICULTY,
    count = 10,
    types = ['multiple_choice', 'calculation'],
    difficultyDistribution = DEFAULT_DIFFICULTY_DISTRIBUTION,
    tags = [],
    userId = null,
    timeLimit = null,
    title = '练习题集',
    description = ''
  } = config

  console.log(`🎯 开始智能组卷: 策略=${strategy}, 数量=${count}`)

  try {
    // 1. 根据策略选题
    let selectedQuestions = []

    switch (strategy) {
      case COMPOSE_STRATEGIES.RANDOM:
        selectedQuestions = await selectRandomQuestions(chapterId, count, types)
        break

      case COMPOSE_STRATEGIES.DIFFICULTY:
        selectedQuestions = await selectByDifficulty(chapterId, count, types, difficultyDistribution)
        break

      case COMPOSE_STRATEGIES.KNOWLEDGE:
        selectedQuestions = await selectByKnowledge(chapterId, count, types, tags)
        break

      case COMPOSE_STRATEGIES.AI_RECOMMEND:
        selectedQuestions = await selectByAIRecommend(chapterId, count, types, userId)
        break

      case COMPOSE_STRATEGIES.EXAM_STYLE:
        selectedQuestions = await selectExamStyle(chapterId, count, types)
        break

      default:
        throw new Error(`不支持的组卷策略: ${strategy}`)
    }

    if (selectedQuestions.length === 0) {
      throw new Error('没有找到符合条件的题目')
    }

    console.log(`✅ 已选择 ${selectedQuestions.length} 道题目`)

    // 2. 计算试卷统计信息
    const stats = calculateExamStats(selectedQuestions)

    // 3. 创建试卷记录
    const questionSet = await createQuestionSet({
      userId,
      title,
      description,
      type: strategy,
      chapterId,
      questionIds: selectedQuestions.map(q => q.id),
      totalQuestions: selectedQuestions.length,
      totalPoints: stats.totalPoints,
      timeLimit: timeLimit || stats.estimatedTime,
      difficultyDistribution: stats.difficultyDistribution,
      generatedBy: strategy
    })

    console.log(`💾 试卷已创建: ID=${questionSet.id}`)

    return {
      questionSet,
      questions: selectedQuestions,
      stats
    }

  } catch (error) {
    console.error('❌ 组卷失败:', error)
    throw error
  }
}

/**
 * 策略 1: 随机选题
 */
async function selectRandomQuestions(chapterId, count, types) {
  console.log('📝 使用随机选题策略')

  const result = await db
    .select()
    .from(questions)
    .where(
      and(
        eq(questions.chapterId, chapterId),
        eq(questions.status, 'published'),
        inArray(questions.type, types)
      )
    )
    .orderBy(sql`RANDOM()`)
    .limit(count)

  return result
}

/**
 * 策略 2: 按难度分布选题
 */
async function selectByDifficulty(chapterId, count, types, distribution) {
  console.log('📊 使用难度分布策略')

  const selectedQuestions = []

  // 按难度分配题目数量
  for (const [difficulty, ratio] of Object.entries(distribution)) {
    const difficultyLevel = parseInt(difficulty)
    const targetCount = Math.round(count * ratio)

    if (targetCount === 0) continue

    console.log(`   难度 ${difficultyLevel}: 需要 ${targetCount} 道题`)

    const result = await db
      .select()
      .from(questions)
      .where(
        and(
          eq(questions.chapterId, chapterId),
          eq(questions.difficulty, difficultyLevel),
          eq(questions.status, 'published'),
          inArray(questions.type, types)
        )
      )
      .orderBy(sql`RANDOM()`)
      .limit(targetCount)

    selectedQuestions.push(...result)
  }

  // 如果数量不足，随机补充
  if (selectedQuestions.length < count) {
    const excludeIds = selectedQuestions.map(q => q.id)
    const additional = await db
      .select()
      .from(questions)
      .where(
        and(
          eq(questions.chapterId, chapterId),
          eq(questions.status, 'published'),
          inArray(questions.type, types),
          sql`${questions.id} NOT IN (${excludeIds.join(',')})`
        )
      )
      .orderBy(sql`RANDOM()`)
      .limit(count - selectedQuestions.length)

    selectedQuestions.push(...additional)
  }

  return selectedQuestions
}

/**
 * 策略 3: 按知识点覆盖选题
 */
async function selectByKnowledge(chapterId, count, types, targetTags) {
  console.log('🎓 使用知识点覆盖策略')

  // 获取所有符合条件的题目
  const allQuestions = await db
    .select()
    .from(questions)
    .where(
      and(
        eq(questions.chapterId, chapterId),
        eq(questions.status, 'published'),
        inArray(questions.type, types)
      )
    )

  if (allQuestions.length === 0) {
    return []
  }

  // 如果指定了目标知识点，优先选择包含这些知识点的题目
  let selectedQuestions = []

  if (targetTags.length > 0) {
    // 按知识点匹配度排序
    const questionsWithScore = allQuestions.map(q => {
      const questionTags = q.tags || []
      const matchCount = targetTags.filter(tag => questionTags.includes(tag)).length
      return { question: q, score: matchCount }
    })

    questionsWithScore.sort((a, b) => b.score - a.score)

    // 选择匹配度最高的题目
    selectedQuestions = questionsWithScore
      .slice(0, count)
      .map(item => item.question)
  } else {
    // 没有指定知识点，尽量覆盖更多不同的知识点
    const tagCoverage = new Set()
    const selected = []

    for (const q of allQuestions) {
      const questionTags = q.tags || []
      const newTags = questionTags.filter(tag => !tagCoverage.has(tag))

      if (newTags.length > 0 || selected.length < count) {
        selected.push(q)
        newTags.forEach(tag => tagCoverage.add(tag))

        if (selected.length >= count) break
      }
    }

    selectedQuestions = selected
  }

  return selectedQuestions
}

/**
 * 策略 4: AI 推荐（根据用户薄弱点）
 */
async function selectByAIRecommend(chapterId, count, types, userId) {
  console.log('🤖 使用 AI 推荐策略')

  if (!userId) {
    console.log('   ⚠️  未提供用户 ID，降级为难度分布策略')
    return selectByDifficulty(chapterId, count, types, DEFAULT_DIFFICULTY_DISTRIBUTION)
  }

  try {
    // 1. 分析用户的答题历史
    const userHistory = await db
      .select({
        questionId: userAnswers.questionId,
        isCorrect: userAnswers.isCorrect,
        question: questions
      })
      .from(userAnswers)
      .innerJoin(questions, eq(userAnswers.questionId, questions.id))
      .where(
        and(
          eq(userAnswers.userId, userId),
          eq(questions.chapterId, chapterId)
        )
      )

    // 2. 找出薄弱知识点
    const weakTags = analyzeWeakPoints(userHistory)
    console.log(`   发现薄弱知识点: ${weakTags.join(', ')}`)

    // 3. 优先选择薄弱知识点的题目
    if (weakTags.length > 0) {
      const weakQuestions = await selectByKnowledge(chapterId, Math.ceil(count * 0.6), types, weakTags)
      const otherQuestions = await selectRandomQuestions(chapterId, count - weakQuestions.length, types)

      return [...weakQuestions, ...otherQuestions]
    }

    // 4. 如果没有历史记录，使用难度分布策略
    return selectByDifficulty(chapterId, count, types, DEFAULT_DIFFICULTY_DISTRIBUTION)

  } catch (error) {
    console.error('   ❌ AI 推荐失败，降级为难度分布策略:', error)
    return selectByDifficulty(chapterId, count, types, DEFAULT_DIFFICULTY_DISTRIBUTION)
  }
}

/**
 * 策略 5: 历年真题风格
 */
async function selectExamStyle(chapterId, count, types) {
  console.log('📝 使用历年真题风格策略')

  // 优先选择来源为 'exam' 的题目
  const examQuestions = await db
    .select()
    .from(questions)
    .where(
      and(
        eq(questions.chapterId, chapterId),
        eq(questions.source, 'exam'),
        eq(questions.status, 'published'),
        inArray(questions.type, types)
      )
    )
    .orderBy(sql`RANDOM()`)
    .limit(count)

  // 如果真题不足，用其他题目补充
  if (examQuestions.length < count) {
    const excludeIds = examQuestions.map(q => q.id)
    const additional = await db
      .select()
      .from(questions)
      .where(
        and(
          eq(questions.chapterId, chapterId),
          eq(questions.status, 'published'),
          inArray(questions.type, types),
          excludeIds.length > 0 ? sql`${questions.id} NOT IN (${excludeIds.join(',')})` : sql`1=1`
        )
      )
      .orderBy(sql`RANDOM()`)
      .limit(count - examQuestions.length)

    return [...examQuestions, ...additional]
  }

  return examQuestions
}

/**
 * 分析用户薄弱知识点
 */
function analyzeWeakPoints(userHistory) {
  const tagStats = {}

  userHistory.forEach(({ isCorrect, question }) => {
    const tags = question.tags || []

    tags.forEach(tag => {
      if (!tagStats[tag]) {
        tagStats[tag] = { total: 0, correct: 0 }
      }

      tagStats[tag].total++
      if (isCorrect) {
        tagStats[tag].correct++
      }
    })
  })

  // 找出正确率低于 60% 的知识点
  const weakTags = Object.entries(tagStats)
    .filter(([tag, stats]) => {
      const correctRate = stats.correct / stats.total
      return correctRate < 0.6 && stats.total >= 2 // 至少做过 2 道题
    })
    .map(([tag]) => tag)

  return weakTags
}

/**
 * 计算试卷统计信息
 */
function calculateExamStats(questions) {
  const stats = {
    totalQuestions: questions.length,
    totalPoints: questions.length * 10, // 假设每题 10 分
    estimatedTime: 0,
    difficultyDistribution: {},
    typeDistribution: {},
    tagDistribution: {}
  }

  questions.forEach(q => {
    // 累计预计时间
    stats.estimatedTime += q.estimatedTime || 300

    // 难度分布
    const difficulty = q.difficulty
    stats.difficultyDistribution[difficulty] = (stats.difficultyDistribution[difficulty] || 0) + 1

    // 题型分布
    const type = q.type
    stats.typeDistribution[type] = (stats.typeDistribution[type] || 0) + 1

    // 知识点分布
    const tags = q.tags || []
    tags.forEach(tag => {
      stats.tagDistribution[tag] = (stats.tagDistribution[tag] || 0) + 1
    })
  })

  // 转换为秒
  stats.estimatedTime = Math.ceil(stats.estimatedTime)

  return stats
}

/**
 * 创建试卷记录
 */
async function createQuestionSet(data) {
  const [questionSet] = await db
    .insert(questionSets)
    .values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .returning()

  return questionSet
}

/**
 * 获取试卷详情（包含题目）
 */
export async function getQuestionSetWithQuestions(questionSetId) {
  // 1. 获取试卷信息
  const [questionSet] = await db
    .select()
    .from(questionSets)
    .where(eq(questionSets.id, questionSetId))
    .limit(1)

  if (!questionSet) {
    throw new Error('试卷不存在')
  }

  // 2. 获取题目列表
  const questionIds = questionSet.questionIds || []

  if (questionIds.length === 0) {
    return {
      questionSet,
      questions: []
    }
  }

  const questionList = await db
    .select()
    .from(questions)
    .where(inArray(questions.id, questionIds))

  // 3. 按照 questionIds 的顺序排序
  const orderedQuestions = questionIds
    .map(id => questionList.find(q => q.id === id))
    .filter(q => q !== undefined)

  return {
    questionSet,
    questions: orderedQuestions
  }
}

/**
 * 删除试卷
 */
export async function deleteQuestionSet(questionSetId) {
  const [deleted] = await db
    .delete(questionSets)
    .where(eq(questionSets.id, questionSetId))
    .returning()

  return deleted
}

/**
 * 获取用户的试卷列表
 */
export async function getUserQuestionSets(userId, options = {}) {
  const { chapterId, type, limit = 20, offset = 0 } = options

  const conditions = [eq(questionSets.userId, userId)]

  if (chapterId) {
    conditions.push(eq(questionSets.chapterId, chapterId))
  }

  if (type) {
    conditions.push(eq(questionSets.type, type))
  }

  const result = await db
    .select()
    .from(questionSets)
    .where(and(...conditions))
    .orderBy(sql`${questionSets.createdAt} DESC`)
    .limit(limit)
    .offset(offset)

  return result
}

export default {
  composeExam,
  getQuestionSetWithQuestions,
  deleteQuestionSet,
  getUserQuestionSets,
  COMPOSE_STRATEGIES
}
