/**
 * AI Insights Tab Component
 * Main landing page with comprehensive AI analysis
 * Optimized for P&C insurance analysts with separated metrics
 */

import React from 'react';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Shield,
  DollarSign,
  BarChart3,
  AlertTriangle,
  Target,
  Zap
} from 'lucide-react';
import { getCompanyByTicker } from '../../constants/insuranceCompanies';
import { formatCurrency, formatLargeNumber } from '../../utils/format';
import { useAIInsights } from '../../hooks/useAIInsights';
import LoadingSpinner from '../common/LoadingSpinner';
import './AIInsightsTab.css';

/**
 * AIInsightsTab Component - Main landing page
 * @param {Object} props - Component props
 * @param {Object} props.data - Financial data
 * @param {Object} props.marketData - Market data
 * @param {string} props.ticker - Company ticker
 */
const AIInsightsTab = ({ data, marketData, ticker }) => {
  const company = getCompanyByTicker(ticker);
  const metrics = data?.currentMetrics;

  // Use custom hook for AI insights
  const {
    insights: aiInsights,
    loading: insightsLoading,
    error: insightsError,
    loadInsights: loadAIInsights
  } = useAIInsights({
    ticker,
    metrics,
    marketData,
    autoLoad: true
  });

  /**
   * P&C Insurance-Specific Metrics
   */
  const insuranceMetrics = [
    {
      category: 'Underwriting Performance',
      metrics: [
        {
          label: 'Combined Ratio',
          value: `${metrics?.combinedRatio}%`,
          icon: Shield,
          trend: metrics?.combinedRatio <= 100 ? 'excellent' : metrics?.combinedRatio <= 105 ? 'good' : 'poor',
          benchmark: '< 100%',
          description: 'Total claims and expenses as % of premiums'
        },
        {
          label: 'Loss Ratio',
          value: `${metrics?.lossRatio}%`,
          icon: AlertTriangle,
          trend: metrics?.lossRatio <= 65 ? 'excellent' : metrics?.lossRatio <= 75 ? 'good' : 'poor',
          benchmark: '60-70%',
          description: 'Claims paid as % of premiums earned'
        },
        {
          label: 'Expense Ratio',
          value: `${metrics?.expenseRatio}%`,
          icon: BarChart3,
          trend: metrics?.expenseRatio <= 25 ? 'excellent' : metrics?.expenseRatio <= 35 ? 'good' : 'poor',
          benchmark: '25-30%',
          description: 'Operating expenses as % of premiums'
        }
      ]
    },
    {
      category: 'Profitability & Returns',
      metrics: [
        {
          label: 'Underwriting Profit Margin',
          value: `${metrics?.combinedRatio ? (100 - metrics.combinedRatio).toFixed(1) : 'N/A'}%`,
          icon: Target,
          trend: metrics?.combinedRatio <= 95 ? 'excellent' : metrics?.combinedRatio <= 100 ? 'good' : 'poor',
          benchmark: '> 5%',
          description: 'Profit from underwriting operations'
        },
        {
          label: 'Return on Equity',
          value: `${metrics?.roe}%`,
          icon: TrendingUp,
          trend: metrics?.roe >= 15 ? 'excellent' : metrics?.roe >= 10 ? 'good' : 'poor',
          benchmark: '> 12%',
          description: 'Net income as % of shareholders equity'
        },
        {
          label: 'Return on Assets',
          value: `${metrics?.roa}%`,
          icon: DollarSign,
          trend: metrics?.roa >= 2 ? 'excellent' : metrics?.roa >= 1 ? 'good' : 'poor',
          benchmark: '> 1.5%',
          description: 'Net income as % of total assets'
        }
      ]
    }
  ];

  /**
   * Financial & Market Metrics
   */
  const financialMetrics = [
    {
      category: 'Valuation Metrics',
      metrics: [
        {
          label: 'Book Value per Share',
          value: formatCurrency(metrics?.bookValuePerShare),
          change: null,
          description: 'Shareholders equity per share'
        },
        {
          label: 'Price-to-Book Ratio',
          value: marketData?.price && metrics?.bookValuePerShare ? 
            (marketData.price / metrics.bookValuePerShare).toFixed(2) : 'N/A',
          change: null,
          description: 'Market price vs book value'
        },
        {
          label: 'Market Capitalization',
          value: formatLargeNumber(marketData?.marketCap),
          change: null,
          description: 'Total market value'
        }
      ]
    },
    {
      category: 'Market Performance',
      metrics: [
        {
          label: 'Stock Price',
          value: formatCurrency(marketData?.price),
          change: marketData?.change,
          changePercent: marketData?.changePercent,
          description: 'Current share price'
        },
        {
          label: 'P/E Ratio',
          value: marketData?.pe ? marketData.pe.toFixed(1) : 'N/A',
          change: null,
          description: 'Price-to-earnings multiple'
        },
        {
          label: 'Trading Volume',
          value: marketData?.volume ? formatLargeNumber(marketData.volume) : 'N/A',
          change: null,
          description: 'Daily trading volume'
        }
      ]
    }
  ];



  /**
   * Get trend icon based on performance
   */
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'excellent': return <TrendingUp className="trend-icon excellent" />;
      case 'good': return <TrendingUp className="trend-icon good" />;
      case 'poor': return <TrendingDown className="trend-icon poor" />;
      default: return null;
    }
  };

  return (
    <div className="ai-insights-tab">
      {/* Header */}
      <div className="insights-header">
        <div className="header-content">
          <Brain className="header-icon" />
          <div className="header-text">
            <h1>AI-Powered Insurance Analysis</h1>
            <p>Comprehensive P&C performance insights for {company?.name} ({ticker})</p>
          </div>
        </div>
        <div className="last-updated">
          Last updated: {new Date(data?.timestamp).toLocaleString()}
        </div>
      </div>

      {/* AI Insights Section */}
      <section className="ai-insights-section">
        <div className="section-header">
          <Zap className="section-icon" />
          <h2>AI Performance Analysis</h2>
          {insightsError && (
            <button onClick={loadAIInsights} className="retry-btn">
              Retry Analysis
            </button>
          )}
        </div>
        
        <div className="insights-content">
          {insightsLoading ? (
            <LoadingSpinner message="Generating AI insights..." size="sm" />
          ) : insightsError ? (
            <div className="insights-error">
              <p>Unable to generate AI insights: {insightsError}</p>
              <p className="error-note">
                Make sure your OpenAI API key is configured correctly.
              </p>
            </div>
          ) : aiInsights ? (
            <div className="insights-text">
              <AIResponseFormatter text={aiInsights} />
            </div>
          ) : (
            <div className="insights-placeholder">
              AI insights will appear here once data is loaded.
            </div>
          )}
        </div>
      </section>

      {/* Insurance Metrics */}
      <section className="metrics-section">
        <h2 className="section-title">P&C Insurance Metrics</h2>
        <div className="metrics-categories">
          {insuranceMetrics.map((category, categoryIndex) => (
            <div key={categoryIndex} className="metric-category">
              <h3 className="category-title">{category.category}</h3>
              <div className="metrics-grid">
                {category.metrics.map((metric, index) => {
                  const IconComponent = metric.icon;
                  return (
                    <div key={index} className={`metric-card ${metric.trend}`}>
                      <div className="metric-header">
                        <IconComponent className="metric-icon" />
                        <div className="metric-info">
                          <div className="metric-label">{metric.label}</div>
                          <div className="metric-benchmark">Target: {metric.benchmark}</div>
                        </div>
                        {getTrendIcon(metric.trend)}
                      </div>
                      <div className="metric-value">{metric.value}</div>
                      <div className="metric-description">{metric.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Financial Metrics */}
      <section className="metrics-section">
        <h2 className="section-title">Financial & Market Data</h2>
        <div className="metrics-categories">
          {financialMetrics.map((category, categoryIndex) => (
            <div key={categoryIndex} className="metric-category">
              <h3 className="category-title">{category.category}</h3>
              <div className="financial-metrics-grid">
                {category.metrics.map((metric, index) => (
                  <div key={index} className="financial-metric-card">
                    <div className="financial-metric-label">{metric.label}</div>
                    <div className="financial-metric-value">{metric.value}</div>
                    {metric.change !== null && metric.change !== undefined && (
                      <div className={`financial-metric-change ${metric.change >= 0 ? 'positive' : 'negative'}`}>
                        {metric.change >= 0 ? '+' : ''}{metric.change?.toFixed(2)} 
                        ({metric.changePercent >= 0 ? '+' : ''}{metric.changePercent?.toFixed(2)}%)
                      </div>
                    )}
                    <div className="financial-metric-description">{metric.description}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

/**
 * AI Response Formatter Component
 * Handles clean formatting of AI responses for optimal UX
 */
const AIResponseFormatter = ({ text }) => {
  if (!text) return null;

  // Split text into paragraphs and clean formatting
  const paragraphs = text
    .split('\n\n')
    .filter(paragraph => paragraph.trim().length > 0)
    .map(paragraph => paragraph.trim());

  return (
    <div className="ai-response-formatted">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="ai-paragraph">
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default React.memo(AIInsightsTab);
