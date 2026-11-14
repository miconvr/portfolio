# AGENTS.md

Guidance for any AI coding agent working in this repo. Humans can read it too.

Personal portfolio of Mico Gerard Navarro (BSIT student, Pampanga). Live: https://miconavarro.vercel.app. Repo: `miconvr/portfolio`.

## Stack

Plain HTML, CSS and vanilla JS. No framework, bundler or `package.json`. Hosted on Vercel, with two serverless functions in `api/`. Fonts from Google Fonts. Keep it dependency-free.

## Layout

| Path | Purpose |
|---|---|
| `index.html` | Home with the two project cards in `.projects-grid` |
| `projects/kaltas.html`, `projects/civicguard.html` | Project overview pages |
| `about/index.html`, `experience/index.html` | Served as `/about`, `/experience` (`cleanUrls` on) |
| `404.html` | Styled by `.nf` rules, absolute paths, `noindex`, loads only `clack.js` |
| `css/styles.css` | All styling. Dark only |
| `js/home.js` | In-place navigation, prefetch, card spotlight/tilt, view transitions |
| `js/slide-open.js` | Swipe-to-open, reader, receipt, chip button, idle sheen |
| `js/clack.js` | Synthesized sound (Web Audio), no audio files |
| `js/carousel.js`, `js/car-slider.js` | Screenshot carousel and its keycap buttons |
| `js/been-here.js`, `js/mascot-idle.js` | Mascot, visitor counter, idle moves |
| `js/commits.js`, `js/rail.js` | Commit counts, scroll rail |
| `api/hi.js` | Upstash Redis visitor counter (needs Redis env vars) |
| `api/commits.js` | GitHub commit totals rounded down to 10, cached 1h (needs `GITHUB_TOKEN`, which expires) |
| `images/`, `vercel.json`, `sitemap.xml`, `robots.txt` | Assets, `cleanUrls`, redirects, SEO |

## Run and check

No build step: `python3 -m http.server 8000`. `api/hi.js` only works on Vercel. Check `/`, `/about`, `/experience`, `/projects/kaltas`, `/projects/civicguard` at about 380px width and with reduced motion on.

## Global rules

- Dark theme only, no toggle.
- Colors: only `var(--...)` from `:root`. Cream `--ink` `#F3E9D2` for headings, `--text` `#E4DAC3` for body, `--muted` for secondary. Never hardcode `#fff` or hex colors.
- No inline `style=`. Use classes.
- Fonts: Geist (`--sans`) for headings, Geist Mono (`--mono`) for body, cards and nav. Sidebar name `.side h1` is Big Shoulders Display 700 uppercase (2.4rem desktop, 2rem under 40rem), loaded by a Google Fonts `<link>` in every HTML head. Never add a transform, hover effect or bold to it.
- Page headings (`.page-title` on About/Experience, the Projects h2): Geist 700, `-.03em`, 3.1rem (2.5rem phones), margin `4rem 0 1rem`. Keep them identical. The first section after has no top border.
- Under 30rem, `.home main` has a 1px `--line` top border (1.25rem above, heading 2rem below). Keep all three tabs equal.
- Shell width: `.home .shell` is 64rem for Projects, About and Experience, and 76rem on overview pages. `.side` has `view-transition-name: side` so it glides between widths.
- Nav: Projects, About, Experience only. Don't add items.
- Experience entries are real. Don't remove or rewrite. The FlyRank logo is self-hosted and sits next to the title (`flex-start`, not `space-between`).
- Accessibility: skip link, labelled controls, alt text, `aria-live` on counter, keyboard-usable carousels, `prefers-reduced-motion` support. Don't make content depend on animation or JS.
- `localStorage` only inside try/catch.
- Media queries: combine conditions with `or`/`and` inside parentheses, never a comma (commas only at top level). A bad one silently never applies.
- Before deleting CSS, grep `js/`, `index.html`, `about/`, `experience/` and `projects/` for the class or variable.

## Sidebar and mascot

