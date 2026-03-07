// ============================================================
// AssistantMessage Component
// AI 教师消息组件
// ============================================================

import MessageContent from './MessageContent.jsx'

export default function AssistantMessage({ content, timestamp, metadata }) {
  const formatTime = (ts) => {
    if (!ts) return ''
    const date = new Date(ts)
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={styles.container}>
      <div style={styles.avatar}>
        <span style={styles.avatarText}>🤖</span>
      </div>
      <div style={styles.content}>
        <div style={styles.bubble}>
          <MessageContent content={content} />
        </div>
        <div style={styles.meta}>
          <span style={styles.time}>{formatTime(timestamp)}</span>
          {metadata?.tokensUsed && (
            <span style={styles.tokens}>
              消耗 {metadata.tokensUsed} tokens
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#e8f5e9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  avatarText: {
    fontSize: '18px'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: '70%'
  },
  bubble: {
    padding: '12px 16px',
    backgroundColor: '#fff',
    color: '#333',
    borderRadius: '16px 16px 16px 4px',
    border: '1px solid #e0e0e0',
    wordBreak: 'break-word',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  text: {
    margin: 0,
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap'
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '4px'
  },
  time: {
    fontSize: '12px',
    color: '#999'
  },
  tokens: {
    fontSize: '12px',
    color: '#4caf50',
    backgroundColor: '#e8f5e9',
    padding: '2px 6px',
    borderRadius: '4px'
  }
}
