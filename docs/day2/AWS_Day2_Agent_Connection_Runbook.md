# Day 2 Runbook: connect, verify, disconnect

Machine: Windows 11, PowerShell. Account region eu-west-2; Agent Toolkit region us-east-1.

## Rules
- Use IAM user `gibson-admin`, never root. Check the console's top-right name before `aws login`.
- Never paste passwords, MFA codes, keys or tokens into chat or files.

## 1. Install (once)
```powershell
irm 'https://awscli.amazonaws.com/v2/install.ps1' | iex
irm https://astral.sh/uv/install.ps1 | iex
irm https://claude.ai/install.ps1 | iex
```
Open a new PowerShell window, then `aws --version`, `uv --version`, `claude --version`.

## 2. Sign in (each new session, or after 90 days)
```powershell
aws configure set region eu-west-2 --profile gibson-portfolio
aws login --region eu-west-2 --profile gibson-portfolio
aws sts get-caller-identity --profile gibson-portfolio
```
The Arn must end `user/gibson-admin`. If it ends `:root`: `aws logout --profile gibson-portfolio`, sign the browser in as gibson-admin, repeat.

## 3. Agent Toolkit (once, or to update skills)
```powershell
aws configure agent-toolkit --yes --region us-east-1 --profile gibson-portfolio
claude mcp remove aws-mcp
claude mcp add aws-mcp -s user -e AWS_MCP_PROXY_PROFILES=gibson-portfolio -- uvx mcp-proxy-for-aws@latest https://aws-mcp.us-east-1.api.aws/mcp --metadata INSTALL_SOURCE=aws-cli
claude mcp list
```
Re-running the toolkit setup rewrites the MCP entry, so repeat the remove and add lines afterwards.

## 4. Verify
```powershell
cd C:\Users\gibso\gibson-nyendwa-portfolio
powershell -ExecutionPolicy Bypass -File .\scratch\check-day2.ps1
```
Add `-SkipAgentTest` to skip the Claude Code call.

## 5. Disconnect
```powershell
aws logout --profile gibson-portfolio        # ends the CLI session
claude mcp remove aws-mcp -s user            # removes the agent's AWS connection
```
Deleting a local profile does not change anything in AWS. To revoke access fully, remove permissions from `gibson-admin` in IAM or deactivate its console access.
