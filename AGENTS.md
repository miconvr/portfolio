# AGENTS.md

Guidance for any AI coding agent working in this repo. Humans can read it too.

Personal portfolio of Mico Gerard Navarro (BSIT student, Pampanga). Live: https://miconavarro.vercel.app. Repo: `miconvr/portfolio`.

## Stack

Plain HTML, CSS and vanilla JS. No framework, bundler or `package.json`. Hosted on Vercel, with two serverless functions in `api/`. Fonts are self-hosted in `fonts/`. Keep it dependency-free.

## Layout

| Path | Purpose |
|---|---|
| `index.html` | Home with the two project cards in `.projects-grid` |
| `kaltas/index.html`, `civicguard/index.html` | Project overview pages, served as `/kaltas`, `/civicguard` |
| `about/index.html`, `experience/index.html` | Served as `/about`, `/experience` (`cleanUrls` on) |
| `certificates/index.html` | Certificates page, served as `/certificates` (see "Certificates page") |
| `kaltas/privacy-policy/index.html` | Kaltas privacy policy, served as `/kaltas/privacy-policy`. Not in the nav |
| `404.html` | Styled by `.nf` rules, absolute paths, `noindex`, loads only `clack.js` |
| `css/styles.css` | All styling. Dark only |
| `js/home.js` | In-place navigation, prefetch, card spotlight and tilt, view transitions |
| `js/slide-open.js` | Click-to-open, reader, idle sheen, stack fitting |
| `js/clack.js` | Synthesized sound (Web Audio) and the `.snd` mute button. No audio files |
| `js/carousel.js`, `js/car-slider.js` | Screenshot carousel and its keycap buttons |
| `js/lightbox.js` | Click-to-enlarge lightbox for overview images and videos, plus the `.lb-hint` button |
| `js/been-here.js`, `js/mascot-idle.js` | Mascot, visitor counter, idle moves |
| `js/commits.js` | Commit counts |
| `api/hi.js` | Upstash Redis visitor counter (needs Redis env vars) |
| `api/commits.js` | GitHub commit totals rounded down to 10, cached 1h (needs `GITHUB_TOKEN`, which expires) |
| `fonts/` | Self-hosted Geist, Geist Mono, Big Shoulders Display (`@font-face` at the end of `css/styles.css`) |
| `images/` | Assets by kind: `badges/`, `logos/`, `profile/`, `projects/<slug>/`, `site/` (favicon and share image) |
| `vercel.json`, `sitemap.xml`, `robots.txt` | `cleanUrls`, headers, redirects, SEO |

## Run and check

No build step: `python3 -m http.server 8000`. `api/hi.js` only works on Vercel. Check `/`, `/about`, `/experience`, `/certificates`, `/kaltas`, `/kaltas/privacy-policy`, `/civicguard` and a made-up URL (404) at about 380px width and with reduced motion on. At phone width also check the overview link buttons (download, repository, privacy), the certificate badge and credential button, and the header photo.

## Working with the owner

- AI chat pushes have been blocked before, so the owner often pastes terminal commands. When you can't push, deliver one command or a patch and say how to verify. When you can push, edit directly.
- One small commit per change, pushed on its own, so each can be reverted separately. `git pull --ff-only` first. After pushing, run `git status --short` and confirm it is empty.
- Patches are Python scripts that assert each anchor matches exactly once, so a failed match writes nothing.
- One request is one scope. Don't rewrite unrelated sections. Never commit secrets.

### Commit messages

Subject is `type: short summary`, all lowercase (brand names, acronyms and `+N` too), under 80 characters, imperative ("add", "fix"). Types: `feat`, `fix`, `style` (visual or css), `docs` (agents.md or readme), `refactor`, `perf`, `chore` (tooling or cleanup), `copy` (wording), `content` (data or text on the site), `test`, `build`, `ci`. The `.githooks/commit-msg` hook enforces this, so don't bypass it with `--no-verify`. Add specific files, never `git add -A`. To undo a commit use `git revert HEAD --no-commit` and commit with your own lowercase subject, because git's default revert subject starts with a capital R and the hook rejects it.

## Global rules

