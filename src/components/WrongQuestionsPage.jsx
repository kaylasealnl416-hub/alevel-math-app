import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionCard from './QuestionCard'
import Navbar from './Navbar'
import Loading from './common/Loading'
import { Button } from './ui'
import { get } from '../utils/apiClient'

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

  const getDifficultyBadgeClass = (difficulty) => {
    if (difficulty <= 2) return 'bg-success-100 text-success-700'
    if (difficulty === 3) return 'bg-warning-100 text-warning-700'
    return 'bg-error-100 text-error-700'
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
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
          <div className="bg-error-50 border border-error-200 rounded-xl p-8 text-center max-w-md">
            <p className="text-error-700 mb-4">{error}</p>
            <Button variant="primary" size="md" onClick={fetchWrongQuestions}>
              Retry
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-down">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">📚 Wrong Questions Collection</h1>
            <p className="text-lg text-gray-600">Review and master your mistakes</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 text-center border-2 border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <div className="text-4xl font-bold text-error-600 mb-2">{wrongQuestions.length}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Total Wrong</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center border-2 border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <div className="text-4xl font-bold text-error-600 mb-2">{Object.keys(groupedByTopic).length}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Topics</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center border-2 border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <div className="text-4xl font-bold text-error-600 mb-2">{filteredQuestions.length}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Filtered</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Topic:</label>
                <select
                  value={filter.topic}
                  onChange={(e) => setFilter({ ...filter, topic: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  {topics.map(topic => (
                    <option key={topic} value={topic}>
                      {topic === 'all' ? 'All Topics' : topic}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty:</label>
                <select
                  value={filter.difficulty}
                  onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="all">All Levels</option>
                  <option value="1">Very Easy</option>
                  <option value="2">Easy</option>
                  <option value="3">Medium</option>
                  <option value="4">Hard</option>
                  <option value="5">Very Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Type:</label>
                <select
                  value={filter.examType}
                  onChange={(e) => setFilter({ ...filter, examType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  {examTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : getExamTypeLabel(type)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Questions List */}
          {filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center animate-scale-in">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No wrong questions found!</h2>
              <p className="text-gray-600 mb-6">
                {wrongQuestions.length === 0
                  ? "You haven't taken any exams yet, or you got everything right!"
                  : "Try adjusting your filters to see more questions."}
              </p>
              <Button variant="primary" size="md" onClick={() => navigate('/exams')}>
                Take an Exam
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedByTopic).map(([topic, questions], topicIndex) => (
                <div key={topic} className="bg-white rounded-xl shadow-md p-6 animate-fade-in-up" style={{ animationDelay: `${0.5 + topicIndex * 0.1}s`, animationFillMode: 'both' }}>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-3 border-b-2 border-error-500 flex items-center gap-3">
                    {topic}
                    <span className="text-base text-gray-600 font-normal">({questions.length} questions)</span>
                  </h2>

                  <div className="space-y-6">
                    {questions.map((question, index) => (
                      <div key={`${question.id}-${question.examId}`} className="border border-gray-200 rounded-lg p-6 bg-gray-50 hover:shadow-lg hover:border-error-500 transition-all duration-300">
                        <div className="flex flex-wrap gap-3 mb-4 items-center">
                          <span className="text-lg font-bold text-error-600">#{index + 1}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getDifficultyBadgeClass(question.difficulty)}`}>
                            {getDifficultyLabel(question.difficulty)}
                          </span>
                          <span className="px-3 py-1 bg-info-100 text-info-700 rounded-full text-xs font-medium">
                            {getExamTypeLabel(question.examType)}
                          </span>
                          <span className="text-sm text-gray-600 ml-auto">
                            {formatDate(question.examDate)}
                          </span>
                        </div>

                        <QuestionCard
                          question={question}
                          questionNumber={index + 1}
                          totalQuestions={questions.length}
                          showAnswer={showAnswer[question.id]}
                        />

                        <div className="flex flex-wrap gap-4 mt-4 items-center">
                          <Button
                            variant={showAnswer[question.id] ? 'secondary' : 'primary'}
                            size="sm"
                            onClick={() => toggleAnswer(question.id)}
                          >
                            {showAnswer[question.id] ? '🙈 Hide Answer' : '👁️ Show Answer'}
                          </Button>

                          {!showAnswer[question.id] && (
                            <div className="flex gap-2 items-center px-4 py-2 bg-white rounded-lg border border-gray-200">
                              <span className="text-sm text-gray-600">Your answer:</span>
                              <span className="text-base font-bold text-error-600">{question.userAnswer?.value || 'No answer'}</span>
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
      </div>
    </>
  )
}

export default WrongQuestionsPage
