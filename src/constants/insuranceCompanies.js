/**
 * Top 20 Property & Casualty Insurance Companies by Market Cap
 * Pure-play P&C insurers only - no health, banking, or payment companies
 * Optimized for AI coding agents - clean data structure with consistent naming
 */

export const TOP_INSURANCE_COMPANIES = [
  // Top 5 - Default comparison set (Pure P&C Focus)
  { ticker: 'BRK-B', name: 'Berkshire Hathaway Inc. Class B', marketCap: 'Large', segment: 'Diversified P&C', isTop5: true },
  { ticker: 'PGR', name: 'Progressive Corporation', marketCap: 'Large', segment: 'Auto Insurance', isTop5: true },
  { ticker: 'TRV', name: 'The Travelers Companies Inc.', marketCap: 'Large', segment: 'Commercial P&C', isTop5: true },
  { ticker: 'ALL', name: 'The Allstate Corporation', marketCap: 'Large', segment: 'Personal Lines', isTop5: true },
  { ticker: 'CB', name: 'Chubb Limited', marketCap: 'Large', segment: 'Commercial P&C', isTop5: true },

  // Top 6-20 P&C Insurers
  { ticker: 'AIG', name: 'American International Group Inc.', marketCap: 'Large', segment: 'Commercial P&C', isTop5: false },
  { ticker: 'HIG', name: 'The Hartford Financial Services Group Inc.', marketCap: 'Large', segment: 'Commercial P&C', isTop5: false },
  { ticker: 'CINF', name: 'Cincinnati Financial Corporation', marketCap: 'Mid-Large', segment: 'Commercial P&C', isTop5: false },
  { ticker: 'WRB', name: 'W. R. Berkley Corporation', marketCap: 'Mid-Large', segment: 'Commercial P&C', isTop5: false },
  { ticker: 'ACGL', name: 'Arch Capital Group Ltd.', marketCap: 'Mid-Large', segment: 'Specialty P&C', isTop5: false },
  { ticker: 'EG', name: 'Everest Group Ltd.', marketCap: 'Mid-Large', segment: 'Reinsurance', isTop5: false },
  { ticker: 'RNR', name: 'RenaissanceRe Holdings Ltd.', marketCap: 'Mid', segment: 'Reinsurance', isTop5: false },
  { ticker: 'AFG', name: 'American Financial Group Inc.', marketCap: 'Mid', segment: 'Specialty P&C', isTop5: false },
  { ticker: 'RLI', name: 'RLI Corp.', marketCap: 'Mid', segment: 'Specialty P&C', isTop5: false },
  { ticker: 'SIGI', name: 'Selective Insurance Group Inc.', marketCap: 'Mid', segment: 'Commercial P&C', isTop5: false },
  { ticker: 'KMPR', name: 'Kemper Corporation', marketCap: 'Small-Mid', segment: 'Auto Insurance', isTop5: false },
  { ticker: 'UFCS', name: 'United Fire Group Inc.', marketCap: 'Small-Mid', segment: 'Commercial P&C', isTop5: false },
  { ticker: 'PLMR', name: 'Palomar Holdings Inc.', marketCap: 'Small-Mid', segment: 'Specialty P&C', isTop5: false },
  { ticker: 'LMND', name: 'Lemonade Inc.', marketCap: 'Small-Mid', segment: 'Insurtech P&C', isTop5: false },
  { ticker: 'ROOT', name: 'Root Inc.', marketCap: 'Small', segment: 'Insurtech Auto', isTop5: false }
];

/**
 * Get company by ticker symbol
 * @param {string} ticker - Company ticker symbol
 * @returns {Object|null} Company object or null if not found
 */
export const getCompanyByTicker = (ticker) => {
  return TOP_INSURANCE_COMPANIES.find(company => company.ticker === ticker) || null;
};

/**
 * Get top 5 companies for default comparison
 * @returns {Array} Array of top 5 company objects
 */
export const getTop5Companies = () => {
  return TOP_INSURANCE_COMPANIES.filter(company => company.isTop5);
};

/**
 * Get companies by market cap category
 * @param {string} marketCap - Market cap category ('Large', 'Mid', 'Small-Mid', 'Small')
 * @returns {Array} Array of company objects
 */
export const getCompaniesByMarketCap = (marketCap) => {
  return TOP_INSURANCE_COMPANIES.filter(company => company.marketCap === marketCap);
};

/**
 * Get companies by business segment
 * @param {string} segment - Business segment
 * @returns {Array} Array of company objects
 */
export const getCompaniesBySegment = (segment) => {
  return TOP_INSURANCE_COMPANIES.filter(company => company.segment === segment);
};

/**
 * Default company for initial load
 */
export const DEFAULT_COMPANY = TOP_INSURANCE_COMPANIES[0]; // Berkshire Hathaway Class B

/**
 * Market cap categories for filtering
 */
export const MARKET_CAP_CATEGORIES = ['Large', 'Mid-Large', 'Mid', 'Small-Mid', 'Small'];

/**
 * P&C Insurance business segments for filtering
 */
export const BUSINESS_SEGMENTS = [
  'Diversified P&C', 'Commercial P&C', 'Personal Lines',
  'Auto Insurance', 'Specialty P&C', 'Reinsurance', 'Insurtech P&C', 'Insurtech Auto'
];
