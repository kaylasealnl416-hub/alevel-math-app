import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Toast from './common/Toast'
import { API_BASE } from '../utils/constants'
import { validateEmail, validatePassword } from '../utils/validation'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    grade: 'AS'
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' })

  // Password strength check
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
      { score: 1, text: 'Weak', color: '#f56565' },
      { score: 2, text: 'Fair', color: '#ed8936' },
      { score: 3, text: 'Good', color: '#ecc94b' },
      { score: 4, text: 'Strong', color: '#48bb78' },
      { score: 5, text: 'Very Strong', color: '#38a169' }
    ]

    return levels[Math.min(score, 5)]
  }

  // Form validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.nickname.trim()) {
      newErrors.nickname = 'Nickname is required'
    } else if (formData.nickname.length > 50) {
      newErrors.nickname = 'Nickname cannot exceed 50 characters'
    }

    const emailError = validateEmail(formData.email)
    if (emailError) {
      newErrors.email = emailError
    }

    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      newErrors.password = passwordError
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Frontend validation
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Send and receive cookies
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nickname: formData.nickname,
          grade: formData.grade
        })
      })

      const data = await res.json()

      if (!data.success) {
        // Display validation errors
        if (data.error?.details) {
          const errorMessages = data.error.details.map(d => d.message).join('\n')
          Toast.error(errorMessages)
        } else {
          Toast.error(data.error?.message || 'Registration failed')
        }
        setLoading(false)
        return
      }

      // Registration successful (Token stored in httpOnly Cookie)
      Toast.success('Registration successful! Welcome to A-Level Math Hub')
      login(data.data.user) // Only pass user info, not token

      // Delayed navigation to let user see success message
      setTimeout(() => {
        navigate('/exams')
      }, 1000)
    } catch (err) {
      Toast.error('Network error, please try again later')
      setLoading(false)
    }
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setFormData({ ...formData, password: newPassword })
    setPasswordStrength(checkPasswordStrength(newPassword))

    // Clear password error
    if (errors.password) {
      setErrors({ ...errors, password: '' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 w-full max-w-md border border-white/20 animate-scale-in">
        {/* Title */}
        <div className="text-center mb-10 animate-fade-in-down">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full mb-5 shadow-2xl transform hover:scale-110 transition-transform duration-300">
            <span className="text-5xl">🎓</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Join Us
          </h1>
          <p className="text-gray-500 text-base">
            Create your learning account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nickname input */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nickname
            </label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => {
                setFormData({ ...formData, nickname: e.target.value })
                if (errors.nickname) setErrors({ ...errors, nickname: '' })
              }}
              placeholder="Your nickname"
              maxLength={50}
              className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all text-base ${
                errors.nickname
                  ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white'
              }`}
            />
            {errors.nickname && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span>⚠️</span> {errors.nickname}
              </p>
            )}
          </div>

          {/* Email input */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value })
                if (errors.email) setErrors({ ...errors, email: '' })
              }}
              placeholder="your@email.com"
              className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all text-base ${
                errors.email
                  ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white'
              }`}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span>⚠️</span> {errors.email}
              </p>
            )}
          </div>

          {/* Password input */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={handlePasswordChange}
              placeholder="At least 6 characters"
              className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all text-base ${
                errors.password
                  ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white'
              }`}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span>⚠️</span> {errors.password}
              </p>
            )}
            {/* Password strength bar */}
            {formData.password && (
              <div className="mt-3 space-y-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${(passwordStrength.score / 5) * 100}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  />
                </div>
                {passwordStrength.text && (
                  <p className="text-xs font-semibold" style={{ color: passwordStrength.color }}>
                    Password strength: {passwordStrength.text}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Confirm password input */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value })
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' })
              }}
              placeholder="Enter password again"
              className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all text-base ${
                errors.confirmPassword
                  ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white'
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span>⚠️</span> {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Grade selection */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Grade
            </label>
            <select
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white cursor-pointer transition-all text-base font-medium"
            >
              <option value="AS">AS Level</option>
              <option value="A2">A2 Level</option>
            </select>
          </div>

          {/* Register button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] animate-fade-in-up"
            style={{ animationDelay: '0.6s' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
            ) : (
              'Sign Up →'
            )}
          </button>
        </form>

        {/* Login link */}
        <p className="mt-8 text-center text-sm text-gray-600 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
