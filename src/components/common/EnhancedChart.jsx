/**
 * Enhanced Chart Component
 * 
 * Professional financial chart with advanced features
 * Optimized for P&C insurance data visualization
 * 
 * Features:
 * - Multiple chart types (line, bar, area)
 * - Interactive tooltips and legends
 * - Industry benchmark overlays
 * - Export functionality
 * - Responsive design
 * - Accessibility support
 */

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  AreaChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer as Container
} from 'recharts';
import { 
  Download, 
  Maximize2, 
  Settings,
  TrendingUp,
  BarChart3,
  Activity
} from 'lucide-react';
import './EnhancedChart.css';

/**
 * Custom Tooltip Component
 */
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="chart-tooltip">
      <div className="tooltip-header">
        <span className="tooltip-label">{label}</span>
      </div>
      <div className="tooltip-content">
        {payload.map((entry, index) => (
          <div key={index} className="tooltip-item">
            <div 
              className="tooltip-color" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="tooltip-name">{entry.name}:</span>
            <span className="tooltip-value">
              {formatter ? formatter(entry.value, entry.name) : `${entry.value}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Chart Controls Component
 */
const ChartControls = ({ 
  chartType, 
  onChartTypeChange, 
  onExport, 
  onFullscreen,
  showBenchmarks,
  onToggleBenchmarks
}) => {
  const chartTypes = [
    { type: 'line', icon: TrendingUp, label: 'Line Chart' },
    { type: 'bar', icon: BarChart3, label: 'Bar Chart' },
    { type: 'area', icon: Activity, label: 'Area Chart' }
  ];

  return (
    <div className="chart-controls">
      <div className="chart-type-selector">
        {chartTypes.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => onChartTypeChange(type)}
            className={`chart-type-btn ${chartType === type ? 'active' : ''}`}
            title={label}
            aria-label={label}
          >
            <Icon size={16} />
          </button>
        ))}
      </div>
      
      <div className="chart-actions">
        <button
          onClick={onToggleBenchmarks}
          className={`chart-action-btn ${showBenchmarks ? 'active' : ''}`}
          title="Toggle industry benchmarks"
          aria-label="Toggle industry benchmarks"
        >
          <Settings size={16} />
        </button>
        <button
          onClick={onExport}
          className="chart-action-btn"
          title="Export chart"
          aria-label="Export chart as image"
        >
          <Download size={16} />
        </button>
        <button
          onClick={onFullscreen}
          className="chart-action-btn"
          title="Fullscreen view"
          aria-label="View chart in fullscreen"
        >
          <Maximize2 size={16} />
        </button>
      </div>
    </div>
  );
};

/**
 * EnhancedChart Component
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data array
 * @param {Array} props.metrics - Metrics to display
 * @param {string} props.title - Chart title
 * @param {string} props.type - Chart type ('line', 'bar', 'area')
 * @param {number} props.height - Chart height in pixels
 * @param {Object} props.benchmarks - Industry benchmark values
 * @param {Function} props.formatter - Value formatter function
 */
const EnhancedChart = ({
  data = [],
  metrics = [],
  title = 'Financial Metrics',
  type = 'line',
  height = 400,
  benchmarks = {},
  formatter = (value, name) => [`${value?.toFixed(1)}%`, name]
}) => {
  const [chartType, setChartType] = useState(type);
  const [showBenchmarks, setShowBenchmarks] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Color palette for metrics
  const colors = [
    'var(--color-primary-500)',
    'var(--color-success-500)',
    'var(--color-warning-500)',
    'var(--color-danger-500)',
    'var(--color-neutral-500)',
    'var(--color-primary-700)'
  ];

  // Memoized chart component
  const ChartComponent = useMemo(() => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    switch (chartType) {
      case 'bar':
        return BarChart;
      case 'area':
        return AreaChart;
      default:
        return LineChart;
    }
  }, [chartType]);

  const renderMetrics = () => {
    return metrics.map((metric, index) => {
      const color = colors[index % colors.length];
      const commonProps = {
        key: metric.key,
        dataKey: metric.key,
        name: metric.name,
        stroke: color,
        fill: color
      };

      switch (chartType) {
        case 'bar':
          return (
            <Bar 
              {...commonProps}
              radius={[4, 4, 0, 0]}
              fillOpacity={0.8}
            />
          );
        case 'area':
          return (
            <Area 
              {...commonProps}
              strokeWidth={2}
              fillOpacity={0.3}
            />
          );
        default:
          return (
            <Line 
              {...commonProps}
              strokeWidth={3}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
            />
          );
      }
    });
  };

  const handleExport = () => {
    // Implementation for chart export
    console.log('Exporting chart...');
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleToggleBenchmarks = () => {
    setShowBenchmarks(!showBenchmarks);
  };

  return (
    <div className={`enhanced-chart ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Chart Header */}
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        <ChartControls
          chartType={chartType}
          onChartTypeChange={setChartType}
          onExport={handleExport}
          onFullscreen={handleFullscreen}
          showBenchmarks={showBenchmarks}
          onToggleBenchmarks={handleToggleBenchmarks}
        />
      </div>

      {/* Chart Container */}
      <div className="chart-container" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="var(--color-neutral-200)"
              opacity={0.7}
            />
            <XAxis 
              dataKey="period"
              fontSize={12}
              tick={{ fill: 'var(--color-neutral-600)' }}
              axisLine={{ stroke: 'var(--color-neutral-300)' }}
            />
            <YAxis 
              fontSize={12}
              tick={{ fill: 'var(--color-neutral-600)' }}
              axisLine={{ stroke: 'var(--color-neutral-300)' }}
            />
            <Tooltip 
              content={<CustomTooltip formatter={formatter} />}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            
            {/* Industry Benchmarks */}
            {showBenchmarks && Object.entries(benchmarks).map(([key, value]) => (
              <ReferenceLine 
                key={key}
                y={value}
                stroke="var(--color-neutral-400)"
                strokeDasharray="5 5"
                label={{ value: `${key}: ${value}%`, position: 'topRight' }}
              />
            ))}
            
            {/* Render Metrics */}
            {renderMetrics()}
          </ChartComponent>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer */}
      <div className="chart-footer">
        <div className="chart-info">
          <span className="data-points">{data.length} data points</span>
          {showBenchmarks && (
            <span className="benchmarks-info">
              Industry benchmarks shown
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedChart;
