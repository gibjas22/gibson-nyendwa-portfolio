// article-render.js: builds an article's HTML, head tags and structured data from js/insights.js.
// Pure functions with no DOM access, so the same code runs in the browser and in
// scripts/build-insights.mjs, which writes one finished page per article to insights/<slug>.html.
import { categoryById, published, AUTHOR, categoryLabel, CATEGORIES, readingTime, fmtDate, esc, inline } from "./insights.js";

export const SITE = "https://main.dbthjbi29n1oo.amplifyapp.com";
export const articleURL = a => `${SITE}/insights/${a.slug}.html`;
const href = slug => `${esc(slug)}.html`;
const safeURL = u => /^https?:\/\//i.test(u || "") ? esc(u) : "";

// ---------- small helpers ----------
export const fmtLen = s => s < 60 ? `${s} seconds` : `${Math.floor(s / 60)} min${s % 60 ? ` ${s % 60} s` : ""}`;
const isoLen = s => `PT${Math.floor(s / 60) ? Math.floor(s / 60) + "M" : ""}${s % 60 ? (s % 60) + "S" : ""}`;
const clock = t => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
const hid = t => "h-" + t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const LOGO = "../assets/img/send-life-transition/slt-logo-320.webp";

// UK phone numbers in article text become tap-to-call links (only in text, never inside a tag).
const telify = html => html.split(/(<[^>]+>)/).map(part => part.startsWith("<") ? part : part
  .replace(/\b(0\d{3} \d{3} \d{4})\b/g, (m) => `<a class="tel" href="tel:+44${m.slice(1).replace(/\s/g, "")}">${m}</a>`)
  .replace(/\bcall 999\b/g, `call <a class="tel" href="tel:999">999</a>`)).join("");
const text = s => telify(inline(s));

// A list whose items start "Name (green|yellow|amber|red): ..." is a threshold scale: render it as colour-coded cards.
const LAYER_RE = /^(.+?) \((green|yellow|amber|red)\):\s*/i;
const isLayers = items => items.length >= 3 && items.every(i => LAYER_RE.test(i));
const layers = items => `<ol class="layers" aria-label="Layers of need, from least to most serious">${items.map((i, n) => {
  const [, name, colour] = i.match(LAYER_RE);
  const rest = i.replace(LAYER_RE, "");
  return `<li class="layer layer-${colour.toLowerCase()}"><p class="layer-name"><span class="layer-step" aria-hidden="true">${n + 1}</span><span>${esc(name)} <span class="layer-colour">(${esc(colour.toLowerCase())})</span></span></p><p>${text(rest.charAt(0).toUpperCase() + rest.slice(1))}</p></li>`;
}).join("")}</ol>`;

const block = b => b.h ? `<h2 id="${hid(b.h)}">${esc(b.h)}</h2>`
  : b.p ? `<p>${text(b.p)}</p>`
  : b.ul ? (isLayers(b.ul) ? layers(b.ul) : `<ul class="case-list">${b.ul.map(i => `<li>${text(i)}</li>`).join("")}</ul>`)
  : b.quote ? `<blockquote class="pull">${esc(b.quote)}</blockquote>`
  : b.code ? `<pre><code>${esc(b.code)}</code></pre>` : "";

// ---------- "Watch the video": click-to-load YouTube player ----------
const poster = v => `<button type="button" class="slt-play" data-start="0" aria-label="Play video: ${esc(v.title)} (${fmtLen(v.seconds)}). Loads the YouTube player.">
      <img class="slt-play-logo" src="${LOGO}" alt="" width="96" height="96" loading="lazy">
      <span class="slt-play-title" aria-hidden="true">${esc(v.title)}</span>
      <span class="slt-play-cta" aria-hidden="true"><span class="slt-play-icon"></span>Play video</span>
      <span class="slt-play-length" aria-hidden="true">${fmtLen(v.seconds)}</span>
    </button>`;