- Desktop (56.01rem up): static full-height panel (`sticky; top:0; height:100dvh; border-radius:0`), no inner scroll, content centered on tall windows, base font 110%. No `margin-top:auto` on the mascot, no fixed pixel height or `overflow:auto`. Under 52rem tall it flows with `height:auto`.
- Phones and tablets: sidebar and top nav are hidden on project pages (`body:has(.project-title) .side`). Under 40rem the header is centered (8.5rem photo, name, location, icons, welcome row).
- Location line has a pin and sits under the social links on desktop (CSS `order`). Text is 85% `--ink`. Contact links underline on hover/focus only. Desktop mascot block has a 1px `#333230` top border. Description matches About text (18px, 1.7).
- Mascot: flat yellow smiley (`#f7bd2e`), smile is a warped "mico" path (leave it alone), no arms or shadow, shown on mobile. Eyes follow pointer (rAF-throttled), blink every second, one full spin-hop per click (clicks ignored while spinning), yellow "+1" on first tap only. Idle moves (`mascot-idle.js`, every 5 to 9s: `look`, `.mi-bounce`, `.mi-tilt`) skip when hidden, reduced motion, pointer moved in the last 3s, or another move is playing. Reduced motion: no eyes, blink, spin or idle.
- Credit lines (`.been-credit`, "designed and built by mico", "inspired by drew house"): plain static mono text at low opacity. Welcome text uses `--ink`, count 80%.
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
- Gold chip: desktop is `.meta::after` at `bottom: calc(3.2rem + 12px)`. Touch or under 40rem it is `.chip-btn` (injected by `slide-open.js`, 2.1rem x 1.6rem, foil gradient). `.chip-btn` sits at `bottom: calc(3.2rem + 11px)` on touch and 30.06 to 39.99rem. On phones `.chip-btn::after` is a 1px gold ring (`chip-ring`, 6s) offset by the random `--idle` variable, off for reduced motion and while `.dip`. Never offset with `:nth-child`.
- Hover (fine pointer, no reduced motion): `home.js` sets `--mx --my --rx --ry` (tilt up to 5deg). One `.projects-grid .item:hover` transform rule. Touch gets a `:active` press. Put new effects on a different property than `transform` (`rotate`, `scale`, `translate`).
- Idle sheen: `slide-open.js` adds `.sheen` to every card with a random `--idle` delay (`card-sheen`, 9s).
- Phone cards (30rem and below): number, tagline and chip rules differ. Check both cards at 380px after any card change.

## Projects intro (`.projects-intro`, under the heading)

- Muted mono text, max 34rem. Two spans in `.pi-lead`: `.pi-swipe` ("Swipe a card right (→) to see the project's overview.") on desktop, with one `.pi-arrow` animated by `pi-swipe-nudge`, and `.pi-tap` ("Tap the chip (mini chip) on a card to see the project's overview.") under `(max-width: 39.99rem), (pointer: coarse)`.
- `.pi-chip` copies the real chip look in `em`, so update both together. The `.pi-arrows` chevrons and `pi-wave` are hidden with `!important` and are dead CSS.

## Swipe to open

- Desktop (40rem+, fine pointer): the whole card drags except links and buttons. `--pull` goes 0 to 1 over 150px, the card moves about 1.8rem via `translate` (the drag never sets `transform`), and `.reader` (7rem terminal, created by `slide-open.js`) slides out beside it. The card goes under it by about 1.1rem, which must stay under the 1.4rem right padding. At 85% the reader goes green (`.ready`) and the project opens after about 260ms, or 1100ms when a receipt prints.
- Touch or narrow: no reader. Tapping `.chip-btn` dips the card (`.dip`) and opens the project.
- Events: `reader-approved` (drag crosses 85% once, or chip tap) plays the beep in `clack.js`. `reader-receipt` plays `printer()` (12 ticks over .8s plus a 2093 Hz ding). `slide-open.js` never touches audio. If the feed duration or step count changes, update `printer()`.
- Receipt (`printReceipt`, desktop drag only): cream `#f3f0e6` sheet feeds out of the reader's right edge (`r-feed-x`, .8s, 12 steps), with smiley, APPROVED, dashed line, project name, THANK YOU and a small `.r-tear`. Skipped for reduced motion and chip taps.
- Retract (leaving an overview): `retractReceipt(from)` in `slide-open.js`, called from `run()` in `home.js`, rebuilds the reader on the originating card and animates `.r-sheet` back with the Web Animations API (cancels the CSS animation). Print sound is muted. Desktop only, skipped under reduced motion.
- Enter on the stripe link opens directly.

## Overview pages

