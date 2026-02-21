import { vi } from 'vitest';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
});

Object.defineProperty(globalThis, 'sessionStorage', {
  value: localStorageMock,
});
