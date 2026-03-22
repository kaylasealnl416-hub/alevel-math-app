import MathText from './MathText'

export default function PracticeSummary({ score, results, recommendations, onAnotherRound, onBack, onRecommendationStart }) {
  const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0
  const totalTime = results.reduce((sum, r) => sum + (r.timeSpent || 0), 0)

  // 根据成绩给出不同鼓励语
  const getMessage = () => {
    if (percentage === 100) return { text: 'Perfect score! Excellent work!', color: '#16A34A' }
    if (percentage >= 80) return { text: 'Great job! Almost perfect!', color: '#1967d2' }
    if (percentage >= 60) return { text: 'Good effort! Keep practicing!', color: '#D97706' }
    return { text: "Don't give up! Practice makes perfect!", color: '#DC2626' }
  }
  const msg = getMessage()

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px' }}>
      {/* Score card */}
      <div style={{
        background: 'linear-gradient(135deg, #185abc, #1a73e8)', borderRadius: 20,
        padding: 36, textAlign: 'center', marginBottom: 28, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />

        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>This Round</div>
        <div style={{ fontSize: 56, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{score.correct}/{score.total}</div>
        <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', marginTop: 8, fontWeight: 600 }}>{percentage}% Correct</div>

        {/* 鼓励语 */}
        <div style={{ fontSize: 13, color: '#FDE68A', marginTop: 10, fontWeight: 500 }}>{msg.text}</div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{score.correct}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Correct</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#FCA5A5' }}>{score.total - score.correct}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Wrong</div>
          </div>
          {totalTime > 0 && (
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{formatTime(totalTime)}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Time</div>
            </div>
          )}
        </div>
      </div>

      {/* Question review */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '16px 20px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontWeight: 700, color: '#1E293B', fontSize: 14 }}>
          Question Review
        </div>
        {results.map((r, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
            borderBottom: i < results.length - 1 ? '1px solid #F1F5F9' : 'none',
            background: r.isCorrect ? 'transparent' : '#FFF5F5',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: r.isCorrect ? '#F0FDF4' : '#FEF2F2',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ color: r.isCorrect ? '#16A34A' : '#DC2626', fontSize: 14, fontWeight: 700 }}>
                {r.isCorrect ? '✓' : '✗'}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: '#1E293B', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Q{i + 1}: <MathText text={r.questionText || 'Question'} />
              </div>
              <div style={{ fontSize: 11, color: r.isCorrect ? '#94A3B8' : '#B91C1C', marginTop: 2 }}>
                {(r.tags || []).join(', ')}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <span style={{ fontSize: 12, color: r.isCorrect ? '#16A34A' : '#DC2626', fontWeight: 600 }}>
                {r.isCorrect ? 'Correct' : 'Wrong'}
              </span>
              {r.timeSpent > 0 && (
                <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{r.timeSpent}s</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <button onClick={onAnotherRound} style={{
          flex: 1, padding: 14,
          background: 'linear-gradient(135deg, #1a73e8, #1967d2)',
          color: '#fff', border: 'none', borderRadius: 12,
          fontSize: 15, fontWeight: 700, cursor: 'pointer',
        }}>
          Another Round →
        </button>
        <button onClick={onBack} style={{
          flex: 1, padding: 14, background: '#fff', color: '#64748B',
          border: '1px solid #E2E8F0', borderRadius: 12,
          fontSize: 15, fontWeight: 600, cursor: 'pointer',
        }}>
          Back to Learn
        </button>
      </div>

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📚</span>
            <span style={{ fontWeight: 700, color: '#1E293B', fontSize: 14 }}>Recommended Practice</span>
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recommendations.map((rec, i) => (
              <RecCard key={i} rec={rec} onClick={() => onRecommendationStart?.(rec)} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function formatTime(seconds) {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}m${s}s` : `${m}m`
}

const REC_STYLES = {
  redo_topic: { bg: '#FFF5F5', border: '#FEE2E2', icon: '🎯', iconBg: '#FEF2F2', color: '#DC2626' },
  review_previous: { bg: '#F8FAFC', border: '#E2E8F0', icon: '⬅️', iconBg: '#e8f0fe', color: '#1a73e8' },
  challenge: { bg: '#F8FAFC', border: '#E2E8F0', icon: '🔥', iconBg: '#F5F3FF', color: '#8B5CF6' },
}

function RecCard({ rec, onClick }) {
  const s = REC_STYLES[rec.type] || REC_STYLES.challenge
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
      background: s.bg, borderRadius: 12, border: `1px solid ${s.border}`, cursor: 'pointer',
      transition: 'transform 0.1s',
    }}
    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{ width: 36, height: 36, background: s.iconBg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>
        {s.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: rec.type === 'redo_topic' ? '#991B1B' : '#1E293B' }}>{rec.title}</div>
        <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{rec.description}</div>
      </div>
      <span style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>Start →</span>
    </div>
  )
}
