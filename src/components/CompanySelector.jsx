/**
 * Company Selector Component
 * Simplified dropdown for selecting top 20 P&C insurance companies
 * Optimized for AI coding agents with clean interface
 */

import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { TOP_INSURANCE_COMPANIES, getCompanyByTicker } from '../constants/insuranceCompanies';
import './CompanySelector.css';

/**
 * CompanySelector Component
 * @param {Object} props - Component props
 * @param {string} props.selectedTicker - Currently selected ticker
 * @param {Function} props.onTickerChange - Callback when ticker changes
 * @param {boolean} props.disabled - Whether selector is disabled
 */
const CompanySelector = ({ selectedTicker, onTickerChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedCompany = getCompanyByTicker(selectedTicker);

  /**
   * Filter companies based on search term
   */
  const filteredCompanies = TOP_INSURANCE_COMPANIES.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Handle company selection
   * @param {string} ticker - Selected ticker symbol
   */
  const handleSelect = (ticker) => {
    onTickerChange(ticker);
    setIsOpen(false);
    setSearchTerm('');
  };

  /**
   * Toggle dropdown open/closed
   */
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  /**
   * Handle search input change
   * @param {Event} e - Input change event
   */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="company-selector">
      <label className="selector-label">
        Select P&C Insurance Company
      </label>
      
      <div className={`selector-container ${disabled ? 'disabled' : ''}`}>
        <button
          className={`selector-button ${isOpen ? 'open' : ''}`}
          onClick={toggleDropdown}
          disabled={disabled}
        >
          <div className="selected-company">
            <div className="company-ticker">{selectedCompany?.ticker}</div>
            <div className="company-name">{selectedCompany?.name}</div>
          </div>
          <ChevronDown className={`chevron ${isOpen ? 'rotated' : ''}`} />
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            {/* Search Input */}
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
                autoFocus
              />
            </div>

            {/* Company List */}
            <div className="company-list">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map(company => (
                  <button
                    key={company.ticker}
                    className={`company-option ${
                      company.ticker === selectedTicker ? 'selected' : ''
                    }`}
                    onClick={() => handleSelect(company.ticker)}
                  >
                    <div className="option-content">
                      <div className="option-ticker">{company.ticker}</div>
                      <div className="option-name">{company.name}</div>
                      <div className="option-meta">
                        <span className="market-cap">{company.marketCap}</span>
                        <span className="segment">{company.segment}</span>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="no-results">
                  No companies found matching &ldquo;{searchTerm}&rdquo;
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySelector;
