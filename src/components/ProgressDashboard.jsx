import { useState, useEffect } from 'react'
import useUser from '../hooks/useUser'

/**
 * Learning progress visualisation component
 * Shows progress dashboard, chapter completion status, and study time stats
 */
export default function ProgressDashboard() {
  const {
    user,
    stats,
    progress,
    loading,
    error,
    refreshStats,
    isLoggedIn
  } = useUser()

  const [progressByStatus, setProgressByStatus] = useState({
    not_started: 0,
    in_progress: 0,
    completed: 0
  })

  useEffect(() => {
    if (progress) {
      const progressArray = Object.values(progress)
      const counts = {
        not_started: 0,
        in_progress: 0,
        completed: 0
      }

      progressArray.forEach(p => {
        if (counts.hasOwnProperty(p.status)) {
          counts[p.status]++
        }
      })

      setProgressByStatus(counts)
    }
  }, [progress])

  const totalChapters = progressByStatus.not_started + progressByStatus.in_progress + progressByStatus.completed
  const completionRate = totalChapters > 0 ? Math.round((progressByStatus.completed / totalChapters) * 100) : 0

  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Learning Progress</h2>
          <p style={styles.notLoggedIn}>Please log in to view your progress</p>
        </div>
      </div>
    )
  }

  if (loading && !stats) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.loading}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* Overall progress card */}
      <div style={styles.card}>
        <h2 style={styles.title}>Progress Overview</h2>

        {/* Progress ring */}
        <div style={styles.progressRing}>
          <svg width="200" height="200" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#f0f0f0"
              strokeWidth="20"
            />
            {/* Progress arc */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#4CAF50"
              strokeWidth="20"
              strokeDasharray={`${completionRate * 5.03} 503`}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
            {/* Percentage text */}
            <text
              x="100"
              y="100"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="36"
              fontWeight="bold"
              fill="#333"
            >
              {completionRate}%
            </text>
            <text
              x="100"
              y="130"
              textAnchor="middle"
              fontSize="14"
              fill="#999"
            >
              Complete
            </text>
          </svg>
        </div>

        {/* Progress stats */}
        <div style={styles.statsRow}>
          <div style={styles.statItem}>
            <div style={{...styles.statDot, backgroundColor: '#4CAF50'}}></div>
            <div>
              <div style={styles.statValue}>{progressByStatus.completed}</div>
              <div style={styles.statLabel}>Completed</div>
            </div>
          </div>
          <div style={styles.statItem}>
            <div style={{...styles.statDot, backgroundColor: '#FF9800'}}></div>
            <div>
              <div style={styles.statValue}>{progressByStatus.in_progress}</div>
              <div style={styles.statLabel}>In Progress</div>
            </div>
          </div>
          <div style={styles.statItem}>
            <div style={{...styles.statDot, backgroundColor: '#E0E0E0'}}></div>
            <div>
              <div style={styles.statValue}>{progressByStatus.not_started}</div>
              <div style={styles.statLabel}>Not Started</div>
            </div>
          </div>
        </div>
      </div>

      {/* Study stats card */}
      {stats && (
        <div style={styles.card}>
          <h3 style={styles.subtitle}>Study Statistics</h3>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>⏱️</div>
              <div style={styles.statCardValue}>{formatTime(stats.totalStudyTime)}</div>
              <div style={styles.statCardLabel}>Total Study Time</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>📚</div>
              <div style={styles.statCardValue}>{stats.totalChaptersCompleted}</div>
              <div style={styles.statCardLabel}>Chapters Done</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🔥</div>
              <div style={styles.statCardValue}>{stats.currentStreak}</div>
              <div style={styles.statCardLabel}>Current Streak (days)</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🏆</div>
              <div style={styles.statCardValue}>{stats.longestStreak}</div>
              <div style={styles.statCardLabel}>Best Streak (days)</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent chapters */}
      {progress && Object.keys(progress).length > 0 && (
        <div style={styles.card}>
          <h3 style={styles.subtitle}>Recent Activity</h3>
          <div style={styles.chapterList}>
            {Object.values(progress)
              .sort((a, b) => new Date(b.lastReviewedAt) - new Date(a.lastReviewedAt))
              .slice(0, 5)
              .map(p => (
                <div key={p.chapterId} style={styles.chapterItem}>
                  <div style={styles.chapterInfo}>
                    <div style={styles.chapterTitle}>{p.chapterId}</div>
                    <div style={styles.chapterMeta}>
                      <span style={styles.chapterStatus}>
                        {getStatusText(p.status)}
                      </span>
                      <span style={styles.chapterTime}>
                        {formatTime(p.timeSpent)}
                      </span>
                    </div>
                  </div>
                  <div style={styles.masteryBar}>
                    <div
                      style={{
                        ...styles.masteryFill,
                        width: `${p.masteryLevel}%`,
                        backgroundColor: getMasteryColor(p.masteryLevel)
                      }}
                    ></div>
                  </div>
                  <div style={styles.masteryText}>{p.masteryLevel}% mastery</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Refresh button */}
      <div style={styles.actions}>
        <button
          onClick={refreshStats}
          disabled={loading}
          style={styles.refreshButton}
        >
          {loading ? 'Refreshing...' : '🔄 Refresh'}
        </button>
      </div>
    </div>
  )
}

function formatTime(seconds) {
  if (!seconds) return '0 min'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h${minutes > 0 ? ' ' + minutes + 'm' : ''}`
  }
  return `${minutes} min`
}

function getStatusText(status) {
  const statusMap = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    completed: 'Completed'
  }
  return statusMap[status] || status
}

function getMasteryColor(level) {
  if (level >= 80) return '#4CAF50'
  if (level >= 60) return '#8BC34A'
  if (level >= 40) return '#FF9800'
  return '#F44336'
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '24px',
    marginBottom: '20px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px',
    color: '#333',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#555'
  },
  progressRing: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '32px'
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '20px',
    flexWrap: 'wrap'
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  statDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333'
  },
  statLabel: {
    fontSize: '14px',
    color: '#999'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  statCard: {
    padding: '24px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    textAlign: 'center',
    transition: 'transform 0.2s',
    cursor: 'default'
  },
  statIcon: {
    fontSize: '32px',
    marginBottom: '12px'
  },
  statCardValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px'
  },
  statCardLabel: {
    fontSize: '14px',
    color: '#666'
  },
  chapterList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  chapterItem: {
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e0e0e0'
  },
  chapterInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  chapterTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333'
  },
  chapterMeta: {
    display: 'flex',
    gap: '12px',
    fontSize: '14px'
  },
  chapterStatus: {
    padding: '4px 8px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    color: '#666'
  },
  chapterTime: {
    color: '#999'
  },
  masteryBar: {
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px'
  },
  masteryFill: {
    height: '100%',
    transition: 'width 0.3s ease'
  },
  masteryText: {
    fontSize: '12px',
    color: '#999',
    textAlign: 'right'
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px'
  },
  refreshButton: {
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  },
  error: {
    padding: '12px 16px',
    backgroundColor: '#fee',
    color: '#c33',
    borderRadius: '6px',
    marginBottom: '16px'
  },
  notLoggedIn: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
    fontSize: '16px'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
    fontSize: '16px'
  }
}
