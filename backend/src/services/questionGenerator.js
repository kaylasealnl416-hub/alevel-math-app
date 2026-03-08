// ============================================================
// AI 出题引擎
// 根据章节内容和配置生成高质量练习题
// ============================================================

import { callAI } from './aiClient.js'
import { db } from '../db/index.js'
import { questions, chapters } from '../db/schema.js'
import { eq } from 'drizzle-orm'

/**
 * 生成题目
 * @param {string} chapterId - 章节 ID
 * @param {Object} config - 生成配置
 * @returns {Promise<Array>} 生成的题目数组
 */
export async function generateQuestions(chapterId, config = {}) {
  const {
    count = 5,                           // 生成数量
    difficulty = [2, 3, 4],              // 难度范围
    types = ['multiple_choice', 'calculation'], // 题目类型
    tags = [],                           // 知识点标签
    language = 'zh',                     // 语言
    userId = null                        // 创建人 ID
  } = config

  console.log(`🤖 开始生成题目: 章节=${chapterId}, 数量=${count}`)

  // 1. 获取章节信息
  const chapter = await getChapterInfo(chapterId)
  if (!chapter) {
    throw new Error(`章节不存在: ${chapterId}`)
  }

  // 2. 构建生成 Prompt
  const prompt = buildGenerationPrompt(chapter, {
    count,
    difficulty,
    types,
    tags,
    language
  })

  // 3. 调用 AI 生成题目
  const messages = [
    {
      role: 'user',
      content: prompt
    }
  ]

  try {
    console.log('📝 调用 AI 生成题目...')
    const response = await callAI(messages, {
      temperature: 0.7, // 适中的创造性
      maxTokens: 4000
    })

    // 4. 解析 AI 返回的 JSON
    const generatedQuestions = parseAIResponse(response.content)
    console.log(`✅ AI 生成了 ${generatedQuestions.length} 道题目`)

    // 5. 保存到题库（draft 状态，需要审核）
    const savedQuestions = await saveGeneratedQuestions(
      generatedQuestions,
      chapterId,
      userId
    )

    console.log(`💾 已保存 ${savedQuestions.length} 道题目到题库`)

    return savedQuestions

  } catch (error) {
    console.error('❌ AI 生成题目失败:', error)
    throw new Error(`AI 生成题目失败: ${error.message}`)
  }
}

/**
 * 获取章节信息
 */
async function getChapterInfo(chapterId) {
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.id, chapterId))
    .limit(1)

  return chapter
}

/**
 * 构建生成 Prompt
 */
function buildGenerationPrompt(chapter, config) {
  const { count, difficulty, types, tags, language } = config

  // 提取章节信息
  const chapterTitle = chapter.title?.zh || chapter.title?.en || '未知章节'
  const keyPoints = chapter.keyPoints || []
  const formulas = chapter.formulas || []

  // 难度描述
  const difficultyDesc = {
    1: '基础（适合初学者）',
    2: '简单（基本概念应用）',
    3: '中等（综合应用）',
    4: '困难（深入理解）',
    5: '极难（挑战性问题）'
  }

  const difficultyText = difficulty.map(d => difficultyDesc[d] || d).join('、')

  // 题目类型描述
  const typeDesc = {
    'multiple_choice': '选择题',
    'fill_blank': '填空题',
    'calculation': '计算题',
    'proof': '证明题'
  }

  const typesText = types.map(t => typeDesc[t] || t).join('、')

  return `你是 A-Level 出题专家。请根据以下章节内容生成高质量练习题。

## 章节信息

**章节标题**：${chapterTitle}

**知识点**：
${keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

${formulas.length > 0 ? `**重要公式**：
${formulas.map((formula, i) => `${i + 1}. ${formula}`).join('\n')}` : ''}

${tags.length > 0 ? `**必须覆盖的知识点**：${tags.join('、')}` : ''}

## 生成要求

1. **数量**：生成 ${count} 道题目
2. **难度**：${difficultyText}
3. **题目类型**：${typesText}
4. **语言**：${language === 'zh' ? '中文' : '英文'}

## 质量标准

1. **符合 A-Level 考试标准**：题目难度、形式、考点都要符合 A-Level 要求
2. **有区分度**：题目要能区分不同水平的学生
3. **实际应用**：尽量结合实际场景，不要纯理论
4. **详细解析**：提供清晰的解题步骤和思路
5. **数学公式**：使用 LaTeX 格式，例如 $x^2 + y^2 = r^2$

## 输出格式

请严格按照以下 JSON 格式输出（必须是有效的 JSON）：

\`\`\`json
{
  "questions": [
    {
      "type": "multiple_choice",
      "difficulty": 3,
      "content": {
        "zh": "题目内容（中文）",
        "en": "Question content (English)"
      },
      "options": [
        "A. 选项1",
        "B. 选项2",
        "C. 选项3",
        "D. 选项4"
      ],
      "answer": {
        "value": "C",
        "latex": "$x = \\\\frac{-b \\\\pm \\\\sqrt{b^2-4ac}}{2a}$",
        "explanation": "详细解析"
      },
      "explanation": {
        "zh": "解析（中文）",
        "en": "Explanation (English)"
      },
      "tags": ["知识点1", "知识点2"],
      "estimatedTime": 180
    }
  ]
}
\`\`\`

**注意事项**：
- 选择题必须有 options 字段（4个选项）
- 填空题、计算题、证明题不需要 options 字段
- estimatedTime 是预计完成时间（秒）
- tags 必须从章节知识点中选择
- 确保 JSON 格式正确，可以被直接解析

请开始生成：`
}

