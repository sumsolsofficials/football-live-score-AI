import express from "express";
import { getAllLeagues } from "../controllers/league.controllers.js";

const router = express.Router();

router.get("/", getAllLeagues);

export default router;