/**
 * 检查数据库中的数据统计
 */

import { db } from './index.js'
import { users, subjects, chapters, questions, questionSets, exams } from './schema.js'
import { sql } from 'drizzle-orm'

async function checkData() {
  console.log('📊 数据库数据统计\n')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  try {
    // 用户统计
    const userCount = await db.select({ count: sql`count(*)` }).from(users)
    console.log(`👤 用户: ${userCount[0].count} 个`)

    // 科目统计
    const subjectCount = await db.select({ count: sql`count(*)` }).from(subjects)
    console.log(`📚 科目: ${subjectCount[0].count} 个`)

    // 章节统计
    const chapterCount = await db.select({ count: sql`count(*)` }).from(chapters)
    console.log(`📖 章节: ${chapterCount[0].count} 个`)

    // 题目统计
    const questionCount = await db.select({ count: sql`count(*)` }).from(questions)
    console.log(`📝 题目: ${questionCount[0].count} 个`)

    // 题集统计
    const questionSetCount = await db.select({ count: sql`count(*)` }).from(questionSets)
    console.log(`📋 题集: ${questionSetCount[0].count} 个`)

    // 考试统计
    const examCount = await db.select({ count: sql`count(*)` }).from(exams)
    console.log(`🎯 考试: ${examCount[0].count} 个`)

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    // 详细信息
    if (parseInt(userCount[0].count) > 0) {
      console.log('👤 用户列表:')
      const userList = await db.select({
        id: users.id,
        email: users.email,
        nickname: users.nickname,
        grade: users.grade
      }).from(users).limit(10)
      userList.forEach(u => {
        console.log(`   - ${u.email} (${u.nickname}, ${u.grade})`)
      })
      console.log('')
    }

    if (parseInt(subjectCount[0].count) > 0) {
      console.log('📚 科目列表:')
      const subjectList = await db.select({
        id: subjects.id,
        name: subjects.name
      }).from(subjects)
      subjectList.forEach(s => {
        console.log(`   - ${s.name.zh || s.name.en} (${s.id})`)
      })
      console.log('')
    }

    if (parseInt(questionCount[0].count) > 0) {
      console.log('📝 题目统计（按类型）:')
      const questionsByType = await db.select({
        type: questions.type,
        count: sql`count(*)`
      }).from(questions).groupBy(questions.type)
      questionsByType.forEach(q => {
        console.log(`   - ${q.type}: ${q.count} 个`)
      })
      console.log('')
    }

    // 数据完整性检查
    console.log('🔍 数据完整性检查:\n')

    const checks = []

    if (parseInt(userCount[0].count) < 3) {
      checks.push('⚠️  用户数量不足（建议至少 3 个）')
    } else {
      checks.push('✅ 用户数量充足')
    }

    if (parseInt(subjectCount[0].count) === 0) {
      checks.push('❌ 缺少科目数据')
    } else {
      checks.push('✅ 科目数据存在')
    }

    if (parseInt(chapterCount[0].count) === 0) {
      checks.push('❌ 缺少章节数据')
    } else {
      checks.push('✅ 章节数据存在')
    }

    if (parseInt(questionCount[0].count) < 50) {
      checks.push(`⚠️  题目数量不足（当前 ${questionCount[0].count} 个，建议至少 50 个）`)
    } else {
      checks.push('✅ 题目数量充足')
    }

    if (parseInt(questionSetCount[0].count) < 5) {
      checks.push(`⚠️  题集数量不足（当前 ${questionSetCount[0].count} 个，建议至少 5 个）`)
    } else {
      checks.push('✅ 题集数量充足')
    }

    checks.forEach(check => console.log(check))

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ 检查失败:', error)
    process.exit(1)
  }
}

checkData()
