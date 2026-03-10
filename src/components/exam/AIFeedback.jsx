import React from 'react'
import '../../styles/AIFeedback.css'

/**
 * Phase 4 Day 8-9: AI Feedback Component
 *
 * Displays AI-generated feedback for exam performance:
 * - Overall evaluation
 * - Strengths and weaknesses
 * - Learning suggestions
 * - Encouragement message
 */

function AIFeedback({ feedback, loading }) {
  if (loading) {
    return (
      <div className="ai-feedback-container">
        <div className="ai-feedback-header">
          <div className="ai-icon">🤖</div>
          <h3>AI 智能点评</h3>
        </div>
        <div className="ai-feedback-loading">
          <div className="loading-spinner"></div>
          <p>AI 正在分析你的考试表现...</p>
        </div>
      </div>
    )
  }

  if (!feedback) {
    return null
  }

  const { overall, strengths, weaknesses, suggestions, encouragement } = feedback

  return (
    <div className="ai-feedback-container">
      <div className="ai-feedback-header">
        <div className="ai-icon">🤖</div>
        <h3>AI 智能点评</h3>
      </div>

      {/* Overall Evaluation */}
      {overall && (
        <div className="feedback-section overall-section">
          <h4>📊 整体评价</h4>
          <p className="overall-text">{overall}</p>
        </div>
      )}

      {/* Strengths */}
      {strengths && strengths.length > 0 && (
        <div className="feedback-section strengths-section">
          <h4>💪 你的优势</h4>
          <ul className="strengths-list">
            {strengths.map((strength, index) => (
              <li key={index} className="strength-item">
                <span className="check-icon">✓</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weaknesses */}
      {weaknesses && weaknesses.length > 0 && (
        <div className="feedback-section weaknesses-section">
          <h4>🎯 需要提升的地方</h4>
          <div className="weaknesses-list">
            {weaknesses.map((weakness, index) => (
              <div key={index} className="weakness-item">
                <div className="weakness-header">
                  <span className="weakness-icon">⚠️</span>
                  <strong>{weakness.topic}</strong>
                </div>
                <p className="weakness-reason">{weakness.reason}</p>
                <p className="weakness-suggestion">
                  <span className="suggestion-label">建议：</span>
                  {weakness.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="feedback-section suggestions-section">
          <h4>📚 学习建议</h4>
          <div className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="suggestion-item">
                <div className="suggestion-header">
                  <span className={`suggestion-type type-${suggestion.type}`}>
                    {getSuggestionTypeLabel(suggestion.type)}
                  </span>
                  <span className={`priority priority-${suggestion.priority}`}>
                    {getPriorityLabel(suggestion.priority)}
                  </span>
                </div>
                <p className="suggestion-description">{suggestion.description}</p>
                {suggestion.reason && (
                  <p className="suggestion-reason">
                    <span className="reason-icon">💡</span>
                    {suggestion.reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Encouragement */}
      {encouragement && (
        <div className="feedback-section encouragement-section">
          <div className="encouragement-content">
            <span className="encouragement-icon">🌟</span>
            <p className="encouragement-text">{encouragement}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper functions
function getSuggestionTypeLabel(type) {
  const labels = {
    study: '📖 学习',
    practice: '✏️ 练习',
    review: '🔄 复习',
    chapter: '📚 章节',
    video: '🎥 视频'
  }
  return labels[type] || type
}

function getPriorityLabel(priority) {
  if (priority >= 4) return '高优先级'
  if (priority >= 3) return '中优先级'
  return '低优先级'
}

export default AIFeedback
