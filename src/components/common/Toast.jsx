import React, { useEffect } from 'react'
import './Toast.css'

/**
 * Global Toast Component
 * 
 * Usage:
 * <Toast message="Success!" type="success" onClose={() => setToast(null)} />
 * 
 * Types: success, error, info, warning
 */

function Toast({ message, type = 'success', duration = 3000, onClose }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  }

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  )
}

// 静态方法 — 供 apiClient 等非组件代码调用
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-root') || (() => {
    const el = document.createElement('div')
    el.id = 'toast-root'
    el.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:8px;'
    document.body.appendChild(el)
    return el
  })()

  const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' }
  const colors = {
    success: { bg: '#F0FDF4', border: '#BBF7D0', text: '#166534' },
    error:   { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B' },
    info:    { bg: '#e8f0fe', border: '#d2e3fc', text: '#185abc' },
    warning: { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
  }
  const c = colors[type] || colors.info

  const el = document.createElement('div')
  el.style.cssText = `display:flex;align-items:center;gap:8px;padding:12px 18px;border-radius:10px;font-size:14px;font-weight:500;background:${c.bg};border:1px solid ${c.border};color:${c.text};box-shadow:0 4px 12px rgba(0,0,0,0.1);animation:slideIn 0.2s ease;max-width:360px;`
  el.innerHTML = `<span>${icons[type] || ''}</span><span style="flex:1">${message}</span>`
  container.appendChild(el)

  setTimeout(() => {
    el.style.opacity = '0'
    el.style.transition = 'opacity 0.2s'
    setTimeout(() => el.remove(), 200)
  }, duration)
}

Toast.success = (msg, duration) => showToast(msg, 'success', duration)
Toast.error   = (msg, duration) => showToast(msg, 'error', duration)
Toast.info    = (msg, duration) => showToast(msg, 'info', duration)
Toast.warning = (msg, duration) => showToast(msg, 'warning', duration)

export default Toast
