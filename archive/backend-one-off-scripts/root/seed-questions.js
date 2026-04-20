// ============================================================
// 题库预生成脚本 v2
// 为 Math / Further Math / Economics / History 共~102个章节
// 每章生成5道题并写入 DB（status=published）
// 运行：cd backend && node seed-questions.js
// ============================================================

import postgres from 'postgres'
import { pathToFileURL } from 'url'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ── DB 连接 ──────────────────────────────────────────────────
import dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(__dirname, '.env.local') })

const DATABASE_URL = process.env.DATABASE_URL
const GLM_API_KEY = process.env.GLM_API_KEY

if (!DATABASE_URL) throw new Error('Missing DATABASE_URL in .env.local')
if (!GLM_API_KEY) throw new Error('Missing GLM_API_KEY in .env.local')

const sql = postgres(DATABASE_URL, { ssl: 'require', max: 5 })
const GLM_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

// ── 学科 Prompt 配置 ──────────────────────────────────────────
const SUBJECT_PROFILES = {
  mathematics: {
    role: 'expert Pearson Edexcel IAL Mathematics question setter with 10+ years of experience',
    papers: 'WMA11/WMA12/WMA13/WMA14',
    conventions: [
      'Use LaTeX notation for all maths: $x^2$, $\\\\frac{a}{b}$, $\\\\sqrt{x}$',
      'Questions must be solvable using standard A-Level techniques only',
      'Include exact or 3 s.f. numerical answers',
      'Follow Edexcel mark scheme conventions',
    ],
  },
  further_mathematics: {
    role: 'expert Pearson Edexcel IAL Further Mathematics question setter',
    papers: 'WFM11/WFM12/WFM13/WFM14',
    conventions: [
      'Use LaTeX notation for all maths: $x^2$, $\\\\frac{a}{b}$',
      'Questions extend beyond A-Level into proof, complex numbers, matrices, advanced calculus',
      'Include exact answers using surds, pi, e or standard form',
    ],
  },
  economics: {
    role: 'expert Pearson Edexcel IAL Economics question setter specialising in micro and macroeconomics',
    papers: 'WEC11/WEC12/WEC13/WEC14',
    conventions: [
      'Questions must test understanding of economic concepts, not just recall',
      'Use real-world contexts (markets, government policy, firms)',
      'Distractors should reflect common misconceptions in economic reasoning',
    ],
  },
  history: {
    role: 'expert Pearson Edexcel IAL History question setter specialising in modern world history',
    papers: 'WHS11/WHS12/WHS13/WHS14',
    conventions: [
      'Questions must test historical thinking: causation, consequence, change, significance',
      'Short-answer questions require specific factual evidence',
      'MCQ distractors should reflect partially correct historical interpretations',
    ],
  },
}

const QUESTION_MIX = {
  mathematics:         { mcq: 2, calculation: 3, short_answer: 0 },
  further_mathematics: { mcq: 2, calculation: 3, short_answer: 0 },
  economics:           { mcq: 3, calculation: 0, short_answer: 2 },
  history:             { mcq: 1, calculation: 0, short_answer: 4 },
}

// ── chapter_id → unit_id 映射 ─────────────────────────────────
function getUnitId(chapterId, subject) {
  if (subject === 'mathematics') {
    if (chapterId.startsWith('s1')) return 'mathematics_S1'
    if (chapterId.startsWith('m1')) return 'mathematics_M1'
    const m = chapterId.match(/^p(\d)/)
    return m ? `mathematics_P${m[1]}` : 'mathematics_P1'
  }
  if (subject === 'further_mathematics') {
    if (chapterId.startsWith('fmech')) return 'further_math_FM1'
    if (chapterId.startsWith('fs'))    return 'further_math_FS1'
    const m = chapterId.match(/^fm(\d)/)
    return m ? `further_math_FP${m[1]}` : 'further_math_FP1'
  }
  if (subject === 'economics') {
    const m = chapterId.match(/^e(\d)/)
    return m ? `economics_Unit${m[1]}` : 'economics_Unit1'
  }
  if (subject === 'history') {
    const m = chapterId.match(/^h(\d)/)
    return m ? `history_Unit${m[1]}` : 'history_Unit1'
  }
  return null
}

