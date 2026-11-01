# Type scale

Set on 1 November 2026, when the headings were reduced at Gibson's request ("the headings look too big"). One family throughout (Inter); the SuperPowers banner keeps its own display fonts (see KINETIC-BANNER.md).

| Role | Phone (360 px) | Desktop (1440 px) | Rule |
|---|---|---|---|
| Page title (h1) | 28 px | 42 px | `clamp(1.75rem, 1rem + 2.2vw, 2.625rem)` |
| Section heading (h2) | 22 px | 30 px | `clamp(1.375rem, 1.05rem + 1.4vw, 1.875rem)` |
| Card heading (h3) | 18 px | 18 px | `1.125rem` (feature cards 18 to 21 px) |
| Introduction (.lede) | 17 px | 19 px | `clamp(1.0625rem, 1rem + .3vw, 1.1875rem)` |
| Body text | 16 px | 17 px | `1.0625rem`, `1rem` at 900 px and below |
| Secondary text | 15 to 16 px | 15 to 16 px | unchanged |

Previously: h1 34 to 52 px, h2 28 to 36 px (48 px for the moving banner), h3 20 px, body 17 to 18 px.

Why these numbers
- 16 px is the accepted floor for reading text on phones; 17 to 18 px on desktop (European Commission design system: 16 px mobile, 18 px desktop body).
- Steps of roughly 1.2 to 1.3 between levels keep headings clearly headings without shouting; fluid `clamp()` only for h1 and h2, so tablets get in-between sizes.
- Lines stay under about 70 characters (`--measure: 66ch`).
- Everything is in rem, so a visitor's own text-size setting still enlarges the whole site.

Larger-text safety (checked at 110 to 150 % text on 320 to 430 px screens)
- The header controls drop to a second row instead of running off the screen.
- Long email and web addresses may break rather than push the page sideways.
- The SuperPowers banner shrinks each scene to fit (`fit()` in `js/superpowers-kinetic.js`).
