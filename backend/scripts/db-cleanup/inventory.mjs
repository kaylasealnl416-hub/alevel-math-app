import { db, closeConnection } from '../../src/db/index.js'
import { chapters, units, subjects, questions } from '../../src/db/schema.js'
import { eq, sql, inArray } from 'drizzle-orm'

const subjectIds = ['mathematics', 'economics', 'politics']
for (const sid of subjectIds) {
  const [s] = await db.select().from(subjects).where(eq(subjects.id, sid))
  if (!s) { console.log(`\n📚 ${sid} - 不存在`); continue }
  console.log(`\n📚 ${s.name?.zh||sid} (${sid})`)
  const sUnits = await db.select().from(units).where(eq(units.subjectId, sid)).orderBy(units.order)
  for (const u of sUnits) {
    const chs = await db.select({id:chapters.id, num:chapters.num, title:chapters.title}).from(chapters).where(eq(chapters.unitId, u.id)).orderBy(chapters.num)
    let unitQ = 0
    const lines = []
    for (const ch of chs) {
      const [{c}] = await db.select({c:sql`count(*)::int`}).from(questions).where(eq(questions.chapterId, ch.id))
      unitQ += c
      lines.push(`  ${ch.id.padEnd(15)} Ch${ch.num} ${(ch.title?.en||ch.title?.zh||'').slice(0,32).padEnd(34)} ${c} 题`)
    }
    console.log(`📖 ${u.title?.en||u.id} (共 ${unitQ} 题)`)
    lines.forEach(l => console.log(l))
  }
}
await closeConnection()
