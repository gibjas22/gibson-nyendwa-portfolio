# Birmingham news feed: deployment guide

Shows the latest headlines from a public RSS feed on the Insights page: headline, a one-sentence preview (max 160 characters), date and a link to the publisher. No publisher photos are used; each card gets a themed graphic drawn by the site (travel, weather, sport, business, civic, what's on, general).

```
Visitor's browser ──GET──▶ API Gateway (HTTP API, throttled, CORS) ──▶ Lambda (Node.js 20) ──▶ RSS feed
                     ◀── JSON: headlines, links, dates (cached 15 min) ──
```

AWS services: AWS Lambda, Amazon API Gateway (HTTP API), Amazon CloudWatch Logs. Region: eu-west-2 (London).
Expected cost: within the Free Tier at portfolio traffic (Lambda: 1M requests/month free; HTTP API: 1M calls/month free for 12 months).

## Before you deploy
1. **Confirm the feed address** opens as RSS in a browser: `https://www.birminghammail.co.uk/news/?service=rss`. If it does not, find Birmingham Live's current feed link and use that.
2. **Check the publisher's terms** for RSS use. This build shows headlines, a one-sentence preview and links, with attribution, and copies no images or full article text. Only add publisher images if they confirm in writing that you may.

## Quickest: the deploy script
Signed in as gibson-admin (`aws login --region eu-west-2 --profile gibson-portfolio`), from the project folder:
```powershell
powershell -ExecutionPolicy Bypass -File .\backend\news-lambda\deploy-news.ps1
```
It checks the feed first, creates or updates the role, function and API, tests both the function and the public endpoint, and sets `NEWS_ENDPOINT` in `js/news.js`. Then commit and push. Safe to run again.

## Option A: AWS console (about 15 minutes, signed in as gibson-admin, region London)

### 1. Create the function
Lambda → Create function → Author from scratch
- Name: `portfolio-news`
- Runtime: Node.js 20.x, Architecture: arm64
- Execution role: create a new role with basic Lambda permissions (CloudWatch Logs only)

Code tab: replace `index.mjs` with this folder's `index.mjs` → Deploy.

Configuration → General: Timeout `10 sec`, Memory `128 MB`.
Configuration → Environment variables:
| Key | Value |
|---|---|
| FEED_URL | `https://www.birminghammail.co.uk/news/?service=rss` |
| SOURCE_NAME | `Birmingham Live` |
| LINK_HOST | `www.birminghammail.co.uk` |
| MAX_ITEMS | `6` |

Test tab: run a test with `{}`. Expect status 200 and an `items` list.

### 2. Create the HTTP API
API Gateway → Create API → HTTP API → Build
- Integration: Lambda `portfolio-news`; API name `portfolio-news-api`
- Route: `GET /news`
- Stage: `$default`, auto-deploy on

CORS (left menu):
- Access-Control-Allow-Origin: `https://main.dbthjbi29n1oo.amplifyapp.com`
- Access-Control-Allow-Methods: `GET`
- Max age: `3600`

Throttling (Protect → Throttling → Edit default route throttling): burst `10`, rate `5`.

Copy the **Invoke URL** and open `<Invoke URL>/news` in a browser: you should see JSON headlines.

### 3. Switch the panel on
In `js/news.js` set:
```js
const NEWS_ENDPOINT = "https://<your-id>.execute-api.eu-west-2.amazonaws.com/news";
```
Commit and push. The site's security policy already allows `*.execute-api.eu-west-2.amazonaws.com`.

## Option B: ask Claude Code (it uses your gibson-admin session via the AWS MCP Server)
In `C:\Users\gibso\gibson-nyendwa-portfolio`, run `claude` and paste:

> Deploy backend/news-lambda as described in backend/news-lambda/README.md, Option A, in eu-west-2: Lambda `portfolio-news` (Node.js 20, arm64, 10 s, 128 MB, the four environment variables), HTTP API `portfolio-news-api` with GET /news, CORS limited to https://main.dbthjbi29n1oo.amplifyapp.com and throttling burst 10 rate 5. Show me the plan and wait for my approval before creating anything. Then test the endpoint and tell me the Invoke URL.

Approve only the resources listed above.

## Remove it
Delete the HTTP API `portfolio-news-api`, the Lambda `portfolio-news`, its IAM role `portfolio-news-role-...` and the log group `/aws/lambda/portfolio-news`. Set `NEWS_ENDPOINT` back to `""`.
