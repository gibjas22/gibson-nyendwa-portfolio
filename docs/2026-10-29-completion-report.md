# Completion report, 29 October 2026

Baseline: `main` at `f2900b1`, working tree clean, `content/drafts/` ignored (`.gitignore` line 27) and untracked.

| Task | What changed | Evidence | Remaining dependency |
|---|---|---|---|
| What's On feed | Live check passed. Fixed the "Â·" character in the card date line and the deploy-script encoding bug that caused it. | `docs/evidence/2026-10-29-live-checks.md` section 2; local tests at 360, 768 and 1280 px | Push this change |
| Article | Facts re-checked; two corrections (Birmingham Museum & Art Gallery galleries now open; Opheem holds two Michelin stars, not one). Local draft and review document match. Not published. | Claude Docs review copy; `content/drafts/` (not committed) | Gibson's approval and publish date |
| Security headers | Verified live on 5 HTML routes, JS, audio and a missing URL. No change needed. | `docs/evidence/2026-10-29-live-checks.md` section 1 | Optional: Amplify 404 rewrite (needs approval) |
| CloudWatch Logs | Evidence script extended: log group, latest streams, a harmless test request and its matching REPORT line, 24-hour metrics | `docs/evidence/collect-aws-evidence.ps1` section 7 | Gibson runs the script (AWS access is on his PC) |
| AWS Budget | Script now records thresholds, alert state and masked recipients; sends nothing | Script section 8 | Gibson runs the script |
| Studio | Placeholder made explicit (`stemReady: false`, no failed request for a missing file); visitors told it is a placeholder; desk now silent while the track video plays; failed stems reported | Local Playwright run, see BUILD-LOG | Invincible Battles master file |

Tests run (local, under the live Content Security Policy): desk power, fader by keyboard (PageUp, Home, End) and by drag on a 390 px screen, accessible names and `aria-valuetext`, unlock at 100, video opens with the desk silent, restore, All faders down, power off and on, missing-stem message, real-stem path with a test tone in the test browser only; What's On panel tabs, empty and error states, date line, links, no sideways scrolling at 360, 768 and 1280 px.
