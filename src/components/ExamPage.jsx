// ============================================================
// 答题页面
// 显示题目，收集答案，提交试卷
// ============================================================

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import QuestionCard from './QuestionCard'
import AnswerInput from './AnswerInput'
import Timer from './Timer'
import ProgressBar from './ProgressBar'
import { STORAGE_KEYS } from '../utils/constants'
import '../styles/ExamPage.css'

const ExamPage = () => {
  const { examId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [questionSet, setQuestionSet] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [startTime, setStartTime] = useState(Date.now())
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  // 加载试卷和题目
  useEffect(() => {
    loadExam()
  }, [examId])

  const loadExam = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/question-sets/${examId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
        }
      })

      const data = await response.json()

      if (data.success) {
        setQuestionSet(data.data.questionSet)
        setQuestions(data.data.questions)
        setStartTime(Date.now())
      } else {
        setError(data.error?.message || '加载试卷失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 保存答案
  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  // 上一题
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  // 下一题
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  // 跳转到指定题目
  const handleJumpTo = (index) => {
    setCurrentIndex(index)
  }

  // 提交试卷
  const handleSubmit = async () => {
    setShowConfirmDialog(false)

    try {
      const endTime = Date.now()
      const timeSpent = Math.floor((endTime - startTime) / 1000)

      // 构建答案数据
      const userAnswers = questions.map(q => ({
        questionId: q.id,
        userAnswer: answers[q.id] || '',
        timeSpent: Math.floor(timeSpent / questions.length) // 平均时间
      }))

      // 提交答案
      const response = await fetch('/api/user-answers/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
        },
        body: JSON.stringify({
          questionSetId: parseInt(examId),
          answers: userAnswers
        })
      })

      const data = await response.json()

      if (data.success) {
        // 跳转到结果页面
        navigate(`/practice/result/${examId}`)
      } else {
        setError(data.error?.message || '提交失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
    }
  }

  // 时间到自动提交
  const handleTimeUp = () => {
    alert('时间到！试卷将自动提交。')
    handleSubmit()
  }

  if (loading) {
    return (
      <div className="exam-page loading">
        <div className="loading-spinner">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="exam-page error">
        <div className="error-message">⚠️ {error}</div>
        <button onClick={() => navigate('/practice')}>返回</button>
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="exam-page empty">
        <div className="empty-message">没有找到题目</div>
        <button onClick={() => navigate('/practice')}>返回</button>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const answeredCount = Object.keys(answers).filter(key => answers[key]).length

  return (
    <div className="exam-page">
      {/* 顶部工具栏 */}
      <div className="exam-toolbar">
        <div className="toolbar-left">
          <button className="back-btn" onClick={() => navigate('/practice')}>
            ← 返回
          </button>
          <h2 className="exam-title">{questionSet?.title || '练习'}</h2>
        </div>
        <div className="toolbar-right">
          <Timer
            timeLimit={questionSet?.timeLimit}
            onTimeUp={handleTimeUp}
          />
        </div>
      </div>

      {/* 进度条 */}
      <div className="exam-progress">
        <ProgressBar
          current={currentIndex + 1}
          total={questions.length}
          answered={answeredCount}
        />
      </div>

      {/* 主内容区 */}
      <div className="exam-content">
        {/* 题目卡片 */}
        <div className="exam-question">
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
          />
        </div>

        {/* 答题输入 */}
        <div className="exam-answer">
          <AnswerInput
            question={currentQuestion}
            value={answers[currentQuestion.id]}
            onChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          />
        </div>
      </div>

      {/* 底部导航 */}
      <div className="exam-navigation">
        <div className="nav-buttons">
          <button
            className="nav-btn prev"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            ← 上一题
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              className="nav-btn next"
              onClick={handleNext}
            >
              下一题 →
            </button>
          ) : (
            <button
              className="nav-btn submit"
              onClick={() => setShowConfirmDialog(true)}
            >
              提交试卷 ✓
            </button>
          )}
        </div>

        {/* 题目导航 */}
        <div className="question-navigator">
          <div className="navigator-label">题目导航</div>
          <div className="navigator-grid">
            {questions.map((q, index) => (
              <button
                key={q.id}
                className={`navigator-item ${index === currentIndex ? 'current' : ''} ${answers[q.id] ? 'answered' : ''}`}
                onClick={() => handleJumpTo(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 确认提交对话框 */}
      {showConfirmDialog && (
        <div className="confirm-dialog-overlay" onClick={() => setShowConfirmDialog(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>确认提交？</h3>
            <p>
              你已完成 <strong>{answeredCount}</strong> / {questions.length} 题
            </p>
            {answeredCount < questions.length && (
              <p className="warning">还有 {questions.length - answeredCount} 题未作答</p>
            )}
            <div className="dialog-actions">
              <button className="btn-cancel" onClick={() => setShowConfirmDialog(false)}>
                继续答题
              </button>
              <button className="btn-confirm" onClick={handleSubmit}>
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExamPage
