import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { get, post, put } from '../utils/apiClient'
import '../styles/LearningPlanPage.css'

/**
 * Phase 4 Day 10: Learning Plan Page
 *
 * Features:
 * - Display personalized learning recommendations
 * - Generate learning plans
 * - Track recommendation completion
 * - Show daily tasks and goals
 */

function LearningPlanPage() {
  const navigate = useNavigate()

  const [recommendations, setRecommendations] = useState([])
  const [learningPlan, setLearningPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [planDuration, setPlanDuration] = useState(7)

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await get('/api/recommendations?status=pending')

      if (result.success) {
        setRecommendations(result.data)
      } else {
        setError(result.error.message)
      }
    } catch (err) {
      console.error('Failed to fetch recommendations:', err)
      setError('Failed to load recommendations')
    } finally {
      setLoading(false)
    }
  }

  const generatePlan = async () => {
    try {
      setGenerating(true)
      setError(null)

      const result = await post('/api/learning-plans/generate', {
        duration: planDuration
      })

      if (result.success) {
        setLearningPlan(result.data)
      } else {
        setError(result.error.message)
      }
    } catch (err) {
      console.error('Failed to generate plan:', err)
      setError('Failed to generate learning plan')
    } finally {
      setGenerating(false)
    }
  }

  const completeRecommendation = async (recId) => {
    try {
      const result = await put(`/api/recommendations/${recId}/complete`)

      if (result.success) {
        // Refresh recommendations
        fetchRecommendations()
        // Clear learning plan to regenerate
        setLearningPlan(null)
      }
    } catch (err) {
      console.error('Failed to complete recommendation:', err)
    }
  }

  const skipRecommendation = async (recId) => {
    try {
      const result = await put(`/api/recommendations/${recId}/skip`)

      if (result.success) {
        fetchRecommendations()
        setLearningPlan(null)
      }
    } catch (err) {
      console.error('Failed to skip recommendation:', err)
    }
  }

  const getTypeIcon = (type) => {
    const icons = {
      chapter: '📚',
      practice: '✏️',
      review: '🔄',
      video: '🎥'
    }
    return icons[type] || '📝'
  }

  const getTypeLabel = (type) => {
    const labels = {
      chapter: '章节学习',
      practice: '练习题',
      review: '错题复习',
      video: '视频学习'
    }
    return labels[type] || type
  }

  const getPriorityClass = (priority) => {
    if (priority >= 4) return 'priority-high'
    if (priority >= 3) return 'priority-medium'
    return 'priority-low'
  }

  const getPriorityLabel = (priority) => {
    if (priority >= 4) return '高优先级'
    if (priority >= 3) return '中优先级'
    return '低优先级'
  }

  if (loading) {
    return (
      <div className="learning-plan-loading">
        <div className="spinner"></div>
        <p>Loading your learning plan...</p>
      </div>
    )
  }

  return (
    <div className="learning-plan-page">
      {/* Header */}
      <div className="learning-plan-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <h1>📅 My Learning Plan</h1>
        <p className="subtitle">Personalized recommendations based on your exam performance</p>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Recommendations Section */}
      <div className="recommendations-section">
        <div className="section-header">
          <h2>🎯 Learning Recommendations</h2>
          <span className="count-badge">{recommendations.length} pending</span>
        </div>

        {recommendations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎉</div>
            <h3>All caught up!</h3>
            <p>Complete an exam to get personalized recommendations</p>
            <button className="btn-primary" onClick={() => navigate('/exams')}>
              Take an Exam
            </button>
          </div>
        ) : (
          <div className="recommendations-list">
            {recommendations.map((rec) => (
              <div key={rec.id} className={`recommendation-card ${getPriorityClass(rec.priority)}`}>
                <div className="rec-header">
                  <div className="rec-type">
                    <span className="type-icon">{getTypeIcon(rec.type)}</span>
                    <span className="type-label">{getTypeLabel(rec.type)}</span>
                  </div>
                  <span className="priority-badge">{getPriorityLabel(rec.priority)}</span>
                </div>

                <div className="rec-content">
                  <p className="rec-reason">{rec.reason}</p>

                  {rec.weakTopics && rec.weakTopics.length > 0 && (
                    <div className="weak-topics">
                      <span className="label">薄弱知识点：</span>
                      <div className="topics-list">
                        {rec.weakTopics.map((topic, i) => (
                          <span key={i} className="topic-tag">{topic}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {rec.chapter && (
                    <div className="chapter-info">
                      <span className="label">推荐章节：</span>
                      <span className="chapter-title">{rec.chapter.title?.zh || rec.chapter.title}</span>
                    </div>
                  )}
                </div>

                <div className="rec-actions">
                  <button
                    className="btn-complete"
                    onClick={() => completeRecommendation(rec.id)}
                  >
                    ✓ Mark as Done
                  </button>
                  <button
                    className="btn-skip"
                    onClick={() => skipRecommendation(rec.id)}
                  >
                    Skip
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Learning Plan Generator */}
      {recommendations.length > 0 && (
        <div className="plan-generator-section">
          <div className="section-header">
            <h2>📆 Generate Study Plan</h2>
          </div>

          <div className="plan-generator">
            <div className="generator-controls">
              <label>
                Plan Duration:
                <select
                  value={planDuration}
                  onChange={(e) => setPlanDuration(Number(e.target.value))}
                >
                  <option value={3}>3 days</option>
                  <option value={7}>7 days (1 week)</option>
                  <option value={14}>14 days (2 weeks)</option>
                  <option value={30}>30 days (1 month)</option>
                </select>
              </label>

              <button
                className="btn-generate"
                onClick={generatePlan}
                disabled={generating}
              >
                {generating ? 'Generating...' : '🚀 Generate Plan'}
              </button>
            </div>

            {learningPlan && (
              <div className="learning-plan-result">
                <div className="plan-summary">
                  <h3>Your {learningPlan.duration}-Day Study Plan</h3>
                  <p>Total tasks: {learningPlan.totalTasks}</p>
                </div>

                <div className="plan-timeline">
                  {learningPlan.plan.map((day) => (
                    <div key={day.day} className="day-card">
                      <div className="day-header">
                        <div className="day-number">Day {day.day}</div>
                        <div className="day-date">
                          {new Date(day.date).toLocaleDateString('zh-CN', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>

                      <div className="day-goal">
                        <span className="goal-icon">🎯</span>
                        <span className="goal-text">{day.goal}</span>
                      </div>

                      <div className="day-tasks">
                        {day.tasks.map((task, i) => (
                          <div key={i} className="task-item">
                            <span className="task-icon">{getTypeIcon(task.type)}</span>
                            <div className="task-content">
                              <div className="task-description">{task.description}</div>
                              <div className="task-meta">
                                <span className="task-time">⏱️ {task.estimatedTime} min</span>
                                <span className={`task-priority ${getPriorityClass(task.priority)}`}>
                                  {getPriorityLabel(task.priority)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default LearningPlanPage
