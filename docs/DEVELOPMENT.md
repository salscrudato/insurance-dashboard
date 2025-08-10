# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Environment Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with required API keys:
   ```
   VITE_FMP_API_KEY=your_financial_modeling_prep_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```
4. Start development server: `npm run dev`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests in watch mode
- `npm test -- --run` - Run tests once
- `node test-apis.js` - Test API endpoints

## Development Workflow

### Adding New Features

1. **Plan the Feature**: Break down into smaller tasks
2. **Create Types**: Add TypeScript interfaces if needed
3. **Write Tests**: Test-driven development approach
4. **Implement Logic**: Start with services/utilities
5. **Create Components**: Build UI components
6. **Integration**: Connect components to data flow
7. **Documentation**: Update docs and add comments

### Code Style Guidelines

#### Component Structure
```jsx
/**
 * Component description
 * @param {Object} props - Component props
 * @param {string} props.ticker - Company ticker
 */
const MyComponent = ({ ticker, data }) => {
  // 1. Hooks (useState, useEffect, custom hooks)
  // 2. Derived state and calculations
  // 3. Event handlers
  // 4. Render logic
  
  return (
    <div className="my-component">
      {/* JSX content */}
    </div>
  );
};

export default React.memo(MyComponent);
```

#### Service Functions
```javascript
/**
 * Service function description
 * @param {string} ticker - Company ticker symbol
 * @returns {Promise<Object>} Financial data
 * @throws {Error} When API request fails
 */
export const fetchFinancialData = async (ticker) => {
  try {
    // Implementation
  } catch (error) {
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
};
```

### Testing Guidelines

#### Component Tests
- Test user interactions and state changes
- Mock external dependencies
- Use React Testing Library best practices
- Test error states and loading states

#### Service Tests
- Test API integration logic
- Mock HTTP requests
- Validate data transformations
- Test error handling

#### Utility Tests
- Test edge cases and boundary conditions
- Validate input/output formats
- Test null/undefined handling

### Performance Best Practices

1. **Memoization**: Use React.memo for components, useCallback for functions
2. **Code Splitting**: Lazy load heavy components
3. **Bundle Analysis**: Monitor bundle size
4. **API Optimization**: Implement caching and rate limiting

### Error Handling

1. **Component Level**: Use error boundaries for component errors
2. **Service Level**: Wrap API calls in try-catch blocks
3. **User Feedback**: Display meaningful error messages
4. **Logging**: Log errors for debugging (development only)

### State Management

- Use React hooks for local state
- Custom hooks for shared logic
- Props for component communication
- Context for global state (if needed)

## API Integration

### Financial Modeling Prep
- Base URL: `https://financialmodelingprep.com/api/v3/`
- Rate Limit: 250 requests/day (free tier)
- Required endpoints:
  - `/income-statement/{ticker}`
  - `/balance-sheet-statement/{ticker}`
  - `/quote/{ticker}`

### OpenAI
- Model: GPT-4
- Rate Limit: Varies by plan
- Used for insights generation and chat functionality

## Deployment

### Production Build
1. Run tests: `npm test -- --run`
2. Run linting: `npm run lint`
3. Build application: `npm run build`
4. Test production build: `npm run preview`

### Environment Variables
- `VITE_FMP_API_KEY`: Financial Modeling Prep API key
- `VITE_OPENAI_API_KEY`: OpenAI API key
- `NODE_ENV`: Environment (development/production)

## Troubleshooting

### Common Issues

1. **API Rate Limits**: Implement caching or upgrade API plan
2. **CORS Errors**: Ensure proper API configuration
3. **Build Failures**: Check for TypeScript errors or missing dependencies
4. **Test Failures**: Verify mocks and async handling

### Debug Tools

- React Developer Tools
- Browser DevTools Network tab
- Console logging (development only)
- Vite build analyzer

## Contributing

1. Follow the established code style
2. Write tests for new features
3. Update documentation
4. Run linting and tests before committing
5. Use meaningful commit messages
