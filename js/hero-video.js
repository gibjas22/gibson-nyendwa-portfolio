// hero-video.js: the silent looping background video in the home page hero.
//
// - The poster image is plain HTML, so the hero looks finished before any video loads, and stays
//   that way if the video never plays.
// - Only one file is fetched: the portrait phone cut or the landscape cut, chosen before the
//   source is set. Nothing is downloaded for visitors who ask for reduced motion or have
//   Data Saver on; they can still start it with the button.
// - The video has no audio track, is muted and never takes keyboard focus. The separate
//   Pause / Play button is the control, and a visitor's pause is never overridden.
// - Playback stops while the hero is off screen or the tab is hidden, and resumes only if the
//   visitor has not paused it.

const media = document.querySelector(".hero-media");
const video = media && media.querySelector(".hero-video");
const toggle = document.querySelector(".hero-video-toggle");
if (video && toggle) init();

function init() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const phone = matchMedia(video.dataset.mobileMedia || "(max-width: 760px)");
  const conn = navigator.connection;
  // Data Saver or a slow connection: keep the poster and let the visitor choose.
  const saveData = !!(conn && (conn.saveData || /(^|-)2g$|^3g$/.test(conn.effectiveType || "")));

  let loaded = false;        // a source has been assigned
  let userPaused = false;    // the visitor pressed Pause (or never asked for it under reduced motion)
  let inView = true;
  let failed = false;

  const label = toggle.querySelector(".hero-video-label");
  const setButton = playing => {
    toggle.dataset.state = playing ? "playing" : "paused";
    label.textContent = playing ? "Pause background video" : "Play background video";
  };

  function load() {
    if (loaded) return;
    loaded = true;
    video.src = phone.matches ? video.dataset.srcMobile : video.dataset.srcDesktop;
    video.load();
  }

  async function play() {
    if (failed) return;
    load();
    try {
      await video.play();
      setButton(true);
    } catch (err) {
      // Autoplay refused or the file could not play: keep the poster, offer the button.
      setButton(false);
      if (err && err.name !== "NotAllowedError" && err.name !== "AbortError") fail();
    }
  }

  function pause() {
    if (!video.paused) video.pause();
    setButton(false);
  }

  function fail() {
    failed = true;
    media.classList.remove("is-playing");
    toggle.hidden = true;
  }

  function update() {
    const wanted = !userPaused && inView && !document.hidden;
    if (wanted && video.paused) play();
    else if (!wanted && !video.paused) { video.pause(); if (userPaused) setButton(false); }
  }

  video.addEventListener("playing", () => media.classList.add("is-playing"));
  video.addEventListener("error", fail);

  toggle.addEventListener("click", () => {
    if (video.paused) { userPaused = false; play(); }
    else { userPaused = true; pause(); }
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { inView = e.isIntersecting; if (loaded) update(); }, { threshold: 0.05 })
      .observe(media);
  }
  document.addEventListener("visibilitychange", () => { if (loaded) update(); });

  // If a visitor switches on reduced motion while it plays, stop and leave the choice with them.
  reduce.addEventListener("change", () => { if (reduce.matches) { userPaused = true; pause(); } });

  toggle.hidden = false;
  if (reduce.matches || saveData) {
    userPaused = true;
    setButton(false);          // poster only; the button starts it on request
  } else {
    setButton(true);
    // Start after the page has finished loading, so the video never competes with
    // the poster, fonts and text for bandwidth on first paint.
    const start = () => { if (!userPaused) play(); };
    if (document.readyState === "complete") start();
    else addEventListener("load", start, { once: true });
  }
}
