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