// ── 读取章节数据 ──────────────────────────────────────────────
async function loadChapters() {
  const dataDir = path.resolve(__dirname, '../src/data')
  const { CURRICULUM } = await import(pathToFileURL(path.join(dataDir, 'curriculum.js')).href)
  const { SUBJECTS } = await import(pathToFileURL(path.join(dataDir, 'subjects.js')).href)

  const chapters = []

  // Math (curriculum.js: P1-P4, S1, M1)
  for (const [bookKey, book] of Object.entries(CURRICULUM)) {
    for (const ch of book.chapters) {
      chapters.push({ ...ch, subject: 'mathematics', bookKey })
    }
  }

  // Further Math
  if (SUBJECTS.further_mathematics?.books) {
    for (const [bookKey, book] of Object.entries(SUBJECTS.further_mathematics.books)) {
      for (const ch of (book.chapters || [])) {
        chapters.push({ ...ch, subject: 'further_mathematics', bookKey })
      }
    }
  }

  // Economics
  if (SUBJECTS.economics?.books) {
    for (const [bookKey, book] of Object.entries(SUBJECTS.economics.books)) {
      for (const ch of (book.chapters || [])) {
        chapters.push({ ...ch, subject: 'economics', bookKey })
      }
    }
  }

  // History
  if (SUBJECTS.history?.books) {
    for (const [bookKey, book] of Object.entries(SUBJECTS.history.books)) {
      for (const ch of (book.chapters || [])) {
        chapters.push({ ...ch, subject: 'history', bookKey })
      }
    }
  }

  return chapters
}

// ── 确保章节在 DB chapters 表中存在 ──────────────────────────
async function ensureChapters(chapters) {
  const existing = await sql`SELECT id FROM chapters`
  const existingSet = new Set(existing.map(r => r.id))

  const missing = chapters.filter(ch => !existingSet.has(ch.id))
  if (missing.length === 0) {
    console.log('✅ 所有章节已存在于 DB chapters 表')
    return
  }

  console.log(`📥 插入 ${missing.length} 个缺失章节到 chapters 表...`)
  for (const ch of missing) {
    const unitId = getUnitId(ch.id, ch.subject)
    if (!unitId) { console.warn(`  ⚠ 无法确定 unit_id: ${ch.id}`); continue }
    const title = typeof ch.title === 'object' ? ch.title : { en: ch.title, zh: ch.title }
    const overview = typeof ch.overview === 'object' ? ch.overview :
                     (ch.overview ? { en: ch.overview, zh: ch.overview } : null)
    try {
      await sql`
        INSERT INTO chapters (id, unit_id, num, title, overview, key_points, formulas, "order")
        VALUES (
          ${ch.id},
          ${unitId},
          ${ch.num || 1},
          ${JSON.stringify(title)},
          ${overview ? JSON.stringify(overview) : null},
          ${ch.keyPoints ? JSON.stringify(ch.keyPoints) : null},
          ${ch.formulas ? JSON.stringify(ch.formulas) : null},
          ${ch.num || 1}
        )
        ON CONFLICT (id) DO NOTHING
      `
      console.log(`  ✅ 插入章节: ${ch.id}`)
    } catch (e) {
      console.error(`  ❌ 插入章节失败 ${ch.id}: ${e.message}`)
    }
  }
}

// ── 构建 Prompt ───────────────────────────────────────────────
function buildSystemPrompt(subject) {
  const p = SUBJECT_PROFILES[subject]
  const conventions = p.conventions.map(c => `- ${c}`).join('\n')
  return `You are an ${p.role}.
You write questions for Pearson Edexcel IAL (${p.papers}).
RULES:
- Every question must be solvable using ONLY the concepts in the chapter context below
- Never introduce topics outside the specified chapter scope
${conventions}
- Return ONLY valid JSON — no markdown fences, no prose outside the array
- ALL string values in the JSON must be properly quoted, including option values`
}

