// gallery.js: renders the filterable project grid from projects.js.
// The static list in the HTML stays as the no-JavaScript fallback; this replaces it when it runs.
// Filter state lives in the URL hash (#projects?filter=ai) so a filtered view can be shared.

import { projects, CATEGORIES, categoryLabel } from "./projects.js";

const section = document.getElementById("projects");
const list = section?.querySelector(".projects");
if (section && list) {
  const used = new Set(projects.map(p => p.category));
  const cats = CATEGORIES.filter(c => c.id === "all" || used.has(c.id));

  // Filter bar
  const bar = document.createElement("div");
  bar.className = "filters"; bar.setAttribute("role", "group"); bar.setAttribute("aria-label", "Filter projects by category");
  cats.forEach(c => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "filter"; b.dataset.filter = c.id; b.textContent = c.label;
    b.setAttribute("aria-pressed", "false");
    bar.appendChild(b);
  });
  const status = document.createElement("p"); status.className = "filter-status"; status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite");
  list.before(bar, status);
  list.classList.add("gallery");

  const tile = p => `
    <li class="gallery-card" style="--c:${p.colour}">
      <a class="gallery-link" href="project.html?id=${p.id}">
        <div class="thumb" aria-hidden="true"><span class="thumb-mark">${p.title.split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase()}</span><span class="thumb-cat">${categoryLabel(p.category)}</span></div>
        <h3>${p.title}</h3>
      </a>
      <p>${p.summary}</p>
      <p class="built">My role: ${p.role}</p>
      <p class="card-actions">
        <a class="text-link" href="project.html?id=${p.id}">Case study</a>
        ${p.live ? `<a class="text-link" href="${p.live}" target="_blank" rel="noopener">Visit${p.live.includes("github.com") ? " the repository" : ""}</a>` : ""}
      </p>
    </li>`;

  const render = filter => {
    const items = projects.filter(p => filter === "all" || p.category === filter);
    list.innerHTML = items.length ? items.map(tile).join("") : `<li class="gallery-empty">No projects in ${categoryLabel(filter)} yet. <button type="button" class="text-link" data-filter="all">Show all projects</button></li>`;
    bar.querySelectorAll(".filter").forEach(b => { const on = b.dataset.filter === filter; b.setAttribute("aria-pressed", String(on)); b.classList.toggle("on", on); });
    status.textContent = filter === "all" ? `Showing all ${items.length} projects` : `Showing ${items.length} in ${categoryLabel(filter)}`;
  };

  const fromHash = () => { const m = location.hash.match(/filter=([a-z]+)/); return m && cats.some(c => c.id === m[1]) ? m[1] : "all"; };
  const setFilter = (f, push = true) => {
    render(f);
    if (push) history.replaceState(null, "", f === "all" ? "#projects" : `#projects?filter=${f}`);
  };

  bar.addEventListener("click", e => { const b = e.target.closest("[data-filter]"); if (b) setFilter(b.dataset.filter); });
  list.addEventListener("click", e => { const b = e.target.closest("button[data-filter]"); if (b) setFilter(b.dataset.filter); });
  // Arrow keys move between filters, like a toolbar.
  bar.addEventListener("keydown", e => {
    if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
    const bs = [...bar.querySelectorAll(".filter")]; const i = bs.indexOf(document.activeElement); if (i < 0) return;
    e.preventDefault(); bs[(i + (e.key === "ArrowRight" ? 1 : bs.length - 1)) % bs.length].focus();
  });
  window.addEventListener("hashchange", () => setFilter(fromHash(), false));
  setFilter(fromHash(), false);
  if (location.hash.startsWith("#projects?")) {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => section.scrollIntoView({ behavior: reduce ? "instant" : "smooth", block: "start" }));
  }
}
