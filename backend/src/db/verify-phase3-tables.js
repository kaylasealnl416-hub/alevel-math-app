import { db } from './index.js'
import { sql } from 'drizzle-orm'

/**
 * 验证 Phase 3 数据库表结构
 */
async function verifyPhase3Tables() {
  console.log('🔍 验证 Phase 3 数据库表结构...\n')

  try {
    // 1. 检查 questions 表的新字段
    console.log('1️⃣ 检查 questions 表扩展字段...')
    const questionsColumns = await db.execute(sql`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'questions'
      AND column_name IN ('tags', 'source', 'source_document_id', 'estimated_time', 'usage_count', 'correct_rate', 'status', 'reviewed_by', 'reviewed_at')
      ORDER BY column_name;
    `)

    const expectedQuestionsFields = [
      'correct_rate', 'estimated_time', 'reviewed_at', 'reviewed_by',
      'source', 'source_document_id', 'status', 'tags', 'usage_count'
    ]

    const rows = questionsColumns.rows || questionsColumns
    const foundFields = rows.map(r => r.column_name)
    const missingFields = expectedQuestionsFields.filter(f => !foundFields.includes(f))

    if (missingFields.length === 0) {
      console.log('   ✅ questions 表所有字段已存在')
      rows.forEach(row => {
        console.log(`      - ${row.column_name}: ${row.data_type}`)
      })
    } else {
      console.log(`   ❌ questions 表缺少字段: ${missingFields.join(', ')}`)
    }

    // 2. 检查 uploaded_documents 表
    console.log('\n2️⃣ 检查 uploaded_documents 表...')
    const documentsTable = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'uploaded_documents'
      );
    `)

    const docRows = documentsTable.rows || documentsTable
    if (docRows[0].exists) {
      console.log('   ✅ uploaded_documents 表已存在')

      const documentsColumns = await db.execute(sql`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'uploaded_documents'
        ORDER BY ordinal_position;
      `)

      const docColRows = documentsColumns.rows || documentsColumns
      console.log('   字段列表:')
      docColRows.forEach(row => {
        console.log(`      - ${row.column_name}: ${row.data_type}`)
      })
    } else {
      console.log('   ❌ uploaded_documents 表不存在')
    }

    // 3. 检查 question_sets 表
    console.log('\n3️⃣ 检查 question_sets 表...')
    const setsTable = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'question_sets'
      );
    `)

    const setRows = setsTable.rows || setsTable
    if (setRows[0].exists) {
      console.log('   ✅ question_sets 表已存在')

      const setsColumns = await db.execute(sql`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'question_sets'
        ORDER BY ordinal_position;
      `)

      const setColRows = setsColumns.rows || setsColumns
      console.log('   字段列表:')
      setColRows.forEach(row => {
        console.log(`      - ${row.column_name}: ${row.data_type}`)
      })
    } else {
      console.log('   ❌ question_sets 表不存在')
    }

    // 4. 检查 user_answers 表的新字段
    console.log('\n4️⃣ 检查 user_answers 表扩展字段...')
    const answersColumns = await db.execute(sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'user_answers'
      AND column_name IN ('question_set_id', 'score', 'ai_feedback', 'ai_score')
      ORDER BY column_name;
    `)

    const expectedAnswersFields = ['ai_feedback', 'ai_score', 'question_set_id', 'score']
    const answerRows = answersColumns.rows || answersColumns
    const foundAnswersFields = answerRows.map(r => r.column_name)
    const missingAnswersFields = expectedAnswersFields.filter(f => !foundAnswersFields.includes(f))

    if (missingAnswersFields.length === 0) {
      console.log('   ✅ user_answers 表所有字段已存在')
      answerRows.forEach(row => {
        console.log(`      - ${row.column_name}: ${row.data_type}`)
      })
    } else {
      console.log(`   ❌ user_answers 表缺少字段: ${missingAnswersFields.join(', ')}`)
    }

    // 5. 检查索引
    console.log('\n5️⃣ 检查数据库索引...')
    const indexes = await db.execute(sql`
      SELECT
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND tablename IN ('questions', 'uploaded_documents', 'question_sets', 'user_answers')
      ORDER BY tablename, indexname;
    `)

    const indexRows = indexes.rows || indexes
    console.log(`   找到 ${indexRows.length} 个索引`)
    indexRows.forEach(row => {
      console.log(`      - ${row.tablename}.${row.indexname}`)
    })

    console.log('\n✅ Phase 3 数据库表结构验证完成！')
    process.exit(0)

  } catch (error) {
    console.error('❌ 验证失败:', error.message)
    process.exit(1)
  }
}

verifyPhase3Tables()
