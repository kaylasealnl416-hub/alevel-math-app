import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Toast from './common/Toast'
import Loading from './common/Loading'
import { API_BASE } from '../utils/constants'

export default function UserProfilePage() {
  const navigate = useNavigate()
  const { user, token, updateUser, logout } = useAuth()
  const [formData, setFormData] = useState({
    nickname: '',
    grade: 'AS',
    targetUniversity: '',
    phone: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    if (user) {
      setFormData({
        nickname: user.nickname || '',
        grade: user.grade || 'AS',
        targetUniversity: user.targetUniversity || '',
        phone: user.phone || ''
      })
      setInitialLoading(false)
    }
  }, [user])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nickname.trim()) {
      newErrors.nickname = 'Nickname is required'
    } else if (formData.nickname.length > 50) {
      newErrors.nickname = 'Nickname must be 50 characters or fewer'
    }

    if (formData.phone && !/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!data.success) {
        Toast.error(data.error?.message || 'Update failed')
        setLoading(false)
        return
      }

      updateUser(data.data)
      Toast.success('Profile updated successfully!')
      setLoading(false)

      setTimeout(() => {
        navigate(-1)
      }, 1000)
    } catch (err) {
      Toast.error('Network error. Please try again.')
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    Toast.success('Logged out successfully')
    navigate('/login')
  }

  if (initialLoading) {
    return <Loading size="large" />
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            ← Back
          </button>
          <h1 style={styles.title}>Profile</h1>
          <div style={{ width: 60 }} />
        </div>

        <div style={styles.avatarSection}>
          <div style={styles.avatar}>
            {user?.nickname?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <p style={styles.email}>{user?.email}</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Nickname</label>
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
              placeholder="Your nickname"
              maxLength={50}
            />
            {errors.nickname && <span style={styles.errorText}>{errors.nickname}</span>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Year</label>
            <select
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              style={styles.select}
            >
              <option value="AS">AS Level</option>
              <option value="A2">A2 Level</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Target University (optional)</label>
            <input
              type="text"
              value={formData.targetUniversity}
              onChange={(e) => setFormData({ ...formData, targetUniversity: e.target.value })}
              style={styles.input}
              placeholder="e.g. Cambridge, Oxford"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Phone (optional)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value })
                if (errors.phone) setErrors({ ...errors, phone: '' })
              }}
              style={{
                ...styles.input,
                ...(errors.phone ? styles.inputError : {})
              }}
              placeholder="13800138000"
            />
            {errors.phone && <span style={styles.errorText}>{errors.phone}</span>}
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <div style={styles.footer}>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Log Out
          </button>
        </div>
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
    maxWidth: '500px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px'
  },
  backButton: {
    padding: '8px 16px',
    background: 'transparent',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#4a5568',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1a202c',
    textAlign: 'center'
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '32px'
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '12px'
  },
  email: {
    fontSize: '14px',
    color: '#718096'
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
    transition: 'opacity 0.2s',
    marginTop: '8px'
  },
  errorText: {
    color: '#e53e3e',
    fontSize: '12px',
    marginTop: '-4px'
  },
  footer: {
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'center'
  },
  logoutButton: {
    padding: '10px 24px',
    background: 'transparent',
    border: '1px solid #fc8181',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#e53e3e',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
}
