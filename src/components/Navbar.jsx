import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { CURRICULUM } from '../data/curriculum.js'
import { SUBJECTS } from '../data/subjects.js'

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/practice', label: 'Practice' },
  { path: '/exams', label: 'Exams' },
  { path: '/learning-plan', label: 'Study Plan' },
  { path: '/wrong-questions', label: 'Wrong Answers' },
]

// 构建全局搜索索引（章节 + 科目）
function buildSearchIndex() {
  const items = []
  // 数学章节
  for (const [bookId, book] of Object.entries(CURRICULUM)) {
    for (const ch of book.chapters || []) {
      const title = typeof ch.title === 'object' ? (ch.title.en || ch.title.zh) : ch.title
      items.push({ type: 'chapter', subject: 'mathematics', book: bookId, id: ch.id, title, bookTitle: book.title })
    }
  }
  // 其他科目章节
  for (const [subjId, subj] of Object.entries(SUBJECTS)) {
    const subjName = typeof subj.name === 'object' ? (subj.name.en || subj.name.zh) : subj.name
    for (const [bookId, book] of Object.entries(subj.books || {})) {
      for (const ch of book.chapters || []) {
        const title = typeof ch.title === 'object' ? (ch.title.en || ch.title.zh) : ch.title
        items.push({ type: 'chapter', subject: subjId, book: bookId, id: ch.id, title, bookTitle: typeof book.title === 'object' ? (book.title.en || book.title.zh) : book.title, subjName })
      }
    }
  }
  return items
}

const SEARCH_INDEX = buildSearchIndex()

function GlobalSearch({ onNavigate }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [results, setResults] = useState([])
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const q = query.toLowerCase()
    const matched = SEARCH_INDEX.filter(item =>
      item.title.toLowerCase().includes(q) ||
      (item.subjName || 'mathematics').toLowerCase().includes(q)
    ).slice(0, 8)
    setResults(matched)
  }, [query])

  const handleSelect = (item) => {
    setQuery('')
    setOpen(false)
    // 导航到对应章节
    if (onNavigate) {
      onNavigate(item)
    } else {
      navigate('/practice')
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', background: '#f1f3f4', borderRadius: 20, padding: '5px 12px', gap: 6 }}>
        <span style={{ fontSize: 14, color: '#80868b' }}>🔍</span>
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search chapters..."
          style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: '#202124', width: 160 }}
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]) }} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, color: '#80868b', padding: 0 }}>×</button>
        )}
      </div>
      {open && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
          background: '#fff', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          border: '1px solid #e8eaed', zIndex: 200, overflow: 'hidden',
        }}>
          {results.map((item, i) => (
            <div key={i} onMouseDown={() => handleSelect(item)} style={{
              padding: '10px 14px', cursor: 'pointer', borderBottom: i < results.length - 1 ? '1px solid #f1f3f4' : 'none',
              display: 'flex', flexDirection: 'column', gap: 2,
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: '#202124' }}>{item.title}</div>
              <div style={{ fontSize: 11, color: '#80868b' }}>
                {item.subjName || 'Mathematics'} › {item.bookTitle}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Navbar({ onSearchNavigate }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      <nav style={{
        background: '#fff',
        borderBottom: '1px solid #dadce0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: 1080,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          height: 56,
          gap: 8,
        }}>
          {/* Logo */}
          <Link to="/" style={{
            fontSize: 18,
            fontWeight: 600,
            color: '#1a73e8',
            textDecoration: 'none',
            marginRight: 24,
            letterSpacing: -0.3,
          }}>
            A-Level Hub
          </Link>

          {/* Desktop nav */}
          <div style={{
            display: 'flex',
            gap: 4,
            flex: 1,
          }} className="hidden-mobile">
            {NAV_LINKS.concat(
              user?.role === 'admin' ? [{ path: '/questions/upload', label: 'Question Bank' }] : []
            ).map(link => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: isActive(link.path) ? 500 : 400,
                  color: isActive(link.path) ? '#1a73e8' : '#5f6368',
                  background: isActive(link.path) ? '#e8f0fe' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (!isActive(link.path)) e.target.style.background = '#f1f3f4'
                }}
                onMouseLeave={e => {
                  if (!isActive(link.path)) e.target.style.background = 'transparent'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            {/* Global Search */}
            <div className="hidden-mobile">
              <GlobalSearch onNavigate={onSearchNavigate} />
            </div>
            {user ? (
              <>
                <Link to="/profile" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '4px 8px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: '#202124',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f1f3f4'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#1a73e8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 500,
                  }}>
                    {user.nickname?.[0]?.toUpperCase() || 'U'}
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'transparent',
                    color: '#5f6368',
                    fontSize: 13,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.target.style.background = '#f1f3f4'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{
                  padding: '6px 16px',
                  borderRadius: 8,
                  fontSize: 14,
                  color: '#1a73e8',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => e.target.style.background = '#e8f0fe'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}
                >
                  Sign in
                </Link>
                <Link to="/register" style={{
                  padding: '6px 16px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  background: '#1a73e8',
                  color: '#fff',
                  textDecoration: 'none',
                  transition: 'opacity 0.15s',
                }}
                  onMouseEnter={e => e.target.style.opacity = '0.9'}
                  onMouseLeave={e => e.target.style.opacity = '1'}
                >
                  Get started
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              className="show-mobile-only"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                padding: 8,
                cursor: 'pointer',
                color: '#5f6368',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen
                  ? <path d="M18 6L6 18M6 6l12 12" />
                  : <><path d="M3 12h18" /><path d="M3 6h18" /><path d="M3 18h18" /></>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div style={{
            borderTop: '1px solid #dadce0',
            padding: '8px 16px',
            background: '#fff',
          }} className="show-mobile-only">
            {NAV_LINKS.concat(
              user?.role === 'admin' ? [{ path: '/questions/upload', label: 'Question Bank' }] : []
            ).map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'block',
                  padding: '10px 12px',
                  borderRadius: 8,
                  fontSize: 14,
                  color: isActive(link.path) ? '#1a73e8' : '#202124',
                  background: isActive(link.path) ? '#e8f0fe' : 'transparent',
                  textDecoration: 'none',
                  fontWeight: isActive(link.path) ? 500 : 400,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Mobile responsive styles */}
      <style>{`
        @media (min-width: 768px) {
          .show-mobile-only { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile-only { display: block !important; }
        }
      `}</style>

    </>
  )
}
