import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * 用户状态管理 Store
 * 使用 Zustand + localStorage 持久化
 */
const useUserStore = create(
  persist(
    (set, get) => ({
      // ============================================================
      // 状态
      // ============================================================

      // 当前用户信息
      user: null,

      // 用户画像
      profile: null,

      // 用户统计
      stats: null,

      // 学习进度（缓存）
      progress: {},

      // 加载状态
      loading: false,

      // 错误信息
      error: null,

      // ============================================================
      // Actions
      // ============================================================

      /**
       * 设置当前用户
       */
      setUser: (user) => set({ user, error: null }),

      /**
       * 设置用户画像
       */
      setProfile: (profile) => set({ profile, error: null }),

      /**
       * 设置用户统计
       */
      setStats: (stats) => set({ stats, error: null }),

      /**
       * 更新学习进度缓存
       */
      updateProgress: (chapterId, progressData) => set((state) => ({
        progress: {
          ...state.progress,
          [chapterId]: progressData
        }
      })),

      /**
       * 批量设置学习进度
       */
      setProgress: (progressArray) => {
        const progressMap = {}
        progressArray.forEach(p => {
          progressMap[p.chapterId] = p
        })
        set({ progress: progressMap })
      },

      /**
       * 设置加载状态
       */
      setLoading: (loading) => set({ loading }),

      /**
       * 设置错误信息
       */
      setError: (error) => set({ error, loading: false }),

      /**
       * 清除错误
       */
      clearError: () => set({ error: null }),

      /**
       * 登出（清除所有数据）
       */
      logout: () => set({
        user: null,
        profile: null,
        stats: null,
        progress: {},
        loading: false,
        error: null
      }),

      /**
       * 获取章节进度
       */
      getChapterProgress: (chapterId) => {
        const state = get()
        return state.progress[chapterId] || null
      },

      /**
       * 检查是否已登录
       */
      isLoggedIn: () => {
        const state = get()
        return state.user !== null
      },

      /**
       * 获取用户ID
       */
      getUserId: () => {
        const state = get()
        return state.user?.id || null
      }
    }),
    {
      name: 'user-storage', // localStorage key
      partialize: (state) => ({
        // 只持久化这些字段
        user: state.user,
        profile: state.profile,
        stats: state.stats,
        progress: state.progress
      })
    }
  )
)

export default useUserStore
