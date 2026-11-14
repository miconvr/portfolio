(() => {
  const SEL = "a[href], button, summary, [role=button]";
  let on = true;

  let ctx = null, master = null, noise = null;
  function init() {
    if (ctx) { if (ctx.state === "suspended") ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = .55; master.connect(ctx.destination);
    noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * .06), ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  // vol: loudness, freq: noise brightness, thump: low body in Hz (0 = none), len: seconds
  function clack(vol, freq, thump, len) {
    if (!on || !ctx || ctx.state !== "running") return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource(); src.buffer = noise;
    const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = freq; f.Q.value = 1.1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(.0001, t + len);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t); src.stop(t + len);
    if (thump) {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(thump, t);
      o.frequency.exponentialRampToValueAtTime(thump * .45, t + len);
      og.gain.setValueAtTime(vol * .9, t);
      og.gain.exponentialRampToValueAtTime(.0001, t + len);
      o.connect(og); og.connect(master);
      o.start(t); o.stop(t + len);
    }
  }
  // Mechanical-key thock: pitched-down sine body + short filtered snap
  function thock(vol, body, snap, len) {
    if (!on || !ctx || ctx.state !== "running") return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator(), og = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(body, t);
    o.frequency.exponentialRampToValueAtTime(body * .5, t + len);
    og.gain.setValueAtTime(.0001, t);
    og.gain.linearRampToValueAtTime(vol, t + .003);
    og.gain.exponentialRampToValueAtTime(.0001, t + len);
    o.connect(og); og.connect(master);
    o.start(t); o.stop(t + len + .01);
    const src = ctx.createBufferSource(); src.buffer = noise;
    const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = snap; f.Q.value = 2.5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol * .5, t);
    g.gain.exponentialRampToValueAtTime(.0001, t + .03);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t); src.stop(t + .04);
  }
  const down = () => thock(.3, 140 + Math.random() * 20, 2200 + Math.random() * 300, .11);
  const up   = () => thock(.12, 230 + Math.random() * 20, 3600 + Math.random() * 400, .04);
  // Hover tick: crisp click, no low body, one voice at a time
  let tickG = null;
  function tick() {
    if (!on || !ctx || ctx.state !== "running") return;
    const t = ctx.currentTime;
    if (tickG) {
      try {
        tickG.gain.cancelScheduledValues(t);
        tickG.gain.setValueAtTime(Math.max(tickG.gain.value, .0001), t);
        tickG.gain.exponentialRampToValueAtTime(.0001, t + .006);
      } catch (e) {}
    }
    const g = ctx.createGain(); tickG = g;
    g.gain.setValueAtTime(.22, t);
    g.gain.exponentialRampToValueAtTime(.0001, t + .014);
    g.connect(master);
    const src = ctx.createBufferSource(); src.buffer = noise;
    const f = ctx.createBiquadFilter(); f.type = "bandpass";
    f.frequency.value = 3200 + Math.random() * 300; f.Q.value = 3;
    src.connect(f); f.connect(g);
    src.start(t); src.stop(t + .02);
  }

  // Payment-terminal approval: two short rising tones
  function approve() {
    if (!on || !ctx || ctx.state !== "running") return;
    const t = ctx.currentTime;
    [[1046, 0, .09], [1568, .1, .16]].forEach(([hz, at, len]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.value = hz;
      g.gain.setValueAtTime(.0001, t + at);
      g.gain.linearRampToValueAtTime(.2, t + at + .008);
      g.gain.exponentialRampToValueAtTime(.0001, t + at + len);
      o.connect(g); g.connect(master);
      o.start(t + at); o.stop(t + at + len + .01);
    });
  }
  document.addEventListener("reader-approved", approve);

  // Browsers only allow audio after a gesture, so wake the context on the first one.
  ["pointerup", "keydown", "touchend", "click"].forEach(n =>
    window.addEventListener(n, init, { passive: true }));

  let lastHover = 0, lastEl = null;
  document.addEventListener("pointerover", e => {
    if (e.pointerType !== "mouse") return;
    const t = e.target.closest && (e.target.closest(".projects-grid .item") || e.target.closest(SEL));
    if (!t || t === lastEl) return;
    if (e.relatedTarget && t.contains(e.relatedTarget)) return;
    lastEl = t;
    const now = performance.now();
    if (now - lastHover < 130) return;
    lastHover = now;
    tick();
  }, true);
  document.addEventListener("pointerout", e => {
    if (lastEl && !lastEl.contains(e.relatedTarget)) lastEl = null;
  }, true);

  document.addEventListener("pointerdown", e => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    down();
  }, true);
  document.addEventListener("pointerup", () => up(), true);
})();
