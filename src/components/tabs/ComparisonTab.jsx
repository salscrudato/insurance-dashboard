/**
 * Comparison Tab Component
 * Compare multiple P&C insurance companies with add/remove functionality
 * Optimized for AI coding agents with clean state management
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, BarChart3, Brain } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

import { 
  getTop5Companies, 
  TOP_INSURANCE_COMPANIES,
  getCompanyByTicker 
} from '../../constants/insuranceCompanies';
import { fetchMultipleCompanyFinancials } from '../../services/financialDataService';
import { generateComparisonInsights } from '../../services/openaiService';
import LoadingSpinner from '../common/LoadingSpinner';
import './ComparisonTab.css';

/**
 * ComparisonTab Component
 * @param {Object} props - Component props
 * @param {Object} props.data - Current company data (unused in current implementation)
 * @param {string} props.ticker - Current company ticker (unused in current implementation)
 */
const ComparisonTab = ({ data: _data, ticker: _ticker }) => {
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  /**
   * Initialize with top 5 companies
   */
  useEffect(() => {
    const top5 = getTop5Companies().map(company => company.ticker);
    setSelectedCompanies(top5);
  }, []);

  /**
   * Load financial data for all selected companies
   */
  const loadComparisonData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await fetchMultipleCompanyFinancials(selectedCompanies);

      // Filter out companies with errors and format data
      const validResults = results.filter(result => !result.error && result.currentMetrics);

      if (validResults.length === 0) {
        throw new Error('No valid company data available');
      }

      setComparisonData(validResults);

      // Generate AI insights if we have multiple companies
      if (validResults.length >= 2) {
        generateInsights(validResults);
      }

    } catch (err) {
      setError(err.message);
      setComparisonData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCompanies, generateInsights]);

  /**
   * Load comparison data when selected companies change
   */
  useEffect(() => {
    if (selectedCompanies.length > 0) {
      loadComparisonData();
    }
  }, [selectedCompanies, loadComparisonData]);

  /**
   * Generate AI insights for comparison
   * @param {Array} companies - Array of company data
   */
  const generateInsights = useCallback(async (companies) => {
    setInsightsLoading(true);

    try {
      const insights = await generateComparisonInsights(companies);
      setAiInsights(insights);
    } catch (error) {
      console.warn('Failed to generate comparison insights:', error);
    } finally {
      setInsightsLoading(false);
    }
  }, []);

  /**
   * Add a company to comparison
   * @param {string} newTicker - Ticker to add
   */
  const addCompany = (newTicker) => {
    if (!selectedCompanies.includes(newTicker) && selectedCompanies.length < 8) {
      setSelectedCompanies(prev => [...prev, newTicker]);
    }
  };

  /**
   * Remove a company from comparison
   * @param {string} tickerToRemove - Ticker to remove
   */
  const removeCompany = (tickerToRemove) => {
    if (selectedCompanies.length > 1) {
      setSelectedCompanies(prev => prev.filter(t => t !== tickerToRemove));
    }
  };

  /**
   * Get available companies for adding (not already selected)
   */
  const availableCompanies = TOP_INSURANCE_COMPANIES.filter(
    company => !selectedCompanies.includes(company.ticker)
  );

  /**
   * Prepare chart data for visualization
   */
  const chartData = comparisonData.map(company => ({
    ticker: company.ticker,
    name: getCompanyByTicker(company.ticker)?.name?.split(' ')[0] || company.ticker,
    combinedRatio: company.currentMetrics.combinedRatio,
    roe: company.currentMetrics.roe,
    lossRatio: company.currentMetrics.lossRatio,
    expenseRatio: company.currentMetrics.expenseRatio
  }));

  return (
    <div className="comparison-tab">
      {/* Header */}
      <div className="comparison-header">
        <div className="header-info">
          <h2>Company Comparison</h2>
          <p>Compare key metrics across multiple P&C insurers</p>
        </div>
        <div className="company-count">
          {selectedCompanies.length} / 8 companies selected
        </div>
      </div>

      {/* Company Selection */}
      <div className="company-selection">
        <h3>Selected Companies</h3>
        <div className="selected-companies">
          {selectedCompanies.map(companyTicker => {
            const company = getCompanyByTicker(companyTicker);
            return (
              <div key={companyTicker} className="company-chip">
                <div className="chip-content">
                  <span className="chip-ticker">{companyTicker}</span>
                  <span className="chip-name">{company?.name}</span>
                </div>
                {selectedCompanies.length > 1 && (
                  <button
                    onClick={() => removeCompany(companyTicker)}
                    className="chip-remove"
                    title="Remove company"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            );
          })}
          
          {/* Add Company Dropdown */}
          {selectedCompanies.length < 8 && availableCompanies.length > 0 && (
            <div className="add-company">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addCompany(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="add-company-select"
                defaultValue=""
              >
                <option value="" disabled>Add Company...</option>
                {availableCompanies.map(company => (
                  <option key={company.ticker} value={company.ticker}>
                    {company.ticker} - {company.name}
                  </option>
                ))}
              </select>
              <Plus className="add-icon" />
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="comparison-loading">
          <LoadingSpinner message="Loading comparison data..." />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="comparison-error">
          <p>Error loading comparison data: {error}</p>
          <button onClick={loadComparisonData} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* Comparison Charts */}
      {!loading && !error && comparisonData.length > 0 && (
        <div className="comparison-content">
          {/* Key Metrics Chart */}
          <div className="chart-section">
            <h3 className="chart-title">
              <BarChart3 size={20} />
              Key Metrics Comparison
            </h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={450}>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
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
                    formatter={(value, name) => [`${value.toFixed(1)}%`, name]}
                    labelFormatter={(label) => {
                      const company = chartData.find(c => c.name === label);
                      return `${company?.ticker} - ${getCompanyByTicker(company?.ticker)?.name}`;
                    }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: `1px solid var(--color-neutral-200)`,
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-xl)'
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="combinedRatio"
                    fill="var(--color-danger-500)"
                    name="Combined Ratio"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="roe"
                    fill="var(--color-success-500)"
                    name="ROE"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="lossRatio"
                    fill="var(--color-warning-500)"
                    name="Loss Ratio"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expenseRatio"
                    fill="var(--color-primary-500)"
                    name="Expense Ratio"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="comparison-table-section">
            <h3>Detailed Metrics</h3>
            <div className="comparison-table">
              <div className="table-header">
                <div>Company</div>
                <div>Combined Ratio</div>
                <div>ROE</div>
                <div>Loss Ratio</div>
                <div>Expense Ratio</div>
                <div>Book Value/Share</div>
              </div>
              {comparisonData.map(company => {
                const companyInfo = getCompanyByTicker(company.ticker);
                const metrics = company.currentMetrics;
                
                return (
                  <div key={company.ticker} className="table-row">
                    <div className="company-cell">
                      <div className="company-ticker">{company.ticker}</div>
                      <div className="company-name">{companyInfo?.name}</div>
                    </div>
                    <div className={`metric-cell ${metrics.combinedRatio <= 100 ? 'good' : 'poor'}`}>
                      {metrics.combinedRatio.toFixed(1)}%
                    </div>
                    <div className={`metric-cell ${metrics.roe >= 10 ? 'good' : 'poor'}`}>
                      {metrics.roe.toFixed(1)}%
                    </div>
                    <div className={`metric-cell ${metrics.lossRatio <= 70 ? 'good' : 'poor'}`}>
                      {metrics.lossRatio.toFixed(1)}%
                    </div>
                    <div className={`metric-cell ${metrics.expenseRatio <= 30 ? 'good' : 'poor'}`}>
                      {metrics.expenseRatio.toFixed(1)}%
                    </div>
                    <div className="metric-cell">
                      ${metrics.bookValuePerShare?.toFixed(2) || 'N/A'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Insights */}
          <div className="insights-section">
            <div className="insights-header">
              <Brain size={20} />
              <h3>AI Comparison Insights</h3>
            </div>
            <div className="insights-content">
              {insightsLoading ? (
                <LoadingSpinner message="Generating insights..." size="sm" />
              ) : aiInsights ? (
                <div className="insights-text">{aiInsights}</div>
              ) : (
                <div className="insights-placeholder">
                  AI insights will appear here for comparisons with 2+ companies
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ComparisonTab);

/**
 * Default comparison metrics for easy reference
 */
export const COMPARISON_METRICS = [
  { key: 'combinedRatio', label: 'Combined Ratio', unit: '%', benchmark: '< 100%' },
  { key: 'roe', label: 'Return on Equity', unit: '%', benchmark: '> 10%' },
  { key: 'lossRatio', label: 'Loss Ratio', unit: '%', benchmark: '60-75%' },
  { key: 'expenseRatio', label: 'Expense Ratio', unit: '%', benchmark: '< 30%' },
  { key: 'bookValuePerShare', label: 'Book Value/Share', unit: '$', benchmark: 'Higher is better' }
];
