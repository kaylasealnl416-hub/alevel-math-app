import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { useAuth } from '../contexts/AuthContext'
import Toast from './common/Toast'
import { API_BASE, COLORS } from '../utils/constants'
import { validateEmail, validatePassword } from '../utils/validation'

const BRAND = COLORS.brand
const DARK = COLORS.text

// ─── Inline SVG icons ─────────────────────────────────────────────
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M20 21a8 8 0 1 0-16 0"/>
  </svg>
)
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
)
const BrainIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
    <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
    <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
    <path d="M6 18a4 4 0 0 1-1.967-.516"/>
    <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
  </svg>
)
const SparklesIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3 4 6l-3 1 3 1 1 3 1-3 3-1-3-1-1-3z"/>
    <path d="M19 13l-1 3-3 1 3 1 1 3 1-3 3-1-3-1-1-3z"/>
  </svg>
)

// ─── Password strength ────────────────────────────────────────────
const checkPasswordStrength = (password) => {
  if (!password) return { score: 0, text: '', color: '' }
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++
  const levels = [
    { score: 0, text: '', color: '' },
    { score: 1, text: 'Weak', color: '#EF4444' },
    { score: 2, text: 'Fair', color: '#F59E0B' },
    { score: 3, text: 'Good', color: '#EAB308' },
    { score: 4, text: 'Strong', color: '#22C55E' },
    { score: 5, text: 'Very Strong', color: '#16A34A' },
  ]
  return levels[Math.min(score, 5)]
}

