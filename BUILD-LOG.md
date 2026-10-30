
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

## 28 October 2026, evening: What's On becomes the primary feed; article draft; AWS write-up; Studio prep
- Insights: the news panel is now **What's On in Birmingham**, moved to the top of the page. Tabs: All What's On (default), Food & drink, Family & kids, Music & nightlife, Latest news. Business is not offered: Birmingham Live's business RSS was empty or missing when checked. New What's On themes (live music, theatre, food, family, arts, events); serious stories still get the neutral graphic. Empty, error and loading states per tab.
- Lambda `portfolio-news`: fixed list of sections (`?section=`), unknown ones rejected, What's On sections only pass links under `/whats-on/`, per-section cache, 9 items. Needs `deploy-news.ps1` re-run to go live.
- New Insights topic: What's On Birmingham (placeholder until the first article is published).
- First article drafted (evergreen, sources checked 28 October 2026): `content/drafts/` (git-ignored) plus a review copy in Claude Docs. Not published.
- `docs/AWS-SERVICES.md`: services by status (verified, pending, planned), with a read-only evidence script `docs/evidence/collect-aws-evidence.ps1`.
- Studio: `scripts/prepare-studio-audio.sh` ready to turn the Invincible Battles master into `studio.mp3` and `invincible-clip.mp3`, keeping the original in `raw-audio/`. Playback, fader and mute path tested with a test tone in the test browser only. The master file itself has not been supplied yet.
- 19:05: deployed and pushed (`2705cd3`). Live check in Chrome: panel at the top, five tabs load, links open Birmingham Live. Found shopping deals and a competition in All What's On, so the Lambda now accepts only event sub-sections and cards take their theme from the publisher's sub-section (e.g. a Diwali story in Family & kids gets the Family graphic). Needs one more deploy-script run.

## 29 October 2026, morning: checks, fixes and evidence
- Live What's On check (07:30 UTC): panel first on Insights, all five tabs load, every link is https on www.birminghammail.co.uk with `target="_blank"` and `rel="noopener noreferrer"`, two sample links matched their headlines. Found "Â·" in the card date line.
- Fix: `js/news.js` is now pure ASCII (`&middot;`); `deploy-news.ps1` reads and writes `js/news.js` as UTF-8 and leaves it alone when the endpoint has not changed.
- Security headers verified live; no change needed. Evidence: `docs/evidence/2026-10-29-live-checks.md`.
- Evidence script: CloudWatch section now makes one public test request and finds its REPORT line; Budgets section lists thresholds, alert state and masked recipients; a masked copy is saved to `docs/evidence/` for review.
- Studio: placeholder made explicit with `stemReady: false` (no request for the missing file); status line says Studio is a placeholder; desk goes fully silent while the track video is open; a stem that fails to load is named in the status line.
- Article draft re-checked: Birmingham Museum & Art Gallery gallery list and Opheem's two Michelin stars corrected. Still unpublished.
- Report: `docs/2026-10-29-completion-report.md`.
- 07:56 UTC evidence run (`docs/evidence/aws-evidence-2026-10-29.txt`): Amplify jobs 16 to 20 succeeded; Lambda, role and API configuration read back; CloudWatch logged the test request at 07:57:13 UTC; budget 13 USD monthly with 80% actual and 100% forecast email alerts; no contact Lambda, SES in sandbox. Evidence script fixed (a PowerShell quoting error on line 38) and parse-checked.

## 29 October 2026, morning: SEND Life Transition video podcast section
- Replaced the podcast placeholder ("Podcast player coming soon") with a SEND Life Transition section: circular channel logo, "Video podcast" label, introduction, "Visit the YouTube channel" and "Subscribe on YouTube" links, and two episode cards.
- Episodes checked on YouTube (29 October 2026): "Navigating and Managing Emotional Experience in College" (3cPgHy1TrQ0, 12 January 2026, 12:08, latest, summary from its transcript) and "SEND Life Transition | Official Channel Introduction" (UhY_1r3UIg8, 12 January 2026, 0:08). Both public, embeddable, owned by @SENDLifeTransition, automatic English captions.
- Players are click-to-load from youtube-nocookie.com, no autoplay on page load, one video at a time; starting a podcast video pauses the desk and closes the Studio video, and the other way round.
- Episode data in `js/podcast.js`; VideoObject structured data in `index.html`; navy, electric blue and orange colours scoped to the section; "Podcast" added to the main navigation. Logo credited in `CREDITS.md`.
- The second link's 43-second start time is kept until confirmed.

