// ============================================================
// ProgressBar Component
// Displays question progress during an exam
// ============================================================

import React from 'react'
import '../styles/ProgressBar.css'

const ProgressBar = ({ current, total, answered = 0 }) => {
  const progress = (current / total) * 100
  const answeredProgress = (answered / total) * 100

  return (
    <div className="progress-bar-container">
      <div className="progress-info">
        <div className="progress-text">
          <span className="progress-current">{current}</span>
          <span className="progress-separator">/</span>
          <span className="progress-total">{total}</span>
        </div>
        <div className="progress-stats">
          <span className="stat-item">✅ Answered: {answered}</span>
          <span className="stat-item">⏭️ Remaining: {total - answered}</span>
        </div>
      </div>
      <div className="progress-bar">
        <div
          className="progress-bar-fill current"
          style={{ width: `${progress}%` }}
        />
        <div
          className="progress-bar-fill answered"
          style={{ width: `${answeredProgress}%` }}
        />
      </div>
      <div className="progress-percentage">
        {Math.round(answeredProgress)}% complete
      </div>
    </div>
  )
}

export default ProgressBar
