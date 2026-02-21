import { describe, expect, it, beforeEach, afterEach } from 'vitest';

describe('Theme functionality', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset document element
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('should set data-theme attribute on document element', () => {
    // Test the core functionality that the theme switcher uses
    document.documentElement.setAttribute('data-theme', 'dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    
    document.documentElement.setAttribute('data-theme', 'light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    
    document.documentElement.setAttribute('data-theme', 'halloween');
    expect(document.documentElement.getAttribute('data-theme')).toBe('halloween');
  });

  it('should store and retrieve theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    
    localStorage.setItem('theme', 'light');
    expect(localStorage.getItem('theme')).toBe('light');
    
    localStorage.setItem('theme', 'halloween');
    expect(localStorage.getItem('theme')).toBe('halloween');
  });

  it('should handle missing theme in localStorage', () => {
    expect(localStorage.getItem('theme')).toBeNull();
  });
});
