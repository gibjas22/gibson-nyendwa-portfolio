// superpowers-kinetic.js: the kinetic typography banner at the end of the SuperPowers section.
//
// The wording lives in index.html (the .kin-static list), which is also what screen readers, visitors
// without JavaScript and visitors who prefer reduced motion get. This script builds an aria-hidden
// animated copy from that list and plays it on one looping timeline (Web Animations API), so Pause
// freezes every element exactly where it is and Play carries on from the same point.
//
// Sequence (about 27 s, then it loops):
//   1. Opening: "Here is" / "Gibson Nyendwa's" / "SuperPowers" arrive in turn, then hold for about 5 s.
//   2. The six SuperPowers, one at a time, coming forward through a moving perspective grid, each with
//      three supporting words, while a ring of words turns slowly behind.
//   3. Closing: all six slide in from alternate sides into a stacked composition, hold, fade back to 1.
// Timings are in TIMING below; fonts are only applied once the banner is near the screen.

const TIMING = {
  openIn: [300, 1900],        // the three opening parts arrive within this window
  openHoldUntil: 6900,        // full message held from ~1.9 s to here (about 5 s)
  openOut: 7500,
  powerStart: 7700,           // first SuperPower
  powerEach: 2200,            // each SuperPower is on screen for this long
  closeIn: 600,               // closing rows slide in over this long (staggered)
  closeHold: 4600,            // closing composition held
  fadeOut: 700
};

const root = document.getElementById("kin");
if (root) init(root);

