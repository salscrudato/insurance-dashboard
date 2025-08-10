/**
 * Overview Tab Component
 * Company overview with business information and basic metrics
 * Focused on company profile rather than detailed analysis
 */

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  BarChart3,
  Brain
} from 'lucide-react';
import { getCompanyByTicker } from '../../constants/insuranceCompanies';
import { formatCurrency, formatMarketCap } from '../../utils/format';
import { useAIInsights } from '../../hooks/useAIInsights';
import LoadingSpinner from '../common/LoadingSpinner';
import MetricCard from '../common/MetricCard';
import './OverviewTab.css';

/**
 * OverviewTab Component
 * @param {Object} props - Component props
 * @param {Object} props.data - Financial data
 * @param {Object} props.marketData - Market data
 * @param {string} props.ticker - Company ticker
 */
const OverviewTab = ({ data, marketData, ticker }) => {
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
   * Enhanced key metrics configuration for MetricCard
   */
  const keyMetrics = [
    {
      title: 'Combined Ratio',
      value: metrics?.combinedRatio,
      unit: '%',
      metricName: 'combinedRatio',
      previousValue: data?.historicalData?.[1]?.combinedRatio,
      icon: Shield,
      description: 'Total claims and expenses divided by premiums earned. Values under 100% indicate underwriting profit.'
    },
    {
      title: 'Return on Equity',
      value: metrics?.roe,
      unit: '%',
      metricName: 'roe',
      previousValue: data?.historicalData?.[1]?.roe,
      icon: TrendingUp,
      description: 'Net income divided by shareholders equity. Measures profitability relative to shareholder investment.'
    },
    {
      title: 'Loss Ratio',
      value: metrics?.lossRatio,
      unit: '%',
      metricName: 'lossRatio',
      previousValue: data?.historicalData?.[1]?.lossRatio,
      icon: BarChart3,
      description: 'Claims and claim adjustment expenses divided by premiums earned. Core underwriting metric.'
    },
    {
      title: 'Expense Ratio',
      value: metrics?.expenseRatio,
      unit: '%',
      metricName: 'expenseRatio',
      previousValue: data?.historicalData?.[1]?.expenseRatio,
      icon: DollarSign,
      description: 'Operating expenses divided by premiums earned. Measures operational efficiency.'
    }
  ];

  /**
   * Market metrics configuration
   */
  const marketMetrics = [
    {
      label: 'Stock Price',
      value: formatCurrency(marketData?.price),
      change: marketData?.change,
      changePercent: marketData?.changePercent
    },
    {
      label: 'Market Cap',
      value: formatMarketCap(marketData?.marketCap),
      change: null,
      changePercent: null
    },
    {
      label: 'P/E Ratio',
      value: marketData?.pe ? marketData.pe.toFixed(1) : 'N/A',
      change: null,
      changePercent: null
    },
    {
      label: 'Volume',
      value: marketData?.volume ? marketData.volume.toLocaleString() : 'N/A',
      change: null,
      changePercent: null
    }
  ];

  return (
    <div className="overview-tab">
      {/* Company Header */}
      <div className="company-header">
        <div className="company-info">
          <h2 className="company-name">{company?.name}</h2>
          <div className="company-meta">
            <span className="ticker">{ticker}</span>
            <span className="segment">{company?.segment}</span>
            <span className="market-cap">{company?.marketCap} Cap</span>
          </div>
        </div>
        <div className="last-updated">
          Last updated: {new Date(data?.timestamp).toLocaleString()}
        </div>
      </div>

      {/* Key Financial Metrics */}
      <section className="metrics-section">
        <h3 className="section-title">Key Financial Metrics</h3>
        <div className="metrics-grid">
          {keyMetrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              unit={metric.unit}
              metricName={metric.metricName}
              previousValue={metric.previousValue}
              description={metric.description}
              icon={metric.icon}
              interactive={true}
            />
          ))}
        </div>
      </section>

      {/* Market Data */}
      <section className="market-section">
        <h3 className="section-title">Market Data</h3>
        <div className="market-grid">
          {marketMetrics.map((metric, index) => (
            <div key={index} className="market-card">
              <div className="market-label">{metric.label}</div>
              <div className="market-value">{metric.value}</div>
              {metric.change !== null && (
                <div className={`market-change ${metric.change >= 0 ? 'positive' : 'negative'}`}>
                  {metric.change >= 0 ? '+' : ''}{metric.change?.toFixed(2)} 
                  ({metric.changePercent >= 0 ? '+' : ''}{metric.changePercent?.toFixed(2)}%)
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* AI Insights */}
      <section className="insights-section">
        <div className="insights-header">
          <Brain className="insights-icon" />
          <h3 className="section-title">AI Insights</h3>
          {insightsError && (
            <button onClick={loadAIInsights} className="retry-btn">
              Retry
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
                Make sure your OpenAI API key is configured in the environment variables.
              </p>
            </div>
          ) : aiInsights ? (
            <div className="insights-text">
              {aiInsights}
            </div>
          ) : (
            <div className="insights-placeholder">
              AI insights will appear here once data is loaded.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default React.memo(OverviewTab);
