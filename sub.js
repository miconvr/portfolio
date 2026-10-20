(function(){
  var root=document.documentElement;
  try{
    if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    var t=document.querySelectorAll('main .back,main h1,main .summary,main .links,main .facts,main .shot,main article section,main .contact li');
    if(!t.length)return;
    t.forEach(function(el){el.classList.add('sub');});
    root.classList.add('js');
    var io=new IntersectionObserver(function(es){
      var n=0;
      es.forEach(function(e){
        if(e.isIntersecting){e.target.style.transitionDelay=(n++*70)+'ms';e.target.classList.add('in');io.unobserve(e.target);}
      });
    },{threshold:.08,rootMargin:'0px 0px -6% 0px'});
    t.forEach(function(el){io.observe(el);});
  }catch(err){
    root.classList.remove('js');
    document.querySelectorAll('.sub').forEach(function(el){el.classList.remove('sub');});
  }
})();
