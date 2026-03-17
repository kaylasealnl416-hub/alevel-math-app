// ============================================================
// PracticePage
// Select a chapter, question strategy, and start practicing
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

  useEffect(() => {
    loadChapters()
    loadStrategies()
  }, [])

  const loadChapters = async () => {
    try {
      // TODO: load chapters from API
      setChapters([
        { id: 'e1c1', title: { en: 'Supply and Demand' } },
        { id: 'e1c2', title: { en: 'Market Equilibrium' } },
        { id: 'm1c1', title: { en: 'Algebra Basics' } }
      ])
    } catch (err) {
      setError('Failed to load chapters')
    }
  }

  const loadStrategies = async () => {
    try {
      // TODO: load strategies from API
      setStrategies([
        { key: 'random',       name: 'Random',          description: 'Randomly select questions from the bank',          icon: '🎲' },
        { key: 'difficulty',   name: 'By Difficulty',   description: 'Select by difficulty ratio (3:5:2)',               icon: '📊' },
        { key: 'knowledge',    name: 'Topic Coverage',  description: 'Maximise coverage of knowledge points',            icon: '🎓' },
        { key: 'ai_recommend', name: 'AI Recommended',  description: 'Smart selection based on your weak areas',         icon: '🤖' },
        { key: 'exam_style',   name: 'Past Paper Style','description': 'Prioritise questions from past exam papers',     icon: '📝' }
      ])
    } catch (err) {
      setError('Failed to load strategies')
    }
  }

  const handleStartPractice = async () => {
    if (!selectedChapter) {
      setError('Please select a chapter')
      return
    }

    setLoading(true)
    setError(null)

    try {
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
        navigate(`/practice/exam/${data.data.questionSet.id}`)
      } else {
        setError(data.error?.message || 'Failed to generate question set')
      }
    } catch (err) {
      setError('Network error. Please try again.')
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
        <h1 className="practice-title">📝 Start Practice</h1>

        {error && (
          <div className="error-message">⚠️ {error}</div>
        )}

        {/* Step 1: Select chapter */}
        <section className="practice-section">
          <h2 className="section-title">1. Select Chapter</h2>
          <div className="chapter-grid">
            {chapters.map(chapter => (
              <div
                key={chapter.id}
                className={`chapter-card ${selectedChapter === chapter.id ? 'selected' : ''}`}
                onClick={() => setSelectedChapter(chapter.id)}
              >
                <div className="chapter-title">{chapter.title.en}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Step 2: Select strategy */}
        <section className="practice-section">
          <h2 className="section-title">2. Select Strategy</h2>
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

        {/* Step 3: Configuration */}
        <section className="practice-section">
          <h2 className="section-title">3. Configuration</h2>

          <div className="config-group">
            <label className="config-label">Number of questions</label>
            <div className="count-selector">
              {[5, 10, 15, 20].map(count => (
                <button
                  key={count}
                  className={`count-btn ${questionCount === count ? 'active' : ''}`}
                  onClick={() => setQuestionCount(count)}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div className="config-group">
            <label className="config-label">Question types</label>
            <div className="type-selector">
              {[
                { key: 'multiple_choice', label: 'Multiple Choice' },
                { key: 'fill_blank',      label: 'Fill in the Blank' },
                { key: 'calculation',     label: 'Calculation' },
                { key: 'short_answer',    label: 'Short Answer' }
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

        <div className="practice-actions">
          <button
            className="start-btn"
            onClick={handleStartPractice}
            disabled={loading || !selectedChapter}
          >
            {loading ? 'Generating...' : '🚀 Start Practice'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PracticePage
