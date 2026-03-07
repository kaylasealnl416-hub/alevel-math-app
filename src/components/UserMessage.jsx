// ============================================================
// UserMessage Component
// 用户消息组件
// ============================================================

export default function UserMessage({ content, timestamp }) {
  const formatTime = (ts) => {
    if (!ts) return ''
    const date = new Date(ts)
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={styles.container}>
      <div style={styles.avatar}>
        <span style={styles.avatarText}>👤</span>
      </div>
      <div style={styles.content}>
        <div style={styles.bubble}>
          <p style={styles.text}>{content}</p>
        </div>
        <span style={styles.time}>{formatTime(timestamp)}</span>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    alignItems: 'flex-start'
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#e3f2fd',
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
    alignItems: 'flex-end',
    maxWidth: '70%'
  },
  bubble: {
    padding: '12px 16px',
    backgroundColor: '#1976d2',
    color: '#fff',
    borderRadius: '16px 16px 4px 16px',
    wordBreak: 'break-word'
  },
  text: {
    margin: 0,
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap'
  },
  time: {
    fontSize: '12px',
    color: '#999',
    marginTop: '4px'
  }
}
