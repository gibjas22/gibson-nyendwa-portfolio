// desk.js: The Mixing Desk.
// Seven channel faders and a master. Each channel is a strand of my life: moving its fader up
// reveals its story, and once the sound is switched on, fades in its ambient loop.
// Push the Studio fader to 100 and hold it there to unlock The Unsaid Sound.
//
// Content lives in channels.js. Audio never autoplays: nothing makes a sound until the visitor
// presses "Turn the sound on". Stories work with the sound off, with a keyboard, and without hover.

import { channels, desk } from "./channels.js";

const root = document.getElementById("mixing-desk");
if (root) init();

function init() {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const studio = channels.find(c => c.unlock);
  const levels = Object.fromEntries(channels.map(c => [c.id, 0]));
  let master = desk.masterDefault;
  let active = null;           // channel whose story is showing
  let unlocked = false;
  let holdTimer = null;
  let mixTimers = [];

  // ---------- Markup ----------
  root.dataset.state = "ready";
  root.innerHTML = `
    <div class="desk-top">
      <button type="button" class="button desk-power" id="desk-power" aria-pressed="false">
        <span class="power-dot" aria-hidden="true"></span><span class="power-label">Turn the sound on</span>
      </button>
      <div class="desk-actions">
        <button type="button" class="button button-quiet" id="desk-mix">Mix my story</button>
        <button type="button" class="button button-quiet" id="desk-reset">All faders down</button>
      </div>
      <p class="desk-status" id="desk-status" role="status" aria-live="polite">Sound is off. The stories still work.</p>
    </div>
    <div class="desk-board" role="group" aria-label="Mixing desk faders">
      ${channels.map(c => strip(c)).join("")}
      <div class="strip strip-master" style="--c:var(--master-strip)">
        <div class="meter" aria-hidden="true">${"<i></i>".repeat(10)}</div>
        <label class="strip-fader">
          <span class="visually-hidden">Master volume</span>
          <input type="range" class="fader" id="fader-master" min="0" max="100" step="1" value="${master}"
            aria-valuetext="Master, ${master} percent">
        </label>
        <output class="strip-value" for="fader-master">${master}</output>
        <span class="strip-label">Master</span>
      </div>
    </div>
    <div class="desk-story" id="desk-story">
      <p class="desk-story-empty">${esc(desk.prompt)}</p>
    </div>`;

  function strip(c) {
    const locked = !!c.unlock;
    return `
      <div class="strip${locked ? " strip-locked" : ""}" data-id="${c.id}" style="--c:${c.colour}">
        <div class="meter" aria-hidden="true">${"<i></i>".repeat(10)}</div>
        <label class="strip-fader">
          <span class="visually-hidden">${esc(c.label)} fader${locked ? ". Push to 100 and hold for two seconds to unlock." : ""}</span>
          <input type="range" class="fader" id="fader-${c.id}" data-id="${c.id}" min="0" max="100" step="1" value="0"
            aria-valuetext="${esc(c.label)}, 0 percent">
        </label>
        <output class="strip-value" for="fader-${c.id}">0</output>
        <span class="strip-label">${locked ? '<span class="lock" aria-hidden="true"></span>' : ""}${esc(c.label)}</span>
        ${locked ? '<span class="hold-ring" aria-hidden="true"></span>' : ""}
      </div>`;
  }

  const $ = id => document.getElementById(id);
  const storyBox = $("desk-story"), status = $("desk-status"), power = $("desk-power");
  const faders = [...root.querySelectorAll(".fader[data-id]")];
  const masterFader = $("fader-master");

  // ---------- Stories ----------
  // On phones the desk is a list of rows, so the story appears straight after the row that was moved
  // (without moving focus). On wider screens it stays below the board.
  const narrow = matchMedia("(max-width: 760px)");
  const board = root.querySelector(".desk-board");
  function placeStory() {
    const strip = active && narrow.matches ? root.querySelector(`.strip[data-id="${active}"]`) : null;
    if (strip) { if (strip.nextElementSibling !== storyBox) strip.after(storyBox); }
    else if (board.nextElementSibling !== storyBox) board.after(storyBox);
  }
  narrow.addEventListener?.("change", placeStory);
  // A short, debounced announcement of the story title, rather than one for every slider step.
  const announcer = document.createElement("p");
  announcer.className = "visually-hidden"; announcer.setAttribute("aria-live", "polite");
  root.appendChild(announcer);
  let announceTimer = 0;
  function announce(text) { clearTimeout(announceTimer); announceTimer = setTimeout(() => { announcer.textContent = text; }, 700); }

  function showStory(id) {
    if (id === active) return;
    active = id;
    placeStory();
    const ch = channels.find(x => x.id === id);
    if (ch) announce(`Story: ${ch.unlock && !unlocked ? ch.label + ", locked" : (ch.unlock && unlocked ? ch.unlock.title : ch.title)}`);
    const c = channels.find(x => x.id === id);
    if (!c) { storyBox.innerHTML = `<p class="desk-story-empty">${esc(desk.prompt)}</p>`; return; }
    if (c.unlock && !unlocked) {
      storyBox.innerHTML = `
        <article class="story-card" style="--c:${c.colour}">
          <p class="story-kicker"><span class="lock" aria-hidden="true"></span>${esc(c.label)}, locked</p>
          <h3>Something is behind this fader</h3>
          <p>Push the Studio fader all the way to 100 and hold it there for two seconds.</p>
        </article>`;
      return;
    }
    const u = c.unlock && unlocked ? c.unlock : null;
    storyBox.innerHTML = u ? unlockCard(c, u) : `
      <article class="story-card" style="--c:${c.colour}">
        <p class="story-kicker">${esc(c.label)}</p>
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.story)}</p>
        ${c.link ? `<p><a class="text-link" href="${esc(c.link.href)}"${c.link.href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${esc(c.link.text)}</a></p>` : ""}
      </article>`;
    if (u) wireUnlockCard();
  }

  function unlockCard(c, u) {
    return `
      <article class="story-card story-unlocked" style="--c:${c.colour}">
        <p class="story-kicker">Unlocked</p>
        <h3>${esc(u.title)}</h3>
        <p>${esc(u.story)}</p>
        <div class="unlock-player" id="unlock-player">
          <button type="button" class="button" id="unlock-play">Play ${esc(u.videoTitle || "the track")}</button>
          <p class="evidence">Loads the video from YouTube when you press play. Nothing loads before that.</p>
        </div>
        <p class="story-links">
          <a class="text-link" href="${esc(u.link.href)}" target="_blank" rel="noopener">${esc(u.link.text)}</a>
          ${u.link2 ? `<a class="text-link" href="${esc(u.link2.href)}" target="_blank" rel="noopener">${esc(u.link2.text)}</a>` : ""}
        </p>
      </article>`;
  }

  function wireUnlockCard() {
    const btn = $("unlock-play");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const u = studio.unlock;
      duck(true);
      window.dispatchEvent(new CustomEvent("site-media-play", { detail: { source: "desk" } }));
      const box = $("unlock-player");
      box.innerHTML = `<div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(u.video)}?autoplay=1&rel=0"
        title="${esc(u.videoTitle || "The Unsaid Sound")}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe></div>
        <p class="evidence">The desk is silent while the video is open, so you only hear the track. <button type="button" class="text-link" id="unduck">Bring the desk back up</button></p>`;
      $("unduck").addEventListener("click", () => duck(false));
    });
  }

  // ---------- Faders ----------
  function setFader(input, value, { silent = false } = {}) {
    const id = input.dataset.id;
    value = Math.max(0, Math.min(100, Math.round(value)));
    input.value = value;
    input.style.setProperty("--v", value + "%");
    const c = channels.find(x => x.id === id);
    input.setAttribute("aria-valuetext", `${c.label}, ${value} percent`);
    input.closest(".strip").querySelector(".strip-value").textContent = value;
    input.closest(".strip").classList.toggle("is-up", value > 0);
    levels[id] = value;
    applyGain(id);
    if (!silent) {
      if (value > 0) showStory(id);
      else if (active === id) {
        const next = channels.filter(x => levels[x.id] > 0).sort((a, b) => levels[b.id] - levels[a.id])[0];
        showStory(next ? next.id : null);
      }
    }
    if (c.unlock) checkHold(value);
  }

  faders.forEach(f => {
    f.style.setProperty("--v", "0%");
    f.addEventListener("input", () => { cancelMix(); setFader(f, +f.value); });
    f.addEventListener("focus", () => { if (+f.value > 0) showStory(f.dataset.id); });
  });
  masterFader.style.setProperty("--v", master + "%");
  masterFader.addEventListener("input", () => {
    master = +masterFader.value;
    masterFader.style.setProperty("--v", master + "%");
    masterFader.setAttribute("aria-valuetext", `Master, ${master} percent`);
    masterFader.closest(".strip").querySelector(".strip-value").textContent = master;
    applyMaster();
  });

  // ---------- Studio unlock: hold at 100 ----------
  function checkHold(value) {
    if (unlocked) return;
    const s = root.querySelector(".strip-locked");
    if (value >= 100 && !holdTimer) {
      s.classList.add("arming");
      s.style.setProperty("--hold", (studio.unlock.holdMs || 2000) + "ms");
      status.textContent = "Hold it there...";
      holdTimer = setTimeout(doUnlock, studio.unlock.holdMs || 2000);
    } else if (value < 100 && holdTimer) {
      clearTimeout(holdTimer); holdTimer = null;
      s.classList.remove("arming");
      status.textContent = "Not quite. Push Studio to 100 and hold it for two seconds.";
    }
  }

  function doUnlock() {
    holdTimer = null; unlocked = true;
    const s = root.querySelector(".strip-locked");
    s.classList.remove("arming", "strip-locked"); s.classList.add("strip-unlocked");
    root.classList.add("is-unlocked");
    status.textContent = "Unlocked: The Unsaid Sound.";
    active = null; showStory(studio.id);
    if (!reduceMotion) { root.classList.add("flash"); setTimeout(() => root.classList.remove("flash"), 900); }
  }

  // ---------- Presets ----------
  // A manual move, a fresh mix or reset takes ownership immediately. Pending preset steps must
  // not lift faders again after reset or overwrite the channel the visitor is adjusting.
  function cancelMix() {
    mixTimers.forEach(clearTimeout);
    mixTimers = [];
  }
  $("desk-mix").addEventListener("click", () => {
    cancelMix();
    const mix = { classroom: 70, workshop: 55, security: 45, agency: 60, community: 40, machine: 50, studio: 65 };
    const order = channels.map(c => c.id);
    if (reduceMotion) { order.forEach(id => setFader($("fader-" + id), mix[id] ?? 50, { silent: true })); showStory("classroom"); return; }
    mixTimers = order.map((id, i) => setTimeout(() => setFader($("fader-" + id), mix[id] ?? 50), i * 140));
  });
  $("desk-reset").addEventListener("click", () => {
    cancelMix();
    faders.forEach(f => setFader(f, 0, { silent: true }));
    showStory(null);
  });

  // ---------- Audio (Web Audio API, starts only on the visitor's click) ----------
  let ctx = null, masterGain = null, masterAnalyser = null, duckGain = null;
  const nodes = {};   // id -> { gain, analyser }
  let soundOn = false, loading = false, raf = 0;

  power.addEventListener("click", async () => {
    if (loading) return;
    if (!ctx) { await startAudio(); return; }
    soundOn = !soundOn;
    if (soundOn) { await ctx.resume(); } else { await ctx.suspend(); }
    reflectPower();
  });

  function reflectPower() {
    power.setAttribute("aria-pressed", String(soundOn));
    power.querySelector(".power-label").textContent = soundOn ? "Sound on" : "Turn the sound on";
    root.classList.toggle("is-live", soundOn);
    status.textContent = soundOn ? "Sound on. Push a fader up to bring its channel in." : "Sound is off. The stories still work.";
    if (soundOn && !reduceMotion) loop(); else { cancelAnimationFrame(raf); clearMeters(); }
  }

  async function startAudio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { status.textContent = "This browser cannot play the desk audio. The stories still work."; return; }
    loading = true;
    status.textContent = "Loading the channels...";
    ctx = new AC();
    masterGain = ctx.createGain(); masterGain.gain.value = master / 100;
    duckGain = ctx.createGain(); duckGain.gain.value = 1;
    masterAnalyser = ctx.createAnalyser(); masterAnalyser.fftSize = 512;
    masterGain.connect(duckGain).connect(masterAnalyser).connect(ctx.destination);

    const startAt = ctx.currentTime + 0.25;
    const failed = []; let placeholder = false;
    await Promise.all(channels.map(async c => {
      const gain = ctx.createGain(); gain.gain.value = 0;
      const analyser = ctx.createAnalyser(); analyser.fftSize = 256;
      gain.connect(analyser).connect(masterGain);
      nodes[c.id] = { gain, analyser };
      try {
        if (c.stemReady === false) throw new Error("placeholder");
        const res = await fetch(c.stem);
        if (!res.ok) throw new Error("missing");
        const buf = await ctx.decodeAudioData(await res.arrayBuffer());
        const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
        src.connect(gain); src.start(startAt);
      } catch {
        if (c.unlock) { synthPad(gain, startAt); placeholder = true; }   // Studio placeholder until the master stem is added
        else failed.push(c.label);
      }
      applyGain(c.id, true);
    }));
    await ctx.resume();
    loading = false; soundOn = true;
    reflectPower();
    const notes = [];
    if (failed.length) notes.push(`${failed.join(", ")} could not load and will stay silent.`);
    if (placeholder) notes.push("Studio plays a placeholder pad until the final track is added.");
    if (notes.length) status.textContent += " " + notes.join(" ");
  }

  // A soft chord pad generated in the browser, used for the Studio channel until its stem exists.
  function synthPad(out, t) {
    const filter = ctx.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 900; filter.Q.value = 0.7;
    const padGain = ctx.createGain(); padGain.gain.value = 0.08;
    filter.connect(padGain).connect(out);
    [110, 164.81, 220, 261.63, 329.63].forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = i % 2 ? "triangle" : "sine"; o.frequency.value = f;
      o.detune.value = (i - 2) * 4;
      o.connect(filter); o.start(t);
    });
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.08;
    const depth = ctx.createGain(); depth.gain.value = 350;
    lfo.connect(depth).connect(filter.frequency); lfo.start(t);
  }

  function applyGain(id, immediate = false) {
    if (!ctx || !nodes[id]) return;
    const g = nodes[id].gain.gain, now = ctx.currentTime;
    const target = Math.pow(levels[id] / 100, 2);   // perceptual curve
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(target, now + (immediate ? 0.01 : desk.rampSeconds));
  }
  function applyMaster() {
    if (!ctx) return;
    const g = masterGain.gain, now = ctx.currentTime;
    g.cancelScheduledValues(now); g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(Math.pow(master / 100, 2), now + desk.rampSeconds);
  }
  function duck(on) {
    if (!ctx) return;
    const g = duckGain.gain, now = ctx.currentTime;
    g.cancelScheduledValues(now); g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(on ? desk.duckLevel : 1, now + 0.6);
  }

  // ---------- Meters ----------
  const data = new Uint8Array(256);
  function level(analyser) {
    analyser.getByteTimeDomainData(data);
    let sum = 0;
    for (let i = 0; i < analyser.fftSize && i < data.length; i++) { const v = (data[i] - 128) / 128; sum += v * v; }
    return Math.min(1, Math.sqrt(sum / Math.min(analyser.fftSize, data.length)) * 4);
  }
  function paint(meter, v) {
    const lit = Math.round(v * 10);
    meter.querySelectorAll("i").forEach((seg, i) => seg.classList.toggle("on", i < lit));
  }
  function loop() {
    cancelAnimationFrame(raf);
    const tick = () => {
      root.querySelectorAll(".strip[data-id]").forEach(s => paint(s.querySelector(".meter"), level(nodes[s.dataset.id].analyser)));
      paint(root.querySelector(".strip-master .meter"), level(masterAnalyser));
      raf = requestAnimationFrame(tick);
    };
    tick();
  }
  function clearMeters() { root.querySelectorAll(".meter i.on").forEach(i => i.classList.remove("on")); }

  // Another player on the page started (the podcast): pause the desk and close the Studio video,
  // so two things never play at once. "Turn the sound on" brings the desk back.
  window.addEventListener("site-media-play", ev => {
    if (ev.detail?.source === "desk") return;
    if (document.querySelector("#unlock-player iframe")) { duck(false); active = null; showStory(studio.id); }
    if (ctx && soundOn) {
      soundOn = false; ctx.suspend(); reflectPower();
      status.textContent = "Desk paused while a video plays. Press \u201cTurn the sound on\u201d to bring it back.";
    }
  });

  // Pause when the tab is hidden, to save battery.
  document.addEventListener("visibilitychange", () => {
    if (!ctx || !soundOn) return;
    if (document.hidden) { ctx.suspend(); cancelAnimationFrame(raf); }
    else { ctx.resume(); if (!reduceMotion) loop(); }
  });
}
