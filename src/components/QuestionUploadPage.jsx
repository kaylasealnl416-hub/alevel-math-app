import { useState, useEffect } from 'react'
import { post, get } from '../utils/apiClient'
import { API_BASE } from '../utils/constants'
import Navbar from './Navbar'
import {
  UploadCloud,
  FileText,
  X,
  Sparkles,
  Info,
  Database,
  CheckCircle2,
} from 'lucide-react'

const Toast = {
  success: (msg) => console.log('SUCCESS:', msg),
  error: (msg) => { console.error('ERROR:', msg); alert(msg) },
  warning: (msg) => { console.warn('WARNING:', msg); alert(msg) },
}

const GRID_BG = {
  background: '#fafafa',
  backgroundImage:
    'linear-gradient(to right, rgba(128,128,128,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(128,128,128,0.07) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
  minHeight: '100vh',
  paddingBottom: 80,
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

  const handleFileChange = (e) => validateAndSetFile(e.target.files[0])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) validateAndSetFile(e.dataTransfer.files[0])
  }

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ]
    if (!allowed.includes(selectedFile.type)) {
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
    if (!file) { Toast.error('Please select a file'); return }
    setUploading(true)
    try {
      const csrfRes = await fetch(`${API_BASE}/api/csrf-token`, { credentials: 'include' })
      const csrfData = await csrfRes.json()
      if (!csrfData.success) throw new Error('Failed to get CSRF token. Please log in again.')

      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch(`${API_BASE}/api/questions/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: { 'X-CSRF-Token': csrfData.data.csrfToken },
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error?.message || 'Upload failed')

      setUploadId(data.data.uploadId)
      setUploading(false)
      setProcessing(true)
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
        failCount = 0
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
        if (failCount >= 15) {
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

  if (showReview) return <QuestionReview questions={questions} onBack={handleReset} />

  const isProcessing = uploading || processing

  return (
    <div style={GRID_BG}>
      <Navbar />
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '64px 24px 0' }}>

        {/* ── Title area ── */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64,
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 16,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            position: 'relative',
          }}>
            <Database size={32} color="#059669" />
            <div style={{
              position: 'absolute', top: -8, right: -8,
              width: 24, height: 24,
              background: '#d1fae5',
              borderRadius: '50%',
              border: '2px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={12} color="#059669" />
            </div>
          </div>
          <h1 style={{
            fontSize: 30, fontWeight: 700,
            fontFamily: 'Georgia, "Times New Roman", serif',
            color: '#1e293b', margin: '0 0 12px',
          }}>
            Upload Question Bank
          </h1>
          <p style={{
            fontSize: 14, color: '#64748b', lineHeight: 1.6,
            maxWidth: 420, margin: '0 auto',
          }}>
            Supports PDF and Word documents. Our AI will automatically extract
            and categorize questions, options, and answers.
          </p>
        </div>

        {/* ── Dropzone ── */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            background: dragActive ? '#f0fdf4' : '#fff',
            border: `2px dashed ${dragActive ? '#34d399' : '#cbd5e1'}`,
            borderRadius: 16,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            padding: file ? 20 : 48,
            textAlign: 'center',
            transition: 'all 0.25s',
            cursor: file ? 'default' : 'pointer',
          }}
        >
          {!file ? (
            <label htmlFor="file-input" style={{ cursor: 'pointer', display: 'block' }}>
              <div style={{
                width: 64, height: 64,
                background: '#f1f5f9',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <UploadCloud size={32} color="#94a3b8" />
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#334155', margin: '0 0 6px' }}>
                Click or drag document here
              </p>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
                PDF, DOC, DOCX up to 50MB
              </p>
              <input
                id="file-input"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
          ) : (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: '14px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  padding: 10, background: '#fee2e2', borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FileText size={22} color="#dc2626" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{file.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>

              {!isProcessing ? (
                <button
                  onClick={handleReset}
                  title="Remove file"
                  style={{
                    padding: 8, background: 'transparent', border: 'none',
                    borderRadius: 8, cursor: 'pointer', color: '#94a3b8',
                    display: 'flex', alignItems: 'center',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#dc2626' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8' }}
                >
                  <X size={18} />
                </button>
              ) : (
                <div style={{
                  padding: '4px 12px',
                  background: '#d1fae5', color: '#065f46',
                  borderRadius: 20, fontSize: 12, fontWeight: 700,
                }}>
                  {uploading ? 'Uploading...' : `Parsing... ${progress}%`}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Progress bar ── */}
        {processing && (
          <div style={{ marginTop: 16 }}>
            <div style={{ height: 6, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #34d399, #059669)',
                borderRadius: 4,
                width: `${progress}%`,
                transition: 'width 0.5s ease',
              }} />
            </div>
            <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 8 }}>
              Extracting via AI Engine... {progress}%
            </p>
          </div>
        )}

        {/* ── CTA button ── */}
        {file && (
          <div style={{ marginTop: 20 }}>
            <button
              onClick={handleUpload}
              disabled={isProcessing}
              style={{
                width: '100%', padding: '14px 0',
                background: isProcessing ? '#1e293b' : '#0f172a',
                color: '#fff',
                border: 'none', borderRadius: 12,
                fontSize: 14, fontWeight: 600,
                cursor: isProcessing ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!isProcessing) e.currentTarget.style.background = '#1e293b' }}
              onMouseLeave={e => { if (!isProcessing) e.currentTarget.style.background = '#0f172a' }}
            >
              {isProcessing ? (
                <>
                  <div style={{
                    width: 16, height: 16,
                    border: '2px solid rgba(52,211,153,0.4)',
                    borderTopColor: '#34d399',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  <span style={{ color: '#6ee7b7' }}>
                    {uploading ? 'Uploading...' : 'Extracting via AI Engine...'}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles size={16} color="#6ee7b7" />
                  Upload and Parse with AI
                </>
              )}
            </button>
          </div>
        )}

        {/* ── Tips card ── */}
        <div style={{
          marginTop: 36,
          background: 'rgba(239,246,255,0.6)',
          border: '1px solid #bfdbfe',
          borderRadius: 16,
          padding: '20px 24px',
        }}>
          <h3 style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 13, fontWeight: 700, color: '#1e3a8a',
            margin: '0 0 16px',
          }}>
            <Info size={15} color="#2563eb" />
            Optimization Tips for High Accuracy
          </h3>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              'Supported formats: high-quality PDF or Word (.doc, .docx) documents.',
              'Ensure question numbering (e.g. 1., 2a.) and options (A, B, C, D) are clearly separated.',
              'The AI engine will automatically detect question types, options, answers, and explanations.',
              'You will be able to review, edit, and tag all extracted questions before saving.',
            ].map((tip, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <CheckCircle2 size={15} color="#60a5fa" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ─── Question Review ──────────────────────────────────────────────────────────
function QuestionReview({ questions, onBack }) {
  const [reviewedQuestions, setReviewedQuestions] = useState(questions)
  const [saving, setSaving] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState('')
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('')
  const [subjectDetail, setSubjectDetail] = useState(null)
  const [loadingChapters, setLoadingChapters] = useState(false)
  const [answerInput, setAnswerInput] = useState('')
  const [importResult, setImportResult] = useState(null)

  useEffect(() => {
    get('/api/subjects')
      .then(data => setSubjects(data))
      .catch(err => console.error('Failed to load subjects:', err))
  }, [])

  useEffect(() => {
    if (!selectedSubject) { setSubjectDetail(null); setSelectedChapter(''); return }
    setLoadingChapters(true)
    setSelectedChapter('')
    get(`/api/subjects/${selectedSubject}`)
      .then(data => setSubjectDetail(data))
      .catch(err => console.error('Failed to load chapters:', err))
      .finally(() => setLoadingChapters(false))
  }, [selectedSubject])

  const handleEdit = (index, field, value) => {
    const updated = [...reviewedQuestions]
    if (field === 'content.text') updated[index].content.text = value
    else if (field.startsWith('options[')) updated[index].options[parseInt(field.match(/\d+/)[0])] = value
    else if (field === 'answer.value') { updated[index].answer.value = value; updated[index].answer.source = 'manual' }
    else if (field === 'answer.explanation') updated[index].answer.explanation = value
    else updated[index][field] = value
    setReviewedQuestions(updated)
  }

  const handleRemove = (index) => setReviewedQuestions(reviewedQuestions.filter((_, i) => i !== index))

  const parseAnswerString = (input) => {
    if (!input.trim()) return []
    // Strip numbered prefixes: "1A", "1.", "Q1", "1-", "1)" etc.
    const cleaned = input.trim().replace(/(?:^|\s)Q?\d+[.):\-]?\s*/gi, ' ').trim()
    if (cleaned.includes(',')) {
      return cleaned.split(',').map(a => a.trim().toUpperCase()).filter(Boolean)
    } else if (/\s/.test(cleaned)) {
      return cleaned.split(/\s+/).map(a => a.trim().toUpperCase()).filter(Boolean)
    } else {
      // Concatenated single-letter answers: "ABCDACB"
      return cleaned.toUpperCase().split('').filter(c => /[A-Z]/.test(c))
    }
  }

  const handleApplyAnswers = () => {
    const answers = parseAnswerString(answerInput)
    if (!answers.length) {
      setImportResult({ applied: 0, matched: 0, corrected: 0, empty: true })
      return
    }
    const updated = [...reviewedQuestions]
    let matched = 0, corrected = 0
    const applied = Math.min(answers.length, updated.length)
    answers.forEach((ans, i) => {
      if (i < updated.length) {
        const prev = (updated[i].answer?.value || '').toUpperCase()
        if (prev === ans) matched++
        else corrected++
        updated[i] = { ...updated[i], answer: { ...updated[i].answer, value: ans, source: 'official' } }
      }
    })
    setReviewedQuestions(updated)
    setImportResult({ applied, matched, corrected, empty: false })
  }

  const handleSave = async () => {
    if (!selectedChapter) { Toast.error('Please select a chapter'); return }
    setSaving(true)
    try {
      const cleanedQuestions = reviewedQuestions.map(q => {
        const { source: _src, ...answerRest } = q.answer || {}
        return { ...q, answer: answerRest }
      })
      const result = await post('/questions/batch', {
        questions: cleanedQuestions,
        chapterId: selectedChapter,
      }, { showSuccessToast: true, successMessage: `Saved ${reviewedQuestions.length} questions successfully` })
      if (result.failed > 0) Toast.warning(`${result.created} succeeded, ${result.failed} failed`)
      onBack()
    } catch (error) {
      Toast.error('Save failed: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const typeLabel = (type) => {
    if (type === 'multiple_choice') return 'Multiple Choice'
    if (type === 'fill_in_blank') return 'Fill in the Blank'
    return 'Short Answer'
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1px solid #e2e8f0', borderRadius: 10,
    fontSize: 13, color: '#334155',
    background: '#f8fafc', boxSizing: 'border-box',
    outline: 'none', fontFamily: 'inherit',
  }

  return (
    <div style={GRID_BG}>
      <Navbar />
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 0' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px',
              background: '#fff', border: '1px solid #e2e8f0',
              borderRadius: 8, fontSize: 13, fontWeight: 500,
              color: '#64748b', cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            ← Back
          </button>
          <h2 style={{
            fontSize: 24, fontWeight: 700,
            fontFamily: 'Georgia, "Times New Roman", serif',
            color: '#1e293b', margin: 0,
          }}>
            Review Questions{' '}
            <span style={{ fontSize: 15, fontFamily: 'inherit', fontWeight: 400, color: '#94a3b8' }}>
              ({reviewedQuestions.length})
            </span>
          </h2>
        </div>

        {/* Chapter selector */}
        <div style={{
          background: '#fff', border: '1px solid #e2e8f0',
          borderRadius: 16, padding: '18px 22px',
          marginBottom: 28, boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#475569', margin: '0 0 12px' }}>
            Assign to Chapter
          </p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{ ...inputStyle, width: 'auto', padding: '8px 12px' }}
              >
                <option value="">Choose a subject</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name?.en || s.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>Chapter</label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                disabled={!selectedSubject || loadingChapters}
                style={{ ...inputStyle, width: 'auto', padding: '8px 12px', opacity: (!selectedSubject || loadingChapters) ? 0.5 : 1 }}
              >
                <option value="">{loadingChapters ? 'Loading...' : 'Choose a chapter'}</option>
                {subjectDetail?.books && Object.values(subjectDetail.books).map(unit => (
                  <optgroup key={unit.id} label={unit.title?.en || unit.title}>
                    {unit.chapters.map(ch => (
                      <option key={ch.id} value={ch.id}>{ch.num}. {ch.title?.en || ch.title}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Import Official Answers */}
        <div style={{
          background: '#fff', border: '1px solid #e2e8f0',
          borderRadius: 16, padding: '18px 22px',
          marginBottom: 28, boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#475569', margin: '0 0 12px' }}>
            Import Official Answers
          </p>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              value={answerInput}
              onChange={(e) => { setAnswerInput(e.target.value); setImportResult(null) }}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyAnswers()}
              placeholder="e.g.  ABCDACB  ·  A,B,ABD  ·  1A 2B 3C"
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              onClick={handleApplyAnswers}
              style={{
                padding: '10px 20px', background: '#0f172a', color: '#fff',
                border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              Apply
            </button>
          </div>
          {importResult ? (
            <p style={{ fontSize: 12, margin: '10px 0 0', color: '#64748b' }}>
              {importResult.empty ? (
                <span style={{ color: '#dc2626' }}>No answers detected — check the format and try again.</span>
              ) : (
                <>
                  Applied {importResult.applied} answers ·{' '}
                  <span style={{ color: '#059669', fontWeight: 600 }}>{importResult.matched} matched AI</span>
                  {importResult.corrected > 0 && (
                    <> · <span style={{ color: '#d97706', fontWeight: 600 }}>{importResult.corrected} corrected</span></>
                  )}
                </>
              )}
            </p>
          ) : (
            <p style={{ fontSize: 12, margin: '10px 0 0', color: '#94a3b8' }}>
              Supports: plain string "ABCD", comma-separated "A,B,ABD", or numbered "1A 2B 3C"
            </p>
          )}
        </div>

        {/* Question cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {reviewedQuestions.map((q, index) => (
            <div key={index} style={{
              background: '#fff', border: '1px solid #e2e8f0',
              borderRadius: 16, padding: 24,
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>
              {/* Card header */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 20, paddingBottom: 16,
                borderBottom: '1px solid #f1f5f9',
              }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#334155' }}>
                  Question {index + 1}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 600,
                    color: q.confidence > 0.9 ? '#059669' : q.confidence > 0.7 ? '#d97706' : '#dc2626',
                  }}>
                    {(q.confidence * 100).toFixed(0)}% confidence
                  </span>
                  <span style={{
                    padding: '3px 10px',
                    background: '#eef2ff', color: '#4f46e5',
                    borderRadius: 20, fontSize: 11, fontWeight: 600,
                  }}>
                    {typeLabel(q.type)}
                  </span>
                  <button
                    onClick={() => handleRemove(index)}
                    style={{
                      padding: 6, background: 'transparent', border: 'none',
                      borderRadius: 6, cursor: 'pointer', color: '#94a3b8',
                      display: 'flex', alignItems: 'center',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#dc2626' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8' }}
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Question text */}
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Question text</label>
                <textarea
                  value={q.content.text}
                  onChange={(e) => handleEdit(index, 'content.text', e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              {/* Options */}
              {q.options?.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Options</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {q.options.map((opt, i) => (
                      <input
                        key={i}
                        value={opt}
                        onChange={(e) => handleEdit(index, `options[${i}]`, e.target.value)}
                        style={inputStyle}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Answer + Explanation */}
              {q.type === 'short_answer' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
                  <div>
                    <label style={labelStyle}>Answer</label>
                    <textarea
                      value={q.answer.value}
                      onChange={(e) => handleEdit(index, 'answer.value', e.target.value)}
                      rows={5}
                      style={{ ...inputStyle, resize: 'vertical', ...(q.answer?.source === 'official' ? { borderColor: '#059669', background: '#f0fdf4' } : {}) }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Explanation</label>
                    <textarea
                      value={q.answer.explanation || ''}
                      onChange={(e) => handleEdit(index, 'answer.explanation', e.target.value)}
                      rows={3}
                      style={{ ...inputStyle, resize: 'none' }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14, marginTop: 14 }}>
                  <div>
                    <label style={labelStyle}>Answer</label>
                    <input
                      value={q.answer.value}
                      onChange={(e) => handleEdit(index, 'answer.value', e.target.value)}
                      style={{ ...inputStyle, ...(q.answer?.source === 'official' ? { borderColor: '#059669', background: '#f0fdf4' } : {}) }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Explanation</label>
                    <textarea
                      value={q.answer.explanation || ''}
                      onChange={(e) => handleEdit(index, 'answer.explanation', e.target.value)}
                      rows={2}
                      style={{ ...inputStyle, resize: 'none' }}
                    />
                  </div>
                </div>
              )}

              {/* Difficulty + Tags */}
              <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 14, marginTop: 14 }}>
                <div>
                  <label style={labelStyle}>Difficulty (1–5)</label>
                  <input
                    type="number" min="1" max="5"
                    value={q.difficulty}
                    onChange={(e) => handleEdit(index, 'difficulty', parseInt(e.target.value))}
                    style={{ ...inputStyle, width: 70 }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Tags</label>
                  <input
                    value={q.tags?.join(', ') || ''}
                    onChange={(e) => handleEdit(index, 'tags', e.target.value.split(',').map(t => t.trim()))}
                    placeholder="Comma separated"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Save button */}
        <div style={{ marginTop: 40, textAlign: 'center', paddingBottom: 40 }}>
          <button
            onClick={handleSave}
            disabled={saving || !selectedChapter}
            style={{
              padding: '14px 48px',
              background: saving || !selectedChapter ? '#e2e8f0' : '#0f172a',
              color: saving || !selectedChapter ? '#94a3b8' : '#fff',
              border: 'none', borderRadius: 12,
              fontSize: 14, fontWeight: 600,
              cursor: saving || !selectedChapter ? 'not-allowed' : 'pointer',
              boxShadow: saving || !selectedChapter ? 'none' : '0 4px 12px rgba(0,0,0,0.15)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              transition: 'all 0.15s',
            }}
          >
            {saving ? (
              <>
                <div style={{
                  width: 14, height: 14,
                  border: '2px solid #cbd5e1',
                  borderTopColor: '#64748b',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                }} />
                Saving...
              </>
            ) : (
              `Save ${reviewedQuestions.length} Questions`
            )}
          </button>
        </div>

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: 11, fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 6,
}
