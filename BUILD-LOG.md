
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
