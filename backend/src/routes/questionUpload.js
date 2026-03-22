import { Hono } from 'hono'
import { cleanupFile } from '../middleware/upload.js'
import { requireAdmin } from '../middleware/auth.js'
import { parseDocument, splitTextIntoChunks } from '../services/documentParser.js'
import { extractQuestionsFromChunks, validateQuestion } from '../services/questionExtractor.js'
import { db } from '../db/index.js'
import { questions } from '../db/schema.js'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = new Hono()

// 所有上传相关路由需要管理员权限
app.use('/upload', requireAdmin())
app.use('/upload/*', requireAdmin())
app.use('/batch', requireAdmin())

// 存储上传任务状态（生产环境应使用 Redis）
const uploadTasks = new Map()

/**
 * 上传文件并开始解析
 */
app.post('/upload', async (c) => {
  try {
    // 获取 FormData
    const formData = await c.req.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return c.json({
        success: false,
        error: {
          code: 'NO_FILE',
          message: '请选择文件'
        }
      }, 400)
    }

    // 验证文件类型
    const allowedMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ]

    if (!allowedMimes.includes(file.type)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_FILE_TYPE',
          message: '只支持 PDF 和 Word 文档（.pdf, .doc, .docx）'
        }
      }, 400)
    }

    // 验证文件大小（50MB）
    if (file.size > 50 * 1024 * 1024) {
      return c.json({
        success: false,
        error: {
          code: 'FILE_TOO_LARGE',
          message: '文件大小不能超过 50MB'
        }
      }, 400)
    }

    // 保存文件到临时目录
    const uploadDir = path.join(__dirname, '../../uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.name)
    const basename = path.basename(file.name, ext)
    const filename = `${basename}-${uniqueSuffix}${ext}`
    const filePath = path.join(uploadDir, filename)

    // 写入文件
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    fs.writeFileSync(filePath, buffer)

    // 创建上传任务
    const uploadId = uuidv4()
    const task = {
      uploadId,
      filename: file.name,
      filePath: filePath,
      mimeType: file.type,
      size: file.size,
      status: 'processing',
      progress: 0,
      totalChunks: 0,
      processedChunks: 0,
      extractedQuestions: 0,
      questions: [],
      errors: [],
      createdAt: new Date()
    }

    uploadTasks.set(uploadId, task)

    // 异步处理文件
    processUploadedFile(uploadId).catch(error => {
      console.error('处理文件失败:', error)
      const task = uploadTasks.get(uploadId)
      if (task) {
        task.status = 'failed'
        task.errors.push(error.message)
      }
    })

    return c.json({
      success: true,
      data: {
        uploadId,
        filename: file.name,
        status: 'processing',
        estimatedTime: Math.ceil(file.size / 1024 / 100) // 粗略估计：100KB/秒
      }
    })

  } catch (error) {
    console.error('上传文件失败:', error)
    return c.json({
      success: false,
      error: {
        code: 'UPLOAD_FAILED',
        message: error.message
      }
    }, 500)
  }
})

/**
 * 查询上传任务状态
 */
app.get('/upload/:uploadId/status', (c) => {
  const { uploadId } = c.req.param()
  const task = uploadTasks.get(uploadId)

  if (!task) {
    return c.json({
      success: false,
      error: {
        code: 'TASK_NOT_FOUND',
        message: '任务不存在'
      }
    }, 404)
  }

  return c.json({
    success: true,
    data: {
      status: task.status,
      progress: task.progress,
      totalChunks: task.totalChunks,
      processedChunks: task.processedChunks,
      extractedQuestions: task.extractedQuestions,
      errors: task.errors
    }
  })
})

/**
 * 获取解析结果
 */
app.get('/upload/:uploadId/result', (c) => {
  const { uploadId } = c.req.param()
  const task = uploadTasks.get(uploadId)

  if (!task) {
    return c.json({
      success: false,
      error: {
        code: 'TASK_NOT_FOUND',
        message: '任务不存在'
      }
    }, 404)
  }

  if (task.status !== 'completed') {
    return c.json({
      success: false,
      error: {
        code: 'TASK_NOT_COMPLETED',
        message: '任务尚未完成'
      }
    }, 400)
  }

  return c.json({
    success: true,
    data: {
      questions: task.questions
    }
  })
})

/**
 * 批量保存题目
 */
app.post('/batch', async (c) => {
  try {
    const body = await c.req.json()
    const { questions: questionsToSave, chapterId } = body

    if (!questionsToSave || !Array.isArray(questionsToSave)) {
      return c.json({
        success: false,
        error: {
          code: 'INVALID_DATA',
          message: '题目数据格式不正确'
        }
      }, 400)
    }

    const results = {
      created: 0,
      failed: 0,
      errors: []
    }

    for (const question of questionsToSave) {
      try {
        // 验证题目格式
        const validation = validateQuestion(question)
        if (!validation.valid) {
          results.failed++
          results.errors.push({
            question: question.content?.text?.substring(0, 50),
            errors: validation.errors
          })
          continue
        }

        // 转换为数据库格式
        const dbQuestion = {
          chapterId: chapterId || question.chapterId,
          type: question.type,
          content: question.content,
          options: question.options || null,
          answer: question.answer,
          difficulty: question.difficulty || 3,
          tags: question.tags || [],
          createdAt: new Date(),
          updatedAt: new Date()
        }

        await db.insert(questions).values(dbQuestion)
        results.created++

      } catch (error) {
        console.error('保存题目失败:', error)
        results.failed++
        results.errors.push({
          question: question.content?.text?.substring(0, 50),
          error: error.message
        })
      }
    }

    return c.json({
      success: true,
      data: results
    })

  } catch (error) {
    console.error('批量保存题目失败:', error)
    return c.json({
      success: false,
      error: {
        code: 'BATCH_SAVE_FAILED',
        message: error.message
      }
    }, 500)
  }
})

/**
 * 处理上传的文件（异步）
 */
async function processUploadedFile(uploadId) {
  const task = uploadTasks.get(uploadId)
  if (!task) return

  try {
    // 1. 解析文档
    console.log(`📄 开始解析文档: ${task.filename}`)
    const parsed = await parseDocument(task.filePath, task.mimeType)

    // 2. 分割文本
    console.log(`✂️  分割文本为多个块...`)
    const chunks = splitTextIntoChunks(parsed.text, 3000)
    task.totalChunks = chunks.length
    console.log(`📦 共分割为 ${chunks.length} 块`)

    // 3. 提取题目
    console.log(`🤖 开始 AI 提取题目...`)
    const questions = await extractQuestionsFromChunks(chunks, (progress) => {
      task.processedChunks = progress.current
      task.extractedQuestions = progress.extractedQuestions
      task.progress = Math.round((progress.current / progress.total) * 100)
    })

    // 4. 完成
    task.status = 'completed'
    task.progress = 100
    task.questions = questions
    task.extractedQuestions = questions.length

    console.log(`✅ 文档处理完成: 提取 ${questions.length} 个题目`)

    // 5. 清理临时文件
    cleanupFile(task.filePath)

  } catch (error) {
    console.error('处理文件失败:', error)
    task.status = 'failed'
    task.errors.push(error.message)

    // 清理临时文件
    cleanupFile(task.filePath)
  }
}

export default app
