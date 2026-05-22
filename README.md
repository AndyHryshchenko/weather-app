# Weather App

A pnpm monorepo with a NestJS backend, React frontend, and shared types package.

## Prerequisites

- Node.js **>= 20.12** (recommended: **24** from `.nvmrc`; `nvm use` before running commands)
- pnpm 10+

If you use Conda `(base)`, confirm `node -v` is not an old system Node — Vite 8 needs `util.styleText` (Node 20.12+).
- OpenWeather API key (Current Weather + 5-day/3-hour forecast on the free tier)
- Google Maps API key (Places API, for location search)

## Setup

```bash
nvm use
cp .env.example .env
# Add OPENWEATHER_API_KEY and VITE_GOOGLE_MAPS_API_KEY
pnpm install
```

## Development

Run backend and frontend in **separate terminals** from the repo root:

**Terminal 1 — API (port 3001)**

```bash
pnpm dev:backend
```

**Terminal 2 — UI (port 5173)**

```bash
pnpm dev:frontend
```

Open the URL Vite prints, usually http://localhost:5173/ (not port 3001 — that is the API only).

Health check: http://localhost:3001/health

If a port is already in use, stop the old process first:

```bash
lsof -ti :3001 | xargs kill -9 2>/dev/null
lsof -ti :5173 | xargs kill -9 2>/dev/null
```

## Testing

```bash
pnpm test
pnpm test:coverage
```

## Project structure

- `packages/types` — shared TypeScript types
- `backend` — NestJS API with OpenWeather vendor, cache, geocoder
- `frontend` — Vite + React + Redux + Tailwind
