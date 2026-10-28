// news.js: the "Birmingham news" panel on the Insights page.
// Headlines come from an AWS Lambda behind API Gateway (backend/news-lambda), which reads the
// publisher's public RSS feed. Shown: headline, a one-sentence preview, the date and a link to the
// publisher. No publisher photos are used: each card gets a themed graphic drawn here instead.
// The panel stays hidden until NEWS_ENDPOINT is set and the request succeeds.

const NEWS_ENDPOINT = "https://776bh82jm8.execute-api.eu-west-2.amazonaws.com/news";   // e.g. "https://abc123.execute-api.eu-west-2.amazonaws.com/news"

const box = document.getElementById("news");
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const when = iso => {
  if (!iso) return "";
  const d = new Date(iso), mins = Math.round((Date.now() - d) / 60000);
  if (mins < 60) return `${Math.max(1, mins)} min ago`;
  if (mins < 1440) return `${Math.round(mins / 60)} h ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

// Themed graphics, chosen from words in the headline. Order matters: first match wins.
const THEMES = [
  { id: "transport", label: "Travel", colour: "#5CC4F2", re: /\b(bus|buses|train|rail|railway|station|road|roads|m5|m6|m42|a38|traffic|tram|metro|airport|motorway|cycle|parking)\b/i,
    icon: '<rect x="4" y="5" width="16" height="11" rx="2"/><path d="M4 11h16M8 16v2M16 16v2"/><circle cx="8" cy="13.5" r=".6"/><circle cx="16" cy="13.5" r=".6"/>' },
  { id: "weather", label: "Weather", colour: "#9AD0FF", re: /\b(weather|rain|snow|storm|wind|heatwave|sun|sunny|fog|flood|flooding|met office|ice|frost)\b/i,
    icon: '<path d="M7 17a4 4 0 0 1 .5-8A5 5 0 0 1 17 9.5 3.5 3.5 0 0 1 17 17z"/><path d="M9 20l-1 2M13 20l-1 2M17 20l-1 2"/>' },
  { id: "sport", label: "Sport", colour: "#6BDB8C", re: /\b(villa|blues|birmingham city|albion|baggies|wolves|football|match|goal|cricket|edgbaston|boxing|athletics|commonwealth|sport|sports|derby)\b/i,
    icon: '<circle cx="12" cy="12" r="8"/><path d="M12 7l3 2-1 4h-4l-1-4z"/><path d="M12 4v3M19 10l-4-1M17 18l-3-5M7 18l3-5M5 10l4-1"/>' },
  { id: "business", label: "Business", colour: "#F2C14E", re: /\b(business|businesses|jobs|job|shop|shops|store|stores|restaurant|restaurants|bar|pub|cafe|opening|opens|closing|closes|retail|company|firm|investment|Â£\d)/i,
    icon: '<path d="M4 9h16l-1.5-4h-13z"/><path d="M5 9v10h14V9"/><path d="M10 19v-5h4v5"/>' },
  { id: "council", label: "Civic", colour: "#C9A7FF", re: /\b(council|councillor|mayor|mp|government|election|vote|budget|policy|plan|plans|housing|tax|bins|bin|school|schools|nhs|hospital)\b/i,
    icon: '<path d="M3 21h18M5 21V10M19 21V10M9 21V10M15 21V10M2 10l10-6 10 6z"/>' },
  { id: "events", label: "What's on", colour: "#FF8F6B", re: /\b(festival|event|events|market|show|concert|gig|christmas|halloween|bonfire|fireworks|theatre|museum|exhibition|quarter|food|music)\b/i,
    icon: '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>' }
];
const DEFAULT_THEME = { id: "news", label: "Birmingham", colour: "#D82BEB",
  icon: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h6M7 12h10M7 15h10"/><rect x="15" y="8" width="3" height="2"/>' };
const themeFor = title => THEMES.find(t => t.re.test(title)) || DEFAULT_THEME;
const svg = path => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

function render(data) {
  const source = data.source || "Birmingham Live";
  const items = (data.items || []).filter(i => /^https:\/\//.test(i.link)).slice(0, 6);
  if (!items.length) return;
  box.innerHTML = `
    <div class="news-head">
      <h2 id="news-h">Birmingham news</h2>
      <p class="news-source">Latest headlines from <strong>${esc(source)}</strong>, selected automatically from their public feed, not written by me. Each story opens on their site. Graphics are mine, not the publisher's photos.</p>
    </div>
    <ul class="news-grid">
      ${items.map(i => {
        const t = themeFor(i.title);
        return `<li class="news-card" style="--c:${t.colour}">
          <div class="news-art" aria-hidden="true">${svg(t.icon)}<span class="news-theme">${esc(t.label)}</span></div>
          <div class="news-body">
            <h3><a href="${esc(i.link)}" target="_blank" rel="noopener noreferrer">${esc(i.title)}</a></h3>
            ${i.summary ? `<p class="news-summary">${esc(i.summary)}</p>` : ""}
            <p class="news-meta">${i.published ? `<time datetime="${esc(i.published)}">${when(i.published)}</time> Â· ` : ""}Read on ${esc(source)}</p>
          </div>
        </li>`;
      }).join("")}
    </ul>
    ${data.stale ? `<p class="news-note">Showing the most recent headlines available; the feed did not respond just now.</p>` : ""}`;
  box.hidden = false;
}

if (box && NEWS_ENDPOINT) {
  const ctrl = new AbortController(); setTimeout(() => ctrl.abort(), 8000);
  fetch(NEWS_ENDPOINT, { signal: ctrl.signal })
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(render)
    .catch(() => { /* leave the panel hidden: the page works without it */ });
}
