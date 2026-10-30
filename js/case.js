// case.js: small enhancements for the generated case-study pages in projects/ (the content itself is
// already in the HTML): the mobile menu, the logo fallback and the gentle logo tilt.
import { watchLogos, tiltLogos } from "./projects.js";

const body = document.getElementById("case-body");
if (body) { watchLogos(body); tiltLogos(body); }

const nav = document.getElementById("site-nav"), toggle = document.querySelector(".menu-toggle");
if (nav && toggle) toggle.addEventListener("click", () => {
  const open = !nav.classList.contains("open");
  nav.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.querySelector(".menu-label").textContent = open ? "Close" : "Menu";
});
