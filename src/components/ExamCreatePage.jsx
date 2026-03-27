// ============================================================
// ExamCreatePage.jsx - 快速创建考试
// 流程：选择科目 → 选择单元 → 选择章节 → 配置参数 → 开始考试
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { post } from '../utils/apiClient'
import Toast from './common/Toast'
import { CURRICULUM } from '../data/curriculum.js'
import { SUBJECTS } from '../data/subjects'

// 整合所有科目数据（与 PracticePage 一致）
function getAllSubjects() {
  const subjects = []

  const mathBooks = Object.entries(CURRICULUM).map(([bookId, book]) => ({
    id: bookId,
    title: book.title,
    color: book.color,
    chapters: book.chapters || [],
  }))
  subjects.push({
    id: 'mathematics',
    name: 'Mathematics',
    icon: '📐',
    color: '#1a73e8',
    books: mathBooks,
  })

  for (const [key, subj] of Object.entries(SUBJECTS)) {
    const books = Object.entries(subj.books || {}).map(([bookId, book]) => ({
      id: bookId,
      title: typeof book.title === 'object' ? (book.title.en || book.title.zh) : book.title,
      color: book.color || subj.color,
      chapters: (book.chapters || []).map(ch => ({
        ...ch,
        _displayTitle: typeof ch.title === 'object' ? (ch.title.en || ch.title.zh) : ch.title,
      })),
    }))
    subjects.push({
      id: key,
      name: typeof subj.name === 'object' ? (subj.name.en || subj.name.zh) : subj.name,
      icon: subj.icon || '📚',
      color: subj.color || '#1a73e8',
      books,
    })
  }

  return subjects
}

const ALL_SUBJECTS = getAllSubjects()

const DIFFICULTY_OPTIONS = [
  { key: 'easy', label: 'Easy', desc: 'Basic concepts', color: '#188038', bg: '#e6f4ea' },
  { key: 'medium', label: 'Medium', desc: 'Standard exam-level', color: '#e37400', bg: '#fef7e0' },
  { key: 'hard', label: 'Hard', desc: 'Challenging problems', color: '#d93025', bg: '#fce8e6' },
]

const COUNT_OPTIONS = [5, 10, 15, 20]

const TIME_OPTIONS = [
  { value: 0, label: 'No Limit' },
  { value: 900, label: '15 min' },
  { value: 1800, label: '30 min' },
  { value: 2700, label: '45 min' },
  { value: 3600, label: '60 min' },
]

