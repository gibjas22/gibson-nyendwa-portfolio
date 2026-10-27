// insights.js: the content model for the Insights hub. One array, newest first is computed from dates.
//
// Add an article by copying content/ARTICLE-TEMPLATE.js into the `articles` array below.
// Only entries with status: "published" appear anywhere public. Keep drafts on a branch, not on main:
// this file is served to every visitor, so anything in it is public the moment it is pushed.
//
// Fields: see content/ARTICLE-TEMPLATE.js. body is an array of blocks: {h:"Heading"}, {p:"Paragraph"},
// {ul:["item"]}, {quote:"..."}, {code:"..."}. Text is escaped on render; links are written as [text](https://...).

export const CATEGORIES = [
  { id: "ai", label: "AI & Automation" },
  { id: "marketing", label: "Digital Marketing" },
  { id: "security", label: "Cybersecurity" },
  { id: "send", label: "SEND & Inclusive Education", intro: "Special Educational Needs and Disabilities" },
  { id: "music", label: "Music & Creativity" }
];

export const AUTHOR = { name: "Gibson Nyendwa", url: "index.html#about" };

export const articles = [
  // No articles have been published yet. The hub shows its empty state until the first one is added.
];

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const published = () => articles
  .filter(a => a.status === "published" && SLUG_RE.test(a.slug) && a.title && a.published)
  .sort((a, b) => new Date(b.published) - new Date(a.published));
export const bySlug = slug => SLUG_RE.test(slug || "") ? published().find(a => a.slug === slug) : undefined;
export const categoryLabel = id => (CATEGORIES.find(c => c.id === id) || {}).label || "";
export const readingTime = a => {
  const words = (a.body || []).map(b => b.p || b.quote || b.h || (b.ul || []).join(" ") || b.code || "").join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 225));
};
export const fmtDate = iso => new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
export const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
// Inline links only: [text](https://...) after escaping, so nothing else is treated as HTML.
export const inline = s => esc(s).replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
