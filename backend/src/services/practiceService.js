// ============================================================
// Practice Service
// Mixed question sourcing (bank + AI), answer saving, recommendations
// ============================================================

import { db } from '../db/index.js'
import { questions, userAnswers, chapters } from '../db/schema.js'
import { eq, and, sql, inArray } from 'drizzle-orm'
import { callAI } from './aiClient.js'

const DEFAULT_COUNT = 5

/**
 * Get questions for practice/exam: from bank first, AI fills gaps
 * @param {number} count - 需要的题目数量（默认5）
 */
export async function getQuestions(chapterId, difficulty, aiOptions = {}, chapterFallback = null, count = DEFAULT_COUNT) {
  const diffRange = {
    easy: [1, 2],
    medium: [2, 3],
    hard: [4, 5]
  }
  const [minDiff, maxDiff] = diffRange[difficulty] || [2, 3]

  // 1. Query existing questions from bank
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

  // 2. If enough questions, return them
  if (bankQuestions.length >= count) {
    return bankQuestions.slice(0, count)
  }

  // 3. Need AI to generate more
  const needed = count - bankQuestions.length
  const chapterData = await db.select().from(chapters).where(eq(chapters.id, chapterId)).limit(1)
  const chapter = chapterData[0] || chapterFallback

  if (!chapter) throw new Error('Chapter not found')

  // 分批生成（每批最多 10 题，避免 AI 输出截断）
  const BATCH_SIZE = 10
  const aiQuestions = []
  let remaining = needed
  while (remaining > 0) {
    const batch = Math.min(remaining, BATCH_SIZE)
    const batchResult = await generateAndSaveQuestions(chapter, batch, difficulty, aiOptions)
    aiQuestions.push(...batchResult)
    remaining -= batch
  }

  return [...bankQuestions, ...aiQuestions]
}

/**
 * Generate questions via AI and save to questions table
 */
async function generateAndSaveQuestions(chapter, count, difficulty, aiOptions = {}) {
  const chTitle = typeof chapter.title === 'object'
    ? (chapter.title.en || chapter.title.zh)
    : chapter.title
  const keyPoints = Array.isArray(chapter.keyPoints) ? chapter.keyPoints.join('; ') : ''
  const formulas = Array.isArray(chapter.formulas)
    ? chapter.formulas.map(f => `${f.name}: ${f.expr}`).join('; ')
    : ''

  const diffLabel = difficulty === 'hard'
    ? 'challenging A-level exam-style'
    : difficulty === 'easy'
      ? 'basic introductory'
      : 'medium difficulty A-level'

  const systemPrompt = `You are an expert A-Level teacher creating exam questions for Pearson Edexcel IAL. Generate questions exactly as a real exam would. Always respond in valid JSON only — no markdown, no prose.`

  const userPrompt = `Generate ${count} ${diffLabel} questions for the topic: "${chTitle}".

${keyPoints ? `Key concepts: ${keyPoints}` : ''}
${formulas ? `Key formulas: ${formulas}` : ''}

For each question provide ALL fields:
- type: "multiple_choice"
- question: clear question text
- options: {"A": "...", "B": "...", "C": "...", "D": "..."}
- correct: the correct answer letter
- solution: step-by-step worked solution (2-4 lines)
- deepExplanation: thorough 3-5 sentence explanation of WHY the answer is correct
- keyFormula: the key formula or concept needed
- commonMistake: most common student error and how to avoid it
- whyOthersWrong: {"B": "reason", "C": "reason", "D": "reason"} (explain each wrong option)
- tags: array of topic tags, e.g. ["quadratic equations", "factoring"]
- difficulty: number 1-5

Return ONLY a JSON array, no markdown.`

  const messages = [{ role: 'user', content: userPrompt }]
  const opts = { system: systemPrompt, maxTokens: 3000 }
  if (aiOptions.provider && aiOptions.apiKey) {
    opts.provider = aiOptions.provider
    opts.apiKey = aiOptions.apiKey
    if (aiOptions.model) opts.model = aiOptions.model
  }

  const response = await callAI(messages, opts)
  const rawText = response.content

  // Parse JSON from response (容错处理)
  let parsed
  try {
    const startIdx = rawText.indexOf('[')
    const endIdx = rawText.lastIndexOf(']')
    if (startIdx !== -1 && endIdx > startIdx) {
      parsed = JSON.parse(rawText.substring(startIdx, endIdx + 1))
    } else {
      parsed = JSON.parse(rawText.replace(/```json|```/gi, '').trim())
    }
  } catch (parseErr) {
    console.error('AI response JSON parse failed:', parseErr.message)
    console.error('Raw AI response:', rawText.substring(0, 500))
    throw new Error('AI generated invalid response, please try again')
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('AI returned empty question list, please try again')
  }

  // Save each question to DB
  const diffMap = { easy: 2, medium: 3, hard: 4 }
  const savedQuestions = []

  for (const q of parsed) {
    const [saved] = await db.insert(questions).values({
      chapterId: chapter.id,
      type: q.type || 'multiple_choice',
      difficulty: q.difficulty || diffMap[difficulty] || 3,
      content: { en: q.question },
      options: q.options,
      answer: { value: q.correct, explanation: q.solution },
      explanation: {
        en: q.deepExplanation,
        keyFormula: q.keyFormula,
        commonMistake: q.commonMistake,
        whyOthersWrong: q.whyOthersWrong
      },
      tags: q.tags || [],
      source: 'ai_generated',
      status: 'draft',
      estimatedTime: 120,
    }).returning()

    savedQuestions.push(saved)
  }

  return savedQuestions
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
    const wrongTags = [...new Set(wrongQs.flatMap(q => q.tags || []))]
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
