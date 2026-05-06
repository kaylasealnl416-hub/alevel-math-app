// READ-ONLY: 摸清 politics 11 个 chapter id 在所有关联表的引用情况
// 用于评估"politics p_ → pol_"迁移的工作量
import { db, closeConnection } from '../../src/db/index.js'
import {
  chapters, questions, learningProgress, uploadedDocuments,
  questionSets, chatSessions, learningRecommendations,
  examQuestionResults, userAnswers, exams,
} from '../../src/db/schema.js'
import { eq, inArray, sql, like } from 'drizzle-orm'

const politicsIds = ['p1c1','p1c2','p2c1','p2c2','p2c3','p3c1','p3c2','p3c3','p4c1','p4c2','p4c3']
console.log(`\n📊 politics 11 个 chapter id 关联数据：\n`)

const tables = [
  { name: 'questions',            table: questions,            col: questions.chapterId },
  { name: 'learning_progress',    table: learningProgress,     col: learningProgress.chapterId },
  { name: 'question_sets',        table: questionSets,         col: questionSets.chapterId },
  { name: 'uploaded_documents',   table: uploadedDocuments,    col: uploadedDocuments.chapterId },
  { name: 'chat_sessions',        table: chatSessions,         col: chatSessions.chapterId },
  { name: 'learning_recommendations', table: learningRecommendations, col: learningRecommendations.chapterId },
]

for (const { name, table, col } of tables) {
  const [{ c }] = await db.select({ c: sql`count(*)::int` }).from(table).where(inArray(col, politicsIds))
  console.log(`  ${name.padEnd(30)} ${c} 条`)
}

// 间接引用：通过 questions.id 关联的表
console.log(`\n📊 间接引用（通过 questions → 这些 chapter）：`)
const polQuestionIds = (await db.select({ id: questions.id }).from(questions).where(inArray(questions.chapterId, politicsIds))).map(q => q.id)
console.log(`  politics 题目总数: ${polQuestionIds.length}`)

if (polQuestionIds.length > 0) {
  const [{ c: ua }] = await db.select({ c: sql`count(*)::int` }).from(userAnswers).where(inArray(userAnswers.questionId, polQuestionIds))
  const [{ c: eqr }] = await db.select({ c: sql`count(*)::int` }).from(examQuestionResults).where(inArray(examQuestionResults.questionId, polQuestionIds))
  console.log(`  user_answers 引用 politics 题: ${ua} 条`)
  console.log(`  exam_question_results 引用 politics 题: ${eqr} 条`)
}

// chapters 表本身
const polChapters = await db.select().from(chapters).where(inArray(chapters.id, politicsIds))
console.log(`\n📋 politics chapters 表本身: ${polChapters.length} 条`)
for (const ch of polChapters) {
  const richness = (ch.keyPoints?.length||0)+(ch.formulas?.length||0)+(ch.examples?.length||0)+(ch.videos?.length||0)
  console.log(`  ${ch.id.padEnd(8)} 内容字段总项数: ${richness}`)
}

await closeConnection()
