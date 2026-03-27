import { useState, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { post } from '../../utils/apiClient'
import PracticeSetup from './PracticeSetup'
import PracticeQuestion from './PracticeQuestion'
import PracticeFeedback from './PracticeFeedback'
import PracticeSummary from './PracticeSummary'

/**
 * PracticeView — 练习流程编排器
 * 状态: setup → practicing → feedback → summary
 */
export default function PracticeView({ chapter, book, subject, embedded, onBack }) {
  const { user } = useAuth()
  const userId = user?.id

  const [phase, setPhase] = useState('setup')
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [userAnswer, setUserAnswer] = useState(null)
  const [roundResults, setRoundResults] = useState([])
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentDifficulty, setCurrentDifficulty] = useState('medium')
  const questionStartTime = useRef(Date.now())

  const chapterId = chapter?.id
  const chapterTitle = typeof chapter?.title === 'object'
    ? (chapter.title.en || chapter.title.zh)
    : chapter?.title

  const handleStart = async (difficulty) => {
    setLoading(true)
    setError(null)
    try {
      const keyPoints = Array.isArray(chapter?.keyPoints) ? chapter.keyPoints : []
      const formulas = Array.isArray(chapter?.formulas) ? chapter.formulas : []

      const body = {
        chapterId,
        difficulty,
        chapterTitle,
        chapterKeyPoints: keyPoints,
        chapterFormulas: formulas,
      }

      const data = await post('/api/practice/start', body)

      setQuestions(data.questions || data)
      setCurrentIndex(0)
      setRoundResults([])
      setScore({ correct: 0, total: 0 })
      setCurrentDifficulty(difficulty)
      questionStartTime.current = Date.now()
      setPhase('practicing')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAnswer = async (answer) => {
    setLoading(true)
    try {
      const q = questions[currentIndex]
      const timeSpent = Math.round((Date.now() - questionStartTime.current) / 1000)
      const data = await post('/api/practice/answer', {
        userId, questionId: q.id, answer, timeSpent,
      })

      const isCorrect = data.isCorrect
      setFeedback(data)
      setUserAnswer(answer)
      setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }))

      // 提取题目文本（兼容 object 和 string 格式）
      const contentObj = q.content
      const questionText = typeof contentObj === 'string'
        ? contentObj
        : (contentObj?.en || contentObj?.zh || '')

      setRoundResults(prev => [...prev, {
        questionId: q.id,
        questionText,
        tags: q.tags || [],
        isCorrect,
        answer,
        timeSpent,
      }])
      setPhase('feedback')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = async () => {
    if (currentIndex + 1 >= questions.length) {
      setLoading(true)
      try {
        const data = await post('/api/practice/summary', {
          chapterId,
          results: roundResults.concat([{
            questionId: questions[currentIndex].id,
            isCorrect: feedback.isCorrect,
          }]),
        })
        setRecommendations(data?.recommendations || [])
      } catch (e) {
        // 非关键操作，仍然显示 summary
      }
      setLoading(false)
      setPhase('summary')
    } else {
      setCurrentIndex(i => i + 1)
      setFeedback(null)
      setUserAnswer(null)
      questionStartTime.current = Date.now()
      setPhase('practicing')
    }
  }

  const handleAnotherRound = () => {
    setPhase('setup')
    setQuestions([])
    setFeedback(null)
    setUserAnswer(null)
  }

  // 推荐卡片点击 → 直接按推荐的难度开始新一轮
  const handleRecommendationStart = (rec) => {
    const diff = rec.difficulty || currentDifficulty
    handleStart(diff)
  }

  if (error) {
    return (
      <div style={{ maxWidth: 480, margin: '40px auto', padding: 24, textAlign: 'center' }}>
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <p style={{ color: '#DC2626', margin: 0 }}>{error}</p>
        </div>
        <button onClick={() => { setError(null); setPhase('setup') }}
          style={{ padding: '10px 24px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      {phase !== 'setup' && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 24px', background: '#fff', borderBottom: '1px solid #E2E8F0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#64748B' }}>
              Question <strong style={{ color: '#1E293B' }}>{currentIndex + 1}</strong> / {questions.length}
            </span>
            <div style={{ width: 120, height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${((currentIndex + (phase === 'feedback' ? 1 : 0)) / questions.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #1a73e8, #1967d2)', borderRadius: 3, transition: 'width 0.3s' }} />
            </div>
          </div>
          <span style={{ fontSize: 13, color: '#64748B' }}>
            Score: <strong style={{ color: '#16A34A' }}>{score.correct}</strong>/{score.total}
          </span>
        </div>
      )}

      {phase === 'setup' && (
        <PracticeSetup chapterTitle={chapterTitle} onStart={handleStart} loading={loading} />
      )}

      {phase === 'practicing' && questions[currentIndex] && (
        <PracticeQuestion question={questions[currentIndex]} onSubmit={handleSubmitAnswer} />
      )}

      {phase === 'feedback' && feedback && (
        <PracticeFeedback
          isCorrect={feedback.isCorrect}
          userAnswer={userAnswer}
          feedback={feedback}
          onNext={handleNext}
        />
      )}

      {phase === 'summary' && (
        <PracticeSummary
          score={score}
          results={roundResults}
          recommendations={recommendations}
          onAnotherRound={handleAnotherRound}
          onBack={onBack || (() => {})}
          onRecommendationStart={handleRecommendationStart}
        />
      )}
    </div>
  )
}
