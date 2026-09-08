# MetEyes

Run `npm install`, copy `.env.example` to `.env`, and run `npm run dev`.
For local production, run `npm run build`, set `NODE_ENV=production`, and
run `npm start`.

## Vercel

Import with the Vite preset and root `./`. The configuration builds `dist`
and routes `/api/*` to the Express function. Vercel automatically sets
`VERCEL=1`, which skips the local listener and Vite middleware.

Set `GEMINI_API_KEY` in Production and Preview for live AI answers.
Without a key, the API returns fallback insights. Never prefix the key
with `VITE_`. Remove `APP_URL`; the app does not use it.

After deployment, check `/api/health`, the gallery, filters, and artwork
questions. In-memory caches are temporary and separate across instances.
