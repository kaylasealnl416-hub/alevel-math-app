// ============================================================
// ChatPage Component
// AI tutor chat page
// ============================================================

import { useState, useEffect, useRef } from 'react'
import { useChat } from '../hooks/useChat.js'
import MessageList from './MessageList.jsx'
import InputBox from './InputBox.jsx'
import SessionSidebar from './SessionSidebar.jsx'

const DEFAULT_USER_ID = 1

export default function ChatPage({ nav, chapter, book, subject }) {
  const [userId] = useState(() => parseInt(localStorage.getItem('currentUserId')) || DEFAULT_USER_ID)

  const {
    sessions, currentSession, messages, isLoading, isSending, error,
    loadSessions, createSession, selectSession, sendMessage,
    updateSessionTitle, archiveSession, deleteSession, clearError
  } = useChat(userId)

  const messagesEndRef = useRef(null)

  useEffect(() => { if (userId) loadSessions() }, [userId, loadSessions])
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleSendMessage = async (content) => {
    if (!currentSession) {
      const newSession = await createSession(null, 'New Chat', 'learning')
      if (!newSession) return
    }
    await sendMessage(content)
  }

  const handleBack = () => {
    if (nav) nav('curriculum', book, chapter, subject)
    else window.history.back()
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', overflow: 'hidden' }}>

      {/* ── Header ── */}
      <header style={{ height: 56, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', paddingLeft: 20, paddingRight: 20, flexShrink: 0, position: 'relative', zIndex: 10 }}>
        <button
          onClick={handleBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 8px', borderRadius: 8 }}
          onMouseEnter={e => { e.currentTarget.style.color = '#DA291C' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#64748B' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back to Chapter
        </button>

        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, background: '#FEE2E2', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', fontWeight: 700, fontStyle: 'italic', fontSize: 12, color: '#DA291C' }}>A</div>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', letterSpacing: '-0.01em' }}>AI Teaching Assistant</span>
        </div>

        <div style={{ marginLeft: 'auto', width: 120 }} />
      </header>

      {/* ── Body ── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', padding: 16, gap: 16 }}>

        {/* Sidebar */}
        <SessionSidebar
          sessions={sessions}
          currentSessionId={currentSession?.id}
          isLoading={isLoading}
          onSelectSession={selectSession}
          onNewSession={() => createSession(null, 'New Chat', 'learning')}
          onArchive={archiveSession}
          onDelete={deleteSession}
          onUpdateTitle={updateSessionTitle}
        />

        {/* Main */}
        <div style={{ flex: 1, background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

          {/* Top bar */}
          <div style={{ height: 56, borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 14, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(239,68,68,0.28)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.24Z"/>
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.24Z"/>
                  </svg>
                </div>
                <div style={{ position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, background: '#10B981', border: '2px solid #fff', borderRadius: '50%' }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>AI Tutor</div>
                <div style={{ fontSize: 11, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  Always ready to help
                </div>
              </div>
            </div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 8, color: '#CBD5E1', display: 'flex', alignItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </button>
          </div>

          {/* Message area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 24, position: 'relative' }}>

            {/* Error toast */}
            {error && (
              <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '9px 16px', borderRadius: 9999, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', zIndex: 20 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
                <button onClick={clearError} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F87171', marginLeft: 4, fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>
              </div>
            )}

            {!currentSession ? (
              /* Empty state */
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', maxWidth: 420, margin: '0 auto' }}>
                <div style={{ width: 76, height: 76, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(218,41,28,0.07) 0%, transparent 70%)' }} />
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative', zIndex: 1 }}>
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.24Z"/>
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.24Z"/>
                  </svg>
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: '0 0 8px' }}>Welcome, AI Tutor</h2>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.75, margin: '0 0 28px' }}>
                  Ready to help you master A-Level content.<br/>
                  Start a new chat or pick a session on the left.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
                  {[
                    { title: 'Formula Walkthrough', desc: 'Walk me through the quadratic formula step by step' },
                    { title: 'Exam Question Help', desc: 'Help me with a WMA11 integration question' }
                  ].map((s, i) => (
                    <button key={i}
                      onClick={() => createSession(null, s.title, 'learning')}
                      style={{ textAlign: 'left', padding: '12px 14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC' }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 4 }}>{s.title}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.55 }}>{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <MessageList messages={messages} isLoading={isLoading} />
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <InputBox
            onSend={handleSendMessage}
            disabled={isSending || !currentSession}
            isSending={isSending}
          />
        </div>
      </div>
    </div>
  )
}
