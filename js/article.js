// article.js: renders one published article from insights.js, with TOC, sources, sharing and related.
import { bySlug, published, AUTHOR, categoryLabel, CATEGORIES, readingTime, fmtDate, esc, inline } from "./insights.js";

const slug = new URLSearchParams(location.search).get("slug");
const a = bySlug(slug);
const box = document.getElementById("article");
const crumb = document.getElementById("crumb-cat");
const SITE = "https://main.dbthjbi29n1oo.amplifyapp.com/insights/";

if (!a) {
  document.title = "Article not found";
  crumb.textContent = "Not found";
  box.innerHTML = `<h1>That article is not here</h1><p>It may be unpublished or the link may be wrong. <a href="index.html">See all insights</a>.</p>`;
} else {
  const cat = CATEGORIES.find(c => c.id === a.category);
  document.title = a.seoTitle || `${a.title}, by ${a.author || AUTHOR.name}`;
  document.querySelector('meta[name="description"]').content = a.seoDescription || a.excerpt;
  const url = `${SITE}article.html?slug=${a.slug}`;
  document.querySelector('link[rel="canonical"]').href = url;
  document.querySelector('meta[property="og:url"]').content = url;
  document.querySelector('meta[property="og:title"]').content = a.title;
  document.querySelector('meta[property="og:description"]').content = a.excerpt;
  document.querySelector('meta[property="og:type"]').content = "article";
  if (a.cover) document.querySelector('meta[property="og:image"]').content = SITE.replace("insights/", "") + a.cover;
  crumb.innerHTML = `<a href="index.html?category=${a.category}">${esc(categoryLabel(a.category))}</a>`;

  const heads = a.body.filter(b => b.h);
  const hid = t => "h-" + t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const block = b => b.h ? `<h2 id="${hid(b.h)}">${esc(b.h)}</h2>` : b.p ? `<p>${inline(b.p)}</p>` : b.ul ? `<ul class="case-list">${b.ul.map(i => `<li>${inline(i)}</li>`).join("")}</ul>` : b.quote ? `<blockquote class="pull">${esc(b.quote)}</blockquote>` : b.code ? `<pre><code>${esc(b.code)}</code></pre>` : "";
  const related = published().filter(r => r.slug !== a.slug && (r.category === a.category || (r.tags || []).some(t => (a.tags || []).includes(t)))).slice(0, 3);
  const firstIntro = cat?.intro ? `<p class="muted small">${esc(cat.label)}: ${esc(cat.intro)}.</p>` : "";

  box.innerHTML = `
    <header class="case-head" style="--c:var(--primary)">
      <p class="case-cat"><a href="index.html?category=${a.category}">${esc(categoryLabel(a.category))}</a></p>
      <h1>${esc(a.title)}</h1>
      <p class="lede">${esc(a.excerpt)}</p>
      <p class="byline">By ${esc(a.author || AUTHOR.name)} · <time datetime="${a.published}">${fmtDate(a.published)}</time> · ${readingTime(a)} min read${a.updated ? ` · Updated <time datetime="${a.updated}">${fmtDate(a.updated)}</time>` : ""}</p>
    </header>
    ${a.cover ? `<figure class="cover"><img src="../${esc(a.cover)}" alt="${esc(a.coverAlt || "")}" width="1600" height="900"></figure>` : ""}
    ${firstIntro}
    ${heads.length >= 3 ? `<nav class="toc card" aria-labelledby="toc-h"><h2 id="toc-h">On this page</h2><ol>${heads.map(h => `<li><a href="#${hid(h.h)}">${esc(h.h)}</a></li>`).join("")}</ol></nav>` : ""}
    <div class="article-body prose">${a.body.map(block).join("")}</div>
    ${a.sources?.length ? `<section class="case-section"><h2>Sources and further reading</h2><ul class="case-list">${a.sources.map(s => `<li>${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title || s.text || s.url)}</a>` : esc(s.title || s.text || "")}</li>`).join("")}</ul></section>` : ""}
    <section class="case-section share" aria-label="Share this article">
      <h2>Share</h2>
      <p class="case-actions">
        <a class="button button-quiet" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" rel="noopener">Share on LinkedIn</a>
        <a class="button button-quiet" href="mailto:?subject=${encodeURIComponent(a.title)}&body=${encodeURIComponent(url)}">Email a link</a>
        <button class="button button-quiet" type="button" id="copy">Copy link</button>
      </p>
      <p class="muted small" id="copied" role="status" aria-live="polite"></p>
    </section>
    ${related.length ? `<section class="case-section"><h2>Related insights</h2><ul class="related">${related.map(r => `<li style="--c:var(--accent)"><a href="article.html?slug=${r.slug}">${esc(r.title)}</a><span class="muted"> ${esc(categoryLabel(r.category))}</span></li>`).join("")}</ul></section>` : ""}
    <section class="case-section"><p class="case-actions"><a class="button" href="../index.html#contact">Talk to me about this</a><a class="text-link" href="index.html">Back to Insights</a></p></section>`;

  document.getElementById("copy").addEventListener("click", async () => {
    const out = document.getElementById("copied");
    try { await navigator.clipboard.writeText(url); out.textContent = "Link copied."; } catch { out.textContent = url; }
  });

  const ld = { "@context": "https://schema.org", "@type": "BlogPosting", headline: a.title, description: a.excerpt, datePublished: a.published, author: { "@type": "Person", name: a.author || AUTHOR.name }, url, mainEntityOfPage: url };
  if (a.updated) ld.dateModified = a.updated;
  if (a.cover) ld.image = SITE.replace("insights/", "") + a.cover;
  const s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(ld); document.head.appendChild(s);
}
