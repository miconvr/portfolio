# AGENTS.md

Guidance for any AI coding agent working in this repository (Codex, Copilot, Cursor, Gemini, and others). Human contributors can read it too.

This is the personal portfolio of Mico Gerard Navarro (BSIT student, San Fernando City, Pampanga). Live site: https://miconvr.vercel.app. Repo: `miconvr/portfolio`. It was built during the Front-end AI Engineering internship at FlyRank AI.

## Stack

Plain HTML, CSS and vanilla JavaScript. No framework, no bundler, no `package.json`. Hosted on Vercel; the only server code is one serverless function in `api/`. Fonts come from Google Fonts (Inter, Geist Mono, Bricolage Grotesque, Plus Jakarta Sans). Keep it dependency-free.

## Layout

| Path | Purpose |
|---|---|
| `index.html` | Home page with the project list (Kaltas, CivicGuard, and others) |
| `about/index.html`, `experience/index.html` | Sub-pages, served as `/about` and `/experience` (`cleanUrls` is on) |
| `styles.css` | All styling, including light and dark themes |
| `script.js` | Theme toggle (stores `theme` in localStorage, respects `prefers-color-scheme`) |
| `home.js` | Page navigation behavior for the sidebar links |
| `sub.js` | Entrance and reveal behavior on sub-pages (skips for reduced motion and back/forward) |
| `rail.js` | Scroll rail for the item list |
| `overview.js` | Expandable "overview" panels on project items (`window.initOverview`) |
| `carousel.js` | Screenshot carousels with arrow-key, button and counter support |
| `been-here.js` | "been here" panda mascot and visitor counter, calls `/api/hi` |
| `api/hi.js` | Vercel function. `GET` reads and `POST` increments an Upstash Redis counter. Needs `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (or `KV_REST_API_URL` and `KV_REST_API_TOKEN`) |
| `images/` | Screenshots, icons, portrait, and the Kaltas trailer video |
| `vercel.json` | `cleanUrls`, no trailing slash, permanent redirects from `/kaltas` and `/civicguard` to `/` |

## Run and check

There is no build step.

```bash
python3 -m http.server 8000        # or: npx serve   (then open http://localhost:8000)
```

`api/hi.js` only works on Vercel (or `vercel dev`) with the Redis env vars set; without them it returns a 500 and the page hides the counter gracefully. Check a change by loading `/`, `/about` and `/experience` in light and dark mode, at mobile width, and with reduced motion on.

## Design and content rules

- Navbar: full name "Mico Gerard Navarro", with only Projects, About and Experience sections (home, `/about`, `/experience`). Do not add more nav items without being asked.
- Mascot: a simple panda with a visitor counter. Keep it simple (no blush, no smile, no big eyes), keep the cream-outlined ears, and show it on mobile too.
- The FlyRank graduate badge in the footer should stay subtle. There is no verification page link yet; do not invent one.
- No custom domain for now; keep `miconvr.vercel.app` as the canonical URL.
- The Ronda repo was deleted; do not link to it. Do not link a license for CivicGuard (it has none).
- Keep accessibility: skip link, labelled controls, alt text on images, `aria-live` on the counter, keyboard-usable carousels, and `prefers-reduced-motion` support. Never make content depend on animation or JavaScript where it can be avoided.
- Use `localStorage` and `sessionStorage` inside try/catch, as the existing scripts do.
- Update `og:` and meta tags in `index.html` if the site title or featured image changes.

## Open items

- `been-here.js` still defines an unused CounterAPI v1 constant (`BASE`); CounterAPI v1 is deprecated (HTTP 410). The live counter goes through `/api/hi` and Upstash Redis. Remove the dead constant when touching that file.

## Conventions

- Match the existing code style: small IIFEs, no globals except `window.initOverview`, two-space indentation, double quotes in the newer files.
- Commit messages: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`), lowercase, imperative, no trailing period.
- Keep changes focused: one request is one scope. Do not rewrite unrelated sections.
- Never commit secrets or tokens.

## Working with the owner

Pushes from AI chat sessions have been blocked in the past, so the owner often applies changes by copy-pasting terminal commands. When you cannot push, deliver changes as terminal commands or a patch and say how to verify them. When you do have push access, edit the files directly.
