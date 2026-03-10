// ============================================================
// Topic to Chapter Mapping
// Maps knowledge topics to their corresponding chapters
// ============================================================

/**
 * Topic-Chapter mapping for Economics
 */
export const economicsTopicMap = {
  // Unit 1: Markets and Market Failure
  '机会成本': ['e1c1'],
  '生产可能性边界': ['e1c1'],
  '比较优势': ['e1c1'],
  '绝对优势': ['e1c1'],
  '供需理论': ['e1c2', 'e1c3'],
  '市场均衡': ['e1c2'],
  '价格弹性': ['e1c3'],
  '需求弹性': ['e1c3'],
  '供给弹性': ['e1c3'],
  '市场失灵': ['e1c4'],
  '外部性': ['e1c4'],
  '公共物品': ['e1c4'],

  // Unit 2: Macroeconomics
  'GDP': ['e2c1'],
  '通货膨胀': ['e2c2'],
  '失业': ['e2c3'],
  '货币政策': ['e2c4'],
  '财政政策': ['e2c4'],
}

/**
 * Topic-Chapter mapping for Mathematics
 */
export const mathematicsTopicMap = {
  // Pure Mathematics 1
  '代数': ['m1c1', 'm1c2'],
  '函数': ['m1c3'],
  '二次函数': ['m1c3'],
  '指数函数': ['m1c4'],
  '对数函数': ['m1c4'],
  '三角函数': ['m1c5'],
  '微分': ['m1c6'],
  '积分': ['m1c7'],

  // Pure Mathematics 2
  '数列': ['m2c1'],
  '级数': ['m2c1'],
  '向量': ['m2c2'],
  '复数': ['m2c3'],

  // Statistics
  '概率': ['s1c1'],
  '统计分布': ['s1c2'],
  '假设检验': ['s1c3'],

  // Mechanics
  '运动学': ['me1c1'],
  '动力学': ['me1c2'],
  '力': ['me1c2'],
}

/**
 * Get chapters for a given topic
 * @param {string} topic - Topic name
 * @param {string} subject - Subject ID ('economics' or 'mathematics')
 * @returns {string[]} Array of chapter IDs
 */
export function getChaptersForTopic(topic, subject = 'economics') {
  const map = subject === 'mathematics' ? mathematicsTopicMap : economicsTopicMap
  return map[topic] || []
}

/**
 * Get all topics for a subject
 * @param {string} subject - Subject ID
 * @returns {string[]} Array of topic names
 */
export function getAllTopics(subject = 'economics') {
  const map = subject === 'mathematics' ? mathematicsTopicMap : economicsTopicMap
  return Object.keys(map)
}

/**
 * Find topics by chapter
 * @param {string} chapterId - Chapter ID
 * @param {string} subject - Subject ID
 * @returns {string[]} Array of topic names
 */
export function getTopicsByChapter(chapterId, subject = 'economics') {
  const map = subject === 'mathematics' ? mathematicsTopicMap : economicsTopicMap
  const topics = []

  for (const [topic, chapters] of Object.entries(map)) {
    if (chapters.includes(chapterId)) {
      topics.push(topic)
    }
  }

  return topics
}

export default {
  economicsTopicMap,
  mathematicsTopicMap,
  getChaptersForTopic,
  getAllTopics,
  getTopicsByChapter
}
