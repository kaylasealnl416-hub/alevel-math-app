import { db } from './index.js'
import * as schema from './schema.js'
import { eq } from 'drizzle-orm'

console.log('📊 验证数据导入...\n')

try {
  // 查询所有科目
  const allSubjects = await db.select().from(schema.subjects)
  console.log(`✅ 科目数量: ${allSubjects.length}`)
  allSubjects.forEach(s => {
    console.log(`  - ${s.name.zh} (${s.id})`)
  })

  // 查询所有单元
  const allUnits = await db.select().from(schema.units)
  console.log(`\n✅ 单元数量: ${allUnits.length}`)

  // 查询所有章节
  const allChapters = await db.select().from(schema.chapters)
  console.log(`✅ 章节数量: ${allChapters.length}`)

  // 查询经济学的详细数据
  console.log('\n📚 经济学详细数据：')
  const economicsUnits = await db.select().from(schema.units).where(eq(schema.units.subjectId, 'economics'))
  for (const unit of economicsUnits) {
    const chapters = await db.select().from(schema.chapters).where(eq(schema.chapters.unitId, unit.id))
    console.log(`  ${unit.title.zh}: ${chapters.length} 个章节`)
  }

  console.log('\n✅ 数据验证完成！')
  process.exit(0)
} catch (error) {
  console.error('❌ 验证失败:', error.message)
  process.exit(1)
}
