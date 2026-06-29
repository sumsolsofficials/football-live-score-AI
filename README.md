<div align="center">

# ⚽ Football Live Scoreboard

### Real-Time Football Live Scores, Leagues & Match Statistics

**Production-ready full-stack football live score app** — React frontend, Node.js/Express backend, Socket.IO live updates, and [API-Football v3](https://www.api-football.com/) integration. Track live matches, today's fixtures, goals, possession, and stats across Premier League, Champions League, La Liga, and more.

<br />

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-View_App-2563eb?style=for-the-badge&logo=googlechrome&logoColor=white)](https://football-live.sumsols.com/)
[![Documentation](https://img.shields.io/badge/📖_Documentation-Full_Guide-16a34a?style=for-the-badge&logo=readthedocs&logoColor=white)](https://football-live-scoreboard-docs.netlify.app/)

<br />

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?style=flat-square&logo=socket.io&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![API-Football](https://img.shields.io/badge/API--Football-v3-FF6B00?style=flat-square)

</div>

---

> **🔑 API key required (not included)** — Register free at [API-Football](https://dashboard.api-football.com/register), copy `Backend/.env.example` → `Backend/.env`, and set `API_KEY`. See **[API-KEY-SETUP.txt](./API-KEY-SETUP.txt)** for step-by-step instructions.

---

## 📋 Table of Contents

| | |
|---|---|
| [✨ Features](#-features) | [🛠 Tech Stack](#-tech-stack) |
| [📁 Folder Structure](#-folder-structure) | [⚙️ Installation](#️-installation--setup) |
| [🔐 Environment Variables](#-environment-variables) | [▶️ Run Locally](#️-how-to-run-locally) |
| [📱 Usage Guide & Screenshots](#-usage-guide--screenshots) | [🔌 API Integration](#-api-integration-details) |
| [📡 REST API](#-rest-api-reference) | [⚡ Socket.IO Events](#-socketio-events) |
| [🚀 Deployment](#-deployment) | [🔮 Future Improvements](#-future-improvements) |
| [📄 License](#-license) | |

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

**Live scores & fixtures**
- Real-time scores, match minute, and status worldwide
- Today's fixtures grouped by league
- Searchable league browser (Premier League, UCL, La Liga…)
- Live count badges on league cards

**Match detail pages**
- Team lineups, goal events, assists, and minute
- Possession bar, shots, corners, fouls, cards
- Chronological goal & event timeline

</td>
<td width="50%" valign="top">

**Developer & UX**
- Socket.IO server-side live polling (60s)
- In-memory caching for API rate limits
- Dark mode (system-aware, persisted)
- Customizable stats display (bars / numbers / both)
- Mobile-first responsive UI (Tailwind CSS)
- Animated sticky navigation with route tracking

</td>
</tr>
</table>

---

## 🛠 Tech Stack

### Backend

| Layer | Technology |
|:------|:-----------|
| Runtime | Node.js (ESM) |
| Framework | Express 5 |
| Real-time | Socket.IO |
| HTTP client | Axios |
| Environment | dotenv |
| Dev server | Nodemon |

### Frontend

| Layer | Technology |
|:------|:-----------|
| UI library | React 19 |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| Build tool | Vite 8 |
| HTTP client | Axios |

### External Service

| Service | Usage |
|:--------|:------|
| [API-Football v3](https://v3.football.api-sports.io) | Live fixtures, statistics, events, league metadata |

---

## 📁 Folder Structure

```
football-live-score-AI/
├── Backend/
│   ├── .env                        # API key and server config
│   ├── package.json
│   └── src/
│       ├── index.js                # Express app entry point, Socket.IO init
│       ├── controllers/
│       │   ├── league.controllers.js
│       │   └── match.controllers.js
│       ├── middlewares/
│       │   └── errorHandler.js     # 404 + global error handlers
│       ├── models/
│       │   ├── league.models.js
│       │   └── match.models.js
│       ├── routes/
│       │   ├── league.routes.js
│       │   └── match.routes.js
│       ├── services/
│       │   └── footballService.js  # API client, caching, data transformers
│       └── socketServer/
│           ├── livePoller.js       # Polling loop + diff-based Socket.IO emit
│           └── socket.js           # Socket.IO server setup and room management
└── Frontend/
    └── Football-Frontend/
        ├── .env                    # Vite API base URL
        ├── index.html
        ├── vite.config.js
        ├── tailwind.config.js
        ├── public/
        │   ├── favicon.svg
        │   └── icons.svg
        └── src/
            ├── main.jsx            # React root, provider tree
            ├── App.jsx             # Route definitions
            ├── api/
            │   ├── leagueApi.js
            │   └── matchApi.js
            ├── components/
            │   ├── Header.jsx
            │   ├── MatchCard.jsx
            │   ├── LeagueCard.jsx
            │   └── ...
            ├── context/
            │   ├── MatchesContext.jsx
            │   ├── SettingsContext.jsx
            │   └── ThemeContext.jsx
            └── pages/
                ├── Home.jsx
                ├── LiveMatches.jsx
                ├── League.jsx
                ├── Matches.jsx
                └── Settings.jsx
```

---

## ⚙️ Installation & Setup

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- Free API key from [api-sports.io](https://dashboard.api-football.com/register)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/football-live-score-AI.git
cd football-live-score-AI
```

### 2. Install backend dependencies

```bash
cd Backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../Frontend/Football-Frontend
npm install
```

---

## 🔐 Environment Variables

### Backend — `Backend/.env`

```env
PORT=5003
ORIGIN=*
API_KEY=your_api_sports_key_here
```

| Variable | Description | Default |
|:---------|:------------|:--------|
| `PORT` | Port the Express server listens on | `5000` |
| `ORIGIN` | Allowed CORS origin for the frontend | `*` |
| `API_KEY` | Your API-Football v3 key from api-sports.io | — |

### Frontend — `Frontend/Football-Frontend/.env`

```env
VITE_API_URL=http://localhost:5003
```

| Variable | Description |
|:---------|:------------|
| `VITE_API_URL` | Base URL of the backend server |

> **Note:** The frontend uses Vite's dev proxy to forward `/api` requests to the backend.

---

## ▶️ How to Run Locally

Open two terminal windows.

### Terminal 1 — Backend

```bash
cd Backend
npm run dev
```

```
🚀 Server running → http://localhost:5003
⚽ Live poller running (60s)
```

### Terminal 2 — Frontend

```bash
cd Frontend/Football-Frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📱 Usage Guide & Screenshots

### Home — League Browser

Search leagues by name or country. Leagues are sorted by prominence. Live count badges appear when matches are in progress.

<p align="center">
  <img src="image-6.png" alt="Football live scoreboard home page — league browser with search bar and live match count badges" width="720" />
</p>

### Live Matches

All in-progress fixtures with score, elapsed minute, and pulsing LIVE indicator. Filter by league with horizontal pills.

<p align="center">
  <img src="image-1.png" alt="Live football matches page showing real-time scores and live status indicators" width="720" />
</p>

### Match Detail — Events & Statistics

Score header, goal timeline (scorer, assist, minute), and match stats — possession, shots, corners, fouls, cards.

<p align="center">
  <img src="image-2.png" alt="Football match detail page — goal events timeline with scorer and minute" width="720" />
</p>

<p align="center">
  <img src="image-3.png" alt="Football match statistics — possession bar, shots on target, corners and fouls" width="720" />
</p>

### Settings — Dark Mode & Preferences

Toggle dark mode, choose stats display style (bars, numbers, or both).

<p align="center">
  <img src="image-4.png" alt="Football scoreboard settings page — dark mode toggle and stats display options" width="720" />
</p>

<p align="center">
  <img src="image-5.png" alt="Football live scoreboard dark mode UI with match statistics" width="720" />
</p>

---

## 🔌 API Integration Details

ScoreStream uses the **API-Football v3** REST API (`https://v3.football.api-sports.io`), authenticated via the `x-apisports-key` header.

### Endpoints consumed

| Endpoint | Parameters | Usage |
|:---------|:-----------|:------|
| `GET /fixtures` | `live=all` | All currently in-progress fixtures |
| `GET /fixtures` | `date=YYYY-MM-DD` | All fixtures for today |
| `GET /fixtures` | `id=<fixtureId>` | Single fixture by ID |
| `GET /fixtures/statistics` | `fixture=<fixtureId>` | Per-team match statistics |
| `GET /fixtures/events` | `fixture=<fixtureId>` | Goal, card, and substitution events |

### Status code mapping

| Internal status | API status codes |
|:----------------|:-----------------|
| `LIVE` | `1H`, `HT`, `2H`, `ET`, `BT`, `P`, `INT`, `SUSP` |
| `FINISHED` | `FT`, `AET`, `PEN`, `ABD`, `WO`, `AWD` |
| `UPCOMING` | All other codes |

### Caching strategy

| Cache key | TTL | Scope |
|:----------|:----|:------|
| `live` | 30 seconds | All live fixtures |
| `today` | 5 minutes | All today's fixtures |
| `leagues` | 10 minutes | League list from today's fixtures |
| Per-fixture stats/events | 60 seconds | Individual fixture data |

In-flight request deduplication prevents burst API calls on concurrent requests.

### Live polling (Socket.IO)

The `livePoller` runs every 60 seconds, diffs fixture state, and emits `scoreUpdated` / `liveMatchList` to subscribed clients.

---

## 📡 REST API Reference

**Base URL:** `http://localhost:5003`

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/` | Health check |
| `GET` | `/api/matches/live` | All live fixtures |
| `GET` | `/api/matches/today` | Today's fixtures |
| `GET` | `/api/matches/:fixtureId` | Single fixture with stats & events |
| `GET` | `/api/leagues` | Leagues with fixtures today |

**Success response:**

```json
{ "success": true, "count": 12, "data": [ ... ] }
```

**Error response:**

```json
{ "success": false, "message": "Failed to fetch data from football API", "error": "..." }
```

---

## ⚡ Socket.IO Events

### Client → Server

| Event | Payload | Description |
|:------|:--------|:------------|
| `joinLive` | — | Subscribe to live match list |
| `joinMatch` | `fixtureId: number` | Subscribe to fixture updates |
| `leaveMatch` | `fixtureId: number` | Unsubscribe from fixture |

### Server → Client

| Event | Room | Payload | Description |
|:------|:-----|:--------|:------------|
| `liveMatchList` | `live` | `Fixture[]` | Full live fixture list |
| `scoreUpdated` | `fixture_<id>` | `Fixture` | Updated fixture data |

---

## 🚀 Deployment

### Backend

Set production environment variables:

```env
PORT=5003
ORIGIN=https://your-frontend-domain.com
API_KEY=your_api_sports_key
```

**Platforms:** Railway, Render, Fly.io, VPS (DigitalOcean, Hetzner)

```bash
npm start
```

### Frontend

```bash
cd Frontend/Football-Frontend
npm run build
```

Deploy `dist/` to Vercel, Netlify, or Cloudflare Pages. Configure SPA fallback (`index.html` for all routes).

---

## 🔮 Future Improvements

- Socket.IO client on frontend (replace REST polling)
- League standings / table page
- Favourite teams with persisted preferences
- Browser push notifications for goals
- Global team & player search
- Past match history browser
- Head-to-head stats on match detail
- Redis cache for horizontal scaling
- API rate limit dashboard in Settings
- Unit and integration tests

---

## 📄 License

See [LICENSE.txt](./LICENSE.txt) for commercial use terms.

---

<div align="center">

**Football Live Scoreboard** — Real-time scores powered by [API-Football](https://www.api-football.com/)

Built with React · Express · Socket.IO · Tailwind CSS

[Live Demo](https://football-live.sumsols.com/) · [Documentation](https://football-live-scoreboard-docs.netlify.app/)

</div>
