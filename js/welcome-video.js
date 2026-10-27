// welcome-video.js: the welcome-video card in the Contact section.
//
// To connect the real video, edit WELCOME below and nothing else:
//   type:    "youtube" | "vimeo" | "file" | ""   (empty string keeps the "coming soon" placeholder)
//   src:     YouTube watch/short URL or ID, Vimeo URL or ID, or a path to an .mp4 in assets/video/
//   poster:  a local image shown before play, e.g. "assets/img/welcome-poster.jpg" (optional)
//   caption: one line shown under the player
//   captions: for type "file", a path to a .vtt subtitle file (optional; leave "" if none exists)
//
// External players load only after the visitor presses play, so the page never contacts
// YouTube or Vimeo until asked. Nothing autoplays.

const WELCOME = {
  type: "",
  src: "",
  poster: "",
  caption: "A short introduction, recorded for this site.",
  captions: ""
};

const frame = document.getElementById("welcome-player");
const captionEl = document.getElementById("welcome-caption");
if (captionEl && WELCOME.caption) captionEl.textContent = WELCOME.caption;

const youtubeId = s => (s.match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/)([\w-]{11})/) || [, /^[\w-]{11}$/.test(s) ? s : null])[1];
const vimeoId = s => (s.match(/vimeo\.com\/(?:video\/)?(\d+)/) || [, /^\d+$/.test(s) ? s : null])[1];

function embedUrl() {
  if (WELCOME.type === "youtube") { const id = youtubeId(WELCOME.src); return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` : null; }
  if (WELCOME.type === "vimeo") { const id = vimeoId(WELCOME.src); return id ? `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1` : null; }
  return null;
}
function directUrl() {
  if (WELCOME.type === "youtube") { const id = youtubeId(WELCOME.src); return id ? `https://www.youtube.com/watch?v=${id}` : null; }
  if (WELCOME.type === "vimeo") { const id = vimeoId(WELCOME.src); return id ? `https://vimeo.com/${id}` : null; }
  if (WELCOME.type === "file") return WELCOME.src || null;
  return null;
}

function fail() {
  const link = directUrl();
  frame.innerHTML = `<div class="video-placeholder"><span class="video-soon">The video would not play here.${link ? ` <a href="${link}" target="_blank" rel="noopener">Open it in a new tab</a>.` : ""}</span></div>`;
}

if (frame && WELCOME.type && WELCOME.src) {
  const valid = WELCOME.type === "file" ? /\.(mp4|webm|m4v)(\?|$)/i.test(WELCOME.src) : !!embedUrl();
  if (!valid) {
    console.warn("welcome-video: the configured src is not a valid", WELCOME.type, "source; keeping the placeholder.");
  } else if (WELCOME.type === "file") {
    const v = document.createElement("video");
    v.controls = true; v.preload = "metadata"; v.playsInline = true; v.src = WELCOME.src;
    if (WELCOME.poster) v.poster = WELCOME.poster;
    v.setAttribute("aria-label", "Gibson's welcome video");
    if (WELCOME.captions) { const t = document.createElement("track"); t.kind = "captions"; t.srclang = "en"; t.label = "English"; t.src = WELCOME.captions; v.appendChild(t); }
    v.addEventListener("error", fail);
    frame.innerHTML = ""; frame.appendChild(v);
  } else {
    // Poster with a real play button; the iframe is created only on activation.
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "video-play";
    btn.setAttribute("aria-label", "Play Gibson's welcome video");
    btn.innerHTML = `${WELCOME.poster ? `<img src="${WELCOME.poster}" alt="" width="1200" height="675">` : `<span class="video-poster-fallback" aria-hidden="true"></span>`}<span class="play-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="34" height="34"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>`;
    btn.addEventListener("click", () => {
      const f = document.createElement("iframe");
      f.src = embedUrl(); f.title = "Gibson's welcome video"; f.allow = "autoplay; fullscreen; picture-in-picture"; f.allowFullscreen = true;
      f.referrerPolicy = "strict-origin-when-cross-origin";
      f.addEventListener("error", fail);
      frame.innerHTML = ""; frame.appendChild(f); f.focus();
    });
    frame.innerHTML = ""; frame.appendChild(btn);
  }
}
