/**
 * 知识点质量验证（AI 驱动）
 * 使用 AI 深度验证知识点的准确性、完整性和相关性
 *
 * 运行方式：bun run backend/tests/knowledge-quality-validator.js
 */

// 加载环境变量
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), 'backend/.env.local') })

import { db } from '../src/db/index.js'
import { chapters } from '../src/db/schema.js'
import { callAI } from '../src/services/aiClient.js'

async function validateChapterQuality(chapter) {
  const chapterTitle = chapter.title?.en || chapter.title?.zh || chapter.title
  const overview = chapter.overview?.en || chapter.overview?.zh || chapter.overview
  const keyPoints = chapter.keyPoints || []

  const prompt = `你是一位 Pearson Edexcel International A-Level (IAL) 课程专家，熟悉官方考试大纲和评分标准。

请严格按照 Pearson Edexcel IAL 官方大纲评估以下章节的知识点质量：

**章节标题**: ${chapterTitle}

**章节描述**: ${overview || '无描述'}

**知识点列表**:
${keyPoints.map((point, i) => `${i + 1}. ${typeof point === 'string' ? point : point?.en || point?.zh || JSON.stringify(point)}`).join('\n')}

请从以下 5 个维度评估（每个维度 0-10 分）：

1. **准确性** (Accuracy): 知识点是否准确无误，符合学科事实？
2. **相关性** (Relevance): 知识点是否与章节主题匹配？
3. **完整性** (Completeness): 知识点是否完整覆盖 Pearson Edexcel IAL 官方大纲中该章节的核心内容？
4. **清晰度** (Clarity): 知识点的表述是否清晰易懂，适合 A-Level 学生？
5. **考纲符合度** (Syllabus Alignment): 知识点是否严格符合 Pearson Edexcel IAL 2018 考试大纲的要求和深度？

请以 JSON 格式返回评估结果：
{
  "accuracy": { "score": 0-10, "comment": "简短评价（中文）" },
  "relevance": { "score": 0-10, "comment": "简短评价（中文）" },
  "completeness": { "score": 0-10, "comment": "简短评价（中文）" },
  "clarity": { "score": 0-10, "comment": "简短评价（中文）" },
  "syllabusAlignment": { "score": 0-10, "comment": "简短评价（中文）" },
  "overallScore": 0-10,
  "strengths": ["优点1", "优点2"],
  "weaknesses": ["不足1", "不足2"],
  "suggestions": ["改进建议1", "改进建议2"],
  "missingTopics": ["根据 Edexcel 大纲可能遗漏的主题1", "遗漏的主题2"]
}

只返回 JSON，不要其他文字。`

  try {
    const response = await callAI(
      [{ role: 'user', content: prompt }],
      { temperature: 0.3, maxTokens: 2000 }
    )

    const content = response.content.trim()

    // 提取 JSON（可能被 markdown 代码块包裹）
    let jsonStr = content
    if (content.includes('```json')) {
      jsonStr = content.match(/```json\n([\s\S]*?)\n```/)?.[1] || content
    } else if (content.includes('```')) {
      jsonStr = content.match(/```\n([\s\S]*?)\n```/)?.[1] || content
    }

    const result = JSON.parse(jsonStr)
    return result
  } catch (error) {
    console.error(`   ❌ AI 评估失败: ${error.message}`)
    return null
  }
}

