/**
 * useAIInsights Hook Test Suite
 * Tests for the custom AI insights hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAIInsights } from './useAIInsights.js';

// Mock the OpenAI service
vi.mock('../services/openaiService.js', () => ({
  generateInsightsSummary: vi.fn()
}));

import { generateInsightsSummary } from '../services/openaiService.js';

describe('useAIInsights', () => {
  const mockMetrics = {
    combinedRatio: 95.5,
    lossRatio: 65.2,
    expenseRatio: 30.3,
    roe: 15.8,
    roa: 2.1
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
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useAIInsights({
      ticker: 'TRV',
      metrics: null,
      marketData: null,
      autoLoad: false
    }));

    expect(result.current.insights).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.hasData).toBe(false);
  });

  it('should detect when data is available', () => {
    const { result } = renderHook(() => useAIInsights({
      ticker: 'TRV',
      metrics: mockMetrics,
      marketData: mockMarketData,
      autoLoad: false
    }));

    expect(result.current.hasData).toBe(true);
  });

  it('should auto-load insights when data is available and autoLoad is true', async () => {
    const mockInsights = 'Test AI insights response';
    generateInsightsSummary.mockResolvedValue(mockInsights);

    const { result } = renderHook(() => useAIInsights({
      ticker: 'TRV',
      metrics: mockMetrics,
      marketData: mockMarketData,
      autoLoad: true
    }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(generateInsightsSummary).toHaveBeenCalledWith({
      ticker: 'TRV',
      currentMetrics: mockMetrics,
      marketData: mockMarketData
    });
    expect(result.current.insights).toBe(mockInsights);
    expect(result.current.error).toBeNull();
  });

  it('should handle API errors gracefully', async () => {
    const mockError = new Error('API Error');
    generateInsightsSummary.mockRejectedValue(mockError);

    const { result } = renderHook(() => useAIInsights({
      ticker: 'TRV',
      metrics: mockMetrics,
      marketData: mockMarketData,
      autoLoad: true
    }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.insights).toBeNull();
    expect(result.current.error).toBe('API Error');
  });

  it('should allow manual loading of insights', async () => {
    const mockInsights = 'Manual load insights';
    generateInsightsSummary.mockResolvedValue(mockInsights);

    const { result } = renderHook(() => useAIInsights({
      ticker: 'TRV',
      metrics: mockMetrics,
      marketData: mockMarketData,
      autoLoad: false
    }));

    expect(result.current.insights).toBeNull();

    // Manually trigger loading
    await act(async () => {
      await result.current.loadInsights();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.insights).toBe(mockInsights);
  });

  it('should reset insights state correctly', () => {
    const { result } = renderHook(() => useAIInsights({
      ticker: 'TRV',
      metrics: mockMetrics,
      marketData: mockMarketData,
      autoLoad: false
    }));

    // Reset state
    act(() => {
      result.current.resetInsights();
    });

    expect(result.current.insights).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should not load insights when data is incomplete', async () => {
    const { result } = renderHook(() => useAIInsights({
      ticker: 'TRV',
      metrics: null, // Missing metrics
      marketData: mockMarketData,
      autoLoad: true
    }));

    // Wait a bit to ensure no loading occurs
    await new Promise(resolve => globalThis.setTimeout(resolve, 100));

    expect(generateInsightsSummary).not.toHaveBeenCalled();
    expect(result.current.insights).toBeNull();
    expect(result.current.hasData).toBe(false);
  });
});
