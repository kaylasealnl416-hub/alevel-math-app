import React from 'react'
import '../../styles/AIFeedback.css'

/**
 * AIFeedback Component
 * Displays AI-generated feedback for exam performance.
 */
function AIFeedback({ feedback, loading }) {
  if (loading) {
    return (
      <div className="ai-feedback-container">
        <div className="ai-feedback-header">
          <div className="ai-icon">🤖</div>
          <h3>AI Feedback</h3>
        </div>
        <div className="ai-feedback-loading">
          <div className="loading-spinner"></div>
          <p>AI is analysing your exam performance...</p>
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
        <h3>AI Feedback</h3>
      </div>

      {overall && (
        <div className="feedback-section overall-section">
          <h4>📊 Overall Assessment</h4>
          <p className="overall-text">{overall}</p>
        </div>
      )}

      {strengths && strengths.length > 0 && (
        <div className="feedback-section strengths-section">
          <h4>💪 Your Strengths</h4>
          <ul className="strengths-list">
            {strengths.map((strength) => (
              <li key={strength} className="strength-item">
                <span className="check-icon">✓</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {weaknesses && weaknesses.length > 0 && (
        <div className="feedback-section weaknesses-section">
          <h4>🎯 Areas to Improve</h4>
          <div className="weaknesses-list">
            {weaknesses.map((weakness) => (
              <div key={weakness.topic} className="weakness-item">
                <div className="weakness-header">
                  <span className="weakness-icon">⚠️</span>
                  <strong>{weakness.topic}</strong>
                </div>
                <p className="weakness-reason">{weakness.reason}</p>
                <p className="weakness-suggestion">
                  <span className="suggestion-label">Suggestion: </span>
                  {weakness.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {suggestions && suggestions.length > 0 && (
        <div className="feedback-section suggestions-section">
          <h4>📚 Study Recommendations</h4>
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

function getSuggestionTypeLabel(type) {
  const labels = {
    study:    '📖 Study',
    practice: '✏️ Practice',
    review:   '🔄 Review',
    chapter:  '📚 Chapter',
    video:    '🎥 Video'
  }
  return labels[type] || type
}

function getPriorityLabel(priority) {
  if (priority >= 4) return 'High priority'
  if (priority >= 3) return 'Medium priority'
  return 'Low priority'
}

export default AIFeedback
