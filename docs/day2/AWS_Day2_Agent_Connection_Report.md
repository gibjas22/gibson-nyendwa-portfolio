# Day 2: Connect your coding agent - Implementation Report

**Learner:** Gibson Nyendwa
**Date and timezone:** 28 October 2026, Europe/London
**Overall status:** Executed successfully. Claude Code is connected to the AWS learning account through the AWS MCP Server and has made its own read-only AWS call as the IAM user `gibson-admin`.

## 1. Objective
Connect a coding agent to the personal AWS learning account using the officially supported method, prove the connection with a read-only call made by the agent itself, and record the result with sanitised evidence.

## 2. Guide followed
| Item | Value |
|---|---|
| Guide | Agent Toolkit for AWS setup instructions (official, AWS GitHub) |
| URL | https://raw.githubusercontent.com/aws/agent-toolkit-for-aws/refs/heads/main/setup-instructions/setup.md |
| Accessed | 28 October 2026 |
| Hackathon Day 2 guide | Not yet published on the event page when checked at 07:15; the AWS console's "Agent Toolkit for AWS" link led to the guide above |
| Agent chosen | Claude Code (supported by the toolkit) |
| Authentication | `aws login` browser sign-in, short-lived credentials, no access keys |
| Cost | None incurred: sign-in, identity checks and listing skills are free |

## 3. What "connected" means here
| Layer | Meaning | Status |
|---|---|---|
| A | Signed in to the coding assistant | Executed: Claude Code 2.1.312 signed in to Gibson's Claude account |
| B | Assistant can read the project | Executed: Claude Code opened in `gibson-nyendwa-portfolio` with `CLAUDE.md` loaded |
| C | AWS CLI authenticated | Executed: profile `gibson-portfolio`, IAM user `gibson-admin`, region eu-west-2 |
| D | Agent uses that AWS access itself | Executed: Claude Code called STS through `aws-mcp` and reported `user/gibson-admin` |
| E | Deploying or changing AWS resources | Not applicable: Day 2 is read-only |

## 4. Environment
| Item | Version or value |
|---|---|
| Operating system | Windows 11 (mini PC) |
| AWS CLI | 2.39.0 (official MSI, Authenticode signature verified by the installer) |
| uv / uvx | 0.13.6 (Astral official installer) |
| Claude Code | 2.1.312 (official Windows installer) |
| MCP proxy | mcp-proxy-for-aws 1.7.0, endpoint `https://aws-mcp.us-east-1.api.aws/mcp` |
| Git | 2.55.0 |
| Account | Personal learning account, masked as `********4263` |
| Regions | eu-west-2 (London) for the account and profile; us-east-1 for the Agent Toolkit service, which only runs there |

## 5. Authentication and permissions
- **How the user authenticates:** `aws login --region eu-west-2 --profile gibson-portfolio` opens the browser; the session of the console user signed in there is shared with the CLI.
- **Identity the agent uses:** IAM user `gibson-admin` (AdministratorAccess, MFA on console sign-in). Never root.
- **Where permissions are enforced:** IAM, on `gibson-admin`. The project `CLAUDE.md` additionally tells the agent to stay read-only and ask before any change or cost.
- **Session length:** credentials last 12 hours and renew for up to 90 days without a new browser sign-in (per the guide).
- **Disconnect:** `aws logout --profile gibson-portfolio`; remove the agent's AWS access with `claude mcp remove aws-mcp -s user`.
- **No long-lived access keys were created.**

Known limitation: the agent inherits `gibson-admin`'s full AdministratorAccess. A tighter option for later is a separate read-only IAM identity for agent work.

## 6. Steps (all executed successfully unless marked)
1. Installed AWS CLI v2 and uv with the official scripts.
2. Refreshed PATH in the open PowerShell window (installers update PATH only for new windows).
3. Installed Claude Code with the official Windows installer.
4. Set the profile region: `aws configure set region eu-west-2 --profile gibson-portfolio`.
5. First `aws login` signed in as **root**, because the browser's console session was root. Stopped, ran `aws logout`, and fixed the IAM user (see Problems).
6. Second `aws login` as `gibson-admin`; confirmed the CLI's prompt to overwrite the root session.
7. Verified: `aws sts get-caller-identity` returned `arn:aws:iam::********4263:user/gibson-admin`.
8. Ran `aws configure agent-toolkit --yes --region us-east-1 --profile gibson-portfolio`. It detected Claude Code, Cline, Codex and Cursor, installed 24 AWS skills and added the AWS MCP server.
9. `aws-mcp` failed to connect. Diagnosed with `claude mcp get aws-mcp`: "No AWS credentials available". Replaced the entry so it uses the profile, as the guide instructs:
   `claude mcp add aws-mcp -s user -e AWS_MCP_PROXY_PROFILES=gibson-portfolio -- uvx mcp-proxy-for-aws@latest https://aws-mcp.us-east-1.api.aws/mcp --metadata INSTALL_SOURCE=aws-cli`
10. `claude mcp list` then showed `aws-mcp ... Connected`.
11. Added the official AWS rules file (advanced experience) to the project `CLAUDE.md`, inside marker comments, below project-specific rules that take precedence.
12. Wrote `scratch/check-day2.ps1`, a read-only health check covering tools, sign-in, toolkit, rules file, every MCP server and an agent test.
13. Ran the check. Agent test result: `ARN=arn:aws:iam::********4263:user/gibson-admin`.

## 7. Problems and fixes
| Problem | Cause | Fix |
|---|---|---|
| `aws`, `uv` not recognised after install | PowerShell keeps the PATH it started with | Reloaded PATH in the session, or opened a new window |
| CLI signed in as root | `aws login` reuses whichever console user is signed in in the browser | `aws logout`; sign the browser in as `gibson-admin`; log in again |
| `gibson-admin` could not sign in | Day 1 password not known; an earlier reset was never applied (password age still "Yesterday") | Reset with a custom password as root, confirmed "Console access updated", then signed in |
| `gibson-admin` had no MFA | Not set up on Day 1 | Assigned an authenticator-app MFA device |
| `aws-mcp` timed out | Entry defaulted to a non-existent `default` profile | Re-added with `AWS_MCP_PROXY_PROFILES=gibson-portfolio` |
| Skills list stuck at `-- More --` | CLI pager | Press q; the check script sets `AWS_PAGER` to empty |
| Check script false FAIL on skills list | Non-ASCII characters in skill descriptions broke JSON parsing in a pipe | Script now requests only the skill count |
| "SessionEnd hook ... cancelled" after `claude -p` | A Claude Code plugin's tidy-up hook on exit | Harmless; occurred after the test passed |

## 8. Verification evidence
See `AWS_Day2_Evidence_Index.md`. Summary of the health check run at about 15:25:

- Tools: 5 of 5 PASS
- Sign-in: PASS, `user/gibson-admin`, eu-west-2
- Skills installed for Claude Code: PASS (27 folders)
- `CLAUDE.md` and AWS rules block: PASS
- MCP servers: darwin, xai-docs, west-midlands-news, aws-mcp: all Connected
- Agent test: PASS, agent reported `user/gibson-admin` via aws-mcp
- Toolkit catalogue check: false FAIL from the first version of the script; fixed version to be re-run

## 9. Status labels
- Executed successfully: steps 1 to 13.
- Prepared but not executed: tighter read-only IAM identity for the agent.
- Requires owner action: re-run the fixed check script and keep the screenshot as evidence.
- Not applicable: resource creation or deployment.
