// article.js: renders one published article from insights.js, with TOC, sources, sharing and related.
import { categoryById, bySlug, published, AUTHOR, categoryLabel, CATEGORIES, readingTime, fmtDate, esc, inline } from "./insights.js";

const slug = new URLSearchParams(location.search).get("slug");
const a = bySlug(slug);
const box = document.getElementById("article");
const crumb = document.getElementById("crumb-cat");
const SITE = "https://main.dbthjbi29n1oo.amplifyapp.com/insights/";

// ---------- "Watch the video": click-to-load YouTube player (privacy-enhanced domain) ----------
const fmtLen = s => s < 60 ? `${s} seconds` : `${Math.floor(s / 60)} min${s % 60 ? ` ${s % 60} s` : ""}`;
const isoLen = s => `PT${Math.floor(s / 60) ? Math.floor(s / 60) + "M" : ""}${s % 60 ? (s % 60) + "S" : ""}`;
const clock = t => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
const LOGO = "../assets/img/send-life-transition/slt-logo-320.webp";
function poster(v) {
  return `<button type="button" class="slt-play" data-start="0" aria-label="Play video: ${esc(v.title)}. Loads the YouTube player.">
      <img class="slt-play-logo" src="${LOGO}" alt="" width="96" height="96" loading="lazy">
      <span class="slt-play-title" aria-hidden="true">${esc(v.title)}</span>
      <span class="slt-play-cta" aria-hidden="true"><span class="slt-play-icon"></span>Play video</span>
      <span class="slt-play-length" aria-hidden="true">${fmtLen(v.seconds)}</span>
    </button>`;
}
function watchSection(v) {
  const date = new Date(v.published).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" });
  return `<section class="case-section watch" id="watch" aria-labelledby="watch-h">
    <h2 id="watch-h">Watch the video</h2>
    <p>This article is adapted from the SEND Life Transition video <strong>${esc(v.title)}</strong>, published on YouTube on ${date} (${fmtLen(v.seconds)}). Read the article above, watch the video here, or both.</p>
    <div class="slt slt-watch">
      <div class="slt-player" id="watch-player">${poster(v)}</div>
      ${v.chapters?.length ? `<div class="slt-chapters"><h3 id="chapters-h">Jump to a section</h3><ol aria-labelledby="chapters-h">${v.chapters.map(c => `<li><button type="button" class="slt-chapter" data-start="${c.t}"><span class="slt-chapter-time">${clock(c.t)}</span> ${esc(c.label)}</button></li>`).join("")}</ol></div>` : ""}
      <p class="slt-captions">${esc(v.captions || "")}</p>
      <p class="slt-episode-actions"><a class="slt-link" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener noreferrer">Watch on YouTube<span class="visually-hidden">: ${esc(v.title)} (opens in a new tab)</span></a></p>
      <p class="slt-privacy">The player loads from YouTube's privacy-enhanced domain (youtube-nocookie.com) only when you press play. Once it loads, YouTube processes data under its own policies. <a href="../cookies.html">How this site handles third parties</a>.</p>
    </div>
  </section>`;
}
function wireWatch(v) {
  const slot = document.getElementById("watch-player"), sec = document.getElementById("watch");
  if (!slot || !sec) return;
  const load = start => {
    const f = document.createElement("iframe");
    f.src = `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1${start ? `&start=${start}` : ""}`;
    f.title = `YouTube video player: ${v.title}`;
    f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    f.allowFullscreen = true;
    f.referrerPolicy = "strict-origin-when-cross-origin";
    slot.innerHTML = ""; slot.appendChild(f); slot.classList.add("is-playing");
    f.focus();
  };
  sec.addEventListener("click", e => { const b = e.target.closest("[data-start]"); if (b) load(+b.dataset.start); });
}

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
    <header class="case-head" style="--c:${(categoryById(a.category) || {}).colour || "var(--primary)"}">
      <p class="case-cat"><a href="index.html?category=${a.category}">${esc(categoryLabel(a.category))}</a></p>
      <h1>${esc(a.title)}</h1>
      <p class="lede">${esc(a.excerpt)}</p>
      <p class="byline">By ${esc(a.author || AUTHOR.name)} · <time datetime="${a.published}">${fmtDate(a.published)}</time> · ${readingTime(a)} min read${a.updated ? ` · Updated <time datetime="${a.updated}">${fmtDate(a.updated)}</time>` : ""}</p>
    </header>
    ${a.cover ? `<figure class="cover">${a.coverWebp && a.coverWebp.length
      ? `<picture><source type="image/webp" srcset="${a.coverWebp.map(w => `../${esc(a.cover.replace(/\.jpg$/i, ""))}-${w}.webp ${w}w`).join(", ")}" sizes="(max-width: 760px) calc(100vw - 2rem), 720px"><img src="../${esc(a.cover)}" alt="${esc(a.coverAlt || "")}" width="1600" height="900" fetchpriority="high" decoding="async"></picture>`
      : `<img src="../${esc(a.cover)}" alt="${esc(a.coverAlt || "")}" width="1600" height="900">`}</figure>` : ""}
    ${firstIntro}
    ${a.video ? `<nav class="read-watch" aria-label="Read or watch"><a class="read-watch-option" href="#article-body">Read the article</a><a class="read-watch-option" href="#watch">Watch the video (${fmtLen(a.video.seconds)})</a></nav>` : ""}
    ${heads.length >= 3 ? `<nav class="toc card" aria-labelledby="toc-h"><h2 id="toc-h">On this page</h2><ol>${heads.map(h => `<li><a href="#${hid(h.h)}">${esc(h.h)}</a></li>`).join("")}</ol></nav>` : ""}
    <div class="article-body prose" id="article-body">${a.body.map(block).join("")}</div>
    ${a.video ? watchSection(a.video) : ""}
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
    <section class="case-section"><p class="case-actions"><a class="button" href="../index.html#contact">Talk to me about this</a><a class="text-link" href="index.html?category=${a.category}">Back to ${esc(categoryLabel(a.category))} insights</a><a class="text-link" href="index.html">All insights</a></p></section>`;

  document.getElementById("copy").addEventListener("click", async () => {
    const out = document.getElementById("copied");
    try { await navigator.clipboard.writeText(url); out.textContent = "Link copied."; } catch { out.textContent = url; }
  });

  const ld = { "@context": "https://schema.org", "@type": "BlogPosting", headline: a.title, description: a.seoDescription || a.excerpt, datePublished: a.published, author: { "@type": "Person", name: a.author || AUTHOR.name }, url, mainEntityOfPage: url };
  if (a.video) {
    const v = a.video, watch = `https://www.youtube.com/watch?v=${v.id}`;
    ld.isBasedOn = watch;
    ld.video = { "@type": "VideoObject", name: v.title, description: `The SEND Life Transition video this article is adapted from: ${v.title}.`,
      thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`, uploadDate: v.published, duration: isoLen(v.seconds),
      embedUrl: `https://www.youtube-nocookie.com/embed/${v.id}`, url: watch };
    wireWatch(a.video);
  }
  if (a.updated) ld.dateModified = a.updated;
  if (a.cover) ld.image = SITE.replace("insights/", "") + a.cover;
  const s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(ld); document.head.appendChild(s);
}