- Two themes: a cream light theme (default) and the original dark theme. Light tokens and overrides are the `LIGHT THEME` blocks at the end of `css/styles.css`, all scoped to `:root:not([data-theme="dark"])`; dark is `data-theme="dark"` on `<html>`. The choice is saved in `localStorage` key `theme-v1`. A new color must work in both themes: use the tokens, not hex values.
- Centered frame: `body` is capped at `--frame` (64rem, the same width as the page shell, so there is no empty strip beside the sidebar) and centered, `html` is pure black, so wide screens show black sides. Fixed buttons (`.snd`, `.theme-btn`) position from `--edge` so they stay inside the frame. Light theme extras: the FlyRank wordmark (`.org-logo`) sits on a small black pill, and the card-reader terminal has a cream body with a dark LCD.
- Layout (end of `css/styles.css`): on desktop the sidebar is flush to the frame's left edge, and `main` is centered in the space beside it with width `--main` (34rem, or `--main-wide` 44rem for project overviews). To change widths, edit `--frame`, `--main` or `--main-wide`; nothing else needs moving.
- Rounded corners: from 66rem up, `body` uses `clip-path: inset(0 round 1.5rem)`. No margins or overflow rules, so the page scrolls normally. Do not use `overflow: clip` on `body`: it propagates to the viewport and breaks scrolling.
- Colors: only `var(--...)` from `:root`. Cream `--ink` `#F3E9D2` for headings, `--text` `#E4DAC3` for body, `--muted` for secondary. Never hardcode `#fff` or hex colors in new rules.
- No inline `style=`. Use classes.
- Fonts: Geist (`--sans`) for headings, Geist Mono (`--mono`) for body, cards and nav. Sidebar name `.side h1` is Big Shoulders Display 700 uppercase (2.4rem desktop, 2rem under 40rem), preloaded in every HTML head. Never add a transform, hover effect or bold to it.
- Page headings (`.page-title` on About, Experience and Certificates, and the Projects h2): Geist 700, `-.03em`, 3.1rem (2.5rem phones), margin `4rem 0 1rem`. Keep them identical. The first section after has no top border.
- Under 30rem, `.home main` has a 1px `--line` top border (1.25rem above, heading 2rem below). Keep all four tabs equal.
- Shell width: `.home .shell` is 64rem for Projects, Certificates, About and Experience, and 76rem on overview pages. `.side` has `view-transition-name: side` so it glides between widths.
- Nav: Projects, Certificates, About, Experience, in that order. Don't add other items. The nav `<ul>` is duplicated in `index.html`, `about/`, `experience/`, `certificates/`, `kaltas/`, `civicguard/` and `kaltas/privacy-policy/`, so change all of them together (the 404 has none).
- Experience entries are real. Don't remove or rewrite. The FlyRank logo is self-hosted and sits next to the title (`flex-start`, not `space-between`).
- Accessibility: skip link, labelled controls, alt text, `aria-live` on the counter, keyboard-usable carousels, `prefers-reduced-motion` support. Don't make content depend on animation or JS.
- `localStorage` only inside try/catch.
- Media queries: combine conditions with `or` / `and` inside parentheses, never a comma (commas only at top level). A bad one silently never applies.
- Every HTML page carries the head script from `index.html` line 19 (sets `.js`, first visit in a tab only), the three font preload links, `<meta name="theme-color" content="#E7DEC8">`, `<meta name="color-scheme" content="light dark">` and the one-line theme script (sets `data-theme` before paint) right after the viewport tag, and `<script src="/js/theme.js" defer>` after `clack.js`. Without the script no cold-start motion plays.

## JS conventions

Small IIFEs, two-space indent, double quotes in newer files. Only two `window` globals exist: `initCarousel` (carousel.js), `__retracting` (read by clack.js, no longer set). Don't add more. Page-specific scripts and `<head>` styles don't run on an in-place swap, so keep behavior in shared files.

## CSS rules

- `css/styles.css` is a long stack of overrides, and a later rule beats an earlier one on purpose. Add each change as a labeled `/* ... */` block at the end of the file. Don't edit older rules in place.
- Before deleting a class or variable, grep `js/`, `index.html`, `about/`, `experience/`, `certificates/`, `kaltas/` and `civicguard/` for it.
- Cleanup method: a rule (or a declaration) is provably dead only when a later rule with the same selector in the same media query redeclares every one of its properties. Parse the file, remove those, then assert that the winning value of every (media query, selector, property) is unchanged. Don't remove rules by reading selectors alone. Done so far: unused classes, superseded stack blocks, and every fully overridden rule (batch 2b). Not yet checked: partly overridden rules, the `.meta::before` / `::after` `display: none` rules and the old `data-index` date rules.
- Not cleaned: older stacked `.meta li+li a` and reader/receipt rules that are overridden through different selectors. A script can't prove those dead, so trim them only in small batches and check the site after each. The `drag` class that `scan()` adds in `slide-open.js` has no CSS any more and can go in a JS cleanup.

## Sidebar and mascot

- Desktop (56.01rem up): static full-height panel (`sticky; top:0; height:100dvh; border-radius:0`), no inner scroll, content centered on tall windows, base font 110%. No `margin-top:auto` on the mascot, no fixed pixel height or `overflow:auto`. Under 52rem tall it flows with `height:auto`.
- Phones and tablets: sidebar and top nav are hidden on project pages (`body:has(.project-title) .side`). Under 40rem the header is centered (7.25rem photo, name, location, icons, welcome row). The phone photo size is set only in the `@media (max-width: 40rem)` phone header rule (`.side .profile-photo`). Desktop uses height-based clamps and tablets a 4.25rem inline layout, so don't change those for a phone tweak.
- Location line has a pin and sits under the social links on desktop (CSS `order`). Text is 85% `--ink`. Contact links underline on hover and focus only. Desktop mascot block has a 1px `#333230` top border. Description matches About text (18px, 1.7).
- Sidebar contact icons (email, GitHub, LinkedIn, Instagram) are thin outline icons in the Tabler style: `<svg class="ico line" viewBox="0 0 24 24">` with 2px strokes in `currentColor` (`.side-links .ico.line`, end of `css/styles.css`), shown at the usual 18px. Card, overview and certificate GitHub icons keep the filled mark.
- Mascot look: soft-shaded red heart (`#e5484d` base, radial gradient `#heart-g`, no visible outline; `.been .heart` has a faint same-color stroke (`--heart`, 40% opacity) that feathers the edge), one tall dark oval eye in each lobe (closer together they read as a pig nose), no mouth, arms or shadow, shown on mobile. The button is 5rem on desktop (88px at the 110% base, a whole pixel count, so keep it) and 3.5rem on phones. It is all 2D SVG on purpose: CSS 3D transforms rasterize the mascot and blur its edges.
- Mascot behavior: eyes follow the pointer (rAF-throttled) through `aim()` in `been-here.js`, which also turns the body (`.turn` group: small translate, rotate and squash, eased .35s) and shifts the gradient highlight. The idle look-around in `mascot-idle.js` calls `window.beenAim`. Blink every 4 seconds, one full spin-hop per click (clicks ignored while spinning), red "+1" on first tap only. Idle moves (every 5 to 9s: `look`, `.mi-bounce`, `.mi-tilt`) skip when hidden, under reduced motion, when the pointer moved in the last 3s, or while another move plays. Reduced motion: no eyes, blink, spin or idle.
- Credit line (`.been-credit`, "designed and built by mico"): plain static mono text at low opacity. Welcome text uses `--ink`, count 80%.
- Commit counts: sidebar total "(N+ commits)" beside the github.com/miconvr link (hidden at 56rem and below). Per-repo counts live in `<span class="repo-commits" data-repo-commits="slug" hidden>` in each overview's Activity tile. Both hide if the API fails. New project: add its repo to `PROJECTS` in `api/commits.js`.
- Kaltas users pill (Chrome Web Store), never exact, rounded down server-side: under 5 hidden, 5 to 99 by 5, 100 to 999 by 50, 1,000 to 9,999 by 500, 10,000+ by 1,000. Show "N+ users". CivicGuard has none.
- The mascot wrapper is created by `js/been-here.js`. Don't add mascot markup to pages.

