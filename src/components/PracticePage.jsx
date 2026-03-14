// ============================================================
// 练习主页
// 选择章节、组卷策略，开始练习
// ============================================================

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { STORAGE_KEYS } from '../utils/constants'
import '../styles/PracticePage.css'

const PracticePage = () => {
  const navigate = useNavigate()
  const [chapters, setChapters] = useState([])
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [strategies, setStrategies] = useState([])
  const [selectedStrategy, setSelectedStrategy] = useState('difficulty')
  const [questionCount, setQuestionCount] = useState(10)
  const [questionTypes, setQuestionTypes] = useState(['multiple_choice', 'calculation'])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 加载章节列表
  useEffect(() => {
    loadChapters()
    loadStrategies()
  }, [])

  const loadChapters = async () => {
    try {
      // TODO: 从 API 加载章节列表
      // 暂时使用模拟数据
      setChapters([
        { id: 'e1c1', title: { zh: '供需理论', en: 'Supply and Demand' } },
        { id: 'e1c2', title: { zh: '市场均衡', en: 'Market Equilibrium' } },
        { id: 'm1c1', title: { zh: '代数基础', en: 'Algebra Basics' } }
      ])
    } catch (err) {
      setError('加载章节失败')
    }
  }

  const loadStrategies = async () => {
    try {
      // TODO: 从 API 加载组卷策略
      setStrategies([
        { key: 'random', name: '随机选题', description: '从题库中随机选择题目', icon: '🎲' },
        { key: 'difficulty', name: '难度分布', description: '按照难度比例选题（3:5:2）', icon: '📊' },
        { key: 'knowledge', name: '知识点覆盖', description: '尽量覆盖更多知识点', icon: '🎓' },
        { key: 'ai_recommend', name: 'AI 推荐', description: '根据你的薄弱点智能推荐', icon: '🤖' },
        { key: 'exam_style', name: '真题风格', description: '优先选择历年真题', icon: '📝' }
      ])
    } catch (err) {
      setError('加载策略失败')
    }
  }

  const handleStartPractice = async () => {
    if (!selectedChapter) {
      setError('请选择章节')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 调用组卷 API
      const response = await fetch('/api/question-sets/compose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
        },
        body: JSON.stringify({
          chapterId: selectedChapter,
          strategy: selectedStrategy,
          count: questionCount,
          types: questionTypes
        })
      })

      const data = await response.json()

      if (data.success) {
        // 跳转到答题页面
        navigate(`/practice/exam/${data.data.questionSet.id}`)
      } else {
        setError(data.error?.message || '组卷失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const toggleQuestionType = (type) => {
    if (questionTypes.includes(type)) {
      if (questionTypes.length > 1) {
        setQuestionTypes(questionTypes.filter(t => t !== type))
      }
    } else {
      setQuestionTypes([...questionTypes, type])
    }
  }

  return (
    <div className="practice-page">
      <div className="practice-container">
        <h1 className="practice-title">📝 开始练习</h1>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {/* 选择章节 */}
        <section className="practice-section">
          <h2 className="section-title">1. 选择章节</h2>
          <div className="chapter-grid">
            {chapters.map(chapter => (
              <div
                key={chapter.id}
                className={`chapter-card ${selectedChapter === chapter.id ? 'selected' : ''}`}
                onClick={() => setSelectedChapter(chapter.id)}
              >
                <div className="chapter-title">{chapter.title.zh}</div>
                <div className="chapter-subtitle">{chapter.title.en}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 选择组卷策略 */}
        <section className="practice-section">
          <h2 className="section-title">2. 选择组卷策略</h2>
          <div className="strategy-grid">
            {strategies.map(strategy => (
              <div
                key={strategy.key}
                className={`strategy-card ${selectedStrategy === strategy.key ? 'selected' : ''}`}
                onClick={() => setSelectedStrategy(strategy.key)}
              >
                <div className="strategy-icon">{strategy.icon}</div>
                <div className="strategy-name">{strategy.name}</div>
                <div className="strategy-desc">{strategy.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 题目配置 */}
        <section className="practice-section">
          <h2 className="section-title">3. 题目配置</h2>

          <div className="config-group">
            <label className="config-label">题目数量</label>
            <div className="count-selector">
              {[5, 10, 15, 20].map(count => (
                <button
                  key={count}
                  className={`count-btn ${questionCount === count ? 'active' : ''}`}
                  onClick={() => setQuestionCount(count)}
                >
                  {count} 题
                </button>
              ))}
            </div>
          </div>

          <div className="config-group">
            <label className="config-label">题目类型</label>
            <div className="type-selector">
              {[
                { key: 'multiple_choice', label: '选择题' },
                { key: 'fill_blank', label: '填空题' },
                { key: 'calculation', label: '计算题' },
                { key: 'short_answer', label: '简答题' }
              ].map(type => (
                <button
                  key={type.key}
                  className={`type-btn ${questionTypes.includes(type.key) ? 'active' : ''}`}
                  onClick={() => toggleQuestionType(type.key)}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 开始按钮 */}
        <div className="practice-actions">
          <button
            className="start-btn"
            onClick={handleStartPractice}
            disabled={loading || !selectedChapter}
          >
            {loading ? '正在组卷...' : '🚀 开始练习'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PracticePage
