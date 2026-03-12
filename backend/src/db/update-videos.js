/**
 * 更新章节视频数据
 * 从 subjects.js 读取视频数据并更新到数据库
 */

import { db } from './index.js'
import { chapters } from './schema.js'
import { eq } from 'drizzle-orm'
import { SUBJECTS } from '../../data-import/subjects.js'

console.log('🎬 开始更新章节视频数据...\n')

let stats = {
  total: 0,
  updated: 0,
  failed: 0,
}

try {
  // 遍历所有科目
  for (const [subjectId, subjectData] of Object.entries(SUBJECTS)) {
    console.log(`📚 处理科目: ${subjectData.name.zh} (${subjectId})`)

    // 遍历单元
    if (subjectData.books) {
      for (const [unitId, unitData] of Object.entries(subjectData.books)) {
        console.log(`  📖 处理单元: ${unitData.title.zh}`)

        // 遍历章节
        if (unitData.chapters && Array.isArray(unitData.chapters)) {
          for (const chapterData of unitData.chapters) {
            stats.total++

            try {
              // 更新章节的视频数据
              const result = await db
                .update(chapters)
                .set({ videos: chapterData.videos || [] })
                .where(eq(chapters.id, chapterData.id))
                .returning()

              if (result.length > 0) {
                stats.updated++
                const videoCount = chapterData.videos?.length || 0
                console.log(`    ✅ ${chapterData.title.zh}: ${videoCount} 个视频`)
              } else {
                stats.failed++
                console.log(`    ⚠️  ${chapterData.title.zh}: 章节不存在`)
              }
            } catch (error) {
              stats.failed++
              console.log(`    ❌ ${chapterData.title.zh}: ${error.message}`)
            }
          }
        }
      }
    }

    console.log('')
  }

  console.log('✅ 视频数据更新完成！\n')
  console.log('📊 更新统计：')
  console.log(`  - 总章节数: ${stats.total}`)
  console.log(`  - 更新成功: ${stats.updated}`)
  console.log(`  - 更新失败: ${stats.failed}`)

  process.exit(0)
} catch (error) {
  console.error('\n❌ 更新失败:', error.message)
  console.error(error)
  process.exit(1)
}