export default function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [isLogin, setIsLogin] = useState(location.pathname !== '/register')

  // Shared form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  // ─── Google sign-in ────────────────────────────────────────────
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true)
      try {
        const res = await fetch(`${API_BASE}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ accessToken: tokenResponse.access_token }),
        })
        const data = await res.json()
        if (!data.success) {
          Toast.error(data.error?.message || 'Google sign-in failed')
          return
        }
        Toast.success('Signed in with Google!')
        login(data.data.user)
        setTimeout(() => navigate('/'), 800)
      } catch {
        Toast.error('Network error. Please try again.')
      } finally {
        setGoogleLoading(false)
      }
    },
    onError: () => {
      Toast.error('Google authorisation cancelled or failed')
      setGoogleLoading(false)
    },
  })

  // Sync URL and clear errors when switching tabs
  const switchTab = (toLogin) => {
    setIsLogin(toLogin)
    setErrors({})
    navigate(toLogin ? '/login' : '/register', { replace: true })
  }

  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  // ─── Login submit ──────────────────────────────────────────────────
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    const emailError = validateEmail(email)
    if (emailError) newErrors.email = emailError
    const passwordError = validatePassword(password)
    if (passwordError) newErrors.password = passwordError
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!data.success) {
        Toast.error(data.error?.message || 'Login failed')
        setLoading(false)
        return
      }
      if (rememberMe) {
        localStorage.setItem('remembered_email', email)
      } else {
        localStorage.removeItem('remembered_email')
      }
      Toast.success('Login successful!')
      login(data.data.user)
      setTimeout(() => navigate('/'), 800)
    } catch {
      Toast.error('Network error, please try again later')
      setLoading(false)
    }
  }

  // ─── Register submit ───────────────────────────────────────────────
  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    const emailError = validateEmail(email)
    if (emailError) newErrors.email = emailError
    const passwordError = validatePassword(password)
    if (passwordError) newErrors.password = passwordError
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          nickname: email.split('@')[0],
        }),
      })
      const data = await res.json()
      if (!data.success) {
        if (data.error?.details) Toast.error(data.error.details.map(d => d.message).join('\n'))
        else Toast.error(data.error?.message || 'Registration failed')
        setLoading(false)
        return
      }
      Toast.success('Registration successful! Welcome aboard.')
      login(data.data.user)
      setTimeout(() => navigate('/'), 1000)
    } catch {
      Toast.error('Network error, please try again later')
      setLoading(false)
    }
  }

  // ─── Style helpers ─────────────────────────────────────────────────
  const inputStyle = (field) => ({
    width: '100%',
    padding: '10px 14px 10px 38px',
    border: `1px solid ${errors[field] ? '#EF4444' : focusedField === field ? BRAND : '#E2E8F0'}`,
    borderRadius: 12,
    fontSize: 14,
    color: DARK,
    background: '#FFFFFF',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxSizing: 'border-box',
    boxShadow: focusedField === field ? `0 0 0 3px ${BRAND}18` : '0 1px 2px rgba(0,0,0,0.05)',
  })

  const selectStyle = {
    width: '100%',
    padding: '10px 14px',
    border: `1px solid #E2E8F0`,
    borderRadius: 12,
    fontSize: 14,
    color: DARK,
    background: '#FFFFFF',
    outline: 'none',
    boxSizing: 'border-box',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    cursor: 'pointer',
  }

  // ─── Icon input wrapper ───────────────────────────────────────────
  const IconInput = ({ icon: Icon, field, type = 'text', placeholder, value, onChange, onFocus, onBlur }) => (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
        <Icon />
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        style={inputStyle(field)}
      />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: DARK }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-right { display: none; }
        @media (min-width: 1024px) { .auth-right { display: flex; } }
        .auth-left { width: 100%; }
        @media (min-width: 1024px) { .auth-left { width: 50%; } }
      `}</style>

      {/* ═══════════════ Left panel: form ═══════════════ */}
      <div
        className="auth-left"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '32px 40px',
          background: '#FAFAFA',
          backgroundImage: 'linear-gradient(to right, rgba(128,128,128,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(128,128,128,0.07) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          position: 'relative',
          overflowY: 'auto',
        }}
      >
        {/* Mobile logo */}
        <div style={{ position: 'absolute', top: 24, left: 32, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: BRAND, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>∑</div>
          <span style={{ fontWeight: 600, fontSize: 16, color: '#1E293B', letterSpacing: '-0.3px' }}>A-Level Hub</span>
        </div>

        <div style={{ width: '100%', maxWidth: 400, margin: '0 auto', paddingTop: 40 }}>

          {/* Tab switcher */}
          <div style={{ display: 'flex', padding: 4, background: 'rgba(226,232,240,0.5)', borderRadius: 14, border: '1px solid #E2E8F0', marginBottom: 36 }}>
            {[{ key: true, label: 'Sign In' }, { key: false, label: 'Create Account' }].map(({ key, label }) => (
              <button
                key={label}
                onClick={() => switchTab(key)}
                style={{
                  flex: 1,
                  padding: '9px 0',
                  fontSize: 13,
                  fontWeight: 600,
                  borderRadius: 10,
                  border: isLogin === key ? '1px solid #E2E8F0' : '1px solid transparent',
                  background: isLogin === key ? '#FFFFFF' : 'transparent',
                  color: isLogin === key ? '#1E293B' : '#64748B',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isLogin === key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Georgia, "Times New Roman", serif', color: '#1E293B', marginBottom: 8, lineHeight: 1.2 }}>
              {isLogin ? 'Welcome back' : 'Start your journey'}
            </h1>
            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5, minHeight: 40 }}>
              {isLogin
                ? 'Enter your details to access your learning dashboard.'
                : 'Create an account to unlock AI-powered A-Level tutoring.'}
            </p>
          </div>

          {/* ─── Form (opacity toggle keeps height stable) ─── */}
          <form onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit}>

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email Address</label>
              <IconInput
                icon={MailIcon} field="email" type="email" placeholder="name@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: '' }) }}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
              <div style={{ minHeight: 20, paddingTop: 4 }}>
                {errors.email && <span style={{ fontSize: 12, color: '#EF4444' }}>{errors.email}</span>}
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Password</label>
              <IconInput
                icon={LockIcon} field="password" type="password" placeholder="••••••••"
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  setPasswordStrength(checkPasswordStrength(e.target.value))
                  if (errors.password) setErrors({ ...errors, password: '' })
                }}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
              <div style={{ minHeight: 20, paddingTop: 4 }}>
                {errors.password && <span style={{ fontSize: 12, color: '#EF4444' }}>{errors.password}</span>}
              </div>
              {/* Password strength bar — fixed-height container */}
              <div style={{ height: 20 }}>
                {password && !isLogin && (
                  <div>
                    <div style={{ height: 4, background: '#E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 2, transition: 'width 0.25s, background-color 0.25s', width: `${(passwordStrength.score / 5) * 100}%`, background: passwordStrength.color }} />
                    </div>
                    {passwordStrength.text && <div style={{ fontSize: 11, marginTop: 2, fontWeight: 600, color: passwordStrength.color }}>{passwordStrength.text}</div>}
                  </div>
                )}
              </div>
            </div>

            {/* Confirm Password: visible on register, transparent placeholder on login */}
            <div style={{ marginBottom: 14, opacity: isLogin ? 0 : 1, pointerEvents: isLogin ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Confirm Password</label>
              <IconInput
                icon={LockIcon} field="confirmPassword" type="password" placeholder="Enter password again"
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' }) }}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
              />
              <div style={{ minHeight: 20, paddingTop: 4 }}>
                {errors.confirmPassword && <span style={{ fontSize: 12, color: '#EF4444' }}>{errors.confirmPassword}</span>}
              </div>
            </div>

            {/* Remember me: visible on login, transparent placeholder on register */}
            <div style={{ opacity: isLogin ? 1 : 0, pointerEvents: isLogin ? 'auto' : 'none', transition: 'opacity 0.2s', marginBottom: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '6px 0' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  tabIndex={isLogin ? 0 : -1}
                  style={{ accentColor: BRAND, width: 15, height: 15 }}
                />
                <span style={{ fontSize: 13, color: '#374151' }}>Remember me for 30 days</span>
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', height: 44, padding: 0, background: loading ? '#475569' : DARK, color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.15s', marginBottom: 24 }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1E293B' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = DARK }}
            >
              {loading
                ? <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
                : <><span>{isLogin ? 'Sign In' : 'Create Account'}</span><ArrowRightIcon /></>
              }
            </button>
          </form>
          {/* ─── Divider ─── */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0 20px' }}>
            <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
            <span style={{ margin: '0 14px', fontSize: 12, fontWeight: 500, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Or continue with</span>
            <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
          </div>

          {/* ─── Google sign-in button ─── */}
          <button
            type="button"
            onClick={() => { setGoogleLoading(true); googleLogin() }}
            disabled={googleLoading || loading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '10px 0', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#374151', cursor: (googleLoading || loading) ? 'not-allowed' : 'pointer', transition: 'all 0.15s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', opacity: (googleLoading || loading) ? 0.6 : 1, marginBottom: 24 }}
            onMouseEnter={e => { if (!googleLoading && !loading) e.currentTarget.style.background = '#F8FAFC' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF' }}
          >
            {googleLoading ? (
              <span style={{ width: 16, height: 16, border: '2px solid #E2E8F0', borderTopColor: '#94A3B8', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>

          {/* Footer terms */}
          <p style={{ textAlign: 'center', fontSize: 12, color: '#94A3B8', marginTop: 8 }}>
            By continuing, you agree to our{' '}
            <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span>
            {' '}and{' '}
            <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>.
          </p>
        </div>
      </div>

      {/* ═══════════════ Right panel: brand showcase (desktop only) ═══════════════ */}
      <div
        className="auth-right"
        style={{
          width: '50%',
          background: '#1E293B',
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.2, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-10%', right: '10%', width: 480, height: 480, borderRadius: '50%', background: BRAND, filter: 'blur(120px)' }} />
          <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: 560, height: 560, borderRadius: '50%', background: '#7C3AED', filter: 'blur(140px)' }} />
        </div>

        {/* Grid texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 420, color: '#fff', padding: 48 }}>
          {/* Brand logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 52 }}>
            <div style={{ width: 44, height: 44, background: BRAND, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 22, fontFamily: 'Georgia, serif', fontStyle: 'italic', boxShadow: `0 0 24px ${BRAND}60` }}>∑</div>
            <span style={{ fontWeight: 600, fontSize: 22, letterSpacing: '-0.4px' }}>A-Level Hub</span>
          </div>

          {/* Heading */}
          <h2 style={{ fontSize: 38, fontWeight: 700, fontFamily: 'Georgia, "Times New Roman", serif', lineHeight: 1.2, marginBottom: 20 }}>
            Master A-Level<br />
            with{' '}
            <span style={{ background: `linear-gradient(135deg, ${BRAND}, #FF6B6B)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Precision.
            </span>
          </h2>

          <p style={{ color: '#94A3B8', fontSize: 16, lineHeight: 1.7, marginBottom: 44 }}>
            Join thousands of high-achieving students. Structured curriculum, past papers, and AI tutoring — all in one place.
          </p>

          {/* AI Insights card */}
          <div style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ padding: 10, background: `${BRAND}25`, borderRadius: 12, color: '#FF8A80', flexShrink: 0, marginTop: 2 }}>
                <BrainIcon />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  AI Insights <span style={{ color: '#FCD34D' }}><SparklesIcon /></span>
                </div>
                <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.6 }}>
                  "We noticed you're reviewing{' '}
                  <span style={{ color: '#FCA5A5' }}>Integration by Parts</span>
                  . I've prepared a 15-minute focused practice session based on your past exam performance."
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 32, marginTop: 40 }}>
            {[{ num: '6', label: 'Subjects' }, { num: '82+', label: 'Chapters' }, { num: 'AI', label: 'Tutor' }].map(({ num, label }) => (
              <div key={label}>
                <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Georgia, serif', color: '#fff' }}>{num}</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