- `<main id="main"><article class="overview">`, styled as one big card (44rem max, `--card`, 1rem radius). The carousel is the hero (40rem), the lede is .95rem mono with a 36rem line length, and outcomes are a spaced list with custom dots.
- Markup per project: `.project-title` holds the back/X (`.back-top`, round, icon only), icon and `<h1>`. `.ov-num` and `.ov-status` are in `.project-title` but hidden. `.ov-chip` is hidden. Keep them in the article or the CSS won't match. Stack `dd` is `class="pills"` (one `<span>` per item). `.facts` (Role, Status, Activity) is a 3-column grid (1.5fr 1fr 1fr), Role full-row under 40rem, one column under 26rem. Stack is full width.
- Links row (`.overview .meta`): left-aligned, no band, muted palette (text 55% `--ink`, outline 22%, hover full `--ink` and 50%), .85rem text, no arrows, no green. Selectors use `.overview .meta li a` and reset `::before`/`::after` to `content: none`.
- Entrance (reduced-motion off only): `ov-print` clip-path reveal top to bottom with a scan line (`.overview::before`, `ov-scan`, .85s), then `ov-in` stagger from .3s by class (never `:nth-child`). Cursor spotlight via `.overview::after` and `--mx/--my`. No tilt on overviews.
- Exit (leaving `/projects/...`): `run()` adds `html.vt-exit`, and the old page rolls up from the bottom (`clip-path: inset(0 0 100% 0)`, .6s, no fade) above the new page, which has `animation: none`. Opening a card uses a short fade (`vt-out`/`vt-fade`). Reduced motion and unsupported browsers get an instant swap.
- Screenshot keys (`.car-slider > .cs-key`, built by `car-slider.js`): dark keycaps with a 7-step sidewall, dished face and engraved arrow, both keys the same muted legend. Active drops 5px (off for reduced motion), and `.car-slider` has 12px bottom padding for that travel. The old `.car-btn` and `.car-count` stay in the markup, hidden, because the keys click them.
- Phone (30rem and below): 1rem padding, 2rem title. First screenshot eager, the rest `loading="lazy"`.
- New project needs: `.ov-num`, `.back-top`, `.ov-status`, `.ov-chip`, `.pills`, `repo-commits` span, a home card, a prefetch entry in `home.js`, a `sitemap.xml` entry, and `data-index`.

## Navigation

- Links in `#main` to `/`, `/about`, `/experience`, `/projects/<slug>` swap in place via `home.js`. Modifier clicks, `target="_blank"`, downloads, hashes and queries fall through. `norm()` treats `/projects/x.html` and `/projects/x` the same. Project pages must keep `<main id="main"><article>`.
- Page-specific scripts and `<head>` styles don't run on a swap, so keep behavior in shared files. New pages need the same script tags and font `<link>`s.

## Sound (`js/clack.js`)

- Loaded with `defer` on every page, after `slide-open.js`. Thock on press, lighter click on release, dry hover tick (mouse only) on links, buttons and whole cards. The card counts as one target, but `.meta li+li a` ticks separately (checked first). One voice at a time, 130ms cooldown. Adjust loudness with `master.gain.value` only.
- Always on, no mute button. The AudioContext unlocks on `pointerup`, `keydown`, `touchend` and `click`, so the very first press is silent.

## Content and SEO

- Kaltas and CivicGuard copy mirrors the owner's LinkedIn. Keep role, stack and status in sync. Kaltas is live on the Chrome Web Store ("published", not "submitted"). Don't claim humans review offers beyond what the Kaltas page says. The Ronda repo is deleted (don't link it). CivicGuard has no license.
- Every page has its own `<meta name="description">` and `og:description` (under about 160 chars), `og:url`, a canonical URL on `https://miconavarro.vercel.app` (clean, no `.html`), and matching `og:image`/`twitter:image`. Keep `og:` tags in sync if the title or image changes. A new page goes in `sitemap.xml`. The 404 page doesn't.
- Share image `images/og.png` (1200x630) is rendered from `images/og.svg` (`rsvg-convert -w 1200 -h 630 -o images/og.png images/og.svg`). Edit the SVG, not the PNG. Project pages use their own screenshot.
- Favicon: `<link rel="icon" type="image/svg+xml" href="/images/favicon.svg">` on every page. No custom domain.

## Conventions

- Small IIFEs, no globals, two-space indent, double quotes in newer files.
- Conventional Commits, lowercase, imperative, no trailing period.
- One request is one scope. Don't rewrite unrelated sections. Never commit secrets.

## Working with the owner

AI chat pushes have been blocked before, so the owner often pastes terminal commands. When you can't push, deliver commands or a patch and say how to verify. When you can push, edit directly. One small commit per change, pushed on its own, so each can be reverted separately.
