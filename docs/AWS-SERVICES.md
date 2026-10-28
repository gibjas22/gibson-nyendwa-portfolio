# AWS services used

Portfolio of Gibson Nyendwa, built for the AWS Student Builder Challenge 2026.
Live site: https://main.dbthjbi29n1oo.amplifyapp.com · Region: eu-west-2 (London) · Last reviewed: 28 October 2026

This section explains what each AWS service does in the application, how it connects to a feature, what has been built, and what evidence shows it works. Services are grouped by how far they are proven, so nothing is claimed beyond its evidence. The account ID is masked to its last four digits, and no credentials, keys or secret values appear here.

| Status | Meaning |
|---|---|
| **Implemented and verified** | Deployed, and working behaviour has been observed (command output, live requests or the live site). |
| **Configured, verification pending** | Set up, but the specific proof has not been captured yet. The read-only script below captures it. |
| **Planned** | Code or design exists; nothing is deployed in AWS. |

## How the pieces fit

```
Visitor's browser
   │  HTML, CSS, JS, audio (HTTPS, security headers)
   ▼
AWS Amplify Hosting  ◀── builds on every push ── GitHub (gibjas22/gibson-nyendwa-portfolio)
   │
   │  What's On panel: GET /news?section=...
   ▼
Amazon API Gateway (HTTP API: CORS for the site only, throttled)
   ▼
AWS Lambda portfolio-news (Node.js 20, arm64) ──▶ Birmingham Live public RSS feeds
   │  logs
   ▼
Amazon CloudWatch Logs          AWS IAM: least-privilege role, MFA-protected admin user
                                AWS Budgets: monthly cost alert
```

## Implemented and verified

### 1. AWS Amplify Hosting
- **Role:** hosts the whole static site (pages, styles, scripts, audio stems) over HTTPS.
- **Connects to:** every page, including the Unsaid Sound mixing desk and the Insights hub.
- **Implemented:** app `dbthjbi29n1oo`, branch `main`, continuous deployment from GitHub. Each push builds and deploys automatically. `customHttp.yml` in the repository defines the security headers (Content Security Policy, HSTS, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options) and a one-week cache for `assets/`.
- **Evidence:** pushes on 28 October 2026 (`cfbddde` mixing desk, `3170553` Insights redesign, `675a11a` news fix) went live without manual uploads; `675a11a` was confirmed on the live site in Chrome the same evening. The Content Security Policy is observably enforced: the What's On panel can only call the API because `connect-src` allows `*.execute-api.eu-west-2.amazonaws.com`.
- **Still to capture:** a header check of the live response and the Amplify job list (script sections 2 and 3).

### 2. AWS Lambda: `portfolio-news`
- **Role:** server-side reader for the **What's On in Birmingham** panel. It fetches Birmingham Live's public RSS feeds, keeps only headline, link, date and a one-sentence preview, and returns JSON. Browsers cannot read the feeds directly, so this is the piece that makes the panel possible.
- **Connects to:** the panel at the top of the Insights page (`js/news.js`).
- **Implemented:** Node.js 20 on arm64, 128 MB, 10 second timeout, no dependencies. 15-minute in-memory cache per section, falls back to the last good copy if the feed fails. Only `https` links on the publisher's host pass through. The allowed sections are fixed in code (What's On, Food & drink, Family & kids, Music & nightlife, Latest news), so the function cannot be pointed at any other address; unknown sections return 400.
- **Evidence:** the deploy script (`backend/news-lambda/deploy-news.ps1`) run on 28 October 2026 reported "function test: 6 headlines" (direct invoke) and "public endpoint: 6 headlines". The live panel showed six cards whose links all opened on birminghammail.co.uk in a new tab.
- **Note:** the What's On sections are written and tested locally (mocked feeds, all tabs, empty and error states, 360 to 1280 px). They become live when the deploy script is re-run; until then the deployed version serves the earlier general news feed.

