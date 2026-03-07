// ============================================================
// ContextPanel Component
// 上下文面板组件
// ============================================================

export default function ContextPanel({ session, messages }) {
  // 计算对话统计
  const stats = {
    totalMessages: messages.length,
    userMessages: messages.filter(m => m.role === 'user').length,
    aiMessages: messages.filter(m => m.role === 'assistant').length,
    totalTokens: messages.reduce((sum, m) => sum + (m.tokensUsed || 0), 0)
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>📊 学习上下文</h3>
      </div>

      <div style={styles.content}>
        {/* 会话信息 */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>会话信息</h4>
          <div style={styles.info}>
            <div style={styles.infoRow}>
              <span style={styles.label}>类型：</span>
              <span style={styles.value}>{getSessionTypeLabel(session.sessionType)}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.label}>状态：</span>
              <span style={styles.value}>{session.status === 'active' ? '活跃' : '已归档'}</span>
            </div>
            {session.chapterId && (
              <div style={styles.infoRow}>
                <span style={styles.label}>章节：</span>
                <span style={styles.value}>{session.chapterId}</span>
              </div>
            )}
          </div>
        </div>

        {/* 对话统计 */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>对话统计</h4>
          <div style={styles.stats}>
            <div style={styles.statItem}>
              <span style={styles.statValue}>{stats.totalMessages}</span>
              <span style={styles.statLabel}>总消息</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statValue}>{stats.userMessages}</span>
              <span style={styles.statLabel}>你的问题</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statValue}>{stats.aiMessages}</span>
              <span style={styles.statLabel}>AI 回复</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statValue}>{stats.totalTokens}</span>
              <span style={styles.statLabel}>Tokens</span>
            </div>
          </div>
        </div>

        {/* 学习建议 */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>💡 学习建议</h4>
          <ul style={styles.tips}>
            <li>尝试用自己的话解释概念</li>
            <li>遇到问题先思考，再看答案</li>
            <li>记录不懂的地方，多次复习</li>
            <li>定期回顾已学内容</li>
          </ul>
        </div>

        {/* 快捷操作 */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>⚡ 快捷操作</h4>
          <div style={styles.actions}>
            <button style={styles.actionBtn} onClick={() => {
              // 清空上下文提示
              window.prompt('输入提示词开始新话题')
            }}>
              🔄 新话题
            </button>
            <button style={styles.actionBtn} onClick={() => {
              // 导出对话
              const text = messages.map(m =>
                `${m.role === 'user' ? '你' : 'AI'}：${m.content}`
              ).join('\n\n')
              navigator.clipboard.writeText(text)
              alert('对话已复制到剪贴板')
            }}>
              📋 导出
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 获取会话类型标签
function getSessionTypeLabel(type) {
  const labels = {
    learning: '学习',
    practice: '练习',
    review: '复习'
  }
  return labels[type] || '学习'
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
