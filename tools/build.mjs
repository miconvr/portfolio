import fs from "node:fs";

const SITE = "https://miconavarro.vercel.app";
const EMAIL = "micogerardnavarro@gmail.com";
const CRED = process.env.CRED || "https://www.coursera.org/";
if (!process.env.CRED) console.warn("warning: CRED not set, certificate link points at coursera.org");

const GH = "https://github.com/miconvr", LI = "https://linkedin.com/in/miconvr", IG = "https://instagram.com/miconvr";
const ext = 'target="_blank" rel="noopener noreferrer"';

const I = {
  gh: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"/></svg>',
  li: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 11v5"/><path d="M8 8v.01"/><path d="M12 16v-5"/><path d="M16 16v-3a2 2 0 0 0 -4 0"/><path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z"/></svg>',
  ig: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3"/><path d="M16.5 7.5v.01"/></svg>',
  moon: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></svg>',
  back: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
  prev: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
  next: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>',
  globe: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8"/><path d="M3.6 15h16.8"/><path d="M11.5 3a17 17 0 0 0 0 18"/><path d="M12.5 3a17 17 0 0 1 0 18"/></svg>',
  shield: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3"/><path d="M9 12l2 2l4 -4"/></svg>',
  users: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  chrome: '<svg class="i" style="stroke:none" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 24L4.95 13.00 A22 22 0 0 1 43.05 13.00 Z"/><path fill="#FBBC04" d="M24 24L43.05 13.00 A22 22 0 0 1 24.00 46.00 Z"/><path fill="#34A853" d="M24 24L24.00 46.00 A22 22 0 0 1 4.95 13.00 Z"/><circle cx="24" cy="24" r="11" fill="#fff"/><circle cx="24" cy="24" r="8.5" fill="#4285F4"/></svg>',
};

const heart = (live) =>
  `<svg class="heart" viewBox="0 0 120 120" aria-hidden="true"><g${live ? ' class="turn"' : ""}><path d="M60 97C30 77 18 61 18 45C18 33 27 25 38 25C48 25 56 31 60 40C64 31 72 25 82 25C93 25 102 33 102 45C102 61 90 77 60 97Z" fill="#e5484d"/><g${live ? ' class="eyes"' : ""}><ellipse cx="45" cy="50" rx="4.4" ry="8.4" fill="#14110d"/><ellipse cx="75" cy="50" rx="4.4" ry="8.4" fill="#14110d"/></g></g></svg>`;

