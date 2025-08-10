/**
 * Error Boundary Component
 *
 * React error boundary that catches JavaScript errors anywhere in the child
 * component tree, logs those errors, and displays a fallback UI instead of
 * the component tree that crashed.
 *
 * Features:
 * - Catches and displays errors gracefully
 * - Shows detailed error information in development mode
 * - Provides reload functionality for error recovery
 * - Logs errors to console for debugging
 *
 * Usage: Wrap around components that might throw errors
 *
 * @author Insurance Dashboard Team
 * @version 2.0.0
 */

import React from 'react'

/**
 * ErrorBoundary Class Component
 * Catches errors in child components and displays fallback UI
 */
class ErrorBoundary extends React.Component {
  /**
   * Initialize error boundary state
   * @param {Object} props - Component props
   */
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  /**
   * Static method called when an error is thrown in a child component
   * Updates state to trigger fallback UI rendering
   * @param {Error} _error - The error that was thrown
   * @returns {Object} New state object
   */
  static getDerivedStateFromError(_error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  /**
   * Called when an error is caught by the error boundary
   * Logs error details and updates component state
   * @param {Error} error - The error that was thrown
   * @param {Object} errorInfo - Error information including component stack
   */
  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-message" style={{ 
          margin: '2rem',
          textAlign: 'center',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ marginBottom: '1rem', color: 'var(--error)' }}>
            Something went wrong
          </h2>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            An unexpected error occurred while loading this component.
          </p>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ 
              textAlign: 'left', 
              background: '#f8f9fa',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '1rem'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Error Details (Development)
              </summary>
              <pre style={{ 
                fontSize: '0.75rem',
                overflow: 'auto',
                marginTop: '0.5rem',
                color: 'var(--text-secondary)'
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
