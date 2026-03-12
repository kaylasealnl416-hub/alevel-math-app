import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Toast from './common/Toast'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Initialize: restore remembered email from localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email')
    if (savedEmail) {
      setFormData({ ...formData, email: savedEmail })
      setRememberMe(true)
    }
  }, [])

  // Form validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
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
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Send and receive cookies
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!data.success) {
        const errorMessage = data.error?.message || 'Login failed'
        Toast.error(errorMessage)
        setLoading(false)
        return
      }

      // Remember email
      if (rememberMe) {
        localStorage.setItem('remembered_email', formData.email)
      } else {
        localStorage.removeItem('remembered_email')
      }

      // Login successful (Token stored in httpOnly Cookie)
      Toast.success('Login successful!')
      login(data.data.user) // Only pass user info, not token

      // Delayed navigation
      setTimeout(() => {
        navigate('/exams')
      }, 800)
    } catch (err) {
      Toast.error('Network error, please try again later')
      setLoading(false)
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
            Welcome Back
          </h1>
          <p className="text-gray-500 text-base">
            A-Level Math Learning Hub
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email input */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
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
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value })
                if (errors.password) setErrors({ ...errors, password: '' })
              }}
              placeholder="••••••••"
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
          </div>

          {/* Remember me */}
          <div className="flex items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all"
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Remember me</span>
            </label>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              'Login →'
            )}
          </button>
        </form>

        {/* Register link */}
        <p className="mt-8 text-center text-sm text-gray-600 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors hover:underline"
          >
            Sign up
          </Link>
        </p>

        {/* Test account */}
        <div className="mt-6 p-5 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-indigo-100 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <p className="text-sm text-gray-700 text-center font-semibold">
            💡 Test account: <span className="text-indigo-600">student1@test.com</span> / <span className="text-indigo-600">test123</span>
          </p>
        </div>
      </div>
    </div>
  )
}
