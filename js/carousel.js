(function(){
  function track(c){return c.querySelector('.slides')}
  function cur(s){return Math.round(s.scrollLeft/s.clientWidth)}
  function base(c){return c._t!=null?c._t:cur(track(c))}
  function go(c,i){
    var s=track(c),n=s.children.length;i=(i+n)%n;
    c._t=i;clearTimeout(c._h);c._h=setTimeout(function(){c._t=null},700);
    s.scrollTo({left:i*s.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }
  function count(c){
    var s=track(c),el=c.querySelector('.car-count');
    if(el)el.textContent=(cur(s)+1)+' / '+s.children.length;
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('.car-btn');if(!b)return;
    var c=b.closest('.carousel');go(c,base(c)+(b.classList.contains('next')?1:-1));
  });
  document.addEventListener('scroll',function(e){
    var t=e.target;if(t&&t.classList&&t.classList.contains('slides'))count(t.closest('.carousel'));
  },true);
  document.addEventListener('keydown',function(e){
    if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;
    var s=e.target.closest&&e.target.closest('.slides');if(!s)return;
    e.preventDefault();var c=s.closest('.carousel');go(c,base(c)+(e.key==='ArrowRight'?1:-1));
  });
})();

(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io=null;
  if(!reduce){
    io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        var v=e.target;
        if(e.isIntersecting&&e.intersectionRatio>=.6){
          v.muted=true;
          var p=v.play();if(p&&p.catch)p.catch(function(){});
        }else v.pause();
      });
    },{threshold:[0,.6]});
  }

  // attach to any video not yet watched (runs again after home.js swaps the page content)
  function scan(){
    var vids=document.querySelectorAll('.slide video');
    for(var i=0;i<vids.length;i++){
      var v=vids[i];
      if(reduce){v.controls=true;continue}
      if(!v._watched){v._watched=true;io.observe(v)}
    }
  }
  scan();
  new MutationObserver(scan).observe(document.getElementById('main')||document.body,{childList:true,subtree:true});

  // re-check on bfcache restore / tab switch
  function rewatch(){
    if(reduce)return;
    var vids=document.querySelectorAll('.slide video');
    for(var i=0;i<vids.length;i++){io.unobserve(vids[i]);io.observe(vids[i])}
  }
  window.addEventListener('pageshow',rewatch);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)rewatch()});
})();


(function(){
  function initCount(){
    var cs=document.querySelectorAll('.carousel');
    for(var i=0;i<cs.length;i++){
      var s=cs[i].querySelector('.slides'),el=cs[i].querySelector('.car-count');
      if(s&&el)el.textContent='1 / '+s.children.length;
    }
  }
  window.initCarousel=initCount;
  initCount();
})();