function buildUserPrompt(chapter, subject) {
  const mix = QUESTION_MIX[subject]
  const title = typeof chapter.title === 'object' ? (chapter.title.en || chapter.title.zh) : chapter.title

  const kp = Array.isArray(chapter.keyPoints) && chapter.keyPoints.length > 0
    ? '\nKEY POINTS:\n' + chapter.keyPoints.map((p, i) => {
        const text = typeof p === 'object' ? (p.en || p.zh || JSON.stringify(p)) : p
        return `${i+1}. ${text}`
      }).join('\n')
    : ''

  const formulas = Array.isArray(chapter.formulas) && chapter.formulas.length > 0
    ? '\nKEY FORMULAS:\n' + chapter.formulas.map(f => `- ${f.name}: ${f.expr}`).join('\n')
    : ''

  const hardPoints = typeof chapter.hardPoints === 'string' && chapter.hardPoints.trim()
    ? '\nCOMMON MISTAKES:\n' + chapter.hardPoints.trim() : ''

  const examTips = typeof chapter.examTips === 'string' && chapter.examTips.trim()
    ? '\nEXAM TIPS:\n' + chapter.examTips.trim() : ''

  const parts = []
  if (mix.mcq > 0)          parts.push(`${mix.mcq} multiple_choice`)
  if (mix.calculation > 0)  parts.push(`${mix.calculation} calculation`)
  if (mix.short_answer > 0) parts.push(`${mix.short_answer} short_answer`)
  const distrib = parts.join(', ')
  const total = mix.mcq + mix.calculation + mix.short_answer

  return `CHAPTER: ${title}${kp}${formulas}${hardPoints}${examTips}

---
Generate exactly ${total} questions. Distribution: ${distrib}

Return a JSON array. Each object MUST have:
{
  "type": "multiple_choice" | "calculation" | "short_answer",
  "question": "question text (string)",
  "options": {"A": "string", "B": "string", "C": "string", "D": "string"} or null,
  "correct": "answer string",
  "solution": "step-by-step solution string",
  "tags": ["tag1", "tag2"],
  "difficulty": 3
}

IMPORTANT: ALL values must be properly JSON-quoted strings. Do not put bare dollar signs or LaTeX outside quotes.
Return ONLY the JSON array, starting with [ and ending with ].`
}

// ── 调用 GLM ─────────────────────────────────────────────────
async function callGLM(systemPrompt, userPrompt, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(GLM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GLM_API_KEY}` },
        body: JSON.stringify({
          model: 'glm-4-plus',
          messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
          max_tokens: 3000,
          temperature: 0.5,
        })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`)
      const data = await res.json()
      return data.choices[0].message.content
    } catch (e) {
      if (attempt === retries) throw e
      await new Promise(r => setTimeout(r, 2000 * (attempt + 1)))
    }
  }
}

