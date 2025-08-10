# P&C Insurance Analytics Dashboard

> **Professional Property & Casualty Insurance Research Platform**  
> Modern React application with AI-powered insights and comprehensive financial analysis

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 📊 Features

### Core Analytics
- **Real-time Financial Data** - Live P&C insurance company metrics
- **AI-Powered Insights** - GPT-4 analysis of financial performance
- **Interactive Charts** - Professional data visualization with Recharts
- **Company Comparison** - Side-by-side analysis of multiple insurers
- **Historical Trends** - Multi-period performance tracking

### Data Sources
- **Financial Modeling Prep** - Primary financial statements and ratios
- **FRED Economic Data** - Macroeconomic indicators and context
- **SEC EDGAR** - Regulatory filings and validation
- **Cross-Validation** - Multi-source data accuracy verification

### UI/UX Excellence
- **Modern Design System** - CSS custom properties and design tokens
- **Responsive Layout** - Optimized for desktop and mobile
- **Accessibility** - WCAG 2.1 AA compliance
- **Professional Styling** - Financial industry-focused design

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 19 + Vite
- **Styling**: Modern CSS with custom properties
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library
- **AI**: OpenAI GPT-4 integration

### Project Structure
```
src/
├── components/           # React components
│   ├── tabs/            # Dashboard tab components
│   ├── common/          # Reusable UI components
│   ├── Dashboard.jsx    # Main dashboard container
│   ├── CompanySelector.jsx
│   └── AIChat.jsx       # AI chat interface
├── services/            # API and data services
│   ├── financialDataService.js
│   ├── enhancedDataService.js
│   └── openaiService.js
├── constants/           # Static data and configuration
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── types/              # TypeScript definitions
```

## 🤖 AI Development System

### Augment AI Changelog & Memory System
*Optimized for token efficiency and seamless code handoff*

#### Current State (v3.0.0)
**Last Updated**: 2025-08-10

**Recent Enhancements**:
- ✅ Modern design system with CSS custom properties and design tokens
- ✅ Enhanced navigation with breadcrumbs, status indicators, and improved UX
- ✅ Professional chart styling with interactive elements and industry benchmarks
- ✅ FRED economic data integration for macroeconomic context
- ✅ Multi-source data validation system with confidence scoring
- ✅ Advanced data visualization with EnhancedChart component
- ✅ Comprehensive accessibility improvements (WCAG 2.1 AA)
- ✅ Performance optimizations with skeleton loading and animations
- ✅ Industry benchmarking service with peer group analysis
- ✅ Enhanced error handling and user feedback systems
- ✅ SEC EDGAR integration for regulatory data validation

#### Key Architectural Decisions
1. **Design System**: CSS custom properties for consistent theming
2. **Data Strategy**: Multi-source validation for accuracy
3. **Component Structure**: Modular tabs with clear separation
4. **State Management**: React hooks with custom abstractions
5. **Error Handling**: Comprehensive error boundaries and user feedback

#### AI Agent Guidelines
**Before Making Changes**:
1. Review this changelog for recent modifications
2. Check `docs/ARCHITECTURE.md` for detailed technical specs
3. Use `codebase-retrieval` for current implementation details
4. Validate changes don't conflict with existing patterns

**Code Standards**:
- Use CSS custom properties from design system
- Follow existing component patterns and naming
- Add comprehensive JSDoc comments
- Include error handling and loading states
- Write tests for new functionality

**Data API Guidelines**:
- Primary: Financial Modeling Prep for financial statements
- Secondary: FRED for economic context
- Validation: SEC EDGAR for regulatory verification
- Always implement caching and error fallbacks
- Cross-validate critical metrics

#### Memory Bank
**User Preferences**:
- Prefers robust, reliable features with free API options
- Values clean, well-documented code for AI enhancement
- Focuses on P&C insurance industry accuracy

**Technical Constraints**:
- Free tier API limits (FMP: 250 requests/day)
- Desktop-first design with mobile responsiveness
- Professional financial industry styling required

**Performance Optimizations**:
- 1-hour cache duration for financial data
- Request deduplication for concurrent calls
- Lazy loading for non-critical components
- Optimized bundle size with tree shaking

