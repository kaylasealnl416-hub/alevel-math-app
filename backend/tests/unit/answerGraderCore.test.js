import { describe, expect, test } from 'bun:test'
import {
  gradeCalculation,
  gradeFillBlank,
  gradeMultipleChoice,
  normalizeMathAnswer
} from '../../src/services/answerGraderCore.js'

describe('answerGraderCore', () => {
  test('gradeMultipleChoice supports plain string answers', () => {
    const result = gradeMultipleChoice(
      { answer: { value: 'B', explanation: 'Because B is correct.' } },
      'b'
    )

    expect(result.isCorrect).toBe(true)
    expect(result.score).toBe(10)
  })

  test('gradeMultipleChoice supports object answers', () => {
    const result = gradeMultipleChoice(
      { answer: { value: 'C' } },
      { answer: 'A' }
    )

    expect(result.isCorrect).toBe(false)
    expect(result.score).toBe(0)
  })

  test('gradeFillBlank compares answers case-insensitively', () => {
    const result = gradeFillBlank(
      { answer: { value: 'Equilibrium' } },
      { value: ' equilibrium ' }
    )

    expect(result.isCorrect).toBe(true)
    expect(result.score).toBe(10)
  })

  test('normalizeMathAnswer strips spaces and latex wrappers', () => {
    expect(normalizeMathAnswer(' $3.0$ ')).toBe('3')
    expect(normalizeMathAnswer(' 2.50 ')).toBe('2.50')
  })

  test('gradeCalculation accepts equivalent numeric answers within tolerance', () => {
    const result = gradeCalculation(
      { answer: { value: '3' }, explanation: 'Solved value.' },
      '3.009'
    )

    expect(result.isCorrect).toBe(true)
    expect(result.score).toBe(10)
  })

  test('gradeCalculation rejects materially different numeric answers', () => {
    const result = gradeCalculation(
      { answer: { value: '3' } },
      { answer: '3.2' }
    )

    expect(result.isCorrect).toBe(false)
    expect(result.score).toBe(0)
  })
})
