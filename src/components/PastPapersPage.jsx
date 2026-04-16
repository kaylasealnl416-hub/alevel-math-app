// ============================================================
// PastPapersPage — /past-papers
// 列出所有 type='mock_exam' 的题集，点击进入正式考试
// ============================================================

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MockExamView from './home/MockExamView.jsx'
import { T } from '../utils/translations.js'
import { get } from '../utils/apiClient.js'
import Toast from './common/Toast.jsx'

const S = {
  page: {
    minHeight: '100vh',
    background: '#f8f9fa',
    padding: '40px 20px 80px',
  },
  inner: {
    maxWidth: 960,
    margin: '0 auto',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#202124',
    margin: '0 0 8px',
  },
  subtitle: {
    fontSize: 15,
    color: '#5f6368',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 20,
    marginTop: 24,
  },
  card: {
    background: '#fff',
    borderRadius: 12,
    border: '1px solid #dadce0',
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    transition: 'box-shadow 0.2s, border-color 0.2s',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#202124',
    lineHeight: 1.35,
  },
  cardDesc: {
    fontSize: 13,
    color: '#5f6368',
    lineHeight: 1.5,
    flex: 1,
  },
  meta: {
    display: 'flex',
    gap: 16,
    fontSize: 13,
    color: '#5f6368',
    marginTop: 4,
  },
  badge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 4,
    background: '#e8f0fe',
    color: '#1a73e8',
    fontSize: 11,
    fontWeight: 600,
    marginBottom: 4,
  },
  btn: {
    marginTop: 12,
    padding: '10px 20px',
    background: '#1a73e8',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s',
    alignSelf: 'flex-start',
  },
  empty: {
    textAlign: 'center',
    padding: '64px 24px',
    color: '#5f6368',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  loading: {
    textAlign: 'center',
    padding: '64px 24px',
    color: '#5f6368',
    fontSize: 15,
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    background: '#fff',
    border: '1px solid #dadce0',
    borderRadius: 8,
    fontSize: 14,
    color: '#5f6368',
    cursor: 'pointer',
    marginBottom: 24,
    transition: 'border-color 0.15s',
  },
}

export default function PastPapersPage() {
  const [mockExams, setMockExams] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeSetId, setActiveSetId] = useState(null)
  const navigate = useNavigate()
  const t = T.en

  useEffect(() => {
    get('/api/question-sets/mock-exams')
      .then(data => {
        // data 是数组（examComposer 返回的 question_sets 行）
        setMockExams(Array.isArray(data) ? data : [])
      })
      .catch(err => {
        console.error('Failed to load mock exams:', err)
        Toast.error('Failed to load past papers')
        setMockExams([])
      })
      .finally(() => setLoading(false))
  }, [])

  // 进入考试模式时，渲染 MockExamView
  if (activeSetId) {
    return (
      <MockExamView
        questionSetId={activeSetId}
        onBack={() => setActiveSetId(null)}
        t={t}
        lang="en"
        subject="mathematics"
      />
    )
  }

  return (
    <div style={S.page}>
      <div style={S.inner}>
        {/* 顶部 */}
        <button style={S.backBtn} onClick={() => navigate('/')}>
          ← Back to Home
        </button>

        <div style={S.header}>
          <h1 style={S.title}>📋 Past Papers</h1>
          <p style={S.subtitle}>
            Timed full-paper mock exams — exam conditions, AI marking, and detailed feedback.
          </p>
        </div>

        {/* 内容区 */}
        {loading && (
          <div style={S.loading}>⏳ Loading past papers…</div>
        )}

        {!loading && mockExams && mockExams.length === 0 && (
          <div style={S.empty}>
            <div style={S.emptyIcon}>📭</div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>No past papers available yet</div>
            <div style={{ fontSize: 13 }}>Mock exams will appear here once they're added to the question bank.</div>
          </div>
        )}

        {!loading && mockExams && mockExams.length > 0 && (
          <div style={S.grid}>
            {mockExams.map(exam => {
              const mins = exam.timeLimit ? Math.round(exam.timeLimit / 60) : 90
              const pts = exam.totalPoints || '—'
              const qs = exam.totalQuestions || (exam.questionIds?.length) || '—'
              return (
                <div key={exam.id} style={S.card}>
                  <span style={S.badge}>Mock Exam</span>
                  <div style={S.cardTitle}>{exam.title}</div>
                  {exam.description && (
                    <div style={S.cardDesc}>{exam.description}</div>
                  )}
                  <div style={S.meta}>
                    <span>⏱️ {mins} min</span>
                    <span>📝 {qs} questions</span>
                    <span>🎯 {pts} marks</span>
                  </div>
                  <button
                    style={S.btn}
                    onClick={() => setActiveSetId(exam.id)}
                  >
                    Start Exam →
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
