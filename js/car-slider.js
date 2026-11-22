(() => {
  const CL = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>';
  const CR = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';

  const cur = s => Math.round(s.scrollLeft / (s.clientWidth || 1));
  function paint(c) {
    const s = c.querySelector(".slides");
    if (s && c._num) c._num.textContent = (cur(s) + 1) + " / " + s.children.length;
  }

  function step(c, d) {
    const btns = Array.from(c.querySelectorAll(".car-btn"));
    const next = btns.find(b => b.classList.contains("next"));
    const prev = btns.find(b => b !== next);
    const b = d > 0 ? next : prev;
    if (b) { b.click(); return; }
    const s = c.querySelector(".slides");
    if (s) s.scrollBy({ left: d * s.clientWidth, behavior: "smooth" });
  }

  function build(c) {
    if (c._sl) return;
    const s = c.querySelector(".slides");
    if (!s || s.children.length < 2) return;
    c._sl = true;
    const w = document.createElement("div");
    w.className = "car-slider";
    w.innerHTML =
      '<button type="button" class="cs-key" aria-label="Previous screenshot">' + CL + "</button>" +
      '<span class="cs-num" aria-hidden="true"></span>' +
      '<button type="button" class="cs-key" aria-label="Next screenshot">' + CR + "</button>";
    c.insertAdjacentElement("afterend", w);
    c._num = w.querySelector(".cs-num");
    const [prev, next] = w.querySelectorAll(".cs-key");
    prev.addEventListener("click", () => step(c, -1));
    next.addEventListener("click", () => step(c, 1));
    paint(c);
  }

  function scan() { document.querySelectorAll(".carousel").forEach(build); }
  scan();
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  window.addEventListener("load", scan);
  window.addEventListener("pageshow", scan);
  setTimeout(scan, 300);
  document.addEventListener("scroll", e => {
    const t = e.target;
    if (t && t.classList && t.classList.contains("slides")) {
      const c = t.closest(".carousel");
      if (c) paint(c);
    }
  }, true);
})();
