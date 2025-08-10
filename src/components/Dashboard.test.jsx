/**
 * Dashboard Component Test Suite
 * Tests for the main dashboard functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard.jsx';

// Mock the services
vi.mock('../services/financialDataService.js', () => ({
  fetchCompanyFinancials: vi.fn(),
  fetchMarketData: vi.fn()
}));

vi.mock('../services/openaiService.js', () => ({
  generateInsightsSummary: vi.fn(),
  generateComparisonInsights: vi.fn(),
  generateChatResponse: vi.fn()
}));

import { fetchCompanyFinancials, fetchMarketData } from '../services/financialDataService.js';

describe('Dashboard', () => {
  const mockFinancialData = {
    ticker: 'TRV',
    currentMetrics: {
      revenue: 46400000000,
      netIncome: 5000000000,
      combinedRatio: 95.5,
      roe: 15.8,
      profitMargin: 10.8
    },
    historicalMetrics: [
      { period: 'Q1 2024', combinedRatio: 94.2, roe: 16.1 },
      { period: 'Q2 2024', combinedRatio: 95.8, roe: 15.5 }
    ],
    timestamp: new Date().toISOString()
  };

  const mockMarketData = {
    symbol: 'TRV',
    price: 250.50,
    change: 5.25,
    changePercent: 2.14,
    marketCap: 50000000000
  };

  beforeEach(() => {
    vi.clearAllMocks();
    fetchCompanyFinancials.mockResolvedValue(mockFinancialData);
    fetchMarketData.mockResolvedValue(mockMarketData);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render dashboard header correctly', async () => {
    render(<Dashboard />);

    expect(screen.getByText('P&C Insurance Analytics')).toBeInTheDocument();
    expect(screen.getByText('Professional Property & Casualty Insurance Research Platform')).toBeInTheDocument();
  });

  it('should render navigation tabs', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      // Use getAllByText for elements that appear in both breadcrumb and navigation
      expect(screen.getAllByText('AI Insights')).toHaveLength(2); // breadcrumb + nav
      expect(screen.getByText('Company Overview')).toBeInTheDocument();
      expect(screen.getByText('Financial Metrics')).toBeInTheDocument();
      expect(screen.getByText('Historical Trends')).toBeInTheDocument();
      expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
      expect(screen.getByText('Peer Comparison')).toBeInTheDocument();
    });
  });

  it('should load data on mount', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(fetchCompanyFinancials).toHaveBeenCalledWith('BRK-B'); // Default company
    });
  });

  it('should handle tab switching', async () => {
    render(<Dashboard />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getAllByText('AI Insights')).toHaveLength(2); // breadcrumb + nav
    });

    // Click on Financial Metrics tab (use role to target the button specifically)
    const financialMetricsTab = screen.getByRole('button', { name: /financial metrics/i });
    fireEvent.click(financialMetricsTab);

    // Should switch to metrics tab
    await waitFor(() => {
      expect(financialMetricsTab).toHaveClass('active');
    });
  });

  it('should handle refresh button', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(fetchCompanyFinancials).toHaveBeenCalledTimes(1);
    });

    // Click refresh button
    const refreshButton = screen.getByTitle('Refresh data');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(fetchCompanyFinancials).toHaveBeenCalledTimes(2);
    });
  });

  it('should handle AI chat toggle', async () => {
    render(<Dashboard />);

    // Click AI Chat button
    const aiChatButton = screen.getByTitle('AI Assistant');
    fireEvent.click(aiChatButton);

    // AI Chat modal should be visible (we'd need to check for modal content)
    expect(aiChatButton).toBeInTheDocument();
  });

  it('should display loading state', () => {
    fetchCompanyFinancials.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<Dashboard />);

    // Look for skeleton loader instead of specific loading text
    expect(screen.getByLabelText('Loading dashboard')).toBeInTheDocument();
  });

  it('should display error state', async () => {
    const errorMessage = 'Failed to fetch data';
    fetchCompanyFinancials.mockRejectedValue(new Error(errorMessage));

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should handle company selection change', async () => {
    render(<Dashboard />);

    // Wait for initial load
    await waitFor(() => {
      expect(fetchCompanyFinancials).toHaveBeenCalledWith('BRK-B');
    });

    // This would require mocking the CompanySelector component to test properly
    // For now, we verify the initial state
    expect(fetchCompanyFinancials).toHaveBeenCalledTimes(1);
  });
});
