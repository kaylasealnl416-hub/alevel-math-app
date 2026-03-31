import MathText from './MathText'

export default function PracticeFeedback({ isCorrect, userAnswer, feedback, onNext }) {
  const type = feedback.questionType || 'multiple_choice'

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 24px' }}>
      {/* Result banner */}
      <div style={{
        background: isCorrect
          ? 'linear-gradient(135deg, #F0FDF4, #DCFCE7)'
          : 'linear-gradient(135deg, #FEF2F2, #FEE2E2)',
        border: `1px solid ${isCorrect ? '#BBF7D0' : '#FECACA'}`,
        borderRadius: 14, padding: '20px 24px', marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          width: 48, height: 48,
          background: isCorrect ? '#16A34A' : '#DC2626',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ color: '#fff', fontSize: 24 }}>{isCorrect ? '✓' : '✗'}</span>
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: isCorrect ? '#166534' : '#991B1B' }}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </div>
          <div style={{ fontSize: 13, color: isCorrect ? '#4D7C0F' : '#B91C1C', marginTop: 2 }}>
            {type === 'short_answer'
              ? (isCorrect ? 'Good answer!' : 'See the model answer below.')
              : isCorrect
                ? `Your answer "${userAnswer}" is correct.`
                : <span>Your answer: "{userAnswer}" — correct answer: <MathText text={String(feedback.correctAnswer)} /></span>}
          </div>
        </div>
      </div>

      {/* Short answer: show model answer */}
      {type === 'short_answer' && feedback.correctAnswer && (
        <Section icon="📋" title="Model Answer" bg="#F0FDF4" borderColor="#BBF7D0" titleColor="#166534">
          <div style={{ whiteSpace: 'pre-line' }}><MathText text={feedback.correctAnswer} /></div>
        </Section>
      )}

      {/* Solution */}
      <Section icon="📝" title="Solution" bg="#F8FAFC" borderColor="#E2E8F0">
        <div style={{ whiteSpace: 'pre-line' }}><MathText text={feedback.solution} /></div>
      </Section>

      {/* Detailed explanation */}
      {feedback.deepExplanation && (
        <Section icon="💡" title="Detailed Explanation" bg="#e8f0fe" borderColor="#d2e3fc" titleColor="#185abc">
          <MathText text={feedback.deepExplanation} />
        </Section>
      )}

      {/* Why others wrong — MCQ only */}
      {type === 'multiple_choice' && !isCorrect && feedback.whyOthersWrong && Object.keys(feedback.whyOthersWrong).length > 0 && (
        <div style={{ background: '#fff', borderRadius: 14, border: '2px solid #FCA5A5', overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '14px 20px', background: '#FEF2F2', borderBottom: '1px solid #FECACA', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🔍</span>
            <span style={{ fontWeight: 700, color: '#991B1B', fontSize: 14 }}>Why Other Options Are Wrong</span>
          </div>
          <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {feedback.correctAnswer && (
              <OptionRow letter={feedback.correctAnswer} correct text="Correct answer" isUserChoice={false} />
            )}
            {Object.entries(feedback.whyOthersWrong).map(([letter, reason]) => (
              <OptionRow key={letter} letter={letter} correct={false} text={reason} isUserChoice={letter === userAnswer} />
            ))}
          </div>
        </div>
      )}

      {/* Key formula + Common mistake */}
      {(feedback.keyFormula || feedback.commonMistake) && (() => {
        const hasBoth = feedback.keyFormula && feedback.commonMistake
        return (
          <div style={{ display: 'grid', gridTemplateColumns: hasBoth ? '1fr 1fr' : '1fr', gap: 12, marginBottom: 20 }}>
            {feedback.keyFormula && (
              <div style={{ background: '#FFFBEB', borderRadius: 12, padding: 16, border: '1px solid #FDE68A' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 8 }}>🔑 Key Formula</div>
                <div style={{ fontSize: 13, color: '#78716C', lineHeight: 1.6 }}><MathText text={feedback.keyFormula} /></div>
              </div>
            )}
            {feedback.commonMistake && (
              <div style={{ background: '#FEF2F2', borderRadius: 12, padding: 16, border: '1px solid #FECACA' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#991B1B', marginBottom: 8 }}>⚠️ Common Mistake</div>
                <div style={{ fontSize: 13, color: '#78716C', lineHeight: 1.6 }}><MathText text={feedback.commonMistake} /></div>
              </div>
            )}
          </div>
        )
      })()}

      {/* Next button */}
      <button onClick={onNext}
        style={{
          width: '100%', padding: 14,
          background: 'linear-gradient(135deg, #1a73e8, #1967d2)',
          color: '#fff', border: 'none', borderRadius: 12,
          fontSize: 15, fontWeight: 700, cursor: 'pointer',
        }}>
        Next Question →
      </button>
    </div>
  )
}

function Section({ icon, title, bg, borderColor, titleColor = '#1E293B', children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: 16 }}>
      <div style={{ padding: '14px 20px', background: bg, borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>{icon}</span>
        <span style={{ fontWeight: 700, color: titleColor, fontSize: 14 }}>{title}</span>
      </div>
      <div style={{ padding: 20, fontSize: 14, color: '#374151', lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  )
}

function OptionRow({ letter, correct, text, isUserChoice }) {
  return (
    <div style={{
      display: 'flex', gap: 10, alignItems: 'flex-start',
      ...(isUserChoice ? { background: '#FFF1F2', padding: '8px 10px', borderRadius: 8, border: '1px solid #FFE4E6' } : {}),
    }}>
      <span style={{
        background: correct ? '#F0FDF4' : '#FEF2F2',
        color: correct ? '#16A34A' : '#DC2626',
        fontWeight: 700, padding: '2px 8px', borderRadius: 6, fontSize: 12, flexShrink: 0,
      }}>
        {letter} {correct ? '✓' : '✗'}
      </span>
      <span style={{ fontSize: 13, color: isUserChoice ? '#991B1B' : '#374151', lineHeight: 1.5 }}>
        {isUserChoice && <strong>Your choice — </strong>}{text}
      </span>
    </div>
  )
}
