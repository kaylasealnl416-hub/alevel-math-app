import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/ExamListPage.css'

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

  const getStatusClass = (status) => {
    switch (status) {
      case 'in_progress':
        return 'status-in-progress'
      case 'submitted':
        return 'status-submitted'
      case 'graded':
        return 'status-graded'
      default:
        return ''
    }
  }

  const getGradeClass = (correctRate) => {
    if (correctRate >= 90) return 'grade-a'
    if (correctRate >= 80) return 'grade-b'
    if (correctRate >= 70) return 'grade-c'
    if (correctRate >= 60) return 'grade-d'
    return 'grade-f'
  }
  return (
    <div className="exam-list-page">
      <div className="exam-list-header">
        <h1>My Exams</h1>
        <button className="btn-create-exam" onClick={handleCreateExam}>
          <span className="icon">+</span>
          Create New Exam
        </button>
      </div>

      <div className="exam-list-filters">
        <div className="filter-group">
          <label>Exam Type:</label>
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          >
            <option value="all">All</option>
            <option value="chapter_test">Chapter Test</option>
            <option value="unit_test">Unit Test</option>
            <option value="mock_exam">Mock Exam</option>
            <option value="diagnostic">Diagnostic Test</option>
            <option value="real_exam">Past Paper</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="all">All</option>
            <option value="in_progress">In Progress</option>
            <option value="submitted">Submitted</option>
            <option value="graded">Graded</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="exam-list-loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {error && (
        <div className="exam-list-error">
          <p>{error}</p>
          <button onClick={fetchExams}>Retry</button>
        </div>
      )}

      {!loading && !error && exams.length === 0 && (
        <div className="exam-list-empty">
          <p>No exam records yet</p>
          <button onClick={handleCreateExam}>Create Your First Exam</button>
        </div>
      )}

      {!loading && !error && exams.length > 0 && (
        <div className="exam-list-grid">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="exam-card"
              onClick={() => handleExamClick(exam)}
            >
              <div className="exam-card-header">
                <div className="exam-type">
                  {EXAM_TYPE_MAP[exam.type] || exam.type}
                </div>
                <div className={`exam-status ${getStatusClass(exam.status)}`}>
                  {EXAM_STATUS_MAP[exam.status] || exam.status}
                </div>
              </div>

              <div className="exam-card-body">
                <div className="exam-mode">
                  {EXAM_MODE_MAP[exam.mode] || exam.mode}
                </div>

                <div className="exam-info">
                  <div className="info-item">
                    <span className="label">Questions:</span>
                    <span className="value">{exam.totalCount || '-'}</span>
                  </div>

                  {exam.status === 'graded' && (
                    <>
                      <div className="info-item">
                        <span className="label">Score:</span>
                        <span className="value">
                          {exam.totalScore}/{exam.maxScore}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="label">Accuracy:</span>
                        <span className={`value ${getGradeClass(Math.round((exam.correctCount / exam.totalCount) * 100))}`}>
                          {Math.round((exam.correctCount / exam.totalCount) * 100)}%
                        </span>
                      </div>
                    </>
                  )}

                  {exam.timeSpent && (
                    <div className="info-item">
                      <span className="label">Time:</span>
                      <span className="value">{formatTime(exam.timeSpent)}</span>
                    </div>
                  )}
                </div>

                <div className="exam-date">
                  {formatDate(exam.startedAt)}
                </div>
              </div>

              <div className="exam-card-footer">
                {exam.status === 'in_progress' && (
                  <button className="btn-continue">Continue</button>
                )}
                {exam.status === 'graded' && (
                  <button className="btn-view-result">View Result</button>
                )}
                {exam.status === 'submitted' && (
                  <button className="btn-view-result">View Details</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExamListPage
