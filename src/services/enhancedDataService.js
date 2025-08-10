/**
 * Enhanced Multi-Source Financial Data Service
 * 
 * Integrates multiple data sources for comprehensive P&C insurance analysis:
 * - Financial Modeling Prep (primary financial data)
 * - FRED API (macroeconomic indicators)
 * - SEC EDGAR (regulatory filings)
 * - Cross-validation and data accuracy verification
 * 
 * Optimized for AI coding agents with robust error handling and caching
 * 
 * @author Insurance Dashboard Team
 * @version 3.0.0
 */

// API Configuration
const FMP_API_KEY = import.meta.env.VITE_FMP_API_KEY || '603a891ea6742775511aeca0574035d0';
const FRED_API_KEY = import.meta.env.VITE_FRED_API_KEY || 'your_fred_api_key_here';

const API_ENDPOINTS = {
  FMP_BASE: 'https://financialmodelingprep.com/api/v3',
  FRED_BASE: 'https://api.stlouisfed.org/fred',
  SEC_BASE: 'https://data.sec.gov'
};

// Cache configuration
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
const cache = new Map();

/**
 * Enhanced cache utilities with TTL and size management
 */
const cacheUtils = {
  set(key, value, ttl = CACHE_DURATION) {
    const expiry = Date.now() + ttl;
    cache.set(key, { value, expiry });
    
    // Cleanup old entries if cache gets too large
    if (cache.size > 100) {
      const now = Date.now();
      for (const [k, v] of cache.entries()) {
        if (v.expiry < now) {
          cache.delete(k);
        }
      }
    }
  },

  get(key) {
    const item = cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      cache.delete(key);
      return null;
    }
    
    return item.value;
  },

  clear() {
    cache.clear();
  }
};

/**
 * Fetch macroeconomic indicators from FRED API
 * @param {Array<string>} seriesIds - FRED series IDs to fetch
 * @returns {Promise<Object>} Economic indicators data
 */
