import { createContext, useContext, useState, useEffect } from 'react'
import { API_BASE } from '../utils/constants'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 初始化：从 sessionStorage 恢复用户信息（不存储 Token）
  useEffect(() => {
    const savedUser = sessionStorage.getItem('auth_user')

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  // 登录（Token 存储在 httpOnly Cookie 中，前端不可访问）
  const login = (userData) => {
    setUser(userData)
    sessionStorage.setItem('auth_user', JSON.stringify(userData))
  }

  // 登出
  const logout = async () => {
    // 调用后端登出 API 清除 Cookie
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include' // 发送 Cookie
      })
    } catch (error) {
      console.error('登出请求失败:', error)
    }

    setUser(null)
    sessionStorage.removeItem('auth_user')
  }

  // 更新用户信息
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
