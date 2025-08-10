/**
 * OpenAI Service
 *
 * Consolidated AI service for P&C insurance analysis and chat functionality
 * Provides intelligent insights, comparisons, and interactive chat capabilities
 *
 * Features:
 * - Insurance-specific AI analysis and insights
 * - Multi-company comparison intelligence
 * - Interactive chat with financial context
 * - Professional formatting optimized for dashboard display
 * - Error handling and fallback mechanisms
 *
 * Models Used:
 * - GPT-4o-mini for cost-effective analysis
 * - Specialized prompts for P&C insurance domain
 *
 * Optimized for AI coding agents with clear function signatures
 *
 * @author Insurance Dashboard Team
 * @version 2.0.0
 */

/**
 * OpenAI API configuration
 * Environment variable: VITE_OPENAI_API_KEY
 * Note: In production, API key should be stored securely on backend
 */
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Enhanced insurance analyst system prompt for optimized UI/UX formatting
 */
const INSURANCE_SYSTEM_PROMPT = `You are an expert P&C insurance analyst providing insights for a professional dashboard.

CRITICAL FORMATTING REQUIREMENTS:
- Use ONLY plain text with natural paragraph breaks
- NO markdown, asterisks, bullets, or special characters
- NO numbered lists or bullet points
- Use line breaks to separate key points naturally
- Write in clear, professional paragraphs
- Keep responses concise but comprehensive
- Focus on actionable insights

CONTENT FOCUS:
- Combined ratio, loss ratio, expense ratio analysis
- Underwriting quality and profitability assessment
- ROE, ROA, and financial strength evaluation
- Competitive positioning and industry context
- Risk factors and growth prospects

TONE: Professional, data-driven, confident but not speculative.`;

/**
 * Make OpenAI API request
 * @param {Array} messages - Chat messages array
 * @param {Object} options - Additional options
 * @returns {Promise<string>} AI response
 */
const makeOpenAIRequest = async (messages, options = {}) => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY environment variable.');
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: options.max_tokens || 500,
        temperature: options.temperature || 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response generated';

  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`AI service unavailable: ${error.message}`);
  }
};

/**
 * Generate AI chat response with insurance data context
 * @param {string} userMessage - User's question
 * @param {Object} dashboardData - Current dashboard data for context
 * @returns {Promise<string>} AI response
 */
export const generateChatResponse = async (userMessage, dashboardData) => {
  try {
    // Build enhanced context from dashboard data
    const context = buildEnhancedDashboardContext(dashboardData);

    // Enhance user prompt for better formatting
    const enhancedPrompt = `${userMessage}

Please provide a clear, professional response using plain text only. Focus on practical insights that help understand the company's performance and competitive position. Structure your response in natural paragraphs without any special formatting, bullets, or markdown.`;

    const messages = [
      { role: 'system', content: INSURANCE_SYSTEM_PROMPT },
      { role: 'system', content: `Dashboard Context:\n${context}` },
      { role: 'user', content: enhancedPrompt }
    ];

    const response = await makeOpenAIRequest(messages, { max_tokens: 350, temperature: 0.6 });
    return cleanResponseFormatting(response);

  } catch (error) {
    throw new Error(`Failed to generate chat response: ${error.message}`);
  }
};

/**
 * Generate AI insights summary for company performance
 * @param {Object} companyData - Company financial and market data
 * @returns {Promise<string>} AI insights summary
 */
