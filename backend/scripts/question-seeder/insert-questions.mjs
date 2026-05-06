#!/usr/bin/env bun
// 批量入库题目（吃 JSON 文件，规避 node -e 转义地狱）
// 用法: cd backend && bun scripts/question-seeder/insert-questions.mjs <path-to-questions.json>
//
// JSON 格式：数组 或 { questions: [...] }
// 单题字段（必填）: chapterId, type, difficulty (1-5), content {zh,en,latex}, answer {value,latex,explanation}
// 单题字段（可选）: options, explanation, tags, source, estimatedTime, status
// 默认 status = 'reviewed'（不会立即上线，需人工审完后跑 publish-batch.mjs）
import { db, closeConnection } from '../../src/db/index.js'
import { questions, chapters } from '../../src/db/schema.js'
import { inArray } from 'drizzle-orm'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const jsonPath = process.argv[2]
if (!jsonPath) {
  console.error('用法: bun scripts/question-seeder/insert-questions.mjs <path-to-questions.json>')
  process.exit(1)
}

const absPath = resolve(jsonPath)
let payload
try {
  payload = JSON.parse(readFileSync(absPath, 'utf-8'))
} catch (e) {
  console.error(`❌ 读取/解析 JSON 失败: ${e.message}`)
  process.exit(1)
}

const items = Array.isArray(payload) ? payload : payload.questions
if (!Array.isArray(items) || items.length === 0) {
  console.error('❌ JSON 必须是数组，或包含非空 questions 数组字段')
  process.exit(1)
}

// 1. 校验 chapter_id 全部存在
const chapterIds = [...new Set(items.map(q => q.chapterId))]
const existing = await db.select({ id: chapters.id }).from(chapters).where(inArray(chapters.id, chapterIds))
const existingSet = new Set(existing.map(c => c.id))
const invalid = chapterIds.filter(id => !existingSet.has(id))
if (invalid.length > 0) {
  console.error(`❌ 以下 chapter_id 在 DB 中不存在：`)
  invalid.forEach(id => console.error(`   - ${id}`))
  console.error('\n用 list-chapters.mjs 查真实 ID 后重试。停工，未写入任何题目。')
  await closeConnection()
  process.exit(1)
}

// 2. 校验单题必填字段
for (const [i, q] of items.entries()) {
  const missing = []
  if (!q.chapterId) missing.push('chapterId')
  if (!q.type) missing.push('type')
  if (q.difficulty == null) missing.push('difficulty')
  if (!q.content) missing.push('content')
  if (!q.answer) missing.push('answer')
  if (missing.length > 0) {
    console.error(`❌ 第 ${i + 1} 题缺少必填字段: ${missing.join(', ')}`)
    await closeConnection()
    process.exit(1)
  }
  if (!Number.isInteger(q.difficulty) || q.difficulty < 1 || q.difficulty > 5) {
    console.error(`❌ 第 ${i + 1} 题 difficulty 必须是 1-5 的整数（当前 ${q.difficulty}）`)
    await closeConnection()
    process.exit(1)
  }
  const allowedTypes = ['multiple_choice', 'fill_blank', 'calculation', 'proof']
  if (!allowedTypes.includes(q.type)) {
    console.error(`❌ 第 ${i + 1} 题 type 必须是 ${allowedTypes.join(' / ')}（当前 ${q.type}）`)
    await closeConnection()
    process.exit(1)
  }
}

// 3. 默认值 + 入库
const enriched = items.map(q => ({
  chapterId: q.chapterId,
  type: q.type,
  difficulty: q.difficulty,
  content: q.content,
  options: q.options ?? null,
  answer: q.answer,
  explanation: q.explanation ?? null,
  tags: q.tags ?? [],
  source: q.source ?? 'ai_generated',
  estimatedTime: q.estimatedTime ?? 300,
  status: q.status ?? 'reviewed',
  createdAt: new Date(),
  updatedAt: new Date(),
}))

const inserted = await db
  .insert(questions)
  .values(enriched)
  .returning({ id: questions.id, chapterId: questions.chapterId, difficulty: questions.difficulty, type: questions.type })

console.log(`\n✅ 已入库 ${inserted.length} 道题（status: ${enriched[0].status}）`)
console.log(`\nID 清单（按章节分组）：`)
const byChapter = {}
for (const q of inserted) {
  ;(byChapter[q.chapterId] ||= []).push(q.id)
}
for (const [chId, ids] of Object.entries(byChapter)) {
  console.log(`  ${chId}: [${ids.join(', ')}]`)
}

if ((enriched[0].status ?? 'reviewed') === 'reviewed') {
  console.log(`\n下一步：你预览确认后，运行：`)
  console.log(`  bun scripts/question-seeder/publish-batch.mjs ${inserted.map(q => q.id).join(' ')}`)
}

await closeConnection()
