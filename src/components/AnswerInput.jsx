// ============================================================
// AnswerInput Component
// Supports multiple question types for answer entry
// 含数学符号小键盘（calculation / fill_blank / proof / short_answer）
// ============================================================

import React, { useState, useEffect, useRef } from 'react'
import '../styles/AnswerInput.css'

// 数学符号列表
const MATH_SYMBOLS = ['√', '²', '³', '∫', 'θ', 'π', '≥', '≤', '≠', '×', '÷', '±', '∞', '→', '∑']

const AnswerInput = ({ question, value, onChange, disabled = false }) => {
  const [localValue, setLocalValue] = useState(value || '')
  const inputRef = useRef(null)

  useEffect(() => {
    setLocalValue(value || '')
  }, [value])

  const handleChange = (newValue) => {
    setLocalValue(newValue)
    onChange(newValue)
  }

  // 在光标位置插入符号（input 和 textarea 通用）
  const insertSymbol = (sym) => {
    const el = inputRef.current
    if (!el) {
      handleChange(localValue + sym)
      return
    }
    const start = el.selectionStart ?? localValue.length
    const end = el.selectionEnd ?? localValue.length
    const newVal = localValue.slice(0, start) + sym + localValue.slice(end)
    handleChange(newVal)
    // React 重渲染后恢复光标位置
    requestAnimationFrame(() => {
      if (el) {
        el.selectionStart = el.selectionEnd = start + sym.length
        el.focus()
      }
    })
  }

  // 数学符号工具栏（非 MCQ 题型共用）
  const MathSymbolBar = () => (
    <div className="math-symbol-bar">
      {MATH_SYMBOLS.map(sym => (
        <button
          key={sym}
          type="button"
          className="sym-btn"
          onMouseDown={(e) => { e.preventDefault(); insertSymbol(sym) }}
          disabled={disabled}
          title={sym}
        >
          {sym}
        </button>
      ))}
    </div>
  )

  // Multiple choice
  if (question.type === 'multiple_choice') {
    return (
      <div className="answer-input multiple-choice">
        <div className="answer-label">Select your answer:</div>
        <div className="choice-buttons">
          {['A', 'B', 'C', 'D'].map(option => (
            <button
              key={option}
              className={`choice-btn ${localValue === option ? 'selected' : ''}`}
              onClick={() => handleChange(option)}
              disabled={disabled}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Fill in the blank
  if (question.type === 'fill_blank') {
    return (
      <div className="answer-input fill-blank">
        <div className="answer-label">Fill in your answer:</div>
        <MathSymbolBar />
        <input
          ref={inputRef}
          type="text"
          className="answer-text-input"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Type your answer..."
          disabled={disabled}
        />
      </div>
    )
  }

  // Calculation
  if (question.type === 'calculation') {
    return (
      <div className="answer-input calculation">
        <div className="answer-label">Enter your working & result:</div>
        <MathSymbolBar />
        <textarea
          ref={inputRef}
          className="answer-textarea"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Show your working step by step, then state the final answer..."
          rows={5}
          disabled={disabled}
        />
        <div className="input-hint">
          💡 Show all working steps. Final answer on the last line.
        </div>
        <div className="textarea-counter">{localValue.length} chars</div>
      </div>
    )
  }

  // Short answer / proof
  if (question.type === 'short_answer' || question.type === 'proof') {
    return (
      <div className="answer-input short-answer">
        <div className="answer-label">Write your answer:</div>
        <MathSymbolBar />
        <textarea
          ref={inputRef}
          className="answer-textarea"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Type your answer here..."
          rows={6}
          disabled={disabled}
        />
        <div className="textarea-counter">
          {localValue.length} characters
        </div>
      </div>
    )
  }

  return null
}

export default AnswerInput
