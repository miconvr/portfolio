(function(){
var d=document,r=d.documentElement;
var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;

/* theme */
var tb=d.getElementById("theme");
if(tb)tb.addEventListener("click",function(){
  var t=r.dataset.theme==="dark"?"light":"dark";
  r.dataset.theme=t;
  try{localStorage.setItem("theme-v1",t)}catch(e){}
  var m=d.querySelector('meta[name="theme-color"]');
  if(m)m.content=t==="dark"?"#0d0c0b":"#f1ebdb";
});

/* scroll reveal */
var els=d.querySelectorAll(".reveal");
if(r.classList.contains("js")&&"IntersectionObserver" in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.1});
  els.forEach(function(el){io.observe(el)});
}else{els.forEach(function(el){el.classList.add("in")})}

/* screenshot gallery */
d.querySelectorAll(".gallery").forEach(function(g){
  var s=g.querySelector(".slides"),c=g.querySelector(".gcount"),n=s.children.length;
  function cur(){return Math.round(s.scrollLeft/s.clientWidth)}
  function go(i){i=(i+n)%n;s.scrollTo({left:i*s.clientWidth,behavior:reduce?"auto":"smooth"})}
  g.querySelector(".prev").addEventListener("click",function(){go(cur()-1)});
  g.querySelector(".next").addEventListener("click",function(){go(cur()+1)});
  s.addEventListener("scroll",function(){c.textContent=(cur()+1)+" / "+n},{passive:true});
  s.addEventListener("keydown",function(e){
    if(e.key==="ArrowRight"){e.preventDefault();go(cur()+1)}
    if(e.key==="ArrowLeft"){e.preventDefault();go(cur()-1)}
  });
});

/* enlarge a screenshot */
var lb=null;
d.addEventListener("click",function(e){
  var img=e.target.closest&&e.target.closest(".slide img");
  if(!img||!d.createElement("dialog").showModal)return;
  if(!lb){
    lb=d.createElement("dialog");lb.className="lb";lb.setAttribute("aria-label","Enlarged screenshot");
    lb.innerHTML='<button class="lb-x" type="button" aria-label="Close">&times;</button><img alt="">';
    lb.addEventListener("click",function(ev){if(ev.target.tagName!=="IMG")lb.close()});
    d.body.appendChild(lb);
  }
  var big=lb.querySelector("img");big.src=img.currentSrc||img.src;big.alt=img.alt;
  lb.showModal();
});

/* commit counts from /api/commits */
var repoEls=d.querySelectorAll("[data-repo-commits]"),homeEl=d.querySelector("[data-commits]");
if(repoEls.length||homeEl){
  fetch("/api/commits").then(function(x){return x.ok?x.json():null}).then(function(j){
    if(!j)return;
    var f=function(n){return Number(n).toLocaleString("en-US")+"+"};
    repoEls.forEach(function(el){
      var v=+j[el.dataset.repoCommits];
      if(v>0){el.textContent=f(v)+" commits";var row=el.closest(".fact");if(row)row.hidden=false}
    });
    if(homeEl){var n=(+j.kaltas||0)+(+j.civicguard||0);if(n>0){homeEl.querySelector("b").textContent=f(n);homeEl.hidden=false}}
  }).catch(function(){});
}

/* "tap if you are here" heart */
var been=d.querySelector(".been");
if(been){
  var KEY="been-here-v1",btn=been.querySelector(".been-btn"),line=been.querySelector(".been-line"),cnt=been.querySelector(".been-count"),eyes=been.querySelector(".eyes"),turn=been.querySelector(".turn");
  var tapped=false,busy=false,raf=0,px=0,py=0;
  try{tapped=localStorage.getItem(KEY)==="1"}catch(e){}
  line.textContent=tapped?"welcome back!":"tap if you are here!";
  var fmt=function(n){return Number(n).toLocaleString("en-US")};
  function api(method){return fetch("/api/hi",{method:method,cache:"no-store"}).then(function(x){if(!x.ok)throw 0;return x.json()}).then(function(j){var n=Number(j.count);if(!isFinite(n))throw 0;return n})}
  function render(n){cnt.textContent=n>0?fmt(n)+(n===1?" person has":" people have")+" said hi":""}
  api("GET").then(render).catch(function(){});
  function aim(nx,ny){
    eyes.style.transform="translate("+nx*3.4+"px,"+ny*2.4+"px)";
    turn.style.transform="translate("+nx*2.4+"px,"+ny*1.8+"px) rotate("+nx*6+"deg)";
  }
  function look(){raf=0;var b=btn.getBoundingClientRect(),dx=px-(b.left+b.width/2),dy=py-(b.top+b.height/2),dist=Math.hypot(dx,dy)||1,k=Math.min(1,dist/80);aim(dx/dist*k,dy/dist*k)}
  if(!reduce)addEventListener("pointermove",function(e){px=e.clientX;py=e.clientY;if(!raf)raf=requestAnimationFrame(look)},{passive:true});
  btn.addEventListener("click",function(){
    if(!reduce){btn.classList.add("been-pop");setTimeout(function(){btn.classList.remove("been-pop")},600)}
    if(tapped||busy){line.textContent="welcome back!";return}
    busy=true;line.textContent="hi! thanks for stopping by";
    api("POST").then(function(n){
      tapped=true;try{localStorage.setItem(KEY,"1")}catch(e){}
      line.textContent="hi! you're #"+fmt(n);render(n);
    }).catch(function(){line.textContent="hi! (counter is asleep, try later)"}).then(function(){busy=false});
  });
}
})();
