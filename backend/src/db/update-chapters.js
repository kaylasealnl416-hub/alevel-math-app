import { db } from './index.js'
import * as schema from './schema.js'
import { SUBJECTS } from '../../data-import/subjects.js'
import { eq } from 'drizzle-orm'

console.log('🔄 开始更新章节数据...\n')

let stats = {
  subjects: 0,
  units: 0,
  chapters: 0,
  updated: 0,
  inserted: 0,
}

try {
  // 遍历所有科目
  for (const [subjectId, subjectData] of Object.entries(SUBJECTS)) {
    console.log(`📚 处理科目: ${subjectData.name.en} (${subjectId})`)

    // 使用 onConflictDoUpdate 进行 upsert
    await db.insert(schema.subjects).values({
      id: subjectId,
      name: subjectData.name,
      nameFull: subjectData.nameFull,
      icon: subjectData.icon,
      color: subjectData.color,
      bgColor: subjectData.bgColor,
      level: subjectData.level,
    }).onConflictDoUpdate({
      target: schema.subjects.id,
      set: {
        name: subjectData.name,
        nameFull: subjectData.nameFull,
        icon: subjectData.icon,
        color: subjectData.color,
        bgColor: subjectData.bgColor,
        level: subjectData.level,
        updatedAt: new Date(),
      }
    })
    stats.subjects++

    // 处理单元
    if (subjectData.books) {
      for (const [unitId, unitData] of Object.entries(subjectData.books)) {
        const uniqueUnitId = `${subjectId}_${unitId}`
        console.log(`  📖 处理单元: ${unitData.title.en} (${uniqueUnitId})`)

        await db.insert(schema.units).values({
          id: uniqueUnitId,
          subjectId: subjectId,
          title: unitData.title,
          subtitle: unitData.subtitle,
          color: unitData.color,
          order: parseInt(unitId.replace(/\D/g, '')) || 0,
        }).onConflictDoUpdate({
          target: schema.units.id,
          set: {
            title: unitData.title,
            subtitle: unitData.subtitle,
            color: unitData.color,
            order: parseInt(unitId.replace(/\D/g, '')) || 0,
          }
        })
        stats.units++

        // 处理章节
        if (unitData.chapters && Array.isArray(unitData.chapters)) {
          for (const [index, chapterData] of unitData.chapters.entries()) {
            console.log(`    📄 更新章节: ${chapterData.title.en} (${chapterData.id})`)

            await db.insert(schema.chapters).values({
              id: chapterData.id,
              unitId: uniqueUnitId,
              num: chapterData.num,
              title: chapterData.title,
              overview: chapterData.overview,
              keyPoints: chapterData.keyPoints,
              formulas: chapterData.formulas,
              examples: chapterData.examples,
              videos: chapterData.videos,
              order: index,
            }).onConflictDoUpdate({
              target: schema.chapters.id,
              set: {
                title: chapterData.title,
                overview: chapterData.overview,
                keyPoints: chapterData.keyPoints,
                formulas: chapterData.formulas,
                examples: chapterData.examples,
                videos: chapterData.videos,
                order: index,
              }
            })
            stats.chapters++
            stats.updated++
          }
        }
      }
    }

    console.log('')
  }

  console.log('✅ 数据更新完成！\n')
  console.log('📊 更新统计：')
  console.log(`  - 科目: ${stats.subjects} 个`)
  console.log(`  - 单元: ${stats.units} 个`)
  console.log(`  - 章节: ${stats.chapters} 个 (已更新)`)

  process.exit(0)
} catch (error) {
  console.error('\n❌ 数据更新失败:', error.message)
  console.error(error)
  process.exit(1)
}
