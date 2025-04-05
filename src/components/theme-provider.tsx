import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
}: ThemeProviderProps) {
  // Check if we have a saved theme in localStorage
  const [theme, setTheme] = useState<Theme>(() => {
    // Try to get the theme from localStorage
    const savedTheme = localStorage.getItem("theme") as Theme;

    // Check if we should use the system preference
    if (!savedTheme) {
      // Check if the user prefers dark mode
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      return prefersDark ? "dark" : defaultTheme;
    }

    return savedTheme || defaultTheme;
  });

  // Update the data-theme attribute on the document element when the theme changes
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove the old theme class
    root.classList.remove("light", "dark");

    // Add the new theme class
    root.classList.add(theme);

    // Save the theme to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      // Only change the theme if the user hasn't explicitly set a preference
      if (!localStorage.getItem("theme")) {
        setTheme(mediaQuery.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
    },
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
