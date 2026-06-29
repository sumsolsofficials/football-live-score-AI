import React, { useState } from "react";
import { useMatches } from "../context/MatchesContext.jsx";
import MatchCard from "../components/MatchCard.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function LiveMatches() {
  const { liveMatches, loading } = useMatches();
  const [selectedLeague, setSelectedLeague] = useState("all");

  if (loading) return <Loader />;

  // Build unique leagues from live matches
  const leagueMap = {};
  liveMatches.forEach((m) => {
    if (!leagueMap[m.leagueId]) {
      leagueMap[m.leagueId] = { id: m.leagueId, name: m.leagueName, logo: m.leagueLogo };
    }
  });
  const leagues = Object.values(leagueMap);

  const filtered = selectedLeague === "all"
    ? liveMatches
    : liveMatches.filter((m) => String(m.leagueId) === String(selectedLeague));

  // Group filtered matches by league
  const grouped = filtered.reduce((acc, m) => {
    const key = String(m.leagueId);
    if (!acc[key]) acc[key] = { league: { id: m.leagueId, name: m.leagueName, logo: m.leagueLogo }, matches: [] };
    acc[key].matches.push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Live Now</h1>
          <p className="text-xs text-slate-400">{liveMatches.length} match{liveMatches.length !== 1 ? "es" : ""} in progress</p>
        </div>
        {liveMatches.length > 0 && (
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-500 ring-1 ring-red-500/20">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            LIVE
          </span>
        )}
      </div>

      {/* League filter pills */}
      {leagues.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setSelectedLeague("all")}
            className={`flex-shrink-0 rounded-full px-5 py-2.5 text-sm font-extrabold transition-all duration-300 ease-out cursor-pointer hover:-translate-y-0.5 active:scale-95 min-w-[140px] text-center ${
              selectedLeague === "all"
                ? "bg-accent text-white shadow-md shadow-accent/25 hover:shadow-lg hover:shadow-accent/35"
                : "bg-slate-100/80 hover:bg-slate-200/90 text-slate-650 dark:bg-card-dark dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800/40 shadow-sm"
            }`}
          >
            All leagues
          </button>
          {leagues.map((l) => (
            <button
              key={l.id}
              onClick={() => setSelectedLeague(String(l.id))}
              className={`flex flex-shrink-0 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold transition-all duration-300 ease-out cursor-pointer hover:-translate-y-0.5 active:scale-95 min-w-[140px] ${
                selectedLeague === String(l.id)
                  ? "bg-accent text-white shadow-md shadow-accent/25 hover:shadow-lg hover:shadow-accent/35"
                  : "bg-slate-100/80 hover:bg-slate-200/90 text-slate-650 dark:bg-card-dark dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800/40 shadow-sm"
              }`}
            >
              {l.logo && <img src={l.logo} alt="" className="h-4 w-4 rounded-full object-cover shadow-sm" />}
              {l.name}
            </button>
          ))}
        </div>
      )}

      {/* Matches */}
      {liveMatches.length === 0 ? (
        <EmptyState message="No live matches right now" icon="📺" />
      ) : Object.keys(grouped).length === 0 ? (
        <EmptyState message="No matches for this league" />
      ) : (
        <div className="space-y-6">
          {Object.values(grouped).map(({ league, matches }) => (
            <div key={league.id}>
              {/* League header (only show when "all" filter active) */}
              {selectedLeague === "all" && (
                <div className="mb-2.5 flex items-center gap-2 px-1">
                  {league.logo && (
                    <img src={league.logo} alt="" className="h-5 w-5 rounded-full object-cover" />
                  )}
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">{league.name}</span>
                  <span className="ml-auto rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-500">
                    {matches.length} LIVE
                  </span>
                </div>
              )}
              <div className="space-y-3">
                {matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
