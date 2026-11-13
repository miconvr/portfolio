(() => {
  const KEY = "commits-v3";
  const list = document.querySelector(".side-links");

  function fmt(n) { return `${n.toLocaleString("en-US")}+ commits`; }

  function show(n) {
    if (!list || !Number.isFinite(n) || n < 1) return;
    const gh = list.querySelector('a[href^="https://github.com/miconvr"]');
    if (!gh) return;
    const li = gh.closest("li") || gh.parentElement;
    let note = li.querySelector(".commits-note");
    if (!note) {
      note = document.createElement("span");
      note.className = "commits-note";
      li.appendChild(note);
    }
    note.textContent = `(${fmt(n)})`;
  }

  function showRepos(d) {
    document.querySelectorAll("[data-repo-commits]").forEach((el) => {
      const v = Number(d[el.dataset.repoCommits]);
      if (Number.isFinite(v) && v > 0) {
        el.textContent = fmt(v);
        el.hidden = false;
      }
    });
  }

  let latestData = null;

  function render(d) {
    if (!d) return;
    latestData = d;
    show(Number(d.commits));
    showRepos(d);
  }

  window.initCommits = function() {
    if (latestData) {
      render(latestData);
    } else {
      try {
        const cached = JSON.parse(localStorage.getItem(KEY) || "null");
        if (cached) render(cached);
      } catch (e) {}
    }
  };

  try {
    const cached = JSON.parse(localStorage.getItem(KEY) || "null");
    if (cached) render(cached);
  } catch (e) {}

  function load(retry) {
    fetch("/api/commits")
      .then((r) => {
        if (!r.ok) throw new Error("http " + r.status);
        return r.json();
      })
      .then((d) => {
        render(d);
        try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
      })
      .catch(() => { if (retry) setTimeout(() => load(false), 2000); });
  }
  const main = document.getElementById("main");
  if (main && "MutationObserver" in window) {
    new MutationObserver(() => { if (latestData) showRepos(latestData); }).observe(main, { childList: true });
  }

  load(true);
})();
