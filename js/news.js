// news.js: the "What's On in Birmingham" panel at the top of the Insights page.
// Headlines come from an AWS Lambda behind API Gateway (backend/news-lambda), which reads Birmingham
// Live's public RSS feeds. What's On is the primary section; Latest news is a secondary tab.
// Shown: headline, a one-sentence preview, the date and a link to the publisher. No publisher photos
// are used: each card gets a themed graphic drawn here instead.
// The panel stays hidden until the first request succeeds, so the page works without it.

const NEWS_ENDPOINT = "https://776bh82jm8.execute-api.eu-west-2.amazonaws.com/news";

// Must match SECTIONS in backend/news-lambda/index.mjs. Business is not offered: the source has no
// working business feed at present.
const SECTIONS = [
  { id: "whats-on",   label: "All What's On" },
  { id: "food-drink", label: "Food & drink" },
  { id: "family",     label: "Family & kids" },
  { id: "music",      label: "Music & nightlife" },
  { id: "news",       label: "Latest news" }
];
const DEFAULT_SECTION = "whats-on";

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
  { id: "music", label: "Live music", colour: "#FF4D6D", re: /\b(gig|gigs|concert|concerts|tour|band|singer|dj|festival|music|album|o2 academy|utilita|symphony hall|bp pulse|resorts world arena|nightlife|club|clubs)\b/i,
    icon: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>' },
  { id: "stage", label: "Theatre & stage", colour: "#C9A7FF", re: /\b(theatre|theater|panto|pantomime|musical|hippodrome|rep|play|stage|comedy|comedian|ballet|opera|show|shows)\b/i,
    icon: '<path d="M4 4h16v6a8 8 0 0 1-16 0z"/><path d="M9 9h.01M15 9h.01M9 13a4 4 0 0 0 6 0"/>' },
  { id: "food", label: "Food & drink", colour: "#F2C14E", re: /\b(restaurant|restaurants|food|foodie|menu|chef|cafe|cafÃ©|bar|bars|pub|pubs|brunch|dinner|lunch|breakfast|curry|pizza|burger|bakery|takeaway|drink|drinks|cocktail|beer|wine|dining|eat|eats)\b/i,
    icon: '<path d="M7 3v8a2 2 0 0 0 4 0V3M9 11v10M17 3c-2 0-3 2-3 5s1 4 3 4v9"/>' },
  { id: "family", label: "Family day out", colour: "#6BDB8C", re: /\b(family|families|kids|children|child|half term|half-term|school holidays|zoo|farm|park|playground|trail|santa|grotto|soft play|sea life|cadbury world)\b/i,
    icon: '<circle cx="8" cy="6" r="2.5"/><circle cx="16.5" cy="8" r="2"/><path d="M4 21v-6a4 4 0 0 1 8 0v6M13.5 21v-4.5a3 3 0 0 1 6 0V21"/>' },
  { id: "arts", label: "Arts & culture", colour: "#5CC4F2", re: /\b(museum|gallery|exhibition|art|arts|artist|culture|cultural|ikon|library|heritage|history|film|cinema|book|books|photography)\b/i,
    icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 16l5-5 4 4 3-3 6 6"/><circle cx="15.5" cy="8.5" r="1.5"/>' },
  { id: "events", label: "Events", colour: "#FF8F6B", re: /\b(event|events|market|markets|christmas|halloween|bonfire|fireworks|diwali|eid|vaisakhi|pride|parade|celebration|fair|carnival|light|lights|free|tickets)\b/i,
    icon: '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>' },
  { id: "sport", label: "Sport", colour: "#6BDB8C", re: /\b(villa|blues|birmingham city|albion|baggies|wolves|football|match|cricket|edgbaston|boxing|athletics|sport|sports|derby)\b/i,
    icon: '<circle cx="12" cy="12" r="8"/><path d="M12 7l3 2-1 4h-4l-1-4z"/><path d="M12 4v3M19 10l-4-1M17 18l-3-5M7 18l3-5M5 10l4-1"/>' },
  { id: "transport", label: "Travel", colour: "#9AD0FF", re: /\b(bus|buses|train|rail|railway|station|road|roads|traffic|tram|metro|airport|motorway|parking)\b/i,
    icon: '<rect x="4" y="5" width="16" height="11" rx="2"/><path d="M4 11h16M8 16v2M16 16v2"/><circle cx="8" cy="13.5" r=".6"/><circle cx="16" cy="13.5" r=".6"/>' },
  { id: "business", label: "Business", colour: "#F2C14E", re: /\b(business|businesses|jobs|shop|shops|store|stores|opening|opens|closing|closes|retail|company|firm|investment)\b/i,
    icon: '<path d="M4 9h16l-1.5-4h-13z"/><path d="M5 9v10h14V9"/><path d="M10 19v-5h4v5"/>' },
  { id: "council", label: "Civic", colour: "#C9A7FF", re: /\b(council|councillor|mayor|mp|government|election|budget|housing|tax|bins|school|schools|nhs|hospital)\b/i,
    icon: '<path d="M3 21h18M5 21V10M19 21V10M9 21V10M15 21V10M2 10l10-6 10 6z"/>' }
];
const DEFAULT_THEME = { id: "news", label: "Birmingham", colour: "#D82BEB",
  icon: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h6M7 12h10M7 15h10"/><rect x="15" y="8" width="3" height="2"/>' };
// Serious stories (crime, deaths, accidents, emergencies) always get the neutral graphic, never a
// playful theme, whatever other words the headline contains.
const SERIOUS = /\b(stab|stabbed|stabbing|murder|murdered|killed|kill|dead|death|died|dies|die|fatal|shooting|shot|attack|attacked|assault|rape|crash|collision|police|arrest|arrested|charged|court|jailed|sentenced|missing|fire|blaze|tragedy|tributes|victim|injured|hospitalised|chase|emergency)\b/i;
const themeFor = title => SERIOUS.test(title) ? DEFAULT_THEME : (THEMES.find(t => t.re.test(title)) || DEFAULT_THEME);
const svg = path => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

let current = DEFAULT_SECTION, source = "Birmingham Live", built = false;
const cache = new Map();

function load(id) {
  if (cache.has(id)) return Promise.resolve(cache.get(id));
  const ctrl = new AbortController(); setTimeout(() => ctrl.abort(), 8000);
  const url = id === DEFAULT_SECTION ? NEWS_ENDPOINT : `${NEWS_ENDPOINT}?section=${encodeURIComponent(id)}`;
  return fetch(url, { signal: ctrl.signal })
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(data => { cache.set(id, data); return data; });
}

const sectionLabel = id => (SECTIONS.find(s => s.id === id) || {}).label || "this section";

function cards(data) {
  const items = (data.items || []).filter(i => /^https:\/\//.test(i.link)).slice(0, 9);
  if (!items.length) {
    return `<p class="news-empty">No ${esc(id2noun(data.section))} stories from ${esc(source)} right now. Try another tab, or check back later: the feed refreshes every 15 minutes.</p>`;
  }
  return `<ul class="news-grid">
    ${items.map(i => {
      const t = themeFor(i.title);
      return `<li class="news-card" style="--c:${t.colour}">
        <div class="news-art" aria-hidden="true">${svg(t.icon)}<span class="news-theme">${esc(t.label)}</span></div>
        <div class="news-body">
          <h3><a href="${esc(i.link)}" target="_blank" rel="noopener noreferrer">${esc(i.title)}<span class="visually-hidden"> (opens ${esc(source)} in a new tab)</span></a></h3>
          ${i.summary ? `<p class="news-summary">${esc(i.summary)}</p>` : ""}
          <p class="news-meta">${i.published ? `<time datetime="${esc(i.published)}">${when(i.published)}</time> Â· ` : ""}Read on ${esc(source)}</p>
        </div>
      </li>`;
    }).join("")}
  </ul>
  ${data.stale ? `<p class="news-note">Showing the most recent headlines available; the feed did not respond just now.</p>` : ""}`;
}
const id2noun = id => id === "news" ? "news" : id === DEFAULT_SECTION ? "What's On" : sectionLabel(id).toLowerCase();

function build() {
  box.innerHTML = `
    <div class="news-head">
      <p class="news-kicker">Live from Birmingham</p>
      <h2 id="news-h">What's On in Birmingham</h2>
      <p class="news-source">Gigs, theatre, food, family days out and community events, with the latest headlines from <strong>${esc(source)}</strong>. Selected automatically from their public feeds, not written by me; each story opens on their site. Graphics are mine, not the publisher's photos.</p>
    </div>
    <div class="filters news-tabs" role="group" aria-label="Choose a section">
      ${SECTIONS.map(s => `<button type="button" class="filter" data-section="${s.id}" aria-pressed="false">${esc(s.label)}</button>`).join("")}
    </div>
    <p class="filter-status" id="news-status" role="status" aria-live="polite"></p>
    <div id="news-items"></div>`;
  box.querySelector(".news-tabs").addEventListener("click", e => { const b = e.target.closest("[data-section]"); if (b) show(b.dataset.section); });
  built = true;
}

function setTabs(id) {
  box.querySelectorAll("[data-section]").forEach(b => { const on = b.dataset.section === id; b.setAttribute("aria-pressed", String(on)); b.classList.toggle("on", on); });
}

function show(id) {
  current = id; setTabs(id);
  const status = box.querySelector("#news-status"), list = box.querySelector("#news-items");
  status.textContent = `Loading ${sectionLabel(id)}...`;
  list.setAttribute("aria-busy", "true");
  load(id)
    .then(data => {
      if (current !== id) return;
      list.innerHTML = cards(data);
      const n = list.querySelectorAll(".news-card").length;
      status.textContent = n ? `${sectionLabel(id)}: ${n} stor${n === 1 ? "y" : "ies"}` : `${sectionLabel(id)}: nothing right now`;
    })
    .catch(() => {
      if (current !== id) return;
      list.innerHTML = `<p class="news-empty">${esc(sectionLabel(id))} could not be loaded just now. Try again in a moment, or visit ${esc(source)} directly.</p>`;
      status.textContent = `${sectionLabel(id)} unavailable`;
    })
    .finally(() => list.removeAttribute("aria-busy"));
}

if (box && NEWS_ENDPOINT) {
  // Only reveal the panel once the primary section has loaded.
  load(DEFAULT_SECTION)
    .then(data => {
      source = data.source || source;
      build(); box.hidden = false; show(DEFAULT_SECTION);
    })
    .catch(() => { /* leave the panel hidden: the page works without it */ });
}
