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
    if (r && (r.classList.contains("thanks") || r.querySelector(".r-paper"))) { r.remove(); r = null; }
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

  function printReceipt(c) {
    const r = c.querySelector(".reader");
    if (!r || r.querySelector(".r-paper")) return false;
    const mk = (tag, cls, txt) => {
      const n = document.createElement(tag);
      if (cls) n.className = cls;
      if (txt) n.textContent = txt;
      return n;
    };
    const name = ((c.querySelector("h3") || {}).textContent || "Project").trim();
    const num = (c.textContent.match(/\b0\d\b/) || [""])[0];
    const wrap = mk("div", "r-paper");
    wrap.setAttribute("aria-hidden", "true");
    const sheet = mk("div", "r-sheet");
    sheet.append(mk("i", "r-heart"), mk("em", "", "APPROVED"), mk("i", "r-line"), mk("b", "", name), mk("span", "r-thanks", "THANK YOU"), mk("i", "r-tear"));
    wrap.appendChild(sheet);
    r.append(mk("span", "r-slot"), wrap);
    document.dispatchEvent(new CustomEvent("reader-receipt"));
    return true;
  }

  // Leaving an overview: card starts pulled in with the paper out, slides back to its spot, then the machine retrieves the paper.
  window.retractReceipt = function (path) {
    if (!desktop() || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const want = path.replace(/\/+$/, "");
    const a = Array.from(document.querySelectorAll(".projects-grid .item a")).find(x => (x.getAttribute("href") || "").replace(/\/+$/, "") === want);
    const c = a && a.closest(".projects-grid .item");
    if (!c || c.querySelector(".reader")) return;
    document.addEventListener("reader-receipt", e => e.stopImmediatePropagation(), { capture: true, once: true });
    const rd = document.createElement("div");
    rd.className = "reader in ready thanks";
    rd.setAttribute("aria-hidden", "true");
    rd.style.transition = "none";
    rd.innerHTML = '<span class="r-screen"></span><span class="r-keys"></span>';
    c.classList.add("pulling");
    c.classList.add("retract-hold");
    c.style.setProperty("--pull", "1");
    c.appendChild(rd);
    if (!printReceipt(c)) return;
    const s = c.querySelector(".r-sheet");
    if (!s) return;
    s.style.animation = "none";
    s.style.transform = "none";
    window.__retracting = true; setTimeout(() => { window.__retracting = false; }, 2000);
    const feed = () => {
      rd.style.transition = "";
      const an = s.animate([{ transform: "none" }, { transform: "translateX(-100%)" }], { duration: 600, easing: "steps(12, end)", fill: "forwards" });
      document.dispatchEvent(new CustomEvent("reader-receipt"));
      an.onfinish = () => setTimeout(() => { hideReader(c); window.__retracting = false; setTimeout(() => c.classList.remove("retract-hold"), 700); }, 100);
    };
    setTimeout(() => {
      const t0 = performance.now(), D = 480;
      const step = now => {
        if (!c.isConnected) return;
        const t = Math.min(1, (now - t0) / D), k = t - 1;
        c.style.setProperty("--pull", (1 - (1 + 2.8 * k * k * k + 1.8 * k * k)).toFixed(3));
        if (t < 1) { requestAnimationFrame(step); return; }
        c.classList.remove("pulling");
        c.style.setProperty("--pull", "0");
        setTimeout(feed, 60);
      };
      requestAnimationFrame(step);
    }, 100);
  };

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
  function ensureAll() { ensureSheen(); }
  ensureAll();
  // Cards only get swapped in through #main (home.js sets main.innerHTML), so watch just that, not the whole document.
  const main = document.getElementById("main");
  if (main) new MutationObserver(ensureAll).observe(main, { childList: true });

  // A click on desktop runs the scanner like a finished swipe: the card slides in as --pull eases to 1,
  // the reader goes green and beeps at 85%, the receipt prints, then the stripe link opens the project.
  function scan(c, l) {
    busy = true;
    c.classList.remove("spring");
    c.classList.add("pulling");
    l.classList.add("drag");
    showReader(c);
    const t0 = performance.now(), D = 240;
    const finish = () => {
      l.classList.remove("drag");
      c.style.setProperty("--pull", "1");
      const receipt = printReceipt(c);
      setTimeout(() => {
        l.click();
        setTimeout(() => { busy = false; release(c, l); }, 500);
      }, receipt ? 800 : 160);
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
