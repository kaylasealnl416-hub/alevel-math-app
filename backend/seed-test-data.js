import { db } from './src/db/index.js'
import { users, questionSets, questions, exams, chapters } from './src/db/schema.js'
import { inArray } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

async function seedTestData() {
  console.log('?? ?????????...\n')

  try {
    const seedEmails = ['student1@test.com', 'student2@test.com', 'demo@alevel.com']
    const seedQuestionSetTitles = ['Mathematics Quick Test', 'Economics Basics']

    console.log('?? ??????...')
    const existingChapters = await db.select().from(chapters).limit(1)

    if (existingChapters.length === 0) {
      console.log('? ?????????????????')
      console.log('?? ??????????????')
      process.exit(1)
    }

    const chapterId = existingChapters[0].id
    console.log(`? ????: ${chapterId}`)

    console.log('\n?? ????????...')
    const existingSeedUsers = await db.select({ id: users.id })
      .from(users)
      .where(inArray(users.email, seedEmails))
    const existingUserIds = existingSeedUsers.map((user) => user.id)

    const existingQuestionSets = await db.select({ id: questionSets.id })
      .from(questionSets)
      .where(inArray(questionSets.title, seedQuestionSetTitles))
    const existingQuestionSetIds = existingQuestionSets.map((item) => item.id)

    if (existingQuestionSetIds.length > 0) {
      await db.delete(exams).where(inArray(exams.questionSetId, existingQuestionSetIds))
      await db.delete(questionSets).where(inArray(questionSets.id, existingQuestionSetIds))
    }

    if (existingUserIds.length > 0) {
      await db.delete(exams).where(inArray(exams.userId, existingUserIds))
      await db.delete(users).where(inArray(users.id, existingUserIds))
    }

    console.log('\n?? ??????...')
    const hashedPassword = await bcrypt.hash('test123', 10)

    const testUsers = await db.insert(users).values([
      {
        email: 'student1@test.com',
        password: hashedPassword,
        nickname: 'Test Student 1',
        grade: 'AS'
      },
      {
        email: 'student2@test.com',
        password: hashedPassword,
        nickname: 'Test Student 2',
        grade: 'A2'
      },
      {
        email: 'demo@alevel.com',
        password: hashedPassword,
        nickname: 'Demo User',
        grade: 'AS'
      }
    ]).returning()

    console.log(`? ??? ${testUsers.length} ?????`)
    testUsers.forEach((user) => console.log(`   - ${user.email} (ID: ${user.id})`))

    console.log('\n?? ??????...')
    const testQuestions = await db.insert(questions).values([
      {
        chapterId,
        type: 'multiple_choice',
        difficulty: 2,
        content: {
          en: 'Solve for x: 2x + 5 = 13',
          latex: '2x + 5 = 13'
        },
        options: ['A. x = 3', 'B. x = 4', 'C. x = 5', 'D. x = 6'],
        answer: {
          value: 'B',
          explanation: '2x = 13 - 5 = 8, so x = 4'
        },
        explanation: { en: 'Subtract 5 from both sides, then divide by 2' },
        tags: ['algebra', 'linear_equations'],
        status: 'published',
        estimatedTime: 120
      },
      {
        chapterId,
        type: 'multiple_choice',
        difficulty: 3,
        content: {
          en: 'Find dy/dx for y = x²',
          latex: 'y = x^2'
        },
        options: ['A. x', 'B. 2x', 'C. x²', 'D. 2'],
        answer: {
          value: 'B',
          explanation: 'Using power rule: d/dx(x²) = 2x'
        },
        explanation: { en: 'Apply the power rule of differentiation' },
        tags: ['calculus', 'differentiation'],
        status: 'published',
        estimatedTime: 180
      },
      {
        chapterId,
        type: 'multiple_choice',
        difficulty: 1,
        content: {
          en: 'What happens to price when demand increases?'
        },
        options: ['A. Increases', 'B. Decreases', 'C. Stays same', 'D. Unpredictable'],
        answer: {
          value: 'A',
          explanation: 'Higher demand leads to higher equilibrium price'
        },
        explanation: { en: 'Basic supply and demand principle' },
        tags: ['supply_demand', 'market_equilibrium'],
        status: 'published',
        estimatedTime: 90
      }
    ]).returning()

    console.log(`? ??? ${testQuestions.length} ?????`)

    console.log('\n?? ??????...')
    const questionIds = testQuestions.map((question) => question.id)

    const testQuestionSets = await db.insert(questionSets).values([
      {
        title: 'Mathematics Quick Test',
        description: 'Basic algebra and calculus questions',
        userId: testUsers[0].id,
        type: 'exam',
        chapterId,
        questionIds: questionIds.slice(0, 2),
        totalQuestions: 2,
        totalPoints: 5,
        timeLimit: 600,
        difficultyDistribution: { 2: 1, 3: 1 },
        generatedBy: 'manual'
      },
      {
        title: 'Economics Basics',
        description: 'Supply and demand fundamentals',
        userId: testUsers[0].id,
        type: 'practice',
        chapterId,
        questionIds: [questionIds[2]],
        totalQuestions: 1,
        totalPoints: 2,
        timeLimit: 300,
        difficultyDistribution: { 1: 1 },
        generatedBy: 'manual'
      }
    ]).returning()

    console.log(`? ??? ${testQuestionSets.length} ?????`)
    testQuestionSets.forEach((questionSet) => console.log(`   - ${questionSet.title} (ID: ${questionSet.id})`))

    console.log('\n?? ????????...')
    const questionSetId = testQuestionSets[0].id
    const testExam = await db.insert(exams).values({
      userId: testUsers[0].id,
      questionSetId,
      type: 'chapter_test',
      mode: 'exam',
      status: 'graded',
      timeLimit: 600,
      allowReview: true,
      answers: {
        [questionIds[0]]: { answer: 'B' },
        [questionIds[1]]: { answer: 'A' }
      },
      markedQuestions: [],
      startedAt: new Date(Date.now() - 3600000),
      submittedAt: new Date(Date.now() - 3000000),
      timeSpent: 600,
      totalScore: 2,
      maxScore: 5,
      correctCount: 1,
      totalCount: 2,
      tabSwitchCount: 0,
      focusLostCount: 0
    }).returning()

    console.log(`? ??? ${testExam.length} ???????`)

    console.log('\n? ??????????')
    console.log('\n?? ???????')
    console.log('   Email: student1@test.com')
    console.log('   Email: student2@test.com')
    console.log('   Email: demo@alevel.com')
    console.log('   Password: test123')
    console.log('\n?? ?????')
    console.log(`   - ${testUsers.length} ???`)
    console.log(`   - ${testQuestions.length} ???`)
    console.log(`   - ${testQuestionSets.length} ???`)
    console.log(`   - ${testExam.length} ?????`)

    process.exit(0)
  } catch (error) {
    console.error('? ?????:', error.message)
    console.error(error)
    process.exit(1)
  }
}

seedTestData()