/* ---------- content ---------- */
const P = [
  {
    slug: "kaltas", name: "Kaltas", live: true, status: "Live",
    icon: "/images/projects/kaltas/kaltas-icon.webp",
    og: "/images/projects/kaltas/kaltas.jpg?v=3",
    desc: "Kaltas &ndash; a Chrome extension that finds student deals for the website you're visiting.",
    ogDesc: "A Chrome extension that finds student deals for the website you're visiting.",
    blurb: "Chrome extension that finds student deals for the website you're visiting.",
    stack: ["JavaScript", "HTML", "CSS", "Manifest V3", "Gemini API", "GitHub Actions"],
    role: ["Solo Developer"], time: "Nov 2026 &ndash; present",
    shots: [
      ["/images/projects/kaltas/kaltas.webp?v=2", 1280, 800, "Kaltas popup on github.com showing the GitHub Student Developer Pack deal with a View offer button."],
      ["/images/projects/kaltas/kaltas-browse.webp?v=2", 1280, 800, "Kaltas popup on a site with no student deal, with the Browse student deals list open."],
      ["/images/projects/kaltas/kaltas-search.webp?v=2", 1280, 800, "Kaltas popup searching the Browse student deals list for cloud and showing the matching deals."],
    ],
    lede: "Kaltas is a Chrome extension that finds student deals for the website you're visiting. When a site has a student discount, free plan, or education perk, the toolbar icon gets a green dot, and one click shows the offer, who qualifies, and a link to the official page. Matching happens on the device, so browsing data never leaves the browser.",
    links: [
      [I.chrome, "Chrome Web Store", "https://ggl.link/kaltas", true],
      [I.gh, "Repository", "https://git.new/kaltas", true],
      [I.shield, "Privacy policy", "/kaltas/privacy-policy", false],
    ],
    outcomes: [
      "Designed, built and published solo on the Chrome Web Store, including the listing, screenshots, privacy disclosures and packaging.",
      "Built on-device domain matching against a curated offer list of global student offers.",
      "Added a green toolbar badge using the declarativeContent API, so the badge works without the extension reading tabs or page content.",
      "Built a remote offers update: the popup and badge load the list from GitHub with a timeout, validate every entry, and fall back to a saved copy and then a bundled one, so new deals reach users without a store release.",
      "Built the popup with a dark default and a light option, a settings panel, a searchable list of all deals, and starred favorites that pin a deal to the top.",
      "Kept it private: Manifest V3, two permissions (activeTab and declarativeContent), no host permissions, HTTPS-only links, and no accounts, analytics or browsing history.",
      "Wrote an offer data format and a validation script that runs in CI on every push, checked offers against official sources, and automated upkeep with GitHub Actions: a weekly link checker flags broken or moved offer links, a weekly cleanup removes expired offers and links that stay dead for three weeks, and a weekly job adds new deals from community lists. A free Gemini model drafts each new entry, and plain code verifies it against the official page before it is published, so the model never decides what goes live.",
      "Open sourced under the MIT License with a README, privacy policy and a GitHub flow for reporting outdated offers.",
    ],
  },
  {
    slug: "civicguard", name: "CivicGuard", live: false, status: "In development",
    icon: "/images/projects/civicguard/civicguard-icon.webp",
    og: "/images/projects/civicguard/civicguard.png",
    desc: "CivicGuard &ndash; incident reporting and curfew monitoring for Barangay Maimpis.",
    ogDesc: "Incident reporting and curfew monitoring for Barangay Maimpis.",
    blurb: "Incident reporting and curfew monitoring website for Barangay Maimpis.",
    stack: ["Laravel 12", "MySQL", "Tailwind CSS", "Alpine.js"],
    role: ["Project Manager", "Full-Stack Developer"], time: "Sep 2026 &ndash; present",
    team: "Built with: Franz Mikey Reyes, Carl Spencer Talon, and Adriann Enriquez.",
    shots: [
      ["/images/projects/civicguard/civicguard.webp", 1198, 749, "CivicGuard home page reading Report an issue in Barangay Maimpis, with a five-step example of following a report from problem to resolved."],
      ["/images/projects/civicguard/civicguard-install.webp", 1198, 749, "CivicGuard install page with an iPhone and Android switch and three steps for adding the app to a phone's home screen."],
      ["/images/projects/civicguard/civicguard-report.webp", 1280, 800, "CivicGuard Report an Incident page offering two options: get help from the CivicGuard AI assistant, or fill out the form yourself."],
    ],
    lede: "CivicGuard is a capstone project at Our Lady of Fatima University that improves incident reporting and curfew monitoring in Barangay Maimpis. Residents submit and track reports, and barangay staff review and manage them. AI helps residents describe incidents, while staff make the final decisions.",
    links: [
      [I.globe, "Open the site", "https://civicguard.wasmer.app/", true],
      [I.gh, "Repository", "https://github.com/miconvr/civicguard", true],
    ],
    outcomes: [
      "Led a four-member team as Project Manager and Full-Stack Developer.",
      "Built the resident side: reporting with optional photos and location pins, plus follow-up tracking.",
      "Built the staff side: report review, assignment, status updates, residence verification, curfew incident logging and analytics.",
      "Integrated AI-assisted report writing and classification using Google Gemini and Groq.",
      "Added English and Tagalog support, role-based access control and automated testing with GitHub Actions CI.",
      "Deployed on Wasmer.",
    ],
  },
];

