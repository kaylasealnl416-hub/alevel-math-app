import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import QuestionCard from './QuestionCard'
import AnswerInput from './AnswerInput'

/**
 * Phase 4 Week 2 Day 5: Exam Taking Page
 *
 * Features:
 * - Question display (LaTeX support)
 * - Answer input (multiple question types)
 * - Question navigator
 * - Answer sheet
 * - Timer
 * - Auto-save
 * - Anti-cheating detection
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

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

  useEffect(() => {
    fetchExamDetail()
    setupVisibilityDetection()

    return () => {
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
    // 设置自动保存
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current)
    }

    autoSaveTimerRef.current = setInterval(() => {
      autoSaveAnswers()
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(autoSaveTimerRef.current)
  }, [answers])

  const fetchExamDetail = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE}/api/exams/${examId}`)
      const result = await response.json()

      if (result.success) {
        setExam(result.data)
        setQuestions(result.data.questionSet.questions)
        setAnswers(result.data.answers || {})
        setMarkedQuestions(result.data.markedQuestions || [])

        // Calculate remaining time
        if (result.data.timeLimit) {
          const elapsed = Math.floor((new Date() - new Date(result.data.startedAt)) / 1000)
          const remaining = Math.max(0, result.data.timeLimit - elapsed)
          setTimeRemaining(remaining)
        }
      } else {
        setError(result.error.message)
      }
    } catch (err) {
      console.error('Failed to fetch exam details:', err)
      setError('Failed to load exam details. Please try again later.')
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
          // Time's up, auto-submit
          handleAutoSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const setupVisibilityDetection = () => {
    // Detect page visibility loss
    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordCheatingEvent('focus_lost')
      }
    }

    // Detect tab switching
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
      await fetch(`${API_BASE}/api/exams/${examId}/focus-lost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      })
    } catch (err) {
      console.error('Failed to record cheating event:', err)
    }
  }

  const autoSaveAnswers = async () => {
    // Check if there are new answers to save
    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion) return

    const currentAnswer = answers[currentQuestion.id]
    const lastAnswer = lastAnswerRef.current[currentQuestion.id]

    if (JSON.stringify(currentAnswer) === JSON.stringify(lastAnswer)) {
      return // No changes, no need to save
    }

    try {
      setAutoSaving(true)
      await saveAnswer(currentQuestion.id, currentAnswer)
      lastAnswerRef.current[currentQuestion.id] = currentAnswer
    } catch (err) {
      console.error('Auto-save failed:', err)
    } finally {
      setAutoSaving(false)
    }
  }

  const saveAnswer = async (questionId, answer) => {
    const response = await fetch(`${API_BASE}/api/exams/${examId}/answers`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, answer })
    })

    const result = await response.json()
    if (!result.success) {
      throw new Error(result.error.message)
    }
  }

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleMarkQuestion = async (questionId) => {
    const isMarked = markedQuestions.includes(questionId)

    try {
      const response = await fetch(`${API_BASE}/api/exams/${examId}/mark`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, marked: !isMarked })
      })

      const result = await response.json()
      if (result.success) {
        setMarkedQuestions((prev) =>
          isMarked
            ? prev.filter((id) => id !== questionId)
            : [...prev, questionId]
        )
      }
    } catch (err) {
      console.error('Failed to mark question:', err)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index)
  }

  const handleSubmit = () => {
    setShowSubmitDialog(true)
  }

  const handleConfirmSubmit = async () => {
    try {
      // Save current answer first
      const currentQuestion = questions[currentQuestionIndex]
      if (currentQuestion && answers[currentQuestion.id]) {
        await saveAnswer(currentQuestion.id, answers[currentQuestion.id])
      }

      // Submit exam
      const response = await fetch(`${API_BASE}/api/exams/${examId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const result = await response.json()
      if (result.success) {
        // Navigate to result page
        navigate(`/exams/${examId}/result`)
      } else {
        alert('Submission failed: ' + result.error.message)
      }
    } catch (err) {
      console.error('Failed to submit exam:', err)
      alert('Submission failed. Please try again later.')
    }
  }

  const handleAutoSubmit = async () => {
    try {
      await fetch(`${API_BASE}/exams/${examId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      alert('Time is up. Exam has been automatically submitted.')
      navigate(`/exams/${examId}/result`)
    } catch (err) {
      console.error('Auto-submit failed:', err)
    }
  }

  const formatTime = (seconds) => {
    if (seconds === null) return ''
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).filter((key) => answers[key] !== undefined && answers[key] !== null).length
  }

  const getQuestionStatus = (questionId) => {
    if (answers[questionId] !== undefined && answers[questionId] !== null) {
      return 'answered'
    }
    if (markedQuestions.includes(questionId)) {
      return 'marked'
    }
    return 'unanswered'
  }

  if (loading) {
    return (
      <div className="exam-taking-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="exam-taking-error">
        <p>{error}</p>
        <button onClick={() => navigate('/exams')}>Back to Exam List</button>
      </div>
    )
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="exam-taking-error">
        <p>Exam not found or no questions available</p>
        <button onClick={() => navigate('/exams')}>Back to Exam List</button>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="exam-taking-page">
      {/* Top navigation bar */}
      <div className="exam-taking-header">
        <div className="exam-info">
          <h2>{exam.questionSet.title}</h2>
          <span className="exam-mode">{exam.mode === 'exam' ? 'Exam Mode' : 'Practice Mode'}</span>
        </div>

        <div className="exam-stats">
          {timeRemaining !== null && (
            <div className={`timer ${timeRemaining < 300 ? 'warning' : ''}`}>
              <span className="icon">⏱</span>
              <span className="time">{formatTime(timeRemaining)}</span>
            </div>
          )}

          <div className="progress">
            <span>{getAnsweredCount()}/{questions.length}</span>
          </div>

          {autoSaving && (
            <div className="auto-save-indicator">
              <span>Saving...</span>
            </div>
          )}
        </div>
      </div>

      <div className="exam-taking-content">
        {/* Left: Question area */}
        <div className="question-area">
          <div className="question-header">
            <span className="question-number">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <button
              className={`btn-mark ${markedQuestions.includes(currentQuestion.id) ? 'marked' : ''}`}
              onClick={() => handleMarkQuestion(currentQuestion.id)}
            >
              {markedQuestions.includes(currentQuestion.id) ? '★ Marked' : '☆ Mark'}
            </button>
          </div>

          <QuestionCard
            question={currentQuestion}
            showAnswer={false}
          />

          <AnswerInput
            question={currentQuestion}
            value={answers[currentQuestion.id]}
            onChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          />

          <div className="question-navigation">
            <button
              className="btn-nav"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>

            <button
              className="btn-nav"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next
            </button>

            <button className="btn-submit" onClick={handleSubmit}>
              Submit Exam
            </button>
          </div>
        </div>

        {/* Right: Answer sheet */}
        <div className="answer-sheet">
          <h3>Answer Sheet</h3>
          <div className="answer-sheet-grid">
            {questions.map((q, index) => {
              const status = getQuestionStatus(q.id)
              return (
                <button
                  key={q.id}
                  className={`answer-sheet-item ${status} ${index === currentQuestionIndex ? 'current' : ''}`}
                  onClick={() => handleJumpToQuestion(index)}
                >
                  {index + 1}
                  {markedQuestions.includes(q.id) && <span className="mark-indicator">★</span>}
                </button>
              )
            })}
          </div>

          <div className="answer-sheet-legend">
            <div className="legend-item">
              <span className="legend-color answered"></span>
              <span>Answered</span>
            </div>
            <div className="legend-item">
              <span className="legend-color unanswered"></span>
              <span>Unanswered</span>
            </div>
            <div className="legend-item">
              <span className="legend-color marked"></span>
              <span>Marked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit confirmation dialog */}
      {showSubmitDialog && (
        <div className="submit-dialog-overlay" onClick={() => setShowSubmitDialog(false)}>
          <div className="submit-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Submission</h3>
            <p>
              You have completed {getAnsweredCount()} / {questions.length} questions
            </p>
            {getAnsweredCount() < questions.length && (
              <p className="warning">{questions.length - getAnsweredCount()} questions remain unanswered</p>
            )}
            <p>Are you sure you want to submit?</p>

            <div className="dialog-actions">
              <button className="btn-cancel" onClick={() => setShowSubmitDialog(false)}>
                Continue
              </button>
              <button className="btn-confirm" onClick={handleConfirmSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExamTakingPage
