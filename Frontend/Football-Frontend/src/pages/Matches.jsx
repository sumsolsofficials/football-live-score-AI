import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMatchDetail } from "../api/matchApi.js";
import LiveBadge from "../components/LiveBadge.jsx";
import TeamAvatar from "../components/TeamAvatar.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useSettings } from "../context/SettingsContext.jsx";

// ─── Possession bar — only shows colored bar when API provided real possession data
function PossessionBar({ home, away }) {
  const { statsStyle } = useSettings();
  // If the API has no real possession data or both values are zero, show a grey 0/0 bar.
  const hasData = home != null && away != null && (home + away) > 0;

  if (!hasData) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          {statsStyle !== "bars" ? (
            <span className="font-bold text-slate-400 dark:text-slate-500">0%</span>
          ) : (
            <span className="w-8" />
          )}
          <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Possession</span>
          {statsStyle !== "bars" ? (
            <span className="font-bold text-slate-400 dark:text-slate-500">0%</span>
          ) : (
            <span className="w-8" />
          )}
        </div>
        {/* All-grey, uncolored bar when no data */}
        {statsStyle !== "numbers" && (
          <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800" />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        {statsStyle !== "bars" ? (
          <span className="font-bold text-accent">{home}%</span>
        ) : (
          <span className="w-8" />
        )}
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Possession</span>
        {statsStyle !== "bars" ? (
          <span className="font-bold text-slate-400 dark:text-slate-500">{away}%</span>
        ) : (
          <span className="w-8" />
        )}
      </div>
      {statsStyle !== "numbers" && (
        <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 shadow-inner">
          <div className="bg-accent transition-all duration-700" style={{ width: `${home}%` }} />
          <div className="bg-slate-300 dark:bg-slate-600 transition-all duration-700" style={{ width: `${away}%` }} />
        </div>
      )}
    </div>
  );
}

// ─── Stat bar — grey bar when both values are 0 ───────────────────────────────
function StatBar({ label, home, away }) {
  const { statsStyle } = useSettings();
  const h = home ?? 0;
  const a = away ?? 0;
  const total = h + a;
  // Only color the bar if there's actual data
  const hasData = total > 0;
  const homePct = hasData ? Math.round((h / total) * 100) : 0;
  const awayPct = hasData ? 100 - homePct : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        {statsStyle !== "bars" ? (
          <span className={`w-8 font-extrabold ${hasData ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-550"}`}>{h}</span>
        ) : (
          <span className="w-8" />
        )}
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
        {statsStyle !== "bars" ? (
          <span className={`w-8 text-right font-extrabold ${hasData ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-550"}`}>{a}</span>
        ) : (
          <span className="w-8" />
        )}
      </div>
      {statsStyle !== "numbers" && (
        <div className="flex h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-855 shadow-inner">
          {hasData && <>
            <div className="bg-accent transition-all duration-700" style={{ width: `${homePct}%` }} />
            <div className="bg-slate-300 dark:bg-slate-600 transition-all duration-700"   style={{ width: `${awayPct}%` }} />
          </>}
          {/* No data = bar stays all grey */}
        </div>
      )}
    </div>
  );
}

const defaultTeamStats = {
  possession: 0,
  shotsOnGoal: 0,
  totalShots: 0,
  blockedShots: 0,
  shotsInsideBox: 0,
  shotsOutsideBox: 0,
  cornerKicks: 0,
  fouls: 0,
  offsides: 0,
  yellowCards: 0,
  redCards: 0,
  saves: 0,
  totalPasses: 0,
  accuratePasses: 0,
  passAccuracy: null,
};

function normalizeStats(rawStats) {
  return {
    available: rawStats?.available === true,
    home: { ...defaultTeamStats, ...(rawStats?.home ?? {}) },
    away: { ...defaultTeamStats, ...(rawStats?.away ?? {}) },
  };
}