## 29 October 2026, 09:15: approvals from Gibson (retention, article, 404)
- Article "What's On in Birmingham: A Guide to Discovering Local Events and Experiences" moved from the private draft into `js/insights.js` with `status: "published"`, `published: "2026-10-29"`, featured. Two wording tweaks only ("at the top of my Insights page"). Added to `sitemap.xml`. Draft copy stays in `content/drafts/` (git-ignored).
- `404.html` links made root-relative (`/css/styles.css` etc.) so the page keeps its styling at any missing address, and marked `noindex`.
- Prepared `scripts/aws/apply-approved-changes-2026-10-29.ps1`: sets 30-day retention on `/aws/lambda/portfolio-news` (eu-west-2) only, and points the Amplify catch-all rule at `/404.html` with status 404, keeping a backup of the original rules and printing rollback commands. To be run by Gibson after this commit deploys.

## 29 October 2026, midday: two SEND articles adapted from SEND Life Transition videos
- Videos checked on YouTube: "SEND Life Transition: A Digital Support Initiative for Youth Emotional Wellbeing" (zKX9z3C3F0I, 14 June 2026, 2:08) and "Foundations of Safeguarding & Thresholds of Need" (qxrz39TA9Vs, 29 June 2026, 3:13); both public, embeddable, owned by @SENDLifeTransition, automatic English captions. Full transcripts read.
- Published in `js/insights.js` (category `send`, 29 October 2026): `send-life-transition-digital-wellbeing-support` and `safeguarding-thresholds-of-need-birmingham`. Safeguarding facts checked against Keeping children safe in education 2026 (in force 1 September 2026) and Birmingham Right Help, Right Time Version 7 (June 2026); the video's description of the amber layer is corrected in the text.
- Article pages now support a "Watch the video" section (click-to-load youtube-nocookie player, chapter buttons from verified timestamps, Watch on YouTube link, VideoObject inside the BlogPosting data) and a "Read the article / Watch the video" choice. SEND cards show "Read article" and "Watch video". "Back to <category> insights" link added. Links to this site now open in the same tab.
- New covers in `assets/img/insights/` built from the channel logo. Sitemap updated.
- 12:02 UTC: SEND articles live (`9d4a2b7`), checked in Chrome: both cards in the SEND filter with Read article and Watch video; both pages render with their video; the safeguarding video played from the live page; no console errors.
- 11:59 London: approved AWS changes run. Log retention on `/aws/lambda/portfolio-news` now 30 days (was never expires). Amplify catch-all rule set to `/<*>` -> `/404.html` with status `404`, which turned out to redirect to /404.html with HTTP 200. Script corrected to status `404-200` (serves /404.html in place with HTTP 404, as the original rule did for /index.html); to be re-run.

