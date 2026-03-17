import { useState, useEffect } from 'react'
import useUser from '../hooks/useUser'
import UserProfile from './UserProfile'
import ProgressDashboard from './ProgressDashboard'

/**
 * Phase 1 feature test page
 * Tests user system and learning progress tracking
 */
export default function Phase1TestPage() {
  const {
    user,
    profile,
    stats,
    loading,
    error,
    createUser,
    loadUserData,
    recordProgress,
    isLoggedIn,
    logout
  } = useUser()

  const [activeTab, setActiveTab] = useState('test')
  const [testUserId, setTestUserId] = useState('')
  const [testResults, setTestResults] = useState([])

  const addTestResult = (test, success, message) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      message,
      timestamp: new Date().toLocaleTimeString()
    }])
  }

  // Test 1: Create test user
  const testCreateUser = async () => {
    try {
      const newUser = await createUser({
        nickname: `test_user_${Date.now()}`,
        grade: 'AS',
        targetUniversity: 'Cambridge'
      })
      setTestUserId(newUser.id)
      addTestResult('Create user', true, `User ID: ${newUser.id}`)
    } catch (err) {
      addTestResult('Create user', false, err.message)
    }
  }

  // Test 2: Load user data
  const testLoadUser = async () => {
    if (!testUserId) {
      addTestResult('Load user', false, 'Please create a user first')
      return
    }

    try {
      await loadUserData(testUserId)
      addTestResult('Load user', true, 'User data loaded successfully')
    } catch (err) {
      addTestResult('Load user', false, err.message)
    }
  }

  // Test 3: Record progress
  const testRecordProgress = async () => {
    if (!user) {
      addTestResult('Record progress', false, 'Please log in first')
      return
    }

    try {
      await recordProgress('e1c1', {
        status: 'in_progress',
        masteryLevel: 50,
        timeSpent: 600
      })
      addTestResult('Record progress', true, 'Progress recorded for chapter e1c1')
    } catch (err) {
      addTestResult('Record progress', false, err.message)
    }
  }

  // Test 4: Complete chapter
  const testCompleteChapter = async () => {
    if (!user) {
      addTestResult('Complete chapter', false, 'Please log in first')
      return
    }

    try {
      await recordProgress('e1c1', {
        status: 'completed',
        masteryLevel: 85,
        timeSpent: 300
      })
      addTestResult('Complete chapter', true, 'Chapter e1c1 marked as completed')
    } catch (err) {
      addTestResult('Complete chapter', false, err.message)
    }
  }

  // Run all tests sequentially
  const runAllTests = async () => {
    setTestResults([])
    await testCreateUser()
    await new Promise(resolve => setTimeout(resolve, 1000))
    await testLoadUser()
    await new Promise(resolve => setTimeout(resolve, 1000))
    await testRecordProgress()
    await new Promise(resolve => setTimeout(resolve, 1000))
    await testCompleteChapter()
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Phase 1 Feature Tests</h1>
        <p style={styles.subtitle}>User system + learning progress tracking</p>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('test')}
          style={{
            ...styles.tab,
            ...(activeTab === 'test' ? styles.tabActive : {})
          }}
        >
          Tests
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            ...styles.tab,
            ...(activeTab === 'profile' ? styles.tabActive : {})
          }}
        >
          My Profile
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          style={{
            ...styles.tab,
            ...(activeTab === 'progress' ? styles.tabActive : {})
          }}
        >
          Progress
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {activeTab === 'test' && (
          <div style={styles.testPanel}>
            {/* Current status */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Current Status</h3>
              <div style={styles.statusGrid}>
                <div style={styles.statusItem}>
                  <span style={styles.statusLabel}>Login:</span>
                  <span style={styles.statusValue}>
                    {isLoggedIn ? '✅ Logged in' : '❌ Not logged in'}
                  </span>
                </div>
                {user && (
                  <>
                    <div style={styles.statusItem}>
                      <span style={styles.statusLabel}>User ID:</span>
                      <span style={styles.statusValue}>{user.id}</span>
                    </div>
                    <div style={styles.statusItem}>
                      <span style={styles.statusLabel}>Nickname:</span>
                      <span style={styles.statusValue}>{user.nickname}</span>
                    </div>
                    <div style={styles.statusItem}>
                      <span style={styles.statusLabel}>Year:</span>
                      <span style={styles.statusValue}>{user.grade}</span>
                    </div>
                  </>
                )}
              </div>
              {isLoggedIn && (
                <button onClick={logout} style={styles.logoutButton}>
                  Log Out
                </button>
              )}
            </div>

            {/* Test buttons */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Test Actions</h3>
              <div style={styles.buttonGrid}>
                <button onClick={testCreateUser} style={styles.testButton} disabled={loading}>
                  1. Create test user
                </button>
                <button onClick={testLoadUser} style={styles.testButton} disabled={loading}>
                  2. Load user data
                </button>
                <button onClick={testRecordProgress} style={styles.testButton} disabled={loading}>
                  3. Record progress
                </button>
                <button onClick={testCompleteChapter} style={styles.testButton} disabled={loading}>
                  4. Complete chapter
                </button>
                <button onClick={runAllTests} style={styles.runAllButton} disabled={loading}>
                  🚀 Run all tests
                </button>
              </div>
            </div>

            {/* Test results */}
            {testResults.length > 0 && (
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Test Results</h3>
                <div style={styles.resultList}>
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      style={{
                        ...styles.resultItem,
                        borderLeftColor: result.success ? '#4CAF50' : '#F44336'
                      }}
                    >
                      <div style={styles.resultHeader}>
                        <span style={styles.resultIcon}>
                          {result.success ? '✅' : '❌'}
                        </span>
                        <span style={styles.resultTest}>{result.test}</span>
                        <span style={styles.resultTime}>{result.timestamp}</span>
                      </div>
                      <div style={styles.resultMessage}>{result.message}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setTestResults([])}
                  style={styles.clearButton}
                >
                  Clear results
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={styles.error}>
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Stats */}
            {stats && (
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Study Stats</h3>
                <div style={styles.statsGrid}>
                  <div style={styles.statItem}>
                    <div style={styles.statValue}>{Math.floor(stats.totalStudyTime / 60)}</div>
                    <div style={styles.statLabel}>Study time (min)</div>
                  </div>
                  <div style={styles.statItem}>
                    <div style={styles.statValue}>{stats.totalChaptersCompleted}</div>
                    <div style={styles.statLabel}>Chapters done</div>
                  </div>
                  <div style={styles.statItem}>
                    <div style={styles.statValue}>{stats.currentStreak}</div>
                    <div style={styles.statLabel}>Streak (days)</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && <UserProfile />}
        {activeTab === 'progress' && <ProgressDashboard />}
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#666'
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    borderBottom: '2px solid #f0f0f0'
  },
  tab: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    color: '#666',
    transition: 'all 0.2s'
  },
  tabActive: {
    color: '#4CAF50',
    borderBottomColor: '#4CAF50'
  },
  content: {
    minHeight: '400px'
  },
  testPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '24px'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#333'
  },
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '16px'
  },
  statusItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  statusLabel: {
    fontSize: '14px',
    color: '#999'
  },
  statusValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333'
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px'
  },
  testButton: {
    padding: '12px 16px',
    backgroundColor: '#2196F3',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  },
  runAllButton: {
    padding: '12px 16px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    gridColumn: '1 / -1'
  },
  resultList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px'
  },
  resultItem: {
    padding: '12px 16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    borderLeft: '4px solid'
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '4px'
  },
  resultIcon: {
    fontSize: '18px'
  },
  resultTest: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    flex: 1
  },
  resultTime: {
    fontSize: '12px',
    color: '#999'
  },
  resultMessage: {
    fontSize: '14px',
    color: '#666',
    marginLeft: '30px'
  },
  clearButton: {
    padding: '8px 16px',
    backgroundColor: '#f5f5f5',
    color: '#666',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px'
  },
  statItem: {
    textAlign: 'center',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '14px',
    color: '#666'
  },
  error: {
    padding: '12px 16px',
    backgroundColor: '#fee',
    color: '#c33',
    borderRadius: '8px',
    fontSize: '14px'
  }
}
