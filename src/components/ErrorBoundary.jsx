import React from 'react';

// ============================================================
// Error Boundary Component
// Catches React rendering errors and displays fallback UI
// ============================================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // chunk 加载失败时自动刷新页面（避免用户看到白屏）
    const isChunkError = error?.message && (
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Importing a module script failed') ||
      error.message.includes('Loading chunk') ||
      error.message.includes('ChunkLoadError')
    )
    if (isChunkError) {
      window.location.reload()
      return
    }

    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      const { fallback, retryEnabled = true } = this.props;

      // Custom fallback if provided
      if (fallback) {
        return fallback({
          error: this.state.error,
          retry: this.handleRetry
        });
      }

      // Default fallback UI
      return (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          background: '#fff5f5',
          borderRadius: '8px',
          margin: '20px',
          border: '1px solid #ffcccc'
        }}>
          <h2 style={{ color: '#d32f2f', marginBottom: '16px' }}>
            ⚠️ Something went wrong
          </h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            {this.state.error?.message || 'An unknown error occurred'}
          </p>
          {retryEnabled && (
            <button
              onClick={this.handleRetry}
              style={{
                padding: '10px 24px',
                background: '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Retry
            </button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
