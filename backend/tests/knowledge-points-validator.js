/**
 * 知识点完整性验证
 * 检查所有章节的知识点是否完整
 *
 * 运行方式：bun run backend/tests/knowledge-points-validator.js
 */

// 加载环境变量
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), 'backend/.env.local') })

import { db } from '../src/db/index.js'
import { subjects, units, chapters } from '../src/db/schema.js'
import { eq } from 'drizzle-orm'

async function validateKnowledgePoints() {
  console.log('📚 开始检查知识点完整性...\n')

  // 直接查询所有章节
  const allChapters = await db.select().from(chapters)

  let totalChapters = allChapters.length
  let completeChapters = 0
  let incompleteChapters = 0
  const issues = []

  console.log(`总章节数: ${totalChapters}\n`)

  for (const chapter of allChapters) {
    console.log(`\n📝 ${chapter.title?.en || chapter.title?.zh || chapter.title || '未命名章节'}`)

    let chapterIssues = []

    // 检查描述
    const overview = chapter.overview?.en || chapter.overview?.zh || chapter.overview
    if (!overview || overview.length < 50) {
      chapterIssues.push('描述过短或缺失')
      console.log(`   ⚠️  描述过短或缺失 (${overview?.length || 0} 字符)`)
    } else {
      console.log(`   ✅ 描述完整 (${overview.length} 字符)`)
    }

    // 检查知识点
    if (!chapter.keyPoints || chapter.keyPoints.length === 0) {
      chapterIssues.push('缺少知识点')
      console.log(`   ❌ 缺少知识点`)
    } else {
      console.log(`   ✅ 知识点数量: ${chapter.keyPoints.length}`)
      for (const point of chapter.keyPoints) {
        const pointText = point?.en || point?.zh || point
        console.log(`      - ${pointText}`)
      }
    }

    // 检查视频
    if (!chapter.videos || chapter.videos.length === 0) {
      chapterIssues.push('缺少视频资源')
      console.log(`   ⚠️  缺少视频资源`)
    } else {
      console.log(`   ✅ 视频数量: ${chapter.videos.length}`)
    }

    // 记录问题
    if (chapterIssues.length > 0) {
      incompleteChapters++
      issues.push({
        chapter: chapter.title?.en || chapter.title?.zh || chapter.title,
        issues: chapterIssues
      })
    } else {
      completeChapters++
    }
  }

  // 总结
  console.log('\n' + '='.repeat(60))
  console.log('\n📊 检查结果总结:\n')
  console.log(`  总章节数: ${totalChapters}`)
  console.log(`  完整章节: ${completeChapters} (${totalChapters > 0 ? Math.round(completeChapters/totalChapters*100) : 0}%)`)
  console.log(`  不完整章节: ${incompleteChapters} (${totalChapters > 0 ? Math.round(incompleteChapters/totalChapters*100) : 0}%)`)

  if (issues.length > 0) {
    console.log('\n⚠️  需要改进的章节:\n')
    for (const issue of issues) {
      console.log(`  - ${issue.subject} > ${issue.chapter}`)
      for (const problem of issue.issues) {
        console.log(`    • ${problem}`)
      }
      console.log()
    }
  }

  if (incompleteChapters === 0) {
    console.log('\n✅ 所有章节的知识点都完整！')
    process.exit(0)
  } else {
    console.log(`\n⚠️  发现 ${incompleteChapters} 个不完整的章节，建议补充内容。`)
    process.exit(1)
  }
}

validateKnowledgePoints().catch(error => {
  console.error('❌ 测试执行失败:', error)
  process.exit(1)
})
