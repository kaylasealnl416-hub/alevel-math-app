import { useState, useEffect } from 'react'
import { dataSource } from './data/dataSource.js'

export default function ApiTestPage() {
  const [subjects, setSubjects] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mode, setMode] = useState(dataSource.getMode())

  const loadSubjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await dataSource.getSubjects()
      setSubjects(data)
      console.log('✅ Subjects loaded:', Object.keys(data))
    } catch (err) {
      setError(err.message)
      console.error('❌ Load failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadSubjectDetail = async (subjectId) => {
    setLoading(true)
    setError(null)
    try {
      const data = await dataSource.getSubject(subjectId)
      setSelectedSubject(data)
      console.log('✅ Subject detail loaded:', data.name.en)
    } catch (err) {
      setError(err.message)
      console.error('❌ Load failed:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubjects()
  }, [])

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🧪 API Test Page</h1>
        <div style={styles.badge}>
          Data source mode: <strong>{mode}</strong>
        </div>
      </div>

      {loading && <div style={styles.loading}>⏳ Loading...</div>}
      {error && <div style={styles.error}>❌ Error: {error}</div>}

      {/* Subject list */}
      {subjects && !selectedSubject && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📚 Subjects</h2>
          <div style={styles.grid}>
            {Object.entries(subjects).map(([id, subject]) => (
              <button
                key={id}
                onClick={() => loadSubjectDetail(id)}
                style={{
                  ...styles.card,
                  borderColor: subject.color,
                  backgroundColor: subject.bgColor,
                }}
              >
                <div style={styles.cardIcon}>{subject.icon}</div>
                <div style={styles.cardTitle}>{subject.name.en}</div>
                <div style={styles.cardSubtitle}>{subject.level}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Subject detail */}
      {selectedSubject && (
        <div style={styles.section}>
          <button
            onClick={() => setSelectedSubject(null)}
            style={styles.backButton}
          >
            ← Back to subjects
          </button>

          <h2 style={styles.sectionTitle}>
            {selectedSubject.icon} {selectedSubject.name.en}
          </h2>
          <p style={styles.description}>{selectedSubject.level}</p>

          <h3 style={styles.subtitle}>📖 Units</h3>
          {selectedSubject.books && (
            <div style={styles.unitList}>
              {Object.entries(selectedSubject.books).map(([unitId, unit]) => (
                <div key={unitId} style={styles.unit}>
                  <div style={styles.unitHeader}>
                    <strong>{unit.title.en || unit.title.zh}</strong>
                    <span style={styles.unitBadge}>
                      {unit.chapters?.length || 0} chapters
                    </span>
                  </div>
                  {unit.subtitle && (
                    <div style={styles.unitSubtitle}>{unit.subtitle.en || unit.subtitle.zh}</div>
                  )}
                  {unit.chapters && unit.chapters.length > 0 && (
                    <ul style={styles.chapterList}>
                      {unit.chapters.map((chapter) => (
                        <li key={chapter.id} style={styles.chapterItem}>
                          {chapter.num}. {chapter.title.en || chapter.title.zh}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer hint */}
      <div style={styles.footer}>
        💡 Open the browser console for detailed logs
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
  },
  badge: {
    display: 'inline-block',
    padding: '8px 16px',
    backgroundColor: '#f0f0f0',
    borderRadius: '20px',
    fontSize: '14px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666',
  },
  error: {
    padding: '20px',
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    borderRadius: '8px',
    color: '#c00',
    marginBottom: '20px',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginTop: '30px',
    marginBottom: '15px',
  },
  description: {
    color: '#666',
    marginBottom: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  card: {
    padding: '30px',
    border: '2px solid',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    textAlign: 'center',
  },
  cardIcon: {
    fontSize: '48px',
    marginBottom: '10px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  cardSubtitle: {
    fontSize: '14px',
    color: '#666',
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '14px',
  },
  unitList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  unit: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  unitHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  unitBadge: {
    padding: '4px 12px',
    backgroundColor: '#e0e0e0',
    borderRadius: '12px',
    fontSize: '12px',
  },
  unitSubtitle: {
    color: '#666',
    fontSize: '14px',
    marginBottom: '15px',
  },
  chapterList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  chapterItem: {
    padding: '8px 0',
    borderBottom: '1px solid #e0e0e0',
    fontSize: '14px',
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
    fontSize: '14px',
    marginTop: '40px',
    borderTop: '1px solid #e0e0e0',
  },
}
