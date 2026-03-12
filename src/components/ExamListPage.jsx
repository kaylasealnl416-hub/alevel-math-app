import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from './Navbar'
import Loading from './common/Loading'
import { Button } from './ui'

/**
 * Phase 4 Week 2 Day 4: Exam List Page
 *
 * Features:
 * - Display all user exam records
 * - Filter functionality (type, status)
 * - Create new exam
 * - Navigate to exam taking or result page
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// Exam type mapping
const EXAM_TYPE_MAP = {
  chapter_test: 'Chapter Test',
  unit_test: 'Unit Test',
  mock_exam: 'Mock Exam',
  diagnostic: 'Diagnostic Test',
  real_exam: 'Past Paper'
}

// Exam status mapping
const EXAM_STATUS_MAP = {
  in_progress: 'In Progress',
  submitted: 'Submitted',
  graded: 'Graded'
}

// Exam mode mapping
const EXAM_MODE_MAP = {
  practice: 'Practice Mode',
  exam: 'Exam Mode',
  challenge: 'Challenge Mode'
}

function ExamListPage() {
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState({
    type: 'all',
    status: 'all'
  })

  useEffect(() => {
    fetchExams()
  }, [filter])

  const fetchExams = async () => {
    try {
      setLoading(true)
      setError(null)

      // Build query parameters
      const params = new URLSearchParams({
        userId: user.id.toString(),
        limit: '50'
      })

      if (filter.type !== 'all') {
        params.append('type', filter.type)
      }
      if (filter.status !== 'all') {
        params.append('status', filter.status)
      }

      const response = await fetch(`${API_BASE}/api/exams?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const result = await response.json()

      if (result.success) {
        setExams(result.data.exams)
      } else {
        setError(result.error.message)
      }
    } catch (err) {
      console.error('Failed to fetch exam list:', err)
      setError('Failed to load exam list. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateExam = () => {
    // Navigate to create exam page
    navigate('/exams/create')
  }

  const handleExamClick = (exam) => {
    if (exam.status === 'in_progress') {
      // Continue exam
      navigate(`/exams/${exam.id}/take`)
    } else {
      // View result
      navigate(`/exams/${exam.id}/result`)
    }
  }

  const formatTime = (seconds) => {
    if (!seconds) return '-'
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getGradeClass = (correctRate) => {
    if (correctRate >= 90) return 'text-success-600 font-semibold'
    if (correctRate >= 80) return 'text-success-500 font-semibold'
    if (correctRate >= 70) return 'text-warning-500 font-semibold'
    if (correctRate >= 60) return 'text-warning-600 font-semibold'
    return 'text-error-600 font-semibold'
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'in_progress':
        return 'bg-warning-100 text-warning-700'
      case 'submitted':
        return 'bg-info-100 text-info-700'
      case 'graded':
        return 'bg-success-100 text-success-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return <Loading message="Loading exams..." size="large" fullScreen />
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 animate-fade-in-down">
            <h1 className="text-3xl font-bold text-gray-900">📝 My Exams</h1>
            <Button
              variant="primary"
              size="md"
              onClick={handleCreateExam}
              className="w-full sm:w-auto"
            >
              <span className="text-xl mr-2">+</span>
              Create New Exam
            </Button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Type:
                </label>
                <select
                  value={filter.type}
                  onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="all">All Types</option>
                  <option value="chapter_test">Chapter Test</option>
                  <option value="unit_test">Unit Test</option>
                  <option value="mock_exam">Mock Exam</option>
                  <option value="diagnostic">Diagnostic Test</option>
                  <option value="real_exam">Past Paper</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status:
                </label>
                <select
                  value={filter.status}
                  onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="in_progress">In Progress</option>
                  <option value="submitted">Submitted</option>
                  <option value="graded">Graded</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-error-50 border border-error-200 rounded-xl p-6 mb-8 animate-fade-in-down">
              <div className="flex items-center justify-center flex-col gap-4">
                <p className="text-error-700 text-center">{error}</p>
                <Button variant="primary" size="sm" onClick={fetchExams}>
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && exams.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center animate-scale-in">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No exam records yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first exam to get started
              </p>
              <Button variant="primary" size="md" onClick={handleCreateExam}>
                Create Your First Exam
              </Button>
            </div>
          )}

          {/* Exam Cards Grid */}
          {!loading && !error && exams.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam, index) => (
                <div
                  key={exam.id}
                  onClick={() => handleExamClick(exam)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 hover:border-primary-300 p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {EXAM_TYPE_MAP[exam.type] || exam.type}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(exam.status)}`}>
                      {EXAM_STATUS_MAP[exam.status] || exam.status}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="flex-1 space-y-3">
                    <p className="text-sm text-gray-600">
                      {EXAM_MODE_MAP[exam.mode] || exam.mode}
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Questions:</span>
                        <span className="font-medium text-gray-900">
                          {exam.totalCount || '-'}
                        </span>
                      </div>

                      {exam.status === 'graded' && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Score:</span>
                            <span className="font-medium text-gray-900">
                              {exam.totalScore}/{exam.maxScore}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Accuracy:</span>
                            <span className={getGradeClass(Math.round((exam.correctCount / exam.totalCount) * 100))}>
                              {Math.round((exam.correctCount / exam.totalCount) * 100)}%
                            </span>
                          </div>
                        </>
                      )}

                      {exam.timeSpent && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium text-gray-900">
                            {formatTime(exam.timeSpent)}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-4">
                      {formatDate(exam.startedAt)}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {exam.status === 'in_progress' && (
                      <Button variant="primary" size="sm" className="w-full">
                        Continue
                      </Button>
                    )}
                    {exam.status === 'graded' && (
                      <Button variant="secondary" size="sm" className="w-full">
                        View Result
                      </Button>
                    )}
                    {exam.status === 'submitted' && (
                      <Button variant="secondary" size="sm" className="w-full">
                        View Details
                      </Button>
                    )}
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

export default ExamListPage
