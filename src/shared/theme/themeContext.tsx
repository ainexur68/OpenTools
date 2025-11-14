import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "ot-theme";

const getPreferredTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "dark";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
};

export interface ThemeContextValue {
  readonly theme: ThemeMode;
  readonly isDark: boolean;
  readonly toggleTheme: () => void;
  readonly setTheme: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => getPreferredTheme());

  const applyThemeToDocument = useCallback((mode: ThemeMode) => {
    if (typeof window === "undefined") {
      return;
    }

    const root = window.document.documentElement;

    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    window.localStorage.setItem(STORAGE_KEY, mode);
  }, []);

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme, applyThemeToDocument]);

  const setTheme = useCallback(
    (mode: ThemeMode) => {
      setThemeState(mode);
      applyThemeToDocument(mode);
    },
    [applyThemeToDocument]
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    isDark: theme === "dark",
    toggleTheme,
    setTheme
  }), [theme, toggleTheme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
