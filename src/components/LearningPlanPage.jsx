import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { get, post, put } from '../utils/apiClient'
import Navbar from './Navbar'
import Loading from './common/Loading'
import Toast from './common/Toast'
import '../styles/LearningPlanPage.css'

/**
 * Phase 4 Day 10: Learning Plan Page (Optimized)
 *
 * Features:
 * - Display personalized learning recommendations
 * - Generate learning plans with progress tracking
 * - Track recommendation completion
 * - Show daily tasks and goals
 * - Progress visualization
 * - Toast notifications (using global component)
 */

function LearningPlanPage() {
  const navigate = useNavigate()

  const [recommendations, setRecommendations] = useState([])
  const [learningPlan, setLearningPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [planDuration, setPlanDuration] = useState(7)
  const [expandedRecs, setExpandedRecs] = useState({})
  const [completedTasks, setCompletedTasks] = useState({})
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchRecommendations()
    loadCompletedTasks()
  }, [])

  // Toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Load completed tasks from localStorage
  const loadCompletedTasks = () => {
    try {
      const saved = localStorage.getItem('completedTasks')
      if (saved) {
        setCompletedTasks(JSON.parse(saved))
      }
    } catch (err) {
      console.error('Failed to load completed tasks:', err)
    }
  }

  // Save completed tasks to localStorage
  const saveCompletedTasks = (tasks) => {
    try {
      localStorage.setItem('completedTasks', JSON.stringify(tasks))
      setCompletedTasks(tasks)
    } catch (err) {
      console.error('Failed to save completed tasks:', err)
    }
  }

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
        showToast('✓ Recommendation completed!', 'success')
        fetchRecommendations()
        setLearningPlan(null)
      } else {
        showToast('Failed to complete recommendation', 'error')
      }
    } catch (err) {
      console.error('Failed to complete recommendation:', err)
      showToast('Failed to complete recommendation', 'error')
    }
  }

  const skipRecommendation = async (recId) => {
    try {
      const result = await put(`/api/recommendations/${recId}/skip`)

      if (result.success) {
        showToast('Recommendation skipped', 'info')
        fetchRecommendations()
        setLearningPlan(null)
      } else {
        showToast('Failed to skip recommendation', 'error')
      }
    } catch (err) {
      console.error('Failed to skip recommendation:', err)
      showToast('Failed to skip recommendation', 'error')
    }
  }

  const toggleRecExpanded = (recId) => {
    setExpandedRecs(prev => ({
      ...prev,
      [recId]: !prev[recId]
    }))
  }

  const toggleTaskComplete = (dayIndex, taskIndex) => {
    const taskKey = `${dayIndex}-${taskIndex}`
    const newCompleted = {
      ...completedTasks,
      [taskKey]: !completedTasks[taskKey]
    }
    saveCompletedTasks(newCompleted)

    if (newCompleted[taskKey]) {
      showToast('✓ Task completed!', 'success')
    }
  }

  const getCompletionStats = () => {
    if (!learningPlan) return { completed: 0, total: 0, percentage: 0 }

    const total = learningPlan.totalTasks || 0
    const completed = Object.values(completedTasks).filter(Boolean).length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return { completed, total, percentage }
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
    return <Loading message="Loading your learning plan..." size="large" fullScreen />
  }

  return (
    <>
      <Navbar />
      <div className="learning-plan-page">
        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Header */}
        <div className="learning-plan-header">
          <h1>📅 My Learning Plan</h1>
          <p className="subtitle">Personalized recommendations based on your exam performance</p>
        </div>

      {error && (
        <div className="error-message">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Progress Overview */}
      {learningPlan && (
        <div className="progress-overview">
          <div className="progress-card">
            <div className="progress-header">
              <h3>📊 Overall Progress</h3>
              <span className="progress-percentage">{getCompletionStats().percentage}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${getCompletionStats().percentage}%` }}
              ></div>
            </div>
            <div className="progress-stats">
              <span>{getCompletionStats().completed} / {getCompletionStats().total} tasks completed</span>
            </div>
          </div>
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
              <div key={rec.id} className={`recommendation-card ${getPriorityClass(rec.priority)} ${expandedRecs[rec.id] ? 'expanded' : ''}`}>
                <div className="rec-header" onClick={() => toggleRecExpanded(rec.id)}>
                  <div className="rec-type">
                    <span className="type-icon">{getTypeIcon(rec.type)}</span>
                    <span className="type-label">{getTypeLabel(rec.type)}</span>
                  </div>
                  <div className="rec-header-right">
                    <span className="priority-badge">{getPriorityLabel(rec.priority)}</span>
                    <span className="expand-icon">{expandedRecs[rec.id] ? '▼' : '▶'}</span>
                  </div>
                </div>

                <div className="rec-content">
                  <p className="rec-reason">{rec.reason}</p>

                  {expandedRecs[rec.id] && (
                    <>
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

                      <div className="rec-actions">
                        <button
                          className="btn-complete"
                          onClick={(e) => {
                            e.stopPropagation()
                            completeRecommendation(rec.id)
                          }}
                        >
                          ✓ Mark as Done
                        </button>
                        <button
                          className="btn-skip"
                          onClick={(e) => {
                            e.stopPropagation()
                            skipRecommendation(rec.id)
                          }}
                        >
                          Skip
                        </button>
                      </div>
                    </>
                  )}
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
                  {learningPlan.plan.map((day, dayIndex) => {
                    const dayTasks = day.tasks.length
                    const dayCompleted = day.tasks.filter((_, taskIndex) =>
                      completedTasks[`${dayIndex}-${taskIndex}`]
                    ).length
                    const dayProgress = dayTasks > 0 ? Math.round((dayCompleted / dayTasks) * 100) : 0

                    return (
                      <div key={day.day} className="day-card">
                        <div className="day-header">
                          <div className="day-info">
                            <div className="day-number">Day {day.day}</div>
                            <div className="day-date">
                              {new Date(day.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                          <div className="day-progress-mini">
                            <span className="day-progress-text">{dayCompleted}/{dayTasks}</span>
                            <div className="day-progress-circle" style={{
                              background: `conic-gradient(#4CAF50 ${dayProgress * 3.6}deg, #e0e0e0 0deg)`
                            }}>
                              <div className="day-progress-inner">{dayProgress}%</div>
                            </div>
                          </div>
                        </div>

                        <div className="day-goal">
                          <span className="goal-icon">🎯</span>
                          <span className="goal-text">{day.goal}</span>
                        </div>

                        <div className="day-tasks">
                          {day.tasks.map((task, taskIndex) => {
                            const taskKey = `${dayIndex}-${taskIndex}`
                            const isCompleted = completedTasks[taskKey]

                            return (
                              <div
                                key={taskIndex}
                                className={`task-item ${isCompleted ? 'completed' : ''}`}
                                onClick={() => toggleTaskComplete(dayIndex, taskIndex)}
                              >
                                <div className="task-checkbox">
                                  {isCompleted ? '✓' : '○'}
                                </div>
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
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  )
}

export default LearningPlanPage
