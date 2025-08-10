/**
 * Financial Metrics Tab Component
 * Detailed financial metrics separate from insurance ratios
 * Focus on ROE, ROA, book value, debt ratios, etc.
 */

import React from 'react';
import { TrendingUp, DollarSign, Percent } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import './MetricsTab.css';

/**
 * MetricsTab Component
 * @param {Object} props - Component props
 * @param {Object} props.data - Financial data
 * @param {Object} props.marketData - Market data
 * @param {string} props.ticker - Company ticker
 */
const MetricsTab = ({ data, marketData, ticker }) => {
  const metrics = data?.currentMetrics;

  if (!metrics) {
    return (
      <div className="metrics-tab">
        <div className="no-data">No metrics data available</div>
      </div>
    );
  }

  const metricCategories = [
    {
      title: 'Profitability Metrics',
      icon: TrendingUp,
      metrics: [
        { label: 'Return on Equity (ROE)', value: `${metrics.roe}%`, description: 'Net Income / Shareholders Equity' },
        { label: 'Return on Assets (ROA)', value: `${metrics.roa}%`, description: 'Net Income / Total Assets' },
        { label: 'Profit Margin', value: `${metrics.profitMargin}%`, description: 'Net Income / Revenue' },
        { label: 'Investment Yield', value: `${metrics.investmentYield}%`, description: 'Investment Income / Total Assets' }
      ]
    },
    {
      title: 'Valuation Metrics',
      icon: Percent,
      metrics: [
        { label: 'Book Value per Share', value: formatCurrency(metrics.bookValuePerShare), description: 'Shareholders Equity / Shares Outstanding' },
        { label: 'Tangible Book Value', value: formatCurrency(metrics.tangibleBookValue), description: 'Book Value minus intangible assets' },
        { label: 'Price-to-Book Ratio', value: marketData?.price && metrics.bookValuePerShare ? (marketData.price / metrics.bookValuePerShare).toFixed(2) : 'N/A', description: 'Market Price / Book Value per Share' }
      ]
    },
    {
      title: 'Financial Position',
      icon: DollarSign,
      metrics: [
        { label: 'Total Assets', value: formatCurrency(metrics.totalAssets), description: 'Sum of all company assets' },
        { label: 'Total Equity', value: formatCurrency(metrics.totalEquity), description: 'Shareholders equity' },
        { label: 'Debt to Equity', value: `${metrics.debtToEquity}%`, description: 'Total Debt / Shareholders Equity' },
        { label: 'Float per Share', value: formatCurrency(metrics.floatPerShare), description: 'Estimated insurance float per share' }
      ]
    }
  ];

  return (
    <div className="metrics-tab">
      <div className="metrics-header">
        <h2>Financial Performance Metrics</h2>
        <p>Core financial ratios and valuation metrics for {ticker}</p>
      </div>

      <div className="metrics-categories">
        {metricCategories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <div key={index} className="metric-category">
              <div className="category-header">
                <IconComponent className="category-icon" />
                <h3>{category.title}</h3>
              </div>
              <div className="category-metrics">
                {category.metrics.map((metric, metricIndex) => (
                  <div key={metricIndex} className="metric-item">
                    <div className="metric-label">{metric.label}</div>
                    <div className="metric-value">{metric.value}</div>
                    <div className="metric-description">{metric.description}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(MetricsTab);