export default function ExamCreatePage() {
  const navigate = useNavigate()
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedChapter, setSelectedChapter] = useState(null)

  // 考试配置
  const [questionCount, setQuestionCount] = useState(10)
  const [difficulty, setDifficulty] = useState('medium')
  const [timeLimit, setTimeLimit] = useState(1800)
  const [loading, setLoading] = useState(false)

  const getChapterTitle = (ch) => {
    if (ch._displayTitle) return ch._displayTitle
    return typeof ch.title === 'object' ? (ch.title.en || ch.title.zh) : ch.title
  }

  const handleStartExam = async () => {
    setLoading(true)
    try {
      const body = {
        chapterId: selectedChapter.id,
        questionCount,
        difficulty,
        timeLimit: timeLimit || undefined,
        chapterTitle: getChapterTitle(selectedChapter),
        chapterKeyPoints: selectedChapter.keyPoints || [],
        chapterFormulas: selectedChapter.formulas || [],
        chapterHardPoints: selectedChapter.hardPoints || '',
        chapterExamTips: selectedChapter.examTips || '',
      }

      const exam = await post('/api/exams/quick-start', body, { timeout: 120000, retry: 0 })
      Toast.success('Exam created!')

      navigate(`/exams/${exam.id}/take`)
    } catch (err) {
      // Toast.error already shown by apiClient
    } finally {
      setLoading(false)
    }
  }

  // === 配置页面（选完章节后） ===
  if (selectedChapter) {
    const chTitle = getChapterTitle(selectedChapter)
    const diffInfo = DIFFICULTY_OPTIONS.find(d => d.key === difficulty)
    const timeInfo = TIME_OPTIONS.find(t => t.value === timeLimit)

    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 24px' }}>
          {/* 返回按钮 */}
          <BackButton onClick={() => setSelectedChapter(null)}>Back to Chapters</BackButton>

          {/* 标题 */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 56, height: 56,
              background: 'linear-gradient(135deg, #1a73e8, #1967d2)',
              borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(26,115,232,0.3)', fontSize: 28,
            }}>
              📝
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#202124', margin: '0 0 8px' }}>Quick Exam</h1>
            <div style={{
              display: 'inline-block', padding: '6px 16px',
              background: '#e8f0fe', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#1967d2',
            }}>
              {chTitle}
            </div>
          </div>

          {/* 题目数量 */}
          <ConfigSection title="Number of Questions">
            <div style={{ display: 'flex', gap: 10 }}>
              {COUNT_OPTIONS.map(n => (
                <button key={n} onClick={() => setQuestionCount(n)} style={{
                  flex: 1, padding: '12px 0', borderRadius: 10,
                  border: questionCount === n ? '2px solid #1a73e8' : '1px solid #dadce0',
                  background: questionCount === n ? '#e8f0fe' : '#fff',
                  color: questionCount === n ? '#1a73e8' : '#5f6368',
                  fontSize: 16, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  {n}
                </button>
              ))}
            </div>
          </ConfigSection>

          {/* 难度 */}
          <ConfigSection title="Difficulty">
            <div style={{ display: 'flex', gap: 10 }}>
              {DIFFICULTY_OPTIONS.map(d => (
                <button key={d.key} onClick={() => setDifficulty(d.key)} style={{
                  flex: 1, padding: '10px 0', borderRadius: 10,
                  border: difficulty === d.key ? '2px solid #1a73e8' : '1px solid #dadce0',
                  background: difficulty === d.key ? '#1a73e8' : '#fff',
                  color: difficulty === d.key ? '#fff' : '#5f6368',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  {d.label}
                </button>
              ))}
            </div>
            <div style={{
              marginTop: 8, padding: '5px 12px', borderRadius: 6, fontSize: 12, display: 'inline-block',
              color: diffInfo.color, background: diffInfo.bg,
            }}>
              {diffInfo.desc}
            </div>
          </ConfigSection>

          {/* 时间限制 */}
          <ConfigSection title="Time Limit">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TIME_OPTIONS.map(t => (
                <button key={t.value} onClick={() => setTimeLimit(t.value)} style={{
                  padding: '8px 18px', borderRadius: 8,
                  border: timeLimit === t.value ? '2px solid #1a73e8' : '1px solid #dadce0',
                  background: timeLimit === t.value ? '#e8f0fe' : '#fff',
                  color: timeLimit === t.value ? '#1a73e8' : '#5f6368',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  {t.label}
                </button>
              ))}
            </div>
          </ConfigSection>

          {/* 考试预览摘要 */}
          <div style={{
            background: '#fff', border: '1px solid #dadce0', borderRadius: 12,
            padding: '16px 20px', marginBottom: 24,
            display: 'flex', justifyContent: 'space-around', textAlign: 'center',
          }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#202124' }}>{questionCount}</div>
              <div style={{ fontSize: 11, color: '#5f6368' }}>Questions</div>
            </div>
            <div style={{ width: 1, background: '#dadce0' }} />
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: diffInfo.color }}>{diffInfo.label}</div>
              <div style={{ fontSize: 11, color: '#5f6368' }}>Difficulty</div>
            </div>
            <div style={{ width: 1, background: '#dadce0' }} />
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#202124' }}>{timeInfo.label}</div>
              <div style={{ fontSize: 11, color: '#5f6368' }}>Time</div>
            </div>
          </div>

          {/* 开始按钮 */}
          <button onClick={handleStartExam} disabled={loading} style={{
            width: '100%', padding: 16,
            background: loading ? '#dadce0' : 'linear-gradient(135deg, #1a73e8, #1967d2)',
            color: loading ? '#5f6368' : '#fff',
            border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700,
            cursor: loading ? 'default' : 'pointer', transition: 'all 0.2s',
            boxShadow: loading ? 'none' : '0 4px 12px rgba(26,115,232,0.3)',
          }}>
            {loading ? 'Generating questions...' : 'Start Exam'}
          </button>

          {loading && (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <div style={{
                width: 32, height: 32, border: '3px solid #e8f0fe', borderTop: '3px solid #1a73e8',
                borderRadius: '50%', margin: '0 auto 10px',
                animation: 'spin 1s linear infinite',
              }} />
              <p style={{ fontSize: 13, color: '#5f6368', margin: 0 }}>
                AI is preparing your exam, this may take 10-30 seconds...
              </p>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          )}
        </div>
      </div>
    )
  }

  // === 三级选择页面 ===
  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
        {/* 页面标题 */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56,
            background: 'linear-gradient(135deg, #1a73e8, #1967d2)',
            borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(26,115,232,0.3)', fontSize: 28,
          }}>
            📝
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#202124', margin: '0 0 8px' }}>
            Quick Exam
          </h1>
          <p style={{ fontSize: 14, color: '#5f6368', margin: 0 }}>
            Choose a topic, configure your exam, and start testing
          </p>
        </div>

        {/* 科目选择 */}
        {!selectedSubject && (
          <div>
            <SectionTitle>Select Subject</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
              {ALL_SUBJECTS.map(subj => (
                <CardButton key={subj.id} onClick={() => setSelectedSubject(subj)} hoverColor={subj.color}>
                  <div style={{
                    width: 44, height: 44, background: subj.color + '15',
                    borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, flexShrink: 0,
                  }}>
                    {subj.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#202124' }}>{subj.name}</div>
                    <div style={{ fontSize: 12, color: '#5f6368', marginTop: 2 }}>
                      {subj.books.length} unit{subj.books.length > 1 ? 's' : ''}
                    </div>
                  </div>
                </CardButton>
              ))}
            </div>
          </div>
        )}

        {/* 单元选择 */}
        {selectedSubject && !selectedBook && (
          <div>
            <BackButton onClick={() => setSelectedSubject(null)}>Back to Subjects</BackButton>
            <SectionTitle>{selectedSubject.icon} {selectedSubject.name} — Select Unit</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {selectedSubject.books.map(book => {
                const color = book.color || selectedSubject.color
                return (
                  <CardButton key={book.id} onClick={() => setSelectedBook(book)} hoverColor={color}
                    style={{ justifyContent: 'space-between', padding: '18px 22px' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#202124' }}>{book.id}</div>
                      <div style={{ fontSize: 13, color: '#5f6368', marginTop: 3 }}>{book.title}</div>
                    </div>
                    <div style={{
                      padding: '4px 12px', background: color + '12', color,
                      borderRadius: 8, fontSize: 12, fontWeight: 600,
                    }}>
                      {book.chapters.length} chapters
                    </div>
                  </CardButton>
                )
              })}
            </div>
          </div>
        )}

        {/* 章节选择 */}
        {selectedSubject && selectedBook && (
          <div>
            <BackButton onClick={() => setSelectedBook(null)}>Back to {selectedSubject.name}</BackButton>
            <SectionTitle>{selectedBook.id} — {selectedBook.title}</SectionTitle>
            <p style={{ fontSize: 13, color: '#5f6368', margin: '-8px 0 20px' }}>
              Select a chapter to create your exam
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selectedBook.chapters.map(ch => {
                const title = getChapterTitle(ch)
                const color = selectedBook.color || selectedSubject.color
                return (
                  <CardButton key={ch.id} onClick={() => setSelectedChapter(ch)} hoverColor={color}
                    style={{ padding: '16px 20px' }}>
                    <div style={{
                      width: 32, height: 32, background: color + '15', color,
                      borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, flexShrink: 0,
                    }}>
                      {ch.num}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#202124' }}>{title}</div>
                      {ch.keyPoints && (
                        <div style={{ fontSize: 12, color: '#5f6368', marginTop: 3 }}>
                          {ch.keyPoints.length} key point{ch.keyPoints.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: 13, color: '#5f6368' }}>→</span>
                  </CardButton>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 小组件
function BackButton({ onClick, children }) {
  return (
    <button onClick={onClick}
      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#5f6368', padding: '0 0 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
      ← {children}
    </button>
  )
}

function SectionTitle({ children }) {
  return <h2 style={{ fontSize: 16, fontWeight: 700, color: '#202124', marginBottom: 16 }}>{children}</h2>
}

function CardButton({ onClick, hoverColor, style, children }) {
  return (
    <button onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '20px 22px', background: '#fff',
        border: '1px solid #dadce0', borderRadius: 14,
        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        ...style,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = hoverColor; e.currentTarget.style.boxShadow = `0 2px 12px ${hoverColor}20` }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#dadce0'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      {children}
    </button>
  )
}

function ConfigSection({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#202124', marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  )
}
