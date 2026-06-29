================================================================================
  FOOTBALL LIVE SCOREBOARD
  Real-time football scores, leagues & match statistics
  React + Node.js + Express + API-Football v3
================================================================================

ONLINE DOCUMENTATION (FULL GUIDE)
---------------------------------
https://football-live-scoreboard-docs.netlify.app/

LIVE DEMO
---------
https://football-live.sumsols.com/

Also see DOCUMENTATION.md, API-KEY-SETUP.txt and README.md in this package.


IMPORTANT — YOUR OWN API KEY (REQUIRED)
---------------------------------------
This package does NOT include an API key. After download/install, each user
must register at https://dashboard.api-football.com/register and add their
own key to Backend/.env (copy from .env.example).

Full steps: open API-KEY-SETUP.txt


REQUIREMENTS
------------
- Node.js 18+
- npm 9+
- API-Football API key (free tier: https://dashboard.api-football.com/register)


QUICK INSTALL
-------------

1) BACKEND
   cd Backend
   npm install
   Copy .env.example to .env and set API_KEY=your_key
   npm run dev
   -> http://localhost:5003

2) FRONTEND
   cd Frontend/Football-Frontend
   npm install
   Copy .env.example to .env (optional if using default port 5003)
   npm run dev
   -> http://127.0.0.1:5173


FOLDER STRUCTURE
----------------
Backend/                     Node.js API server
Frontend/Football-Frontend/  React app (USE THIS for npm commands)


FEATURES
--------
- Live match scores and status
- Today's fixtures by league
- Searchable league browser
- Match detail: goals, events, statistics
- Dark mode + settings
- Responsive mobile-first UI
- Backend caching for API rate limits
- Socket.IO server-side live poller


API KEY (YOU MUST ADD YOUR OWN)
-------------------------------
- No API key is included in this download
- Register free: https://dashboard.api-football.com/register
- Copy Backend/.env.example to Backend/.env
- Set API_KEY=your_personal_key_from_dashboard
- See API-KEY-SETUP.txt for full instructions
- Free plan: 100 requests/day, 10/minute


PRODUCTION BUILD
----------------
Frontend: cd Frontend/Football-Frontend && npm run build
Deploy dist/ folder to any static host (Vercel, Netlify, etc.)
Deploy Backend to Railway, Render, or similar Node host.


LICENSE
-------
See LICENSE.txt


SUPPORT
-------
Full documentation: https://football-live-scoreboard-docs.netlify.app/
Live demo: https://football-live.sumsols.com/

================================================================================