/* ---------- shared layout ---------- */
const head = ({ title, desc, path, img, robots }) => `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0d0c0b">
<meta name="color-scheme" content="dark light">
<script>(function(){var r=document.documentElement,t="dark";try{var s=localStorage.getItem("theme-v1");if(s==="light"||s==="dark")t=s}catch(e){}r.dataset.theme=t;if(t==="light"){var m=document.querySelector('meta[name="theme-color"]');if(m)m.content="#f1ebdb"}if(!matchMedia("(prefers-reduced-motion: reduce)").matches)r.classList.add("js")})()</script>
<title>${title}</title>
<meta name="description" content="${desc}">
${robots ? '<meta name="robots" content="noindex">\n' : ""}<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${SITE}${img || "/images/site/og.png?v=2"}">
<meta name="twitter:image" content="${SITE}${img || "/images/site/og.png?v=2"}">
<meta name="twitter:card" content="summary_large_image">
<meta property="og:url" content="${SITE}${path}">
<link rel="canonical" href="${SITE}${path}">
<link rel="icon" type="image/svg+xml" href="/images/site/favicon.svg?v=2">
<link rel="preload" as="font" type="font/woff2" href="/fonts/geist-latin-wght-normal.woff2" crossorigin>
<link rel="stylesheet" href="/css/site.css?v=3">
<noscript><style>.reveal{opacity:1!important;transform:none!important}</style></noscript>
</head>
`;

const bar = `<header class="bar"><div class="wrap bar-in">
<a class="brand" href="/" aria-label="Mico Gerard Navarro, home">${heart(false)}<span>Mico Gerard Navarro</span></a>
<nav aria-label="Sections"><a href="/#projects">Projects</a><a href="/#about">About</a><a href="/#certificates">Certificates</a><a href="/#contact">Contact</a></nav>
<button id="theme" class="icon" type="button" aria-label="Toggle light and dark mode">${I.moon}</button>
</div></header>`;

const foot = `<footer class="foot"><div class="wrap">
<div class="been"><button class="been-btn" type="button" aria-label="Say hi">${heart(true)}</button><div><p class="been-line">tap if you are here!</p><p class="been-count mu"></p></div></div>
<span>designed and built by mico</span>
<img class="fly" src="/images/logos/flyrank-wordmark.svg" height="16" alt="FlyRank AI graduate">
</div></footer>`;

const page = (meta, main) => `${head(meta)}<body>
<a class="skip" href="#main">Skip to content</a>
${bar}
${main}
${foot}
<script src="/js/site.js?v=3" defer></script>
</body>
</html>
`;

/* ---------- pages ---------- */
const card = (p) => `<article class="card reveal">
<div class="shot"><img src="${p.shots[0][0]}" width="${p.shots[0][1]}" height="${p.shots[0][2]}" loading="lazy" alt="${p.shots[0][3]}"></div>
<div class="body">
<div class="top"><img src="${p.icon}" width="40" height="40" alt=""><h3><a href="/${p.slug}">${p.name}</a></h3><span class="st${p.live ? " live" : ""}">${p.status.toLowerCase()}</span></div>
<p>${p.blurb}</p>
<p class="stack">${p.stack.join(" &middot; ")}</p>
<div class="links">${p.links.filter((l) => l[3]).map((l) => `<a href="${l[2]}" ${ext}>${l[1]}</a>`).join("")}</div>
</div></article>`;

