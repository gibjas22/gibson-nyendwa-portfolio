// hub.js: Insights listing with category filter, search, newest-first order and Load more.
import { CATEGORIES, published, categoryLabel, readingTime, fmtDate, esc } from "./insights.js";

const PAGE = 9;
const all = published();
const grid = document.getElementById("grid"), status = document.getElementById("status");
const filters = document.getElementById("cat-filters"), q = document.getElementById("q"), clear = document.getElementById("clear");
const more = document.getElementById("more"), moreWrap = document.getElementById("more-wrap"), featuredBox = document.getElementById("featured");
let cat = "all", query = "", shown = PAGE;

const cats = [{ id: "all", label: "All insights" }, ...CATEGORIES];
cats.forEach(c => { const b = document.createElement("button"); b.type = "button"; b.className = "filter"; b.dataset.cat = c.id; b.textContent = c.label; b.setAttribute("aria-pressed", "false"); filters.appendChild(b); });

const card = a => `
  <li class="gallery-card insight-card" data-cat="${a.category}">
    ${a.cover ? `<a class="gallery-link" href="article.html?slug=${a.slug}"><img src="../${esc(a.cover)}" alt="${esc(a.coverAlt || "")}" width="1600" height="900" loading="lazy"></a>` : `<a class="gallery-link" href="article.html?slug=${a.slug}"><div class="thumb" aria-hidden="true"><span class="thumb-cat">${esc(categoryLabel(a.category))}</span></div></a>`}
    <a class="gallery-link" href="article.html?slug=${a.slug}"><h3>${esc(a.title)}</h3></a>
    <p>${esc(a.excerpt)}</p>
    <p class="built"><time datetime="${a.published}">${fmtDate(a.published)}</time> · ${readingTime(a)} min read</p>
  </li>`;

const matches = a => (cat === "all" || a.category === cat) && (!query || [a.title, a.excerpt, ...(a.tags || [])].join(" ").toLowerCase().includes(query));

function render() {
  const items = all.filter(matches);
  const slice = items.slice(0, shown);
  filters.querySelectorAll(".filter").forEach(b => { const on = b.dataset.cat === cat; b.setAttribute("aria-pressed", String(on)); b.classList.toggle("on", on); });
  clear.hidden = cat === "all" && !query;
  history.replaceState(null, "", (cat === "all" ? "" : `?category=${cat}`) + (query ? (cat === "all" ? "?" : "&") + `q=${encodeURIComponent(query)}` : "") || location.pathname);
  if (!all.length) {
    grid.innerHTML = `<li class="gallery-empty"><strong>Nothing published yet.</strong> The first articles are being written. In the meantime, the <a href="../index.html#projects">projects</a> and the <a href="../faq.html">FAQ</a> cover most of what people ask.</li>`;
    status.textContent = ""; moreWrap.hidden = true; return;
  }
  if (!items.length) {
    grid.innerHTML = `<li class="gallery-empty">No insights match ${query ? `"${esc(query)}"` : ""}${query && cat !== "all" ? " in " : ""}${cat !== "all" ? esc(categoryLabel(cat)) : ""}. <button type="button" class="text-link" id="reset">Clear filters</button></li>`;
    grid.querySelector("#reset").addEventListener("click", resetAll);
  } else grid.innerHTML = slice.map(card).join("");
  status.textContent = items.length ? `Showing ${slice.length} of ${items.length}${cat !== "all" ? " in " + categoryLabel(cat) : ""}${query ? ` matching "${query}"` : ""}` : "";
  moreWrap.hidden = slice.length >= items.length;
}
function resetAll() { cat = "all"; query = ""; q.value = ""; shown = PAGE; render(); q.focus(); }

filters.addEventListener("click", e => { const b = e.target.closest("[data-cat]"); if (b) { cat = b.dataset.cat; shown = PAGE; render(); } });
filters.addEventListener("keydown", e => { if (!["ArrowRight","ArrowLeft"].includes(e.key)) return; const bs=[...filters.querySelectorAll(".filter")]; const i=bs.indexOf(document.activeElement); if(i<0) return; e.preventDefault(); bs[(i+(e.key==="ArrowRight"?1:bs.length-1))%bs.length].focus(); });
q.addEventListener("input", () => { query = q.value.trim().toLowerCase(); shown = PAGE; render(); });
document.getElementById("search-form").addEventListener("submit", e => e.preventDefault());
clear.addEventListener("click", resetAll);
more.addEventListener("click", () => { shown += PAGE; render(); grid.children[Math.max(0, shown - PAGE)]?.querySelector("a")?.focus(); });

// Featured article: only when one is marked featured and published.
const feat = all.find(a => a.featured);
if (feat) featuredBox.innerHTML = `<section class="featured card" aria-labelledby="feat-h"><p class="case-cat">Featured</p><h2 id="feat-h"><a href="article.html?slug=${feat.slug}">${esc(feat.title)}</a></h2><p>${esc(feat.excerpt)}</p><p class="built"><time datetime="${feat.published}">${fmtDate(feat.published)}</time> · ${readingTime(feat)} min read</p></section>`;

// Initial state from the URL
const params = new URLSearchParams(location.search);
if (cats.some(c => c.id === params.get("category"))) cat = params.get("category");
if (params.get("q")) { query = params.get("q").toLowerCase(); q.value = params.get("q"); }
render();
