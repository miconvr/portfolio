(() => {
  const NS = "miconvr-portfolio", NAME = "been-here";
  const BASE = `https://api.counterapi.dev/v1/${NS}/${NAME}`;
  const KEY = "been-here-v1";
  const host = document.querySelector(".side-links");
  if (!host) return;

  const wrap = document.createElement("div");
  wrap.className = "been";
  wrap.innerHTML = `
    <button class="been-btn" type="button" aria-label="Tap if you've been here">
      <svg class="been-mascot" viewBox="0 0 120 120" aria-hidden="true">
        <ellipse cx="60" cy="113" rx="26" ry="4.5" fill="currentColor" opacity=".12"/>
        <g class="body">
          <ellipse cx="42" cy="104" rx="10" ry="6.5" fill="#222"/>
          <ellipse cx="78" cy="104" rx="10" ry="6.5" fill="#222"/>
          <circle cx="26" cy="53" r="11" fill="#222"/>
          <circle cx="94" cy="53" r="11" fill="#222"/>
          <ellipse cx="60" cy="72" rx="40" ry="34" fill="#fff" stroke="#222" stroke-width="2"/>
          <ellipse cx="17" cy="80" rx="7" ry="12" fill="#222" transform="rotate(20 17 80)"/>
          <g class="arm"><ellipse cx="103" cy="78" rx="7" ry="12" fill="#222" transform="rotate(-20 103 78)"/></g>
          <ellipse cx="46" cy="69" rx="8" ry="10.5" fill="#222" transform="rotate(25 46 69)"/>
          <ellipse cx="74" cy="69" rx="8" ry="10.5" fill="#222" transform="rotate(-25 74 69)"/>
          <g class="eyes"><g class="blink">
            <circle cx="47" cy="68" r="3.4" fill="#fff"/><circle cx="73" cy="68" r="3.4" fill="#fff"/>
            <circle cx="47.8" cy="67" r="1.2" fill="#222"/><circle cx="73.8" cy="67" r="1.2" fill="#222"/>
          </g></g>
          <ellipse cx="36" cy="85" rx="6" ry="4" fill="#e58f7b" opacity=".55"/>
          <ellipse cx="84" cy="85" rx="6" ry="4" fill="#e58f7b" opacity=".55"/>
          <ellipse cx="60" cy="79" rx="5.5" ry="3.8" fill="#222"/>
          <path d="M53 85 Q60 91 67 85" stroke="#222" stroke-width="2.2" fill="none" stroke-linecap="round"/>
          <path d="M40 46 v10 q20 10 40 0 v-10z" fill="#c25b3c"/>
          <polygon points="60,20 102,36 60,52 18,36" fill="#d9704a"/>
          <line x1="96" y1="39" x2="96" y2="57" stroke="#f0c36a" stroke-width="2.5"/>
          <circle cx="96" cy="59" r="3" fill="#f0c36a"/>
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
  line.textContent = tapped ? "welcome back!" : "tap if you've been here";

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
    for (let i = 0; i < 5; i++) {
      const h = document.createElement("span");
      h.className = "been-heart";
      h.textContent = "♥";
      h.style.left = 20 + Math.random() * 40 + "px";
      h.style.top = "6px";
      h.style.setProperty("--dx", (Math.random() * 44 - 22) + "px");
      h.style.animationDelay = i * 90 + "ms";
      wrap.appendChild(h);
      setTimeout(() => h.remove(), 1500);
    }
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
    } catch (e) {
      line.textContent = "hi! (counter is asleep, try later)";
    }
    busy = false;
  });
})();
