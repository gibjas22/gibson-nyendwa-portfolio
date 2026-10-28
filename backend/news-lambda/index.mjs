// news-lambda: fetches a public RSS feed (Birmingham Live by default) and returns the latest
// headlines as JSON for the "Birmingham news" panel on the Insights page.
// Headlines, links, dates and a one-sentence preview only (capped at 160 characters).
// No images and no article text beyond that preview are copied.
// Runtime: Node.js 20 (built-in fetch, no dependencies). Region: eu-west-2.
// Environment variables:
//   FEED_URL     the RSS feed to read
//   SOURCE_NAME  shown on the site as the attribution, e.g. "Birmingham Live"
//   LINK_HOST    only links on this host are passed through, e.g. "www.birminghammail.co.uk"
//   MAX_ITEMS    how many headlines to return (default 6)

const FEED_URL = process.env.FEED_URL;
const SOURCE = process.env.SOURCE_NAME || "Birmingham Live";
const LINK_HOST = process.env.LINK_HOST || "";
const MAX = Math.min(parseInt(process.env.MAX_ITEMS || "6", 10) || 6, 12);
const TTL_MS = 15 * 60 * 1000;   // reuse a fetched feed for 15 minutes

let cache = { at: 0, body: null };

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

function parse(xml) {
  const items = [];
  for (const m of xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)) {
    const it = m[0];
    const title = tag(it, "title").slice(0, 200);
    const link = tag(it, "link");
    const date = new Date(tag(it, "pubDate"));
    let url;
    try { url = new URL(link); } catch { continue; }
    if (url.protocol !== "https:" || (LINK_HOST && url.hostname !== LINK_HOST) || !title) continue;
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

export const handler = async () => {
  if (!FEED_URL) return respond(500, { error: "FEED_URL not configured" }, 60);
  if (cache.body && Date.now() - cache.at < TTL_MS) return respond(200, cache.body);
  try {
    const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(FEED_URL, { signal: ctrl.signal, headers: { "user-agent": "GibsonNyendwaPortfolio/1.0 (+https://main.dbthjbi29n1oo.amplifyapp.com)" } });
    clearTimeout(timer);
    if (!res.ok) throw new Error("feed status " + res.status);
    const items = parse(await res.text());
    cache = { at: Date.now(), body: { source: SOURCE, fetched: new Date().toISOString(), items } };
    return respond(200, cache.body);
  } catch (err) {
    console.error("news fetch failed:", err.message);
    if (cache.body) return respond(200, { ...cache.body, stale: true }, 120);
    return respond(502, { error: "Feed unavailable" }, 60);
  }
};
