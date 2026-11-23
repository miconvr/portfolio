(() => {
  const LINK = ".projects-grid .item .meta li:first-child a";
  const CARD = ".projects-grid .item";
  const DONE = .85;
  const desktop = () => matchMedia("(min-width: 40rem) and (pointer: fine)").matches;
  const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const linkOf = c => c.querySelector(".meta li:first-child a");
  let busy = false;

  // A real click or tap on a card opens the project, except on its other links.
  // The stripe link covers the whole card, so its native click is taken over here and goes
  // through openCard(). Keyboard and script clicks (detail 0) pass through untouched.
  document.addEventListener("click", e => {
    if (e.detail === 0 || !e.target.closest) return;
    const c = e.target.closest(CARD);
    if (!c) return;
    if (e.target.closest("a, button") && !e.target.closest(LINK)) return;
    const l = linkOf(c);
    if (!l) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (busy || window.__retracting) return;
    openCard(c, l);
  }, true);

  // Stop the browser's native link drag, which would cancel our pointer events.
  document.addEventListener("dragstart", e => {
    if (e.target.closest && e.target.closest(CARD)) e.preventDefault();
  }, true);

  function showReader(c) {
    let r = c.querySelector(".reader");
    if (r) clearTimeout(r._rm);
    c.classList.remove("retract-hold");
    if (!r) {
      r = document.createElement("div");
      r.className = "reader";
      r.setAttribute("aria-hidden", "true");
      r.innerHTML = '<span class="r-screen"></span><span class="r-keys"></span>';
      c.appendChild(r);
      void r.offsetWidth;
    }
    r.classList.add("in");
  }

  function hideReader(c) {
    const r = c.querySelector(".reader");
    if (!r) return;
    r.classList.remove("in");
    clearTimeout(r._rm);
    r._rm = setTimeout(() => { if (!r.classList.contains("in")) r.remove(); }, 650);
  }

  function release(c, l) {
    l.classList.remove("drag");
    c.classList.remove("pulling");
    c.classList.add("spring");
    c.style.setProperty("--pull", "0");
    hideReader(c);
    setTimeout(() => c.classList.remove("spring"), 650);
  }

  function ensureSheen() {
    document.querySelectorAll(CARD).forEach(c => {
      if (c.querySelector(".sheen")) return;
      const sh = document.createElement("span");
      sh.className = "sheen"; sh.setAttribute("aria-hidden", "true");
      c.appendChild(sh);
      c.style.setProperty("--idle", (-Math.random() * 9).toFixed(2) + "s");
    });
  }
  function clearDip() {
    if (busy) return;
    document.querySelectorAll(".projects-grid .item.dip").forEach(c => c.classList.remove("dip"));
  }
  // Stack tags: every tag stays on one row. Start at full size and shrink in small steps until the row fits.
  function fitStacks() {
    document.querySelectorAll(".projects-grid .card-stack").forEach(p => {
      p.style.removeProperty("--stack-fs");
      if (!p.clientWidth) return;
      const root = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      let fs = .66 * root;
      const min = 6;
      p.style.setProperty("--stack-fs", fs + "px");
      while (p.scrollWidth > p.clientWidth + .5 && fs > min) {
        fs -= .25;
        p.style.setProperty("--stack-fs", fs + "px");
      }
    });
  }
  let fitTimer = 0;
  window.addEventListener("resize", () => { clearTimeout(fitTimer); fitTimer = setTimeout(fitStacks, 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitStacks);
  window.addEventListener("pageshow", e => { if (e.persisted) { busy = false; clearDip(); } fitStacks(); });
  function ensureAll() { ensureSheen(); clearDip(); fitStacks(); }
  ensureAll();
  // Cards only get swapped in through #main (home.js sets main.innerHTML), so watch just that, not the whole document.
  const main = document.getElementById("main");
  if (main) new MutationObserver(ensureAll).observe(main, { childList: true });

  // A click on desktop runs the scanner like a finished swipe: the card slides in as --pull eases to 1,
  // the reader goes green and beeps at 85%, then the stripe link opens the project.
  function scan(c, l) {
    busy = true;
    c.classList.remove("spring");
    c.classList.add("pulling");
    l.classList.add("drag");
    showReader(c);
    const t0 = performance.now(), D = 200;
    const finish = () => {
      l.classList.remove("drag");
      c.style.setProperty("--pull", "1");
      setTimeout(() => {
        l.click();
        setTimeout(() => { busy = false; release(c, l); }, 500);
      }, 120);
    };
    const step = now => {
      if (!c.isConnected) { busy = false; return; }
      const t = Math.min(1, (now - t0) / D), v = 1 - Math.pow(1 - t, 3);
      c.style.setProperty("--pull", v.toFixed(3));
      const r = c.querySelector(".reader");
      if (r) {
        r.classList.toggle("in", v > 0.02);
        const was = r.classList.contains("ready"), isReady = v >= DONE;
        r.classList.toggle("ready", isReady);
        if (isReady && !was) document.dispatchEvent(new CustomEvent("reader-approved"));
      }
      if (t < 1) requestAnimationFrame(step); else finish();
    };
    requestAnimationFrame(step);
  }

  // Card click or tap. Desktop runs the scanner; touch, narrow and reduced motion get the dip:
  // the card dips, the terminal beeps, then the stripe link opens the project.
  function openCard(c, l) {
    c.style.setProperty("--rx", "0deg");
    c.style.setProperty("--ry", "0deg");
    if (desktop() && !still()) { scan(c, l); return; }
    busy = true;
    c.classList.add("dip");
    document.dispatchEvent(new CustomEvent("reader-approved"));
    setTimeout(() => {
      l.click();
      setTimeout(() => { busy = false; c.classList.remove("dip"); }, 500);
    }, still() ? 0 : 200);
  }
})();
