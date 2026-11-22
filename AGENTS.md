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
| `certificates/index.html` | Certificates page, served as `/certificates`. Entries reuse the Experience `.entry` markup plus a badge and a credential button (see "Certificates page") |
| `kaltas/privacy-policy/index.html` | Kaltas privacy policy, served as `/kaltas/privacy-policy`. Not in the nav |
| `404.html` | Styled by `.nf` rules, absolute paths, `noindex`, loads only `clack.js` |
| `css/styles.css` | All styling. Dark only |
| `js/home.js` | In-place navigation, prefetch, card spotlight/tilt, view transitions |
| `js/slide-open.js` | Swipe-to-open, reader, receipt, chip button, idle sheen |
| `js/clack.js` | Synthesized sound (Web Audio), no audio files. Context is built on load and woken by the first pointerdown, keydown or touchstart (browsers block audio before a gesture, so the first press is the earliest sound can play) |
| `js/carousel.js`, `js/car-slider.js` | Screenshot carousel and its keycap buttons |
| `js/lightbox.js` | Click-to-enlarge lightbox for overview images and videos, plus the `.lb-hint` button |
| `js/been-here.js`, `js/mascot-idle.js` | Mascot, visitor counter, idle moves |
| `js/commits.js` | Commit counts |
| `api/hi.js` | Upstash Redis visitor counter (needs Redis env vars) |
| `api/commits.js` | GitHub commit totals rounded down to 10, cached 1h (needs `GITHUB_TOKEN`, which expires) |
| `fonts/` | Self-hosted Geist, Geist Mono, Big Shoulders Display (`@font-face` at the end of `css/styles.css`) |
| `images/` | Assets grouped by kind: `badges/`, `logos/`, `profile/`, `projects/<slug>/`, `site/` (favicon and share image) |
| `vercel.json`, `sitemap.xml`, `robots.txt` | `cleanUrls`, headers, redirects, SEO |

## Run and check

No build step: `python3 -m http.server 8000`. `api/hi.js` only works on Vercel. Check `/`, `/about`, `/experience`, `/certificates`, `/kaltas`, `/kaltas/privacy-policy`, `/civicguard` and a made-up URL (404) at about 380px width and with reduced motion on. At phone width also check the overview link buttons (download, repository, privacy), the certificate badge and credential button, and the header photo.

## Global rules

- Dark theme only, no toggle.
- Colors: only `var(--...)` from `:root`. Cream `--ink` `#F3E9D2` for headings, `--text` `#E4DAC3` for body, `--muted` for secondary. Never hardcode `#fff` or hex colors.
- No inline `style=`. Use classes.
- Fonts: Geist (`--sans`) for headings, Geist Mono (`--mono`) for body, cards and nav. Sidebar name `.side h1` is Big Shoulders Display 700 uppercase (2.4rem desktop, 2rem under 40rem), self-hosted in `fonts/` and preloaded in every HTML head. Never add a transform, hover effect or bold to it.
- Page headings (`.page-title` on About/Experience/Certificates, the Projects h2): Geist 700, `-.03em`, 3.1rem (2.5rem phones), margin `4rem 0 1rem`. Keep them identical. The first section after has no top border.
- Under 30rem, `.home main` has a 1px `--line` top border (1.25rem above, heading 2rem below). Keep all four tabs equal.
- Shell width: `.home .shell` is 64rem for Projects, Certificates, About and Experience, and 76rem on overview pages. `.side` has `view-transition-name: side` so it glides between widths.
- Nav: Projects, Certificates, About, Experience, in that order (Certificates sits right under Projects). Don't add other items. The nav `<ul>` is duplicated in `index.html`, `about/`, `experience/`, `certificates/`, `kaltas/`, `civicguard/` and `kaltas/privacy-policy/`, so change all of them together (the 404 has none).
- Experience entries are real. Don't remove or rewrite. The FlyRank logo is self-hosted and sits next to the title (`flex-start`, not `space-between`).
- Accessibility: skip link, labelled controls, alt text, `aria-live` on counter, keyboard-usable carousels, `prefers-reduced-motion` support. Don't make content depend on animation or JS.
- `localStorage` only inside try/catch.
- Media queries: combine conditions with `or`/`and` inside parentheses, never a comma (commas only at top level). A bad one silently never applies.
- Before deleting CSS, grep `js/`, `index.html`, `about/`, `experience/`, `certificates/`, `kaltas/` and `civicguard/` for the class or variable.

## Sidebar and mascot

