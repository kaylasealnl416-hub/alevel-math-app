import { createContext, useContext, useState, useEffect } from 'react'
import { API_BASE } from '../utils/constants'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore user from sessionStorage, or verify via httpOnly cookie
  useEffect(() => {
    const savedUser = sessionStorage.getItem('auth_user')

    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setLoading(false)
    } else {
      // No sessionStorage (e.g. new tab) — try cookie-based auth
      fetch(`${API_BASE}/api/auth/me`, { credentials: 'include' })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.success && data.data) {
            setUser(data.data)
            sessionStorage.setItem('auth_user', JSON.stringify(data.data))
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [])

  // Login (token is in httpOnly cookie, not accessible from JS)
  const login = (userData) => {
    setUser(userData)
    sessionStorage.setItem('auth_user', JSON.stringify(userData))
  }

  // Logout
  const logout = async () => {
    // Call backend logout to clear the cookie
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include' // include cookie
      })
    } catch (error) {
      console.error('Logout request failed:', error)
    }

    setUser(null)
    sessionStorage.removeItem('auth_user')
  }

  // Update user data
  const updateUser = (userData) => {
    setUser(userData)
    sessionStorage.setItem('auth_user', JSON.stringify(userData))
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
