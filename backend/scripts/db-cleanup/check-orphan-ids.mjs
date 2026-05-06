import { db, closeConnection } from '../../src/db/index.js'
import { chapters, units, subjects, questions } from '../../src/db/schema.js'
import { inArray, eq, sql } from 'drizzle-orm'

const ids = ['p1c1','p1c2','p2c1','p2c2','p2c3','p3c1','p3c2','p3c3','p4c1','p4c2','p4c3']
console.log('\n查 11 个目标 ID 的真实归属：\n')
for (const id of ids) {
  const [ch] = await db.select().from(chapters).where(eq(chapters.id, id))
  if (!ch) { console.log(`  ${id.padEnd(8)} 不存在`); continue }
  const [unit] = await db.select().from(units).where(eq(units.id, ch.unitId))
  const [subject] = unit ? await db.select().from(subjects).where(eq(subjects.id, unit.subjectId)) : [null]
  const [{ c: qCount }] = await db.select({ c: sql`count(*)::int` }).from(questions).where(eq(questions.chapterId, id))
  const richness = (ch.keyPoints?.length||0)+(ch.formulas?.length||0)+(ch.examples?.length||0)
  console.log(`  ${id.padEnd(8)} unit=${ch.unitId.padEnd(20)} subject=${(subject?.id||'?').padEnd(15)} title="${ch.title?.en||ch.title?.zh||'?'}" questions=${qCount} 内容=${richness}项`)
}
await closeConnection()
