# Theme system

> **Changed 30 October 2026** (website review): Purple is now the default for every visitor who has not
> chosen. The first-visit chooser was removed. White, Sky Blue and Automatic (the 14-day rotation below)
> are explicit choices in the Appearance panel. Where this document describes the chooser or Automatic
> as the default, it records the earlier design.


Three colour themes share one stylesheet. The page's `<html>` element carries a single attribute,
`data-theme="purple"`, `"sky-blue"` or `"white"`, and every component reads semantic colour tokens
(CSS custom properties). No component refers to a theme by name.

## Files

| File | Role |
|---|---|
| `css/styles.css` | Purple tokens in the first `:root` block (also the no-JavaScript fallback). The "Theme system" block that follows adds the extra semantic tokens and the `[data-theme="sky-blue"]` and `[data-theme="white"]` overrides. The Appearance UI styles are at the end of the file. |
| `css/desk.css` | Mixing desk; uses the desk hardware tokens. |
| `js/theme-boot.js` | Blocking script in `<head>` of every page. Holds the rotation `CONFIG`, reads the saved preference and sets `data-theme` before the page paints. Exposes `window.GNTheme`. |
| `js/theme.js` | Module loaded at the end of every page. Builds the Appearance button, the mobile menu entry, the Appearance panel and the first-visit chooser; keeps tabs in step and switches at the next boundary. |

`theme-boot.js` has to be an external file because the Content Security Policy is `script-src 'self'` (no inline scripts).

## Semantic tokens

| Group | Tokens |
|---|---|
| Backgrounds and surfaces | `--bg-base`, `--bg-section`, `--surface`, `--surface-raised`, `--header-bg`, `--scrim`, `--scrim-strong`, `--foot-fade` |
| Text | `--text-heading`, `--text-body`, `--text-muted`, `--on-primary`, `--on-gradient` |
| Accents and controls | `--primary`, `--primary-hover`, `--primary-press`, `--accent`, `--gradient`, `--selected-border`, `--band-a`, `--band-b` |
| Borders and focus | `--border`, `--focus-ring` (also used as the light highlight colour for link hover) |
| Depth | `--shadow-card`, `--shadow-lift`, `--shadow-deep`, `--shadow-soft`, `--shade-25/40/55/60`, `--sheen`, `--sheen-strong`, `--glow`, `--glow-k` (glow strength: 1 on dark themes, .45 on White) |
| Inputs and states | `--input-bg`, `--input-border`, `--inset-shade`, `--danger`, `--danger-text`, `--success-text`, `--row-hover`, `--skeleton-a/b`, `--hatch` |
| Category colours | Each card sets its own `--c` inline. Text in that colour uses `color-mix(in srgb, var(--c) var(--c-mix), var(--c-ink))`: 100% on dark themes, 48% towards navy on White so it stays readable. |
| Decoration | `--wave-1/2/3` (SVG waves), `--master-strip` (desk master channel) |
| Desk hardware | `--desk-board-a/b`, `--meter-off`, `--fader-track`, `--desk-off`, `--thumb-hi/mid/lo`, `--thumb-edge` |

To add a component, use these tokens rather than hex values. To add a fourth theme, add one
`:root[data-theme="name"]` block overriding the tokens, add the name to `THEMES`, `NAMES` and `META`
in `theme-boot.js`, add an option in `theme.js`, and add a `.preview-name` swatch.

The SEND Life Transition panels (`.slt`) keep their own navy and orange channel colours in every theme,
as a branded block. Photographs, logos, thumbnails and videos are never recoloured; there are no
global filters.

## The three themes

* **Purple**: the personal studio finish. Deep plum `#100818`, matte surfaces `#211B29`, soft lilac
  controls `#CBB8ED` with dark text `#171020`, and muted body text `#DED8E6`. Decorative hero waves
  and glows are hidden. The channel colours remain the visual key for the mixing desk.
* **Sky Blue**: built from the SEND Life Transition colours already in the code (navy `#0A1B47`, `#122A66`,
  line `#2B4A8F`, sky blue `#5CB2FF`, orange `#F98522`, `#FFB066`, muted `#C9D6F0`). Navy surfaces,
  sky-blue selected outlines and focus, orange buttons with navy text, white headings. Values marked
  "derived" in the CSS are tints or shades of those colours.
* **White**: light neutral backgrounds (`#F6F7FB`, white cards), navy headings and charcoal body text,
  purple buttons, magenta and sky-blue accents, sky-blue and orange in the call-to-action band. Depth
  comes from soft shadows and borders; glows are reduced.

## Preference

* One `localStorage` key: **`gn-appearance`**, value `purple`, `sky-blue`, `white` or `auto`.
* No key means no preference: Automatic, and the first-visit chooser is offered.
* Dismissing the chooser or choosing "Use automatic rotation" stores `auto`, so the chooser is not shown again.
* Precedence: an explicit theme always wins and never rotates; `auto` and "no key" follow the schedule.
* An invalid value is deleted and treated as no preference. If storage is blocked, the choice applies to
  the current page only and the chooser is not shown automatically (it could not remember the answer).
* Open tabs follow changes through the `storage` event. The preference stays in one browser; it does not
  follow visitors to other devices.

Visitors change it with **Appearance** in the header (on phones: the swatch button in the header, or
Appearance at the bottom of the menu). Choosing **Automatic** returns to the rotation. "Show the welcome
chooser" in the panel reopens the first-visit chooser.

## Rotation schedule

```js
// js/theme-boot.js
var CONFIG = {
  anchor: { y: 2026, m: 10, d: 29 },        // 29 October 2026, 00:00 Europe/London
  order: ["purple", "sky-blue", "white"],
  days: 14,
  timeZone: "Europe/London"
};
```

| Period | Theme |
|---|---|
| 29 October to 11 November 2026 | Purple |
| 12 to 25 November 2026 | Sky Blue |
| 26 November to 9 December 2026 | White |
| From 10 December 2026 | Purple, then repeating |

The period is worked out from London calendar dates (whole days since the anchor), so the clock changes
do not move a boundary: in summer time a change happens at 00:00 BST (23:00 UTC the evening before).
Before the anchor date the site shows Purple. The theme is calculated in the visitor's browser on every
page load, so cached HTML, CSS or scripts cannot freeze it. An open page checks again when it becomes
visible and switches itself at the next boundary using one timer (no polling, no server job).

To change the schedule, edit `CONFIG` only: a new `anchor` restarts the cycle from that date, `order`
changes the sequence, `days` changes the length. Then update the table above and the "Automatic" option
text in `js/theme.js` if the order or length changed.

## Rollback

* Quick: in `js/theme-boot.js` set `order: ["purple"]`. Automatic then always shows Purple, and explicit
  choices still work.
* Full: revert the commit that added the theme system (`git revert <commit>`), push, and let Amplify
  build. Any `gn-appearance` value left in visitors' browsers is then simply ignored.

## Tests

Run against the local CSP server (scratch scripts, not part of the site): schedule boundaries including
both clock changes and a browser in another time zone; first visit, explicit choice, navigation, return
visit, Automatic status text, dismiss and Escape, reopening from Appearance with focus return, keyboard
arrow selection, no reload on change (URL, scroll, form input and players kept), two tabs, the boundary
timer, the visibility check, blocked and corrupted storage, no JavaScript, and the mobile menu entry,
chooser size and touch targets. axe-core (WCAG 2.1 AA, including colour contrast) on ten pages in all
three themes at desktop and mobile widths.
