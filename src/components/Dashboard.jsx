/**
 * Main Dashboard Component
 * Simplified and optimized for AI coding agents
 * Clean architecture with clear separation of concerns
 */

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Shield,
  MessageSquare,
  RefreshCw,
  Brain
} from 'lucide-react';

import CompanySelector from './CompanySelector';
import AIInsightsTab from './tabs/AIInsightsTab';
import OverviewTab from './tabs/OverviewTab';
import MetricsTab from './tabs/MetricsTab';
import TrendsTab from './tabs/TrendsTab';
import RiskTab from './tabs/RiskTab';
import ComparisonTab from './tabs/ComparisonTab';
import AIChat from './AIChat';

import ErrorMessage from './common/ErrorMessage';
import DataQualityIndicator from './common/DataQualityIndicator';
import { DashboardSkeleton } from './common/SkeletonLoader';

import { fetchCompanyFinancials, fetchMarketData } from '../services/financialDataService';
import { validateCompanyData, quickQualityCheck } from '../services/dataValidationService';
import { DEFAULT_COMPANY } from '../constants/insuranceCompanies';
import './Dashboard.css';

/**
 * Dashboard navigation tabs configuration
 * AI Insights is now the main landing page
 */
const DASHBOARD_TABS = [
  { id: 'ai-insights', label: 'AI Insights', icon: Brain },
  { id: 'overview', label: 'Company Overview', icon: BarChart3 },
  { id: 'metrics', label: 'Financial Metrics', icon: TrendingUp },
  { id: 'trends', label: 'Historical Trends', icon: PieChart },
  { id: 'risk', label: 'Risk Assessment', icon: Shield },
  { id: 'comparison', label: 'Peer Comparison', icon: BarChart3 }
];

/**
 * Main Dashboard Component
 *
 * This is the primary container component that orchestrates the entire insurance analytics dashboard.
 * It manages global state, data fetching, and navigation between different analysis tabs.
 *
 * Features:
 * - Real-time financial data fetching from Financial Modeling Prep API
 * - AI-powered insights generation using OpenAI GPT-4
 * - Interactive tab navigation for different analysis views
 * - Company selection and comparison functionality
 * - Responsive design with loading and error states
 * - Automatic data refresh capabilities
 *
 * State Management:
 * - selectedTicker: Currently selected company ticker symbol
 * - activeTab: Currently active analysis tab
 * - financialData: Complete financial dataset for selected company
 * - marketData: Real-time market data and stock information
 * - loading/error: UI state management for data fetching
 *
 * @component
 * @example
 * // Basic usage
 * <Dashboard />
 *
 * @author Insurance Dashboard Team
 * @version 2.0.0
 * @since 1.0.0
 */
