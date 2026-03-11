import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: ''
  })
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!data.success) {
        // 显示验证错误
        if (data.error?.details) {
          setErrors(data.error.details.map(d => d.message))
        } else {
          setErrors([data.error?.message || '注册失败'])
        }
        setLoading(false)
        return
      }

      // 注册成功，自动登录
      login(data.data.user, data.data.token)
      navigate('/exams')
    } catch (err) {
      setErrors(['网络错误，请稍后重试'])
      setLoading(false)
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
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              style={styles.input}
              placeholder="你的昵称"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>邮箱</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={styles.input}
              placeholder="your@email.com"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>密码</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={styles.input}
              placeholder="至少 6 个字符"
              required
            />
          </div>

          {errors.length > 0 && (
            <div style={styles.errorBox}>
              {errors.map((err, i) => (
                <div key={i} style={styles.errorItem}>{err}</div>
              ))}
            </div>
          )}

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
    outline: 'none'
  },
  button: {
    padding: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  errorBox: {
    padding: '12px',
    background: '#fed7d7',
    borderRadius: '8px'
  },
  errorItem: {
    color: '#c53030',
    fontSize: '14px',
    marginBottom: '4px'
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
