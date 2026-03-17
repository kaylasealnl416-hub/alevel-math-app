// ============================================================
// Data source adapter — supports local data and API data simultaneously
// ============================================================

import { SUBJECTS as LOCAL_SUBJECTS } from './subjects.js'
import { subjectsAPI, chaptersAPI, USE_BACKEND_API } from '../utils/api.js'

/**
 * Data source adapter.
 * Automatically switches between local data and API data based on the environment.
 * Falls back to local data when API requests fail.
 */
class DataSource {
  constructor() {
    this.useAPI = USE_BACKEND_API
    this.cache = new Map()
    console.log(`📊 Data source mode: ${this.useAPI ? 'API' : 'LOCAL'}`)
  }

  /**
   * Get all subjects
   * @returns {Promise<Object>}
   */
  async getSubjects() {
    if (!this.useAPI) {
      console.log('📚 Using local subject data')
      return LOCAL_SUBJECTS
    }

    try {
      console.log('🌐 Fetching subjects from API...')
      const subjectsArray = await subjectsAPI.getAll()

      // Convert array to the object format expected by the frontend
      const subjects = {}
      for (const subject of subjectsArray) {
        subjects[subject.id] = subject
      }

      console.log(`✅ Fetched ${Object.keys(subjects).length} subjects`)
      return subjects
    } catch (error) {
      console.warn('⚠️ API request failed, falling back to local data:', error.message)
      return LOCAL_SUBJECTS
    }
  }

  /**
   * Get a single subject
   * @param {string} id - subject ID
   * @returns {Promise<Object>}
   */
  async getSubject(id) {
    if (!this.useAPI) {
      console.log(`📚 Using local subject data: ${id}`)
      return LOCAL_SUBJECTS[id]
    }

    // Check cache
    const cacheKey = `subject_${id}`
    if (this.cache.has(cacheKey)) {
      console.log(`💾 Serving subject from cache: ${id}`)
      return this.cache.get(cacheKey)
    }

    try {
      console.log(`🌐 Fetching subject from API: ${id}`)
      const subject = await subjectsAPI.getById(id)

      this.cache.set(cacheKey, subject)

      console.log(`✅ Fetched subject: ${subject.name.en || subject.name.zh}`)
      return subject
    } catch (error) {
      console.warn(`⚠️ API request failed, falling back to local data: ${id}`, error.message)
      return LOCAL_SUBJECTS[id]
    }
  }

  /**
   * Get a single chapter
   * @param {string} id - chapter ID
   * @returns {Promise<Object>}
   */
  async getChapter(id) {
    if (!this.useAPI) {
      // Search local data
      console.log(`📚 Looking up chapter in local data: ${id}`)
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

    // Check cache
    const cacheKey = `chapter_${id}`
    if (this.cache.has(cacheKey)) {
      console.log(`💾 Serving chapter from cache: ${id}`)
      return this.cache.get(cacheKey)
    }

    try {
      console.log(`🌐 Fetching chapter from API: ${id}`)
      const chapter = await chaptersAPI.getById(id)

      this.cache.set(cacheKey, chapter)

      console.log(`✅ Fetched chapter: ${chapter.title.en || chapter.title.zh}`)
      return chapter
    } catch (error) {
      console.warn(`⚠️ API request failed, falling back to local data: ${id}`, error.message)

      // Fallback: search local data
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
   * Clear the cache
   */
  clearCache() {
    this.cache.clear()
    console.log('🗑️ Cache cleared')
  }

  /**
   * Return the current data source mode
   */
  getMode() {
    return this.useAPI ? 'API' : 'LOCAL'
  }
}

// Singleton export
export const dataSource = new DataSource()

// Class export for testing
export { DataSource }
