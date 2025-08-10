/**
 * Trends Tab Component
 * Historical trends and analysis
 * Placeholder for AI coding agents to enhance
 */

import React from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';
import EnhancedChart from '../common/EnhancedChart';
import './TrendsTab.css';

/**
 * TrendsTab Component
 * @param {Object} props - Component props
 * @param {Object} props.data - Financial data
 * @param {string} props.ticker - Company ticker
 */
const TrendsTab = ({ data, ticker }) => {
  const historicalData = data?.historicalMetrics || [];

  if (historicalData.length === 0) {
    return (
      <div className="trends-tab">
        <div className="no-data">No historical data available</div>
      </div>
    );
  }

  return (
    <div className="trends-tab">
      <div className="trends-header">
        <TrendingUp className="trends-icon" />
        <div>
          <h2>Historical Trends</h2>
          <p>Performance trends for {ticker} over time</p>
        </div>
      </div>

      <EnhancedChart
        title="Key Metrics Trends"
        data={historicalData}
        metrics={[
          { key: 'combinedRatio', name: 'Combined Ratio' },
          { key: 'roe', name: 'ROE' },
          { key: 'lossRatio', name: 'Loss Ratio' },
          { key: 'expenseRatio', name: 'Expense Ratio' }
        ]}
        type="line"
        height={450}
        benchmarks={{
          'Combined Ratio': 100,
          'ROE': 10,
          'Loss Ratio': 75
        }}
        formatter={(value, name) => [`${value?.toFixed(1)}%`, name]}
      />

      <div className="trends-summary">
        <h3>Trend Analysis</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-label">Latest Combined Ratio</div>
            <div className="summary-value">
              {historicalData[historicalData.length - 1]?.combinedRatio?.toFixed(1)}%
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Latest ROE</div>
            <div className="summary-value">
              {historicalData[historicalData.length - 1]?.roe?.toFixed(1)}%
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Data Points</div>
            <div className="summary-value">{historicalData.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TrendsTab);
