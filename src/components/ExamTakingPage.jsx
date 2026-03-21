import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import QuestionCard from './QuestionCard'
import AnswerInput from './AnswerInput'
import Loading from './common/Loading'
import { Button } from './ui'
import { get, put, post } from '../utils/apiClient'
import { formatDuration } from '../utils/helpers.js'

function ExamTakingPage() {
  const { examId } = useParams()
  const navigate = useNavigate()

  const [exam, setExam] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [markedQuestions, setMarkedQuestions] = useState([])
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)

  const autoSaveTimerRef = useRef(null)
  const countdownTimerRef = useRef(null)
  const lastAnswerRef = useRef({})
  const isMountedRef = useRef(true)

  useEffect(() => {
    fetchExamDetail()
    setupVisibilityDetection()

    return () => {
      isMountedRef.current = false
      clearInterval(autoSaveTimerRef.current)
      clearInterval(countdownTimerRef.current)
    }
  }, [examId])

  useEffect(() => {
    if (exam && exam.timeLimit) {
      startCountdown()
    }
  }, [exam])

  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current)
    }

    autoSaveTimerRef.current = setInterval(() => {
      autoSaveAnswers()
    }, 30000)

    return () => clearInterval(autoSaveTimerRef.current)
  }, [answers])

  const fetchExamDetail = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await get(`/api/exams/${examId}`)

      setExam(result)
      setQuestions(result.questionSet.questions)
      setAnswers(result.answers || {})
      setMarkedQuestions(result.markedQuestions || [])

      if (result.timeLimit) {
        const elapsed = Math.floor((new Date() - new Date(result.startedAt)) / 1000)
        const remaining = Math.max(0, result.timeLimit - elapsed)
        setTimeRemaining(remaining)
      }
    } catch (err) {
      console.error('Failed to fetch exam details:', err)
      setError(err.message || 'Failed to load exam details. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const startCountdown = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current)
    }

    countdownTimerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleAutoSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const setupVisibilityDetection = () => {
    const handleVisibilityChange = () => {
      if (document.hidden) recordCheatingEvent('focus_lost')
    }

    const handleBlur = () => {
      recordCheatingEvent('tab_switch')
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
    }
  }

  const recordCheatingEvent = async (type) => {
    try {
      await post(`/api/exams/${examId}/focus-lost`, { type }, { showErrorToast: false })
    } catch (err) {
      console.error('Failed to record cheating event:', err)
    }
  }

  const autoSaveAnswers = async () => {
    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion) return

    const currentAnswer = answers[currentQuestion.id]
    const lastAnswer = lastAnswerRef.current[currentQuestion.id]

    if (JSON.stringify(currentAnswer) === JSON.stringify(lastAnswer)) return

    try {
      if (isMountedRef.current) setAutoSaving(true)
      await saveAnswer(currentQuestion.id, currentAnswer)
      lastAnswerRef.current[currentQuestion.id] = currentAnswer
    } catch (err) {
      console.error('Auto-save failed:', err)
    } finally {
      if (isMountedRef.current) setAutoSaving(false)
    }
  }

  const saveAnswer = async (questionId, answer) => {
    await put(`/api/exams/${examId}/answers`, { questionId, answer }, { showErrorToast: false })
  }

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleMarkQuestion = async (questionId) => {
    const isMarked = markedQuestions.includes(questionId)

    try {
      await put(`/api/exams/${examId}/mark`, { questionId, marked: !isMarked }, { showErrorToast: false })
      setMarkedQuestions((prev) =>
        isMarked ? prev.filter((id) => id !== questionId) : [...prev, questionId]
      )
    } catch (err) {
      console.error('Failed to mark question:', err)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1)
  }

  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index)
  }

  const handleSubmit = () => {
    setShowSubmitDialog(true)
  }

  const handleConfirmSubmit = async () => {
    try {
      const currentQuestion = questions[currentQuestionIndex]
      if (currentQuestion && answers[currentQuestion.id]) {
        await saveAnswer(currentQuestion.id, answers[currentQuestion.id])
      }

      await post(`/api/exams/${examId}/submit`, {}, { showErrorToast: false })
      navigate(`/exams/${examId}/result`)
    } catch (err) {
      console.error('Failed to submit exam:', err)
      alert('Submission failed: ' + err.message)
    }
  }

  const handleAutoSubmit = async () => {
    try {
      await post(`/api/exams/${examId}/submit`, {}, { showErrorToast: false })
      alert('Time is up. Exam has been automatically submitted.')
      navigate(`/exams/${examId}/result`)
    } catch (err) {
      console.error('Auto-submit failed:', err)
    }
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).filter((key) => answers[key] !== undefined && answers[key] !== null).length
  }

  const getQuestionStatus = (questionId) => {
    if (answers[questionId] !== undefined && answers[questionId] !== null) return 'answered'
    if (markedQuestions.includes(questionId)) return 'marked'
    return 'unanswered'
  }

  if (loading) return <Loading message="Loading exam..." size="large" fullScreen />

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #dadce0', borderRadius: 8, padding: 32, textAlign: 'center', maxWidth: 400 }}>
          <p style={{ color: '#c5221f', fontSize: 14, marginBottom: 16 }}>{error}</p>
          <Button variant="primary" size="md" onClick={() => navigate('/exams')}>Back to Exam List</Button>
        </div>
      </div>
    )
  }

  if (!exam || questions.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #dadce0', borderRadius: 8, padding: 32, textAlign: 'center', maxWidth: 400 }}>
          <p style={{ color: '#5f6368', fontSize: 14, marginBottom: 16 }}>Exam not found or no questions available</p>
          <Button variant="primary" size="md" onClick={() => navigate('/exams')}>Back to Exam List</Button>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isTimeWarning = timeRemaining !== null && timeRemaining < 300

  const S = {
    page: { minHeight: '100vh', background: '#f8f9fa' },
    header: {
      background: '#fff', borderBottom: '1px solid #dadce0', padding: '12px 24px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      position: 'sticky', top: 0, zIndex: 10,
    },
    headerTitle: { fontSize: 16, fontWeight: 500, color: '#202124', margin: 0 },
    modeBadge: {
      display: 'inline-block', padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 500,
      background: '#e8f0fe', color: '#185abc', marginLeft: 10,
    },
    stats: { display: 'flex', alignItems: 'center', gap: 16 },
    timer: {
      display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
      borderRadius: 8, fontSize: 14, fontWeight: 600,
      background: isTimeWarning ? '#fce8e6' : '#e6f4ea',
      color: isTimeWarning ? '#d93025' : '#188038',
    },
    progress: {
      fontSize: 14, color: '#5f6368', padding: '6px 12px',
      background: '#f1f3f4', borderRadius: 8,
    },
    autoSave: { fontSize: 12, color: '#80868b' },
    content: {
      maxWidth: 1200, margin: '0 auto', padding: '24px',
      display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24,
    },
    questionArea: { display: 'flex', flexDirection: 'column', gap: 20 },
    questionHeader: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    questionNum: { fontSize: 14, fontWeight: 500, color: '#5f6368' },
    markBtn: (isMarked) => ({
      padding: '6px 14px', borderRadius: 8, border: '1px solid #dadce0', fontSize: 13,
      cursor: 'pointer', transition: 'all 0.15s',
      background: isMarked ? '#fef7e0' : '#fff',
      color: isMarked ? '#e37400' : '#5f6368',
      borderColor: isMarked ? '#fdd663' : '#dadce0',
    }),
    navRow: { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' },
    answerSheet: {
      background: '#fff', border: '1px solid #dadce0', borderRadius: 8,
      padding: 20, height: 'fit-content', position: 'sticky', top: 80,
    },
    sheetTitle: { fontSize: 15, fontWeight: 500, color: '#202124', margin: '0 0 16px' },
    sheetGrid: {
      display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 20,
    },
    sheetItem: (status, isCurrent) => {
      const base = {
        width: 40, height: 40, borderRadius: 8, border: '2px solid',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
        position: 'relative',
      }
      if (isCurrent) return { ...base, background: '#1a73e8', color: '#fff', borderColor: '#1a73e8' }
      if (status === 'answered') return { ...base, background: '#e6f4ea', color: '#0d652d', borderColor: '#81c995' }
      if (status === 'marked') return { ...base, background: '#fef7e0', color: '#e37400', borderColor: '#fdd663' }
      return { ...base, background: '#fff', color: '#5f6368', borderColor: '#dadce0' }
    },
    legend: { display: 'flex', flexDirection: 'column', gap: 8 },
    legendItem: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#5f6368' },
    legendDot: (color) => ({
      width: 12, height: 12, borderRadius: 3, background: color, border: '1px solid',
      borderColor: color === '#fff' ? '#dadce0' : color,
    }),
    overlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100,
    },
    dialog: {
      background: '#fff', borderRadius: 12, padding: 32, maxWidth: 420, width: '90%',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    },
    dialogTitle: { fontSize: 18, fontWeight: 500, color: '#202124', margin: '0 0 16px' },
    dialogText: { fontSize: 14, color: '#5f6368', margin: '0 0 8px' },
    dialogWarning: { fontSize: 14, color: '#d93025', fontWeight: 500, margin: '0 0 8px' },
    dialogActions: { display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' },
  }

  return (
    <div style={S.page}>
      {/* Top bar */}
      <div style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h2 style={S.headerTitle}>{exam.questionSet.title}</h2>
          <span style={S.modeBadge}>{exam.mode === 'exam' ? 'Exam Mode' : 'Practice Mode'}</span>
        </div>

        <div style={S.stats}>
          {timeRemaining !== null && (
            <div style={S.timer}>
              <span>{formatDuration(timeRemaining)}</span>
            </div>
          )}

          <div style={S.progress}>
            {getAnsweredCount()}/{questions.length}
          </div>

          {autoSaving && <span style={S.autoSave}>Saving...</span>}
        </div>
      </div>

      <div style={S.content}>
        {/* Left: Question area */}
        <div style={S.questionArea}>
          <div style={{ background: '#fff', border: '1px solid #dadce0', borderRadius: 8, padding: 24 }}>
            <div style={S.questionHeader}>
              <span style={S.questionNum}>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <button
                style={S.markBtn(markedQuestions.includes(currentQuestion.id))}
                onClick={() => handleMarkQuestion(currentQuestion.id)}
              >
                {markedQuestions.includes(currentQuestion.id) ? '★ Marked' : '☆ Mark'}
              </button>
            </div>

            <div style={{ margin: '16px 0' }}>
              <QuestionCard question={currentQuestion} showAnswer={false} />
            </div>

            <AnswerInput
              question={currentQuestion}
              value={answers[currentQuestion.id]}
              onChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
            />
          </div>

          <div style={S.navRow}>
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next
            </Button>

            <div style={{ marginLeft: 'auto' }}>
              <Button variant="primary" size="md" onClick={handleSubmit}>
                Submit Exam
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Answer sheet */}
        <div style={S.answerSheet}>
          <h3 style={S.sheetTitle}>Answer Sheet</h3>
          <div style={S.sheetGrid}>
            {questions.map((q, index) => {
              const status = getQuestionStatus(q.id)
              return (
                <button
                  key={q.id}
                  style={S.sheetItem(status, index === currentQuestionIndex)}
                  onClick={() => handleJumpToQuestion(index)}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>

          <div style={S.legend}>
            <div style={S.legendItem}>
              <div style={S.legendDot('#e6f4ea')} />
              <span>Answered</span>
            </div>
            <div style={S.legendItem}>
              <div style={S.legendDot('#fff')} />
              <span>Unanswered</span>
            </div>
            <div style={S.legendItem}>
              <div style={S.legendDot('#fef7e0')} />
              <span>Marked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit confirmation dialog */}
      {showSubmitDialog && (
        <div style={S.overlay} onClick={() => setShowSubmitDialog(false)}>
          <div style={S.dialog} onClick={(e) => e.stopPropagation()}>
            <h3 style={S.dialogTitle}>Confirm Submission</h3>
            <p style={S.dialogText}>
              You have completed {getAnsweredCount()} / {questions.length} questions
            </p>
            {getAnsweredCount() < questions.length && (
              <p style={S.dialogWarning}>
                {questions.length - getAnsweredCount()} questions remain unanswered
              </p>
            )}
            <p style={S.dialogText}>Are you sure you want to submit?</p>

            <div style={S.dialogActions}>
              <Button variant="secondary" size="md" onClick={() => setShowSubmitDialog(false)}>
                Continue
              </Button>
              <Button variant="primary" size="md" onClick={handleConfirmSubmit}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExamTakingPage
