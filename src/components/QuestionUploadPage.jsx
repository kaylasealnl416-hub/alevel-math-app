import { useState } from 'react'
import { post, get } from '../utils/apiClient'
import Navbar from './Navbar'
import Toast from './common/Toast'
import Loading from './common/Loading'

export default function QuestionUploadPage() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadId, setUploadId] = useState(null)
  const [questions, setQuestions] = useState([])
  const [showReview, setShowReview] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  // 文件选择
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    validateAndSetFile(selectedFile)
  }

  // 拖拽处理
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

  // 验证并设置文件
  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return

    // 验证文件类型
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ]

    if (!allowedTypes.includes(selectedFile.type)) {
      Toast.error('只支持 PDF 和 Word 文档')
      return
    }

    // 验证文件大小（50MB）
    if (selectedFile.size > 50 * 1024 * 1024) {
      Toast.error('文件大小不能超过 50MB')
      return
    }

    setFile(selectedFile)
  }

  // 上传文件
  const handleUpload = async () => {
    if (!file) {
      Toast.error('请选择文件')
      return
    }

    setUploading(true)

    try {
      // 创建 FormData
      const formData = new FormData()
      formData.append('file', file)

      // 上传文件
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/questions/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error?.message || '上传失败')
      }

      setUploadId(data.data.uploadId)
      setUploading(false)
      setProcessing(true)

      Toast.success('文件上传成功，正在解析...')

      // 轮询解析状态
      pollStatus(data.data.uploadId)

    } catch (error) {
      Toast.error(error.message)
      setUploading(false)
    }
  }

  // 轮询解析状态
  const pollStatus = async (id) => {
    const interval = setInterval(async () => {
      try {
        const status = await get(`/questions/upload/${id}/status`)

        setProgress(status.progress)

        if (status.status === 'completed') {
          clearInterval(interval)
          setProcessing(false)
          Toast.success(`成功提取 ${status.extractedQuestions} 个题目`)

          // 获取解析结果
          const result = await get(`/questions/upload/${id}/result`)
          setQuestions(result.questions)
          setShowReview(true)
        }

        if (status.status === 'failed') {
          clearInterval(interval)
          setProcessing(false)
          Toast.error('解析失败：' + status.errors.join(', '))
        }
      } catch (error) {
        clearInterval(interval)
        setProcessing(false)
        Toast.error('查询状态失败')
      }
    }, 2000) // 每 2 秒查询一次
  }

  // 重置
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
        <h2>📄 上传题库文档</h2>
        <p style={styles.subtitle}>支持 PDF 和 Word 文档，AI 自动提取题目</p>

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
            <p style={styles.uploadText}>拖拽文件到这里，或点击选择文件</p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={styles.fileInput}
              id="file-input"
            />
            <label htmlFor="file-input" style={styles.fileLabel}>
              选择文件
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
          {uploading ? '上传中...' : '开始上传并解析'}
        </button>
      )}

      {processing && (
        <div style={styles.processingContainer}>
          <Loading size="large" />
          <div style={styles.progressText}>
            正在解析文档... {progress}%
          </div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div style={styles.tips}>
        <h4>💡 使用提示</h4>
        <ul style={styles.tipsList}>
          <li>支持格式：PDF、Word（.doc, .docx）</li>
          <li>文件大小：最大 50MB</li>
          <li>建议：题目格式清晰，包含题号、选项、答案</li>
          <li>AI 会自动识别题目类型、选项、答案和解释</li>
          <li>识别完成后可以人工审核和编辑</li>
        </ul>
      </div>
    </div>
  )
}

// 题目审核组件
function QuestionReview({ questions, onBack }) {
  const [reviewedQuestions, setReviewedQuestions] = useState(questions)
  const [saving, setSaving] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState('')

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
      Toast.error('请选择章节')
      return
    }

    setSaving(true)

    try {
      const result = await post('/questions/batch', {
        questions: reviewedQuestions,
        chapterId: selectedChapter
      }, {
        showSuccessToast: true,
        successMessage: `成功保存 ${reviewedQuestions.length} 个题目`
      })

      if (result.failed > 0) {
        Toast.warning(`${result.created} 个成功，${result.failed} 个失败`)
      }

      onBack()
    } catch (error) {
      Toast.error('保存失败: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.reviewHeader}>
        <button onClick={onBack} style={styles.backButton}>
          ← 返回
        </button>
        <h2>审核题目（{reviewedQuestions.length} 个）</h2>
      </div>

      <div style={styles.chapterSelect}>
        <label>选择章节：</label>
        <select
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
          style={styles.select}
        >
          <option value="">请选择章节</option>
          <option value="chapter-1">Pure Mathematics 1</option>
          <option value="chapter-2">Pure Mathematics 2</option>
          <option value="chapter-3">Statistics</option>
          <option value="chapter-4">Mechanics</option>
        </select>
      </div>

      <div style={styles.questionsList}>
        {reviewedQuestions.map((q, index) => (
          <div key={index} style={styles.questionCard}>
            <div style={styles.questionHeader}>
              <span style={styles.questionNumber}>题目 {index + 1}</span>
              <div style={styles.questionMeta}>
                <span style={{
                  ...styles.confidence,
                  color: q.confidence > 0.9 ? '#10b981' : q.confidence > 0.7 ? '#f59e0b' : '#ef4444'
                }}>
                  置信度: {(q.confidence * 100).toFixed(0)}%
                </span>
                <span style={styles.questionType}>
                  {q.type === 'multiple_choice' ? '选择题' : q.type === 'fill_in_blank' ? '填空题' : '简答题'}
                </span>
                <button onClick={() => handleRemove(index)} style={styles.removeBtn}>
                  删除
                </button>
              </div>
            </div>

            <div style={styles.field}>
              <label>题目内容：</label>
              <textarea
                value={q.content.text}
                onChange={(e) => handleEdit(index, 'content.text', e.target.value)}
                style={styles.textarea}
                rows={3}
              />
            </div>

            {q.options && q.options.length > 0 && (
              <div style={styles.field}>
                <label>选项：</label>
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
                <label>答案：</label>
                <input
                  value={q.answer.value}
                  onChange={(e) => handleEdit(index, 'answer.value', e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label>解释：</label>
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
                <label>难度（1-5）：</label>
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
                <label>标签：</label>
                <input
                  value={q.tags?.join(', ') || ''}
                  onChange={(e) => handleEdit(index, 'tags', e.target.value.split(',').map(t => t.trim()))}
                  style={styles.input}
                  placeholder="用逗号分隔"
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
          {saving ? '保存中...' : `批量保存 ${reviewedQuestions.length} 个题目`}
        </button>
      </div>
    </div>
    </>
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
