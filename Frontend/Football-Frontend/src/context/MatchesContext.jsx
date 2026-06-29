import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getLiveMatches, getTodayMatches } from "../api/matchApi.js";

const MatchesContext = createContext(null);

export function MatchesProvider({ children }) {
  const [liveMatches,  setLiveMatches]  = useState([]);
  const [todayMatches, setTodayMatches] = useState([]);
  const [loading,      setLoading]      = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [live, today] = await Promise.all([getLiveMatches(), getTodayMatches()]);
      setLiveMatches(live.filter((m) => m.status === "LIVE"));
      setTodayMatches(today);
    } catch (err) {
      console.error("Failed to load matches:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 60_000);
    return () => clearInterval(interval);
  }, [refresh]);

  const getMatchById = (id) =>
    todayMatches.find((m) => String(m.id) === String(id));

  return (
    <MatchesContext.Provider value={{ liveMatches, todayMatches, loading, getMatchById }}>
      {children}
    </MatchesContext.Provider>
  );
}

export function useMatches() {
  const ctx = useContext(MatchesContext);
  if (!ctx) throw new Error("useMatches must be used within a MatchesProvider");
  return ctx;
}
