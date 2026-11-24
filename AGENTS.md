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
| `css/styles.css` | All styling. Light theme (default) and dark theme |
| `js/home.js` | In-place navigation, prefetch, card spotlight and tilt, view transitions |
| `js/card-link.js` | Clicking anywhere on a project card opens its real link (see "Click to open") |
| `js/theme.js` | Theme toggle button (`theme-v1`); moves the theme and mute buttons into the sidebar tools row |
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
- The owner pastes terminal output back, and that is the only view of the repo. Use `git --no-pager` (the pager hides output) and `cut -c1-200` on long lines, and read the real rules before writing a patch. Don't guess selectors.
- One request is one scope. Don't rewrite unrelated sections. Never commit secrets.

### Commit messages

Subject is `type: short summary`, all lowercase (brand names, acronyms and `+N` too), under 80 characters, imperative ("add", "fix"). Types: `feat`, `fix`, `style` (visual or css), `docs` (agents.md or readme), `refactor`, `perf`, `chore` (tooling or cleanup), `copy` (wording), `content` (data or text on the site), `test`, `build`, `ci`. The `.githooks/commit-msg` hook enforces this, so don't bypass it with `--no-verify`. Add specific files, never `git add -A`. To undo a commit use `git revert HEAD --no-commit` and commit with your own lowercase subject, because git's default revert subject starts with a capital R and the hook rejects it.

## Global rules

- Two themes: a cream light theme (default) and the original dark theme. Light tokens and overrides are the `LIGHT THEME` blocks at the end of `css/styles.css`, all scoped to `:root:not([data-theme="dark"])`; dark is `data-theme="dark"` on `<html>`. The choice is saved in `localStorage` key `theme-v1`. A new color must work in both themes: use the tokens, not hex values.
- Centered frame: `body` is capped at `--frame` (64rem, the same width as the page shell, so there is no empty strip beside the sidebar) and centered, `html` is pure black, so wide screens show black sides. Where the theme and mute buttons are not in the sidebar row (phones and pages without a sidebar) they position from `--edge` so they stay inside the frame. Light theme extra: the FlyRank wordmark (`.org-logo`) sits on a small black pill.
- Layout (end of `css/styles.css`): on desktop the sidebar is flush to the frame's left edge, and `main` is centered in the space beside it with width `--main` (34rem, or `--main-wide` 44rem for project overviews). To change widths, edit `--frame`, `--main` or `--main-wide`; nothing else needs moving.
- Rounded corners: from 66rem up, `body` uses `clip-path: inset(0 round 1.5rem)` (later commits made the rounding corner-only and subtler, so read the current rule before changing it). No margins or overflow rules, so the page scrolls normally. Do not use `overflow: clip` on `body`: it propagates to the viewport and breaks scrolling.
- Colors: only `var(--...)` from `:root`. Dark theme values: cream `--ink` `#F3E9D2` for headings, `--text` `#E4DAC3` for body, `--muted` for secondary. The light theme redefines the same tokens in its `LIGHT THEME` blocks. Never hardcode `#fff` or hex colors in new rules.
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
- Every HTML page carries the head script from `index.html` line 19 (sets `.js`, first visit in a tab only), the three font preload links, `<meta name="theme-color" content="#E7DEC8">`, `<meta name="color-scheme" content="light dark">` and the one-line theme script (sets `data-theme` before paint) right after the viewport tag, and `<script src="/js/theme.js" defer>` after `clack.js`. `js/card-link.js` also loads on every page, so cards open after an in-place swap. Without the script no cold-start motion plays.

## JS conventions

Small IIFEs, two-space indent, double quotes in newer files. `window` globals: `initCarousel`, `initCommits`, `beenAim`, and `__retracting`, which `clack.js` and `home.js` still read but nothing sets any more. Don't add more. Page-specific scripts and `<head>` styles don't run on an in-place swap, so keep behavior in shared files.

## CSS rules

