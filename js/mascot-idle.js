(() => {
  const btn = document.querySelector(".been-btn");
  if (!btn) return;
  const body = btn.querySelector(".body");
  const eyes = btn.querySelector(".eyes");
  if (!body || !eyes) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let lastMove = 0, busy = false, last = "";
  window.addEventListener("pointermove", () => { lastMove = Date.now(); }, { passive: true });

  function play(cls) {
    busy = true;
    body.classList.add(cls);
    body.addEventListener("animationend", function end(e) {
      if (e.target !== body) return;
      body.removeEventListener("animationend", end);
      body.classList.remove(cls);
      busy = false;
    });
  }

  function lookAround() {
    busy = true;
    const x = (Math.random() < .5 ? -1 : 1) * (2 + Math.random() * 1.5);
    const y = (Math.random() - .5) * 2;
    eyes.style.transition = "transform .3s ease-in-out";
    eyes.style.transform = `translate(${x}px, ${y}px)`;
    setTimeout(() => {
      eyes.style.transform = "translate(0px, 0px)";
      setTimeout(() => { eyes.style.transition = ""; busy = false; }, 350);
    }, 1100);
  }

  const moves = { look: lookAround, bounce: () => play("mi-bounce"), tilt: () => play("mi-tilt") };

  function tick() {
    setTimeout(tick, 5000 + Math.random() * 4000);
    if (document.hidden || reduce.matches || busy) return;
    if (!btn.offsetParent || btn.classList.contains("been-pop")) return;
    if (Date.now() - lastMove < 3000) return;
    const names = Object.keys(moves).filter(n => n !== last);
    last = names[Math.floor(Math.random() * names.length)];
    moves[last]();
  }
  setTimeout(tick, 4000);
})();
