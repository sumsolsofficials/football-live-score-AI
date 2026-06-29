import React, { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [statsStyle, setStatsStyleState] = useState(() => {
    const saved = localStorage.getItem("football-live-stats-style");
    if (saved === "bars" || saved === "numbers" || saved === "both") {
      return saved;
    }
    return "both";
  });

  const setStatsStyle = (style) => {
    if (style === "bars" || style === "numbers" || style === "both") {
      setStatsStyleState(style);
      localStorage.setItem("football-live-stats-style", style);
    }
  };

  return (
    <SettingsContext.Provider value={{ statsStyle, setStatsStyle }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within a SettingsProvider");
  return ctx;
}
