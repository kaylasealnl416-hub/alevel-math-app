// ============================================================
// MessageList Component
// 消息列表组件
// ============================================================

import UserMessage from './UserMessage.jsx'
import AssistantMessage from './AssistantMessage.jsx'

export default function MessageList({ messages, isLoading }) {
  if (isLoading && messages.length === 0) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <span>加载中...</span>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <p>还没有消息，开始对话吧！</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {messages.map((message, index) => {
        if (message.role === 'user') {
          return (
            <UserMessage
              key={message.id || index}
              content={message.content}
              timestamp={message.createdAt}
            />
          )
        } else {
          return (
            <AssistantMessage
              key={message.id || index}
              content={message.content}
              timestamp={message.createdAt}
              metadata={message.metadata}
            />
          )
        }
      })}
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '40px',
    color: '#666'
  },
  loadingSpinner: {
    width: '20px',
    height: '20px',
    border: '2px solid #e0e0e0',
    borderTopColor: '#1976d2',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  emptyContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    color: '#999'
  }
}

// 添加动画样式
const styleSheet = document.createElement('style')
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`
document.head.appendChild(styleSheet)
