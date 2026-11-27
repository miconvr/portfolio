// Dark only. This just moves the mute button into the sidebar.
(function () {
  var side = document.querySelector("aside.side");
  var snd = document.querySelector("body > .snd");
  if (!side || !snd) return;
  var tools = document.createElement("div");
  tools.className = "side-tools";
  tools.appendChild(snd);
  side.appendChild(tools);
})();
