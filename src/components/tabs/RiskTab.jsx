/**
 * Risk Tab Component
 * Risk assessment and analysis
 * Placeholder for AI coding agents to enhance
 */

import React from 'react';
import { Shield, AlertTriangle, TrendingDown } from 'lucide-react';
import './RiskTab.css';

/**
 * RiskTab Component
 * @param {Object} props - Component props
 * @param {Object} props.data - Financial data
 * @param {string} props.ticker - Company ticker
 */
const RiskTab = ({ data, ticker }) => {
  const metrics = data?.currentMetrics;

  if (!metrics) {
    return (
      <div className="risk-tab">
        <div className="no-data">No risk data available</div>
      </div>
    );
  }

  // Simple risk assessment based on key metrics
  const riskFactors = [
    {
      factor: 'Underwriting Risk',
      level: metrics.combinedRatio > 105 ? 'High' : metrics.combinedRatio > 100 ? 'Medium' : 'Low',
      description: `Combined ratio of ${metrics.combinedRatio}%`,
      icon: Shield
    },
    {
      factor: 'Profitability Risk',
      level: metrics.roe < 5 ? 'High' : metrics.roe < 10 ? 'Medium' : 'Low',
      description: `ROE of ${metrics.roe}%`,
      icon: TrendingDown
    },
    {
      factor: 'Leverage Risk',
      level: metrics.debtToEquity > 50 ? 'High' : metrics.debtToEquity > 30 ? 'Medium' : 'Low',
      description: `Debt-to-equity ratio of ${metrics.debtToEquity}%`,
      icon: AlertTriangle
    }
  ];

  const getRiskColor = (level) => {
    switch (level) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="risk-tab">
      <div className="risk-header">
        <Shield className="risk-icon" />
        <div>
          <h2>Risk Assessment</h2>
          <p>Risk analysis for {ticker}</p>
        </div>
      </div>

      <div className="risk-factors">
        <h3>Key Risk Factors</h3>
        <div className="factors-grid">
          {riskFactors.map((factor, index) => {
            const IconComponent = factor.icon;
            return (
              <div key={index} className="risk-factor">
                <div className="factor-header">
                  <IconComponent className="factor-icon" />
                  <div className="factor-info">
                    <div className="factor-name">{factor.factor}</div>
                    <div 
                      className="factor-level"
                      style={{ color: getRiskColor(factor.level) }}
                    >
                      {factor.level} Risk
                    </div>
                  </div>
                </div>
                <div className="factor-description">{factor.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="risk-summary">
        <h3>Risk Summary</h3>
        <div className="summary-content">
          <p>
            This is a simplified risk assessment based on key financial metrics. 
            A comprehensive risk analysis would include additional factors such as:
          </p>
          <ul>
            <li>Geographic concentration and catastrophe exposure</li>
            <li>Reserve adequacy and development patterns</li>
            <li>Investment portfolio composition and credit quality</li>
            <li>Regulatory capital requirements and solvency ratios</li>
            <li>Market conditions and competitive positioning</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RiskTab);
