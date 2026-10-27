# Build log

Three lines a day: what I did, what broke, what I learned. This becomes the Builder Center write-up.

## Day 1, Tuesday 27 October 2026

**Did:** Created a personal AWS account (separate from my business), set the default Region to London, enabled MFA on the root user, created an IAM user `gibson-admin` with AdministratorAccess and MFA so I never work as root again, and set up this repository. Chose the creative feature: a working mixing desk where every fader is a strand of my life and the Studio channel unlocks my music.

**Broke:** Nothing yet. The browser automation I use could not reach my Chrome extension, so some console steps were done by hand.

**Learned:** Root is for billing emergencies only. An IAM user with admin rights plus MFA is the everyday account. An AWS Budget is an alert, not a spending cap, so it tells you about overspend rather than stopping it.

**Setup note:** Cloned to the mini PC and verified push access, 27 Oct.
