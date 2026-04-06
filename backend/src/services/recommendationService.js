// ============================================================
// Learning Recommendation Service
// Phase 4 Day 10: Generate personalized learning recommendations
// ============================================================

import { db } from '../db/index.js'
import { learningRecommendations, exams, chapters, questions } from '../db/schema.js'
import { eq, and, desc, inArray } from 'drizzle-orm'

/**
 * Generate learning recommendations based on exam results
 * @param {number} userId - User ID
 * @param {number} examId - Exam ID
 * @returns {Promise<Object>} Generated recommendations
 */
export async function generateRecommendations(userId, examId) {
  try {
    console.log(`🎯 Generating recommendations for user ${userId} based on exam ${examId}...`)

    // 1. Get exam results
    const [exam] = await db
      .select()
      .from(exams)
      .where(and(eq(exams.id, examId), eq(exams.userId, userId)))
      .limit(1)

    if (!exam) {
      throw new Error('Exam not found')
    }

    if (exam.status !== 'graded') {
      throw new Error('Exam must be graded before generating recommendations')
    }

    // 2. Analyze weak topics
    const weakTopics = analyzeWeakTopics(exam.topicStats)

    // 3. Generate recommendations
    const recommendations = []

    // 3.1 Chapter review recommendations (for weak topics)
    for (const weakTopic of weakTopics) {
      if (weakTopic.correctRate < 60) {
        // Find chapters related to this topic
        // 从 topicStats 的 tag 尝试推断学科
        const examSubject = inferSubjectFromTopics(Object.keys(exam.topicStats || {}))
        const relatedChapters = await findChaptersForTopic(weakTopic.topic, examSubject)

        for (const chapter of relatedChapters) {
          recommendations.push({
            userId,
            examId,
            type: 'chapter',
            priority: getPriorityFromCorrectRate(weakTopic.correctRate),
            chapterId: chapter.id,
            reason: `你在「${weakTopic.topic}」的正确率只有 ${weakTopic.correctRate}%，建议复习相关章节`,
            weakTopics: [weakTopic.topic],
            status: 'pending',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          })
        }
      }
    }

    // 3.2 Practice recommendations (for topics with 60-80% correct rate)
    const needsPracticeTopics = weakTopics.filter(t => t.correctRate >= 60 && t.correctRate < 80)
    if (needsPracticeTopics.length > 0) {
      // Find practice questions for these topics
      const practiceQuestions = await findQuestionsForTopics(
        needsPracticeTopics.map(t => t.topic)
      )

      if (practiceQuestions.length > 0) {
        recommendations.push({
          userId,
          examId,
          type: 'practice',
          priority: 3,
          questionIds: practiceQuestions.map(q => q.id),
          reason: `针对薄弱知识点进行专项练习：${needsPracticeTopics.map(t => t.topic).join('、')}`,
          weakTopics: needsPracticeTopics.map(t => t.topic),
          status: 'pending',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })
      }
    }

    // 3.3 Review wrong questions
    if (exam.correctCount < exam.totalCount) {
      recommendations.push({
        userId,
        examId,
        type: 'review',
        priority: 5,
        reason: `复习本次考试的错题，共 ${exam.totalCount - exam.correctCount} 道`,
        weakTopics: weakTopics.map(t => t.topic),
        status: 'pending',
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
      })
    }

    // 4. Save recommendations to database
    if (recommendations.length > 0) {
      await db.insert(learningRecommendations).values(recommendations)
    }

    console.log(`✅ Generated ${recommendations.length} recommendations`)

    return {
      success: true,
      data: {
        count: recommendations.length,
        recommendations
      }
    }

  } catch (error) {
    console.error('Failed to generate recommendations:', error)
    return {
      success: false,
      error: { message: error.message }
    }
  }
}

/**
 * Get user's learning recommendations
 * @param {number} userId - User ID
 * @param {string} status - Filter by status ('pending', 'completed', 'skipped')
 * @returns {Promise<Object>} User recommendations
 */
