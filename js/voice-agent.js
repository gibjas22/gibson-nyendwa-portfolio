// voice-agent.js: "Talk to my AI assistant", a voice chat run by Tough Tongue AI.
//
// SCENARIO_ID is the ID of the public scenario in Gibson's Tough Tongue AI account
// (Library > the scenario > its URL ends in the ID). While it is empty the card stays hidden,
// so a visitor never meets a widget that cannot work.
//
// Same rules as the booking embed and the media players:
// - Nothing from toughtongueai.com loads until the visitor presses Start.
// - The microphone is only requested inside Tough Tongue's frame, after that press.
// - The Basic embed style never records, and transcription stays off (no transcribe=true).
// - Each chat ends itself after MAX_SECONDS, which also caps the minutes it can use.
// - Starting a chat pauses the hero reel, desk and podcast ("site-media-play").

const SCENARIO_ID = "";
const EMBED_BASE = "https://app.toughtongueai.com/embed/basic/";
const ORIGIN = "https://app.toughtongueai.com";
const MAX_SECONDS = 300;

const card = document.getElementById("voice-agent");
if (card && SCENARIO_ID) init(card);

function init(card) {
  const startBtn = card.querySelector("#va-start");
  const stopBtn = card.querySelector("#va-stop");
  const box = card.querySelector("#va-embed");
  const status = card.querySelector("#va-status");
  card.hidden = false;

  const say = text => { status.textContent = text; };

  function start() {
    const params = new URLSearchParams({ name: "Talk to Gibson's AI assistant", maxDuration: String(MAX_SECONDS) });
    const frame = document.createElement("iframe");
    frame.src = EMBED_BASE + encodeURIComponent(SCENARIO_ID) + "?" + params.toString();
    frame.title = "Voice chat with Gibson's AI assistant, run by Tough Tongue AI";
    frame.allow = "microphone";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.addEventListener("error", () => { stop(); say("The voice chat would not load. Please book a call or send an email instead."); });
    box.innerHTML = ""; box.appendChild(frame); box.hidden = false;
    startBtn.hidden = true; stopBtn.hidden = false;
    say("Loading. Your browser will ask to use your microphone.");
    window.dispatchEvent(new CustomEvent("site-media-play", { detail: { source: "voice-agent" } }));
  }

  function stop() {
    box.hidden = true; box.innerHTML = "";          // removing the frame ends the chat
    startBtn.hidden = false; stopBtn.hidden = true;
    say("");
    startBtn.focus();
  }

  startBtn.addEventListener("click", start);
  stopBtn.addEventListener("click", () => { stop(); say("Chat closed."); });

  // Tough Tongue posts onStart, onStop, onTerminated and onSubmit from its frame.
  window.addEventListener("message", e => {
    const frame = box.querySelector("iframe");
    if (!frame || e.source !== frame.contentWindow || e.origin !== ORIGIN) return;
    const name = e.data && e.data.event;
    if (name === "onStart") say("Connected. Say hello when you are ready.");
    else if (name === "onStop" || name === "onSubmit") say("The chat has ended. You can start another or book a call.");
    else if (name === "onTerminated") say("The chat stopped unexpectedly. You can start it again.");
  });

  // Another player starting elsewhere on the page closes the chat, as the other players do.
  window.addEventListener("site-media-play", e => { if (e.detail?.source !== "voice-agent" && !box.hidden) stop(); });
}
