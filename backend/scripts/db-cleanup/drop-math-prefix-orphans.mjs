#!/usr/bin/env bun
// 清理 mathematics 学科 chapters 表的 math_ 前缀残留
//
// 背景：2026-03-18 commit 4a25e1f 引入 seed-mathematics.js 用 math_ 前缀，
// 但前端 curriculum.js / data-import / topicChapterMap / wiki 等项目其它部分均未跟进，
// 整个项目实际仍跑在旧 ID 系统上（p1c3 / s1c4 / m1c1）。
//
// 当前 DB 里 mathematics 学科的 47 条 chapter 分两类：
//   A. 36 条「重复对」：旧版（如 p1c3）有题目和内容，math_ 版空壳
//      → DELETE math_ 版，保留旧版
//   B. 11 条「孤立 math_」：DB 里只有 math_ 版（如 math_p1c1），旧版根本不存在
//      但前端 curriculum.js 引用的是旧 ID（p1c1）
//      → RENAME id：math_xxx → xxx，跟前端对齐
//
// 默认 dry-run；加 --execute 实际执行。
import { db, closeConnection } from '../../src/db/index.js'
import {
  chapters, units, questions, learningProgress, uploadedDocuments,
  questionSets, chatSessions, learningRecommendations,
} from '../../src/db/schema.js'
import { eq, like, inArray, sql } from 'drizzle-orm'

const EXECUTE = process.argv.includes('--execute')

console.log(`\n${EXECUTE ? '⚙️  EXECUTE 模式' : '🔍 DRY-RUN 模式（不会修改数据）'}\n`)

// 1. 拉所有 mathematics 学科的 chapter
const mathUnits = await db.select({ id: units.id }).from(units).where(eq(units.subjectId, 'mathematics'))
const mathUnitIds = mathUnits.map(u => u.id)
const allChapters = await db.select().from(chapters).where(inArray(chapters.unitId, mathUnitIds))

// 2. 按 (unitId, num) 分组，分类成"重复对"和"孤立 math_"
const grouped = {}
for (const c of allChapters) {
  const key = `${c.unitId}__${c.num}`
  ;(grouped[key] ||= []).push(c)
}

const toDelete = []   // 36 条 math_ 空壳（有旧版双胞胎）
const toRename = []   // 11 条孤立 math_（无旧版双胞胎）

for (const [key, list] of Object.entries(grouped)) {
  const mathOnes = list.filter(c => c.id.startsWith('math_'))
  const oldOnes = list.filter(c => !c.id.startsWith('math_'))

  if (mathOnes.length === 0) continue   // 该章节已经只有旧版，跳过
  if (oldOnes.length > 0) {
    // 有重复对 → 删 math_ 版
    toDelete.push(...mathOnes.map(c => c.id))
  } else {
    // 孤立 math_ → 重命名
    for (const c of mathOnes) toRename.push({ from: c.id, to: c.id.replace(/^math_/, '') })
  }
}

console.log(`📊 分类结果：`)
console.log(`   要删除（重复对的 math_ 空壳）: ${toDelete.length} 条`)
console.log(`   要重命名（孤立 math_）:       ${toRename.length} 条`)

// 3. 防御性检查：要删/要改的 ID 上必须 0 关联数据
const allTargetIds = [...toDelete, ...toRename.map(r => r.from)]
console.log(`\n📊 关联数据预检（必须全 0）：`)
const checks = [
  { name: 'questions',                table: questions,               col: questions.chapterId },
  { name: 'learning_progress',        table: learningProgress,        col: learningProgress.chapterId },
  { name: 'question_sets',            table: questionSets,            col: questionSets.chapterId },
  { name: 'uploaded_documents',       table: uploadedDocuments,       col: uploadedDocuments.chapterId },
  { name: 'chat_sessions',            table: chatSessions,            col: chatSessions.chapterId },
  { name: 'learning_recommendations', table: learningRecommendations, col: learningRecommendations.chapterId },
]
let totalRefs = 0
for (const { name, table, col } of checks) {
  const [{ c }] = await db.select({ c: sql`count(*)::int` }).from(table).where(inArray(col, allTargetIds))
  console.log(`   ${c > 0 ? '🚨' : '✅'} ${name.padEnd(28)} ${c}`)
  totalRefs += c
}
if (totalRefs > 0) {
  console.error(`\n❌ 中止：发现 ${totalRefs} 条关联数据。需要先迁移再操作。`)
  await closeConnection()
  process.exit(1)
}

