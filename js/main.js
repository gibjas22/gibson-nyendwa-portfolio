// main.js: nav behaviour and the text fallback for the desk stories.
// The desk itself (faders, audio, unlock) lives in desk.js and arrives at the weekend.

import { channels } from "./channels.js";

// Mark the current section in the nav as the visitor scrolls.
const links = [...document.querySelectorAll('.top nav a[href^="#"]')];
const targets = links.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle("current", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  targets.forEach(t => io.observe(t));
}

// Render the seven stories as plain text so nothing is locked behind the faders.
const box = document.getElementById("stories-text");
if (box) {
  box.innerHTML = channels.map(ch => {
    const story = ch.unlock ? `${ch.story} ${ch.unlock.story}` : ch.story;
    return `<h3>${ch.label}: ${ch.title}</h3><p>${story}</p><p class="story-link"><a href="${ch.link.href}">${ch.link.text}</a></p>`;
  }).join("");
}
