
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type AccentColor = "default" | "emerald" | "rose" | "amber" | "violet" | "slate" | "indigo" | "orange";

interface ThemeContextType {
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProviderWrapper({ children }: { children: ReactNode }) {
  // Default to Sky Blue ("default")
  const [accent, setAccent] = useState<AccentColor>("default");

  useEffect(() => {
    const savedAccent = localStorage.getItem("gstorage-accent") as AccentColor;
    const initialAccent = savedAccent || "default";
    applyAccent(initialAccent);
  }, []);

  const applyAccent = (newAccent: AccentColor) => {
    setAccent(newAccent);
    if (newAccent === "default") {
      document.documentElement.removeAttribute("data-accent");
    } else {
      document.documentElement.setAttribute("data-accent", newAccent);
    }
  };

  const handleSetAccent = (newAccent: AccentColor) => {
    applyAccent(newAccent);
    localStorage.setItem("gstorage-accent", newAccent);
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
