// hero-motion.js: the moving backdrop behind the home page hero.
//
// Seven waveform ribbons, one per mixing-desk channel and in the same channel colours, laid out
// in perspective so they recede like a 3D sound landscape. They drift slowly and lean towards the
// pointer. No libraries, no network requests, nothing to download.
//
// Motion rules, matching the rest of the site:
// - Visitors who ask for reduced motion, or have Data Saver on, get one still frame.
// - It stops while the hero is off screen and while the tab is hidden, so it costs nothing then.
// - Colours are read from the theme (--ch-* variables) and refresh when Appearance changes.
// - Decorative only: the canvas is aria-hidden and never takes focus.

const canvas = document.getElementById("hero-motion");
if (canvas && canvas.getContext) init(canvas);

function init(canvas) {
  const ctx = canvas.getContext("2d");
  const hero = canvas.closest(".hero") || canvas.parentElement;
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const CHANNELS = ["--ch-classroom", "--ch-workshop", "--ch-security", "--ch-agency", "--ch-community", "--ch-machine", "--ch-studio"];

  let w = 0, h = 0, dpr = 1, colours = [], light = false;
  let raf = 0, last = 0, t = 0, visible = true;
  const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

  function readTheme() {
    const cs = getComputedStyle(root);
    colours = CHANNELS.map(v => cs.getPropertyValue(v).trim() || "#B07CFF");
    const bg = cs.getPropertyValue("--bg-base").trim();
    light = luminance(bg) > 0.5;
    canvas.classList.toggle("is-light", light);
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, r.width); h = Math.max(1, r.height);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  // One ribbon per channel, each made of fine strands so it reads as a surface with volume.
  // z = 0 is the far back, z = 1 the nearest; far ribbons pinch towards a vanishing point.
  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = light ? "source-over" : "lighter";
    const n = colours.length;
    const strands = w < 600 ? 4 : 7;
    const steps = w < 600 ? 60 : 120;
    const lean = (pointer.x - 0.5);                 // pointer swings the landscape sideways
    const tilt = (pointer.y - 0.5) * h * 0.08;      // and lifts or lowers the horizon
    const vx = w * (0.62 + lean * 0.08);            // vanishing point sits behind the photos
    const horizon = h * 0.2 + tilt * 0.5;
    const H = Math.min(h, w * 0.75);               // keeps waves in proportion on tall phone layouts

    for (let i = 0; i < n; i++) {
      const z = i / (n - 1);
      const p = 0.28 + z * 0.72;                     // perspective scale: far small, near large
      const base = horizon + (h * 0.92 - horizon) * Math.pow(z, 1.35) + tilt * (1 - z);
      const amp = H * 0.15 * p * (0.7 + 0.3 * Math.sin(t * 0.35 + i * 1.7)); // like a fader breathing
      const speed = 0.4 + i * 0.06;
      const alpha = (light ? 0.16 : 0.18) + z * (light ? 0.34 : 0.5);

      for (let k = 0; k < strands; k++) {
        const off = (k / (strands - 1) - 0.5);       // -0.5 .. 0.5 across the ribbon
        const spread = H * 0.028 * p;
        ctx.beginPath();
        for (let s = 0; s <= steps; s++) {
          const u = s / steps;
          const x = vx + (u * w * 1.2 - w * 0.1 - vx) * (0.55 + 0.45 * p);
          // Quiet on the left behind the words, full on the right behind the photos.
          const env = 0.12 + 0.88 * smooth(0.18, 0.8, x / w);
          const ph = u * 6.0 + t * speed + i * 0.9 + lean * 2.5 + off * 0.9;
          const y = base + off * spread + amp * env * (
            Math.sin(ph) * 0.62 +
            Math.sin(u * 13.0 - t * speed * 1.3 + i * 2.3 + off * 1.6) * 0.26 +
            Math.sin(u * 27.0 + t * speed * 0.7 + i) * 0.12
          );
          s ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        const edge = 1 - Math.abs(off) * 1.3;        // brighter in the middle of the ribbon
        ctx.strokeStyle = withAlpha(colours[i], alpha * (0.45 + 0.55 * edge));
        ctx.lineWidth = 0.7 + z * 1.5;
        ctx.stroke();
      }
    }
    ctx.globalCompositeOperation = "source-over";
  }

  const still = () => reduce.matches || saveData;

  function frame(now) {
    raf = 0;
    if (!visible || still()) return;
    if (now - last >= 33) {                          // about 30 frames a second is plenty for slow drift
      const dt = Math.min(0.1, (now - last) / 1000 || 0.033);
      last = now; t += dt;
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      draw();
    }
    raf = requestAnimationFrame(frame);
  }
  function start() { if (!raf && visible && !still()) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

  hero.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    const r = hero.getBoundingClientRect();
    pointer.tx = (e.clientX - r.left) / r.width;
    pointer.ty = (e.clientY - r.top) / r.height;
  });
  hero.addEventListener("pointerleave", () => { pointer.tx = 0.5; pointer.ty = 0.5; });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }).observe(hero);
  }
  document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); else start(); });
  reduce.addEventListener?.("change", () => { if (still()) { stop(); draw(); } else start(); });
  new MutationObserver(() => { readTheme(); draw(); }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas); else addEventListener("resize", resize);

  t = 4;                                            // start mid-motion so the still frame looks composed
  readTheme(); resize();
  canvas.classList.add("is-ready");
  start();
}

function smooth(a, b, x) { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); }

function parse(c) {
  const m = c.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) {
    let s = m[1]; if (s.length === 3) s = s.replace(/./g, ch => ch + ch);
    return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
  }
  const r = c.match(/rgba?\(([^)]+)\)/);
  if (r) return r[1].split(/[ ,/]+/).slice(0, 3).map(Number);
  return [176, 124, 255];
}
function withAlpha(c, a) { const [r, g, b] = parse(c); return `rgba(${r},${g},${b},${a.toFixed(3)})`; }
function luminance(c) { const [r, g, b] = parse(c || "#000"); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; }
