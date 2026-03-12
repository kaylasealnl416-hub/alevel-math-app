/**
 * 添加数据库索引以提升查询性能
 *
 * 执行方式：
 * bun run backend/src/db/add-indexes.js
 */

import { db } from './index.js'
import { sql } from 'drizzle-orm'

async function addIndexes() {
  console.log('🔧 开始添加数据库索引...\n')

  try {
    // 1. users 表索引
    console.log('📝 添加 users 表索引...')

    // 邮箱索引（用于登录查询）
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_users_email
      ON users(email)
    `)
    console.log('  ✅ idx_users_email 创建成功')

    // 创建时间索引（用于按时间排序）
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_users_created_at
      ON users(created_at)
    `)
    console.log('  ✅ idx_users_created_at 创建成功')

    // 2. exams 表索引
    console.log('\n📝 添加 exams 表索引...')

    // 用户ID索引（用于查询用户的所有考试）
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_exams_user_id
      ON exams(user_id)
    `)
    console.log('  ✅ idx_exams_user_id 创建成功')

    // 状态索引（用于按状态筛选）
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_exams_status
      ON exams(status)
    `)
    console.log('  ✅ idx_exams_status 创建成功')

    // 类型索引（用于按类型筛选）
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_exams_type
      ON exams(type)
    `)
    console.log('  ✅ idx_exams_type 创建成功')

    // 创建时间索引（用于按时间排序）
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_exams_created_at
      ON exams(created_at)
    `)
    console.log('  ✅ idx_exams_created_at 创建成功')

    // 复合索引：用户ID + 状态（常用组合查询）
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_exams_user_status
      ON exams(user_id, status)
    `)
    console.log('  ✅ idx_exams_user_status 创建成功')

    // 复合索引：用户ID + 类型（常用组合查询）
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_exams_user_type
      ON exams(user_id, type)
    `)
    console.log('  ✅ idx_exams_user_type 创建成功')

    // 3. exam_question_results 表索引
    console.log('\n📝 添加 exam_question_results 表索引...')

    // 考试ID索引（用于查询考试的所有题目结果）
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_exam_question_results_exam_id
      ON exam_question_results(exam_id)
    `)
    console.log('  ✅ idx_exam_question_results_exam_id 创建成功')

    // 题目ID索引（用于查询题目的所有答题记录）
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_exam_question_results_question_id
      ON exam_question_results(question_id)
    `)
    console.log('  ✅ idx_exam_question_results_question_id 创建成功')

    // 正确性索引（用于查询错题）
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_exam_question_results_is_correct
      ON exam_question_results(is_correct)
    `)
    console.log('  ✅ idx_exam_question_results_is_correct 创建成功')

    // 复合索引：考试ID + 正确性（查询某次考试的错题）
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_exam_question_results_exam_correct
      ON exam_question_results(exam_id, is_correct)
    `)
    console.log('  ✅ idx_exam_question_results_exam_correct 创建成功')

    // 4. questions 表索引
    console.log('\n📝 添加 questions 表索引...')

    // 难度索引（用于按难度筛选）
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_questions_difficulty
      ON questions(difficulty)
    `)
    console.log('  ✅ idx_questions_difficulty 创建成功')

    // 题型索引（用于按题型筛选）
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_questions_type
      ON questions(type)
    `)
    console.log('  ✅ idx_questions_type 创建成功')

    // 5. question_sets 表索引
    console.log('\n📝 添加 question_sets 表索引...')

    // 类型索引（用于按类型筛选试卷）
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_question_sets_type
      ON question_sets(type)
    `)
    console.log('  ✅ idx_question_sets_type 创建成功')

    // 创建时间索引
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_question_sets_created_at
      ON question_sets(created_at)
    `)
    console.log('  ✅ idx_question_sets_created_at 创建成功')

    // 6. learning_recommendations 表索引
    console.log('\n📝 添加 learning_recommendations 表索引...')

    // 用户ID索引
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_learning_recommendations_user_id
      ON learning_recommendations(user_id)
    `)
    console.log('  ✅ idx_learning_recommendations_user_id 创建成功')

    // 考试ID索引
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_learning_recommendations_exam_id
      ON learning_recommendations(exam_id)
    `)
    console.log('  ✅ idx_learning_recommendations_exam_id 创建成功')

    // 创建时间索引
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_learning_recommendations_created_at
      ON learning_recommendations(created_at)
    `)
    console.log('  ✅ idx_learning_recommendations_created_at 创建成功')

    // 7. 验证索引创建
    console.log('\n📊 验证索引创建...')
    const indexesResult = await db.execute(sql`
      SELECT
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND indexname LIKE 'idx_%'
      ORDER BY tablename, indexname
    `)

    console.log(`\n✅ 成功创建 ${indexesResult.rows.length} 个索引：\n`)

    const indexesByTable = {}
    for (const row of indexesResult.rows) {
      if (!indexesByTable[row.tablename]) {
        indexesByTable[row.tablename] = []
      }
      indexesByTable[row.tablename].push(row.indexname)
    }

    for (const [table, indexes] of Object.entries(indexesByTable)) {
      console.log(`📋 ${table}:`)
      for (const index of indexes) {
        console.log(`   - ${index}`)
      }
      console.log()
    }

    console.log('🎉 所有索引添加完成！')
    console.log('\n💡 提示：索引会自动提升查询性能，但会略微增加写入开销。')
    console.log('   对于读多写少的场景（如本项目），这是非常值得的优化。')

  } catch (error) {
    console.error('\n❌ 添加索引失败:', error)
    console.error(error.stack)
    process.exit(1)
  }

  process.exit(0)
}

// 执行
addIndexes()
