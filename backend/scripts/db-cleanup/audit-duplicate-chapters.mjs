#!/usr/bin/env bun
// READ-ONLY 调查脚本：摸清 mathematics 学科 chapters 表的重复污染情况
// 用法: cd backend && bun scripts/db-cleanup/audit-duplicate-chapters.mjs [subjectId]
//
// 不修改任何数据，只输出诊断报告。
import { db, closeConnection } from '../../src/db/index.js'
import {
  chapters, units, subjects,
  questions, learningProgress, uploadedDocuments,
  questionSets, chatSessions, learningRecommendations,
} from '../../src/db/schema.js'
import { eq, inArray, sql } from 'drizzle-orm'

const subjectId = process.argv[2] || 'mathematics'

// 1. 拉所有该学科的 chapters
const subjectUnits = await db.select({ id: units.id }).from(units).where(eq(units.subjectId, subjectId))
const unitIds = subjectUnits.map(u => u.id)
const allChapters = await db.select().from(chapters).where(inArray(chapters.unitId, unitIds))
console.log(`\n📚 学科 ${subjectId} 共 ${allChapters.length} 条 chapter 记录`)

// 2. 找重复对：根据 unit_id + num（章节序号）分组
const grouped = {}
for (const ch of allChapters) {
  const key = `${ch.unitId}__${ch.num}`
  ;(grouped[key] ||= []).push(ch)
}

const duplicates = Object.entries(grouped).filter(([, list]) => list.length > 1)
const singles = Object.entries(grouped).filter(([, list]) => list.length === 1)

console.log(`✅ 唯一章节: ${singles.length}`)
console.log(`🚨 重复章节对: ${duplicates.length}\n`)

if (duplicates.length === 0) {
  console.log('数据干净，无需清理。')
  await closeConnection()
  process.exit(0)
}

// 3. 收集所有旧 ID（约定：不带 math_ 前缀的为旧；如果两条都不带前缀或都带前缀，则按 created_at 较新的为新）
const oldIds = []
const newIds = []
const pairs = []

for (const [key, list] of duplicates) {
  // 排序：math_ 前缀的为新，其它为旧；同前缀按 createdAt 早的为旧
  const sorted = list.sort((a, b) => {
    const aHasPrefix = a.id.startsWith(`${subjectId === 'mathematics' ? 'math_' : ''}`)
    const bHasPrefix = b.id.startsWith(`${subjectId === 'mathematics' ? 'math_' : ''}`)
    if (aHasPrefix !== bHasPrefix) return aHasPrefix ? 1 : -1
    return new Date(a.createdAt) - new Date(b.createdAt)
  })
  const old = sorted[0]
  const fresh = sorted[sorted.length - 1]
  oldIds.push(old.id)
  newIds.push(fresh.id)
  pairs.push({ old, fresh, title: fresh.title?.en || fresh.title?.zh || '(无标题)' })
}

// 4. 查每个旧 ID 关联的数据量
console.log('━'.repeat(110))
console.log(`${'旧 ID'.padEnd(14)} ${'→ 新 ID'.padEnd(20)} ${'章节'.padEnd(40)} questions progress sets docs sessions recs`)
console.log('━'.repeat(110))

const totals = { questions: 0, progress: 0, sets: 0, docs: 0, sessions: 0, recs: 0 }

for (const { old, fresh, title } of pairs) {
  const [qCount] = await db.select({ c: sql`count(*)::int` }).from(questions).where(eq(questions.chapterId, old.id))
  const [pCount] = await db.select({ c: sql`count(*)::int` }).from(learningProgress).where(eq(learningProgress.chapterId, old.id))
  const [sCount] = await db.select({ c: sql`count(*)::int` }).from(questionSets).where(eq(questionSets.chapterId, old.id))
  const [dCount] = await db.select({ c: sql`count(*)::int` }).from(uploadedDocuments).where(eq(uploadedDocuments.chapterId, old.id))
  const [csCount] = await db.select({ c: sql`count(*)::int` }).from(chatSessions).where(eq(chatSessions.chapterId, old.id))
  const [rCount] = await db.select({ c: sql`count(*)::int` }).from(learningRecommendations).where(eq(learningRecommendations.chapterId, old.id))

  totals.questions += qCount.c
  totals.progress += pCount.c
  totals.sets += sCount.c
  totals.docs += dCount.c
  totals.sessions += csCount.c
  totals.recs += rCount.c

  const flag = (qCount.c + pCount.c + sCount.c + dCount.c + csCount.c + rCount.c) > 0 ? '⚠️ ' : '   '
  console.log(`${flag}${old.id.padEnd(12)} → ${fresh.id.padEnd(18)} ${title.slice(0, 38).padEnd(40)} ${String(qCount.c).padEnd(9)} ${String(pCount.c).padEnd(8)} ${String(sCount.c).padEnd(4)} ${String(dCount.c).padEnd(4)} ${String(csCount.c).padEnd(8)} ${String(rCount.c).padEnd(4)}`)
}

