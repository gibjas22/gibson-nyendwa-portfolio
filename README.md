# Gibson Nyendwa, portfolio

My personal portfolio, built for the **AWS Student Builder Challenge 2026** and hosted on **AWS Amplify Hosting**.

**Live site:** coming Day 4 (Friday 30 October 2026)

## What it is

A single-page portfolio with three core sections (About Me, Tech Superpowers, Projects and Achievements) and one creative feature: **The Mixing Desk**. Seven faders, one for each strand of my life. Push a fader up and a real audio loop plays while the story behind that channel appears. Push the Studio fader to the top and it unlocks my music as The Unsaid Sound.

The hint is in the navigation bar: **Hear my story**.

## Stack

- Plain HTML, CSS and JavaScript, no framework, no build step
- Web Audio API for the desk
- AWS Amplify Hosting (CloudFront distribution, S3 storage) deployed from this repository on every push to `main`
- IAM user with MFA for everyday access, AWS Budgets alert for cost visibility

## Structure

```
index.html
css/      styles.css, desk.css
js/       main.js, desk.js, channels.js
assets/   audio/, img/
BUILD-LOG.md   daily notes that become the write-up
CREDITS.md     audio sources and licences
```

## Run locally

Open `index.html` in a browser, or from the repo folder:

```
python -m http.server 8000
```

then visit http://localhost:8000. Audio stems only load after your first click on the desk.

## Author

Gibson Nyendwa, Birmingham, UK. Educator, agency founder, student, musician.