### 3. Amazon API Gateway (HTTP API): `portfolio-news-api`
- **Role:** the public HTTPS front door to the Lambda function.
- **Connects to:** `GET /news` and `GET /news?section=...`, called by the What's On panel.
- **Implemented:** HTTP API `776bh82jm8`, route `GET /news`, Lambda proxy integration (payload 2.0), `$default` stage with auto-deploy, CORS restricted to the Amplify site origin and `GET`, throttling of 10 burst and 5 requests per second to cap abuse and cost.
- **Evidence:** deploy script step 7 fetched the public endpoint successfully; the live site loads it in the browser under CORS and the Content Security Policy.

### 4. AWS Identity and Access Management (IAM)
- **Role:** who can do what, for people and for code.
- **Connects to:** every deployment and the Lambda function's permissions.
- **Implemented:** day-to-day work uses the IAM user `gibson-admin` with MFA, never the root user. The CLI uses short-lived sign-in (`aws login`), with no long-lived access keys. The function's role `portfolio-news-role` has only `AWSLambdaBasicExecutionRole` (write its own logs), so it cannot touch any other AWS resource.
- **Evidence:** `sts get-caller-identity` returned `arn:aws:iam::********4263:user/gibson-admin`; console banners "Console access updated" and "MFA device assigned" (screenshots, 28 October 2026); the deploy script attaches only the basic execution policy.

### 5. AWS Command Line Interface, Agent Toolkit for AWS and the AWS MCP Server (developer tooling)
- **Role:** lets the coding agent read and change AWS resources through approved, logged commands.
- **Connects to:** how the Lambda and API above were deployed and checked.
- **Implemented:** AWS CLI 2.39.0, profile `gibson-portfolio`, region eu-west-2; Agent Toolkit for AWS skills installed; AWS MCP Server connected to Claude Code; project rules in `CLAUDE.md` (read-only by default, ask before changes or cost).
- **Evidence:** Day 2 health check ("agent test" returned the gibson-admin ARN, `aws-mcp ... Connected`). Full detail in `docs/day2/`.

## Configured, verification pending

### 6. Amazon CloudWatch Logs and metrics
- **Role:** records each function run and any feed failures, and counts invocations and errors.
- **Implemented:** Lambda writes to `/aws/lambda/portfolio-news` through its basic execution role; the code logs `news fetch failed (<section>)` on errors.
- **Evidence still needed:** the log group, its retention, 24-hour invocation and error counts (script section 7). Recommended follow-up, with your approval: set log retention to 14 or 30 days so logs do not grow without limit.

### 7. AWS Budgets
- **Role:** cost guardrail.
- **Implemented:** monthly budget "Personal-Learning-Budget", about USD 13 (roughly £10), seen in the Billing console.
- **Evidence still needed:** the budget listing from the CLI (script section 8). Expected running cost of this build: within the AWS Free Tier at portfolio traffic.

## Planned (not deployed)

### 8. Contact form: AWS Lambda + Amazon API Gateway + Amazon SES
- **Role:** send messages from the contact form to Gibson's inbox without exposing an email address.
- **Status:** function code is in `backend/contact-lambda/` and the guide in `backend/README.md`; `ENDPOINT` in `js/contact.js` is empty, so the site shows the email and booking fallback. Nothing exists in AWS yet; SES identity verification and sending limits are still to do.

### 9. Not claimed
Amplify runs on AWS-managed infrastructure (for example a content delivery network and storage). Those parts are managed by Amplify and were not configured separately, so they are not listed as services used.

## How to refresh the evidence
Signed in as gibson-admin, from the project folder:
```powershell
powershell -ExecutionPolicy Bypass -File .\docs\evidence\collect-aws-evidence.ps1
```
It is read-only, masks the account ID, prints no secret values, and saves a dated copy to `scratch\` (git-ignored). Paste or screenshot its output into the submission alongside this page.
