import axios from "axios";

const baseURL = "/api";
const client = axios.create({ baseURL });

/**
 * Safely extracts leagues from the backend shape:
 * { success, count, data: [...] }
 */
function unwrapList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;         // ← our backend
  if (Array.isArray(data?.response)) return data.response;
  return [];
}

/**
 * The backend already returns a flat normalised league:
 * { id, name, country, logo, type }
 * No sub-keys needed — just pass it through with safe fallbacks.
 */
function normalizeLeague(item) {
  // Handle both flat backend shape AND raw API-Football shape (item.league wrapper)
  const league = item.league ?? item;
  const country =
    typeof item.country === "string"
      ? item.country                    // flat backend shape ← fixes the bug
      : item.country?.name ?? "";       // raw API-Football shape

  return {
    id:      league.id   ?? item.id   ?? item._id ?? league.name ?? "",
    name:    league.name ?? "Unknown League",
    country,
    logo:    league.logo ?? "",
    type:    item.type   ?? "",
  };
}

function isValidLeague(l) {
  return Boolean(l && l.name);
}

/**
 * GET /api/leagues
 */
export function getLeagues() {
  return client
    .get("/leagues")
    .then((res) => {
      const rawList = unwrapList(res.data);
      return rawList.map(normalizeLeague).filter(isValidLeague);
    })
    .catch((err) => {
      console.error("getLeagues failed:", err.response?.data ?? err.message);
      return [];
    });
}