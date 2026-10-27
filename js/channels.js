// The Mixing Desk: one array drives the whole feature.
// Copy changes live here; desk.js never needs to change for wording.

export const channels = [
  {
    id: "classroom",
    label: "Classroom",
    colour: "#FF8F33",
    stem: "assets/audio/classroom.mp3",
    title: "Twenty years in the classroom",
    story:
      "Twenty years with children and young people, since 2006. Specialist SEND and residential settings, then Ruskin Mill Trust. The job is helping someone do the thing they were told they could not.",
    link: { text: "SEND Life Transition", href: "https://www.youtube.com/@SENDLifeTransition" },
    unlock: null
  },
  {
    id: "workshop",
    label: "Workshop",
    colour: "#3FA34D",
    stem: "assets/audio/workshop.mp3",
    title: "Craft is how we teach",
    story:
      "Argent College in Birmingham's Jewellery Quarter: textiles, willow, jewellery, horticulture and biodynamic farming on the rooftop and at Vale Head Farm. Craft is how we teach when words are not enough.",
    link: { text: "Argent College", href: "https://www.rmt.org/argent-college" },
    unlock: null
  },
  {
    id: "security",
    label: "Security",
    colour: "#0E243F",
    stem: "assets/audio/security.mp3",
    title: "The person to call",
    story:
      "ISO 27001, CISMP, CompTIA Security+, the Google Professional Cybersecurity Certificate and the CAPSLOCK practitioner course with the University of Birmingham. Gibcom protects small businesses that cannot afford a breach.",
    link: { text: "Credentials", href: "#projects" },
    unlock: null
  },
  {
    id: "agency",
    label: "Agency",
    colour: "#4DA8DA",
    stem: "assets/audio/agency.mp3",
    title: "Gibcom Marketing Support",
    story:
      "Founded in 2016, incorporated 2019, over 500 customers from the Colmore Building. Websites, search, Google Business, and now AI systems for small and medium businesses.",
    link: { text: "gcmarketingsupport.co.uk", href: "https://gcmarketingsupport.co.uk" },
    unlock: null
  },
  {
    id: "community",
    label: "Community",
    colour: "#F2C14E",
    stem: "assets/audio/community.mp3",
    title: "Local trade, easy to find",
    story:
      "Birmingham Local Biz Support, a free directory for West Midlands businesses started in 2021. Local trade should be easy to find and free to list.",
    link: { text: "birminghamlocalbizsupport.com", href: "https://birminghamlocalbizsupport.com" },
    unlock: null
  },
  {
    id: "machine",
    label: "Machine",
    colour: "#7B5EA7",
    stem: "assets/audio/machine.mp3",
    title: "Systems that work while I sleep",
    story:
      "Building AI agents and automation: the AIBOS command centre, Clara the inbound voice assistant, content engines. Also the student side: BA Psychology with AIU and the Level 3 Award in Education and Training.",
    link: { text: "GitHub", href: "https://github.com/gibjas22" },
    unlock: null
  },
  {
    id: "studio",
    label: "Studio",
    colour: "#D7263D",
    stem: "assets/audio/studio.mp3",
    title: "The Unsaid Sound",
    story:
      "Locked until the fader hits 100. Then: The Unsaid Sound, and the Parsifal tour as 1st Grail Knight across Ruskin Mill Trust provisions.",
    link: { text: "The Unsaid Sound", href: "https://www.youtube.com/@theUnsaidSoundMusic" },
    unlock: {
      holdMs: 2000,
      clip: "assets/audio/invincible-clip.mp3",
      title: "The Unsaid Sound",
      story:
        "Music is where I say the things that do not fit in a report. This is a 30-second excerpt of Invincible Battles. Before the studio there was the stage: I toured as the 1st Grail Knight in a Parsifal production across Ruskin Mill Trust provisions in South Wales, Gloucestershire, Sheffield and Glasshouse College.",
      link: { text: "Listen on YouTube", href: "https://www.youtube.com/@theUnsaidSoundMusic" },
      link2: { text: "Stream on SoundCloud", href: "https://soundcloud.com/theunsaidsoundmusic" }
    }
  }
];

export const desk = {
  masterDefault: 80,
  rampSeconds: 0.15,
  duckLevel: 0.3,
  hintLabel: "Hear my story",
  prompt: "Push a fader up. Every channel is a part of my life."
};
