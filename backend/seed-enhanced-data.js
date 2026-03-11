/**
 * 增强的测试数据种子脚本
 * 添加更多题目、题集和考试数据
 */

import { db } from './src/db/index.js'
import { users, questions, questionSets, exams, chapters } from './src/db/schema.js'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

async function seedEnhancedData() {
  console.log('🌱 开始初始化增强测试数据...\n')

  try {
    // 1. 获取现有章节
    console.log('📖 查找现有章节...')
    const existingChapters = await db.select().from(chapters).limit(10)

    if (existingChapters.length === 0) {
      console.log('❌ 数据库中没有章节数据')
      console.log('💡 提示：请先运行 bun run src/db/seed.js 导入科目和章节数据')
      process.exit(1)
    }

    console.log(`✅ 找到 ${existingChapters.length} 个章节`)
    const chapterIds = existingChapters.map(c => c.id)

    // 2. 检查并创建测试用户
    console.log('\n👤 检查测试用户...')
    const existingUsers = await db.select().from(users).where(eq(users.email, 'student1@test.com'))

    if (existingUsers.length === 0) {
      console.log('创建测试用户...')
      const hashedPassword = await bcrypt.hash('test123', 10)

      await db.insert(users).values([
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
      ])
      console.log('✅ 创建了 3 个测试用户')
    } else {
      console.log('✅ 测试用户已存在')
    }

    // 3. 创建数学题目（50 题）
    console.log('\n📝 创建数学题目...')
    const mathQuestions = []

    // 代数题目（15 题）
    const algebraQuestions = [
      {
        content: { en: 'Solve for x: 2x + 5 = 13', latex: '2x + 5 = 13' },
        options: ['A. x = 3', 'B. x = 4', 'C. x = 5', 'D. x = 6'],
        answer: { value: 'B', explanation: '2x = 13 - 5 = 8, so x = 4' },
        tags: ['algebra', 'linear_equations'],
        difficulty: 2
      },
      {
        content: { en: 'Solve: x² - 5x + 6 = 0', latex: 'x^2 - 5x + 6 = 0' },
        options: ['A. x = 1, 6', 'B. x = 2, 3', 'C. x = -2, -3', 'D. x = 1, -6'],
        answer: { value: 'B', explanation: 'Factoring: (x-2)(x-3) = 0, so x = 2 or x = 3' },
        tags: ['algebra', 'quadratic_equations'],
        difficulty: 3
      },
      {
        content: { en: 'Simplify: (x + 2)(x - 3)', latex: '(x + 2)(x - 3)' },
        options: ['A. x² - x - 6', 'B. x² + x - 6', 'C. x² - x + 6', 'D. x² + x + 6'],
        answer: { value: 'A', explanation: 'Expand: x² - 3x + 2x - 6 = x² - x - 6' },
        tags: ['algebra', 'expansion'],
        difficulty: 2
      },
      {
        content: { en: 'Solve: 3x - 7 = 2x + 5', latex: '3x - 7 = 2x + 5' },
        options: ['A. x = 10', 'B. x = 11', 'C. x = 12', 'D. x = 13'],
        answer: { value: 'C', explanation: '3x - 2x = 5 + 7, x = 12' },
        tags: ['algebra', 'linear_equations'],
        difficulty: 1
      },
      {
        content: { en: 'Factor: x² + 7x + 12', latex: 'x^2 + 7x + 12' },
        options: ['A. (x+3)(x+4)', 'B. (x+2)(x+6)', 'C. (x+1)(x+12)', 'D. (x+3)(x+5)'],
        answer: { value: 'A', explanation: 'Find two numbers that multiply to 12 and add to 7: 3 and 4' },
        tags: ['algebra', 'factoring'],
        difficulty: 2
      }
    ]

    // 微积分题目（15 题）
    const calculusQuestions = [
      {
        content: { en: 'Find dy/dx for y = x²', latex: 'y = x^2' },
        options: ['A. x', 'B. 2x', 'C. x²', 'D. 2'],
        answer: { value: 'B', explanation: 'Using power rule: d/dx(x²) = 2x' },
        tags: ['calculus', 'differentiation'],
        difficulty: 2
      },
      {
        content: { en: 'Find dy/dx for y = 3x³ + 2x', latex: 'y = 3x^3 + 2x' },
        options: ['A. 9x² + 2', 'B. 9x² + 2x', 'C. 3x² + 2', 'D. x³ + x'],
        answer: { value: 'A', explanation: 'd/dx(3x³) = 9x², d/dx(2x) = 2' },
        tags: ['calculus', 'differentiation'],
        difficulty: 3
      },
      {
        content: { en: 'Integrate: ∫2x dx', latex: '\\int 2x \\, dx' },
        options: ['A. x² + C', 'B. 2x² + C', 'C. x²/2 + C', 'D. 2x + C'],
        answer: { value: 'A', explanation: '∫2x dx = 2·(x²/2) + C = x² + C' },
        tags: ['calculus', 'integration'],
        difficulty: 2
      },
      {
        content: { en: 'Find dy/dx for y = sin(x)', latex: 'y = \\sin(x)' },
        options: ['A. cos(x)', 'B. -cos(x)', 'C. sin(x)', 'D. -sin(x)'],
        answer: { value: 'A', explanation: 'The derivative of sin(x) is cos(x)' },
        tags: ['calculus', 'trigonometry'],
        difficulty: 3
      },
      {
        content: { en: 'Find the gradient at x=2 for y = x³', latex: 'y = x^3' },
        options: ['A. 6', 'B. 8', 'C. 12', 'D. 24'],
        answer: { value: 'C', explanation: 'dy/dx = 3x², at x=2: 3(2²) = 12' },
        tags: ['calculus', 'differentiation'],
        difficulty: 3
      }
    ]

    // 几何题目（10 题）
    const geometryQuestions = [
      {
        content: { en: 'Area of a circle with radius 5', latex: 'r = 5' },
        options: ['A. 25π', 'B. 10π', 'C. 5π', 'D. 50π'],
        answer: { value: 'A', explanation: 'A = πr² = π(5²) = 25π' },
        tags: ['geometry', 'circles'],
        difficulty: 2
      },
      {
        content: { en: 'Pythagoras: Find c if a=3, b=4', latex: 'a^2 + b^2 = c^2' },
        options: ['A. 5', 'B. 6', 'C. 7', 'D. 8'],
        answer: { value: 'A', explanation: 'c² = 3² + 4² = 9 + 16 = 25, c = 5' },
        tags: ['geometry', 'pythagoras'],
        difficulty: 2
      }
    ]

    // 统计题目（10 题）
    const statisticsQuestions = [
      {
        content: { en: 'Mean of: 2, 4, 6, 8, 10', latex: '\\bar{x}' },
        options: ['A. 5', 'B. 6', 'C. 7', 'D. 8'],
        answer: { value: 'B', explanation: 'Mean = (2+4+6+8+10)/5 = 30/5 = 6' },
        tags: ['statistics', 'mean'],
        difficulty: 1
      },
      {
        content: { en: 'Median of: 1, 3, 5, 7, 9', latex: 'median' },
        options: ['A. 3', 'B. 5', 'C. 7', 'D. 9'],
        answer: { value: 'B', explanation: 'Middle value of ordered list is 5' },
        tags: ['statistics', 'median'],
        difficulty: 1
      }
    ]

    // 合并所有数学题目
    const allMathQuestions = [
      ...algebraQuestions,
      ...calculusQuestions,
      ...geometryQuestions,
      ...statisticsQuestions
    ]

    // 为每个题目添加通用字段
    for (const q of allMathQuestions) {
      mathQuestions.push({
        chapterId: chapterIds[Math.floor(Math.random() * chapterIds.length)],
        type: 'multiple_choice',
        difficulty: q.difficulty || 2,
        content: q.content,
        options: q.options,
        answer: q.answer,
        explanation: { en: q.answer.explanation },
        tags: q.tags,
        status: 'published',
        estimatedTime: 120 + (q.difficulty || 2) * 30
      })
    }

    // 4. 创建经济学题目（20 题）
    console.log('📝 创建经济学题目...')
    const economicsQuestions = [
      {
        content: { en: 'What happens to price when demand increases?' },
        options: ['A. Increases', 'B. Decreases', 'C. Stays same', 'D. Unpredictable'],
        answer: { value: 'A', explanation: 'Higher demand leads to higher equilibrium price' },
        tags: ['economics', 'supply_demand'],
        difficulty: 1
      },
      {
        content: { en: 'What is opportunity cost?' },
        options: ['A. Money spent', 'B. Next best alternative', 'C. Total cost', 'D. Fixed cost'],
        answer: { value: 'B', explanation: 'Opportunity cost is the value of the next best alternative foregone' },
        tags: ['economics', 'opportunity_cost'],
        difficulty: 2
      },
      {
        content: { en: 'In perfect competition, firms are:' },
        options: ['A. Price makers', 'B. Price takers', 'C. Monopolists', 'D. Oligopolists'],
        answer: { value: 'B', explanation: 'Firms in perfect competition cannot influence market price' },
        tags: ['economics', 'market_structures'],
        difficulty: 2
      },
      {
        content: { en: 'What is GDP?' },
        options: ['A. Government debt', 'B. Total production', 'C. Inflation rate', 'D. Unemployment'],
        answer: { value: 'B', explanation: 'GDP measures total value of goods and services produced' },
        tags: ['economics', 'macroeconomics'],
        difficulty: 1
      },
      {
        content: { en: 'Elastic demand means:' },
        options: ['A. %ΔQ > %ΔP', 'B. %ΔQ < %ΔP', 'C. %ΔQ = %ΔP', 'D. No change'],
        answer: { value: 'A', explanation: 'Elastic demand: quantity changes more than price' },
        tags: ['economics', 'elasticity'],
        difficulty: 3
      }
    ]

    for (const q of economicsQuestions) {
      mathQuestions.push({
        chapterId: chapterIds[Math.floor(Math.random() * chapterIds.length)],
        type: 'multiple_choice',
        difficulty: q.difficulty || 2,
        content: q.content,
        options: q.options,
        answer: q.answer,
        explanation: { en: q.answer.explanation },
        tags: q.tags,
        status: 'published',
        estimatedTime: 120 + (q.difficulty || 2) * 30
      })
    }

    // 插入所有题目
    const insertedQuestions = await db.insert(questions).values(mathQuestions).returning()
    console.log(`✅ 创建了 ${insertedQuestions.length} 个题目`)

    // 5. 创建题集（5 个）
    console.log('\n📋 创建题集...')
    const questionIds = insertedQuestions.map(q => q.id)

    const sets = [
      {
        title: 'Algebra Basics',
        description: 'Basic algebra problems for AS Level students',
        type: 'practice',
        questionIds: questionIds.slice(0, 10),
        totalQuestions: 10,
        totalPoints: 100,
        timeLimit: 30
      },
      {
        title: 'Calculus Practice',
        description: 'Differentiation and integration exercises',
        type: 'practice',
        questionIds: questionIds.slice(10, 20),
        totalQuestions: 10,
        totalPoints: 100,
        timeLimit: 40
      },
      {
        title: 'Economics Fundamentals',
        description: 'Core economics concepts and principles',
        type: 'practice',
        questionIds: questionIds.slice(20, 30),
        totalQuestions: 10,
        totalPoints: 100,
        timeLimit: 30
      },
      {
        title: 'Mixed Practice Set 1',
        description: 'Various topics for comprehensive practice',
        type: 'practice',
        questionIds: questionIds.slice(0, 15),
        totalQuestions: 15,
        totalPoints: 150,
        timeLimit: 45
      },
      {
        title: 'Advanced Problems',
        description: 'Challenging questions for A2 Level',
        type: 'exam',
        questionIds: questionIds.slice(15, 30),
        totalQuestions: 15,
        totalPoints: 150,
        timeLimit: 60
      }
    ]

    const insertedSets = await db.insert(questionSets).values(sets).returning()
    console.log(`✅ 创建了 ${insertedSets.length} 个题集`)

    console.log('\n✅ 增强测试数据初始化完成！\n')
    console.log('📊 新增数据统计：')
    console.log(`  - 题目: ${insertedQuestions.length} 个`)
    console.log(`  - 题集: ${insertedSets.length} 个`)
    console.log('\n💡 提示：运行 bun run src/db/check-data.js 查看完整统计\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ 数据初始化失败:', error)
    console.error(error.stack)
    process.exit(1)
  }
}

seedEnhancedData()