console.log('━'.repeat(110))
console.log(`${'合计（旧 ID 上挂的数据）'.padEnd(74)} ${String(totals.questions).padEnd(9)} ${String(totals.progress).padEnd(8)} ${String(totals.sets).padEnd(4)} ${String(totals.docs).padEnd(4)} ${String(totals.sessions).padEnd(8)} ${String(totals.recs).padEnd(4)}`)

// 5. 同时查每个新 ID 上的数据量（对比用）
console.log(`\n📊 新 ID（math_ 前缀）上的数据量（对比）：`)
const newTotals = { questions: 0, progress: 0, sets: 0, docs: 0, sessions: 0, recs: 0 }
for (const { fresh } of pairs) {
  const [qCount] = await db.select({ c: sql`count(*)::int` }).from(questions).where(eq(questions.chapterId, fresh.id))
  const [pCount] = await db.select({ c: sql`count(*)::int` }).from(learningProgress).where(eq(learningProgress.chapterId, fresh.id))
  const [sCount] = await db.select({ c: sql`count(*)::int` }).from(questionSets).where(eq(questionSets.chapterId, fresh.id))
  const [dCount] = await db.select({ c: sql`count(*)::int` }).from(uploadedDocuments).where(eq(uploadedDocuments.chapterId, fresh.id))
  const [csCount] = await db.select({ c: sql`count(*)::int` }).from(chatSessions).where(eq(chatSessions.chapterId, fresh.id))
  const [rCount] = await db.select({ c: sql`count(*)::int` }).from(learningRecommendations).where(eq(learningRecommendations.chapterId, fresh.id))
  newTotals.questions += qCount.c
  newTotals.progress += pCount.c
  newTotals.sets += sCount.c
  newTotals.docs += dCount.c
  newTotals.sessions += csCount.c
  newTotals.recs += rCount.c
}
console.log(`   questions: ${newTotals.questions} | progress: ${newTotals.progress} | sets: ${newTotals.sets} | docs: ${newTotals.docs} | sessions: ${newTotals.sessions} | recs: ${newTotals.recs}`)

// 6. chapters 表本身的内容比较：keyPoints / formulas / examples / videos 哪个有
console.log(`\n📋 chapters 表内容字段对比（哪个版本有内容）：`)
let oldRicher = 0, newRicher = 0, equal = 0
for (const { old, fresh, title } of pairs) {
  const oldScore = (old.keyPoints?.length || 0) + (old.formulas?.length || 0) + (old.examples?.length || 0) + (old.videos?.length || 0)
  const newScore = (fresh.keyPoints?.length || 0) + (fresh.formulas?.length || 0) + (fresh.examples?.length || 0) + (fresh.videos?.length || 0)
  if (oldScore > newScore) {
    oldRicher++
    console.log(`   ⚠️ ${title}：旧 ${old.id} 内容更丰富（${oldScore} 项 vs 新 ${newScore} 项）`)
  } else if (newScore > oldScore) {
    newRicher++
  } else {
    equal++
  }
}
console.log(`\n   旧 ID 内容更丰富: ${oldRicher} 章 | 新 ID 内容更丰富: ${newRicher} 章 | 内容相同: ${equal} 章`)

// 7. 最终结论
console.log(`\n${'═'.repeat(70)}`)
console.log(`📌 结论`)
console.log(`${'═'.repeat(70)}`)
const totalOldData = totals.questions + totals.progress + totals.sets + totals.docs + totals.sessions + totals.recs
if (totalOldData === 0) {
  console.log(`✅ 旧 ID 上没有任何关联数据。可以安全删除旧 chapter 记录，无需迁移。`)
  console.log(`   建议执行：DELETE FROM chapters WHERE id IN ('${oldIds.join("', '")}')`)
} else {
  console.log(`⚠️  旧 ID 上挂着 ${totalOldData} 条关联数据。需要先 UPDATE 迁移再删除。`)
  console.log(`   迁移路径：UPDATE 6 张表的 chapter_id 字段，把旧 ID 改成对应的新 ID`)
  console.log(`   涉及表：questions / learning_progress / question_sets / uploaded_documents / chat_sessions / learning_recommendations`)
}
if (oldRicher > 0) {
  console.log(`\n⚠️  ${oldRicher} 章的旧 ID 记录在 keyPoints/formulas/examples/videos 字段比新 ID 更丰富——`)
  console.log(`   迁移时不能简单 DROP 旧记录，需把这些字段合并到新记录。`)
}

await closeConnection()
