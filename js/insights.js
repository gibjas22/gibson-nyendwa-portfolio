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
    title: "SEND Life Transition: Free Wellbeing Support for the Move to College",
    slug: "send-life-transition-digital-wellbeing-support",
    excerpt: "Why I created SEND Life Transition, a free YouTube channel supporting the emotional wellbeing of young people with SEND as they move from school to college, and what it offers families and educators.",
    category: "send",
    tags: ["SEND Life Transition", "post-16 transition", "emotional wellbeing", "college"],
    author: "Gibson Nyendwa",
    published: "2026-10-29",
    cover: "assets/img/insights/send-life-transition-digital-wellbeing-support.jpg",
    coverWebp: [800, 1600],   // -800.webp and -1600.webp exist beside the JPG
    coverAlt: "The SEND Life Transition logo, a studio microphone over orange and blue swooshes, on a navy background with the words Free wellbeing support for the move to college",
    video: {
      id: "zKX9z3C3F0I",
      title: "SEND Life Transition: A Digital Support Initiative for Youth Emotional Wellbeing",
      published: "2026-06-14T15:02:50-07:00",
      seconds: 128,
      captions: "Automatic English captions are available on YouTube.",
      chapters: [
        { t: 16, label: "Why the move to college is a vulnerable point" },
        { t: 23, label: "The idea: a free channel on YouTube" },
        { t: 39, label: "What the content is based on" },
        { t: 70, label: "The Global Goals it supports" },
        { t: 78, label: "Plans for the next phases" },
        { t: 100, label: "Why this project matters to me" }
      ]
    },
    body: [
      { p: "Moving from school to college is a big change for any young person. For young people with SEND (special educational needs and disabilities), it can be one of the hardest moments in their education: new buildings, new people, new routines and far more independence, often all at once." },
      { p: "In a short video for the SEND Life Transition channel, I explain why I set up the channel and how it is meant to help. This article walks through the same ideas in more detail, adds some context for families and staff in England, and suggests a few practical first steps. Where I add information that is not in the video, I say so and link to the source." },
      { h: "Why the move to college matters so much" },
      { p: "In the video I describe the transition to college as a critical point of vulnerability for young people with SEND. Three things tend to come together." },
      { ul: [
        "Routines change. The timetable, the journey, the building and the faces are all new, and the structure that school provided is often looser.",
        "Executive functioning demands rise. Executive functioning means the mental skills we use to plan, organise, start tasks, manage time and keep track of what we are doing. College usually asks young people to do much more of this for themselves.",
        "Emotional support can be harder to reach. The video points out that mental health resources are often not accessible enough for the young people who need them most."
      ] },
      { p: "When these pressures stack up, some young people find it difficult to settle or to stay on their course. That is the gap SEND Life Transition is trying to help with." },
      { p: "Additional context for England: an education, health and care (EHC) plan can support children and young people aged up to 25 who need more help than is available through ordinary SEN support, and young people aged 16 to 25 can ask their local authority for an EHC needs assessment themselves ([GOV.UK](https://www.gov.uk/children-with-special-educational-needs/extra-SEN-help)). Wales, Scotland and Northern Ireland have their own systems, so check the guidance where you live." },
      { h: "What SEND Life Transition is" },
      { p: "SEND Life Transition is a free YouTube channel. Because it is online and free, young people, families and staff can use it whenever they need it, at their own pace, and come back to a video as often as they like." },
      { p: "The video describes the channel as peer-based psychological support delivered through accessible video, with a supportive tone. In practice, that means short, plain-English videos that talk with young people rather than at them, about the things that worry them most: starting college, managing feelings, friendships, independence and knowing their rights." },
      { p: "It is educational content, not a clinical service. If a young person is struggling, their college's student support team, their GP or the people who already know them well remain the right places to turn." },
      { h: "The ideas behind the content" },
      { p: "In the video, I explain that the content draws on what we know about stress and self-compassion. In everyday terms, it covers three things." },
      { ul: [
        "How stress shows up in the brain and body. The video refers to the amygdala, a part of the brain involved in noticing threats, and the prefrontal cortex, which helps with planning, decision-making and self-control. When we feel overwhelmed, it can be much harder to think things through calmly.",
        "Practical ways to calm the body's stress response, so that thinking and planning become easier again.",
        "Self-compassion: treating yourself with the same understanding you would show a friend, rather than criticising yourself for finding things hard."
      ] },
      { p: "The video also mentions mirror neuron theory as part of its approach to emotional regulation. It is worth knowing that this is a theory researchers still discuss and debate, so I treat it as one way of thinking about how we learn from each other, not as settled fact." },
      { p: "For example (an illustration, not a real case): a student who freezes at the start of a new class might learn, through a short video, to notice that their body is in a stress response, take a few slow breaths, and remind themselves that feeling nervous on a first day is normal. Small steps like these are what the channel is built around." },
      { h: "Who the channel is for" },
      { ul: [
        "Young people with SEND who are preparing for college or already there.",
        "Parents and carers supporting a young person through the change.",
        "Teaching Assistants and tutors working alongside students day to day.",
        "SENCOs (Special Educational Needs Coordinators) and other professionals planning transitions."
      ] },
      { h: "How it connects to the Global Goals" },
      { p: "The video links the project to three of the United Nations [Sustainable Development Goals](https://sdgs.un.org/goals): Goal 3, Good Health and Well-being; Goal 4, Quality Education; and Goal 10, Reduced Inequalities. The aim is to remove barriers to good-quality emotional support, so that it is not only available to those who can pay for it or reach it easily." },
      { h: "What comes next" },
      { p: "The video sets out a plan in four phases. These are plans, not services that are running today." },
      { ul: [
        "Phases 1 and 2: grow the online community, make videos on topics that viewers ask for, and develop structured digital courses, including a transition toolkit.",
        "Phases 3 and 4: bring the online and offline worlds together through in-person workshops and training for educators.",
        "Finally, evaluate how well the approach works and share the findings through academic publication."
      ] },
      { h: "Why this project matters to me" },
      { p: "SEND Life Transition grew out of my studies with Atlantic International University, where I have been learning about emotion, personality and social cognition. As I say in the video, it is my way of turning academic theory into something practical that young people, families and educators can use." },
      { h: "Practical first steps" },
      { ul: [
        "Young people: pick one topic that worries you about college and watch a single short video on it. You do not have to watch everything at once.",
        "Parents and carers: watch a video together and use it to start a conversation about what feels hard and what might help.",
        "Teaching Assistants, tutors and SENCOs: use a short video as a starting point for transition conversations, then link it to the support your setting already offers.",
        "Everyone: tell the channel what you would like covered next. Requested topics are part of the plan for the next phase."
      ] },
      { p: "You can watch the original video below, or browse the whole [SEND Life Transition channel on YouTube](https://www.youtube.com/@SENDLifeTransition)." }
    ],
    sources: [
      { text: "SEND Life Transition: A Digital Support Initiative for Youth Emotional Wellbeing (YouTube, 14 June 2026), the source video for this article", url: "https://www.youtube.com/watch?v=zKX9z3C3F0I" },
      { text: "GOV.UK: Children with special educational needs and disabilities (SEND), Extra help (England)", url: "https://www.gov.uk/children-with-special-educational-needs/extra-SEN-help" },
      { text: "United Nations: The 17 Sustainable Development Goals", url: "https://sdgs.un.org/goals" }
    ],
    status: "published",
    featured: false,
    seoTitle: "SEND Life Transition: Free Wellbeing Support for College",
    seoDescription: "Why I created SEND Life Transition: free video support for the emotional wellbeing of young people with SEND moving to college, and for the families and staff supporting them."
  },
  {
    title: "Safeguarding and Thresholds of Need in Birmingham: A Practical Guide for Staff",
    slug: "safeguarding-thresholds-of-need-birmingham",
    excerpt: "A plain-English guide to safeguarding basics, Birmingham's Right Help, Right Time layers of need, responding to a disclosure and recording concerns, for staff working with children and young people in England.",
    category: "send",
    tags: ["safeguarding", "Right Help, Right Time", "Birmingham", "Teaching Assistants"],
    author: "Gibson Nyendwa",
    published: "2026-10-29",
    cover: "assets/img/insights/safeguarding-thresholds-of-need-birmingham.jpg",
    coverWebp: [800, 1600],
    coverAlt: "The SEND Life Transition logo, a studio microphone over orange and blue swooshes, on a navy background with the words Safeguarding and thresholds of need in Birmingham",
    video: {
      id: "qxrz39TA9Vs",
      title: "Foundations of Safeguarding and Thresholds of Need",
      published: "2026-06-29T12:14:30-07:00",
      seconds: 193,
      captions: "Automatic English captions are available on YouTube.",
      chapters: [
        { t: 27, label: "Key vocabulary" },
        { t: 46, label: "Professional curiosity" },
        { t: 54, label: "The four layers of need" },
        { t: 100, label: "Responding to a disclosure" },
        { t: 129, label: "Online vulnerability" },
        { t: 146, label: "Recording and reporting" }
      ]
    },
    body: [
      { p: "Safeguarding is part of everyone's job when you work with children and young people. This guide is adapted from my short SEND Life Transition video, Foundations of Safeguarding and Thresholds of Need, which gives an overview of a longer training session for professionals supporting children, young people and families." },
      { p: "It is written for Teaching Assistants, tutors, SENCOs and other staff, and for parents and carers who want to understand how the system works. It applies to England. The thresholds section describes Birmingham's own framework: other local areas use their own threshold documents, so check the one for the area where the child lives." },
      { p: "I have checked the guidance against the current versions: Keeping children safe in education 2026, in force in schools and colleges in England since 1 September 2026, and Birmingham's Right Help, Right Time guidance, Version 7, June 2026. Where the video simplifies something, I have added the detail below." },
      { h: "What safeguarding means" },
      { p: "Keeping children safe in education (KCSIE), the Department for Education's statutory guidance for schools and colleges, defines safeguarding as more than protecting children from harm. It includes helping as soon as problems emerge, preventing harm to children's mental and physical health or development, and making sure children grow up with safe and effective care. Its core principle is simple: [safeguarding is everyone's responsibility](https://www.gov.uk/government/publications/keeping-children-safe-in-education--2/part-one-overview-for-all-staff)." },
      { p: "The video introduces four words that come up again and again." },
      { ul: [
        "Safeguarding: protecting children's welfare.",
        "Resilience: a child's ability to bounce back from difficult experiences.",
        "Collaboration: agencies working together and sharing information.",
        "Universal services: services available to everyone, such as health and education."
      ] },
      { h: "Professional curiosity and the child's lived experience" },
      { p: "Professional curiosity means looking beyond the first explanation to understand what is really happening for a child and their family. In the video I describe it as going beyond surface-level assumptions, listening to the child's lived experience (what their daily life is actually like) and challenging discrimination." },
      { p: "Birmingham's guidance makes the same point in its principles: understand the child's lived experience, talk and listen to children and families as early as possible, and recognise disadvantage and discrimination. KCSIE adds that children may not feel ready or know how to tell someone about abuse, sometimes because of vulnerability, disability or language barriers, and that this should not stop staff from being professionally curious and speaking to the designated safeguarding lead if they are worried." },
      { h: "Birmingham's four layers of need" },
      { p: "Birmingham's multi-agency threshold guidance is called [Right Help, Right Time](https://lscpbirmingham.org.uk/working-with-children/right-help-right-time) and is published by the Birmingham Safeguarding Children Partnership. It describes four layers of need. The video shows them as rings, from green on the outside to red at the centre. The definitions below follow the current guidance (Version 7, June 2026)." },
      { ul: [
        "Universal needs (green): all children have a right to a range of services, such as health and education, and professionals make sure general needs are met.",
        "Universal Plus needs (yellow): the child and family need support above and beyond normal universal services. This is usually best organised by people who already know the child, such as a school or health professional, and can be done through an Early Help Assessment and an Our Family Plan.",
        "Additional needs (amber): the family may need an intensive or substantial package of support, which can still be met without statutory social work. A lead professional, usually someone already known to the family, coordinates the support through one plan.",
        "Complex or significant needs (red): the child's health or development may be impaired without services, or there is reasonable cause to suspect the child is suffering, or likely to suffer, significant harm. Child protection enquiries must be considered, and specialist services such as children's social care are accessed through the Children's Advice and Support Service (CASS)."
      ] },
      { p: "A note on the video: it links the amber layer to an early help plan. In the current guidance, the Early Help Assessment and Our Family Plan are described at the Universal Plus layer, while the Additional layer is about a coordinated, multi-agency plan led by a lead professional. The knowledge check in the video gets the key idea right: a child who needs targeted support to stop problems escalating, without being at immediate risk, sits at Universal Plus." },
      { h: "When a child tells you something" },
      { p: "The video teaches the TED approach for listening to a disclosure (when a child tells you about something that has happened to them). Use open prompts that let the child tell it in their own words." },
      { ul: [
        "Tell me what happened.",
        "Explain what you mean.",
        "Describe what you saw or heard."
      ] },
      { p: "The most important rule is never to promise to keep it secret. KCSIE is clear that staff should never promise a child that they will not tell anyone about a report of abuse, because this may not be in the child's best interests. Reassure the child that they are being taken seriously and that they will be supported and kept safe, then pass the information only to those who need it, such as your designated safeguarding lead." },
      { p: "The video also uses a short training case study, a seven-year-old called Leo who is showing signs of distress, to practise three steps: identify his needs, work out which layer of need applies, and plan the actions needed." },
      { h: "Online vulnerability" },
      { p: "A child's online life can affect their safety and wellbeing offline. The video highlights cyberbullying, online grooming and the sharing of illegal content as harms with serious, long-term consequences that need a professional response. Birmingham's guidance asks practitioners to be aware of how a child may be vulnerable to, or experiencing, harm online, including through social media and messaging apps." },
      { h: "Recording and reporting" },
      { p: "As the video puts it, if it is not written down, it did not happen. Stick to the facts, record the date, time and location, and use the child's own words rather than your interpretation. Then report to your designated safeguarding lead (DSL) straight away." },
      { p: "The KCSIE overview for all staff adds that you should act on any concern immediately, follow your setting's child protection policy, and make sure each record includes a summary of the concern, the actions taken, the decisions made, the reasons for those decisions and any outcomes. If a child is in immediate danger, call 999." },
      { p: "For practitioners in Birmingham, the Right Help, Right Time guidance (June 2026) gives the Children's Advice and Support Service as 0121 303 1888 (option 2, then option 2), from 8.45am to 5.15pm Monday to Thursday and 8.45am to 4.15pm on Friday. Outside those hours, the Emergency Duty Team is on 0121 675 4806. Always follow your own setting's procedures and speak to your DSL first unless a child is at immediate risk." },
      { h: "Why this matters for children and young people with SEND" },
      { p: "KCSIE recognises that children with special educational needs or disabilities can face additional safeguarding challenges, both online and offline. The barriers it lists include assuming that signs of possible abuse, such as changes in behaviour, mood or injuries, are part of the child's condition without looking further, and these children being more likely to experience isolation or bullying. It also asks all school and college staff to be particularly alert to the potential need for extra support for a child who is disabled, or who has special educational needs, whether or not they have an EHC plan (education, health and care plan)." },
      { p: "In practice, that means knowing each young person well enough to notice changes in behaviour, mood or attendance, giving them ways to communicate that suit them, and being curious rather than assuming a change is just part of their needs." },
      { h: "A quick checklist" },
      { ul: [
        "Know who your DSL and deputy are, and how to reach them.",
        "Know which threshold guidance applies where the child lives.",
        "Listen, use TED prompts, and never promise to keep a secret.",
        "Write down the facts, with the date, time, place and the child's own words.",
        "Report to your DSL straight away, and call 999 if a child is in immediate danger."
      ] },
      { p: "Safeguarding is everyone's responsibility. Staying curious and understanding the thresholds of need helps make sure children get the right help at the right time. You can watch the original video below, and if you support young people with SEND through change, you may also find [why I created SEND Life Transition](https://main.dbthjbi29n1oo.amplifyapp.com/insights/article.html?slug=send-life-transition-digital-wellbeing-support) useful." }
    ],
    sources: [
      { text: "Foundations of Safeguarding and Thresholds of Need (YouTube, 29 June 2026), the source video for this article", url: "https://www.youtube.com/watch?v=qxrz39TA9Vs" },
      { text: "Department for Education: Keeping children safe in education 2026 (statutory guidance for schools and colleges in England, in force from 1 September 2026)", url: "https://www.gov.uk/government/publications/keeping-children-safe-in-education--2" },
      { text: "Keeping children safe in education 2026: part one, overview for all staff", url: "https://www.gov.uk/government/publications/keeping-children-safe-in-education--2/part-one-overview-for-all-staff" },
      { text: "Birmingham Safeguarding Children Partnership: Right Help, Right Time", url: "https://lscpbirmingham.org.uk/working-with-children/right-help-right-time" },
      { text: "Right Help, Right Time guidance for practitioners, Version 7, June 2026 (PDF)", url: "https://lscpbirmingham.org.uk/wp-content/uploads/2023/03/Right_Help_Right_Time_Jun_-2026-V7.pdf" }
    ],
    status: "published",
    featured: false,
    seoTitle: "Safeguarding and Thresholds of Need in Birmingham",
    seoDescription: "A plain-English guide for staff in England: safeguarding basics, Birmingham's Right Help, Right Time layers of need, responding to disclosures and recording concerns."
  },
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
// Links to this site open in the same tab; links elsewhere open in a new tab.
const OWN = "https://main.dbthjbi29n1oo.amplifyapp.com/";
export const inline = s => esc(s).replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, text, url) =>
  url.startsWith(OWN) ? `<a href="${url}">${text}</a>` : `<a href="${url}" target="_blank" rel="noopener">${text}</a>`);
