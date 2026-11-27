(function(){var r=document.documentElement,b=document.getElementById("theme");
function set(t){r.dataset.theme=t;try{localStorage.setItem("theme-v1",t)}catch(e){}var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=t==="dark"?"#0d0c0b":"#f1ebdb"}
b.addEventListener("click",function(){set(r.dataset.theme==="dark"?"light":"dark")});
var els=document.querySelectorAll(".reveal");
if(r.classList.contains("js")&&"IntersectionObserver"in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.1});els.forEach(function(el){io.observe(el)})}else{els.forEach(function(el){el.classList.add("in")})}
fetch("/api/commits").then(function(x){return x.ok?x.json():null}).then(function(d){if(!d)return;var n=(+d.kaltas||0)+(+d.civicguard||0);if(n>0){var c=document.getElementById("commits");c.querySelector("b").textContent=n.toLocaleString("en-US")+"+";c.hidden=false}}).catch(function(){})})();
