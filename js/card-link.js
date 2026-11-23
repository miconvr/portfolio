// Project cards: click anywhere on a card to open it, with a quick flip.
// The card turns edge-on, then the overview turns in from the other edge. home.js still does the real navigation.
(function () {
  var reduce = matchMedia("(prefers-reduced-motion: reduce)");
  var busy = false, pass = false, flipped = false, lastOverview = null;
  var P = "perspective(1200px) ";

  document.addEventListener("click", function (e) {
    if (pass) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var card = e.target.closest && e.target.closest(".projects-grid .item");
    if (!card) return;
    var link = card.querySelector('.meta a[href^="/"]');
    if (!link) return;
    var onLink = e.target.closest("a");
    if (onLink && onLink !== link) return;
    if (!onLink && e.target.closest("button")) return;
    if (!onLink && window.getSelection && String(window.getSelection())) return;
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    busy = true;
    var go = function () { pass = true; link.click(); pass = false; };
    setTimeout(function () { busy = false; }, 1200);
    if (reduce.matches || !card.animate) { go(); return; }
    flipped = true;
    setTimeout(function () { flipped = false; }, 3000);
    var a = card.animate(
      [{ transform: P + "rotateY(0) scale(1)", opacity: 1 }, { transform: P + "rotateY(90deg) scale(1.06)", opacity: .6 }],
      { duration: 220, easing: "cubic-bezier(.5, 0, .75, 0)", fill: "forwards" }
    );
    a.onfinish = go;
    setTimeout(function () { try { a.cancel(); } catch (x) {} }, 1500);
  }, true);

  new MutationObserver(function () {
    var o = document.querySelector("main .overview");
    if (!o || o === lastOverview) return;
    lastOverview = o;
    if (!flipped || reduce.matches || !o.animate) return;
    flipped = false;
    o.animate(
      [{ transform: P + "rotateY(-90deg) scale(.96)", opacity: 0 }, { transform: P + "rotateY(0) scale(1)", opacity: 1 }],
      { duration: 320, easing: "cubic-bezier(.2, .7, .2, 1)" }
    );
  }).observe(document.body, { childList: true, subtree: true });
})();
