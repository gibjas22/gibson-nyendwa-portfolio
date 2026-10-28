
## 27 October 2026, evening: Insights hub, FAQ, legal pages

**What changed**
- New Insights hub at `insights/index.html` with five categories (AI & Automation, Digital Marketing, Cybersecurity, SEND & Inclusive Education, Music & Creativity), search, newest-first ordering, Load more, empty and no-results states, URL state (`?category=&q=`), and a featured slot that only appears when a published article is marked `featured: true`.
- Article page at `insights/article.html?slug=` with breadcrumb, byline, reading time, optional cover, table of contents (three or more headings), sources, share links and Copy link, related articles, BlogPosting JSON-LD, canonical and social metadata. Drafts and invalid slugs render the not-found state.
- Content model in `js/insights.js` (`articles` array, currently empty), authoring template in `content/ARTICLE-TEMPLATE.js`, editorial rules in `content/EDITORIAL-GUIDE.md`.
- `faq.html`: 22 questions in seven groups, button-based accordion with `aria-expanded`/`aria-controls`, keyboard operable, deep-linkable (`faq.html#q5`), reduced-motion safe.
- `cookies.html` (audit: no cookies, no storage, no analytics; third parties load only on a button press, so no banner), `terms.html`, and a rewritten `privacy.html` (operator is Gibson personally, not Gibcom).
- `404.html`, shared secondary-page shell (`js/shell.js`), Insights added to the main navigation, FAQ plus a legal row (Privacy, Cookies, Cookie settings, Terms of use) in every footer, `sitemap.xml` updated.

**How it was tested**
Playwright against a local server: 13 routes at 320, 390, 768, 900 and 1280 px with zero horizontal overflow and zero console errors (font CDN blocked in the sandbox, ignored); hub filters, search, clear, deep links and arrow keys; article rendering with injected sample data including draft exclusion, bad-slug rejection and HTML escaping of `<script>` in body text; FAQ Enter/Space toggling; mobile menu and visible hint on secondary pages.

**Amplify note**
Add a rewrite rule in the Amplify console so unknown paths show the custom page: source `/<*>`, target `/404.html`, type `404 (Rewrite)`.

**Still to confirm before the legal pages are treated as final**
See the handover list in the chat: lawful-basis wording, retention statement, iMeetify's processing location, and whether anything is ever sold through this site.

## 28 October 2026: Key facts, numbers, tracklist, certificates, security headers

**Why:** compared the portfolio against strong published entries for ideas (not code or wording). Gaps found: no at-a-glance facts, no measured numbers, no career timeline, certificates summarised in one line, and no security headers.

**What changed**
- About: a key-facts card (location, years with young people, current role, Gibcom start, studies, MBCS).
- Superpowers: a by-the-numbers strip (20 years, 10 years, 500+ customers, 25+ certificates and courses, 25+ tracks).
- New "The tracklist" section: the career timeline from LinkedIn dates, numbered like an album running order to fit The Unsaid Sound theme.
- Qualifications: an expandable list of 25 certificates and short courses grouped by provider, with dates, taken from LinkedIn.
- `customHttp.yml`: Content-Security-Policy (scripts only from this site; third-party frames limited to the booking, video and podcast providers), HSTS, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options, and a week-long cache for `assets/`.
- Moved the inline case-study script out of `project.html` into `js/project.js` so the CSP can block inline scripts.

**Tested** with the CSP header actually enforced by a local server: 8 routes at 320, 390, 768 and 1280 px, zero CSP violations, zero console errors, zero horizontal overflow; case studies, certificate list and booking embed still work.

**Note for later:** if the contact form uses a Lambda function URL instead of API Gateway, add its domain to `connect-src` in `customHttp.yml`.

## 28 October 2026, afternoon: Day 2, coding agent connected to AWS

- Installed AWS CLI 2.39.0, uv 0.13.6 and Claude Code 2.1.312 on Windows with the official installers.
- Fixed IAM user `gibson-admin`: reset its console password (the Day 1 one was never confirmed) and added MFA.
- `aws login` with profile `gibson-portfolio` as `gibson-admin` (first attempt picked up a root browser session; logged out and redid it).
- Ran the Agent Toolkit for AWS setup: 24 AWS skills, AWS MCP Server added to Claude Code. Fixed the MCP entry to use the profile.
- Added `CLAUDE.md`: project rules first, then the official AWS agent rules between markers.
- Health check `scratch/check-day2.ps1` (read-only): all four MCP servers connected; Claude Code called STS through aws-mcp and reported `user/gibson-admin`.
- Docs: `docs/day2/` report, runbook, evidence index and case study.