export async function getUserRecommendations(userId, status = 'pending') {
  try {
    const conditions = [eq(learningRecommendations.userId, userId)]

    if (status) {
      conditions.push(eq(learningRecommendations.status, status))
    }

    const recommendations = await db
      .select()
      .from(learningRecommendations)
      .where(and(...conditions))
      .orderBy(desc(learningRecommendations.priority), desc(learningRecommendations.createdAt))

    // Enrich recommendations with chapter details
    const enrichedRecommendations = await Promise.all(
      recommendations.map(async (rec) => {
        if (rec.chapterId) {
          const [chapter] = await db
            .select()
            .from(chapters)
            .where(eq(chapters.id, rec.chapterId))
            .limit(1)

          return { ...rec, chapter }
        }
        return rec
      })
    )

    return {
      success: true,
      data: enrichedRecommendations
    }

  } catch (error) {
    console.error('Failed to get recommendations:', error)
    return {
      success: false,
      error: { message: error.message }
    }
  }
}

/**
 * Mark recommendation as completed
 * @param {number} recommendationId - Recommendation ID
 * @param {number} userId - User ID (for authorization)
 * @returns {Promise<Object>} Update result
 */
export async function completeRecommendation(recommendationId, userId) {
  try {
    const result = await db
      .update(learningRecommendations)
      .set({
        status: 'completed',
        completedAt: new Date()
      })
      .where(
        and(
          eq(learningRecommendations.id, recommendationId),
          eq(learningRecommendations.userId, userId)
        )
      )

    return {
      success: true,
      data: { recommendationId }
    }

  } catch (error) {
    console.error('Failed to complete recommendation:', error)
    return {
      success: false,
      error: { message: error.message }
    }
  }
}

/**
 * Skip recommendation
 * @param {number} recommendationId - Recommendation ID
 * @param {number} userId - User ID (for authorization)
 * @returns {Promise<Object>} Update result
 */
export async function skipRecommendation(recommendationId, userId) {
  try {
    await db
      .update(learningRecommendations)
      .set({
        status: 'skipped'
      })
      .where(
        and(
          eq(learningRecommendations.id, recommendationId),
          eq(learningRecommendations.userId, userId)
        )
      )

    return {
      success: true,
      data: { recommendationId }
    }

  } catch (error) {
    console.error('Failed to skip recommendation:', error)
    return {
      success: false,
      error: { message: error.message }
    }
  }
}

/**
 * Generate learning plan for user
 * @param {number} userId - User ID
 * @param {number} duration - Plan duration in days
 * @returns {Promise<Object>} Learning plan
 */
export async function generateLearningPlan(userId, duration = 7) {
  try {
    console.log(`📅 Generating ${duration}-day learning plan for user ${userId}...`)

    // 1. Get pending recommendations
    const recsResult = await getUserRecommendations(userId, 'pending')
    if (!recsResult.success) {
      throw new Error('Failed to get recommendations')
    }

    const recommendations = recsResult.data

    // 2. Sort by priority
    const sortedRecs = recommendations.sort((a, b) => b.priority - a.priority)

    // 3. Distribute recommendations across days
    const plan = []
    const recsPerDay = Math.ceil(sortedRecs.length / duration)

    for (let day = 1; day <= duration; day++) {
      const startIdx = (day - 1) * recsPerDay
      const endIdx = Math.min(day * recsPerDay, sortedRecs.length)
      const dayRecs = sortedRecs.slice(startIdx, endIdx)

      if (dayRecs.length > 0) {
        plan.push({
          day,
          date: new Date(Date.now() + (day - 1) * 24 * 60 * 60 * 1000),
          tasks: dayRecs.map(rec => ({
            id: rec.id,
            type: rec.type,
            priority: rec.priority,
            description: getTaskDescription(rec),
            estimatedTime: getEstimatedTime(rec),
            chapterId: rec.chapterId,
            questionIds: rec.questionIds
          })),
          goal: getDayGoal(dayRecs)
        })
      }
    }

    console.log(`✅ Generated ${duration}-day plan with ${plan.length} active days`)

    return {
      success: true,
      data: {
        duration,
        totalTasks: sortedRecs.length,
        plan
      }
    }

  } catch (error) {
    console.error('Failed to generate learning plan:', error)
    return {
      success: false,
      error: { message: error.message }
    }
  }
}

// ============================================================
// Helper Functions
// ============================================================

/**
 * Analyze weak topics from exam topic stats
 */
function analyzeWeakTopics(topicStats) {
  if (!topicStats) return []

  const weakTopics = []

  for (const [topic, stats] of Object.entries(topicStats)) {
    const correctRate = stats.total > 0
      ? Math.round((stats.correct / stats.total) * 100)
      : 0

    if (correctRate < 80) {
      weakTopics.push({
        topic,
        correct: stats.correct,
        total: stats.total,
        correctRate,
        level: correctRate < 30 ? 'critical' : correctRate < 60 ? 'weak' : 'needs_improvement'
      })
    }
  }

  // Sort by correct rate (lowest first)
  return weakTopics.sort((a, b) => a.correctRate - b.correctRate)
}