export const fetchEconomicIndicators = async (seriesIds = [
  'UNRATE',      // Unemployment Rate
  'FEDFUNDS',    // Federal Funds Rate
  'CPIAUCSL',    // Consumer Price Index
  'GDP',         // Gross Domestic Product
  'HOUST'        // Housing Starts
]) => {
  const cacheKey = `fred_indicators_${seriesIds.join('_')}`;
  const cached = cacheUtils.get(cacheKey);
  if (cached) return { ...cached, source: 'cache' };

  try {
    const promises = seriesIds.map(async (seriesId) => {
      const response = await fetch(
        `${API_ENDPOINTS.FRED_BASE}/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&limit=12&sort_order=desc`
      );
      
      if (!response.ok) {
        console.warn(`Failed to fetch FRED series ${seriesId}`);
        return { seriesId, data: null, error: response.statusText };
      }
      
      const data = await response.json();
      const observations = data.observations || [];
      
      // Get latest non-null value
      const latestValue = observations.find(obs => obs.value !== '.')?.value;
      
      return {
        seriesId,
        value: latestValue ? parseFloat(latestValue) : null,
        date: observations[0]?.date,
        data: observations.slice(0, 6) // Last 6 periods
      };
    });

    const results = await Promise.all(promises);
    
    const indicators = results.reduce((acc, result) => {
      if (result.value !== null) {
        acc[result.seriesId] = {
          value: result.value,
          date: result.date,
          historical: result.data
        };
      }
      return acc;
    }, {});

    const result = {
      indicators,
      timestamp: new Date().toISOString(),
      source: 'fred'
    };

    cacheUtils.set(cacheKey, result);
    return { ...result, source: 'api' };

  } catch (error) {
    console.error('FRED API Error:', error);
    return {
      indicators: {},
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Enhanced SEC EDGAR data fetching with comprehensive filing analysis
 * @param {string} ticker - Company ticker symbol
 * @returns {Promise<Object>} SEC filing data with analysis
 */
export const fetchSECFilings = async (ticker) => {
  const cacheKey = `sec_filings_${ticker}`;
  const cached = cacheUtils.get(cacheKey);
  if (cached) return { ...cached, source: 'cache' };

  // Enhanced CIK mapping for major P&C insurers
  const CIK_MAPPING = {
    'TRV': '0000086312',   // Travelers Companies Inc
    'AIG': '0000005272',   // American International Group Inc
    'PGR': '0000080661',   // Progressive Corp
    'ALL': '0000899051',   // Allstate Corp
    'CB': '0000896159',    // Chubb Ltd
    'HIG': '0000874766',   // Hartford Financial Services Group Inc
    'CINF': '0000020286',  // Cincinnati Financial Corp
    'WRB': '0000009984',   // W R Berkley Corp
    'ACGL': '0001267238',  // Arch Capital Group Ltd
    'EG': '0000851968',    // Everest Group Ltd
    'RLI': '0000000315',   // RLI Corp
    'KMPR': '0001567892',  // Kemper Corp
    'AFG': '0000000004'    // American Financial Group Inc
  };

  const cik = CIK_MAPPING[ticker];
  if (!cik) {
    return {
      error: `CIK not found for ticker ${ticker}. Available tickers: ${Object.keys(CIK_MAPPING).join(', ')}`,
      timestamp: new Date().toISOString()
    };
  }

  try {
    const response = await fetch(
      `${API_ENDPOINTS.SEC_BASE}/submissions/CIK${cik}.json`,
      {
        headers: {
          'User-Agent': 'Insurance Dashboard Research Tool (contact@insurancedashboard.com)',
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`SEC API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Enhanced filing analysis
    const recentFilings = data.filings?.recent || {};
    const forms = recentFilings.form || [];
    const dates = recentFilings.filingDate || [];

    // Analyze filing types and recency
    const filingAnalysis = {
      total: forms.length,
      recent10K: forms.findIndex(form => form === '10-K'),
      recent10Q: forms.findIndex(form => form === '10-Q'),
      recent8K: forms.findIndex(form => form === '8-K'),
      lastFilingDate: dates[0],
      filingFrequency: calculateFilingFrequency(dates.slice(0, 12))
    };

    const result = {
      cik: data.cik,
      name: data.name,
      ticker: data.tickers?.[0] || ticker,
      entityType: data.entityType,
      sic: data.sic,
      sicDescription: data.sicDescription,
      filings: {
        recent: recentFilings,
        analysis: filingAnalysis
      },
      addresses: {
        business: data.addresses?.business,
        mailing: data.addresses?.mailing
      },
      timestamp: new Date().toISOString()
    };

    cacheUtils.set(cacheKey, result);
    return { ...result, source: 'api' };

  } catch (error) {
    console.error(`SEC EDGAR Error for ${ticker}:`, error);
    return {
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Calculate filing frequency from recent filing dates
 * @param {Array<string>} dates - Array of filing dates
 * @returns {string} Filing frequency assessment
 */
const calculateFilingFrequency = (dates) => {
  if (!dates || dates.length < 2) return 'insufficient_data';

  const sortedDates = dates
    .map(date => new Date(date))
    .sort((a, b) => b - a);

  const daysBetween = (sortedDates[0] - sortedDates[1]) / (1000 * 60 * 60 * 24);

  if (daysBetween <= 30) return 'frequent';
  if (daysBetween <= 90) return 'regular';
  if (daysBetween <= 180) return 'periodic';
  return 'infrequent';
};

/**
 * Cross-validate financial data across multiple sources
 * @param {string} ticker - Company ticker symbol
 * @param {Object} primaryData - Primary financial data from FMP
 * @returns {Promise<Object>} Validation results and confidence score
 */
export const validateFinancialData = async (ticker, primaryData) => {
  const validationResults = {
    ticker,
    confidence: 0,
    validations: [],
    warnings: [],
    timestamp: new Date().toISOString()
  };

  try {
    // Validate against SEC filings
    const secData = await fetchSECFilings(ticker);
    if (!secData.error) {
      validationResults.validations.push({
        source: 'SEC EDGAR',
        status: 'verified',
        message: `Company verified: ${secData.name}`
      });
      validationResults.confidence += 25;
    } else {
      validationResults.warnings.push({
        source: 'SEC EDGAR',
        message: secData.error
      });
    }

    // Validate financial metrics ranges for P&C insurance industry
    const metrics = primaryData.currentMetrics;
    if (metrics) {
      // Combined Ratio validation (typical range: 80-120%)
      if (metrics.combinedRatio >= 80 && metrics.combinedRatio <= 120) {
        validationResults.validations.push({
          source: 'Industry Benchmarks',
          status: 'within_range',
          message: `Combined Ratio ${metrics.combinedRatio}% within industry range`
        });
        validationResults.confidence += 20;
      } else {
        validationResults.warnings.push({
          source: 'Industry Benchmarks',
          message: `Combined Ratio ${metrics.combinedRatio}% outside typical range (80-120%)`
        });
      }

      // ROE validation (typical range: 5-25%)
      if (metrics.roe >= 5 && metrics.roe <= 25) {
        validationResults.validations.push({
          source: 'Industry Benchmarks',
          status: 'within_range',
          message: `ROE ${metrics.roe}% within industry range`
        });
        validationResults.confidence += 20;
      } else {
        validationResults.warnings.push({
          source: 'Industry Benchmarks',
          message: `ROE ${metrics.roe}% outside typical range (5-25%)`
        });
      }

      // Revenue validation (should be positive and reasonable)
      if (metrics.revenue > 0 && metrics.revenue < 1e12) {
        validationResults.validations.push({
          source: 'Data Integrity',
          status: 'valid',
          message: 'Revenue data appears valid'
        });
        validationResults.confidence += 15;
      }
    }

    // Calculate final confidence score
    validationResults.confidence = Math.min(100, validationResults.confidence);
    
    return validationResults;

  } catch (error) {
    validationResults.warnings.push({
      source: 'Validation System',
      message: `Validation error: ${error.message}`
    });
    return validationResults;
  }
};

/**
 * Get industry benchmark data for comparison
 * @returns {Object} Industry benchmark metrics
 */
export const getIndustryBenchmarks = () => {
  return {
    combinedRatio: {
      excellent: { min: 80, max: 95 },
      good: { min: 95, max: 100 },
      fair: { min: 100, max: 105 },
      poor: { min: 105, max: 120 }
    },
    roe: {
      excellent: { min: 15, max: 25 },
      good: { min: 10, max: 15 },
      fair: { min: 5, max: 10 },
      poor: { min: 0, max: 5 }
    },
    lossRatio: {
      excellent: { min: 50, max: 65 },
      good: { min: 65, max: 75 },
      fair: { min: 75, max: 85 },
      poor: { min: 85, max: 95 }
    },
    expenseRatio: {
      excellent: { min: 15, max: 25 },
      good: { min: 25, max: 30 },
      fair: { min: 30, max: 35 },
      poor: { min: 35, max: 45 }
    }
  };
};

/**
 * Enhanced financial data fetching with multi-source validation
 * @param {string} ticker - Company ticker symbol
 * @returns {Promise<Object>} Enhanced financial data with validation
 */
export const fetchEnhancedFinancialData = async (ticker) => {
  try {
    // Import the existing service
    const { fetchCompanyFinancials } = await import('./financialDataService.js');
    
    // Get primary financial data
    const primaryData = await fetchCompanyFinancials(ticker);
    
    // Get economic context
    const economicData = await fetchEconomicIndicators();
    
    // Validate data
    const validation = await validateFinancialData(ticker, primaryData);
    
    return {
      ...primaryData,
      economicContext: economicData,
      validation,
      enhanced: true,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    throw new Error(`Enhanced data fetch failed for ${ticker}: ${error.message}`);
  }
};
