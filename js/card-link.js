// Clicking anywhere on a project card opens its project (the card reader that used to do this was removed).
(function () {
  document.querySelectorAll(".projects-grid .item").forEach(function (card) {
    var link = card.querySelector("a.stripe, .meta li:first-child a, a[href^='/']");
    if (!link) return;
    card.addEventListener("click", function (e) {
      if (e.target.closest("a, button")) return;
      location.href = link.href;
    });
  });
})();
