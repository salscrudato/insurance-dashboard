/**
 * Formatting Utilities
 *
 * Comprehensive set of formatting functions for financial data display
 * Optimized for P&C insurance dashboard with consistent formatting
 *
 * Features:
 * - Currency formatting with locale support
 * - Percentage formatting with smart detection
 * - Large number formatting with suffixes (K, M, B, T)
 * - Date formatting with customizable options
 * - Null/undefined safety for all functions
 *
 * @author Insurance Dashboard Team
 * @version 2.0.0
 */

/**
 * Format currency values with proper locale and currency symbol
 * @param {number|null|undefined} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string or 'N/A' if invalid
 * @example formatCurrency(1234567) // "$1,234,567"
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'N/A';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format numeric values with customizable decimal places
 * @param {number} number - Number to format
 * @param {Object} options - Intl.NumberFormat options
 * @returns {string} Formatted number string
 * @example formatNumber(1234.567) // "1,234.57"
 */
export const formatNumber = (number, options = {}) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(number)
}

/**
 * Format date values with customizable options
 * @param {Date|string} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 * @example formatDate('2024-01-15') // "Jan 15, 2024"
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return new Intl.DateTimeFormat('en-US', {
    ...defaultOptions,
    ...options,
  }).format(new Date(date))
}

/**
 * Format percentage values with smart detection of decimal vs percentage format
 * @param {number|null|undefined} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage string or 'N/A' if invalid
 * @example formatPercentage(0.15) // "15.0%"
 * @example formatPercentage(15) // "15.0%"
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  // If value is already a percentage (> 1), don't multiply by 100
  const percentage = value > 1 ? value : value * 100;
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Format large numbers with appropriate suffixes
 * @param {number} value - Numeric value to format
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted number string
 */
export const formatLargeNumber = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }

  const absValue = Math.abs(value);

  if (absValue >= 1e12) {
    return `${(value / 1e12).toFixed(decimals)}T`;
  }
  if (absValue >= 1e9) {
    return `${(value / 1e9).toFixed(decimals)}B`;
  }
  if (absValue >= 1e6) {
    return `${(value / 1e6).toFixed(decimals)}M`;
  }
  if (absValue >= 1e3) {
    return `${(value / 1e3).toFixed(decimals)}K`;
  }

  return value.toLocaleString();
};

/**
 * Format market capitalization values with appropriate suffixes
 * @param {number} marketCap - Market cap value
 * @returns {string} Formatted market cap string
 * @example formatMarketCap(1500000000) // "$1.5B"
 */
export const formatMarketCap = (marketCap) => {
  if (!marketCap || marketCap <= 0) return 'N/A';
  if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(1)}T`;
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(1)}B`;
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(1)}M`;
  return `$${marketCap.toLocaleString()}`;
};
