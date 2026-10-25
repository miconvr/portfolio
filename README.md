<div align="center">
  <img src="images/mico-profile.png" alt="Portrait of Mico Gerard Navarro" width="84" height="84">
  <h1>Mico Gerard Navarro</h1>
  <p>A personal portfolio for projects, case studies, and experience.</p>
  <p>
    <a href="https://miconvr.vercel.app">Open the live portfolio</a> ·
    <a href="https://github.com/miconvr">GitHub</a> ·
    <a href="https://linkedin.com/in/miconvr">LinkedIn</a>
  </p>
</div>

This is the source code for my personal portfolio. It presents my projects, including CivicGuard, my capstone project at Our Lady of Fatima University, along with a case study, experience, and contact details.

The site is built with plain HTML, CSS, and JavaScript. It has no framework or build step and is deployed on Vercel. The portfolio was created during my Front-end AI Engineering internship at FlyRank AI.

## Featured project

### CivicGuard

CivicGuard is an AI-integrated web-based incident and curfew monitoring system for Barangay Maimpis, City of San Fernando, Pampanga.

It is an OLFU capstone project designed to connect residents with barangay staff through report submission, follow-up, incident management, and curfew monitoring tools. I led a four-member team as Project Manager and Full-Stack Developer.

- [Open the live site](https://civicguard.wasmer.app/)
- [Read the case study](https://miconvr.vercel.app/civicguard)
- [View the repository](https://github.com/miconvr/civicguard)

## Features

- **In-place navigation:** About, Experience, and Contact load in the main panel without removing the sidebar or navigating away from the portfolio shell
- **Project presentation:** featured project preview with case study, live site, and repository links
- **CivicGuard case study:** project context, responsibilities, technology, AI features, and deployment details
- **Responsive layout:** desktop sidebar layout that collapses cleanly on smaller screens
- **Motion:** page-panel transitions, scroll reveals, image movement, and link feedback with reduced-motion support
- **Accessible basics:** skip link, semantic landmarks, visible focus states, descriptive image text, and keyboard-friendly navigation
- **No build step:** static files that can be served with any simple local HTTP server

## Pages

| Page | What's there |
| --- | --- |
| **Home** | Introduction and featured project |
| **CivicGuard** | Case study for the OLFU capstone project |
| **About** | A short introduction |
| **Experience** | FlyRank AI internship experience |
| **Contact** | Email, GitHub, and LinkedIn |

## Technology

- **Frontend:** HTML, CSS, and vanilla JavaScript
- **Layout:** CSS Grid, Flexbox, custom properties, and responsive media queries
- **Fonts:** Manrope, Sora, and DM Mono from Google Fonts
- **Motion:** Intersection Observer, View Transitions API, and CSS transitions
- **Hosting:** Vercel

## Run locally

There is nothing to install. Serve the repository from its root because the pages use absolute paths such as `/styles.css`.

```bash
git clone https://github.com/miconvr/portfolio.git
cd portfolio
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

## Project structure

```text
.
├── index.html              # portfolio homepage
├── about/
│   └── index.html          # about panel
├── civicguard/
│   └── index.html          # CivicGuard case study
├── contact/
│   └── index.html          # contact panel
├── experience/
│   └── index.html          # internship experience panel
├── images/                 # profile, project screenshot, and app icon
├── home.js                 # homepage navigation and project animations
├── script.js               # theme controls for inner pages
├── sub.js                  # inner-page reveal animations
├── styles.css              # shared visual system
└── vercel.json             # Vercel routing settings
```

## Deployment

The site is deployed on Vercel. Pushes to `main` trigger a new deployment.

## Credits

Portfolio by Mico Gerard Navarro.

Built during the Front-end AI Engineering internship at [FlyRank AI](https://internship.flyrank.ai/).