- Desktop (56.01rem up): static full-height panel (`sticky; top:0; height:100dvh; border-radius:0`), no inner scroll, content centered on tall windows, base font 110%. No `margin-top:auto` on the mascot, no fixed pixel height or `overflow:auto`. Under 52rem tall it flows with `height:auto`.
- Phones and tablets: sidebar and top nav are hidden on project pages (`body:has(.project-title) .side`). Under 40rem the header is centered (7.25rem photo, name, location, icons, welcome row). The phone photo size is set only in the `@media (max-width: 40rem)` phone header rule (`.side .profile-photo`). Desktop uses height-based clamps and tablets a 4.25rem inline layout, so don't change those for a phone tweak.
- Location line has a pin and sits under the social links on desktop (CSS `order`). Text is 85% `--ink`. Contact links underline on hover/focus only. Desktop mascot block has a 1px `#333230` top border. Description matches About text (18px, 1.7).
- Mascot: soft-shaded red heart (`#e5484d` base, radial gradient `#heart-g`, no visible outline; `.been .heart` has a faint same-color stroke (`--heart`, 40% opacity) that feathers the edge so it does not look jagged; button is 5rem on desktop, 88px at the 110% base, a whole pixel count so keep it that way, and 3.5rem on phones), one tall dark oval eye in each lobe (closer together they read as a pig nose), no mouth, no arms or shadow, shown on mobile. Eyes follow pointer (rAF-throttled) through `aim()` in `been-here.js`, which also turns the body (`.turn` group: small translate, rotate and squash, eased .35s so it follows the eyes) and shifts the gradient highlight. It is all 2D SVG on purpose: CSS 3D transforms rasterize the mascot and blur its edges. The idle look-around in `mascot-idle.js` calls `window.beenAim`, blink every 4 seconds, one full spin-hop per click (clicks ignored while spinning), red "+1" on first tap only. Idle moves (`mascot-idle.js`, every 5 to 9s: `look`, `.mi-bounce`, `.mi-tilt`) skip when hidden, reduced motion, pointer moved in the last 3s, or another move is playing. Reduced motion: no eyes, blink, spin or idle.
- Credit line (`.been-credit`, "designed and built by mico"): plain static mono text at low opacity. Welcome text uses `--ink`, count 80%.
- Commit counts: sidebar total "(N+ commits)" beside the github.com/miconvr link (hidden at 56rem and below). Per-repo counts live in `<span class="repo-commits" data-repo-commits="slug" hidden>` in each overview's Activity tile. Both hide if the API fails. New project: add its repo to `PROJECTS` in `api/commits.js`.
- Kaltas users pill (Chrome Web Store), never exact, rounded down server-side: under 5 hidden, 5 to 99 by 5, 100 to 999 by 50, 1,000 to 9,999 by 500, 10,000+ by 1,000. Show "N+ users". CivicGuard has none.

## Home project cards

