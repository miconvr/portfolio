(() => {
  const PAD = 4;
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
      '<button type="button" class="cs-end" aria-label="Previous screenshot">' + CL + "</button>" +
      '<div class="cs-knob" aria-hidden="true"><span class="cs-num"></span></div>' +
      '<button type="button" class="cs-end" aria-label="Next screenshot">' + CR + "</button>";
    c.insertAdjacentElement("afterend", w);
    c._num = w.querySelector(".cs-num");
    const [prev, next] = w.querySelectorAll(".cs-end");
    prev.addEventListener("click", () => step(c, -1));
    next.addEventListener("click", () => step(c, 1));

    const knob = w.querySelector(".cs-knob");
    let startX = 0, x = 0, max = 0, active = false, dragging = false;
    knob.addEventListener("pointerdown", e => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      active = true; dragging = false; startX = e.clientX; x = 0;
      max = Math.max(0, (w.clientWidth - knob.offsetWidth) / 2 - PAD);
      try { knob.setPointerCapture(e.pointerId); } catch (_) {}
    });
    knob.addEventListener("pointermove", e => {
      if (!active) return;
      const dx = e.clientX - startX;
      if (!dragging && Math.abs(dx) > 4) { dragging = true; w.classList.add("drag"); }
      if (!dragging) return;
      x = Math.min(max, Math.max(-max, dx));
      w.style.setProperty("--x", x + "px");
    });
    function end(e) {
      if (!active) return;
      active = false;
      w.classList.remove("drag");
      const hit = e.type === "pointerup" && dragging && max && Math.abs(x) >= max * .85;
      const dir = x > 0 ? 1 : -1;
      w.style.setProperty("--x", "0px");
      if (hit) step(c, dir);
      dragging = false;
    }
    knob.addEventListener("pointerup", end);
    knob.addEventListener("pointercancel", end);
    paint(c);
  }

  function scan() { document.querySelectorAll(".carousel").forEach(build); }
  scan();
  new MutationObserver(scan).observe(document.getElementById("main") || document.body, { childList: true, subtree: true });
  document.addEventListener("scroll", e => {
    const t = e.target;
    if (t && t.classList && t.classList.contains("slides")) {
      const c = t.closest(".carousel");
      if (c) paint(c);
    }
  }, true);
})();
