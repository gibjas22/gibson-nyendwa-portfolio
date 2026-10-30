# Submission guide: AWS Student Builder Challenge 2026

Deadline: **6 November 2026**. Check the cut-off time and time zone on the challenge page in AWS Builder Center, and aim to submit by 5 November so there is a day in hand.

Live site: https://main.dbthjbi29n1oo.amplifyapp.com
Repository: https://github.com/gibjas22/gibson-nyendwa-portfolio

The submission form's exact fields are set by the challenge page. This guide covers what the four-part "Build your website on AWS" series asks for and prepares the material most forms request. Check the form itself before submitting.

## 1. Where each day stands

| Day | Guide | Record in this repository | Status |
|---|---|---|---|
| 1 | How to create your AWS account and first project | `SETUP-GUIDE.md`, `BUILD-LOG.md` (27 October) | Complete |
| 2 | How to connect your coding agent to AWS | `docs/day2/` (report, runbook, case study, evidence index, re-check of 30 October) | Complete: health check 20 of 20, the guide's check prompt passed, guidance level high |
| 3 | How to plan and build your portfolio | `docs/day3/AWS_Day3_Guide_Check.md`; `plan.md` kept on Gibson's computer | Complete |
| 4 | How to put your website online | `docs/day4/AWS_Day4_Guide_Check.md` | Complete; three read-only confirmations listed in that file |

## 2. Before you submit (in this order)

### Must do
1. **Amplify evidence.** Run the read-only evidence script (Day 4 file, step 1) and commit the masked output, so the record shows the latest deployments.
2. **Read the live site as a visitor**, on a phone and on a computer:
   - Introduction, Selected work, the desk, About, Contact.
   - Push a fader; hold Studio at 100 for two seconds; open one case study; open Insights.
   - Check nothing is wrong or out of date about you, your work or your dates.
3. **Clara's status.** Done 30 October: Clara is shown as in development, part of the private AIBOS Command Centre, on the home page and in her case study.
4. **Booking.** Moved to Calendly on 30 October (https://calendly.com/gcmarketingsupportbookings/discovery-call), Monday to Friday 9:30am to 5pm. Still to do: connect Zoom in Calendly, then book one test call from the live site and check the invitation reaches info@gcmarketingsupport.co with the right time and meeting link. Cancel the test afterwards.
5. **Make sure the repository is clean.** `git status` should say "nothing to commit, working tree clean", and the latest commit should be live (Day 4 file shows how this was checked).

### Should do
6. **Five-person phone test** from the review brief: ask five people new to the site to explain what you do, open a relevant project and find a contact option. Note how many manage each within 30 seconds.
7. **Other browsers.** Open the site once in Safari (iPhone) and Firefox; everything so far was tested in Chromium.
8. **GitHub access for Amplify.** Confirm "Only select repositories" (Day 4 file, step 2).
9. **Tidy up local files.** Delete the transfer files in `content/drafts/` (`*.b64.txt`, `md5.txt`, `device-md5.txt`). Git already ignores them.

### Nice to have
10. Approved screenshots for Clara or AIBOS with example data only, to replace the logo on the Clara card.
11. The Studio channel's own audio: the Invincible Battles master, prepared with `scripts/prepare-studio-audio.sh`, then set `stemReady` to `true` in `js/channels.js`.
12. A separate read-only IAM identity for the coding agent, so it does not inherit administrator rights (planned on Day 2, not built). Ask before creating anything in AWS.

## 3. Material for the submission form

Use these if the form asks for them. Every statement is backed by the repository; change the wording to your own voice.

**Project name:** Gibson Nyendwa: a portfolio with a mixing desk that plays my life

**Short description (about 50 words):**
A personal portfolio built in plain HTML, CSS and JavaScript and hosted on AWS Amplify Hosting. Its creative feature is a working mixing desk: seven faders, one for each strand of my life, each revealing a story and playing a real audio loop. Hold the Studio fader at the top to unlock my music.

**Creative feature and hint:** The Mixing Desk. The visible hint is "Hear my story" in the header, plus "try the mixing desk" under the introduction. The Studio channel is locked: push it to 100 and hold for two seconds to unlock The Unsaid Sound and the Parsifal story. The seven stories can also be read as text, so the rest of the site never depends on playing.

**AWS services used:** AWS Amplify Hosting (deployed from GitHub on every push, security headers from `customHttp.yml`, custom 404); AWS Lambda and Amazon API Gateway (the What's On in Birmingham headlines); Amazon CloudWatch Logs (30-day retention); AWS IAM (MFA-protected admin user, least-privilege Lambda role, no access keys); AWS Budgets (monthly alert); Agent Toolkit for AWS and the AWS MCP Server (Claude Code connected with short-lived sign-in). Detail and evidence: `docs/AWS-SERVICES.md`.

**What I learned:** take from the "What I learnt" sections in `docs/day2/AWS_Day2_Case_Study.md` and the portfolio case study (`projects/portfolio.html`), in your own words.

**How AI was used:** Claude (AI) helped plan, write and test code and documents; Gibson made the decisions, ran every AWS and Git command, and did every sign-in. The split is set out in `docs/day2/AWS_Day2_Case_Study.md`.

**Screenshots** (if asked): the home page introduction, the mixing desk with faders up, the unlocked Studio story, a case study, and the site on a phone. Take them from the live site, not from the computer copy.

## 4. Sharing the link

The Day 4 guide ends by suggesting you share the link: on your CV, on LinkedIn, and in the comments under the guide on AWS Builder Center. That is optional. If you do, use the live site link, not the repository.

## 5. After judging

- **Keep it running:** the site costs little (the guide says usually under a dollar a month for a portfolio) and the budget alert stays in place.
- **Or take it down,** only after judging has finished and you no longer need the link: in Amplify, open the app, choose App settings, General settings, then Delete app. To remove the news feature too, delete the Lambda function `portfolio-news`, the API `portfolio-news-api` and the role `portfolio-news-role` in eu-west-2. Each of these is a change to the AWS account, so plan it with the coding agent first and confirm each step.
- Deleting the GitHub repository is separate; the code can stay public as a record of the work.
