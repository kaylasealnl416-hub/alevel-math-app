import { useEffect, useCallback } from 'react'
import useUserStore from '../stores/userStore'
import { usersAPI, progressAPI } from '../utils/api'

/**
 * User data management hook.
 * Provides fetch and update actions for user info, profile, stats, and progress.
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
   * Load full user data in parallel
   */
  const loadUserData = useCallback(async (userId) => {
    if (!userId) return

    setLoading(true)
    clearError()

    try {
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
      console.error('Failed to load user data:', err)
      setError(err.message || 'Failed to load user data')
    } finally {
      setLoading(false)
    }
  }, [setUser, setProfile, setStats, setProgress, setLoading, setError, clearError])

  /**
   * Update user info
   */
  const updateUser = useCallback(async (userId, userData) => {
    setLoading(true)
    clearError()

    try {
      const updated = await usersAPI.update(userId, userData)
      setUser(updated)
      return updated
    } catch (err) {
      console.error('Failed to update user:', err)
      setError(err.message || 'Failed to update user')
      throw err
    } finally {
      setLoading(false)
    }
  }, [setUser, setLoading, setError, clearError])

  /**
   * Update user profile
   */
  const updateUserProfile = useCallback(async (userId, profileData) => {
    setLoading(true)
    clearError()

    try {
      const updated = await usersAPI.updateProfile(userId, profileData)
      setProfile(updated)
      return updated
    } catch (err) {
      console.error('Failed to update profile:', err)
      setError(err.message || 'Failed to update profile')
      throw err
    } finally {
      setLoading(false)
    }
  }, [setProfile, setLoading, setError, clearError])

  /**
   * Record study progress for a chapter
   */
  const recordProgress = useCallback(async (chapterId, progressData) => {
    const userId = getUserId()
    if (!userId) {
      setError('Not logged in')
      return
    }

    try {
      const updated = await progressAPI.update({
        userId,
        chapterId,
        ...progressData
      })

      updateProgress(chapterId, updated)

      // Refresh stats when a chapter is completed
      if (progressData.status === 'completed') {
        const newStats = await usersAPI.getStats(userId)
        setStats(newStats)
      }

      return updated
    } catch (err) {
      console.error('Failed to record progress:', err)
      setError(err.message || 'Failed to record progress')
      throw err
    }
  }, [getUserId, updateProgress, setStats, setError])

  /**
   * Get progress for a chapter (cache-first)
   */
  const getProgress = useCallback(async (chapterId) => {
    const userId = getUserId()
    if (!userId) return null

    const cached = getChapterProgress(chapterId)
    if (cached) return cached

    try {
      const data = await progressAPI.getByChapter(userId, chapterId)
      if (data) {
        updateProgress(chapterId, data)
      }
      return data
    } catch (err) {
      console.error('Failed to get chapter progress:', err)
      return null
    }
  }, [getUserId, getChapterProgress, updateProgress])

  /**
   * Refresh stats from the server
   */
  const refreshStats = useCallback(async () => {
    const userId = getUserId()
    if (!userId) return

    try {
      const statsData = await usersAPI.getStats(userId)
      setStats(statsData)
      return statsData
    } catch (err) {
      console.error('Failed to refresh stats:', err)
      setError(err.message || 'Failed to refresh stats')
      throw err
    }
  }, [getUserId, setStats, setError])

  /**
   * Create a new user (used in tests)
   */
  const createUser = useCallback(async (userData) => {
    setLoading(true)
    clearError()

    try {
      const newUser = await usersAPI.create(userData)
      setUser(newUser)
      await loadUserData(newUser.id)
      return newUser
    } catch (err) {
      console.error('Failed to create user:', err)
      setError(err.message || 'Failed to create user')
      throw err
    } finally {
      setLoading(false)
    }
  }, [setUser, loadUserData, setLoading, setError, clearError])

  return {
    // State
    user,
    profile,
    stats,
    progress,
    loading,
    error,

    // Actions
    loadUserData,
    updateUser,
    updateUserProfile,
    recordProgress,
    getProgress,
    refreshStats,
    createUser,
    logout,
    clearError,

    // Helpers
    isLoggedIn: isLoggedIn(),
    userId: getUserId()
  }
}

export default useUser
