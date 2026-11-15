(() => {
  const SLIDE = ".overview .slide img, .overview .slide video";
  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ico = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
  let box, stage, count, closeBtn, prevBtn, nextBtn;
  let items = [], idx = 0, carousel = null, downX = 0, downY = 0;

  function build() {
    if (box) return;
    box = document.createElement("div");
    box.className = "lb";
    box.hidden = true;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Enlarged media");
    box.innerHTML =
      '<button class="lb-btn lb-close" type="button" aria-label="Close">' + ico("M18 6L6 18M6 6l12 12") + "</button>" +
      '<button class="lb-btn lb-nav lb-prev" type="button" aria-label="Previous">' + ico("M15 18l-6-6 6-6") + "</button>" +
      '<div class="lb-stage"></div>' +
      '<button class="lb-btn lb-nav lb-next" type="button" aria-label="Next">' + ico("M9 18l6-6-6-6") + "</button>" +
      '<span class="lb-count" aria-live="polite"></span>';
    document.body.appendChild(box);
    stage = box.querySelector(".lb-stage");
    count = box.querySelector(".lb-count");
    closeBtn = box.querySelector(".lb-close");
    prevBtn = box.querySelector(".lb-prev");
    nextBtn = box.querySelector(".lb-next");
    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", () => show(idx - 1));
    nextBtn.addEventListener("click", () => show(idx + 1));
    box.addEventListener("click", e => { if (e.target === box || e.target === stage) close(); });
  }

  function clearStage() {
    const v = stage.querySelector("video");
    if (v) { v.pause(); v.removeAttribute("src"); v.load(); }
    stage.textContent = "";
  }

  function show(i) {
    idx = (i + items.length) % items.length;
    const src = items[idx];
    clearStage();
    let el;
    if (src.tagName === "VIDEO") {
      el = document.createElement("video");
      el.src = src.currentSrc || src.getAttribute("src");
      if (src.poster) el.poster = src.poster;
      el.controls = true;
      el.loop = true;
      el.playsInline = true;
      el.setAttribute("aria-label", src.getAttribute("aria-label") || "Video");
      const t = src.currentTime;
      el.addEventListener("loadedmetadata", () => { try { el.currentTime = t; } catch (_) {} }, { once: true });
      src.pause();
      stage.appendChild(el);
      el.play().catch(() => {});
    } else {
      el = document.createElement("img");
      el.src = src.currentSrc || src.src;
      el.alt = src.alt || "";
      stage.appendChild(el);
    }
    const many = items.length > 1;
    prevBtn.hidden = nextBtn.hidden = count.hidden = !many;
    count.textContent = (idx + 1) + " / " + items.length;
  }

  function open(t) {
    carousel = t.closest(".carousel");
    if (!carousel) return;
    items = Array.from(carousel.querySelectorAll(".slide img, .slide video"));
    if (!items.length) return;
    build();
    box.hidden = false;
    document.documentElement.style.overflow = "hidden";
    show(Math.max(0, items.indexOf(t)));
    closeBtn.focus({ preventScroll: true });
    if (reduce()) box.classList.add("open");
    else requestAnimationFrame(() => box.classList.add("open"));
  }

  function close() {
    if (!box || box.hidden) return;
    clearStage();
    box.classList.remove("open");
    box.hidden = true;
    document.documentElement.style.overflow = "";
    if (carousel && carousel.isConnected) {
      const s = carousel.querySelector(".slides");
      if (s) {
        s.scrollTo({ left: idx * s.clientWidth, behavior: "auto" });
        s.focus({ preventScroll: true });
      }
      const cur = items[idx];
      if (cur && cur.tagName === "VIDEO" && !reduce()) cur.play().catch(() => {});
    }
    carousel = null;
    items = [];
  }

  document.addEventListener("pointerdown", e => { downX = e.clientX; downY = e.clientY; }, true);

  document.addEventListener("click", e => {
    const t = e.target.closest && e.target.closest(SLIDE);
    if (!t || (box && !box.hidden)) return;
    if (Math.abs(e.clientX - downX) > 6 || Math.abs(e.clientY - downY) > 6) return;
    if (t.tagName === "VIDEO" && t.controls) return; // reduced motion shows native controls; leave them usable
    open(t);
  });

  document.addEventListener("keydown", e => {
    if (box && !box.hidden) {
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowLeft" && items.length > 1) { e.preventDefault(); show(idx - 1); }
      else if (e.key === "ArrowRight" && items.length > 1) { e.preventDefault(); show(idx + 1); }
      else if (e.key === "Tab") {
        const f = Array.from(box.querySelectorAll("button, video")).filter(n => n.getClientRects().length);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (!box.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
        else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      return;
    }
    if (e.key === "Enter" && e.target.classList && e.target.classList.contains("slides") && e.target.closest(".overview")) {
      const s = e.target, slide = s.children[Math.round(s.scrollLeft / s.clientWidth)];
      const m = slide && slide.querySelector("img, video");
      if (m) { e.preventDefault(); open(m); }
    }
  });

  window.addEventListener("popstate", close);

  // Enlarge button: a real button, so it gets its own hover (a pseudo-element can't)
  function addHints() {
    document.querySelectorAll(".overview .frame.carousel").forEach(c => {
      if (c.querySelector(".lb-hint")) return;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "lb-hint";
      b.setAttribute("aria-label", "Enlarge");
      b.innerHTML = ico("M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7");
      c.appendChild(b);
    });
  }
  document.addEventListener("click", e => {
    const b = e.target.closest && e.target.closest(".lb-hint");
    if (!b || (box && !box.hidden)) return;
    const s = b.parentElement.querySelector(".slides");
    const slide = s && s.children[Math.round(s.scrollLeft / s.clientWidth)];
    const m = slide && slide.querySelector("img, video");
    if (m) open(m);
  });
  addHints();
  new MutationObserver(addHints).observe(document.body, { childList: true, subtree: true });
})();
