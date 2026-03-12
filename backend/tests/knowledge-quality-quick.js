/**
 * 知识点质量验证（AI 驱动）- 简化版
 * 只测试前5个章节作为示例
 */

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

  const prompt = `你是一位 Pearson Edexcel International A-Level (IAL) 课程专家。

请评估以下章节的知识点质量：

**章节**: ${chapterTitle}
**描述**: ${overview || '无'}
**知识点**: ${keyPoints.slice(0, 10).map((p, i) => `${i+1}. ${typeof p === 'string' ? p : p?.en || p?.zh || ''}`).join('\n')}

请以 JSON 格式返回（只返回JSON，不要其他文字）：
{
  "overallScore": 0-10,
  "accuracy": 0-10,
  "relevance": 0-10,
  "completeness": 0-10,
  "clarity": 0-10,
  "syllabusAlignment": 0-10,
  "comment": "简短总评（50字内）",
  "mainIssue": "主要问题（30字内）"
}`

  try {
    const response = await callAI(
      [{ role: 'user', content: prompt }],
      { temperature: 0.3, maxTokens: 500 }
    )

    let content = response.content.trim()
    if (content.includes('```json')) {
      content = content.match(/```json\n([\s\S]*?)\n```/)?.[1] || content
    } else if (content.includes('```')) {
      content = content.match(/```\n([\s\S]*?)\n```/)?.[1] || content
    }

    return JSON.parse(content)
  } catch (error) {
    console.error(`   ❌ 评估失败: ${error.message}`)
    return null
  }
}

async function quickTest() {
  console.log('🤖 快速 AI 质量验证（前5个章节）\n')

  const allChapters = await db.select().from(chapters).limit(5)

  for (const chapter of allChapters) {
    const title = chapter.title?.en || chapter.title?.zh || chapter.title
    console.log(`\n📝 ${title}`)

    const result = await validateChapterQuality(chapter)

    if (result) {
      const grade = result.overallScore >= 9 ? '优秀' : result.overallScore >= 7 ? '良好' : '一般'
      console.log(`   总分: ${result.overallScore}/10 (${grade})`)
      console.log(`   准确性: ${result.accuracy}/10`)
      console.log(`   相关性: ${result.relevance}/10`)
      console.log(`   完整性: ${result.completeness}/10`)
      console.log(`   清晰度: ${result.clarity}/10`)
      console.log(`   考纲符合度: ${result.syllabusAlignment}/10`)
      console.log(`   总评: ${result.comment}`)
      if (result.mainIssue) {
        console.log(`   主要问题: ${result.mainIssue}`)
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  console.log('\n✅ 快速测试完成！')
}

quickTest().catch(console.error)
