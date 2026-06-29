import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// ─── Status helpers ───────────────────────────────────────────────────────────

const LIVE_CODES = new Set(["1H","HT","2H","ET","BT","P","INT","SUSP"]);
const FINISHED_CODES = new Set(["FT","AET","PEN","ABD","WO","AWD"]);

function resolveStatus(short) {
  if (LIVE_CODES.has(short)) return "LIVE";
  if (FINISHED_CODES.has(short)) return "FINISHED";
  return "UPCOMING";
}

// ─── Cache ────────────────────────────────────────────────────────────────────

const cache = {
  live:    { data: null, fetchedAt: 0, ttl: 30_000 },
  today:   { data: null, fetchedAt: 0, ttl: 5 * 60_000 },
  leagues: { data: null, fetchedAt: 0, ttl: 10 * 60_000 },
};

const statsCache = {};
const eventsCache = {};
const DETAIL_TTL = 60_000;

// ─── FIX: request lock (prevents burst duplicate calls) ───────────────────────
let inFlight = {
  live: false,
  fixtures: {},
  stats: {},
  events: {}
};

function isFresh(entry) {
  return entry.data !== null && Date.now() - entry.fetchedAt < entry.ttl;
}

function setCache(key, data) {
  cache[key].data = data;
  cache[key].fetchedAt = Date.now();
}

// ─── Axios ────────────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: "https://v3.football.api-sports.io",
  headers: { "x-apisports-key": process.env.API_KEY?.trim() },
  timeout: 10_000,
});

// ─── Fixture transformer ──────────────────────────────────────────────────────

function transformFixture(raw) {
  const { fixture, teams, goals, league } = raw;

  return {
    fixtureId: fixture.id,
    teamA: { id: teams.home.id, name: teams.home.name, logo: teams.home.logo || "" },
    teamB: { id: teams.away.id, name: teams.away.name, logo: teams.away.logo || "" },
    scoreA: goals.home ?? 0,
    scoreB: goals.away ?? 0,
    status: resolveStatus(fixture.status.short),
    statusShort: fixture.status.short,
    minute: fixture.status.elapsed ?? null,
    league: {
      id: league.id,
      name: league.name,
      country: league.country,
      logo: league.logo || "",
      round: league.round || "",
    },
    date: fixture.date,
  };
}

// ─── Stats / Events helpers ───────────────────────────────────────────────────

function extractStat(statsArray, type) {
  const entry = statsArray.find((s) => s.type === type);
  const raw = entry?.value;
  if (raw === null || raw === undefined) return null;
  if (typeof raw === "string" && raw.endsWith("%")) return parseInt(raw, 10);
  return raw;
}

function transformStats(apiStats) {
  if (!Array.isArray(apiStats) || apiStats.length === 0) return null;

  const [homeRaw, awayRaw] = apiStats;

  const h = homeRaw?.statistics || [];
  const a = awayRaw?.statistics || [];

  const homeStats = {
    shotsOnGoal:     extractStat(h, "Shots on Goal")    ?? 0,
    shotsOffGoal:    extractStat(h, "Shots off Goal")   ?? 0,
    totalShots:      extractStat(h, "Total Shots")      ?? 0,
    blockedShots:    extractStat(h, "Blocked Shots")    ?? 0,
    shotsInsideBox:  extractStat(h, "Shots insidebox")  ?? 0,
    shotsOutsideBox: extractStat(h, "Shots outsidebox") ?? 0,
    fouls:           extractStat(h, "Fouls")            ?? 0,
    cornerKicks:     extractStat(h, "Corner Kicks")     ?? 0,
    offsides:        extractStat(h, "Offsides")         ?? 0,
    // possession stays null when API doesn't provide it — never default to 50
    possession:      extractStat(h, "Ball Possession")  ?? null,
    yellowCards:     extractStat(h, "Yellow Cards")     ?? 0,
    redCards:        extractStat(h, "Red Cards")        ?? 0,
    saves:           extractStat(h, "Goalkeeper Saves") ?? 0,
    totalPasses:     extractStat(h, "Total passes")     ?? 0,
    accuratePasses:  extractStat(h, "Passes accurate")  ?? 0,
    passAccuracy:    extractStat(h, "Passes %")         ?? null,
  };

  const awayStats = {
    shotsOnGoal:     extractStat(a, "Shots on Goal")    ?? 0,
    shotsOffGoal:    extractStat(a, "Shots off Goal")   ?? 0,
    totalShots:      extractStat(a, "Total Shots")      ?? 0,
    blockedShots:    extractStat(a, "Blocked Shots")    ?? 0,
    shotsInsideBox:  extractStat(a, "Shots insidebox")  ?? 0,
    shotsOutsideBox: extractStat(a, "Shots outsidebox") ?? 0,
    fouls:           extractStat(a, "Fouls")            ?? 0,
    cornerKicks:     extractStat(a, "Corner Kicks")     ?? 0,
    offsides:        extractStat(a, "Offsides")         ?? 0,
    possession:      extractStat(a, "Ball Possession")  ?? null,
    yellowCards:     extractStat(a, "Yellow Cards")     ?? 0,
    redCards:        extractStat(a, "Red Cards")        ?? 0,
    saves:           extractStat(a, "Goalkeeper Saves") ?? 0,
    totalPasses:     extractStat(a, "Total passes")     ?? 0,
    accuratePasses:  extractStat(a, "Passes accurate")  ?? 0,
    passAccuracy:    extractStat(a, "Passes %")         ?? null,
  };

  // available = true only when at least one real non-zero stat came from the API
  const numericFields = [
    "shotsOnGoal","shotsOffGoal","totalShots","blockedShots",
    "shotsInsideBox","shotsOutsideBox","fouls","cornerKicks",
    "offsides","yellowCards","redCards","saves","totalPasses","accuratePasses",
  ];
  const hasAnyRealData =
    homeStats.possession != null ||
    awayStats.possession != null ||
    numericFields.some(f => (homeStats[f] ?? 0) > 0 || (awayStats[f] ?? 0) > 0);

  return {
    home: homeStats,
    away: awayStats,
    available: hasAnyRealData,
  };
}

