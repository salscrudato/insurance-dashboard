import '@testing-library/jest-dom'

// Mock ResizeObserver for Recharts
global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb
  }
  observe() {
    this.cb([{
      contentRect: { width: 800, height: 400 },
      borderBoxSize: [{ inlineSize: 800, blockSize: 400 }]
    }], this)
  }
  unobserve() {}
  disconnect() {}
}
