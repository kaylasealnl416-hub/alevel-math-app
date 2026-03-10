// 数据库诊断脚本
import { db } from './src/db/index.js'
import { sql } from 'drizzle-orm'

async function diagnoseTables() {
  console.log('🔍 数据库表诊断\n')
  console.log('=' .repeat(60))

  try {
    // 检查所有表
    const tables = await db.execute(sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)

    console.log('\n📊 数据库表列表：')
    console.log('-'.repeat(60))
    tables.rows.forEach((row, i) => {
      console.log(`${i + 1}. ${row.table_name}`)
    })

    // 检查关键表是否存在
    const requiredTables = [
      'exams',
      'exam_question_results',
      'learning_recommendations',
      'questions',
      'question_sets',
      'users'
    ]

    console.log('\n✅ 关键表检查：')
    console.log('-'.repeat(60))
    for (const tableName of requiredTables) {
      const exists = tables.rows.some(row => row.table_name === tableName)
      console.log(`${exists ? '✅' : '❌'} ${tableName}`)
    }

    // 检查 exams 表结构
    console.log('\n📋 exams 表结构：')
    console.log('-'.repeat(60))
    const examColumns = await db.execute(sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'exams'
      ORDER BY ordinal_position
    `)
    examColumns.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`)
    })

    // 检查 learning_recommendations 表
    console.log('\n📋 learning_recommendations 表：')
    console.log('-'.repeat(60))
    const recExists = tables.rows.some(row => row.table_name === 'learning_recommendations')
    if (recExists) {
      const recCount = await db.execute(sql`SELECT COUNT(*) FROM learning_recommendations`)
      console.log(`✅ 表存在，记录数: ${recCount.rows[0].count}`)
    } else {
      console.log('❌ 表不存在 - 需要执行迁移')
    }

    // 检查考试数据
    console.log('\n📊 考试数据统计：')
    console.log('-'.repeat(60))
    const examStats = await db.execute(sql`
      SELECT
        status,
        COUNT(*) as count
      FROM exams
      GROUP BY status
    `)
    examStats.rows.forEach(stat => {
      console.log(`  ${stat.status}: ${stat.count} 条`)
    })

    // 检查最近的考试
    console.log('\n📝 最近 3 次考试：')
    console.log('-'.repeat(60))
    const recentExams = await db.execute(sql`
      SELECT id, user_id, status, total_score, max_score, created_at
      FROM exams
      ORDER BY created_at DESC
      LIMIT 3
    `)
    recentExams.rows.forEach(exam => {
      console.log(`  ID: ${exam.id}, Status: ${exam.status}, Score: ${exam.total_score}/${exam.max_score}`)
    })

  } catch (error) {
    console.error('❌ 诊断失败:', error.message)
  }

  console.log('\n' + '='.repeat(60))
  process.exit(0)
}

diagnoseTables()
