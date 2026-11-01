# Credits

Every audio file in `assets/audio/`, where it came from and under what licence.

Six ambient loops are Creative Commons 0 (CC0 1.0) recordings from Freesound, verified on each asset page on 27 October 2026. CC0 permits copying, modifying, distributing and performing the sound, including commercially, without permission or attribution. Credit is given here anyway because the recordists deserve it. Licence text: https://creativecommons.org/publicdomain/zero/1.0/

The Studio loop and the Invincible Battles clip are my own work (The Unsaid Sound) and are not covered by the MIT licence on the code.

| File | Original title | Creator | Freesound asset | Licence | Edits made |
| --- | --- | --- | --- | --- | --- |
| classroom.mp3 | classroom_ambiance.wav | joedeshon | https://freesound.org/people/joedeshon/sounds/258094/ | CC0 1.0 | 20 s excerpt from 0:10, mono, loudness-normalised, 0.2 s fades, MP3 128 kbps |
| workshop.mp3 | Artists Workshop.wav | Alex_hears_things | https://freesound.org/people/Alex_hears_things/sounds/636866/ | CC0 1.0 | 20 s excerpt from 0:08, mono, normalised, fades, MP3 128 kbps |
| security.mp3 | 070916 Machine room server rack fans 3.wav | thaighaudio | https://freesound.org/people/thaighaudio/sounds/349689/ | CC0 1.0 | 20 s excerpt from 0:05, normalised, fades, MP3 128 kbps |
| agency.mp3 | Busy Office No People Loop | Fupicat | https://freesound.org/people/Fupicat/sounds/534123/ | CC0 1.0 | Full 24 s loop kept, mono, normalised, fades, MP3 128 kbps |
| community.mp3 | 140802_Greenwich_FoodMarket_F.wav | blaukreuz | https://freesound.org/people/blaukreuz/sounds/252697/ | CC0 1.0 | 20 s excerpt from 0:20, mono, normalised, fades, MP3 128 kbps. Recorded at Greenwich market, London |
| machine.mp3 | Dreams Of My Machine.wav | T_Beau | https://freesound.org/people/T_Beau/sounds/348413/ | CC0 1.0 | First 20 s, mono, normalised, fades, MP3 128 kbps |
| studio.mp3 | Invincible Battles (motif) | Gibson Nyendwa, The Unsaid Sound | https://www.youtube.com/@theUnsaidSoundMusic | Own work, all rights reserved | 20 s loop |
| invincible-clip.mp3 | Invincible Battles (excerpt) | Gibson Nyendwa, The Unsaid Sound | https://www.youtube.com/@theUnsaidSoundMusic | Own work, all rights reserved | 30 s excerpt |

Original downloads are kept locally and are not committed. Processing was done with ffmpeg 4.4; the manifest with sizes and SHA-256 checksums is in `scratch/report/sound_manifest.csv` (local only).

Sources considered and not used: Pixabay Sound Effects (licence prohibits redistributing files as standalone content, which a public repository would do) and BBC Sound Effects (RemArc licence is for personal, educational and research use only, no redistribution).

## Images

| File | What it is | Owner | Source | Processing |
|---|---|---|---|---|
| assets/img/send-life-transition/slt-logo-320.webp | SEND Life Transition channel logo | Gibson Nyendwa, SEND Life Transition | Profile image of https://www.youtube.com/@SENDLifeTransition (800 x 800 original, fetched 29 October 2026) | Scaled to 320 x 320, WebP quality 85. Not redrawn or altered |

| assets/img/insights/send-life-transition-digital-wellbeing-support.jpg and safeguarding-thresholds-of-need-birmingham.jpg | Article covers | Gibson Nyendwa | Made for this site from the SEND Life Transition logo, with DejaVu Sans text | 1600 x 900 JPEG |

Episode videos are not copied: they play from YouTube's privacy-enhanced player only when a visitor presses play.

