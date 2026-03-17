// ============================================================
// ContextPanel Component
// Displays session context, stats, tips, and quick actions
// ============================================================

export default function ContextPanel({ session, messages }) {
  const stats = {
    totalMessages: messages.length,
    userMessages: messages.filter(m => m.role === 'user').length,
    aiMessages: messages.filter(m => m.role === 'assistant').length,
    totalTokens: messages.reduce((sum, m) => sum + (m.tokensUsed || 0), 0)
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>📊 Learning Context</h3>
      </div>

      <div style={styles.content}>
        {/* Session info */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Session Info</h4>
          <div style={styles.info}>
            <div style={styles.infoRow}>
              <span style={styles.label}>Type:</span>
              <span style={styles.value}>{getSessionTypeLabel(session.sessionType)}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.label}>Status:</span>
              <span style={styles.value}>{session.status === 'active' ? 'Active' : 'Archived'}</span>
            </div>
            {session.chapterId && (
              <div style={styles.infoRow}>
                <span style={styles.label}>Chapter:</span>
                <span style={styles.value}>{session.chapterId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Conversation stats */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Stats</h4>
          <div style={styles.stats}>
            <div style={styles.statItem}>
              <span style={styles.statValue}>{stats.totalMessages}</span>
              <span style={styles.statLabel}>Messages</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statValue}>{stats.userMessages}</span>
              <span style={styles.statLabel}>Your questions</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statValue}>{stats.aiMessages}</span>
              <span style={styles.statLabel}>AI replies</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statValue}>{stats.totalTokens}</span>
              <span style={styles.statLabel}>Tokens</span>
            </div>
          </div>
        </div>

        {/* Study tips */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>💡 Study Tips</h4>
          <ul style={styles.tips}>
            <li>Try explaining concepts in your own words</li>
            <li>Think before checking the answer</li>
            <li>Note anything unclear and revisit it</li>
            <li>Review previous topics regularly</li>
          </ul>
        </div>

        {/* Quick actions */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>⚡ Quick Actions</h4>
          <div style={styles.actions}>
            <button style={styles.actionBtn} onClick={() => {
              window.prompt('Enter a prompt to start a new topic')
            }}>
              🔄 New Topic
            </button>
            <button style={styles.actionBtn} onClick={() => {
              const text = messages.map(m =>
                `${m.role === 'user' ? 'You' : 'AI'}: ${m.content}`
              ).join('\n\n')
              navigator.clipboard.writeText(text)
              alert('Conversation copied to clipboard')
            }}>
              📋 Export
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function getSessionTypeLabel(type) {
  const labels = {
    learning: 'Learning',
    practice: 'Practice',
    review: 'Review'
  }
  return labels[type] || 'Learning'
}

const styles = {
  container: {
    width: '260px',
    backgroundColor: '#fff',
    borderLeft: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0
  },
  header: {
    padding: '16px',
    borderBottom: '1px solid #e0e0e0'
  },
  title: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    color: '#333'
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px'
  },
  section: {
    marginBottom: '20px'
  },
  sectionTitle: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: 600,
    color: '#333'
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px'
  },
  label: {
    color: '#666'
  },
  value: {
    color: '#333',
    fontWeight: 500
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px'
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#1976d2'
  },
  statLabel: {
    fontSize: '12px',
    color: '#666',
    marginTop: '4px'
  },
  tips: {
    margin: 0,
    paddingLeft: '20px',
    fontSize: '13px',
    color: '#666',
    lineHeight: 1.8
  },
  actions: {
    display: 'flex',
    gap: '8px'
  },
  actionBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
}
