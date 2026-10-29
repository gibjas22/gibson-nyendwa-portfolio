# Live checks, 29 October 2026

Site: https://main.dbthjbi29n1oo.amplifyapp.com (commit `f2900b1` deployed). Checked in Chrome (desktop) between 07:30 and 07:35 UTC. Nothing here is a secret; the account ID does not appear.

## 1. Security headers (live responses, `fetch` with `cache: no-store` from the site's own origin)

| Route | Status | CSP | HSTS | nosniff | Referrer-Policy | Permissions-Policy | X-Frame-Options | Cache-Control |
|---|---|---|---|---|---|---|---|---|
| `/` | 200 | present | present | present | present | present | DENY | `public, max-age=0, s-maxage=31536000` |
| `/insights/` | 200 | present | present | present | present | present | DENY | same |
| `/insights/article.html` | 200 | present | present | present | present | present | DENY | same |
| `/faq.html` | 200 | present | present | present | present | present | DENY | same |
| `/js/news.js` | 200 | present | present | | | | DENY | `public, max-age=0, s-maxage=31536000` |
| `/assets/audio/classroom.mp3` | 200 | present | present | | | | DENY | `public, max-age=604800` (from `customHttp.yml`) |
| `/no-such-page` | **404** | present | present | | | | DENY | none; body is the home page (see gap below) |

Values on `/` (identical on the other HTML routes):
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` (no `preload`)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
- `X-Frame-Options: DENY`
- `Content-Security-Policy`: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; media-src 'self'; connect-src 'self' https://*.execute-api.eu-west-2.amazonaws.com; frame-src https://cal.imeetify.com https://www.youtube-nocookie.com https://player.vimeo.com https://open.spotify.com https://embed.podcasts.apple.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests`

Assessment:
- Every header defined in `customHttp.yml` is served live, on pages and on static files. Frame protection is doubled up: CSP `frame-ancestors 'none'` plus `X-Frame-Options: DENY`.
- HSTS `includeSubDomains`: suitable here. The site lives on `main.dbthjbi29n1oo.amplifyapp.com`, so the flag only covers hosts under that name, all of which are Amplify-managed and HTTPS-only. `preload` is deliberately not set (the domain belongs to AWS, not to Gibson).
- Accepted trade-off: `style-src 'unsafe-inline'`, needed for the colour variables set in `style` attributes. Scripts stay `'self'` only.
- Compatibility: the What's On API (connect-src), Google Fonts, the YouTube video, the booking frame and the desk audio (same origin) all work under this policy. No header change was needed, so none was made.
- Gap (not a header issue): unknown URLs return status 404 but show the home page, because Amplify has no rewrite for `404.html` yet. Fixing it means adding a rule in the Amplify app settings, which the project rules say needs Gibson's go-ahead.

## 2. What's On feed (live)

- Panel is the first block on Insights, heading "What's On in Birmingham".
- All What's On: 9 stories, all under `/whats-on/whats-on-news`, `/whats-on/family-kids-news` or `/whats-on/food-drink-news`. No shopping or competition links.
- Food & drink 9, Family & kids 9, Music & nightlife 3, Latest news 9 (`/news/midlands-news`, `/news/cost-of-living`).
- Every card link on every tab: `https`, host `www.birminghammail.co.uk`, `target="_blank"`, `rel="noopener noreferrer"`.
- Two links opened and matched their headlines: "Last minute Halloween events around Birmingham, including some treats for £5 or less" and "The last great Birmingham department store Christmas - Santa dates and a grotto option".
- "Loading Food & drink..." shown while a tab loads (seen live on a cold start).
- **Defect found:** the date line read "2 h ago Â· Read on Birmingham Live". Cause: the deploy script re-saved `js/news.js` and Windows PowerShell 5 read it as ANSI. Fixed in `js/news.js` (HTML entity, file now pure ASCII) and in `deploy-news.ps1` (reads and writes UTF-8, skips the write when nothing changes). Pending push.
- Mobile: the browser window could not be resized for a live mobile view; mobile layout (360 and 768 px), empty state and error state were checked locally against mocked feed data, with no sideways scrolling.
