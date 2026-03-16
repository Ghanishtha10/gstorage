"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type AccentColor = "default" | "emerald" | "rose" | "amber" | "violet" | "slate" | "indigo" | "orange";

interface ThemeContextType {
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProviderWrapper({ children }: { children: ReactNode }) {
  const [accent, setAccent] = useState<AccentColor>("default");

  useEffect(() => {
    const savedAccent = localStorage.getItem("gstorage-accent") as AccentColor;
    if (savedAccent) {
      setAccent(savedAccent);
      document.documentElement.setAttribute("data-accent", savedAccent);
    }
  }, []);

  const handleSetAccent = (newAccent: AccentColor) => {
    setAccent(newAccent);
    localStorage.setItem("gstorage-accent", newAccent);
    if (newAccent === "default") {
      document.documentElement.removeAttribute("data-accent");
    } else {
      document.documentElement.setAttribute("data-accent", newAccent);
    }
  };

  return (
    <ThemeContext.Provider value={{ accent, setAccent: handleSetAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeAccent = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useThemeAccent must be used within ThemeProviderWrapper");
  return context;
};