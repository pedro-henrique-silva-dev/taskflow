import { useCallback, useEffect, useMemo, useState } from 'react';
import { readJSON, writeJSON } from '../utils/storage.js';
import { ThemeContext } from './ThemeContext.js';

const STORAGE_KEY = 'taskflow:theme';

function getInitialTheme() {
  const saved = readJSON(STORAGE_KEY, null);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeJSON(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