/**
 * 解析 AI 返回的响应
 */
function parseAIResponse(content) {
  try {
    // 尝试多种方式提取 JSON
    let jsonString = null

    // 方式 1: 提取 ```json 代码块
    const jsonMatch = content.match(/```json\s*\n([\s\S]*?)\n```/)
    if (jsonMatch) {
      jsonString = jsonMatch[1]
    }

    // 方式 2: 提取 ``` 代码块（不带 json 标记）
    if (!jsonString) {
      const codeMatch = content.match(/```\s*\n([\s\S]*?)\n```/)
      if (codeMatch) {
        jsonString = codeMatch[1]
      }
    }

    // 方式 3: 查找 { 到 } 的完整 JSON 对象
    if (!jsonString) {
      const objectMatch = content.match(/\{[\s\S]*"questions"[\s\S]*\}/)
      if (objectMatch) {
        jsonString = objectMatch[0]
      }
    }

    // 方式 4: 直接使用原始内容
    if (!jsonString) {
      jsonString = content.trim()
    }

    // 清理可能的 BOM 和特殊字符
    jsonString = jsonString.replace(/^\uFEFF/, '').trim()

    console.log('尝试解析 JSON，长度:', jsonString.length)

    const parsed = JSON.parse(jsonString)

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid response format: missing questions array')
    }

    // 验证每道题目的格式
    parsed.questions.forEach((q, index) => {
      if (!q.type || !q.difficulty || !q.content || !q.answer) {
        throw new Error(`Question ${index + 1} is missing required fields`)
      }

      // 选择题必须有 options
      if (q.type === 'multiple_choice' && (!q.options || q.options.length < 2)) {
        throw new Error(`Question ${index + 1} is multiple_choice but missing options`)
      }
    })

    console.log(`✅ 成功解析 ${parsed.questions.length} 道题目`)
    return parsed.questions

  } catch (error) {
    console.error('❌ Failed to parse AI response:', error.message)
    console.error('Raw content (first 500 chars):', content.substring(0, 500))
    throw new Error(`Failed to parse AI response as JSON: ${error.message}`)
  }
}

/**
 * 保存生成的题目到题库
 */
async function saveGeneratedQuestions(generatedQuestions, chapterId, userId) {
  const savedQuestions = []

  for (const q of generatedQuestions) {
    try {
      const [saved] = await db
        .insert(questions)
        .values({
          chapterId,
          type: q.type,
          difficulty: q.difficulty,
          content: q.content,
          options: q.options || null,
          answer: q.answer,
          explanation: q.explanation || null,
          tags: q.tags || [],
          source: 'ai_generated',
          estimatedTime: q.estimatedTime || 300,
          status: 'draft', // 需要审核
          createdBy: userId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      savedQuestions.push(saved)
    } catch (error) {
      console.error('Failed to save question:', error)
      // 继续保存其他题目
    }
  }

  return savedQuestions
}

/**
 * 预览生成结果（不保存到数据库）
 */
export async function previewGenerateQuestions(chapterId, config = {}) {
  const {
    count = 5,
    difficulty = [2, 3, 4],
    types = ['multiple_choice', 'calculation'],
    tags = [],
    language = 'zh'
  } = config

  console.log(`👀 预览生成题目: 章节=${chapterId}, 数量=${count}`)

  // 获取章节信息
  const chapter = await getChapterInfo(chapterId)
  if (!chapter) {
    throw new Error(`章节不存在: ${chapterId}`)
  }

  // 构建 Prompt
  const prompt = buildGenerationPrompt(chapter, {
    count,
    difficulty,
    types,
    tags,
    language
  })

  // 调用 AI
  const messages = [
    {
      role: 'user',
      content: prompt
    }
  ]

  try {
    const response = await callAI(messages, {
      temperature: 0.7,
      maxTokens: 4000
    })

    // 解析结果
    const generatedQuestions = parseAIResponse(response.content)

    return {
      questions: generatedQuestions,
      count: generatedQuestions.length,
      chapterId,
      config
    }

  } catch (error) {
    console.error('❌ 预览生成失败:', error)
    throw new Error(`预览生成失败: ${error.message}`)
  }
}

export default {
  generateQuestions,
  previewGenerateQuestions
}
