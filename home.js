(function(){
  var root=document.documentElement,els=document.querySelectorAll('.reveal');
  function showAll(){root.classList.remove('js');els.forEach(function(el){el.classList.add('in');});}
  try{
    if(root.classList.contains('js') && 'IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.05});
      els.forEach(function(el){io.observe(el);});
    }else{showAll();}
  }catch(err){showAll();}
  try{
    var links=document.querySelectorAll('.side nav a');
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.removeAttribute('aria-current');if(a.getAttribute('href')==='#'+e.target.id)a.setAttribute('aria-current','true');});}});},{rootMargin:'-40% 0px -55% 0px'});
    ['projects','contact'].forEach(function(id){var s=document.getElementById(id);if(s)so.observe(s);});
  }catch(err){}
  try{
    var bar=document.querySelector('.progress'),ticking=false;
    var upd=function(){var h=root.scrollHeight-innerHeight;bar.style.transform='scaleX('+(h>0?scrollY/h:0)+')';ticking=false;};
    if(bar){addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(upd);}},{passive:true});upd();}
  }catch(err){}
})();
