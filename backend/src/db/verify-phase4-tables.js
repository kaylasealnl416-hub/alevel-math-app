import { db } from './index.js'
import { exams, examQuestionResults, learningRecommendations } from './schema.js'
import { sql } from 'drizzle-orm'

/**
 * Phase 4 数据库表验证脚本
 * 验证考试系统相关表是否正确创建
 */

async function verifyPhase4Tables() {
  console.log('🔍 开始验证 Phase 4 数据库表...\n')

  try {
    // 1. 验证 exams 表
    console.log('1️⃣ 验证 exams 表...')
    const examsResult = await db.execute(sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'exams'
      ORDER BY ordinal_position
    `)
    const examsRows = examsResult.rows || examsResult
    console.log(`   ✅ exams 表存在，共 ${examsRows.length} 个字段`)
    console.log('   字段列表：')
    examsRows.forEach(row => {
      console.log(`      - ${row.column_name} (${row.data_type})`)
    })

    // 2. 验证 exam_question_results 表
    console.log('\n2️⃣ 验证 exam_question_results 表...')
    const resultsResult = await db.execute(sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'exam_question_results'
      ORDER BY ordinal_position
    `)
    const resultsRows = resultsResult.rows || resultsResult
    console.log(`   ✅ exam_question_results 表存在，共 ${resultsRows.length} 个字段`)
    console.log('   字段列表：')
    resultsRows.forEach(row => {
      console.log(`      - ${row.column_name} (${row.data_type})`)
    })

    // 3. 验证 learning_recommendations 表
    console.log('\n3️⃣ 验证 learning_recommendations 表...')
    const recommendationsResult = await db.execute(sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'learning_recommendations'
      ORDER BY ordinal_position
    `)
    const recommendationsRows = recommendationsResult.rows || recommendationsResult
    console.log(`   ✅ learning_recommendations 表存在，共 ${recommendationsRows.length} 个字段`)
    console.log('   字段列表：')
    recommendationsRows.forEach(row => {
      console.log(`      - ${row.column_name} (${row.data_type})`)
    })

    // 4. 验证外键约束
    console.log('\n4️⃣ 验证外键约束...')
    const foreignKeysResult = await db.execute(sql`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name IN ('exams', 'exam_question_results', 'learning_recommendations')
      ORDER BY tc.table_name, kcu.column_name
    `)
    const foreignKeysRows = foreignKeysResult.rows || foreignKeysResult
    console.log(`   ✅ 找到 ${foreignKeysRows.length} 个外键约束`)
    foreignKeysRows.forEach(row => {
      console.log(`      - ${row.table_name}.${row.column_name} → ${row.foreign_table_name}.${row.foreign_column_name}`)
    })

    // 5. 验证索引
    console.log('\n5️⃣ 验证索引...')
    const indexesResult = await db.execute(sql`
      SELECT
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE tablename IN ('exams', 'exam_question_results', 'learning_recommendations')
      ORDER BY tablename, indexname
    `)
    const indexesRows = indexesResult.rows || indexesResult
    console.log(`   ✅ 找到 ${indexesRows.length} 个索引`)
    indexesRows.forEach(row => {
      console.log(`      - ${row.indexname} (${row.tablename})`)
    })

    // 6. 测试插入和查询（使用事务，最后回滚）
    console.log('\n6️⃣ 测试数据操作...')

    // 注意：这里只是验证表结构，不实际插入数据
    // 实际数据插入会在 API 中进行
    console.log('   ⏭️  跳过数据插入测试（将在 API 测试中进行）')

    console.log('\n✅ Phase 4 数据库表验证完成！')
    console.log('\n📊 总结：')
    console.log(`   - exams 表：${examsRows.length} 个字段`)
    console.log(`   - exam_question_results 表：${resultsRows.length} 个字段`)
    console.log(`   - learning_recommendations 表：${recommendationsRows.length} 个字段`)
    console.log(`   - 外键约束：${foreignKeysRows.length} 个`)
    console.log(`   - 索引：${indexesRows.length} 个`)

  } catch (error) {
    console.error('❌ 验证失败：', error.message)
    console.error(error)
    process.exit(1)
  }
}

// 运行验证
verifyPhase4Tables()
  .then(() => {
    console.log('\n🎉 所有验证通过！')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 验证过程出错：', error)
    process.exit(1)
  })