function transformEvent(raw, homeTeamId) {
  const elapsed = raw.time?.elapsed ?? 0;
  const extra = raw.time?.extra ?? null;
  const minute = extra ? `${elapsed}+${extra}` : String(elapsed);

  return {
    minute,
    minuteNum: elapsed,
    team: raw.team?.name ?? "",
    teamId: raw.team?.id ?? null,
    isHome: raw.team?.id === homeTeamId,
    player: raw.player?.name ?? "",
    assist: raw.assist?.name ?? null,
    type: raw.type ?? "",
    detail: raw.detail ?? "",
    comments: raw.comments ?? null,
  };
}

// ─── FIXED FETCH (no duplicate spam calls) ────────────────────────────────────

async function fetchFixtures(params) {
  const key = JSON.stringify(params);

  if (inFlight.fixtures[key]) return inFlight.fixtures[key];

  inFlight.fixtures[key] = api.get("/fixtures", { params })
    .then(res => {
      const raw = res.data?.response;
      if (!Array.isArray(raw)) throw new Error("bad response");
      return raw.map(transformFixture);
    })
    .finally(() => {
      setTimeout(() => delete inFlight.fixtures[key], 1000);
    });

  return inFlight.fixtures[key];
}

async function fetchStats(fixtureId) {
  if (statsCache[fixtureId] && Date.now() - statsCache[fixtureId].fetchedAt < DETAIL_TTL) {
    return statsCache[fixtureId].data;
  }

  if (inFlight.stats[fixtureId]) return inFlight.stats[fixtureId];

  inFlight.stats[fixtureId] = api.get("/fixtures/statistics", {
    params: { fixture: fixtureId }
  })
    .then(res => {
      const data = transformStats(res.data?.response ?? []);
      statsCache[fixtureId] = { data, fetchedAt: Date.now() };
      return data;
    })
    .catch(() => null)
    .finally(() => {
      delete inFlight.stats[fixtureId];
    });

  return inFlight.stats[fixtureId];
}

async function fetchEvents(fixtureId, homeTeamId) {
  if (eventsCache[fixtureId] && Date.now() - eventsCache[fixtureId].fetchedAt < DETAIL_TTL) {
    return eventsCache[fixtureId].data;
  }

  if (inFlight.events[fixtureId]) return inFlight.events[fixtureId];

  inFlight.events[fixtureId] = api.get("/fixtures/events", {
    params: { fixture: fixtureId }
  })
    .then(res => {
      const raw = res.data?.response ?? [];
      const events = raw
        .map(e => transformEvent(e, homeTeamId))
        .sort((a, b) => a.minuteNum - b.minuteNum);

      eventsCache[fixtureId] = { data: events, fetchedAt: Date.now() };
      return events;
    })
    .catch(() => [])
    .finally(() => {
      delete inFlight.events[fixtureId];
    });

  return inFlight.events[fixtureId];
}

// ─── PUBLIC APIs (same logic preserved) ───────────────────────────────────────

export async function getLiveMatches() {
  if (isFresh(cache.live)) return cache.live.data;

  const data = (await fetchFixtures({ live: "all" }))
    .filter(f => f.status === "LIVE");

  setCache("live", data);
  return data;
}

export async function getTodayFixtures() {
  if (isFresh(cache.today)) return cache.today.data;

  const date = new Date().toISOString().slice(0, 10);
  const data = await fetchFixtures({ date });

  setCache("today", data);
  return data;
}

export async function getLeagues() {
  if (isFresh(cache.leagues)) return cache.leagues.data;

  const fixtures = await getTodayFixtures();

  const seen = new Set();
  const leagues = [];

  for (const f of fixtures) {
    if (!seen.has(f.league.id)) {
      seen.add(f.league.id);
      leagues.push({
        id: f.league.id,
        name: f.league.name,
        country: f.league.country,
        logo: f.league.logo,
        type: ""
      });
    }
  }

  setCache("leagues", leagues);
  return leagues;
}

export async function getMatchDetail(fixtureId) {
  const [fixtureArr, stats, events] = await Promise.all([
    fetchFixtures({ id: fixtureId }),
    fetchStats(fixtureId),
    fetchEvents(fixtureId, null)
  ]);

  const fixture = fixtureArr[0];
  if (!fixture) return null;

  const eventsWithSide = await fetchEvents(
    fixtureId,
    fixture.teamA?.id ?? null
  );

  return {
    ...fixture,
    stats,
    events: eventsWithSide
  };
}

export function invalidateCache(key) {
  const keys = key ? [key] : Object.keys(cache);

  keys.forEach(k => {
    if (cache[k]) {
      cache[k].data = null;
      cache[k].fetchedAt = 0;
    }
  });
}