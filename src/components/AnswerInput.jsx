// ============================================================
// 答题输入组件
// 支持多种题型的答案输入
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

  // 选择题输入
  if (question.type === 'multiple_choice') {
    return (
      <div className="answer-input multiple-choice">
        <div className="answer-label">请选择答案：</div>
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

  // 填空题输入
  if (question.type === 'fill_blank') {
    return (
      <div className="answer-input fill-blank">
        <div className="answer-label">请填写答案：</div>
        <input
          type="text"
          className="answer-text-input"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="输入答案..."
          disabled={disabled}
        />
      </div>
    )
  }

  // 计算题输入
  if (question.type === 'calculation') {
    return (
      <div className="answer-input calculation">
        <div className="answer-label">请输入计算结果：</div>
        <input
          type="text"
          className="answer-text-input"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="输入数值或表达式..."
          disabled={disabled}
        />
        <div className="input-hint">
          💡 提示：可以输入数字、分数或数学表达式
        </div>
      </div>
    )
  }

  // 简答题/证明题输入
  if (question.type === 'short_answer' || question.type === 'proof') {
    return (
      <div className="answer-input short-answer">
        <div className="answer-label">请输入答案：</div>
        <textarea
          className="answer-textarea"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="输入你的答案..."
          rows={6}
          disabled={disabled}
        />
        <div className="textarea-counter">
          {localValue.length} 字
        </div>
      </div>
    )
  }

  return null
}

export default AnswerInput
