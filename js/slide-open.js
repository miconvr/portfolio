(() => {
  const LINK = ".projects-grid .item .meta li:first-child a";
  const CARD = ".projects-grid .item";
  const PAD = 4, DIST = 150, DONE = .85;
  const desktop = () => matchMedia("(min-width: 40rem) and (pointer: fine)").matches;
  const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const linkOf = c => c.querySelector(".meta li:first-child a");
  let card = null, link = null, startX = 0, dist = DIST, max = 0, pull = 0;
  let dragging = false, viaKnob = false, busy = false;

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
    link.style.setProperty("--x", (pull * max) + "px");
    const r = card.querySelector(".reader");
    if (r) {
      const was = r.classList.contains("ready"), now = pull >= DONE;
      r.classList.toggle("ready", now);
      if (now && !was) document.dispatchEvent(new CustomEvent("reader-approved"));
    }
  }

  function release(c, l) {
    l.classList.remove("drag", "nudge");
    l.style.setProperty("--x", "0px");
    c.classList.remove("pulling");
    c.classList.add("spring");
    c.style.setProperty("--pull", "0");
    hideReader(c);
    setTimeout(() => c.classList.remove("spring"), 650);
  }

  document.addEventListener("pointerdown", e => {
    if (busy || !e.target.closest) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const c = e.target.closest(CARD);
    if (!c) return;
    const onKnob = !!e.target.closest(LINK);
    if (!onKnob && (!desktop() || e.target.closest("a, button"))) return;
    const l = linkOf(c);
    if (!l) return;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    max = Math.max(0, l.clientWidth - rem * 2.4 - PAD * 2);
    viaKnob = onKnob;
    dist = onKnob ? (max || 1) : DIST;
    card = c; link = l; startX = e.clientX; pull = 0; dragging = false;
    l.setAttribute("draggable", "false");
    try { (onKnob ? l : c).setPointerCapture(e.pointerId); } catch (_) {}
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
    pull = Math.min(1, Math.max(0, dx / dist));
    apply();
  });

  function end(e) {
    if (!card) return;
    const c = card, l = link, was = dragging, done = pull >= DONE, knob = viaKnob;
    card = null; link = null; dragging = false;
    if (e.type === "pointercancel") { if (was) release(c, l); return; }
    if (was && done) {
      busy = true;
      l.classList.remove("drag");
      c.style.setProperty("--pull", "1");
      l.style.setProperty("--x", max + "px");
      setTimeout(() => {
        l.click();
        setTimeout(() => { busy = false; release(c, l); }, 500);
      }, still() ? 0 : 260);
    } else if (was) {
      release(c, l);
    } else if (knob) {
      l.classList.remove("nudge"); void l.offsetWidth; l.classList.add("nudge");
      setTimeout(() => l.classList.remove("nudge"), 700);
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
  ensureChips();
  new MutationObserver(ensureChips).observe(document.documentElement, { childList: true, subtree: true });

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
