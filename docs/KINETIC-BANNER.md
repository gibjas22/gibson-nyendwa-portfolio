# SuperPowers kinetic typography banner

Added 1 November 2026 at the end of the SuperPowers list in the About section of `index.html`.

## Why it is there
The SuperPowers list has seven cards. In the three-column desktop grid the last card ("Now learning: AWS") sat alone on its row, leaving two empty cells: the blank space Gibson pointed out. The grid now places the cards deliberately (one column on phones, two from 640 px, three from 1000 px) and the banner fills the rest of the final row: two cells on desktop, a full row on tablets and phones. The empty space is gone at every width rather than covered up.

## Wording (single source)
All wording lives in the `.kin-static` block in `index.html`. That one block is what screen readers read, what visitors without JavaScript see, and what visitors who ask for reduced motion see. `js/superpowers-kinetic.js` builds the animated copy from it, so edit the words there and nowhere else.

Opening message, exactly as requested: **Here is Gibson Nyendwa's SuperPowers**

| Phrase | Supporting words | Taken from the published card |
|---|---|---|
| Patience at scale | SEND, Functional Skills, Twenty years | Patience at scale card ("Twenty years supporting young people with SEND"; Functional Skills) |
| Threat sense | ISO 27001, CISMP, CompTIA Security+ | Threat sense card (listed qualifications) |
| Found in search | SEO, Google Business Profile, Over 500 customers | Found in search card |
| Agent builder | AI agents, Voice assistants, MCP integrations | Agent builder card |
| Hands in the soil | Horticulture, Willow, Textiles | Hands in the soil card |
| Sound as story | The Unsaid Sound, Invincible Battles, Parsifal | Sound as story card |

No new qualifications or claims were added. Each line has `data-style` (bold, italic, condensed or script; condensed is capitals only, so it is never used where capitalisation matters) and `data-colour` (one of the tokens below).

## Colours (sampled from the reference recording)
Values are the median of the brightest, most saturated pixels in each coloured word, so compression and glow do not pull them off. They are fixed tokens on `.kin` and do not change with the Purple, Sky Blue or White themes. Only the banner's frame, border and control follow the site.

| Token | Hex | Source frame in the reference |
|---|---|---|
| `--k-magenta` | #CB00D0 | "Do the Rest", about 20 s |
| `--k-violet` | #9400F3 | "THE SIMPLEST", about 58 s |
| `--k-turquoise` | #18FFC4 | "WORKFLOW", about 66 s |
| `--k-yellow` | #FBFF0F | "YOUR" / "Emphasis", about 58 s |
| `--k-orange` | #F05D24 | "not Hours.", about 40 s |
| `--k-blue` | #3D82ED | "THAT TURN", about 58 s |

The banner background is near black (#07040C), as in the reference, so the colours keep their strength. Violet (about 3.5 to 1) and magenta (about 4.4 to 1) are used only for large phrases; small supporting words use turquoise, yellow, orange and blue, all above 4.5 to 1. See `docs/kinetic/colour-comparison.webp` for reference crops beside the implemented swatches.

## Typography
The reference uses a bold geometric sans, a tall condensed sans, a heavy italic and a brush script; its exact fonts cannot be identified from the video. Licensed open alternatives, self-hosted, Latin subset, from @fontsource 5.3.0 (SIL Open Font License 1.1, licences in `assets/fonts/`):
- Montserrat variable, normal and italic: bold and italic phrases, and the opening name (keeps the exact capitalisation and apostrophe).
- Bebas Neue: condensed capitals.
- Great Vibes: script ("Here is", "Hands in the soil").

The rest of the site stays in Inter. The banner fonts load only when the banner comes within 800 px of the screen.

## Sequence (about 28 seconds, then it loops)
1. Opening (0 to 7.5 s): "Here is" slides in, "Gibson Nyendwa's" rises, "SuperPowers" scales up; the complete message is held for about 5 seconds.
2. Middle (7.7 to 20.9 s): the six phrases, one at a time, 2.2 s each, coming forward through a slowly moving perspective grid with three supporting words, while a faint ring of the supporting words turns slowly behind.
3. Closing (21 to 28 s): all six phrases slide in from alternate sides into a stacked composition, hold for about 4.6 s, then fade back to the opening.

Timings are in `TIMING` at the top of `js/superpowers-kinetic.js`. Each scene is measured and scaled down if needed (`fit()`), so the words stay inside the banner on narrow phones and when a visitor has enlarged text in their phone or in an in-app browser such as Messenger (added 1 November 2026 after Gibson's phone showed "Gibson Nyendwa's" running off both edges). Only opacity and transform are animated; there is no flashing, strobing or rapid blinking. On narrow banners (under 520 px wide) the ring and grid are removed and the closing becomes one column.

## Accessibility
- Pause animation / Play animation button: a real button, keyboard reachable, visible focus, 44 px tall; Pause freezes every element in place and Play carries on from the same point.
- The animation pauses when the banner is off screen or the tab is hidden, and never restarts after a visitor has paused it.
- Reduced motion: the static composition is shown and the button is hidden.
- No JavaScript: the static composition is shown.
- The animated copy is `aria-hidden`; there is no `aria-live` region, so phrases are not announced repeatedly.
- No audio. No horizontal page overflow at any tested width.

## Tests
`kin/t-kin.js` (36 checks): exact opening wording; all six phrases present; layout at 320, 390, 768, 1024, 1440 and 1920 px with no overflow and nothing under the control across the loop; the full sequence order; Pause/Play by keyboard and from the same point; off-screen pause; identical text colours in all three themes; reduced motion; no JavaScript.
