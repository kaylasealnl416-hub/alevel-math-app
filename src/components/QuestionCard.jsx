// ============================================================
// Question Card Component
// Display question content with LaTeX rendering support
// ============================================================

import React from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { getEnglishContent } from '../utils/content'
import '../styles/QuestionCard.css'

const QuestionCard = ({ question, questionNumber, totalQuestions, showAnswer = false }) => {
  // Render LaTeX formulas
  const renderLatex = (text) => {
    if (!text) return ''

    try {
      // Match $...$ or $$...$$ format LaTeX
      return text.replace(/\$\$(.+?)\$\$/g, (match, latex) => {
        return katex.renderToString(latex, { displayMode: true, throwOnError: false })
      }).replace(/\$(.+?)\$/g, (match, latex) => {
        return katex.renderToString(latex, { displayMode: false, throwOnError: false })
      })
    } catch (error) {
      console.error('LaTeX rendering failed:', error)
      return text
    }
  }

  // Get difficulty label
  const getDifficultyLabel = (difficulty) => {
    const labels = {
      1: { text: 'Very Easy', color: '#10b981' },
      2: { text: 'Easy', color: '#3b82f6' },
      3: { text: 'Medium', color: '#f59e0b' },
      4: { text: 'Hard', color: '#ef4444' },
      5: { text: 'Very Hard', color: '#991b1b' }
    }
    return labels[difficulty] || labels[3]
  }

  // Get question type label
  const getTypeLabel = (type) => {
    const labels = {
      'multiple_choice': 'Multiple Choice',
      'fill_blank': 'Fill in the Blank',
      'calculation': 'Calculation',
      'proof': 'Proof',
      'short_answer': 'Short Answer'
    }
    return labels[type] || type
  }

  const difficultyInfo = getDifficultyLabel(question.difficulty)
  const content = getEnglishContent(question.content)

  return (
    <div className="question-card">
      {/* Question header */}
      <div className="question-header">
        <div className="question-number">
          Question {questionNumber} / {totalQuestions}
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

      {/* Question content */}
      <div className="question-content">
        <div
          className="question-text"
          dangerouslySetInnerHTML={{ __html: renderLatex(content) }}
        />

        {/* Multiple choice options */}
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

      {/* Topic tags */}
      {question.tags && question.tags.length > 0 && (
        <div className="question-tags">
          {question.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      )}

      {/* Show answer (view mode only) */}
      {showAnswer && question.answer && (
        <div className="question-answer">
          <div className="answer-label">✅ Correct Answer</div>
          <div className="answer-content">
            {question.answer.latex ? (
              <div dangerouslySetInnerHTML={{ __html: renderLatex(question.answer.latex) }} />
            ) : (
              <div>{question.answer.value}</div>
            )}
          </div>
          {question.answer.explanation && (
            <div className="answer-explanation">
              <div className="explanation-label">💡 Explanation</div>
              <div dangerouslySetInnerHTML={{ __html: renderLatex(getEnglishContent(question.answer.explanation)) }} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default QuestionCard
