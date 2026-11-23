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
        <defs>
          <radialGradient id="heart-g" cx=".5" cy=".45" r=".62" fx=".4" fy=".3">
            <stop offset="0" stop-color="#ee5f64"/>
            <stop offset=".55" stop-color="#e5484d"/>
            <stop offset="1" stop-color="#d8434a"/>
          </radialGradient>
        </defs>
        <g class="body">
          <g class="turn">
            <path d="M60 97C30 77 18 61 18 45C18 33 27 25 38 25C48 25 56 31 60 40C64 31 72 25 82 25C93 25 102 33 102 45C102 61 90 77 60 97Z" class="heart" fill="#e5484d"/>
            <g class="eyes">
              <ellipse class="blink" cx="45" cy="50" rx="4.4" ry="8.4" fill="#14110d"/>
              <ellipse class="blink" cx="75" cy="50" rx="4.4" ry="8.4" fill="#14110d"/>
            </g>
          </g>
        </g>
      </svg>
    </button>
    <p class="been-text"><span class="been-line"></span><span class="been-count" aria-live="polite"></span><span class="been-credit">designed and built by mico</span></p>`;
  host.insertAdjacentElement("afterend", wrap);

  const btn = wrap.querySelector(".been-btn");
  const line = wrap.querySelector(".been-line");
  const cnt = wrap.querySelector(".been-count");
  const eyes = wrap.querySelector(".eyes");
  const turn = wrap.querySelector(".turn");
  const grad = wrap.querySelector("#heart-g");
  // nx, ny in -1..1. Eyes lead, the body (.turn) follows a beat later via its CSS transition.
  function aim(nx, ny) {
    eyes.style.transform = `translate(${nx * 3.4}px, ${ny * 2.4}px)`;
    turn.style.transform = `translate(${nx * 2.4}px, ${ny * 1.8}px) rotate(${nx * 6}deg) scale(${1 - Math.abs(nx) * .06}, ${1 - Math.abs(ny) * .04})`;
    grad.setAttribute("fx", (.4 + nx * .12).toFixed(3));
    grad.setAttribute("fy", (.3 + ny * .12).toFixed(3));
  }
  window.beenAim = aim;
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
    const b = document.body.getBoundingClientRect();
    if (px < b.left || px > b.right) { aim(0, 0); return; }
    const r = btn.getBoundingClientRect();
    const dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 2);
    const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 80);
    aim((dx / d) * k, (dy / d) * k);
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
    const wr = wrap.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(line);
    const rects = range.getClientRects();
    const tr = rects.length ? rects[rects.length - 1] : line.getBoundingClientRect();
    p.style.left = (tr.right - wr.left + 6) + "px";
    p.style.top = (tr.top - wr.top + tr.height / 2) + "px";
    p.style.translate = "0 -50%";
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
