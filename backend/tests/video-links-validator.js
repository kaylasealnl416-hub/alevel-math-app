/**
 * 视频链接有效性验证
 * 自动检查所有视频链接是否有效
 *
 * 运行方式：bun run backend/tests/video-links-validator.js
 */

// 加载环境变量
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), 'backend/.env.local') })

import { db } from '../src/db/index.js'
import { chapters } from '../src/db/schema.js'

async function validateVideoLinks() {
  console.log('🔍 开始检查视频链接...\n')

  const allChapters = await db.select().from(chapters)

  let totalVideos = 0
  let validVideos = 0
  let invalidVideos = 0
  const errors = []

  for (const chapter of allChapters) {
    if (!chapter.videos || chapter.videos.length === 0) {
      console.log(`⚠️  ${chapter.title}: 没有视频`)
      continue
    }

    console.log(`\n📚 检查章节: ${chapter.title}`)

    for (const video of chapter.videos) {
      totalVideos++

      // 检查 URL 格式
      if (!video.url || !video.url.startsWith('http')) {
        invalidVideos++
        errors.push({
          chapter: chapter.title,
          video: video.title,
          error: 'URL 格式无效',
          url: video.url
        })
        console.log(`  ❌ ${video.title}: URL 格式无效`)
        continue
      }

      // 检查 YouTube 链接
      if (video.url.includes('youtube.com') || video.url.includes('youtu.be')) {
        try {
          const response = await fetch(video.url, {
            method: 'HEAD',
            redirect: 'follow'
          })

          if (response.ok || response.status === 200) {
            validVideos++
            console.log(`  ✅ ${video.title}: 链接有效`)
          } else {
            invalidVideos++
            errors.push({
              chapter: chapter.title,
              video: video.title,
              error: `HTTP ${response.status}`,
              url: video.url
            })
            console.log(`  ❌ ${video.title}: HTTP ${response.status}`)
          }
        } catch (error) {
          invalidVideos++
          errors.push({
            chapter: chapter.title,
            video: video.title,
            error: error.message,
            url: video.url
          })
          console.log(`  ❌ ${video.title}: ${error.message}`)
        }
      } else {
        validVideos++
        console.log(`  ⚠️  ${video.title}: 非 YouTube 链接，跳过检查`)
      }

      // 避免请求过快
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  // 总结
  console.log('\n' + '='.repeat(60))
  console.log('\n📊 检查结果总结:\n')
  console.log(`  总视频数: ${totalVideos}`)
  console.log(`  有效链接: ${validVideos} (${totalVideos > 0 ? Math.round(validVideos/totalVideos*100) : 0}%)`)
  console.log(`  无效链接: ${invalidVideos} (${totalVideos > 0 ? Math.round(invalidVideos/totalVideos*100) : 0}%)`)

  if (errors.length > 0) {
    console.log('\n❌ 无效链接列表:\n')
    for (const error of errors) {
      console.log(`  - ${error.chapter} > ${error.video}`)
      console.log(`    错误: ${error.error}`)
      console.log(`    链接: ${error.url}\n`)
    }
  }

  if (invalidVideos === 0) {
    console.log('\n✅ 所有视频链接都有效！')
    process.exit(0)
  } else {
    console.log(`\n⚠️  发现 ${invalidVideos} 个无效链接，请修复。`)
    process.exit(1)
  }
}

validateVideoLinks().catch(error => {
  console.error('❌ 测试执行失败:', error)
  process.exit(1)
})
