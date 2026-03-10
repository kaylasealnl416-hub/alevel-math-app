import React from 'react'
import './Loading.css'

/**
 * Global Loading Component
 * 
 * Usage:
 * <Loading message="Loading..." size="medium" />
 * 
 * Sizes: small, medium, large
 */

function Loading({ message = 'Loading...', size = 'medium', fullScreen = false }) {
  const containerClass = fullScreen ? 'loading-container loading-fullscreen' : 'loading-container'

  return (
    <div className={containerClass}>
      <div className={`loading-spinner loading-${size}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  )
}

export default Loading
