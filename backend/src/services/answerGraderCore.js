/**
 * Pure grading helpers that do not depend on database or external AI.
 * This keeps the core scoring rules unit-testable in isolation.
 */

function getAnswerValue(userAnswer) {
  return typeof userAnswer === 'string'
    ? userAnswer
    : userAnswer?.answer || userAnswer?.value
}

export function gradeMultipleChoice(question, userAnswer) {
  const correctAnswer = question.answer?.value
  const userAnswerValue = getAnswerValue(userAnswer)
  const isCorrect = userAnswerValue?.toUpperCase() === correctAnswer?.toUpperCase()

  return {
    isCorrect,
    score: isCorrect ? 10 : 0,
    feedback: {
      correctAnswer,
      explanation: question.answer?.explanation || question.explanation,
      message: isCorrect ? 'Correct answer.' : 'Incorrect answer. Review the explanation.'
    }
  }
}

export function gradeFillBlank(question, userAnswer) {
  const correctAnswer = question.answer?.value
  const userAnswerValue = getAnswerValue(userAnswer)
  const normalizedUser = userAnswerValue?.trim().toLowerCase()
  const normalizedCorrect = correctAnswer?.trim().toLowerCase()
  const isCorrect = normalizedUser === normalizedCorrect

  return {
    isCorrect,
    score: isCorrect ? 10 : 0,
    feedback: {
      correctAnswer,
      explanation: question.answer?.explanation || question.explanation,
      message: isCorrect ? 'Correct answer.' : 'Incorrect answer. Check the expected value.'
    }
  }
}

export function normalizeMathAnswer(str) {
  if (!str && str !== 0) return ''

  return String(str)
    .trim()
    .toLowerCase()
    .replace(/\u00d7/g, '*')
    .replace(/\u00b7/g, '*')
    .replace(/\u00f7/g, '/')
    .replace(/\s+/g, '')
    .replace(/\uFF0D/g, '-')
    .replace(/^\$+|\$+$/g, '')
    .replace(/\.0+$/, '')
    .replace(/\uFF08/g, '(')
    .replace(/\uFF09/g, ')')
}

export function gradeCalculation(question, userAnswer) {
  const correctAnswer = question.answer?.value
  const userAnswerValue = typeof userAnswer === 'object'
    ? (userAnswer?.answer || userAnswer?.value)
    : userAnswer

  const normUser = normalizeMathAnswer(userAnswerValue)
  const normCorrect = normalizeMathAnswer(correctAnswer)
  let isCorrect = normUser === normCorrect

  if (!isCorrect) {
    // 用 parseFloat 提取前导数字，支持带单位答案（如 "3 cm"、"1.2 × 10^3"）
    const userStr = String(userAnswerValue).trim()
    const correctStr = String(correctAnswer).trim()
    const userNum = parseFloat(userStr)
    const correctNum = parseFloat(correctStr)

    if (!isNaN(userNum) && !isNaN(correctNum)) {

      if (correctNum !== 0) {
        const absDiff = Math.abs(userNum - correctNum)
        const relDiff = absDiff / Math.abs(correctNum)
        isCorrect = absDiff < 0.01 || relDiff < 0.01
      } else {
        isCorrect = Math.abs(userNum) < 0.01
      }
    }
  }

  return {
    isCorrect,
    score: isCorrect ? 10 : 0,
    feedback: {
      correctAnswer,
      latex: question.answer?.latex,
      explanation: question.answer?.explanation || question.explanation,
      message: isCorrect ? 'Calculation is correct.' : 'Calculation is incorrect. Review the explanation.'
    }
  }
}
