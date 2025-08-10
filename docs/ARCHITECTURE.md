# Insurance Dashboard Architecture

## Overview

The Insurance Dashboard is a React-based web application designed for analyzing Property & Casualty (P&C) insurance companies. It provides comprehensive financial analysis, AI-powered insights, and comparative analytics for insurance industry professionals.

## Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: CSS Modules with custom properties
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint with React hooks plugin
- **Type Safety**: TypeScript (migration in progress)
- **APIs**: Financial Modeling Prep, OpenAI GPT-4

## Project Structure

```
src/
├── components/           # React components
│   ├── common/          # Reusable UI components
│   ├── tabs/            # Tab-specific components
│   ├── Dashboard.jsx    # Main dashboard component
│   └── *.test.jsx       # Component tests
├── hooks/               # Custom React hooks
│   ├── useAIInsights.js # AI insights management
│   └── *.test.js        # Hook tests
├── services/            # External API integrations
│   ├── financialDataService.js  # Financial data fetching
│   └── openaiService.js         # AI insights generation
├── utils/               # Utility functions
│   ├── format.js        # Data formatting utilities
│   └── *.test.js        # Utility tests
├── constants/           # Application constants
│   └── insuranceCompanies.js    # Company definitions
├── types/               # TypeScript type definitions
│   ├── financial.ts     # Financial data types
│   └── api.ts           # API response types
└── App.jsx              # Root application component
```

## Key Components

### Dashboard.jsx
- Main application container
- Manages global state and data fetching
- Handles tab navigation and company selection
- Coordinates between different tab components

### Tab Components
- **AIInsightsTab**: AI-powered analysis and insights
- **OverviewTab**: Company overview and key metrics
- **MetricsTab**: Detailed financial metrics display
- **TrendsTab**: Historical trend analysis
- **RiskTab**: Risk assessment and analysis
- **ComparisonTab**: Peer comparison functionality

### Custom Hooks
- **useAIInsights**: Manages AI insights loading and state
- Provides consistent error handling and loading states
- Prevents duplicate API calls and optimizes performance

## Data Flow

1. **Data Fetching**: Financial data is fetched from Financial Modeling Prep API
2. **Metric Calculation**: Raw financial data is processed into insurance-specific metrics
3. **AI Processing**: Metrics are sent to OpenAI for insights generation
4. **State Management**: React hooks manage component state and data flow
5. **UI Rendering**: Components render data with proper loading and error states

## Performance Optimizations

- **React.memo**: All tab components are memoized to prevent unnecessary re-renders
- **useCallback**: Expensive functions are memoized with proper dependencies
- **Custom Hooks**: Shared logic is extracted to prevent code duplication
- **Lazy Loading**: AI insights are loaded on-demand

## Testing Strategy

- **Unit Tests**: Comprehensive tests for utilities and services
- **Component Tests**: React Testing Library for component behavior
- **Hook Tests**: Custom hook testing with proper mocking
- **Integration Tests**: API endpoint validation

## Code Quality

- **ESLint**: Enforces consistent code style and catches common errors
- **TypeScript**: Gradual migration for better type safety
- **JSDoc**: Comprehensive documentation for all functions and components
- **Error Handling**: Robust error handling throughout the application

## API Integration

### Financial Modeling Prep
- Income statements and balance sheets
- Real-time market data
- Historical financial data

### OpenAI GPT-4
- AI-powered insights generation
- Comparative analysis
- Interactive chat functionality

## Security Considerations

- API keys are stored in environment variables
- No sensitive data is logged or exposed
- Rate limiting is implemented for external APIs
- Input validation prevents malicious data injection
