import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Toast from './common/Toast'
import { API_BASE, COLORS } from '../utils/constants'
import { validateEmail, validatePassword } from '../utils/validation'

const BRAND = COLORS.brand

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F9FAFB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
  },
  card: {
    background: '#FFFFFF',
    borderRadius: 16,
    border: '1px solid #E5E7EB',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
    padding: '48px 40px 40px',
    width: '100%',
    maxWidth: 400,
  },
  logoWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 36,
  },
  logoSymbol: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: `${BRAND}15`,
    border: `2px solid ${BRAND}30`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 26,
    color: BRAND,
    fontWeight: 700,
    marginBottom: 16,
  },
  logoTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 4,
  },
  logoSub: {
    fontSize: 14,
    color: '#6B7280',
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    border: '1px solid #D1D5DB',
    borderRadius: 8,
    fontSize: 14,
    color: '#111827',
    background: '#FFFFFF',
    outline: 'none',
    transition: 'border-color 0.15s',
    boxSizing: 'border-box',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorMsg: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 5,
  },
  fieldWrap: {
    marginBottom: 20,
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#374151',
    cursor: 'pointer',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    background: BRAND,
    color: '#FFFFFF',
    fontWeight: 600,
    fontSize: 15,
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  footer: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 13,
    color: '#6B7280',
  },
  link: {
    color: BRAND,
    fontWeight: 600,
    textDecoration: 'none',
  },
  testAccount: {
    marginTop: 20,
    padding: '12px 16px',
    background: '#FFF5F5',
    border: `1px solid ${BRAND}20`,
    borderRadius: 8,
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  testValue: {
    color: BRAND,
    fontWeight: 600,
  },
  spinner: {
    width: 16,
    height: 16,
    border: '2px solid rgba(255,255,255,0.4)',
    borderTopColor: '#FFF',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
    display: 'inline-block',
    marginRight: 8,
    verticalAlign: 'middle',
  },
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email')
    if (savedEmail) {
      setFormData({ email: savedEmail, password: '' })
      setRememberMe(true)
    }
  }, [])

  const validateForm = () => {
    const newErrors = {}
    const emailError = validateEmail(formData.email)
    if (emailError) newErrors.email = emailError
    const passwordError = validatePassword(formData.password)
    if (passwordError) newErrors.password = passwordError
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!data.success) {
        Toast.error(data.error?.message || 'Login failed')
        setLoading(false)
        return
      }

      if (rememberMe) {
        localStorage.setItem('remembered_email', formData.email)
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

  const inputStyle = (field) => ({
    ...styles.input,
    ...(errors[field] ? styles.inputError : {}),
    ...(focusedField === field && !errors[field] ? { borderColor: BRAND } : {}),
  })

  return (
    <div style={styles.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logoSymbol}>∑</div>
          <div style={styles.logoTitle}>Welcome Back</div>
          <div style={styles.logoSub}>Pearson Edexcel A Levels</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={styles.fieldWrap}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value })
                if (errors.email) setErrors({ ...errors, email: '' })
              }}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder="your@email.com"
              style={inputStyle('email')}
            />
            {errors.email && <div style={styles.errorMsg}>{errors.email}</div>}
          </div>

          <div style={styles.fieldWrap}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value })
                if (errors.password) setErrors({ ...errors, password: '' })
              }}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              placeholder="••••••••"
              style={inputStyle('password')}
            />
            {errors.password && <div style={styles.errorMsg}>{errors.password}</div>}
          </div>

          <label style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: BRAND, width: 15, height: 15 }}
            />
            <span style={styles.checkboxLabel}>Remember me</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#B71C1C' }}
            onMouseLeave={e => { e.currentTarget.style.background = BRAND }}
          >
            {loading ? (
              <>
                <span style={styles.spinner} />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Sign up</Link>
        </div>

        <div style={styles.testAccount}>
          Test account:{' '}
          <span style={styles.testValue}>student1@test.com</span>
          {' / '}
          <span style={styles.testValue}>test123</span>
        </div>
      </div>
    </div>
  )
}
