// text-banner.js: the slow moving "Twenty years of showing up" banner in the About section.
//
// The real <h2> stays in the page as the one accessible heading. Extra copies used to keep the
// loop seamless are aria-hidden. Each time a copy leaves the banner it is moved back to the far
// side, out of view, and given the next colour pass, so colours never change while in sight.
//
// Settings live on the .text-banner element in index.html:
//   data-speed      CSS pixels per second (default 36)
//   data-direction  "right" (words travel to the right) or "left"
//   data-gap        "auto" (one sentence enters as the last one leaves) or a number of px
// Colours and sizes are CSS custom properties in css/styles.css (search "Moving text banner").
// With reduced motion, without JavaScript and in print the heading is static and wraps normally.

const PALETTE = ["tb-orange", "tb-white", "tb-sky"];   // pass 1 order: Twenty, years, of, showing, up
const HOLD_MS = 1500;      // readable pause before the first movement
const EASE_MS = 2200;      // how long movement takes to reach full speed
const RESUME_EASE_MS = 700;
const MIN_GAP_EM = 2.5;    // never less than this much space between copies
const EDGE = 22;           // start just inside the soft fade at the banner edges (px)

const banner = document.getElementById("about-banner");
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

if (banner) init(banner);

function init(root) {
  const viewport = root.querySelector(".text-banner-viewport");
  const heading = root.querySelector(".text-banner-line");
  const toggle = root.querySelector(".text-banner-toggle");
  const speed = Math.max(5, Number(root.dataset.speed) || 36);
  const dir = root.dataset.direction === "left" ? -1 : 1;

  let copies = [];          // { el, x, pass }
  let D = 0, W = 0, T = 0;  // spacing between copies, viewport width, text width
  let nextPass = 0;
  let raf = 0, last = 0;
  let rampStart = 0, rampMs = EASE_MS, holdUntil = 0;
  let userPaused = false, hoverPaused = false, offscreen = false, running = false;

  const paint = (el, pass) => {
    el.querySelectorAll(".tb-w").forEach((w, i) => {
      w.classList.remove(...PALETTE);
      w.classList.add(PALETTE[(i + pass) % 3]);
    });
  };

  function layout(keepLead) {
    const lead = keepLead && copies.length ? copies.reduce((a, c) => (dir > 0 ? (c.x > a.x ? c : a) : (c.x < a.x ? c : a))) : null;
    const leadX = lead ? lead.x : (dir > 0 ? EDGE : 0);
    const leadPass = lead ? lead.pass : 0;
    copies.filter(c => c.el !== heading).forEach(c => c.el.remove());
    W = viewport.clientWidth;
    T = heading.scrollWidth;
    const em = parseFloat(getComputedStyle(heading).fontSize) || 32;
    const gapSetting = root.dataset.gap;
    const minGap = MIN_GAP_EM * em;
    const gap = gapSetting && gapSetting !== "auto" ? Math.max(Number(gapSetting) || minGap, minGap / 2) : Math.max(minGap, W - T);
    D = T + gap;
    const count = Math.ceil(W / D) + 1;
    copies = [];
    for (let k = 0; k < count; k++) {
      let el = heading;
      if (k > 0) {
        el = heading.cloneNode(true);
        el.removeAttribute("id");
        el.setAttribute("aria-hidden", "true");
        el.classList.add("text-banner-copy");
        viewport.appendChild(el);
      }
      const pass = (leadPass + k) % 3;
      paint(el, pass);
      copies.push({ el, x: leadX - dir * k * D, pass });
    }
    nextPass = (leadPass + count) % 3;
    place();
  }

  function place() {
    for (const c of copies) c.el.style.transform = `translate3d(${c.x.toFixed(2)}px,0,0)`;
  }

  function step(now) {
    raf = 0;
    if (!running) return;
    const dt = Math.min(64, now - (last || now));
    last = now;
    if (now >= holdUntil) {
      const t = Math.min(1, (now - Math.max(rampStart, holdUntil)) / rampMs);
      const ease = t * t * (3 - 2 * t);
      const dx = dir * speed * ease * dt / 1000;
      for (const c of copies) c.x += dx;
      // A copy that has fully left goes to the far side, out of view, with the next colours.
      for (const c of copies) {
        const gone = dir > 0 ? c.x > W : c.x + T < 0;
        if (gone) {
          const far = copies.reduce((a, b) => (dir > 0 ? (b.x < a.x ? b : a) : (b.x > a.x ? b : a)));
          c.x = far.x - dir * D;
          c.pass = nextPass;
          nextPass = (nextPass + 1) % 3;
          paint(c.el, c.pass);
        }
      }
      place();
    }
    raf = requestAnimationFrame(step);
  }

  function update() {
    const should = !userPaused && !hoverPaused && !offscreen && !document.hidden;
    if (should && !running) {
      running = true; last = 0;
      const now = performance.now();
      if (rampStart) { rampStart = now; rampMs = RESUME_EASE_MS; }
      else { holdUntil = now + HOLD_MS; rampStart = now; rampMs = EASE_MS; }
      if (!raf) raf = requestAnimationFrame(step);
    } else if (!should && running) {
      running = false;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    }
  }

  function setLabel() {
    toggle.textContent = userPaused ? "Resume animation" : "Pause animation";
    toggle.dataset.state = userPaused ? "paused" : "playing";
  }

  function start() {
    root.classList.add("is-moving");
    toggle.hidden = false;
    setLabel();
    layout(false);
    update();
  }

  function stop() {
    running = false;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    copies.filter(c => c.el !== heading).forEach(c => c.el.remove());
    copies = [];
    heading.style.transform = "";
    paint(heading, 0);
    root.classList.remove("is-moving");
    toggle.hidden = true;
    rampStart = 0;
  }

  toggle.addEventListener("click", () => { userPaused = !userPaused; setLabel(); update(); });

  // Resting a mouse pointer on the words also pauses them (so they can be read or selected).
  viewport.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") { hoverPaused = true; update(); } });
  viewport.addEventListener("pointerleave", e => { if (e.pointerType === "mouse") { hoverPaused = false; update(); } });

  // Do no work while the banner is off screen or the tab is hidden.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => { offscreen = !entry.isIntersecting; update(); }).observe(root);
  }
  document.addEventListener("visibilitychange", update);

  let resizeTimer = 0, lastW = 0;
  new ResizeObserver(() => {
    if (!root.classList.contains("is-moving")) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (viewport.clientWidth === lastW) return;
      lastW = viewport.clientWidth;
      layout(true);
    }, 150);
  }).observe(viewport);

  const apply = () => (motionQuery.matches ? stop() : start());
  motionQuery.addEventListener("change", apply);
  // Wait for the heading font so the measured text width is right.
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => { lastW = viewport.clientWidth; apply(); });
}