- `css/styles.css` is a long stack of overrides, and a later rule beats an earlier one on purpose. Add each change as a labeled `/* ... */` block at the end of the file. Don't edit older rules in place.
- Before deleting a class or variable, grep `js/`, `index.html`, `about/`, `experience/`, `certificates/`, `kaltas/` and `civicguard/` for it.
- Cleanup method: a rule (or a declaration) is provably dead only when a later rule with the same selector in the same media query redeclares every one of its properties. Parse the file, remove those, then assert that the winning value of every (media query, selector, property) is unchanged. Don't remove rules by reading selectors alone. Done so far: unused classes, superseded stack blocks, and every fully overridden rule (batch 2b). Not yet checked: partly overridden rules, the `.meta::before` / `::after` `display: none` rules and the old `data-index` date rules.
- Not cleaned: older stacked `.meta li+li a` and reader/receipt rules that are overridden through different selectors. A script can't prove those dead, so trim them only in small batches and check the site after each.

## Sidebar and mascot

- Desktop (56.01rem up): static full-height panel (`sticky; top:0; height:100dvh; border-radius:0`), no inner scroll, content centered on tall windows, base font 110%. No `margin-top:auto` on the mascot, no fixed pixel height or `overflow:auto`. Under 52rem tall it flows with `height:auto`.
- Phones and tablets: sidebar and top nav are hidden on project pages (`body:has(.project-title) .side`). Under 40rem the header is centered (7.25rem photo, name, location, icons, welcome row). The phone photo size is set only in the `@media (max-width: 40rem)` phone header rule (`.side .profile-photo`). Desktop uses height-based clamps and tablets a 4.25rem inline layout, so don't change those for a phone tweak.
- Location line has a pin and sits under the social links on desktop (CSS `order`). Text is 85% `--ink`. The pin is a Tabler map-pin (`<svg class="ico line">`, 2px stroke, `var(--text)` colour, centered on the line; `PIN MATCH` block). Contact links underline on hover and focus only. Desktop mascot block has a 1px `#333230` top border. Description matches About text (18px, 1.7).
- Sidebar contact icons (email, GitHub, LinkedIn, Instagram) are thin outline icons in the Tabler style: `<svg class="ico line" viewBox="0 0 24 24">` with 2px strokes in `currentColor` (`.side-links .ico.line`, end of `css/styles.css`), shown at the usual 18px. Card, overview and certificate GitHub icons keep the filled mark.
- Mascot look: soft-shaded red heart (`#e5484d` base, radial gradient `#heart-g`, no visible outline; `.been .heart` has a faint same-color stroke (`--heart`, 40% opacity) that feathers the edge), one tall dark oval eye in each lobe (closer together they read as a pig nose), no mouth, arms or shadow, shown on mobile. The button is 5rem on desktop (88px at the 110% base, a whole pixel count, so keep it) and 3.5rem on phones. It is all 2D SVG on purpose: CSS 3D transforms rasterize the mascot and blur its edges.
- Mascot behavior: eyes follow the pointer (rAF-throttled) through `aim()` in `been-here.js`, but only while it is over the `body` frame: on the black sides `look()` calls `aim(0, 0)` and the eyes rest, which also turns the body (`.turn` group: small translate, rotate and squash, eased .35s) and shifts the gradient highlight. The idle look-around in `mascot-idle.js` calls `window.beenAim`. Blink every 4 seconds, one full spin-hop per click (clicks ignored while spinning), red "+1" on first tap only. Idle moves (every 5 to 9s: `look`, `.mi-bounce`, `.mi-tilt`) skip when hidden, under reduced motion, when the pointer moved in the last 3s, or while another move plays. Reduced motion: no eyes, blink, spin or idle.
- Credit line (`.been-credit`, "designed and built by mico"): plain static mono text at low opacity. Welcome text uses `--ink`, count 80%.
- Commit counts: sidebar total "(N+ commits)" beside the github.com/miconvr link (hidden at 56rem and below). Per-repo counts live in `<span class="repo-commits" data-repo-commits="slug" hidden>` in each overview's Activity tile. Both hide if the API fails. New project: add its repo to `PROJECTS` in `api/commits.js`.
- Kaltas users pill (Chrome Web Store), never exact, rounded down server-side: under 5 hidden, 5 to 99 by 5, 100 to 999 by 50, 1,000 to 9,999 by 500, 10,000+ by 1,000. Show "N+ users". CivicGuard has none.
- The mascot wrapper is created by `js/been-here.js`. Don't add mascot markup to pages.

## Home project cards

