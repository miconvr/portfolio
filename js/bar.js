(function(){var r=document.documentElement,b=document.getElementById("bar-theme");if(!b)return;
b.addEventListener("click",function(){var t=r.dataset.theme==="dark"?"light":"dark";r.dataset.theme=t;try{localStorage.setItem("theme-v1",t)}catch(e){}var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=t==="dark"?"#0B0B0B":"#E7DEC8"})})();
