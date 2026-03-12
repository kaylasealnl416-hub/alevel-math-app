import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Toast from './common/Toast'
import { Button, Input } from './ui'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

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

  // 密码强度检查
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
      { score: 1, text: '弱', color: '#f56565' },
      { score: 2, text: '一般', color: '#ed8936' },
      { score: 3, text: '中等', color: '#ecc94b' },
      { score: 4, text: '强', color: '#48bb78' },
      { score: 5, text: '非常强', color: '#38a169' }
    ]

    return levels[Math.min(score, 5)]
  }

  // 表单验证
  const validateForm = () => {
    const newErrors = {}

    if (!formData.nickname.trim()) {
      newErrors.nickname = '昵称不能为空'
    } else if (formData.nickname.length > 50) {
      newErrors.nickname = '昵称不能超过 50 个字符'
    }

    if (!formData.email.trim()) {
      newErrors.email = '邮箱不能为空'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确'
    }

    if (!formData.password) {
      newErrors.password = '密码不能为空'
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少 6 个字符'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次密码输入不一致'
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
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nickname: formData.nickname,
          grade: formData.grade
        })
      })

      const data = await res.json()

      if (!data.success) {
        // 显示验证错误
        if (data.error?.details) {
          const errorMessages = data.error.details.map(d => d.message).join('\n')
          Toast.error(errorMessages)
        } else {
          Toast.error(data.error?.message || '注册失败')
        }
        setLoading(false)
        return
      }

      // 注册成功
      Toast.success('注册成功！欢迎加入 A-Level Math Hub')
      login(data.data.user, data.data.token)

      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        navigate('/exams')
      }, 1000)
    } catch (err) {
      Toast.error('网络错误，请稍后重试')
      setLoading(false)
    }
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setFormData({ ...formData, password: newPassword })
    setPasswordStrength(checkPasswordStrength(newPassword))

    // 清除密码错误
    if (errors.password) {
      setErrors({ ...errors, password: '' })
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
            注册
          </h1>
          <p className="text-gray-600 text-sm">
            创建你的学习账号
          </p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 昵称输入 */}
          <Input
            type="text"
            label="昵称"
            value={formData.nickname}
            onChange={(e) => {
              setFormData({ ...formData, nickname: e.target.value })
              if (errors.nickname) setErrors({ ...errors, nickname: '' })
            }}
            error={errors.nickname}
            placeholder="你的昵称"
            maxLength={50}
          />

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
          <div className="space-y-2">
            <Input
              type="password"
              label="密码"
              value={formData.password}
              onChange={handlePasswordChange}
              error={errors.password}
              placeholder="至少 6 个字符"
            />
            {/* 密码强度条 */}
            {formData.password && (
              <div className="space-y-1">
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${(passwordStrength.score / 5) * 100}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  />
                </div>
                {passwordStrength.text && (
                  <p className="text-xs font-medium" style={{ color: passwordStrength.color }}>
                    密码强度：{passwordStrength.text}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 确认密码输入 */}
          <Input
            type="password"
            label="确认密码"
            value={formData.confirmPassword}
            onChange={(e) => {
              setFormData({ ...formData, confirmPassword: e.target.value })
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' })
            }}
            error={errors.confirmPassword}
            placeholder="再次输入密码"
          />

          {/* 年级选择 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              年级
            </label>
            <select
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white cursor-pointer transition-all duration-200"
            >
              <option value="AS">AS Level</option>
              <option value="A2">A2 Level</option>
            </select>
          </div>

          {/* 注册按钮 */}
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
                注册中...
              </span>
            ) : (
              '立即注册'
            )}
          </Button>
        </form>

        {/* 登录链接 */}
        <p className="mt-6 text-center text-sm text-gray-600">
          已有账号？{' '}
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 font-semibold transition-colors hover:underline"
          >
            立即登录
          </Link>
        </p>
      </div>
    </div>
  )
}
