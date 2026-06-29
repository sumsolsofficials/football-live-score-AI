import React from "react";
import { Link } from "react-router-dom";

export default function LeagueCard({ league, liveCount = 0, top = false }) {
  const isLive = liveCount > 0;

  return (
    <Link
      to={`/league/${league.id}`}
      className="league-card group relative flex items-center gap-4 rounded-3xl border p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl cursor-pointer overflow-hidden bg-white"
      style={{
        background: "white",
        borderColor: isLive ? "rgba(239,68,68,0.18)" : "rgba(226,232,240,0.85)",
        boxShadow: "0 3px 16px rgba(15,23,42,0.08)",
      }}
    >
      {/* Dark mode bg */}
      <style>{`
        .dark .league-card {
          background: ${isLive
            ? "linear-gradient(135deg, rgba(239,68,68,0.12) 0%, #1e293b 60%, rgba(251,146,60,0.06) 100%) !important"
            : "#1e293b !important"};
          border-color: ${isLive ? "rgba(239,68,68,0.35) !important" : "rgba(30,41,59,0.9) !important"};
        }
      `}</style>

      {top && (
        <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-red-500/15">
          Top
        </span>
      )}

      {/* Logo container */}
      <div
        className="relative flex h-14 w-14 items-center justify-center rounded-3xl shadow-inner transition-transform duration-300"
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          boxShadow: "inset 0 2px 6px rgba(0,0,0,0.06)",
        }}
      >
        {league.logo ? (
          <img
            src={league.logo}
            alt={league.name}
            className="h-10 w-10 object-contain drop-shadow-sm"
            onError={(e) => (e.target.style.display = "none")}
          />
        ) : (
          <span className="text-2xl">🏆</span>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
          {league.name}
        </p>
        {league.country && (
          <p className="mt-0.5 text-[11px] font-semibold text-slate-400 truncate">
            {league.country}
          </p>
        )}
        {isLive ? (
          <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-500 ring-1 ring-red-500/20">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            {liveCount} live
          </span>
        ) : (
          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
            No live matches
          </span>
        )}
      </div>

      {/* Arrow */}
      <span className="flex-shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all duration-200 text-lg">
        →
      </span>
    </Link>
  );
}
