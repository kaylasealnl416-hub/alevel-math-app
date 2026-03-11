import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名：时间戳-随机数-原文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    const basename = path.basename(file.originalname, ext)
    cb(null, `${basename}-${uniqueSuffix}${ext}`)
  }
})

// 文件过滤器
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword' // .doc
  ]

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('只支持 PDF 和 Word 文档（.pdf, .doc, .docx）'), false)
  }
}

// 创建 multer 实例
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
})

// 清理临时文件
export function cleanupFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      console.log(`🗑️  已删除临时文件: ${filePath}`)
    }
  } catch (error) {
    console.error(`❌ 删除文件失败: ${filePath}`, error)
  }
}

// 清理过期文件（超过 24 小时）
export function cleanupOldFiles() {
  try {
    const files = fs.readdirSync(uploadDir)
    const now = Date.now()
    const maxAge = 24 * 60 * 60 * 1000 // 24 小时

    files.forEach(file => {
      const filePath = path.join(uploadDir, file)
      const stats = fs.statSync(filePath)
      const age = now - stats.mtimeMs

      if (age > maxAge) {
        fs.unlinkSync(filePath)
        console.log(`🗑️  已删除过期文件: ${file}`)
      }
    })
  } catch (error) {
    console.error('❌ 清理过期文件失败:', error)
  }
}

// 每小时清理一次过期文件
setInterval(cleanupOldFiles, 60 * 60 * 1000)
