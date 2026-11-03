// article-wire.js: behaviour for the pre-rendered article pages (insights/<slug>.html).
// The article HTML is already in the page; this only adds sharing, the click-to-load video,
// a reading progress bar and a back-to-top button.

// ---------- Sharing ----------
const shareBox = document.querySelector("[data-share-url]");
if (shareBox) {
  const url = shareBox.dataset.shareUrl, title = shareBox.dataset.shareTitle;
  const out = document.getElementById("copied");
  document.getElementById("copy")?.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(url); out.textContent = "Link copied."; } catch { out.textContent = url; }
  });
  // Phones get the system share sheet (WhatsApp, Messages and so on) when the browser offers it.
  const native = shareBox.querySelector(".share-native");
  if (native && navigator.share) {
    native.hidden = false;
    native.addEventListener("click", () => navigator.share({ title, url }).catch(() => {}));
  }
}

// ---------- "Watch the video": load YouTube only when asked ----------
const watch = document.querySelector(".slt-watch[data-video]");
const slot = document.getElementById("watch-player");
if (watch && slot) {
  const id = watch.dataset.video, vtitle = watch.dataset.title;
  const load = start => {
    const f = document.createElement("iframe");
    f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1${start ? `&start=${start}` : ""}`;
    f.title = `YouTube video player: ${vtitle}`;
    f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    f.allowFullscreen = true;
    f.referrerPolicy = "strict-origin-when-cross-origin";
    slot.innerHTML = ""; slot.appendChild(f); slot.classList.add("is-playing");
    f.focus();
  };
  document.getElementById("watch")?.addEventListener("click", e => {
    const b = e.target.closest("[data-start]");
    if (b) load(+b.dataset.start || 0);
  });
}

// ---------- Reading progress and back to top ----------
const body = document.getElementById("article-body");
if (body) {
  const bar = document.createElement("div");
  bar.className = "read-progress"; bar.setAttribute("aria-hidden", "true");
  bar.innerHTML = "<span></span>";
  document.body.appendChild(bar);
  const fill = bar.firstElementChild;

  const top = document.createElement("a");
  top.className = "to-top"; top.href = document.getElementById("toc") ? "#toc" : "#main";
  top.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg><span class="to-top-label">${document.getElementById("toc") ? "Contents" : "Top"}</span>`;
  top.setAttribute("aria-label", document.getElementById("toc") ? "Back to the contents" : "Back to the top");
  document.querySelector("main")?.appendChild(top);

  let ticking = false;
  const update = () => {
    ticking = false;
    const r = body.getBoundingClientRect();
    const total = r.height - innerHeight * 0.6;
    const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    fill.style.transform = `scaleX(${p})`;
    top.classList.toggle("is-visible", r.top < -innerHeight);
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener("resize", update);
  update();
}
