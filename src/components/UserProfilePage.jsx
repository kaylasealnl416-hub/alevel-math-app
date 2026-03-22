import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Toast from './common/Toast'
import Loading from './common/Loading'
import { Button } from './ui'
import { put } from '../utils/apiClient'

export default function UserProfilePage() {
  const navigate = useNavigate()
  const { user, updateUser, logout } = useAuth()
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

    if (!validateForm()) return

    setLoading(true)

    try {
      const data = await put('/api/users/profile', formData)
      updateUser(data)
      Toast.success('Profile updated successfully!')
      setLoading(false)

      setTimeout(() => { navigate(-1) }, 1000)
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

  if (initialLoading) return <Loading size="large" />

  const S = {
    page: { minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
    card: { background: '#fff', border: '1px solid #dadce0', borderRadius: 12, padding: 40, width: '100%', maxWidth: 480 },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
    title: { fontSize: 22, fontWeight: 600, color: '#202124', margin: 0, textAlign: 'center' },
    avatarSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 },
    avatar: {
      width: 72, height: 72, borderRadius: '50%', background: '#1a73e8',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 28, fontWeight: 600, color: '#fff', marginBottom: 10,
    },
    email: { fontSize: 14, color: '#5f6368', margin: 0 },
    form: { display: 'flex', flexDirection: 'column', gap: 18 },
    field: { display: 'flex', flexDirection: 'column', gap: 6 },
    label: { fontSize: 13, fontWeight: 500, color: '#5f6368' },
    input: {
      padding: '10px 12px', border: '1px solid #dadce0', borderRadius: 8,
      fontSize: 14, color: '#202124', outline: 'none', background: '#fff',
      transition: 'border-color 0.2s',
    },
    inputError: { borderColor: '#d93025' },
    select: {
      padding: '10px 12px', border: '1px solid #dadce0', borderRadius: 8,
      fontSize: 14, color: '#202124', outline: 'none', background: '#fff',
      cursor: 'pointer',
    },
    errorText: { color: '#d93025', fontSize: 12 },
    footer: {
      marginTop: 28, paddingTop: 20, borderTop: '1px solid #f1f3f4',
      display: 'flex', justifyContent: 'center',
    },
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.header}>
          <Button variant="text" size="sm" onClick={() => navigate(-1)}>← Back</Button>
          <h1 style={S.title}>Profile</h1>
          <div style={{ width: 60 }} />
        </div>

        <div style={S.avatarSection}>
          <div style={S.avatar}>
            {user?.nickname?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <p style={S.email}>{user?.email}</p>
        </div>

        <form onSubmit={handleSubmit} style={S.form}>
          <div style={S.field}>
            <label style={S.label}>Nickname</label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => {
                setFormData({ ...formData, nickname: e.target.value })
                if (errors.nickname) setErrors({ ...errors, nickname: '' })
              }}
              style={{ ...S.input, ...(errors.nickname ? S.inputError : {}) }}
              placeholder="Your nickname"
              maxLength={50}
            />
            {errors.nickname && <span style={S.errorText}>{errors.nickname}</span>}
          </div>

          <div style={S.field}>
            <label style={S.label}>Year</label>
            <select
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              style={S.select}
            >
              <option value="AS">AS Level</option>
              <option value="A2">A2 Level</option>
            </select>
          </div>

          <div style={S.field}>
            <label style={S.label}>Target University (optional)</label>
            <input
              type="text"
              value={formData.targetUniversity}
              onChange={(e) => setFormData({ ...formData, targetUniversity: e.target.value })}
              style={S.input}
              placeholder="e.g. Cambridge, Oxford"
            />
          </div>

          <div style={S.field}>
            <label style={S.label}>Phone (optional)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value })
                if (errors.phone) setErrors({ ...errors, phone: '' })
              }}
              style={{ ...S.input, ...(errors.phone ? S.inputError : {}) }}
              placeholder="13800138000"
            />
            {errors.phone && <span style={S.errorText}>{errors.phone}</span>}
          </div>

          <Button variant="primary" size="md" disabled={loading} className="w-full" style={{ marginTop: 4 }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>

        <div style={S.footer}>
          <Button variant="danger" size="sm" onClick={handleLogout}>Log Out</Button>
        </div>
      </div>
    </div>
  )
}
