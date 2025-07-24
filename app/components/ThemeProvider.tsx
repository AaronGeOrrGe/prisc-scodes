import React, { createContext, useContext, useState, ReactNode } from 'react';

const lightColors = {
  background: '#F6F2F7',
  card: '#fff',
  text: '#222',
  header: '#A07BB7',
  headerText: '#fff',
  border: '#eee',
  icon: '#6C47A6',
  shadow: '#A07BB7',
};

const darkColors = {
  background: '#18171C',
  card: '#23222A',
  text: '#F6F2F7',
  header: '#23222A',
  headerText: '#A07BB7',
  border: '#23222A',
  icon: '#A07BB7',
  shadow: '#000',
};

const ThemeContext = createContext({
  theme: 'light',
  colors: lightColors,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const colors = theme === 'light' ? lightColors : darkColors;
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
} 