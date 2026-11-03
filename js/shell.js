// shell.js: header behaviour shared by the secondary pages (mobile menu).
const nav = document.getElementById("site-nav"), toggle = document.querySelector(".menu-toggle");
if (nav && toggle) {
  const setOpen = open => { nav.classList.toggle("open", open); toggle.setAttribute("aria-expanded", String(open)); toggle.querySelector(".menu-label").textContent = open ? "Close" : "Menu"; toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu"); };
  toggle.addEventListener("click", () => { const open = !nav.classList.contains("open"); setOpen(open); if (open) nav.querySelector("a")?.focus(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && nav.classList.contains("open")) { const inside = nav.contains(document.activeElement); setOpen(false); if (inside) toggle.focus(); } });
  document.addEventListener("click", e => { if (nav.classList.contains("open") && !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false); });
}
