(() => {
  const KEY = "been-here-v1";
  const host = document.querySelector(".side-links");
  if (!host) return;

  const wrap = document.createElement("div");
  wrap.className = "been";
  wrap.innerHTML = `
    <button class="been-btn" type="button" aria-label="Tap if you are here">
      <svg class="been-mascot" viewBox="0 0 120 120" aria-hidden="true">
        <g class="body">
          <circle cx="60" cy="62" r="39" fill="#f7bd2e" stroke="#14110d" stroke-width="6"/>
          <ellipse cx="34" cy="46" rx="9" ry="3.6" fill="#fff" opacity=".1" transform="rotate(-62 34 46)"/>
          <g transform="translate(60 62) scale(.9) translate(-60 -62)">
            <g class="eyes">
              <ellipse class="blink" cx="48" cy="48" rx="4.2" ry="9.6" fill="#14110d" stroke="#14110d" stroke-width="1"/>
              <ellipse class="blink" cx="71" cy="48" rx="4.2" ry="9.6" fill="#14110d" stroke="#14110d" stroke-width="1"/>
            </g>
            <path d="M40.5 81.7L40.5 79.3L40.5 76.8L40.5 74.3L40.4 73.1L40.2 72.0L39.8 71.2L39.2 70.7L38.5 70.4L38.1 70.3L37.7 70.3L37.4 70.5L37.1 70.7L36.8 71.0L36.6 71.4L36.4 71.8L36.3 72.3L36.2 72.9L36.2 73.5L36.2 75.9L36.2 78.3L36.2 80.6L32.7 79.6L32.7 77.0L32.7 74.5L32.7 71.9L32.7 69.3L32.7 68.9L32.7 68.5L32.7 68.2L32.7 67.9L32.7 67.6L32.7 67.3L32.7 67.1L32.7 66.8L32.6 66.6L32.6 66.3L35.9 67.3L35.9 67.5L35.9 67.7L35.9 67.9L36.0 68.2L36.0 68.6L36.0 69.0L36.0 69.3L36.0 69.6L36.1 69.8L36.1 70.0L36.1 70.0L36.4 69.5L36.7 69.1L37.0 68.8L37.3 68.5L37.7 68.3L38.1 68.1L38.5 68.0L39.0 68.0L39.4 68.1L39.9 68.1L41.1 68.5L42.0 69.1L42.7 69.8L43.3 70.7L43.6 71.8L43.7 71.8L44.0 71.3L44.3 70.9L44.6 70.5L44.9 70.2L45.3 69.9L45.7 69.8L46.1 69.6L46.6 69.6L47.1 69.6L47.7 69.6L48.4 69.8L49.1 70.0L49.7 70.4L50.2 70.8L50.6 71.3L51.0 71.9L51.3 72.6L51.5 73.4L51.6 74.3L51.7 75.2L51.7 78.0L51.7 80.8L51.7 83.6L48.2 83.2L48.2 80.7L48.2 78.2L48.2 75.8L48.2 74.5L47.9 73.5L47.5 72.7L47.0 72.2L46.2 72.0L45.9 72.0L45.5 72.0L45.2 72.2L44.9 72.4L44.6 72.7L44.4 73.0L44.2 73.5L44.0 74.0L44.0 74.6L43.9 75.2L43.9 77.6L43.9 80.0L43.9 82.5ZM54.8 68.3L54.8 65.7L58.3 65.9L58.3 68.4ZM54.8 83.8L54.8 81.2L54.8 78.6L54.8 75.9L54.8 73.3L54.8 70.6L58.3 70.8L58.3 73.4L58.3 76.1L58.3 78.7L58.3 81.3L58.3 84.0ZM67.2 83.9L66.1 84.0L65.0 83.8L64.1 83.5L63.3 83.0L62.6 82.4L62.0 81.7L61.5 80.8L61.2 79.8L61.0 78.7L60.9 77.5L61.0 76.2L61.2 75.1L61.5 74.1L62.0 73.1L62.6 72.3L63.3 71.7L64.1 71.1L65.0 70.7L66.1 70.4L67.2 70.2L68.2 70.2L69.0 70.3L69.8 70.4L70.5 70.6L71.1 71.0L71.7 71.4L72.1 71.9L72.5 72.5L72.8 73.2L73.0 73.9L69.6 74.6L69.5 74.2L69.4 73.9L69.2 73.6L69.1 73.3L68.8 73.0L68.6 72.9L68.3 72.7L68.0 72.6L67.6 72.6L67.2 72.6L66.2 72.9L65.5 73.4L65.0 74.4L64.6 75.6L64.5 77.2L64.6 78.9L65.0 80.1L65.5 81.0L66.3 81.5L67.2 81.6L67.6 81.5L68.0 81.4L68.3 81.3L68.6 81.1L68.9 80.8L69.1 80.5L69.3 80.2L69.5 79.8L69.6 79.4L69.7 78.9L73.1 78.6L73.0 79.1L72.9 79.7L72.7 80.2L72.4 80.7L72.2 81.1L71.8 81.6L71.4 82.0L71.0 82.4L70.6 82.7L70.1 83.1L69.6 83.3L69.0 83.6L68.4 83.7L67.8 83.9L67.2 83.9ZM88.0 72.7L88.0 74.0L87.8 75.2L87.4 76.3L86.9 77.3L86.3 78.3L85.5 79.2L84.6 80.0L83.6 80.6L82.5 81.2L81.3 81.5L80.2 81.8L79.1 81.8L78.1 81.6L77.2 81.3L76.5 80.8L75.9 80.1L75.4 79.3L75.0 78.4L74.8 77.3L74.7 76.1L74.8 74.9L75.0 73.7L75.4 72.6L75.9 71.7L76.5 70.8L77.2 70.0L78.1 69.3L79.1 68.7L80.2 68.2L81.4 67.8L82.6 67.6L83.8 67.5L84.7 67.6L85.6 67.8L86.3 68.2L87.0 68.8L87.4 69.5L87.8 70.4L88.0 71.5L88.0 72.7ZM84.5 73.8L84.4 73.0L84.3 72.2L84.2 71.6L84.0 71.0L83.7 70.6L83.4 70.3L83.0 70.2L82.5 70.1L82.0 70.1L81.5 70.2L80.3 70.6L79.5 71.4L78.8 72.4L78.5 73.7L78.3 75.4L78.4 76.2L78.5 77.0L78.6 77.6L78.8 78.1L79.1 78.6L79.4 78.9L79.8 79.2L80.3 79.3L80.7 79.3L81.3 79.2L82.4 78.7L83.3 77.9L84.0 76.9L84.3 75.5L84.5 73.8Z" fill="#14110d" stroke="#14110d" stroke-width="1" stroke-linejoin="round" transform="translate(60 76) scale(.92) translate(-60 -76)"/>
          </g>
        </g>
      </svg>
    </button>
    <p class="been-text"><span class="been-line"></span><span class="been-count" aria-live="polite"></span></p>`;
  host.insertAdjacentElement("afterend", wrap);

  const btn = wrap.querySelector(".been-btn");
  const line = wrap.querySelector(".been-line");
  const cnt = wrap.querySelector(".been-count");
  const eyes = wrap.querySelector(".eyes");
  const fmt = n => Number(n).toLocaleString("en-US");

  let tapped = false, busy = false;
  try { tapped = localStorage.getItem(KEY) === "1"; } catch (e) {}
  line.textContent = tapped ? "welcome back! tap again" : "tap if you are here!";

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

  call("/").then(render).catch(() => {});

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
    if (tapped) { line.textContent = "welcome back! tap again"; return; }
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
