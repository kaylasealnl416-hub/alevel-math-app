import React from 'react'
import ReactDOM from 'react-dom/client'
import ALevelMathApp, { ErrorBoundary } from './alevel-math-app.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ALevelMathApp />
    </ErrorBoundary>
  </React.StrictMode>
)
