import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ScoreCard from './exam/ScoreCard'
import AIFeedback from './exam/AIFeedback'
import Loading from './common/Loading'
import Toast from './common/Toast'
import { Button } from './ui'
import { get } from '../utils/apiClient'

function ExamResultPage() {
  const { examId } = useParams()
  const navigate = useNavigate()

  const [exam, setExam] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [aiFeedback, setAiFeedback] = useState(null)
  const [loadingFeedback, setLoadingFeedback] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => { fetchExamResult() }, [examId])

  useEffect(() => {
    if (exam && exam.status === 'graded') fetchAIFeedback()
  }, [exam])

  const fetchExamResult = async () => {
    try {
      setLoading(true); setError(null)
      const data = await get(`/api/exams/${examId}`)
      setExam(data)
      setQuestions(data.questionSet?.questions || [])
    } catch (err) {
      console.error('Failed to fetch exam result:', err)
      setError('Failed to load exam result. Please try again later.')
    } finally { setLoading(false) }
  }

  const fetchAIFeedback = async () => {
    try {
      setLoadingFeedback(true)
      const data = await get(`/api/exams/${examId}/feedback`)
      setAiFeedback(data)
    } catch (err) {
      console.error('Failed to fetch AI feedback:', err)
    } finally { setLoadingFeedback(false) }
  }

  const shareResults = () => {
    const pct = exam.totalCount > 0 ? Math.round((exam.correctCount / exam.totalCount) * 100) : 0
    const text = `I scored ${exam.totalScore}/${exam.maxScore} (${pct}%) on my A-Level exam!`

    if (navigator.share) {
      navigator.share({ title: 'My Exam Results', text, url: window.location.href })
        .catch(() => copyToClipboard(text))
    } else {
      copyToClipboard(text)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setToast({ message: 'Results copied to clipboard!', type: 'success' })
    }).catch(() => {
      setToast({ message: 'Failed to copy', type: 'error' })
    })
  }

  const getQuestionResult = (questionId) => {
    const rawAnswer = exam.answers[questionId]
    const question = questions.find(q => q.id === questionId)
    if (!question) return null
    const isMCQ = question.type === 'multiple_choice'
    const userAnswerText = typeof rawAnswer === 'string'
      ? rawAnswer
      : (rawAnswer?.value ?? '')
    const isCorrect = isMCQ ? (userAnswerText === question.answer?.value) : null
    return { rawAnswer, userAnswerText, question, isCorrect, isMCQ }
  }

  if (loading) return <Loading message="Loading exam results..." size="large" fullScreen />

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #dadce0', borderRadius: 8, padding: 32, textAlign: 'center', maxWidth: 400 }}>
          <p style={{ color: '#c5221f', fontSize: 14, marginBottom: 16 }}>{error}</p>
          <Button variant="primary" size="md" onClick={() => navigate('/exams')}>Back to Exam List</Button>
        </div>
      </div>
    )
  }

  if (!exam || exam.status === 'in_progress') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #dadce0', borderRadius: 8, padding: 32, textAlign: 'center', maxWidth: 400 }}>
          <p style={{ color: '#5f6368', fontSize: 14, marginBottom: 16 }}>This exam has not been submitted yet.</p>
          <Button variant="primary" size="md" onClick={() => navigate(`/exams/${examId}/take`)}>Continue Exam</Button>
        </div>
      </div>
    )
  }

  const percentage = exam.totalCount > 0 ? Math.round((exam.correctCount / exam.totalCount) * 100) : 0

  const S = {
    page: { minHeight: '100vh', background: '#f8f9fa' },
    inner: { maxWidth: 1080, margin: '0 auto', padding: '32px 24px' },
    header: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: 24, flexWrap: 'wrap', gap: 12,
    },
    title: { fontSize: 24, fontWeight: 600, color: '#202124', margin: 0 },
    statsSection: {
      background: '#fff', border: '1px solid #dadce0', borderRadius: 8,
      padding: 24, marginBottom: 24,
    },
    sectionTitle: { fontSize: 18, fontWeight: 500, color: '#202124', margin: '0 0 16px' },
    statsGrid: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16,
    },
    statCard: {
      background: '#f8f9fa', borderRadius: 8, padding: 16,
    },
    statCardTitle: { fontSize: 14, fontWeight: 500, color: '#202124', margin: '0 0 10px' },
    statItem: {
      display: 'flex', justifyContent: 'space-between', padding: '4px 0',
      fontSize: 14,
    },
    statLabel: { color: '#5f6368' },
    statValue: { color: '#202124', fontWeight: 500 },
    statPercent: { fontSize: 12, color: '#80868b', marginLeft: 4 },
    reviewSection: {
      background: '#fff', border: '1px solid #dadce0', borderRadius: 8,
      padding: 24, marginBottom: 24,
    },
    questionCard: (isCorrect) => ({
      border: '1px solid',
      borderColor: isCorrect === null ? '#dadce0' : isCorrect ? '#81c995' : '#f5bcba',
      borderRadius: 8, padding: 20, marginBottom: 12,
      borderLeftWidth: 4,
      borderLeftColor: isCorrect === null ? '#1a73e8' : isCorrect ? '#188038' : '#d93025',
    }),
    questionHeader: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: 12, flexWrap: 'wrap', gap: 8,
    },
    questionNum: { fontSize: 15, fontWeight: 500, color: '#202124' },
    resultBadge: (isCorrect) => ({
      padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
      background: isCorrect ? '#e6f4ea' : '#fce8e6',
      color: isCorrect ? '#0d652d' : '#a50e0e',
    }),
    tag: {
      display: 'inline-block', padding: '2px 8px', borderRadius: 4,
      fontSize: 11, background: '#f1f3f4', color: '#5f6368', marginRight: 4,
    },
    questionText: { fontSize: 14, color: '#202124', lineHeight: 1.6, margin: '12px 0' },
    optionItem: (isUser, isCorrect) => ({
      padding: '8px 12px', borderRadius: 6, fontSize: 14, marginBottom: 4,
      border: '1px solid',
      background: isCorrect ? '#e6f4ea' : isUser ? '#fce8e6' : '#fff',
      borderColor: isCorrect ? '#81c995' : isUser ? '#f5bcba' : '#f1f3f4',
      color: '#202124',
    }),
    optionBadge: {
      fontSize: 11, fontWeight: 600, marginLeft: 8, padding: '2px 6px',
      borderRadius: 4, background: '#f1f3f4', color: '#5f6368',
    },
    explanation: {
      background: '#e8f0fe', borderRadius: 8, padding: 14, marginTop: 12,
    },
    explanationTitle: { fontSize: 13, fontWeight: 500, color: '#185abc', margin: '0 0 6px' },
    explanationText: { fontSize: 13, color: '#202124', lineHeight: 1.5, margin: 0 },
    actions: {
      display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8,
    },
  }

  return (
    <div style={S.page}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={S.inner}>
        {/* Header */}
        <div style={S.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button variant="secondary" size="sm" onClick={() => navigate('/exams')}>
              ← Back
            </Button>
            <div>
              <h1 style={{ ...S.title, marginBottom: exam.questionSet?.title ? 2 : 0 }}>Exam Results</h1>
              {exam.questionSet?.title && (
                <div style={{ fontSize: 13, color: '#5f6368' }}>
                  {exam.questionSet.title.replace(/^Quick Exam - /i, '')}
                </div>
              )}
            </div>
          </div>
          <Button variant="text" size="sm" onClick={shareResults}>Share</Button>
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
        {(exam.difficultyStats || (exam.topicStats && Object.keys(exam.topicStats).length > 0)) && (
          <div style={S.statsSection}>
            <h2 style={S.sectionTitle}>Performance Breakdown</h2>
            <div style={S.statsGrid}>
              {exam.difficultyStats && (
                <div style={S.statCard}>
                  <h3 style={S.statCardTitle}>By Difficulty</h3>
                  {['easy', 'medium', 'hard'].map(level => {
                    const stats = exam.difficultyStats[level]
                    if (!stats || stats.total === 0) return null
                    return (
                      <div key={level} style={S.statItem}>
                        <span style={S.statLabel}>{level.charAt(0).toUpperCase() + level.slice(1)}</span>
                        <span style={S.statValue}>
                          {stats.correct}/{stats.total}
                          <span style={S.statPercent}>
                            ({Math.round((stats.correct / stats.total) * 100)}%)
                          </span>
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}

              {exam.topicStats && Object.keys(exam.topicStats).length > 0 && (
                <div style={S.statCard}>
                  <h3 style={S.statCardTitle}>By Topic</h3>
                  {Object.entries(exam.topicStats).map(([topic, stats]) => (
                    <div key={topic} style={S.statItem}>
                      <span style={S.statLabel}>{topic}</span>
                      <span style={S.statValue}>
                        {stats.correct}/{stats.total}
                        <span style={S.statPercent}>
                          ({Math.round((stats.correct / stats.total) * 100)}%)
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Feedback */}
        <AIFeedback feedback={aiFeedback} loading={loadingFeedback} />

        {/* Question Results */}
        <div style={S.reviewSection}>
          <h2 style={S.sectionTitle}>Question-by-Question Review</h2>

          {questions.map((question, index) => {
            const result = getQuestionResult(question.id)
            if (!result) return null

            return (
              <div key={question.id} style={S.questionCard(result.isCorrect)}>
                <div style={S.questionHeader}>
                  <span style={S.questionNum}>
                    Question {index + 1}
                  </span>
                  {result.isMCQ ? (
                    <span style={S.resultBadge(result.isCorrect)}>
                      {result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  ) : (
                    <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: '#e8f0fe', color: '#185abc' }}>
                      AI Graded
                    </span>
                  )}
                </div>

                {question.tags && question.tags.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    {question.tags.map((tag) => (
                      <span key={tag} style={S.tag}>{tag}</span>
                    ))}
                  </div>
                )}

                <p style={S.questionText}>
                  {question.content?.en || question.content}
                </p>

                {question.type === 'multiple_choice' && question.options && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                    {(Array.isArray(question.options)
                      ? question.options.map((opt) => {
                          const letter = opt.match(/^([A-D])/)?.[1]
                          return { key: opt, text: opt, letter }
                        })
                      : Object.entries(question.options).map(([letter, text]) => ({
                          key: letter, text: `${letter}. ${text}`, letter
                        }))
                    ).map(({ key, text, letter }) => {
                      const isUserAnswer = letter === result.userAnswerText
                      const isCorrectAnswer = letter === question.answer?.value
                      return (
                        <div key={key} style={S.optionItem(isUserAnswer && !isCorrectAnswer, isCorrectAnswer)}>
                          {text}
                          {isUserAnswer && !isCorrectAnswer && <span style={S.optionBadge}>Your answer</span>}
                          {isCorrectAnswer && <span style={{ ...S.optionBadge, background: '#e6f4ea', color: '#0d652d' }}>Correct</span>}
                        </div>
                      )
                    })}
                  </div>
                )}

                {!result.isMCQ && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ background: '#f8f9fa', borderRadius: 8, padding: '10px 14px', marginBottom: 8, border: '1px solid #e8eaed' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#5f6368', marginBottom: 4 }}>YOUR ANSWER</div>
                      <div style={{ fontSize: 14, color: '#202124', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {result.userAnswerText || <span style={{ color: '#9aa0a6', fontStyle: 'italic' }}>No answer submitted</span>}
                      </div>
                    </div>
                    {question.answer?.value && (
                      <div style={{ background: '#e6f4ea', borderRadius: 8, padding: '10px 14px', border: '1px solid #81c995' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#0d652d', marginBottom: 4 }}>MODEL ANSWER</div>
                        <div style={{ fontSize: 14, color: '#202124', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                          {question.answer.value}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Mark scheme / answer breakdown */}
                {question.answer?.explanation && (
                  <div style={S.explanation}>
                    <h4 style={S.explanationTitle}>Mark Scheme</h4>
                    <p style={S.explanationText}>
                      {typeof question.answer.explanation === 'object'
                        ? (question.answer.explanation.en || JSON.stringify(question.answer.explanation))
                        : question.answer.explanation}
                    </p>
                  </div>
                )}

                {/* Full solution */}
                {question.explanation?.en && (
                  <div style={{ ...S.explanation, background: '#e8f0fe', borderLeft: '3px solid #1a73e8', marginTop: 8 }}>
                    <h4 style={{ ...S.explanationTitle, color: '#1a73e8' }}>Solution</h4>
                    <p style={{ ...S.explanationText, whiteSpace: 'pre-line' }}>{question.explanation.en}</p>
                  </div>
                )}

                {/* Key formula + Common mistake side by side */}
                {(question.explanation?.keyFormula || question.explanation?.commonMistake) && (
                  <div style={{ display: 'grid', gridTemplateColumns: question.explanation.keyFormula && question.explanation.commonMistake ? '1fr 1fr' : '1fr', gap: 8, marginTop: 8 }}>
                    {question.explanation.keyFormula && (
                      <div style={{ background: '#fffbeb', borderRadius: 8, padding: '10px 14px', border: '1px solid #fde68a' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#92400e', marginBottom: 4 }}>🔑 KEY FORMULA</div>
                        <div style={{ fontSize: 13, color: '#5f6368', lineHeight: 1.6 }}>{question.explanation.keyFormula}</div>
                      </div>
                    )}
                    {question.explanation.commonMistake && (
                      <div style={{ background: '#fef2f2', borderRadius: 8, padding: '10px 14px', border: '1px solid #fecaca' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#991b1b', marginBottom: 4 }}>⚠️ COMMON MISTAKE</div>
                        <div style={{ fontSize: 13, color: '#5f6368', lineHeight: 1.6 }}>{question.explanation.commonMistake}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Why other options wrong — MCQ only, when answer is wrong */}
                {result.isMCQ && !result.isCorrect && question.explanation?.whyOthersWrong &&
                  Object.keys(question.explanation.whyOthersWrong).length > 0 && (
                  <div style={{ marginTop: 8, background: '#fff', border: '1px solid #fecaca', borderRadius: 8, overflow: 'hidden' }}>
                    <div style={{ padding: '8px 14px', background: '#fef2f2', borderBottom: '1px solid #fecaca', fontSize: 12, fontWeight: 700, color: '#991b1b' }}>
                      🔍 Why Other Options Are Wrong
                    </div>
                    <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {Object.entries(question.explanation.whyOthersWrong).map(([letter, reason]) => (
                        <div key={letter} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                          <span style={{
                            background: letter === result.userAnswerText ? '#fef2f2' : '#f1f3f4',
                            color: letter === result.userAnswerText ? '#d93025' : '#5f6368',
                            fontWeight: 700, padding: '2px 7px', borderRadius: 5, fontSize: 12, flexShrink: 0,
                          }}>
                            {letter} ✗
                          </span>
                          <span style={{ fontSize: 13, color: '#202124', lineHeight: 1.5 }}>
                            {letter === result.userAnswerText && <strong>Your choice — </strong>}{reason}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Actions */}
        <div style={S.actions}>
          <Button variant="primary" size="md" onClick={() => navigate('/exams')}>Back to Exam List</Button>
          <Button variant="secondary" size="md" onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    </div>
  )
}

export default ExamResultPage
