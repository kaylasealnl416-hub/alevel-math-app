// ============================================================
// 题目卡片组件
// 显示题目内容，支持 LaTeX 渲染
// ============================================================

import React from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import '../styles/QuestionCard.css'

const QuestionCard = ({ question, questionNumber, totalQuestions, showAnswer = false }) => {
  // 渲染 LaTeX 公式
  const renderLatex = (text) => {
    if (!text) return ''

    try {
      // 匹配 $...$ 或 $$...$$ 格式的 LaTeX
      return text.replace(/\$\$(.+?)\$\$/g, (match, latex) => {
        return katex.renderToString(latex, { displayMode: true, throwOnError: false })
      }).replace(/\$(.+?)\$/g, (match, latex) => {
        return katex.renderToString(latex, { displayMode: false, throwOnError: false })
      })
    } catch (error) {
      console.error('LaTeX 渲染失败:', error)
      return text
    }
  }

  // 获取题目内容（支持多语言）
  const getContent = (content) => {
    if (typeof content === 'string') return content
    return content?.zh || content?.en || ''
  }

  // 获取难度标签
  const getDifficultyLabel = (difficulty) => {
    const labels = {
      1: { text: '非常简单', color: '#10b981' },
      2: { text: '简单', color: '#3b82f6' },
      3: { text: '中等', color: '#f59e0b' },
      4: { text: '困难', color: '#ef4444' },
      5: { text: '非常困难', color: '#991b1b' }
    }
    return labels[difficulty] || labels[3]
  }

  // 获取题型标签
  const getTypeLabel = (type) => {
    const labels = {
      'multiple_choice': '选择题',
      'fill_blank': '填空题',
      'calculation': '计算题',
      'proof': '证明题',
      'short_answer': '简答题'
    }
    return labels[type] || type
  }

  const difficultyInfo = getDifficultyLabel(question.difficulty)
  const content = getContent(question.content)

  return (
    <div className="question-card">
      {/* 题目头部 */}
      <div className="question-header">
        <div className="question-number">
          第 {questionNumber} / {totalQuestions} 题
        </div>
        <div className="question-meta">
          <span className="question-type">{getTypeLabel(question.type)}</span>
          <span
            className="question-difficulty"
            style={{ backgroundColor: difficultyInfo.color }}
          >
            {difficultyInfo.text}
          </span>
        </div>
      </div>

      {/* 题目内容 */}
      <div className="question-content">
        <div
          className="question-text"
          dangerouslySetInnerHTML={{ __html: renderLatex(content) }}
        />

        {/* 选择题选项 */}
        {question.type === 'multiple_choice' && question.options && (
          <div className="question-options">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`option-item ${showAnswer && option.startsWith(question.answer?.value) ? 'correct-answer' : ''}`}
              >
                <div dangerouslySetInnerHTML={{ __html: renderLatex(option) }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 知识点标签 */}
      {question.tags && question.tags.length > 0 && (
        <div className="question-tags">
          {question.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      )}

      {/* 显示答案（仅在查看模式） */}
      {showAnswer && question.answer && (
        <div className="question-answer">
          <div className="answer-label">✅ 正确答案</div>
          <div className="answer-content">
            {question.answer.latex ? (
              <div dangerouslySetInnerHTML={{ __html: renderLatex(question.answer.latex) }} />
            ) : (
              <div>{question.answer.value}</div>
            )}
          </div>
          {question.answer.explanation && (
            <div className="answer-explanation">
              <div className="explanation-label">💡 解析</div>
              <div dangerouslySetInnerHTML={{ __html: renderLatex(getContent(question.answer.explanation)) }} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default QuestionCard
