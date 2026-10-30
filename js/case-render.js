// case-render.js: builds the case-study article for one project from projects.js.
// Used by scripts/build-projects.mjs to write projects/<id>.html, so each case study arrives as finished
// HTML (readable without JavaScript, and by search engines and link previews). Paths in the output are
// from the site root; the build script adjusts them for the projects/ folder.

import { byId, categoryLabel, logoHTML } from "./projects.js";

export const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export function caseHTML(p) {
  const related = (p.related || []).map(byId).filter(Boolean);
  const sec = (h, inner) => inner ? `<section class="case-section"><h2>${h}</h2>${inner}</section>` : "";
  const list = items => items.length ? `<ul class="case-list">${items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>` : "";
  const shots = (p.shots || []).map(s => `
      <figure class="case-shot">
        <img src="${s.src}" width="${s.width}" height="${s.height}" alt="${esc(s.alt)}" loading="lazy" decoding="async">
        <figcaption>${esc(s.caption)}</figcaption>
      </figure>`).join("");
  const outcomes = p.outcomes.length ? list(p.outcomes) : (p.measure ? `<p>${esc(p.measure)}</p>` : "");
  const liveLabel = p.live ? (p.live.includes("github.com") ? "View the repository" : "Visit the live project") : "";
  return `
    <header class="case-head${p.logo ? " has-logo" : ""}" style="--c:${p.colour}">
      ${p.logo ? logoHTML(p, { cls: "case-logo" }) : ""}
      <div class="case-head-text">
      <p class="case-cat">${esc(categoryLabel(p.category))} · ${esc(p.year)}</p>
      <h1>${esc(p.title)}</h1>
      <p class="lede">${esc(p.summary)}</p>
      <dl class="case-facts">
        ${p.status ? `<div><dt>Status</dt><dd>${esc(p.status)}</dd></div>` : ""}
        <div><dt>My role</dt><dd>${esc(p.role)}</dd></div>
      </dl>
      <p class="case-actions">
        ${p.live ? `<a class="button" href="${p.live}" target="_blank" rel="noopener">${liveLabel}</a>` : ""}
        <a class="button button-quiet" href="index.html#contact">Talk to me about this</a>
      </p>
      </div>
    </header>
    ${sec("Overview", `<p>${esc(p.overview)}</p>`)}
    ${sec("The problem", `<p>${esc(p.problem)}</p>`)}
    ${sec("Approach", list(p.approach))}
    ${shots ? `<section class="case-section case-shots"><h2>What it looks like</h2>${shots}</section>` : ""}
    ${sec("Tools", p.tools.length ? `<ul class="social">${p.tools.map(t => `<li><span class="tag">${esc(t)}</span></li>`).join("")}</ul>` : "")}
    ${sec(p.outcomes.length ? "Outcomes" : "Outcomes and next measurement", outcomes)}
    ${sec("What I learned", `<p>${esc(p.lessons)}</p>`)}
    ${related.length ? sec("Related projects", `<ul class="related">${related.map(r => `<li style="--c:${r.colour}"><a href="projects/${r.id}.html">${esc(r.title)}</a><span class="muted"> ${esc(categoryLabel(r.category))}</span></li>`).join("")}</ul>`) : ""}
    <section class="case-section case-cta">
      <h2>Working on something similar?</h2>
      <p class="case-actions"><a class="button" href="mailto:info@gcmarketingsupport.co?subject=${encodeURIComponent("About " + p.title)}">Send an email</a>
      <a class="button button-quiet" href="https://cal.imeetify.com/gibsonnyendwa/eventbooking" target="_blank" rel="noopener">Book a 30-minute call</a></p>
    </section>
    <p class="crumbs"><a href="index.html#projects">All projects</a></p>`;
}
