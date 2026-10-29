# AWS services used

Portfolio of Gibson Nyendwa, built for the AWS Student Builder Challenge 2026.
Live site: https://main.dbthjbi29n1oo.amplifyapp.com · Region: eu-west-2 (London) · Last reviewed: 29 October 2026

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
- **Security headers, verified live on 29 October 2026:** all six headers from `customHttp.yml` are served on pages and static files (CSP, HSTS without preload, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options DENY). Values and assessment: [`docs/evidence/2026-10-29-live-checks.md`](evidence/2026-10-29-live-checks.md).
- **Custom 404 (approved 29 October 2026):** the catch-all rule `/<*>` is pointed at `/404.html` with status 404 by `scripts/aws/apply-approved-changes-2026-10-29.ps1`, which backs up the original rules and checks valid pages and missing addresses afterwards. Result recorded in `docs/evidence/aws-changes-2026-10-29.txt` once run.
- **Deployments, from the evidence run (29 October 2026, 07:56 UTC):** the last five Amplify jobs all succeeded, each matching a GitHub push: `1a8a52b`, `675a11a`, `2705cd3`, `f2900b1` (28 October) and `08c886e` (29 October, 07:49 UTC). The script's own header check also found all six headers present. Sanitised output: [`docs/evidence/aws-evidence-2026-10-29.txt`](evidence/aws-evidence-2026-10-29.txt).

### 2. AWS Lambda: `portfolio-news`
- **Role:** server-side reader for the **What's On in Birmingham** panel. It fetches Birmingham Live's public RSS feeds, keeps only headline, link, date and a one-sentence preview, and returns JSON. Browsers cannot read the feeds directly, so this is the piece that makes the panel possible.
- **Connects to:** the panel at the top of the Insights page (`js/news.js`).
- **Implemented:** Node.js 20 on arm64, 128 MB, 10 second timeout, no dependencies. 15-minute in-memory cache per section, falls back to the last good copy if the feed fails. Only `https` links on the publisher's host pass through. The allowed sections are fixed in code (What's On, Food & drink, Family & kids, Music & nightlife, Latest news), so the function cannot be pointed at any other address; unknown sections return 400.
- **Evidence:** the deploy script (`backend/news-lambda/deploy-news.ps1`) run on 28 October 2026 reported "function test: 6 headlines" (direct invoke) and "public endpoint: 6 headlines". The live panel showed six cards whose links all opened on birminghammail.co.uk in a new tab.
- **What's On update (28 October 2026, evening):** deploy script re-run successfully: direct invoke returned 9 What's On headlines; the public endpoint returned What's On 9, Food & drink 9, Family & kids 9, Music & nightlife 3, Latest news 9, and rejected the unknown `business` section. The live panel was then checked in Chrome on all five tabs, with every link opening birminghammail.co.uk in a new tab. That check found shopping deals and a competition filed under `/whats-on/`, so the function now accepts only the event sub-sections (What's On news, food and drink, family, music and nightlife, arts and culture, theatre, film).
- **Evidence run (29 October 2026, 07:56 UTC):** configuration read back from AWS: Node.js 20, arm64, 128 MB, 10 s, environment variable names `SOURCE_NAME`, `FEED_BASE`, `MAX_ITEMS` (values not printed), role `portfolio-news-role` with only `AWSLambdaBasicExecutionRole` and no inline policies. Public calls: default 200 with 9 What's On items, food-drink 9, family 9, music 3, news 9; `business` refused with 400 as designed.

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

## Verified by the evidence run, 29 October 2026

### 6. Amazon CloudWatch Logs and metrics
- **Role:** records each function run and any feed failures, and counts invocations and errors.
- **Implemented:** Lambda writes to the log group `/aws/lambda/portfolio-news` (eu-west-2) through its basic execution role: a START, END and REPORT line for every run, plus `news fetch failed (<section>)` when a feed fails.
- **Evidence (verified):** the log group exists (8.4 KB stored, retention "never expires"); its three newest log streams last received events at 07:30:49, 07:30:51 and 07:55:22 UTC, matching the live checks made that morning. A harmless test request `GET /news?section=music` at 07:57:12 UTC returned 3 items, and its run appeared in the logs at 07:57:13 UTC: `REPORT RequestId: 73f0b106... Duration: 783.48 ms, Billed Duration: 784 ms, Memory Size: 128 MB, Max Memory Used: 112 MB`. CloudWatch metrics for the previous 24 hours: 40 invocations, 0 errors, 0 throttles; 0 feed failures logged.
- **Retention:** approved by Gibson on 29 October 2026: 30 days, applied with `scripts/aws/apply-approved-changes-2026-10-29.ps1` (before and after values recorded in `docs/evidence/aws-changes-2026-10-29.txt` once run).

### 7. AWS Budgets
- **Role:** cost guardrail.
- **Evidence (verified configuration):** budget `Personal-Learning-Budget`, type COST, period MONTHLY, limit 13.0 USD (roughly £10). Actual spend this period at 29 October 2026: 0.0 USD. Two alerts, both by email to a Gmail address (masked as `n***@gmail.com`): actual spend over 80%, and forecast spend over 100%. Both are in state OK (not triggered).
- **Not verified:** delivery. No alert has fired yet and no test alert was sent, so the alerts are configured but their arrival in the inbox has not been seen.
- **Important:** an AWS Budget only sends alerts. It does not stop spending or switch services off.
- Expected running cost of this build: within the AWS Free Tier at portfolio traffic.

## Planned (not deployed)

### 8. Contact form: AWS Lambda + Amazon API Gateway + Amazon SES
- **Role:** send messages from the contact form to Gibson's inbox without exposing an email address.
- **Status:** function code is in `backend/contact-lambda/` and the guide in `backend/README.md`; `ENDPOINT` in `js/contact.js` is empty, so the site shows the email and booking fallback. The evidence run confirms no `portfolio-contact` function exists. Amazon SES in eu-west-2 is in its default sandbox (production access off), so identity verification and a production-access request are still to do.

### 9. Not claimed
Amplify runs on AWS-managed infrastructure (for example a content delivery network and storage). Those parts are managed by Amplify and were not configured separately, so they are not listed as services used.

## How to refresh the evidence
Signed in as gibson-admin, from the project folder:
```powershell
powershell -ExecutionPolicy Bypass -File .\docs\evidence\collect-aws-evidence.ps1
```
It is read-only apart from one public GET to the site's own feed, masks the account ID and email addresses, prints no secret values, and sends no test alert. It saves a private copy to `scratch\` (git-ignored) and a masked copy to `docs\evidence\aws-evidence-<date>.txt` for review before committing.
