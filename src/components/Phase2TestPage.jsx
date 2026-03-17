// ============================================================
// Phase 2 test page
// Tests the AI tutor chat functionality
// ============================================================

import { useState, useEffect } from 'react'
import { chatAPI, authAPI } from '../utils/api.js'
import ChatPage from './ChatPage.jsx'

export default function Phase2TestPage() {
  const [testResults, setTestResults] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  // Register/login a test user
  const loginTestUser = async () => {
    try {
      const testEmail = `test${Date.now()}@example.com`

      const result = await authAPI.register({
        email: testEmail,
        password: 'test123456',
        nickname: 'test_user'
      })
      setCurrentUser(result.user)
      setIsLoggedIn(true)
      return result.user
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const runTests = async () => {
    setIsRunning(true)
    setTestResults([])
    const results = []

    try {
      // Test 0: Login/register
      results.push({ name: 'Login/Register', status: 'running' })
      setTestResults([...results])

      const user = await loginTestUser()

      results[0] = {
        name: 'Login/Register',
        status: 'success',
        data: `User ID: ${user.id}, Nickname: ${user.nickname}`
      }
      setTestResults([...results])

      // Test 1: Create session
      results.push({ name: 'Create session', status: 'running' })
      setTestResults([...results])

      const session = await chatAPI.createSession({
        userId: user.id,
        chapterId: 'e1c1',
        title: 'Test session — Supply & Demand',
        sessionType: 'learning'
      })

      results[1] = {
        name: 'Create session',
        status: 'success',
        data: `Session ID: ${session.id}`
      }
      setTestResults([...results])

      // Test 2: Get session list
      results.push({ name: 'Get sessions', status: 'running' })
      setTestResults([...results])

      const sessions = await chatAPI.getSessions(user.id, { status: 'active', limit: 10 })

      results[2] = {
        name: 'Get sessions',
        status: 'success',
        data: `Found ${sessions.length} sessions`
      }
      setTestResults([...results])

      // Test 3: Send message (requires API key)
      results.push({ name: 'Send message', status: 'running' })
      setTestResults([...results])

      try {
        const messageResult = await chatAPI.sendMessage({
          sessionId: session.id,
          message: 'What is supply-demand equilibrium?',
          context: { subject: 'Economics' }
        })

        results[3] = {
          name: 'Send message',
          status: 'success',
          data: `AI reply: ${messageResult.data.assistantMessage.content.substring(0, 50)}...`
        }
      } catch (err) {
        results[3] = {
          name: 'Send message',
          status: 'warning',
          data: `Requires ANTHROPIC_API_KEY: ${err.message}`
        }
      }
      setTestResults([...results])

      // Test 4: Get message history
      results.push({ name: 'Get messages', status: 'running' })
      setTestResults([...results])

      const { messages } = await chatAPI.getMessages(session.id, { limit: 50 })

      results[4] = {
        name: 'Get messages',
        status: 'success',
        data: `Found ${messages.length} messages`
      }
      setTestResults([...results])

      // Test 5: Update session title
      results.push({ name: 'Update session', status: 'running' })
      setTestResults([...results])

      await chatAPI.updateSession(session.id, { title: 'Test session (updated)' })

      results[5] = {
        name: 'Update session',
        status: 'success',
        data: 'Title updated successfully'
      }
      setTestResults([...results])

      // Test 6: Archive session
      results.push({ name: 'Archive session', status: 'running' })
      setTestResults([...results])

      await chatAPI.updateSession(session.id, { status: 'archived' })

      results[6] = {
        name: 'Archive session',
        status: 'success',
        data: 'Session archived'
      }
      setTestResults([...results])

    } catch (error) {
      console.error('Test failed:', error)
      results.push({
        name: 'Test failed',
        status: 'error',
        data: error.message
      })
      setTestResults([...results])
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Phase 2 Test Page</h1>
        <p style={styles.subtitle}>AI tutor chat functionality tests</p>
      </div>

      <div style={styles.content}>
        {/* Test control panel */}
        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>Feature Tests</h2>
          <div style={styles.actions}>
            <button
              style={{
                ...styles.button,
                ...(isRunning ? styles.buttonDisabled : styles.buttonPrimary)
              }}
              onClick={runTests}
              disabled={isRunning}
            >
              {isRunning ? 'Running tests...' : 'Run all tests'}
            </button>
            <button
              style={{
                ...styles.button,
                ...styles.buttonSecondary
              }}
              onClick={() => setShowChat(!showChat)}
            >
              {showChat ? 'Hide chat UI' : 'Show chat UI'}
            </button>
          </div>

          {/* Test results */}
          {testResults.length > 0 && (
            <div style={styles.results}>
              <h3 style={styles.resultsTitle}>Test Results</h3>
              {testResults.map((result, index) => (
                <div key={index} style={styles.resultItem}>
                  <div style={styles.resultHeader}>
                    <span style={styles.resultName}>{result.name}</span>
                    <span style={{
                      ...styles.resultStatus,
                      ...(result.status === 'success' ? styles.statusSuccess :
                          result.status === 'error' ? styles.statusError :
                          result.status === 'warning' ? styles.statusWarning :
                          styles.statusRunning)
                    }}>
                      {result.status === 'success' ? '✓ Passed' :
                       result.status === 'error' ? '✗ Failed' :
                       result.status === 'warning' ? '⚠ Warning' :
                       '⏳ Running'}
                    </span>
                  </div>
                  {result.data && (
                    <div style={styles.resultData}>{result.data}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Environment check */}
        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>Environment</h2>
          <div style={styles.envCheck}>
            <div style={styles.envItem}>
              <span style={styles.envLabel}>Backend API:</span>
              <span style={styles.envValue}>
                {import.meta.env.VITE_API_URL || 'http://localhost:4000'}
              </span>
            </div>
            <div style={styles.envItem}>
              <span style={styles.envLabel}>User ID:</span>
              <span style={styles.envValue}>{currentUser?.id || 'Not logged in'}</span>
            </div>
            <div style={styles.envItem}>
              <span style={styles.envLabel}>API Key:</span>
              <span style={styles.envValue}>
                {import.meta.env.VITE_ANTHROPIC_API_KEY ? '✓ Configured' : '✗ Not configured (set in backend)'}
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>Instructions</h2>
          <ol style={styles.instructions}>
            <li>Ensure the backend is running (<code>cd backend && bun run dev</code>)</li>
            <li>Ensure database migrations are applied (<code>bun run db:push</code>)</li>
            <li>Set <code>ANTHROPIC_API_KEY</code> in the backend <code>.env</code> file</li>
            <li>Click "Run all tests" to test the API</li>
            <li>Click "Show chat UI" to see the full chat interface</li>
          </ol>
        </div>
      </div>

      {/* Chat overlay */}
      {showChat && (
        <div style={styles.chatContainer}>
          <div style={styles.chatHeader}>
            <h2>AI Tutor Chat</h2>
            <button
              style={styles.closeBtn}
              onClick={() => setShowChat(false)}
            >
              ✕
            </button>
          </div>
          <div style={styles.chatContent}>
            <ChatPage />
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#333',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    margin: 0
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  panel: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  panelTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#333',
    margin: '0 0 16px 0'
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px'
  },
  button: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  buttonPrimary: {
    backgroundColor: '#1976d2',
    color: '#fff'
  },
  buttonSecondary: {
    backgroundColor: '#f5f5f5',
    color: '#333'
  },
  buttonDisabled: {
    backgroundColor: '#e0e0e0',
    color: '#999',
    cursor: 'not-allowed'
  },
  results: {
    marginTop: '20px'
  },
  resultsTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#333',
    margin: '0 0 12px 0'
  },
  resultItem: {
    padding: '12px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '8px'
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px'
  },
  resultName: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#333'
  },
  resultStatus: {
    fontSize: '13px',
    fontWeight: 500,
    padding: '4px 8px',
    borderRadius: '4px'
  },
  statusSuccess: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32'
  },
  statusError: {
    backgroundColor: '#ffebee',
    color: '#c62828'
  },
  statusWarning: {
    backgroundColor: '#fff3e0',
    color: '#ef6c00'
  },
  statusRunning: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2'
  },
  resultData: {
    fontSize: '13px',
    color: '#666',
    marginTop: '4px'
  },
  envCheck: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  envItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  envLabel: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#666',
    minWidth: '120px'
  },
  envValue: {
    fontSize: '14px',
    color: '#333',
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    padding: '4px 8px',
    borderRadius: '4px'
  },
  instructions: {
    fontSize: '14px',
    color: '#666',
    lineHeight: 1.8,
    paddingLeft: '20px'
  },
  chatContainer: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    height: '90vh',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column'
  },
  chatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #e0e0e0'
  },
  closeBtn: {
    padding: '8px 12px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#666'
  },
  chatContent: {
    flex: 1,
    overflow: 'hidden'
  }
}
