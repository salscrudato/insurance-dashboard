/**
 * Main App Component
 * Simplified and optimized for AI coding agents
 * Clean architecture with error boundaries and modern dashboard
 */

import './App.css'
import React from 'react'
import Dashboard from './components/Dashboard.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

/**
 * Main App Component
 * Simplified entry point with error boundary
 */
export default function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    </div>
  )
}

