#!/usr/bin/env bun
// 阶段 1：把 politics 学科的 11 个 chapter id 从 p_ 前缀迁移到 pol_ 前缀
// 让位给 mathematics 使用 p_/s_/m_ 纯前缀，符合 CLAUDE.md 规范
//
// 由于 questions/progress/sets 都通过 FK 引用 chapters.id（无 ON UPDATE CASCADE），
// 不能直接 UPDATE chapters.id。必须按以下顺序在事务里执行：
//   1. INSERT 新 pol_ chapter 记录（复制旧记录所有字段，仅改 id 和 createdAt）
//   2. UPDATE 子表 FK：questions / learning_progress / question_sets 的 chapter_id
//   3. DELETE 旧 p_ chapter 记录
//
// user_answers / exam_question_results 通过 question.id 关联，无需改动。
//
// 默认 dry-run；加 --execute 实际执行（事务保护）。
import { db, closeConnection } from '../../src/db/index.js'
import { chapters, units, questions, learningProgress, questionSets } from '../../src/db/schema.js'
import { eq, inArray, sql } from 'drizzle-orm'

const EXECUTE = process.argv.includes('--execute')

const POLITICS_MAP = [
  ['p1c1', 'pol1c1'], ['p1c2', 'pol1c2'],
  ['p2c1', 'pol2c1'], ['p2c2', 'pol2c2'], ['p2c3', 'pol2c3'],
  ['p3c1', 'pol3c1'], ['p3c2', 'pol3c2'], ['p3c3', 'pol3c3'],
  ['p4c1', 'pol4c1'], ['p4c2', 'pol4c2'], ['p4c3', 'pol4c3'],
]
const oldIds = POLITICS_MAP.map(([from]) => from)
const newIds = POLITICS_MAP.map(([, to]) => to)

console.log(`\n${EXECUTE ? '⚙️  EXECUTE 模式（事务保护）' : '🔍 DRY-RUN 模式（不会修改数据）'}\n`)

// 防御性预检 1：11 个旧 ID 都必须属于 politics
console.log(`📊 预检 1：确认旧 ID 全部归属 politics`)
const targets = await db.select().from(chapters).where(inArray(chapters.id, oldIds))
if (targets.length !== oldIds.length) {
  console.error(`❌ 中止：DB 里只找到 ${targets.length}/${oldIds.length} 条记录`)
  console.error(`   缺失: ${oldIds.filter(id => !targets.find(t => t.id === id)).join(', ')}`)
  await closeConnection()
  process.exit(1)
}
for (const c of targets) {
  const [u] = await db.select().from(units).where(eq(units.id, c.unitId))
  if (u?.subjectId !== 'politics') {
    console.error(`❌ 中止：${c.id} 不属于 politics（属于 ${u?.subjectId || '?'}）`)
    await closeConnection()
    process.exit(1)
  }
}
console.log(`   ✅ 11 个旧 ID 全部确认属于 politics`)

// 防御性预检 2：目标 pol_ ID 不能已存在
console.log(`\n📊 预检 2：目标 pol_ ID 必须空闲`)
const conflict = await db.select({ id: chapters.id }).from(chapters).where(inArray(chapters.id, newIds))
if (conflict.length > 0) {
  console.error(`❌ 中止：目标 ID 已存在: ${conflict.map(c => c.id).join(', ')}`)
  await closeConnection()
  process.exit(1)
}
console.log(`   ✅ 11 个目标 pol_ ID 全部空闲`)

// 计数
console.log(`\n📊 待迁移记录数：`)
const [{ c: qC }] = await db.select({ c: sql`count(*)::int` }).from(questions).where(inArray(questions.chapterId, oldIds))
const [{ c: pC }] = await db.select({ c: sql`count(*)::int` }).from(learningProgress).where(inArray(learningProgress.chapterId, oldIds))
const [{ c: sC }] = await db.select({ c: sql`count(*)::int` }).from(questionSets).where(inArray(questionSets.chapterId, oldIds))
console.log(`   questions:           ${qC} 条`)
console.log(`   learning_progress:   ${pC} 条`)
console.log(`   question_sets:       ${sC} 条`)
console.log(`   chapters 表本身:     ${targets.length} 条 (INSERT pol_ 后 DELETE 旧 p_)`)

console.log(`\n📋 迁移映射：`)
for (const [from, to] of POLITICS_MAP) {
  const ch = targets.find(t => t.id === from)
  const title = ch?.title?.en || ch?.title?.zh || '?'
  console.log(`   ${from.padEnd(7)} → ${to.padEnd(8)} ${title}`)
}

if (!EXECUTE) {
  console.log(`\n${'━'.repeat(60)}`)
  console.log(`🔍 DRY-RUN 完成。`)
  console.log(`确认无误后：bun scripts/db-cleanup/migrate-politics-prefix.mjs --execute`)
  await closeConnection()
  process.exit(0)
}

// EXECUTE
console.log(`\n⚙️  开始执行（事务保护）...`)
try {
  await db.transaction(async (tx) => {
    for (const [from, to] of POLITICS_MAP) {
      // Step 1: INSERT 新 pol_ chapter（复制旧 chapter 全部字段，仅改 id）
      const [oldCh] = await tx.select().from(chapters).where(eq(chapters.id, from))
      const { id: _, createdAt: __, ...rest } = oldCh
      await tx.insert(chapters).values({ ...rest, id: to, createdAt: new Date() })

      // Step 2: UPDATE 子表 FK（FK 约束此时已满足，新 pol_ chapter 已存在）
      const qR = await tx.update(questions).set({ chapterId: to }).where(eq(questions.chapterId, from)).returning({ id: questions.id })
      const pR = await tx.update(learningProgress).set({ chapterId: to }).where(eq(learningProgress.chapterId, from)).returning({ id: learningProgress.id })
      const sR = await tx.update(questionSets).set({ chapterId: to }).where(eq(questionSets.chapterId, from)).returning({ id: questionSets.id })

      // Step 3: DELETE 旧 p_ chapter（此时已无引用，FK 约束允许删除）
      await tx.delete(chapters).where(eq(chapters.id, from))

      console.log(`   ✅ ${from} → ${to}: ${qR.length} questions, ${pR.length} progress, ${sR.length} sets`)
    }
  })
  console.log(`\n✅ politics 11 个 chapter id 已全部迁移到 pol_ 前缀`)
  console.log(`\n下一步：跑代码同步（src/data/subjects.js + backend/data-import/subjects.js）`)
} catch (err) {
  console.error(`\n❌ 事务失败已回滚：${err.message}`)
  await closeConnection()
  process.exit(1)
}

await closeConnection()
