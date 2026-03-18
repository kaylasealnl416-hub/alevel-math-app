// ============================================================
// useChat Hook — AI tutor chat state management
// ============================================================

import { useState, useCallback, useRef } from 'react'
import { chatAPI } from '../utils/api.js'
import { getAISettings } from '../utils/aiProviders.js'

export function useChat(userId) {
  const [sessions, setSessions] = useState([])
  const [currentSession, setCurrentSession] = useState(null)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState(null)

  const loadingRef = useRef(false)

  // Load the user's session list
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
      console.error('Failed to load sessions:', err)
      setError(err.message)
      return []
    } finally {
      setIsLoading(false)
      loadingRef.current = false
    }
  }, [userId])

  // Create a new session
  const createSession = useCallback(async (chapterId = null, title = 'New conversation', sessionType = 'learning') => {
    if (!userId) {
      setError('Please log in first')
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
      console.error('Failed to create session:', err)
      setError(err.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  // Select a session and load its messages
  const selectSession = useCallback(async (sessionId) => {
    if (!sessionId || loadingRef.current) return

    loadingRef.current = true
    setIsLoading(true)
    setError(null)

    try {
      const session = await chatAPI.getSession(sessionId)
      setCurrentSession(session)

      const { messages: messageList } = await chatAPI.getMessages(sessionId, { limit: 50 })
      setMessages(messageList || [])

      return session
    } catch (err) {
      console.error('Failed to load session:', err)
      setError(err.message)
      return null
    } finally {
      setIsLoading(false)
      loadingRef.current = false
    }
  }, [])

  // Send a message
  const sendMessage = useCallback(async (content, context = {}) => {
    if (!currentSession || !content.trim()) {
      setError('Please select a session first')
      return null
    }

    setIsSending(true)
    setError(null)

    // Optimistically add the user message
    const tempUserMessage = {
      id: Date.now(),
      role: 'user',
      content: content.trim(),
      contentType: 'text',
      createdAt: new Date().toISOString()
    }

    setMessages(prev => [...prev, tempUserMessage])

    try {
      // 注入用户 AI 设置
      const aiSettings = getAISettings()
      const aiConfig = (aiSettings?.provider && aiSettings?.apiKey)
        ? { provider: aiSettings.provider, apiKey: aiSettings.apiKey, model: aiSettings.model }
        : {}

      const result = await chatAPI.sendMessage({
        sessionId: currentSession.id,
        message: content.trim(),
        context,
        ...aiConfig
      })

      if (result.success) {
        setMessages(prev => [...prev, result.data.assistantMessage])

        setCurrentSession(prev => ({
          ...prev,
          messageCount: prev.messageCount + 2,
          lastMessageAt: new Date().toISOString()
        }))

        setSessions(prev => prev.map(s =>
          s.id === currentSession.id
            ? { ...s, messageCount: s.messageCount + 2, lastMessageAt: new Date().toISOString() }
            : s
        ))

        return result.data
      } else {
        throw new Error(result.error?.message || 'Failed to send message')
      }
    } catch (err) {
      console.error('Failed to send message:', err)
      setError(err.message)

      // Roll back the optimistic message
      setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id))

      return null
    } finally {
      setIsSending(false)
    }
  }, [currentSession])

  // Update a session title
  const updateSessionTitle = useCallback(async (sessionId, title) => {
    try {
      const updated = await chatAPI.updateSession(sessionId, { title })
      setSessions(prev => prev.map(s => s.id === sessionId ? updated : s))
      if (currentSession?.id === sessionId) {
        setCurrentSession(updated)
      }
      return updated
    } catch (err) {
      console.error('Failed to update session title:', err)
      setError(err.message)
      return null
    }
  }, [currentSession])

  // Archive a session
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
      console.error('Failed to archive session:', err)
      setError(err.message)
      return false
    }
  }, [currentSession])

  // Delete a session
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
      console.error('Failed to delete session:', err)
      setError(err.message)
      return false
    }
  }, [currentSession])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // State
    sessions,
    currentSession,
    messages,
    isLoading,
    isSending,
    error,

    // Actions
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
