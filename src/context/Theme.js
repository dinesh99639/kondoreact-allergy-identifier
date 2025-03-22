import { createContext, useState } from 'react';

const ThemeContext = createContext();

const themes = {
  purple: {
    '--kendo-color-base': '#ddf',
    '--kendo-color-base-hover': '#eef',
    '--kendo-color-base-active': '#ccf',
    '--kendo-color-on-base': '#00c',
    '--kendo-color-primary': '#4D55CC',
    '--kendo-color-primary-hover': '#211C84',
    '--kendo-color-primary-active': '#211C84',
    '--kendo-color-on-primary': '#fee',
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('purple');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <style>
        {`:root {
            ${Object.keys(themes[theme])
              .map((key) => `${key}: ${themes[theme][key]};`)
              .join(' ')}
        }`}
      </style>

      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
