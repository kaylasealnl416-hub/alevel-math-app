// ============================================================
// ChatPage Component
// AI 教师对话页面
// ============================================================

import { useState, useEffect, useRef } from 'react'
import { useChat } from '../hooks/useChat.js'
import MessageList from './MessageList.jsx'
import InputBox from './InputBox.jsx'
import SessionSidebar from './SessionSidebar.jsx'
import ContextPanel from './ContextPanel.jsx'

// 默认用户ID（测试用）
const DEFAULT_USER_ID = 1

export default function ChatPage() {
  const [userId] = useState(() => {
    // 从 localStorage 获取用户ID，或者使用默认值
    return parseInt(localStorage.getItem('currentUserId')) || DEFAULT_USER_ID
  })

  const [showSidebar, setShowSidebar] = useState(true)
  const [showContextPanel, setShowContextPanel] = useState(true)

  const {
    sessions,
    currentSession,
    messages,
    isLoading,
    isSending,
    error,
    loadSessions,
    createSession,
    selectSession,
    sendMessage,
    updateSessionTitle,
    archiveSession,
    deleteSession,
    clearError
  } = useChat(userId)

  const messagesEndRef = useRef(null)

  // 加载会话列表
  useEffect(() => {
    if (userId) {
      loadSessions()
    }
  }, [userId, loadSessions])

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 处理发送消息
  const handleSendMessage = async (content) => {
    // 如果没有当前会话，先创建一个
    if (!currentSession) {
      const newSession = await createSession(null, '新对话', 'learning')
      if (!newSession) return
    }

    await sendMessage(content)
  }

  // 处理选择会话
  const handleSelectSession = (sessionId) => {
    selectSession(sessionId)
  }

  // 处理创建新会话
  const handleNewSession = () => {
    createSession(null, '新对话', 'learning')
  }

  // 处理归档会话
  const handleArchive = (sessionId) => {
    archiveSession(sessionId)
  }

  // 处理删除会话
  const handleDelete = (sessionId) => {
    deleteSession(sessionId)
  }

  // 处理更新标题
  const handleUpdateTitle = (sessionId, title) => {
    updateSessionTitle(sessionId, title)
  }

  return (
    <div style={styles.container}>
      {/* 侧边栏 */}
      <SessionSidebar
        sessions={sessions}
        currentSessionId={currentSession?.id}
        isLoading={isLoading}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onUpdateTitle={handleUpdateTitle}
        show={showSidebar}
        onToggle={() => setShowSidebar(!showSidebar)}
      />

      {/* 主聊天区域 */}
      <div style={styles.main}>
        {/* 头部 */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <button
              style={styles.toggleBtn}
              onClick={() => setShowSidebar(!showSidebar)}
              title={showSidebar ? '隐藏会话列表' : '显示会话列表'}
            >
              {showSidebar ? '◀' : '▶'}
            </button>
            <h2 style={styles.title}>
              {currentSession?.title || 'AI 教师'}
            </h2>
            {currentSession?.chapterId && (
              <span style={styles.chapterTag}>
                章节: {currentSession.chapterId}
              </span>
            )}
          </div>
          <div style={styles.headerRight}>
            <button
              style={styles.contextToggleBtn}
              onClick={() => setShowContextPanel(!showContextPanel)}
              title={showContextPanel ? '隐藏上下文' : '显示上下文'}
            >
              {showContextPanel ? '📊' : '📈'}
            </button>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div style={styles.errorBanner}>
            <span>{error}</span>
            <button style={styles.errorCloseBtn} onClick={clearError}>✕</button>
          </div>
        )}

        {/* 消息列表 */}
        <div style={styles.messageArea}>
          {!currentSession ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>💬</div>
              <h3>欢迎使用 AI 教师</h3>
              <p>选择一个会话或创建新对话开始学习</p>
              <button style={styles.newChatBtn} onClick={handleNewSession}>
                开始新对话
              </button>
            </div>
          ) : (
            <>
              <MessageList
                messages={messages}
                isLoading={isLoading}
              />
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* 输入框 */}
        <InputBox
          onSend={handleSendMessage}
          disabled={isSending || !currentSession}
          isSending={isSending}
        />
      </div>

      {/* 上下文面板 */}
      {showContextPanel && currentSession && (
        <ContextPanel
          session={currentSession}
          messages={messages}
        />
      )}
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e0e0e0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  toggleBtn: {
    padding: '8px 12px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#666',
    borderRadius: '4px'
  },
  contextToggleBtn: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    borderRadius: '4px'
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 600,
    color: '#333'
  },
  chapterTag: {
    padding: '4px 8px',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    borderRadius: '4px',
    fontSize: '12px'
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    fontSize: '14px'
  },
  errorCloseBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#c62828',
    fontSize: '16px'
  },
  messageArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#666',
    textAlign: 'center'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  newChatBtn: {
    marginTop: '20px',
    padding: '12px 24px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer'
  }
}
