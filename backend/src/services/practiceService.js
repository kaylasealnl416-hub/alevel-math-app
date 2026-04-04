// ============================================================
// Practice Service
// Mixed question sourcing (bank + AI), answer saving, recommendations
// ============================================================

import { db } from '../db/index.js'
import { questions, userAnswers, chapters } from '../db/schema.js'
import { eq, and, sql, inArray } from 'drizzle-orm'
import { callAI } from './aiClient.js'

const DEFAULT_COUNT = 5

// ── 学科专属 System Prompt 生成器 ─────────────────────────────
const SUBJECT_PROFILES = {
  mathematics: {
    name: 'Mathematics',
    papers: 'WMA11/WMA12/WMA13/WMA14',
    role: 'expert Pearson Edexcel IAL Mathematics question setter with 10+ years of experience writing A-Level pure and applied maths papers',
    conventions: [
      'Use precise mathematical notation (LaTeX where needed, e.g. $x^2$, $\\frac{a}{b}$)',
      'Questions must be solvable using standard A-Level techniques only',
      'Include numerical answers that are exact or to 3 significant figures unless stated',
      'Follow Edexcel mark scheme conventions for method marks (M) and accuracy marks (A)',
    ],
  },
  economics: {
    name: 'Economics',
    papers: 'WEC11/WEC12/WEC13/WEC14',
    role: 'expert Pearson Edexcel IAL Economics question setter specialising in microeconomics and macroeconomics at A-Level',
    conventions: [
      'Questions must test understanding of economic concepts, not just recall',
      'Use real-world contexts where appropriate (markets, government policy, firms)',
      'Distractors should reflect common misconceptions in economic reasoning',
      'Align with Edexcel IAL Economics specification terminology',
    ],
  },
  physics: {
    name: 'Physics',
    papers: 'WPH11/WPH12/WPH13/WPH14',
    role: 'expert Pearson Edexcel IAL Physics question setter with deep knowledge of mechanics, electricity, waves, and modern physics',
    conventions: [
      'Include units in all numerical answers',
      'Use SI units throughout unless the question specifies otherwise',
      'Questions may involve data analysis, graph interpretation, or calculation',
      'Follow Edexcel IAL Physics specification and data booklet conventions',
    ],
  },
  chemistry: {
    name: 'Chemistry',
    papers: 'WCH11/WCH12/WCH13/WCH14',
    role: 'expert Pearson Edexcel IAL Chemistry question setter covering organic, inorganic, and physical chemistry',
    conventions: [
      'Use IUPAC nomenclature for all chemical names',
      'Include state symbols in equations where relevant',
      'Questions may involve calculations (moles, concentrations, enthalpy)',
      'Follow Edexcel IAL Chemistry specification conventions',
    ],
  },
  biology: {
    name: 'Biology',
    papers: 'WBI11/WBI12/WBI13/WBI14',
    role: 'expert Pearson Edexcel IAL Biology question setter covering cell biology, genetics, ecology, and physiology',
    conventions: [
      'Use precise biological terminology consistent with the Edexcel specification',
      'Questions may involve data interpretation, experimental design, or concept application',
      'Distractors should reflect common misconceptions in biological reasoning',
      'Follow Edexcel IAL Biology specification conventions',
    ],
  },
  history: {
    name: 'History',
    papers: 'WHS11/WHS12/WHS13/WHS14',
    role: 'expert Pearson Edexcel IAL History question setter specialising in modern world history, causation, and historical analysis',
    conventions: [
      'Questions must test historical thinking skills: causation, consequence, change, continuity, significance',
      'Short-answer questions should require specific factual evidence to support arguments',
      'MCQ distractors should reflect common misconceptions or partially correct historical interpretations',
      'Align with Edexcel IAL History specification themes and key questions',
      'Avoid anachronistic judgements; frame questions within historical context',
    ],
  },
  further_mathematics: {
    name: 'Further Mathematics',
    papers: 'WFM11/WFM12/WFM13/WFM14',
    role: 'expert Pearson Edexcel IAL Further Mathematics question setter with deep knowledge of advanced pure maths, mechanics, and statistics',
    conventions: [
      'Use precise mathematical notation (LaTeX where needed)',
      'Questions extend beyond A-Level Mathematics into proof, complex numbers, matrices, and advanced calculus',
      'Include exact answers using surds, π, e or standard form where appropriate',
      'Follow Edexcel IAL Further Mathematics specification conventions',
    ],
  },
}

