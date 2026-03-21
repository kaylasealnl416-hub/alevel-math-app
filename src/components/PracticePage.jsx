// ============================================================
// PracticePage.jsx - 独立练习页面（导航栏入口）
// 流程：选择科目 → 选择单元 → 选择章节 → 进入练习
// ============================================================

import { useState } from 'react'
import PracticeView from './practice/PracticeView'
import { CURRICULUM } from '../data/curriculum.js'
import { SUBJECTS } from '../data/subjects'

// 整合所有科目数据为统一格式
function getAllSubjects() {
  const subjects = []

  // 数学 — 从 CURRICULUM 提取
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

  // 其他科目 — 从 SUBJECTS 提取
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

export default function PracticePage() {
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedChapter, setSelectedChapter] = useState(null)

  const getChapterTitle = (ch) => {
    if (ch._displayTitle) return ch._displayTitle
    return typeof ch.title === 'object' ? (ch.title.en || ch.title.zh) : ch.title
  }

  // 进入练习后显示 PracticeView
  if (selectedChapter) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* 面包屑导航 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
            padding: '16px 24px', fontSize: 13, color: '#64748B',
          }}>
            <BreadcrumbBtn onClick={() => { setSelectedChapter(null); setSelectedBook(null); setSelectedSubject(null) }}>
              Practice
            </BreadcrumbBtn>
            <span>/</span>
            <BreadcrumbBtn onClick={() => { setSelectedChapter(null); setSelectedBook(null) }}>
              {selectedSubject.name}
            </BreadcrumbBtn>
            <span>/</span>
            <BreadcrumbBtn onClick={() => setSelectedChapter(null)}>
              {selectedBook.title}
            </BreadcrumbBtn>
            <span>/</span>
            <span style={{ color: '#1E293B', fontWeight: 600 }}>
              {getChapterTitle(selectedChapter)}
            </span>
          </div>

          <PracticeView
            chapter={selectedChapter}
            book={selectedBook.id}
            subject={selectedSubject.id}
            onBack={() => setSelectedChapter(null)}
          />
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>

        {/* 页面标题 */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56,
            background: 'linear-gradient(135deg, #1a73e8, #1967d2)',
            borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(59,130,246,0.3)', fontSize: 28,
          }}>
            ✏️
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1E293B', margin: '0 0 8px' }}>
            Topic Practice
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
            Choose a topic and test your knowledge with 5 questions per round
          </p>
        </div>

        {/* === 科目选择 === */}
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
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1E293B' }}>{subj.name}</div>
                    <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
                      {subj.books.length} unit{subj.books.length > 1 ? 's' : ''}
                    </div>
                  </div>
                </CardButton>
              ))}
            </div>
          </div>
        )}

        {/* === 单元选择 === */}
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
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{book.id}</div>
                      <div style={{ fontSize: 13, color: '#64748B', marginTop: 3 }}>{book.title}</div>
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

        {/* === 章节选择 === */}
        {selectedSubject && selectedBook && !selectedChapter && (
          <div>
            <BackButton onClick={() => setSelectedBook(null)}>Back to {selectedSubject.name}</BackButton>
            <SectionTitle>{selectedBook.id} — {selectedBook.title}</SectionTitle>
            <p style={{ fontSize: 13, color: '#94A3B8', margin: '-8px 0 20px' }}>
              Select a chapter to start practicing
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selectedBook.chapters.map((ch) => {
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
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{title}</div>
                      {ch.keyPoints && (
                        <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 3 }}>
                          {ch.keyPoints.length} key point{ch.keyPoints.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: 13, color: '#94A3B8' }}>→</span>
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
function BreadcrumbBtn({ onClick, children }) {
  return (
    <button onClick={onClick}
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a73e8', fontWeight: 600, fontSize: 13, padding: 0 }}>
      {children}
    </button>
  )
}

function BackButton({ onClick, children }) {
  return (
    <button onClick={onClick}
      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#64748B', padding: '0 0 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
      ← {children}
    </button>
  )
}

function SectionTitle({ children }) {
  return <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>{children}</h2>
}

function CardButton({ onClick, hoverColor, style, children }) {
  return (
    <button onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '20px 22px', background: '#fff',
        border: '1px solid #E2E8F0', borderRadius: 14,
        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        ...style,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = hoverColor; e.currentTarget.style.boxShadow = `0 2px 12px ${hoverColor}20` }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      {children}
    </button>
  )
}
