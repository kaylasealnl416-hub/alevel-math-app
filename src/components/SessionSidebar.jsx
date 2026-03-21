// ============================================================
// SessionSidebar Component
// Chat session list sidebar
// ============================================================

import { useState } from 'react'
import { formatRelativeTime } from '../utils/helpers.js'

export default function SessionSidebar({
  sessions, currentSessionId, isLoading,
  onSelectSession, onNewSession, onArchive, onDelete, onUpdateTitle
}) {
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [menuOpenId, setMenuOpenId] = useState(null)

  const startEdit = (session) => { setEditingId(session.id); setEditTitle(session.title || 'New Chat') }
  const saveTitle = (id) => { if (editTitle.trim()) onUpdateTitle(id, editTitle.trim()); setEditingId(null) }

  return (
    <div style={{ width: 272, background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>

      {/* Header */}
      <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid #F1F5F9' }}>
        <button
          onClick={onNewSession}
          style={{ width: '100%', background: '#0F172A', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
          onMouseEnter={e => { e.currentTarget.style.background = '#1E293B' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#0F172A' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Chat
        </button>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px' }}>
        {isLoading ? (
          <div style={{ padding: 20, textAlign: 'center', fontSize: 13, color: '#94A3B8' }}>Loading...</div>
        ) : sessions.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>💬</div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>No chats yet.<br/>Start one above.</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 8px 8px' }}>Recent Chats</div>
            {sessions.map(session => {
              const isActive = session.id === currentSessionId
              return (
                <div
                  key={session.id}
                  onClick={() => { if (editingId !== session.id) onSelectSession(session.id) }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', borderRadius: 12, cursor: 'pointer', marginBottom: 2, background: isActive ? '#FEF2F2' : 'transparent', border: `1px solid ${isActive ? '#FECACA' : 'transparent'}`, transition: 'all 0.15s', position: 'relative' }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F8FAFC' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#d93025' : '#94A3B8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>

                  {editingId === session.id ? (
                    <input
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      onBlur={() => saveTitle(session.id)}
                      onKeyDown={e => e.key === 'Enter' && saveTitle(session.id)}
                      onClick={e => e.stopPropagation()}
                      autoFocus
                      style={{ flex: 1, fontSize: 13, border: '1px solid #1a73e8', borderRadius: 6, padding: '2px 6px', outline: 'none', color: '#0F172A' }}
                    />
                  ) : (
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? '#B91C1C' : '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {session.title || 'New Chat'}
                      </div>
                      {session.lastMessageAt && (
                        <div style={{ fontSize: 11, color: '#CBD5E1', marginTop: 1 }}>{formatRelativeTime(session.lastMessageAt)}</div>
                      )}
                    </div>
                  )}

                  {/* Menu */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <button
                      onClick={e => { e.stopPropagation(); setMenuOpenId(menuOpenId === session.id ? null : session.id) }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 5px', borderRadius: 4, color: '#CBD5E1', fontSize: 16, lineHeight: 1 }}
                    >⋮</button>
                    {menuOpenId === session.id && (
                      <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', zIndex: 100, minWidth: 120, overflow: 'hidden' }}>
                        {[
                          { label: 'Rename', action: () => { startEdit(session); setMenuOpenId(null) } },
                          { label: 'Archive', action: () => { onArchive(session.id); setMenuOpenId(null) } },
                          { label: 'Delete', action: () => { if (confirm('Delete this chat?')) onDelete(session.id); setMenuOpenId(null) }, danger: true },
                        ].map(item => (
                          <button key={item.label}
                            onClick={e => { e.stopPropagation(); item.action() }}
                            style={{ display: 'block', width: '100%', padding: '9px 14px', background: 'none', border: 'none', textAlign: 'left', fontSize: 13, cursor: 'pointer', color: item.danger ? '#d93025' : '#374151' }}
                            onMouseEnter={e => { e.currentTarget.style.background = item.danger ? '#FEF2F2' : '#F8FAFC' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                          >{item.label}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}
