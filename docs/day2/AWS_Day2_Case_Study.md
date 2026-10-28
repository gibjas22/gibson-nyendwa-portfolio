# Case study: connecting an AI coding agent to AWS, safely

## The problem
Day 2 of the AWS Student Builder Challenge asked me to connect a coding agent to my AWS account. The easy route would have been long-lived access keys. I wanted the agent to work through short-lived credentials, as a named IAM user rather than root, and to prove the connection with a call the agent made itself.

## My role
I made the decisions, ran every command on my own Windows machine, and did every sign-in, password and MFA step myself. Claude (AI) read the official AWS guide with me, wrote the commands, diagnosed errors from my output, opened console pages for me, and drafted these documents.

## Tools
AWS CLI 2.39.0, `aws login`, Agent Toolkit for AWS (24 AWS skills plus the AWS MCP Server), mcp-proxy-for-aws, Claude Code 2.1.312, IAM, PowerShell.

## Access-control decisions
- Browser-based `aws login`: short-lived credentials, no access keys stored on disk.
- Named profile `gibson-portfolio`, so nothing touches a global default.
- The agent acts as IAM user `gibson-admin`, never root. When the first sign-in picked up a root browser session, I stopped, logged out and redid it.
- Added MFA to `gibson-admin`, which was missing.
- A project `CLAUDE.md` tells the agent to stay read-only, ask before any change or cost, and never handle credentials. AWS's own rules sit below it.

## Verification
A read-only PowerShell health check confirms the tools, the sign-in identity, the installed skills, the rules file and every MCP connection, then asks Claude Code to call AWS STS through the MCP server. Result: `arn:aws:iam::********4263:user/gibson-admin`.

## Troubleshooting
- New installs not found: PowerShell keeps its old PATH until restarted.
- CLI signed in as root: `aws login` reuses the browser's console session.
- IAM user could not sign in: an earlier password reset had not been applied; I checked the "password age" before and after.
- MCP server timed out: it defaulted to a profile that did not exist; `claude mcp get` showed "No AWS credentials available", and adding `AWS_MCP_PROXY_PROFILES` fixed it.

## Outcome
Claude Code is connected to my AWS account through the AWS MCP Server with short-lived credentials, as a non-root IAM user with MFA, and has proved it with its own read-only call.

## What I learnt
Authentication and identity are different questions: being "logged in" says nothing about *who* you are logged in as. Checking `get-caller-identity` after every sign-in caught a root session that would otherwise have gone unnoticed. Next step: a separate read-only identity for agent work, so the agent does not inherit administrator rights.

## Separation of work
- I performed: all installs, sign-ins, password reset, MFA, every command.
- AI assisted: reading the guide, command writing, error diagnosis, documentation.
- Automatic: the toolkit wizard installed skills and the MCP entry.
- Outstanding: a read-only IAM identity for the agent (planned, not built).

## CV bullet
Connected an AI coding agent (Claude Code) to AWS through the AWS MCP Server using short-lived `aws login` credentials and a non-root, MFA-protected IAM user; verified access with an agent-run read-only STS call and an automated PowerShell health check.
