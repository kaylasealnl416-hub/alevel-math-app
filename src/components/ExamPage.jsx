// ============================================================
// Exam / Practice Page
// Displays questions, collects answers, submits paper
// ============================================================

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import QuestionCard from './QuestionCard'
import AnswerInput from './AnswerInput'
import Timer from './Timer'
import ProgressBar from './ProgressBar'
import { STORAGE_KEYS } from '../utils/constants'
import '../styles/ExamPage.css'

const ExamPage = () => {
  const { examId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [questionSet, setQuestionSet] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [startTime, setStartTime] = useState(Date.now())
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  useEffect(() => {
    loadExam()
  }, [examId])

  const loadExam = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/question-sets/${examId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
        }
      })

      const data = await response.json()

      if (data.success) {
        setQuestionSet(data.data.questionSet)
        setQuestions(data.data.questions)
        setStartTime(Date.now())
      } else {
        setError(data.error?.message || 'Failed to load exam')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleJumpTo = (index) => {
    setCurrentIndex(index)
  }

  const handleSubmit = async () => {
    setShowConfirmDialog(false)

    try {
      const endTime = Date.now()
      const timeSpent = Math.floor((endTime - startTime) / 1000)

      const userAnswers = questions.map(q => ({
        questionId: q.id,
        userAnswer: answers[q.id] || '',
        timeSpent: Math.floor(timeSpent / questions.length)
      }))

      const response = await fetch('/api/user-answers/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
        },
        body: JSON.stringify({
          questionSetId: parseInt(examId),
          answers: userAnswers
        })
      })

      const data = await response.json()

      if (data.success) {
        navigate(`/practice/result/${examId}`)
      } else {
        setError(data.error?.message || 'Submission failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    }
  }

  const handleTimeUp = () => {
    alert('Time is up! Your paper will be submitted automatically.')
    handleSubmit()
  }

  if (loading) {
    return (
      <div className="exam-page loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="exam-page error">
        <div className="error-message">⚠️ {error}</div>
        <button onClick={() => navigate('/practice')}>Back</button>
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="exam-page empty">
        <div className="empty-message">No questions found</div>
        <button onClick={() => navigate('/practice')}>Back</button>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const answeredCount = Object.keys(answers).filter(key => answers[key]).length

  return (
    <div className="exam-page">
      {/* Top toolbar */}
      <div className="exam-toolbar">
        <div className="toolbar-left">
          <button className="back-btn" onClick={() => navigate('/practice')}>
            ← Back
          </button>
          <h2 className="exam-title">{questionSet?.title || 'Practice'}</h2>
        </div>
        <div className="toolbar-right">
          <Timer
            timeLimit={questionSet?.timeLimit}
            onTimeUp={handleTimeUp}
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="exam-progress">
        <ProgressBar
          current={currentIndex + 1}
          total={questions.length}
          answered={answeredCount}
        />
      </div>

      {/* Main content */}
      <div className="exam-content">
        <div className="exam-question">
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
          />
        </div>

        <div className="exam-answer">
          <AnswerInput
            question={currentQuestion}
            value={answers[currentQuestion.id]}
            onChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          />
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="exam-navigation">
        <div className="nav-buttons">
          <button
            className="nav-btn prev"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            ← Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              className="nav-btn next"
              onClick={handleNext}
            >
              Next →
            </button>
          ) : (
            <button
              className="nav-btn submit"
              onClick={() => setShowConfirmDialog(true)}
            >
              Submit ✓
            </button>
          )}
        </div>

        {/* Question navigator */}
        <div className="question-navigator">
          <div className="navigator-label">Question Navigator</div>
          <div className="navigator-grid">
            {questions.map((q, index) => (
              <button
                key={q.id}
                className={`navigator-item ${index === currentIndex ? 'current' : ''} ${answers[q.id] ? 'answered' : ''}`}
                onClick={() => handleJumpTo(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit confirmation dialog */}
      {showConfirmDialog && (
        <div className="confirm-dialog-overlay" onClick={() => setShowConfirmDialog(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Submission</h3>
            <p>
              You have answered <strong>{answeredCount}</strong> / {questions.length} questions
            </p>
            {answeredCount < questions.length && (
              <p className="warning">{questions.length - answeredCount} questions remain unanswered</p>
            )}
            <div className="dialog-actions">
              <button className="btn-cancel" onClick={() => setShowConfirmDialog(false)}>
                Keep Going
              </button>
              <button className="btn-confirm" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExamPage
