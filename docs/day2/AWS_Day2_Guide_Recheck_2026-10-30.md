# Day 2 re-check against the official guide (30 October 2026)

**Guide:** "How to connect your coding agent to AWS", Ana Cunha, AWS Developer Advocate. Article 2 of the series "Build your website on AWS". Published 28 October 2026, last modified 29 October 2026.
**Why a re-check:** Day 2 was done on 28 October from the Agent Toolkit for AWS setup instructions, before this article was available. This document checks the existing setup against the published guide, step by step, and records what was confirmed again today.
**Rule for this check:** read-only. Nothing is created or changed in AWS.

## Step-by-step comparison

| Guide step | What the guide asks for | Done on 28 October | Status on 30 October |
|---|---|---|---|
| Create a folder for the project | Open the project folder in the agent; part of the setup is saved there | `C:\Users\gibso\gibson-nyendwa-portfolio`, opened in Claude Code | Matches |
| Copy the setup prompt | Console Home, "Copy agent prompt", which carries the project's Region | Not used: the console link led to the Agent Toolkit setup instructions, which run the same setup (`aws configure agent-toolkit`) | Equivalent route. Only the delivery of the instructions differs |
| Sign-in from the browser | `aws login`, temporary credentials, no access keys | `aws login --region eu-west-2 --profile gibson-portfolio`, as IAM user `gibson-admin` (not root), MFA on | Matches. Re-confirm below |
| AWS MCP Server | Adds tools to search current AWS documentation and make AWS calls with your permissions | `aws-mcp` added to Claude Code, fixed to use the `gibson-portfolio` profile; `claude mcp list` showed Connected | Matches. Re-confirm below |
| Skills | AWS skills such as `aws-serverless`, `aws-cdk`, `aws-iam` | 24 skills installed for every detected agent (Claude Code, Cline, Codex, Cursor) | Matches. Update below |
| A rule for this folder | A file in the project folder that tells the agent how AWS projects work | Official AWS rules in `CLAUDE.md` between marker comments, below the project's own rules (which take precedence) | Matches |
| Profile name | The agent suggests one named after the project | `gibson-portfolio` | Matches |
| Restart the agent | Start a new conversation so it loads the connection and skills | Done | Matches |
| Check the connection | Ask the agent in a new conversation to confirm the MCP Server, the sign-in and the Region, without changing anything | Proved with the health check: the agent called STS through `aws-mcp` and reported `user/gibson-admin` | The guide's own check prompt has not been run yet. Run it below |
| Guidance level | The agent asks for low, medium or high guidance | Not recorded | Record the choice below |
| Sign-in lasts up to 12 hours | After that, `aws login --profile <name>` again | Runbook said 12 hours, renewing for up to 90 days | Both come from AWS text: the session lasts up to 12 hours; signing in again is quick |
| Keep skills up to date | `aws agent-toolkit update-skill --all` | Not in the runbook | Added to the runbook. Run below |

## Differences that matter

1. **Toolkit Region.** The account and profile use eu-west-2 (London). The Agent Toolkit service ran in us-east-1 on 28 October, because the toolkit runs only there. The guide's prompt "includes your project's Region"; that Region is where resources are created, which stays eu-west-2.
2. **Console "project".** The guide expects a project name in the upper right of the console. Check whether one shows. If not, the setup still works: it is tied to the signed-in IAM user and profile, not to a console project. Creating a console project would change the account, so it needs Gibson's approval first.
3. **Agent permissions.** The agent uses `gibson-admin`, which has AdministratorAccess. The guide notes the MCP Server has "the same permissions you have when you sign in". `CLAUDE.md` keeps the agent read-only by default, but IAM does not enforce that. A separate read-only identity for agent work is still planned, not built.

## Re-check commands (Gibson runs these in PowerShell)

```powershell
cd C:\Users\gibso\gibson-nyendwa-portfolio
$env:AWS_PAGER = ""
aws --version
aws login --region eu-west-2 --profile gibson-portfolio
aws sts get-caller-identity --profile gibson-portfolio --query Arn --output text
aws agent-toolkit update-skill --all --profile gibson-portfolio --region us-east-1
aws agent-toolkit list-installed-skills --profile gibson-portfolio --region us-east-1 --no-cli-pager --query "length(skills[?agent=='Claude Code'])" --output text
claude mcp list
powershell -ExecutionPolicy Bypass -File .\scratch\check-day2.ps1
```

