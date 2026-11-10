# AGENTS.md

Guidance for any AI coding agent working in this repository (Codex, Copilot, Cursor, Gemini, and others). Human contributors can read it too.

This is the personal portfolio of Mico Gerard Navarro (BSIT student, San Fernando City, Pampanga). Live site: https://miconvr.vercel.app. Repo: `miconvr/portfolio`.

## Stack

Plain HTML, CSS and vanilla JavaScript. No framework, no bundler, no `package.json`. Hosted on Vercel; the only server code is one serverless function in `api/`. Fonts come from Google Fonts (Geist and Geist Mono). Keep it dependency-free.

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
| `api/hi.js` | Vercel function. `GET` reads and `POST` increments an Upstash Redis counter. Needs `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (or `KV_REST_API_URL` and `KV_REST_API_TOKEN`) |
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
- Sidebar: the location line ("San Fernando City, Pampanga, Philippines") has a pin icon and stays on one line on desktop. From 56.01rem up, the base font size is 110%.
- Navbar: full name "Mico Gerard Navarro", with only Projects, About and Experience sections (home, `/about`, `/experience`). Do not add more nav items without being asked.
- The Experience page lists real roles. Do not remove or rewrite entries without being asked.
- Mascot: a flat yellow smiley (`#f7bd2e`, outline and features `#14110d`) with a visitor counter. Its smile is the name "mico", drawn as one warped outline path rather than live text, so leave that path alone unless asked. Keep it simple: no arms, no shadow, no idle floating or hover movement. The only animations are the eyes following the pointer (small range, throttled with `requestAnimationFrame`), a blink every second, and one spin-hop on click. The spin always plays in full and clicks during it are ignored, so rapid clicking never restarts it. The yellow "+1" shows only on the first tap, and the count line stays plain text. With reduced motion on, the eyes stay still and there is no blink or spin. Show it on mobile too.
- Credit lines: under the visitor count, two small static lines in Geist Mono at low opacity ("designed and built by mico" and "inspired by drew house"), class `been-credit`. Keep them as plain text with no animation.
- Sidebar card (desktop, 56.01rem up): sticky with a 1rem gap above the card (`top:1rem`), height follows its content (`height:auto`), never an inner scroll or clipped content. On windows shorter than 54rem it becomes static so the whole card is reachable by scrolling the page. Do not make it flush to the viewport edges or give it a fixed height.
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
