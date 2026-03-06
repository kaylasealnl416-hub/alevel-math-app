import { useEffect, useCallback } from 'react'
import useUserStore from '../stores/userStore'
import { usersAPI, progressAPI } from '../utils/api'

/**
 * 用户数据管理 Hook
 * 提供用户信息、画像、统计、进度的获取和更新功能
 */
export function useUser() {
  const {
    user,
    profile,
    stats,
    progress,
    loading,
    error,
    setUser,
    setProfile,
    setStats,
    setProgress,
    updateProgress,
    setLoading,
    setError,
    clearError,
    logout,
    isLoggedIn,
    getUserId,
    getChapterProgress
  } = useUserStore()

  /**
   * 加载用户完整信息
   */
  const loadUserData = useCallback(async (userId) => {
    if (!userId) return

    setLoading(true)
    clearError()

    try {
      // 并行加载用户信息、画像、统计、进度
      const [userData, profileData, statsData, progressData] = await Promise.all([
        usersAPI.getById(userId),
        usersAPI.getProfile(userId),
        usersAPI.getStats(userId),
        progressAPI.getAll(userId)
      ])

      setUser(userData)
      setProfile(profileData)
      setStats(statsData)
      setProgress(progressData)
    } catch (err) {
      console.error('加载用户数据失败:', err)
      setError(err.message || '加载用户数据失败')
    } finally {
      setLoading(false)
    }
  }, [setUser, setProfile, setStats, setProgress, setLoading, setError, clearError])

  /**
   * 更新用户信息
   */
  const updateUser = useCallback(async (userId, userData) => {
    setLoading(true)
    clearError()

    try {
      const updated = await usersAPI.update(userId, userData)
      setUser(updated)
      return updated
    } catch (err) {
      console.error('更新用户信息失败:', err)
      setError(err.message || '更新用户信息失败')
      throw err
    } finally {
      setLoading(false)
    }
  }, [setUser, setLoading, setError, clearError])

  /**
   * 更新用户画像
   */
  const updateUserProfile = useCallback(async (userId, profileData) => {
    setLoading(true)
    clearError()

    try {
      const updated = await usersAPI.updateProfile(userId, profileData)
      setProfile(updated)
      return updated
    } catch (err) {
      console.error('更新用户画像失败:', err)
      setError(err.message || '更新用户画像失败')
      throw err
    } finally {
      setLoading(false)
    }
  }, [setProfile, setLoading, setError, clearError])

  /**
   * 记录学习进度
   */
  const recordProgress = useCallback(async (chapterId, progressData) => {
    const userId = getUserId()
    if (!userId) {
      setError('用户未登录')
      return
    }

    try {
      const updated = await progressAPI.update({
        userId,
        chapterId,
        ...progressData
      })

      // 更新本地缓存
      updateProgress(chapterId, updated)

      // 如果章节完成，刷新统计数据
      if (progressData.status === 'completed') {
        const newStats = await usersAPI.getStats(userId)
        setStats(newStats)
      }

      return updated
    } catch (err) {
      console.error('记录学习进度失败:', err)
      setError(err.message || '记录学习进度失败')
      throw err
    }
  }, [getUserId, updateProgress, setStats, setError])

  /**
   * 获取章节进度
   */
  const getProgress = useCallback(async (chapterId) => {
    const userId = getUserId()
    if (!userId) return null

    // 先从缓存获取
    const cached = getChapterProgress(chapterId)
    if (cached) return cached

    // 缓存未命中，从服务器获取
    try {
      const data = await progressAPI.getByChapter(userId, chapterId)
      if (data) {
        updateProgress(chapterId, data)
      }
      return data
    } catch (err) {
      console.error('获取章节进度失败:', err)
      return null
    }
  }, [getUserId, getChapterProgress, updateProgress])

  /**
   * 刷新统计数据
   */
  const refreshStats = useCallback(async () => {
    const userId = getUserId()
    if (!userId) return

    try {
      const statsData = await usersAPI.getStats(userId)
      setStats(statsData)
      return statsData
    } catch (err) {
      console.error('刷新统计数据失败:', err)
      setError(err.message || '刷新统计数据失败')
      throw err
    }
  }, [getUserId, setStats, setError])

  /**
   * 创建新用户（用于测试）
   */
  const createUser = useCallback(async (userData) => {
    setLoading(true)
    clearError()

    try {
      const newUser = await usersAPI.create(userData)
      setUser(newUser)

      // 加载完整数据
      await loadUserData(newUser.id)

      return newUser
    } catch (err) {
      console.error('创建用户失败:', err)
      setError(err.message || '创建用户失败')
      throw err
    } finally {
      setLoading(false)
    }
  }, [setUser, loadUserData, setLoading, setError, clearError])

  return {
    // 状态
    user,
    profile,
    stats,
    progress,
    loading,
    error,

    // 方法
    loadUserData,
    updateUser,
    updateUserProfile,
    recordProgress,
    getProgress,
    refreshStats,
    createUser,
    logout,
    clearError,

    // 辅助方法
    isLoggedIn: isLoggedIn(),
    userId: getUserId()
  }
}

export default useUser
