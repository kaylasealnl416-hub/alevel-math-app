import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ScoreCard from './exam/ScoreCard'
import '../styles/ExamResultPage.css'

/**
 * Phase 4 Week 2 Day 6: Exam Result Page
 *
 * Features:
 * - Display overall score and statistics
 * - Show topic-wise performance
 * - Display question-by-question results
 * - Provide detailed explanations
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function ExamResultPage() {
  const { examId } = useParams()
  const navigate = useNavigate()

  const [exam, setExam] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [aiFeedback, setAiFeedback] = useState(null)
  const [loadingFeedback, setLoadingFeedback] = useState(false)

  useEffect(() => {
    fetchExamResult()
  }, [examId])

  useEffect(() => {
    if (exam && exam.status === 'graded') {
      fetchAIFeedback()
    }
  }, [exam])

  const fetchExamResult = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE}/api/exams/${examId}`)
      const result = await response.json()

      if (result.success) {
        setExam(result.data)
        setQuestions(result.data.questionSet.questions)
      } else {
        setError(result.error.message)
      }
    } catch (err) {
      console.error('Failed to fetch exam result:', err)
      setError('Failed to load exam result. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const fetchAIFeedback = async () => {
    try {
      setLoadingFeedback(true)

      const response = await fetch(`${API_BASE}/api/exams/${examId}/feedback`)
      const result = await response.json()

      if (result.success) {
        setAiFeedback(result.data)
      }
    } catch (err) {
      console.error('Failed to fetch AI feedback:', err)
      // Don't show error to user, AI feedback is optional
    } finally {
      setLoadingFeedback(false)
    }
  }

  const getQuestionResult = (questionId) => {
    const userAnswer = exam.answers[questionId]
    const question = questions.find(q => q.id === questionId)
    if (!question) return null

    const isCorrect = userAnswer?.value === question.answer?.value
    return { userAnswer, question, isCorrect }
  }

  const formatTime = (seconds) => {
    if (!seconds) return '-'
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getGradeClass = (percentage) => {
    if (percentage >= 90) return 'grade-a'
    if (percentage >= 80) return 'grade-b'
    if (percentage >= 70) return 'grade-c'
    if (percentage >= 60) return 'grade-d'
    return 'grade-f'
  }

  if (loading) {
    return (
      <div className="exam-result-loading">
        <div className="spinner"></div>
        <p>Loading results...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="exam-result-error">
        <p>{error}</p>
        <button onClick={() => navigate('/exams')}>Back to Exam List</button>
      </div>
    )
  }

  if (!exam || exam.status === 'in_progress') {
    return (
      <div className="exam-result-error">
        <p>This exam has not been submitted yet.</p>
        <button onClick={() => navigate(`/exams/${examId}/take`)}>Continue Exam</button>
      </div>
    )
  }

  const percentage = exam.totalCount > 0
    ? Math.round((exam.correctCount / exam.totalCount) * 100)
    : 0

  return (
    <div className="exam-result-page">
      {/* Header */}
      <div className="exam-result-header">
        <button className="btn-back" onClick={() => navigate('/exams')}>
          ← Back to Exams
        </button>
        <h1>Exam Results</h1>
      </div>

      {/* Score Card */}
      <ScoreCard
        totalScore={exam.totalScore}
        maxScore={exam.maxScore}
        correctCount={exam.correctCount}
        totalCount={exam.totalCount}
        timeSpent={exam.timeSpent}
        percentage={percentage}
      />

      {/* Statistics */}
      <div className="exam-stats-section">
        <h2>Performance Breakdown</h2>

        <div className="stats-grid">
          {/* Difficulty Stats */}
          {exam.difficultyStats && (
            <div className="stat-card">
              <h3>By Difficulty</h3>
              <div className="stat-items">
                {exam.difficultyStats.easy && exam.difficultyStats.easy.total > 0 && (
                  <div className="stat-item">
                    <span className="stat-label">Easy:</span>
                    <span className="stat-value">
                      {exam.difficultyStats.easy.correct}/{exam.difficultyStats.easy.total}
                      <span className="stat-percentage">
                        ({Math.round((exam.difficultyStats.easy.correct / exam.difficultyStats.easy.total) * 100)}%)
                      </span>
                    </span>
                  </div>
                )}
                {exam.difficultyStats.medium && exam.difficultyStats.medium.total > 0 && (
                  <div className="stat-item">
                    <span className="stat-label">Medium:</span>
                    <span className="stat-value">
                      {exam.difficultyStats.medium.correct}/{exam.difficultyStats.medium.total}
                      <span className="stat-percentage">
                        ({Math.round((exam.difficultyStats.medium.correct / exam.difficultyStats.medium.total) * 100)}%)
                      </span>
                    </span>
                  </div>
                )}
                {exam.difficultyStats.hard && exam.difficultyStats.hard.total > 0 && (
                  <div className="stat-item">
                    <span className="stat-label">Hard:</span>
                    <span className="stat-value">
                      {exam.difficultyStats.hard.correct}/{exam.difficultyStats.hard.total}
                      <span className="stat-percentage">
                        ({Math.round((exam.difficultyStats.hard.correct / exam.difficultyStats.hard.total) * 100)}%)
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Topic Stats */}
          {exam.topicStats && Object.keys(exam.topicStats).length > 0 && (
            <div className="stat-card">
              <h3>By Topic</h3>
              <div className="stat-items">
                {Object.entries(exam.topicStats).map(([topic, stats]) => (
                  <div key={topic} className="stat-item">
                    <span className="stat-label">{topic}:</span>
                    <span className="stat-value">
                      {stats.correct}/{stats.total}
                      <span className="stat-percentage">
                        ({Math.round((stats.correct / stats.total) * 100)}%)
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Feedback Section */}
      {aiFeedback && (
        <div className="ai-feedback-section">
          <h2>🤖 AI Analysis & Recommendations</h2>

          {/* Overall Evaluation */}
          <div className="feedback-card overall">
            <h3>Overall Performance</h3>
            <p>{aiFeedback.overall}</p>
          </div>

          {/* Strengths */}
          {aiFeedback.strengths && aiFeedback.strengths.length > 0 && (
            <div className="feedback-card strengths">
              <h3>✨ Strengths</h3>
              <ul>
                {aiFeedback.strengths.map((strength, i) => (
                  <li key={i}>{strength}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {aiFeedback.weaknesses && aiFeedback.weaknesses.length > 0 && (
            <div className="feedback-card weaknesses">
              <h3>📚 Areas for Improvement</h3>
              {aiFeedback.weaknesses.map((weakness, i) => (
                <div key={i} className="weakness-item">
                  <h4>{weakness.topic}</h4>
                  <p className="reason">{weakness.reason}</p>
                  <p className="suggestion">💡 {weakness.suggestion}</p>
                </div>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {aiFeedback.suggestions && aiFeedback.suggestions.length > 0 && (
            <div className="feedback-card suggestions">
              <h3>🎯 Learning Recommendations</h3>
              {aiFeedback.suggestions
                .sort((a, b) => b.priority - a.priority)
                .map((suggestion, i) => (
                  <div key={i} className="suggestion-item">
                    <div className="suggestion-header">
                      <span className={`suggestion-type ${suggestion.type}`}>
                        {suggestion.type}
                      </span>
                      <span className="suggestion-priority">
                        Priority: {suggestion.priority}/5
                      </span>
                    </div>
                    <p className="suggestion-description">{suggestion.description}</p>
                    <p className="suggestion-reason">{suggestion.reason}</p>
                  </div>
                ))}
            </div>
          )}

          {/* Encouragement */}
          {aiFeedback.encouragement && (
            <div className="feedback-card encouragement">
              <p>💪 {aiFeedback.encouragement}</p>
            </div>
          )}
        </div>
      )}

      {loadingFeedback && (
        <div className="ai-feedback-loading">
          <div className="spinner"></div>
          <p>Generating AI analysis...</p>
        </div>
      )}

      {/* Question Results */}
      <div className="question-results-section">
        <h2>Question-by-Question Review</h2>

        <div className="question-results-list">
          {questions.map((question, index) => {
            const result = getQuestionResult(question.id)
            if (!result) return null

            return (
              <div
                key={question.id}
                className={`question-result-card ${result.isCorrect ? 'correct' : 'incorrect'}`}
              >
                <div className="question-result-header">
                  <div className="question-number">
                    Question {index + 1}
                    <span className={`result-badge ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                      {result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                  <div className="question-tags">
                    {question.tags?.map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="question-content">
                  <p className="question-text">
                    {question.content?.en || question.content}
                  </p>

                  {question.type === 'multiple_choice' && question.options && (
                    <div className="question-options">
                      {question.options.map((option, i) => {
                        const isUserAnswer = option.startsWith(result.userAnswer?.value)
                        const isCorrectAnswer = option.startsWith(question.answer?.value)

                        return (
                          <div
                            key={i}
                            className={`option-item ${isUserAnswer ? 'user-answer' : ''} ${isCorrectAnswer ? 'correct-answer' : ''}`}
                          >
                            {option}
                            {isUserAnswer && !isCorrectAnswer && <span className="badge">Your answer</span>}
                            {isCorrectAnswer && <span className="badge">Correct answer</span>}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {question.answer?.explanation && (
                    <div className="question-explanation">
                      <h4>Explanation:</h4>
                      <p>{question.answer.explanation?.en || question.answer.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="exam-result-actions">
        <button className="btn-primary" onClick={() => navigate('/exams')}>
          Back to Exam List
        </button>
        <button className="btn-secondary" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    </div>
  )
}

export default ExamResultPage
