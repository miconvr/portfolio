(function(){
  var items=[].slice.call(document.querySelectorAll('.home .item'));
  if(items.length<2)return;
  var reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  var rail=document.createElement('nav');
  rail.className='rail';
  rail.setAttribute('aria-label','Projects');
  var track=document.createElement('div');
  track.className='rail-track';
  var fill=document.createElement('div');
  fill.className='rail-fill';
  track.appendChild(fill);
  rail.appendChild(track);
  var list=document.createElement('ul');

  var btns=items.map(function(it,i){
    var li=document.createElement('li');
    var b=document.createElement('button');
    b.type='button';
    var h=it.querySelector('h3');
    var name=(h&&h.firstChild&&h.firstChild.textContent.trim())||('Project '+(i+1));
    b.setAttribute('aria-label',name);
    b.title=name;
    var logo=it.querySelector('.item-head svg,.item-head img');
    if(logo){
      var c=logo.cloneNode(true);
      c.removeAttribute('id');
      c.removeAttribute('loading');
      c.setAttribute('aria-hidden','true');
      if(c.tagName.toLowerCase()==='img')c.setAttribute('alt','');
      b.appendChild(c);
    }else{
      b.textContent=String(i+1);
    }
    b.addEventListener('click',function(){
      it.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});
    });
    li.appendChild(b);
    list.appendChild(li);
    return b;
  });
  rail.appendChild(list);
  document.body.appendChild(rail);

  var ticking=false;
  function clamp(n){return Math.max(0,Math.min(1,n));}
  function update(){
    ticking=false;
    var vh=window.innerHeight,mid=vh/2,best=0,bd=Infinity;
    items.forEach(function(it,i){
      var r=it.getBoundingClientRect();
      var d=Math.abs((r.top+r.bottom)/2-mid);
      if(d<bd){bd=d;best=i;}
    });
    btns.forEach(function(b,i){
      b.classList.toggle('on',i===best);
      if(i===best)b.setAttribute('aria-current','true');
      else b.removeAttribute('aria-current');
    });
    var first=items[0].getBoundingClientRect();
    var last=items[items.length-1].getBoundingClientRect();
    fill.style.transform='scaleY('+clamp((mid-first.top)/(last.bottom-first.top))+')';
    rail.classList.toggle('show',first.top<vh*0.75&&last.bottom>vh*0.25);
  }
  function onScroll(){
    if(!ticking){ticking=true;requestAnimationFrame(update);}
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
  update();
})();
