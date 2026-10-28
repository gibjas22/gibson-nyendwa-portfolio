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

// Mark the current section in the nav as the visitor scrolls.
const targets = links.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => {
        const current = a.getAttribute("href") === "#" + e.target.id;
        a.classList.toggle("current", current);
        if (current) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  targets.forEach(t => io.observe(t));
}

// Render the seven stories as plain text so nothing is locked behind the faders.
const box = document.getElementById("stories-text");
if (box) {
  box.innerHTML = channels.map(ch => {
    const story = ch.unlock ? ch.unlock.story : ch.story;
    return `<h3>${ch.label}: ${ch.title}</h3><p>${story}</p><p class="story-link"><a href="${ch.link.href}">${ch.link.text}</a></p>`;
  }).join("");
}
