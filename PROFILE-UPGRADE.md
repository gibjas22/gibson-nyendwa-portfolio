# Profile upgrade — 28 October 2026

## Comparison and scope

Reference inspected in the browser: https://main.d1931ionu4gntw.amplifyapp.com/#about

The reference has quick facts, coursework, evidence-oriented skills, project descriptions, recognition, a career timeline and an interactive era selector. Its technical claims and awards belong to its author and have not been copied.

This change adapts the useful information architecture to Gibson's existing purple design: quick facts, a dedicated learning section with topic filters, a narrative journey and skill-to-evidence links. Existing project filtering, Insights, legal pages, booking and the mixing-desk feature are preserved. No backend, paid service, new dependency or AI endpoint is introduced.

## Content provenance

All new public facts are reorganised from the portfolio's existing index.html. They are not independently verified credential records. Labels already marked in progress retain that status. MBCS is labelled professional membership rather than a certification. Dates are used only where the existing site supplies them; undated journey entries are narrative strands, not asserted employment dates. No certificate verification buttons or invented evidence URLs are added.

LinkedIn was attempted at the user-supplied URL, but the browser displayed a LinkedIn sign-in wall. Additional LinkedIn training is therefore not imported. To complete that enrichment, supply a profile PDF or the Education and Licences & Certifications text, including exact award names, dates, status and any public credential URLs. Do not publish credential IDs or certificate scans without checking for personal data.

## Owner checks before further enrichment

- Existing portfolio says Higher Certificate in Criminology and Criminal Justice; earlier background records describe a BA. Confirm the exact award before changing it.
- Existing portfolio describes Gibcom activity since 2016; earlier background records give company incorporation in January 2019. These may be different events; do not silently equate them.
- Confirm the current status of courses labelled in progress, including Psychology and AET.
- ISO 27001 currently appears without a precise award level or issuer. Do not upgrade it to auditor/implementer certification without evidence.
- Existing customer totals, completed-build wording, and live-operation claims remain outside this layout change and should receive a separate evidence review.

## Editing and rollback

Learning and journey content is static HTML in index.html, readable without scripts. Topic filtering is in js/learning.js; styling uses existing tokens in css/styles.css. All learning remains visible if JavaScript is disabled. The main navigation switches to the existing mobile-menu layout below 1180px to accommodate the additional links.

Rollback: revert the profile-upgrade commit. This restores the previous qualifications block and navigation without changing backend or AWS settings.

## Verification

Passed: JavaScript syntax; git diff whitespace checks; HTML parsing; unique IDs; seven learning cards; five journey milestones; new internal link targets; hidden filter controls before script enhancement. A Node DOM harness checked all five filter counts, exclusive selected states, live status updates, reset and safe handling when the section is absent.

Not completed: real-browser rendering, keyboard interaction, responsive visual checks and deployment verification. The connected browser was unavailable; the cloud browser could inspect both live sites but could not reach the local preview. Playwright was present but its browser binary was absent, and its browser download failed. The responsive breakpoint and reduced-motion behaviour have been inspected in code, not verified in a rendered preview. No screenshots of the new build are claimed.

The implementation is provided on a review branch. The existing production site has not been updated by this change. Deployment and LinkedIn verification remain separate from implementation.
