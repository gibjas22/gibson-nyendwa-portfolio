// hero.js: the home page portrait reel (photos and short silent clips of Gibson).
//
// Behaviour agreed for this one element (an exception to the site's "no autoplay" rule):
// - The clips have no audio track at all. The reel moves on by itself, every DWELL ms for photos and
//   at the end of each clip, and a visible Pause button stops it.
// - It starts paused for visitors who ask for reduced motion or have Data Saver on, and pauses while
//   the reel is off screen, while the tab is hidden, while a pointer or keyboard focus is on it, and
//   when the mixing desk or a podcast video starts ("site-media-play").
// - Photos and clips load only when their slide is next, so the first visit costs one image.
// Set AUTOPLAY to false to make the reel move only when a visitor presses Next or Play.

const AUTOPLAY = true;
const DWELL = 5000;
const FIRST_DWELL = 8000;   // the opening photo stays longer, so nothing else loads while the page itself is loading

const reel = document.getElementById("hero-reel");
if (reel) init(reel);

function init(reel) {
  const slides = [...reel.querySelectorAll(".reel-slide")];
  const controls = reel.querySelector(".reel-controls");
  const toggle = reel.querySelector(".reel-toggle");
  const dotsBox = reel.querySelector(".reel-dots");
  const stage = reel.querySelector(".reel-stage");
  if (slides.length < 2 || !controls) return;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  let index = 0, playing = AUTOPLAY && !reduce.matches && !saveData, timer = 0;
  const holds = new Set();              // reasons to wait without changing the visitor's choice (hover, focus, off screen, hidden tab)

  // Dots
  slides.forEach((s, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "reel-dot"; b.dataset.i = i;
    b.setAttribute("aria-label", `Show slide ${i + 1} of ${slides.length}`);
    b.innerHTML = '<span aria-hidden="true"></span>';
    dotsBox.appendChild(b);
  });
  const dots = [...dotsBox.children];

  function load(i) {
    const s = slides[(i + slides.length) % slides.length];
    s.querySelectorAll("img[data-srcset]").forEach(img => { img.srcset = img.dataset.srcset; img.removeAttribute("data-srcset"); img.decoding = "async"; });
    s.querySelectorAll("video[data-src]").forEach(v => {
      v.poster = v.dataset.poster; v.removeAttribute("data-poster");
      if (!saveData || playing) { v.src = v.dataset.src; v.removeAttribute("data-src"); v.preload = "auto"; }
    });
  }
  const videoOf = i => slides[i].querySelector("video");
  const running = () => playing && holds.size === 0;

  function schedule() {
    clearTimeout(timer);
    const v = videoOf(index);
    if (v) {
      if (running()) {
        if (v.dataset.src) { load(index); }
        v.play().catch(() => { timer = setTimeout(next, DWELL); });   // a blocked play still moves on
      } else v.pause();
      return;                                                       // "ended" moves the reel on
    }
    if (running()) timer = setTimeout(next, first ? FIRST_DWELL : DWELL);
  }

  let first = true;
  function show(i, fromUser) {
    const prev = index;
    if (i !== 0 || fromUser) first = false;
    index = (i + slides.length) % slides.length;
    load(index);
    clearTimeout(show.pre);   // fetch the following slide shortly before it is needed, not on page load
    const upcoming = index + 1; show.pre = setTimeout(() => load(upcoming), (first ? FIRST_DWELL : DWELL) - 2500);
    slides.forEach((s, n) => {
      const on = n === index;
      s.classList.toggle("is-active", on);
      s.setAttribute("aria-hidden", String(!on));
      if ("inert" in s) s.inert = !on;
    });
    dots.forEach((d, n) => d.toggleAttribute("aria-current", n === index));
    const pv = videoOf(prev); if (pv && prev !== index) { pv.pause(); }
    const v = videoOf(index); if (v && v.readyState > 0) v.currentTime = 0;
    stage.setAttribute("aria-live", fromUser && !playing ? "polite" : "off");
    schedule();
  }
  const next = () => show(index + 1);

  function setPlaying(on) {
    playing = on;
    toggle.setAttribute("aria-label", on ? "Pause the slideshow" : "Play the slideshow");
    toggle.classList.toggle("is-paused", !on);
    schedule();
  }
  const setHold = (why, on) => { on ? holds.add(why) : holds.delete(why); schedule(); };

  slides.forEach(s => { const v = s.querySelector("video"); if (v) { v.loop = false; v.addEventListener("ended", () => { if (running()) next(); else { v.currentTime = 0; } }); } });
  // Pressing Play is an explicit request, so it overrides the hover and focus pauses until the next time.
  toggle.addEventListener("click", () => { if (!playing) { holds.delete("hover"); holds.delete("focus"); } setPlaying(!playing); });
  reel.querySelector(".reel-prev").addEventListener("click", () => show(index - 1, true));
  reel.querySelector(".reel-next").addEventListener("click", () => show(index + 1, true));
  dotsBox.addEventListener("click", e => { const b = e.target.closest(".reel-dot"); if (b) show(+b.dataset.i, true); });
  reel.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") setHold("hover", true); });
  reel.addEventListener("pointerleave", () => setHold("hover", false));
  // Keyboard focus on the slides or arrows pauses (a mouse click or a tap does not: it would stop the reel for good on phones).
  reel.addEventListener("focusin", e => { if (e.target !== toggle && e.target.matches(":focus-visible")) setHold("focus", true); });
  reel.addEventListener("focusout", e => { if (!reel.contains(e.relatedTarget)) setHold("focus", false); });
  document.addEventListener("visibilitychange", () => setHold("hidden", document.hidden));
  if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => setHold("offscreen", !e.isIntersecting), { threshold: 0.25 }).observe(reel);
  // Swipe left or right on the picture to change slide (vertical scrolling still works).
  let sx = null, sy = 0;
  stage.addEventListener("touchstart", e => { const t = e.changedTouches[0]; sx = t.clientX; sy = t.clientY; }, { passive: true });
  stage.addEventListener("touchend", e => {
    if (sx === null) return; const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; sx = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) show(index + (dx < 0 ? 1 : -1), true);
  }, { passive: true });
  stage.addEventListener("touchcancel", () => { sx = null; }, { passive: true });
  window.addEventListener("site-media-play", e => { if (e.detail?.source !== "hero" && playing) setPlaying(false); });
  reduce.addEventListener?.("change", () => { if (reduce.matches) setPlaying(false); });

  reel.classList.add("reel-ready");
  setPlaying(playing);
  show(0);
}
