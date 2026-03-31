import katex from 'katex'
import 'katex/dist/katex.min.css'

/**
 * Renders text with inline LaTeX ($...$) and display LaTeX ($$...$$).
 * Usage: <MathText text="Solve $x^2 + 1 = 0$" />
 */
export default function MathText({ text, style, className }) {
  if (!text) return null

  const html = renderLatex(String(text))

  return (
    <span
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export function renderLatex(text) {
  if (!text) return ''
  try {
    // 规范化字面量 \n 为实际换行符
    const normalized = text.replace(/\\n/g, '\n')

    // 分段处理：LaTeX 块外的换行转 <br>，LaTeX 块内保持原样
    const segments = []
    let lastIndex = 0
    const re = /\$\$(.+?)\$\$|\$(.+?)\$/gs
    let match

    while ((match = re.exec(normalized)) !== null) {
      if (match.index > lastIndex) {
        segments.push(normalized.slice(lastIndex, match.index).replace(/\n/g, '<br>'))
      }
      if (match[1] !== undefined) {
        segments.push(katex.renderToString(match[1].trim(), { displayMode: true, throwOnError: false }))
      } else {
        segments.push(katex.renderToString(match[2].trim(), { displayMode: false, throwOnError: false }))
      }
      lastIndex = re.lastIndex
    }

    if (lastIndex < normalized.length) {
      segments.push(normalized.slice(lastIndex).replace(/\n/g, '<br>'))
    }

    return segments.join('')
  } catch {
    return text
  }
}
