/**
 * Enhanced Loading Spinner Component
 * Accessible, reusable loading indicator with ARIA support
 * Optimized for AI coding agents with comprehensive accessibility
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import './LoadingSpinner.css';

/**
 * LoadingSpinner Component
 * @param {Object} props - Component props
 * @param {string} props.message - Loading message to display
 * @param {string} props.size - Size variant ('sm', 'md', 'lg')
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.overlay - Whether to show as overlay
 * @param {string} props.ariaLabel - Custom aria-label for screen readers
 */
const LoadingSpinner = ({
  message = 'Loading...',
  size = 'md',
  className = '',
  overlay = false,
  ariaLabel
}) => {
  const sizeClasses = {
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg'
  };

  const spinnerClass = `loading-spinner ${sizeClasses[size]} ${overlay ? 'spinner-overlay' : ''} ${className}`;

  return (
    <div
      className={spinnerClass}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel || `Loading: ${message}`}
    >
      <Loader2
        className="spinner-icon"
        aria-hidden="true"
      />
      <p className="spinner-message" aria-hidden="true">
        {message}
      </p>
      <span className="sr-only">
        {ariaLabel || `Loading: ${message}`}
      </span>
    </div>
  );
};

export default LoadingSpinner;
