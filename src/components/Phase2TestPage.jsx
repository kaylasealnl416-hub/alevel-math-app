// ============================================================
// Phase 2 测试页面
// 用于测试 AI 教师对话功能
// ============================================================

import { useState, useEffect } from 'react'
import { chatAPI } from '../utils/api.js'
import ChatPage from './ChatPage.jsx'

export default function Phase2TestPage() {
  const [testResults, setTestResults] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [userId] = useState(1) // 测试用户ID

  // 测试函数
  const runTests = async () => {
    setIsRunning(true)
    setTestResults([])
    const results = []

    try {
      // 测试 1: 创建会话
      results.push({ name: '创建会话', status: 'running' })
      setTestResults([...results])

      const session = await chatAPI.createSession({
        userId,
        chapterId: 'e1c1',
        title: '测试会话 - 供需理论',
        sessionType: 'learning'
      })

      results[0] = {
        name: '创建会话',
        status: 'success',
        data: `会话ID: ${session.id}`
      }
      setTestResults([...results])

      // 测试 2: 获取会话列表
      results.push({ name: '获取会话列表', status: 'running' })
      setTestResults([...results])

      const sessions = await chatAPI.getSessions(userId, { status: 'active', limit: 10 })

      results[1] = {
        name: '获取会话列表',
        status: 'success',
        data: `找到 ${sessions.length} 个会话`
      }
      setTestResults([...results])

      // 测试 3: 发送消息（需要配置 API Key）
      results.push({ name: '发送消息', status: 'running' })
      setTestResults([...results])

      try {
        const messageResult = await chatAPI.sendMessage({
          sessionId: session.id,
          message: '什么是供需平衡？',
          context: { subject: '经济学' }
        })

        results[2] = {
          name: '发送消息',
          status: 'success',
          data: `AI 回复: ${messageResult.data.assistantMessage.content.substring(0, 50)}...`
        }
      } catch (err) {
        results[2] = {
          name: '发送消息',
          status: 'warning',
          data: `需要配置 ANTHROPIC_API_KEY: ${err.message}`
        }
      }
      setTestResults([...results])

      // 测试 4: 获取消息历史
      results.push({ name: '获取消息历史', status: 'running' })
      setTestResults([...results])

      const { messages } = await chatAPI.getMessages(session.id, { limit: 50 })

      results[3] = {
        name: '获取消息历史',
        status: 'success',
        data: `找到 ${messages.length} 条消息`
      }
      setTestResults([...results])

      // 测试 5: 更新会话标题
      results.push({ name: '更新会话标题', status: 'running' })
      setTestResults([...results])

      await chatAPI.updateSession(session.id, { title: '测试会话（已更新）' })

      results[4] = {
        name: '更新会话标题',
        status: 'success',
        data: '标题更新成功'
      }
      setTestResults([...results])

      // 测试 6: 归档会话
      results.push({ name: '归档会话', status: 'running' })
      setTestResults([...results])

      await chatAPI.updateSession(session.id, { status: 'archived' })

      results[5] = {
        name: '归档会话',
        status: 'success',
        data: '会话已归档'
      }
      setTestResults([...results])

    } catch (error) {
      console.error('测试失败:', error)
      results.push({
        name: '测试失败',
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
        <h1 style={styles.title}>Phase 2 测试页面</h1>
        <p style={styles.subtitle}>AI 教师对话功能测试</p>
      </div>

      <div style={styles.content}>
        {/* 测试控制面板 */}
        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>功能测试</h2>
          <div style={styles.actions}>
            <button
              style={{
                ...styles.button,
                ...(isRunning ? styles.buttonDisabled : styles.buttonPrimary)
              }}
              onClick={runTests}
              disabled={isRunning}
            >
              {isRunning ? '测试运行中...' : '运行所有测试'}
            </button>
            <button
              style={{
                ...styles.button,
                ...styles.buttonSecondary
              }}
              onClick={() => setShowChat(!showChat)}
            >
              {showChat ? '隐藏聊天界面' : '显示聊天界面'}
            </button>
          </div>

          {/* 测试结果 */}
          {testResults.length > 0 && (
            <div style={styles.results}>
              <h3 style={styles.resultsTitle}>测试结果</h3>
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
                      {result.status === 'success' ? '✓ 成功' :
                       result.status === 'error' ? '✗ 失败' :
                       result.status === 'warning' ? '⚠ 警告' :
                       '⏳ 运行中'}
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

        {/* 环境检查 */}
        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>环境检查</h2>
          <div style={styles.envCheck}>
            <div style={styles.envItem}>
              <span style={styles.envLabel}>后端 API:</span>
              <span style={styles.envValue}>
                {import.meta.env.VITE_API_URL || 'http://localhost:4000'}
              </span>
            </div>
            <div style={styles.envItem}>
              <span style={styles.envLabel}>用户 ID:</span>
              <span style={styles.envValue}>{userId}</span>
            </div>
            <div style={styles.envItem}>
              <span style={styles.envLabel}>API Key 配置:</span>
              <span style={styles.envVue}>
                {process.env.ANTHROPIC_API_KEY ? '✓ 已配置' : '✗ 未配置'}
              </span>
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>使用说明</h2>
          <ol style={styles.instructions}>
            <li>确保后端服务已启动（<code>cd backend && bun run dev</code>）</li>
            <li>确保数据库迁移已执行（<code>bun run db:push</code>）</li>
            <li>配置后端 <code>.env</code> 文件中的 <code>ANTHROPIC_API_KEY</code></li>
            <li>点击"运行所有测试"按钮测试 API 功能</li>
            <li>点击"显示聊天界面"查看完整的聊天 UI</li>
          </ol>
        </div>
      </div>

      {/* 聊天界面 */}
      {showChat && (
        <div style={styles.chatContainer}>
          <div style={styles.chatHeader}>
            <h2>AI 教师聊天界面</h2>
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
