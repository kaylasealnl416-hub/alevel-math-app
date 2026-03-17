// ============================================================
// Timer Component
// Displays elapsed or remaining time; supports countdown mode
// ============================================================

import React, { useState, useEffect, useRef } from 'react'
import '../styles/Timer.css'
import { formatDuration } from '../utils/helpers.js'

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

        // Countdown mode: check if time is up
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

  const remainingTime = timeLimit ? timeLimit - elapsedTime : null
  const isCountdown = timeLimit !== null
  const progress = isCountdown ? (elapsedTime / timeLimit) * 100 : 0
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
            <div className="timer-label">Time remaining</div>
            <div className="timer-value">{formatDuration(remainingTime)}</div>
          </>
        ) : (
          <>
            <div className="timer-label">Time elapsed</div>
            <div className="timer-value">{formatDuration(elapsedTime)}</div>
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
