// projects.js: the single data model for the project gallery and the case-study pages.
// Edit here and both update. Keep every claim verifiable; leave a field empty rather than guess.
//
// category: one of CATEGORIES below. colour: a channel colour from the desk, so the gallery
// rhymes with the rest of the site. live: a public URL or "" if there is nothing public to link.
// outcomes: only verified facts. evidence: editorial notes on what would strengthen the page (not shown).

export const CATEGORIES = [
  { id: "all", label: "All projects" },
  { id: "ai", label: "AI and automation" },
  { id: "web", label: "Websites and search" },
  { id: "security", label: "Cybersecurity" },
  { id: "education", label: "Education and SEND" },
  { id: "music", label: "Music and creative" }
];

export const projects = [
  {
    id: "gibcom",
    title: "Gibcom Marketing Support",
    category: "web",
    colour: "#5CC4F2",
    summary: "A Birmingham digital marketing and cybersecurity agency serving over 500 customers since 2016.",
    role: "Founder and director",
    live: "https://gcmarketingsupport.co.uk",
    year: "2016 to now",
    overview: "Gibcom started in 2016 because local firms kept asking me for help with websites and search. It became a registered company in January 2019 and now serves over 500 customers from the Colmore Building in Birmingham, covering websites, search, Google Business Profile, conversion work, and more recently AI systems and cybersecurity for small and medium businesses.",
    problem: "Small businesses in the West Midlands were paying national agencies for work they did not understand and could not measure, or doing nothing and losing customers to competitors who showed up first on Google.",
    approach: [
      "Plain-English service model: every recommendation comes with the reason it matters.",
      "Local first: Birmingham as the credibility anchor, with case work across the West Midlands.",
      "A weekly client update routine so customers always know what was done and why.",
      "Security added as a service line once the credentials were in place, because the same clients were being phished."
    ],
    tools: ["SEO", "Google Business Profile", "Conversion rate optimisation", "Google Merchant Center", "WordPress", "AI automation"],
    outcomes: ["Over 500 customers served", "Team built and managed, including an apprentice", "Credentials: ISO 27001, CISMP, CompTIA Security+, Google Professional Cybersecurity Certificate"],
    lessons: "Being findable is the whole game for a local business. The second lesson came later: the same businesses that cannot afford a marketing agency also cannot afford a breach, and nobody was speaking to them about either in words they could use.",
    related: ["blbs", "clara"],
    evidence: "Add two or three anonymised before and after search results, and a screenshot of the client update format."
  },
  {
    id: "blbs",
    title: "Birmingham Local Biz Support",
    category: "web",
    colour: "#F6D264",
    summary: "A free directory for West Midlands businesses, founded in 2021, so local trade is easy to find.",
    role: "Founder; built the directory and the listing workflow",
    live: "https://birminghamlocalbizsupport.com",
    year: "2021 to now",
    overview: "A free business directory for the West Midlands, started in 2021. Any local business can list itself at no cost. A publication is growing around it.",
    problem: "Paid directories charge small traders for visibility they rarely get, and the free ones are either national and noisy or abandoned.",
    approach: [
      "Free to list, always.",
      "Simple listing workflow a business owner can complete in minutes.",
      "Local editorial content to give the directory a reason to be visited, not just indexed."
    ],
    tools: ["Directory platform", "Listing workflow", "Editorial content"],
    outcomes: ["Live and free since 2021"],
    lessons: "A directory is only as good as the reason people have to open it. The publication exists to give it one.",
    related: ["gibcom"],
    evidence: "Add listing counts once they are worth stating, and a screenshot of the listing form."
  },
  {
    id: "clara",
    title: "Clara, the Gibcom inbound line",
    category: "ai",
    colour: "#B07CFF",
    summary: "An AI voice assistant that answers enquiries, qualifies them and books callbacks.",
    role: "Conversation design, call flow and integration with the enquiry process",
    live: "",
    year: "2026",
    overview: "Clara answers Gibcom's inbound line. She greets callers, works out what they need, captures the details and books a callback, so a small team never misses an enquiry while on client work.",
    problem: "Enquiries arrived while the team was with clients. Voicemail went unanswered for hours and some callers never left a message.",
    approach: [
      "Wrote the conversation as a script first, then built the flow around it.",
      "Kept Clara to qualifying and booking; anything complex is handed to a person.",
      "Integrated the captured details with the existing enquiry process rather than creating a new inbox."
    ],
    tools: ["AI voice assistant platform", "Conversation design", "Call-flow automation"],
    outcomes: [],
    lessons: "A voice assistant is a script before it is a system. Getting the words right for a nervous caller mattered more than any setting.",
    related: ["aibos", "gibcom"],
    evidence: "Add a short demo clip of a call, with the caller's consent or a staged example, and any call-handling figures once they are measured."
  },
  {
    id: "aibos",
    title: "AIBOS Command Centre",
    category: "ai",
    colour: "#B07CFF",
    summary: "A governed executive command centre in Obsidian, built with AI coding agents, that runs the business from one screen.",
    role: "Architecture, governance rules, staged build plan, agent orchestration",
    live: "",
    year: "2026",
    overview: "AIBOS is an executive command centre for Gibcom built in Obsidian. It brings the business's operating information into one place and uses AI coding agents, working under written governance rules, to build and maintain it in stages.",
    problem: "Running an agency, a directory, a channel and a music project from scattered documents meant decisions were made without the full picture in view.",
    approach: [
      "Wrote the governance rules before any agent touched the vault: what may change, what needs approval, what is logged.",
      "Staged plan: each stage has a definition of done before the next begins.",
      "AI agents do the building; I do the deciding."
    ],
    tools: ["Obsidian", "AI coding agents", "Git", "Markdown"],
    outcomes: [],
    lessons: "Governance first. An agent with a clear rulebook is a colleague; without one it is a risk.",
    related: ["clara"],
    evidence: "Add a redacted screenshot of the command centre home and the stage table from the plan."
  },
  {
    id: "sendlife",
    title: "SEND Life Transition",
    category: "education",
    colour: "#FFA152",
    summary: "A YouTube channel and podcast for families navigating transition for young people with SEND.",
    role: "Creator: content pillars, scripts, production workflow",
    live: "https://www.youtube.com/@SENDLifeTransition",
    year: "Ongoing",
    overview: "SEND Life Transition is a YouTube channel and podcast for families and professionals helping young people with special educational needs and disabilities move into adult life. It draws on twenty years of working in specialist SEND, residential and college settings.",
    problem: "Transition is the point where families most need plain, practical guidance, and where most of what exists is either clinical or marketing.",
    approach: [
      "Content pillars set first, so every episode answers a real question families ask.",
      "Scripted, then recorded in one take where possible, to keep the tone honest.",
      "A repeatable production workflow so episodes get made alongside a full-time job."
    ],
    tools: ["YouTube", "Podcast production", "Scripting"],
    outcomes: ["Channel live on YouTube"],
    lessons: "The families watching do not need me to be polished. They need me to be specific.",
    related: [],
    evidence: "Add episode count and the podcast feed once the first audio episode is published."
  },
  {
    id: "portfolio",
    title: "This portfolio",
    category: "web",
    colour: "#FF4D6D",
    summary: "Built for the AWS Student Builder Challenge in ten days, hosted on Amplify, with a mixing desk that plays my life.",
    role: "Everything: design, code, audio, AWS setup, write-up",
    live: "https://github.com/gibjas22/gibson-nyendwa-portfolio",
    year: "October to November 2026",
    overview: "A personal portfolio built from nothing for the AWS Student Builder Challenge, deployed on AWS Amplify Hosting from a public GitHub repository. The creative feature is a working mixing desk: seven faders, one per strand of my life, each playing a real loop and revealing a story. The build is documented day by day in the repository.",
    problem: "Show who I am to judges and employers in a way a CV cannot, while learning AWS properly rather than reading about it.",
    approach: [
      "Plain HTML, CSS and JavaScript so every line is mine to read and debug.",
      "AWS account secured first: root MFA, an admin user, a budget alert.",
      "Amplify Hosting connected to the repository so every push deploys.",
      "Six CC0 loops from Freesound, licence-checked on each asset page, credited in the repository."
    ],
    tools: ["HTML", "CSS", "JavaScript", "Web Audio API", "AWS Amplify Hosting", "Amazon CloudFront", "Amazon S3", "IAM", "AWS Budgets", "GitHub"],
    outcomes: ["Live on AWS Amplify with continuous deployment", "Day-by-day build log and a setup guide anyone can follow"],
    lessons: "A budget is an alert, not a cap. A public repository is redistribution. Git only knows the folder you are standing in.",
    related: [],
    evidence: "Add screenshots of the Amplify console and the desk once it is live."
  },
  {
    id: "unsaid",
    title: "The Unsaid Sound",
    category: "music",
    colour: "#FF4D6D",
    summary: "Original music: ambient electronica, cinematic bass and introspective lo-fi, including the release Invincible Battles.",
    role: "Writer, producer and performer",
    live: "https://www.youtube.com/@theUnsaidSoundMusic",
    year: "2024 to now",
    overview: "The Unsaid Sound is my music project: ambient textures, deep basslines and emotional soundscapes, released on YouTube and SoundCloud. Invincible Battles is the lead release. Before the studio there was the stage: I toured as the 1st Grail Knight in a Parsifal production across Ruskin Mill Trust provisions.",
    problem: "Some things do not fit in a report. Music is where I put them.",
    approach: [
      "Write first, produce second.",
      "Release independently and keep the rights.",
      "Let the music feed the other work: the mixing desk on this site is built from it."
    ],
    tools: ["Studio production", "YouTube", "SoundCloud"],
    outcomes: ["Over 25 original tracks on SoundCloud", "Invincible Battles released on YouTube"],
    lessons: "Finishing a track teaches the same discipline as finishing a build: decide, ship, listen, improve.",
    related: ["portfolio"],
    evidence: "Embed the Invincible Battles video on the case-study page once the welcome video slot is settled."
  }
];

export const byId = id => projects.find(p => p.id === id);
export const categoryLabel = id => (CATEGORIES.find(c => c.id === id) || {}).label || id;