## 29 October 2026, afternoon: site-wide theme system (Purple, Sky Blue, White)
- One stylesheet, three themes chosen by `<html data-theme>`. Hard-coded colours in `css/styles.css` and `css/desk.css` replaced with semantic tokens (surfaces, text, controls, borders, focus, shadows, glows, inputs, states, category text, desk hardware, decorative waves); Sky Blue and White are token overrides only. Purple values unchanged.
- `js/theme-boot.js` (blocking, in every page head) sets the theme before paint from the saved preference or the fortnightly schedule (anchor 29 October 2026 00:00 Europe/London; Purple, Sky Blue, White; 14 days each). `js/theme.js` adds the Appearance button (header and mobile menu), the Appearance panel and the non-blocking first-visit chooser, syncs tabs and switches at the next boundary.
- One localStorage key, `gn-appearance`. Cookies page, privacy notice and FAQ updated to say so. Cookies table made keyboard-scrollable.
- Tested locally: 64 behaviour checks (schedule boundaries, both clock changes, preferences, storage blocked and corrupted, tabs, timer, no JavaScript, mobile) and axe WCAG 2.1 AA on ten pages in each theme at 1280 and 390 px, no violations. Details in `docs/THEMES.md`.
- 13:20 London: theme system live (code in `ffd6fc7`, which also carries the AWS evidence; `67936fa` updates the evidence file). Checked in Chrome on the live site: first-visit chooser shown with Purple preselected, Sky Blue preview and "Use Sky Blue" saved, Sky Blue carried to the SEND article, White and Automatic applied from the Appearance panel without a reload, status read "Automatic, currently Purple. Changes to Sky Blue on 12 November.", no console errors. Test preference removed afterwards.
- Custom 404 confirmed live: `/no-such-page` returns HTTP 404 with the "Page not found" page (Amplify adds a trailing slash); `/a/b/c` returns 404. The script's own checks show code 0 for these on Windows PowerShell 5, a quirk of how it reads the redirect, not a fault in the rule.

## 29 October 2026, afternoon: mobile and desktop audit fixes
- Header: no longer clips "Hear my story" at 320 px (Menu shows its icon only up to 400 px) and no longer overflows between 901 and 1120 px (navigation collapses into Menu up to 1120 px; the Appearance button shows its swatch only up to 1280 px). The Appearance button is now in each page's HTML, hidden when JavaScript is off, so the header does not shift when scripts run. The mobile menu scrolls when it is taller than the screen (phones in landscape).
- Layout shift: Insights, article and project pages reserve a screen of height and the Insights controls appear once rendered. Lab CLS on desktop fell from 0.84 to 0.02 or less.
- Images: hero photo in WebP at 480, 800 and 1200 px with `srcset`, `fetchpriority="high"`; Insights covers in WebP at 800 and 1600 px. JPGs kept as fallbacks and for social previews.
- Fonts self-hosted (Sora, Source Sans 3; SIL OFL), preloaded, no request to Google. Cookies page and privacy notice updated.
- Touch and reading: larger fader grips on phones, 12 px channel labels, 44 px targets for the wordmark, text links and footer links, `[hidden]` always hides, long headings wrap at 320 px. Insights on phones: compact two-column topic tiles, and the featured card only shows in the all-insights view, so a chosen category's articles appear about 1,400 px sooner.
- Checks: overflow sweep 300 to 1940 px, scans at ten viewports on 19 pages, 58 click-through checks per width (320, 390, 768, 1024, 1280), 64 theme checks, keyboard and reduced-motion pass, axe WCAG 2.1 AA in three themes (no violations), Lighthouse lab runs. Chromium only; Firefox and WebKit were not available.

## 29 October 2026, evening: home page portrait reel
- The hero photo is now a five-slide reel: the original portrait first, then two silent six-second clips and two more photos supplied by Gibson. Accepted as an exception to the no-autoplay rule on these terms: no audio track, a visible Pause button, starts paused for reduced motion and Data Saver, pauses off screen, on hover or focus, in a hidden tab, and when the desk or a podcast video starts. `AUTOPLAY` in `js/hero.js` switches the automatic movement off.
- Nothing else loads with the page: each slide is fetched shortly before it shows, and the opening photo stays 8 seconds. Lab result on a phone: performance 95 to 98, layout shift 0.
- Not used: the photo with Gibson's son (awaiting Gibson's decision), the cherry blossom photo (other people at the edges), the third clip (possible second person in the background) and the later part of the headphones clip (shows a product web page).
- Mobile test of the reel (Chromium phone emulation: iPhone SE, iPhone 13, Pixel 7, Galaxy S9+, iPad Mini, iPhone 13 landscape; 42 checks) found and fixed: Play did nothing after a tap on phones (tapping gave the button focus, which paused the reel), no swipe, photos soft on high-density screens, controls off screen in landscape, and the first-visit chooser covering the whole portrait on phones. Swipe left or right now changes slide; 1080 px photo sizes added; landscape shows a smaller reel; the chooser is shorter on phones.

