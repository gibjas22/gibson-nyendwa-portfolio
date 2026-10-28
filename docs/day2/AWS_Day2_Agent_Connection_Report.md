# Day 2: Connect your coding agent — Implementation Report

**Learner:** Gibson Nyendwa
**Date and timezone:** 28 October 2026, Europe/London
**Overall status:** Requires owner action. Guide not yet read; no connection made.

## 1. Objective
Connect the coding agent named in the official Day 2 guide to Gibson's personal AWS learning account using the supported authentication method, prove it with a minimal read-only test run *by the agent*, and record the result with sanitised evidence.

## 2. Guide
| Item | Value | Status |
|---|---|---|
| Title | Day 2 (Wed 28 Oct): Connect your coding agent | Confirmed from the event page summary |
| URL | Not yet supplied | Requires owner action |
| Access date | Not yet accessed | Requires owner action |
| Required agent | Unknown until the guide is read | Requires owner action |
| Authentication method | Unknown | Requires owner action |
| Required permissions | Unknown | Requires owner action |
| Exercise and completion criteria | Unknown | Requires owner action |
| Screenshot requirement | Unknown | Requires owner action |
| Potential costs | Unknown; none expected for authentication alone | To confirm |

Checked in Chrome at 07:15 on 28 October: the hackathon's About and Discussion tabs list Day 2 by title only. The latest organiser post is the Day 1 announcement (posted about 20:00 London time on 27 October). **The Day 2 guide has not been published yet.** A public web search also found no indexed copy. It is assumed to sit behind the Builder Center event page. No tool has been chosen; the earlier mention of Kiro or Amazon Q Developer was speculation and is not relied on here.

## 3. What "connected" means for this exercise
| Layer | Meaning | Required by guide? |
|---|---|---|
| A | Signing in to the coding assistant | To confirm |
| B | Assistant can read the local project files | To confirm |
| C | AWS CLI, SDK or connector authenticated | To confirm |
| D | Agent itself can use that AWS access | To confirm |
| E | Deploying or changing AWS resources | To confirm (Day 4 is deployment, so probably not) |

A Builder ID login, an installed extension or an open Console tab will not be recorded as proof of C or D.

## 4. Environment inventory (executed 28 Oct, 07:1x)
| Environment | Finding | Status |
|---|---|---|
| Gibson's Windows workstation | Not reachable: the desktop link to this session was disconnected | Requires owner action (reopen the chat in the Claude desktop app) |
| Claude's cloud workspace (Linux 6.18, Node 22.23.4, Python 3.13.17) | AWS CLI **not installed** | Executed |
| Claude's cloud workspace credentials | `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` variable *names* are present, set by the hosting platform; `~/.aws/config` has only an empty `[default]` profile. These do **not** belong to Gibson's account and were deliberately not used or tested | Executed (names only, no values read) |

Known from Day 1 (not re-verified today):
- Account: personal learning account, masked as `****-****-XXXX`, alias to be confirmed
- Region: eu-west-2 (London)
- Routine identity: IAM user `gibson-admin` with MFA; root has MFA and no access keys
- IAM Identity Center: **not configured** on this account
- Existing app: Amplify app hosting the portfolio (not to be touched)

## 5. Current assistant's capability (honest statement)
The assistant used so far is Claude in the Claude app (cloud workspace plus, when linked, a shell on Gibson's computer). It has **no AWS connector** and holds no credentials for Gibson's account. It can only reach AWS by running the AWS CLI on Gibson's computer through the desktop link, using a profile Gibson authenticates himself. Until that is done and the agent runs the read-only test itself, layer D is not complete.

## 6. Authentication approach (provisional, not applied)
Preferred route, pending the guide:
1. AWS CLI v2 installed on the workstation from the official AWS installer.
2. Short-lived credentials via **`aws login`** (console-credential sign-in, CLI 2.32+) or, if the guide specifies it, IAM Identity Center with a permission set. Identity Center is not currently set up, so it would be a new configuration needing review first.
3. A named profile such as `gibson-portfolio`, never changing the global default.
4. No long-lived access keys unless the guide requires them and Gibson approves explicitly.
5. Permissions: a scoped read-only policy for the test; no AdministratorAccess granted to the agent's session.

Exact commands go in the runbook once the guide confirms the route.

## 7. Implementation steps
| # | Step | Status |
|---|---|---|
| 1 | Search for the official guide | Executed: not publicly available |
| 2 | Inventory cloud workspace | Executed |
| 3 | Inventory Windows workstation | Requires owner action (reconnect) |
| 4 | Read guide and fix the tool choice | Requires owner action (paste guide) |
| 5 | Install agent / CLI | Prepared but not executed |
| 6 | Owner signs in via official flow | Requires owner action |
| 7 | Read-only test by owner (`aws sts get-caller-identity --profile <name>`) | Prepared but not executed |
| 8 | Same test run by the agent | Prepared but not executed |
| 9 | Guide's own exercise | Not yet known |
| 10 | Sanitised screenshots | Requires owner action |

## 8. Problems and fixes
- Guide not publicly accessible → requested from owner.
- Workstation link down → cannot inspect versions or profiles; requested reconnect.
- Platform-supplied AWS variables in the cloud workspace → flagged and excluded so they cannot be mistaken for Gibson's account.

## 9. Verification evidence
None yet. See `AWS_Day2_Evidence_Index.md`.

## 10. Limitations
No completion is claimed. No AWS call has been made against any account today.

## 11. Disconnect and cleanup
Nothing created, so nothing to remove yet. The runbook holds the disconnect steps for when a session exists.
