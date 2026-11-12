(() => {
  const KEY = "commits-v2";
  const list = document.querySelector(".side-links");

  function show(n) {
    if (!list || !Number.isFinite(n) || n < 1) return;
    let li = list.querySelector(".commits-item");
    if (!li) {
      li = document.createElement("li");
      li.className = "commits-item";
      li.innerHTML = `<a class="commits" href="https://github.com/miconvr" target="_blank" rel="noopener noreferrer"><svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="3"/><path d="M1 8h4M11 8h4"/></g></svg><span></span></a>`;
      list.appendChild(li);
    }
    li.querySelector("span").textContent = `${n.toLocaleString("en-US")}+ commits`;
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
