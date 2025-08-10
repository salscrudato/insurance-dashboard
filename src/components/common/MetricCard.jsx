/**
 * Enhanced Metric Card Component
 * 
 * Professional financial metric display with interactive features
 * Optimized for P&C insurance industry standards
 * 
 * Features:
 * - Industry benchmark comparison
 * - Interactive hover states
 * - Trend indicators
 * - Accessibility support
 * - Performance rating visualization
 */

import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Info,
  Target,
  Award,
  AlertTriangle
} from 'lucide-react';
import './MetricCard.css';

/**
 * Get performance rating based on metric value and industry benchmarks
 * @param {string} metricName - Name of the metric
 * @param {number} value - Metric value
 * @returns {Object} Rating information
 */
const getPerformanceRating = (metricName, value) => {
  const benchmarks = {
    combinedRatio: {
      excellent: { max: 95, color: 'success', icon: Award },
      good: { max: 100, color: 'primary', icon: Target },
      fair: { max: 105, color: 'warning', icon: Info },
      poor: { max: 120, color: 'danger', icon: AlertTriangle }
    },
    roe: {
      excellent: { min: 15, color: 'success', icon: Award },
      good: { min: 10, color: 'primary', icon: Target },
      fair: { min: 7, color: 'warning', icon: Info },
      poor: { min: 0, color: 'danger', icon: AlertTriangle }
    },
    lossRatio: {
      excellent: { max: 65, color: 'success', icon: Award },
      good: { max: 75, color: 'primary', icon: Target },
      fair: { max: 85, color: 'warning', icon: Info },
      poor: { max: 95, color: 'danger', icon: AlertTriangle }
    },
    expenseRatio: {
      excellent: { max: 25, color: 'success', icon: Award },
      good: { max: 30, color: 'primary', icon: Target },
      fair: { max: 35, color: 'warning', icon: Info },
      poor: { max: 45, color: 'danger', icon: AlertTriangle }
    }
  };

  const metric = benchmarks[metricName];
  if (!metric || typeof value !== 'number') {
    return { rating: 'unknown', color: 'neutral', icon: Info };
  }

  // For metrics where lower is better (combinedRatio, lossRatio, expenseRatio)
  if (metricName === 'combinedRatio' || metricName === 'lossRatio' || metricName === 'expenseRatio') {
    if (value <= metric.excellent.max) return { rating: 'excellent', ...metric.excellent };
    if (value <= metric.good.max) return { rating: 'good', ...metric.good };
    if (value <= metric.fair.max) return { rating: 'fair', ...metric.fair };
    if (value <= metric.poor.max) return { rating: 'poor', ...metric.poor };
    return { rating: 'critical', color: 'danger', icon: AlertTriangle };
  }

  // For metrics where higher is better (ROE)
  if (value >= metric.excellent.min) return { rating: 'excellent', ...metric.excellent };
  if (value >= metric.good.min) return { rating: 'good', ...metric.good };
  if (value >= metric.fair.min) return { rating: 'fair', ...metric.fair };
  if (value >= metric.poor.min) return { rating: 'poor', ...metric.poor };
  return { rating: 'critical', color: 'danger', icon: AlertTriangle };
};

/**
 * MetricCard Component
 * @param {Object} props - Component props
 * @param {string} props.title - Metric title
 * @param {number} props.value - Metric value
 * @param {string} props.unit - Unit of measurement (%, $, etc.)
 * @param {string} props.metricName - Internal metric name for benchmarking
 * @param {number} props.previousValue - Previous period value for trend
 * @param {string} props.description - Metric description
 * @param {Object} props.icon - Lucide icon component
 * @param {boolean} props.interactive - Whether card should be interactive
 */
const MetricCard = ({
  title,
  value,
  unit = '%',
  metricName,
  previousValue,
  description,
  icon: IconComponent,
  interactive = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Calculate trend
  const trend = previousValue && typeof previousValue === 'number' 
    ? value > previousValue ? 'up' : value < previousValue ? 'down' : 'stable'
    : 'stable';

  const trendChange = previousValue 
    ? Math.abs(((value - previousValue) / previousValue) * 100)
    : 0;

  // Get performance rating
  const performance = getPerformanceRating(metricName, value);
  const PerformanceIcon = performance.icon;

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Minus;
    }
  };

  const TrendIcon = getTrendIcon();

  const handleCardClick = () => {
    if (interactive) {
      setShowDetails(!showDetails);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div 
      className={`metric-card rating-${performance.rating} ${interactive ? 'interactive' : ''} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      onKeyPress={handleKeyPress}
      tabIndex={interactive ? 0 : -1}
      role={interactive ? 'button' : 'article'}
      aria-expanded={interactive ? showDetails : undefined}
      aria-describedby={`metric-${metricName}-desc`}
    >
      {/* Card Header */}
      <div className="metric-header">
        <div className="metric-icon-container">
          {IconComponent && <IconComponent className="metric-icon" size={20} />}
        </div>
        <div className="metric-title-container">
          <h3 className="metric-title">{title}</h3>
          <div className="metric-performance">
            <PerformanceIcon className="performance-icon" size={14} />
            <span className="performance-label">{performance.rating}</span>
          </div>
        </div>
      </div>

      {/* Main Value */}
      <div className="metric-value-container">
        <div className="metric-value">
          {typeof value === 'number' ? value.toFixed(1) : '--'}
          <span className="metric-unit">{unit}</span>
        </div>
        
        {/* Trend Indicator */}
        {trend !== 'stable' && (
          <div className={`metric-trend trend-${trend}`}>
            <TrendIcon size={16} className="trend-icon" />
            <span className="trend-value">
              {trendChange.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="metric-progress">
        <div 
          className={`progress-bar rating-${performance.rating}`}
          style={{ 
            width: `${Math.min(100, Math.max(10, (value / 150) * 100))}%` 
          }}
        />
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <div className="metric-details" id={`metric-${metricName}-desc`}>
          <p className="metric-description">{description}</p>
          
          {previousValue && (
            <div className="metric-comparison">
              <span className="comparison-label">Previous:</span>
              <span className="comparison-value">
                {previousValue.toFixed(1)}{unit}
              </span>
            </div>
          )}
          
          <div className="metric-benchmark">
            <span className="benchmark-label">Industry Rating:</span>
            <span className={`benchmark-rating rating-${performance.rating}`}>
              {performance.rating.charAt(0).toUpperCase() + performance.rating.slice(1)}
            </span>
          </div>
        </div>
      )}

      {/* Hover Tooltip */}
      {isHovered && !showDetails && description && (
        <div className="metric-tooltip" role="tooltip">
          {description}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
