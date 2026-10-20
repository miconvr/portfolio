(function(){
  var root=document.documentElement;
  try{
    if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    // Back/forward: show the page as it was, no replay.
    var nav=performance.getEntriesByType('navigation')[0];
    if(nav&&nav.type==='back_forward')return;
    // Only hide what is below the fold. Everything already on screen shows at once,
    // so the page never starts blank (the page transition handles the fade-in).
    var vh=window.innerHeight;
    var t=[].filter.call(document.querySelectorAll('main .back,main h1,main .summary,main .links,main .facts,main .shot,main article section,main .contact li'),function(el){
      return el.getBoundingClientRect().top>vh*.9;
    });
    if(!t.length)return;
    t.forEach(function(el){el.classList.add('sub');});
    root.classList.add('js');
    var io=new IntersectionObserver(function(es){
      var n=0;
      es.forEach(function(e){
        if(e.isIntersecting){e.target.style.transitionDelay=(Math.min(n++,3)*60)+'ms';e.target.classList.add('in');io.unobserve(e.target);}
      });
    },{threshold:.08,rootMargin:'0px 0px -6% 0px'});
    t.forEach(function(el){io.observe(el);});
  }catch(err){
    root.classList.remove('js');
    document.querySelectorAll('.sub').forEach(function(el){el.classList.remove('sub');});
  }
})();
