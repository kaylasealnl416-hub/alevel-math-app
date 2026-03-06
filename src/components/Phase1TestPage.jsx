import { useState, useEffect } from 'react'
import useUser from '../hooks/useUser'
import UserProfile from './UserProfile'
import ProgressDashboard from './ProgressDashboard'

/**
 * Phase 1 功能测试页面
 * 用于测试用户系统和学习进度追踪功能
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

  // 添加测试结果
  const addTestResult = (test, success, message) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      message,
      timestamp: new Date().toLocaleTimeString()
    }])
  }

  // 测试1：创建测试用户
  const testCreateUser = async () => {
    try {
      const newUser = await createUser({
        nickname: `测试用户_${Date.now()}`,
        grade: 'AS',
        targetUniversity: 'Cambridge'
      })
      setTestUserId(newUser.id)
      addTestResult('创建用户', true, `用户ID: ${newUser.id}`)
    } catch (err) {
      addTestResult('创建用户', false, err.message)
    }
  }

  // 测试2：加载用户数据
  const testLoadUser = async () => {
    if (!testUserId) {
      addTestResult('加载用户', false, '请先创建用户')
      return
    }

    try {
      await loadUserData(testUserId)
      addTestResult('加载用户', true, '用户数据加载成功')
    } catch (err) {
      addTestResult('加载用户', false, err.message)
    }
  }

  // 测试3：记录学习进度
  const testRecordProgress = async () => {
    if (!user) {
      addTestResult('记录进度', false, '请先登录')
      return
    }

    try {
      await recordProgress('e1c1', {
        status: 'in_progress',
        masteryLevel: 50,
        timeSpent: 600
      })
      addTestResult('记录进度', true, '章节 e1c1 进度已记录')
    } catch (err) {
      addTestResult('记录进度', false, err.message)
    }
  }

  // 测试4：完成章节
  const testCompleteChapter = async () => {
    if (!user) {
      addTestResult('完成章节', false, '请先登录')
      return
    }

    try {
      await recordProgress('e1c1', {
        status: 'completed',
        masteryLevel: 85,
        timeSpent: 300
      })
      addTestResult('完成章节', true, '章节 e1c1 已完成')
    } catch (err) {
      addTestResult('完成章节', false, err.message)
    }
  }

  // 运行所有测试
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
        <h1 style={styles.title}>Phase 1 功能测试</h1>
        <p style={styles.subtitle}>用户系统 + 学习进度追踪</p>
      </div>

      {/* 标签页 */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('test')}
          style={{
            ...styles.tab,
            ...(activeTab === 'test' ? styles.tabActive : {})
          }}
        >
          功能测试
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            ...styles.tab,
            ...(activeTab === 'profile' ? styles.tabActive : {})
          }}
        >
          个人中心
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          style={{
            ...styles.tab,
            ...(activeTab === 'progress' ? styles.tabActive : {})
          }}
        >
          学习进度
        </button>
      </div>

      {/* 内容区域 */}
      <div style={styles.content}>
        {activeTab === 'test' && (
          <div style={styles.testPanel}>
            {/* 用户状态 */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>当前状态</h3>
              <div style={styles.statusGrid}>
                <div style={styles.statusItem}>
                  <span style={styles.statusLabel}>登录状态:</span>
                  <span style={styles.statusValue}>
                    {isLoggedIn ? '✅ 已登录' : '❌ 未登录'}
                  </span>
                </div>
                {user && (
                  <>
                    <div style={styles.statusItem}>
                      <span style={styles.statusLabel}>用户ID:</span>
                      <span style={styles.statusValue}>{user.id}</span>
                    </div>
                    <div style={styles.statusItem}>
                      <span style={styles.statusLabel}>昵称:</span>
                      <span style={styles.statusValue}>{user.nickname}</span>
                    </div>
                    <div style={styles.statusItem}>
                      <span style={styles.statusLabel}>年级:</span>
                      <span style={styles.statusValue}>{user.grade}</span>
                    </div>
                  </>
                )}
              </div>
              {isLoggedIn && (
                <button onClick={logout} style={styles.logoutButton}>
                  登出
                </button>
              )}
            </div>

            {/* 测试按钮 */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>测试操作</h3>
              <div style={styles.buttonGrid}>
                <button onClick={testCreateUser} style={styles.testButton} disabled={loading}>
                  1. 创建测试用户
                </button>
                <button onClick={testLoadUser} style={styles.testButton} disabled={loading}>
                  2. 加载用户数据
                </button>
                <button onClick={testRecordProgress} style={styles.testButton} disabled={loading}>
                  3. 记录学习进度
                </button>
                <button onClick={testCompleteChapter} style={styles.testButton} disabled={loading}>
                  4. 完成章节
                </button>
                <button onClick={runAllTests} style={styles.runAllButton} disabled={loading}>
                  🚀 运行所有测试
                </button>
              </div>
            </div>

            {/* 测试结果 */}
            {testResults.length > 0 && (
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>测试结果</h3>
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
                  清除结果
                </button>
              </div>
            )}

            {/* 错误提示 */}
            {error && (
              <div style={styles.error}>
                <strong>错误:</strong> {error}
              </div>
            )}

            {/* 统计数据 */}
            {stats && (
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>学习统计</h3>
                <div style={styles.statsGrid}>
                  <div style={styles.statItem}>
                    <div style={styles.statValue}>{Math.floor(stats.totalStudyTime / 60)}</div>
                    <div style={styles.statLabel}>学习时长（分钟）</div>
                  </div>
                  <div style={styles.statItem}>
                    <div style={styles.statValue}>{stats.totalChaptersCompleted}</div>
                    <div style={styles.statLabel}>完成章节</div>
                  </div>
                  <div style={styles.statItem}>
                    <div style={styles.statValue}>{stats.currentStreak}</div>
                    <div style={styles.statLabel}>连续学习（天）</div>
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

// 样式
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
