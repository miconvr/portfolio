# AGENTS.md

Guidance for any AI coding agent working in this repository (Codex, Copilot, Cursor, Gemini, and others). Human contributors can read it too.

This is the personal portfolio of Mico Gerard Navarro (BSIT student, San Fernando City, Pampanga). Live site: https://miconvr.vercel.app. Repo: `miconvr/portfolio`.

## Stack

Plain HTML, CSS and vanilla JavaScript. No framework, no bundler, no `package.json`. Hosted on Vercel; the only server code is two small serverless functions in `api/`. Fonts come from Google Fonts (Geist and Geist Mono). Keep it dependency-free.

## Layout

| Path | Purpose |
|---|---|
| `index.html` | Home page with the project list (Kaltas, CivicGuard, and others) |
| `about/index.html`, `experience/index.html` | Sub-pages, served as `/about` and `/experience` (`cleanUrls` is on) |
| `css/styles.css` | All styling. Dark theme only (`color-scheme: dark`), no toggle |
| `js/home.js` | Page navigation behavior for the sidebar links |
| `js/rail.js` | Scroll rail for the item list |
| `js/overview.js` | Expandable "overview" panels on project items (`window.initOverview`) |
| `js/carousel.js` | Screenshot carousels with arrow-key, button and counter support |
| `js/been-here.js` | "been here" smiley mascot and visitor counter, calls `/api/hi` |
| `js/commits.js` | Adds a small "(N+ commits)" note beside the github.com/miconvr sidebar link and fills any `[data-repo-commits]` tag. Fed by `/api/commits`. Caches the last response in `localStorage` (key `commits-v3`) and retries the fetch once on failure |
| `api/hi.js` | Vercel function. `GET` reads and `POST` increments an Upstash Redis counter. Needs `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (or `KV_REST_API_URL` and `KV_REST_API_TOKEN`) |
| `api/commits.js` | Vercel function. Returns total commits across the profile for every year since the account was created (GitHub GraphQL) plus `kaltas` and `civicguard` repo counts, all rounded down to the nearest 10. Cached at the edge for an hour (`s-maxage=3600`). Requires the `GITHUB_TOKEN` env var (fine-grained, public read-only; it expires, so renew it in Vercel when it does) |
| `images/projects/`, `images/profile/` | Project screenshots, icons and the Kaltas trailer video; portrait photos |
| `vercel.json` | `cleanUrls`, no trailing slash, permanent redirects from `/kaltas` and `/civicguard` to `/` |

## Run and check

There is no build step.

```bash
python3 -m http.server 8000        # or: npx serve   (then open http://localhost:8000)
```

`api/hi.js` only works on Vercel (or `vercel dev`) with the Redis env vars set; without them it returns a 500 and the page hides the counter gracefully. Check a change by loading `/`, `/about` and `/experience`, at mobile width, and with reduced motion on.

## Design and content rules

- Theme: the site is dark only. Do not add a light theme or a theme toggle unless asked.
- Type and color: Geist for text and Geist Mono for small labels. Headings are near-white, body text is soft gray and secondary text is gray. Do not bring back the old mixed fonts.
- Text color: primary text is a warm cream to match the yellow mascot, `--ink` `#F3E9D2` for headings and `--text` `#E4DAC3` for body and links. Secondary text stays gray (`--muted`). Do not go back to pure or cool white. This overrides the "near-white" wording above.
- No hardcoded whites: use `var(--ink)` and `var(--text)` for light text, hovers and filled buttons. Never write `#fff` or `#FAF9F5` for text or hover states, or the cool white comes back.
- Button hover: the project buttons (Overview, Live Site, Repository) change only their background on hover. The border goes transparent, with no outline or border highlight. Keep the `:focus-visible` outline for keyboard users.
- Sidebar: the location line ("San Fernando City, Pampanga, Philippines") has a pin icon and stays on one line on desktop. From 56.01rem up, the base font size is 110%.
- Navbar: full name "Mico Gerard Navarro", with only Projects, About and Experience sections (home, `/about`, `/experience`). Do not add more nav items without being asked.
- The Experience page lists real roles. Do not remove or rewrite entries without being asked.
- Project copy: the Kaltas and CivicGuard card text and overview bullets mirror the owner's LinkedIn descriptions. Keep the facts in sync (role, stack, status) and change both together. Kaltas is live on the Chrome Web Store, so say "published", not "submitted". Do not claim a human reviews offers beyond what the overview states (automation only collects leads, and offers are reviewed manually before they are published).
- Mascot: a flat yellow smiley (`#f7bd2e`, outline and features `#14110d`) with a visitor counter. Its smile is the name "mico", drawn as one warped outline path rather than live text, so leave that path alone unless asked. Keep it simple: no arms, no shadow, no idle floating or hover movement. The only animations are the eyes following the pointer (small range, throttled with `requestAnimationFrame`), a blink every second, and one spin-hop on click. The spin always plays in full and clicks during it are ignored, so rapid clicking never restarts it. The yellow "+1" shows only on the first tap, and the count line stays plain text. With reduced motion on, the eyes stay still and there is no blink or spin. Show it on mobile too.
- Credit lines: under the visitor count, two small static lines in Geist Mono at low opacity ("designed and built by mico" and "inspired by drew house"), class `been-credit`. Keep them as plain text with no animation.
- Sidebar card (desktop, 56.01rem up): a static full-height panel, flush to the top and bottom of the window with square corners and no top or bottom border (`position:sticky;top:0;height:100dvh;border-radius:0`). No inner scroll, and all content is always visible. Photo size and gaps use `clamp()` with `dvh` so they scale with the window, and the mascot block is pinned to the bottom with `margin-top:auto`. On windows shorter than 52rem it becomes static with `height:auto` and flows with the page. Do not give it a fixed pixel height or `overflow:auto`.
- Commit count: `js/commits.js` shows two things, both rounded down to 10 and hidden if the API fails. (1) A small grayed "(N+ commits)" note beside the github.com/miconvr sidebar link, the total across all years and repos on the profile. On mobile, where sidebar links are icon-only, it drops onto its own "GitHub (N+ commits)" line under the icons. (2) A tag with the GitHub logo and "N+ commits" on the date line of each project (`<span class="repo-commits" data-repo-commits="kaltas|civicguard" hidden>`). To add a project, add its repo to `PROJECTS` in `api/commits.js` and use the same `data-repo-commits` attribute.
- Sidebar details: the contact links have no underline at rest and get one on hover and keyboard focus, along with the brighter `--ink` color. On desktop the mascot block has a 1px `#333230` hairline above it (`.side .been{border-top}`) so it reads as a footer. Keep both.
- Sidebar description: on desktop the sidebar description (`.side .lead`, not the location line) uses the same type as the About paragraphs, Geist 1.125rem (18px) with a 1.7 line height. Keep them matched.
- No custom domain for now; keep `miconvr.vercel.app` as the canonical URL.
- The Ronda repo was deleted; do not link to it. Do not link a license for CivicGuard (it has none).
- Keep accessibility: skip link, labelled controls, alt text on images, `aria-live` on the counter, keyboard-usable carousels, and `prefers-reduced-motion` support. Never make content depend on animation or JavaScript where it can be avoided.
- Use `localStorage` inside try/catch, as the existing scripts do.
- Update `og:` and meta tags in `index.html` if the site title or featured image changes.

## Conventions

- Match the existing code style: small IIFEs, no globals except `window.initOverview`, two-space indentation, double quotes in the newer files.
- Commit messages: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`), lowercase, imperative, no trailing period.
- Keep changes focused: one request is one scope. Do not rewrite unrelated sections.
- Never commit secrets or tokens.

## Working with the owner

Pushes from AI chat sessions have been blocked in the past, so the owner often applies changes by copy-pasting terminal commands. When you cannot push, deliver changes as terminal commands or a patch and say how to verify them. When you do have push access, edit the files directly.
