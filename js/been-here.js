(() => {
  const KEY = "been-here-v1";
  const host = document.querySelector(".side-links");
  if (!host) return;

  const wrap = document.createElement("div");
  wrap.className = "been";
  // Cold start: stay hidden until the first count arrives (or 800ms), then fade in once, already complete.
  const cold = document.documentElement.classList.contains("js");
  const reveal = () => wrap.classList.remove("been-wait");
  if (cold) { wrap.classList.add("been-wait"); setTimeout(reveal, 800); }
  wrap.innerHTML = `
    <button class="been-btn" type="button" aria-label="Tap if you are here">
      <svg class="been-mascot" viewBox="0 0 120 120" aria-hidden="true">
        <g class="body">
          <path d="M60 99C27 77 15 55 17 40C19 26 31 19 42 21C51 23 57 29 60 36C63 29 69 23 78 21C89 19 101 26 103 40C105 55 93 77 60 99Z" fill="#e5484d" stroke="#14110d" stroke-width="6" stroke-linejoin="round"/>
          <g class="eyes">
            <ellipse class="blink" cx="48" cy="52" rx="4.2" ry="9" fill="#14110d" stroke="#14110d" stroke-width="1"/>
            <ellipse class="blink" cx="72" cy="52" rx="4.2" ry="9" fill="#14110d" stroke="#14110d" stroke-width="1"/>
          </g>
        </g>
      </svg>
    </button>
    <p class="been-text"><span class="been-line"></span><span class="been-count" aria-live="polite"></span><span class="been-credit">designed and built by mico</span><span class="been-credit been-credit-sub">inspired by drew house</span></p>`;
  host.insertAdjacentElement("afterend", wrap);

  const btn = wrap.querySelector(".been-btn");
  const line = wrap.querySelector(".been-line");
  const cnt = wrap.querySelector(".been-count");
  const eyes = wrap.querySelector(".eyes");
  const fmt = n => Number(n).toLocaleString("en-US");

  let tapped = false, busy = false;
  try { tapped = localStorage.getItem(KEY) === "1"; } catch (e) {}
  line.textContent = tapped ? "welcome back!" : "tap if you are here!";

  async function call(path) {
    const r = await fetch("/api/hi", { method: path === "/up" ? "POST" : "GET", cache: "no-store" });
    if (!r.ok) throw new Error("http " + r.status);
    const n = Number((await r.json()).count);
    if (!Number.isFinite(n)) throw new Error("bad response");
    return n;
  }
  function render(n) {
    cnt.textContent = n + "" === "0" ? "" : `${fmt(n)} ${n === 1 ? "person has" : "people have"} said hi`;
  }

  call("/").then(render).catch(() => {}).then(reveal);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let px = 0, py = 0, raf = 0;
  function look() {
    raf = 0;
    const r = btn.getBoundingClientRect();
    const dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 2);
    const d = Math.hypot(dx, dy) || 1, k = Math.min(1.5, d / 100);
    eyes.style.transform = `translate(${(dx / d) * k}px, ${(dy / d) * k}px)`;
  }
  window.addEventListener("pointermove", e => {
    if (reduceMotion.matches) return;
    px = e.clientX; py = e.clientY;
    if (!raf) raf = requestAnimationFrame(look);
  }, { passive: true });

  const mascot = wrap.querySelector(".been-mascot");
  let spinning = false, spinTimer = 0;
  function spin() {
    if (spinning || reduceMotion.matches) return;
    spinning = true;
    btn.classList.add("been-pop");
    const onEnd = e => { if (e.target === mascot) done(); };
    const done = () => {
      clearTimeout(spinTimer);
      mascot.removeEventListener("animationend", onEnd);
      btn.classList.remove("been-pop");
      spinning = false;
    };
    mascot.addEventListener("animationend", onEnd);
    spinTimer = setTimeout(done, 1000);
  }
  function plusOne() {
    const p = document.createElement("span");
    p.className = "been-plus";
    p.textContent = "+1";
    wrap.appendChild(p);
    setTimeout(() => p.remove(), 1200);
  }

  btn.addEventListener("click", async () => {
    spin();
    if (tapped) { line.textContent = "welcome back!"; return; }
    if (busy) return;
    busy = true;
    line.textContent = "hi! thanks for stopping by";
    try {
      const n = await call("/up");
      tapped = true;
      try { localStorage.setItem(KEY, "1"); } catch (e) {}
      line.textContent = `hi! you're #${fmt(n)}`;
      render(n);
      plusOne();
    } catch (e) {
      line.textContent = "hi! (counter is asleep, try later)";
    }
    busy = false;
  });
})();
