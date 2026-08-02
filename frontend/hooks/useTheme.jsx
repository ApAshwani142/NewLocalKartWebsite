'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  // Always initialize with 'light' so server and client hydration match
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  // Sync stored theme preference after initial hydration
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('localkart_theme');
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  // Apply class to <html> whenever theme changes after mount
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('localkart_theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
