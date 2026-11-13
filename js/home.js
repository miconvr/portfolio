(function(){
  var root=document.documentElement;
  var main=document.getElementById('main');
  var navLinks=document.querySelectorAll('.side nav a');
  var loading=false;
  function norm(p){p=p.replace(/index\.html$/,'');if(p.length>1)p=p.replace(/\/$/,'');return p||'/';}
  var current=norm(location.pathname);

  var els=document.querySelectorAll('.reveal');
  function showAll(){root.classList.remove('js');els.forEach(function(el){el.classList.add('in');});}
  try{
    if(root.classList.contains('js')&&'IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.05});
      els.forEach(function(el){io.observe(el);});
    }else{showAll();}
  }catch(err){showAll();}

  try{
    var bar=document.querySelector('.progress'),ticking=false;
    var upd=function(){var h=root.scrollHeight-innerHeight;bar.style.transform='scaleX('+(h>0?scrollY/h:0)+')';ticking=false;};
    if(bar){addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(upd);}},{passive:true});upd();}
  }catch(err){}

  function setActive(path){
    navLinks.forEach(function(a){
      a.removeAttribute('aria-current');
      if(norm(a.getAttribute('href')||'')===path)a.setAttribute('aria-current','true');
    });
  }

  function animatePanel(){
    main.classList.remove('panel-enter');
    void main.offsetWidth;
    main.classList.add('panel-enter');
    main.addEventListener('animationend',function(){
      main.classList.remove('panel-enter');
    },{once:true});
  }

  function show(path,mode){
    path=norm(path);
    if(loading)return;
    if(path===current){window.scrollTo(0,0);return;}
    loading=true;
    main.setAttribute('aria-busy','true');
    fetch(path,{headers:{Accept:'text/html'}})
      .then(function(r){if(!r.ok)throw new Error('bad response');return r.text();})
      .then(function(html){
        var doc=new DOMParser().parseFromString(html,'text/html');
        var home=path==='/';
        var src=home?doc.getElementById('main'):doc.querySelector('main article');
        if(!src)throw new Error('no content');

        if(home){
          [].slice.call(doc.querySelectorAll('template[id^="ov-"]')).forEach(function(t){
            if(!document.getElementById(t.id))document.body.appendChild(document.importNode(t,true));
          });
          main.innerHTML=src.innerHTML;
          main.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');});
        }else{
          main.innerHTML=src.outerHTML;
        }
        document.title=doc.title;
        current=path;
        if(mode==='push')history.pushState({view:path},'',path);
        setActive(path);
        window.scrollTo(0,0);
        if(home){
          if(window.initOverview)window.initOverview();
          if(window.initCarousel)window.initCarousel();
          if(window.initCommits)window.initCommits();
        }
        animatePanel();
      })
      .catch(function(e){console.error('SWAP FAILED:',e);window.location.href=path;})
      .finally(function(){loading=false;main.removeAttribute('aria-busy');});
  }

  navLinks.forEach(function(link){
    link.addEventListener('click',function(event){
      var path=link.getAttribute('href');
      if(!path||path.charAt(0)==='#'||path.indexOf('://')!==-1)return;
      if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      event.preventDefault();
      show(path,'push');
    });
  });

  addEventListener('popstate',function(){show(location.pathname,'none');});
  setActive(current);
})();