// 按学科决定题型混合比例
function buildQuestionTypeMix(subjectId, count) {
  // 各学科的题型比例配置
  const MIXES = {
    mathematics:         { mcq: 0,   calculation: 1.0, short_answer: 0 },
    economics:           { mcq: 0.5, calculation: 0,   short_answer: 0.5 },
    physics:             { mcq: 0.4, calculation: 0.6, short_answer: 0 },
    chemistry:           { mcq: 0.4, calculation: 0.6, short_answer: 0 },
    biology:             { mcq: 0.5, calculation: 0,   short_answer: 0.5 },
    history:             { mcq: 0.2, calculation: 0,   short_answer: 0.8 },
    further_mathematics: { mcq: 0.4, calculation: 0.6, short_answer: 0 },
  }
  const mix = MIXES[subjectId] || MIXES.mathematics

  const mcqCount  = Math.round(count * mix.mcq)
  const calcCount = Math.round(count * mix.calculation)
  const saCount   = count - mcqCount - calcCount

  const parts = []
  if (mcqCount > 0)  parts.push(`${mcqCount} multiple_choice`)
  if (calcCount > 0) parts.push(`${calcCount} calculation`)
  if (saCount > 0)   parts.push(`${saCount} short_answer`)

  return {
    description: parts.join(', '),
    spec: parts.join(', '),
  }
}

function buildSystemPrompt(subjectId) {
  const profile = SUBJECT_PROFILES[subjectId] || SUBJECT_PROFILES.mathematics
  const conventions = profile.conventions.map(c => `- ${c}`).join('\n')

  return `You are an ${profile.role}.
You write questions for Pearson Edexcel IAL ${profile.name} (${profile.papers}).

RULES:
- You are ONLY allowed to generate ${profile.name} questions. Never generate questions for any other subject.
- Every question must be strictly within the ${profile.name} subject domain
- Questions must strictly follow Edexcel IAL mark scheme conventions
- Every question must be solvable using ONLY the concepts in the chapter context below
- Never introduce topics outside the specified chapter scope
- Difficulty must match real Edexcel past paper distribution
${conventions}
- Always respond with valid JSON only — no markdown, no prose
- ALL text fields (question, solution, deepExplanation, keyFormula, commonMistake, tags) MUST be in English only. Never use Chinese or any other language.`
}

/**
 * Get questions for practice/exam: from bank first, AI fills gaps
 * @param {number} count - 需要的题目数量（默认5）
 */
