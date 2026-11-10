(() => {
  const KEY = "been-here-v1";
  const host = document.querySelector(".side-links");
  if (!host) return;

  const wrap = document.createElement("div");
  wrap.className = "been";
  wrap.innerHTML = `
    <button class="been-btn" type="button" aria-label="Tap if you are here">
      <svg class="been-mascot" viewBox="0 0 120 120" aria-hidden="true">
        <ellipse cx="60" cy="108" rx="21" ry="3" fill="currentColor" opacity=".16"/>
        <g class="body">
          <circle cx="60" cy="62" r="39" fill="#f7bd2e" stroke="#1f1a14" stroke-width="6"/>
          <ellipse cx="43" cy="40" rx="10" ry="4.5" fill="#fff" opacity=".2" transform="rotate(-35 43 40)"/>
          <g transform="translate(60 62) scale(.9) translate(-60 -62)">
            <g class="eyes">
              <ellipse class="blink" cx="48" cy="48" rx="4.6" ry="10" fill="#1f1a14"/>
              <ellipse class="blink" cx="71" cy="48" rx="4.6" ry="10" fill="#1f1a14"/>
            </g>
            <path d="M41.7 81.8L41.7 79.4L41.7 76.9L41.7 74.4L41.6 73.2L41.4 72.1L41.0 71.3L40.4 70.8L39.7 70.4L39.3 70.4L38.9 70.4L38.6 70.5L38.3 70.7L38.0 71.0L37.8 71.4L37.6 71.9L37.5 72.4L37.4 73.0L37.4 73.6L37.4 76.0L37.4 78.3L37.4 80.7L33.9 79.6L33.9 77.0L33.9 74.5L33.9 71.9L33.9 69.4L33.9 68.9L33.9 68.6L33.9 68.2L33.9 67.9L33.9 67.6L33.9 67.3L33.9 67.1L33.9 66.8L33.8 66.6L33.8 66.4L37.1 67.4L37.1 67.5L37.1 67.7L37.1 68.0L37.2 68.3L37.2 68.7L37.2 69.1L37.2 69.4L37.2 69.7L37.3 69.9L37.3 70.1L37.3 70.1L37.6 69.6L37.9 69.2L38.2 68.8L38.5 68.5L38.9 68.3L39.3 68.2L39.7 68.1L40.2 68.1L40.6 68.1L41.1 68.2L42.3 68.6L43.2 69.2L43.9 69.9L44.5 70.8L44.8 71.9L44.9 71.9L45.2 71.4L45.5 71.0L45.8 70.6L46.1 70.3L46.5 70.0L46.9 69.9L47.3 69.7L47.8 69.7L48.3 69.7L48.9 69.7L49.6 69.9L50.3 70.1L50.9 70.5L51.4 70.9L51.8 71.4L52.2 72.0L52.5 72.7L52.7 73.5L52.8 74.3L52.9 75.3L52.9 78.1L52.9 80.9L52.9 83.7L49.4 83.3L49.4 80.8L49.4 78.3L49.4 75.9L49.4 74.6L49.1 73.6L48.7 72.8L48.2 72.3L47.4 72.1L47.1 72.1L46.7 72.1L46.4 72.3L46.1 72.5L45.8 72.8L45.6 73.2L45.4 73.6L45.2 74.1L45.2 74.7L45.1 75.3L45.1 77.7L45.1 80.2L45.1 82.6ZM55.2 68.3L55.2 65.7L58.7 65.9L58.7 68.4ZM55.2 83.9L55.2 81.2L55.2 78.6L55.2 75.9L55.2 73.3L55.2 70.6L58.7 70.8L58.7 73.4L58.7 76.1L58.7 78.7L58.7 81.3L58.7 84.0ZM66.8 83.9L65.7 84.0L64.6 83.8L63.7 83.5L62.9 83.0L62.2 82.4L61.6 81.7L61.1 80.8L60.8 79.8L60.6 78.7L60.5 77.5L60.6 76.2L60.8 75.1L61.1 74.1L61.6 73.1L62.2 72.3L62.9 71.7L63.7 71.1L64.6 70.7L65.7 70.4L66.8 70.2L67.8 70.2L68.6 70.3L69.4 70.4L70.1 70.6L70.7 71.0L71.3 71.4L71.7 71.9L72.1 72.5L72.4 73.2L72.6 73.9L69.2 74.6L69.1 74.2L69.0 73.9L68.8 73.6L68.7 73.3L68.4 73.0L68.2 72.9L67.9 72.7L67.6 72.6L67.2 72.6L66.8 72.6L65.8 72.9L65.1 73.4L64.6 74.4L64.2 75.6L64.1 77.2L64.2 78.9L64.6 80.1L65.1 81.0L65.9 81.5L66.8 81.6L67.2 81.5L67.6 81.4L67.9 81.3L68.2 81.1L68.5 80.8L68.7 80.5L68.9 80.2L69.1 79.8L69.2 79.4L69.3 78.9L72.7 78.6L72.6 79.1L72.5 79.6L72.3 80.2L72.0 80.6L71.8 81.1L71.4 81.6L71.0 82.0L70.6 82.4L70.2 82.7L69.7 83.1L69.2 83.3L68.6 83.6L68.0 83.7L67.4 83.9L66.8 83.9ZM86.8 72.7L86.8 74.0L86.6 75.2L86.2 76.3L85.7 77.4L85.1 78.4L84.3 79.3L83.4 80.0L82.4 80.7L81.3 81.2L80.1 81.6L79.0 81.9L77.9 81.9L76.9 81.7L76.0 81.4L75.3 80.9L74.7 80.2L74.2 79.4L73.8 78.5L73.6 77.4L73.5 76.2L73.6 75.0L73.8 73.8L74.2 72.8L74.7 71.8L75.3 70.9L76.0 70.1L76.9 69.4L77.9 68.8L79.0 68.3L80.2 67.9L81.4 67.6L82.6 67.5L83.5 67.6L84.4 67.8L85.1 68.2L85.8 68.8L86.2 69.5L86.6 70.4L86.8 71.5L86.8 72.7ZM83.3 73.9L83.2 73.0L83.1 72.2L83.0 71.6L82.8 71.1L82.5 70.7L82.2 70.4L81.8 70.2L81.3 70.1L80.8 70.1L80.3 70.3L79.1 70.7L78.3 71.5L77.6 72.5L77.3 73.8L77.1 75.5L77.2 76.3L77.3 77.1L77.4 77.7L77.6 78.2L77.9 78.7L78.2 79.0L78.6 79.2L79.1 79.4L79.5 79.4L80.1 79.3L81.2 78.8L82.1 78.0L82.8 76.9L83.1 75.6L83.3 73.9Z" fill="#1f1a14" stroke="#1f1a14" stroke-width="1.4" stroke-linejoin="round"/>
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

  call("/").then(render).catch(() => {});

  window.addEventListener("pointermove", e => {
    const r = btn.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    const d = Math.hypot(dx, dy) || 1, k = Math.min(3, d / 40);
    eyes.style.transform = `translate(${(dx / d) * k}px, ${(dy / d) * k}px)`;
  }, { passive: true });

  function celebrate() {
    wrap.classList.remove("hop");
    void wrap.offsetWidth;
    wrap.classList.add("hop");
  }
  function plusOne() {
    const p = document.createElement("span");
    p.className = "been-plus";
    p.textContent = "+1";
    wrap.appendChild(p);
    setTimeout(() => p.remove(), 1200);
  }

  btn.addEventListener("click", async () => {
    celebrate();
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

/* ---- tap animation: spin-hop ---- */
(function () {
  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest(".been-btn");
    if (!btn) return;
    btn.classList.remove("been-pop");
    void btn.offsetWidth;
    btn.classList.add("been-pop");
    setTimeout(function () { btn.classList.remove("been-pop"); }, 850);
  });
})();
