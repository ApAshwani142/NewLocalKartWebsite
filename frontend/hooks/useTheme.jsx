'use client';

import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  // Ensure the website is strictly in light mode at all times
  useEffect(() => {
    try {
      document.documentElement.classList.remove('dark');
      localStorage.removeItem('localkart_theme');
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'light', toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
