(function(){
  var root=document.documentElement;
  var main=document.getElementById('main');
  var navLinks=document.querySelectorAll('.side nav a');
  var loading=false;
  function norm(p){p=p.replace(/index\.html$/,'').replace(/\.html$/,'');if(p.length>1)p=p.replace(/\/$/,'');return p||'/';}
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
      if(norm(a.getAttribute('href')||'')===(path.indexOf('/projects/')===0?'/':path))a.setAttribute('aria-current','true');
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

  var pageCache={};
  pageCache[current]={
    title: document.title,
    html: current==='/' ? main.innerHTML : (main.querySelector('article') ? main.querySelector('article').outerHTML : main.innerHTML),
    templates: [].slice.call(document.querySelectorAll('template[id^="ov-"]')).map(function(t){
      return {id:t.id, html:t.innerHTML};
    })
  };

  function prefetch(url){
    url=norm(url);
    if(pageCache[url])return Promise.resolve(pageCache[url]);
    return fetch(url,{headers:{Accept:'text/html'}})
      .then(function(r){return r.ok?r.text():'';})
      .then(function(html){
        if(!html)return null;
        var doc=new DOMParser().parseFromString(html,'text/html');
        var home=url==='/';
        var src=home?doc.getElementById('main'):doc.querySelector('main article');
        if(!src)return null;
        pageCache[url]={
          title: doc.title,
          html: home?src.innerHTML:src.outerHTML,
          templates: [].slice.call(doc.querySelectorAll('template[id^="ov-"]')).map(function(t){
            return {id:t.id, html:t.innerHTML};
          })
        };
        return pageCache[url];
      }).catch(function(){return null;});
  }

  if('fetch' in window){
    ['/','/about','/experience','/projects/kaltas','/projects/civicguard'].forEach(function(p){
      if(p!==current)prefetch(p);
    });
  }

  function ensureCarousel(){
    if(window.initCarousel){window.initCarousel();return;}
    if(document.querySelector('script[data-carousel]'))return;
    var s=document.createElement('script');
    s.src='/js/carousel.js';
    s.setAttribute('data-carousel','1');
    document.body.appendChild(s);
  }

  function applyPage(data, path, mode){
    if(data.templates&&data.templates.length){
      data.templates.forEach(function(t){
        if(!document.getElementById(t.id)){
          var tpl=document.createElement('template');
          tpl.id=t.id;
          tpl.innerHTML=t.html;
          document.body.appendChild(tpl);
        }
      });
    }
    main.innerHTML=data.html;
    document.title=data.title;
    current=path;
    if(mode==='push')history.pushState({view:path},'',path);
    setActive(path);
    window.scrollTo(0,0);

    var home=path==='/';
    if(!home){
      main.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');});
      ensureCarousel();
      if(window.initCommits)window.initCommits();
    }
    if(home){
      main.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');});
      if(window.initOverview)window.initOverview();
      if(window.initCarousel)window.initCarousel();
      if(window.initCommits)window.initCommits();
    }
    animatePanel();
  }

  var openCard=null;
  function run(data,path,mode){
    var card=openCard; openCard=null;
    var leaving=current.indexOf("/projects/")===0;
    var ok=(card||leaving)&&document.startViewTransition&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!ok){applyPage(data,path,mode);return;}
    main.style.viewTransitionName='page';
    if(!card)document.documentElement.classList.add("vt-leave");
    var t=document.startViewTransition(function(){applyPage(data,path,mode);});
    t.finished.finally(function(){main.style.viewTransitionName="";document.documentElement.classList.remove("vt-leave");});
  }

  function show(path,mode){
    path=norm(path);
    if(loading)return;
    if(path===current){window.scrollTo(0,0);return;}

    if(pageCache[path]){
      run(pageCache[path], path, mode);
      return;
    }

    loading=true;
    main.setAttribute('aria-busy','true');
    prefetch(path).then(function(data){
      if(data)run(data, path, mode);
      else window.location.href=path;
    }).catch(function(){
      window.location.href=path;
    }).finally(function(){
      loading=false;
      main.removeAttribute('aria-busy');
    });
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

  var inPage=/^\/(about|experience|projects\/[\w-]+)?$/;
  main.addEventListener('click',function(event){
    if(event.defaultPrevented||event.button!==0)return;
    if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    var a=event.target.closest&&event.target.closest('a[href]');
    if(!a||(a.target&&a.target!=='_self')||a.hasAttribute('download'))return;
    if(a.origin!==location.origin||a.hash||a.search)return;
    var path=norm(a.pathname);
    if(!inPage.test(path))return;
    event.preventDefault();
    openCard=a.closest('.projects-grid .item');
    show(path,'push');
  });

  var spot=0;
  document.addEventListener('pointermove',function(e){
    if(e.pointerType!=='mouse')return;
    var c=e.target.closest&&e.target.closest('.projects-grid .item, .overview');
    if(!c)return;
    cancelAnimationFrame(spot);
    spot=requestAnimationFrame(function(){
      var r=c.getBoundingClientRect();
      c.style.setProperty('--mx',(e.clientX-r.left)+'px');
      c.style.setProperty('--my',(e.clientY-r.top)+'px');
      if(c.classList.contains('overview'))return;c.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*10+'deg');
      c.style.setProperty('--rx',(-((e.clientY-r.top)/r.height-.5)*10)+'deg');
    });
  },{passive:true});

  addEventListener('popstate',function(){show(location.pathname,'none');});
  setActive(current);
})();
