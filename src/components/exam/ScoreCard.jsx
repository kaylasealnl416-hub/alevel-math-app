import React from 'react'
import '../../styles/ScoreCard.css'

/**
 * ScoreCard Component
 * Displays exam score and key metrics in an attractive card
 */

function ScoreCard({ totalScore, maxScore, correctCount, totalCount, timeSpent, percentage }) {
  const getGrade = (percent) => {
    if (percent >= 90) return { letter: 'A', color: '#10b981', label: 'Excellent' }
    if (percent >= 80) return { letter: 'B', color: '#3b82f6', label: 'Good' }
    if (percent >= 70) return { letter: 'C', color: '#f59e0b', label: 'Satisfactory' }
    if (percent >= 60) return { letter: 'D', color: '#ef4444', label: 'Pass' }
    return { letter: 'F', color: '#991b1b', label: 'Fail' }
  }

  const formatTime = (seconds) => {
    if (!seconds) return '0:00'
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const grade = getGrade(percentage)

  return (
    <div className="score-card">
      <div className="score-card-main">
        {/* Grade Circle */}
        <div className="grade-circle" style={{ borderColor: grade.color }}>
          <div className="grade-letter" style={{ color: grade.color }}>
            {grade.letter}
          </div>
          <div className="grade-label">{grade.label}</div>
        </div>

        {/* Score Details */}
        <div className="score-details">
          <div className="score-primary">
            <div className="score-value">
              {totalScore !== null ? totalScore : '-'} / {maxScore || '-'}
            </div>
            <div className="score-percentage" style={{ color: grade.color }}>
              {percentage}%
            </div>
          </div>

          <div className="score-metrics">
            <div className="metric">
              <span className="metric-label">Correct:</span>
              <span className="metric-value">{correctCount || 0} / {totalCount || 0}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Time:</span>
              <span className="metric-value">{formatTime(timeSpent)}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Accuracy:</span>
              <span className="metric-value">{percentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="score-progress">
        <div
          className="score-progress-bar"
          style={{
            width: `${percentage}%`,
            backgroundColor: grade.color
          }}
        />
      </div>
    </div>
  )
}

export default ScoreCard
