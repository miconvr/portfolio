(() => {
  const KEY = "been-here-v1";
  // Mascot markup lives in the page HTML so it is in the first paint; this script only wires it up.
  const wrap = document.querySelector(".been");
  if (!wrap) return;

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

  call("/").then(render).catch(() => {});

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let px = 0, py = 0, raf = 0;
  function look() {
    raf = 0;
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
