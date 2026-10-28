(function(){
  var root=document.documentElement,els=document.querySelectorAll('.reveal');
  var main=document.getElementById('main');
  var initialView=main?main.innerHTML:'';
  var initialTitle=document.title;
  var navLinks=document.querySelectorAll('.side nav a');
  var loading=false;
  function showAll(){root.classList.remove('js');els.forEach(function(el){el.classList.add('in');});}
  try{
    if(root.classList.contains('js') && 'IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.05});
      els.forEach(function(el){io.observe(el);});
    }else{showAll();}
  }catch(err){showAll();}
  try{
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){navLinks.forEach(function(a){a.removeAttribute('aria-current');if(a.getAttribute('href')==='#'+e.target.id)a.setAttribute('aria-current','true');});}});},{rootMargin:'-40% 0px -55% 0px'});
    ['projects'].forEach(function(id){var s=document.getElementById(id);if(s)so.observe(s);});
  }catch(err){}
  try{
    var bar=document.querySelector('.progress'),ticking=false;
    var upd=function(){var h=root.scrollHeight-innerHeight;bar.style.transform='scaleX('+(h>0?scrollY/h:0)+')';ticking=false;};
    if(bar){addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(upd);}},{passive:true});upd();}
  }catch(err){}

  function setActive(path){
    navLinks.forEach(function(link){
      var href=link.getAttribute('href');
      link.removeAttribute('aria-current');
      if(href===path||((path==='/'||path==='/index.html')&&href==='#projects'))link.setAttribute('aria-current','true');
    });
  }

  function animatePanel(){
    var panel=main&&main.querySelector('article');
    if(!panel)return;
    panel.classList.remove('panel-enter');
    requestAnimationFrame(function(){panel.classList.add('panel-enter');});
  }

  function extractArticle(html){
    var doc=new DOMParser().parseFromString(html,'text/html');
    var article=doc.querySelector('main article');
    if(!article)throw new Error('The requested page did not include a content panel.');
    return {article:article,title:doc.title};
  }

  function loadView(path,replace){
    if(!main||loading)return;
    loading=true;
    main.setAttribute('aria-busy','true');
    fetch(path,{headers:{Accept:'text/html'}})
      .then(function(response){
        if(!response.ok)throw new Error('Could not load this page.');
        return response.text();
      })
      .then(function(html){
        var view=extractArticle(html);
        main.innerHTML=view.article.outerHTML;
        document.title=view.title;
        setActive(path);
        if(replace)history.replaceState({view:path},'',path);
        window.scrollTo(0,0);
        animatePanel();
      })
      .catch(function(){
        main.innerHTML='<article><h1>Unable to load this page</h1><p class="summary">Please try again, or open the page directly.</p></article>';
        setActive(path);
      })
      .finally(function(){
        loading=false;
        main.removeAttribute('aria-busy');
      });
  }

  function restoreHome(replace){
    if(!main||loading)return;
    main.innerHTML=initialView;
    main.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');});
    document.title=initialTitle;
    setActive('/');
    if(replace)history.replaceState({view:'/'},'', '/');
    window.scrollTo(0,0);
    animatePanel();
  }

  navLinks.forEach(function(link){
    link.addEventListener('click',function(event){
      var path=link.getAttribute('href');
      if(!path||path.charAt(0)==='#'||path.indexOf('://')!==-1)return;
      if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      event.preventDefault();
      if(path==='/'||path==='/index.html'){
        history.pushState({view:'/'},'', '/');
        restoreHome(false);
      }else{
        history.pushState({view:path},'',path);
        loadView(path,false);
      }
    });
  });

  addEventListener('popstate',function(){
    if(location.pathname==='/'||location.pathname==='/index.html')restoreHome(false);
    else loadView(location.pathname,false);
  });

  setActive(location.pathname);
})();
