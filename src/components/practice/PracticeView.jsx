import { useState, useRef, useEffect } from 'react'
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
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const questionStartTime = useRef(Date.now())
  const roundStartTime = useRef(null)
  const timerRef = useRef(null)

  const chapterId = chapter?.id
  const chapterTitle = typeof chapter?.title === 'object'
    ? (chapter.title.en || chapter.title.zh)
    : chapter?.title

  // 计时器：练习中每秒更新
  useEffect(() => {
    if (phase === 'practicing' || phase === 'feedback') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.round((Date.now() - roundStartTime.current) / 1000))
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [phase])

  // 离开警告：答题中途导航离开时提示
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (phase === 'practicing' || phase === 'feedback') {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [phase])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const handleStart = async (difficulty, questionCount = 5) => {
    setLoading(true)
    setError(null)
    try {
      const keyPoints = Array.isArray(chapter?.keyPoints) ? chapter.keyPoints : []
      const formulas = Array.isArray(chapter?.formulas) ? chapter.formulas : []

      const body = {
        chapterId,
        difficulty,
        count: questionCount,
        chapterTitle,
        chapterKeyPoints: keyPoints,
        chapterFormulas: formulas,
        chapterHardPoints: chapter?.hardPoints || '',
        chapterExamTips: chapter?.examTips || '',
        subject: subject || 'mathematics',
      }

      const data = await post('/api/practice/start', body)

      // 提示用户题量不足
      if (data.insufficient) {
        const { default: Toast } = await import('../common/Toast')
        Toast.info(`题库暂时只有 ${data.roundSize} 道题，不足 ${questionCount} 道`)
      }

      setQuestions(data.questions || data)
      setCurrentIndex(0)
      setRoundResults([])
      setScore({ correct: 0, total: 0 })
      setCurrentDifficulty(difficulty)
      setElapsedSeconds(0)
      roundStartTime.current = Date.now()
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
      const needsReview = data.needsReview || false
      setFeedback(data)
      setUserAnswer(answer)
      // 主观题（isCorrect === null）不计入正确/错误/总数统计
      if (isCorrect !== null) {
        setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }))
      }

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
    setElapsedSeconds(0)
  }

  const handleRecommendationStart = (rec) => {
    const diff = rec.difficulty || currentDifficulty
    const count = rec.count || 5

    // 如果推荐的是不同章节，通过 URL 导航（PracticePage 从 URL 参数初始化）
    if (rec.chapterId && rec.chapterId !== chapterId) {
      const params = new URLSearchParams({
        chapter: rec.chapterId,
        difficulty: diff,
        count: String(count),
        subject: subject || 'mathematics',
      })
      window.location.href = `/practice?${params.toString()}`
      return
    }

    handleStart(diff, count)
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* 计时器 */}
            <span style={{ fontSize: 13, color: '#64748B', fontVariantNumeric: 'tabular-nums' }}>
              ⏱ {formatTime(elapsedSeconds)}
            </span>
            <span style={{ fontSize: 13, color: '#64748B' }}>
              Score: <strong style={{ color: '#16A34A' }}>{score.correct}</strong>/{score.total}
            </span>
          </div>
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
