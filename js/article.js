// article.js: insights/article.html?slug=... is the old article address.
// Every article now has its own finished page at insights/<slug>.html (built by
// scripts/build-insights.mjs), so this sends visitors there and keeps shared links working.
import { bySlug } from "./insights.js";

const slug = new URLSearchParams(location.search).get("slug");
const a = bySlug(slug);
if (a) {
  location.replace(`${a.slug}.html${location.hash}`);
} else {
  document.title = "Article not found";
  const crumb = document.getElementById("crumb-cat");
  if (crumb) crumb.textContent = "Not found";
  document.getElementById("article").innerHTML =
    `<h1>That article is not here</h1><p>It may be unpublished or the link may be wrong. <a href="index.html">See all insights</a>.</p>`;
}
