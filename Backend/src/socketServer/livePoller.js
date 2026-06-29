import { getLiveMatches } from "../services/footballService.js";

let previousSnapshot = {};
let isPolling = false;

function hasChanged(prev, curr) {
  return (
    prev.scoreA !== curr.scoreA ||
    prev.scoreB !== curr.scoreB ||
    prev.minute !== curr.minute ||
    prev.status !== curr.status
  );
}

async function pollLiveMatches(io) {
  if (isPolling) return; // prevent overlap
  isPolling = true;

  try {
    const fixtures = await getLiveMatches();

    if (!fixtures || fixtures.length === 0) {
      previousSnapshot = {};
      io.to("live").emit("liveMatchList", []);
      return;
    }

    const changed = [];

    for (const fixture of fixtures) {
      const prev = previousSnapshot[fixture.fixtureId];

      if (!prev || hasChanged(prev, fixture)) {
        changed.push(fixture);
        io.to(`fixture_${fixture.fixtureId}`).emit("scoreUpdated", fixture);
      }

      previousSnapshot[fixture.fixtureId] = fixture;
    }

    io.to("live").emit("liveMatchList", fixtures);

  } catch (err) {
    console.error("❌ poller error:", err.message);
  } finally {
    isPolling = false;
  }
}

export function startLivePoller(io, intervalMs = 60000) {
  pollLiveMatches(io);
  setInterval(() => pollLiveMatches(io), intervalMs);

  console.log(`⚽ Live poller running (${intervalMs / 1000}s)`);
}