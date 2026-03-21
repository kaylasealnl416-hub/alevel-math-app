// ============================================================
// AssistantMessage Component
// ============================================================

import MessageContent from './MessageContent.jsx'
import { formatClockTime } from '../utils/helpers.js'

export default function AssistantMessage({ content, timestamp, metadata }) {
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
          <span style={styles.time}>{formatClockTime(timestamp)}</span>
          {metadata?.tokensUsed && (
            <span style={styles.tokens}>
              {metadata.tokensUsed} tokens
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
    backgroundColor: '#e6f4ea',
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
    color: '#188038',
    backgroundColor: '#e6f4ea',
    padding: '2px 6px',
    borderRadius: '4px'
  }
}
