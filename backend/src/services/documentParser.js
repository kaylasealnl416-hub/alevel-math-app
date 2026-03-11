import fs from 'fs'
import mammoth from 'mammoth'
import { PDFExtract } from 'pdf.js-extract'

const pdfExtract = new PDFExtract()

/**
 * 解析 PDF 文档
 */
export async function parsePDF(filePath) {
  try {
    const data = await pdfExtract.extract(filePath, {})

    // 提取所有页面的文本
    const pages = data.pages.map(page => {
      return page.content
        .map(item => item.str)
        .join(' ')
    })

    const fullText = pages.join('\n\n')

    return {
      text: fullText,
      pages: data.pages.length,
      pageTexts: pages
    }
  } catch (error) {
    console.error('PDF 解析失败:', error)
    throw new Error(`PDF 解析失败: ${error.message}`)
  }
}

/**
 * 解析 Word 文档
 */
export async function parseWord(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath })

    return {
      text: result.value,
      messages: result.messages,
      pages: 1 // Word 没有页面概念，设为 1
    }
  } catch (error) {
    console.error('Word 解析失败:', error)
    throw new Error(`Word 解析失败: ${error.message}`)
  }
}

/**
 * 根据文件类型解析文档
 */
export async function parseDocument(filePath, mimeType) {
  console.log(`📄 开始解析文档: ${filePath}`)
  console.log(`📝 文件类型: ${mimeType}`)

  let result

  if (mimeType === 'application/pdf') {
    result = await parsePDF(filePath)
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    result = await parseWord(filePath)
  } else {
    throw new Error('不支持的文件类型')
  }

  console.log(`✅ 文档解析完成: ${result.pages} 页, ${result.text.length} 字符`)

  return result
}

/**
 * 将长文本分割成多个块（避免 AI API token 限制）
 */
export function splitTextIntoChunks(text, maxChunkSize = 3000) {
  const chunks = []
  let currentChunk = ''

  // 按段落分割
  const paragraphs = text.split(/\n\n+/)

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim())
        currentChunk = ''
      }

      // 如果单个段落超过限制，强制分割
      if (paragraph.length > maxChunkSize) {
        const words = paragraph.split(/\s+/)
        for (const word of words) {
          if (currentChunk.length + word.length > maxChunkSize) {
            chunks.push(currentChunk.trim())
            currentChunk = word
          } else {
            currentChunk += ' ' + word
          }
        }
      } else {
        currentChunk = paragraph
      }
    } else {
      currentChunk += '\n\n' + paragraph
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim())
  }

  return chunks
}
