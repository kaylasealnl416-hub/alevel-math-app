// ============================================================
// Practice Service
// 题库查询、答题记录、学习推荐（纯题库模式，不依赖 AI）
// ============================================================

import { db } from '../db/index.js'
import { questions, userAnswers, chapters } from '../db/schema.js'
import { eq, and, sql, inArray } from 'drizzle-orm'

const DEFAULT_COUNT = 5

/**
 * 从题库获取题目（纯数据库查询，不调用 AI）
 * 返回 { questions, requested, available } 让调用方知道实际数量
 */
export async function getQuestions(chapterId, difficulty, aiOptions = {}, chapterFallback = null, count = DEFAULT_COUNT, subject = 'mathematics') {
  const diffRange = {
    easy: [1, 2],
    medium: [2, 3],
    hard: [4, 5]
  }
  const [minDiff, maxDiff] = diffRange[difficulty] || [2, 3]

  // 从题库查询已有题目
  const bankQuestions = await db
    .select()
    .from(questions)
    .where(
      and(
        eq(questions.chapterId, chapterId),
        sql`${questions.difficulty} >= ${minDiff}`,
        sql`${questions.difficulty} <= ${maxDiff}`,
        sql`${questions.status} IN ('published', 'draft')`
      )
    )
    .orderBy(sql`RANDOM()`)
    .limit(count)

  return bankQuestions
}

/**
 * Save a user's answer to a practice question
 */
export async function saveAnswer(userId, questionId, answer, isCorrect, timeSpent) {
  const [record] = await db.insert(userAnswers).values({
    userId,
    questionId,
    userAnswer: { value: answer },
    isCorrect,
    timeSpent,
  }).returning()

  // Update question stats
  await db
    .update(questions)
    .set({
      usageCount: sql`${questions.usageCount} + 1`,
      correctRate: sql`(COALESCE(${questions.correctRate}, 0) * COALESCE(${questions.usageCount}, 0) + ${isCorrect ? 1 : 0}) / (COALESCE(${questions.usageCount}, 0) + 1)`,
    })
    .where(eq(questions.id, questionId))

  return record
}

/**
 * Get recommendations after a round
 */
export async function getRecommendations(chapterId, wrongQuestionIds) {
  const recs = []

  // 1. If wrong answers exist, recommend redo by tags (最多推荐前3个薄弱标签)
  if (wrongQuestionIds.length > 0) {
    const wrongQs = await db.select().from(questions).where(inArray(questions.id, wrongQuestionIds))

    // 只保留属于当前章节的错题，过滤掉跨科目污染数据
    const chapterWrongQs = wrongQs.filter(q => q.chapterId === chapterId)
    const targetQs = chapterWrongQs.length > 0 ? chapterWrongQs : wrongQs

    // 过滤掉中文 tag（历史脏数据）
    const isEnglishTag = (tag) => !/[\u4e00-\u9fff]/.test(tag)
    const wrongTags = [...new Set(targetQs.flatMap(q => (q.tags || []).filter(isEnglishTag)))]
    const topTags = wrongTags.slice(0, 3)
    for (const tag of topTags) {
      recs.push({
        type: 'redo_topic',
        title: `Redo: ${tag}`,
        description: `Practice more on "${tag}"`,
        chapterId,
        tags: [tag],
        difficulty: 'medium',
        priority: 1
      })
    }
  }

  // 2. Previous chapter
  const currentChapter = await db.select().from(chapters).where(eq(chapters.id, chapterId)).limit(1)
  if (currentChapter.length > 0) {
    const prevChapter = await db
      .select()
      .from(chapters)
      .where(
        and(
          eq(chapters.unitId, currentChapter[0].unitId),
          sql`${chapters.order} < ${currentChapter[0].order}`
        )
      )
      .orderBy(sql`${chapters.order} DESC`)
      .limit(1)

    if (prevChapter.length > 0) {
      const prevTitle = typeof prevChapter[0].title === 'object'
        ? (prevChapter[0].title.en || prevChapter[0].title.zh)
        : prevChapter[0].title
      recs.push({
        type: 'review_previous',
        title: `Review: Ch ${prevChapter[0].num} ${prevTitle}`,
        description: 'Strengthen foundations',
        chapterId: prevChapter[0].id,
        priority: 2
      })
    }
  }

  // 3. Cross-chapter challenge
  recs.push({
    type: 'challenge',
    title: 'Cross-Chapter Challenge',
    description: 'Mixed questions from related chapters',
    chapterId,
    priority: 3
  })

  return recs
}