## 30 October 2026, morning: reel decisions
- Gibson confirmed the reel should move by itself (no change needed) and asked for the photo with his son to be added. It is now slide 4 of 6, shown whole (it is a landscape photo) over a blurred copy of itself; his son is not named on the page.

## 30 October 2026: project logos replace the initials
- Six of the seven project cards and case-study headers now show the project's own logo instead of initials. Birmingham Local Biz Support keeps "BL" until its logo is supplied (the upload set had no matching file).
- Case-study pages: the logo sits beside the title on wide screens and above it on phones; the title stays as real text. Wide wordmarks are up to 340 px wide, square badges up to 170 px, phones 120 px. Width and height attributes reserve the space, so nothing jumps while it loads.
- Hover (mouse only): lifts 3 px, grows to 1.04 and gains a soft glow in the project's colour over 250 ms, with a tilt of at most 3 degrees that follows the pointer and resets when it leaves. Nothing moves on touch screens or with reduced motion. Logos are not links and add no tab stops. On cards the image is decorative (the project name is next to it); on case studies it has alt text such as "AIBOS Command Centre logo".
- If a logo file fails to load, the project name appears in its place and the browser console says which file failed.
- Navy wordmarks (Clara, AIBOS) and the portfolio badge keep their supplied white background, so they read on the dark themes.
- To replace a logo later: put the new file in `assets/img/logos/`, then edit the project's `logo` entry in `js/projects.js` (src, width, height, shape "wide" or "square", plate true if it needs the white backing, alt). Removing the entry brings the initials back.
- Checks: seven pages at 360, 390, 768, 1024, 1440 and 640 px (1280 at 200% zoom) in all three themes, no overflow, overlap, failed requests or console errors; 55 logo checks (alt text, hover, tilt limit, reset, reduced motion, touch, keyboard, fallback, navigation between projects, reload); existing suites 64/64 theme, 58/58 click-through, 20/20 reel, 42/42 mobile; axe on the home page and all seven project pages in three themes at 1440 and 390 px: no new issues (one existing best-practice note on the home page's complementary landmark).

## 30 October 2026, afternoon: all seven logos, transparent
- Birmingham Local Biz Support now has its logo, so no project shows initials. Its black background was made transparent: only the black touching the edges was removed and the pin's soft edge was kept, so no part of the artwork changed.
- Clara, AIBOS, the portfolio badge and The Unsaid Sound now use the transparent versions Gibson supplied instead of the white or purple-square ones. Every logo file is now transparent.
- Clara, AIBOS and The Unsaid Sound have dark lettering, which cannot be read on the Purple and Sky Blue themes. On those two themes they sit on a soft light surface; on the White theme they have no backing at all. Set `plate: false` in `js/projects.js` to remove it.
- New shape "landscape" (The Unsaid Sound) sits between the wide wordmarks and the square badges.
- Checks: seven pages at 360, 390, 768, 1024, 1440 and 640 px in all three themes, no overflow, overlap or errors; 63 logo checks; 64/64 theme, 58/58 click-through; axe on the home page and seven project pages in three themes, no new issues.
- Later: Gibson supplied a white-lettered transparent version of The Unsaid Sound logo. It now shows on the Purple and Sky Blue themes and the purple version on the White theme, switching instantly when the visitor changes theme, so The Unsaid Sound no longer needs a light backing. A logo can have this second version through its `dark` entry in `js/projects.js`. The badge he sent at the same time is identical to the one already in use, so nothing changed there.

## 30 October 2026, evening: website review recommendations, first release
Worked through the "Fix and verify first" list in the 30 October recommendations brief, in order.
1. Contrast: channel colours now come from the --ch-* theme tokens (js/channels.js and the homepage use `var(--ch-*)`), so each theme supplies a version that passes 4.5 to 1 as small text. Purple-theme Machine #B07CFF and Studio #FF4D6D; Sky Blue gets lighter Security, Machine and Studio. Purple primary hover is now #8D24F0 (white text 5.76 to 1; was 3.8). Checked by sampling painted pixels behind every text element on the home page in all three themes, at rest, with all faders up, Studio unlocked and on hover: no failures.
2-3. Contact: two choices, Send an email and Book a 30-minute call. Removed the unfinished welcome video, the invitation to the hidden form and the two-working-day promise (Gibson's decision). The booking card no longer claims "in your time zone" until the scheduler is checked.
4. Appearance: Purple is the default; the first-visit chooser is gone; White, Sky Blue and Automatic are choices in Appearance. Navigation labels are Work, Stories, About, Insights and Contact, and the highlight clears in sections without a nav item instead of leaving the last one marked.
5. Homepage order: introduction, selected work, the desk, about, superpowers, tracklist, podcast, contact. New hero wording (Gibson approved the report's version), Explore my work and Get in touch, and a smaller link to the desk. On phones the introduction comes before a smaller portrait. Qualifications and the full tracklist sit behind labelled expansions. Calmer glow on the dark themes.
   Desk on screens up to 760 px: one row per channel with a horizontal label, a horizontal fader and the value; Master separate; the story opens straight after the row that moved, without moving focus; a short delayed announcement of the story title for screen readers. Desk labels are 16 px. A "Read the seven stories" link sits before the desk. The story-beside-the-desk layout for wide screens was tried and dropped: at 16 px the eight labels did not fit beside it.
6. Selected work: this portfolio, Gibcom and Clara, with genuine screenshots (the desk, and the Gibcom home page captured 30 October 2026) and Clara's logo until approved screenshots exist. Every project has a status from its record; Clara and AIBOS say what will be measured instead of inventing outcomes.
7. Insights: the featured original article first, then Latest articles with one set of filters (only topics that have articles), a single Coming next note, then three What's On headlines with a link to the new insights/whats-on.html.
8. Case studies are generated into projects/<id>.html by `node scripts/build-projects.mjs` (run after editing js/projects.js; the pages are committed, Amplify still has no build step). Each page has its content, title, description, canonical URL and absolute Open Graph image in the HTML. Old project.html?id= links forward. Sitemap updated; the homepage og:image is now absolute.
- Measured (Lighthouse lab, local server, not field data): home mobile 98 performance, LCP 2.1 s, CLS 0.004; home desktop 100; portfolio case study mobile 99. Accessibility, best practices and SEO 100 on both.
- Checks: 45 new checks for these changes, 63 logo checks, 47/47 click-through at 390 (fewer than before because the topic tiles are gone), 20/20 reel, 42/42 mobile, layout scan of 20 pages at ten widths (no overflow, no text under 14 px), axe in three themes on twelve pages (no issues; the About side panel is now a div, which cleared the one remaining best-practice note).
- Still Gibson's: rename the iMeetify event to "Project discovery call with Gibson", show Gibson Nyendwa as host and test a booking across the clock change; confirm Clara's status; approved Clara screenshots; the two new articles (AI build, digital marketing); the five-person phone test.

## 30 October 2026, late afternoon: Day 2 re-checked against the published guide
- AWS published the Day 2 article ("How to connect your coding agent to AWS") after the setup was done on 28 October. Compared it step by step: `docs/day2/AWS_Day2_Guide_Recheck_2026-10-30.md`.
- Re-run today, read-only: signed in as `gibson-admin` (not root) in eu-west-2; `aws agent-toolkit update-skill --all` updated one skill; `aws-mcp` Connected; health check 20 of 20, "ALL CHECKS PASSED" (closes the outstanding Day 2 evidence item).
- The guide's own check prompt, run as `claude -p`, could not call AWS at first because non-interactive mode cannot approve the AWS tools. With `--allowedTools "mcp__aws-mcp"` it passed: MCP connected, signed in as `gibson-admin`, Region eu-west-2, read-only calls only.
- Runbook: skills update command, a list command that does not stop at "-- More --", and the 12-hour sign-in note.
- Guidance level set to high (Gibson's choice, new to AWS), recorded as a project rule in `CLAUDE.md`.