#### Component Architecture Map
```
Dashboard (main container)
├── Header (title, actions, status)
├── Controls (breadcrumb, company selector, quality indicator)
├── Navigation (enhanced tabs with badges)
└── Content (tab-specific components)
    ├── AIInsightsTab (GPT-4 analysis)
    ├── OverviewTab (MetricCard components)
    ├── MetricsTab (detailed financial data)
    ├── TrendsTab (EnhancedChart component)
    ├── RiskTab (risk assessment)
    └── ComparisonTab (peer analysis)

Common Components:
├── MetricCard (interactive financial metrics)
├── EnhancedChart (professional data visualization)
├── DataQualityIndicator (validation status)
├── SkeletonLoader (loading states)
├── LoadingSpinner (enhanced accessibility)
└── ErrorMessage (comprehensive error handling)

Services:
├── financialDataService (FMP + industry context)
├── enhancedDataService (FRED + SEC EDGAR)
├── dataValidationService (cross-validation)
├── industryBenchmarkService (peer analysis)
└── openaiService (AI insights)
```

#### Next Development Priorities
1. **Advanced Analytics**: Machine learning insights and predictive modeling
2. **Real-time Data**: WebSocket integration for live market updates
3. **Export Features**: PDF reports and data export functionality
4. **User Preferences**: Customizable dashboards and saved views
5. **Mobile App**: React Native companion application

---

## 📈 Data APIs

### Primary Sources
- **Financial Modeling Prep**: Financial statements, ratios, market data
- **FRED (Federal Reserve)**: Economic indicators and context
- **SEC EDGAR**: Regulatory filings and company verification

### API Configuration
```javascript
// Environment variables required
VITE_FMP_API_KEY=your_fmp_key
VITE_FRED_API_KEY=your_fred_key  
VITE_OPENAI_API_KEY=your_openai_key
```

### Data Validation
- Cross-reference metrics across sources
- Industry benchmark validation
- Automated data quality checks
- Confidence scoring system

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with UI
npm test:ui

# Test API endpoints
node test-apis.js
```

## 🚀 Deployment

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

## 🔧 Development Guide

### AI Agent Workflow
1. **Information Gathering**: Use `codebase-retrieval` for current state analysis
2. **Historical Context**: Use `git-commit-retrieval` for previous changes
3. **Planning**: Break complex tasks into manageable subtasks
4. **Implementation**: Follow existing patterns and design system
5. **Testing**: Write/update tests and verify functionality
6. **Documentation**: Update README and component documentation

### Code Quality Standards
- **TypeScript**: Gradual migration to TypeScript for better type safety
- **Testing**: Minimum 80% test coverage for new components
- **Accessibility**: WCAG 2.1 AA compliance required
- **Performance**: Core Web Vitals optimization
- **Documentation**: Comprehensive JSDoc for all functions

### Design System Usage
```css
/* Use design tokens instead of hardcoded values */
.component {
  color: var(--color-primary-600);        /* ✅ Good */
  padding: var(--space-4);                /* ✅ Good */
  border-radius: var(--radius-lg);        /* ✅ Good */

  /* Avoid hardcoded values */
  color: #3b82f6;                         /* ❌ Avoid */
  padding: 16px;                          /* ❌ Avoid */
}
```

### API Integration Guidelines
- **Primary Source**: Financial Modeling Prep for core financial data
- **Validation**: Always cross-validate with SEC EDGAR when available
- **Context**: Include FRED economic indicators for market context
- **Caching**: Implement 1-hour cache for all external API calls
- **Error Handling**: Graceful degradation with user-friendly messages

### Performance Optimization
- **Bundle Size**: Keep main bundle under 500KB gzipped
- **Loading States**: Use skeleton loaders for better perceived performance
- **Lazy Loading**: Implement for non-critical components
- **Caching**: Multi-layer caching (memory, localStorage, service worker)

## 📝 Contributing

### For Human Developers
1. Follow existing code patterns and naming conventions
2. Add comprehensive JSDoc documentation
3. Include tests for new features (minimum 80% coverage)
4. Update this README for significant changes
5. Use the design system tokens for styling
6. Ensure WCAG 2.1 AA accessibility compliance

### For AI Coding Agents
1. **Always read this README first** before making changes
2. Use `codebase-retrieval` to understand current implementation
3. Follow the established component patterns and architecture
4. Maintain the design system consistency
5. Update the AI changelog section after significant changes
6. Test changes thoroughly before completion

### Change Management Process
1. **Analysis**: Understand current state and requirements
2. **Planning**: Create detailed task breakdown
3. **Implementation**: Follow coding standards and patterns
4. **Testing**: Verify functionality and run test suite
5. **Documentation**: Update README and component docs
6. **Review**: Ensure changes align with project goals

---

**Built for Professional Insurance Analysis** | **Optimized for AI Enhancement** | **Industry-Leading P&C Research Platform**
