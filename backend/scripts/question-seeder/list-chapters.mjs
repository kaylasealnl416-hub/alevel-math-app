#!/usr/bin/env bun
// 列出某学科所有真实 chapter_id（防止前缀写错）
// 用法: cd backend && bun scripts/question-seeder/list-chapters.mjs <subjectId>
// 示例: bun scripts/question-seeder/list-chapters.mjs mathematics
import { db, closeConnection } from '../../src/db/index.js'
import { chapters, units, subjects } from '../../src/db/schema.js'
import { eq } from 'drizzle-orm'

const subjectId = process.argv[2]
if (!subjectId) {
  console.error('用法: bun scripts/question-seeder/list-chapters.mjs <subjectId>')
  console.error('已知 subjectId: mathematics / economics / further-math / history / psychology / politics')
  process.exit(1)
}

const [subject] = await db.select().from(subjects).where(eq(subjects.id, subjectId))
if (!subject) {
  console.error(`❌ 学科不存在: ${subjectId}`)
  await closeConnection()
  process.exit(1)
}
console.log(`📚 ${subject.name?.zh || subjectId}  (id: ${subject.id})`)

const subjectUnits = await db.select().from(units).where(eq(units.subjectId, subjectId)).orderBy(units.order)

if (subjectUnits.length === 0) {
  console.log('  （该学科尚未导入任何单元/章节）')
  await closeConnection()
  process.exit(0)
}

for (const unit of subjectUnits) {
  console.log(`\n📖 ${unit.title?.en || unit.id}  (unit_id: ${unit.id})`)
  const subjectChapters = await db
    .select()
    .from(chapters)
    .where(eq(chapters.unitId, unit.id))
    .orderBy(chapters.order)

  if (subjectChapters.length === 0) {
    console.log('   （该单元下无章节）')
    continue
  }
  for (const ch of subjectChapters) {
    const title = ch.title?.en || ch.title?.zh || '(无标题)'
    console.log(`   ${ch.id.padEnd(22)} | Ch${ch.num} ${title}`)
  }
}

await closeConnection()
