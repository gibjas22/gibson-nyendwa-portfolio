# Day 4 check against the official guide (30 October 2026)

**Guide:** "How to put your website online", Ana Cunha, AWS Developer Advocate. Article 4, the last in the series "Build your website on AWS". Published 30 October 2026.
**Why a check:** the site has been live on AWS Amplify Hosting since 27 October 2026 (Day 1 of the build), before this article came out. This document compares the setup with the guide step by step and records what was confirmed on 30 October.
**No AWS changes:** this check is read-only. Nothing was created or changed in AWS.

## Step-by-step comparison

| Guide step | What the guide asks for | What this project has | Status |
|---|---|---|---|
| Open your project | Use the AWS account for this project; check the project name in the console | A separate personal AWS account for the challenge, used as IAM user `gibson-admin` (never root), Region eu-west-2 (London) | Matches. Whether a console "project" name shows in the upper right is still to be checked (see Day 2) |
| Connect Amplify to GitHub | Deploy an app, choose GitHub, authorise AWS Amplify | Done on 27 October 2026: `SETUP-GUIDE.md`, Part 5.1 | Matches |
| Only select repositories | Let Amplify see only the site's repository | `SETUP-GUIDE.md` 5.1 records choosing **Only select repositories** and the portfolio repository | Matches as recorded. Gibson to confirm in GitHub settings (below) |
| Repository and branch | Select the repository and `main` | `gibjas22/gibson-nyendwa-portfolio`, branch `main` | Matches |
| App settings | No build command; build output directory `/` | No build command, output `/` (`SETUP-GUIDE.md` 5.2). Case-study pages are generated on Gibson's computer before a commit, so Amplify still only copies files | Matches |
| Save and deploy | `main` shows Deployed | App `gibson-nyendwa-portfolio` (`dbthjbi29n1oo`), platform WEB. Every push deploys on its own; jobs 16 to 20 all SUCCEED in the 29 October evidence run | Matches |
| Check your live site | HTTPS address ending `amplifyapp.com`; no 404 for the home page; file names match exactly | Live at https://main.dbthjbi29n1oo.amplifyapp.com. Checked on 30 October (below) | Matches |
| Update your site | Push or upload to GitHub; Amplify redeploys | Every change since 27 October has gone live this way, including the Day 3 commit `506f886`, live within minutes | Matches |
| If a deployment fails | Ask the connected agent to read the deployment logs | Claude Code is connected to AWS through the AWS MCP Server (Day 2) and the project rules allow read-only checks | Ready |
| Cost | Usually under a dollar a month for a portfolio | AWS Budgets alert set: 13 USD a month, emails at 80% actual and 100% forecast; spend 0.0 USD at 29 October | Matches |
| When you stop | Delete the Amplify app, and close the project if it is no longer needed | Not yet: the site must stay live until judging ends. Steps recorded in `docs/SUBMISSION-GUIDE.md` | Planned |

## Live checks, 30 October 2026 (about 17:00 London time)

| Check | Result |
|---|---|
| HTTPS | Yes, `https://main.dbthjbi29n1oo.amplifyapp.com` |
| Home page | `/` and `/index.html` return 200 |
| Case studies, Insights, What's On | `/projects/portfolio.html`, `/insights/`, `/insights/whats-on.html` return 200 |
| Styles, scripts, audio | `/css/styles.css`, `/js/desk.js`, `/assets/audio/classroom.mp3` return 200 with the right content types |
| Latest commit live | `docs/day3/AWS_Day3_Guide_Check.md`, added in `506f886`, is served, so the latest push deployed |
| Missing pages | `/no-such-page` returns the "Page not found" page with status 404 |
| Security headers | All six from `customHttp.yml` present: Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options |
| File-name case | 492 file references in the site's HTML, CSS and JavaScript compared with the files in the repository: no upper/lower-case mismatches. The only unmatched names are expected: two Studio audio files not yet supplied (the code already falls back), and links that JavaScript resolves from the page's own folder |

## Still for Gibson (read-only)

1. **Amplify deployment record.** Refresh the evidence file, which lists the latest Amplify jobs with their commits:
   ```powershell
   cd C:\Users\gibso\gibson-nyendwa-portfolio
   aws login --region eu-west-2 --profile gibson-portfolio
   powershell -ExecutionPolicy Bypass -File .\docs\evidence\collect-aws-evidence.ps1
   ```
   It writes a masked copy to `docs\evidence\aws-evidence-<date>.txt` for review before committing.
2. **GitHub access for Amplify.** Open https://github.com/settings/installations, choose **Configure** next to AWS Amplify, and check that **Only select repositories** is chosen with just `gibson-nyendwa-portfolio` listed.
3. **Console project name.** Check whether a project name shows in the upper right of the AWS Console. If not, nothing needs to change.

## Outcome
Day 4 is complete. The site was put online on 27 October in the way the guide describes, deploys itself on every push, serves over HTTPS with security headers and a proper 404 page, and its cost is covered by a budget alert. The final steps to submission are in `docs/SUBMISSION-GUIDE.md`.
