# Project logos: assets and presentation

Written 1 November 2026, when the project logos were moved to one shared "logo stage".

## Asset map

All files Gibson supplied were inspected for size, real transparency (not the file type or how the preview looks) and the edge of the artwork, and previewed on a light and a dark surface.

| Project | Supplied versions | Size of artwork | Transparency | Used | Why |
|---|---|---|---|---|---|
| Gibcom Marketing Support | Transparent | 2073 x 758, trimmed 1996 x 700 (2.85:1) | Real | Transparent | Only version; the white outlines are part of the logo and are kept |
| Birmingham Local Biz Support | Pin on black (has an alpha channel, but the black is fully opaque) | 823 x 817, pin 393 x 515 (0.76:1) | None | Keyed transparent derivative | The black square would sit inside the light stage as a box. Background removed; edge rebuilt so no dark rim. Smallest source: shown no larger than its 393 px |
| Clara | Transparent (sent twice, identical), white background | 2172 x 724, trimmed 1943 x 621 (3.13:1) | Real / none | Transparent | Both are clean on a light surface; the transparent one avoids a white box inside the stage |
| AIBOS Command Centre | Transparent, white background | 2161 x 728, trimmed 2033 x 622 (3.27:1) | Real / none | Transparent | As Clara. On dark backgrounds the navy lettering disappears, which is why every stage is light |
| SEND Life Transition | Transparent (sent twice, identical) | 1254 x 1254, trimmed 1165 x 1182 (0.99:1) | Real | Transparent | Only version |
| This portfolio | Transparent AWS Student Builder badge | 1254 x 1254, trimmed 1067 x 1213 (0.88:1) | Real, with faint stray specks | Cleaned transparent derivative | Specks outside the badge removed; "Personal Project" wording kept. It is a personal badge, not an AWS certification |
| The Unsaid Sound | Transparent purple, purple square tile, white-lettered (earlier) | 1536 x 1024, trimmed 1254 x 918 (1.37:1) | Real | Transparent purple | Crisp on a light surface. The tile would put a purple box inside the stage; the white version is not needed now the stage is light in every theme. The transparent file looks blurred when previewed on black because dark purple on black has little contrast; on a light surface it is sharp |

Already on the site: SEND Life Transition's YouTube profile image (`assets/img/send-life-transition/slt-logo-320.webp`) in the podcast section. It is the channel's avatar in a round player context, not a project card, so it keeps its own size.

## The logo stage

- **One surface for every theme**: a soft off-white (`--logo-surface`, #F1EEF7; pure white on the White theme). Navy, blue and purple lettering all read on it, and the brand colours are untouched.
- **One ratio**: 16:10 in the feature cards, the project grid and the case-study headers. Tested with the widest wordmark (AIBOS, 3.27:1) and the tallest emblem (the BLBS pin, 0.76:1).
- **Fit, not fill**: the image is scaled with `object-fit: contain` and never cropped or stretched.
- **Optical sizing**: each logo has `fit: [width share, height share]` of the stage's inner box in `js/projects.js`. Wide wordmarks use 80 to 84% of the width (capped at 62% of the height); emblems use 80 to 90% of the height. This keeps the amount of visible artwork within a factor of about 1.5 across all seven, instead of the factor of 2 an equal width gives.
- **Edge and depth**: 1 px border (soft white on dark themes, grey on White), an inset top highlight and a soft shadow underneath. The depth is in the container; the logos themselves are not bevelled or filtered.
- **Interaction**: only where the stage is part of a link (feature cards and the project grid). Hover lifts it 3 px and turns the border sky blue in 150 ms; pressing sinks it 1 px; keyboard focus marks the border too. No movement for visitors who ask for reduced motion. The case-study logo is not a link, so it does not react.
- **Files**: two widths per logo (480/960 for wordmarks, 320/640 for emblems) with `srcset`; grid thumbnails ask for the smallest. Card logos load lazily; the case-study logo loads at once because it is at the top of the page.

## Limits

- Birmingham Local Biz Support's source pin is only 393 x 515 px. It is sharp at every size used on the site, but a larger original would be needed for anything bigger than about 390 px wide.
- At the 112 to 144 px grid thumbnails, the smallest lines inside logos (Gibcom's "Marketing Support Ltd", the AWS badge's caption) are too small to read. The project name is always next to the logo, and the full-size logo is on the case-study page.
