import dotenv from "dotenv";
dotenv.config();

import http from "http";
import cors from "cors";
import express from "express";

import matchRoutes from "./routes/match.routes.js";
import leagueRoutes from "./routes/league.routes.js";
import { initSocket } from "./socketServer/socket.js";
import { startLivePoller } from "./socketServer/livePoller.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors({ origin: process.env.ORIGIN || "*" }));
app.use(express.json());

app.use("/api/matches", matchRoutes);
app.use("/api/leagues", leagueRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "⚽ Football Live Score API",
    endpoints: {
      live:    "GET /api/matches/live",
      detail:  "GET /api/matches/:fixtureId",
      leagues: "GET /api/leagues",
    },
  });
});

app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);
const io = initSocket(server);

const PORT = process.env.PORT || 5000;

startLivePoller(io);
server.listen(PORT, () =>
  console.log(`🚀 Server running → http://localhost:${PORT}`)
);