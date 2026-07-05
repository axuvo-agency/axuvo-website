# Axuvo — Website (Vercel-ready)

Static site — plain HTML, CSS, and vanilla JavaScript. No build step, no dependencies.

```
axuvo-vercel/
├── index.html          markup (edit copy & sections here)
├── css/styles.css      all styling (brand colors at top in :root)
├── js/main.js          animations + content arrays (tiers, demo, reviews)
├── assets/             logo
├── vercel.json         Vercel config (caching + security headers)
├── .gitignore
└── README.md
```

## Deploy to Vercel — 3 ways

### Option A — Drag & drop (fastest)
1. Go to https://vercel.com and sign up / log in (free).
2. Dashboard: Add New… → Project → Deploy.
3. Drag this whole `axuvo-vercel` folder in.
4. Framework preset: Other. Build command EMPTY, output directory `.` (root).
5. Click Deploy. Live `something.vercel.app` URL in ~20 seconds.

### Option B — Vercel CLI
```bash
npm i -g vercel
cd axuvo-vercel
vercel          # preview URL
vercel --prod   # production
```
When asked for the directory, press Enter. No build command — accept defaults.

### Option C — Git (best for ongoing edits)
1. Push this folder to a GitHub repo.
2. Vercel: Add New… → Project → Import that repo.
3. Framework: Other, build command empty, output dir `.`.
4. Deploy. Every future `git push` auto-deploys.

## Custom domain (e.g. axuvo.in)
Vercel dashboard → project → Settings → Domains → Add → enter domain, then update the
DNS records Vercel shows at your registrar. Free HTTPS is automatic.

## Editing quick-reference
| Change | Where |
|---|---|
| Brand colors | css/styles.css → :root |
| Pricing tiers | js/main.js → const tiers / compareRows |
| Live-demo reviews | js/main.js → const demoData |
| Website price | index.html → search "from ₹40,000" |
| Contact email | index.html → search "axuvo.agency@gmail.com" |
| WhatsApp number | index.html → search "wa.me/91" |
| Social links | index.html → footer |

## Notes
- vercel.json adds long-cache headers on /css, /js, /assets plus security headers.
  Not required — Vercel serves fine without it — but speeds up repeat visits.
- cleanUrls is on, so /index.html also works as /.
- No environment variables needed.
