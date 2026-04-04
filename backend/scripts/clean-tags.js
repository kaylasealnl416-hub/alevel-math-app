// 清洗数据库中文 tag 脏数据
// 运行方式: cd backend && bun scripts/clean-tags.js

import { db } from '../src/db/index.js'
import { questions } from '../src/db/schema.js'
import { sql } from 'drizzle-orm'

const isChinese = (s) => /[\u4e00-\u9fff]/.test(String(s))

const rows = await db.select({ id: questions.id, tags: questions.tags })
  .from(questions)
  .where(sql`tags IS NOT NULL AND tags != 'null'::jsonb AND tags != '[]'::jsonb`)

let cleaned = 0
for (const row of rows) {
  const tags = Array.isArray(row.tags) ? row.tags : (row.tags ? Object.values(row.tags) : [])
  const cleanedTags = tags.filter(t => !isChinese(t))
  if (cleanedTags.length !== tags.length) {
    await db.update(questions)
      .set({ tags: cleanedTags })
      .where(sql`id = ${row.id}`)
    cleaned++
    console.log(`Q${row.id}: [${tags.join(', ')}] → [${cleanedTags.join(', ')}]`)
  }
}

console.log(`\nDone. Cleaned ${cleaned} / ${rows.length} questions.`)
process.exit(0)