Then the guide's own check, in a new Claude Code conversation started from the project folder:

```powershell
claude -p "Check that the AWS MCP Server is connected and that I'm signed in to AWS. Confirm the Region configured for this project. Do not create or change any AWS resources. Show the account ID only as its last four digits." --allowedTools "mcp__aws-mcp"
```

`--allowedTools "mcp__aws-mcp"` is needed when the prompt runs non-interactively (`claude -p`): without it Claude Code cannot ask permission to use the AWS tools, so it can only report the server as loaded. In an interactive session, start `claude` and approve the AWS tool when asked instead.

Expected: the ARN ends `user/gibson-admin`; the skills update finishes without errors; `aws-mcp` shows Connected; the health check ends with all checks passed; the agent confirms the MCP Server, the sign-in and eu-west-2.

## Results

Run on 30 October 2026, about 16:20 London time, by Gibson in PowerShell on the mini PC. Account ID masked to its last four digits.

| Check | Result | Evidence |
|---|---|---|
| AWS CLI version | 2.39.0 (meets the toolkit minimum, 2.35.0) | `aws --version`: `aws-cli/2.39.0 Python/3.14.8 Windows/11` |
| Signed in as `gibson-admin` | Passed | `aws login` then `sts get-caller-identity`: `arn:aws:iam::********4263:user/gibson-admin` (not root) |
| Skills updated | Passed | `update-skill --all`: `aws-sdk-js-v3-usage` updated to v2 for Claude Code, Cline, Cursor and the universal folder (Codex, Devin, Gemini CLI, OpenCode, Windsurf); the other skills were already current |
| `aws-mcp` Connected | Passed | `claude mcp list`: `aws-mcp: uvx mcp-proxy-for-aws@latest https://aws-mcp.us-east-1.api.aws/mcp ... Connected` |
| Health check all passed | Passed: 20 of 20 | `check-day2.ps1`: tools 5/5; profile region eu-west-2; signed in as `********4263:user/gibson-admin`; toolkit reachable (118 skills in the catalogue); 27 skill folders for Claude Code; `CLAUDE.md` and AWS rules block present; 7 MCP servers Connected including `aws-mcp`; agent test returned `ARN=arn:aws:iam::********4263:user/gibson-admin`. Summary line: "ALL CHECKS PASSED - Day 2 setup is complete." This closes the outstanding item from 28 October |
| Guide's check prompt | Passed (second run) | Re-run at about 16:28 with `--allowedTools "mcp__aws-mcp"`. The agent reported: AWS MCP Server connected, its tools ran live calls; signed in, `sts:GetCallerIdentity` through the MCP server returned IAM user `gibson-admin` (not root), account ending `4263`; Region in use eu-west-2, shown by `ec2:DescribeAvailabilityZones` returning only eu-west-2 zones. Read-only calls only. It could not read the profile's own Region setting itself (no approval for that); the health check above confirms it is eu-west-2. The first run, without `--allowedTools`, could not call AWS |
| Guidance level chosen | High | Chosen by Gibson on 30 October 2026, as he is new to AWS. Recorded as a project rule in `CLAUDE.md` so every session uses it |
| Console project name shown | Not checked | Gibson to look at the upper right of the AWS Console; no change to be made without approval |

## Notes from the run
- The full `list-installed-skills` table stops at "-- More --" in PowerShell even with `AWS_PAGER` empty. The runbook now uses `--no-cli-pager` and prints only the Claude Code count.
- `claude -p` prints "SessionEnd hook ... failed: Hook cancelled" when it exits. This comes from a Claude Code plugin's tidy-up step, after the answer, and does not affect the result (also seen on 28 October).
- In the guide-prompt run, the agent also reported that a PowerShell tool inside Claude Code failed with "The command line is too long". That is a separate Claude Code issue, not part of the AWS connection.

## Outcome
The Day 2 setup matches the published guide. Sign-in, skills, the AWS MCP Server, the project rules and an agent-made AWS call are all confirmed again on 30 October 2026, and the skills are now up to date. The guide's own check prompt also passed on its second run. Guidance is set to high in `CLAUDE.md`. One small item remains for Gibson: check whether a console project name shows.
