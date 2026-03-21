import { useState, useEffect } from 'react'
import useUser from '../hooks/useUser'

/**
 * User profile page
 * Displays user info and study preferences
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

  const handleUserFormChange = (e) => {
    const { name, value } = e.target
    setUserForm(prev => ({ ...prev, [name]: value }))
  }

  const handleProfileFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setProfileForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubjectToggle = (subjectId) => {
    setProfileForm(prev => {
      const subjects = prev.selectedSubjects || []
      const newSubjects = subjects.includes(subjectId)
        ? subjects.filter(id => id !== subjectId)
        : [...subjects, subjectId]
      return { ...prev, selectedSubjects: newSubjects }
    })
  }

  const handleSave = async () => {
    if (!user) return

    try {
      clearError()
      setSaveSuccess(false)

      await updateUser(user.id, userForm)

      await updateUserProfile(user.id, {
        ...profileForm,
        weeklyStudyHours: profileForm.weeklyStudyHours ? parseInt(profileForm.weeklyStudyHours) : null
      })

      setSaveSuccess(true)
      setIsEditing(false)

      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Save failed:', err)
    }
  }

  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>My Profile</h2>
          <p style={styles.notLoggedIn}>Please log in to view your profile</p>
        </div>
      </div>
    )
  }

  if (loading && !user) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.loading}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>My Profile</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              style={styles.editButton}
            >
              Edit
            </button>
          )}
        </div>

        {error && (
          <div style={styles.error}>
            {error}
            <button onClick={clearError} style={styles.closeButton}>×</button>
          </div>
        )}

        {saveSuccess && (
          <div style={styles.success}>
            Saved successfully!
          </div>
        )}

        {/* Basic info */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Basic Info</h3>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nickname</label>
              <input
                type="text"
                name="nickname"
                value={userForm.nickname}
                onChange={handleUserFormChange}
                disabled={!isEditing}
                style={styles.input}
                placeholder="Enter your nickname"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Year</label>
              <select
                name="grade"
                value={userForm.grade}
                onChange={handleUserFormChange}
                disabled={!isEditing}
                style={styles.input}
              >
                <option value="">Select</option>
                <option value="AS">AS Level</option>
                <option value="A2">A2 Level</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Target University</label>
              <input
                type="text"
                name="targetUniversity"
                value={userForm.targetUniversity}
                onChange={handleUserFormChange}
                disabled={!isEditing}
                style={styles.input}
                placeholder="e.g. Cambridge, Oxford"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
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

        {/* Study preferences */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Study Preferences</h3>

          <div style={styles.formGroup}>
            <label style={styles.label}>Subjects</label>
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
              <label style={styles.label}>Weekly Study Hours</label>
              <input
                type="number"
                name="weeklyStudyHours"
                value={profileForm.weeklyStudyHours}
                onChange={handleProfileFormChange}
                disabled={!isEditing}
                style={styles.input}
                placeholder="e.g. 20"
                min="0"
                max="168"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Preferred Study Time</label>
              <select
                name="preferredStudyTime"
                value={profileForm.preferredStudyTime}
                onChange={handleProfileFormChange}
                disabled={!isEditing}
                style={styles.input}
              >
                <option value="">Select</option>
                <option value="morning">Morning (6:00–12:00)</option>
                <option value="afternoon">Afternoon (12:00–18:00)</option>
                <option value="evening">Evening (18:00–22:00)</option>
                <option value="night">Night (22:00–6:00)</option>
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Study Goals</label>
            <textarea
              name="studyGoals"
              value={profileForm.studyGoals}
              onChange={handleProfileFormChange}
              disabled={!isEditing}
              style={styles.textarea}
              placeholder="Describe your study goals..."
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
              <span>Enable study reminders</span>
            </label>
          </div>
        </section>

        {/* Study stats */}
        {stats && (
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Study Stats</h3>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{Math.floor(stats.totalStudyTime / 3600)}</div>
                <div style={styles.statLabel}>Study Hours</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{stats.totalChaptersCompleted}</div>
                <div style={styles.statLabel}>Chapters Done</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{stats.currentStreak}</div>
                <div style={styles.statLabel}>Current Streak (days)</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{stats.longestStreak}</div>
                <div style={styles.statLabel}>Best Streak (days)</div>
              </div>
            </div>
          </section>
        )}

        {/* Action buttons */}
        {isEditing && (
          <div style={styles.actions}>
            <button
              onClick={() => setIsEditing(false)}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={styles.saveButton}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const AVAILABLE_SUBJECTS = [
  { id: 'mathematics',  name: 'Mathematics',   icon: '📐' },
  { id: 'economics',    name: 'Economics',      icon: '📊' },
  { id: 'history',      name: 'History',        icon: '📜' },
  { id: 'politics',     name: 'Politics',       icon: '🏛️' },
  { id: 'psychology',   name: 'Psychology',     icon: '🧠' },
  { id: 'further_math', name: 'Further Maths',  icon: '🔢' }
]

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
    backgroundColor: '#188038',
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
    borderColor: '#188038',
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
    color: '#188038',
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
    backgroundColor: '#188038',
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
