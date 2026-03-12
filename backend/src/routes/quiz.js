// ============================================================
// Quiz API Routes
// Handles AI-generated quiz questions
// ============================================================

import { Hono } from 'hono'
import { callAI } from '../services/aiClient.js'

const quiz = new Hono()

/**
 * Generate quiz questions
 * POST /api/quiz/generate
 */
quiz.post('/generate', async (c) => {
  try {
    const body = await c.req.json()
    const {
      subject = 'mathematics',
      book = 'P1',
      chapterTitle = 'General A-Level Mathematics',
      keyPoints = '',
      formulas = '',
      difficulty = 'medium',
      count = 5
    } = body

    // Validate input
    if (!chapterTitle) {
      return c.json({
        success: false,
        error: { message: 'Chapter title is required' }
      }, 400)
    }

    // Build system prompt based on subject
    const systemPrompts = {
      mathematics: `You are an expert A-Level Mathematics teacher creating exam questions for Pearson Edexcel International A-Level (IAL). The course covers Pure Mathematics (P1–P4, papers WMA11–WMA14), Statistics 1 (S1, WST01), and Mechanics 1 (M1, WME01).
Generate questions exactly as a real Pearson Edexcel exam would. Always respond in valid JSON only — no markdown, no prose.
Write all content in English.`,

      economics: `You are an expert A-Level Economics teacher creating exam questions for Pearson Edexcel International A-Level (IAL) Economics. The course covers Unit 1: Markets in action, Unit 2: Macroeconomic performance and policy, Unit 3: Business behaviour, and Unit 4: Developments in the global economy.
Generate questions exactly as a real Pearson Edexcel exam would. Always respond in valid JSON only — no markdown, no prose.
Write all content in English.`,

      history: `You are an expert A-Level History teacher creating exam questions for Pearson Edexcel International A-Level (IAL) History. The course covers modern international history, the USA 1918-1968, and the British Empire.
Generate questions exactly as a real Pearson Edexcel exam would. Always respond in valid JSON only — no markdown, no prose.
Write all content in English.`,

      politics: `You are an expert A-Level Politics teacher creating exam questions for Pearson Edexcel International A-Level (IAL) Politics. The course covers UK Politics, UK Government, US Comparative Politics, and Global Politics.
Generate questions exactly as a real Pearson Edexcel exam would. Always respond in valid JSON only — no markdown, no prose.
Write all content in English.`,

      psychology: `You are an expert A-Level Psychology teacher creating exam questions for Pearson Edexcel International A-Level (IAL) Psychology. The course covers social psychology, cognitive psychology, biological psychology, developmental psychology, and research methods.
Generate questions exactly as a real Pearson Edexcel exam would. Always respond in valid JSON only — no markdown, no prose.
Write all content in English.`,

      further_math: `You are an expert A-Level Further Mathematics teacher creating exam questions for Pearson Edexcel International A-Level (IAL) Further Mathematics. The course covers Further Pure (FP1-FP3), Further Mechanics (FM1-FM2), and Further Statistics (FS1-FS2).
Generate questions exactly as a real Pearson Edexcel exam would. Always respond in valid JSON only — no markdown, no prose.
Write all content in English.`
    }

    const subjectDescriptions = {
      mathematics: 'This is a Mathematics question covering mathematical concepts, formulas, and problem-solving.',
      economics: 'This is an Economics question covering economic concepts, theories, and analysis.',
      history: 'This is a History question covering historical events, analysis, and interpretation.',
      politics: 'This is a Politics question covering political concepts, theories, and analysis.',
      psychology: 'This is a Psychology question covering psychological theories, research, and analysis.',
      further_math: 'This is a Further Mathematics question covering advanced mathematical concepts, formulas, and problem-solving.'
    }

    const subjectTypes = {
      mathematics: { name: 'Mathematics', adj: 'mathematical' },
      economics: { name: 'Economics', adj: 'economic' },
      history: { name: 'History', adj: 'historical' },
      politics: { name: 'Politics', adj: 'political' },
      psychology: { name: 'Psychology', adj: 'psychological' },
      further_math: { name: 'Further Mathematics', adj: 'mathematical' }
    }

    const systemPrompt = systemPrompts[subject] || systemPrompts.mathematics
    const subjectDesc = subjectDescriptions[subject] || subjectDescriptions.mathematics
    const subjectType = subjectTypes[subject] || subjectTypes.mathematics

    // Build user prompt
    const userPrompt = `Generate ${count} ${difficulty === "hard" ? "challenging A-level exam-style" : "medium difficulty A-level"} questions for the topic: "${chapterTitle}" (${book}).
${subjectDesc}

${keyPoints ? `Key concepts to cover: ${keyPoints}` : ''}
${formulas ? `Key formulas: ${formulas}` : ''}

For each question provide ALL of the following fields:
- question: A clear, specific ${subjectType.adj} question
- options: 4 multiple choice options (A, B, C, D), only one correct
- correct: the correct answer letter
- solution: A concise worked solution (1-2 lines)
- concept: The specific exam skill or concept being tested
- deepExplanation: A thorough 3-5 sentence explanation of WHY the correct answer is right, walking through the ${subjectType.adj} reasoning step by step as a tutor would explain to a student
- keyFormula: The most important formula or concept needed to solve this question (write it clearly)
- commonMistake: The most common mistake students make on this type of question and how to avoid it
- whyOthersWrong: Briefly explain why each wrong option is a common trap or misconception

Return ONLY a JSON array, no markdown:
[
  {
    "id": "q1",
    "question": "...",
    "options": {"A": "...", "B": "...", "C": "...", "D": "..."},
    "correct": "A",
    "solution": "...",
    "concept": "...",
    "deepExplanation": "...",
    "keyFormula": "...",
    "commonMistake": "...",
    "whyOthersWrong": {"B": "...", "C": "...", "D": "..."}
  }
]`

    // Call AI API
    const messages = [
      { role: 'user', content: userPrompt }
    ]

    const response = await callAI(messages, {
      system: systemPrompt,
      maxTokens: 2000
    })

    // Parse AI response
    const rawText = response.content
    let questions

    try {
      // Try to extract JSON from response
      const startIndex = rawText.indexOf('[')
      const endIndex = rawText.lastIndexOf(']')

      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        const jsonString = rawText.substring(startIndex, endIndex + 1)
        questions = JSON.parse(jsonString)
      } else {
        // Try direct parse
        questions = JSON.parse(rawText.replace(/```json|```/gi, "").trim())
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', rawText)
      return c.json({
        success: false,
        error: {
          message: 'Failed to parse AI response',
          details: parseError.message
        }
      }, 500)
    }

    // Return questions
    return c.json({
      success: true,
      data: {
        questions,
        metadata: {
          subject,
          book,
          chapterTitle,
          difficulty,
          count: questions.length,
          usage: response.usage
        }
      }
    })

  } catch (error) {
    console.error('Quiz generation error:', error)

    // Handle specific errors
    if (error.message.includes('API_KEY')) {
      return c.json({
        success: false,
        error: {
          message: 'AI API key not configured. Please contact administrator.',
          code: 'API_KEY_MISSING'
        }
      }, 500)
    }

    return c.json({
      success: false,
      error: {
        message: error.message || 'Failed to generate quiz questions',
        code: 'GENERATION_FAILED'
      }
    }, 500)
  }
})

export default quiz
