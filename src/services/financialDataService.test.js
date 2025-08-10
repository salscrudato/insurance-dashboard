/**
 * Financial Data Service Test Suite
 * Tests for insurance metrics calculation and data fetching
 */

import { describe, it, expect } from 'vitest';
import { calculateInsuranceMetrics } from './financialDataService.js';

describe('calculateInsuranceMetrics', () => {
  const mockFinancialData = {
    symbol: 'TRV',
    revenue: 46400000000, // $46.4B
    netIncome: 5000000000, // $5.0B
    totalAssets: 120000000000, // $120B
    totalStockholdersEquity: 25000000000, // $25B
    weightedAverageShsOut: 250000000, // 250M shares
    sellingGeneralAndAdministrativeExpenses: 5800000000, // $5.8B
    totalDebt: 5000000000, // $5B
    calendarYear: 2024,
    period: 'FY'
  };

  it('should calculate basic financial ratios correctly', () => {
    const metrics = calculateInsuranceMetrics(mockFinancialData);

    expect(metrics.profitMargin).toBeCloseTo(10.8, 1);
    expect(metrics.roe).toBeCloseTo(20.0, 1);
    expect(metrics.roa).toBeCloseTo(4.2, 1);
    expect(metrics.bookValuePerShare).toBeCloseTo(100, 0);
    expect(metrics.debtToEquity).toBeCloseTo(20.0, 1);
  });

  it('should calculate realistic insurance-specific metrics', () => {
    const metrics = calculateInsuranceMetrics(mockFinancialData);

    // Expense ratio should be realistic for insurance industry
    expect(metrics.expenseRatio).toBeGreaterThanOrEqual(15);
    expect(metrics.expenseRatio).toBeLessThanOrEqual(35);

    // Loss ratio should be realistic
    expect(metrics.lossRatio).toBeGreaterThanOrEqual(50);
    expect(metrics.lossRatio).toBeLessThanOrEqual(90);

    // Combined ratio should be realistic
    expect(metrics.combinedRatio).toBeGreaterThanOrEqual(80);
    expect(metrics.combinedRatio).toBeLessThanOrEqual(120);

    // Underwriting profit margin should be calculated correctly
    expect(metrics.underwritingProfitMargin).toBeCloseTo(100 - metrics.combinedRatio, 1);
  });

  it('should handle company-specific adjustments', () => {
    const pgrData = { ...mockFinancialData, symbol: 'PGR' };
    const pgrMetrics = calculateInsuranceMetrics(pgrData);

    const chubbData = { ...mockFinancialData, symbol: 'CB' };
    const chubbMetrics = calculateInsuranceMetrics(chubbData);

    // Progressive should have better combined ratio than average
    // Chubb should have excellent combined ratio
    expect(pgrMetrics.combinedRatio).toBeLessThan(100);
    expect(chubbMetrics.combinedRatio).toBeLessThan(98);
  });

  it('should handle missing or invalid data gracefully', () => {
    const invalidData = {
      symbol: 'TEST',
      revenue: 0,
      netIncome: 0,
      totalAssets: 0,
      totalStockholdersEquity: 0
    };

    const metrics = calculateInsuranceMetrics(invalidData);

    expect(metrics.profitMargin).toBe(0);
    expect(metrics.roe).toBe(0);
    expect(metrics.roa).toBe(0);
    expect(metrics.expenseRatio).toBeGreaterThanOrEqual(15);
  });

  it('should include all required metric fields', () => {
    const metrics = calculateInsuranceMetrics(mockFinancialData);

    const requiredFields = [
      'revenue', 'netIncome', 'totalAssets', 'totalEquity', 'sharesOutstanding',
      'profitMargin', 'roe', 'roa', 'bookValuePerShare', 'debtToEquity',
      'expenseRatio', 'lossRatio', 'combinedRatio', 'underwritingProfitMargin',
      'investmentYield', 'floatPerShare', 'reserveRatio',
      'year', 'period', 'symbol'
    ];

    requiredFields.forEach(field => {
      expect(metrics).toHaveProperty(field);
      expect(metrics[field]).toBeDefined();
    });
  });

  it('should round values appropriately', () => {
    const metrics = calculateInsuranceMetrics(mockFinancialData);

    // Financial ratios should be rounded to 1 decimal place
    expect(metrics.profitMargin % 1).toBeCloseTo(0.8, 1);
    expect(metrics.roe % 1).toBeCloseTo(0.0, 1);

    // Currency values should be rounded to 2 decimal places
    expect(metrics.bookValuePerShare % 1).toBeCloseTo(0.0, 2);
  });
});
