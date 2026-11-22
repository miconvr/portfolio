(() => {
  const SEL = "a[href], button, summary, [role=button]";
  const KEY = "sound-v1";
  let on = true;
  try { on = localStorage.getItem(KEY) !== "off"; } catch (e) {}
  let quietUntil = 0;
  const quiet = () => window.__retracting || performance.now() < quietUntil;

  let ctx = null, master = null, noise = null;
  function wake() {
    if (!ctx || ctx.state === "running" || ctx.state === "closed") return Promise.resolve();
    return ctx.resume().then(() => {
      const s = ctx.createBufferSource();
      s.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
      s.connect(ctx.destination);
      s.start(0);
    }).catch(() => {});
  }
  function init() {
    if (ctx) { wake(); return; }
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
    if (quiet()) return;
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
  // Hover tick: crisp click, no low body, one voice at a time
  let tickG = null;
  function tick() {
    if (quiet()) return;
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
  let lastApprove = 0;
  function approve() {
    if (quiet()) return;
    const nowMs = performance.now();
    if (nowMs - lastApprove < 700) return;
    lastApprove = nowMs;
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

  // Receipt printer: one soft tick per paper-feed step (12 steps over .4s), then a faint ding
  function printer() {
    quietUntil = performance.now() + 800;
    if (!on || !ctx || ctx.state !== "running") return;
    const t = ctx.currentTime;
    for (let i = 1; i <= 12; i++) {
      const at = t + i * (.4 / 12);
      const src = ctx.createBufferSource(); src.buffer = noise;
      const f = ctx.createBiquadFilter(); f.type = "bandpass";
      f.frequency.value = 2200 + Math.random() * 900; f.Q.value = 2;
      const g = ctx.createGain();
      g.gain.setValueAtTime(.16, at);
      g.gain.exponentialRampToValueAtTime(.0001, at + .016);
      src.connect(f); f.connect(g); g.connect(master);
      src.start(at); src.stop(at + .02);
    }
    const o = ctx.createOscillator(), og = ctx.createGain(), d = t + .44;
    o.type = "sine"; o.frequency.value = 2093;
    og.gain.setValueAtTime(.0001, d);
    og.gain.linearRampToValueAtTime(.11, d + .006);
    og.gain.exponentialRampToValueAtTime(.0001, d + .09);
    o.connect(og); og.connect(master);
    o.start(d); o.stop(d + .1);
  }
  document.addEventListener("reader-receipt", printer);

  // Mute button: fixed bottom-right on every page, state remembered in localStorage.
  const ICON_ON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  const ICON_OFF = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/></svg>';
  const snd = document.createElement("button");
  snd.type = "button";
  snd.className = "snd";
  function paint() {
    snd.innerHTML = on ? ICON_ON : ICON_OFF;
    snd.classList.toggle("off", !on);
    const label = on ? "Mute sound" : "Unmute sound";
    snd.setAttribute("aria-label", label);
    snd.title = label;
  }
  paint();
  snd.addEventListener("click", () => {
    on = !on;
    try { localStorage.setItem(KEY, on ? "on" : "off"); } catch (e) {}
    paint();
    if (on) wake().then(down); // one thock confirms sound is back
  });
  document.body.appendChild(snd);

  init(); // Browsers only allow audio after a gesture: build the context now, wake it on the first one.
  ["pointerdown", "keydown", "touchstart", "pointerup", "touchend", "click"].forEach(n =>
    window.addEventListener(n, init, { passive: true, capture: true }));

  // Backgrounded tabs suspend the context. Wake it before the next press.
  document.addEventListener("visibilitychange", () => { if (!document.hidden) wake(); });
  window.addEventListener("focus", wake);
  document.addEventListener("pointerover", wake, { passive: true });

  let lastHover = 0, lastEl = null;
  document.addEventListener("pointerover", e => {
    if (e.pointerType !== "mouse") return;
    const t = e.target.closest && (e.target.closest(".projects-grid .item .meta li+li a") || e.target.closest(".projects-grid .item") || e.target.closest(SEL));
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
    if (e.target.closest && e.target.closest(".snd")) return; // the mute button makes its own sound
    if (ctx && ctx.state !== "running") { wake().then(down); return; }
    down();
  }, true);
})();
