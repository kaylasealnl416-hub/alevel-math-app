import React from 'react'
import { formatDuration } from '../../utils/helpers.js'

function ScoreCard({ totalScore, maxScore, correctCount, totalCount, timeSpent, percentage }) {
  const getGrade = (percent) => {
    if (percent >= 90) return { letter: 'A', color: '#188038', label: 'Excellent' }
    if (percent >= 80) return { letter: 'B', color: '#1a73e8', label: 'Good' }
    if (percent >= 70) return { letter: 'C', color: '#f9ab00', label: 'Satisfactory' }
    if (percent >= 60) return { letter: 'D', color: '#e37400', label: 'Pass' }
    return { letter: 'F', color: '#d93025', label: 'Fail' }
  }

  const grade = getGrade(percentage)

  const S = {
    card: {
      background: '#fff', border: '1px solid #dadce0', borderRadius: 8, padding: 28,
      marginBottom: 24,
    },
    main: {
      display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap',
    },
    circle: {
      width: 100, height: 100, borderRadius: '50%', border: `4px solid ${grade.color}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    },
    letter: { fontSize: 36, fontWeight: 700, color: grade.color, lineHeight: 1 },
    label: { fontSize: 11, color: '#5f6368', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.5px' },
    details: { flex: 1 },
    scoreRow: { display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 },
    scoreValue: { fontSize: 28, fontWeight: 700, color: '#202124' },
    scorePercent: { fontSize: 20, fontWeight: 600, color: grade.color },
    metrics: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
    metric: { display: 'flex', flexDirection: 'column', gap: 2 },
    metricLabel: { fontSize: 12, color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.5px' },
    metricValue: { fontSize: 16, fontWeight: 600, color: '#202124' },
    progressTrack: {
      height: 6, background: '#f1f3f4', borderRadius: 3, marginTop: 20, overflow: 'hidden',
    },
    progressBar: {
      height: '100%', borderRadius: 3, backgroundColor: grade.color,
      width: `${percentage}%`, transition: 'width 0.6s ease',
    },
  }

  return (
    <div style={S.card}>
      <div style={S.main}>
        <div style={S.circle}>
          <div style={S.letter}>{grade.letter}</div>
          <div style={S.label}>{grade.label}</div>
        </div>

        <div style={S.details}>
          <div style={S.scoreRow}>
            <span style={S.scoreValue}>
              {totalScore !== null ? totalScore : '-'} / {maxScore || '-'}
            </span>
            <span style={S.scorePercent}>{percentage}%</span>
          </div>

          <div style={S.metrics}>
            <div style={S.metric}>
              <span style={S.metricLabel}>Correct</span>
              <span style={S.metricValue}>{correctCount || 0} / {totalCount || 0}</span>
            </div>
            <div style={S.metric}>
              <span style={S.metricLabel}>Time</span>
              <span style={S.metricValue}>{formatDuration(timeSpent)}</span>
            </div>
            <div style={S.metric}>
              <span style={S.metricLabel}>Accuracy</span>
              <span style={S.metricValue}>{percentage}%</span>
            </div>
          </div>
        </div>
      </div>

      <div style={S.progressTrack}>
        <div style={S.progressBar} />
      </div>
    </div>
  )
}

export default ScoreCard