const home = page(
  { title: "Mico Gerard Navarro", desc: "Kaltas, a Chrome extension for student deals, and CivicGuard, an incident monitoring system, built by BSIT student Mico Gerard Navarro.", path: "/" },
  `<main id="main">
<section class="hero"><div class="wrap">
<p class="tag">BSIT student &middot; Pampanga, Philippines</p>
<h1>I build web things people actually use.</h1>
<p class="lead">From the first idea to something live. Two projects so far: a Chrome extension for student deals and a barangay incident monitoring system.</p>
<div class="row"><a class="btn p" href="#projects">See my projects</a><a class="btn" href="mailto:${EMAIL}">Email me</a></div>
<div class="soc">
<a class="icon" href="${GH}" ${ext} aria-label="GitHub">${I.gh}</a>
<a class="icon" href="${LI}" ${ext} aria-label="LinkedIn">${I.li}</a>
<a class="icon" href="${IG}" ${ext} aria-label="Instagram">${I.ig}</a>
</div>
<p class="stat" data-commits hidden><b></b> commits across Kaltas and CivicGuard</p>
</div></section>

<section class="sec" id="projects"><div class="wrap">
<h2 class="reveal">Projects</h2>
<div class="cards">
${P.map(card).join("\n")}
</div></div></section>

<section class="sec"><div class="wrap two">
<div id="about" class="reveal">
<img class="me" src="/images/profile/mico-400.webp?v=9" width="72" height="72" alt="Mico Gerard Navarro" loading="lazy">
<h2>About</h2>
<p>I'm a BSIT student based in Pampanga, Philippines. I build things for the web, from the first idea to something people can actually use.</p>
<p class="mu">I like the whole process: figuring out the problem, learning whatever tools it needs, refining the details, and shipping it. Most of what I know I've picked up by building real projects. I'm still learning, and I try to make each project better than the last.</p>
</div>
<div id="certificates" class="reveal">
<h2>Certificates</h2>
<div class="cert"><img src="/images/badges/itsupport-badge.webp" width="152" height="136" alt="Google IT Support certificate badge"><div><b>Google IT Support Professional Certificate</b><span>Google &middot; Coursera &middot; Issued Nov 2026</span><a href="${CRED}" ${ext}>View credential</a></div></div>
</div>
</div></section>

<section class="sec" id="contact"><div class="wrap reveal">
<p class="tag">Contact</p>
<h2>Let's talk.</h2>
<a class="mail" href="mailto:${EMAIL}">${EMAIL}</a>
</div></section>
</main>`
);

const detail = (p) => {
  const n = p.shots.length;
  const slides = p.shots.map((s, i) => `<div class="slide"><img src="${s[0]}" width="${s[1]}" height="${s[2]}"${i ? ' loading="lazy"' : ""} alt="${s[3]}"></div>`).join("\n");
  const links = p.links.map((l) => `<li><a class="badge" href="${l[2]}"${l[3] ? " " + ext : ""}>${l[0]}${l[1]}</a></li>`).join("");
  return page(
    { title: `Mico Gerard Navarro: ${p.name}`, desc: p.desc, path: `/${p.slug}`, img: p.og },
    `<main id="main" class="page">
<a class="back" href="/#projects">${I.back}All projects</a>
<div class="ptitle"><img src="${p.icon}" width="56" height="56" alt=""><h1>${p.name}</h1><span class="st${p.live ? " live" : ""}">${p.status}</span></div>
<div class="gallery" role="group" aria-roledescription="carousel" aria-label="${p.name} screenshots">
<div class="slides" tabindex="0" aria-label="${p.name} screenshots. Use the left and right arrow keys to browse.">
${slides}
</div>
<button class="gbtn prev" type="button" aria-label="Previous screenshot">${I.prev}</button>
<button class="gbtn next" type="button" aria-label="Next screenshot">${I.next}</button>
<span class="gcount" aria-live="polite">1 / ${n}</span>
</div>
<p class="lede">${p.lede}</p>
${p.team ? `<p class="team">${I.users}<span>${p.team}</span></p>` : ""}
<ul class="badges">${links}</ul>
<h2>Overview</h2>
<dl class="facts">
<div class="fact"><dt>Role</dt><dd class="pills">${p.role.map((r) => `<span>${r}</span>`).join("")}</dd></div>
<div class="fact"><dt>Timeline</dt><dd class="pills"><span>${p.time}</span></dd></div>
<div class="fact"><dt>Status</dt><dd class="pills"><span>${p.status}</span></dd></div>
<div class="fact" hidden><dt>Activity</dt><dd><span data-repo-commits="${p.slug}"></span></dd></div>
<div class="fact"><dt>Stack</dt><dd class="pills">${p.stack.map((s) => `<span>${s}</span>`).join("")}</dd></div>
</dl>
<ul class="outcomes">
${p.outcomes.map((o) => `<li>${o}</li>`).join("\n")}
</ul>
</main>`
  );
};

