import React from "react";
import { Link } from "react-router-dom";
import LiveBadge from "./LiveBadge.jsx";
import TeamAvatar from "./TeamAvatar.jsx";

export default function MatchCard({ match }) {
  const isLive     = match.status === "LIVE";
  const isFinished = match.status === "FINISHED";
  const kickoffTime = match.kickoff
    ? new Date(match.kickoff).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
    : "";

  return (
    <Link
      to={`/match/${match.id}`}
      className={`group block rounded-2xl border p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 ${
        isLive
          ? "border-accent/25 bg-white dark:bg-card-dark dark:border-accent/30 hover:border-accent/60 shadow-sm hover:shadow-md hover:shadow-accent/5 dark:hover:shadow-black/20"
          : "border-slate-100 bg-white dark:border-slate-800/60 dark:bg-card-dark hover:border-accent/40 dark:hover:border-accent/40 shadow-sm hover:shadow-md hover:shadow-slate-100 dark:hover:shadow-black/20"
      }`}
    >
      {/* League row */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          {match.leagueLogo && (
            <img src={match.leagueLogo} alt="" className="h-4.5 w-4.5 flex-shrink-0 rounded-full object-cover shadow-sm" onError={(e) => e.target.style.display="none"} />
          )}
          <span className="truncate text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {match.leagueName}{match.leagueRound ? ` · ${match.leagueRound}` : ""}
          </span>
        </div>
        {isLive && <LiveBadge status={match.status} statusShort={match.statusShort} minute={match.minute} />}
        {isFinished && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-850 dark:text-slate-400">FT</span>}
        {!isLive && !isFinished && kickoffTime && <span className="text-[11px] font-semibold text-slate-400">{kickoffTime}</span>}
      </div>

      {/* Teams + score */}
      <div className="grid grid-cols-3 items-center gap-2">
        {/* Home */}
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full ring-2 ring-slate-100 dark:ring-slate-800/60 group-hover:scale-105 transition-transform duration-300">
            <TeamAvatar name={match.teamA.name} logo={match.teamA.logo} size={48} />
          </div>
          <span className="max-w-[80px] text-center text-xs font-bold text-slate-750 dark:text-slate-300 leading-tight transition-colors group-hover:text-slate-900 dark:group-hover:text-white">{match.teamA.name}</span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center">
          <p className="text-3xl font-black tracking-tight tabular-nums text-accent dark:text-accent">
            {match.scoreA}<span className="text-slate-300 dark:text-slate-600">–</span>{match.scoreB}
          </p>
          {isLive && match.minute && (
            <span className="text-xs font-black text-slate-400 dark:text-slate-500">{match.minute}'</span>
          )}
        </div>

        {/* Away */}
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full ring-2 ring-slate-100 dark:ring-slate-800/60 group-hover:scale-105 transition-transform duration-300">
            <TeamAvatar name={match.teamB.name} logo={match.teamB.logo} size={48} />
          </div>
          <span className="max-w-[80px] text-center text-xs font-bold text-slate-750 dark:text-slate-300 leading-tight transition-colors group-hover:text-slate-900 dark:group-hover:text-white">{match.teamB.name}</span>
        </div>
      </div>
    </Link>
  );
}
