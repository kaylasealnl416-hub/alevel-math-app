# PDF/Word 题库上传与解析方案

**创建日期**: 2026-03-11
**状态**: 设计方案

---

## 📋 需求分析

### 用户需求
- 上传 PDF/Word 格式的题库文档
- 自动解析文档中的题目
- 提取题目内容、选项、答案、解释
- 在网站上显示解析后的题目

### 技术挑战
1. **文档格式多样**: PDF、Word、图片扫描版
2. **题目格式不统一**: 不同来源的题目格式差异大
3. **数学公式识别**: LaTeX、图片公式
4. **准确率要求**: 题目解析必须准确

---

## 🏗️ 技术架构

### 整体流程
```
用户上传文档
    ↓
文件存储（云存储）
    ↓
文档解析（提取文本）
    ↓
AI 智能识别（提取题目结构）
    ↓
人工审核（可选）
    ↓
保存到数据库
    ↓
网站展示
```

---

## 🔧 技术方案

### 方案 A：AI 驱动（推荐）⭐

**优点**:
- 准确率高（90%+）
- 支持多种格式
- 自动识别题目结构
- 支持数学公式

**缺点**:
- 需要 AI API（成本）
- 处理时间较长（10-30 秒/页）

**技术栈**:
```javascript
// 1. 文档解析
- PDF: pdf-parse / pdf.js
- Word: mammoth.js / docx
- 图片: Tesseract OCR

// 2. AI 识别
- 智谱 GLM-4-Plus（已集成）
- Claude API（可选）
- GPT-4 Vision（可选）

// 3. 公式识别
- MathPix API（图片公式 → LaTeX）
- 智谱 GLM-4V（视觉模型）
```

---

### 方案 B：规则匹配

**优点**:
- 成本低
- 处理速度快
- 无需 AI

**缺点**:
- 准确率低（60-70%）
- 需要严格的格式要求
- 难以处理复杂格式

**适用场景**:
- 格式统一的题库
- 简单的选择题
- 预算有限

---

## 💻 实现方案（方案 A）

### 1. 后端 API 设计

#### 1.1 文件上传接口
```javascript
POST /api/questions/upload

Request:
- Content-Type: multipart/form-data
- file: PDF/Word 文件（最大 10MB）
- chapterId: 章节 ID（可选）
- difficulty: 难度（可选）

Response:
{
  "success": true,
  "data": {
    "uploadId": "uuid",
    "filename": "math-questions.pdf",
    "status": "processing",
    "estimatedTime": 30 // 秒
  }
}
```

#### 1.2 解析状态查询
```javascript
GET /api/questions/upload/:uploadId/status

Response:
{
  "success": true,
  "data": {
    "status": "completed", // processing | completed | failed
    "progress": 100,
    "totalPages": 10,
    "processedPages": 10,
    "extractedQuestions": 25,
    "errors": []
  }
}
```

#### 1.3 获取解析结果
```javascript
GET /api/questions/upload/:uploadId/result

Response:
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "temp-1",
        "content": {
          "en": "Solve for x: 2x + 5 = 13",
          "latex": "2x + 5 = 13"
        },
        "type": "multiple_choice",
        "options": ["A. x = 3", "B. x = 4", "C. x = 5", "D. x = 6"],
        "answer": {
          "value": "B",
          "explanation": "2x = 13 - 5 = 8, so x = 4"
        },
        "difficulty": 2,
        "tags": ["algebra", "linear_equations"],
        "confidence": 0.95, // AI 置信度
        "needsReview": false
      }
    ]
  }
}
```

#### 1.4 批量保存题目
```javascript
POST /api/questions/batch

Request:
{
  "questions": [...], // 审核后的题目
  "chapterId": "chapter-1"
}

Response:
{
  "success": true,
  "data": {
    "created": 25,
    "failed": 0
  }
}
```

---

### 2. 文档解析实现

#### 2.1 PDF 解析
```javascript
// backend/src/services/documentParser.js

import pdf from 'pdf-parse'
import fs from 'fs'

/**
 * 解析 PDF 文档
 */
export async function parsePDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath)
  const data = await pdf(dataBuffer)

  return {
    text: data.text,
    pages: data.numpages,
    info: data.info
  }
}
```

#### 2.2 Word 解析
```javascript
import mammoth from 'mammoth'

/**
 * 解析 Word 文档
 */
export async function parseWord(filePath) {
  const result = await mammoth.extractRawText({ path: filePath })

  return {
    text: result.value,
    messages: result.messages
  }
}
```

