import { db } from './src/db/index.js'
import { users, questionSets, questions, exams, chapters } from './src/db/schema.js'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

async function seedTestData() {
  console.log('🌱 开始初始化测试数据...\n')

  try {
    // 0. 获取一个现有的 chapter ID
    console.log('📖 查找现有章节...')
    const existingChapters = await db.select().from(chapters).limit(1)
    
    if (existingChapters.length === 0) {
      console.log('❌ 数据库中没有章节数据，无法创建题目')
      console.log('💡 提示：请先导入科目和章节数据')
      process.exit(1)
    }
    
    const chapterId = existingChapters[0].id
    console.log(`✅ 使用章节: ${chapterId}`)

    // 1. 创建测试用户
    console.log('\n👤 创建测试用户...')
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

    console.log(`✅ 创建了 ${testUsers.length} 个测试用户`)
    testUsers.forEach(u => console.log(`   - ${u.email} (ID: ${u.id})`))

    // 2. 创建测试题目
    console.log('\n📝 创建测试题目...')
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

    console.log(`✅ 创建了 ${testQuestions.length} 道测试题目`)

    // 3. 创建测试试卷
    console.log('\n📋 创建测试试卷...')
    const questionIds = testQuestions.map(q => q.id)
    
    const testQuestionSets = await db.insert(questionSets).values([
      {
        title: 'Mathematics Quick Test',
        description: 'Basic algebra and calculus questions',
        subject: 'mathematics',
        difficulty: 'medium',
        questionIds: questionIds.slice(0, 2),
        totalQuestions: 2,
        totalPoints: 5,
        timeLimit: 600,
        tags: ['algebra', 'calculus']
      },
      {
        title: 'Economics Basics',
        description: 'Supply and demand fundamentals',
        subject: 'economics',
        difficulty: 'easy',
        questionIds: [questionIds[2]],
        totalQuestions: 1,
        totalPoints: 2,
        timeLimit: 300,
        tags: ['supply_demand']
      }
    ]).returning()

    console.log(`✅ 创建了 ${testQuestionSets.length} 套测试试卷`)
    testQuestionSets.forEach(qs => console.log(`   - ${qs.title} (ID: ${qs.id})`))

    // 4. 创建历史考试记录
    console.log('\n📊 创建历史考试记录...')
    const userId = testUsers[0].id
    const questionSetId = testQuestionSets[0].id

    const testExam = await db.insert(exams).values({
      userId,
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

    console.log(`✅ 创建了 ${testExam.length} 条历史考试记录`)

    console.log('\n✅ 测试数据初始化完成！')
    console.log('\n📌 测试账号信息：')
    console.log('   Email: student1@test.com')
    console.log('   Email: student2@test.com')
    console.log('   Email: demo@alevel.com')
    console.log('   Password: test123')
    console.log('\n📊 数据统计：')
    console.log(`   - ${testUsers.length} 个用户`)
    console.log(`   - ${testQuestions.length} 道题目`)
    console.log(`   - ${testQuestionSets.length} 套试卷`)
    console.log(`   - ${testExam.length} 条考试记录`)

    process.exit(0)
  } catch (error) {
    console.error('❌ 初始化失败:', error.message)
    console.error(error)
    process.exit(1)
  }
}

seedTestData()
