import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AISettingsPanel from './AISettingsPanel'

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/practice', label: 'Practice' },
  { path: '/exams', label: 'Exams' },
  { path: '/learning-plan', label: 'Study Plan' },
  { path: '/wrong-questions', label: 'Wrong Answers' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [showAISettings, setShowAISettings] = useState(false)
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
            {NAV_LINKS.map(link => (
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
            {user ? (
              <>
                <button
                  onClick={() => setShowAISettings(true)}
                  title="AI Settings"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: '1px solid #dadce0',
                    background: '#fff',
                    color: '#5f6368',
                    fontSize: 13,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.target.style.background = '#f1f3f4'}
                  onMouseLeave={e => e.target.style.background = '#fff'}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  AI
                </button>

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
            {NAV_LINKS.map(link => (
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

      <AISettingsPanel isOpen={showAISettings} onClose={() => setShowAISettings(false)} />
    </>
  )
}
