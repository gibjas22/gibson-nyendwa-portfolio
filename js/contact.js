// contact.js: contact form validation and submission, and the click-to-load booking embed.
//
// ENDPOINT is the API Gateway URL of the contact Lambda (see backend/README.md).
// While it is empty the form stays hidden and the email fallback shows instead, so a
// visitor never meets a form that cannot deliver.

const ENDPOINT = "";
const BOOKING_URL = "https://calendly.com/gcmarketingsupportbookings/discovery-call";

const form = document.getElementById("contact-form");
const fallback = document.getElementById("contact-fallback");

if (form && fallback) {
  if (ENDPOINT) { form.hidden = false; fallback.hidden = true; }
  else { form.hidden = true; fallback.hidden = false; }
}

if (form && ENDPOINT) {
  const status = document.getElementById("cf-status");
  const submit = document.getElementById("cf-submit");
  const started = document.getElementById("cf-started");
  started.value = String(Date.now());
  let sending = false;

  const fields = {
    name: { el: document.getElementById("cf-name"), err: document.getElementById("cf-name-err"),
      check: v => v.trim().length < 2 ? "Please enter your name." : v.length > 100 ? "That name is too long." : "" },
    email: { el: document.getElementById("cf-email"), err: document.getElementById("cf-email-err"),
      check: v => !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "Please enter a valid email address, like name@example.com." : "" },
    phone: { el: document.getElementById("cf-phone"), err: document.getElementById("cf-phone-err"),
      check: v => v && !/^[+\d][\d\s().-]{6,29}$/.test(v.trim()) ? "That does not look like a phone number. Digits, spaces and + are fine." : "" },
    message: { el: document.getElementById("cf-message"), err: document.getElementById("cf-message-err"),
      check: v => v.trim().length < 10 ? "Please write at least a sentence." : v.length > 2000 ? "Please keep it under 2000 characters." : "" }
  };

  const show = (f, msg) => {
    f.err.textContent = msg;
    f.el.setAttribute("aria-invalid", msg ? "true" : "false");
    f.el.classList.toggle("invalid", !!msg);
  };
  Object.values(fields).forEach(f => f.el.addEventListener("blur", () => show(f, f.check(f.el.value))));

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (sending) return;
    let firstBad = null;
    for (const f of Object.values(fields)) {
      const msg = f.check(f.el.value); show(f, msg);
      if (msg && !firstBad) firstBad = f.el;
    }
    if (firstBad) { firstBad.focus(); status.textContent = "Please fix the highlighted fields."; status.className = "form-status error-state"; return; }

    sending = true; submit.disabled = true; submit.textContent = "Sending";
    status.textContent = ""; status.className = "form-status";
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 15000);
      const res = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), signal: ctrl.signal });
      clearTimeout(t);
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        form.reset(); started.value = String(Date.now());
        status.textContent = "Sent. Thank you, I will reply within two working days.";
        status.className = "form-status ok-state";
        submit.textContent = "Sent";
        setTimeout(() => { submit.disabled = false; submit.textContent = "Send message"; sending = false; }, 4000);
        return;
      }
      status.textContent = body.error || "That did not send. Please try again, or email info@gcmarketingsupport.co.";
    } catch {
      status.textContent = "Could not reach the server. Check your connection and try again, or email info@gcmarketingsupport.co.";
    }
    status.className = "form-status error-state";
    submit.disabled = false; submit.textContent = "Send message"; sending = false;
  });
}

// Booking: direct link always works; the embed loads only when the visitor asks for it.
const embedBtn = document.getElementById("book-embed-btn");
const embedBox = document.getElementById("booking-embed");
if (embedBtn && embedBox) {
  embedBtn.addEventListener("click", () => {
    if (!embedBox.hidden) { embedBox.hidden = true; embedBox.innerHTML = ""; embedBtn.textContent = "Show calendar here"; return; }
    const frame = document.createElement("iframe");
    frame.src = BOOKING_URL + "?embed_type=Inline&embed_domain=" + encodeURIComponent(location.hostname); frame.title = "Book a 30-minute call with Gibson Nyendwa";
    frame.loading = "lazy"; frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.addEventListener("error", () => { embedBox.innerHTML = `<p>The calendar would not load here. <a href="${BOOKING_URL}" target="_blank" rel="noopener">Open it in a new tab</a>.</p>`; });
    embedBox.innerHTML = ""; embedBox.appendChild(frame); embedBox.hidden = false;
    embedBtn.textContent = "Hide calendar";
  });
}
