import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Toast from './common/Toast'
import { Button, Input } from './ui'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // 初始化：从 localStorage 恢复记住的邮箱
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email')
    if (savedEmail) {
      setFormData({ ...formData, email: savedEmail })
      setRememberMe(true)
    }
  }, [])

  // 表单验证
  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = '邮箱不能为空'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确'
    }

    if (!formData.password) {
      newErrors.password = '密码不能为空'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 前端验证
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!data.success) {
        const errorMessage = data.error?.message || '登录失败'
        Toast.error(errorMessage)
        setLoading(false)
        return
      }

      // 记住邮箱
      if (rememberMe) {
        localStorage.setItem('remembered_email', formData.email)
      } else {
        localStorage.removeItem('remembered_email')
      }

      // 登录成功
      Toast.success('登录成功！')
      login(data.data.user, data.data.token)

      // 延迟跳转
      setTimeout(() => {
        navigate('/exams')
      }, 800)
    } catch (err) {
      Toast.error('网络错误，请稍后重试')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100 animate-scale-in">
        {/* 标题 */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mb-3">
            <span className="text-3xl">🎓</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            登录
          </h1>
          <p className="text-gray-600 text-sm">
            A-Level Math Learning Hub
          </p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 邮箱输入 */}
          <Input
            type="email"
            label="邮箱"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value })
              if (errors.email) setErrors({ ...errors, email: '' })
            }}
            error={errors.email}
            placeholder="your@email.com"
          />

          {/* 密码输入 */}
          <Input
            type="password"
            label="密码"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value })
              if (errors.password) setErrors({ ...errors, password: '' })
            }}
            error={errors.password}
            placeholder="••••••••"
          />

          {/* 记住我 */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-2 focus:ring-primary-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700">记住我</span>
            </label>
          </div>

          {/* 登录按钮 */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full mt-6"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                登录中...
              </span>
            ) : (
              '立即登录'
            )}
          </Button>
        </form>

        {/* 注册链接 */}
        <p className="mt-6 text-center text-sm text-gray-600">
          还没有账号？{' '}
          <Link
            to="/register"
            className="text-primary-600 hover:text-primary-700 font-semibold transition-colors hover:underline"
          >
            立即注册
          </Link>
        </p>

        {/* 测试账号 */}
        <div className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
          <p className="text-xs text-gray-700 text-center font-medium">
            💡 测试账号: student1@test.com / test123
          </p>
        </div>
      </div>
    </div>
  )
}
