// project.js: old case-study links (project.html?id=...) now forward to the generated pages in projects/.
// The case studies themselves are built by scripts/build-projects.mjs.
import { byId } from "./projects.js";
const p = byId(new URLSearchParams(location.search).get("id"));
const body = document.getElementById("case-body");
if (p) location.replace(`projects/${p.id}.html`);
else if (body) body.innerHTML = `<h1>That project is not here</h1><p>It may have moved. <a href="index.html#projects">See all projects</a>.</p>`;