- Layout: `.projects-grid` is one column (`minmax(0, 26rem)`), Kaltas (`data-index="02"`) above CivicGuard (`01`). A new project goes first and takes the next number. `data-index` is only for ordering, the visible number is hidden. Cards size to their content (`FLAT CARDS` block: `aspect-ratio: auto !important`; the old 1.586 credit-card ratio is dropped), `overflow: visible`, matte `--card` gradient with faint grain (don't lighten), `--card-edge`, `--shadow`.
- Surface (dark theme): border `#242424` and two background layers (grain plus a gradient from `#1b1b1b` to `#131313`) with `background-size: 160px 160px, auto`. Any override of `background-image` must keep exactly two layers or set `background-size` to match, because a third layer once tiled every 160px. Light theme: the `LIGHT CARD GRAIN` block sets `--card-grain` (fine warm noise, tune the last `feColorMatrix` value) over the cream gradient, also two layers. The light card border is `var(--btn-line)` (`:root:not([data-theme="dark"]) .projects-grid .item`).
- Navigation clicks (`js/home.js`, `show()` and `run()`): `dest` is the page being navigated to and is set immediately on click, so the same-page check uses `dest` and not `current` (which only updates inside the view transition). `showSeq` makes the latest click win over a pending fetch, and `runSeq` makes only the latest view transition clean up the `vt-*` classes and `view-transition-name`. There is no `loading` lock, so don't re-add one. Plain sidebar swaps (`vt-swap`) skip `startViewTransition` and swap instantly in `run()`, so rapid clicks are never held up by a transition. Only the card flip (`vt-in`, `vt-out`) uses a view transition.
- Nav smooth hover (`NAV SMOOTH HOVER`, end of `css/styles.css`, replaces `NAV INSTANT HOVER`): the sidebar link line is always 3rem wide and grows by `transform: scaleX(.5)` to `scaleX(1)` (.2s), so the labels never shift on hover and all sit at the same x. Color fades in .15s, the press nudge is off, and the transitions are inside `prefers-reduced-motion: no-preference`. Don't animate the line's `width` or move the text on hover, because links then slide away from the cursor.
- Sidebar polish (`SIDEBAR POLISH`, end of `css/styles.css`, desktop 56.01rem up): nav links are 1rem in `--text`, and `.side-links` is a row of 2.5rem icon tiles (link text hidden with `font-size: 0`, the phone layout's trick). There is no role line under the name.
- Commit tooltip (`COMMIT TOOLTIP`, end of `css/styles.css`, and `js/commit-tip.js`): the `.commits-note` is hidden with `display: none` on every screen size. `commit-tip.js` (a script tag after `theme.js` on every page with a sidebar) watches `.side-links` and copies the note's text onto the GitHub link as `title` and `aria-label`, so the count shows on hover. `commits.js` is unchanged. A new page with a sidebar needs the script tag.
- Site polish 2B (`SITE POLISH 2B`, end of `css/styles.css`): in light mode `--muted` is `#5F543E` and `.been-count` and `.been-credit` are not faded. On desktop (56.01rem up) `.side .lead.loc` resets to `order: 0` and is centered, so the location sits under the name. The page around the frame stays black and the home cards stay a single 26rem column (the original look; the tan page and the two-column card grid were tried and removed). Project dates read "Nov 2026 – present" and "Sep 2026 – present".
- Sidebar tools up (`SIDEBAR TOOLS UP`, end of `css/styles.css`, desktop 56.01rem up): `.side .side-tools` has `margin-top: 1.25rem`, overriding the older `margin-top: auto` that pinned the theme and sound buttons to the bottom edge. Phones are untouched (`.side-tools` is `display: contents` there).
- Content, top to bottom: icon, title, `.dates` line, one tagline, then the store badge. The stack pills (`.card-stack`) stay in the markup but are hidden on the home cards (`HIDE CARD STACK FIX` block). Taglines: Kaltas "Chrome extension that finds student deals for the website you're visiting." CivicGuard "Incident and curfew monitoring website for Barangay Maimpis." No commits pill, cardholder, card-number or holo-sticker markup.
- Dates: `.dates` under the title on every width ("November to Present 2026" / "September to Present 2026", real letters). OCR-style mono, 600, uppercase, .14em spacing, dim cream, .78rem (.7rem on phones). If a date changes, update the card text.
- Spacing: the `COMPACT CARDS` block at the end of `css/styles.css` overrides the older values (`--card-pad-y` 1.1rem, `--card-meta-gap` .8rem, min-height 0). The older `/* no number, even card spacing */` values are the base: padding 1.3rem on every side. Title to date .3rem, date to tagline .7rem, tagline to tags .7rem, tags to links .9rem. On phones `.projects-grid` has 4.5rem bottom padding so the old floating sound button cleared the last card (the buttons now sit in the sidebar row or at the top, so this padding may be removable).
- Stack pills are hidden on the home cards (`HIDE CARD STACK FIX`). The one-row font fitting (`--stack-fs`) lived in `slide-open.js`, which no longer exists, so nothing fits them now. If they are shown again, add a fitting script first. The pill look is in `/* date font and stack box look */` and `/* lit stack boxes */`. The overview's Stack row is separate and unchanged.
- Links: the home cards show only the store badge (see "Store badges and link icons"), no repository, download or live-site buttons. Don't restyle the badge unless asked.
- Link icons (`/* smooth link icons: 18px */`, end of `css/styles.css`): card, overview and certificate link icons and the desktop sidebar icons are 18px, drawn from the 16px icon paths with `shape-rendering: geometricPrecision`. GitHub links use the outline GitHub icon (see Store badges and link icons below). Fractional sizes resample the mark and make it look pixelly, so keep icon sizes in whole pixels.
- Whole card is clickable (see "Click to open"). The first `.meta` link (aria-label "Open <Project> project") stays in the markup as a 1px clipped, absolutely positioned box: `card-link.js` clicks it and keyboard users tab to it. Focus shows an outline on the whole card (`:has(a:focus-visible)`). No visible bar, cursor, hand, chip, number or icon on the cards (`.item-top::after` is hidden, and the contactless `))` mark, which is `.item-top::before` drawn with a mask, is hidden by the `NO CONTACTLESS MARK` block). Other links stay `position: relative`. No nested links.
- `.item-head` and `.item-top` must stay un-transformed (no `transform`, `filter` or `will-change`): a transformed ancestor re-parents absolutely positioned children and makes them jump. Use opacity, `translate` or `scale` instead.
- Hover (fine pointer, no reduced motion): `home.js` sets `--mx --my --rx --ry`. The tilt is half the angle with `perspective(1400px)` (`/* tilt v2 */`), one `.projects-grid .item:hover` transform rule. Text on a rotated surface is resampled, so a little softness at the tilt edges is expected. Never put a fractional scale on a hovered card with text. Touch gets a `:active` press and no hover transforms. Put new effects on a different property than `transform` (`rotate`, `scale`, `translate`).
- Hover-out: the bare `.item` has a slow transition (.6s transform and shadow, soft ease-out), while `:hover` / `:active` use the quick .25s one, so the card drifts back instead of snapping. Keep `:not(.spring):not(.pulling):not(.dip)` on that quick rule. Under `.js`, hover-out needs its own rule, because `.js .item.reveal { transition: none }` beats the bare one.
- Layers: `will-change: transform` goes on `.projects-grid .item` only while it is not `.pulling`, `.retract-hold`, `.spring` or `.dip`, on mouse devices with motion allowed (`/* layer only at rest */`). Never add `will-change` or `backface-visibility` to a card without those `:not()` guards: a permanent layer keeps the text rasterized at an old size, so the card stays soft after open, overview and back. The deleted `slide-open.js` added those state classes, so nothing adds them now, but keep the guards.
- Tilt reset: `home.js` skips tilt on `pointermove` while the card is `.pulling`, `.retract-hold` or `window.__retracting`. The `--rx` / `--ry` reset on open and return lived in `slide-open.js` (deleted). If a card comes back from an overview still tilted or blurry, reset both to `0deg` when the card opens.
- Hit area: each card has `<span class="hover-pad" aria-hidden="true">` as its first child. It extends the hit area 10px below the card, active only while hovered, so the lift and tilt don't push the bottom edge out from under the pointer (flicker loop). New project cards need it too.
- Card intro (`/* Card intro v2 */`, end of `css/styles.css`): under `.js` the card shell fades in by opacity (`.item.reveal:not(.in)` is hidden), then `.item-head` (opacity only), the tagline and `.meta` follow at .1s, .18s and .26s. Each later card adds `--ro` (.12s steps).
- Idle sheen: removed. `slide-open.js` added `.sheen` to the cards, and nothing does now (the `card-sheen` keyframes may remain as dead CSS).
- Projects intro (`.projects-intro`): muted mono text, max 34rem, one wording on every device: "Click a card to see the project's overview." (plain text in `.pi-lead`, no icon or parentheses).

## Click to open

- The whole home project card is the click and tap target on every device. `js/card-link.js` (loaded on every page) listens for `click` on the document. It ignores modified clicks, non-primary buttons, clicks on a link or button inside the card, and clicks while text is selected. Otherwise it clicks the card's first `.meta` link (`a[href^="/"]`), and `home.js` handles that link like any other, so the page transition and in-place navigation run as usual.
- Keyboard: Tab reaches that first `.meta` link (kept as a 1px clipped box), and Enter opens it directly.
- Sound: `card-link.js` fires `reader-approved` on the document right before the link click, which plays the approval beep from `clack.js`. No printer sound plays, because there is no receipt.
- Removed completely (do not re-add unless asked): the card reader terminal, the receipt and its feed animation, the scan and pull, the swipe or drag, the phone chip, the tap dip, and `js/slide-open.js` itself. Leftover CSS for them (`.reader`, `.retract-hold`, `.dip`, `.spring`) is harmless and is being cleaned in small batches.
- Intro text on Home: "Click a card to see the project's overview." (plain text, one wording on every device).

## Overview pages

- `<main id="main"><article class="overview">`, styled as one big card (44rem max, `--card`, 1rem radius). The carousel is the hero (40rem), the lede is .95rem mono with a 36rem line length, and outcomes are a spaced list with custom dots.
- Markup per project: `.project-title` holds the back/X (`.back-top`, round, icon only), icon and `<h1>`. `.ov-num`, `.ov-status` and `.ov-chip` are hidden but stay in the article, or the CSS won't match.
- Facts (`/* facts: role row */`), same for every project: Role full width on top, Status and Activity side by side, Stack full width. On phones Status gets 1.2fr and Activity 1fr so "In Development" fits (`/* overview facts: status room on phones */`); under 23.75rem it is one column. Role and Stack are `<dd class="pills">` with one `<span>` per item, so write roles as separate spans, never joined with "and". Pills copy the card pill look at `.85rem` (`.78rem` on phones) with `.2em .7em` padding.
- Status: `<span class="fact-status" data-status="live|dev">`, with the dot after the text (`::after`): `live` is `--live` green, `dev` is `--dev` amber. The gap between the text and the dot is `.5em` plus `margin-left: .2em`, about .7em (`/* overview status dot gap */`, end of `css/styles.css`); change that `margin-left` to adjust it.
- Activity: `.repo-commits`, filled by `js/commits.js` from `/api/commits` (cached in localStorage under `commits-v3`). No icon, reads "340+ commits on GitHub" (` on GitHub` is a `::after`, dropped under 40rem), capped at the tile width with an ellipsis, and copies the border, radius, fill and color of the stack pills.
- Links row (`.overview .meta`): muted palette (text 55% `--ink`, outline 22%, hover full `--ink` and 50%), .85rem text, no arrows, no green, no band. Selectors use `.overview .meta li a` and reset `::before` / `::after` to `content: none`. The block "Overview links v27" (end of `css/styles.css`, shared by every overview) makes the buttons even: a left-aligned flex row on desktop, and at `max-width: 40rem` a 2-column grid of equal-width buttons where an odd last button (privacy) spans the full row. Change buttons there, not in the older blocks. Check both overviews after any change.
- Entrance: none. The `OVERVIEW: HARD STOP` block (end of `css/styles.css`, `!important` on purpose) turns off the overview's own animation, so the page flip is the entrance. The older `ov-print`, `ov-in` and scan-line rules stay in the file but are overridden. Cursor spotlight via `.overview::after` and `--mx/--my`. No tilt on overviews. Never give `.overview` an animation from a `main > article` rule: the generic fade is `.js main > article:not(.overview)`.
- Exit and entry: see "Page transitions" near the end of this file. The old `vt-exit` roll-up and `vt-fade` are gone. Reduced motion and unsupported browsers get an instant swap.
- Phones (30rem and below): 1rem padding, 2rem title. First screenshot eager, the rest `loading="lazy"`. Under 40rem there is a .75rem top margin on `.overview`, and `main:has(> article.overview)` has no top margin, padding or divider line (`/* overview phone: smaller top gap */`).
- Phones, screenshot edge (`/* phone overview entrance and screenshot edge */`): `.overview .slide` clips its overflow and its `img` is 1px wider than the slide, so a fractional frame width never leaves a light line at the right edge. Videos are not affected. The transform-free `ov-print` / `ov-in` versions in the same block only matter if an overview entrance is ever re-enabled: transform animations made screenshots shift about 1px left when they finished.
- Screenshot keys (`.car-slider > .cs-key`, built by `car-slider.js`): keycaps (black in dark theme, cream in light theme via the `CREAM KEYCAPS` block) with a 7-step sidewall, dished face and engraved arrow, both keys the same muted legend. Active drops 5px (off for reduced motion), and `.car-slider` has 12px bottom padding for that travel. The old `.car-btn` and `.car-count` stay in the markup, hidden, because the keys click them. Only `display: none` remains for them, so don't add new `.car-btn` rules. The `.car-count` text must match the slide count (now `1 / 4`).
- Kaltas privacy policy (`/kaltas/privacy-policy`): the same card as the overviews (`<article class="overview policy">`; the back arrow is a `.back-top` to `/kaltas`; no carousel, facts or status chip). The `.policy` rules (search "Privacy policy" in `css/styles.css`) give a 40rem column, numbered `h2`s, `.policy-meta` for the date and `.policy-lede` for the summary. Body text inherits the overview's font (Geist), headings use the overview's mono label style and keep `animation: none` so they print with the card. New sections are a plain `h2` followed by `p` or `ul`; keep paragraphs short. It is the policy URL in the Chrome Web Store dashboard and the Kaltas popup footer, so never rename or remove it. Keep the text in sync with what the extension actually does (permissions, the `offers.json` fetch from GitHub) and update "Last updated" when it changes. It is linked from the Kaltas links row, not the nav. A CivicGuard policy would go at `/civicguard/privacy-policy`.

## Lightbox (enlarge images and videos)

- `js/lightbox.js` (IIFE, `defer`) plus a block at the end of `css/styles.css`. Clicking an image or video in `.overview .slide` opens it in a fixed `.lb` dialog with prev/next through that carousel, Esc, backdrop click or X to close. Enter on a focused `.slides` opens the current slide. A pointer move of more than 6px between press and release doesn't count as a click, so swiping never opens it.
- Videos open at the same playback time, with controls and sound. The source video pauses while open and resumes on close (not under reduced motion). On close the carousel scrolls to the slide you were on and `.slides` gets focus. The back button (`popstate`) closes it. Page scroll is locked with `overflow: hidden` on `<html>` while open.
- `.lb` is attached to `<html>` rather than `<body>`, so the body's rounded `clip-path` can't cut it. The counter is cream in light theme.
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

- No entrance animations anywhere (`NO ENTRANCES`, end of `css/styles.css`, after the `Card intro v2` and `focus-rise` rules it overrides): the sidebar, page headings and bodies, Projects cards, the mascot and its counter all appear at once on load and on every in-place swap. Only the card flip between Projects and an overview stays (see "Page transitions"). The older `focus-rise`, `Card intro v2`, `been-wait` and `SNAPPY INTRO` rules stay in the file as dead CSS, so the "Cold-start focus rise", "Card intro" and mascot-fade notes elsewhere in this file describe code that no longer plays. Don't re-add entrances unless asked.

## Sound (`js/clack.js`)

- Loaded with `defer` on every page. Thock on press only (no release sound), dry hover tick (mouse only) on links, buttons and whole cards. The card counts as one target, but `.meta li+li a` ticks separately (checked first). One voice at a time, 130ms cooldown between ticks. Adjust loudness with `master.gain.value` only.
- After any mouse press, hover ticks are skipped for 450ms (`noTickUntil`), so a sidebar click plays only the thock and not a tick when the page swaps under the cursor.
- Mute button (`.snd`): built by `clack.js` and appended to `<body>`, so it exists on every page (the 404 included) and survives `home.js` swaps; `theme.js` then moves it into the sidebar tools row (see "Sidebar tools"). Inline SVG speaker or speaker-with-cross in `currentColor`, with a changing `aria-label` ("Mute sound" / "Unmute sound"). State is `on` in `clack.js`, saved in `localStorage` key `sound-v1` (`"off"` when muted, always in try/catch); every sound function checks `on`. A saved `"off"` silences everything, so when the sounds seem gone, check `localStorage.getItem("sound-v1")` first. The press thock skips `.snd`, and unmuting plays one thock as confirmation. CSS is the `/* sound toggle */` block plus the sidebar tools blocks. Its z-index 40 sits under the lightbox (1000) and above the phone nav (30). It adds no `window` global.
- On by default. The AudioContext is built on load and unlocks on the first `pointerdown`, `keydown`, `touchstart`, `pointerup`, `touchend` or `click`, so the very first press can be silent. `init` resumes the context from any state except `running` and `closed`, because Safari and iOS use `interrupted` after a tab switch. A browser can still keep the first press after returning to a tab silent, and that can't be avoided. `wake()` also runs on `visibilitychange`, window `focus` and `pointerover`, plays a silent one-sample buffer after each resume, and a `pointerdown` that arrives while the context is not running waits for `wake()` and then plays `down()`. Keep the `wake` calls if `init` changes. To test: play a sound, switch tabs for a few minutes, return, move the mouse, then click.
- Events: the `reader-approved` listener plays the approval beep (two rising tones, 700ms cooldown). The `reader-receipt` listener and `printer()` (12 ticks over .4s plus a 2093 Hz ding) are unused, because the receipt is gone. Don't delete them without checking for new callers.
- Quiet mode: `quiet()` silences the tick, thock and beep while `window.__retracting` is true or inside the `quietUntil` window. Nothing sets `__retracting` now, and `quietUntil` is only set by `printer()`, so quiet mode never triggers. Don't re-add `__retracting` unless a receipt-style sound comes back.

## Content and SEO

- Kaltas and CivicGuard copy mirrors the owner's LinkedIn. Keep role, stack and status in sync. Kaltas is live on the Chrome Web Store ("published", not "submitted"). Don't claim humans review offers beyond what the Kaltas page says. The Ronda repo is deleted (don't link it). CivicGuard has no license.
- Every page has its own `<meta name="description">` and `og:description` (under about 160 chars), `og:url`, a canonical URL on `https://miconavarro.vercel.app` (clean, no `.html`), and matching `og:image` / `twitter:image`. Keep `og:` tags in sync if the title or image changes. A new page goes in `sitemap.xml`; the 404 page doesn't.
- Share image `images/site/og.png` (1200x630, heart and name only) is rendered from `images/site/og.svg`: `rsvg-convert -w 1200 -h 630 -o images/site/og.png images/site/og.svg`. Edit the SVG, not the PNG. It is linked as `og.png?v=2`; bump `?v=` so link previews refresh. Project pages use their own screenshot.
- Favicon: `<link rel="icon" type="image/svg+xml" href="/images/site/favicon.svg?v=2">` on every page (the heart). Bump `?v=` when it changes, because browsers cache favicons hard. No custom domain.
- Overview pages preload their first visible image with `fetchpriority="high"` (see each page's head for the current file). If that image changes, update the preload too.
- `index.html` carries a `Person` JSON-LD block just before `</head>`. Keep its `sameAs` links in sync with the sidebar links.
- `theme-color` matches `--bg` of the active theme (`#E7DEC8` light, `#0B0B0B` dark); `theme.js` and the head script keep it in sync.
- Theme button (`.theme-btn`, also has `.snd` for the shared look): built by `js/theme.js` and moved into the sidebar tools row with the mute button (see "Sidebar tools"). The choice is saved in `localStorage` key `theme-v1`.
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
4. **Home card** (`index.html`, `.projects-grid`): copy the Kaltas `<article class="item reveal">` card, including its `.hover-pad` span, the first `.meta` link ("Open <Project> project") and only the links that apply (download, repository, live site). The new project goes first and takes the next `data-index` (Kaltas is 02, so the next is 03). Set its `.dates` text (e.g. "November to Present 2026"); the stack pills are hidden on the home cards, so copy whatever the Kaltas card has.
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
- The card reader, receipt, scan, swipe, drag and phone chip, the card click icon, cursor, hand, bar and number, and the idle card sheen (all tied to the deleted `slide-open.js`).
- Round icon buttons for the sidebar contact links, and the intro hero with a heart watermark on Home (both added and undone).
- The overview entrance animation, the overview lift, and the zoom and scan line of the flip.
- Content nudge, card centering and fill-the-column experiments. The empty space right of the home cards is deliberate: the overview card is wider (`--main-wide`), so it needs that room when the flip lands.

## Store badges and link icons

- Each project has one badge as its action link, on its home card and on its overview: Kaltas "DOWNLOAD ON / Chrome Web Store" (Chrome icon, `https://ggl.link/kaltas`) and CivicGuard "OPEN ON / the Web" (globe icon). Markup: `<a class="badge" href target="_blank" rel="noopener noreferrer"><svg class="ico line">...</svg><span class="bd-t"><span class="bd-s">small label</span><span class="bd-b">Big name</span></span></a>`. The look is one block at the end of `css/styles.css` (`all: unset` on the anchor, then the pill). Keep `position: relative` on it so it sits above the card's stretched link. Phone label text stays 12px or more.
- The home cards no longer have a repository button. The repository link stays on the overview pages (outline GitHub icon) next to the badge, and Kaltas keeps its privacy link there.
- Link icons are 24px-viewBox outline icons (`class="ico line"`: 2px strokes in `currentColor`, no fill) from Tabler: GitHub, shield (privacy), globe, Chrome. Don't bring back the old filled GitHub mark.
- Store badges have a black background. The Kaltas badge uses a full-color Chrome logo (`class="ico color"`, 48px viewBox, own fills). Other link icons stay outline.

## Page transitions

- `run()` in `js/home.js` starts a view transition for every in-place page change and sets one class on `<html>`: `vt-in` (Home or a section to a project overview), `vt-out` (an overview back to Home) or `vt-swap` (every other move, including an overview to a section and the privacy page). Depth: Home and sections 0, project overview 1, privacy 2. During the transition `main` has `view-transition-name: page`, and `.side` always has `side`.
- Motion lives in the `PAGE TRANSITIONS` block: the 88-degree card flip runs only for `vt-in` and `vt-out`, with no fades, each page is hidden while the other turns so there is no seam, and both pages have equal widths so the flip doesn't shift left.
- `PLAIN SWAP FADE`: `vt-swap` has no animation at all (the old snapshot is hidden and the new page is at full opacity), so sideways moves are an instant swap despite the name. The default crossfade on `side` and `root` is also off.
- Phones (56rem and below): `PHONE SIMPLE FADE` replaces the flip for `vt-in` and `vt-out` with a short fade (.15s out, .2s in).
- Reduced motion, or no `startViewTransition`: instant swap. If the update callback throws, `run()` falls back to a normal page load.
- `show()` ignores a click while a page is still being fetched (`loading`). Cached pages skip that, and `warm()` prefetches them.
- `run()` numbers each transition (`runSeq`), and only the latest one may fall back to a full reload, so clicking quickly through the nav can't reload an older page.
- Intro speed: the `SNAPPY INTRO` block sets `:root:root { --fr-dur: .3s; --fr-step: 25ms; --fr-rise: 6px; --fr-blur: 0px }` at the end of the file (`:root:root` so it beats the earlier `:root` tokens). Tune the feel there, not in the older blocks.

## Sidebar tools

- `js/theme.js` moves the theme and mute buttons into `.side-tools` at the end of the sidebar. On desktop the row sits at the bottom left (`order: 99; margin-top: auto`) as small ghost icons (`QUIET SIDEBAR TOOLS`, `RAISED SIDEBAR` and `SIDEBAR TOOLS (restyled)` blocks).
- On phones and on pages without a sidebar they are absolutely positioned under the nav row at the top right (`PHONE TOOLS BELOW NAV`, 2.2rem buttons, `top` sets the height, so raise it if they touch the nav links). Putting them at the very top covers the "experience" tab.
- Sidebar depth: `RAISED SIDEBAR` and `SOFTER SIDEBAR` give `.side` a faint right-edge shadow and `z-index: 2` on desktop, and `.side .profile-photo` has `margin-top: 3.5rem`. The name (`.side h1`) uses `--ink`. The light-theme carousel counter (`.cs-num`) is a darker brown-gray.
- Nav hover on desktop: `SNAPPY SIDEBAR HOVER` makes the link color follow the mouse in .08s and the line beside it grow in .12s (above 56rem, motion allowed only). The base rules are .3s for the line and .2s for color.
