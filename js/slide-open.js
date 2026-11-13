(() => {
  const SEL = ".projects-grid .item .meta li:first-child a";
  const PAD = 4;
  let a = null, startX = 0, x = 0, max = 0, dragging = false;

  // Block real pointer clicks; keyboard and script clicks (detail 0) pass through.
  document.addEventListener("click", e => {
    const l = e.target.closest && e.target.closest(SEL);
    if (l && e.detail > 0) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);

  // Stop the browser's native link drag, which would cancel our pointer events.
  document.addEventListener("dragstart", e => {
    if (e.target.closest && e.target.closest(SEL)) e.preventDefault();
  }, true);

  document.addEventListener("pointerdown", e => {
    const l = e.target.closest && e.target.closest(SEL);
    if (!l || (e.pointerType === "mouse" && e.button !== 0)) return;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const knob = rem * 2.4;
    a = l; startX = e.clientX; x = 0; dragging = false;
    max = Math.max(0, l.clientWidth - knob - PAD * 2);
    l.setAttribute("draggable", "false");
    try { l.setPointerCapture(e.pointerId); } catch (_) {}
  });

  document.addEventListener("pointermove", e => {
    if (!a) return;
    const dx = e.clientX - startX;
    if (!dragging && Math.abs(dx) > 4) { dragging = true; a.classList.add("drag"); }
    if (!dragging) return;
    x = Math.min(max, Math.max(0, dx));
    a.style.setProperty("--x", x + "px");
  });

  function reset(l) {
    l.classList.remove("drag", "nudge");
    l.style.setProperty("--x", "0px");
  }

  function end(e) {
    if (!a) return;
    const l = a; a = null;
    if (e.type === "pointercancel") { reset(l); return; }
    if (dragging && max && x >= max * .85) {
      l.classList.remove("drag");
      l.style.setProperty("--x", max + "px");
      setTimeout(() => { l.click(); setTimeout(() => reset(l), 500); }, 120);
    } else if (dragging) {
      reset(l);
    } else {
      l.classList.remove("nudge"); void l.offsetWidth; l.classList.add("nudge");
      setTimeout(() => l.classList.remove("nudge"), 700);
    }
  }
  document.addEventListener("pointerup", end);
  document.addEventListener("pointercancel", end);
})();
