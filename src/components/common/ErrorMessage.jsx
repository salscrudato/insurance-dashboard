/**
 * Enhanced Error Message Component
 * Accessible error display with comprehensive user feedback
 * Optimized for AI coding agents with ARIA support and better UX
 */

import React from 'react';
import { AlertCircle, RefreshCw, Info, AlertTriangle } from 'lucide-react';
import './ErrorMessage.css';

/**
 * ErrorMessage Component
 * @param {Object} props - Component props
 * @param {string} props.message - Error message to display
 * @param {Function} props.onRetry - Retry callback function
 * @param {string} props.title - Error title (optional)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Error variant ('error', 'warning', 'info')
 * @param {boolean} props.dismissible - Whether error can be dismissed
 * @param {Function} props.onDismiss - Dismiss callback function
 */
const ErrorMessage = ({
  message,
  onRetry,
  title,
  className = '',
  variant = 'error',
  dismissible = false,
  onDismiss
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      default: return AlertCircle;
    }
  };

  const getDefaultTitle = () => {
    switch (variant) {
      case 'warning': return 'Warning';
      case 'info': return 'Information';
      default: return 'Error';
    }
  };

  const IconComponent = getIcon();
  const errorTitle = title || getDefaultTitle();

  return (
    <div
      className={`error-message error-${variant} ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="error-content">
        <IconComponent
          className="error-icon"
          aria-hidden="true"
        />
        <div className="error-text">
          <h3 className="error-title">{errorTitle}</h3>
          <p className="error-description">{message}</p>
        </div>
      </div>

      <div className="error-actions">
        {onRetry && (
          <button
            onClick={onRetry}
            className="error-retry-btn btn btn-secondary"
            aria-label={`Retry: ${errorTitle}`}
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        )}

        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="error-dismiss-btn btn btn-ghost"
            aria-label={`Dismiss: ${errorTitle}`}
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