export const generateInsightsSummary = async (companyData) => {
  try {
    const { ticker, currentMetrics, marketData } = companyData;
    
    const prompt = `Analyze ${ticker} performance based on these metrics:

Insurance Metrics: Combined Ratio ${currentMetrics.combinedRatio}%, Loss Ratio ${currentMetrics.lossRatio}%, Expense Ratio ${currentMetrics.expenseRatio}%
Financial Metrics: ROE ${currentMetrics.roe}%, ROA ${currentMetrics.roa}%, Profit Margin ${currentMetrics.profitMargin}%
Valuation: Book Value $${currentMetrics.bookValuePerShare}, Current Price $${marketData?.price || 'N/A'}, Market Cap ${formatMarketCap(marketData?.marketCap)}

Provide a comprehensive analysis in 3-4 clear paragraphs covering underwriting quality, profitability, and competitive positioning. Use plain text only with natural paragraph breaks. Focus on actionable insights for P&C analysts. Be specific about what the metrics indicate about the company's performance and outlook.`;

    const messages = [
      { role: 'system', content: INSURANCE_SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ];

    const response = await makeOpenAIRequest(messages, { max_tokens: 400, temperature: 0.5 });
    return cleanResponseFormatting(response);

  } catch (error) {
    throw new Error(`Failed to generate insights: ${error.message}`);
  }
};

/**
 * Generate comparison insights for multiple companies
 * @param {Array} companiesData - Array of company data objects
 * @returns {Promise<string>} Comparison insights
 */
export const generateComparisonInsights = async (companiesData) => {
  try {
    const validCompanies = companiesData.filter(company => company.currentMetrics);
    
    if (validCompanies.length < 2) {
      throw new Error('Need at least 2 companies for comparison');
    }

    const comparisonData = validCompanies.map(company => ({
      ticker: company.ticker,
      combinedRatio: company.currentMetrics.combinedRatio,
      roe: company.currentMetrics.roe,
      expenseRatio: company.currentMetrics.expenseRatio
    }));

    const prompt = `Compare these P&C insurers:

${comparisonData.map(company =>
  `${company.ticker}: Combined Ratio ${company.combinedRatio}%, ROE ${company.roe}%, Expense Ratio ${company.expenseRatio}%`
).join(' | ')}

Provide a clear comparison analysis in 2-3 paragraphs using plain text only. Identify the top performer and explain why. Highlight key differentiators in underwriting discipline and operational efficiency. Focus on what these metrics reveal about each company's competitive position and management quality.`;

    const messages = [
      { role: 'system', content: INSURANCE_SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ];

    const response = await makeOpenAIRequest(messages, { max_tokens: 300, temperature: 0.5 });
    return cleanResponseFormatting(response);

  } catch (error) {
    throw new Error(`Failed to generate comparison insights: ${error.message}`);
  }
};



/**
 * Build enhanced dashboard context with more detailed metrics
 * @param {Object} dashboardData - Current dashboard data
 * @returns {string} Enhanced context string for AI
 */
const buildEnhancedDashboardContext = (dashboardData) => {
  if (!dashboardData) return 'No company data available.';

  const { ticker, currentMetrics, marketData } = dashboardData;

  return `Company: ${ticker}
Insurance Metrics: Combined Ratio ${currentMetrics?.combinedRatio}%, Loss Ratio ${currentMetrics?.lossRatio}%, Expense Ratio ${currentMetrics?.expenseRatio}%
Financial Metrics: ROE ${currentMetrics?.roe}%, ROA ${currentMetrics?.roa}%, Book Value $${currentMetrics?.bookValuePerShare}
Market Data: Price $${marketData?.price || 'N/A'}, Market Cap ${formatMarketCap(marketData?.marketCap)}`;
};

/**
 * Clean and optimize AI response formatting for UI display
 * @param {string} response - Raw AI response
 * @returns {string} Cleaned response
 */
const cleanResponseFormatting = (response) => {
  if (!response) return '';

  return response
    // Remove markdown formatting
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')

    // Remove bullet points and list formatting
    .replace(/^[\s]*[-•*]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')

    // Clean up excessive whitespace
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s+|\s+$/g, '')

    // Ensure proper paragraph spacing
    .replace(/\n\n/g, '\n\n')
    .trim();
};

/**
 * Format market cap for display
 * @param {number} marketCap - Market cap value
 * @returns {string} Formatted market cap
 */
const formatMarketCap = (marketCap) => {
  if (!marketCap) return 'N/A';
  if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(1)}T`;
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(1)}B`;
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(1)}M`;
  return `$${marketCap.toLocaleString()}`;
};
