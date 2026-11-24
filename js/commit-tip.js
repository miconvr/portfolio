// Shows the GitHub commit count as a tooltip on the GitHub icon in the sidebar.
// The visible note is hidden by CSS (COMMIT TOOLTIP); commits.js still fills it in, and this copies its text.
(function () {
  var side = document.querySelector(".side-links");
  if (!side) return;
  function sync() {
    var note = side.querySelector(".commits-note");
    var link = side.querySelector('a[href*="github.com/miconvr"]');
    if (!note || !link) return;
    var text = note.textContent.replace(/[()]/g, "").trim();
    if (!text) return;
    var label = "GitHub \u00b7 " + text;
    if (link.title !== label) { link.title = label; link.setAttribute("aria-label", label); }
  }
  sync();
  new MutationObserver(sync).observe(side, { childList: true, subtree: true, characterData: true });
})();
