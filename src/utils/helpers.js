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
    1: { text: 'Very Easy', color: '#10B981' },
    2: { text: 'Easy',      color: '#3B82F6' },
    3: { text: 'Medium',    color: '#F59E0B' },
    4: { text: 'Hard',      color: '#EF4444' },
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
