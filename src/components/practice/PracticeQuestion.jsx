import { useState } from 'react'
import MathText from './MathText'

const TYPE_LABELS = {
  multiple_choice: 'Single Choice',
  calculation: 'Calculation',
  short_answer: 'Short Answer',
}

export default function PracticeQuestion({ question, onSubmit }) {
  const [selected, setSelected] = useState(null)   // MCQ
  const [inputVal, setInputVal] = useState('')      // calculation / short_answer

  const type = question.type || 'multiple_choice'
  const contentText = question.content?.en || question.content?.zh || (typeof question.content === 'string' ? question.content : '')

  const canSubmit = type === 'multiple_choice' ? selected !== null : inputVal.trim() !== ''

  const handleSubmit = () => {
    if (!canSubmit) return
    const answer = type === 'multiple_choice' ? selected : inputVal.trim()
    onSubmit(answer)
    setSelected(null)
    setInputVal('')
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 24px' }}>
      {/* Question card */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #E2E8F0', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <span style={{ background: '#e8f0fe', color: '#1967d2', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
            {TYPE_LABELS[type] || type}
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

      {/* MCQ options */}
      {type === 'multiple_choice' && question.options && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {Object.entries(question.options).map(([letter, text]) => {
            const isSelected = selected === letter
            return (
              <button key={letter} onClick={() => setSelected(letter)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
                  background: isSelected ? '#e8f0fe' : '#fff',
                  border: `2px solid ${isSelected ? '#1a73e8' : '#E2E8F0'}`,
                  borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
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

      {/* Calculation input */}
      {type === 'calculation' && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8, fontWeight: 600 }}>
            Enter your numerical answer (include units if required)
          </div>
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="e.g. 3.14 or 2x + 1"
            style={{
              width: '100%', padding: '14px 16px', fontSize: 16,
              border: '2px solid #E2E8F0', borderRadius: 12, outline: 'none',
              fontFamily: 'monospace', boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = '#1a73e8'}
            onBlur={e => e.target.style.borderColor = '#E2E8F0'}
          />
        </div>
      )}

      {/* Short answer input */}
      {type === 'short_answer' && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8, fontWeight: 600 }}>
            Write your answer (2–4 sentences)
          </div>
          <textarea
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Type your answer here..."
            rows={4}
            style={{
              width: '100%', padding: '14px 16px', fontSize: 14,
              border: '2px solid #E2E8F0', borderRadius: 12, outline: 'none',
              resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = '#1a73e8'}
            onBlur={e => e.target.style.borderColor = '#E2E8F0'}
          />
        </div>
      )}

      {/* Submit */}
      <button onClick={handleSubmit} disabled={!canSubmit}
        style={{
          width: '100%', padding: 14,
          background: canSubmit ? 'linear-gradient(135deg, #1a73e8, #1967d2)' : '#E2E8F0',
          color: canSubmit ? '#fff' : '#94A3B8',
          border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
          cursor: canSubmit ? 'pointer' : 'default', transition: 'all 0.2s',
        }}>
        Submit Answer
      </button>
    </div>
  )
}