function watchSection(v) {
  const date = new Date(v.published).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" });
  return `<section class="case-section watch" id="watch" aria-labelledby="watch-h">
    <h2 id="watch-h">Watch the video</h2>
    <p>This article is adapted from the SEND Life Transition video <strong>${esc(v.title)}</strong>, published on YouTube on ${date} (${fmtLen(v.seconds)}). Read the article above, watch the video here, or both.</p>
    <div class="slt slt-watch" data-video="${esc(v.id)}" data-title="${esc(v.title)}">
      <div class="slt-player" id="watch-player">${poster(v)}</div>
      ${v.chapters?.length ? `<div class="slt-chapters"><h3 id="chapters-h">Jump to a section</h3><ol aria-labelledby="chapters-h">${v.chapters.map(c => `<li><button type="button" class="slt-chapter" data-start="${+c.t}"><span class="slt-chapter-time">${clock(+c.t)}</span> ${esc(c.label)}</button></li>`).join("")}</ol></div>` : ""}
      <p class="slt-captions">${esc(v.captions || "")}</p>
      <p class="slt-episode-actions"><a class="slt-link" href="https://www.youtube.com/watch?v=${encodeURIComponent(v.id)}" target="_blank" rel="noopener noreferrer">Watch on YouTube<span class="visually-hidden">: ${esc(v.title)} (opens in a new tab)</span></a></p>
      <p class="slt-privacy">The player loads from YouTube's privacy-enhanced domain (youtube-nocookie.com) only when you press play. Once it loads, YouTube processes data under its own policies. <a href="../cookies.html">How this site handles third parties</a>.</p>
    </div>
  </section>`;
}

// ---------- the article ----------
// Photo credit under a cover image, e.g. coverCredit: { name: "Tom W", url: "https://unsplash.com/photos/...", source: "Unsplash" }
const credit = c => !c || !c.name ? "" : `<figcaption>Photo: ${c.url && safeURL(c.url) ? `<a href="${safeURL(c.url)}" rel="noopener">${esc(c.name)}</a>` : esc(c.name)}${c.source ? ` on ${esc(c.source)}` : ""}</figcaption>`;

