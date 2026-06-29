/**
 * league.controllers.js
 * ---------------------
 * Handlers for league-related endpoints.
 * Leagues come from API-Football, not MongoDB.
 */

import { getLeagues } from "../services/footballService.js";

/**
 * GET /api/leagues
 * Returns all currently active leagues from API-Football.
 */
export const getAllLeagues = async (req, res) => {
  try {
    const leagues = await getLeagues();
    return res.json({ success: true, count: leagues.length, data: leagues });
  } catch (error) {
    console.error("❌ League controller error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch leagues",
      error: error.message,
    });
  }
};