// 4. 重命名前要检查目标 ID 不冲突
console.log(`\n📊 重命名冲突预检：`)
const targetNewIds = toRename.map(r => r.to)
const conflicts = await db.select({ id: chapters.id }).from(chapters).where(inArray(chapters.id, targetNewIds))
if (conflicts.length > 0) {
  console.error(`❌ 中止：以下目标 ID 已存在，无法 RENAME：${conflicts.map(c => c.id).join(', ')}`)
  await closeConnection()
  process.exit(1)
}
console.log(`   ✅ ${targetNewIds.length} 个目标 ID 全部空闲`)

// 5. 检查约束
const constraintCheck = await db.execute(sql`
  SELECT conname FROM pg_constraint
  WHERE conrelid = 'chapters'::regclass AND conname = 'chapters_unit_num_unique'
`)
const hasConstraint = constraintCheck.length > 0

console.log(`\n📋 待执行操作（事务保护）：`)
console.log(`   1. DELETE FROM chapters WHERE id IN (...) — ${toDelete.length} 条`)
console.log(`      示例：${toDelete.slice(0, 3).join(', ')} ...`)
console.log(`   2. UPDATE chapters SET id = TRIM_PREFIX('math_') WHERE id LIKE 'math\\_%' — ${toRename.length} 条`)
toRename.slice(0, 3).forEach(r => console.log(`      ${r.from.padEnd(15)} → ${r.to}`))
if (toRename.length > 3) console.log(`      ... 还有 ${toRename.length - 3} 条`)
if (!hasConstraint) {
  console.log(`   3. ALTER TABLE chapters ADD CONSTRAINT chapters_unit_num_unique UNIQUE (unit_id, num)`)
} else {
  console.log(`   3. (跳过) 唯一约束已存在`)
}

if (!EXECUTE) {
  console.log(`\n${'━'.repeat(60)}`)
  console.log(`🔍 DRY-RUN 完成。预计 47 条 math_ 记录最终归零（36 删 + 11 重命名）。`)
  console.log(`确认无误后：bun scripts/db-cleanup/drop-math-prefix-orphans.mjs --execute`)
  await closeConnection()
  process.exit(0)
}

// 6. EXECUTE
console.log(`\n⚙️  开始执行...`)
try {
  await db.transaction(async (tx) => {
    if (toDelete.length > 0) {
      const deleted = await tx.delete(chapters).where(inArray(chapters.id, toDelete)).returning({ id: chapters.id })
      console.log(`   ✅ 已删除 ${deleted.length} 条 math_ 空壳`)
    }
    for (const { from, to } of toRename) {
      await tx.update(chapters).set({ id: to }).where(eq(chapters.id, from))
    }
    console.log(`   ✅ 已重命名 ${toRename.length} 条孤立 math_ → 旧版前缀`)
    if (!hasConstraint) {
      await tx.execute(sql`ALTER TABLE chapters ADD CONSTRAINT chapters_unit_num_unique UNIQUE (unit_id, num)`)
      console.log(`   ✅ 已加唯一约束 chapters_unit_num_unique`)
    }
  })
  console.log(`\n✅ 全部操作成功提交`)
} catch (err) {
  console.error(`\n❌ 事务失败已回滚：${err.message}`)
  await closeConnection()
  process.exit(1)
}
await closeConnection()
