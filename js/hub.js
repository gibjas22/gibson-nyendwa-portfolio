// hub.js: Insights listing. Featured original article first, then one category filter, search,
// newest-first order and Load more. The Birmingham news panel (news.js) sits below the original work.
// While a category has no published articles, it shows an honest "coming soon" placeholder card:
// no invented titles, dates or reading times.
import { CATEGORIES, ICONS, published, categoryLabel, categoryById, readingTime, fmtDate, esc } from "./insights.js";

const PAGE = 9;
const all = published();
const $ = id => document.getElementById(id);
const grid = $("grid"), status = $("status"), filters = $("cat-filters"), q = $("q"), clear = $("clear");
const more = $("more"), moreWrap = $("more-wrap"), featuredBox = $("featured"), catHead = $("cat-head");
let cat = "all", query = "", shown = PAGE;
const featSlug = (all.find(a => a.featured) || {}).slug;   // shown once, as the featured card, in the all-insights view

const countIn = id => all.filter(a => a.category === id).length;
const icon = (name, cls = "topic-icon") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ""}</svg>`;

// ---------- Filter buttons ----------
// One set of controls: only topics that have published articles get a button. Topics still being
// written are named once, in the "Coming next" note below the list.
const cats = [{ id: "all", label: "All insights" }, ...CATEGORIES.filter(c => countIn(c.id))];
const upcoming = CATEGORIES.filter(c => !countIn(c.id));
const next = $("coming-next");
if (next && upcoming.length) { next.innerHTML = `<strong>Coming next:</strong> ${upcoming.map(c => esc(c.label)).join(", ")}.`; next.hidden = false; }
cats.forEach(c => {
  const b = document.createElement("button");
  b.type = "button"; b.className = "filter"; b.dataset.cat = c.id; b.textContent = c.label; b.setAttribute("aria-pressed", "false");
  filters.appendChild(b);
});

// ---------- Cards ----------
// Responsive cover: WebP sizes when listed in coverWebp, with the JPG as fallback.
const coverPicture = (a, alt, sizes, lazy) => {
  const base = "../" + esc(a.cover), stem = base.replace(/\.jpg$/i, "");
  const img = `<img src="${base}" alt="${esc(alt)}" width="1600" height="900"${lazy ? ' loading="lazy"' : ""} decoding="async">`;
  return a.coverWebp && a.coverWebp.length
    ? `<picture><source type="image/webp" srcset="${a.coverWebp.map(w => `${stem}-${w}.webp ${w}w`).join(", ")}" sizes="${sizes}">${img}</picture>`
    : img;
};

const card = a => {
  const c = categoryById(a.category) || {};
  return `
  <li class="gallery-card insight-card" style="--c:${c.colour || "var(--primary)"}">
    <a class="gallery-link" href="article.html?slug=${a.slug}" tabindex="-1" aria-hidden="true">
      ${a.cover
        ? coverPicture(a, "", "(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) 46vw, 360px", true)
        : `<div class="thumb">${icon(c.icon || "chip", "thumb-icon")}<span class="thumb-cat">${esc(c.label || "")}</span></div>`}
    </a>
    <p class="card-cat">${esc(c.label || "")}</p>
    <h3><a class="card-title" href="article.html?slug=${a.slug}">${esc(a.title)}</a></h3>
    <p>${esc(a.excerpt)}</p>
    ${(a.tags || []).length ? `<p class="card-tags">${a.tags.slice(0, 3).map(t => `<span>${esc(t)}</span>`).join("")}</p>` : ""}
    <p class="built"><time datetime="${a.published}">${fmtDate(a.published)}</time> · ${readingTime(a)} min read${a.video ? " · with video" : ""}</p>
    ${a.video ? `<p class="card-actions"><a href="article.html?slug=${a.slug}">Read article<span class="visually-hidden">: ${esc(a.title)}</span></a><a href="article.html?slug=${a.slug}#watch">Watch video<span class="visually-hidden">: ${esc(a.title)}</span></a></p>` : ""}
  </li>`;
};

const placeholder = c => `
  <li class="gallery-card insight-card placeholder-card" style="--c:${c.colour}">
    <div class="thumb">${icon(c.icon, "thumb-icon")}<span class="thumb-cat">${esc(c.label)}</span><span class="soon-badge">Coming soon</span></div>
    <p class="card-cat">${esc(c.label)}</p>
    <h3>First ${esc(c.label)} article in progress</h3>
    <p>${esc(c.blurb)}</p>
    <p class="skeleton" aria-hidden="true"><span></span><span></span><span></span></p>
  </li>`;

const matches = a => (cat === "all" || a.category === cat) && (!query || [a.title, a.excerpt, ...(a.tags || [])].join(" ").toLowerCase().includes(query));

function render() {
  const items = all.filter(matches).filter(a => !(cat === "all" && !query && a.slug === featSlug));
  const slice = items.slice(0, shown);

  filters.querySelectorAll(".filter").forEach(b => { const on = b.dataset.cat === cat; b.setAttribute("aria-pressed", String(on)); b.classList.toggle("on", on); });
  clear.hidden = cat === "all" && !query;
  featuredBox.hidden = cat !== "all" || !!query;   // the featured card belongs to the all-insights view
  history.replaceState(null, "", (cat === "all" ? "" : `?category=${cat}`) + (query ? (cat === "all" ? "?" : "&") + `q=${encodeURIComponent(query)}` : "") || location.pathname);

  // Category header when one topic is selected
  const c = categoryById(cat);
  catHead.innerHTML = c ? `<div class="cat-head" style="--c:${c.colour}">${icon(c.icon)}<div><h2>${esc(c.label)}</h2>${c.intro ? `<p class="cat-intro">${esc(c.label.split(" ")[0])} stands for ${esc(c.intro)}.</p>` : ""}<p>${esc(c.blurb)}</p></div></div>` : "";

  if (items.length) {
    grid.innerHTML = slice.map(card).join("");
    status.textContent = `Showing ${slice.length} of ${items.length}${c ? " in " + c.label : ""}${query ? ` matching "${query}"` : ""}`;
    moreWrap.hidden = slice.length >= items.length;
    return;
  }

  moreWrap.hidden = true;
  if (query) {
    grid.innerHTML = `<li class="gallery-empty">No insights match "${esc(query)}"${c ? ` in ${esc(c.label)}` : ""}. <button type="button" class="text-link" id="reset">Clear search and filters</button></li>`;
    $("reset").addEventListener("click", resetAll);
    status.textContent = "No matches.";
    return;
  }
  // Nothing published in this view yet: honest placeholders, one per topic in view.
  const inView = c ? [c] : CATEGORIES.filter(x => !countIn(x.id));
  grid.innerHTML = inView.map(placeholder).join("");
  status.textContent = all.length ? `Nothing published in ${c ? c.label : "this view"} yet.` : "No articles published yet. The first pieces are being written.";
}

function setCat(id, scroll) {
  cat = id; shown = PAGE; render();
  if (scroll) $("hub-controls").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}
function resetAll() { cat = "all"; query = ""; q.value = ""; shown = PAGE; render(); q.focus(); }

filters.addEventListener("click", e => { const b = e.target.closest("[data-cat]"); if (b) setCat(b.dataset.cat, false); });
filters.addEventListener("keydown", e => {
  if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
  const bs = [...filters.querySelectorAll(".filter")]; const i = bs.indexOf(document.activeElement); if (i < 0) return;
  e.preventDefault(); bs[(i + (e.key === "ArrowRight" ? 1 : bs.length - 1)) % bs.length].focus();
});
q.addEventListener("input", () => { query = q.value.trim().toLowerCase(); shown = PAGE; render(); });
$("search-form").addEventListener("submit", e => e.preventDefault());
clear.addEventListener("click", resetAll);
more.addEventListener("click", () => { shown += PAGE; render(); grid.children[Math.max(0, shown - PAGE)]?.querySelector("a")?.focus(); });

// Featured article: only when one is marked featured and published.
const feat = all.find(a => a.featured);
if (feat) {
  const fc = categoryById(feat.category) || {};
  featuredBox.innerHTML = `<section class="featured card" style="--c:${fc.colour || "var(--accent)"}" aria-labelledby="feat-h">
    <p class="case-cat">Featured · ${esc(fc.label || "")}</p>
    <h2 id="feat-h"><a href="article.html?slug=${feat.slug}">${esc(feat.title)}</a></h2>
    <p>${esc(feat.excerpt)}</p>
    <p class="built"><time datetime="${feat.published}">${fmtDate(feat.published)}</time> · ${readingTime(feat)} min read</p></section>`;
}

// Initial state from the URL
const params = new URLSearchParams(location.search);
if ([{ id: "all" }, ...CATEGORIES].some(c => c.id === params.get("category"))) cat = params.get("category");
if (params.get("q")) { query = params.get("q").toLowerCase(); q.value = params.get("q"); }
render();
// Everything is rendered: reveal the controls (hidden until now so they do not jump as content arrives).
document.querySelector("main.hub")?.classList.add("is-ready");
