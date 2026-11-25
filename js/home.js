(function(){
  var root=document.documentElement;
  var main=document.getElementById('main');
  var navLinks=document.querySelectorAll('.side nav a');
  var loading=false,dest,showSeq=0;
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

  function setActive(path){
    navLinks.forEach(function(a){
      a.removeAttribute('aria-current');
      if(norm(a.getAttribute('href')||'')===(/^\/(kaltas|civicguard)(\/|$)/.test(path)?'/':path))a.setAttribute('aria-current','true');
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

  var pageCache={},scrollMem={},inflight={};
  pageCache[current]={
    title: document.title,
    html: current==='/' ? main.innerHTML : (main.querySelector('article') ? main.querySelector('article').outerHTML : main.innerHTML),
    templates: [].slice.call(document.querySelectorAll('template[id^="ov-"]')).map(function(t){
      return {id:t.id, html:t.innerHTML};
    })
  };

  function warmImages(node){
    [].forEach.call(node.querySelectorAll('img[src]'),function(im){
      if(im.getAttribute('loading')==='lazy')return;
      var i=new Image();
      i.src=im.getAttribute('src');
      if(i.decode)i.decode().catch(function(){});
    });
  }

  function prefetch(url){
    url=norm(url);
    if(pageCache[url])return Promise.resolve(pageCache[url]);
    if(inflight[url])return inflight[url];
    return inflight[url]=fetch(url,{headers:{Accept:'text/html'}})
      .then(function(r){return r.ok?r.text():'';})
      .then(function(html){
        if(!html)return null;
        var doc=new DOMParser().parseFromString(html,'text/html');
        var home=url==='/';
        var src=home?doc.getElementById('main'):doc.querySelector('main article');
        if(!src)return null;
        warmImages(src);
        pageCache[url]={
          title: doc.title,
          html: home?src.innerHTML:src.outerHTML,
          templates: [].slice.call(doc.querySelectorAll('template[id^="ov-"]')).map(function(t){
            return {id:t.id, html:t.innerHTML};
          })
        };
        return pageCache[url];
      }).catch(function(){return null;}).then(function(d){delete inflight[url];return d;});
  }

  function warm(){
    var c=navigator.connection;
    if(c&&(c.saveData||/(^|-)2g$/.test(c.effectiveType||'')))return;
    ['/','/certificates','/about','/experience','/kaltas','/civicguard','/kaltas/privacy-policy'].forEach(function(p){
      if(p!==current)prefetch(p);
    });
  }
  if('fetch' in window){
    if('requestIdleCallback' in window)requestIdleCallback(warm,{timeout:500});
    else setTimeout(warm,300);
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
    var prevPath=current;scrollMem[prevPath]=window.scrollY;
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
    var keep=path==='/'&&depth(prevPath)===1&&scrollMem['/']>0;
    window.scrollTo({top:keep?scrollMem['/']:0,left:0,behavior:'instant'});

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

  var pt={x:0,y:0,t:0};
  document.addEventListener('pointerdown',function(e){pt.x=e.clientX;pt.y=e.clientY;pt.t=performance.now();},true);
  function ripple(){
    var r=main.getBoundingClientRect(),fresh=performance.now()-pt.t<2500;
    var x=fresh?pt.x:innerWidth/2,y=fresh?pt.y:innerHeight*.4;
    root.style.setProperty('--vt-x',(x-r.left)+'px');
    root.style.setProperty('--vt-y',(y-r.top)+'px');
  }
  var openCard=null;
  // page depth: 0 = home and the section pages, 1 = a project overview, 2 = a page inside a project (privacy)
  function depth(p){p=norm(p);return /^\/(kaltas|civicguard)\/./.test(p)?2:/^\/(kaltas|civicguard)$/.test(p)?1:0}
  var runSeq=0;
  function run(data,path,mode){
    var my=++runSeq;
    openCard=null;
    var root=document.documentElement;
    if(!document.startViewTransition||matchMedia('(prefers-reduced-motion: reduce)').matches||matchMedia('(max-width: 40rem)').matches){applyPage(data,path,mode);return;}
    var d=depth(path)-depth(current);
    var dir='vt-swap';
    if(depth(current)===0&&depth(path)===1)dir='vt-in';
    else if(depth(current)===1&&norm(path)==='/')dir='vt-out';
    if(dir==='vt-swap'){applyPage(data,path,mode);main.classList.remove('panel-enter');return;}
    main.style.viewTransitionName='page';
    root.classList.remove('vt-in','vt-out','vt-swap');root.classList.add(dir);
    var t=document.startViewTransition(function(){
      try{applyPage(data,path,mode);main.classList.remove('panel-enter');if(dir!=='vt-swap')ripple();}
      catch(err){console.error('page update failed',err);window.location.href=path;}
    });
    t.finished.catch(function(){}).then(function(){
      if(my!==runSeq)return;
      main.style.viewTransitionName='';root.classList.remove('vt-in','vt-out','vt-swap');
      if(current!==path)window.location.href=path;
    });
  }

  function show(path,mode){
    path=norm(path);
    if(dest===undefined)dest=current;
    if(path===dest){window.scrollTo(0,0);return;}
    dest=path;
    var seq=++showSeq;
    main.removeAttribute('aria-busy');

    if(pageCache[path]){
      run(pageCache[path], path, mode);
      return;
    }

    main.setAttribute('aria-busy','true');
    prefetch(path).then(function(data){
      if(seq!==showSeq)return;
      main.removeAttribute('aria-busy');
      if(data)run(data, path, mode);
      else window.location.href=path;
    }).catch(function(){
      if(seq===showSeq)window.location.href=path;
    });
  }

  navLinks.forEach(function(link){
    ['pointerenter','touchstart','focus'].forEach(function(ev){
      link.addEventListener(ev,function(){
        var h=link.getAttribute('href');
        if(h&&h.charAt(0)==='/'&&'fetch' in window)prefetch(h);
      },{passive:true,once:true});
    });
  });

  navLinks.forEach(function(link){
    link.addEventListener('click',function(event){
      var path=link.getAttribute('href');
      if(!path||path.charAt(0)==='#'||path.indexOf('://')!==-1)return;
      if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      event.preventDefault();
      show(path,'push');
    });
  });

  var inPage=/^\/(about|certificates|experience|kaltas|civicguard|kaltas\/privacy-policy)?$/;
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
      if(c.classList.contains('overview')||c.classList.contains('pulling')||c.classList.contains('retract-hold')||window.__retracting)return;c.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*10+'deg');
      c.style.setProperty('--rx',(-((e.clientY-r.top)/r.height-.5)*10)+'deg');
    });
  },{passive:true});

  addEventListener('popstate',function(){show(location.pathname,'none');});
  setActive(current);
})();
