import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { get, post, put } from '../utils/apiClient'
import Loading from './common/Loading'
import Toast from './common/Toast'
import { Button } from './ui'

function LearningPlanPage() {
  const navigate = useNavigate()

  const [recommendations, setRecommendations] = useState([])
  const [learningPlan, setLearningPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [slowLoading, setSlowLoading] = useState(false)
  const [planDuration, setPlanDuration] = useState(7)
  const [expandedRecs, setExpandedRecs] = useState({})
  const [completedTasks, setCompletedTasks] = useState({})
  const [toast, setToast] = useState(null)

  useEffect(() => { fetchRecommendations(); loadCompletedTasks() }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadCompletedTasks = () => {
    try {
      const saved = localStorage.getItem('completedTasks')
      if (saved) setCompletedTasks(JSON.parse(saved))
    } catch (err) { console.error('Failed to load completed tasks:', err) }
  }

  const saveCompletedTasks = (tasks) => {
    try {
      localStorage.setItem('completedTasks', JSON.stringify(tasks))
      setCompletedTasks(tasks)
    } catch (err) { console.error('Failed to save completed tasks:', err) }
  }

  const fetchRecommendations = async () => {
    try {
      setLoading(true); setError(null); setSlowLoading(false)
      const slowTimer = setTimeout(() => setSlowLoading(true), 5000)
      const data = await get('/api/recommendations?status=pending', { timeout: 60000 })
      setRecommendations(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch recommendations:', err)
      setError('Failed to load recommendations. Please try again.')
    } finally { clearTimeout(slowTimer); setLoading(false); setSlowLoading(false) }
  }

  const generatePlan = async () => {
    try {
      setGenerating(true); setError(null)
      const data = await post('/api/learning-plans/generate', { duration: planDuration })
      setLearningPlan(data)
    } catch (err) {
      console.error('Failed to generate plan:', err)
      setError('Failed to generate learning plan')
    } finally { setGenerating(false) }
  }

  const completeRecommendation = async (recId) => {
    try {
      await put(`/api/recommendations/${recId}/complete`)
      showToast('Recommendation completed!', 'success'); fetchRecommendations(); setLearningPlan(null)
    } catch (err) { showToast('Failed to complete recommendation', 'error') }
  }

  const skipRecommendation = async (recId) => {
    try {
      await put(`/api/recommendations/${recId}/skip`)
      showToast('Recommendation skipped', 'info'); fetchRecommendations(); setLearningPlan(null)
    } catch (err) { showToast('Failed to skip recommendation', 'error') }
  }

  const toggleRecExpanded = (recId) => setExpandedRecs(prev => ({ ...prev, [recId]: !prev[recId] }))

  const toggleTaskComplete = (dayIndex, taskIndex) => {
    const taskKey = `${dayIndex}-${taskIndex}`
    const newCompleted = { ...completedTasks, [taskKey]: !completedTasks[taskKey] }
    saveCompletedTasks(newCompleted)
    if (newCompleted[taskKey]) showToast('Task completed!', 'success')
  }

  const getCompletionStats = () => {
    if (!learningPlan) return { completed: 0, total: 0, percentage: 0 }
    const total = learningPlan.totalTasks || 0
    const completed = Object.values(completedTasks).filter(Boolean).length
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }

  const getTypeLabel = (type) => ({ chapter: 'Chapter Study', practice: 'Practice', review: 'Wrong Answer Review', video: 'Video Study' })[type] || type

  const PRIORITY = {
    high: { bg: '#fce8e6', color: '#a50e0e', border: '#d93025', label: 'High priority' },
    mid:  { bg: '#fef7e0', color: '#b06000', border: '#f9ab00', label: 'Medium priority' },
    low:  { bg: '#e6f4ea', color: '#0d652d', border: '#188038', label: 'Low priority' },
  }
  const getPriority = (p) => p >= 4 ? PRIORITY.high : p >= 3 ? PRIORITY.mid : PRIORITY.low

  const S = {
    page: { minHeight: '100vh', background: '#f8f9fa' },
    inner: { maxWidth: 1080, margin: '0 auto', padding: '32px 24px' },
    card: { background: '#fff', border: '1px solid #dadce0', borderRadius: 8, padding: 24 },
    label: { display: 'block', fontSize: 13, color: '#5f6368', marginBottom: 6, fontWeight: 500 },
    select: { width: '100%', padding: '8px 12px', border: '1px solid #dadce0', borderRadius: 8, fontSize: 14, color: '#202124', background: '#fff', outline: 'none' },
    badge: { display: 'inline-block', padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 500 },
  }

  return (
    <div style={S.page}>
      <div style={S.inner}>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#202124', margin: '0 0 4px' }}>My Learning Plan</h1>
          <p style={{ fontSize: 14, color: '#5f6368', margin: 0 }}>Personalized recommendations based on your exam performance</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <Loading message={slowLoading ? "Server is waking up, please wait..." : "Loading your learning plan..."} size="medium" />
            {slowLoading && (
              <Button variant="secondary" size="sm" onClick={() => { setLoading(false); setError('Loading timed out. Please retry.') }} style={{ marginTop: 16 }}>
                Cancel
              </Button>
            )}
          </div>
        ) : (<>

        {/* Error */}
        {error && (
          <div style={{ background: '#fce8e6', border: '1px solid #fad2cf', borderRadius: 8, padding: 16, marginBottom: 24, textAlign: 'center' }}>
            <span style={{ color: '#c5221f', fontSize: 14, display: 'block', marginBottom: 12 }}>{error}</span>
            <Button variant="primary" size="sm" onClick={fetchRecommendations}>Retry</Button>
          </div>
        )}

        {/* Progress Overview */}
        {learningPlan && (
          <div style={{ ...S.card, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: '#202124', margin: 0 }}>Overall Progress</h3>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#1a73e8' }}>{getCompletionStats().percentage}%</span>
            </div>
            <div style={{ width: '100%', background: '#f1f3f4', borderRadius: 4, height: 8, marginBottom: 8 }}>
              <div style={{ width: `${getCompletionStats().percentage}%`, background: '#1a73e8', borderRadius: 4, height: 8, transition: 'width 0.3s' }} />
            </div>
            <div style={{ fontSize: 13, color: '#5f6368' }}>
              {getCompletionStats().completed} / {getCompletionStats().total} tasks completed
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#202124', margin: 0 }}>Learning Recommendations</h2>
            <span style={{ ...S.badge, background: '#1a73e8', color: '#fff' }}>{recommendations.length} pending</span>
          </div>

          {recommendations.length === 0 ? (
            <div style={{ ...S.card, textAlign: 'center', padding: '60px 24px' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
              <h3 style={{ fontSize: 18, fontWeight: 500, color: '#202124', margin: '0 0 8px' }}>No recommendations yet</h3>
              <p style={{ fontSize: 14, color: '#5f6368', margin: '0 0 24px', lineHeight: 1.6 }}>
                Complete an exam first, and we'll generate a personalised study plan based on your results.
              </p>
              <button
                onClick={() => navigate('/exams')}
                style={{
                  padding: '10px 28px', background: '#1a73e8', color: '#fff', border: 'none',
                  borderRadius: 8, fontSize: 15, fontWeight: 500, cursor: 'pointer',
                }}
              >
                Take an Exam
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recommendations.map(rec => {
                const pri = getPriority(rec.priority)
                return (
                  <div key={rec.id} style={{ ...S.card, borderLeft: `3px solid ${pri.border}` }}>
                    <div
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => toggleRecExpanded(rec.id)}
                    >
                      <span style={{ fontSize: 15, fontWeight: 500, color: '#202124' }}>{getTypeLabel(rec.type)}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ ...S.badge, background: pri.bg, color: pri.color }}>{pri.label}</span>
                        <span style={{ color: '#80868b', fontSize: 14 }}>{expandedRecs[rec.id] ? '▼' : '▶'}</span>
                      </div>
                    </div>

                    <p style={{ fontSize: 14, color: '#5f6368', marginTop: 8, lineHeight: 1.6 }}>{rec.reason}</p>

                    {expandedRecs[rec.id] && (
                      <div style={{ marginTop: 12 }}>
                        {rec.weakTopics?.length > 0 && (
                          <div style={{ marginBottom: 12 }}>
                            <span style={{ fontSize: 13, fontWeight: 500, color: '#5f6368' }}>Weak topics:</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                              {rec.weakTopics.map((topic, i) => (
                                <span key={i} style={{ padding: '4px 10px', background: '#f1f3f4', borderRadius: 12, fontSize: 13, color: '#202124' }}>{topic}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {rec.chapter && (
                          <div style={{ fontSize: 13, marginBottom: 12 }}>
                            <span style={{ color: '#5f6368' }}>Recommended chapter: </span>
                            <span style={{ color: '#1a73e8', fontWeight: 500 }}>{rec.chapter.title?.zh || rec.chapter.title}</span>
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                          <Button variant="primary" size="sm" onClick={e => { e.stopPropagation(); completeRecommendation(rec.id) }}>Mark as Done</Button>
                          <Button variant="secondary" size="sm" onClick={e => { e.stopPropagation(); skipRecommendation(rec.id) }}>Skip</Button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Plan Generator */}
        {recommendations.length > 0 && (
          <div style={{ ...S.card, background: '#f8f9fa', border: '1px solid #dadce0' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#202124', margin: '0 0 16px' }}>Generate Study Plan</h2>

            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 20 }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={S.label}>Plan Duration</label>
                <select style={S.select} value={planDuration} onChange={e => setPlanDuration(Number(e.target.value))}>
                  <option value={3}>3 days</option>
                  <option value={7}>7 days (1 week)</option>
                  <option value={14}>14 days (2 weeks)</option>
                  <option value={30}>30 days (1 month)</option>
                </select>
              </div>
              <Button variant="primary" size="md" onClick={generatePlan} disabled={generating}>
                {generating ? 'Generating...' : 'Generate Plan'}
              </Button>
            </div>

            {learningPlan && (
              <div style={{ background: '#fff', border: '1px solid #dadce0', borderRadius: 8, padding: 24 }}>
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 500, color: '#202124', margin: '0 0 4px' }}>
                    Your {learningPlan.duration}-Day Study Plan
                  </h3>
                  <p style={{ fontSize: 13, color: '#5f6368', margin: 0 }}>Total tasks: {learningPlan.totalTasks}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {learningPlan.plan.map((day, dayIndex) => {
                    const dayTasks = day.tasks.length
                    const dayCompleted = day.tasks.filter((_, ti) => completedTasks[`${dayIndex}-${ti}`]).length
                    const dayPct = dayTasks > 0 ? Math.round((dayCompleted / dayTasks) * 100) : 0

                    return (
                      <div key={day.day} style={{ background: '#f8f9fa', border: '1px solid #dadce0', borderRadius: 8, padding: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <div>
                            <div style={{ fontSize: 16, fontWeight: 600, color: '#1a73e8' }}>Day {day.day}</div>
                            <div style={{ fontSize: 13, color: '#5f6368' }}>
                              {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                          <span style={{ fontSize: 13, color: '#5f6368' }}>{dayCompleted}/{dayTasks} done ({dayPct}%)</span>
                        </div>

                        <div style={{ background: '#fff', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 14, color: '#202124', fontWeight: 500 }}>
                          {day.goal}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {day.tasks.map((task, taskIndex) => {
                            const taskKey = `${dayIndex}-${taskIndex}`
                            const done = completedTasks[taskKey]
                            const pri = getPriority(task.priority)

                            return (
                              <div
                                key={taskIndex}
                                onClick={() => toggleTaskComplete(dayIndex, taskIndex)}
                                style={{
                                  display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 8,
                                  border: `1px solid ${done ? '#ceead6' : '#dadce0'}`,
                                  background: done ? '#e6f4ea' : '#fff',
                                  cursor: 'pointer', transition: 'all 0.15s',
                                }}
                              >
                                <div style={{
                                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                                  border: `2px solid ${done ? '#188038' : '#dadce0'}`,
                                  background: done ? '#188038' : 'transparent',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  color: '#fff', fontSize: 11, fontWeight: 700,
                                }}>
                                  {done ? '✓' : ''}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 14, color: done ? '#80868b' : '#202124', textDecoration: done ? 'line-through' : 'none', fontWeight: 500, marginBottom: 4 }}>
                                    {task.description}
                                  </div>
                                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <span style={{ fontSize: 12, color: '#80868b' }}>{task.estimatedTime} min</span>
                                    <span style={{ ...S.badge, background: pri.bg, color: pri.color, fontSize: 11 }}>{pri.label}</span>
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
        </>)}
      </div>
    </div>
  )
}

export default LearningPlanPage
