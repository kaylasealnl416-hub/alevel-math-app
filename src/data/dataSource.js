// ============================================================
// 数据源适配层 - 支持本地数据和API数据双轨运行
// ============================================================

import { SUBJECTS as LOCAL_SUBJECTS } from './subjects.js'
import { subjectsAPI, chaptersAPI, USE_BACKEND_API } from '../utils/api.js'

/**
 * 数据源适配器
 * 根据环境变量自动切换本地数据或API数据
 * 提供降级策略：API失败时自动使用本地数据
 */
class DataSource {
  constructor() {
    this.useAPI = USE_BACKEND_API
    this.cache = new Map()
    console.log(`📊 数据源模式: ${this.useAPI ? 'API' : '本地数据'}`)
  }

  /**
   * 获取所有科目
   * @returns {Promise<Object>} 科目对象
   */
  async getSubjects() {
    if (!this.useAPI) {
      console.log('📚 使用本地科目数据')
      return LOCAL_SUBJECTS
    }

    try {
      console.log('🌐 从API获取科目数据...')
      const subjectsArray = await subjectsAPI.getAll()

      // 转换为前端期望的对象格式
      const subjects = {}
      for (const subject of subjectsArray) {
        subjects[subject.id] = subject
      }

      console.log(`✅ 成功获取 ${Object.keys(subjects).length} 个科目`)
      return subjects
    } catch (error) {
      console.warn('⚠️ API请求失败，降级到本地数据:', error.message)
      return LOCAL_SUBJECTS
    }
  }

  /**
   * 获取单个科目详情
   * @param {string} id - 科目ID
   * @returns {Promise<Object>} 科目详情
   */
  async getSubject(id) {
    if (!this.useAPI) {
      console.log(`📚 使用本地科目数据: ${id}`)
      return LOCAL_SUBJECTS[id]
    }

    // 检查缓存
    const cacheKey = `subject_${id}`
    if (this.cache.has(cacheKey)) {
      console.log(`💾 从缓存获取科目: ${id}`)
      return this.cache.get(cacheKey)
    }

    try {
      console.log(`🌐 从API获取科目详情: ${id}`)
      const subject = await subjectsAPI.getById(id)

      // 缓存数据
      this.cache.set(cacheKey, subject)

      console.log(`✅ 成功获取科目: ${subject.name.zh}`)
      return subject
    } catch (error) {
      console.warn(`⚠️ API请求失败，降级到本地数据: ${id}`, error.message)
      return LOCAL_SUBJECTS[id]
    }
  }

  /**
   * 获取章节详情
   * @param {string} id - 章节ID
   * @returns {Promise<Object>} 章节详情
   */
  async getChapter(id) {
    if (!this.useAPI) {
      // 从本地数据中查找章节
      console.log(`📚 从本地数据查找章节: ${id}`)
      for (const subject of Object.values(LOCAL_SUBJECTS)) {
        if (subject.books) {
          for (const unit of Object.values(subject.books)) {
            if (unit.chapters) {
              const chapter = unit.chapters.find(ch => ch.id === id)
              if (chapter) {
                return chapter
              }
            }
          }
        }
      }
      return null
    }

    // 检查缓存
    const cacheKey = `chapter_${id}`
    if (this.cache.has(cacheKey)) {
      console.log(`💾 从缓存获取章节: ${id}`)
      return this.cache.get(cacheKey)
    }

    try {
      console.log(`🌐 从API获取章节详情: ${id}`)
      const chapter = await chaptersAPI.getById(id)

      // 缓存数据
      this.cache.set(cacheKey, chapter)

      console.log(`✅ 成功获取章节: ${chapter.title.zh}`)
      return chapter
    } catch (error) {
      console.warn(`⚠️ API请求失败，降级到本地数据: ${id}`, error.message)

      // 降级：从本地数据查找
      for (const subject of Object.values(LOCAL_SUBJECTS)) {
        if (subject.books) {
          for (const unit of Object.values(subject.books)) {
            if (unit.chapters) {
              const chapter = unit.chapters.find(ch => ch.id === id)
              if (chapter) {
                return chapter
              }
            }
          }
        }
      }
      return null
    }
  }

  /**
   * 清空缓存
   */
  clearCache() {
    this.cache.clear()
    console.log('🗑️ 缓存已清空')
  }

  /**
   * 获取当前数据源模式
   */
  getMode() {
    return this.useAPI ? 'API' : 'LOCAL'
  }
}

// 导出单例
export const dataSource = new DataSource()

// 导出类（用于测试）
export { DataSource }