const privacy = page(
  { title: "Kaltas Privacy Policy: Mico Gerard Navarro", desc: "Privacy policy for Kaltas, the Chrome extension that finds student deals. It collects no personal data and fetches one public offers file from GitHub.", path: "/kaltas/privacy-policy" },
  `<main id="main" class="page policy">
<a class="back" href="/kaltas">${I.back}Back to Kaltas</a>
<div class="ptitle"><img src="/images/projects/kaltas/kaltas-icon.webp" width="56" height="56" alt=""><h1>Privacy Policy: Kaltas</h1></div>
<p class="meta">Last updated: November 26, 2026</p>
<p class="lede">Kaltas does not collect, store, or sell any personal data. To keep its offers list current, it requests one public file from GitHub, which means GitHub can see your IP address, as any website you visit can. See &ldquo;Offers list&rdquo; below.</p>
<h2>What the extension does</h2>
<p>When you click the toolbar icon, Kaltas reads the hostname of your current tab (via the <code>activeTab</code> permission) and compares it with a list of student offers. The comparison happens entirely on your device. The hostname and the pages you visit are never sent anywhere.</p>
<h2>Settings saved on your device</h2>
<p>The popup remembers a few settings in your browser&rsquo;s local storage for this extension: light or dark mode, whether the browse list or footer is hidden, and the deals you save with the star (stored by offer name). These settings stay on your device, are never sent anywhere, and are removed if you uninstall the extension.</p>
<h2>Toolbar badge</h2>
<p>Kaltas shows a green dot on its toolbar icon when the site you are on has a student offer. This uses Chrome&rsquo;s <code>declarativeContent</code> feature: the extension gives Chrome a list of domains from the offers list (see &ldquo;Offers list&rdquo; below), and Chrome itself decides whether the current page matches and swaps the icon. Kaltas does not see the pages you visit, does not read your tabs or history, and does not store or send anything about them.</p>
<h2>Offers list</h2>
<p>When you open the popup, and when Chrome starts or the extension updates, Kaltas requests one public file, <code>offers.json</code>, from GitHub (<code>raw.githubusercontent.com/miconvr/kaltas/main/offers.json</code>), so new and corrected offers reach you without waiting for a store update. This is an ordinary web request: GitHub, like any website, can see your IP address and the standard information a browser sends with any request.</p>
<p>The request does not include the site you are on, your tabs, your history, or any account or identifier from the extension, and no cookies are sent.</p>
<p>If GitHub cannot be reached or the file looks wrong, the extension uses a saved copy or the offers file bundled with the extension. The popup keeps a copy of the last good offers list in local storage on your device.</p>
<p>Offers in that file are maintained by the project owner and by an automated weekly process that removes expired or dead offers and adds new ones only after code checks pass. The owner can revert any change. The file contains offers only, never code.</p>
<h2>What we do not do</h2>
<ul>
<li>No analytics, tracking, advertising, or accounts.</li>
<li>No collection of browsing history or the pages you visit.</li>
<li>No sharing or selling of data, because none is collected.</li>
</ul>
<h2>Reports</h2>
<p>The &ldquo;Report an outdated offer&rdquo; link opens GitHub in a new tab. Any information you submit there is handled by GitHub, not Kaltas.</p>
<h2>Contact</h2>
<p>Questions or issues: <a href="https://github.com/miconvr/kaltas/issues" ${ext}>github.com/miconvr/kaltas/issues</a></p>
</main>`
);

const notFound = page(
  { title: "Page not found: Mico Gerard Navarro", desc: "Page not found.", path: "/404", robots: true },
  `<main id="main" class="nf">
<img src="/images/site/favicon.svg?v=2" width="56" height="56" alt="">
<p class="tag">404</p>
<h1>Page not found</h1>
<p>That link doesn&rsquo;t lead anywhere. It may have moved, or it never existed.</p>
<p><a class="btn p" href="/">Back home</a></p>
</main>`
);

const out = (f, s) => { fs.mkdirSync(f.split("/").slice(0, -1).join("/") || ".", { recursive: true }); fs.writeFileSync(f, s); console.log("wrote", f); };
out("index.html", home);
out("404.html", notFound);
P.forEach((p) => out(`${p.slug}/index.html`, detail(p)));
out("kaltas/privacy-policy/index.html", privacy);
