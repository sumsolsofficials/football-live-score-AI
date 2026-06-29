import axios from "axios";

const client = axios.create({ baseURL: "/api" });

export function normalizeMatch(raw) {
  if (!raw) return null;
  const leagueRaw = raw.league || {};
  const teamA = raw.teamA || {};
  const teamB = raw.teamB || {};
  return {
    id:          String(raw.fixtureId ?? raw.id ?? ""),
    leagueId:    String(leagueRaw.id  ?? raw.leagueId ?? ""),
    leagueName:  leagueRaw.name  ?? "",
    leagueLogo:  leagueRaw.logo  ?? "",
    leagueRound: leagueRaw.round ?? "",
    teamA:  { name: teamA.name || "Team A", logo: teamA.logo || "" },
    teamB:  { name: teamB.name || "Team B", logo: teamB.logo || "" },
    scoreA:      raw.scoreA      ?? 0,
    scoreB:      raw.scoreB      ?? 0,
    minute:      raw.minute      ?? null,
    status:      raw.status      ?? "UPCOMING",
    statusShort: raw.statusShort ?? "",
    kickoff:     raw.date        ?? "",
    // stats: null means "API didn't return stats" (network error)
    // stats.available=false means "API returned empty stats" (match just started)
    stats:       raw.stats  ?? null,
    events:      raw.events ?? [],
  };
}

function unwrap(data) {
  if (Array.isArray(data))       return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export function getLiveMatches() {
  return client.get("/matches/live")
    .then((res) => unwrap(res.data).map(normalizeMatch).filter(Boolean))
    .catch((err) => { console.error("getLiveMatches:", err.message); return []; });
}

export function getTodayMatches() {
  return client.get("/matches/today")
    .then((res) => unwrap(res.data).map(normalizeMatch).filter(Boolean))
    .catch((err) => { console.error("getTodayMatches:", err.message); return []; });
}

export function getMatchDetail(fixtureId) {
  return client.get(`/matches/${fixtureId}`)
    .then((res) => normalizeMatch(res.data?.data ?? res.data))
    .catch((err) => { console.error("getMatchDetail:", err.message); return null; });
}
