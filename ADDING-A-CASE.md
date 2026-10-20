# How to add the next case study

Each case study is one folder with one `index.html`. The site has no build step, so a new case is a copy, an edit, and a push.

## Steps

1. **Copy the template.** Duplicate `ronda/` and rename the folder to a short slug, e.g. `my-project/`. The page will live at `/my-project`.
2. **Edit `my-project/index.html`.** Change the `<title>`, the description, the `<h1>`, the one-line summary, the links, and the facts box. Then rewrite the three sections below.
3. **Add it to the home page.** In `index.html`, copy one `<article class="proj">` block under Projects, point its "Case study" link at `/my-project`, and update the icon, the description and the status (Live or In development).
4. **Check it.** Tab through the page with only the keyboard, click every link, and search the project for `TODO`.
5. **Publish.** Commit and push to GitHub. Vercel redeploys automatically, usually in under a minute.

## The three beats

- **The problem.** Who needed what, in two or three sentences. Name the real person or place.
- **What I did.** Two or three decisions and why I made them, not a feature list.
- **What came of it.** The result with evidence (a live link, a number, feedback, a file). If it's unfinished, say what's done and what's next.

## Fast path with Claude

Keep the Claude Project for this portfolio. Open it, paste rough notes about the new work (what it was, what I decided, what happened), and ask: "Write this as a case study using the same three beats and page structure as Ronda." Then paste the result into the copied page.

## Next case

- **Next piece of work:** CivicGuard follow-up case study: what barangay staff said after using it
- **Reminder set for:** October 27, 2026 at 1 PM, in my calendar, with an alert at the time of the event.
