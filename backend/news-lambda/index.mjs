// news-lambda: reads Birmingham Live's public RSS feeds and returns the latest headlines as JSON
// for the "What's On in Birmingham" panel on the Insights page.
// Headlines, links, dates and a one-sentence preview only (capped at 160 characters).
// No images and no article text beyond that preview are copied.
// Runtime: Node.js 20 (built-in fetch, no dependencies). Region: eu-west-2.
//
// GET /news                    -> What's On (the default, primary section)
// GET /news?section=<id>       -> one of the sections below; anything else is rejected
//
// The section list is fixed in code on purpose: the function can only ever fetch these addresses.
// Business is not listed because Birmingham Live's business RSS feed was empty or missing when checked
// (28 October 2026); add it here if a working feed appears.
//
// Environment variables:
//   FEED_BASE    the publisher's site, default "https://www.birminghammail.co.uk"
//   SOURCE_NAME  attribution shown on the site, default "Birmingham Live"
//   MAX_ITEMS    headlines per section (default 9, maximum 12)

const BASE = (process.env.FEED_BASE || "https://www.birminghammail.co.uk").replace(/\/$/, "");
const HOST = new URL(BASE).hostname;
const SOURCE = process.env.SOURCE_NAME || "Birmingham Live";
const MAX = Math.min(parseInt(process.env.MAX_ITEMS || "9", 10) || 9, 12);
const TTL_MS = 15 * 60 * 1000;   // reuse a fetched feed for 15 minutes

// id -> feed path, plus the link path a story must sit under to count for that section.
export const SECTIONS = {
  "whats-on":   { label: "What's On",         feed: "/whats-on/?service=rss",                   under: "/whats-on/" },
  "food-drink": { label: "Food & drink",      feed: "/whats-on/food-drink-news/?service=rss",   under: "/whats-on/" },
  "family":     { label: "Family & kids",     feed: "/whats-on/family-kids-news/?service=rss",  under: "/whats-on/" },
  "music":      { label: "Music & nightlife", feed: "/whats-on/music-nightlife-news/?service=rss", under: "/whats-on/" },
  "news":       { label: "Latest news",       feed: "/news/?service=rss",                       under: "/" }
};
const DEFAULT_SECTION = "whats-on";

const cache = new Map();   // section id -> { at, body }

const decode = s => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/<[^>]+>/g, "")
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
  .replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
  .replace(/\s+/g, " ").trim();
// First sentence of the feed's own summary, never more than 160 characters.
const preview = text => {
  if (!text) return "";
  const first = (text.match(/^.{20,}?[.!?](?=\s|$)/) || [text])[0];
  return first.length <= 160 ? first : first.slice(0, 157).replace(/\s+\S*$/, "") + "...";
};
const tag = (xml, name) => { const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i")); return m ? decode(m[1]) : ""; };

export function parse(xml, under = "/") {
  const items = [];
  for (const m of xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)) {
    const it = m[0];
    const title = tag(it, "title").slice(0, 200);
    const link = tag(it, "link");
    const date = new Date(tag(it, "pubDate"));
    let url;
    try { url = new URL(link); } catch { continue; }
    if (url.protocol !== "https:" || url.hostname !== HOST || !url.pathname.startsWith(under) || !title) continue;
    items.push({ title, summary: preview(tag(it, "description")), link: url.href, published: isNaN(date) ? null : date.toISOString() });
    if (items.length >= MAX) break;
  }
  return items;
}

const respond = (status, body, maxAge = 900) => ({
  statusCode: status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": `public, max-age=${maxAge}` },
  body: JSON.stringify(body)
});

export const handler = async (event = {}) => {
  const id = (event.queryStringParameters && event.queryStringParameters.section) || DEFAULT_SECTION;
  const sec = Object.hasOwn(SECTIONS, id) ? SECTIONS[id] : null;
  if (!sec) return respond(400, { error: "Unknown section", sections: Object.keys(SECTIONS) }, 300);

  const hit = cache.get(id);
  if (hit && Date.now() - hit.at < TTL_MS) return respond(200, hit.body);
  try {
    const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(BASE + sec.feed, { signal: ctrl.signal, headers: { "user-agent": "GibsonNyendwaPortfolio/1.0 (+https://main.dbthjbi29n1oo.amplifyapp.com)" } });
    clearTimeout(timer);
    if (!res.ok) throw new Error("feed status " + res.status);
    const items = parse(await res.text(), sec.under);
    const body = { source: SOURCE, section: id, label: sec.label, fetched: new Date().toISOString(), items };
    cache.set(id, { at: Date.now(), body });
    return respond(200, body);
  } catch (err) {
    console.error(`news fetch failed (${id}):`, err.message);
    if (hit) return respond(200, { ...hit.body, stale: true }, 120);
    return respond(502, { error: "Feed unavailable", section: id }, 60);
  }
};
