import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.spinner}></div>
        <p style={styles.text}>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.spinner}></div>
        <p style={styles.text}>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'admin') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', border: '1px solid #dadce0', borderRadius: 8, padding: 32, textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#202124', margin: '0 0 8px' }}>Admin Only</h2>
          <p style={{ fontSize: 14, color: '#5f6368', margin: '0 0 20px' }}>This page requires administrator privileges.</p>
          <a href="/" style={{ color: '#1a73e8', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>Back to Home</a>
        </div>
      </div>
    )
  }

  return children
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f7fafc'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #1a73e8',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  text: {
    marginTop: '16px',
    color: '#718096',
    fontSize: '14px'
  }
}
