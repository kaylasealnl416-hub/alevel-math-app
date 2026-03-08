// ============================================================
// 计时器组件
// 显示答题时间，支持倒计时和正计时
// ============================================================

import React, { useState, useEffect, useRef } from 'react'
import '../styles/Timer.css'

const Timer = ({ timeLimit = null, onTimeUp = null, paused = false }) => {
  const [elapsedTime, setElapsedTime] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (paused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1

        // 倒计时模式：检查是否时间到
        if (timeLimit && newTime >= timeLimit) {
          clearInterval(intervalRef.current)
          if (onTimeUp) {
            onTimeUp()
          }
          return timeLimit
        }

        return newTime
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [paused, timeLimit, onTimeUp])

  // 格式化时间显示
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`
  }

  // 计算剩余时间（倒计时模式）
  const remainingTime = timeLimit ? timeLimit - elapsedTime : null
  const isCountdown = timeLimit !== null

  // 计算进度百分比（倒计时模式）
  const progress = isCountdown ? (elapsedTime / timeLimit) * 100 : 0

  // 判断是否接近时间限制（最后 5 分钟）
  const isWarning = isCountdown && remainingTime <= 300 && remainingTime > 60
  const isDanger = isCountdown && remainingTime <= 60

  return (
    <div className={`timer ${isCountdown ? 'countdown' : 'stopwatch'} ${isWarning ? 'warning' : ''} ${isDanger ? 'danger' : ''}`}>
      <div className="timer-icon">
        {paused ? '⏸️' : '⏱️'}
      </div>
      <div className="timer-display">
        {isCountdown ? (
          <>
            <div className="timer-label">剩余时间</div>
            <div className="timer-value">{formatTime(remainingTime)}</div>
          </>
        ) : (
          <>
            <div className="timer-label">已用时间</div>
            <div className="timer-value">{formatTime(elapsedTime)}</div>
          </>
        )}
      </div>
      {isCountdown && (
        <div className="timer-progress">
          <div
            className="timer-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default Timer
