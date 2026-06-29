import express from "express";
import { getLive, getToday, getMatch } from "../controllers/match.controllers.js";

const router = express.Router();

router.get("/live",  getLive);   // GET /api/matches/live
router.get("/today", getToday);  // GET /api/matches/today
router.get("/:fixtureId", getMatch);

export default router;
