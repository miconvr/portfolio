(() => {
  const KEY = "commits-v2";
  const list = document.querySelector(".side-links");

  function show(n) {
    if (!list || !Number.isFinite(n) || n < 1) return;
    const gh = list.querySelector('a[href^="https://github.com/miconvr"]');
    if (!gh) return;
    let note = gh.querySelector(".commits-note");
    if (!note) {
      note = document.createElement("span");
      note.className = "commits-note";
      gh.appendChild(note);
    }
    note.textContent = `${n.toLocaleString("en-US")}+ commits`;
  }

  function showRepos(d) {
    document.querySelectorAll("[data-repo-commits]").forEach((el) => {
      const v = Number(d[el.dataset.repoCommits]);
      if (Number.isFinite(v) && v > 0) {
        el.textContent = `${v.toLocaleString("en-US")}+ commits`;
        el.hidden = false;
      }
    });
  }

  try { show(Number(localStorage.getItem(KEY))); } catch (e) {}

  fetch("/api/commits")
    .then((r) => {
      if (!r.ok) throw new Error("http " + r.status);
      return r.json();
    })
    .then((d) => {
      const n = Number(d.commits);
      if (Number.isFinite(n) && n >= 1) {
        show(n);
        try { localStorage.setItem(KEY, String(n)); } catch (e) {}
      }
      showRepos(d);
    })
    .catch(() => {});
})();
