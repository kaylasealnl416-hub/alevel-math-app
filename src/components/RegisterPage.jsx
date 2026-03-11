import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Toast from './common/Toast'

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
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>注册</h1>
        <p style={styles.subtitle}>创建你的学习账号</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>昵称</label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => {
                setFormData({ ...formData, nickname: e.target.value })
                if (errors.nickname) setErrors({ ...errors, nickname: '' })
              }}
              style={{
                ...styles.input,
                ...(errors.nickname ? styles.inputError : {})
              }}
              placeholder="你的昵称"
              maxLength={50}
            />
            {errors.nickname && <span style={styles.errorText}>{errors.nickname}</span>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>邮箱</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value })
                if (errors.email) setErrors({ ...errors, email: '' })
              }}
              style={{
                ...styles.input,
                ...(errors.email ? styles.inputError : {})
              }}
              placeholder="your@email.com"
            />
            {errors.email && <span style={styles.errorText}>{errors.email}</span>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>密码</label>
            <input
              type="password"
              value={formData.password}
              onChange={handlePasswordChange}
              style={{
                ...styles.input,
                ...(errors.password ? styles.inputError : {})
              }}
              placeholder="至少 6 个字符"
            />
            {formData.password && (
              <div style={styles.strengthBar}>
                <div style={{
                  ...styles.strengthFill,
                  width: `${(passwordStrength.score / 5) * 100}%`,
                  backgroundColor: passwordStrength.color
                }} />
              </div>
            )}
            {formData.password && passwordStrength.text && (
              <span style={{ ...styles.strengthText, color: passwordStrength.color }}>
                密码强度：{passwordStrength.text}
              </span>
            )}
            {errors.password && <span style={styles.errorText}>{errors.password}</span>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>确认密码</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value })
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' })
              }}
              style={{
                ...styles.input,
                ...(errors.confirmPassword ? styles.inputError : {})
              }}
              placeholder="再次输入密码"
            />
            {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword}</span>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>年级</label>
            <select
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              style={styles.select}
            >
              <option value="AS">AS Level</option>
              <option value="A2">A2 Level</option>
            </select>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? '注册中...' : '注册'}
          </button>
        </form>

        <p style={styles.footer}>
          已有账号？ <Link to="/login" style={styles.link}>立即登录</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: '8px',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '14px',
    color: '#718096',
    marginBottom: '32px',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2d3748'
  },
  input: {
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  inputError: {
    borderColor: '#fc8181'
  },
  select: {
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  button: {
    padding: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.2s'
  },
  errorText: {
    color: '#e53e3e',
    fontSize: '12px',
    marginTop: '-4px'
  },
  strengthBar: {
    height: '4px',
    backgroundColor: '#e2e8f0',
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: '4px'
  },
  strengthFill: {
    height: '100%',
    transition: 'width 0.3s, background-color 0.3s'
  },
  strengthText: {
    fontSize: '12px',
    fontWeight: '500'
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#718096'
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600'
  }
}
