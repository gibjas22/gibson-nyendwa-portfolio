// podcast.js: the podcast player card on the home page.
//
// To connect the real player, edit PODCAST below and nothing else:
//   type:     "spotify" | "apple" | "youtube" | ""   (empty keeps the "coming soon" placeholder)
//   src:      Spotify episode/show URL, Apple Podcasts episode/show URL, or a YouTube video/playlist URL
//   caption:  one line under the player
//   platforms: extra listen links shown in the "Listen and watch" card, e.g. { "Spotify": "https://open.spotify.com/show/..." }
//
// The player loads only after the visitor presses "Load player", so the page never contacts
// the platform until asked. Nothing autoplays.

const PODCAST = {
  type: "",
  src: "",
  caption: "The player will appear here once the first episode is published.",
  platforms: {}
};

const frame = document.getElementById("podcast-player");
const captionEl = document.getElementById("podcast-caption");
const platformList = document.getElementById("podcast-platforms");
if (captionEl && PODCAST.caption) captionEl.textContent = PODCAST.caption;

if (platformList) {
  for (const [name, url] of Object.entries(PODCAST.platforms)) {
    if (!/^https:\/\//.test(url)) continue;
    const li = document.createElement("li"); const a = document.createElement("a");
    a.href = url; a.target = "_blank"; a.rel = "noopener"; a.textContent = name; li.appendChild(a); platformList.appendChild(li);
  }
}

function embed() {
  const s = PODCAST.src;
  if (PODCAST.type === "spotify") { const m = s.match(/open\.spotify\.com\/(episode|show)\/([A-Za-z0-9]+)/); return m ? { url: `https://open.spotify.com/embed/${m[1]}/${m[2]}?theme=0`, h: m[1] === "show" ? 352 : 232, direct: s } : null; }
  if (PODCAST.type === "apple") { const m = s.match(/^https:\/\/podcasts\.apple\.com\/(.+)$/); return m ? { url: `https://embed.podcasts.apple.com/${m[1]}`, h: 450, direct: s } : null; }
  if (PODCAST.type === "youtube") {
    const v = (s.match(/(?:youtu\.be\/|v=|\/embed\/)([\w-]{11})/) || [])[1]; const l = (s.match(/[?&]list=([\w-]+)/) || [])[1];
    if (l) return { url: `https://www.youtube-nocookie.com/embed/videoseries?list=${l}`, h: 0, direct: s };
    if (v) return { url: `https://www.youtube-nocookie.com/embed/${v}?rel=0`, h: 0, direct: s };
  }
  return null;
}

if (frame && PODCAST.type && PODCAST.src) {
  const e = embed();
  if (!e) console.warn("podcast: the configured src is not a valid", PODCAST.type, "source; keeping the placeholder.");
  else {
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "button"; btn.textContent = "Load player";
    btn.setAttribute("aria-label", "Load the podcast player");
    const wrap = document.createElement("div"); wrap.className = "podcast-placeholder";
    wrap.appendChild(btn); frame.innerHTML = ""; frame.appendChild(wrap);
    btn.addEventListener("click", () => {
      const f = document.createElement("iframe");
      f.src = e.url; f.title = "SEND Life Transition podcast player"; f.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"; f.loading = "lazy";
      f.referrerPolicy = "strict-origin-when-cross-origin";
      if (e.h) { f.style.height = e.h + "px"; frame.classList.add("fixed-height"); } else frame.classList.add("ratio");
      f.addEventListener("error", () => { frame.innerHTML = `<div class="podcast-placeholder"><span class="video-soon">The player would not load here. <a href="${e.direct}" target="_blank" rel="noopener">Open it on the platform</a>.</span></div>`; });
      frame.innerHTML = ""; frame.appendChild(f); f.focus();
    });
  }
}
