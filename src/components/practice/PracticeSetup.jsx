import { useState } from 'react'

const DIFFICULTY_INFO = {
  easy: { label: 'Easy', desc: 'Basic concepts and straightforward calculations', color: '#16A34A', bg: '#F0FDF4' },
  medium: { label: 'Medium', desc: 'Standard exam-level questions', color: '#D97706', bg: '#FFFBEB' },
  hard: { label: 'Hard', desc: 'Challenging multi-step problems', color: '#DC2626', bg: '#FEF2F2' },
}

export default function PracticeSetup({ chapterTitle, onStart, loading }) {
  const [difficulty, setDifficulty] = useState('medium')

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
      <div style={{
        width: 56, height: 56, background: 'linear-gradient(135deg, #1a73e8, #1967d2)',
        borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px', boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
        fontSize: 28,
      }}>
        ✏️
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1E293B', margin: '0 0 6px' }}>Topic Practice</h2>
      <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 28px' }}>
        5 questions per round · Instant feedback
      </p>

      {chapterTitle && (
        <div style={{
          fontSize: 14, color: '#1a73e8', fontWeight: 600, marginBottom: 24,
          padding: '8px 16px', background: '#e8f0fe', borderRadius: 8, display: 'inline-block',
        }}>
          {chapterTitle}
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 12 }}>Difficulty</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {Object.entries(DIFFICULTY_INFO).map(([key, info]) => (
            <button key={key} onClick={() => setDifficulty(key)} style={{
              padding: '10px 24px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, transition: 'all 0.15s',
              background: difficulty === key ? '#1a73e8' : '#F1F5F9',
              color: difficulty === key ? '#fff' : '#64748B',
            }}>
              {info.label}
            </button>
          ))}
        </div>
        {/* 难度说明 */}
        <div style={{
          marginTop: 10, padding: '6px 14px', borderRadius: 8, fontSize: 12,
          color: DIFFICULTY_INFO[difficulty].color,
          background: DIFFICULTY_INFO[difficulty].bg,
          display: 'inline-block', transition: 'all 0.15s',
        }}>
          {DIFFICULTY_INFO[difficulty].desc}
        </div>
      </div>

      <button onClick={() => onStart(difficulty)} disabled={loading} style={{
        width: '100%', padding: 14,
        background: loading ? '#E2E8F0' : 'linear-gradient(135deg, #1a73e8, #1967d2)',
        color: loading ? '#94A3B8' : '#fff',
        border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
        cursor: loading ? 'default' : 'pointer',
      }}>
        {loading ? 'Generating questions, please wait...' : 'Start Practice →'}
      </button>

      {loading && (
        <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 10 }}>
          AI is creating questions for you, this may take 10-20 seconds
        </p>
      )}
    </div>
  )
}
