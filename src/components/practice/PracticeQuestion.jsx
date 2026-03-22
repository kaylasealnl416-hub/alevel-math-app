import { useState } from 'react'
import MathText from './MathText'

export default function PracticeQuestion({ question, onSubmit }) {
  const [selected, setSelected] = useState(null)

  const handleSubmit = () => {
    if (selected === null) return
    onSubmit(selected)
    setSelected(null)
  }

  const contentText = question.content?.en || question.content?.zh || (typeof question.content === 'string' ? question.content : '')

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 24px' }}>
      {/* Question card */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #E2E8F0', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <span style={{ background: '#e8f0fe', color: '#1967d2', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
            {question.type === 'multiple_choice' ? 'Single Choice' : question.type}
          </span>
          {(question.tags || []).slice(0, 2).map((tag, i) => (
            <span key={i} style={{ background: '#F0FDF4', color: '#16A34A', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
              {tag}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 16, color: '#1E293B', lineHeight: 1.7, fontWeight: 500 }}>
          <MathText text={contentText} />
        </div>
      </div>

      {/* Options */}
      {question.options && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {Object.entries(question.options).map(([letter, text]) => {
            const isSelected = selected === letter
            return (
              <button key={letter} onClick={() => setSelected(letter)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
                  background: isSelected ? '#e8f0fe' : '#fff',
                  border: `2px solid ${isSelected ? '#1a73e8' : '#E2E8F0'}`,
                  borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s',
                }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: isSelected ? '#1a73e8' : 'transparent',
                  border: `2px solid ${isSelected ? '#1a73e8' : '#CBD5E1'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: isSelected ? '#fff' : '#64748B', flexShrink: 0,
                }}>
                  {letter}
                </div>
                <span style={{ fontSize: 14, color: isSelected ? '#1E293B' : '#374151', fontWeight: isSelected ? 600 : 400 }}>
                  <MathText text={text} />
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Submit */}
      <button onClick={handleSubmit} disabled={selected === null}
        style={{
          width: '100%', padding: 14,
          background: selected !== null ? 'linear-gradient(135deg, #1a73e8, #1967d2)' : '#E2E8F0',
          color: selected !== null ? '#fff' : '#94A3B8',
          border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
          cursor: selected !== null ? 'pointer' : 'default', transition: 'all 0.2s',
        }}>
        Submit Answer
      </button>
    </div>
  )
}