export function articleHTML(a) {
  const url = articleURL(a);
  const cat = CATEGORIES.find(c => c.id === a.category);
  const catId = esc(a.category);
  const heads = a.body.filter(b => b.h);
  const related = published().filter(r => r.slug !== a.slug && (r.category === a.category || (r.tags || []).some(t => (a.tags || []).includes(t)))).slice(0, 3);
  const firstIntro = cat?.intro ? `<p class="muted small">${esc(cat.label)}: ${esc(cat.intro)}.</p>` : "";
  const byline = [`By ${esc(a.author || AUTHOR.name)}`, `<time datetime="${esc(a.published)}">${fmtDate(a.published)}</time>`, `${readingTime(a)} min read`]
    .concat(a.updated ? [`Updated <time datetime="${esc(a.updated)}">${fmtDate(a.updated)}</time>`] : [])
    .map(s => `<span>${s}</span>`).join(`<span class="sep" aria-hidden="true"> · </span>`);
  const cover = !a.cover ? "" : `<figure class="cover">${a.coverWebp && a.coverWebp.length
    ? `<picture><source type="image/webp" srcset="${a.coverWebp.map(w => `../${esc(a.cover.replace(/\.jpg$/i, ""))}-${w}.webp ${w}w`).join(", ")}" sizes="(max-width: 760px) calc(100vw - 2rem), 720px"><img src="../${esc(a.cover)}" alt="${esc(a.coverAlt || "")}" width="1600" height="900" fetchpriority="high" decoding="async"></picture>`
    : `<img src="../${esc(a.cover)}" alt="${esc(a.coverAlt || "")}" width="1600" height="900" fetchpriority="high" decoding="async">`}${credit(a.coverCredit)}</figure>`;

  return `
    <header class="case-head" style="--c:${(categoryById(a.category) || {}).colour || "var(--primary)"}">
      <p class="case-cat"><a href="index.html?category=${catId}">${esc(categoryLabel(a.category))}</a></p>
      <h1>${esc(a.title)}</h1>
      <p class="lede">${esc(a.excerpt)}</p>
      <p class="byline">${byline}</p>
    </header>
    ${cover}
    ${firstIntro}
    ${a.video ? `<nav class="read-watch" aria-label="Read or watch"><a class="read-watch-option" href="#article-body">Read the article</a><a class="read-watch-option" href="#watch">Watch the video (${fmtLen(a.video.seconds)})</a></nav>` : ""}
    ${heads.length >= 3 ? `<nav class="toc card" id="toc" aria-labelledby="toc-h"><h2 id="toc-h">On this page</h2><ol>${heads.map(h => `<li><a href="#${hid(h.h)}">${esc(h.h)}</a></li>`).join("")}</ol></nav>` : ""}
    <div class="article-body prose" id="article-body">${a.body.map(block).join("")}</div>
    ${a.video ? watchSection(a.video) : ""}
    ${a.sources?.length ? `<section class="case-section"><h2>Sources and further reading</h2><ul class="case-list">${a.sources.map(s => {
      const u = safeURL(s.url), t = esc(s.title || s.text || s.url || "");
      return `<li>${u ? `<a href="${u}" target="_blank" rel="noopener">${t}</a>` : t}</li>`;
    }).join("")}</ul></section>` : ""}
    <section class="case-section share" aria-labelledby="share-h">
      <h2 id="share-h">Share</h2>
      <p class="case-actions" data-share-url="${esc(url)}" data-share-title="${esc(a.title)}">
        <button class="button button-quiet share-native" type="button" hidden>Share</button>
        <a class="button button-quiet" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" rel="noopener">Share on LinkedIn</a>
        <a class="button button-quiet" href="mailto:?subject=${encodeURIComponent(a.title)}&amp;body=${encodeURIComponent(url)}">Email a link</a>
        <button class="button button-quiet" type="button" id="copy">Copy link</button>
      </p>
      <p class="muted small" id="copied" role="status" aria-live="polite"></p>
    </section>
    ${related.length ? `<section class="case-section"><h2>Related insights</h2><ul class="related">${related.map(r => `<li style="--c:var(--accent)"><a href="${href(r.slug)}">${esc(r.title)}</a><span class="muted"> ${esc(categoryLabel(r.category))}</span></li>`).join("")}</ul></section>` : ""}
    <section class="case-section"><p class="case-actions"><a class="button" href="../index.html#contact">Talk to me about this</a><a class="text-link" href="index.html?category=${catId}">Back to ${esc(categoryLabel(a.category))} insights</a><a class="text-link" href="index.html">All insights</a></p></section>`;
}

// ---------- head tags ----------
export function headMeta(a) {
  const url = articleURL(a);
  const title = a.seoTitle || `${a.title}, by ${a.author || AUTHOR.name}`;
  const desc = a.seoDescription || a.excerpt;
  const image = a.cover ? `${SITE}/${a.cover}` : `${SITE}/assets/img/gibson-600.jpg`;
  return { url, title, desc, image, ogTitle: a.title, ogDesc: a.excerpt };
}

export function ldJSON(a) {
  const { url, desc, image } = headMeta(a);
  const ld = { "@context": "https://schema.org", "@type": "BlogPosting", headline: a.title, description: desc, datePublished: a.published,
    author: { "@type": "Person", name: a.author || AUTHOR.name, url: `${SITE}/` },
    publisher: { "@type": "Person", name: AUTHOR.name, url: `${SITE}/` },
    url, mainEntityOfPage: url, image, inLanguage: "en-GB" };
  if (a.updated) ld.dateModified = a.updated;
  if (a.video) {
    const v = a.video, watch = `https://www.youtube.com/watch?v=${v.id}`;
    ld.isBasedOn = watch;
    ld.video = { "@type": "VideoObject", name: v.title, description: `The SEND Life Transition video this article is adapted from: ${v.title}.`,
      thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`, uploadDate: v.published, duration: isoLen(v.seconds),
      embedUrl: `https://www.youtube-nocookie.com/embed/${v.id}`, url: watch };
  }
  return ld;
}
