// ============================================================
// 临时数据初始化 API
// 用于通过 HTTP 请求初始化测试数据
// 使用后应该删除此文件
// ============================================================

import { Hono } from 'hono'
import { db } from '../db/index.js'
import { users, questionSets, questions, exams, chapters } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

const app = new Hono()

/**
 * GET /api/seed/init
 * 初始化测试数据
 *
 * 安全措施：
 * 1. 只在生产环境允许执行一次
 * 2. 需要提供简单的密钥验证
 */
app.get('/init', async (c) => {
  try {
    // 简单的安全检查：需要提供 key 参数
    const key = c.req.query('key')
    if (key !== 'init-data-2026') {
      return c.json({
        success: false,
        error: '无效的密钥'
      }, 403)
    }

    console.log('🌱 开始初始化测试数据...')

    // 0. 获取一个现有的 chapter ID
    console.log('📖 查找现有章节...')
    const existingChapters = await db.select().from(chapters).limit(1)

    if (existingChapters.length === 0) {
      return c.json({
        success: false,
        error: '数据库中没有章节数据，无法创建题目。请先导入科目和章节数据。'
      })
    }

    const chapterId = existingChapters[0].id
    console.log(`✅ 使用章节: ${chapterId}`)

    // 1. 创建测试用户（如果不存在）
    console.log('👤 检查/创建测试用户...')
    const hashedPassword = await bcrypt.hash('test123', 10)

    const testUserEmails = ['student1@test.com', 'student2@test.com', 'demo@alevel.com']
    const testUsers = []

    for (const email of testUserEmails) {
      const existing = await db.select().from(users).where(eq(users.email, email)).limit(1)
      if (existing.length > 0) {
        console.log(`  ℹ️  用户已存在: ${email}`)
        testUsers.push(existing[0])
      } else {
        const nickname = email === 'student1@test.com' ? 'Test Student 1' :
                        email === 'student2@test.com' ? 'Test Student 2' : 'Demo User'
        const grade = email === 'student2@test.com' ? 'A2' : 'AS'

        const [newUser] = await db.insert(users).values({
          email,
          password: hashedPassword,
          nickname,
          grade
        }).returning()

        console.log(`  ✅ 创建新用户: ${email}`)
        testUsers.push(newUser)
      }
    }

    console.log(`✅ 准备好 ${testUsers.length} 个测试用户`)

    // 2. 创建测试题目
    console.log('📝 创建测试题目...')
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
    console.log('📋 创建测试试卷...')
    const questionIds = testQuestions.map(q => q.id)

    const testQuestionSets = await db.insert(questionSets).values([
      {
        title: 'Mathematics Quick Test',
        description: 'Basic algebra and calculus questions',
        type: 'practice',
        chapterId,
        questionIds: questionIds.slice(0, 2),
        totalQuestions: 2,
        totalPoints: 5,
        timeLimit: 10,
        generatedBy: 'manual'
      },
      {
        title: 'Economics Basics',
        description: 'Supply and demand fundamentals',
        type: 'practice',
        chapterId,
        questionIds: [questionIds[2]],
        totalQuestions: 1,
        totalPoints: 2,
        timeLimit: 5,
        generatedBy: 'manual'
      }
    ]).returning()

    console.log(`✅ 创建了 ${testQuestionSets.length} 套测试试卷`)

    // 4. 创建历史考试记录
    console.log('📊 创建历史考试记录...')
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

    return c.json({
      success: true,
      message: '测试数据初始化完成！',
      data: {
        users: testUsers.length,
        questions: testQuestions.length,
        questionSets: testQuestionSets.length,
        exams: testExam.length,
        testAccounts: [
          { email: 'student1@test.com', password: 'test123' },
          { email: 'student2@test.com', password: 'test123' },
          { email: 'demo@alevel.com', password: 'test123' }
        ]
      }
    })

  } catch (error) {
    console.error('❌ 初始化失败:', error)
    return c.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, 500)
  }
})

/**
 * GET /api/seed/status
 * 检查数据状态
 */
app.get('/status', async (c) => {
  try {
    const usersData = await db.select().from(users)
    const questionsData = await db.select().from(questions)
    const questionSetsData = await db.select().from(questionSets)
    const examsData = await db.select().from(exams)

    return c.json({
      success: true,
      data: {
        users: usersData.length,
        questions: questionsData.length,
        questionSets: questionSetsData.length,
        exams: examsData.length
      }
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error.message
    }, 500)
  }
})

export default app
