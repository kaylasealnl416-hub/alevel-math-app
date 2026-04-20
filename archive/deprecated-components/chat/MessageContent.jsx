// ============================================================
// MessageContent Component
// Message content renderer — supports Markdown and LaTeX
// ============================================================

import { useMemo } from 'react'
import katex from 'katex'

// Lightweight Markdown → HTML parser
function parseMarkdown(text) {
  if (!text) return ''

  let html = text

  // Escape HTML special characters (XSS prevention)
  html = html.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Fenced code block ```code```
  html = html.replace(/```([\s\S]*?)```/g, '<pre style="background:#f5f5f5;padding:12px;border-radius:6px;overflow-x:auto;margin:8px 0;"><code>$1</code></pre>')

  // Inline code `code`
  html = html.replace(/`([^`]+)`/g, '<code style="background:#f5f5f5;padding:2px 6px;border-radius:4px;font-family:monospace;">$1</code>')

  // Bold **text** or __text__
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>')

  // Italic *text* or _text_
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>')

  // Heading ### text
  html = html.replace(/^### (.+)$/gm, '<h4 style="margin:12px 0 8px 0;font-size:16px;">$1</h4>')

  // Heading ## text
  html = html.replace(/^## (.+)$/gm, '<h3 style="margin:16px 0 8px 0;font-size:18px;">$1</h3>')

  // Heading # text
  html = html.replace(/^# (.+)$/gm, '<h2 style="margin:16px 0 8px 0;font-size:20px;">$1</h2>')

  // Unordered list - item
  html = html.replace(/^- (.+)$/gm, '<li style="margin-left:20px;">$1</li>')

  // Ordered list 1. item
  html = html.replace(/^\d+\. (.+)$/gm, '<li style="margin-left:20px;">$1</li>')

  // Line breaks
  html = html.replace(/\n\n/g, '</p><p style="margin:8px 0;">')
  html = html.replace(/\n/g, '<br/>')

  // Wrap in paragraph if not already a block element
  if (!html.startsWith('<')) {
    html = '<p style="margin:8px 0;">' + html + '</p>'
  }

  return html
}

// Parse LaTeX formulas
function parseLatex(text) {
  if (!text) return ''

  let result = text

  // Block formula $$...$$
  result = result.replace(/\$\$([^$]+)\$\$/g, (_, formula) => {
    try {
      return katex.renderToString(formula.trim(), {
        throwOnError: false,
        displayMode: true
      })
    } catch (e) {
      return `<code>${formula}</code>`
    }
  })

  // Inline formula $...$
  result = result.replace(/\$([^$\n]+)\$/g, (_, formula) => {
    try {
      return katex.renderToString(formula.trim(), {
        throwOnError: false,
        displayMode: false
      })
    } catch (e) {
      return `<code>${formula}</code>`
    }
  })

  return result
}

export default function MessageContent({ content }) {
  const renderedContent = useMemo(() => {
    if (!content) return ''

    // Parse Markdown first, then LaTeX
    let html = parseMarkdown(content)
    html = parseLatex(html)

    return html
  }, [content])

  return (
    <div
      style={styles.container}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  )
}

const styles = {
  container: {
    lineHeight: 1.6,
    fontSize: '15px'
  }
}

// Export helpers for use in other components
export { parseMarkdown, parseLatex }
