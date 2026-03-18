import { Hono } from 'hono'
import { db } from '../db/index.js'
import { chatSessions, chatMessages } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import { callAI, getAIProviderInfo } from '../services/aiClient.js'
import { PROVIDERS } from '../services/providers/index.js'
import { buildSystemPrompt, buildUserPrompt, buildConversationHistory } from '../services/promptBuilder.js'
import { buildFullContext } from '../services/contextManager.js'

const app = new Hono()

// ============================================================
// 消息发送 API
// ============================================================

/**
 * POST /api/chat/messages/send
 * 发送消息并获取 AI 回复
 */
app.post('/send', async (c) => {
  try {
    const body = await c.req.json()
    const { sessionId, message, context = {}, provider, apiKey, model } = body

    // 验证必填字段
    if (!sessionId || !message) {
      return c.json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: '缺少必填字段：sessionId 和 message' }
      }, 400)
    }

    // 获取会话信息
    const session = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.id, sessionId))
      .limit(1)

    if (session.length === 0) {
      return c.json({
        success: false,
        error: { code: 'SESSION_NOT_FOUND', message: '会话不存在' }
      }, 404)
    }

    const sessionData = session[0]

    // 保存用户消息
    const userMessage = await db
      .insert(chatMessages)
      .values({
        sessionId,
        role: 'user',
        content: message,
        contentType: 'text'
      })
      .returning()

    // 获取对话历史
    const history = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(chatMessages.createdAt)
      .limit(20) // 最多保留 20 条历史

    // 构建完整上下文
    const fullContext = await buildFullContext(
      sessionData.userId,
      sessionId,
      sessionData.chapterId
    )

    // 构建 Prompts
    const systemPrompt = buildSystemPrompt({
      subject: context.subject || '数学',
      chapterTitle: fullContext.chapter?.title?.zh || fullContext.chapter?.title?.en || '',
      userLevel: fullContext.userLevel,
      weakPoints: fullContext.knowledge.weak
    })

    const userPrompt = buildUserPrompt(message, {
      chapterTitle: fullContext.chapter?.title?.zh || fullContext.chapter?.title?.en || '',
      keyPoints: fullContext.chapter?.keyPoints || [],
      masteredTopics: fullContext.knowledge.mastered,
      weakTopics: fullContext.knowledge.weak
    })

    // 构建对话历史（Claude API 格式）
    const conversationHistory = buildConversationHistory(
      history.slice(0, -1), // 排除刚刚添加的用户消息
      10
    )

    // 添加当前用户消息
    conversationHistory.push({
      role: 'user',
      content: userPrompt
    })

    // 调用 AI API（用户 key 优先，无则 fallback 到服务端默认）
    let aiResponse
    try {
      const aiOptions = { system: systemPrompt, temperature: 0.7 }

      // 用户指定了提供商和 key → 校验后使用
      if (provider && apiKey) {
        const providerConfig = PROVIDERS[provider]
        if (providerConfig) {
          aiOptions.provider = provider
          aiOptions.apiKey = apiKey
          if (model && providerConfig.models.some(m => m.id === model)) {
            aiOptions.model = model
          }
          console.log(`使用用户 AI 提供商: ${providerConfig.name}`)
        }
      } else {
        const info = getAIProviderInfo()
        console.log(`使用默认 AI 提供商: ${info.defaultProvider.name} (${info.defaultProvider.model})`)
      }

      aiResponse = await callAI(conversationHistory, aiOptions)
    } catch (apiError) {
      console.error('AI API 调用失败:', apiError)

      // 返回友好的错误消息
      return c.json({
        success: false,
        error: {
          code: 'AI_API_ERROR',
          message: 'AI 服务暂时不可用，请稍后重试',
          details: apiError.message
        }
      }, 503)
    }

    // 保存 AI 回复
    const assistantMessage = await db
      .insert(chatMessages)
      .values({
        sessionId,
        role: 'assistant',
        content: aiResponse.content,
        contentType: 'text',
        metadata: {
          model: aiResponse.model,
          thinkingProcess: '使用苏格拉底式教学法',
          difficulty: fullContext.userLevel
        },
        tokensUsed: aiResponse.usage.totalTokens
      })
      .returning()

    // 更新会话信息
    await db
      .update(chatSessions)
      .set({
        messageCount: sessionData.messageCount + 2,
        lastMessageAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(chatSessions.id, sessionId))

    return c.json({
      success: true,
      data: {
        userMessage: userMessage[0],
        assistantMessage: assistantMessage[0],
        usage: aiResponse.usage
      }
    })
  } catch (error) {
    console.error('发送消息失败:', error)
    return c.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '服务器错误', details: error.message }
    }, 500)
  }
})

export default app