- Layout: `.projects-grid` is one column (`minmax(0, 26rem)`), Kaltas (`data-index="02"`) above CivicGuard (`01`). New project goes first and takes the next number. Credit-card style: `aspect-ratio: 1.586` as a minimum (cards grow, never clip), `overflow: visible`, matte `--card` gradient with faint grain (don't lighten), `--card-edge`, `--shadow`.
- Content: icon, title, left-aligned dates, one tagline (Kaltas: "Chrome extension that finds student deals for the website you're visiting." CivicGuard: "Incident and curfew monitoring website for Barangay Maimpis."), icon links, date line, stripe. No commits pill. No cardholder, card-number or holo-sticker markup.
- Date line (`.meta::before`, above 30rem): "N0VEMBER T0 PRESENT 2026" / "SEPTEMBER T0 PRESENT 2026", set by `data-index`. The zeros are digits on purpose. Under 30rem it is hidden and `.date-text` under the title shows instead. If a date changes, update both.
- Big faint number: `.item::after` from `data-index` (top 3.6rem desktop, bottom-right at 2.2rem under 30rem).
- Links: icon + label, label from `aria-label` via `::after` ("download", "repository", "live site"), 1px `--line` outline, .4rem radius, .72rem text, 1.05rem icon with `margin: 0`, hover brightens and scales 1.06 (off for reduced motion). Hover/focus selectors must repeat border and padding. New project: keep `<svg class="ico">` plus `aria-label` and `title`, no visible text.
- Whole card is clickable via the stretched first `.meta` link (`::before inset:0`). Other links stay `position: relative`. No nested links.
- Stripe (`.meta li:first-child`): flush bottom bar, bottom padding 0. Contains `.l-drag` ("swipe right", desktop) and `.l-tap` ("tap the chip", no arrow, touch or narrow). aria-label is "Open <Project> project". Its `::after` stays hidden, the `::before` chevron hint stays. While dragging, a 2px green line fills the top edge by `--pull`. Real pointer clicks are blocked, so only Enter or the drag opens it.
- Gold chip: desktop is `.item-top::after` (absolute, `right: 1.3rem; bottom: 3.2rem`; `.meta::after` is hidden). Touch or under 40rem it is `.chip-btn` (in the `.item-top` markup of each card so nothing shifts after load; `slide-open.js` only adds it if missing; 2.1rem x 1.6rem, foil gradient). `.chip-btn` sits at `bottom: calc(3.2rem + 11px)` on touch and 30.06 to 39.99rem. On phones `.chip-btn::after` is a 1px gold ring (`chip-ring`, 6s, plays 3 times then stops to save battery) offset by the random `--idle` variable, off for reduced motion and while `.dip`. Never offset with `:nth-child`.
- Hover (fine pointer, no reduced motion): `home.js` sets `--mx --my --rx --ry` (tilt up to 5deg). One `.projects-grid .item:hover` transform rule. Touch gets a `:active` press. Put new effects on a different property than `transform` (`rotate`, `scale`, `translate`).
- Hover-out: the bare `.item` has a slow transition (.6s transform and shadow, soft ease-out), while `:hover`/`:active` use the quick .25s one, so the card drifts back instead of snapping. Keep `:not(.spring):not(.pulling):not(.dip)` on that quick rule so it never overrides the drag, spring-back and chip-tap transitions.
- Card intro v2 (end of `css/styles.css`): under `.js` the card shell fades in by opacity (`.item.reveal:not(.in)` is hidden), then `.item-head` (opacity only), the tagline and `.meta` follow at .1s, .18s and .26s; each later card adds `--ro` (.12s steps). Hover-out under `.js` needs its own slow-transition rule, because `.js .item.reveal { transition: none }` beats the bare `.projects-grid .item` one. Never put `transform`, `filter` or `will-change` on `.item-head` or anything between `.item` and the chip: it becomes the containing block for the absolute chip, and the chip jumps when the intro ends. Use opacity, `translate` or `scale` instead.
- Cold-start intro, focus rise (end of `css/styles.css`, tokens `--fr-dur`, `--fr-ease`, `--fr-step`, `--fr-rise`, `--fr-blur` on `:root`): on the first load in a tab (`.js` from the head script) the `.side` children, the page heading (`.home-intro h2` or `.page-title`), the page body and the mascot fade in, rise and sharpen with one keyframe (`focus-rise`) and a per-element `--i` step. Home cards and overview/policy cards keep their own intros and are excluded. Blur only goes on elements with no absolutely positioned children (`nav` and `.side-links` set `--fr-blur: 0px`). The mascot wrapper uses the same tokens as a transition, held by `been-wait` until the first `/api/hi` response or 800ms (`been-here.js`). For new page types, set `--i` in that block instead of adding a new animation. `index.html` preloads the profile photo; if its path or `?v=` changes, update the preload too. Focus rise details: the sidebar order is photo (`--i: 0`), name, location, nav, links (`--i` 1 to 4). Body children on About and Experience stagger with `:nth-child` (`--i` 2 to 7, later children stay at 7), which is fine here because the "never `:nth-child`" rule applies to the overview intro only. Pages with no `.page-title` and no `.overview` (the 404) fade as one block (`--i: 1`, no blur). If blur stutters on phones, lower `--fr-blur` on `:root` (3px or 0px). Phones and touch already set it to 0px in the last block of `css/styles.css`.
- Each home card has `<span class="hover-pad" aria-hidden="true">` as its first child. It extends the hit area 10px below the card, active only while hovered, so the lift and tilt do not push the bottom edge out from under the pointer (flicker loop). New project cards need it too.
- Idle sheen: `slide-open.js` adds `.sheen` to every card with a random `--idle` delay (`card-sheen`, 9s).
- Phone cards (30rem and below): number, tagline and chip rules differ. Check both cards at 380px after any card change.
- Phone text floor 2 (`/* phone text floor 2 */`, also at the end of `css/styles.css`) covers the card holder name and the card and overview link pills.
- The looping card sheen (`card-sheen`) is off on touch and under 40rem (last block of `css/styles.css`).
- Phone text floor: the last block of `css/styles.css` (`/* phone text floor */`) keeps visible phone text at 12px or more (facts labels, carousel counter, mascot text, card dates and links). Desktop-only reader and receipt text is exempt.
- Tap targets: on touch or under 40rem, `.chip-btn::before` and `.overview .back-top::before` (last block of `css/styles.css`, `/* tap targets */`) are invisible pseudo-elements that grow the hit area to about 44px. The visual size and chip position do not change. Never give these two elements another `::before`.

## Projects intro (`.projects-intro`, under the heading)

- Muted mono text, max 34rem. Two spans in `.pi-lead`: `.pi-swipe` ("Swipe a card right (→) to see the project's overview.") on desktop, with one `.pi-arrow` animated by `pi-swipe-nudge`, and `.pi-tap` ("Tap the chip (mini chip) on a card to see the project's overview.") under `(max-width: 39.99rem), (pointer: coarse)`.
- `.pi-chip` copies the real chip look in `em`, so update both together. The `.pi-arrows` chevrons are hidden with `!important` and are dead CSS (the `pi-wave` animation was removed).

## Swipe to open

- Desktop (40rem+, fine pointer): the whole card drags except links and buttons. `--pull` goes 0 to 1 over 150px, the card moves about 1.8rem via `translate` (the drag never sets `transform`), and `.reader` (7rem terminal, created by `slide-open.js`) slides out beside it. The card goes under it by about 1.1rem, which must stay under the 1.4rem right padding. At 85% the reader goes green (`.ready`) and the project opens after about 260ms, or 1100ms when a receipt prints.
- Touch or narrow: no reader. Tapping `.chip-btn` dips the card (`.dip`) and opens the project.
- Events: `reader-approved` (fires each time a drag crosses 85% upward, or on a chip tap; `clack.js` rate-limits the beep to one per 700ms) plays the beep in `clack.js`. `reader-receipt` plays `printer()` (12 ticks over .8s plus a 2093 Hz ding). `slide-open.js` never touches audio. If the feed duration or step count changes, update `printer()`.
- Receipt (`printReceipt`, desktop drag only): cream `#f3f0e6` sheet feeds out of the reader's right edge (`r-feed-x`, .8s, 12 steps), with the heart (`.r-heart`, an inline SVG data URI), APPROVED, dashed line, project name, THANK YOU and a small `.r-tear`. Skipped for reduced motion and chip taps.
- Retract (leaving an overview): `retractReceipt(from)` in `slide-open.js`, called from `run()` in `home.js`, rebuilds the reader on the originating card and animates `.r-sheet` back with the Web Animations API (cancels the CSS animation). Print sound is muted. Desktop only, skipped under reduced motion.
- The retract reader carries `.thanks`. The stripe label turns green only for a real drag (`.item:has(.reader.ready:not(.thanks))`), and the approve flash rules also exclude `.thanks`. Don't drop that `:not(.thanks)`, or the "swipe right" label stays green for the whole ~2.25s exit.
- A new drag right after a retract (inside the 650ms `hideReader` window) would reuse the retract's reader and its paper, so `printReceipt` returned false and no receipt printed. `showReader` now removes a reader that has `.thanks` or an `.r-paper` and builds a fresh one, and clears `.retract-hold`. Keep that check if `showReader` changes.
- Enter on the stripe link opens directly.
- `release()` adds `.spring` for 650ms so the card and reader bounce back. Starting a new drag removes `.spring` first. Without that, grabbing the card again mid-bounce leaves the reader on its slow spring transition and it lags behind the card.

## Overview pages

- `<main id="main"><article class="overview">`, styled as one big card (44rem max, `--card`, 1rem radius). The carousel is the hero (40rem), the lede is .95rem mono with a 36rem line length, and outcomes are a spaced list with custom dots.
- Markup per project: `.project-title` holds the back/X (`.back-top`, round, icon only), icon and `<h1>`. `.ov-num` and `.ov-status` are in `.project-title` but hidden. `.ov-chip` is hidden. Keep them in the article or the CSS won't match. Stack `dd` is `class="pills"` (one `<span>` per item). `.facts` (Role, Status, Activity) is a 3-column grid (1.5fr 1fr 1fr), Role full-row under 40rem, one column under 26rem. Stack is full width.
- Links row (`.overview .meta`): left-aligned, no band, muted palette (text 55% `--ink`, outline 22%, hover full `--ink` and 50%), .85rem text, no arrows, no green. Selectors use `.overview .meta li a` and reset `::before`/`::after` to `content: none`. Block "Overview links v27" (end of `css/styles.css`, shared by every project overview) makes the buttons even: desktop is a left-aligned flex row, and at `max-width: 40rem` it is a 2-column grid of equal-width buttons where an odd last button (privacy) spans the full row. It overrides the older v19 to v26 `.meta` blocks, so change the buttons there, not in those. CivicGuard uses the same `.meta` list markup, so check both overviews after any change.
- Entrance (reduced-motion off only): `ov-print` clip-path reveal top to bottom with a scan line (`.overview::before`, `ov-scan`, .85s), then `ov-in` stagger from .3s by class (never `:nth-child`). Cursor spotlight via `.overview::after` and `--mx/--my`. No tilt on overviews.
- Exit (leaving a project page): `run()` adds `html.vt-exit`, and the old page rolls up from the bottom (`clip-path: inset(0 0 100% 0)`, .6s, no fade) above the new page, which has `animation: none`. Opening a card uses a short fade (`vt-out`/`vt-fade`). Reduced motion and unsupported browsers get an instant swap.
- Screenshot keys (`.car-slider > .cs-key`, built by `car-slider.js`): dark keycaps with a 7-step sidewall, dished face and engraved arrow, both keys the same muted legend. Active drops 5px (off for reduced motion), and `.car-slider` has 12px bottom padding for that travel. The old `.car-btn` and `.car-count` stay in the markup, hidden, because the keys click them. Their styles were removed (only `display: none` remains), so don't add new `.car-btn` rules.
- Kaltas carousel video: the first slide is `<video class="contain">` (`images/projects/kaltas/kaltas-demo.mp4`, H.264, silent, cropped to 1080x1250 to hide baked-in dots, `+faststart`, poster `kaltas-demo-poster.jpg`). Markup is `muted loop playsinline preload="auto"`, with no `autoplay` attribute. `carousel.js` plays it when 60% is visible, pauses it otherwise, and re-scans after `home.js` swaps the page. Under reduced motion it shows controls and never autoplays. `.slide video.contain` fits the portrait video inside the 16:10 frame (dark bars, not cropped). The `.car-count` text in the markup must match the slide count (now `1 / 4`). A new video follows the same pattern and needs a real `aria-label`. The poster must be the exact first frame of the video (`ffmpeg -i video.mp4 -frames:v 1 -update 1 -q:v 3 poster.jpg`, no `-ss`), or the browser flashes a different image before playback starts. The video is the full demo (about 30s), re-encoded with `crop=1080:1250:0:0 -c:v libx264 -crf 20 -an -movflags +faststart`. Its captions are baked into the frames, so do not trim it to hide a scene, and re-crop from the original file, not the repo copy.
- Phone (30rem and below): 1rem padding, 2rem title. First screenshot eager, the rest `loading="lazy"`.
- New project needs: `.ov-num`, `.back-top`, `.ov-status`, `.ov-chip`, `.pills`, `repo-commits` span, a home card (with a `.hover-pad` span and a `.chip-btn` in its `.item-top`), a prefetch entry in `home.js`, a `sitemap.xml` entry, `data-index`, and the `lightbox.js` script tag on its page.

## Lightbox (enlarge images and videos)

- `js/lightbox.js` (IIFE, `defer`) plus a block at the end of `css/styles.css`. Clicking an image or video in `.overview .slide` opens it in a fixed `.lb` dialog with prev/next through that carousel, Esc, backdrop click or X to close. Enter on a focused `.slides` opens the current slide. A pointer move of more than 6px between press and release doesn't count as a click, so swiping the carousel never opens it.
- Videos open at the same playback time, with controls and sound. The source video pauses while the lightbox is open and resumes on close (not under reduced motion). On close the carousel scrolls to the slide you were on and `.slides` gets focus. The back button (`popstate`) closes it. Page scroll is locked with `overflow: hidden` on `<html>` while open.
- Enlarge button: `.lb-hint` is a real `<button>` injected into every `.overview .frame.carousel` by `lightbox.js` (a MutationObserver re-adds it after `home.js` swaps pages), not markup in the HTML files. It has to stay a real element, because a pseudo-element can't hover separately from the image. Resting opacity .55, brightens only on its own hover or focus.
- Script tag: `<script src="/js/lightbox.js" defer></script>` is in `index.html` and both project pages. The home page needs it because `home.js` swaps overviews in without running page scripts (it only loads `carousel.js` itself, on demand).
- Phones (max-width 40rem): 2rem buttons, prev/next move below the image beside the `n / total` counter. Images show at their file size (up to 1280px), with no zoom beyond that. No swipe between slides yet.

## Certificates page

- `certificates/index.html`, served as `/certificates`, nav item right under Projects. Same shell as Experience: `<article>` with `<h1 class="page-title">Certificates</h1>`, then one `.entry` per certificate. It reuses the Experience `.entry` and `.when` styles. The page-specific CSS is at the end of `css/styles.css`: `.cert-badge` (with `h2:has(> .cert-badge)` and the tightened bottom padding of an entry that has a badge) and `.cert-link` (the credential button).
- List only certificates that are earned and real, newest first. Keep the page's `<meta name="description">` and `og:description` accurate when certificates are added or removed.
- Entry markup (copy the last block, new certificates go on top):

```html
<div class="entry">
  <h2>Google IT Support Professional Certificate<img class="cert-badge" src="/images/badges/itsupport-badge.webp" width="76" height="68" alt="Google IT Support Certificate badge"></h2>
  <p class="when">Google &middot; Coursera &middot; Issued Mon YYYY</p>
  <p class="cert-link"><a href="https://..." target="_blank" rel="noopener noreferrer"><svg class="ico" viewBox="0 0 16 16" aria-hidden="true">...</svg>view credential</a></p>
</div>
```

- `h2` is the certificate name, one per entry. `.when` is "Issuer &middot; platform &middot; Issued Mon YYYY" (use the `&middot;` entity; drop the "Issued" part only if the date is unknown). No description paragraph.
- Badge (optional): self-hosted in `images/badges/` as `<short-name>-badge.webp` (lowercase, hyphens, like `itsupport-badge.webp`), with the transparent padding cropped off (Pillow, `getchannel("A").getbbox()`). Never hotlink a logo. It sits inside the `h2` right after the title text as `<img class="cert-badge">`. It is 4.25rem tall with -1.2rem vertical margins so it doesn't stretch the title row; under 40rem it stays on the right at 3.5rem tall with no negative margin, and the title gets a 1.25 line height so a two-line title and the badge are about the same height. Save it as WebP at 2x its display size (152 x 136 for the 76 x 68 badge) and keep the `width` and `height` attributes equal to the CSS size in px. It is not an `.org-logo`, because those rules size small wordmarks.
- Credential button: `p.cert-link > a`, an outlined button with an inline external-link icon and the text "view credential" (new tab, `rel="noopener noreferrer"`). Its look is copied from the v18/v20 overview link rules (`.overview .meta li a`): muted text, `var(--line)` border, .5rem radius, scale-up hover, no transform under reduced motion. It is a standalone copy, not tied to the "Overview links v27" grid, so if the overview buttons are restyled, update `.cert-link` by hand. Leave the paragraph out when there is no public credential link.
- Spacing: the first entry must sit the same distance under `.page-title` as on Experience, so don't override `.entry` margin-top or padding-top for certificates.
- Wired in `js/home.js` (the `warm()` prefetch list and the `inPage` regex), `sitemap.xml` and the sidebar nav on every page. The active nav item matches by `href`.
- Check at about 380px: the badge sits to the right of the title, vertically centered, the button fits, and the gap under the page title matches `/experience`.

## Navigation

- Links in `#main` to `/`, `/about`, `/experience`, `/certificates`, `/kaltas`, `/civicguard` swap in place via `home.js`. Modifier clicks, `target="_blank"`, downloads, hashes and queries fall through. `norm()` treats `/projects/x.html` and `/projects/x` the same. Project pages must keep `<main id="main"><article>`.
- Page-specific scripts and `<head>` styles don't run on a swap, so keep behavior in shared files. New pages need the same script tags and font preload `<link>`s. `warm()` in `home.js` skips the idle prefetch of the other pages on Save-Data and 2g connections.

## Sound (`js/clack.js`)

- Loaded with `defer` on every page, after `slide-open.js`. Thock on press only (no release sound), dry hover tick (mouse only) on links, buttons and whole cards. The card counts as one target, but `.meta li+li a` ticks separately (checked first). One voice at a time, 130ms cooldown. Adjust loudness with `master.gain.value` only.
- Always on, no mute button. The AudioContext unlocks on `pointerup`, `keydown`, `touchend` and `click`, so the very first press is silent. `init` resumes the context from any state except `running` and `closed`, because Safari and iOS use `interrupted` after a tab switch, not just `suspended`. A browser can still keep the first press after returning to a tab silent, and that can't be avoided. `wake()` also runs on `visibilitychange`, window `focus` and `pointerover`, plays a silent one-sample buffer after each resume, and a `pointerdown` that arrives while the context is not running waits for `wake()` and then plays `down()`. Keep the `wake` calls if `init` changes. To test: play a sound, switch tabs for a few minutes, return, move the mouse, then click. Safari and iOS may still need one real tap.
- Quiet mode: `quiet()` in `clack.js` silences the hover tick, press thock and approval beep while `window.__retracting` is true (set by `retractReceipt`, up to 3s) and for 1.2s after `printer()` starts, so only the receipt sound plays. If the print duration changes, update that 1.2s along with `printer()`. `approve()` has a 700ms cooldown so wiggling around 85% can't stack beeps.

## Content and SEO

- Kaltas and CivicGuard copy mirrors the owner's LinkedIn. Keep role, stack and status in sync. Kaltas is live on the Chrome Web Store ("published", not "submitted"). Don't claim humans review offers beyond what the Kaltas page says. The Ronda repo is deleted (don't link it). CivicGuard has no license.
- Every page has its own `<meta name="description">` and `og:description` (under about 160 chars), `og:url`, a canonical URL on `https://miconavarro.vercel.app` (clean, no `.html`), and matching `og:image`/`twitter:image`. Keep `og:` tags in sync if the title or image changes. A new page goes in `sitemap.xml`. The 404 page doesn't.
- Share image `images/site/og.png` (1200x630) is rendered from `images/site/og.svg` (`rsvg-convert -w 1200 -h 630 -o images/site/og.png images/site/og.svg`). Edit the SVG, not the PNG. Project pages use their own screenshot.
- Overview pages preload their first visible image with `fetchpriority="high"` (`kaltas-demo-poster.jpg` for Kaltas, `civicguard.webp` for CivicGuard). If that image changes, update the preload too.
- `index.html` carries a `Person` JSON-LD block just before `</head>`. Keep its `sameAs` links in sync with the sidebar links.
- Favicon: `<link rel="icon" type="image/svg+xml" href="/images/site/favicon.svg?v=2">` on every page (the heart; bump `?v=` when it changes, browsers cache favicons hard). The share image is `images/site/og.svg` (heart and name only) rendered to `og.png` at 1200x630 with `rsvg-convert`, linked as `og.png?v=2` (bump it too so link previews refresh). No custom domain.
- Every page head (404 included) has `<meta name="theme-color" content="#0B0B0B">` and `<meta name="color-scheme" content="dark">` right after the viewport tag. The color matches `--bg`, so the phone browser bar and overscroll area stay dark.
- `vercel.json` sends security headers on every route (nosniff, referrer policy, same-origin framing, locked-down permissions) and caches `/images/*` for a week (stale for a day while revalidating), so bump `?v=` or rename the file when an image changes. There is no CSP yet because every page has an inline head script.
- Kaltas privacy policy (`/kaltas/privacy-policy`): the same card as the overview pages (`<article class="overview policy">`; the back arrow is a `.back-top` to `/kaltas`; no carousel, facts or status chip). The `.policy` rules in `css/styles.css` (search "Privacy policy") set the numbered headings and reading width. Body text inherits the overview's font (Geist), headings use the overview's mono label style, and the headings keep `animation: none` so they print with the card instead of after the text. It is the policy URL in the Chrome Web Store dashboard and the Kaltas popup footer, so never rename or remove it. Keep the text in sync with what the extension actually does (permissions, the `offers.json` fetch from GitHub), and update "Last updated" when it changes. Linked from the Kaltas overview links row, not from the nav. A CivicGuard policy would go at `/civicguard/privacy-policy`. Layout: `.policy` rules at the end of `css/styles.css` (40rem column, numbered `h2`s, `.policy-meta` for the date, `.policy-lede` for the summary). New sections are a plain `h2` followed by `p` or `ul`; keep paragraphs short.
- Cold-start intro on every page: each HTML page must carry the head script from `index.html` line 19 (sets `.js`, first visit in a tab only). Cold-start motion is described under "Cold-start intro, focus rise". New pages need the same script or none of it plays.

## Adding a page

For a top-level page in the sidebar nav (Projects, Certificates, About, Experience). Use `certificates/` or `experience/` as the template. Find every place a page is wired in with `grep -rIn -i certificates . --exclude-dir=.git`.

1. **Page**: copy `experience/index.html` to `<slug>/index.html` (served as `/<slug>`, `cleanUrls` is on). Replace the `<article>` content and keep `<main id="main"><article>`, the `.page-title` h1, the head script from `index.html` line 19, the font preloads and the theme-color and color-scheme tags.
2. **Head**: unique `<meta name="description">`, `og:description`, `og:url` and canonical URL. The `<title>` is `Mico Gerard Navarro`.
3. **Nav**: add an `<li>` to the nav `<ul>` in every page that has one (the list is under "Global rules"), in the agreed order, and put `aria-current="true"` on the new page's own item. Update the order in the Nav rule and the "Keep all N tabs equal" line.
4. **`js/home.js`**: add the route to the `warm()` prefetch list and to the `inPage` regex. The active item matches by `href`, so `setActive` needs no change.
5. **`sitemap.xml`**: add a `<url><loc>https://miconavarro.vercel.app/<slug></loc></url>` entry.
6. **This file**: update the Layout table, "Run and check", "Navigation", the `.page-title` list and the shell-width line. Add a section if the page has its own markup or CSS.
7. **Verify**: serve with `python3 -m http.server 8000`. Open the page from home, About and a project page without a reload, confirm the sidebar highlight on each, and check the top bar at about 380px with the new item count.

## Adding a project

Use the newest project (`kaltas/`) as the template. Find every place it is wired in with `grep -rIn -i kaltas . --exclude-dir=.git --exclude-dir=node_modules`. A new project must be added in all of these places, or it breaks in place navigation, the commit count or the sitemap.

1. **Overview page**: copy `kaltas/index.html` to `<slug>/index.html` (served as `/<slug>`, `cleanUrls` is on). Rewrite the content, keep the markup and class names (see "Overview pages"). Keep the head script from `index.html` line 19 that sets `.js`, or no intro animation plays on a cold open. Set a unique `<meta name="description">`, `og:description`, `og:url` and canonical URL.
2. **Titles**: `<title>` is `Mico Gerard Navarro: <Name>`. Set `og:title` to the same text. Home, About, Experience and Certificates use just `Mico Gerard Navarro`. The 404 page keeps `Page not found: Mico Gerard Navarro`. `home.js` reads the title from each page, so it needs no title change.
3. **Images** (`images/projects/<slug>/`): `<slug>-icon.webp` (120x120, shown at 60x60), plus screenshots or video named `<slug>-1.webp`, `<slug>-2.webp` and so on. Images are WebP (quality 82, the portrait 80). Keep the original PNG only where it is the `og:image`, because share crawlers handle PNG best. First screenshot eager, the rest `loading="lazy"`. Bump `?v=` on an image URL when you replace the file.
4. **Home card** (`index.html`, `.projects-grid`): copy the Kaltas `<li>` card and its links row (open chip and `swipe right` / `tap the chip` link, then keep only the links that apply: download, repository, live site). The new project goes first and takes the next `data-index` (Kaltas is 02, so the next one is 03). Check how the date line (`.meta::before`) is set per `data-index` in `css/styles.css` and add the new date the same way. Keep the digit-zero spelling the dates use (see "Home project cards").
5. **`js/home.js`**: add the slug in all four places, found with `grep -n kaltas js/home.js`:
   - the active-nav regex (`aria-current`)
   - the prefetch list of routes
   - the `leaving` regex
   - the `inPage` regex
   If one is missed, the page works on a hard load but breaks or flashes on in place navigation.
6. **`api/commits.js`**: add `<slug>: "<repo>"` to the `PROJECTS` map. The overview's commit count (`data-repo-commits`) needs it.
7. **`sitemap.xml`**: add a `<url><loc>https://miconavarro.vercel.app/<slug></loc></url>` entry.
8. **Copy that lists projects**: update the home `<meta name="description">` and `og:description` in `index.html`, the route lists in this file (Run and check, Navigation) and the card order note under "Home project cards".
9. **Verify**: serve with `python3 -m http.server 8000` and check `/`, `/<slug>`, About and Experience at about 380px and with reduced motion. Then click from home into the project and back without reloading and confirm the tab title, the sidebar highlight and no flash. Open `/<slug>` in a fresh incognito window and confirm the sidebar, overview and mascot intro plays.

Pitfalls:
- Kaltas has extras a new project should not inherit: the privacy policy page (`kaltas/privacy-policy`, its route in `home.js` and its sitemap entry), the Chrome Web Store users pill, the demo video and poster, and the store-related copy. Copy them only if the new project truly needs them.
- Never give `.overview` an animation from a `main > article` rule. The overview has its own intro (`ov-print`, `ov-scan`, staggered `ov-in`), and a broader selector overrides it. The generic content fade is `.js main > article:not(.overview)`.
- Every HTML page needs the head script from `index.html` line 19. Cold-open motion is the shared focus rise (see the Cold-start intro note).
- Fonts are self-hosted in `fonts/` (Geist, Geist Mono, Big Shoulders Display 700, Latin only) with `@font-face` at the end of `css/styles.css`. Every page head carries the same three `rel="preload" as="font"` links in place of Google Fonts, so copy them into new pages and never re-add Google Fonts. `/fonts/*` is cached for a year as immutable in `vercel.json`, so if a font file changes, give it a new file name. The sidebar name uses the last `--condensed` definition (Big Shoulders Display).
- The mascot wrapper is created by `js/been-here.js`. Don't add mascot markup to pages.
- Don't reuse the `.js` card reveal rules for new page types without reading the `.js` rules near the top of `css/styles.css`.

## Conventions

- Small IIFEs, two-space indent, double quotes in newer files. Only three `window` globals exist: `initCarousel` (carousel.js), `retractReceipt` and `__retracting` (slide-open.js, read by clack.js). Don't add more.
- Commit subjects follow the rules in "Commit messages" at the end of this file.
- One request is one scope. Don't rewrite unrelated sections. Never commit secrets.

## Working with the owner

AI chat pushes have been blocked before, so the owner often pastes terminal commands. When you can't push, deliver commands or a patch and say how to verify. When you can push, edit directly. One small commit per change, pushed on its own, so each can be reverted separately. Patches are Python scripts that assert each anchor matches exactly once, so a failed match writes nothing. After pushing, run `git status --short` and confirm it is empty.

## Commit messages

Every commit subject is `type: short summary`, all lowercase (brand names and acronyms too), under 80 characters, in the imperative ("add", "fix", not "added"). Types: `feat` new behavior, `fix` bug fix, `style` visual or css change, `docs` agents.md or readme, `refactor` no behavior change, `perf` speed, `chore` tooling or cleanup, `copy` wording, `content` data or text on the site, `test`, `build`, `ci`. One change per commit. Do not use `git add -A`; add specific files. Do not bypass the `.githooks/commit-msg` hook with `--no-verify`. History was normalized to this format once, so commit hashes from before that rewrite no longer exist.
