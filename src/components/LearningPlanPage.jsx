import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { get, post, put } from '../utils/apiClient'
import Navbar from './Navbar'
import Loading from './common/Loading'
import Toast from './common/Toast'
import { Button } from './ui'

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
    if (priority >= 4) return 'border-l-4 border-error-500'
    if (priority >= 3) return 'border-l-4 border-warning-500'
    return 'border-l-4 border-success-500'
  }

  const getPriorityLabel = (priority) => {
    if (priority >= 4) return '高优先级'
    if (priority >= 3) return '中优先级'
    return '低优先级'
  }

  const getPriorityBadgeClass = (priority) => {
    if (priority >= 4) return 'bg-error-100 text-error-600'
    if (priority >= 3) return 'bg-warning-100 text-warning-600'
    return 'bg-success-100 text-success-600'
  }

  if (loading) {
    return <Loading message="Loading your learning plan..." size="large" fullScreen />
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Toast Notification */}
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">📅 My Learning Plan</h1>
            <p className="text-lg text-gray-600">Personalized recommendations based on your exam performance</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-error-50 border border-error-200 rounded-xl p-4 mb-8 flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <p className="text-error-700">{error}</p>
            </div>
          )}

          {/* Progress Overview */}
          {learningPlan && (
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">📊 Overall Progress</h3>
                  <span className="text-3xl font-bold text-primary-600">{getCompletionStats().percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${getCompletionStats().percentage}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">
                  {getCompletionStats().completed} / {getCompletionStats().total} tasks completed
                </div>
              </div>
            </div>
          )}

          {/* Recommendations Section */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">🎯 Learning Recommendations</h2>
              <span className="px-4 py-1 bg-primary-500 text-white rounded-full text-sm font-medium">
                {recommendations.length} pending
              </span>
            </div>

            {recommendations.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-600 mb-6">Complete an exam to get personalized recommendations</p>
                <Button variant="primary" size="md" onClick={() => navigate('/exams')}>
                  Take an Exam
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className={`bg-white rounded-xl shadow-md p-6 border-2 border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 ${getPriorityClass(rec.priority)}`}
                  >
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleRecExpanded(rec.id)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{getTypeIcon(rec.type)}</span>
                        <span className="text-lg font-semibold text-gray-900">{getTypeLabel(rec.type)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadgeClass(rec.priority)}`}>
                          {getPriorityLabel(rec.priority)}
                        </span>
                        <span className="text-gray-400 text-xl">{expandedRecs[rec.id] ? '▼' : '▶'}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-gray-700 leading-relaxed">{rec.reason}</p>

                      {expandedRecs[rec.id] && (
                        <div className="mt-4 space-y-3">
                          {rec.weakTopics && rec.weakTopics.length > 0 && (
                            <div>
                              <span className="text-sm font-semibold text-gray-600">薄弱知识点：</span>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {rec.weakTopics.map((topic, i) => (
                                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {rec.chapter && (
                            <div className="text-sm">
                              <span className="font-semibold text-gray-600">推荐章节：</span>
                              <span className="text-primary-600 font-medium ml-2">
                                {rec.chapter.title?.zh || rec.chapter.title}
                              </span>
                            </div>
                          )}

                          <div className="flex gap-3 mt-4">
                            <Button
                              variant="primary"
                              size="sm"
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                completeRecommendation(rec.id)
                              }}
                            >
                              ✓ Mark as Done
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                skipRecommendation(rec.id)
                              }}
                            >
                              Skip
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Learning Plan Generator */}
          {recommendations.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">📆 Generate Study Plan</h2>

              <div className="flex flex-col sm:flex-row gap-4 items-end mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Duration:
                  </label>
                  <select
                    value={planDuration}
                    onChange={(e) => setPlanDuration(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    <option value={3}>3 days</option>
                    <option value={7}>7 days (1 week)</option>
                    <option value={14}>14 days (2 weeks)</option>
                    <option value={30}>30 days (1 month)</option>
                  </select>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={generatePlan}
                  disabled={generating}
                  className="w-full sm:w-auto"
                >
                  {generating ? 'Generating...' : '🚀 Generate Plan'}
                </Button>
              </div>

              {learningPlan && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Your {learningPlan.duration}-Day Study Plan
                    </h3>
                    <p className="text-gray-600">Total tasks: {learningPlan.totalTasks}</p>
                  </div>

                  <div className="space-y-6">
                    {learningPlan.plan.map((day, dayIndex) => {
                      const dayTasks = day.tasks.length
                      const dayCompleted = day.tasks.filter((_, taskIndex) =>
                        completedTasks[`${dayIndex}-${taskIndex}`]
                      ).length
                      const dayProgress = dayTasks > 0 ? Math.round((dayCompleted / dayTasks) * 100) : 0

                      return (
                        <div key={day.day} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="text-2xl font-bold text-primary-600">Day {day.day}</div>
                              <div className="text-sm text-gray-600">
                                {new Date(day.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600 mb-1">
                                {dayCompleted}/{dayTasks} tasks
                              </div>
                              <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center relative"
                                style={{
                                  background: `conic-gradient(#4CAF50 ${dayProgress * 3.6}deg, transparent 0deg)`
                                }}
                              >
                                <div className="absolute inset-1 bg-gray-50 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-semibold text-gray-900">{dayProgress}%</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-4 p-3 bg-white rounded-lg">
                            <span className="text-xl">🎯</span>
                            <span className="text-gray-700 font-medium">{day.goal}</span>
                          </div>

                          <div className="space-y-3">
                            {day.tasks.map((task, taskIndex) => {
                              const taskKey = `${dayIndex}-${taskIndex}`
                              const isCompleted = completedTasks[taskKey]

                              return (
                                <div
                                  key={taskIndex}
                                  onClick={() => toggleTaskComplete(dayIndex, taskIndex)}
                                  className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                    isCompleted
                                      ? 'bg-success-50 border-success-300'
                                      : 'bg-white border-gray-200 hover:border-primary-300'
                                  }`}
                                >
                                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                                    isCompleted
                                      ? 'bg-success-500 border-success-500 text-white'
                                      : 'border-gray-300 text-gray-400'
                                  }`}>
                                    {isCompleted ? '✓' : '○'}
                                  </div>
                                  <span className="text-2xl">{getTypeIcon(task.type)}</span>
                                  <div className="flex-1">
                                    <div className={`font-medium mb-1 ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                      {task.description}
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                      <span className="text-gray-600">⏱️ {task.estimatedTime} min</span>
                                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(task.priority)}`}>
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
          )}
        </div>
      </div>
    </>
  )
}

export default LearningPlanPage