## Home project cards

- Layout: `.projects-grid` is one column (`minmax(0, 26rem)`), Kaltas (`data-index="02"`) above CivicGuard (`01`). A new project goes first and takes the next number. `data-index` is only for ordering, the visible number is hidden. Credit-card style: `aspect-ratio: 1.586` as a minimum (cards grow, never clip), `overflow: visible`, matte `--card` gradient with faint grain (don't lighten), `--card-edge`, `--shadow`.
- Surface: border `#242424` and two background layers (grain plus a gradient from `#1b1b1b` to `#131313`) with `background-size: 160px 160px, auto`. Any override of `background-image` must keep exactly two layers or set `background-size` to match, because a third layer once tiled every 160px.
- Content, top to bottom: icon, title, `.dates` line, one tagline, stack pills (`.card-stack`), icon links. Taglines: Kaltas "Chrome extension that finds student deals for the website you're visiting." CivicGuard "Incident and curfew monitoring website for Barangay Maimpis." No commits pill, cardholder, card-number or holo-sticker markup.
- Dates: `.dates` under the title on every width ("November to Present 2026" / "September to Present 2026", real letters). OCR-style mono, 600, uppercase, .14em spacing, dim cream, .78rem (.7rem on phones). If a date changes, update the card text.
- Spacing (`/* no number, even card spacing */`): padding 1.3rem on every side. Title to date .3rem, date to tagline .7rem, tagline to tags .7rem, tags to links .9rem. On phones `.projects-grid` has 4.5rem bottom padding so the floating sound button clears the last card.
- Stack pills: `<p class="card-stack">` between the tagline and `.meta`. Every tag shows on one `nowrap` row. `js/slide-open.js` sets `--stack-fs` on the row (starts at .66rem, shrinks until it fits, floor 6px, runs on load, resize, fonts ready and `pageshow`). `/* card stack: one row, font size set by js */` makes the font, padding and gap follow it, with the pill look in `/* date font and stack box look */` and `/* lit stack boxes */`. Card height never changes. Put the most important tech first and keep the overview's order.
- Links: icon + label, label from `aria-label` via `::after` ("download", "repository", "live site"), 1px `--line` outline, .4rem radius, .72rem text, 18px icon (see the next bullet) with `margin: 0`, hover brightens and scales 1.06 (off for reduced motion). Hover and focus selectors must repeat border and padding. New project: keep `<svg class="ico">` plus `aria-label` and `title`, no visible text. Don't restyle them unless asked.
- Link icons (`/* smooth link icons: 18px */`, end of `css/styles.css`): card, overview and certificate link icons and the desktop sidebar icons are 18px, drawn from the 16px icon paths with `shape-rendering: geometricPrecision`. GitHub links use the outline GitHub icon (see Store badges and link icons below). Fractional sizes resample the mark and make it look pixelly, so keep icon sizes in whole pixels.
- Whole card is clickable (see "Click to open"). The first `.meta` link (aria-label "Open <Project> project") stays in the markup as a 1px clipped, absolutely positioned box: `slide-open.js` clicks it and keyboard users tab to it. Focus shows an outline on the whole card (`:has(a:focus-visible)`). No visible bar, cursor, hand, chip or icon on the cards (`.item-top::after` is hidden). Other links stay `position: relative`. No nested links.
- `.item-head` and `.item-top` must stay un-transformed (no `transform`, `filter` or `will-change`): the card scan uses `translate`, and a transformed ancestor re-parents absolutely positioned children and makes them jump. Use opacity, `translate` or `scale` instead.
- Hover (fine pointer, no reduced motion): `home.js` sets `--mx --my --rx --ry`. The tilt is half the angle with `perspective(1400px)` (`/* tilt v2 */`), one `.projects-grid .item:hover` transform rule. Text on a rotated surface is resampled, so a little softness at the tilt edges is expected. Never put a fractional scale on a hovered card with text. Touch gets a `:active` press and no hover transforms. Put new effects on a different property than `transform` (`rotate`, `scale`, `translate`).
- Hover-out: the bare `.item` has a slow transition (.6s transform and shadow, soft ease-out), while `:hover` / `:active` use the quick .25s one, so the card drifts back instead of snapping. Keep `:not(.spring):not(.pulling):not(.dip)` on that quick rule so it never overrides the scan, spring-back and tap-dip transitions. Under `.js`, hover-out needs its own slow rule, because `.js .item.reveal { transition: none }` beats the bare one.
- Layers: `will-change: transform` goes on `.projects-grid .item` only while it is not `.pulling`, `.retract-hold`, `.spring` or `.dip`, on mouse devices with motion allowed (`/* layer only at rest */`). Never add `will-change` or `backface-visibility` to a card without those `:not()` guards: a permanent layer keeps the text rasterized at the size it had during the return replay, so the card stays soft after open, overview and back.
- Tilt reset: `openCard()` and the return replay in `js/slide-open.js` set `--rx` and `--ry` to `0deg`, and the `pointermove` handler in `js/home.js` skips tilt while the card is `.pulling`, `.retract-hold` or `window.__retracting`. Otherwise the card returns still tilted and blurry.
- Hit area: each card has `<span class="hover-pad" aria-hidden="true">` as its first child. It extends the hit area 10px below the card, active only while hovered, so the lift and tilt don't push the bottom edge out from under the pointer (flicker loop). New project cards need it too.
- Card intro (`/* Card intro v2 */`, end of `css/styles.css`): under `.js` the card shell fades in by opacity (`.item.reveal:not(.in)` is hidden), then `.item-head` (opacity only), the tagline and `.meta` follow at .1s, .18s and .26s. Each later card adds `--ro` (.12s steps).
- Idle sheen: `slide-open.js` adds `.sheen` to every card with a random `--idle` delay (`card-sheen`, 9s). It is off on touch and under 40rem.
- Projects intro (`.projects-intro`): muted mono text, max 34rem, one wording on every device: "Click a card to see the project's overview." (plain text in `.pi-lead`, no icon or parentheses).

## Click to open

- Desktop (40rem+, fine pointer, motion allowed): a real click (`detail > 0`) on a card, outside its other links, runs `scan()` through `openCard()` in `slide-open.js`. `--pull` eases 0 to 1 over 200ms and `.reader` (7rem terminal, created by `slide-open.js`) slides out beside the card (.22s, last `.reader.in` rule). The card moves about 1.8rem via `translate` (the scan never sets `transform`) and goes under the reader by about 1.1rem, which must stay under the 1.4rem right padding. At 85% the reader goes green (`.ready`) and beeps, the receipt prints, and the first `.meta` link is clicked after about 160ms, or 560ms when a receipt prints. There is no swipe or drag.
- Touch, narrow windows and reduced motion: no reader or receipt. The card dips (`.dip`), `reader-approved` beeps, and the link is clicked after 200ms (0 under reduced motion).
- The capture-phase click handler takes over the link's stretched click. Keyboard and script clicks (`detail` 0) pass through untouched, so Enter on the link opens directly. `busy` blocks a second open while one runs.
- Events: `reader-approved` (fires at 85%, or when a tap dips the card; `clack.js` rate-limits the beep to one per 700ms) plays the beep. `reader-receipt` plays `printer()` (12 ticks over .4s plus a 2093 Hz ding). `slide-open.js` never touches audio. If the feed duration or step count changes, update `printer()`. The paper is stepped on purpose; don't smooth it.
- The reader screen is blank until `.ready` (APPROVED), with no INSERT CARD text (`/* reader screen: no insert card text */`).
- The receipt and the leaving-an-overview retract animation were removed. `printer()` and its `reader-receipt` listener in `clack.js` are now unused, and the leftover `.retract-hold` and `:not(.thanks)` CSS is harmless. Leaving an overview has no special animation.
- `release()` adds `.spring` for 650ms so the card and reader bounce back. Starting a new press removes `.spring` first, or the reader stays on its slow spring transition and lags behind the card.
- `.dip` is cleared by `clearDip()` on `pageshow` and when the home content re-renders, unless an open is in progress.

## Overview pages

- `<main id="main"><article class="overview">`, styled as one big card (44rem max, `--card`, 1rem radius). The carousel is the hero (40rem), the lede is .95rem mono with a 36rem line length, and outcomes are a spaced list with custom dots.
- Markup per project: `.project-title` holds the back/X (`.back-top`, round, icon only), icon and `<h1>`. `.ov-num`, `.ov-status` and `.ov-chip` are hidden but stay in the article, or the CSS won't match.
- Facts (`/* facts: role row */`), same for every project: Role full width on top, Status and Activity side by side, Stack full width. On phones Status gets 1.2fr and Activity 1fr so "In Development" fits (`/* overview facts: status room on phones */`); under 23.75rem it is one column. Role and Stack are `<dd class="pills">` with one `<span>` per item, so write roles as separate spans, never joined with "and". Pills copy the card pill look at `.85rem` (`.78rem` on phones) with `.2em .7em` padding.
- Status: `<span class="fact-status" data-status="live|dev">`, with the dot after the text (`::after`): `live` is `--live` green, `dev` is `--dev` amber. The gap between the text and the dot is `.5em` plus `margin-left: .2em`, about .7em (`/* overview status dot gap */`, end of `css/styles.css`); change that `margin-left` to adjust it.
- Activity: `.repo-commits`, filled by `js/commits.js` from `/api/commits` (cached in localStorage under `commits-v3`). No icon, reads "340+ commits on GitHub" (` on GitHub` is a `::after`, dropped under 40rem), capped at the tile width with an ellipsis, and copies the border, radius, fill and color of the stack pills.
- Links row (`.overview .meta`): muted palette (text 55% `--ink`, outline 22%, hover full `--ink` and 50%), .85rem text, no arrows, no green, no band. Selectors use `.overview .meta li a` and reset `::before` / `::after` to `content: none`. The block "Overview links v27" (end of `css/styles.css`, shared by every overview) makes the buttons even: a left-aligned flex row on desktop, and at `max-width: 40rem` a 2-column grid of equal-width buttons where an odd last button (privacy) spans the full row. Change buttons there, not in the older blocks. Check both overviews after any change.
- Entrance (motion allowed): `ov-print` clip-path reveal top to bottom with a scan line (`.overview::before`, `ov-scan`, .85s), then `ov-in` stagger from .3s by class (never `:nth-child`). Cursor spotlight via `.overview::after` and `--mx/--my`. No tilt on overviews. Never give `.overview` an animation from a `main > article` rule: the generic fade is `.js main > article:not(.overview)`.
- Exit: `run()` adds `html.vt-exit`, and the old page rolls up from the bottom (`clip-path: inset(0 0 100% 0)`, .6s, no fade) above the new page, which has `animation: none`. Opening a card uses a short fade (`vt-out` / `vt-fade`). Reduced motion and unsupported browsers get an instant swap.
- Phones (30rem and below): 1rem padding, 2rem title. First screenshot eager, the rest `loading="lazy"`. Under 40rem there is a .75rem top margin on `.overview`, and `main:has(> article.overview)` has no top margin, padding or divider line (`/* overview phone: smaller top gap */`).
- Phones, entrance (`/* phone overview entrance and screenshot edge */`): on touch or under 40rem `ov-print` and `ov-in` are redefined without `transform` or `clip-path`, because the transform animations made screenshots shift about 1px left when they finished. `.overview .slide` clips its overflow and its `img` is 1px wider than the slide, so a fractional frame width never leaves a light line at the right edge. Videos are not affected.
- Screenshot keys (`.car-slider > .cs-key`, built by `car-slider.js`): dark keycaps with a 7-step sidewall, dished face and engraved arrow, both keys the same muted legend. Active drops 5px (off for reduced motion), and `.car-slider` has 12px bottom padding for that travel. The old `.car-btn` and `.car-count` stay in the markup, hidden, because the keys click them. Only `display: none` remains for them, so don't add new `.car-btn` rules. The `.car-count` text must match the slide count (now `1 / 4`).
- Kaltas privacy policy (`/kaltas/privacy-policy`): the same card as the overviews (`<article class="overview policy">`; the back arrow is a `.back-top` to `/kaltas`; no carousel, facts or status chip). The `.policy` rules (search "Privacy policy" in `css/styles.css`) give a 40rem column, numbered `h2`s, `.policy-meta` for the date and `.policy-lede` for the summary. Body text inherits the overview's font (Geist), headings use the overview's mono label style and keep `animation: none` so they print with the card. New sections are a plain `h2` followed by `p` or `ul`; keep paragraphs short. It is the policy URL in the Chrome Web Store dashboard and the Kaltas popup footer, so never rename or remove it. Keep the text in sync with what the extension actually does (permissions, the `offers.json` fetch from GitHub) and update "Last updated" when it changes. It is linked from the Kaltas links row, not the nav. A CivicGuard policy would go at `/civicguard/privacy-policy`.

## Lightbox (enlarge images and videos)

- `js/lightbox.js` (IIFE, `defer`) plus a block at the end of `css/styles.css`. Clicking an image or video in `.overview .slide` opens it in a fixed `.lb` dialog with prev/next through that carousel, Esc, backdrop click or X to close. Enter on a focused `.slides` opens the current slide. A pointer move of more than 6px between press and release doesn't count as a click, so swiping never opens it.
- Videos open at the same playback time, with controls and sound. The source video pauses while open and resumes on close (not under reduced motion). On close the carousel scrolls to the slide you were on and `.slides` gets focus. The back button (`popstate`) closes it. Page scroll is locked with `overflow: hidden` on `<html>` while open.
- `.lb-hint` is a real `<button>` injected into every `.overview .frame.carousel` by `lightbox.js` (a MutationObserver re-adds it after `home.js` swaps pages), not markup in the HTML files. It must stay a real element, because a pseudo-element can't hover separately from the image. Resting opacity .55, brightens only on its own hover or focus.
- `<script src="/js/lightbox.js" defer></script>` is in `index.html` and both project pages. The home page needs it because `home.js` swaps overviews in without running page scripts (it only loads `carousel.js` itself, on demand).
- Phones (max-width 40rem): 2rem buttons, prev/next move below the image beside the `n / total` counter. Images show at their file size (up to 1280px), no zoom beyond that. No swipe between slides yet.

## Certificates page

- `certificates/index.html`, nav item right under Projects. Same shell as Experience: `<article>` with `<h1 class="page-title">Certificates</h1>`, then one `.entry` per certificate. It reuses the Experience `.entry` and `.when` styles. Page-specific CSS at the end of `css/styles.css`: `.cert-badge` (with `h2:has(> .cert-badge)` and the tightened bottom padding of an entry that has a badge) and `.cert-link` (the credential button).
- List only certificates that are earned and real, newest first. Keep the page's `<meta name="description">` and `og:description` accurate when certificates are added or removed.
- Entry markup (copy the last block, new certificates go on top):

```html
<div class="entry">
  <h2>Google IT Support Professional Certificate<img class="cert-badge" src="/images/badges/itsupport-badge.webp" width="76" height="68" alt="Google IT Support Certificate badge"></h2>
  <p class="when">Google &middot; Coursera &middot; Issued Mon YYYY</p>
  <p class="cert-link"><a href="https://..." target="_blank" rel="noopener noreferrer"><svg class="ico" viewBox="0 0 16 16" aria-hidden="true">...</svg>view credential</a></p>
</div>
```

- `h2` is the certificate name, one per entry. `.when` is "Issuer &middot; platform &middot; Issued Mon YYYY" (use the `&middot;` entity; drop "Issued" only if the date is unknown). No description paragraph.
- Badge (optional): self-hosted in `images/badges/` as `<short-name>-badge.webp` (lowercase, hyphens), with the transparent padding cropped off (Pillow, `getchannel("A").getbbox()`). Never hotlink a logo. It sits inside the `h2` right after the title text as `<img class="cert-badge">`. 4.25rem tall with -1.2rem vertical margins so it doesn't stretch the title row; under 40rem it stays on the right at 3.5rem tall with no negative margin, and the title gets a 1.25 line height. Save it as WebP at 2x its display size (152 x 136 for the 76 x 68 badge) and keep the `width` and `height` attributes equal to the CSS size in px. It is not an `.org-logo`.
- Credential button: `p.cert-link > a`, an outlined button with an inline external-link icon and the text "view credential" (new tab, `rel="noopener noreferrer"`). Its look is a standalone copy of `.overview .meta li a` (muted text, `var(--line)` border, .5rem radius, scale-up hover, no transform under reduced motion), not tied to the "Overview links v27" grid, so update `.cert-link` by hand if the overview buttons are restyled. Leave the paragraph out when there is no public credential link.
- Spacing: the first entry must sit the same distance under `.page-title` as on Experience, so don't override `.entry` margin-top or padding-top.
- Wired in `js/home.js` (the `warm()` prefetch list and the `inPage` regex), `sitemap.xml` and the sidebar nav on every page.
- Check at about 380px: the badge sits to the right of the title, vertically centered, the button fits, and the gap under the page title matches `/experience`.

## Navigation

- Links in `#main` to `/`, `/about`, `/experience`, `/certificates`, `/kaltas`, `/civicguard` swap in place via `home.js`. Modifier clicks, `target="_blank"`, downloads, hashes and queries fall through. `norm()` treats `/projects/x.html` and `/projects/x` the same. Project pages must keep `<main id="main"><article>`. The active nav item matches by `href`.
- New pages need the same script tags and font preload links. `warm()` in `home.js` skips the idle prefetch of the other pages on Save-Data and 2g connections.
- Don't reuse the `.js` card reveal rules for new page types without reading the `.js` rules near the top of `css/styles.css`.

## Page intro motion and phone rules

- Cold-start focus rise (end of `css/styles.css`, tokens `--fr-dur`, `--fr-ease`, `--fr-step`, `--fr-rise`, `--fr-blur` on `:root`): on the first load in a tab (`.js` from the head script) the `.side` children, the page heading (`.home-intro h2` or `.page-title`), the page body and the mascot fade in, rise and sharpen with one keyframe (`focus-rise`) and a per-element `--i` step. Home cards and overview/policy cards keep their own intros and are excluded. For new page types, set `--i` in that block instead of adding a new animation.
- Order: sidebar photo (`--i: 0`), name, location, nav, links (`--i` 1 to 4). Body children on About and Experience stagger with `:nth-child` (`--i` 2 to 7, later children stay at 7); that is fine here, the "never `:nth-child`" rule applies to the overview intro only. Pages with no `.page-title` and no `.overview` (the 404) fade as one block (`--i: 1`, no blur).
- Blur only goes on elements with no absolutely positioned children (`nav` and `.side-links` set `--fr-blur: 0px`). If blur stutters on phones, lower `--fr-blur` on `:root`. Phones and touch already set it to 0px in the last block of `css/styles.css`.
- The mascot wrapper uses the same tokens as a transition, held by `been-wait` until the first `/api/hi` response or 800ms (`been-here.js`). `index.html` preloads the profile photo; if its path or `?v=` changes, update the preload too.
- Phone text floor (`/* phone text floor */` and `/* phone text floor 2 */`, end of `css/styles.css`): visible phone text stays at 12px or more (facts labels, carousel counter, mascot text, card dates and links, card and overview link pills). Desktop-only reader and receipt text is exempt.
- Tap targets (`/* tap targets */`): on touch or under 40rem, `.overview .back-top::before` is an invisible pseudo-element that grows the hit area to about 44px without changing the visual size. Never give this element another `::before`. The `.side nav a:active` translateX press nudge is cancelled on touch or narrow, because it made the top tabs shift when tapped.

## Sound (`js/clack.js`)

- Loaded with `defer` on every page, after `slide-open.js`. Thock on press only (no release sound), dry hover tick (mouse only) on links, buttons and whole cards. The card counts as one target, but `.meta li+li a` ticks separately (checked first). One voice at a time, 130ms cooldown. Adjust loudness with `master.gain.value` only.
- Mute button (`.snd`): built and appended to `<body>` by `clack.js`, so it shows on every page (the 404 included) and survives `home.js` swaps. Fixed bottom-right (1rem inset, safe-area aware), a 2.75rem round tap target, inline SVG speaker or speaker-with-cross in `currentColor`, with a changing `aria-label` ("Mute sound" / "Unmute sound"). State is `on` in `clack.js`, saved in `localStorage` key `sound-v1` (`"off"` when muted, always in try/catch); every sound function checks `on`. The press thock skips `.snd`, and unmuting plays one thock as confirmation. CSS is the `/* sound toggle */` block. Its z-index 40 sits under the lightbox (1000) and above the phone nav (30). It adds no `window` global.
- On by default. The AudioContext is built on load and unlocks on `pointerup`, `keydown`, `touchend` and `click`, so the very first press is silent. `init` resumes the context from any state except `running` and `closed`, because Safari and iOS use `interrupted` after a tab switch. A browser can still keep the first press after returning to a tab silent, and that can't be avoided. `wake()` also runs on `visibilitychange`, window `focus` and `pointerover`, plays a silent one-sample buffer after each resume, and a `pointerdown` that arrives while the context is not running waits for `wake()` and then plays `down()`. Keep the `wake` calls if `init` changes. To test: play a sound, switch tabs for a few minutes, return, move the mouse, then click.
- Quiet mode: `quiet()` silences the hover tick, press thock and approval beep while `window.__retracting` is true (set by `retractReceipt`, up to 3s) and for 800ms after `printer()` starts, so only the receipt sound plays. If the print duration changes, update that 800ms (`quietUntil`) along with `printer()`. `approve()` has a 700ms cooldown so wiggling around 85% can't stack beeps.

## Content and SEO

- Kaltas and CivicGuard copy mirrors the owner's LinkedIn. Keep role, stack and status in sync. Kaltas is live on the Chrome Web Store ("published", not "submitted"). Don't claim humans review offers beyond what the Kaltas page says. The Ronda repo is deleted (don't link it). CivicGuard has no license.
- Every page has its own `<meta name="description">` and `og:description` (under about 160 chars), `og:url`, a canonical URL on `https://miconavarro.vercel.app` (clean, no `.html`), and matching `og:image` / `twitter:image`. Keep `og:` tags in sync if the title or image changes. A new page goes in `sitemap.xml`; the 404 page doesn't.
- Share image `images/site/og.png` (1200x630, heart and name only) is rendered from `images/site/og.svg`: `rsvg-convert -w 1200 -h 630 -o images/site/og.png images/site/og.svg`. Edit the SVG, not the PNG. It is linked as `og.png?v=2`; bump `?v=` so link previews refresh. Project pages use their own screenshot.
- Favicon: `<link rel="icon" type="image/svg+xml" href="/images/site/favicon.svg?v=2">` on every page (the heart). Bump `?v=` when it changes, because browsers cache favicons hard. No custom domain.
- Overview pages preload their first visible image with `fetchpriority="high"` (see each page's head for the current file). If that image changes, update the preload too.
- `index.html` carries a `Person` JSON-LD block just before `</head>`. Keep its `sameAs` links in sync with the sidebar links.
- `theme-color` matches `--bg` of the active theme (`#E7DEC8` light, `#0B0B0B` dark); `theme.js` and the head script keep it in sync.
- Theme button (`.theme-btn`, also has `.snd` for the shared look): built by `js/theme.js`, fixed bottom-right just left of the mute button.
- `vercel.json` sends security headers on every route (nosniff, referrer policy, same-origin framing, locked-down permissions), caches `/images/*` for a week (stale for a day while revalidating) and `/fonts/*` for a year as immutable. Bump `?v=` or rename the file when an image or font changes. There is no CSP yet because every page has an inline head script.
- Fonts: Geist, Geist Mono and Big Shoulders Display 700 (Latin only) are self-hosted in `fonts/`, with `@font-face` at the end of `css/styles.css`. Every page head carries the same three `rel="preload" as="font"` links. Never re-add Google Fonts. The sidebar name uses the last `--condensed` definition.

## Adding a page

For a top-level page in the sidebar nav. Use `certificates/` or `experience/` as the template. Find every place a page is wired in with `grep -rIn -i certificates . --exclude-dir=.git`.

1. **Page**: copy `experience/index.html` to `<slug>/index.html` (served as `/<slug>`). Replace the `<article>` content and keep `<main id="main"><article>`, the `.page-title` h1, the head script, the font preloads and the theme-color and color-scheme tags.
2. **Head**: unique `<meta name="description">`, `og:description`, `og:url` and canonical URL. The `<title>` is `Mico Gerard Navarro`.
3. **Nav**: add an `<li>` to the nav `<ul>` in every page that has one (listed under "Global rules"), in the agreed order, with `aria-current="true"` on the new page's own item. Update the order in the Nav rule and the "Keep all N tabs equal" line.
4. **`js/home.js`**: add the route to the `warm()` prefetch list and to the `inPage` regex. `setActive` needs no change.
5. **`sitemap.xml`**: add a `<url><loc>https://miconavarro.vercel.app/<slug></loc></url>` entry.
6. **This file**: update the Layout table, "Run and check", "Navigation", the `.page-title` list and the shell-width line. Add a section if the page has its own markup or CSS.
7. **Verify**: serve locally. Open the page from home, About and a project page without a reload, confirm the sidebar highlight on each, and check the top bar at about 380px with the new item count.

## Adding a project

Use the newest project (`kaltas/`) as the template. Find every place it is wired in with `grep -rIn -i kaltas . --exclude-dir=.git --exclude-dir=node_modules`. Miss one and in-place navigation, the commit count or the sitemap breaks.

1. **Overview page**: copy `kaltas/index.html` to `<slug>/index.html`. Rewrite the content, keep the markup and class names (see "Overview pages"), keep the head script, and set a unique `<meta name="description">`, `og:description`, `og:url` and canonical URL. A new project needs `.ov-num`, `.back-top`, `.ov-status`, `.ov-chip`, `.pills`, a `repo-commits` span, `data-index` on its card, and the `lightbox.js` script tag.
2. **Titles**: `<title>` and `og:title` are `Mico Gerard Navarro: <Name>`. Home, About, Experience and Certificates use just `Mico Gerard Navarro`. The 404 keeps `Page not found: Mico Gerard Navarro`. `home.js` reads the title from each page.
3. **Images** (`images/projects/<slug>/`): `<slug>-icon.webp` (120x120, shown at 60x60), plus screenshots or video named `<slug>-1.webp`, `<slug>-2.webp` and so on. WebP quality 82 (portrait 80). Keep the original PNG only where it is the `og:image`. First screenshot eager, the rest `loading="lazy"`. Bump `?v=` on an image URL when you replace the file.
4. **Home card** (`index.html`, `.projects-grid`): copy the Kaltas `<article class="item reveal">` card, including its `.hover-pad` span, the first `.meta` link ("Open <Project> project") and only the links that apply (download, repository, live site). The new project goes first and takes the next `data-index` (Kaltas is 02, so the next is 03). Set its `.dates` text (e.g. "November to Present 2026") and its stack pills (`<p class="card-stack">`, from the overview's Stack row).
5. **`js/home.js`**: add the slug in all four places, found with `grep -n kaltas js/home.js`: the active-nav regex (`aria-current`), the prefetch list of routes, the `leaving` regex and the `inPage` regex. If one is missed, the page works on a hard load but breaks or flashes on in-place navigation.
6. **`api/commits.js`**: add `<slug>: "<repo>"` to the `PROJECTS` map.
7. **`sitemap.xml`**: add the `<url>` entry.
8. **Copy that lists projects**: update the home `<meta name="description">` and `og:description`, and the route lists in this file (Run and check, Navigation).
9. **Verify**: check `/`, `/<slug>`, About and Experience at about 380px and with reduced motion. Click from home into the project and back without reloading and confirm the tab title, the sidebar highlight and no flash. Open `/<slug>` in a fresh incognito window and confirm the sidebar, overview and mascot intro play.

Pitfall: Kaltas has extras a new project should not inherit: the privacy policy page (route, sitemap entry), the Chrome Web Store users pill, and the store-related copy.

## Removed on purpose (do not bring back unless asked)

- The card number `01` / `02` on the card, and every cursor, hand or card icon in the intro text (all `.pi-click` rules and the `cursor-*` keyframes).
- The stripe bar and every icon on the card (pointing hand, circle, ring, gold chip), the `.meta::before` date text, and the `+more` / `+N more` pills.
- Stack layouts v2 to v6 (3-tag limit, two-row height, `cqw` sizing) and the old `fitStacks()` with `+N` pills.
- The tall role tile (`facts-tall`), the filled card link pills, and the "sharp hover" no-tilt experiment.
- The GitHub logo on the overview commits pill (tried, didn't look right) and the goggles GitHub mark. The commits pill stays text only ("340+ commits on GitHub").

## Store badges and link icons

- Each project has one badge as its action link, on its home card and on its overview: Kaltas "DOWNLOAD ON / Chrome Web Store" (Chrome icon, `https://ggl.link/kaltas`) and CivicGuard "OPEN ON / the Web" (globe icon). Markup: `<a class="badge" href target="_blank" rel="noopener noreferrer"><svg class="ico line">...</svg><span class="bd-t"><span class="bd-s">small label</span><span class="bd-b">Big name</span></span></a>`. The look is one block at the end of `css/styles.css` (`all: unset` on the anchor, then the pill). Keep `position: relative` on it so it sits above the card's stretched link. Phone label text stays 12px or more.
- The home cards no longer have a repository button. The repository link stays on the overview pages (outline GitHub icon) next to the badge, and Kaltas keeps its privacy link there.
- Link icons are 24px-viewBox outline icons (`class="ico line"`: 2px strokes in `currentColor`, no fill) from Tabler: GitHub, shield (privacy), globe, Chrome. Don't bring back the old filled GitHub mark.
- Store badges have a black background. The Kaltas badge uses a full-color Chrome logo (`class="ico color"`, 48px viewBox, own fills). Other link icons stay outline.

- The card reader was removed completely: its script and its CSS are deleted. `js/card-link.js` makes project cards clickable.
- Carousel keycaps (`.cs-key`) are cream in light theme (`CREAM KEYCAPS` block at the end of `css/styles.css`) and black in dark theme.
- Project card flip: `js/card-link.js` lifts and turns the clicked card, then the overview flips in; leaving flips the card back. The page view transition is disabled for entering (`html:not(.vt-leave)` rules in `css/styles.css`).
