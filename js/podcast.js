// podcast.js: the SEND Life Transition video podcast section on the home page.
//
// Episode details live in EPISODES below. Every field was checked against YouTube on 29 October 2026
// (title, channel, publication date, duration, embedding allowed, automatic captions) and the summaries
// come from the episode transcripts, not from titles or thumbnails. Change them only after re-checking.
//
// Privacy: nothing from YouTube loads until the visitor presses play. The player then loads from
// youtube-nocookie.com. Nothing plays on page load. Only one video plays at a time, and the
// mixing desk pauses when a video starts (and vice versa), using the "site-media-play" event.

const CHANNEL = "https://www.youtube.com/@SENDLifeTransition";

const EPISODES = [
  {
    id: "3cPgHy1TrQ0",
    kicker: "Latest episode",
    title: "Navigating and Managing Emotional Experience in College",
    published: "2026-01-12",
    seconds: 728,
    start: 43,   // the supplied link starts at 0:43; kept until Gibson confirms whether that is intended
    summary: "Two hosts talk through the emotional side of college life: homesickness, pressure, loneliness and the way small setbacks can feel huge. They share a simple approach: name the feeling, accept it rather than fight it, then use practical ways to cope.",
    topics: ["Naming and accepting emotions", "Short breaks and talking to people you trust", "Counselling and other support services", "Sleep, food, exercise and mindfulness", "Boundaries, hobbies and reframing setbacks"],
    audience: "Young people starting or studying at college, and the people supporting them.",
    takeaways: [
      "Name the feeling first. Calling it stress, loneliness or frustration makes it easier to deal with.",
      "Accept the feeling instead of fighting it, then take a practical step: a short break, a walk, or a conversation with someone you trust.",
      "Look after the basics and use the help available: sleep, food, movement and support services all make emotions easier to manage."
    ],
    captions: "Automatic English captions are available on YouTube."
  },
  {
    id: "UhY_1r3UIg8",
    kicker: "Channel introduction",
    title: "SEND Life Transition: Official Channel Introduction",
    published: "2026-01-12",
    seconds: 8,
    start: 0,
    summary: "An eight-second animated introduction to the channel, built around the SEND Life Transition logo.",
    topics: [],
    audience: "",
    takeaways: [],
    captions: "Automatic English captions are available on YouTube."
  }
];

const box = document.getElementById("slt-episodes");
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmtDate = iso => new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
const fmtLength = s => s < 60 ? `${s} seconds` : `${Math.floor(s / 60)} min${s % 60 ? ` ${s % 60} s` : ""}`;
const isoLength = s => `PT${Math.floor(s / 60) ? Math.floor(s / 60) + "M" : ""}${s % 60 ? s % 60 + "S" : ""}`;
const watchUrl = e => `https://www.youtube.com/watch?v=${e.id}${e.start ? `&t=${e.start}s` : ""}`;
const embedUrl = e => `https://www.youtube-nocookie.com/embed/${e.id}?autoplay=1&rel=0&modestbranding=1${e.start ? `&start=${e.start}` : ""}`;
const LOGO = "assets/img/send-life-transition/slt-logo-320.webp";

function poster(e) {
  return `<button type="button" class="slt-play" data-id="${e.id}" aria-label="Play episode: ${esc(e.title)}. Loads the YouTube player.">
      <img class="slt-play-logo" src="${LOGO}" alt="" width="96" height="96" loading="lazy">
      <span class="slt-play-title" aria-hidden="true">${esc(e.title)}</span>
      <span class="slt-play-cta" aria-hidden="true"><span class="slt-play-icon"></span>Play episode</span>
      <span class="slt-play-length" aria-hidden="true">${fmtLength(e.seconds)}</span>
    </button>`;
}

function card(e, main) {
  return `<article class="slt-episode${main ? " slt-episode-main" : ""}" aria-labelledby="ep-${e.id}">
    <div class="slt-player" id="player-${e.id}">${poster(e)}</div>
    <div class="slt-episode-body">
      <p class="slt-kicker">${esc(e.kicker)}</p>
      <h3 id="ep-${e.id}">${esc(e.title)}</h3>
      <p class="slt-meta"><time datetime="${e.published}">${fmtDate(e.published)}</time> &middot; <time datetime="${isoLength(e.seconds)}">${fmtLength(e.seconds)}</time>${e.start ? ` &middot; plays from ${Math.floor(e.start / 60)}:${String(e.start % 60).padStart(2, "0")}` : ""}</p>
      <p>${esc(e.summary)}</p>
      ${e.audience ? `<p class="slt-audience"><strong>Who it is for:</strong> ${esc(e.audience)}</p>` : ""}
      ${e.topics.length ? `<details class="slt-details"><summary>Topics and takeaways</summary>
        <h4>Main topics</h4><ul>${e.topics.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
        ${e.takeaways.length ? `<h4>Three takeaways</h4><ol>${e.takeaways.map(t => `<li>${esc(t)}</li>`).join("")}</ol>` : ""}
      </details>` : ""}
      <p class="slt-captions">${esc(e.captions)}</p>
      <p class="slt-episode-actions"><a class="slt-link" href="${esc(watchUrl(e))}" target="_blank" rel="noopener noreferrer">Watch on YouTube<span class="visually-hidden">: ${esc(e.title)} (opens in a new tab)</span></a></p>
    </div>
  </article>`;
}

function restore(id) {
  const e = EPISODES.find(x => x.id === id), slot = document.getElementById("player-" + id);
  if (e && slot && slot.querySelector("iframe")) { slot.innerHTML = poster(e); slot.classList.remove("is-playing"); }
}

function play(id) {
  const e = EPISODES.find(x => x.id === id), slot = document.getElementById("player-" + id);
  if (!e || !slot) return;
  EPISODES.filter(x => x.id !== id).forEach(x => restore(x.id));   // one video at a time
  window.dispatchEvent(new CustomEvent("site-media-play", { detail: { source: "podcast" } }));
  const f = document.createElement("iframe");
  f.src = embedUrl(e);
  f.title = `YouTube video player: ${e.title}`;
  f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
  f.allowFullscreen = true;
  f.referrerPolicy = "strict-origin-when-cross-origin";
  slot.innerHTML = ""; slot.appendChild(f); slot.classList.add("is-playing");
  f.focus();
}

if (box) {
  box.innerHTML = EPISODES.map((e, i) => card(e, i === 0)).join("");
  box.addEventListener("click", ev => { const b = ev.target.closest(".slt-play"); if (b) play(b.dataset.id); });
  // If something else on the page starts playing (the desk's Studio video), unload the podcast player.
  window.addEventListener("site-media-play", ev => { if (ev.detail?.source !== "podcast") EPISODES.forEach(x => restore(x.id)); });
}
