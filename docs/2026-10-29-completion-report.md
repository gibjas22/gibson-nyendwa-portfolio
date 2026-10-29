# Completion report, 29 October 2026

Baseline: `main` at `f2900b1`, working tree clean, `content/drafts/` ignored (`.gitignore` line 27) and untracked.

| Task | What changed | Evidence | Remaining dependency |
|---|---|---|---|
| What's On feed | Live check passed. Fixed the "Â·" character in the card date line and the deploy-script encoding bug that caused it. | `docs/evidence/2026-10-29-live-checks.md` section 2; local tests at 360, 768 and 1280 px | Push this change |
| Article | Facts re-checked; two corrections (Birmingham Museum & Art Gallery galleries now open; Opheem holds two Michelin stars, not one). Local draft and review document match. Not published. | Claude Docs review copy; `content/drafts/` (not committed) | Gibson's approval and publish date |
| Security headers | Verified live on 5 HTML routes, JS, audio and a missing URL. No change needed. | `docs/evidence/2026-10-29-live-checks.md` section 1 | Optional: Amplify 404 rewrite (needs approval) |
| CloudWatch Logs | Verified at 07:57 UTC: test request logged one second later; 40 invocations, 0 errors in 24 h | `docs/evidence/aws-evidence-2026-10-29.txt` section 7 | Approval to set 30-day retention (currently never expires) |
| AWS Budget | Verified configuration: 13 USD monthly, email alerts at 80% actual and 100% forecast; spend 0.0 USD. Delivery not tested. | Same file, section 8 | None |
| Studio | Placeholder made explicit (`stemReady: false`, no failed request for a missing file); visitors told it is a placeholder; desk now silent while the track video plays; failed stems reported | Local Playwright run, see BUILD-LOG | Invincible Battles master file |

Tests run (local, under the live Content Security Policy): desk power, fader by keyboard (PageUp, Home, End) and by drag on a 390 px screen, accessible names and `aria-valuetext`, unlock at 100, video opens with the desk silent, restore, All faders down, power off and on, missing-stem message, real-stem path with a test tone in the test browser only; What's On panel tabs, empty and error states, date line, links, no sideways scrolling at 360, 768 and 1280 px.
