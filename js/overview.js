window.initOverview=function(){
(function(){
  var cache={};
  var chev='<svg class="ov-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>';
  var links=[].slice.call(document.querySelectorAll('.item a')).filter(function(a){
    return !a.classList.contains('overview-toggle')&&/overview/i.test(a.textContent)&&a.getAttribute('href');
  });
  links.forEach(function(a,n){
    var href=a.href,meta=a.closest('.meta')||a.parentNode;
    var id='overview-panel-'+n;
    a.classList.add('overview-toggle');
    a.setAttribute('role','button');
    a.setAttribute('aria-expanded','false');
    a.setAttribute('aria-controls',id);
    a.innerHTML='<span class="ov-label">' + (/hide/i.test(a.textContent) ? 'Hide Overview' : 'Show Overview') + '</span>' + chev;
    var panel=document.createElement('div');
    panel.className='overview-panel';
    panel.id=id;
    panel.innerHTML='<div class="overview-clip"><div class="overview-inner"></div></div>';
    meta.parentNode.insertBefore(panel,meta.nextSibling);
    var inner=panel.querySelector('.overview-inner'),loaded=false;
    var warm=function(){load().catch(function(){});};
    a.addEventListener('mouseenter',warm,{once:true});
    a.addEventListener('touchstart',warm,{once:true,passive:true});
    a.addEventListener('focus',warm,{once:true});

    function load(){
      var t=document.getElementById(a.getAttribute('href').slice(1));
      if(!t)return Promise.reject(new Error('missing'));
      var art=document.createElement('article');
      art.appendChild(t.content.cloneNode(true));
      return Promise.resolve(art);
    }

    function setOpen(open){
      a.setAttribute('aria-expanded',open?'true':'false');
      a.querySelector('.ov-label').textContent=open?'Hide Overview':'Show Overview';
      panel.classList.toggle('open',open);
    }

    a.addEventListener('click',function(e){
      if(e.metaKey||e.ctrlKey||e.shiftKey||e.button!==0)return;
      e.preventDefault();
      if(panel.classList.contains('open')){setOpen(false);return;}
      if(loaded){setOpen(true);return;}
      a.classList.add('loading');
      load().then(function(art){
        inner.appendChild(art);
        [].slice.call(art.querySelectorAll('.facts, .outcomes li, section, p, h2, h3')).forEach(function(el,i){el.style.setProperty('--i',i);el.classList.add('ov-item');});
        loaded=true;
        a.classList.remove('loading');
        requestAnimationFrame(function(){requestAnimationFrame(function(){setOpen(true);});});
      }).catch(function(){window.location.href=href;});
    });
  });
})();
};
window.initOverview();
