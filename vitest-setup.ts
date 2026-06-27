import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Global mocks for Next.js and browser APIs that might be missing in JSDOM
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
