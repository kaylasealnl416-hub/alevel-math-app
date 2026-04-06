import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Loading from './common/Loading'
import { Button } from './ui'
import { get, del } from '../utils/apiClient'
import { formatDuration } from '../utils/helpers.js'

const EXAM_TYPE_MAP = {
  chapter_test: 'Chapter Test',
  unit_test: 'Unit Test',
  mock_exam: 'Mock Exam',
  diagnostic: 'Diagnostic Test',
  real_exam: 'Past Paper'
}

const EXAM_STATUS_MAP = {
  in_progress: 'In Progress',
  submitted: 'Submitted',
  graded: 'Graded'
}

const EXAM_MODE_MAP = {
  practice: 'Practice Mode',
  exam: 'Exam Mode',
  challenge: 'Challenge Mode'
}

const getChapterName = (chapterTitle) => {
  if (!chapterTitle) return null
  return chapterTitle.replace(/^Quick Exam - /i, '')
}

const STATUS_STYLES = {
  in_progress: { background: '#fef7e0', color: '#e37400' },
  submitted: { background: '#e8f0fe', color: '#185abc' },
  graded: { background: '#e6f4ea', color: '#0d652d' },
}

function ExamListPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState({ type: 'all', status: 'all' })
  const [slowLoading, setSlowLoading] = useState(false)

  useEffect(() => { fetchExams() }, [filter])

  const fetchExams = async () => {
    let slowTimer
    try {
      setLoading(true)
      setError(null)
      setSlowLoading(false)

      // 5秒后提示服务器冷启动
      slowTimer = setTimeout(() => setSlowLoading(true), 5000)

      const params = new URLSearchParams({ limit: '50' })
      if (filter.type !== 'all') params.append('type', filter.type)
      if (filter.status !== 'all') params.append('status', filter.status)

      const data = await get(`/api/exams?${params}`, { timeout: 60000 })
      setExams(data.exams || [])
    } catch (err) {
      console.error('Failed to fetch exam list:', err)
      setError('Failed to load exam list. Please try again later.')
    } finally {
      clearTimeout(slowTimer)
      setLoading(false)
      setSlowLoading(false)
    }
  }

  const handleExamClick = (exam) => {
    if (exam.status === 'in_progress') navigate(`/exams/${exam.id}/take`)
    else navigate(`/exams/${exam.id}/result`)
  }

  const handleAbandon = async (e, examId) => {
    e.stopPropagation()
    if (!window.confirm('Abandon this exam? Your progress will not be saved.')) return
    try {
      await del(`/api/exams/${examId}`)
      setExams(prev => prev.filter(ex => ex.id !== examId))
    } catch {
      // apiClient already shows Toast.error
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('en-GB', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    })
  }

  const getGradeColor = (rate) => {
    if (rate >= 80) return '#188038'
    if (rate >= 60) return '#e37400'
    return '#d93025'
  }

  if (loading) return <Loading message={slowLoading ? "Server is waking up, please wait..." : "Loading exams..."} size="large" fullScreen />

  const S = {
    page: { minHeight: '100vh', background: '#f8f9fa' },
    inner: { maxWidth: 1080, margin: '0 auto', padding: '32px 24px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 },
    title: { fontSize: 24, fontWeight: 600, color: '#202124', margin: 0 },
    card: { background: '#fff', border: '1px solid #dadce0', borderRadius: 8, padding: 24 },
    filterRow: { display: 'flex', gap: 16, flexWrap: 'wrap' },
    label: { display: 'block', fontSize: 13, color: '#5f6368', marginBottom: 6, fontWeight: 500 },
    select: { width: '100%', minWidth: 180, padding: '8px 12px', border: '1px solid #dadce0', borderRadius: 8, fontSize: 14, color: '#202124', background: '#fff', outline: 'none' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, marginTop: 24 },
    examCard: { background: '#fff', border: '1px solid #dadce0', borderRadius: 8, padding: 20, cursor: 'pointer', transition: 'box-shadow 0.15s, border-color 0.15s', display: 'flex', flexDirection: 'column' },
    badge: { display: 'inline-block', padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 500 },
    row: { display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '4px 0' },
    rowLabel: { color: '#5f6368' },
    rowValue: { color: '#202124', fontWeight: 500 },
    footer: { marginTop: 16, paddingTop: 12, borderTop: '1px solid #f1f3f4' },
    empty: { textAlign: 'center', padding: '60px 24px' },
    emptyTitle: { fontSize: 18, fontWeight: 500, color: '#202124', margin: '16px 0 8px' },
    emptyDesc: { fontSize: 14, color: '#5f6368', marginBottom: 24 },
    error: { background: '#fce8e6', border: '1px solid #fad2cf', borderRadius: 8, padding: 16, marginBottom: 24, textAlign: 'center' },
    errorText: { color: '#c5221f', fontSize: 14, marginBottom: 12 },
  }

  return (
    <div style={S.page}>
      <div style={S.inner}>
        {/* Header */}
        <div style={S.header}>
          <h1 style={S.title}>My Exams</h1>
          <Button variant="primary" size="md" onClick={() => navigate('/exams/create')}>
            + Create New Exam
          </Button>
        </div>

        {/* Filters */}
        <div style={{ ...S.card, marginBottom: 24 }}>
          <div style={S.filterRow}>
            <div style={{ flex: 1 }}>
              <label style={S.label}>Exam Type</label>
              <select style={S.select} value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })}>
                <option value="all">All Types</option>
                <option value="chapter_test">Chapter Test</option>
                <option value="unit_test">Unit Test</option>
                <option value="mock_exam">Mock Exam</option>
                <option value="diagnostic">Diagnostic Test</option>
                <option value="real_exam">Past Paper</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>Status</label>
              <select style={S.select} value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}>
                <option value="all">All Status</option>
                <option value="in_progress">In Progress</option>
                <option value="submitted">Submitted</option>
                <option value="graded">Graded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={S.error}>
            <p style={S.errorText}>{error}</p>
            <Button variant="primary" size="sm" onClick={fetchExams}>Retry</Button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && exams.length === 0 && (
          <div style={{ ...S.card, ...S.empty }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>📝</div>
            <h3 style={S.emptyTitle}>No exam records yet</h3>
            <p style={S.emptyDesc}>Create your first exam to get started</p>
            <Button variant="primary" size="md" onClick={() => navigate('/exams/create')}>Create Your First Exam</Button>
          </div>
        )}

        {/* Exam Cards */}
        {!loading && !error && exams.length > 0 && (
          <div style={S.grid}>
            {exams.map(exam => {
              const statusStyle = STATUS_STYLES[exam.status] || { background: '#f1f3f4', color: '#5f6368' }
              const accuracy = exam.totalCount ? Math.round((exam.correctCount / exam.totalCount) * 100) : 0

              return (
                <div
                  key={exam.id}
                  style={{ ...S.examCard, position: 'relative' }}
                  onClick={() => handleExamClick(exam)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a73e8'; e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#dadce0'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  {exam.status === 'in_progress' && (
                    <button
                      onClick={(e) => handleAbandon(e, exam.id)}
                      style={{
                        position: 'absolute', top: 10, right: 10,
                        width: 22, height: 22, borderRadius: '50%',
                        border: 'none', background: '#f1f3f4', color: '#5f6368',
                        fontSize: 14, lineHeight: '22px', textAlign: 'center',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1,
                      }}
                      title="Abandon exam"
                    >
                      ×
                    </button>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span style={{ fontSize: 16, fontWeight: 500, color: '#202124' }}>
                      {EXAM_TYPE_MAP[exam.type] || exam.type}
                    </span>
                    <span style={{ ...S.badge, ...statusStyle }}>
                      {EXAM_STATUS_MAP[exam.status] || exam.status}
                    </span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: 12 }}>
                      {getChapterName(exam.chapterTitle) && (
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#202124', marginBottom: 2 }}>
                          {getChapterName(exam.chapterTitle)}
                        </div>
                      )}
                      <div style={{ fontSize: 13, color: '#5f6368' }}>
                        {EXAM_MODE_MAP[exam.mode] || exam.mode}
                      </div>
                    </div>

                    <div style={S.row}>
                      <span style={S.rowLabel}>Questions</span>
                      <span style={S.rowValue}>{exam.totalCount || '-'}</span>
                    </div>

                    {exam.status === 'graded' && (
                      <>
                        <div style={S.row}>
                          <span style={S.rowLabel}>Score</span>
                          <span style={S.rowValue}>{exam.totalScore}/{exam.maxScore}</span>
                        </div>
                        <div style={S.row}>
                          <span style={S.rowLabel}>Accuracy</span>
                          <span style={{ fontWeight: 600, color: getGradeColor(accuracy) }}>{accuracy}%</span>
                        </div>
                      </>
                    )}

                    {exam.status === 'in_progress' && exam.answeredCount != null && (
                      <div style={S.row}>
                        <span style={S.rowLabel}>Answered</span>
                        <span style={{ fontWeight: 600, color: '#1a73e8' }}>
                          {exam.answeredCount}/{exam.totalCount || '?'}
                        </span>
                      </div>
                    )}

                    {exam.timeSpent && (
                      <div style={S.row}>
                        <span style={S.rowLabel}>Time</span>
                        <span style={S.rowValue}>{formatDuration(exam.timeSpent)}</span>
                      </div>
                    )}

                    <div style={{ fontSize: 12, color: '#80868b', marginTop: 12 }}>
                      {formatDate(exam.startedAt)}
                    </div>
                  </div>

                  <div style={S.footer}>
                    {exam.status === 'in_progress' && <Button variant="primary" size="sm" className="w-full">Continue</Button>}
                    {exam.status === 'graded' && <Button variant="secondary" size="sm" className="w-full">View Result</Button>}
                    {exam.status === 'submitted' && <Button variant="secondary" size="sm" className="w-full">View Details</Button>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ExamListPage
