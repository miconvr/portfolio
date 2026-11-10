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
          <circle cx="60" cy="62" r="43" fill="none" stroke="#efe6cf" stroke-opacity=".5" stroke-width="1.8"/>
          <circle cx="60" cy="62" r="39" fill="#f7bd2e" stroke="#1f1a14" stroke-width="6"/>
          <ellipse cx="43" cy="40" rx="10" ry="4.5" fill="#fff" opacity=".2" transform="rotate(-35 43 40)"/>
          <g transform="translate(60 62) scale(.9) translate(-60 -62)">
            <g class="eyes">
              <ellipse class="blink" cx="48" cy="48" rx="4.6" ry="10" fill="#1f1a14"/>
              <ellipse class="blink" cx="71" cy="48" rx="4.6" ry="10" fill="#1f1a14"/>
            </g>
            <text x="60" y="86" text-anchor="middle" font-family="Geist, system-ui, sans-serif" font-size="25" font-weight="700" letter-spacing="1" fill="#1f1a14" textLength="50" lengthAdjust="spacingAndGlyphs">mico</text>
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
