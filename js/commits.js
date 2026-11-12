(() => {
  const KEY = "commits-v1";
  const list = document.querySelector(".side-links");
  if (!list) return;

  function show(n) {
    if (!Number.isFinite(n) || n < 1) return;
    let li = list.querySelector(".commits-item");
    if (!li) {
      li = document.createElement("li");
      li.className = "commits-item";
      li.innerHTML = `<a class="commits" href="https://github.com/miconvr" target="_blank" rel="noopener noreferrer"><svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="3"/><path d="M1 8h4M11 8h4"/></g></svg><span></span></a>`;
      list.appendChild(li);
    }
    li.querySelector("span").textContent = `${n.toLocaleString("en-US")}+ commits`;
  }

  try { show(Number(localStorage.getItem(KEY))); } catch (e) {}

  fetch("/api/commits")
    .then(r => {
      if (!r.ok) throw new Error("http " + r.status);
      return r.json();
    })
    .then(d => {
      const n = Number(d.commits);
      if (!Number.isFinite(n) || n < 1) return;
      show(n);
      try { localStorage.setItem(KEY, String(n)); } catch (e) {}
    })
    .catch(() => {});
})();
