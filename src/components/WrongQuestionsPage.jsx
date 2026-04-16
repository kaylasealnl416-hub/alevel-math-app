import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import QuestionCard from './QuestionCard'
import Loading from './common/Loading'
import Toast from './common/Toast'
import { Button } from './ui'
import { get, post } from '../utils/apiClient'
import { formatDate, getDifficultyLabel } from '../utils/helpers.js'

const DIFF_STYLES = {
  easy: { background: '#e6f4ea', color: '#0d652d' },
  medium: { background: '#fef7e0', color: '#e37400' },
  hard: { background: '#fce8e6', color: '#a50e0e' },
}

function WrongQuestionsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const userId = user?.id

  const [wrongQuestions, setWrongQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState({ topic: 'all', difficulty: 'all', examType: 'all' })
  const [showAnswer, setShowAnswer] = useState({})
  const [masteredIds, setMasteredIds] = useState(new Set())
  const [toast, setToast] = useState(null)
  const [hideMastered, setHideMastered] = useState(false)

  // userId 异步加载完成后再从 localStorage 读取 masteredIds
  useEffect(() => {
    if (!userId) return
    try {
      const stored = JSON.parse(localStorage.getItem(`mastered_${userId}`) || '[]')
      setMasteredIds(new Set(stored))
    } catch { /* 忽略解析错误 */ }
  }, [userId])

  useEffect(() => { fetchWrongQuestions() }, [])

  const fetchWrongQuestions = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await get(`/api/wrong-questions?limit=100`)
      const list = data?.wrongQuestions || data || []
      const wrong = (Array.isArray(list) ? list : []).map(wq => ({
        id: wq.question.id, type: wq.question.type, difficulty: wq.question.difficulty,
        content: wq.question.content, options: wq.question.options, answer: wq.question.answer,
        explanation: wq.question.explanation, tags: wq.question.tags, chapterId: wq.question.chapterId,
        examId: wq.examId, examType: wq.exam.type, examDate: wq.exam.createdAt,
        userAnswer: wq.userAnswer, aiFeedback: wq.aiFeedback, chapter: wq.chapter, attemptCount: 1,
        resultId: wq.id,
        isMastered: wq.isMastered || false,
      }))
      setWrongQuestions(wrong)
      // 用服务端数据初始化 masteredIds，与 localStorage 合并（以服务端为准）
      const serverMastered = new Set(wrong.filter(q => q.isMastered).map(q => q.id))
      setMasteredIds(prev => new Set([...serverMastered, ...prev]))
    } catch (err) {
      console.error('Failed to fetch wrong questions:', err)
      setError('Failed to load wrong questions. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const toggleAnswer = (questionId) => {
    setShowAnswer(prev => ({ ...prev, [questionId]: !prev[questionId] }))
  }

  const toggleMastered = async (question) => {
    const newSet = new Set(masteredIds)
    const nowMastered = !newSet.has(question.id)
    if (nowMastered) {
      newSet.add(question.id)
      setToast({ message: 'Marked as mastered!', type: 'success' })
    } else {
      newSet.delete(question.id)
      setToast({ message: 'Removed from mastered', type: 'info' })
    }
    setMasteredIds(newSet)
    // 同步写入服务端（真实持久化）
    post(`/api/wrong-questions/${question.resultId}/master`, { mastered: nowMastered }).catch(() => {})
    // 同时保留 localStorage 作为离线缓存
    localStorage.setItem(`mastered_${userId}`, JSON.stringify([...newSet]))
  }

  const topics = ['all', ...new Set(wrongQuestions.flatMap(q => q.tags || []))]
  const examTypes = ['all', ...new Set(wrongQuestions.map(q => q.examType))]

  const filteredQuestions = wrongQuestions.filter(q => {
    if (hideMastered && masteredIds.has(q.id)) return false
    if (filter.topic !== 'all' && !q.tags?.includes(filter.topic)) return false
    if (filter.difficulty !== 'all' && q.difficulty !== parseInt(filter.difficulty)) return false
    if (filter.examType !== 'all' && q.examType !== filter.examType) return false
    return true
  })

  const groupedByTopic = filteredQuestions.reduce((acc, q) => {
    const topic = q.tags?.[0] || 'Other'
    if (!acc[topic]) acc[topic] = []
    acc[topic].push(q)
    return acc
  }, {})

  const getDiffStyle = (d) => {
    if (d <= 2) return DIFF_STYLES.easy
    if (d === 3) return DIFF_STYLES.medium
    return DIFF_STYLES.hard
  }

  const getExamTypeLabel = (type) => {
    const labels = { chapter_test: 'Chapter Test', unit_test: 'Unit Test', mock_exam: 'Mock Exam', diagnostic: 'Diagnostic Test' }
    return labels[type] || type
  }

  // 从 chapterId 前缀推断 subject，用于跳转练习
  const getSubjectFromChapterId = (chapterId) => {
    if (!chapterId) return 'mathematics'
    if (chapterId.startsWith('pol')) return 'politics'
    if (chapterId.startsWith('psy')) return 'psychology'
    if (chapterId.startsWith('fmech')) return 'further-math'
    if (chapterId.startsWith('fm') || chapterId.startsWith('fs') || chapterId.startsWith('fp')) return 'further-math'
    if (chapterId.startsWith('e')) return 'economics'
    if (chapterId.startsWith('h')) return 'history'
    return 'mathematics'
  }

  const handleRetry = (question) => {
    const subject = getSubjectFromChapterId(question.chapterId)
    navigate(`/practice?chapter=${question.chapterId}&subject=${subject}`)
  }

  if (loading) return <Loading message="Loading wrong questions..." size="large" fullScreen />

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #dadce0', borderRadius: 8, padding: 32, textAlign: 'center', maxWidth: 400 }}>
          <p style={{ color: '#c5221f', fontSize: 14, marginBottom: 16 }}>{error}</p>
          <Button variant="primary" size="md" onClick={fetchWrongQuestions}>Retry</Button>
        </div>
      </div>
    )
  }

  const S = {
    page: { minHeight: '100vh', background: '#f8f9fa' },
    inner: { maxWidth: 1080, margin: '0 auto', padding: '32px 24px' },
    card: { background: '#fff', border: '1px solid #dadce0', borderRadius: 8, padding: 24 },
    label: { display: 'block', fontSize: 13, color: '#5f6368', marginBottom: 6, fontWeight: 500 },
    select: { width: '100%', padding: '8px 12px', border: '1px solid #dadce0', borderRadius: 8, fontSize: 14, color: '#202124', background: '#fff', outline: 'none' },
    badge: { display: 'inline-block', padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, textTransform: 'uppercase' },
    statCard: { background: '#fff', border: '1px solid #dadce0', borderRadius: 8, padding: 20, textAlign: 'center' },
    statNum: { fontSize: 32, fontWeight: 700, color: '#1a73e8', marginBottom: 4 },
    statLabel: { fontSize: 12, color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.5px' },
  }

  return (
    <div style={S.page}>
      <div style={S.inner}>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: '#202124', margin: '0 0 4px' }}>Wrong Questions</h1>
            <p style={{ fontSize: 14, color: '#5f6368', margin: 0 }}>Review and master your mistakes</p>
          </div>
          <button
            onClick={() => setHideMastered(v => !v)}
            style={{
              padding: '8px 16px', borderRadius: 8, border: '1px solid #dadce0',
              background: hideMastered ? '#e8f0fe' : '#fff',
              color: hideMastered ? '#1a73e8' : '#5f6368',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}
          >
            {hideMastered ? 'Show All' : `Hide Mastered (${masteredIds.size})`}
          </button>
        </div>

        {/* Statistics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          <div style={S.statCard}>
            <div style={S.statNum}>{wrongQuestions.length}</div>
            <div style={S.statLabel}>Total Wrong</div>
          </div>
          <div style={S.statCard}>
            <div style={S.statNum}>{Object.keys(groupedByTopic).length}</div>
            <div style={S.statLabel}>Topics</div>
          </div>
          <div style={S.statCard}>
            <div style={S.statNum}>{filteredQuestions.length}</div>
            <div style={S.statLabel}>Filtered</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ ...S.card, marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div>
              <label style={S.label}>Topic</label>
              <select style={S.select} value={filter.topic} onChange={e => setFilter({ ...filter, topic: e.target.value })}>
                {topics.map(t => <option key={t} value={t}>{t === 'all' ? 'All Topics' : t}</option>)}
              </select>
            </div>
            <div>
              <label style={S.label}>Difficulty</label>
              <select style={S.select} value={filter.difficulty} onChange={e => setFilter({ ...filter, difficulty: e.target.value })}>
                <option value="all">All Levels</option>
                <option value="1">Very Easy</option>
                <option value="2">Easy</option>
                <option value="3">Medium</option>
                <option value="4">Hard</option>
                <option value="5">Very Hard</option>
              </select>
            </div>
            <div>
              <label style={S.label}>Exam Type</label>
              <select style={S.select} value={filter.examType} onChange={e => setFilter({ ...filter, examType: e.target.value })}>
                {examTypes.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : getExamTypeLabel(t)}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Questions List */}
        {filteredQuestions.length === 0 ? (
          <div style={{ ...S.card, textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
            <h2 style={{ fontSize: 18, fontWeight: 500, color: '#202124', margin: '0 0 8px' }}>No wrong questions found!</h2>
            <p style={{ fontSize: 14, color: '#5f6368', marginBottom: 24 }}>
              {wrongQuestions.length === 0
                ? "No wrong questions yet. Complete a practice session, exam, or mock paper to start tracking mistakes."
                : "Try adjusting your filters to see more questions."}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="secondary" size="md" onClick={() => navigate('/practice')}>Start Practice</Button>
              <Button variant="primary" size="md" onClick={() => navigate('/exams')}>Take an Exam</Button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {Object.entries(groupedByTopic).map(([topic, questions]) => (
              <div key={topic} style={S.card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid #1a73e8' }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, color: '#202124', margin: 0 }}>{topic}</h2>
                  <span style={{ fontSize: 13, color: '#5f6368' }}>({questions.length} questions)</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {questions.map((question, index) => {
                    const isMastered = masteredIds.has(question.id)
                    return (
                    <div key={`${question.id}-${question.examId}`} style={{ border: `1px solid ${isMastered ? '#81c995' : '#dadce0'}`, borderRadius: 8, padding: 20, background: isMastered ? '#f0faf3' : '#f8f9fa' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12, alignItems: 'center' }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#1a73e8' }}>#{index + 1}</span>
                        <span style={{ ...S.badge, ...getDiffStyle(question.difficulty) }}>
                          {getDifficultyLabel(question.difficulty)}
                        </span>
                        <span style={{ ...S.badge, background: '#e8f0fe', color: '#185abc' }}>
                          {getExamTypeLabel(question.examType)}
                        </span>
                        {isMastered && (
                          <span style={{ ...S.badge, background: '#e6f4ea', color: '#0d652d' }}>✓ Mastered</span>
                        )}
                        <span style={{ fontSize: 13, color: '#80868b', marginLeft: 'auto' }}>
                          {formatDate(question.examDate)}
                        </span>
                      </div>

                      <QuestionCard
                        question={question}
                        questionNumber={index + 1}
                        totalQuestions={questions.length}
                        showAnswer={showAnswer[question.id]}
                      />

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12, alignItems: 'center' }}>
                        <Button
                          variant={showAnswer[question.id] ? 'secondary' : 'primary'}
                          size="sm"
                          onClick={() => toggleAnswer(question.id)}
                        >
                          {showAnswer[question.id] ? 'Hide Answer' : 'Show Answer'}
                        </Button>

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleRetry(question)}
                        >
                          Retry Chapter
                        </Button>

                        <Button
                          variant={isMastered ? 'secondary' : 'text'}
                          size="sm"
                          onClick={() => toggleMastered(question)}
                        >
                          {isMastered ? 'Unmark Mastered' : 'Mark as Mastered'}
                        </Button>

                        {!showAnswer[question.id] && (
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 12px', background: '#fff', borderRadius: 8, border: '1px solid #dadce0' }}>
                            <span style={{ fontSize: 13, color: '#5f6368' }}>Your answer:</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: '#d93025' }}>{question.userAnswer?.value || 'No answer'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default WrongQuestionsPage
