// Clicking anywhere on a project card opens its project.
document.addEventListener("click", function (e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (e.target.closest("a, button")) return;
  var card = e.target.closest(".projects-grid .item");
  if (!card) return;
  if (window.getSelection && String(window.getSelection())) return;
  var link = card.querySelector('.meta a[href^="/"]');
  if (link) location.href = link.href;
});