const Dashboard = () => {
  // State management
  const [selectedTicker, setSelectedTicker] = useState(DEFAULT_COMPANY.ticker);
  const [activeTab, setActiveTab] = useState('ai-insights');
  const [dashboardData, setDashboardData] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [dataValidation, setDataValidation] = useState(null);

  /**
   * Load company data when ticker changes
   */
  useEffect(() => {
    loadCompanyData(selectedTicker);
  }, [selectedTicker]);

  /**
   * Load financial and market data for a company
   * @param {string} ticker - Company ticker symbol
   */
  const loadCompanyData = async (ticker) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch financial and market data in parallel
      const [financialData, marketDataResult] = await Promise.all([
        fetchCompanyFinancials(ticker),
        fetchMarketData(ticker).catch(() => null) // Market data is optional
      ]);

      setDashboardData(financialData);
      setMarketData(marketDataResult);

      // Validate data quality in background
      validateDataQuality(ticker, financialData);

    } catch (err) {
      setError(err.message);
      setDashboardData(null);
      setMarketData(null);
      setDataValidation(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validate data quality and accuracy
   * @param {string} ticker - Company ticker symbol
   * @param {Object} financialData - Financial data to validate
   */
  const validateDataQuality = async (ticker, financialData) => {
    try {
      const validation = await validateCompanyData(ticker, financialData);
      setDataValidation(validation);
    } catch (err) {
      console.error('Data validation failed:', err);
      setDataValidation({
        ticker,
        dataQuality: 'error',
        overallScore: 0,
        warnings: [{ type: 'validation_error', message: err.message }]
      });
    }
  };

  /**
   * Handle manual data refresh
   */
  const handleRefresh = () => {
    loadCompanyData(selectedTicker);
  };

  /**
   * Handle tab change
   * @param {string} tabId - Tab identifier
   */
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  /**
   * Handle company selection change
   * @param {string} ticker - Selected company ticker
   */
  const handleCompanyChange = (ticker) => {
    setSelectedTicker(ticker);
  };

  /**
   * Toggle AI chat modal
   */
  const toggleAIChat = () => {
    setShowAIChat(!showAIChat);
  };

  /**
   * Render active tab content
   */
  const renderTabContent = () => {
    if (!dashboardData) return null;

    const tabProps = {
      data: dashboardData,
      marketData,
      ticker: selectedTicker
    };

    switch (activeTab) {
      case 'ai-insights':
        return <AIInsightsTab {...tabProps} />;
      case 'overview':
        return <OverviewTab {...tabProps} />;
      case 'metrics':
        return <MetricsTab {...tabProps} />;
      case 'trends':
        return <TrendsTab {...tabProps} />;
      case 'risk':
        return <RiskTab {...tabProps} />;
      case 'comparison':
        return <ComparisonTab {...tabProps} />;
      default:
        return <AIInsightsTab {...tabProps} />;
    }
  };

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>P&C Insurance Analytics</h1>
            <p>Professional Property & Casualty Insurance Research Platform</p>
          </div>
          
          <div className="header-actions">
            <button 
              onClick={handleRefresh} 
              disabled={loading}
              className="btn btn-secondary"
              title="Refresh data"
            >
              <RefreshCw size={16} className={loading ? 'spinning' : ''} />
              Refresh
            </button>
            
            <button 
              onClick={toggleAIChat}
              className="btn btn-primary"
              title="AI Assistant"
            >
              <MessageSquare size={16} />
              AI Chat
            </button>
          </div>
        </div>
      </header>

      {/* Enhanced Company Selector */}
      <div className="dashboard-controls">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <div className="breadcrumb-item">
            <span>Dashboard</span>
          </div>
          <span className="breadcrumb-separator">/</span>
          <div className="breadcrumb-item">
            <span className="breadcrumb-current">{selectedTicker}</span>
          </div>
          <span className="breadcrumb-separator">/</span>
          <div className="breadcrumb-item">
            <span className="breadcrumb-current">
              {DASHBOARD_TABS.find(tab => tab.id === activeTab)?.label}
            </span>
          </div>
        </nav>

        <div className="controls-row">
          <CompanySelector
            selectedTicker={selectedTicker}
            onTickerChange={handleCompanyChange}
            disabled={loading}
          />

          {/* Enhanced Status and Quality Indicators */}
          <div className="status-controls">
            <div className={`status-indicator ${loading ? 'loading' : error ? 'error' : ''}`}>
              <div className={`status-dot ${loading ? 'pulse' : ''}`}></div>
              <span>
                {loading ? 'Loading data...' : error ? 'Data unavailable' : 'Data current'}
              </span>
            </div>

            {/* Data Quality Indicator */}
            {dashboardData && !loading && (
              <DataQualityIndicator
                validation={dataValidation}
                quickCheck={quickQualityCheck(dashboardData?.currentMetrics)}
                compact={true}
              />
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Dashboard Navigation */}
      <nav className="dashboard-nav" role="navigation" aria-label="Dashboard sections">
        <div className="nav-container">
          {DASHBOARD_TABS.map(tab => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`nav-tab ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                title={`View ${tab.label}`}
              >
                <IconComponent size={18} />
                <span>{tab.label}</span>
                {tab.id === 'ai-insights' && (
                  <span className="nav-tab-badge">AI</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="dashboard-content">
        {loading && (
          <div className="dashboard-loading">
            <DashboardSkeleton />
          </div>
        )}

        {error && (
          <div className="dashboard-error">
            <ErrorMessage
              message={error}
              onRetry={handleRefresh}
              title="Failed to Load Data"
              variant="error"
            />
          </div>
        )}

        {!loading && !error && dashboardData && (
          <div className="dashboard-main animate-fade-in">
            {renderTabContent()}
          </div>
        )}
      </main>

      {/* AI Chat Modal */}
      {showAIChat && (
        <AIChat
          isOpen={showAIChat}
          onClose={toggleAIChat}
          dashboardData={{
            ticker: selectedTicker,
            currentMetrics: dashboardData?.currentMetrics,
            marketData
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;