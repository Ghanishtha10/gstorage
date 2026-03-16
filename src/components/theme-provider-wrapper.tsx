"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

type AccentColor = "default" | "emerald" | "rose" | "amber" | "violet" | "slate" | "indigo" | "orange";

interface ThemeContextType {
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProviderWrapper({ children }: { children: ReactNode }) {
  const [accent, setAccent] = useState<AccentColor>("default");
  const db = useFirestore();

  // Reference to global settings for theme
  const globalConfigRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'global_configs', 'settings');
  }, [db]);

  const { data: config } = useDoc(globalConfigRef);

  // Sync with Global Firestore settings
  useEffect(() => {
    if (config?.selectedAccentColorId) {
      const globalAccent = config.selectedAccentColorId as AccentColor;
      applyAccent(globalAccent);
    } else {
      // Fallback to local storage if Firestore isn't set yet
      const savedAccent = localStorage.getItem("gstorage-accent") as AccentColor;
      if (savedAccent) {
        applyAccent(savedAccent);
      }
    }
  }, [config]);

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