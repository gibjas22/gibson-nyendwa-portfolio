# Day 2 Evidence Index

Every completion claim must point to a real artefact. Sensitive originals stay outside the repo; only redacted copies go into `docs/day2/evidence/`.

| Claim | Evidence required | File / record | Status |
|---|---|---|---|
| Guide read | Guide title, URL, access date | Report §2 | Outstanding |
| Cloud workspace inventoried | Command output (names only) | Report §4 | Recorded |
| Workstation inventoried | `aws --version`, OS, editor, agent versions | Report §4 | Outstanding |
| Agent installed and signed in | Screenshot of agent with sign-in state, no tokens visible | `evidence/01-agent-signed-in.png` | Outstanding |
| Project open in agent | Screenshot showing repo open | `evidence/02-project-open.png` | Outstanding |
| Owner CLI authentication | Masked `sts get-caller-identity` output | `evidence/03-sts-owner.txt` | Outstanding |
| Agent ran read-only AWS call | Agent transcript showing it executed the command, masked output | `evidence/04-sts-agent.png` | Outstanding |
| Guide exercise complete | As the guide specifies | TBC | Outstanding |
| Session ended | `aws logout` output or note | `evidence/05-logout.txt` | Outstanding |

Redaction rule: mask account IDs to the last four digits, remove ARNs' user path if sharing publicly, crop browser address bars showing sign-in URLs, never show keys or tokens.
