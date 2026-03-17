import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * User state store — Zustand + localStorage persistence
 */
const useUserStore = create(
  persist(
    (set, get) => ({
      // ============================================================
      // State
      // ============================================================

      user: null,
      profile: null,
      stats: null,
      progress: {},   // chapter progress cache
      loading: false,
      error: null,

      // ============================================================
      // Actions
      // ============================================================

      setUser: (user) => set({ user, error: null }),

      setProfile: (profile) => set({ profile, error: null }),

      setStats: (stats) => set({ stats, error: null }),

      /** Update the cached progress for a single chapter */
      updateProgress: (chapterId, progressData) => set((state) => ({
        progress: {
          ...state.progress,
          [chapterId]: progressData
        }
      })),

      /** Replace the entire progress cache from an array */
      setProgress: (progressArray) => {
        const progressMap = {}
        progressArray.forEach(p => {
          progressMap[p.chapterId] = p
        })
        set({ progress: progressMap })
      },

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error, loading: false }),

      clearError: () => set({ error: null }),

      /** Clear all user data on logout */
      logout: () => set({
        user: null,
        profile: null,
        stats: null,
        progress: {},
        loading: false,
        error: null
      }),

      getChapterProgress: (chapterId) => {
        const state = get()
        return state.progress[chapterId] || null
      },

      isLoggedIn: () => {
        const state = get()
        return state.user !== null
      },

      getUserId: () => {
        const state = get()
        return state.user?.id || null
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        profile: state.profile,
        stats: state.stats,
        progress: state.progress
      })
    }
  )
)

export default useUserStore
