// ============================================================
// Shared Utility Functions
// ============================================================

/**
 * Format seconds as a timer string.
 * With hours: 1:02:03 — without: 5:09
 * @param {number|null} seconds
 * @returns {string}
 */
export function formatDuration(seconds) {
  if (seconds === null || seconds === undefined) return ''
  if (!seconds && seconds !== 0) return '-'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Format a timestamp as HH:MM (used in chat message bubbles).
 * @param {string|Date} ts
 * @returns {string}
 */
export function formatClockTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Format a timestamp as relative time (used in session sidebar).
 * @param {string|Date} ts
 * @returns {string}
 */
export function formatRelativeTime(ts) {
  if (!ts) return ''
  const diff = Date.now() - new Date(ts)
  if (diff < 60000)    return 'Just now'
  if (diff < 3600000)  return Math.floor(diff / 60000) + 'm ago'
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago'
  if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago'
  return new Date(ts).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
}

/**
 * Format a date string as a readable date.
 * @param {string} dateString
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Difficulty level → label text + colour.
 * @param {number} difficulty  1–5
 * @returns {{ text: string, color: string }}
 */
export function getDifficultyInfo(difficulty) {
  const map = {
    1: { text: 'Very Easy', color: '#188038' },
    2: { text: 'Easy',      color: '#1a73e8' },
    3: { text: 'Medium',    color: '#F59E0B' },
    4: { text: 'Hard',      color: '#d93025' },
    5: { text: 'Very Hard', color: '#991B1B' },
  }
  return map[difficulty] || map[3]
}

/**
 * Difficulty level → label text only (backwards-compatible helper).
 * @param {number} difficulty
 * @returns {string}
 */
export function getDifficultyLabel(difficulty) {
  return getDifficultyInfo(difficulty).text
}

// ============================================================
// AI 免费额度追踪
// ============================================================

const FREE_AI_KEY = 'ai_free_usage_count'
const FREE_AI_DISMISS_KEY = 'ai_reminder_dismissed_at'
const FREE_USAGE_THRESHOLD = 2
const DISMISS_COOLDOWN_MS = 24 * 60 * 60 * 1000 // 24 小时

/**
 * 记录一次使用服务端 AI（没有用户自己的 key）
 */
export function trackFreeAIUsage() {
  const count = parseInt(localStorage.getItem(FREE_AI_KEY) || '0', 10)
  localStorage.setItem(FREE_AI_KEY, String(count + 1))
}

/**
 * 是否应该提醒用户配置自己的 API Key
 * 条件：使用次数 > 阈值，且距上次关闭提醒已过 24 小时
 */
export function shouldRemindAPIKey() {
  const count = parseInt(localStorage.getItem(FREE_AI_KEY) || '0', 10)
  if (count <= FREE_USAGE_THRESHOLD) return false

  const dismissed = parseInt(localStorage.getItem(FREE_AI_DISMISS_KEY) || '0', 10)
  return Date.now() - dismissed > DISMISS_COOLDOWN_MS
}

/**
 * 用户关闭了提醒，记录时间
 */
export function dismissAPIKeyReminder() {
  localStorage.setItem(FREE_AI_DISMISS_KEY, String(Date.now()))
}
