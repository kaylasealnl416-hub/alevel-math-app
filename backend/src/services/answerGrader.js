// ============================================================
// AI 批改引擎
// 自动批改客观题，AI 批改主观题，生成详细反馈
// ============================================================

import { db } from '../db/index.js'
import { questions, userAnswers } from '../db/schema.js'
import { eq, inArray } from 'drizzle-orm'
import { callAI } from './aiClient.js'

/**
 * 批改单个答案
 * @param {Object} answer - 用户答案对象
 * @returns {Promise<Object>} 批改结果
 */
export async function gradeAnswer(answer) {
  const { questionId, userAnswer } = answer

  // 1. 获取题目信息
  const [question] = await db
    .select()
    .from(questions)
    .where(eq(questions.id, questionId))
    .limit(1)

  if (!question) {
    throw new Error('题目不存在')
  }

  return await gradeAnswerWithQuestion(question, userAnswer)
}

/**
 * 批改单个答案（使用已有的题目对象，避免数据库查询）
 * @param {Object} question - 题目对象
 * @param {any} userAnswer - 用户答案
 * @returns {Promise<Object>} 批改结果
 */
export async function gradeAnswerWithQuestion(question, userAnswer) {
  // 根据题型选择批改方式
  if (question.type === 'multiple_choice') {
    return gradeMultipleChoice(question, userAnswer)
  } else if (question.type === 'fill_blank') {
    return gradeFillBlank(question, userAnswer)
  } else if (question.type === 'calculation') {
    return gradeCalculation(question, userAnswer)
  } else if (question.type === 'short_answer' || question.type === 'proof') {
    return await gradeSubjective(question, userAnswer)
  }

  throw new Error(`不支持的题型: ${question.type}`)
}

/**
 * 批改选择题（客观题）
 */
function gradeMultipleChoice(question, userAnswer) {
  const correctAnswer = question.answer?.value

  // 处理答案格式：可能是字符串 "A" 或对象 { answer: "A" }
  const userAnswerValue = typeof userAnswer === 'string'
    ? userAnswer
    : userAnswer?.answer || userAnswer?.value

  const isCorrect = userAnswerValue?.toUpperCase() === correctAnswer?.toUpperCase()

  return {
    isCorrect,
    score: isCorrect ? 10 : 0,
    feedback: {
      correctAnswer,
      explanation: question.answer?.explanation || question.explanation,
      message: isCorrect ? '回答正确！' : '答案错误，请查看解析。'
    }
  }
}

/**
 * 批改填空题（客观题）
 */
function gradeFillBlank(question, userAnswer) {
  const correctAnswer = question.answer?.value

  // 处理答案格式：可能是字符串或对象
  const userAnswerValue = typeof userAnswer === 'string'
    ? userAnswer
    : userAnswer?.answer || userAnswer?.value

  // 标准化答案（去除空格、统一大小写）
  const normalizedUser = userAnswerValue?.trim().toLowerCase()
  const normalizedCorrect = correctAnswer?.trim().toLowerCase()

  const isCorrect = normalizedUser === normalizedCorrect

  return {
    isCorrect,
    score: isCorrect ? 10 : 0,
    feedback: {
      correctAnswer,
      explanation: question.answer?.explanation || question.explanation,
      message: isCorrect ? '回答正确！' : '答案错误，请查看正确答案。'
    }
  }
}

/**
 * 批改计算题（半客观题）
 */
function gradeCalculation(question, userAnswer) {
  const correctAnswer = question.answer?.value

  // 处理答案格式：可能是字符串、数字或对象
  const userAnswerValue = typeof userAnswer === 'object'
    ? (userAnswer?.answer || userAnswer?.value)
    : userAnswer

  // 尝试数值比较
  const userNum = parseFloat(userAnswerValue)
  const correctNum = parseFloat(correctAnswer)

  let isCorrect = false

  if (!isNaN(userNum) && !isNaN(correctNum)) {
    // 数值比较（允许小误差）
    const tolerance = 0.01
    isCorrect = Math.abs(userNum - correctNum) < tolerance
  } else {
    // 字符串比较
    const normalizedUser = userAnswer?.trim().toLowerCase()
    const normalizedCorrect = correctAnswer?.trim().toLowerCase()
    isCorrect = normalizedUser === normalizedCorrect
  }

  return {
    isCorrect,
    score: isCorrect ? 10 : 0,
    feedback: {
      correctAnswer,
      latex: question.answer?.latex,
      explanation: question.answer?.explanation || question.explanation,
      message: isCorrect ? '计算正确！' : '计算结果有误，请查看解析。'
    }
  }
}

