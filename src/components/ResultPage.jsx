// ============================================================
// 答题结果页面
// 显示答题结果、统计信息、错题分析
// ============================================================

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import QuestionCard from './QuestionCard'
import { STORAGE_KEYS } from '../utils/constants'
import '../styles/ResultPage.css'

const ResultPage = () => {
  const { examId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [questionSet, setQuestionSet] = useState(null)
  const [questions, setQuestions] = useState([])
  const [userAnswers, setUserAnswers] = useState([])
  const [stats, setStats] = useState(null)
  const [selectedQuestion, setSelectedQuestion] = useState(null)

  useEffect(() => {
    loadResults()
  }, [examId])

  const loadResults = async () => {
    try {
      setLoading(true)

      // 加载试卷和题目
      const examResponse = await fetch(`/api/question-sets/${examId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
        }
      })

      const examData = await examResponse.json()

      if (!examData.success) {
        throw new Error(examData.error?.message || '加载失败')
      }

      setQuestionSet(examData.data.questionSet)
      setQuestions(examData.data.questions)

      // 加载用户答案
      const answersResponse = await fetch(`/api/user-answers?questionSetId=${examId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
        }
      })

      const answersData = await answersResponse.json()

      if (answersData.success) {
        setUserAnswers(answersData.data.answers || [])
        calculateStats(examData.data.questions, answersData.data.answers || [])
      }

    } catch (err) {
      setError(err.message || '加载结果失败')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (questions, answers) => {
    const total = questions.length
    const answered = answers.filter(a => a.userAnswer).length
    const correct = answers.filter(a => a.isCorrect).length
    const totalScore = answers.reduce((sum, a) => sum + (a.score || 0), 0)
    const totalTime = answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0)

    // 按难度统计
    const byDifficulty = {}
    questions.forEach(q => {
      const answer = answers.find(a => a.questionId === q.id)
      if (!byDifficulty[q.difficulty]) {
        byDifficulty[q.difficulty] = { total: 0, correct: 0 }
      }
      byDifficulty[q.difficulty].total++
      if (answer?.isCorrect) {
        byDifficulty[q.difficulty].correct++
      }
    })

    // 按知识点统计
    const byTag = {}
    questions.forEach(q => {
      const answer = answers.find(a => a.questionId === q.id)
      q.tags?.forEach(tag => {
        if (!byTag[tag]) {
          byTag[tag] = { total: 0, correct: 0 }
        }
        byTag[tag].total++
        if (answer?.isCorrect) {
          byTag[tag].correct++
        }
      })
    })

    setStats({
      total,
      answered,
      correct,
      accuracy: answered > 0 ? (correct / answered * 100).toFixed(1) : 0,
      totalScore,
      totalTime,
      avgTime: answered > 0 ? Math.round(totalTime / answered) : 0,
      byDifficulty,
      byTag
    })
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${String(secs).padStart(2, '0')}`
  }

  const getScoreColor = (accuracy) => {
    if (accuracy >= 90) return '#10b981'
    if (accuracy >= 70) return '#3b82f6'
    if (accuracy >= 60) return '#f59e0b'
    return '#ef4444'
  }

  if (loading) {
    return (
      <div className="result-page loading">
        <div className="loading-spinner">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="result-page error">
        <div className="error-message">⚠️ {error}</div>
        <button onClick={() => navigate('/practice')}>返回</button>
      </div>
    )
  }

  return (
    <div className="result-page">
      {/* 头部 */}
      <div className="result-header">
        <button className="back-btn" onClick={() => navigate('/practice')}>
          ← 返回练习
        </button>
        <h1 className="result-title">📊 答题结果</h1>
      </div>

      {/* 总体统计 */}
      <div className="result-summary">
        <div className="summary-card score-card">
          <div className="card-icon">🎯</div>
          <div className="card-content">
            <div className="card-label">正确率</div>
            <div
              className="card-value"
              style={{ color: getScoreColor(stats?.accuracy) }}
            >
              {stats?.accuracy}%
            </div>
            <div className="card-detail">
              {stats?.correct} / {stats?.answered} 题正确
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">⏱️</div>
          <div className="card-content">
            <div className="card-label">总用时</div>
            <div className="card-value">{formatTime(stats?.totalTime || 0)}</div>
            <div className="card-detail">
              平均 {stats?.avgTime || 0} 秒/题
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">📝</div>
          <div className="card-content">
            <div className="card-label">完成度</div>
            <div className="card-value">
              {stats?.answered} / {stats?.total}
            </div>
            <div className="card-detail">
              {stats?.total > 0 ? Math.round((stats?.answered / stats?.total) * 100) : 0}% 完成
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">💯</div>
          <div className="card-content">
            <div className="card-label">总得分</div>
            <div className="card-value">{stats?.totalScore || 0}</div>
            <div className="card-detail">
              满分 {(stats?.total || 0) * 10}
            </div>
          </div>
        </div>
      </div>

      {/* 难度分析 */}
      {stats?.byDifficulty && Object.keys(stats.byDifficulty).length > 0 && (
        <div className="result-section">
          <h2 className="section-title">📊 难度分析</h2>
          <div className="difficulty-stats">
            {Object.entries(stats.byDifficulty).map(([difficulty, data]) => {
              const rate = data.total > 0 ? (data.correct / data.total * 100).toFixed(0) : 0
              const difficultyLabels = {
                1: '非常简单',
                2: '简单',
                3: '中等',
                4: '困难',
                5: '非常困难'
              }
              return (
                <div key={difficulty} className="difficulty-item">
                  <div className="difficulty-label">
                    {difficultyLabels[difficulty]}
                  </div>
                  <div className="difficulty-bar">
                    <div
                      className="difficulty-bar-fill"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                  <div className="difficulty-value">
                    {data.correct}/{data.total} ({rate}%)
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 知识点分析 */}
      {stats?.byTag && Object.keys(stats.byTag).length > 0 && (
        <div className="result-section">
          <h2 className="section-title">🎓 知识点掌握情况</h2>
          <div className="tag-stats">
            {Object.entries(stats.byTag)
              .sort((a, b) => {
                const rateA = a[1].total > 0 ? a[1].correct / a[1].total : 0
                const rateB = b[1].total > 0 ? b[1].correct / b[1].total : 0
                return rateA - rateB
              })
              .map(([tag, data]) => {
                const rate = data.total > 0 ? (data.correct / data.total * 100).toFixed(0) : 0
                const isWeak = rate < 60
                return (
                  <div key={tag} className={`tag-item ${isWeak ? 'weak' : ''}`}>
                    <div className="tag-name">
                      {isWeak && '⚠️ '}{tag}
                    </div>
                    <div className="tag-progress">
                      <div
                        className="tag-progress-fill"
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                    <div className="tag-value">
                      {data.correct}/{data.total} ({rate}%)
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* 错题列表 */}
      <div className="result-section">
        <h2 className="section-title">❌ 错题回顾</h2>
        <div className="wrong-questions">
          {questions
            .filter(q => {
              const answer = userAnswers.find(a => a.questionId === q.id)
              return answer && !answer.isCorrect
            })
            .map((q, index) => {
              const answer = userAnswers.find(a => a.questionId === q.id)
              return (
                <div key={q.id} className="wrong-question-item">
                  <div className="wrong-question-header">
                    <span className="wrong-number">错题 {index + 1}</span>
                    <button
                      className="view-detail-btn"
                      onClick={() => setSelectedQuestion(q)}
                    >
                      查看详情
                    </button>
                  </div>
                  <QuestionCard
                    question={q}
                    questionNumber={questions.findIndex(qq => qq.id === q.id) + 1}
                    totalQuestions={questions.length}
                    showAnswer={true}
                  />
                  <div className="user-answer-section">
                    <div className="user-answer-label">你的答案：</div>
                    <div className="user-answer-value incorrect">
                      {answer?.userAnswer || '未作答'}
                    </div>
                  </div>
                </div>
              )
            })}
          {questions.filter(q => {
            const answer = userAnswers.find(a => a.questionId === q.id)
            return answer && !answer.isCorrect
          }).length === 0 && (
            <div className="no-wrong-questions">
              🎉 太棒了！没有错题！
            </div>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="result-actions">
        <button
          className="action-btn secondary"
          onClick={() => navigate('/practice')}
        >
          返回练习
        </button>
        <button
          className="action-btn primary"
          onClick={() => navigate('/practice')}
        >
          再练一次
        </button>
      </div>
    </div>
  )
}

export default ResultPage
