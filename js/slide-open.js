(() => {
  const SEL = ".projects-grid .item .meta li:first-child a";
  const PAD = 4;

  // Foil rip + pop, synthesized (own AudioContext, created on the first press)
  let ac = null, rip = null;
  function audio() {
    if (!ac) { const AC = window.AudioContext || window.webkitAudioContext; if (AC) ac = new AC(); }
    if (ac && ac.state === "suspended") ac.resume();
  }
  function ripStart() {
    if (!ac || ac.state !== "running" || rip) return;
    const buf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = ac.createBufferSource(); s.buffer = buf; s.loop = true;
    const f = ac.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 2200; f.Q.value = .8;
    const g = ac.createGain(); g.gain.value = 0;
    s.connect(f); f.connect(g); g.connect(ac.destination); s.start();
    rip = { s, f, g, last: 0 };
  }
  function ripMove(x, max) {
    if (!rip) return;
    const t = ac.currentTime, v = Math.abs(x - rip.last);
    rip.last = x;
    rip.g.gain.setTargetAtTime(Math.min(.22, v * .02), t, .02);
    rip.f.frequency.setTargetAtTime(1800 + 3200 * (x / (max || 1)), t, .03);
  }
  function ripStop() {
    if (!rip) return;
    const r = rip; rip = null; const t = ac.currentTime;
    r.g.gain.setTargetAtTime(0, t, .03); r.s.stop(t + .2);
  }
  function pop() {
    if (!ac || ac.state !== "running") return;
    const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(260, t); o.frequency.exponentialRampToValueAtTime(70, t + .12);
    g.gain.setValueAtTime(.35, t); g.gain.exponentialRampToValueAtTime(.0001, t + .14);
    o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + .15);
  }
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
    audio();
    l.setAttribute("draggable", "false");
    try { l.setPointerCapture(e.pointerId); } catch (_) {}
  });

  document.addEventListener("pointermove", e => {
    if (!a) return;
    const dx = e.clientX - startX;
    if (!dragging && Math.abs(dx) > 4) { dragging = true; a.classList.add("drag"); ripStart(); }
    if (!dragging) return;
    x = Math.min(max, Math.max(0, dx));
    a.style.setProperty("--x", x + "px");
    ripMove(x, max);
  });

  function reset(l) {
    ripStop();
    l.classList.remove("drag", "nudge", "burst");
    l.style.setProperty("--x", "0px");
  }

  function end(e) {
    if (!a) return;
    const l = a; a = null;
    if (e.type === "pointercancel") { reset(l); return; }
    if (dragging && max && x >= max * .85) {
      l.classList.remove("drag");
      l.style.setProperty("--x", max + "px");
      ripStop(); pop(); l.classList.add("burst");
      setTimeout(() => { l.click(); setTimeout(() => reset(l), 500); }, 280);
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
