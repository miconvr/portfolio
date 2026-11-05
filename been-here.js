(() => {
  const NS = "miconvr-portfolio", NAME = "been-here";
  const BASE = `https://api.counterapi.dev/v1/${NS}/${NAME}`;
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
          <circle cx="29" cy="35" r="12" fill="#2f2f2f" stroke="#e6dcc3" stroke-width="2.5"/>
          <circle cx="91" cy="35" r="12" fill="#2f2f2f" stroke="#e6dcc3" stroke-width="2.5"/>
          <circle cx="60" cy="66" r="40" fill="#fbf8f1"/>
          <ellipse cx="43" cy="66" rx="8" ry="10" fill="#2f2f2f" transform="rotate(20 43 66)"/>
          <ellipse cx="77" cy="66" rx="8" ry="10" fill="#2f2f2f" transform="rotate(-20 77 66)"/>
          <g class="eyes"><g class="blink">
            <circle cx="44" cy="65" r="2.6" fill="#fff"/><circle cx="76" cy="65" r="2.6" fill="#fff"/>
          </g></g>
          <ellipse cx="60" cy="80" rx="4.5" ry="3.2" fill="#2f2f2f"/>
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

/* ---- tap burst: +1 and sparkles ---- */
(function () {
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var colors = ["#ffd77a", "#ff9fb2", "#9be7c4", "#fbf8f1"];
  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest(".been-btn");
    if (!btn) return;
    btn.classList.remove("been-pop");
    void btn.offsetWidth;
    btn.classList.add("been-pop");
    setTimeout(function () { btn.classList.remove("been-pop"); }, 800);
    if (reduce) return;
    var plus = document.createElement("span");
    plus.className = "been-plus";
    plus.textContent = "+1";
    plus.style.setProperty("--drift", (Math.random() * 30 - 15) + "px");
    plus.style.setProperty("--rot", (Math.random() * 24 - 12) + "deg");
    btn.appendChild(plus);
    setTimeout(function () { plus.remove(); }, 1200);
    for (var i = 0; i < 8; i++) {
      var a = (i / 8) * Math.PI * 2 + Math.random() * 0.5;
      var d = 34 + Math.random() * 18;
      var sp = document.createElement("span");
      sp.className = "been-spark";
      sp.style.setProperty("--dx", Math.cos(a) * d + "px");
      sp.style.setProperty("--dy", Math.sin(a) * d + "px");
      sp.style.setProperty("--c", colors[i % colors.length]);
      btn.appendChild(sp);
      setTimeout((function (n) { return function () { n.remove(); }; })(sp), 800);
    }
  });
})();
