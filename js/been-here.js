(() => {
  const KEY = "been-here-v1";
  const host = document.querySelector(".side-links");
  if (!host) return;

  const wrap = document.createElement("div");
  wrap.className = "been";
  wrap.innerHTML = `
    <button class="been-btn" type="button" aria-label="Tap if you are here">
      <svg class="been-mascot" viewBox="0 0 120 120" aria-hidden="true">
        <ellipse cx="60" cy="109" rx="28" ry="4.5" fill="currentColor" opacity=".12"/>
        <g class="body">
          <circle cx="60" cy="62" r="40" fill="#f6b92b" stroke="#1f1a14" stroke-width="4.5"/>
          <g class="eyes">
            <ellipse cx="48" cy="48" rx="4" ry="9.3" fill="#1f1a14"/>
            <ellipse cx="71" cy="48" rx="4" ry="9.3" fill="#1f1a14"/>
          </g>
          <path d="M34.2 60.3C30 60.5 28 63.5 28.4 66.5C28.8 69 31 69.6 32.5 68.6C38 78 48 90 60 90C72 90 82 78 87.5 68.6C89 69.6 91.2 69 91.6 66.5C92 63.5 90 60.5 85.8 60.3C86.5 66 84 74 76 80.5C70 85 64 86.2 60 86.2C56 86.2 50 85 44 80.5C36 74 33.5 66 34.2 60.3Z" fill="#1f1a14" stroke="#1f1a14" stroke-width="1" stroke-linejoin="round"/>
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
