// Copy this object into the `articles` array in js/insights.js. Every field is explained.
// Delete the comments if you like; keep the shape.
{
  title: "A clear, specific title",                       // required
  slug: "a-clear-specific-title",                         // required; lowercase letters, numbers and hyphens only; must be unique
  excerpt: "One or two sentences that say what the reader will get.",  // required; shown on cards and as the description
  category: "ai",                                         // required; one of: whats-on, ai, marketing, security, send, music
  tags: ["automation", "small business"],                 // optional
  author: "Gibson Nyendwa",                               // defaults to the site author if omitted
  published: "2026-11-10",                                // required; the real publication date, YYYY-MM-DD
  updated: "",                                            // only when the substance changed after publication, YYYY-MM-DD
  cover: "assets/img/insights/a-clear-specific-title.jpg",// optional; 1600x900, under 200 KB
  coverAlt: "What the image shows, in one sentence",      // required if cover is set
  body: [                                                 // required; blocks render in order
    { p: "Opening paragraph. Say what this is and who it is for." },
    { h: "First heading" },
    { p: "Paragraphs can include links like [the ICO](https://ico.org.uk)." },
    { ul: ["A list item", "Another"] },
    { quote: "A short quotation, attributed in the following paragraph." },
    { code: "optional code or command, shown as written" }
  ],
  sources: [                                              // optional but strongly encouraged for any factual claim
    { text: "Source title, publisher, date", url: "https://..." }
  ],
  status: "draft",                                        // "draft" or "published"; only published appears anywhere public
  featured: false,                                        // true for at most one article; shows it above the grid
  seoTitle: "",                                           // optional; defaults to the title
  seoDescription: ""                                      // optional; defaults to the excerpt
}
