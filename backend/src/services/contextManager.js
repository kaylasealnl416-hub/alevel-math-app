// ============================================================
// 上下文管理器
// 管理对话上下文、用户知识图谱
// ============================================================

import { db } from '../db/index.js'
import { chatContexts, userKnowledgeGraph, learningProgress, chapters } from '../db/schema.js'
import { eq, and, desc } from 'drizzle-orm'

/**
 * 获取会话上下文
 * @param {number} sessionId - 会话ID
 * @returns {Promise<Object>} 上下文信息
 */
export async function getSessionContext(sessionId) {
  try {
    const contexts = await db
      .select()
      .from(chatContexts)
      .where(eq(chatContexts.sessionId, sessionId))
      .orderBy(desc(chatContexts.relevanceScore))

    return contexts.map(ctx => ctx.contextData)
  } catch (error) {
    console.error('获取会话上下文失败:', error)
    return []
  }
}

/**
 * 添加会话上下文
 * @param {number} sessionId - 会话ID
 * @param {string} contextType - 上下文类型
 * @param {Object} contextData - 上下文数据
 * @param {number} relevanceScore - 相关性分数 (0.0-1.0)
 */
export async function addSessionContext(sessionId, contextType, contextData, relevanceScore = 1.0) {
  try {
    await db.insert(chatContexts).values({
      sessionId,
      contextType,
      contextData,
      relevanceScore
    })
  } catch (error) {
    console.error('添加会话上下文失败:', error)
  }
}

/**
 * 获取用户知识图谱
 * @param {number} userId - 用户ID
 * @param {Array} knowledgePointIds - 知识点ID列表（可选）
 * @returns {Promise<Object>} 知识图谱数据
 */
export async function getUserKnowledgeGraph(userId, knowledgePointIds = null) {
  try {
    let query = db
      .select()
      .from(userKnowledgeGraph)
      .where(eq(userKnowledgeGraph.userId, userId))

    const results = await query

    // 分类知识点
    const mastered = []
    const weak = []

    results.forEach(kp => {
      if (kp.masteryLevel >= 80) {
        mastered.push(kp.knowledgePointId)
      } else if (kp.masteryLevel < 50) {
        weak.push(kp.knowledgePointId)
      }
    })

    return {
      mastered,
      weak,
      all: results
    }
  } catch (error) {
    console.error('获取用户知识图谱失败:', error)
    return { mastered: [], weak: [], all: [] }
  }
}

/**
 * 更新知识点掌握度
 * @param {number} userId - 用户ID
 * @param {string} knowledgePointId - 知识点ID
 * @param {boolean} isCorrect - 是否答对
 */
export async function updateKnowledgePoint(userId, knowledgePointId, isCorrect) {
  try {
    // 查找现有记录
    const existing = await db
      .select()
      .from(userKnowledgeGraph)
      .where(
        and(
          eq(userKnowledgeGraph.userId, userId),
          eq(userKnowledgeGraph.knowledgePointId, knowledgePointId)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      // 更新现有记录
      const current = existing[0]
      const newPracticeCount = current.practiceCount + 1
      const newCorrectCount = current.correctCount + (isCorrect ? 1 : 0)
      const newMasteryLevel = Math.round((newCorrectCount / newPracticeCount) * 100)

      await db
        .update(userKnowledgeGraph)
        .set({
          practiceCount: newPracticeCount,
          correctCount: newCorrectCount,
          masteryLevel: newMasteryLevel,
          lastPracticedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(userKnowledgeGraph.id, current.id))
    } else {
      // 创建新记录
      await db.insert(userKnowledgeGraph).values({
        userId,
        knowledgePointId,
        practiceCount: 1,
        correctCount: isCorrect ? 1 : 0,
        masteryLevel: isCorrect ? 100 : 0,
        lastPracticedAt: new Date()
      })
    }
  } catch (error) {
    console.error('更新知识点掌握度失败:', error)
  }
}

/**
 * 获取章节信息
 * @param {string} chapterId - 章节ID
 * @returns {Promise<Object>} 章节信息
 */
export async function getChapterInfo(chapterId) {
  try {
    const chapter = await db
      .select()
      .from(chapters)
      .where(eq(chapters.id, chapterId))
      .limit(1)

    if (chapter.length === 0) {
      return null
    }

    return {
      id: chapter[0].id,
      title: chapter[0].title,
      keyPoints: chapter[0].keyPoints || [],
      overview: chapter[0].overview
    }
  } catch (error) {
    console.error('获取章节信息失败:', error)
    return null
  }
}

/**
 * 获取用户学习进度
 * @param {number} userId - 用户ID
 * @param {string} chapterId - 章节ID（可选）
 * @returns {Promise<Object>} 学习进度信息
 */
export async function getUserProgress(userId, chapterId = null) {
  try {
    let query = db
      .select()
      .from(learningProgress)
      .where(eq(learningProgress.userId, userId))

    if (chapterId) {
      query = query.where(eq(learningProgress.chapterId, chapterId))
    }

    const progress = await query

    return progress
  } catch (error) {
    console.error('获取用户学习进度失败:', error)
    return []
  }
}

/**
 * 构建完整的对话上下文
 * @param {number} userId - 用户ID
 * @param {number} sessionId - 会话ID
 * @param {string} chapterId - 章节ID（可选）
 * @returns {Promise<Object>} 完整的上下文信息
 */
export async function buildFullContext(userId, sessionId, chapterId = null) {
  try {
    // 并行获取所有上下文信息
    const [
      sessionContext,
      knowledgeGraph,
      chapterInfo,
      userProgress
    ] = await Promise.all([
      getSessionContext(sessionId),
      getUserKnowledgeGraph(userId),
      chapterId ? getChapterInfo(chapterId) : Promise.resolve(null),
      getUserProgress(userId, chapterId)
    ])

    return {
      session: sessionContext,
      knowledge: knowledgeGraph,
      chapter: chapterInfo,
      progress: userProgress,
      userLevel: determineUserLevel(knowledgeGraph, userProgress)
    }
  } catch (error) {
    console.error('构建完整上下文失败:', error)
    return {
      session: [],
      knowledge: { mastered: [], weak: [], all: [] },
      chapter: null,
      progress: [],
      userLevel: 'intermediate'
    }
  }
}

/**
 * 判断用户水平
 * @param {Object} knowledgeGraph - 知识图谱
 * @param {Array} progress - 学习进度
 * @returns {string} 用户水平
 */
function determineUserLevel(knowledgeGraph, progress) {
  const totalKnowledge = knowledgeGraph.all.length
  const masteredCount = knowledgeGraph.mastered.length

  if (totalKnowledge === 0) {
    return 'beginner'
  }

  const masteryRate = masteredCount / totalKnowledge

  if (masteryRate >= 0.8) return 'expert'
  if (masteryRate >= 0.6) return 'advanced'
  if (masteryRate >= 0.3) return 'intermediate'
  return 'beginner'
}

export default {
  getSessionContext,
  addSessionContext,
  getUserKnowledgeGraph,
  updateKnowledgePoint,
  getChapterInfo,
  getUserProgress,
  buildFullContext
}
