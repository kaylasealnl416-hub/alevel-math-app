// ============================================================
// InputBox Component
// 消息输入框组件
// ============================================================

import { useState, useRef, useEffect } from 'react'

// 常用的 LaTeX 公式模板
const LATEX_TEMPLATES = [
  { label: 'x²', insert: 'x^2', example: 'x^2' },
  { label: '√x', insert: '\\sqrt{x}', example: '\\sqrt{x}' },
  { label: '分数', insert: '\\frac{a}{b}', example: '\\frac{a}{b}' },
  { label: '∑', insert: '\\sum_{i=1}^{n}', example: '\\sum_{i=1}^{n}' },
  { label: '∫', insert: '\\int_{a}^{b}', example: '\\int_{a}^{b}' },
  { label: 'lim', insert: '\\lim_{x \\to 0}', example: '\\lim_{x \\to 0}' },
  { label: '∞', insert: '\\infty', example: '\\infty' },
  { label: 'θ', insert: '\\theta', example: '\\theta' },
]

export default function InputBox({ onSend, disabled = false, isSending = false }) {
  const [message, setMessage] = useState('')
  const [showLatexMenu, setShowLatexMenu] = useState(false)
  const textareaRef = useRef(null)
  const latexMenuRef = useRef(null)

  // 自动调整 textarea 高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px'
    }
  }, [message])

  // 点击外部关闭 LaTeX 菜单
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (latexMenuRef.current && !latexMenuRef.current.contains(e.target)) {
        setShowLatexMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 处理发送
  const handleSend = () => {
    if (message.trim() && !disabled && !isSending) {
      onSend(message)
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  // 处理键盘事件
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // 插入 LaTeX
  const insertLatex = (template) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = message

    const before = text.substring(0, start)
    const selected = text.substring(start, end)
    const after = text.substring(end)

    // 如果选中了文本，包裹在 $...$ 中
    if (selected) {
      const newText = before + `$` + selected + `$` + after
      setMessage(newText)
    } else {
      const newText = before + '$' + template.insert + '$' + after
      setMessage(newText)
    }

    setShowLatexMenu(false)

    // 聚焦 textarea
    setTimeout(() => {
      textarea.focus()
      const newPos = start + template.insert.length + 2 // +2 for $
      textarea.setSelectionRange(newPos, newPos)
    }, 0)
  }

  const isDisabled = disabled || isSending

  return (
    <div style={styles.container}>
      {/* LaTeX 快捷工具栏 */}
      <div style={styles.toolbar}>
        <div style={styles.latexBtnWrapper} ref={latexMenuRef}>
          <button
            style={styles.latexBtn}
            onClick={() => setShowLatexMenu(!showLatexMenu)}
            title="插入数学公式"
          >
            📐 LaTeX
          </button>
          {showLatexMenu && (
            <div style={styles.latexMenu}>
              <div style={styles.latexMenuTitle}>选择公式模板：</div>
              <div style={styles.latexMenuGrid}>
                {LATEX_TEMPLATES.map((template, index) => (
                  <button
                    key={index}
                    style={styles.latexMenuItem}
                    onClick={() => insertLatex(template)}
                    title={`示例: ${template.example}`}
                  >
                    <span style={styles.latexMenuLabel}>{template.label}</span>
                  </button>
                ))}
              </div>
              <div style={styles.latexMenuHint}>
                输入 $...$ 包裹公式，如：$x^2$ 或 $\frac{a}{b}$
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          style={styles.textarea}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isDisabled ? (isSending ? 'AI 正在思考...' : '请先选择一个会话') : '输入你的问题...（可用 $公式$ 输入数学）'}
          disabled={isDisabled}
          rows={1}
        />
        <div style={styles.actions}>
          <button
            style={{
              ...styles.sendBtn,
              ...(message.trim() && !isDisabled ? styles.sendBtnActive : {})
            }}
            onClick={handleSend}
            disabled={!message.trim() || isDisabled}
          >
            {isSending ? (
              <span style={styles.sendingIndicator}>⏳</span>
            ) : (
              '发送'
            )}
          </button>
        </div>
      </div>
      <div style={styles.hint}>
        按 <kbd style={styles.kbd}>Enter</kbd> 发送，<kbd style={styles.kbd}>Shift + Enter</kbd> 换行
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: '16px 20px',
    backgroundColor: '#fff',
    borderTop: '1px solid #e0e0e0'
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px'
  },
  latexBtnWrapper: {
    position: 'relative'
  },
  latexBtn: {
    padding: '6px 12px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    color: '#666'
  },
  latexMenu: {
    position: 'absolute',
    bottom: '100%',
    left: '0',
    marginBottom: '8px',
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    padding: '12px',
    zIndex: 100,
    minWidth: '200px'
  },
  latexMenuTitle: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '8px'
  },
  latexMenuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '6px'
  },
  latexMenuItem: {
    padding: '8px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '14px',
    transition: 'all 0.2s'
  },
  latexMenuLabel: {
    fontFamily: 'KaTeX_Main, serif'
  },
  latexMenuHint: {
    marginTop: '8px',
    paddingTop: '8px',
    borderTop: '1px solid #e0e0e0',
    fontSize: '11px',
    color: '#999'
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f5f5f5',
    borderRadius: '12px',
    border: '1px solid #e0e0e0'
  },
  textarea: {
    flex: 1,
    padding: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '15px',
    fontFamily: 'inherit',
    resize: 'none',
    outline: 'none',
    lineHeight: 1.5,
    minHeight: '24px',
    maxHeight: '150px'
  },
  actions: {
    display: 'flex',
    alignItems: 'center'
  },
  sendBtn: {
    padding: '10px 20px',
    backgroundColor: '#e0e0e0',
    color: '#999',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'not-allowed',
    transition: 'all 0.2s ease'
  },
  sendBtnActive: {
    backgroundColor: '#1976d2',
    color: '#fff',
    cursor: 'pointer'
  },
  sendingIndicator: {
    display: 'inline-block',
    animation: 'pulse 1s infinite'
  },
  hint: {
    marginTop: '8px',
    fontSize: '12px',
    color: '#999',
    textAlign: 'center'
  },
  kbd: {
    padding: '2px 6px',
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    fontSize: '11px',
    fontFamily: 'inherit'
  }
}

// 添加动画样式
const styleSheet = document.createElement('style')
styleSheet.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`
if (!document.head.querySelector('style[data-input-box]')) {
  styleSheet.setAttribute('data-input-box', 'true')
  document.head.appendChild(styleSheet)
}
