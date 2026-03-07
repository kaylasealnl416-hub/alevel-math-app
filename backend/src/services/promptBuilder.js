// ============================================================
// Prompt 构建器
// 用于构建 AI 教师的 System 和 User Prompts
// ============================================================

/**
 * 构建 System Prompt
 * @param {Object} context - 上下文信息
 * @returns {string} System Prompt
 */
export function buildSystemPrompt(context = {}) {
  const {
    subject = '数学',
    chapterTitle = '',
    userLevel = 'intermediate',
    weakPoints = []
  } = context

  return `你是一位经验丰富的 A-Level ${subject}教师，擅长使用苏格拉底式教学法。

## 教学原则

1. **引导式提问**：不要直接给出答案，而是通过问题引导学生思考
2. **循序渐进**：根据学生的回答，逐步深入，调整解释的难度
3. **鼓励思考**：鼓励学生独立思考，培养解题能力
4. **具体例子**：使用具体例子帮助理解抽象概念
5. **正面反馈**：对学生的正确思路给予肯定和鼓励

## 当前教学上下文

${chapterTitle ? `- 当前章节：${chapterTitle}` : ''}
- 学生水平：${getLevelDescription(userLevel)}
${weakPoints.length > 0 ? `- 学生薄弱点：${weakPoints.join('、')}` : ''}

## 回答风格

- 使用清晰、简洁的语言
- 适当使用 LaTeX 格式表示数学公式（用 $ 包裹）
- 每次只问 1-2 个问题，不要一次问太多
- 根据学生的理解程度调整解释的深度

## 重要提醒

- 永远不要直接给出完整答案
- 如果学生卡住了，给予适当的提示，但不要直接告诉答案
- 如果学生答对了，给予肯定，然后引导到下一步
- 如果学生答错了，不要直接指出错误，而是引导他们自己发现

现在，请开始你的教学。`
}

/**
 * 构建 User Prompt
 * @param {string} userMessage - 用户消息
 * @param {Object} context - 上下文信息
 * @returns {string} User Prompt
 */
export function buildUserPrompt(userMessage, context = {}) {
  const {
    chapterTitle = '',
    keyPoints = [],
    masteredTopics = [],
    weakTopics = [],
    recentMistakes = []
  } = context

  let prompt = `学生问题：${userMessage}\n`

  if (chapterTitle) {
    prompt += `\n当前学习内容：\n- 章节：${chapterTitle}\n`
  }

  if (keyPoints.length > 0) {
    prompt += `- 关键知识点：${keyPoints.join('、')}\n`
  }

  if (masteredTopics.length > 0) {
    prompt += `\n学生已掌握：${masteredTopics.join('、')}\n`
  }

  if (weakTopics.length > 0) {
    prompt += `学生薄弱点：${weakTopics.join('、')}\n`
  }

  if (recentMistakes.length > 0) {
    prompt += `\n最近错题类型：${recentMistakes.join('、')}\n`
  }

  prompt += `\n请根据以上信息，用苏格拉底式提问法回答学生的问题。记住：引导而不是直接告诉答案。`

  return prompt
}

/**
 * 构建对话历史
 * @param {Array} messages - 消息数组
 * @param {number} maxMessages - 最多保留的消息数
 * @returns {Array} 格式化的消息数组
 */
export function buildConversationHistory(messages, maxMessages = 10) {
  // 只保留最近的 N 条消息
  const recentMessages = messages.slice(-maxMessages)

  // 转换为 Claude API 格式
  return recentMessages.map(msg => ({
    role: msg.role === 'assistant' ? 'assistant' : 'user',
    content: msg.content
  }))
}

/**
 * 压缩对话历史（总结早期对话）
 * @param {Array} messages - 消息数组
 * @returns {string} 压缩后的历史摘要
 */
export function compressConversationHistory(messages) {
  if (messages.length <= 10) {
    return ''
  }

  // 简单实现：只保留关键信息
  const summary = messages.slice(0, -10).map(msg => {
    if (msg.role === 'user') {
      return `学生问：${msg.content.substring(0, 50)}...`
    } else {
      return `教师答：${msg.content.substring(0, 50)}...`
    }
  }).join('\n')

  return `\n## 早期对话摘要\n${summary}\n`
}

/**
 * 获取学生水平描述
 * @param {string} level - 水平等级
 * @returns {string} 描述文本
 */
function getLevelDescription(level) {
  const descriptions = {
    beginner: '初学者（刚开始学习该主题）',
    intermediate: '中级（有一定基础，需要巩固）',
    advanced: '高级（掌握较好，需要深入理解）',
    expert: '专家级（完全掌握，可以挑战难题）'
  }
  return descriptions[level] || descriptions.intermediate
}

/**
 * 解析 AI 响应中的元数据
 * @param {string} response - AI 响应内容
 * @returns {Object} 解析后的数据
 */
export function parseAIResponse(response) {
  // 提取可能的元数据（如果 AI 在响应中包含）
  const metadata = {
    difficulty: 'intermediate',
    relatedTopics: [],
    thinkingProcess: ''
  }

  // 简单实现：未来可以让 AI 返回结构化数据
  return {
    content: response,
    metadata
  }
}

export default {
  buildSystemPrompt,
  buildUserPrompt,
  buildConversationHistory,
  compressConversationHistory,
  parseAIResponse
}