// ── JSON 解析（容错）─────────────────────────────────────────
function parseQuestions(raw) {
  // 清理常见问题：去掉 markdown fence
  let cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim()

  // 提取 [...] 范围
  const start = cleaned.indexOf('[')
  const end = cleaned.lastIndexOf(']')
  if (start !== -1 && end > start) {
    cleaned = cleaned.substring(start, end + 1)
  }

  // 修复：MCQ 选项中裸露的 LaTeX 值（"A": $x+1$ → "A": "$x+1$"）
  cleaned = cleaned.replace(/:\s*(\$[^"\n,}\]]+\$)/g, ': "$1"')

  // 尝试直接解析
  try {
    return JSON.parse(cleaned)
  } catch {}

  // 修复：LaTeX 反斜杠未转义（\frac → \\frac）
  try {
    const fixed = cleaned.replace(/\\([^"\\nrbtfu/])/g, '\\\\$1')
    return JSON.parse(fixed)
  } catch {}

  // 最后：逐字符修复，移除控制字符
  try {
    const fixed = cleaned.replace(/[\x00-\x1F\x7F]/g, ' ')
    return JSON.parse(fixed)
  } catch (e) {
    throw new Error(`JSON parse failed: ${e.message}\nRaw (first 200): ${raw.substring(0, 200)}`)
  }
}

// ── 保存到 DB ─────────────────────────────────────────────────
async function saveQuestions(chapter, questions) {
  let saved = 0
  for (const q of questions) {
    const qType = q.type || 'multiple_choice'
    const estimatedTime = qType === 'short_answer' ? 300 : qType === 'calculation' ? 240 : 120
    try {
      await sql`
        INSERT INTO questions
          (chapter_id, type, difficulty, content, options, answer, explanation, tags, source, status, estimated_time)
        VALUES (
          ${chapter.id},
          ${qType},
          ${q.difficulty || 3},
          ${JSON.stringify({ en: q.question })},
          ${q.options ? JSON.stringify(q.options) : null},
          ${JSON.stringify({ value: q.correct, explanation: q.solution })},
          ${JSON.stringify({ en: q.solution, keyFormula: '', commonMistake: '', whyOthersWrong: {} })},
          ${JSON.stringify(q.tags || [])},
          'ai_generated',
          'published',
          ${estimatedTime}
        )
      `
      saved++
    } catch (e) {
      console.error(`    ⚠ 单题保存失败 (${chapter.id}): ${e.message.substring(0, 80)}`)
    }
  }
  return saved
}

// ── 并发控制 ─────────────────────────────────────────────────
async function pLimit(tasks, concurrency) {
  let i = 0
  async function run() {
    while (i < tasks.length) {
      const idx = i++
      await tasks[idx]()
    }
  }
  await Promise.all(Array.from({ length: concurrency }, run))
}

// ── 主流程 ────────────────────────────────────────────────────
async function main() {
  console.log('📚 加载章节数据...')
  const chapters = await loadChapters()
  console.log(`✅ 共 ${chapters.length} 个章节`)

  // 确保所有章节在 DB 中存在
  await ensureChapters(chapters)
  console.log()

  // 检查已有 published 题的章节
  const existing = await sql`
    SELECT chapter_id, COUNT(*) as cnt
    FROM questions WHERE status = 'published'
    GROUP BY chapter_id
  `
  const existingMap = new Map(existing.map(r => [r.chapter_id, parseInt(r.cnt)]))
  const toProcess = chapters.filter(ch => (existingMap.get(ch.id) || 0) < 3)
  console.log(`📝 需生成的章节: ${toProcess.length}（已有≥3题的 ${chapters.length - toProcess.length} 个跳过）\n`)

  let done = 0, failed = 0, totalSaved = 0
  const failedList = []

  const tasks = toProcess.map(ch => async () => {
    const title = typeof ch.title === 'object' ? (ch.title.en || ch.title.zh) : ch.title
    const label = `[${ch.id}] ${String(title).substring(0, 35)}`
    try {
      const sys = buildSystemPrompt(ch.subject)
      const usr = buildUserPrompt(ch, ch.subject)
      const raw = await callGLM(sys, usr)
      const questions = parseQuestions(raw)
      if (!Array.isArray(questions) || questions.length === 0) throw new Error('Empty question array')
      const saved = await saveQuestions(ch, questions)
      done++
      totalSaved += saved
      console.log(`  ✅ ${label} → ${saved}题 (${done}/${toProcess.length})`)
    } catch (e) {
      failed++
      failedList.push({ id: ch.id, title: String(title).substring(0, 30), error: e.message.substring(0, 100) })
      console.error(`  ❌ ${label}: ${e.message.substring(0, 80)}`)
    }
  })

  console.log('🚀 开始生成（3并发）...\n')
  await pLimit(tasks, 3)

  console.log(`\n${'='.repeat(55)}`)
  console.log(`✅ 成功: ${done} 章节 | ❌ 失败: ${failed} 章节`)
  console.log(`📦 共存入: ${totalSaved} 道题`)

  if (failedList.length > 0) {
    console.log('\n失败章节:')
    failedList.forEach(f => console.log(`  ${f.id} ${f.title}: ${f.error}`))
  }

  const stats = await sql`SELECT COUNT(*) as total FROM questions WHERE status = 'published'`
  console.log(`\n🗄  DB published题总数: ${stats[0].total}`)

  await sql.end()
}

main().catch(e => { console.error('Fatal:', e); process.exit(1) })
