import { db } from './index.js'
import * as schema from './schema.js'
import { SUBJECTS } from '../../data-import/subjects.js'

console.log('🌱 开始导入数据...\n')

let stats = {
  subjects: 0,
  units: 0,
  chapters: 0,
}

try {
  // 遍历所有科目
  for (const [subjectId, subjectData] of Object.entries(SUBJECTS)) {
    console.log(`📚 导入科目: ${subjectData.name.zh} (${subjectId})`)

    // 插入科目
    await db.insert(schema.subjects).values({
      id: subjectId,
      name: subjectData.name,
      nameFull: subjectData.nameFull,
      icon: subjectData.icon,
      color: subjectData.color,
      bgColor: subjectData.bgColor,
      level: subjectData.level,
    })
    stats.subjects++

    // 插入单元
    if (subjectData.books) {
      for (const [unitId, unitData] of Object.entries(subjectData.books)) {
        // 为单元ID添加科目前缀，确保唯一性
        const uniqueUnitId = `${subjectId}_${unitId}`
        console.log(`  📖 导入单元: ${unitData.title.zh} (${uniqueUnitId})`)

        await db.insert(schema.units).values({
          id: uniqueUnitId,
          subjectId: subjectId,
          title: unitData.title,
          subtitle: unitData.subtitle,
          color: unitData.color,
          order: parseInt(unitId.replace(/\D/g, '')) || 0,
        })
        stats.units++

        // 插入章节
        if (unitData.chapters && Array.isArray(unitData.chapters)) {
          for (const [index, chapterData] of unitData.chapters.entries()) {
            console.log(`    📄 导入章节: ${chapterData.title.zh} (${chapterData.id})`)

            await db.insert(schema.chapters).values({
              id: chapterData.id,
              unitId: uniqueUnitId,  // 使用唯一的单元ID
              num: chapterData.num,
              title: chapterData.title,
              overview: chapterData.overview,
              keyPoints: chapterData.keyPoints,
              formulas: chapterData.formulas,
              examples: chapterData.examples,
              videos: chapterData.videos,
              order: index,
            })
            stats.chapters++
          }
        }
      }
    }

    console.log('')
  }

  console.log('✅ 数据导入完成！\n')
  console.log('📊 导入统计：')
  console.log(`  - 科目: ${stats.subjects} 个`)
  console.log(`  - 单元: ${stats.units} 个`)
  console.log(`  - 章节: ${stats.chapters} 个`)

  process.exit(0)
} catch (error) {
  console.error('\n❌ 数据导入失败:', error.message)
  console.error(error)
  process.exit(1)
}