/**
 * 批改主观题（AI 批改）
 */
async function gradeSubjective(question, userAnswer) {
  console.log(`🤖 AI 批改主观题: ${question.id}`)

  try {
    // 构建批改 Prompt
    const prompt = buildGradingPrompt(question, userAnswer)

    // 调用 AI
    const response = await callAI([
      {
        role: 'user',
        content: prompt
      }
    ], {
      temperature: 0.3, // 较低的温度，保证批改的一致性
      maxTokens: 1000
    })

    // 解析 AI 返回的批改结果
    const result = parseGradingResponse(response.content)

    console.log(`✅ AI 批改完成: 得分 ${result.score}/10`)

    return result

  } catch (error) {
    console.error('❌ AI 批改失败:', error)

    // 降级处理：返回默认评分
    return {
      isCorrect: false,
      score: 5, // 默认给一半分数
      feedback: {
        message: 'AI 批改暂时不可用，已给予默认评分。',
        error: error.message
      }
    }
  }
}

/**
 * 构建批改 Prompt
 */
function buildGradingPrompt(question, userAnswer) {
  const questionContent = getContent(question.content)
  const correctAnswer = getContent(question.answer?.value) || getContent(question.answer)
  const explanation = getContent(question.answer?.explanation) || getContent(question.explanation)

  return `你是 A-Level 批改专家。请批改学生的答案并给出详细反馈。

## 题目信息

**题目类型**: ${question.type === 'short_answer' ? '简答题' : '证明题'}
**题目内容**: ${questionContent}

**标准答案**: ${correctAnswer}

${explanation ? `**答案解析**: ${explanation}` : ''}

## 学生答案

${userAnswer || '（学生未作答）'}

## 批改要求

1. **评分标准**（0-10分）：
   - 10分：完全正确，逻辑清晰，表达准确
   - 8-9分：基本正确，有小瑕疵
   - 6-7分：部分正确，有明显错误
   - 4-5分：思路有一定道理，但错误较多
   - 2-3分：基本错误，仅有少量正确内容
   - 0-1分：完全错误或未作答

2. **反馈内容**：
   - 指出答案的优点（strengths）
   - 指出答案的不足（weaknesses）
   - 提供改进建议（suggestions）
   - 给出鼓励性评语（encouragement）

3. **输出格式**（必须是有效的 JSON）：

\`\`\`json
{
  "score": 8,
  "isCorrect": true,
  "feedback": {
    "strengths": ["步骤清晰", "公式运用正确"],
    "weaknesses": ["计算有小错误"],
    "suggestions": ["注意检查计算过程", "可以使用更简洁的表达"],
    "encouragement": "整体思路很好，继续加油！",
    "summary": "答案基本正确，逻辑清晰，但计算过程有小错误。"
  }
}
\`\`\`

**注意**：
- score 必须是 0-10 的整数
- isCorrect 表示是否达到及格标准（score >= 6）
- 所有反馈必须具体、有建设性
- 评语要鼓励学生，保持积极正面的态度
- 确保输出是有效的 JSON 格式

请开始批改：`
}

/**
 * 解析 AI 批改响应
 */
function parseGradingResponse(content) {
  try {
    // 提取 JSON
    let jsonString = null

    // 方式 1: 提取 ```json 代码块
    const jsonMatch = content.match(/```json\s*\n([\s\S]*?)\n```/)
    if (jsonMatch) {
      jsonString = jsonMatch[1]
    }

    // 方式 2: 提取 ``` 代码块
    if (!jsonString) {
      const codeMatch = content.match(/```\s*\n([\s\S]*?)\n```/)
      if (codeMatch) {
        jsonString = codeMatch[1]
      }
    }

    // 方式 3: 查找 JSON 对象
    if (!jsonString) {
      const objectMatch = content.match(/\{[\s\S]*"score"[\s\S]*\}/)
      if (objectMatch) {
        jsonString = objectMatch[0]
      }
    }

    // 方式 4: 直接使用原始内容
    if (!jsonString) {
      jsonString = content.trim()
    }

    const parsed = JSON.parse(jsonString)

    // 验证必需字段
    if (typeof parsed.score !== 'number' || parsed.score < 0 || parsed.score > 10) {
      throw new Error('Invalid score')
    }

    return {
      isCorrect: parsed.isCorrect !== false && parsed.score >= 6,
      score: parsed.score,
      feedback: parsed.feedback || {}
    }

  } catch (error) {
    console.error('❌ 解析批改结果失败:', error)
    console.error('原始内容:', content.substring(0, 500))

    // 返回默认结果
    return {
      isCorrect: false,
      score: 5,
      feedback: {
        message: '批改结果解析失败，已给予默认评分。',
        error: error.message
      }
    }
  }
}

/**
 * 批量批改答案（优化：客观题并行处理，主观题串行以避免 AI API 限流）
 * @param {Array} answers - 答案数组
 * @returns {Promise<Array>} 批改结果数组
 */
export async function gradeAnswersBatch(answers) {
  console.log(`📝 开始批量批改 ${answers.length} 个答案`)

  // 先获取所有题目信息，以便区分客观题和主观题
  const questionIds = answers.map(a => a.questionId)
  const questionsData = await db
    .select()
    .from(questions)
    .where(inArray(questions.id, questionIds))

  const questionMap = new Map(questionsData.map(q => [q.id, q]))

  // 分离客观题和主观题
  const objectiveAnswers = []
  const subjectiveAnswers = []

  for (const answer of answers) {
    const question = questionMap.get(answer.questionId)
    if (question && (question.type === 'short_answer' || question.type === 'proof')) {
      subjectiveAnswers.push(answer)
    } else {
      objectiveAnswers.push(answer)
    }
  }

  const results = []

  // 并行批改客观题
  if (objectiveAnswers.length > 0) {
    const objectiveResults = await Promise.all(
      objectiveAnswers.map(async (answer) => {
        try {
          const question = questionMap.get(answer.questionId)
          const result = await gradeAnswerWithQuestion(question, answer.userAnswer)
          return { questionId: answer.questionId, ...result }
        } catch (error) {
          console.error(`批改失败 (questionId: ${answer.questionId}):`, error)
          return {
            questionId: answer.questionId,
            isCorrect: false,
            score: 0,
            feedback: { message: '批改失败', error: error.message }
          }
        }
      })
    )
    results.push(...objectiveResults)
  }

  // 串行批改主观题（避免 AI API 限流）
  for (const answer of subjectiveAnswers) {
    try {
      const question = questionMap.get(answer.questionId)
      const result = await gradeAnswerWithQuestion(question, answer.userAnswer)
      results.push({
        questionId: answer.questionId,
        ...result
      })
    } catch (error) {
      console.error(`批改失败 (questionId: ${answer.questionId}):`, error)
      results.push({
        questionId: answer.questionId,
        isCorrect: false,
        score: 0,
        feedback: { message: '批改失败', error: error.message }
      })
    }
  }

  console.log(`✅ 批量批改完成`)

  return results
}

/**
 * 保存批改结果到数据库
 */
export async function saveGradingResults(userId, questionSetId, answers, gradingResults) {
  const savedAnswers = []

  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i]
    const result = gradingResults[i]

    try {
      const [saved] = await db
        .insert(userAnswers)
        .values({
          userId,
          questionId: answer.questionId,
          questionSetId,
          userAnswer: answer.userAnswer,
          isCorrect: result.isCorrect,
          score: result.score,
          timeSpent: answer.timeSpent || 0,
          aiFeedback: result.feedback,
          aiScore: result.score,
          createdAt: new Date()
        })
        .returning()

      savedAnswers.push(saved)
    } catch (error) {
      console.error(`保存答案失败 (questionId: ${answer.questionId}):`, error)
    }
  }

  return savedAnswers
}

/**
 * 获取内容（支持多语言）
 */
function getContent(content) {
  if (!content) return ''
  if (typeof content === 'string') return content
  return content.en || content.zh || ''
}

export default {
  gradeAnswer,
  gradeAnswerWithQuestion,
  gradeAnswersBatch,
  saveGradingResults
}
