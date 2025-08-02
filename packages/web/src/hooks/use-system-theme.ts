'use client';

import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------

export function useSystemTheme() {
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; // Default to light on server side
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light');
    };

    // Listen for changes in system theme
    mediaQuery.addEventListener('change', handleChange);

    // Set initial value
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return systemTheme;
}

// Helper function to resolve the actual theme mode
export function resolveThemeMode(
  mode: 'light' | 'dark' | 'system',
  systemTheme: 'light' | 'dark'
): 'light' | 'dark' {
  if (mode === 'system') {
    return systemTheme;
  }
  return mode;
}
