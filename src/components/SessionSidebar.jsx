// ============================================================
// SessionSidebar Component
// 会话列表侧边栏
// ============================================================

import { useState } from 'react'

export default function SessionSidebar({
  sessions,
  currentSessionId,
  isLoading,
  onSelectSession,
  onNewSession,
  onArchive,
  onDelete,
  onUpdateTitle,
  show,
  onToggle
}) {
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [menuOpenId, setMenuOpenId] = useState(null)

  // Format time
  const formatTime = (ts) => {
    if (!ts) return ''
    const date = new Date(ts)
    const now = new Date()
    const diff = now - date

    // Less than 1 minute
    if (diff < 60000) return 'Just now'
    // Less than 1 hour
    if (diff < 3600000) return Math.floor(diff / 60000) + ' min ago'
    // Less than 24 hours
    if (diff < 86400000) return Math.floor(diff / 3600000) + ' hr ago'
    // Less than 7 days
    if (diff < 604800000) return Math.floor(diff / 86400000) + ' days ago'

    return date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
  }

  // 开始编辑标题
  const startEditTitle = (session) => {
    setEditingId(session.id)
    setEditTitle(session.title || '新对话')
  }

  // 保存标题
  const saveTitle = (sessionId) => {
    if (editTitle.trim()) {
      onUpdateTitle(sessionId, editTitle.trim())
    }
    setEditingId(null)
  }

  // 处理菜单点击
  const handleMenuClick = (e, sessionId) => {
    e.stopPropagation()
    setMenuOpenId(menuOpenId === sessionId ? null : sessionId)
  }

  if (!show) {
    return null
  }

  return (
    <div style={styles.container}>
      {/* 头部 */}
      <div style={styles.header}>
        <h3 style={styles.headerTitle}>会话列表</h3>
        <button style={styles.newBtn} onClick={onNewSession} title="新建会话">
          + 新建
        </button>
      </div>

      {/* 会话列表 */}
      <div style={styles.list}>
        {isLoading ? (
          <div style={styles.loading}>加载中...</div>
        ) : sessions.length === 0 ? (
          <div style={styles.empty}>暂无会话</div>
        ) : (
          sessions.map(session => (
            <div
              key={session.id}
              style={{
                ...styles.item,
                ...(session.id === currentSessionId ? styles.itemActive : {})
              }}
              onClick={() => onSelectSession(session.id)}
            >
              {editingId === session.id ? (
                <input
                  style={styles.editInput}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => saveTitle(session.id)}
                  onKeyDown={(e) => e.key === 'Enter' && saveTitle(session.id)}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  <div style={styles.itemContent}>
                    <span style={styles.itemTitle}>{session.title || '新对话'}</span>
                    <span style={styles.itemTime}>{formatTime(session.lastMessageAt)}</span>
                  </div>
                  <div style={styles.itemMeta}>
                    <span style={styles.messageCount}>
                      💬 {session.messageCount || 0}
                    </span>
                    <div style={styles.menuWrapper}>
                      <button
                        style={styles.menuBtn}
                        onClick={(e) => handleMenuClick(e, session.id)}
                      >
                        ⋮
                      </button>
                      {menuOpenId === session.id && (
                        <div style={styles.menu}>
                          <button
                            style={styles.menuItem}
                            onClick={(e) => {
                              e.stopPropagation()
                              startEditTitle(session)
                              setMenuOpenId(null)
                            }}
                          >
                            ✏️ 重命名
                          </button>
                          <button
                            style={styles.menuItem}
                            onClick={(e) => {
                              e.stopPropagation()
                              onArchive(session.id)
                              setMenuOpenId(null)
                            }}
                          >
                            📁 归档
                          </button>
                          <button
                            style={{ ...styles.menuItem, ...styles.menuItemDanger }}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (confirm('确定要删除这个会话吗？')) {
                                onDelete(session.id)
                              }
                              setMenuOpenId(null)
                            }}
                          >
                            🗑️ 删除
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    width: '280px',
    backgroundColor: '#fff',
    borderRight: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    borderBottom: '1px solid #e0e0e0'
  },
  headerTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    color: '#333'
  },
  newBtn: {
    padding: '6px 12px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer'
  },
  list: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px'
  },
  loading: {
    padding: '20px',
    textAlign: 'center',
    color: '#999'
  },
  empty: {
    padding: '20px',
    textAlign: 'center',
    color: '#999'
  },
  item: {
    padding: '12px',
    marginBottom: '4px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    position: 'relative'
  },
  itemActive: {
    backgroundColor: '#e3f2fd'
  },
  itemContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  itemTitle: {
    fontSize: '14px',
    color: '#333',
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  itemTime: {
    fontSize: '12px',
    color: '#999'
  },
  itemMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '8px'
  },
  messageCount: {
    fontSize: '12px',
    color: '#666'
  },
  menuWrapper: {
    position: 'relative'
  },
  menuBtn: {
    padding: '4px 8px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#666',
    borderRadius: '4px'
  },
  menu: {
    position: 'absolute',
    right: '0',
    top: '100%',
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    zIndex: 100,
    minWidth: '120px',
    overflow: 'hidden'
  },
  menuItem: {
    display: 'block',
    width: '100%',
    padding: '10px 12px',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left',
    fontSize: '13px',
    cursor: 'pointer',
    color: '#333'
  },
  menuItemDanger: {
    color: '#f44336'
  },
  editInput: {
    width: '100%',
    padding: '6px 8px',
    fontSize: '14px',
    border: '1px solid #1976d2',
    borderRadius: '4px',
    outline: 'none'
  }
}
