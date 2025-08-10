/**
 * Custom Hook for AI Insights
 * 
 * Consolidates AI insights loading logic used across multiple components
 * Provides consistent state management and error handling for AI-generated insights
 * 
 * Features:
 * - Automatic loading when data changes
 * - Loading and error state management
 * - Memoized callback to prevent unnecessary re-renders
 * - Consistent error handling across components
 * 
 * @author Insurance Dashboard Team
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';
import { generateInsightsSummary } from '../services/openaiService';

/**
 * Custom hook for managing AI insights state and loading
 * @param {Object} params - Hook parameters
 * @param {string} params.ticker - Company ticker symbol
 * @param {Object} params.metrics - Current financial metrics
 * @param {Object} params.marketData - Market data
 * @param {boolean} params.autoLoad - Whether to automatically load insights when data changes (default: true)
 * @returns {Object} AI insights state and controls
 */
export const useAIInsights = ({ ticker, metrics, marketData, autoLoad = true }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load AI insights summary
   */
  const loadInsights = useCallback(async () => {
    if (!metrics || !marketData) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const generatedInsights = await generateInsightsSummary({
        ticker,
        currentMetrics: metrics,
        marketData
      });
      setInsights(generatedInsights);
    } catch (err) {
      setError(err.message);
      setInsights(null);
    } finally {
      setLoading(false);
    }
  }, [ticker, metrics, marketData]);

  /**
   * Reset insights state
   */
  const resetInsights = useCallback(() => {
    setInsights(null);
    setError(null);
    setLoading(false);
  }, []);

  /**
   * Auto-load insights when data changes (if enabled)
   */
  useEffect(() => {
    if (autoLoad && metrics && marketData) {
      loadInsights();
    }
  }, [autoLoad, metrics, marketData, loadInsights]);

  return {
    insights,
    loading,
    error,
    loadInsights,
    resetInsights,
    hasData: !!(metrics && marketData)
  };
};

export default useAIInsights;
