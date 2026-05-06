#!/usr/bin/env bun
// 把一批题目状态从 reviewed 改成 published（用户产品级确权后调用）
// 用法: cd backend && bun scripts/question-seeder/publish-batch.mjs <id1> [<id2> ...]
import { db, closeConnection } from '../../src/db/index.js'
import { questions } from '../../src/db/schema.js'
import { inArray } from 'drizzle-orm'

const ids = process.argv.slice(2).map(s => parseInt(s, 10)).filter(n => Number.isInteger(n))
if (ids.length === 0) {
  console.error('用法: bun scripts/question-seeder/publish-batch.mjs <id> [<id> ...]')
  process.exit(1)
}

const updated = await db
  .update(questions)
  .set({ status: 'published', updatedAt: new Date() })
  .where(inArray(questions.id, ids))
  .returning({ id: questions.id, chapterId: questions.chapterId })

console.log(`\n✅ 已发布 ${updated.length}/${ids.length} 道题（status → published）`)
const missingIds = ids.filter(id => !updated.find(u => u.id === id))
if (missingIds.length > 0) {
  console.warn(`⚠️ 未找到 ${missingIds.length} 个 ID: ${missingIds.join(', ')}`)
}

console.log('\n前端可立即看到这批题目。')
await closeConnection()
