/**
 * Data Quality Indicator Component
 * 
 * Visual indicator for data quality and validation status
 * Provides users with confidence in the displayed financial data
 * 
 * Features:
 * - Real-time quality assessment
 * - Multi-source validation display
 * - Industry benchmark comparison
 * - Accessibility compliant
 */

import React, { useState } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Shield,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import './DataQualityIndicator.css';

/**
 * DataQualityIndicator Component
 * @param {Object} props - Component props
 * @param {Object} props.validation - Validation results from dataValidationService
 * @param {Object} props.quickCheck - Quick quality check results
 * @param {boolean} props.compact - Whether to show compact version
 */
const DataQualityIndicator = ({ 
  validation, 
  quickCheck, 
  compact = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!validation && !quickCheck) {
    return null;
  }

  const getQualityIcon = (quality) => {
    switch (quality) {
      case 'excellent':
      case 'complete':
        return CheckCircle;
      case 'good':
      case 'partial':
        return AlertTriangle;
      case 'fair':
        return Info;
      case 'poor':
      case 'incomplete':
      case 'error':
        return XCircle;
      default:
        return Shield;
    }
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'excellent':
      case 'complete':
        return 'success';
      case 'good':
      case 'partial':
        return 'warning';
      case 'fair':
        return 'info';
      case 'poor':
      case 'incomplete':
      case 'error':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const quality = validation?.dataQuality || quickCheck?.quality || 'unknown';
  const score = validation?.overallScore || 0;
  const IconComponent = getQualityIcon(quality);
  const colorClass = getQualityColor(quality);

  if (compact) {
    return (
      <div className={`quality-indicator compact quality-${colorClass}`}>
        <IconComponent size={16} className="quality-icon" />
        <span className="quality-score">{score}%</span>
      </div>
    );
  }

  return (
    <div className={`quality-indicator quality-${colorClass}`}>
      <div className="quality-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="quality-main">
          <IconComponent size={20} className="quality-icon" />
          <div className="quality-info">
            <div className="quality-title">
              Data Quality: {quality.charAt(0).toUpperCase() + quality.slice(1)}
            </div>
            <div className="quality-subtitle">
              Score: {score}% | {validation?.validations?.length || 0} validations
            </div>
          </div>
        </div>
        <button 
          className="expand-button"
          aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {isExpanded && (
        <div className="quality-details">
          {/* Validation Results */}
          {validation?.validations?.length > 0 && (
            <div className="validation-section">
              <h4>Validations</h4>
              <ul className="validation-list">
                {validation.validations.map((item, index) => (
                  <li key={index} className={`validation-item rating-${item.rating}`}>
                    <span className="metric-name">{item.metric}</span>
                    <span className="metric-value">{item.value}%</span>
                    <span className="metric-rating">{item.rating}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Data Sources */}
          {validation?.sources?.length > 0 && (
            <div className="sources-section">
              <h4>Data Sources</h4>
              <ul className="sources-list">
                {validation.sources.map((source, index) => (
                  <li key={index} className={`source-item status-${source.status}`}>
                    <span className="source-name">{source.name}</span>
                    <span className="source-status">{source.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {validation?.warnings?.length > 0 && (
            <div className="warnings-section">
              <h4>Warnings</h4>
              <ul className="warnings-list">
                {validation.warnings.slice(0, 3).map((warning, index) => (
                  <li key={index} className="warning-item">
                    {warning.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {validation?.recommendations?.length > 0 && (
            <div className="recommendations-section">
              <h4>Recommendations</h4>
              <ul className="recommendations-list">
                {validation.recommendations.slice(0, 2).map((rec, index) => (
                  <li key={index} className="recommendation-item">
                    {rec.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataQualityIndicator;
