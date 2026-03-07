// ============================================================
// MessageContent Component
// 支持 Markdown 和 LaTeX 的消息内容渲染
// ============================================================

import { useMemo } from 'react'
import katex from 'katex'

// 简单的 Markdown 转 HTML（轻量级实现）
function parseMarkdown(text) {
  if (!text) return ''

  let html = text

  // 转义 HTML 特殊字符（防止 XSS）
  html = html.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 代码块 ```code```
  html = html.replace(/```([\s\S]*?)```/g, '<pre style="background:#f5f5f5;padding:12px;border-radius:6px;overflow-x:auto;margin:8px 0;"><code>$1</code></pre>')

  // 行内代码 `code`
  html = html.replace(/`([^`]+)`/g, '<code style="background:#f5f5f5;padding:2px 6px;border-radius:4px;font-family:monospace;">$1</code>')

  // 加粗 **text** 或 __text__
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>')

  // 斜体 *text* 或 _text_
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>')

  // 标题 ### text
  html = html.replace(/^### (.+)$/gm, '<h4 style="margin:12px 0 8px 0;font-size:16px;">$1</h4>')

  // 标题 ## text
  html = html.replace(/^## (.+)$/gm, '<h3 style="margin:16px 0 8px 0;font-size:18px;">$1</h3>')

  // 标题 # text
  html = html.replace(/^# (.+)$/gm, '<h2 style="margin:16px 0 8px 0;font-size:20px;">$1</h2>')

  // 无序列表 - item
  html = html.replace(/^- (.+)$/gm, '<li style="margin-left:20px;">$1</li>')

  // 有序列表 1. item
  html = html.replace(/^\d+\. (.+)$/gm, '<li style="margin-left:20px;">$1</li>')

  // 换行处理
  html = html.replace(/\n\n/g, '</p><p style="margin:8px 0;">')
  html = html.replace(/\n/g, '<br/>')

  // 包裹段落
  if (!html.startsWith('<')) {
    html = '<p style="margin:8px 0;">' + html + '</p>'
  }

  return html
}

// 解析 LaTeX 公式
function parseLatex(text) {
  if (!text) return ''

  let result = text

  // 块级公式 $$...$$
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

  // 行内公式 $...$
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

// 主组件
export default function MessageContent({ content }) {
  const renderedContent = useMemo(() => {
    if (!content) return ''

    // 先解析 Markdown
    let html = parseMarkdown(content)

    // 再解析 LaTeX
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

// 导出辅助函数供其他组件使用
export { parseMarkdown, parseLatex }
