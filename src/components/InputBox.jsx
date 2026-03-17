// ============================================================
// InputBox Component
// ============================================================

import { useState, useRef, useEffect } from 'react'

const LATEX_TEMPLATES = [
  { label: 'x²', insert: 'x^2' },
  { label: '√x', insert: '\\sqrt{x}' },
  { label: 'a/b', insert: '\\frac{a}{b}' },
  { label: '∑', insert: '\\sum_{i=1}^{n}' },
  { label: '∫', insert: '\\int_{a}^{b}' },
  { label: 'lim', insert: '\\lim_{x \\to 0}' },
  { label: '∞', insert: '\\infty' },
  { label: 'θ', insert: '\\theta' },
]

export default function InputBox({ onSend, disabled = false, isSending = false }) {
  const [message, setMessage] = useState('')
  const [showLatexMenu, setShowLatexMenu] = useState(false)
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef(null)
  const latexMenuRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px'
    }
  }, [message])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (latexMenuRef.current && !latexMenuRef.current.contains(e.target)) {
        setShowLatexMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSend = () => {
    if (message.trim() && !disabled && !isSending) {
      onSend(message)
      setMessage('')
      if (textareaRef.current) textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const insertLatex = (template) => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = message.substring(start, end)
    const newText = message.substring(0, start)
      + (selected ? `$${selected}$` : `$${template.insert}$`)
      + message.substring(end)
    setMessage(newText)
    setShowLatexMenu(false)
    setTimeout(() => {
      textarea.focus()
      const pos = start + template.insert.length + 2
      textarea.setSelectionRange(pos, pos)
    }, 0)
  }

  const isDisabled = disabled || isSending
  const canSend = !!message.trim() && !isDisabled

  const borderColor = focused && !isDisabled
    ? (canSend ? '#DA291C' : '#94A3B8')
    : '#E2E8F0'
  const ringColor = focused && !isDisabled
    ? (canSend ? 'rgba(218,41,28,0.1)' : 'rgba(148,163,184,0.1)')
    : 'transparent'

  return (
    <div style={{ padding: '12px 20px 16px', background: '#fff', borderTop: '1px solid #F1F5F9' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>

          {/* LaTeX button */}
          <div style={{ position: 'relative' }} ref={latexMenuRef}>
            <button
              onClick={() => setShowLatexMenu(!showLatexMenu)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px',
                borderRadius: 8, border: `1px solid ${showLatexMenu ? '#FECACA' : '#E2E8F0'}`,
                background: showLatexMenu ? '#FEF2F2' : '#F8FAFC',
                color: showLatexMenu ? '#DA291C' : '#64748B',
                fontSize: 12, fontWeight: 500, cursor: 'pointer'
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>
              LaTeX
            </button>

            {showLatexMenu && (
              <div style={{ position: 'absolute', bottom: '100%', left: 0, marginBottom: 8, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 12, zIndex: 100, minWidth: 220 }}>
                <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 8, fontWeight: 500 }}>Insert formula template</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {LATEX_TEMPLATES.map((t, i) => (
                    <button key={i} onClick={() => insertLatex(t)}
                      style={{ padding: '7px 4px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 7, cursor: 'pointer', textAlign: 'center', fontSize: 13, fontFamily: 'KaTeX_Main, Georgia, serif', color: '#374151' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.borderColor = '#CBD5E1' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#E2E8F0' }}
                    >{t.label}</button>
                  ))}
                </div>
                <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid #F1F5F9', fontSize: 11, color: '#CBD5E1' }}>
                  Wrap with <code style={{ background: '#F1F5F9', padding: '1px 4px', borderRadius: 3 }}>$...$</code> e.g. $x^2$
                </div>
              </div>
            )}
          </div>

          {/* Upload Image (placeholder) */}
          <button
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#64748B', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Image
          </button>
        </div>

        {/* Input wrapper */}
        <div style={{
          position: 'relative',
          background: '#fff',
          border: `1px solid ${borderColor}`,
          borderRadius: 14,
          boxShadow: `0 0 0 3px ${ringColor}`,
          display: 'flex',
          alignItems: 'flex-end',
          transition: 'border-color 0.2s, box-shadow 0.2s'
        }}>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={isDisabled ? (isSending ? 'AI is thinking…' : 'Select a chat first') : 'Ask a question or type a formula…'}
            disabled={isDisabled}
            rows={1}
            style={{
              flex: 1, padding: '14px 52px 14px 16px', border: 'none',
              background: 'transparent', resize: 'none', outline: 'none',
              fontSize: 14, fontFamily: 'inherit', lineHeight: 1.55,
              color: '#0F172A', minHeight: 52, maxHeight: 150,
              '::placeholder': { color: '#94A3B8' }
            }}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            style={{
              position: 'absolute', right: 10, bottom: 10,
              width: 34, height: 34, borderRadius: 10, border: 'none',
              background: canSend ? '#DA291C' : '#F1F5F9',
              color: canSend ? '#fff' : '#CBD5E1',
              cursor: canSend ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: canSend ? '0 2px 8px rgba(218,41,28,0.3)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            {isSending ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            )}
          </button>
        </div>

        {/* Hint */}
        <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: '#CBD5E1' }}>
          Press <kbd style={{ padding: '1px 5px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 4, fontSize: 10, fontFamily: 'inherit' }}>Enter</kbd> to send
          &nbsp;·&nbsp;
          <kbd style={{ padding: '1px 5px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 4, fontSize: 10, fontFamily: 'inherit' }}>Shift + Enter</kbd> for new line
        </div>
      </div>
    </div>
  )
}

// Spin animation
const styleSheet = document.createElement('style')
styleSheet.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`
if (!document.head.querySelector('style[data-inputbox]')) {
  styleSheet.setAttribute('data-inputbox', 'true')
  document.head.appendChild(styleSheet)
}
