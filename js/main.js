// main.js: mobile menu, current-section highlighting, and the text fallback for the desk stories.
// The desk itself (faders, audio, unlock) lives in desk.js.

import { channels } from "./channels.js";

const nav = document.getElementById("site-nav");
const toggle = document.querySelector(".menu-toggle");
const links = [...document.querySelectorAll('.top nav a[href^="#"]')];

// Mobile menu: open and close, close on link click, on Escape, and on outside click.
if (toggle && nav) {
  const setOpen = open => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".menu-label").textContent = open ? "Close" : "Menu";
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  links.forEach(a => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });
  document.addEventListener("click", e => {
    if (nav.classList.contains("open") && !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
  });
}

// Mark the current section in the nav as the visitor scrolls. Every section is watched, including
// the ones without a nav link (the introduction, the tracklist), so moving into one of those clears
// the highlight instead of leaving the last item marked.
const sections = [...document.querySelectorAll("main > section, main > .hero, body > section.hero")];
const setCurrent = id => links.forEach(a => {
  const on = !!id && a.getAttribute("href") === "#" + id;
  a.classList.toggle("current", on);
  if (on) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current");
});
if ("IntersectionObserver" in window && sections.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) setCurrent(e.target.id || null); });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach(t => io.observe(t));
}

// "Read the seven stories" links open the text version before scrolling to it.
document.querySelectorAll('a[href="#stories"]').forEach(a => a.addEventListener("click", () => {
  const d = document.getElementById("stories"); if (d) d.open = true;
}));

// Render the seven stories as plain text so nothing is locked behind the faders.
const box = document.getElementById("stories-text");
if (box) {
  box.innerHTML = channels.map(ch => {
    const story = ch.unlock ? ch.unlock.story : ch.story;
    return `<h3>${ch.label}: ${ch.title}</h3><p>${story}</p><p class="story-link"><a href="${ch.link.href}">${ch.link.text}</a></p>`;
  }).join("");
}