export async function getQuestions(chapterId, difficulty, aiOptions = {}, chapterFallback = null, count = DEFAULT_COUNT, subject = 'mathematics') {
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
  // 数据库里的 chapter 没有 subject 字段，必须从外部注入
  const chapter = chapterData[0]
    ? { ...chapterData[0], subject: chapterFallback?.subject || subject }
    : chapterFallback

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

  // ── 结构化章节知识库 ──────────────────────────────────────
  const keyPoints = Array.isArray(chapter.keyPoints) && chapter.keyPoints.length > 0
    ? chapter.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')
    : null

  const formulas = Array.isArray(chapter.formulas) && chapter.formulas.length > 0
    ? chapter.formulas.map(f => `• ${f.name}: ${f.expr}`).join('\n')
    : null

  const hardPoints = typeof chapter.hardPoints === 'string' && chapter.hardPoints.trim()
    ? chapter.hardPoints.trim()
    : null

  const examTips = typeof chapter.examTips === 'string' && chapter.examTips.trim()
    ? chapter.examTips.trim()
    : null

  const diffLabel = difficulty === 'hard'
    ? 'challenging (difficulty 4-5, multi-step, requires combining multiple concepts)'
    : difficulty === 'easy'
      ? 'accessible (difficulty 1-2) — IMPORTANT: "easy" means straightforward application of a single concept, NOT primary school level. Questions must still be A-Level standard, just testing one concept at a time with no tricks'
      : 'standard (difficulty 3, typical Edexcel IAL exam question)'

  // ── 第一层：任务专属 System Prompt（按学科动态生成）────────
  const subjectId = chapter.subject || 'mathematics'
  const systemPrompt = buildSystemPrompt(subjectId)

  // ── 第二层：章节知识库注入 ────────────────────────────────
  const chapterContext = [
    `CHAPTER: ${chTitle}`,
    keyPoints   ? `\nKEY POINTS:\n${keyPoints}` : '',
    formulas    ? `\nKEY FORMULAS:\n${formulas}` : '',
    hardPoints  ? `\nCOMMON MISTAKES (高频失分点):\n${hardPoints}` : '',
    examTips    ? `\nEXAM TIPS:\n${examTips}` : '',
  ].filter(Boolean).join('\n')

  // ── 第三层：题型分配（按学科决定混合比例）────────────────
  const questionTypeMix = buildQuestionTypeMix(subjectId, count)

  const subjectName = (SUBJECT_PROFILES[subjectId] || SUBJECT_PROFILES.mathematics).name

  const userPrompt = `${chapterContext}

---
Generate ${count} ${diffLabel} ${subjectName} questions for the chapter above.
IMPORTANT: All questions must be ${subjectName} questions only. Do NOT generate questions from any other subject.
Question type distribution: ${questionTypeMix.description}

Each question must test a DIFFERENT key point from the list above.
Questions testing "COMMON MISTAKES" topics should appear in proportion to their exam frequency.

For EACH question return ALL fields below. The "type" field determines the format:

TYPE: "multiple_choice"
- type: "multiple_choice"
- question: clear question text (use LaTeX notation where needed, e.g. $x^2$)
- options: {"A": "...", "B": "...", "C": "...", "D": "..."}
- correct: the correct answer letter (e.g. "B")
- solution: step-by-step worked solution (2-4 lines)
- deepExplanation: 3-5 sentence explanation of WHY the answer is correct
- keyFormula: the key formula or concept used
- commonMistake: the most common student error on this question type
- whyOthersWrong: {"B": "reason", "C": "reason", "D": "reason"} (omit the correct letter)
- tags: array of topic tags
- difficulty: number 1-5

TYPE: "calculation"
- type: "calculation"
- question: question text with all given values (use LaTeX notation)
- options: null
- correct: the numerical answer as a string (e.g. "3.14" or "2.5 × 10^3")
- solution: step-by-step worked solution showing all working
- deepExplanation: explanation of the method used
- keyFormula: the formula applied
- commonMistake: common error students make
- whyOthersWrong: {}
- tags: array of topic tags
- difficulty: number 1-5

TYPE: "short_answer"
- type: "short_answer"
- question: question text asking student to explain, describe, or analyse
- options: null
- correct: a FULL model answer written out in complete sentences (2-4 sentences minimum). NEVER write "See solution" or "See worked solution" — always provide the actual answer text.
- solution: the model answer with key points highlighted
- deepExplanation: why this answer earns full marks
- keyFormula: key concept or term (if applicable, else "")
- commonMistake: common incomplete or incorrect responses
- whyOthersWrong: {}
- tags: array of topic tags in English (e.g. ["differentiation", "chain rule"])
- difficulty: number 1-5

NOTE: For proof-style questions, the "correct" field must contain the complete step-by-step proof, not a placeholder like "See solution".

Generate exactly this distribution: ${questionTypeMix.spec}

CRITICAL: All text must be in English only. Do not use Chinese or any other language in any field.
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
    const qType = q.type || 'multiple_choice'
    const estimatedTime = qType === 'short_answer' ? 300 : qType === 'calculation' ? 240 : 120

    const [saved] = await db.insert(questions).values({
      chapterId: chapter.id,
      type: qType,
      difficulty: q.difficulty || diffMap[difficulty] || 3,
      content: { en: q.question },
      options: q.options || null,
      answer: { value: q.correct, explanation: q.solution },
      explanation: {
        en: q.deepExplanation,
        keyFormula: q.keyFormula || '',
        commonMistake: q.commonMistake,
        whyOthersWrong: q.whyOthersWrong || {}
      },
      tags: q.tags || [],
      source: 'ai_generated',
      status: 'draft',
      estimatedTime,
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

    // 只保留属于当前章节的错题，过滤掉跨科目污染数据
    const chapterWrongQs = wrongQs.filter(q => q.chapterId === chapterId)
    const targetQs = chapterWrongQs.length > 0 ? chapterWrongQs : wrongQs

    // 过滤掉中文 tag（历史脏数据）
    const isEnglishTag = (tag) => /^[a-zA-Z0-9\s\-_/()]+$/.test(tag)
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