/**
 * Get priority level from correct rate
 */
function getPriorityFromCorrectRate(correctRate) {
  if (correctRate < 30) return 5 // Critical
  if (correctRate < 50) return 4 // High
  if (correctRate < 70) return 3 // Medium
  return 2 // Low
}

/**
 * 从 topic 标签列表推断学科
 */
function inferSubjectFromTopics(topics) {
  const mathKeywords = ['algebra', 'calculus', 'trigonometry', 'differentiation', 'integration', 'vectors', 'pure', 'statistics', 'mechanics']
  const econKeywords = ['demand', 'supply', 'market', 'GDP', 'inflation', 'fiscal', 'monetary', 'trade', 'microeconomics', 'macroeconomics']

  const topicStr = topics.join(' ').toLowerCase()
  const mathScore = mathKeywords.filter(k => topicStr.includes(k)).length
  const econScore = econKeywords.filter(k => topicStr.includes(k)).length

  if (mathScore > econScore) return 'mathematics'
  if (econScore > mathScore) return 'economics'
  return 'economics' // 默认
}

/**
 * Find chapters related to a topic
 */
async function findChaptersForTopic(topic, subject) {
  try {
    // Import topic-chapter mapping
    const { getChaptersForTopic } = await import('../config/topicChapterMap.js')

    // Get chapter IDs for this topic — 动态检测学科而非硬编码
    // 从 topic 内容尝试推断学科，默认使用 economics
    const chapterIds = getChaptersForTopic(topic, subject || 'economics')

    if (chapterIds.length === 0) {
      return []
    }

    // Fetch chapter details from database
    const chapterList = await db
      .select()
      .from(chapters)
      .where(inArray(chapters.id, chapterIds))

    return chapterList

  } catch (error) {
    console.error('Failed to find chapters for topic:', error)
    return []
  }
}

/**
 * Find practice questions for topics
 */
async function findQuestionsForTopics(topics) {
  try {
    // Find questions that have any of the topics in their tags
    const allQuestions = await db
      .select()
      .from(questions)
      .where(eq(questions.status, 'published'))

    // Filter questions that match any of the topics
    const matchingQuestions = allQuestions.filter(q => {
      const questionTags = q.tags || []
      return topics.some(topic => questionTags.includes(topic))
    })

    // Limit to 10 questions
    return matchingQuestions.slice(0, 10)

  } catch (error) {
    console.error('Failed to find questions for topics:', error)
    return []
  }
}

/**
 * Get task description for recommendation
 */
function getTaskDescription(rec) {
  switch (rec.type) {
    case 'chapter':
      return rec.chapter
        ? `学习章节：${rec.chapter.title?.zh || rec.chapter.title}`
        : '复习相关章节'
    case 'practice':
      return `完成练习题：${rec.questionIds?.length || 0} 道`
    case 'review':
      return '复习错题'
    case 'video':
      return '观看教学视频'
    default:
      return rec.reason || '学习任务'
  }
}

/**
 * Get estimated time for recommendation (in minutes)
 */
function getEstimatedTime(rec) {
  switch (rec.type) {
    case 'chapter':
      return 30 // 30 minutes for chapter review
    case 'practice':
      return (rec.questionIds?.length || 0) * 5 // 5 minutes per question
    case 'review':
      return 20 // 20 minutes for review
    case 'video':
      return 15 // 15 minutes for video
    default:
      return 20
  }
}

/**
 * Get goal description for a day
 */
function getDayGoal(dayRecs) {
  const types = [...new Set(dayRecs.map(r => r.type))]
  const weakTopics = [...new Set(dayRecs.flatMap(r => r.weakTopics || []))]

  if (weakTopics.length > 0) {
    return `重点提升：${weakTopics.slice(0, 2).join('、')}`
  }

  if (types.includes('chapter')) {
    return '巩固基础知识'
  }

  if (types.includes('practice')) {
    return '强化练习'
  }

  return '复习巩固'
}

export default {
  generateRecommendations,
  getUserRecommendations,
  completeRecommendation,
  skipRecommendation,
  generateLearningPlan
}
