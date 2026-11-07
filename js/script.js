(function(){
  var btn=document.getElementById('theme'),root=document.documentElement;
  var mq=window.matchMedia('(prefers-color-scheme: dark)');
  try{var s=localStorage.getItem('theme');if(s)root.setAttribute('data-theme',s);}catch(e){}
  function isDark(){var t=root.getAttribute('data-theme');return t?t==='dark':mq.matches;}
  function sync(){var d=isDark();btn.textContent=d?'Light mode':'Dark mode';btn.setAttribute('aria-pressed',String(d));}
  btn.addEventListener('click',function(){var n=isDark()?'light':'dark';root.setAttribute('data-theme',n);try{localStorage.setItem('theme',n);}catch(e){}sync();});
  mq.addEventListener('change',sync);sync();
})();