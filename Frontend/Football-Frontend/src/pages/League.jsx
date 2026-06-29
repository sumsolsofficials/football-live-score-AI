import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMatches } from "../context/MatchesContext.jsx";
import MatchCard from "../components/MatchCard.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function League() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { liveMatches, loading } = useMatches();

  if (loading) return <Loader />;

  const leagueMatches = liveMatches.filter((m) => String(m.leagueId) === String(id));
  const leagueName = leagueMatches[0]?.leagueName ?? "League";
  const leagueLogo = leagueMatches[0]?.leagueLogo ?? "";

  return (
    <div className="space-y-4">
      <button 
        onClick={() => navigate(-1)}
        className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-extrabold text-slate-650 hover:bg-slate-50 hover:text-slate-900 shadow-sm dark:border-slate-800/80 dark:bg-card-dark dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-all duration-300 ease-out hover:-translate-y-0.5 active:scale-95 cursor-pointer"
      >
        <span className="inline-block transition-transform duration-300 group-hover:-translate-x-0.75">←</span>
        <span>Back</span>
      </button>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800/60 dark:bg-card-dark">
        {leagueLogo ? (
          <img src={leagueLogo} alt={leagueName} className="h-10 w-10 rounded-xl object-cover bg-slate-50 dark:bg-slate-900/50 p-1 shadow-sm" />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 text-lg shadow-inner">🏆</span>
        )}
        <div>
          <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight">{leagueName}</h1>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">{leagueMatches.length} live match{leagueMatches.length !== 1 ? "es" : ""}</p>
        </div>
        {leagueMatches.length > 0 && (
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-0.5 text-[10px] font-bold text-red-500 ring-1 ring-red-500/20">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            LIVE
          </span>
        )}
      </div>

      {leagueMatches.length === 0 ? (
        <EmptyState message="No live matches in this league right now" icon="📺" />
      ) : (
        <div className="space-y-3">
          {leagueMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
