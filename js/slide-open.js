(() => {
  const LINK = ".projects-grid .item .meta li:first-child a";
  const CARD = ".projects-grid .item";
  const DIST = 150, DONE = .85;
  const desktop = () => matchMedia("(min-width: 40rem) and (pointer: fine)").matches;
  const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const linkOf = c => c.querySelector(".meta li:first-child a");
  let card = null, link = null, startX = 0, pull = 0;
  let dragging = false, busy = false;

  // Block real pointer clicks on the stripe; keyboard and script clicks (detail 0) pass through.
  document.addEventListener("click", e => {
    const l = e.target.closest && e.target.closest(LINK);
    if (l && e.detail > 0) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);

  // Stop the browser's native link drag, which would cancel our pointer events.
  document.addEventListener("dragstart", e => {
    if (e.target.closest && e.target.closest(CARD)) e.preventDefault();
  }, true);

  function showReader(c) {
    let r = c.querySelector(".reader");
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
    r.classList.remove("in", "ready");
    setTimeout(() => r.remove(), 650);
  }

  function apply() {
    card.style.setProperty("--pull", pull.toFixed(3));
    const r = card.querySelector(".reader");
    if (r) {
      const was = r.classList.contains("ready"), now = pull >= DONE;
      r.classList.toggle("ready", now);
      if (now && !was) document.dispatchEvent(new CustomEvent("reader-approved"));
    }
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
    sheet.append(mk("i", "r-smile"), mk("em", "", "APPROVED"), mk("i", "r-line"), mk("b", "", name), mk("span", "r-thanks", "THANK YOU"), mk("i", "r-tear"));
    wrap.appendChild(sheet);
    r.append(mk("span", "r-slot"), wrap);
    document.dispatchEvent(new CustomEvent("reader-receipt"));
    return true;
  }

  // Leaving an overview: the card is already pulled in with the reader and receipt out, then the receipt feeds back and the card springs free.
  window.retractReceipt = function (path) {
    if (!desktop() || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const want = path.replace(/\/+$/, "");
    const a = Array.from(document.querySelectorAll(".projects-grid .item a")).find(x => (x.getAttribute("href") || "").replace(/\/+$/, "") === want);
    const c = a && a.closest(".projects-grid .item");
    if (!c || c.querySelector(".reader")) return;
    document.addEventListener("reader-receipt", e => e.stopImmediatePropagation(), { capture: true, once: true });
    const rd = document.createElement("div");
    rd.className = "reader in ready";
    rd.setAttribute("aria-hidden", "true");
    rd.style.transition = "none";
    rd.innerHTML = '<span class="r-screen"></span><span class="r-keys"></span>';
    rd.style.transform = "translateX(calc(var(--reader-travel) * -1))";
    c.appendChild(rd);
    if (!printReceipt(c)) return;
    const s = c.querySelector(".r-sheet");
    if (!s) return;
    s.style.animation = "none";
    s.style.transform = "none";
    setTimeout(() => {
      rd.style.transition = "";
      const an = s.animate([{ transform: "none" }, { transform: "translateX(-100%)" }], { duration: 800, easing: "steps(12, end)", fill: "forwards" });
      document.dispatchEvent(new CustomEvent("reader-receipt"));
      an.onfinish = () => setTimeout(() => hideReader(c), 200);
    }, 300);
  };

  function release(c, l) {
    l.classList.remove("drag");
    c.classList.remove("pulling");
    c.classList.add("spring");
    c.style.setProperty("--pull", "0");
    hideReader(c);
    setTimeout(() => c.classList.remove("spring"), 650);
  }

  document.addEventListener("pointerdown", e => {
    if (busy || !e.target.closest) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (!desktop()) return;
    const c = e.target.closest(CARD);
    if (!c) return;
    // Links and buttons keep working, except the stripe, which now starts the card drag.
    if (e.target.closest("a, button") && !e.target.closest(LINK)) return;
    const l = linkOf(c);
    if (!l) return;
    card = c; link = l; startX = e.clientX; pull = 0; dragging = false;
    l.setAttribute("draggable", "false");
    try { c.setPointerCapture(e.pointerId); } catch (_) {}
  });

  document.addEventListener("pointermove", e => {
    if (!card) return;
    const dx = e.clientX - startX;
    if (!dragging) {
      if (Math.abs(dx) < 6) return;
      dragging = true;
      link.classList.add("drag");
      card.classList.add("pulling");
      showReader(card);
    }
    pull = Math.min(1, Math.max(0, dx / DIST));
    apply();
  });

  function end(e) {
    if (!card) return;
    const c = card, l = link, was = dragging, done = pull >= DONE;
    card = null; link = null; dragging = false;
    if (e.type === "pointercancel") { if (was) release(c, l); return; }
    if (was && done) {
      busy = true;
      l.classList.remove("drag");
      c.style.setProperty("--pull", "1");
      const receipt = !still() && printReceipt(c);
      setTimeout(() => {
        l.click();
        setTimeout(() => { busy = false; release(c, l); }, 500);
      }, still() ? 0 : (receipt ? 1100 : 260));
    } else if (was) {
      release(c, l);
    }
  }
  document.addEventListener("pointerup", end);
  document.addEventListener("pointercancel", end);

  // Phones: the gold chip is a real button. Tap it and the card dips, then the project opens.
  function ensureChips() {
    document.querySelectorAll(CARD + " .item-top").forEach(t => {
      if (t.querySelector(".chip-btn")) return;
      const name = (t.closest(CARD).querySelector("h3") || {}).textContent || "project";
      const b = document.createElement("button");
      b.type = "button"; b.className = "chip-btn";
      b.setAttribute("aria-label", "Open " + name.trim());
      t.appendChild(b);
    });
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
  function ensureAll() { ensureChips(); ensureSheen(); }
  ensureAll();
  new MutationObserver(ensureAll).observe(document.documentElement, { childList: true, subtree: true });

  document.addEventListener("click", e => {
    const b = e.target.closest && e.target.closest(".chip-btn");
    if (!b || busy) return;
    const c = b.closest(CARD), l = c && linkOf(c);
    if (!l) return;
    e.preventDefault();
    busy = true;
    c.classList.add("dip");
    document.dispatchEvent(new CustomEvent("reader-approved"));
    setTimeout(() => {
      l.click();
      setTimeout(() => { busy = false; c.classList.remove("dip"); }, 500);
    }, still() ? 0 : 320);
  });
})();
