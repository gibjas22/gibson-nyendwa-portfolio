# Day 3 check against the official guide (30 October 2026)

**Guide:** "How to plan and build your portfolio", Ana Cunha, AWS Developer Advocate. Article 3 of the series "Build your website on AWS". Published 29 October 2026.
**Why a check:** the portfolio was planned and built from 27 October onwards, before this article came out. This document compares the repository and the live site with the guide, step by step.
**No AWS changes:** Day 3 is about the site and GitHub only. Nothing was created or changed in AWS for this check.

## Step-by-step comparison

| Guide step | What the guide asks for | What this project has | Status |
|---|---|---|---|
| Open the project folder in the agent | Work inside a portfolio folder | `C:\Users\gibso\gibson-nyendwa-portfolio`, opened in Claude Code since Day 1 | Matches |
| Write `plan.md` | Introduction, About me, Skills, Projects, Fun fact, Style, Other sections, in your own words | The site was planned in conversation and in `BUILD-LOG.md` rather than in a `plan.md`. A `plan.md` was written up on 30 October from what is already on the live site, so the site can be checked against it | Done (retrospective). Kept on Gibson's computer, not pushed, as the guide advises |
| Build with the agent | Plain HTML, CSS and JavaScript; no frameworks, packages, build step or backend; nothing invented; no AWS changes | Plain HTML, CSS and JavaScript (ES modules), no framework or packages. Files are organised in folders (`css/`, `js/`) instead of one `styles.css` and `script.js`. Two deliberate extras: a small AWS Lambda function behind Amazon API Gateway for the Birmingham headlines (deployed with Gibson's approval and recorded in `docs/AWS-SERVICES.md`), and `scripts/build-projects.mjs`, which writes the case-study pages on Gibson's computer before a commit; Amplify still only serves files | Matches, with documented extras |
| Refine it, one change at a time | Compare the site with the plan and ask for single changes | Daily changes recorded in `BUILD-LOG.md` and in more than 40 commits, each with a single purpose | Matches |
| Make the fun fact interactive | An interactive feature with a visible hint that does not block the rest of the site | The mixing desk. The fun fact (The Unsaid Sound, and touring as the 1st Grail Knight in Parsifal) is locked behind the Studio fader: push it to 100 and hold for two seconds. Hints: "Hear my story" in the header, "try the mixing desk" under the introduction, and the lock on the Studio channel. A "Read the seven stories" link gives the same content as text, so nobody has to play | Matches |
| Test locally | Content says what was meant; menu and links work; the hint is easy to spot; works at phone width | Tested on a local server with the site's security headers: click-through checks (menu, links, desk, keyboard), layout scans at ten widths from 320 to 1920 px, contrast checks in all three themes, accessibility checks (axe), reduced motion. Results in `BUILD-LOG.md` | Matches |
| Agent review against `plan.md` | Links, keyboard, mobile, nothing on the page that is not in the plan | Links, keyboard and mobile are covered by the tests above. Content was checked against the facts Gibson supplied; the new `plan.md` makes this check repeatable | Matches |
| Save to GitHub | A public repository with `index.html` at the top level, and nothing you did not mean to share | Public repository `gibjas22/gibson-nyendwa-portfolio`; `index.html` at the top level; pushed with Git rather than the upload page, so every change is a commit | Matches. Checked below |

## Repository check, 30 October 2026

| Check | Result |
|---|---|
| Repository is public | Yes: an anonymous read of `https://github.com/gibjas22/gibson-nyendwa-portfolio` succeeds |
| GitHub matches Gibson's computer | Yes: GitHub `main` and the local `main` are both at `d1ab957` with nothing waiting to be pushed |
| `index.html` at the top level | Yes |
| Files tracked | 132 |
| AWS access keys or private keys in tracked files | None found (searched for access-key and private-key patterns) |
| Full 12-digit AWS account ID in tracked files | None found; the account is shown only as `********4263` |
| Email addresses in tracked files | Only the public enquiries address `info@gcmarketingsupport.co` and the form example `name@example.com`; the budget alert address appears masked |
| Kept out of GitHub by `.gitignore` | `plan.md`, `scratch/` (local scripts and raw evidence), `content/drafts/`, `raw-audio/`, `.env` files, `.aws/` |
| `README.md` | Updated on 30 October to describe the current site, folders and the case-study generator |

## Outcome
Day 3 is complete. The site was built before the guide was published, and it meets each of its steps: plain HTML, CSS and JavaScript; an interactive fun fact with a visible hint and a text route; local testing; and a public GitHub repository with nothing sensitive in it. The only gap was a written `plan.md`, now added on Gibson's computer and kept out of the public repository.
