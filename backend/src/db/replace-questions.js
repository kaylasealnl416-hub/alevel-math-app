// ============================================================
// Replace Chinese Economics questions with English A-Level Math questions
// ============================================================

import { db } from './index.js'
import { questions, questionSets } from './schema.js'
import { eq } from 'drizzle-orm'

// A-Level Pure Mathematics questions
const mathQuestions = [
  {
    chapterId: 'e1c1', // Using existing chapter ID
    type: 'multiple_choice',
    difficulty: 3,
    content: {
      en: 'Find the derivative of f(x) = 3x² + 5x - 2',
      zh: '求 f(x) = 3x² + 5x - 2 的导数'
    },
    options: [
      'A. 6x + 5',
      'B. 6x - 5',
      'C. 3x + 5',
      'D. 6x² + 5x'
    ],
    answer: {
      value: 'A',
      latex: '$f\'(x) = 6x + 5$',
      explanation: {
        en: 'Using the power rule: d/dx(x^n) = nx^(n-1). For f(x) = 3x² + 5x - 2, we get f\'(x) = 3(2x) + 5(1) - 0 = 6x + 5.',
        zh: '使用幂法则：d/dx(x^n) = nx^(n-1)。对于 f(x) = 3x² + 5x - 2，我们得到 f\'(x) = 3(2x) + 5(1) - 0 = 6x + 5。'
      }
    },
    tags: ['Differentiation', 'Power Rule', 'Calculus'],
    source: 'manual',
    estimatedTime: 120,
    status: 'active',
    createdBy: 1
  },
  {
    chapterId: 'e1c1',
    type: 'multiple_choice',
    difficulty: 3,
    content: {
      en: 'Solve the quadratic equation: x² - 5x + 6 = 0',
      zh: '解二次方程：x² - 5x + 6 = 0'
    },
    options: [
      'A. x = 2 or x = 3',
      'B. x = -2 or x = -3',
      'C. x = 1 or x = 6',
      'D. x = -1 or x = -6'
    ],
    answer: {
      value: 'A',
      latex: '$x = 2$ or $x = 3$',
      explanation: {
        en: 'Factorizing: x² - 5x + 6 = (x - 2)(x - 3) = 0. Therefore x = 2 or x = 3. We can verify: (2)² - 5(2) + 6 = 4 - 10 + 6 = 0 ✓',
        zh: '因式分解：x² - 5x + 6 = (x - 2)(x - 3) = 0。因此 x = 2 或 x = 3。验证：(2)² - 5(2) + 6 = 4 - 10 + 6 = 0 ✓'
      }
    },
    tags: ['Quadratic Equations', 'Factorization', 'Algebra'],
    source: 'manual',
    estimatedTime: 150,
    status: 'active',
    createdBy: 1
  },
  {
    chapterId: 'e1c1', // Pure Math Chapter 2
    type: 'multiple_choice',
    difficulty: 4,
    content: {
      en: 'Evaluate the definite integral: ∫₀² (2x + 3) dx',
      zh: '计算定积分：∫₀² (2x + 3) dx'
    },
    options: [
      'A. 10',
      'B. 8',
      'C. 12',
      'D. 6'
    ],
    answer: {
      value: 'A',
      latex: '$\\int_0^2 (2x + 3) dx = [x^2 + 3x]_0^2 = (4 + 6) - 0 = 10$',
      explanation: {
        en: 'First find the antiderivative: ∫(2x + 3)dx = x² + 3x + C. Then evaluate at the limits: [x² + 3x]₀² = (2² + 3×2) - (0² + 3×0) = 10 - 0 = 10.',
        zh: '首先求不定积分：∫(2x + 3)dx = x² + 3x + C。然后代入上下限：[x² + 3x]₀² = (2² + 3×2) - (0² + 3×0) = 10 - 0 = 10。'
      }
    },
    tags: ['Integration', 'Definite Integrals', 'Calculus'],
    source: 'manual',
    estimatedTime: 180,
    status: 'active',
    createdBy: 1
  },
  {
    chapterId: 'e1c1', // Pure Math Chapter 3
    type: 'multiple_choice',
    difficulty: 3,
    content: {
      en: 'Simplify: (2x³y²)³',
      zh: '化简：(2x³y²)³'
    },
    options: [
      'A. 8x⁹y⁶',
      'B. 6x⁹y⁶',
      'C. 8x⁶y⁵',
      'D. 2x⁹y⁶'
    ],
    answer: {
      value: 'A',
      latex: '$(2x^3y^2)^3 = 2^3 \\cdot (x^3)^3 \\cdot (y^2)^3 = 8x^9y^6$',
      explanation: {
        en: 'Using the power rule (aᵐ)ⁿ = aᵐⁿ: (2x³y²)³ = 2³ × (x³)³ × (y²)³ = 8 × x⁹ × y⁶ = 8x⁹y⁶.',
        zh: '使用幂法则 (aᵐ)ⁿ = aᵐⁿ：(2x³y²)³ = 2³ × (x³)³ × (y²)³ = 8 × x⁹ × y⁶ = 8x⁹y⁶。'
      }
    },
    tags: ['Indices', 'Algebraic Manipulation', 'Algebra'],
    source: 'manual',
    estimatedTime: 120,
    status: 'active',
    createdBy: 1
  },
  {
    chapterId: 'e1c1', // Statistics Chapter 1
    type: 'multiple_choice',
    difficulty: 3,
    content: {
      en: 'A fair six-sided die is rolled. What is the probability of rolling a number greater than 4?',
      zh: '投掷一个公平的六面骰子。投出大于4的数字的概率是多少？'
    },
    options: [
      'A. 1/3',
      'B. 1/2',
      'C. 2/3',
      'D. 1/6'
    ],
    answer: {
      value: 'A',
      latex: '$P(X > 4) = \\frac{2}{6} = \\frac{1}{3}$',
      explanation: {
        en: 'Numbers greater than 4 are: 5 and 6. That\'s 2 favorable outcomes out of 6 possible outcomes. Probability = 2/6 = 1/3.',
        zh: '大于4的数字是：5和6。这是6个可能结果中的2个有利结果。概率 = 2/6 = 1/3。'
      }
    },
    tags: ['Probability', 'Basic Probability', 'Statistics'],
    source: 'manual',
    estimatedTime: 90,
    status: 'active',
    createdBy: 1
  }
]

