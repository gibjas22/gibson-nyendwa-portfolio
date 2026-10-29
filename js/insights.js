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
  {
    title: "What's On in Birmingham: A Guide to Discovering Local Events and Experiences",
    slug: "whats-on-in-birmingham-guide",
    excerpt: "From grassroots gigs to free galleries and family days out, here is how to find what's on in Birmingham, and why the city's independent venues deserve your support.",
    category: "whats-on",
    tags: ["Birmingham", "events", "independent venues"],
    author: "Gibson Nyendwa",
    published: "2026-10-29",
    body: [
      { p: "Birmingham rarely sits still. Between the concert halls, the grassroots music rooms, the theatres, the galleries and the food halls, there is almost always something on, and much of it is closer and cheaper than people expect." },
      { p: "This guide is for anyone who lives here, is visiting, or runs a business that does well when people head out. It does not list dates or prices, because those change quickly. Instead, it points you to the places worth knowing and to the official pages that keep their listings up to date." },
      { h: "Live music, from grand halls to back rooms" },
      { p: "Symphony Hall and Town Hall are run by the music charity B:Music, and Symphony Hall is home to the City of Birmingham Symphony Orchestra. Their programmes stretch well beyond classical, into jazz, soul, folk and rock, so it is worth browsing even if you think orchestras are not for you." },
      { p: "For something closer to the stage, try the Hare & Hounds on Kings Heath High Street. It is a Grade II listed pub with two upstairs rooms hosting jazz, indie, reggae, hip hop, soul and club nights. Shows are standing and age limits vary by night, so check before you book. Grassroots rooms like this are where many artists start out, and your ticket there makes a real difference." },
      { h: "Theatre and performance" },
      { p: "Birmingham Hippodrome on Hurst Street covers ballet and dance, musicals, comedy, opera, drama and family shows, including pantomime. Birmingham Rep in Centenary Square is a producing theatre, which means it creates new shows from scratch, across three stages: The House, The Door and The Studio. If you want to see work made in the city, the Rep's smaller stages are a good place to begin." },
      { h: "Exhibitions and culture, often free" },
      { p: "Ikon Gallery in Brindleyplace shows contemporary art, and entry is free. Birmingham Museum & Art Gallery is reopening in phases with free general admission. The Staffordshire Hoard Gallery, the Pre-Raphaelite Galleries and the Birmingham History Galleries are open again, while parts of the upper floors are still closed, so check what is open before you travel." },
      { p: "Out at Cannon Hill Park, mac (Midlands Arts Centre) brings together theatre, cinema, exhibitions and practical courses, and describes itself as the most visited free attraction in the West Midlands. Some shows and courses are ticketed, so check the individual listing." },
      { h: "Food and drink worth crossing the city for" },
      { p: "The Jewellery Quarter shows independent Birmingham at its best. Visit Birmingham counts more than 100 independent specialist retailers and craftspeople there, alongside places to eat such as Saint Paul's Market food hall and Opheem, which holds two stars in the 2026 Michelin Guide. Add the Museum of the Jewellery Quarter or the Pen Museum and you have an afternoon sorted." },
      { p: "Beyond that, the best food tip is simple: follow the independents. Look for local traders at markets and pop-ups, ask staff where they eat on their day off, and keep an eye on the food and drink headlines in the What's On panel at the top of my Insights page." },
      { h: "Family days out" },
      { p: "Thinktank, Birmingham Science Museum, at Millennium Point has four floors of hands-on displays, from Birmingham's Spitfire to prehistoric sea creatures and space. Younger visitors have MiniBrum, a child-sized city of play zones. Birmingham Museum & Art Gallery's Wild City display is aimed at children too, and mac in Cannon Hill Park pairs a show or a workshop with space to run around outside." },
      { h: "Community events and getting involved" },
      { p: "Some of the best nights out are the small, regular ones. Alongside its gigs, the Hare & Hounds runs pub quizzes, craft clubs, comedy workshops and a monthly film club. mac runs practical courses if you would rather make something than watch." },
      { p: "Libraries, community centres, places of worship and neighbourhood groups often carry the events you will not find on the big ticketing sites, especially around Diwali, Eid, Vaisakhi and Christmas. They are often free, and they are a brilliant way to meet the people who live around you." },
      { h: "Why independent venues matter" },
      { p: "Every ticket, round or meal at an independent venue keeps money moving locally and keeps stages open for the next generation of artists, chefs and makers. If you run a business, make your events easy to find: keep your own website and Google Business Profile current, post your listings early, and check whether calendars such as Visit Birmingham's accept submissions. A clear listing with the date, price, access details and age limit saves your customers a lot of guesswork." },
      { h: "Plan your next outing" },
      { ul: [
        "Check the official venue page for dates, prices, accessibility and age limits before you travel.",
        "Browse [Visit Birmingham's what's on calendar](https://visitbirmingham.com/whats-on/), the city's official tourism site, for the wider picture.",
        "Use the What's On panel at the top of my Insights page for the latest local headlines.",
        "Pick one independent venue you have not tried yet, and go this month."
      ] },
      { p: "Know a Birmingham event, venue or independent business that deserves a mention? [Get in touch](https://main.dbthjbi29n1oo.amplifyapp.com/index.html#contact) and I will consider it for a future guide." }
    ],
    sources: [
      { text: "B:Music: Live music in Birmingham is back (charity responsible for Symphony Hall and Town Hall)", url: "https://bmusic.co.uk/news/live-music-in-birmingham-is-back" },
      { text: "Hare & Hounds Kings Heath: The venue", url: "https://hareandhoundskingsheath.co.uk/the-venue" },
      { text: "Birmingham Hippodrome: About", url: "https://www.birminghamhippodrome.com/?p=48" },
      { text: "Birmingham Rep: About the Rep", url: "https://www.birmingham-rep.co.uk/about-us/about-the-rep/" },
      { text: "Ikon Gallery: Visit", url: "https://www.ikon-gallery.org/visit" },
      { text: "Birmingham Museums: Birmingham Museum & Art Gallery FAQs (free general admission)", url: "https://birminghammuseums.org.uk/birmingham-museum-and-art-gallery/about/faqs" },
      { text: "Birmingham Museums: Birmingham Museum & Art Gallery highlights (galleries open and closed)", url: "https://www.birminghammuseums.org.uk/birmingham-museum-and-art-gallery/highlights" },
      { text: "mac Birmingham: About", url: "https://macbirmingham.co.uk/about" },
      { text: "Birmingham Museums: Thinktank celebrates 25 years", url: "https://www.birminghammuseums.org.uk/stories/thinktank-birmingham-science-museum-celebrates-25-years-of-inspiring-curiosity" },
      { text: "MICHELIN Guide United Kingdom 2026: Opheem", url: "https://guide.michelin.com/en/west-midlands/birmingham/restaurant/opheem" },
      { text: "Visit Birmingham: The Jewellery Quarter", url: "https://visitbirmingham.com/inspire-me/areas/the-jewellery-quarter/" },
      { text: "Visit Birmingham: What's on in Birmingham", url: "https://visitbirmingham.com/whats-on/" }
    ],
    status: "published",
    featured: true,
    seoTitle: "What's On in Birmingham: Your Guide to Local Events",
    seoDescription: "Live music, theatre, free exhibitions, food and family days out: a friendly guide to finding what's on in Birmingham and backing its independent venues."
  }
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
