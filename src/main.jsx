import React from 'react'
import ReactDOM from 'react-dom/client'
import ALevelMathApp from './alevel-math-app.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ALevelMathApp />
    </ErrorBoundary>
  </React.StrictMode>
)
