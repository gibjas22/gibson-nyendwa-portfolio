# Gibson Nyendwa, portfolio

My personal portfolio, built for the **AWS Student Builder Challenge 2026** and hosted on **AWS Amplify Hosting**.

**Live site:** https://main.dbthjbi29n1oo.amplifyapp.com

## What it is

A one-page portfolio: an introduction, three selected projects, the mixing desk, About me, Tech superpowers, the career tracklist, the SEND Life Transition podcast and contact. Seven case-study pages and an Insights section sit behind it.

The creative feature is **The Mixing Desk**: seven faders, one for each strand of my life. Push a fader up and the story behind that channel appears; turn the sound on and a real audio loop plays. Push the Studio fader to 100 and hold it there for two seconds and it unlocks my music as The Unsaid Sound.

The hint is in the navigation bar: **Hear my story**. The stories can also be read as plain text, so nobody has to play to get to the rest of the site.

## Stack

- Plain HTML, CSS and JavaScript. No framework, no packages, nothing to build before deploying.
- Web Audio API for the desk.
- AWS Amplify Hosting, deployed from this repository on every push to `main`.
- A small AWS Lambda function behind Amazon API Gateway for the Birmingham What's On headlines.
- IAM user with MFA for everyday access, short-lived `aws login` sign-in, an AWS Budgets alert for cost.

## Structure

```
index.html            the home page
projects/             one case-study page per project (generated, see below)
insights/             articles and What's On in Birmingham
css/                  styles.css, desk.css
js/                   desk.js, channels.js, projects.js, theme.js and the other page scripts
assets/               audio, images, logos, fonts, video
backend/              the news Lambda function and the (not yet deployed) contact function
docs/                 day-by-day AWS setup records (day2, day3), services, themes, evidence
scripts/              build-projects.mjs and AWS helper scripts
BUILD-LOG.md          daily notes that become the write-up
CREDITS.md            audio, image, font and logo sources and licences
```

Case studies live in `js/projects.js`. After editing it, run `node scripts/build-projects.mjs` to rewrite `projects/*.html` and the sitemap, then commit the result. This runs on my computer, not on Amplify.

## Run locally

Open `index.html` in a browser, or from the repo folder:

```
python -m http.server 8000
```

then visit http://localhost:8000. Audio only loads after you turn the sound on.

## Author

Gibson Nyendwa, Birmingham, UK. Educator, agency founder, student, musician.