async function replaceQuestions() {
  try {
    console.log('🔄 Starting question replacement...\n')

    // 1. Delete existing questions
    console.log('🗑️  Deleting old questions...')
    const deleted = await db.delete(questions)
    console.log(`✅ Deleted existing questions\n`)

    // 2. Insert new A-Level Math questions
    console.log('📝 Inserting new A-Level Math questions...')
    const inserted = await db.insert(questions).values(mathQuestions).returning()

    console.log(`✅ Inserted ${inserted.length} new questions:\n`)
    inserted.forEach((q, i) => {
      console.log(`   ${i + 1}. [${q.type}] ${q.content.en.substring(0, 60)}...`)
      console.log(`      Tags: ${q.tags.join(', ')}`)
      console.log(`      Difficulty: ${q.difficulty}/5\n`)
    })

    // 3. Update question set to use new question IDs
    console.log('🔗 Updating question set...')
    const newQuestionIds = inserted.map(q => q.id)

    await db.update(questionSets)
      .set({
        questionIds: newQuestionIds,
        totalQuestions: newQuestionIds.length,
        title: 'A-Level Pure Mathematics Practice Set',
        description: 'Practice questions covering Calculus, Algebra, and Statistics'
      })
      .where(eq(questionSets.id, 1))

    console.log('✅ Updated question set\n')

    console.log('🎉 Question replacement completed successfully!')
    console.log(`\n📊 Summary:`)
    console.log(`   - Total questions: ${inserted.length}`)
    console.log(`   - Topics: Calculus, Algebra, Statistics`)
    console.log(`   - All questions in English`)
    console.log(`   - Question IDs: ${newQuestionIds.join(', ')}`)

  } catch (error) {
    console.error('❌ Error replacing questions:', error)
    throw error
  }
}

// Run the replacement
replaceQuestions()
  .then(() => {
    console.log('\n✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })
