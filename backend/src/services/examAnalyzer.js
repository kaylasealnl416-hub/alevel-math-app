// ============================================================
// AI Exam Analyzer Service
// Provides AI-powered exam analysis and feedback
// ============================================================

import { callAI } from './aiClient.js'

/**
 * Generate overall exam analysis with AI
 * @param {Object} exam - Exam record with results
 * @param {Array} questions - Array of question objects
 * @returns {Promise<Object>} AI feedback object
 */
export async function generateExamAnalysis(exam, questions) {
  try {
    console.log(`🤖 Generating AI analysis for exam ${exam.id}...`)

    // Build analysis prompt
    const prompt = buildAnalysisPrompt(exam, questions)

    // Call AI
    const messages = [
      {
        role: 'user',
        content: prompt
      }
    ]

    // 添加 30 秒超时控制
    const response = await Promise.race([
      callAI(messages, {
        temperature: 0.7,
        max_tokens: 2000
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI 调用超时')), 30000)
      )
    ])

    // Parse AI response with fallback
    const feedback = parseAIResponse(response)

    console.log(`✅ AI analysis generated successfully`)
    return feedback

  } catch (error) {
    console.error('❌ Failed to generate AI analysis:', error)

    // 返回降级的默认反馈
    return getDefaultFeedback(exam)
  }
}

/**
 * Build analysis prompt for AI
 */
function buildAnalysisPrompt(exam, questions) {
  const percentage = exam.totalCount > 0
    ? Math.round((exam.correctCount / exam.totalCount) * 100)
    : 0

  // Collect wrong questions — 优先使用真实批改结果，回退到字符串比较
  const wrongQuestions = questions.filter(q => {
    // 如果有批改结果，使用批改结果
    if (exam.questionResults && exam.questionResults[q.id] !== undefined) {
      return !exam.questionResults[q.id].isCorrect
    }
    // 回退：字符串比较
    const userAnswer = exam.answers[q.id]
    return userAnswer?.value !== q.answer?.value
  })

  // Build difficulty breakdown
  const difficultyText = buildDifficultyBreakdown(exam.difficultyStats)

  // Build topic breakdown
  const topicText = buildTopicBreakdown(exam.topicStats)

  // Build wrong questions summary
  const wrongQuestionsText = wrongQuestions.map((q, i) => {
    const userAnswer = exam.answers[q.id]
    return `
Question ${i + 1}: ${q.content?.en || q.content}
- Topics: ${q.tags?.join(', ') || 'N/A'}
- Student's answer: ${userAnswer?.value || 'No answer'}
- Correct answer: ${q.answer?.value || 'N/A'}
- Difficulty: ${getDifficultyLabel(q.difficulty)}
`
  }).join('\n')

  return `You are an A-Level exam evaluator. Analyze this student's exam performance and provide constructive feedback.

## Exam Results

- **Score**: ${exam.totalScore || 0} / ${exam.maxScore || 0} (${percentage}%)
- **Questions Correct**: ${exam.correctCount || 0} / ${exam.totalCount || 0}
- **Time Spent**: ${formatTime(exam.timeSpent)}

## Performance by Difficulty

${difficultyText}

## Performance by Topic

${topicText}

## Wrong Questions

${wrongQuestionsText || 'All questions answered correctly!'}

## Task

Provide a comprehensive analysis in JSON format with the following structure:

{
  "overall": "Brief overall evaluation (2-3 sentences)",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": [
    {
      "topic": "Topic name",
      "reason": "Why this is weak",
      "suggestion": "How to improve"
    }
  ],
  "suggestions": [
    {
      "type": "study|practice|review",
      "priority": 1-5,
      "description": "What to do",
      "reason": "Why this helps"
    }
  ],
  "encouragement": "Motivational message (1-2 sentences)"
}

Focus on:
1. fic, actionable feedback
2. Identifying patterns in mistakes
3. Concrete improvement suggestions
4. Encouraging tone

Respond with ONLY valid JSON, no markdown or extra text.`
}

/**
 * Build difficulty breakdown text
 */
function buildDifficultyBreakdown(stats) {
  if (!stats) return 'No difficulty data available'

  const lines = []
  if (stats.easy?.total > 0) {
    const percent = Math.round((stats.easy.correct / stats.easy.total) * 100)
    lines.push(`- Easy: ${stats.easy.correct}/${stats.easy.total} (${percent}%)`)
  }
  if (stats.medium?.total > 0) {
    const percent = Math.round((stats.medium.correct / stats.medium.total) * 100)
    lines.push(`- Medium: ${stats.medium.correct}/${stats.medium.total} (${percent}%)`)
  }
  if (stats.hard?.total > 0) {
    const percent = Math.round((stats.hard.correct / stats.hard.total) * 100)
    lines.push(`- Hard: ${stats.hard.correct}/${stats.hard.total} (${percent}%)`)
  }

  return lines.length > 0 ? lines.join('\n') : 'No difficulty data'
}

/**
 * Build topic breakdown text
 */
function buildTopicBreakdown(stats) {
  if (!stats || Object.keys(stats).length === 0) {
    return 'No topic data available'
  }

  const lines = Object.entries(stats).map(([topic, data]) => {
    const percent = Math.round((data.correct / data.total) * 100)
    return `- ${topic}: ${data.correct}/${data.total} (${percent}%)`
  })

  return lines.join('\n')
}

/**
 * Get difficulty label
 */
function getDifficultyLabel(difficulty) {
  const labels = {
    1: 'Very Easy',
    2: 'Easy',
    3: 'Medium',
    4: 'Hard',
    5: 'Very Hard'
  }
  return labels[difficulty] || 'Medium'
}

/**
 * Format time in minutes:seconds
 */
function formatTime(seconds) {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Parse AI response to extract JSON
 */
function parseAIResponse(response) {
  try {
    // Try to parse as JSON directly
    const parsed = JSON.parse(response)
    return parsed
  } catch (e) {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1])
      } catch (e2) {
        console.error('Failed to parse JSON from code block:', e2)
      }
    }

    // Try to find JSON object in text
    const objectMatch = response.match(/\{[\s\S]*\}/)
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0])
      } catch (e3) {
        console.error('Failed to parse JSON from text:', e3)
      }
    }

    console.error('Could not parse AI response as JSON, using default feedback')
    throw new Error('Could not parse AI response as JSON')
  }
}

/**
 * Get default feedback when AI fails
 */
function getDefaultFeedback(exam) {
  const percentage = exam.totalCount > 0
    ? Math.round((exam.correctCount / exam.totalCount) * 100)
    : 0

  let overall = '考试已完成。'
  let encouragement = '继续努力！'

  if (percentage >= 90) {
    overall = '表现优秀！你对大部分知识点掌握得很好。'
    encouragement = '保持这个水平，你一定能取得好成绩！'
  } else if (percentage >= 70) {
    overall = '表现良好，但还有提升空间。'
    encouragement = '继续加油，重点复习错题！'
  } else if (percentage >= 60) {
    overall = '基础掌握尚可，需要加强练习。'
    encouragement = '多做练习，你会进步的！'
  } else {
    overall = '需要系统复习基础知识。'
    encouragement = '不要气馁，从基础开始，一步一步来！'
  }

  return {
    overall,
    strengths: ['完成了考试', '展现了学习态度'],
    weaknesses: [],
    suggestions: [
      {
        type: 'review',
        priority: 5,
        description: '复习错题，理解错误原因',
        reason: '从错误中学习是提高的最快方式'
      }
    ],
    encouragement
  }
}

/**
 * Generate question-specific feedback
 * @param {Object} question - Question object
 * @param {Object} userAnswer - User's answer
 * @param {boolean} isCorrect - Whether answer is correct
 * @returns {Promise<Object>} Question feedback
 */
export async function generateQuestionFeedback(question, userAnswer, isCorrect) {
  try {
    if (isCorrect) {
      return {
        feedback: 'Correct! Well done.',
        explanation: question.answer?.explanation?.en || question.answer?.explanation || '',
        tips: []
      }
    }

    const prompt = `You are an A-Level tutor. A student answered this question incorrectly.

Question: ${question.content?.en || question.content}
Correct Answer: ${question.answer?.value}
Student's Answer: ${userAnswer?.value || 'No answer'}
Topics: ${question.tags?.join(', ') || 'N/A'}

Provide brief feedback in JSON format:
{
  "feedback": "Why the answer is wrong (1 sentence)",
  "explanation": "Correct approach (2-3 sentences)",
  "tips": ["Tip 1", "Tip 2"]
}

Be encouraging and educational. Respond with ONLY valid JSON.`

    const messages = [{ role: 'user', content: prompt }]
    const response = await callAI(messages, { temperature: 0.7, max_tokens: 500 })

    return parseAIResponse(response)

  } catch (error) {
    console.error('Failed to generate question feedback:', error)
    return {
      feedback: 'Incorrect answer.',
      explanation: question.answer?.explanation?.en || question.answer?.explanation || '',
      tips: []
    }
  }
}

export default {
  generateExamAnalysis,
  generateQuestionFeedback
}