function formatKickoff(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  const formattedDate = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${formattedDate} · ${formattedTime}`;
}

// ─── Timeline event ───────────────────────────────────────────────────────────
function eventIcon(type, detail) {
  if (type === "Goal") {
    if (detail === "Own Goal")       return { icon: "⚽", color: "text-red-500",   bg: "bg-red-50 dark:bg-red-500/10" };
    if (detail === "Penalty")        return { icon: "⚽", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10", suffix: " (P)" };
    if (detail === "Missed Penalty") return { icon: "❌", color: "text-slate-400",  bg: "bg-slate-100 dark:bg-slate-800" };
    return { icon: "⚽", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10" };
  }
  if (type === "Card") {
    if (detail === "Yellow Card")     return { icon: "🟨", color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-500/10" };
    if (detail === "Red Card")        return { icon: "🟥", color: "text-red-600",    bg: "bg-red-50 dark:bg-red-500/10" };
    if (detail === "Yellow Red Card") return { icon: "🟥", color: "text-red-600",    bg: "bg-red-50 dark:bg-red-500/10" };
  }
  if (type === "subst") return { icon: "🔄", color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-800" };
  if (type === "Var")   return { icon: "📺", color: "text-blue-500",  bg: "bg-blue-50 dark:bg-blue-500/10" };
  return { icon: "•", color: "text-slate-400", bg: "bg-slate-100 dark:bg-slate-800" };
}

function TimelineEvent({ event }) {
  const { icon, color, bg, suffix = "" } = eventIcon(event.type, event.detail);
  const isGoal = event.type === "Goal" && event.detail !== "Missed Penalty";
  const isSub  = event.type === "subst";

  return (
    <div className={`flex items-start gap-3 rounded-xl p-2.5 ${event.isHome ? "" : "flex-row-reverse"}`}>
      {/* Minute */}
      <span className="flex-shrink-0 rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        {event.minute}'
      </span>
      {/* Icon */}
      <span className={`flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-sm ${bg}`}>{icon}</span>
      {/* Info */}
      <div className={`flex-1 ${event.isHome ? "" : "text-right"}`}>
        <p className={`text-sm font-bold ${isGoal ? "text-emerald-600 dark:text-emerald-400" : "text-slate-800 dark:text-slate-200"}`}>
          {isSub ? `↑ ${event.assist ?? "?"}` : event.player}{suffix}
        </p>
        {isSub && <p className="text-xs text-slate-400">↓ {event.player}</p>}
        {!isSub && event.assist && <p className="text-xs text-slate-400">Assist: {event.assist}</p>}
        {event.comments && <p className="text-xs italic text-slate-400 mt-0.5">{event.comments}</p>}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Match() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [match,   setMatch]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [tab,     setTab]     = useState("stats"); // "stats" | "timeline"

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getMatchDetail(id)
      .then((data) => { if (!data) { setError(true); return; } setMatch(data); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));

    const interval = setInterval(() => {
      getMatchDetail(id).then((data) => { if (data) setMatch(data); });
    }, 60_000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <Loader />;
  if (error || !match) return <EmptyState message="Match not found" icon="❌" />;

  const events = match.events ?? [];
  const stats = normalizeStats(match.stats);
  const isLive = match.status === "LIVE";
  const goals  = events.filter((e) => e.type === "Goal" && e.detail !== "Missed Penalty");
  const kickoffLabel = formatKickoff(match.kickoff);

  // Stats availability — backend sends stats.available flag
  const statsAvailable = stats.available;

  return (
    <div className="space-y-4">
      <button 
        onClick={() => navigate(-1)}
        className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-extrabold text-slate-650 hover:bg-slate-50 hover:text-slate-900 shadow-sm dark:border-slate-800/80 dark:bg-card-dark dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-all duration-300 ease-out hover:-translate-y-0.5 active:scale-95 cursor-pointer"
      >
        <span className="inline-block transition-transform duration-300 group-hover:-translate-x-0.75">←</span>
        <span>Back</span>
      </button>

      {/* ── Match header ── */}
      <div className="relative overflow-hidden rounded-3xl p-5 shadow-sm bg-white border border-slate-150 dark:bg-card-dark dark:border-slate-800/60">
        {/* League */}
        <div className="mb-3 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5">
            {match.leagueLogo && <img src={match.leagueLogo} alt="" className="h-5 w-5 rounded-full" />}
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{match.leagueName}</span>
          </div>
          {match.leagueRound && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {match.leagueRound}
            </span>
          )}
        </div>

        {/* Live badge */}
        {isLive && (
          <div className="mb-3 flex justify-center">
            <LiveBadge status={match.status} statusShort={match.statusShort} minute={match.minute} />
          </div>
        )}

        {/* Teams + score */}
        <div className="grid grid-cols-3 items-center gap-2">
          {/* Home */}
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full ring-4 ring-slate-100 dark:ring-slate-800/60">
              <TeamAvatar name={match.teamA.name} logo={match.teamA.logo} size={64} />
            </div>
            <span className="max-w-[90px] text-center text-sm font-bold text-slate-850 dark:text-slate-200 leading-tight">{match.teamA.name}</span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-5xl font-black tracking-tight tabular-nums text-accent dark:text-accent">
              {match.scoreA}<span className="text-slate-300 dark:text-slate-600">–</span>{match.scoreB}
            </p>
            {kickoffLabel && (
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{kickoffLabel}</span>
            )}
            {isLive && match.minute != null && (
              <span className="text-sm font-bold text-slate-400 dark:text-slate-500">{match.minute}'</span>
            )}
            {!isLive && match.status === "FINISHED" && (
              <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-bold text-slate-500 dark:bg-slate-850">Full Time</span>
            )}
          </div>

          {/* Away */}
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full ring-4 ring-slate-100 dark:ring-slate-800/60">
              <TeamAvatar name={match.teamB.name} logo={match.teamB.logo} size={64} />
            </div>
            <span className="max-w-[90px] text-center text-sm font-bold text-slate-850 dark:text-slate-200 leading-tight">{match.teamB.name}</span>
          </div>
        </div>

        {/* Goal scorers */}
        {goals.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-x-4 border-t border-slate-100 pt-3 dark:border-slate-800">
            <div className="space-y-0.5 text-center text-xs text-slate-500">
              {goals.filter((g) => g.isHome).map((g, i) => (
                <p key={i}>⚽ {g.player} {g.minute}'</p>
              ))}
            </div>
            <div className="space-y-0.5 text-center text-xs text-slate-500">
              {goals.filter((g) => !g.isHome).map((g, i) => (
                <p key={i}>⚽ {g.player} {g.minute}'</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Tab switcher ── */}
      {(stats || events.length > 0) && (
        <div className="relative flex rounded-full bg-slate-100 p-0.5 dark:bg-slate-800/60 shadow-sm">
          {/* Sliding highlight indicator */}
          <div
            className="absolute top-0.5 bottom-0.5 left-0.5 rounded-full bg-white dark:bg-slate-700 shadow-sm transition-all duration-300 ease-out"
            style={{
              width: "calc(50% - 1px)",
              transform: `translateX(${tab === "timeline" ? 100 : 0}%)`,
            }}
          />
          {["stats", "timeline"].map((t) => {
            const isActive = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative z-10 flex-1 rounded-full py-2 text-xs font-black capitalize transition-colors duration-300 cursor-pointer ${
                  isActive
                    ? "text-accent"
                    : "text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {t === "stats" ? "📊 Stats" : "📋 Timeline"}
                {t === "timeline" && events.length > 0 && (
                  <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-extrabold transition-all duration-300 ${
                    isActive 
                      ? "bg-accent/15 text-accent" 
                      : "bg-slate-250 text-slate-500 dark:bg-slate-905 dark:text-slate-450"
                  }`}>
                    {events.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Stats tab ── */}
      {tab === "stats" && (
        <div>
          <div className="space-y-3">
            {!statsAvailable && (
              <p className="px-1 text-center text-xs font-semibold text-slate-405 dark:text-slate-500 mb-1">
                <b>No stats for this match.</b>
              </p>
            )}
            <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800/60 dark:bg-card-dark">
              <PossessionBar home={stats.home.possession} away={stats.away.possession} />
            </div>
            <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800/60 dark:bg-card-dark">
              <StatBar label="Shots on Target"   home={stats.home.shotsOnGoal}     away={stats.away.shotsOnGoal} />
              <StatBar label="Total Shots"        home={stats.home.totalShots}       away={stats.away.totalShots} />
              <StatBar label="Blocked Shots"      home={stats.home.blockedShots}     away={stats.away.blockedShots} />
              <StatBar label="Inside Box"         home={stats.home.shotsInsideBox}   away={stats.away.shotsInsideBox} />
              <StatBar label="Outside Box"        home={stats.home.shotsOutsideBox}  away={stats.away.shotsOutsideBox} />
            </div>
            <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800/60 dark:bg-card-dark">
              <StatBar label="Corner Kicks"       home={stats.home.cornerKicks}      away={stats.away.cornerKicks} />
              <StatBar label="Fouls"              home={stats.home.fouls}            away={stats.away.fouls} />
              <StatBar label="Offsides"           home={stats.home.offsides}         away={stats.away.offsides} />
              <StatBar label="Yellow Cards"       home={stats.home.yellowCards}      away={stats.away.yellowCards} />
              <StatBar label="Red Cards"          home={stats.home.redCards}         away={stats.away.redCards} />
            </div>
            <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800/60 dark:bg-card-dark">
              <StatBar label="Goalkeeper Saves"   home={stats.home.saves}            away={stats.away.saves} />
              <StatBar label="Total Passes"       home={stats.home.totalPasses}      away={stats.away.totalPasses} />
              <StatBar label="Accurate Passes"    home={stats.home.accuratePasses}   away={stats.away.accuratePasses} />
              {stats.home.passAccuracy != null && (
                <StatBar label="Pass Accuracy %"  home={stats.home.passAccuracy}     away={stats.away.passAccuracy} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Timeline tab ── */}
      {tab === "timeline" && (
        <div>
          {events.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center dark:border-slate-800/60 dark:bg-card-dark">
              <p className="text-sm font-bold text-slate-400">No event happened yet</p>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-100 bg-white shadow-sm dark:border-slate-800/60 dark:bg-card-dark">
              {/* Team headers */}
              <div className="grid grid-cols-2 border-b border-slate-50 px-4 py-3 dark:border-slate-800/50">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{match.teamA.name}</span>
                </div>
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{match.teamB.name}</span>
                  <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-500" />
                </div>
              </div>
              <div className="divide-y divide-slate-50 p-2 dark:divide-slate-800/55">
                {events.map((event, i) => (
                  <TimelineEvent key={i} event={event} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
