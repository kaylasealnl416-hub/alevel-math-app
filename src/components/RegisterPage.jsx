import { useState } from 'react'
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
  select: {
    width: '100%',
    padding: '11px 14px',
    border: '1px solid #D1D5DB',
    borderRadius: 8,
    fontSize: 14,
    color: '#111827',
    background: '#FFFFFF',
    outline: 'none',
    cursor: 'pointer',
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
    marginBottom: 18,
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
    marginTop: 6,
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
  strengthBar: {
    height: 4,
    background: '#E5E7EB',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.25s, background-color 0.25s',
  },
  strengthLabel: {
    fontSize: 11,
    marginTop: 4,
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

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    grade: 'AS',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' })
  const [focusedField, setFocusedField] = useState(null)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.nickname.trim()) {
      newErrors.nickname = 'Nickname is required'
    } else if (formData.nickname.length > 50) {
      newErrors.nickname = 'Nickname cannot exceed 50 characters'
    }
    const emailError = validateEmail(formData.email)
    if (emailError) newErrors.email = emailError
    const passwordError = validatePassword(formData.password)
    if (passwordError) newErrors.password = passwordError
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nickname: formData.nickname,
          grade: formData.grade,
        }),
      })
      const data = await res.json()

      if (!data.success) {
        if (data.error?.details) {
          Toast.error(data.error.details.map(d => d.message).join('\n'))
        } else {
          Toast.error(data.error?.message || 'Registration failed')
        }
        setLoading(false)
        return
      }

      Toast.success('Registration successful! Welcome to Pearson Edexcel A Levels')
      login(data.data.user)
      setTimeout(() => navigate('/exams'), 1000)
    } catch {
      Toast.error('Network error, please try again later')
      setLoading(false)
    }
  }

  const handlePasswordChange = (e) => {
    const val = e.target.value
    setFormData({ ...formData, password: val })
    setPasswordStrength(checkPasswordStrength(val))
    if (errors.password) setErrors({ ...errors, password: '' })
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
          <div style={styles.logoTitle}>Create Account</div>
          <div style={styles.logoSub}>Pearson Edexcel A Levels</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={styles.fieldWrap}>
            <label style={styles.label}>Nickname</label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => {
                setFormData({ ...formData, nickname: e.target.value })
                if (errors.nickname) setErrors({ ...errors, nickname: '' })
              }}
              onFocus={() => setFocusedField('nickname')}
              onBlur={() => setFocusedField(null)}
              placeholder="Your nickname"
              maxLength={50}
              style={inputStyle('nickname')}
            />
            {errors.nickname && <div style={styles.errorMsg}>{errors.nickname}</div>}
          </div>

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
              onChange={handlePasswordChange}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              placeholder="At least 6 characters"
              style={inputStyle('password')}
            />
            {errors.password && <div style={styles.errorMsg}>{errors.password}</div>}
            {formData.password && (
              <>
                <div style={styles.strengthBar}>
                  <div
                    style={{
                      ...styles.strengthFill,
                      width: `${(passwordStrength.score / 5) * 100}%`,
                      background: passwordStrength.color,
                    }}
                  />
                </div>
                {passwordStrength.text && (
                  <div style={{ ...styles.strengthLabel, color: passwordStrength.color }}>
                    {passwordStrength.text}
                  </div>
                )}
              </>
            )}
          </div>

          <div style={styles.fieldWrap}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value })
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' })
              }}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField(null)}
              placeholder="Enter password again"
              style={inputStyle('confirmPassword')}
            />
            {errors.confirmPassword && <div style={styles.errorMsg}>{errors.confirmPassword}</div>}
          </div>

          <div style={styles.fieldWrap}>
            <label style={styles.label}>Grade</label>
            <select
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              style={styles.select}
            >
              <option value="AS">AS Level</option>
              <option value="A2">A2 Level</option>
            </select>
          </div>

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
                Creating account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </div>
      </div>
    </div>
  )
}
