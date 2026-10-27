
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
