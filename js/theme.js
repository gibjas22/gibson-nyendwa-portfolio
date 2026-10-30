// theme.js: the Appearance control and the live schedule check (for visitors who choose Automatic).
// The first-visit chooser was removed on 30 October 2026: Purple is the default and the other looks
// are explicit choices here.
// The theme itself is set before paint by js/theme-boot.js; this module reuses its window.GNTheme
// API so there is one preference mechanism. Nothing here reloads the page, so scroll position,
// form input and any playing video or audio are left alone when the theme changes.

const T = window.GNTheme;
if (T) init();

function init() {
  const root = document.documentElement;
  const reduce = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  const canStore = T.storageAvailable();
  const OPTIONS = [
    { id: "purple", name: "Purple", note: "Deep purple with violet and magenta. The original look." },
    { id: "sky-blue", name: "Sky Blue", note: "Navy panels, sky-blue outlines and orange buttons." },
    { id: "white", name: "White", note: "Light pages with navy text and purple buttons." },
    { id: "auto", name: "Automatic", note: "Changes every 14 days: Purple, Sky Blue, then White." }
  ];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const dateText = iso => new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", timeZone: "UTC" });

  // ----- state -----
  const pref = () => (canStore ? T.read() : T.sessionPref);   // null = no saved preference (Purple, the default)
  let previewing = null;
  function render() {
    const p = pref(), theme = previewing || T.resolve(p);
    const before = root.getAttribute("data-theme");
    if (before && before !== theme && !reduce.matches) {
      root.classList.add("theme-switching");
      clearTimeout(render.t); render.t = setTimeout(() => root.classList.remove("theme-switching"), 220);
    }
    T.apply(theme, p);
    updateControls();
  }
  function save(value) {
    previewing = null;
    if (!(canStore && T.write(value))) T.sessionPref = value;  // still applies to this page view
    render();
  }

  // ----- Appearance button (header) and mobile menu entry -----
  const swatches = `<span class="theme-dots" aria-hidden="true"><i class="dot-purple"></i><i class="dot-sky-blue"></i><i class="dot-white"></i></span>`;
  // The button is in each page's header HTML (so the header does not shift when this script runs);
  // CSS hides it when JavaScript is off. Create it only if a page is missing it.
  let toggle = document.querySelector(".appearance-toggle");
  if (!toggle) {
    toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "appearance-toggle";
    toggle.setAttribute("aria-haspopup", "dialog");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "appearance-panel");
    toggle.innerHTML = `${swatches}<span class="appearance-label">Appearance</span>`;
    const topRight = document.querySelector(".top-right");
    if (topRight) topRight.insertBefore(toggle, topRight.firstChild);
  }

  const nav = document.getElementById("site-nav");
  const navEntry = document.createElement("button");
  navEntry.type = "button";
  navEntry.className = "nav-appearance";
  navEntry.setAttribute("aria-haspopup", "dialog");
  navEntry.setAttribute("aria-controls", "appearance-panel");
  navEntry.innerHTML = `${swatches}<span>Appearance</span><span class="nav-appearance-now"></span>`;
  if (nav) nav.appendChild(navEntry);

  // ----- Appearance panel (non-modal dialog) -----
  const panel = document.createElement("div");
  panel.id = "appearance-panel";
  panel.className = "appearance-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "false");
  panel.setAttribute("aria-labelledby", "appearance-title");
  panel.hidden = true;
  panel.innerHTML = `
    <div class="appearance-head">
      <h2 id="appearance-title">Appearance</h2>
      <button type="button" class="theme-close" data-close aria-label="Close appearance settings"><span aria-hidden="true">&times;</span></button>
    </div>
    <p class="appearance-status" id="appearance-status" aria-live="polite"></p>
    <fieldset class="theme-options">
      <legend class="visually-hidden">Choose a colour theme</legend>
      ${OPTIONS.map(o => `
      <label class="theme-option">
        <input type="radio" name="gn-appearance" value="${o.id}">
        <span class="theme-preview preview-${o.id}" aria-hidden="true"><i></i><b></b><em></em></span>
        <span class="theme-option-text"><span class="theme-option-name">${esc(o.name)}</span><span class="theme-option-note">${esc(o.note)}</span></span>
        <span class="theme-check" aria-hidden="true"></span>
      </label>`).join("")}
    </fieldset>
    <p class="appearance-note">${canStore
      ? "Your choice is saved in this browser only, so it carries across pages and future visits here. It does not follow you to other devices."
      : "Your browser is not letting this site save settings, so your choice lasts until you leave this page."}</p>`;
  document.body.appendChild(panel);

  let returnFocus = null;
  function openPanel(from) {
    returnFocus = from || toggle;
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    navEntry.setAttribute("aria-expanded", "true");
    position();
    const checked = panel.querySelector("input:checked") || panel.querySelector("input");
    checked.focus();
  }
  function closePanel(restore = true) {
    if (panel.hidden) return;
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    navEntry.setAttribute("aria-expanded", "false");
    if (restore && returnFocus && document.contains(returnFocus) && isVisible(returnFocus)) returnFocus.focus();
    else if (restore) toggle.focus();
  }
  function position() {
    // Sit just under the sticky header.
    const top = document.querySelector(".top");
    panel.style.top = (top ? Math.max(8, top.getBoundingClientRect().bottom + 8) : 72) + "px";
  }
  const isVisible = el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);

  toggle.addEventListener("click", () => (panel.hidden ? openPanel(toggle) : closePanel()));
  navEntry.addEventListener("click", () => {
    // Close the mobile menu first, then open the panel; focus returns to the menu button afterwards.
    const menuBtn = document.querySelector(".menu-toggle");
    if (menuBtn && menuBtn.getAttribute("aria-expanded") === "true") menuBtn.click();
    openPanel(isVisible(toggle) ? toggle : menuBtn);
  });
  panel.addEventListener("change", e => { if (e.target.name === "gn-appearance") save(e.target.value); });
  panel.querySelector("[data-close]").addEventListener("click", () => closePanel());

  // ----- shared: labels, Escape, outside click -----
  function statusText() {
    const p = pref(), now = T.resolve(p);
    if (!p) return "Purple, the default. Choose another look below.";
    if (p !== "auto") return `${T.NAMES[p]}. This stays until you change it.`;
    const next = T.nextChange();
    return `Automatic, currently ${T.NAMES[now]}. Changes to ${T.NAMES[next.theme]} on ${dateText(next.date)}.`;
  }
  function updateControls() {
    const p = pref() || "purple", shown = root.getAttribute("data-theme");
    panel.querySelectorAll('input[name="gn-appearance"]').forEach(i => { i.checked = i.value === p; });
    panel.querySelector(".appearance-status").textContent = statusText();
    const label = p === "auto" ? `Automatic, currently ${T.NAMES[shown]}` : T.NAMES[p];
    toggle.setAttribute("aria-label", `Appearance: ${label}`);
    toggle.title = `Appearance: ${label}`;
    navEntry.querySelector(".nav-appearance-now").textContent = label;
  }
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if (!panel.hidden) { closePanel(); e.stopPropagation(); }
  });
  document.addEventListener("click", e => {
    if (!panel.hidden && !panel.contains(e.target) && !toggle.contains(e.target) && !navEntry.contains(e.target)) closePanel(false);
  });
  window.addEventListener("resize", () => { if (!panel.hidden) position(); });

  // ----- keep in step: other tabs, returning to the tab, and the next schedule boundary -----
  window.addEventListener("storage", e => {
    if (e.key === T.KEY || e.key === null) {
      previewing = null; render();
    }
  });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { render(); schedule(); } });
  window.addEventListener("pageshow", e => { if (e.persisted) { render(); schedule(); } });   // back/forward cache
  function schedule() {
    clearTimeout(schedule.t);
    const wait = Math.min(Math.max(T.nextChange().at - Date.now() + 1000, 1000), 2147483000);
    schedule.t = setTimeout(() => { render(); schedule(); }, wait);
  }

  render();
  schedule();
  // No chooser opens by itself: Purple is the default and the other looks are in Appearance.
}