async function validateKnowledgeQuality() {
  console.log('🤖 开始 AI 驱动的知识点质量验证...\n')
  console.log('⚠️  注意：此测试会调用 AI API，可能需要较长时间和消耗 API 额度\n')

  // 查询所有章节
  const allChapters = await db.select().from(chapters)

  let stats = {
    total: allChapters.length,
    evaluated: 0,
    failed: 0,
    excellent: 0,  // 总分 >= 9
    good: 0,       // 总分 >= 7
    fair: 0,       // 总分 >= 5
    poor: 0,       // 总分 < 5
  }

  const results = []

  for (const chapter of allChapters) {
    const chapterTitle = chapter.title?.en || chapter.title?.zh || chapter.title
    console.log(`\n📝 评估章节: ${chapterTitle}`)

    const evaluation = await validateChapterQuality(chapter)

    if (!evaluation) {
      stats.failed++
      console.log(`   ❌ 评估失败`)
      continue
    }

    stats.evaluated++
    const score = evaluation.overallScore

    // 分类
    if (score >= 9) {
      stats.excellent++
      console.log(`   ✅ 优秀 (${score}/10)`)
    } else if (score >= 7) {
      stats.good++
      console.log(`   ✅ 良好 (${score}/10)`)
    } else if (score >= 5) {
      stats.fair++
      console.log(`   ⚠️  一般 (${score}/10)`)
    } else {
      stats.poor++
      console.log(`   ❌ 较差 (${score}/10)`)
    }

    // 显示详细评分（添加安全检查）
    if (evaluation.accuracy?.score !== undefined) {
      console.log(`      准确性: ${evaluation.accuracy.score}/10 - ${evaluation.accuracy.comment || ''}`)
    }
    if (evaluation.relevance?.score !== undefined) {
      console.log(`      相关性: ${evaluation.relevance.score}/10 - ${evaluation.relevance.comment || ''}`)
    }
    if (evaluation.completeness?.score !== undefined) {
      console.log(`      完整性: ${evaluation.completeness.score}/10 - ${evaluation.completeness.comment || ''}`)
    }
    if (evaluation.clarity?.score !== undefined) {
      console.log(`      清晰度: ${evaluation.clarity.score}/10 - ${evaluation.clarity.comment || ''}`)
    }
    if (evaluation.syllabusAlignment?.score !== undefined) {
      console.log(`      考纲符合度: ${evaluation.syllabusAlignment.score}/10 - ${evaluation.syllabusAlignment.comment || ''}`)
    }

    if (evaluation.weaknesses && evaluation.weaknesses.length > 0) {
      console.log(`      不足: ${evaluation.weaknesses.join('; ')}`)
    }

    if (evaluation.missingTopics && evaluation.missingTopics.length > 0) {
      console.log(`      可能遗漏: ${evaluation.missingTopics.join('; ')}`)
    }

    results.push({
      chapter: chapterTitle,
      chapterId: chapter.id,
      evaluation,
    })

    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  // 总结
  console.log('\n' + '='.repeat(60))
  console.log('\n📊 知识点质量评估总结:\n')
  console.log(`  总章节数: ${stats.total}`)
  console.log(`  成功评估: ${stats.evaluated} (${Math.round(stats.evaluated/stats.total*100)}%)`)
  console.log(`  评估失败: ${stats.failed}`)
  console.log('')
  console.log(`  优秀 (≥9分): ${stats.excellent} (${Math.round(stats.excellent/stats.evaluated*100)}%)`)
  console.log(`  良好 (≥7分): ${stats.good} (${Math.round(stats.good/stats.evaluated*100)}%)`)
  console.log(`  一般 (≥5分): ${stats.fair} (${Math.round(stats.fair/stats.evaluated*100)}%)`)
  console.log(`  较差 (<5分): ${stats.poor} (${Math.round(stats.poor/stats.evaluated*100)}%)`)

  // 找出需要改进的章节
  const needsImprovement = results.filter(r => r.evaluation.overallScore < 7)
  if (needsImprovement.length > 0) {
    console.log('\n⚠️  需要改进的章节:\n')
    for (const item of needsImprovement) {
      console.log(`  - ${item.chapter} (${item.evaluation.overallScore}/10)`)
      if (item.evaluation.suggestions && item.evaluation.suggestions.length > 0) {
        console.log(`    建议: ${item.evaluation.suggestions.join('; ')}`)
      }
      console.log()
    }
  }

  // 找出遗漏主题最多的章节
  const withMissingTopics = results.filter(r => r.evaluation.missingTopics && r.evaluation.missingTopics.length > 0)
  if (withMissingTopics.length > 0) {
    console.log('\n📋 可能遗漏主题的章节:\n')
    for (const item of withMissingTopics) {
      console.log(`  - ${item.chapter}`)
      console.log(`    遗漏: ${item.evaluation.missingTopics.join('; ')}`)
      console.log()
    }
  }

  // 保存详细报告
  const report = {
    timestamp: new Date().toISOString(),
    stats,
    results,
  }

  const fs = await import('fs')
  // 使用绝对路径，避免 process.cwd() 路径问题
  const reportPath = resolve(import.meta.dir, 'knowledge-quality-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`\n📄 详细报告已保存到: ${reportPath}`)

  if (stats.poor > 0) {
    console.log(`\n⚠️  发现 ${stats.poor} 个质量较差的章节，建议改进。`)
    process.exit(1)
  } else if (stats.fair > 0) {
    console.log(`\n⚠️  发现 ${stats.fair} 个质量一般的章节，建议优化。`)
    process.exit(0)
  } else {
    console.log('\n✅ 所有章节的知识点质量都很好！')
    process.exit(0)
  }
}

validateKnowledgeQuality().catch(error => {
  console.error('❌ 测试执行失败:', error)
  process.exit(1)
})
