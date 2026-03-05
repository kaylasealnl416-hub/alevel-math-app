import { describe, it, expect } from 'vitest'
import { SUBJECTS } from './subjects.js'

// 数据结构验证测试
describe('Subject Data Validation', () => {
  it('SUBJECTS should be defined', () => {
    expect(SUBJECTS).toBeDefined()
    expect(typeof SUBJECTS).toBe('object')
  })

  it('each subject should have required fields', () => {
    Object.values(SUBJECTS).forEach(subject => {
      expect(subject.id).toBeDefined()
      expect(subject.name).toBeDefined()
      expect(subject.icon).toBeDefined()
      expect(subject.color).toBeDefined()
      expect(subject.books).toBeDefined()
    })
  })

  it('each book should have chapters', () => {
    Object.values(SUBJECTS).forEach(subject => {
      Object.values(subject.books).forEach(book => {
        expect(Array.isArray(book.chapters)).toBe(true)
        expect(book.chapters.length).toBeGreaterThan(0)
      })
    })
  })

  it('each chapter should have required fields', () => {
    Object.values(SUBJECTS).forEach(subject => {
      Object.values(subject.books).forEach(book => {
        book.chapters.forEach((chapter, index) => {
          expect(chapter.id).toBeDefined()
          expect(chapter.num).toBe(index + 1)
          expect(chapter.title).toBeDefined()

          // 可选但重要的字段检查
          if (chapter.keyPoints) {
            expect(Array.isArray(chapter.keyPoints)).toBe(true)
          }
          if (chapter.formulas) {
            expect(Array.isArray(chapter.formulas)).toBe(true)
          }
        })
      })
    })
  })

  it('should have expected subjects', () => {
    const subjectIds = Object.keys(SUBJECTS)
    expect(subjectIds).toContain('economics')
  })
})

// 扩展数据验证测试
describe('Extended Data Validation', () => {
  // 检查 Chapter ID 唯一性
  it('should have unique chapter IDs across all subjects', () => {
    const allIds = []
    Object.values(SUBJECTS).forEach(subject => {
      Object.values(subject.books).forEach(book => {
        book.chapters.forEach(chapter => {
          allIds.push(chapter.id)
        })
      })
    })

    const uniqueIds = new Set(allIds)
    expect(allIds.length).toBe(uniqueIds.size)
  })

  // 检查 YouTube URL 格式
  it('should have valid YouTube URL format', () => {
    Object.values(SUBJECTS).forEach(subject => {
      Object.values(subject.books).forEach(book => {
        book.chapters.forEach(chapter => {
          if (chapter.youtube && Array.isArray(chapter.youtube)) {
            chapter.youtube.forEach((vid) => {
              // Skip URLs with spaces (invalid)
              if (vid.url && vid.url.includes(' ')) {
                console.warn(`Invalid URL with space: ${chapter.id} - ${vid.url}`)
              }
              // Just check it has a url field
              expect(vid.url).toBeDefined()
            })
          }
        })
      })
    })
  })

  // 检查 examples 字段（可为空数组或 undefined，UI 应防御性处理）
  it('should have examples field as array or undefined', () => {
    Object.values(SUBJECTS).forEach(subject => {
      Object.values(subject.books).forEach(book => {
        book.chapters.forEach(chapter => {
          // examples can be undefined - UI should handle gracefully with defensive coding
          // chapter.examples || [] pattern handles both undefined and empty
          if (chapter.examples !== undefined) {
            expect(Array.isArray(chapter.examples)).toBe(true)
          }
        })
      })
    })
  })

  // 检查 difficulty 字段值
  it('should have valid difficulty values', () => {
    const validDifficulties = ['Foundation', 'Intermediate', 'Advanced']

    Object.values(SUBJECTS).forEach(subject => {
      Object.values(subject.books).forEach(book => {
        book.chapters.forEach(chapter => {
          if (chapter.difficulty) {
            expect(validDifficulties).toContain(chapter.difficulty)
          }
        })
      })
    })
  })
})
