/* theme-boot.js: sets the colour theme before the page paints.
   Loaded as a normal blocking script in <head> on every page (the CSP allows only same-site
   scripts, so this cannot be inline). It is the single source of truth for the theme schedule and
   the saved preference; js/theme.js (the Appearance control and first-visit chooser) reuses it
   through window.GNTheme.

   To change the rotation, edit CONFIG only. See docs/THEMES.md. */
(function () {
  "use strict";

  var CONFIG = {
    anchor: { y: 2026, m: 10, d: 29 },          // 29 October 2026, 00:00 Europe/London
    order: ["purple", "sky-blue", "white"],     // repeats in this order
    days: 14,                                   // calendar days per theme
    timeZone: "Europe/London"
  };
  var KEY = "gn-appearance";                    // localStorage: "purple" | "sky-blue" | "white" | "auto"
  var THEMES = ["purple", "sky-blue", "white"];
  var NAMES = { "purple": "Purple", "sky-blue": "Sky Blue", "white": "White" };
  var META = { "purple": "#100818", "sky-blue": "#06112E", "white": "#F6F7FB" };   // browser UI colour

  // Calendar date and time in London for an instant (ms). Falls back to UTC if Intl time zones are missing.
  var fmt = null;
  try {
    fmt = new Intl.DateTimeFormat("en-GB", { timeZone: CONFIG.timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  } catch (e) { fmt = null; }
  function londonParts(t) {
    if (fmt && fmt.formatToParts) {
      var p = {};
      fmt.formatToParts(new Date(t)).forEach(function (x) { p[x.type] = x.value; });
      return { y: +p.year, m: +p.month, d: +p.day, h: (+p.hour) % 24, min: +p.minute };
    }
    var u = new Date(t);
    return { y: u.getUTCFullYear(), m: u.getUTCMonth() + 1, d: u.getUTCDate(), h: u.getUTCHours(), min: u.getUTCMinutes() };
  }
  var ANCHOR_DAY = Date.UTC(CONFIG.anchor.y, CONFIG.anchor.m - 1, CONFIG.anchor.d) / 864e5;
  // Whole London calendar days since the anchor (calendar arithmetic, so clock changes never shift it).
  function dayIndex(t) { var p = londonParts(t); return Date.UTC(p.y, p.m - 1, p.d) / 864e5 - ANCHOR_DAY; }
  function periodIndex(t) { var n = dayIndex(t); return n < 0 ? -1 : Math.floor(n / CONFIG.days); }
  // Theme on the schedule at instant t. Before the anchor the rotation has not started: Purple.
  function scheduled(t) {
    var p = periodIndex(t == null ? Date.now() : t);
    return p < 0 ? CONFIG.order[0] : CONFIG.order[p % CONFIG.order.length];
  }
  // The instant London reaches 00:00 on a calendar date (handles GMT and BST).
  function londonMidnight(y, m, d) {
    var base = Date.UTC(y, m - 1, d);
    for (var off = -3; off <= 3; off++) {
      var t = base - off * 36e5, p = londonParts(t);
      if (p.y === y && p.m === m && p.d === d && p.h === 0 && p.min === 0) return t;
    }
    return base;
  }
  // Next boundary after t: { at: ms, theme, date: "YYYY-MM-DD" }.
  function nextChange(t) {
    t = t == null ? Date.now() : t;
    var p = periodIndex(t), startDay = p < 0 ? 0 : (p + 1) * CONFIG.days;
    var day = new Date((ANCHOR_DAY + startDay) * 864e5);
    var y = day.getUTCFullYear(), m = day.getUTCMonth() + 1, d = day.getUTCDate();
    var at = londonMidnight(y, m, d);
    return { at: at, theme: scheduled(at), date: y + "-" + (m < 10 ? "0" : "") + m + "-" + (d < 10 ? "0" : "") + d };
  }

  // Preference storage. Every access is guarded: blocked, full or corrupted storage means "no preference".
  function read() {
    try {
      var v = window.localStorage.getItem(KEY);
      if (v === null) return null;
      if (v === "auto" || THEMES.indexOf(v) >= 0) return v;
      window.localStorage.removeItem(KEY);       // corrupted value: discard it
    } catch (e) { /* storage unavailable */ }
    return null;
  }
  function write(v) {
    if (v !== "auto" && THEMES.indexOf(v) < 0) return false;
    try { window.localStorage.setItem(KEY, v); return window.localStorage.getItem(KEY) === v; } catch (e) { return false; }
  }
  function storageAvailable() {
    try { var k = "gn-storage-test"; window.localStorage.setItem(k, "1"); window.localStorage.removeItem(k); return true; } catch (e) { return false; }
  }
  function resolve(pref, t) { return pref && pref !== "auto" ? pref : scheduled(t); }

  function apply(theme, pref) {
    var root = document.documentElement;
    if (THEMES.indexOf(theme) < 0) theme = "purple";
    if (root.getAttribute("data-theme") !== theme) root.setAttribute("data-theme", theme);
    root.setAttribute("data-appearance", pref || "auto");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", META[theme]);
    return theme;
  }

  window.GNTheme = {
    CONFIG: CONFIG, KEY: KEY, THEMES: THEMES, NAMES: NAMES,
    scheduled: scheduled, nextChange: nextChange, londonParts: londonParts,
    read: read, write: write, storageAvailable: storageAvailable, resolve: resolve, apply: apply,
    // Preference used for this page view when storage is unavailable (not remembered).
    sessionPref: null
  };

  var pref = read();
  apply(resolve(pref), pref);
})();
