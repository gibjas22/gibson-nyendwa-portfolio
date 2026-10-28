// insights.js: the content model for the Insights hub. One array, newest first is computed from dates.
//
// Add an article by copying content/ARTICLE-TEMPLATE.js into the `articles` array below.
// Only entries with status: "published" appear anywhere public. Keep drafts on a branch, not on main:
// this file is served to every visitor, so anything in it is public the moment it is pushed.
//
// Fields: see content/ARTICLE-TEMPLATE.js. body is an array of blocks: {h:"Heading"}, {p:"Paragraph"},
// {ul:["item"]}, {quote:"..."}, {code:"..."}. Text is escaped on render; links are written as [text](https://...).

export const CATEGORIES = [
  { id: "whats-on", label: "What's On Birmingham", colour: "#FF8F6B", icon: "star",
    blurb: "Gigs, theatre, exhibitions, food and family days out across Birmingham, and the independent venues behind them." },
  { id: "ai", label: "AI & Automation", colour: "#B07CFF", icon: "chip",
    blurb: "Agents, automation and the AI tools I build and use to run small businesses." },
  { id: "marketing", label: "Digital Marketing", colour: "#5CC4F2", icon: "signal",
    blurb: "Being found online: search, Google Business Profile and websites that turn visits into enquiries." },
  { id: "security", label: "Cybersecurity", colour: "#5E8FE6", icon: "shield",
    blurb: "Plain-English protection for small businesses and families, without the jargon." },
  { id: "send", label: "SEND & Inclusive Education", intro: "Special Educational Needs and Disabilities", colour: "#FFA152", icon: "hands",
    blurb: "Special Educational Needs and Disabilities: craft, transition and confidence, from twenty years in the work." },
  { id: "music", label: "Music & Creativity", colour: "#FF4D6D", icon: "wave",
    blurb: "The Unsaid Sound: writing, producing and performing, and what music says that reports cannot." }
];
export const categoryById = id => CATEGORIES.find(c => c.id === id);

// Small line icons for the category tiles (decorative, aria-hidden where used).
export const ICONS = {
  chip: '<path d="M8 8h8v8H8z"/><path d="M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3"/>',
  signal: '<path d="M4 20V14M9 20V10M14 20V6M19 20V3"/>',
  shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
  hands: '<path d="M7 11V6a2 2 0 0 1 4 0v5M11 10V5a2 2 0 0 1 4 0v6M15 9a2 2 0 0 1 4 0v4a8 8 0 0 1-8 8h-1a6 6 0 0 1-5-3l-2-4a2 2 0 0 1 3.5-2L7 14"/>',
  wave: '<path d="M2 12h2l2-6 3 12 3-15 3 18 3-12 2 3h2"/>',
  star: '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>'
};

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