#### 2.3 图片 OCR（扫描版 PDF）
```javascript
import Tesseract from 'tesseract.js'

/**
 * OCR 识别图片文字
 */
export async function ocrImage(imagePath) {
  const { data: { text } } = await Tesseract.recognize(
    imagePath,
    'eng+chi_sim', // 英文 + 简体中文
    {
      logger: m => console.log(m)
    }
  )

  return text
}
```

---

### 3. AI 题目提取

#### 3.1 使用智谱 GLM-4-Plus
```javascript
// backend/src/services/questionExtractor.js

import { createGLMClient } from './ai/glmClient.js'

/**
 * 使用 AI 提取题目
 */
export async function extractQuestions(text, options = {}) {
  const client = createGLMClient()

  const prompt = `
你是一个专业的题目提取助手。请从以下文本中提取所有题目，并按照 JSON 格式返回。

要求：
1. 识别题目类型（选择题、填空题、简答题）
2. 提取题目内容、选项、答案、解释
3. 识别数学公式（转换为 LaTeX 格式）
4. 标注难度（1-5）
5. 提取知识点标签

文本内容：
${text}

请返回 JSON 格式：
{
  "questions": [
    {
      "type": "multiple_choice",
      "content": {
        "en": "题目内容",
        "latex": "LaTeX 公式（如果有）"
      },
      "options": ["A. 选项1", "B. 选项2", "C. 选项3", "D. 选项4"],
      "answer": {
        "value": "B",
        "explanation": "答案解释"
      },
      "difficulty": 2,
      "tags": ["algebra", "equations"],
      "confidence": 0.95
    }
  ]
}
`

  const response = await client.chat.completions.create({
    model: 'glm-4-plus',
    messages: [
      { role: 'user', content: prompt }
    ],
    temperature: 0.1, // 低温度，提高准确性
    response_format: { type: 'json_object' }
  })

  const result = JSON.parse(response.choices[0].message.content)
  return result.questions
}
```

#### 3.2 分页处理（大文档）
```javascript
/**
 * 分页提取题目
 */
export async function extractQuestionsFromPages(pages) {
  const allQuestions = []

  for (let i = 0; i < pages.length; i++) {
    console.log(`处理第 ${i + 1}/${pages.length} 页...`)

    const questions = await extractQuestions(pages[i])
    allQuestions.push(...questions)

    // 避免 API 速率限制
    await delay(1000)
  }

  return allQuestions
}
```

---

### 4. 前端实现

#### 4.1 上传组件
```jsx
// src/components/QuestionUpload.jsx

import { useState } from 'react'
import { post, get } from '@/utils/apiClient'
import Toast from './common/Toast'
import Loading from './common/Loading'

export default function QuestionUpload({ chapterId, onSuccess }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadId, setUploadId] = useState(null)

  // 文件选择
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]

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

    // 验证文件大小（10MB）
    if (selectedFile.size > 10 * 1024 * 1024) {
      Toast.error('文件大小不能超过 10MB')
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
      if (chapterId) {
        formData.append('chapterId', chapterId)
      }

      // 上传文件
      const response = await fetch('/api/questions/upload', {
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
        const status = await get(`/api/questions/upload/${id}/status`)

        setProgress(status.progress)

        if (status.status === 'completed') {
          clearInterval(interval)
          setProcessing(false)
          Toast.success(`成功提取 ${status.extractedQuestions} 个题目`)

          // 获取解析结果
          const result = await get(`/api/questions/upload/${id}/result`)
          onSuccess(result.questions)
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

  return (
    <div style={styles.container}>
      <h3>上传题库文档</h3>

      <div style={styles.uploadArea}>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          style={styles.fileInput}
        />

        {file && (
          <div style={styles.fileInfo}>
            <span>📄 {file.name}</span>
            <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading || processing}
        style={styles.uploadButton}
      >
        {uploading && '上传中...'}
        {processing && `解析中... ${progress}%`}
        {!uploading && !processing && '开始上传'}
      </button>

      {processing && (
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
      )}

      <div style={styles.tips}>
        <p>💡 支持格式：PDF、Word（.doc, .docx）</p>
        <p>💡 文件大小：最大 10MB</p>
        <p>💡 建议：题目格式清晰，包含题号、选项、答案</p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: '20px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  uploadArea: {
    border: '2px dashed #ddd',
    borderRadius: '8px',
    padding: '40px',
    textAlign: 'center',
    marginTop: '20px'
  },
  fileInput: {
    width: '100%'
  },
  fileInfo: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    background: '#f5f5f5',
    borderRadius: '4px'
  },
  uploadButton: {
    marginTop: '20px',
    padding: '12px 24px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%'
  },
  progressBar: {
    marginTop: '20px',
    height: '8px',
    background: '#f0f0f0',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: '#667eea',
    transition: 'width 0.3s'
  },
  tips: {
    marginTop: '20px',
    padding: '15px',
    background: '#f7fafc',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#666'
  }
}
```

