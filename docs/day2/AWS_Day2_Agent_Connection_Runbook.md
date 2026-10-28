# Day 2 Runbook: connect, verify, disconnect

Status: **draft**. Steps marked [CONFIRM] change once the official guide is read.

## Before you start
- Use the personal learning account only (region eu-west-2). Never the root user.
- Never paste passwords, MFA codes, keys or tokens into chat or any file in the repo.
- The repo `.gitignore` must never contain an exception for `.aws/`.

## 1. Install (Windows, PowerShell)
```powershell
# Official AWS CLI v2 MSI from AWS
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi
# New PowerShell window, then:
aws --version            # record the version
aws configure list-profiles   # lists names only; record which exist
```
[CONFIRM] Install the coding agent or extension named in the guide, from its official source only. Record publisher and version.

## 2. Authenticate (short-lived, named profile)
Option A, console-credential sign-in (CLI 2.32 or later):
```powershell
aws login --profile gibson-portfolio
```
A browser opens; you sign in as `gibson-admin` with MFA yourself. Session credentials are short-lived and refresh automatically for a limited time.

Option B, IAM Identity Center [CONFIRM: only if the guide requires it; not set up on this account today]:
```powershell
aws configure sso --profile gibson-portfolio
aws sso login --profile gibson-portfolio
```

## 3. Verify (owner)
```powershell
aws sts get-caller-identity --profile gibson-portfolio
```
Expected: an `Arn` ending `user/gibson-admin` (or the Identity Center role) and an account number. Mask all but the last four digits before sharing.

## 4. Verify (agent)
Ask the agent to run the same read-only command using `--profile gibson-portfolio`. Record whether *the agent* executed it and the masked result. If the agent cannot run AWS commands, record that plainly; do not claim layer D.

## 5. Re-authenticate after expiry
```powershell
aws login --profile gibson-portfolio        # Option A
aws sso login --profile gibson-portfolio    # Option B
```

## 6. Disconnect
```powershell
aws logout --profile gibson-portfolio       # Option A
aws sso logout                              # Option B
```
Then sign out of the coding agent. Removing a local profile does **not** revoke anything in AWS: to revoke, remove the policy or permission set in IAM / Identity Center, or deactivate the user's console session in IAM.
