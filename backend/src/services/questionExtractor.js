import { callGLMAPI } from './glmClient.js'

/**
 * 使用 AI 从文本中提取题目
 */
export async function extractQuestions(text, options = {}) {
  const prompt = `你是一个专业的题目提取助手。请从以下文本中提取所有题目，并按照 JSON 格式返回。

要求：
1. 识别题目类型（multiple_choice: 选择题, fill_in_blank: 填空题, short_answer: 简答题）
2. 提取题目内容、选项（如果有）、答案、解释（如果有）
3. 识别数学公式并转换为 LaTeX 格式（用 $ 包裹，例如：$x^2 + 5 = 13$）
4. 标注难度（1-5，1最简单，5最难）
5. 提取知识点标签（例如：algebra, calculus, economics 等）
6. 为每个题目评估置信度（0-1，表示识别的准确性）

注意：
- 如果文本中没有明确的题目，返回空数组
- 如果题目格式不清晰，将 needsReview 设为 true
- 保持题目的原始语言（中文或英文）
- 选项必须包含选项标识（A. B. C. D. 或 1. 2. 3. 4.）

文本内容：
${text}

请返回 JSON 格式（必须是有效的 JSON）：
{
  "questions": [
    {
      "type": "multiple_choice",
      "content": {
        "en": "Question text in English (keep original language)",
        "zh": "题目中文内容（如果是中文题目）",
        "latex": "LaTeX 公式（如果有，例如：$2x + 5 = 13$）"
      },
      "options": ["A. 选项1", "B. 选项2", "C. 选项3", "D. 选项4"],
      "answer": {
        "value": "B",
        "explanation": "答案解释（如果有）"
      },
      "difficulty": 2,
      "tags": ["algebra", "linear_equations"],
      "confidence": 0.95,
      "needsReview": false
    }
  ]
}`

  try {
    console.log('🤖 调用 AI 提取题目...')

    const response = await callGLMAPI([
      { role: 'user', content: prompt }
    ], {
      temperature: 0.1,
      model: 'glm-4-plus'
    })

    let content = response.content
    console.log('📝 AI 响应:', content.substring(0, 200) + '...')

    // Strip markdown code blocks if present (```json ... ```)
    content = content.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim()

    const result = JSON.parse(content)

    if (!result.questions || !Array.isArray(result.questions)) {
      console.warn('⚠️  AI 返回格式不正确，返回空数组')
      return []
    }

    // 标准化 content 结构：将 content.text 映射到 content.en（兼容 AI 返回旧格式）
    const normalized = result.questions.map(q => {
      if (q.content?.text && !q.content?.en) {
        q.content.en = q.content.text
        delete q.content.text
      }
      // 标准化题型名：fill_in_blank → fill_blank
      if (q.type === 'fill_in_blank') {
        q.type = 'fill_blank'
      }
      return q
    })

    console.log(`✅ 成功提取 ${normalized.length} 个题目`)

    return normalized
  } catch (error) {
    console.error('❌ AI 提取题目失败:', error)
    throw new Error(`AI 提取题目失败: ${error.message}`)
  }
}

/**
 * 分批提取题目（处理大文档）
 */
export async function extractQuestionsFromChunks(chunks, onProgress) {
  const allQuestions = []
  const total = chunks.length

  for (let i = 0; i < chunks.length; i++) {
    console.log(`📄 处理第 ${i + 1}/${total} 块文本...`)

    try {
      const questions = await extractQuestions(chunks[i])
      allQuestions.push(...questions)

      // 报告进度
      if (onProgress) {
        onProgress({
          current: i + 1,
          total,
          extractedQuestions: allQuestions.length
        })
      }

      // 避免 API 速率限制（每次请求间隔 1 秒）
      if (i < chunks.length - 1) {
        await delay(1000)
      }
    } catch (error) {
      console.error(`❌ 处理第 ${i + 1} 块文本失败:`, error)
      // 继续处理下一块
    }
  }

  return allQuestions
}

/**
 * 延迟函数
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 验证题目格式
 */
export function validateQuestion(question) {
  const errors = []

  // 必填字段
  if (!question.type) {
    errors.push('缺少题目类型')
  }

  if (!question.content || !question.content.text) {
    errors.push('缺少题目内容')
  }

  if (!question.answer || !question.answer.value) {
    errors.push('缺少答案')
  }

  // 选择题必须有选项
  if (question.type === 'multiple_choice' && (!question.options || question.options.length < 2)) {
    errors.push('选择题必须有至少 2 个选项')
  }

  // 难度范围
  if (question.difficulty && (question.difficulty < 1 || question.difficulty > 5)) {
    errors.push('难度必须在 1-5 之间')
  }

  // 置信度范围
  if (question.confidence && (question.confidence < 0 || question.confidence > 1)) {
    errors.push('置信度必须在 0-1 之间')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