## Fonts
- Inter variable (normal and italic, weights 100 to 900), Latin subset, self-hosted from `@fontsource-variable/inter` 5.3.0. Typeface by Rasmus Andersson; SIL Open Font License 1.1, included as `assets/fonts/OFL-Inter.txt`. Upstream: https://rsms.me/inter/ and https://github.com/rsms/inter. These are the active site fonts from the personal studio typography update.
- Banner fonts for the SuperPowers kinetic banner only: Montserrat variable, normal and italic (The Montserrat Project Authors), Bebas Neue (The Bebas Neue Project Authors) and Great Vibes (The Great Vibes Pro Project Authors), Latin subset, self-hosted from @fontsource 5.3.0. All SIL Open Font License 1.1; licence texts in `assets/fonts/OFL-Montserrat.txt`, `OFL-Bebas-Neue.txt` and `OFL-Great-Vibes.txt`.
- Earlier font assets: Sora (500, 600, 700) and Source Sans 3 (400, 400 italic, 600), Latin subset, retained in `assets/fonts/` from the @fontsource 5 packages. Both are under the SIL Open Font License 1.1; the licence texts are in `assets/fonts/OFL-Sora.txt` and `assets/fonts/OFL-Source-Sans-3.txt`.

## Home page hero background video
| File | What | Source | Changes |
|---|---|---|---|
| `assets/video/hero-bg-1600.mp4` (1600 x 900, 7.6 MB) and `assets/video/hero-bg-phone.mp4` (540 x 960 portrait crop, 3.2 MB) | Night-time river waterfront, Da Nang, Vietnam: skyline lights, reflections and passing tour boats | Licensed footage from Gibson's stock subscription (Gibson confirmed the right to use it, 1 November 2026). Original file kept off the site | Audio removed; looped from 5.5 s with a 1-second crossfade so the join cannot be seen; the Marriott, Courtyard and Novotel hotel signs painted out (Gibson's request); light noise reduction; H.264 with fast start. No colour change |
| `assets/img/hero/bg-*.webp`, `bg-1280.jpg` | Poster images (first frame of the loop) | Same footage | Same sign removal; resized for desktop and phone |

## Home page portrait reel
| File | What | Source | Changes |
|---|---|---|---|
| assets/video/hero-talk-white-shirt.mp4, hero-talk-headphones.mp4 | Six-second clips of Gibson talking to camera | Gibson's own phone videos, supplied 29 October 2026 | Cropped square (576 x 576), 24 fps, H.264, audio removed |
| assets/img/hero/*-poster.webp | First frame of each clip | From the clips above | WebP |
| assets/img/hero/colmore-*.webp | Gibson outside the Colmore Building, Birmingham | Gibson's own photo, supplied 29 October 2026 | Cropped square; flipped left to right so the building's sign reads correctly (the selfie was mirrored) |
| assets/img/hero/smile-*.webp | Gibson smiling in a white shirt | Gibson's own photo, supplied 29 October 2026 | Cropped square |
| assets/img/hero/with-son-*.webp | Gibson with his son | Gibson's own photo, supplied 29 October 2026; added at his request on 30 October 2026 | Screenshot border trimmed; shown whole over a blurred copy of itself |

## Project logos
Supplied by Gibson (30 October and 1 November 2026). The uploads are kept unchanged in `assets/img/logos/source/`. Website copies are trimmed to the artwork plus a 2% margin and saved as WebP at two widths (quality 92, full alpha). Nothing was recoloured, redrawn or reshaped. Details and the choice between versions: `docs/LOGOS.md`.

| Files | Project | Source and changes |
|---|---|---|
| gibcom-marketing-support-480/960.webp | Gibcom Marketing Support | Supplied transparent |
| birmingham-local-biz-support-320/393.webp | Birmingham Local Biz Support | Supplied on solid black; black touching the edges removed, with the pin's soft edge rebuilt from its brightness so no dark rim shows (`source/birmingham-local-biz-support-logo-transparent.png`). 393 px is the full size of the supplied artwork, so it is not enlarged |
| clara-gibcom-inbound-ai-480/960.webp | Clara | Supplied transparent |
| aibos-command-centre-480/960.webp | AIBOS Command Centre | Supplied transparent |
| send-life-transition-320/640.webp | SEND Life Transition | Supplied transparent |
| gibson-portfolio-aws-student-builder-320/640.webp | This portfolio (personal project badge, not an AWS award) | Supplied transparent; about 14,600 stray faint pixels outside the badge removed (`source/gibson-portfolio-aws-student-builder-logo-clean.png`). Badge, caption and "Personal Project" wording unchanged |
| the-unsaid-sound-320/640.webp | The Unsaid Sound | Supplied transparent, purple lettering |
