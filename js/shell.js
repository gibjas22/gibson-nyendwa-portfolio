// shell.js: header behaviour shared by the secondary pages (mobile menu).
const nav = document.getElementById("site-nav"), toggle = document.querySelector(".menu-toggle");
if (nav && toggle) {
  const setOpen = open => { nav.classList.toggle("open", open); toggle.setAttribute("aria-expanded", String(open)); toggle.querySelector(".menu-label").textContent = open ? "Close" : "Menu"; toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu"); };
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });
  document.addEventListener("click", e => { if (nav.classList.contains("open") && !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false); });
}
