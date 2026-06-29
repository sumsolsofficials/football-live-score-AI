import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getLeagues } from "../api/leagueApi.js";
import { useMatches } from "../context/MatchesContext.jsx";
import LeagueCard from "../components/LeagueCard.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

/* ── Search Icon SVG ──────────────────────────────────────────────── */
function SearchIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

/* ── Clear Icon SVG ───────────────────────────────────────────────── */
function ClearIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export default function Home() {
  const [leagues, setLeagues]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [query, setQuery]       = useState("");
  const [focused, setFocused]   = useState(false);
  const { liveMatches }         = useMatches();
  const inputRef                = useRef(null);

  const topLeagueKeywords = [
    "premier league",
    "champions league",
    "la liga",
    "bundesliga",
    "serie a",
    "ligue 1",
    "world cup",
    "fifa world cup",
  ];

  const getTopRank = (name) => {
    const lower = String(name).toLowerCase();
    const index = topLeagueKeywords.findIndex((keyword) => lower.includes(keyword));
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };

  useEffect(() => {
    getLeagues()
      .then((data) => setLeagues(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to load leagues:", err.message))
      .finally(() => setLoading(false));
  }, []);

  const liveCountByLeague = liveMatches.reduce((acc, m) => {
    const key = String(m.leagueId);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  /* Filter leagues by search query */
  const filtered = query.trim()
    ? leagues.filter(
        (l) =>
          l.name?.toLowerCase().includes(query.toLowerCase()) ||
          l.country?.toLowerCase().includes(query.toLowerCase())
      )
    : leagues;

  /* Sort: leagues with live matches first */
  const sorted = [...filtered].sort((a, b) => {
    const rankA = getTopRank(a.name);
    const rankB = getTopRank(b.name);
    if (rankA !== rankB) return rankA - rankB;

    const aLive = liveCountByLeague[String(a.id)] ?? 0;
    const bLive = liveCountByLeague[String(b.id)] ?? 0;
    if (bLive !== aLive) return bLive - aLive;

    return String(a.name).localeCompare(String(b.name));
  });

  const totalLive = liveMatches.length;

  return (
    <div className="space-y-8">

      {/* ── Hero Banner ────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-3xl p-2 shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #16a34a 0%, #22c55e 35%, #10b981 70%, #059669 100%)",
          boxShadow: "0 6px 24px rgba(34,197,94,0.24), 0 1px 5px rgba(0,0,0,0.08)",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-sm" />
        <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-white/5 blur-md" />
        <div className="absolute top-1/2 right-1/3 h-14 w-14 rounded-full bg-emerald-300/10" />

        <div className="relative">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/80">
            </p>
            <h1 className="mt-1 text-3xl font-black text-white tracking-tight drop-shadow-sm">
              Football Live Scoreboard
            </h1>
            <p className="mt-1 text-xs text-emerald-100/70 font-semibold">
              Live scores · Stats · Events
            </p>
          {/* Live widget */}
          {totalLive > 0 ? (
            <Link
              to="/live"
              id="hero-live-btn"
              className="group/hero mt-3 flex items-center justify-between rounded-2xl p-2 border border-white/15 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 active:scale-[0.98]"
              style={{ background: "rgba(255,255,255,0.12)" }}
            >
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-100/80">
                  Currently Live
                </p>
                <p className="text-lg font-black text-white mt-0.5">
                  {totalLive}{" "}
                  <span className="text-xs font-bold opacity-80">
                    match{totalLive !== 1 ? "es" : ""}
                  </span>
                </p>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full shadow-lg group-hover/hero:scale-110 transition-transform duration-300"
                  style={{
                    background: "radial-gradient(circle, #ef4444, #dc2626)",
                    boxShadow: "0 3px 10px rgba(239,68,68,0.35)",
                  }}
                >
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider text-white group-hover/hero:translate-x-0.5 transition-transform duration-300">
                  Watch →
                </span>
              </div>
            </Link>
          ) : (
            <div
              className="mt-3 rounded-2xl p-2 border border-white/10"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <p className="text-[9px] font-black uppercase tracking-wider text-emerald-100/80">
                No matches live right now
              </p>
              <p className="text-xs font-extrabold text-white mt-0.5">Check back soon ⏱</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Leagues Section ────────────────────────────────────────────── */}
      <div className="space-y-4">
        {/* Section header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Today's Leagues
            </h2>
            <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
              {leagues.length} leagues · {totalLive} live
            </p>
          </div>
          <span
            className="rounded-xl px-3 py-1 text-xs font-black text-white shadow-sm"
            style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
          >
            {filtered.length} shown
          </span>
        </div>

        {/* ── Search Bar ─────────────────────────────────────────────── */}
        <div
          className="relative flex items-center gap-3 rounded-2xl border transition-all duration-300"
          style={{
            background: "white",
            borderColor: focused ? "rgba(34,197,94,0.5)" : "rgba(226,232,240,0.9)",
            boxShadow: focused
              ? "0 0 0 3px rgba(34,197,94,0.12), 0 4px 16px rgba(0,0,0,0.06)"
              : "0 1px 4px rgba(0,0,0,0.05)",
            padding: "10px 16px",
          }}
        >
          <SearchIcon
            className={`h-4.5 w-4.5 flex-shrink-0 transition-colors duration-200 ${
              focused ? "text-emerald-500" : "text-slate-400"
            }`}
          />
          <input
            ref={inputRef}
            id="league-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search leagues"
            className="flex-1 bg-white dark:bg-white text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-medium outline-none"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors duration-200"
            >
              <ClearIcon className="h-3 w-3 text-slate-500 dark:text-slate-400" />
            </button>
          )}
        </div>

        {/* ── Horizontal Scroll Row ──────────────────────────────────── */}
        {loading ? (
          <Loader />
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center py-12 gap-3">
            <span className="text-4xl">🔍</span>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              No leagues match <span className="text-slate-700 dark:text-slate-200"><b>{query}</b></span>
            </p>
            <button
              onClick={() => setQuery("")}
              className="mt-1 rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-black text-white hover:bg-emerald-600 transition-colors duration-200"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {sorted.map((league) => (
              <LeagueCard
                key={league.id}
                league={league}
                liveCount={liveCountByLeague[String(league.id)] ?? 0}
                top={getTopRank(league.name) !== Number.MAX_SAFE_INTEGER}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
