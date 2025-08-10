/**
 * Format Utilities Test Suite
 * Comprehensive tests for all formatting functions
 */

import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatPercentage,
  formatLargeNumber,
  formatMarketCap
} from './format.js';

describe('formatCurrency', () => {
  it('should format positive numbers correctly', () => {
    expect(formatCurrency(1234567)).toBe('$1,234,567');
    expect(formatCurrency(100)).toBe('$100');
    expect(formatCurrency(0)).toBe('$0');
  });

  it('should handle negative numbers', () => {
    expect(formatCurrency(-1234567)).toBe('-$1,234,567');
  });

  it('should handle null/undefined/NaN values', () => {
    expect(formatCurrency(null)).toBe('N/A');
    expect(formatCurrency(undefined)).toBe('N/A');
    expect(formatCurrency(NaN)).toBe('N/A');
  });

  it('should support different currencies', () => {
    expect(formatCurrency(1000, 'EUR')).toBe('€1,000');
  });
});

describe('formatNumber', () => {
  it('should format numbers with default options', () => {
    expect(formatNumber(1234.567)).toBe('1,234.57');
    expect(formatNumber(1000)).toBe('1,000');
  });

  it('should respect custom options', () => {
    expect(formatNumber(1234.567, { maximumFractionDigits: 0 })).toBe('1,235');
    expect(formatNumber(1234.567, { minimumFractionDigits: 3, maximumFractionDigits: 3 })).toBe('1,234.567');
  });
});

describe('formatDate', () => {
  it('should format dates correctly', () => {
    const date = new Date('2024-01-15T12:00:00Z');
    const formatted = formatDate(date);
    expect(formatted).toMatch(/Jan 1[45], 2024/); // Account for timezone differences
  });

  it('should handle string dates', () => {
    const formatted = formatDate('2024-01-15T12:00:00Z');
    expect(formatted).toMatch(/Jan 1[45], 2024/); // Account for timezone differences
  });

  it('should support custom options', () => {
    const date = new Date('2024-01-15T12:00:00Z');
    const formatted = formatDate(date, { month: 'long' });
    expect(formatted).toMatch(/January 1[45], 2024/); // Account for timezone differences
  });
});

describe('formatPercentage', () => {
  it('should format decimal percentages', () => {
    expect(formatPercentage(0.15)).toBe('15.0%');
    expect(formatPercentage(0.1234)).toBe('12.3%');
  });

  it('should handle already-percentage values', () => {
    expect(formatPercentage(15)).toBe('15.0%');
    expect(formatPercentage(100)).toBe('100.0%');
  });

  it('should handle null/undefined/NaN values', () => {
    expect(formatPercentage(null)).toBe('N/A');
    expect(formatPercentage(undefined)).toBe('N/A');
    expect(formatPercentage(NaN)).toBe('N/A');
  });

  it('should support custom decimal places', () => {
    expect(formatPercentage(0.1234, 2)).toBe('12.34%');
    expect(formatPercentage(0.1234, 0)).toBe('12%');
  });
});

describe('formatLargeNumber', () => {
  it('should format large numbers with suffixes', () => {
    expect(formatLargeNumber(1500000000000)).toBe('1.5T');
    expect(formatLargeNumber(2500000000)).toBe('2.5B');
    expect(formatLargeNumber(1500000)).toBe('1.5M');
    expect(formatLargeNumber(2500)).toBe('2.5K');
  });

  it('should handle small numbers', () => {
    expect(formatLargeNumber(500)).toBe('500');
    expect(formatLargeNumber(0)).toBe('0');
  });

  it('should handle negative numbers', () => {
    expect(formatLargeNumber(-1500000000)).toBe('-1.5B');
  });

  it('should handle null/undefined/NaN values', () => {
    expect(formatLargeNumber(null)).toBe('N/A');
    expect(formatLargeNumber(undefined)).toBe('N/A');
    expect(formatLargeNumber(NaN)).toBe('N/A');
  });

  it('should support custom decimal places', () => {
    expect(formatLargeNumber(1500000000, 2)).toBe('1.50B');
    expect(formatLargeNumber(1500000000, 0)).toBe('2B');
  });
});

describe('formatMarketCap', () => {
  it('should format market cap values correctly', () => {
    expect(formatMarketCap(1500000000000)).toBe('$1.5T');
    expect(formatMarketCap(2500000000)).toBe('$2.5B');
    expect(formatMarketCap(1500000)).toBe('$1.5M');
  });

  it('should handle invalid values', () => {
    expect(formatMarketCap(null)).toBe('N/A');
    expect(formatMarketCap(undefined)).toBe('N/A');
    expect(formatMarketCap(0)).toBe('N/A');
    expect(formatMarketCap(-1000)).toBe('N/A');
  });
});
