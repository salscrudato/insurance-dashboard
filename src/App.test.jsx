import { render, screen } from '@testing-library/react'
import App from './App.jsx'

test('renders insurance dashboard', () => {
  render(<App />)
  const titleElement = screen.getByText(/P&C Insurance Analytics/i)
  expect(titleElement).toBeInTheDocument()
})
