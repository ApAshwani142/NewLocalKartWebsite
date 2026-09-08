'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  // Always initialize with 'light' so server and client hydration match
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  // Sync stored theme preference immediately on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('localkart_theme');
    let activeTheme = 'light';
    if (saved === 'dark' || saved === 'light') {
      activeTheme = saved;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      activeTheme = 'dark';
    }
    if (activeTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setTheme(activeTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    const root = document.documentElement;
    if (nextTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('localkart_theme', nextTheme);
    } catch (e) {
      // ignore
    }
    setTheme(nextTheme);
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
