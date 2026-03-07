// ============================================================
// useChat Hook
// AI 对话功能 Hook
// ============================================================

import { useState, useCallback, useRef } from 'react'
import { chatAPI } from '../utils/api.js'

export function useChat(userId) {
  const [sessions, setSessions] = useState([])
  const [currentSession, setCurrentSession] = useState(null)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState(null)

  const loadingRef = useRef(false)

  // 加载用户的会话列表
  const loadSessions = useCallback(async (options = {}) => {
    if (!userId || loadingRef.current) return

    loadingRef.current = true
    setIsLoading(true)
    setError(null)

    try {
      const sessionList = await chatAPI.getSessions(userId, {
        status: 'active',
        limit: options.limit || 20,
        offset: options.offset || 0,
        ...options
      })
      setSessions(sessionList)
      return sessionList
    } catch (err) {
      console.error('加载会话列表失败:', err)
      setError(err.message)
      return []
    } finally {
      setIsLoading(false)
      loadingRef.current = false
    }
  }, [userId])

  // 创建新会话
  const createSession = useCallback(async (chapterId = null, title = '新对话', sessionType = 'learning') => {
    if (!userId) {
      setError('请先登录')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const newSession = await chatAPI.createSession({
        userId,
        chapterId,
        title,
        sessionType
      })

      setSessions(prev => [newSession, ...prev])
      setCurrentSession(newSession)
      setMessages([])
      return newSession
    } catch (err) {
      console.error('创建会话失败:', err)
      setError(err.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  // 选择会话
  const selectSession = useCallback(async (sessionId) => {
    if (!sessionId || loadingRef.current) return

    loadingRef.current = true
    setIsLoading(true)
    setError(null)

    try {
      // 获取会话详情
      const session = await chatAPI.getSession(sessionId)
      setCurrentSession(session)

      // 获取消息历史
      const { messages: messageList } = await chatAPI.getMessages(sessionId, { limit: 50 })
      setMessages(messageList || [])

      return session
    } catch (err) {
      console.error('加载会话失败:', err)
      setError(err.message)
      return null
    } finally {
      setIsLoading(false)
      loadingRef.current = false
    }
  }, [])

  // 发送消息
  const sendMessage = useCallback(async (content, context = {}) => {
    if (!currentSession || !content.trim()) {
      setError('请先选择一个会话')
      return null
    }

    setIsSending(true)
    setError(null)

    // 先添加用户消息到本地
    const tempUserMessage = {
      id: Date.now(),
      role: 'user',
      content: content.trim(),
      contentType: 'text',
      createdAt: new Date().toISOString()
    }

    setMessages(prev => [...prev, tempUserMessage])

    try {
      const result = await chatAPI.sendMessage({
        sessionId: currentSession.id,
        message: content.trim(),
        context
      })

      if (result.success) {
        // 添加 AI 回复到消息列表
        setMessages(prev => [...prev, result.data.assistantMessage])

        // 更新会话信息
        setCurrentSession(prev => ({
          ...prev,
          messageCount: prev.messageCount + 2,
          lastMessageAt: new Date().toISOString()
        }))

        // 更新会话列表中的会话
        setSessions(prev => prev.map(s =>
          s.id === currentSession.id
            ? { ...s, messageCount: s.messageCount + 2, lastMessageAt: new Date().toISOString() }
            : s
        ))

        return result.data
      } else {
        throw new Error(result.error?.message || '发送消息失败')
      }
    } catch (err) {
      console.error('发送消息失败:', err)
      setError(err.message)

      // 移除临时用户消息
      setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id))

      return null
    } finally {
      setIsSending(false)
    }
  }, [currentSession])

  // 更新会话标题
  const updateSessionTitle = useCallback(async (sessionId, title) => {
    try {
      const updated = await chatAPI.updateSession(sessionId, { title })
      setSessions(prev => prev.map(s => s.id === sessionId ? updated : s))
      if (currentSession?.id === sessionId) {
        setCurrentSession(updated)
      }
      return updated
    } catch (err) {
      console.error('更新会话标题失败:', err)
      setError(err.message)
      return null
    }
  }, [currentSession])

  // 归档会话
  const archiveSession = useCallback(async (sessionId) => {
    try {
      await chatAPI.updateSession(sessionId, { status: 'archived' })
      setSessions(prev => prev.filter(s => s.id !== sessionId))

      if (currentSession?.id === sessionId) {
        setCurrentSession(null)
        setMessages([])
      }
      return true
    } catch (err) {
      console.error('归档会话失败:', err)
      setError(err.message)
      return false
    }
  }, [currentSession])

  // 删除会话
  const deleteSession = useCallback(async (sessionId) => {
    try {
      await chatAPI.deleteSession(sessionId)
      setSessions(prev => prev.filter(s => s.id !== sessionId))

      if (currentSession?.id === sessionId) {
        setCurrentSession(null)
        setMessages([])
      }
      return true
    } catch (err) {
      console.error('删除会话失败:', err)
      setError(err.message)
      return false
    }
  }, [currentSession])

  // 清除错误
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // 状态
    sessions,
    currentSession,
    messages,
    isLoading,
    isSending,
    error,

    // 方法
    loadSessions,
    createSession,
    selectSession,
    sendMessage,
    updateSessionTitle,
    archiveSession,
    deleteSession,
    clearError
  }
}

export default useChat
