import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionCard from './QuestionCard'
import Navbar from './Navbar'
import Loading from './common/Loading'
import { get } from '../utils/apiClient'
import '../styles/WrongQuestionsPage.css'

/**
 * Phase 4 Week 4 Day 11: Wrong Questions Page
 *
 * Features:
 * - Display all incorrectly answered questions from past exams
 * - Filter by topic, difficulty, and exam type
 * - Redo questions functionality
 * - Track improvement progress
 */

function WrongQuestionsPage() {
  const navigate = useNavigate()

  const [wrongQuestions, setWrongQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState({
    topic: 'all',
    difficulty: 'all',
    examType: 'all'
  })
  const [showAnswer, setShowAnswer] = useState({})

  // Mock user ID
  const userId = 1

  useEffect(() => {
    fetchWrongQuestions()
  }, [])

  const fetchWrongQuestions = async () => {
    try {
      setLoading(true)
      setError(null)

      // Use dedicated wrong questions API
      const result = await get(`/api/wrong-questions?userId=${userId}&limit=100`)

      if (result.success) {
        // Transform API response to component format
        const wrong = result.data.wrongQuestions.map(wq => ({
          id: wq.question.id,
          type: wq.question.type,
          difficulty: wq.question.difficulty,
          content: wq.question.content,
          options: wq.question.options,
          answer: wq.question.answer,
          explanation: wq.question.explanation,
          tags: wq.question.tags,
          chapterId: wq.question.chapterId,
          examId: wq.examId,
          examType: wq.exam.type,
          examDate: wq.exam.createdAt,
          userAnswer: wq.userAnswer,
          aiFeedback: wq.aiFeedback,
          chapter: wq.chapter,
          attemptCount: 1
        }))

        setWrongQuestions(wrong)
      } else {
        setError(result.error?.message || 'Failed to load wrong questions')
      }
    } catch (err) {
      console.error('Failed to fetch wrong questions:', err)
      setError('Failed to load wrong questions. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const toggleAnswer = (questionId) => {
    setShowAnswer(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }))
  }

  // Get unique topics
  const topics = ['all', ...new Set(wrongQuestions.flatMap(q => q.tags || []))]

  // Get unique exam types
  const examTypes = ['all', ...new Set(wrongQuestions.map(q => q.examType))]

  // Filter questions
  const filteredQuestions = wrongQuestions.filter(q => {
    if (filter.topic !== 'all' && !q.tags?.includes(filter.topic)) return false
    if (filter.difficulty !== 'all' && q.difficulty !== parseInt(filter.difficulty)) return false
    if (filter.examType !== 'all' && q.examType !== filter.examType) return false
    return true
  })

  // Group by topic
  const groupedByTopic = filteredQuestions.reduce((acc, q) => {
    const topic = q.tags?.[0] || 'Other'
    if (!acc[topic]) acc[topic] = []
    acc[topic].push(q)
    return acc
  }, {})

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDifficultyLabel = (difficulty) => {
    const labels = {
      1: 'Very Easy',
      2: 'Easy',
      3: 'Medium',
      4: 'Hard',
      5: 'Very Hard'
    }
    return labels[difficulty] || 'Medium'
  }

  const getExamTypeLabel = (type) => {
    const labels = {
      chapter_test: 'Chapter Test',
      unit_test: 'Unit Test',
      mock_exam: 'Mock Exam',
      diagnostic: 'Diagnostic Test'
    }
    return labels[type] || type
  }

  if (loading) {
    return <Loading message="Loading wrong questions..." size="large" fullScreen />
  }

  if (error) {
    return (
      <div className="wrong-questions-error">
        <p>{error}</p>
        <button onClick={fetchWrongQuestions}>Retry</button>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="wrong-questions-page">
        {/* Header */}
        <div className="wrong-questions-header">
          <h1>📚 Wrong Questions Collection</h1>
          <p className="subtitle">Review and master your mistakes</p>
        </div>

        {/* Statistics */}
      <div className="wrong-questions-stats">
        <div className="stat-card">
          <div className="stat-value">{wrongQuestions.length}</div>
          <div className="stat-label">Total Wrong</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Object.keys(groupedByTopic).length}</div>
          <div className="stat-label">Topics</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{filteredQuestions.length}</div>
          <div className="stat-label">Filtered</div>
        </div>
      </div>

      {/* Filters */}
      <div className="wrong-questions-filters">
        <div className="filter-group">
          <label>Topic:</label>
          <select
            value={filter.topic}
            onChange={(e) => setFilter({ ...filter, topic: e.target.value })}
          >
            {topics.map(topic => (
              <option key={topic} value={topic}>
                {topic === 'all' ? 'All Topics' : topic}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Difficulty:</label>
          <select
            value={filter.difficulty}
            onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
          >
            <option value="all">All Levels</option>
            <option value="1">Very Easy</option>
            <option value="2">Easy</option>
            <option value="3">Medium</option>
            <option value="4">Hard</option>
            <option value="5">Very Hard</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Exam Type:</label>
          <select
            value={filter.examType}
            onChange={(e) => setFilter({ ...filter, examType: e.target.value })}
          >
            {examTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : getExamTypeLabel(type)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎉</div>
          <h2>No wrong questions found!</h2>
          <p>
            {wrongQuestions.length === 0
              ? "You haven't taken any exams yet, or you got everything right!"
              : "Try adjusting your filters to see more questions."}
          </p>
          <button className="btn-primary" onClick={() => navigate('/exams')}>
            Take an Exam
          </button>
        </div>
      ) : (
        <div className="questions-by-topic">
          {Object.entries(groupedByTopic).map(([topic, questions]) => (
            <div key={topic} className="topic-section">
              <h2 className="topic-title">
                {topic}
                <span className="topic-count">({questions.length} questions)</span>
              </h2>

              <div className="questions-list">
                {questions.map((question, index) => (
                  <div key={`${question.id}-${question.examId}`} className="question-item">
                    <div className="question-meta">
                      <span className="question-number">#{index + 1}</span>
                      <span className="question-difficulty" data-difficulty={question.difficulty}>
                        {getDifficultyLabel(question.difficulty)}
                      </span>
                      <span className="question-exam-type">
                        {getExamTypeLabel(question.examType)}
                      </span>
                      <span className="question-date">
                        {formatDate(question.examDate)}
                      </span>
                    </div>

                    <QuestionCard
                      question={question}
                      questionNumber={index + 1}
                      totalQuestions={questions.length}
                      showAnswer={showAnswer[question.id]}
                    />

                    <div className="question-actions">
                      <button
                        className="btn-toggle-answer"
                        onClick={() => toggleAnswer(question.id)}
                      >
                        {showAnswer[question.id] ? '🙈 Hide Answer' : '👁️ Show Answer'}
                      </button>

                      {!showAnswer[question.id] && (
                        <div className="user-answer-display">
                          <span className="label">Your answer:</span>
                          <span className="value incorrect">{question.userAnswer?.value || 'No answer'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  )
}

export default WrongQuestionsPage
