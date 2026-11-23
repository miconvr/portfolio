// Project cards: click a card (or its link). The card lifts, turns edge-on, then the overview flips in.
// Leaving a project flips the same card back into the grid. home.js still does the real navigation.
(function () {
  var reduce = matchMedia("(prefers-reduced-motion: reduce)");
  var P = "perspective(1200px) ";
  var LIFT = "translateY(-10px) scale(1.04) ";
  var SHADOW = "0 28px 40px -14px rgba(0, 0, 0, .45)";
  var busy = false, pass = false, enterFlip = false, openedPath = null, lastOverview = null, lastGrid = null;

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
    setTimeout(function () { busy = false; }, 1400);
    var go = function () { pass = true; link.click(); pass = false; };
    if (reduce.matches || !card.animate) { go(); return; }
    enterFlip = true;
    setTimeout(function () { enterFlip = false; }, 3000);
    card.style.zIndex = "5";
    var a = card.animate([
      { transform: P + "translateY(0) scale(1) rotateY(0)", boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)", offset: 0, easing: "cubic-bezier(.2, .7, .2, 1)" },
      { transform: P + LIFT + "rotateY(0)", boxShadow: SHADOW, offset: .5, easing: "cubic-bezier(.5, 0, .75, 0)" },
      { transform: P + LIFT + "rotateY(90deg)", boxShadow: SHADOW, offset: 1 }
    ], { duration: 480, fill: "forwards" });
    a.onfinish = go;
    setTimeout(function () { try { a.cancel(); } catch (x) {} card.style.zIndex = ""; }, 1500);
  }, true);

  new MutationObserver(function () {
    var o = document.querySelector("main .overview");
    if (!o) lastOverview = null;
    else if (o !== lastOverview) {
      lastOverview = o;
      openedPath = location.pathname.replace(/\/$/, "");
      if (enterFlip && !reduce.matches && o.animate) {
        enterFlip = false;
        o.animate(
          [{ transform: P + "rotateY(-90deg) scale(.96)", opacity: 0 }, { transform: P + "rotateY(0) scale(1)", opacity: 1 }],
          { duration: 380, easing: "cubic-bezier(.2, .7, .2, 1)" }
        );
      }
    }
    var g = document.querySelector("main .projects-grid");
    if (!g) lastGrid = null;
    else if (g !== lastGrid) {
      lastGrid = g;
      if (openedPath && !reduce.matches) {
        var back = Array.from(g.querySelectorAll(".item")).find(function (el) {
          return el.querySelector('a[href="' + openedPath + '"]');
        });
        openedPath = null;
        if (back && back.animate) {
          back.animate(
            [{ transform: P + "rotateY(-90deg) scale(.96)", opacity: 0 }, { transform: P + "rotateY(0) scale(1)", opacity: 1 }],
            { duration: 420, delay: 60, easing: "cubic-bezier(.2, .7, .2, 1)", fill: "backwards" }
          );
        }
      }
    }
  }).observe(document.body, { childList: true, subtree: true });
})();
