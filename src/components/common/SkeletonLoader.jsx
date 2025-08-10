/**
 * Skeleton Loader Component
 * 
 * Modern skeleton loading screens for better perceived performance
 * Provides visual feedback while data is loading
 * 
 * Features:
 * - Multiple skeleton variants for different content types
 * - Smooth shimmer animation
 * - Responsive design
 * - Accessibility support
 */

import React from 'react';
import './SkeletonLoader.css';

/**
 * Base Skeleton Component
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.width - Width of skeleton
 * @param {string} props.height - Height of skeleton
 * @param {boolean} props.circle - Whether skeleton should be circular
 */
const Skeleton = ({ 
  className = '', 
  width = '100%', 
  height = '1rem',
  circle = false 
}) => {
  return (
    <div 
      className={`skeleton ${circle ? 'skeleton-circle' : ''} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
};

/**
 * Dashboard Skeleton Loader
 * Mimics the main dashboard layout while loading
 */
export const DashboardSkeleton = () => {
  return (
    <div className="skeleton-dashboard" aria-label="Loading dashboard">
      {/* Header Skeleton */}
      <div className="skeleton-header">
        <div className="skeleton-title-section">
          <Skeleton width="300px" height="32px" />
          <Skeleton width="200px" height="16px" />
        </div>
        <div className="skeleton-actions">
          <Skeleton width="100px" height="36px" />
          <Skeleton width="120px" height="36px" />
        </div>
      </div>

      {/* Controls Skeleton */}
      <div className="skeleton-controls">
        <Skeleton width="100%" height="48px" />
      </div>

      {/* Navigation Skeleton */}
      <div className="skeleton-nav">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} width="140px" height="44px" />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="skeleton-content">
        <div className="skeleton-metrics-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="skeleton-metric-card">
              <div className="skeleton-metric-header">
                <Skeleton circle width="24px" height="24px" />
                <Skeleton width="120px" height="16px" />
              </div>
              <Skeleton width="80px" height="28px" />
              <Skeleton width="100px" height="14px" />
            </div>
          ))}
        </div>
        
        <div className="skeleton-chart-section">
          <Skeleton width="200px" height="24px" />
          <Skeleton width="100%" height="300px" />
        </div>
      </div>
    </div>
  );
};

/**
 * Metric Card Skeleton
 * For individual metric cards
 */
export const MetricCardSkeleton = () => {
  return (
    <div className="skeleton-metric-card">
      <div className="skeleton-metric-header">
        <Skeleton circle width="20px" height="20px" />
        <Skeleton width="100px" height="14px" />
      </div>
      <Skeleton width="60px" height="24px" />
      <Skeleton width="80px" height="12px" />
    </div>
  );
};

/**
 * Chart Skeleton
 * For chart loading states
 */
export const ChartSkeleton = ({ height = "300px" }) => {
  return (
    <div className="skeleton-chart" style={{ height }}>
      <div className="skeleton-chart-header">
        <Skeleton width="150px" height="20px" />
      </div>
      <div className="skeleton-chart-content">
        <div className="skeleton-chart-bars">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton 
              key={index} 
              width="40px" 
              height={`${Math.random() * 60 + 40}%`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Table Skeleton
 * For data table loading states
 */
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="skeleton-table">
      {/* Table Header */}
      <div className="skeleton-table-header">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} width="100px" height="16px" />
        ))}
      </div>
      
      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-table-row">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              width={colIndex === 0 ? "150px" : "80px"} 
              height="14px" 
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Text Block Skeleton
 * For text content loading
 */
export const TextSkeleton = ({ lines = 3 }) => {
  return (
    <div className="skeleton-text-block">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton 
          key={index}
          width={index === lines - 1 ? "75%" : "100%"}
          height="16px"
        />
      ))}
    </div>
  );
};

export default Skeleton;
