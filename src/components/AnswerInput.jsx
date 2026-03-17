// ============================================================
// AnswerInput Component
// Supports multiple question types for answer entry
// ============================================================

import React, { useState, useEffect } from 'react'
import '../styles/AnswerInput.css'

const AnswerInput = ({ question, value, onChange, disabled = false }) => {
  const [localValue, setLocalValue] = useState(value || '')

  useEffect(() => {
    setLocalValue(value || '')
  }, [value])

  const handleChange = (newValue) => {
    setLocalValue(newValue)
    onChange(newValue)
  }

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
        <input
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
        <div className="answer-label">Enter your result:</div>
        <input
          type="text"
          className="answer-text-input"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter a number or expression..."
          disabled={disabled}
        />
        <div className="input-hint">
          💡 You can enter a number, fraction, or mathematical expression
        </div>
      </div>
    )
  }

  // Short answer / proof
  if (question.type === 'short_answer' || question.type === 'proof') {
    return (
      <div className="answer-input short-answer">
        <div className="answer-label">Write your answer:</div>
        <textarea
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
