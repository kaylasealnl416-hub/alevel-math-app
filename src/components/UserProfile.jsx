import { useState, useEffect } from 'react'
import useUser from '../hooks/useUser'

/**
 * 个人中心页面
 * 显示用户信息、学习偏好设置
 */
export default function UserProfile() {
  const {
    user,
    profile,
    stats,
    loading,
    error,
    updateUser,
    updateUserProfile,
    clearError,
    isLoggedIn
  } = useUser()

  // 表单状态
  const [userForm, setUserForm] = useState({
    nickname: '',
    grade: '',
    targetUniversity: '',
    email: '',
    phone: ''
  })

  const [profileForm, setProfileForm] = useState({
    selectedSubjects: [],
    studyGoals: '',
    weeklyStudyHours: '',
    preferredStudyTime: '',
    notificationEnabled: true
  })

  const [isEditing, setIsEditing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // 初始化表单数据
  useEffect(() => {
    if (user) {
      setUserForm({
        nickname: user.nickname || '',
        grade: user.grade || '',
        targetUniversity: user.targetUniversity || '',
        email: user.email || '',
        phone: user.phone || ''
      })
    }
  }, [user])

  useEffect(() => {
    if (profile) {
      setProfileForm({
        selectedSubjects: profile.selectedSubjects || [],
        studyGoals: profile.studyGoals || '',
        weeklyStudyHours: profile.weeklyStudyHours || '',
        preferredStudyTime: profile.preferredStudyTime || '',
        notificationEnabled: profile.notificationEnabled !== false
      })
    }
  }, [profile])

  // 处理用户信息表单变化
  const handleUserFormChange = (e) => {
    const { name, value } = e.target
    setUserForm(prev => ({ ...prev, [name]: value }))
  }

  // 处理画像表单变化
  const handleProfileFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setProfileForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // 处理科目选择
  const handleSubjectToggle = (subjectId) => {
    setProfileForm(prev => {
      const subjects = prev.selectedSubjects || []
      const newSubjects = subjects.includes(subjectId)
        ? subjects.filter(id => id !== subjectId)
        : [...subjects, subjectId]
      return { ...prev, selectedSubjects: newSubjects }
    })
  }

  // 保存用户信息
  const handleSave = async () => {
    if (!user) return

    try {
      clearError()
      setSaveSuccess(false)

      // 保存用户基本信息
      await updateUser(user.id, userForm)

      // 保存用户画像
      await updateUserProfile(user.id, {
        ...profileForm,
        weeklyStudyHours: profileForm.weeklyStudyHours ? parseInt(profileForm.weeklyStudyHours) : null
      })

      setSaveSuccess(true)
      setIsEditing(false)

      // 3秒后隐藏成功提示
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('保存失败:', err)
    }
  }

  // 如果未登录
  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>个人中心</h2>
          <p style={styles.notLoggedIn}>请先登录</p>
        </div>
      </div>
    )
  }

  // 加载中
  if (loading && !user) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.loading}>加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* 标题 */}
        <div style={styles.header}>
          <h2 style={styles.title}>个人中心</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              style={styles.editButton}
            >
              编辑
            </button>
          )}
        </div>

        {/* 错误提示 */}
        {error && (
          <div style={styles.error}>
            {error}
            <button onClick={clearError} style={styles.closeButton}>×</button>
          </div>
        )}

        {/* 成功提示 */}
        {saveSuccess && (
          <div style={styles.success}>
            保存成功！
          </div>
        )}

        {/* 用户基本信息 */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>基本信息</h3>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>昵称</label>
              <input
                type="text"
                name="nickname"
                value={userForm.nickname}
                onChange={handleUserFormChange}
                disabled={!isEditing}
                style={styles.input}
                placeholder="请输入昵称"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>年级</label>
              <select
                name="grade"
                value={userForm.grade}
                onChange={handleUserFormChange}
                disabled={!isEditing}
                style={styles.input}
              >
                <option value="">请选择</option>
                <option value="AS">AS Level</option>
                <option value="A2">A2 Level</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>目标大学</label>
              <input
                type="text"
                name="targetUniversity"
                value={userForm.targetUniversity}
                onChange={handleUserFormChange}
                disabled={!isEditing}
                style={styles.input}
                placeholder="如：Cambridge, Oxford"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>邮箱</label>
              <input
                type="email"
                name="email"
                value={userForm.email}
                onChange={handleUserFormChange}
                disabled={!isEditing}
                style={styles.input}
                placeholder="your@email.com"
              />
            </div>
          </div>
        </section>

        {/* 学习偏好 */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>学习偏好</h3>

          {/* 科目选择 */}
          <div style={styles.formGroup}>
            <label style={styles.label}>选择科目</label>
            <div style={styles.subjectGrid}>
              {AVAILABLE_SUBJECTS.map(subject => (
                <button
                  key={subject.id}
                  onClick={() => isEditing && handleSubjectToggle(subject.id)}
                  disabled={!isEditing}
                  style={{
                    ...styles.subjectButton,
                    ...(profileForm.selectedSubjects?.includes(subject.id) ? styles.subjectButtonActive : {})
                  }}
                >
                  {subject.icon} {subject.name}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>每周学习时长（小时）</label>
              <input
                type="number"
                name="weeklyStudyHours"
                value={profileForm.weeklyStudyHours}
                onChange={handleProfileFormChange}
                disabled={!isEditing}
                style={styles.input}
                placeholder="如：20"
                min="0"
                max="168"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>偏好学习时间</label>
              <select
                name="preferredStudyTime"
                value={profileForm.preferredStudyTime}
                onChange={handleProfileFormChange}
                disabled={!isEditing}
                style={styles.input}
              >
                <option value="">请选择</option>
                <option value="morning">早晨 (6:00-12:00)</option>
                <option value="afternoon">下午 (12:00-18:00)</option>
                <option value="evening">傍晚 (18:00-22:00)</option>
                <option value="night">深夜 (22:00-6:00)</option>
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>学习目标</label>
            <textarea
              name="studyGoals"
              value={profileForm.studyGoals}
              onChange={handleProfileFormChange}
              disabled={!isEditing}
              style={styles.textarea}
              placeholder="描述你的学习目标..."
              rows="3"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="notificationEnabled"
                checked={profileForm.notificationEnabled}
                onChange={handleProfileFormChange}
                disabled={!isEditing}
                style={styles.checkbox}
              />
              <span>接收学习提醒通知</span>
            </label>
          </div>
        </section>

        {/* 学习统计 */}
        {stats && (
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>学习统计</h3>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{Math.floor(stats.totalStudyTime / 3600)}</div>
                <div style={styles.statLabel}>学习时长（小时）</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{stats.totalChaptersCompleted}</div>
                <div style={styles.statLabel}>完成章节</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{stats.currentStreak}</div>
                <div style={styles.statLabel}>连续学习（天）</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{stats.longestStreak}</div>
                <div style={styles.statLabel}>最长连续（天）</div>
              </div>
            </div>
          </section>
        )}

        {/* 操作按钮 */}
        {isEditing && (
          <div style={styles.actions}>
            <button
              onClick={() => setIsEditing(false)}
              style={styles.cancelButton}
            >
              取消
            </button>
            <button
              onClick={handleSave}
              style={styles.saveButton}
              disabled={loading}
            >
              {loading ? '保存中...' : '保存'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// 可选科目列表
const AVAILABLE_SUBJECTS = [
  { id: 'mathematics', name: '数学', icon: '📐' },
  { id: 'economics', name: '经济学', icon: '📊' },
  { id: 'history', name: '历史', icon: '📜' },
  { id: 'politics', name: '政治', icon: '🏛️' },
  { id: 'psychology', name: '心理学', icon: '🧠' },
  { id: 'further_math', name: '进阶数学', icon: '🔢' }
]

// 样式
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '24px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
    color: '#333'
  },
  editButton: {
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  section: {
    marginBottom: '32px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#555',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '8px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px'
  },
  formGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#666'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  subjectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '12px'
  },
  subjectButton: {
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s'
  },
  subjectButtonActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8f4',
    fontWeight: '600'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#666',
    cursor: 'pointer'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px'
  },
  statCard: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    textAlign: 'center'
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: '8px'
  },
  statLabel: {
    fontSize: '14px',
    color: '#666'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #f0f0f0'
  },
  cancelButton: {
    padding: '10px 24px',
    backgroundColor: '#f5f5f5',
    color: '#666',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  saveButton: {
    padding: '10px 24px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  error: {
    padding: '12px 16px',
    backgroundColor: '#fee',
    color: '#c33',
    borderRadius: '6px',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  success: {
    padding: '12px 16px',
    backgroundColor: '#efe',
    color: '#3c3',
    borderRadius: '6px',
    marginBottom: '16px'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#c33'
  },
  notLoggedIn: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
    fontSize: '16px'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
    fontSize: '16px'
  }
}