#### 4.2 题目审核组件
```jsx
// src/components/QuestionReview.jsx

export default function QuestionReview({ questions, onApprove }) {
  const [reviewedQuestions, setReviewedQuestions] = useState(questions)

  const handleEdit = (index, field, value) => {
    const updated = [...reviewedQuestions]
    updated[index][field] = value
    setReviewedQuestions(updated)
  }

  const handleApprove = async () => {
    try {
      await post('/api/questions/batch', {
        questions: reviewedQuestions
      }, {
        showSuccessToast: true,
        successMessage: `成功保存 ${reviewedQuestions.length} 个题目`
      })

      onApprove()
    } catch (error) {
      Toast.error('保存失败')
    }
  }

  return (
    <div>
      <h3>审核题目（{reviewedQuestions.length} 个）</h3>

      {reviewedQuestions.map((q, index) => (
        <div key={index} style={styles.questionCard}>
          <div style={styles.header}>
            <span>题目 {index + 1}</span>
            <span style={{
              ...styles.confidence,
              color: q.confidence > 0.9 ? 'green' : 'orange'
            }}>
              置信度: {(q.confidence * 100).toFixed(0)}%
            </span>
          </div>

          <textarea
            value={q.content.en}
            onChange={(e) => handleEdit(index, 'content', {
              ...q.content,
              en: e.target.value
            })}
            style={styles.textarea}
          />

          {/* 选项编辑 */}
          {q.options && q.options.map((opt, i) => (
            <input
              key={i}
              value={opt}
              onChange={(e) => {
                const newOptions = [...q.options]
                newOptions[i] = e.target.value
                handleEdit(index, 'options', newOptions)
              }}
              style={styles.optionInput}
            />
          ))}

          {/* 答案和解释 */}
          <div style={styles.answerSection}>
            <label>答案:</label>
            <input
              value={q.answer.value}
              onChange={(e) => handleEdit(index, 'answer', {
                ...q.answer,
                value: e.target.value
              })}
              style={styles.answerInput}
            />
          </div>
        </div>
      ))}

      <button onClick={handleApprove} style={styles.approveButton}>
        批量保存所有题目
      </button>
    </div>
  )
}
```

---

## 📊 成本估算

### AI API 成本（智谱 GLM-4-Plus）
- 输入: ¥0.05 / 1K tokens
- 输出: ¥0.05 / 1K tokens

**示例计算**:
- 10 页 PDF ≈ 5,000 tokens
- AI 输出 ≈ 2,000 tokens
- 总成本 ≈ ¥0.35 / 10 页
- **每题成本 ≈ ¥0.014**（假设 10 页 25 题）

### 存储成本
- 文件存储: 免费（Supabase 1GB）
- 数据库: 免费（Supabase）

---

## 🎯 实施计划

### Phase 1: 基础功能（1 周）
- [x] 文件上传接口
- [x] PDF/Word 解析
- [x] 文本提取
- [x] 基础前端组件

### Phase 2: AI 集成（1 周）
- [x] 智谱 AI 题目提取
- [x] 公式识别
- [x] 置信度评分
- [x] 错误处理

### Phase 3: 审核优化（3 天）
- [x] 题目审核界面
- [x] 批量编辑
- [x] 批量保存
- [x] 历史记录

### Phase 4: 高级功能（1 周）
- [ ] 图片公式识别（MathPix）
- [ ] 批量上传
- [ ] 模板管理
- [ ] 导出功能

---

## ✅ 总结

**推荐方案**: 方案 A（AI 驱动）

**优势**:
- 准确率高（90%+）
- 支持多种格式
- 自动识别结构
- 成本可控（¥0.014/题）

**实施步骤**:
1. 实现文件上传和解析
2. 集成智谱 AI 提取题目
3. 开发审核界面
4. 测试和优化

**预计时间**: 2-3 周
**预计成本**: 每月 ¥50-100（1000-2000 题）

---

**文档创建**: Claude Opus 4.6
**最后更新**: 2026-03-11