function init(root) {
  const stage = root.querySelector(".kin-stage");
  const toggle = root.querySelector(".kin-toggle");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const openParts = [...root.querySelectorAll(".kin-open > span")].map(s => ({ text: s.textContent, style: s.dataset.style, colour: s.dataset.colour }));
  const powers = [...root.querySelectorAll(".kin-list > li")].map(li => ({
    text: li.textContent.trim(), style: li.dataset.style, colour: li.dataset.colour,
    words: (li.dataset.words || "").split("|").map(w => w.trim()).filter(Boolean).slice(0, 3)
  }));
  if (!openParts.length || !powers.length) return;

  const T = TIMING;
  const powersEnd = T.powerStart + powers.length * T.powerEach;
  const closeStart = powersEnd + 150;
  const LOOP = closeStart + T.closeIn + powers.length * 120 + T.closeHold + T.fadeOut + 300;
  // Supporting words are small, so they use only the palette colours that pass 4.5:1 on the banner;
  // violet and magenta (about 3.5:1 and 4.4:1) are kept for large phrases.
  const SUPPORT = ["turquoise", "yellow", "orange", "blue"];
  const RING = ["turquoise", "yellow", "orange", "blue", "magenta", "violet"];

  let anims = [], userPaused = false, inView = false, built = false;

  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const piece = (text, style, colour, cls = "") => el("span", `kin-w kin-${style} kin-c-${colour} ${cls}`.trim(), text);

  // One element's keyframes across the whole loop: frames = [[ms, {opacity, transform}], ...]
  function track(node, frames, extra = {}) {
    const k = frames.map(([t, f]) => ({ offset: Math.min(1, Math.max(0, t / LOOP)), ...f }));
    if (k[0].offset > 0) k.unshift({ ...k[0], offset: 0 });
    if (k[k.length - 1].offset < 1) k.push({ ...k[k.length - 1], offset: 1 });
    anims.push(node.animate(k, { duration: LOOP, iterations: Infinity, easing: "linear", fill: "both", ...extra }));
  }
  const ease = "cubic-bezier(.2,.7,.2,1)";
  const hidden = { opacity: 0 };

  function build() {
    if (built) return; built = true;
    // Background layers: perspective grid floor and a ring of supporting words
    const floor = el("div", "kin-floor"); const plane = el("div", "kin-plane"); floor.appendChild(plane); stage.appendChild(floor);
    const ringWords = powers.flatMap(p => p.words);
    const ring = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    ring.setAttribute("viewBox", "0 0 400 400"); ring.setAttribute("class", "kin-ring");
    ring.innerHTML = `<defs><path id="kin-circle" d="M200,200 m-160,0 a160,160 0 1,1 320,0 a160,160 0 1,1 -320,0"/></defs><text><textPath href="#kin-circle"></textPath></text>`;
    const tp = ring.querySelector("textPath");
    ringWords.forEach((w, i) => { const t = document.createElementNS("http://www.w3.org/2000/svg", "tspan"); t.setAttribute("class", `kin-c-${RING[i % RING.length]}`); t.textContent = w + "  ·  "; tp.appendChild(t); });
    stage.appendChild(ring);

    // 1. Opening
    const open = el("div", "kin-scene kin-opening");
    openParts.forEach(p => open.appendChild(piece(p.text, p.style, p.colour, "kin-open-part")));
    stage.appendChild(open);

    // 2. One scene per SuperPower
    const scenes = powers.map((p, i) => {
      const sc = el("div", "kin-scene kin-power");
      sc.appendChild(piece(p.text, p.style, p.colour, "kin-phrase"));
      p.words.forEach((w, j) => sc.appendChild(piece(w, j === 1 ? "italic" : "condensed", SUPPORT[(i + j + 1) % SUPPORT.length], `kin-support kin-s${j}`)));
      stage.appendChild(sc); return sc;
    });

    // 3. Closing composition
    const close = el("div", "kin-scene kin-close");
    const rows = powers.map(p => { const r = el("div", "kin-row"); r.appendChild(piece(p.text, p.style, p.colour)); close.appendChild(r); return r; });
    stage.appendChild(close);

    // ---- timeline ----
    const [o0, o1] = T.openIn; const parts = open.querySelectorAll(".kin-open-part"); const step = (o1 - o0 - 700) / Math.max(1, parts.length - 1);
    const fromOpen = [ "translateX(-28%)", "translateY(60%)", "scale(.55)" ];
    parts.forEach((n, i) => {
      const a = o0 + i * step, b = a + 700, out = T.openHoldUntil + i * 90;
      track(n, [[0, { opacity: 0, transform: fromOpen[i % 3], easing: ease }], [a, { opacity: 0, transform: fromOpen[i % 3], easing: ease }], [b, { opacity: 1, transform: "none" }],
        [out, { opacity: 1, transform: "none", easing: "ease-in" }], [out + 500, { opacity: 0, transform: "translateX(-18%)" }]]);
    });
    scenes.forEach((sc, i) => {
      const s = T.powerStart + i * T.powerEach, dir = i % 2 ? -1 : 1;
      const ph = sc.querySelector(".kin-phrase");
      track(ph, [[0, { ...hidden, transform: "translateZ(-420px) translateY(-12%)" }], [s, { opacity: 0, transform: "translateZ(-420px) translateY(-12%)", easing: ease }],
        [s + 550, { opacity: 1, transform: "none" }], [s + T.powerEach - 420, { opacity: 1, transform: "none", easing: "ease-in" }],
        [s + T.powerEach - 60, { opacity: 0, transform: `translateX(${dir * 22}%)` }]]);
      sc.querySelectorAll(".kin-support").forEach((w, j) => {
        const a = s + 250 + j * 120;
        track(w, [[0, hidden], [a, { opacity: 0, transform: "translateY(10px)", easing: ease }], [a + 450, { opacity: 1, transform: "none" }],
          [s + T.powerEach - 380, { opacity: 1, transform: "none" }], [s + T.powerEach - 100, { opacity: 0, transform: "none" }]]);
      });
    });
    const bgIn = T.openOut - 200, bgOut = powersEnd + 300;
    track(floor, [[0, hidden], [bgIn, hidden], [bgIn + 800, { opacity: 1 }], [bgOut, { opacity: 1 }], [bgOut + 700, hidden]]);
    track(ring, [[0, hidden], [bgIn, hidden], [bgIn + 800, { opacity: .26 }], [bgOut, { opacity: .26 }], [bgOut + 700, hidden]]);
    anims.push(plane.animate([{ backgroundPosition: "0 0" }, { backgroundPosition: "0 64px" }], { duration: 1600, iterations: Infinity }));
    anims.push(ring.animate([{ transform: "translate(-50%,-50%) rotate(0deg)" }, { transform: "translate(-50%,-50%) rotate(360deg)" }], { duration: 48000, iterations: Infinity }));
    rows.forEach((r, i) => {
      const a = closeStart + i * 120, from = i % 2 ? "translateX(40%)" : "translateX(-40%)", out = LOOP - T.fadeOut - 300;
      track(r, [[0, { opacity: 0, transform: from }], [a, { opacity: 0, transform: from, easing: ease }], [a + T.closeIn, { opacity: 1, transform: "none" }],
        [out, { opacity: 1, transform: "none" }], [out + T.fadeOut, { opacity: 0, transform: "none" }]]);
    });
    track(close, [[0, { opacity: 1 }]]);   // keeps the container in the same timeline (rules fade with the rows)
  }

  function playing() { return !userPaused && inView && !document.hidden; }
  function update() {
    if (!built) return;
    const go = playing();
    anims.forEach(a => (go ? a.play() : a.pause()));
  }
  function setLabel() { toggle.textContent = userPaused ? "Play animation" : "Pause animation"; toggle.dataset.state = userPaused ? "paused" : "playing"; }

  function start() {
    root.classList.add("is-animated");
    build();
    anims.forEach(a => a.pause());
    toggle.hidden = false; setLabel(); update();
  }
  function stop() {
    anims.forEach(a => a.cancel()); anims = []; stage.textContent = ""; built = false;
    root.classList.remove("is-animated"); toggle.hidden = true;
  }

  toggle.addEventListener("click", () => { userPaused = !userPaused; setLabel(); update(); });
  document.addEventListener("visibilitychange", update);

  // Fonts and the animation only start once the banner is close to the screen.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { if (e.isIntersecting) root.classList.add("is-near"); }, { rootMargin: "800px 0px" }).observe(root);
    new IntersectionObserver(([e]) => { inView = e.isIntersecting; update(); }, { threshold: .1 }).observe(root);
  } else { root.classList.add("is-near"); inView = true; }

  const apply = () => (reduce.matches ? stop() : start());
  reduce.addEventListener("change", apply);
  apply();
}
