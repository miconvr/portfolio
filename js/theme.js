// Theme toggle: light is the default, dark is the same site with data-theme="dark" on <html>.
// The head script on each page sets the attribute before paint; this adds the button and saves the choice.
(function () {
  var KEY = "theme-v1";
  var root = document.documentElement;
  var MOON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var SUN = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "snd theme-btn";
  function isDark() { return root.dataset.theme === "dark"; }
  function paint() {
    var dark = isDark();
    btn.innerHTML = dark ? SUN : MOON;
    var label = dark ? "Switch to light theme" : "Switch to dark theme";
    btn.setAttribute("aria-label", label);
    btn.title = label;
    // Replace the tag instead of editing it: some mobile browsers only repaint their top bar for a new element
    var m = document.createElement("meta");
    m.name = "theme-color";
    m.content = dark ? "#0B0B0B" : "#E7DEC8";
    var old = document.querySelector('meta[name="theme-color"]');
    if (old) old.replaceWith(m); else document.head.appendChild(m);
  }
  btn.addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem(KEY, next); } catch (e) {}
    paint();
  });
  paint();
  // Put the theme and mute buttons in the sidebar; pages without a sidebar keep them floating.
  var side = document.querySelector("aside.side");
  if (side) {
    var tools = document.createElement("div");
    tools.className = "side-tools";
    tools.appendChild(btn);
    var snd = document.querySelector("body > .snd");
    if (snd) tools.appendChild(snd);
    side.appendChild(tools);
  } else {
    document.body.appendChild(btn);
  }
})();
