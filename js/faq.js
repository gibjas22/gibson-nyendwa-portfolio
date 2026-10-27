// faq.js: accessible accordion. Buttons with aria-expanded control labelled regions.
document.querySelectorAll(".faq-q").forEach(btn => {
  const panel = document.getElementById(btn.getAttribute("aria-controls"));
  btn.addEventListener("click", () => { const open = btn.getAttribute("aria-expanded") === "true"; btn.setAttribute("aria-expanded", String(!open)); panel.hidden = open; });
});
// Open the item named in the URL hash, if any
const openFromHash = () => { if (!location.hash) return; const t = document.querySelector(location.hash + " .faq-q, " + location.hash); const b = t?.classList?.contains("faq-q") ? t : t?.querySelector?.(".faq-q"); if (b && b.getAttribute("aria-expanded") !== "true") b.click(); };
openFromHash(); addEventListener("hashchange", openFromHash);
