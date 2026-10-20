(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el){io.observe(el);});
  }else{els.forEach(function(el){el.classList.add('in');});}
  var links=document.querySelectorAll('.side nav a');
  if('IntersectionObserver' in window){
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.removeAttribute('aria-current');if(a.getAttribute('href')==='#'+e.target.id)a.setAttribute('aria-current','true');});}});},{rootMargin:'-40% 0px -55% 0px'});
    ['projects','contact'].forEach(function(id){var s=document.getElementById(id);if(s)so.observe(s);});
  }
  var bar=document.querySelector('.progress'),ticking=false;
  function upd(){var h=document.documentElement.scrollHeight-innerHeight;bar.style.transform='scaleX('+(h>0?scrollY/h:0)+')';ticking=false;}
  if(bar){addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(upd);}},{passive:true});upd();}
})();
