(() => {
  const KEY = "clack-v1";
  const SEL = "a[href], button, summary, [role=button]";
  let on = true;
  try { on = localStorage.getItem(KEY) !== "0"; } catch (e) {}

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
  const down = () => thock(.8, 200 + Math.random() * 30, 2600 + Math.random() * 300, .1);
  const up   = () => thock(.3, 300 + Math.random() * 30, 4200 + Math.random() * 400, .04);
  // Hover tick: deeper blip, one voice at a time (new tick cuts off the old one)
  let tickG = null;
  function tick() {
    if (!on || !ctx || ctx.state !== "running") return;
    const t = ctx.currentTime;
    if (tickG) {
      try {
        tickG.gain.cancelScheduledValues(t);
        tickG.gain.setValueAtTime(Math.max(tickG.gain.value, .0001), t);
        tickG.gain.exponentialRampToValueAtTime(.0001, t + .008);
      } catch (e) {}
    }
    const g = ctx.createGain(); tickG = g;
    g.gain.setValueAtTime(.0001, t);
    g.gain.linearRampToValueAtTime(.22, t + .002);
    g.gain.exponentialRampToValueAtTime(.0001, t + .05);
    g.connect(master);
    const o = ctx.createOscillator();
    o.type = "sine";
    const f0 = 420 + Math.random() * 40;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f0 * .5, t + .05);
    o.connect(g); o.start(t); o.stop(t + .06);
    const src = ctx.createBufferSource(); src.buffer = noise;
    const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 2400; bp.Q.value = 1.5;
    const ng = ctx.createGain(); ng.gain.value = .35;
    src.connect(bp); bp.connect(ng); ng.connect(g);
    src.start(t); src.stop(t + .05);
  }

  // Browsers only allow audio after a gesture, so wake the context on the first one.
  ["pointerdown", "keydown", "touchstart"].forEach(n =>
    window.addEventListener(n, init, { passive: true }));

  let lastHover = 0, lastEl = null;
  document.addEventListener("pointerover", e => {
    if (e.pointerType !== "mouse") return;
    const t = e.target.closest && e.target.closest(SEL);
    if (!t || t === lastEl) return;
    if (e.relatedTarget && t.contains(e.relatedTarget)) return;
    lastEl = t;
    const now = performance.now();
    if (now - lastHover < 130) return;
    lastHover = now;
    tick();
  }, true);
  document.addEventListener("pointerout", e => { if (e.target === lastEl) lastEl = null; }, true);

  document.addEventListener("pointerdown", e => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    down();
  }, true);
  document.addEventListener("pointerup", () => up(), true);

  // Mute toggle
  const b = document.createElement("button");
  b.type = "button"; b.className = "clack-toggle";
  const ICON_ON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  const ICON_OFF = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6M21 9l-5 6"/></svg>';
  function paint() {
    b.innerHTML = on ? ICON_ON : ICON_OFF;
    b.setAttribute("aria-label", on ? "Mute sound effects" : "Turn on sound effects");
    b.setAttribute("aria-pressed", String(on));
  }
  b.addEventListener("click", () => {
    on = !on;
    try { localStorage.setItem(KEY, on ? "1" : "0"); } catch (e) {}
    paint();
  });
  paint();
  document.body.appendChild(b);
})();
