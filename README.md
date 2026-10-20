<div align="center">
  <h1>Mico Gerard Navarro</h1>
  <p>Portfolio: projects, case studies, and contact details</p>
  <p><strong>Live site:</strong> <a href="https://miconvr.vercel.app">https://miconvr.vercel.app</a></p>
</div>

---

This is the source code for my personal portfolio. It shows the projects I've built, with a case study for each one, and ways to get in touch. It is plain HTML, CSS, and a little JavaScript with no build step, and it's deployed on Vercel. Built during the FlyRank AI internship.

---

## Features

- **Project cards:** each project shows its status (live or in development), a short write-up, and links to its case study, live site, and repository
- **Case study pages:** one page per project, written in the same structure so they're easy to compare
- **Mobile friendly:** the layout collapses to one column on small screens, with larger tap targets and spacing that stays clear of phone notches
- **Page and scroll animations:** staggered reveals as you scroll, and fade transitions between pages in browsers that support them
- **Reduced motion:** every animation switches off for visitors who ask for less motion
- **Keyboard friendly:** a skip-to-content link and visible focus outlines
- **No dependencies:** no framework and no build step, only Google Fonts loaded from outside

---

## Pages

| Page | What's there |
| --- | --- |
| **Home** | Short intro and the project cards |
| **CivicGuard** | Case study for the barangay incident reporting system |
| **About** | A short introduction |
| **Experience** | Work and internship experience |
| **Contact** | Ways to reach me |

---

## Built with

**Frontend**

- HTML
- CSS (custom properties, grid, flexbox)
- Vanilla JavaScript

**Fonts**

- Geist and Geist Mono
- Newsreader
- Source Serif 4

**Hosting**

- Vercel

---

## Project structure

```
.
├── index.html            # home page
├── about/
├── civicguard/           # case study
├── contact/
├── experience/
├── images/               # screenshots and logos
├── home.js               # home page script
├── script.js, sub.js     # scripts for the inner pages
├── styles.css
├── vercel.json
└── ADDING-A-CASE.md      # how to add a new project
```

---

## Getting started

There is nothing to install. Any static file server works, as long as it serves from the repo root (the pages use paths like `/styles.css`, so opening `index.html` directly won't load them).

```bash
git clone https://github.com/miconvr/portfolio.git
cd portfolio
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

To add a new project, follow [ADDING-A-CASE.md](ADDING-A-CASE.md).

---

## Good to know

- **Work in progress.** I add projects as I finish them, and projects still being built are marked "in development".
- **Deploys on push.** Every push to `main` redeploys the site on Vercel.

---

## Built by

Mico Gerard Navarro
