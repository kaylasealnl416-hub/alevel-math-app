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
    return text
      .replace(/\$\$(.+?)\$\$/gs, (_, latex) =>
        katex.renderToString(latex.trim(), { displayMode: true, throwOnError: false })
      )
      .replace(/\$(.+?)\$/g, (_, latex) =>
        katex.renderToString(latex.trim(), { displayMode: false, throwOnError: false })
      )
  } catch {
    return text
  }
}
