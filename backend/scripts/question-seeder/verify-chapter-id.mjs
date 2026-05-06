#!/usr/bin/env bun
// 校验 chapter_id 是否在 DB 里（出题前的必跑前置检查）
// 用法: cd backend && bun scripts/question-seeder/verify-chapter-id.mjs <id1> [<id2> ...]
import { db, closeConnection } from '../../src/db/index.js'
import { chapters } from '../../src/db/schema.js'
import { inArray } from 'drizzle-orm'

const inputIds = process.argv.slice(2)
if (inputIds.length === 0) {
  console.error('用法: bun scripts/question-seeder/verify-chapter-id.mjs <chapter_id> [<chapter_id> ...]')
  process.exit(1)
}

const found = await db
  .select({ id: chapters.id, title: chapters.title })
  .from(chapters)
  .where(inArray(chapters.id, inputIds))

const foundIds = new Set(found.map(c => c.id))
const missing = inputIds.filter(id => !foundIds.has(id))

console.log(`\n输入 ${inputIds.length} 个，命中 ${found.length} 个：`)
for (const c of found) {
  const title = c.title?.en || c.title?.zh || '(无标题)'
  console.log(`  ✅ ${c.id} → ${title}`)
}
if (missing.length > 0) {
  console.log(`\n❌ 未找到 ${missing.length} 个：`)
  for (const id of missing) console.log(`  ✗ ${id}`)
  console.log('\n可能原因：前缀写错。mathematics 用 p/s/m 前缀（如 p1c3 / s1c4 / m1c1）；economics 用 e（如 e1c1）；politics 用 pol（如 pol1c1）。')
  console.log('用 list-chapters.mjs 查真实 ID。')
  await closeConnection()
  process.exit(1)
}
await closeConnection()
process.exit(0)