## 28 October 2026, evening: The mixing desk is live (creative feature)

- `js/desk.js`: seven channel faders plus a master, built on the Web Audio API. Each fader reveals one strand of my story; with the sound on it fades in that channel's ambient loop (150 ms ramps, a perceptual volume curve, LED meters driven by analysers).
- Sound never autoplays: "Turn the sound on" starts it, and it pauses when the tab is hidden. The stories work with the sound off, by keyboard, and without hover; the seven stories also stay readable as text below the desk.
- Studio channel unlock: push to 100 and hold for two seconds (a glowing ring shows progress; dropping below 100 cancels). It unlocks The Unsaid Sound, with a click-to-load YouTube player for Invincible Battles (the desk ducks while it plays).
- Studio audio: a soft pad generated in the browser stands in until the Invincible Battles master stem is added as `assets/audio/studio.mp3`.
- Presets: "Mix my story" and "All faders down". Reduced-motion respected.
- Tested with the CSP enforced: keyboard, mouse drag, unlock and cancel, audio load (meters lit), YouTube embed, presets; no overflow at 320, 390, 768 and 1280 px; no console errors.
- Content fixes: the unlock text no longer promises a 30-second excerpt that does not exist yet; Security channel colour made visible on the dark board.

## 28 October 2026, evening: Insights hub redesign

- Five topics now have their own colour, line icon and one-line description (`js/insights.js`): AI & Automation, Digital Marketing, Cybersecurity, SEND & Inclusive Education (spelled out as Special Educational Needs and Disabilities), Music & Creativity.
- "Browse by topic" tiles at the top of the hub, showing article counts or "First article coming soon"; clicking a tile filters the list and shows a category header.
- Honest placeholders: while a topic has nothing published, a dashed "Coming soon" card appears, with no invented titles, dates or reading times.
- Article cards redesigned: category label, tags, whole card clickable; article headers take the category colour.
- Tested with the CSP enforced: tiles, filters, search, empty and no-result states, category URLs; no overflow at 320 and 768 px; article layout previewed with labelled samples in a test browser only (nothing published).

## 28 October 2026, evening: Birmingham news panel (prepared, not yet deployed)

- Decision: show local news as a clearly separate, labelled panel ("Birmingham news, from Birmingham Live"), headlines and links only, never mixed with my own articles.
- `backend/news-lambda/index.mjs`: Node.js 20 Lambda, no dependencies, reads the RSS feed, keeps only title, https link on the publisher's host and date, caches for 15 minutes, serves stale data if the feed fails.
- `js/news.js` + panel slot on the Insights page: hidden until `NEWS_ENDPOINT` is set and the call succeeds; all text escaped.
- Tested locally: sample feed parsing, rejection of `javascript:` and off-site links, HTML stripping, caching; panel success, failure and switched-off states under the CSP.
- To do: confirm the feed URL and the publisher's RSS terms, deploy Lambda + API Gateway (`backend/news-lambda/README.md`), set the endpoint.
- Update: news cards redesigned as a themed grid. Each headline gets a graphic chosen from its wording (Travel, Weather, Sport, Business, Civic, What's on, general) instead of the publisher's photos, which belong to Reach plc or picture agencies and are not licensed for this site. The function now also returns a one-sentence preview from the feed summary, capped at 160 characters. Tested at 1280 and 390 px.

## 28 October 2026, 18:20: Birmingham news panel deployed

- Ran `backend/news-lambda/deploy-news.ps1` as gibson-admin: feed check (25 stories), IAM role `portfolio-news-role` (CloudWatch Logs only), Lambda `portfolio-news` (Node.js 20, arm64, 128 MB, 10 s), HTTP API `portfolio-news-api` with `GET /news`, CORS limited to the Amplify site, throttling 10 burst / 5 per second. Function test and public endpoint test both returned 6 headlines.
- First run failed: PowerShell variable names are case-insensitive, so `$fn` overwrote `$Fn` (the function name). Renamed and re-ran; the script reused the role it had already created.
- Fix after seeing real headlines: serious stories (crime, deaths, accidents, police) now always get the neutral graphic, so a fatal stabbing mentioning "roads" can never be labelled "Travel".
