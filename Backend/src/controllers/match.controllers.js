import {
  getLiveMatches,
  getMatchDetail,
  getTodayFixtures,
} from "../services/footballService.js";

async function handleRequest(res, serviceCall) {
  try {
    const data = await serviceCall();
    return res.json({ success: true, count: Array.isArray(data) ? data.length : 1, data });
  } catch (error) {
    console.error("❌ Controller error:", error.message);
    const status = error.response?.status ?? 500;
    return res.status(status >= 400 && status < 500 ? status : 500).json({
      success: false,
      message: "Failed to fetch data from football API",
      error: error.message,
    });
  }
}

/** GET /api/matches/live */
export const getLive = (req, res) => handleRequest(res, getLiveMatches);

/** GET /api/matches/today */
export const getToday = (req, res) => handleRequest(res, getTodayFixtures);

/** GET /api/matches/:fixtureId — returns fixture + stats + events */
export const getMatch = async (req, res) => {
  const { fixtureId } = req.params;
  if (!fixtureId || isNaN(Number(fixtureId))) {
    return res.status(400).json({ success: false, message: "fixtureId must be a valid number" });
  }
  return handleRequest(res, () => getMatchDetail(Number(fixtureId)));
};
