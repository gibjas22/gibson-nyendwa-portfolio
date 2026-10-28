// project.js: renders one case study from projects.js (moved out of project.html so a strict CSP can block inline scripts).
import { byId, projects, categoryLabel } from "./projects.js";
const id = new URLSearchParams(location.search).get("id");
const p = byId(id);
const body = document.getElementById("case-body");
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
if (!p) {
  document.title = "Project not found";
  body.innerHTML = `<h1>That project is not here</h1><p>It may have moved. <a href="index.html#projects">See all projects</a>.</p>`;
} else {
  document.title = `${p.title}, a case study`;
  document.querySelector('meta[name="description"]').content = p.summary;
  const link = document.createElement("link"); link.rel = "canonical"; link.href = `https://main.dbthjbi29n1oo.amplifyapp.com/project.html?id=${p.id}`; document.head.appendChild(link);
  const related = p.related.map(byId).filter(Boolean);
  const sec = (h, inner) => inner ? `<section class="case-section"><h2>${h}</h2>${inner}</section>` : "";
  body.innerHTML = `
    <header class="case-head" style="--c:${p.colour}">
      <p class="case-cat">${esc(categoryLabel(p.category))} · ${esc(p.year)}</p>
      <h1>${esc(p.title)}</h1>
      <p class="lede">${esc(p.summary)}</p>
      <p class="case-actions">
        ${p.live ? `<a class="button" href="${p.live}" target="_blank" rel="noopener">${p.live.includes("github.com") ? "View the repository" : "Visit the live project"}</a>` : ""}
        <a class="button button-quiet" href="index.html#contact">Talk to me about this</a>
      </p>
    </header>
    ${sec("Overview", `<p>${esc(p.overview)}</p>`)}
    ${sec("The problem", `<p>${esc(p.problem)}</p>`)}
    ${sec("My role", `<p>${esc(p.role)}</p>`)}
    ${sec("Approach", p.approach.length ? `<ul class="case-list">${p.approach.map(a=>`<li>${esc(a)}</li>`).join("")}</ul>` : "")}
    ${sec("Tools", p.tools.length ? `<ul class="social">${p.tools.map(t=>`<li><span class="tag">${esc(t)}</span></li>`).join("")}</ul>` : "")}
    ${sec("Outcomes", p.outcomes.length ? `<ul class="case-list">${p.outcomes.map(o=>`<li>${esc(o)}</li>`).join("")}</ul>` : "")}
    ${sec("What I learned", `<p>${esc(p.lessons)}</p>`)}
    ${related.length ? sec("Related projects", `<ul class="related">${related.map(r=>`<li style="--c:${r.colour}"><a href="project.html?id=${r.id}">${esc(r.title)}</a><span class="muted"> ${esc(categoryLabel(r.category))}</span></li>`).join("")}</ul>`) : ""}
    <p class="crumbs"><a href="index.html#projects">All projects</a></p>`;
}
// mobile menu on this page
const nav = document.getElementById("site-nav"), toggle = document.querySelector(".menu-toggle");
toggle.addEventListener("click", () => { const open = !nav.classList.contains("open"); nav.classList.toggle("open", open); toggle.setAttribute("aria-expanded", String(open)); toggle.querySelector(".menu-label").textContent = open ? "Close" : "Menu"; });
