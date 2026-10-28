# Day 2 Evidence Index

Sensitive originals stay outside the repo. Shareable evidence masks the account ID to its last four digits.

| Claim | Evidence | Where | Status |
|---|---|---|---|
| Tools installed with versions | Health check section 1 | Screenshot of `check-day2.ps1` run, 28 Oct, about 15:25 | Captured (PowerShell output) |
| CLI signed in as gibson-admin, eu-west-2 | `sts get-caller-identity`, health check section 2 | PowerShell output, Arn `********4263:user/gibson-admin` | Captured |
| Root session removed from CLI | `aws logout`, then overwrite prompt accepting `user/gibson-admin` | PowerShell transcript | Captured |
| gibson-admin password reset and MFA | Console banners "Console access updated" and "MFA device assigned" | Screenshots sent in chat | Captured |
| Agent Toolkit installed | Wizard output: 24 skills, MCP configured for Claude Code | PowerShell transcript | Captured |
| aws-mcp connected | `claude mcp list` showing `aws-mcp ... Connected` | PowerShell output; health check section 5 | Captured |
| Agent made its own AWS call | `claude -p` result `ARN=arn:aws:iam::********4263:user/gibson-admin` | Health check section 6 | Captured |
| Rules file in project | `CLAUDE.md` in repo, AWS block between markers | Git repository | Captured |
| Full green run of fixed health check | Summary "ALL CHECKS PASSED" | Screenshot to take | Outstanding |
