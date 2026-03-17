import { useState, useEffect } from 'react'
import { post, get } from '../utils/apiClient'
import { API_BASE } from '../utils/constants'
import Navbar from './Navbar'
import Loading from './common/Loading'

// Toast helper — Toast component lacks static methods
const Toast = {
  success: (msg) => console.log('SUCCESS:', msg),
  error: (msg) => { console.error('ERROR:', msg); alert(msg) },
  warning: (msg) => { console.warn('WARNING:', msg); alert(msg) },
}

export default function QuestionUploadPage() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadId, setUploadId] = useState(null)
  const [questions, setQuestions] = useState([])
  const [showReview, setShowReview] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    validateAndSetFile(selectedFile)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ]

    if (!allowedTypes.includes(selectedFile.type)) {
      Toast.error('Only PDF and Word documents are supported')
      return
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      Toast.error('File size must not exceed 50 MB')
      return
    }

    setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) {
      Toast.error('Please select a file')
      return
    }

    setUploading(true)

    try {
      // Get CSRF token first
      const csrfRes = await fetch(`${API_BASE}/api/csrf-token`, { credentials: 'include' })
      const csrfData = await csrfRes.json()
      if (!csrfData.success) {
        throw new Error('Failed to get CSRF token. Please log in again.')
      }

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_BASE}/api/questions/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'X-CSRF-Token': csrfData.data.csrfToken
        }
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error?.message || 'Upload failed')
      }

      setUploadId(data.data.uploadId)
      setUploading(false)
      setProcessing(true)

      Toast.success('File uploaded. Parsing in progress...')

      pollStatus(data.data.uploadId)

    } catch (error) {
      Toast.error(error.message)
      setUploading(false)
    }
  }

  const pollStatus = async (id) => {
    let failCount = 0
    const interval = setInterval(async () => {
      try {
        const status = await get(`/api/questions/upload/${id}/status`, { showErrorToast: false })
        failCount = 0 // reset on success

        setProgress(status.progress)

        if (status.status === 'completed') {
          clearInterval(interval)
          setProcessing(false)
          Toast.success(`Successfully extracted ${status.extractedQuestions} questions`)

          const result = await get(`/api/questions/upload/${id}/result`, { showErrorToast: false })
          setQuestions(result.questions)
          setShowReview(true)
        }

        if (status.status === 'failed') {
          clearInterval(interval)
          setProcessing(false)
          Toast.error('Parsing failed: ' + (status.errors || []).join(', '))
        }
      } catch (error) {
        failCount++
        console.warn(`Poll failed (${failCount}/5):`, error.message)
        if (failCount >= 5) {
          clearInterval(interval)
          setProcessing(false)
          Toast.error('Connection lost. Please try again.')
        }
      }
    }, 3000)
  }

  const handleReset = () => {
    setFile(null)
    setUploadId(null)
    setQuestions([])
    setShowReview(false)
    setProgress(0)
  }

  if (showReview) {
    return <QuestionReview questions={questions} onBack={handleReset} />
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2>📄 Upload Question Bank</h2>
        <p style={styles.subtitle}>Supports PDF and Word documents — AI extracts questions automatically</p>

      <div
        style={{
          ...styles.uploadArea,
          ...(dragActive ? styles.uploadAreaActive : {})
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!file ? (
          <>
            <div style={styles.uploadIcon}>📁</div>
            <p style={styles.uploadText}>Drag a file here, or click to select</p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={styles.fileInput}
              id="file-input"
            />
            <label htmlFor="file-input" style={styles.fileLabel}>
              Choose File
            </label>
          </>
        ) : (
          <div style={styles.fileInfo}>
            <div style={styles.fileIcon}>
              {file.type === 'application/pdf' ? '📕' : '📘'}
            </div>
            <div style={styles.fileDetails}>
              <div style={styles.fileName}>{file.name}</div>
              <div style={styles.fileSize}>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            <button onClick={handleReset} style={styles.removeButton}>
              ✕
            </button>
          </div>
        )}
      </div>

      {file && !processing && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          style={styles.uploadButton}
        >
          {uploading ? 'Uploading...' : 'Upload and Parse'}
        </button>
      )}

      {processing && (
        <div style={styles.processingContainer}>
          <Loading size="large" />
          <div style={styles.progressText}>
            Parsing document... {progress}%
          </div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div style={styles.tips}>
        <h4>Tips</h4>
        <ul style={styles.tipsList}>
          <li>Supported formats: PDF, Word (.doc, .docx)</li>
          <li>Max file size: 50 MB</li>
          <li>Tip: clear question numbering, options, and answers improve accuracy</li>
          <li>AI will detect question type, options, answers, and explanations</li>
          <li>You can review and edit extracted questions before saving</li>
        </ul>
      </div>
    </div>
    </>
  )
}

// Question review component
function QuestionReview({ questions, onBack }) {
  const [reviewedQuestions, setReviewedQuestions] = useState(questions)
  const [saving, setSaving] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState('')
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('')
  const [subjectDetail, setSubjectDetail] = useState(null)
  const [loadingChapters, setLoadingChapters] = useState(false)

  // Fetch all subjects on mount
  useEffect(() => {
    get('/api/subjects')
      .then(data => setSubjects(data))
      .catch(err => console.error('Failed to load subjects:', err))
  }, [])

  // Fetch subject details (units + chapters) when subject changes
  useEffect(() => {
    if (!selectedSubject) {
      setSubjectDetail(null)
      setSelectedChapter('')
      return
    }
    setLoadingChapters(true)
    setSelectedChapter('')
    get(`/api/subjects/${selectedSubject}`)
      .then(data => setSubjectDetail(data))
      .catch(err => console.error('Failed to load chapters:', err))
      .finally(() => setLoadingChapters(false))
  }, [selectedSubject])

  const handleEdit = (index, field, value) => {
    const updated = [...reviewedQuestions]
    if (field === 'content.text') {
      updated[index].content.text = value
    } else if (field.startsWith('options[')) {
      const optIndex = parseInt(field.match(/\d+/)[0])
      updated[index].options[optIndex] = value
    } else if (field === 'answer.value') {
      updated[index].answer.value = value
    } else if (field === 'answer.explanation') {
      updated[index].answer.explanation = value
    } else {
      updated[index][field] = value
    }
    setReviewedQuestions(updated)
  }

  const handleRemove = (index) => {
    const updated = reviewedQuestions.filter((_, i) => i !== index)
    setReviewedQuestions(updated)
  }

  const handleSave = async () => {
    if (!selectedChapter) {
      Toast.error('Please select a chapter')
      return
    }

    setSaving(true)

    try {
      const result = await post('/questions/batch', {
        questions: reviewedQuestions,
        chapterId: selectedChapter
      }, {
        showSuccessToast: true,
        successMessage: `Saved ${reviewedQuestions.length} questions successfully`
      })

      if (result.failed > 0) {
        Toast.warning(`${result.created} succeeded, ${result.failed} failed`)
      }

      onBack()
    } catch (error) {
      Toast.error('Save failed: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const getQuestionTypeLabel = (type) => {
    if (type === 'multiple_choice') return 'Multiple Choice'
    if (type === 'fill_in_blank') return 'Fill in the Blank'
    return 'Short Answer'
  }

  return (
    <div style={styles.container}>
      <div style={styles.reviewHeader}>
        <button onClick={onBack} style={styles.backButton}>
          ← Back
        </button>
        <h2>Review Questions ({reviewedQuestions.length})</h2>
      </div>

      <div style={styles.chapterSelect}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label>Subject: </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={styles.select}
            >
              <option value="">Choose a subject</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Chapter: </label>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              style={styles.select}
              disabled={!selectedSubject || loadingChapters}
            >
              <option value="">
                {loadingChapters ? 'Loading...' : 'Choose a chapter'}
              </option>
              {subjectDetail?.books && Object.values(subjectDetail.books).map(unit => (
                <optgroup key={unit.id} label={unit.title}>
                  {unit.chapters.map(ch => (
                    <option key={ch.id} value={ch.id}>
                      {ch.num}. {ch.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={styles.questionsList}>
        {reviewedQuestions.map((q, index) => (
          <div key={index} style={styles.questionCard}>
            <div style={styles.questionHeader}>
              <span style={styles.questionNumber}>Question {index + 1}</span>
              <div style={styles.questionMeta}>
                <span style={{
                  ...styles.confidence,
                  color: q.confidence > 0.9 ? '#10b981' : q.confidence > 0.7 ? '#f59e0b' : '#ef4444'
                }}>
                  Confidence: {(q.confidence * 100).toFixed(0)}%
                </span>
                <span style={styles.questionType}>
                  {getQuestionTypeLabel(q.type)}
                </span>
                <button onClick={() => handleRemove(index)} style={styles.removeBtn}>
                  Remove
                </button>
              </div>
            </div>

            <div style={styles.field}>
              <label>Question text:</label>
              <textarea
                value={q.content.text}
                onChange={(e) => handleEdit(index, 'content.text', e.target.value)}
                style={styles.textarea}
                rows={3}
              />
            </div>

            {q.options && q.options.length > 0 && (
              <div style={styles.field}>
                <label>Options:</label>
                {q.options.map((opt, i) => (
                  <input
                    key={i}
                    value={opt}
                    onChange={(e) => handleEdit(index, `options[${i}]`, e.target.value)}
                    style={styles.input}
                  />
                ))}
              </div>
            )}

            <div style={styles.answerSection}>
              <div style={styles.field}>
                <label>Answer:</label>
                <input
                  value={q.answer.value}
                  onChange={(e) => handleEdit(index, 'answer.value', e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label>Explanation:</label>
                <textarea
                  value={q.answer.explanation || ''}
                  onChange={(e) => handleEdit(index, 'answer.explanation', e.target.value)}
                  style={styles.textarea}
                  rows={2}
                />
              </div>
            </div>

            <div style={styles.metaSection}>
              <div style={styles.field}>
                <label>Difficulty (1–5):</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={q.difficulty}
                  onChange={(e) => handleEdit(index, 'difficulty', parseInt(e.target.value))}
                  style={styles.inputSmall}
                />
              </div>
              <div style={styles.field}>
                <label>Tags:</label>
                <input
                  value={q.tags?.join(', ') || ''}
                  onChange={(e) => handleEdit(index, 'tags', e.target.value.split(',').map(t => t.trim()))}
                  style={styles.input}
                  placeholder="Comma separated"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.saveSection}>
        <button
          onClick={handleSave}
          disabled={saving || !selectedChapter}
          style={styles.saveButton}
        >
          {saving ? 'Saving...' : `Save ${reviewedQuestions.length} Questions`}
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 20px'
  },
  subtitle: {
    color: '#666',
    marginTop: '-10px',
    marginBottom: '30px'
  },
  uploadArea: {
    border: '2px dashed #ddd',
    borderRadius: '12px',
    padding: '60px 40px',
    textAlign: 'center',
    background: '#fafafa',
    transition: 'all 0.3s',
    cursor: 'pointer',
    position: 'relative'
  },
  uploadAreaActive: {
    borderColor: '#667eea',
    background: '#f0f4ff'
  },
  uploadIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  uploadText: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '20px'
  },
  fileInput: {
    display: 'none'
  },
  fileLabel: {
    display: 'inline-block',
    padding: '12px 32px',
    background: '#667eea',
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background 0.3s'
  },
  fileInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '20px',
    background: 'white',
    borderRadius: '8px'
  },
  fileIcon: {
    fontSize: '48px'
  },
  fileDetails: {
    flex: 1,
    textAlign: 'left'
  },
  fileName: {
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '5px'
  },
  fileSize: {
    fontSize: '14px',
    color: '#666'
  },
  removeButton: {
    padding: '8px 16px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  uploadButton: {
    width: '100%',
    marginTop: '20px',
    padding: '16px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.3s'
  },
  processingContainer: {
    marginTop: '40px',
    textAlign: 'center'
  },
  progressText: {
    fontSize: '16px',
    color: '#666',
    marginTop: '20px',
    marginBottom: '10px'
  },
  progressBar: {
    height: '12px',
    background: '#f0f0f0',
    borderRadius: '6px',
    overflow: 'hidden',
    marginTop: '10px'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    transition: 'width 0.3s'
  },
  tips: {
    marginTop: '40px',
    padding: '20px',
    background: '#f7fafc',
    borderRadius: '8px',
    borderLeft: '4px solid #667eea'
  },
  tipsList: {
    margin: '10px 0 0 20px',
    color: '#666',
    lineHeight: '1.8'
  },
  reviewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '30px'
  },
  backButton: {
    padding: '8px 16px',
    background: '#f3f4f6',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  chapterSelect: {
    marginBottom: '30px',
    padding: '20px',
    background: '#f7fafc',
    borderRadius: '8px'
  },
  select: {
    marginLeft: '10px',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px'
  },
  questionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  questionCard: {
    padding: '24px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb'
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid #e5e7eb'
  },
  questionNumber: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937'
  },
  questionMeta: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  confidence: {
    fontSize: '14px',
    fontWeight: '500'
  },
  questionType: {
    padding: '4px 12px',
    background: '#e0e7ff',
    color: '#4f46e5',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500'
  },
  removeBtn: {
    padding: '6px 12px',
    background: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  field: {
    marginBottom: '15px'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    marginBottom: '8px'
  },
  inputSmall: {
    width: '80px',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px'
  },
  answerSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '15px',
    marginTop: '15px'
  },
  metaSection: {
    display: 'grid',
    gridTemplateColumns: '150px 1fr',
    gap: '15px',
    marginTop: '15px'
  },
  saveSection: {
    marginTop: '40px',
    textAlign: 'center'
  },
  saveButton: {
    padding: '16px 48px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.3s'
  }
}
