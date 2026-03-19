import { createContext, createElement, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "socialmedia-theme";

export const DAISYUI_THEMES = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
  "caramellatte",
  "abyss",
  "silk"
];

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
  themes: DAISYUI_THEMES
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    return savedTheme && DAISYUI_THEMES.includes(savedTheme) ? savedTheme : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const contextValue = useMemo(
    () => ({ theme, setTheme, themes: DAISYUI_THEMES }),
    [theme]
  );

  return createElement(ThemeContext.Provider, { value: contextValue }, children);
};

export const useTheme = () => useContext(ThemeContext);
