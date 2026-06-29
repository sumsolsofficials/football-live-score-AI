# Football Live Scoreboard — Documentation

## Online documentation (recommended)

Full developer documentation with architecture diagrams, API reference, deployment
guides, and UI walkthrough:

**https://football-live-scoreboard-docs.netlify.app/**

## Live demo

Try the deployed application:

**https://football-live.sumsols.com/**

---

## Your API key (required — not included)

This product **does not ship with an API key**. Football data comes from
[API-Football](https://www.api-football.com/). Each person who installs this
project must:

1. Create a free account at https://dashboard.api-football.com/register
2. Copy their API key from the dashboard
3. Copy `Backend/.env.example` → `Backend/.env`
4. Set `API_KEY=your_key_here` and save
5. Restart the backend (`npm run dev`)

The frontend does **not** need the football API key — only the backend `.env` file.

See **`API-KEY-SETUP.txt`** in the package root for a complete walkthrough.

---

## Quick start

### Requirements

- Node.js 18 or later
- npm 9 or later
- API-Football key from https://dashboard.api-football.com/register (free tier available)

### 1. Backend

```bash
cd Backend
npm install
cp .env.example .env
# Edit .env and set your API_KEY
npm run dev
```

Server runs at `http://localhost:5003`

### 2. Frontend

```bash
cd Frontend/Football-Frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://127.0.0.1:5173` in your browser.

---

## Project structure

```
football-live-scoreboard/
├── Backend/                    Express API + Socket.IO server
│   └── src/
│       ├── index.js
│       ├── services/footballService.js
│       ├── controllers/
│       ├── routes/
│       └── socketServer/
└── Frontend/
    └── Football-Frontend/      React + Vite SPA (run commands here)
        └── src/
            ├── pages/
            ├── components/
            ├── context/
            └── api/
```

> **Note:** Use `Frontend/Football-Frontend` for all frontend commands. The parent
> `Frontend/` folder is not the application root.

---

## Environment variables

### Backend (`Backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5003) |
| `ORIGIN` | CORS origin (`*` for development) |
| `API_KEY` | **Your own** API-Football v3 key (not included — get from dashboard) |

### Frontend (`Frontend/Football-Frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend URL (default: http://localhost:5003) |

---

## API-Football free tier

- 100 requests per day
- 10 requests per minute
- The backend uses in-memory caching to reduce API usage

---

## Production deployment

- **Frontend:** `npm run build` → deploy `dist/` to Vercel, Netlify, or Cloudflare Pages
- **Backend:** Deploy to Railway, Render, or Fly.io
- Set `ORIGIN` to your frontend domain in production
- Configure SPA fallback (all routes → `index.html`)

See the online docs for the full deployment checklist:
https://football-live-scoreboard-docs.netlify.app/

---

## Support

Refer to `README.md` and `README.txt` included in this package.

Data provided by [API-Football](https://www.api-football.com/).
