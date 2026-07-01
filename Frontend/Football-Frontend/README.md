# ⚽ Football Live Scoreboard — Frontend

React + Vite frontend for the Football Live Score app.

## Stack

- **React 19** with React Router v7
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- **Vite 8** as build tool
- **Axios** for REST calls to the backend

## Setup

```bash
# Install dependencies
npm install

# Copy env file (only needed if you change the backend port)
cp .env.example .env
```

`.env` (optional):

```env
VITE_API_URL=http://localhost:5003
```

## Development

```bash
npm run dev
```

Starts the Vite dev server at `http://localhost:5173`.  
The `/api` prefix is proxied to `VITE_API_URL` (default `http://localhost:5003`).

## Build

```bash
npm run build
```

Output goes to `dist/`. Deploy the contents to any static host (Vercel, Netlify, etc.).  
Make sure to set up an SPA fallback rule so React Router handles all routes.

## Lint

```bash
npm run lint
```

## Project structure

```
src/
├── api/          # Axios wrappers (leagueApi, matchApi)
├── assets/       # Images and SVGs
├── components/   # Reusable UI (Header, MatchCard, LeagueCard, …)
├── context/      # React contexts (Matches, Theme, Settings)
├── pages/        # Route-level views (Home, Live, League, Match, Settings)
├── App.jsx       # Route definitions
├── main.jsx      # React root + provider tree
└── index.css     # Tailwind base + custom design tokens
```

See the [root README](../../README.md) for full project documentation including API reference and deployment guide.
