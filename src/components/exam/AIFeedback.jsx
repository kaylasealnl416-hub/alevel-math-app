import React from 'react'

function AIFeedback({ feedback, loading }) {
  const S = {
    container: {
      background: '#fff', border: '1px solid #dadce0', borderRadius: 8,
      padding: 24, marginBottom: 24,
    },
    header: {
      display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
      paddingBottom: 12, borderBottom: '1px solid #f1f3f4',
    },
    icon: { fontSize: 24 },
    title: { fontSize: 16, fontWeight: 500, color: '#202124', margin: 0 },
    loadingWrap: {
      display: 'flex', alignItems: 'center', gap: 12, padding: '20px 0',
    },
    spinner: {
      width: 20, height: 20, border: '2px solid #dadce0', borderTopColor: '#1a73e8',
      borderRadius: '50%', animation: 'spin 0.8s linear infinite',
    },
    loadingText: { fontSize: 14, color: '#5f6368', margin: 0 },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 14, fontWeight: 500, color: '#202124', margin: '0 0 10px' },
    overallText: { fontSize: 14, color: '#5f6368', lineHeight: 1.6, margin: 0 },
    list: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 },
    strengthItem: {
      display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: '#202124',
    },
    check: { color: '#188038', fontWeight: 600, flexShrink: 0 },
    weaknessCard: {
      background: '#f8f9fa', border: '1px solid #f1f3f4', borderRadius: 8, padding: 14,
    },
    weaknessHeader: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 },
    weaknessTitle: { fontSize: 14, fontWeight: 500, color: '#202124', margin: 0 },
    weaknessText: { fontSize: 13, color: '#5f6368', margin: '0 0 4px' },
    suggestionLabel: { fontSize: 13, color: '#1a73e8', fontWeight: 500 },
    suggestionCard: {
      background: '#f8f9fa', border: '1px solid #f1f3f4', borderRadius: 8, padding: 14,
    },
    suggestionHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' },
    typeBadge: (type) => {
      const colors = {
        study: { bg: '#e8f0fe', color: '#185abc' },
        practice: { bg: '#e6f4ea', color: '#0d652d' },
        review: { bg: '#fef7e0', color: '#e37400' },
        chapter: { bg: '#e8f0fe', color: '#185abc' },
        video: { bg: '#fce8e6', color: '#a50e0e' },
      }
      const c = colors[type] || colors.study
      return {
        padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
        background: c.bg, color: c.color,
      }
    },
    priorityBadge: (priority) => ({
      padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 500,
      background: priority >= 4 ? '#fce8e6' : priority >= 3 ? '#fef7e0' : '#f1f3f4',
      color: priority >= 4 ? '#d93025' : priority >= 3 ? '#e37400' : '#5f6368',
    }),
    suggestionDesc: { fontSize: 13, color: '#202124', margin: '0 0 4px' },
    suggestionReason: { fontSize: 13, color: '#5f6368', margin: 0, display: 'flex', alignItems: 'flex-start', gap: 4 },
    encouragement: {
      display: 'flex', alignItems: 'flex-start', gap: 10, background: '#e6f4ea',
      borderRadius: 8, padding: 16,
    },
    encourageIcon: { fontSize: 20, flexShrink: 0 },
    encourageText: { fontSize: 14, color: '#0d652d', lineHeight: 1.5, margin: 0 },
  }

  if (loading) {
    return (
      <div style={S.container}>
        <div style={S.header}>
          <span style={S.icon}>🤖</span>
          <h3 style={S.title}>AI Feedback</h3>
        </div>
        <div style={S.loadingWrap}>
          <div style={S.spinner} />
          <p style={S.loadingText}>AI is analysing your exam performance...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!feedback) return null

  const { overall, strengths, weaknesses, suggestions, encouragement } = feedback

  const getSuggestionTypeLabel = (type) => {
    const labels = { study: 'Study', practice: 'Practice', review: 'Review', chapter: 'Chapter', video: 'Video' }
    return labels[type] || type
  }

  const getPriorityLabel = (priority) => {
    if (priority >= 4) return 'High'
    if (priority >= 3) return 'Medium'
    return 'Low'
  }

  return (
    <div style={S.container}>
      <div style={S.header}>
        <span style={S.icon}>🤖</span>
        <h3 style={S.title}>AI Feedback</h3>
      </div>

      {overall && (
        <div style={S.section}>
          <h4 style={S.sectionTitle}>Overall Assessment</h4>
          <p style={S.overallText}>{overall}</p>
        </div>
      )}

      {strengths && strengths.length > 0 && (
        <div style={S.section}>
          <h4 style={S.sectionTitle}>Your Strengths</h4>
          <ul style={S.list}>
            {strengths.map((s) => (
              <li key={s} style={S.strengthItem}>
                <span style={S.check}>✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {weaknesses && weaknesses.length > 0 && (
        <div style={S.section}>
          <h4 style={S.sectionTitle}>Areas to Improve</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {weaknesses.map((w) => (
              <div key={w.topic} style={S.weaknessCard}>
                <div style={S.weaknessHeader}>
                  <span>⚠️</span>
                  <strong style={S.weaknessTitle}>{w.topic}</strong>
                </div>
                <p style={S.weaknessText}>{w.reason}</p>
                <p style={{ ...S.weaknessText, margin: 0 }}>
                  <span style={S.suggestionLabel}>Suggestion: </span>
                  {w.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {suggestions && suggestions.length > 0 && (
        <div style={S.section}>
          <h4 style={S.sectionTitle}>Study Recommendations</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {suggestions.map((s, i) => (
              <div key={i} style={S.suggestionCard}>
                <div style={S.suggestionHeader}>
                  <span style={S.typeBadge(s.type)}>{getSuggestionTypeLabel(s.type)}</span>
                  <span style={S.priorityBadge(s.priority)}>{getPriorityLabel(s.priority)}</span>
                </div>
                <p style={S.suggestionDesc}>{s.description}</p>
                {s.reason && (
                  <p style={S.suggestionReason}>
                    <span>💡</span>
                    <span>{s.reason}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {encouragement && (
        <div style={S.encouragement}>
          <span style={S.encourageIcon}>🌟</span>
          <p style={S.encourageText}>{encouragement}</p>
        </div>
      )}
    </div>
  )
}

export default AIFeedback
